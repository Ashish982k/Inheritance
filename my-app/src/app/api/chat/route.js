import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../../../auth";
import chatModel from "../../../database/chat.js";
import { connectDB } from "../../../database/db.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Basic API key validation at module load
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Gemini calls will fail.");
}

// Helper: translate assistant text back to the language of the original user message
async function translateBackToUserLanguage(model, originalMessage, assistantText) {
  const backPrompt = `Translate the following assistant reply into the SAME LANGUAGE as the ORIGINAL USER MESSAGE.\n\nRULES:\n- Output ONLY the translated reply text.\n- No explanations or extra text.\n\nORIGINAL USER MESSAGE:\n"""${originalMessage}"""\n\nASSISTANT REPLY (to translate):\n"""${assistantText}"""`;
  const backRes = await callModelWithRetry(model, backPrompt);
  return (backRes.response.text() || assistantText).trim();
}

// Retry helper with exponential backoff for Gemini calls
async function callModelWithRetry(model, input, { tries = 3, baseDelayMs = 500 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      if (Array.isArray(input)) {
        return await model.generateContent(input);
      } else {
        return await model.generateContent(input);
      }
    } catch (err) {
      lastErr = err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`Gemini call failed (attempt ${attempt}/${tries}). Retrying in ${delay}ms`, err?.message || err);
      if (attempt < tries) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

function normalizePredictions(list) {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .filter(Boolean)
    .map((p) => ({
      disease: typeof p?.disease === "string" ? p.disease.trim() : "",
      confidence: Math.max(0, Math.min(100, Number(p?.confidence) || 0)),
    }))
    .filter((p) => p.disease.length > 0)
    .slice(0, 3);
}

async function getGeminiPredictionsJSON(model, englishMessage) {
  const systemPrompt = `
You are a medical triage assistant.

IMPORTANT:
- Respond ONLY in valid JSON (no markdown, no extra text).
- Output confidence as a number from 0 to 100.
- Return EXACTLY 3 predictions.

JSON SCHEMA:
{
  "predictions": [
    { "disease": string, "confidence": number },
    { "disease": string, "confidence": number },
    { "disease": string, "confidence": number }
  ]
}
`;

  const userPrompt = `
User symptoms (English):
"""${englishMessage}"""

Return the top 3 most likely diseases with confidence.
`;

  const result = await callModelWithRetry(model, `${systemPrompt}\n\n${userPrompt}`);
  let text = (result.response.text() || "").trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  }
  return JSON.parse(text);
}

/* --------------------------------------------------
   Gemini helper: Precautions JSON (NEW SCHEMA)
-------------------------------------------------- */
async function getPrecautionsJSON(model, predictions) {
  const systemPrompt = `
You are a system that provides precautionary guidance.

IMPORTANT RULES:
1. You MUST respond ONLY in valid JSON.
2. Do NOT include explanations, markdown, or extra text outside JSON.
3. Do NOT add comments.
4. Do NOT include trailing commas.
5. If information is unknown, use null.
6. Follow the exact JSON schema below.

JSON SCHEMA:
{
  "disclaimer": string,
  "diseases": [
    {
      "name": string,
      "type": string | null,
      "common_symptoms": string[] | null,
      "precautions": string[] | null,
      "medical_attention_required": boolean | null
    }
  ]
}

OUTPUT INSTRUCTIONS:
- Include a concise, general-purpose medical disclaimer in "disclaimer".
- In "diseases", include EXACTLY the TOP 3 predicted diseases provided.
- The diseases array MUST contain exactly 3 objects (or fewer only if fewer predictions are provided).
- Each disease object's "name" MUST match one of the provided prediction disease names exactly.
- Do NOT include any additional diseases besides the provided prediction disease names.
- Each disease must list 3–6 common symptoms and 3–6 practical precautions.
- Use short, safety-focused sentences.
- Do not include medication names.
`;

  const list = Array.isArray(predictions) ? predictions.slice(0, 3) : [];
  const allowedNames = list.map((p) => p?.disease).filter(Boolean);
  const userPrompt = `
Top predicted diseases (use ONLY these disease names):
${JSON.stringify(list, null, 2)}

Return a JSON object following the exact schema above.
The diseases array MUST contain exactly ${allowedNames.length} object(s) and each object's name MUST be one of:
${allowedNames.map((n) => `- ${n}`).join("\n")}
`;

  const prompt = `${systemPrompt}\n\n${userPrompt}`;
  const result = await callModelWithRetry(model, prompt);
  let text = result.response.text().trim();
  // Handle possible code fences just in case
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  }
  return JSON.parse(text);
}

/* --------------------------------------------------
   POST Handler
-------------------------------------------------- */
export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("User message:", message);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    // Translate to English first (multilingual support)
    const translatePrompt = `Translate the following user message to natural English.\n\nRULES:\n- Output ONLY the translated text.\n- No explanations or extra text.\n\nMessage:\n"""${message}"""`;
    const translateResult = await callModelWithRetry(model, translatePrompt);
    const translated = (translateResult.response.text() || "").trim();
    const englishMessage = translated.length > 0 ? translated : message;
    console.log("Translated message (en):", englishMessage);

    // Detect original language (ISO 639-1 code). Default to 'en' on failure
    let origLang = 'en';
    try {
      const detectLangPrompt = `Detect the language of the following text and return ONLY the ISO 639-1 code (e.g., en, hi, es, fr). No extra text.\n\nText:\n"""${message}"""`;
      const langRes = await callModelWithRetry(model, detectLangPrompt);
      const code = (langRes.response.text() || '').trim().toLowerCase();
      if (/^[a-z]{2}$/.test(code)) origLang = code;
    } catch {}
    console.log("Original language code:", origLang);

    /* ---------- INTENT CLASSIFICATION ---------- */
    const intentPrompt = `
Classify the following message strictly as one word:

SYMPTOM
CHAT
HISTORY

Message: "${englishMessage}"
`;

    const intentResult = await callModelWithRetry(model, intentPrompt);
    const intent = intentResult.response.text().trim();
    console.log("Intent:", intent);

    /* ---------- NORMAL CHAT ---------- */
    if (intent === "CHAT") {
      const chatPrompt = `
You are a friendly medical assistant.
Reply politely and naturally.

User message:
"${englishMessage}"
`;
      const chatResult = await callModelWithRetry(model, chatPrompt);
      let chatReply = chatResult.response.text();
      chatReply = await translateBackToUserLanguage(model, message, chatReply);
      return NextResponse.json({
        reply: chatReply
      });
    }

    /* ---------- HISTORY QUERY ---------- */
    if (intent === "HISTORY") {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return NextResponse.json({
          reply: "No medical history found."
        });
      }

      try {
        await connectDB();
      } catch (e) {
        console.error("MongoDB connection failed (history request):", e);
        return NextResponse.json({
          reply: "Medical history is temporarily unavailable."
        });
      }

      const history = await chatModel.findOne(
        { userId },
        { messages: { $slice: -10 } }
      );

      if (!history || history.messages.length === 0) {
        return NextResponse.json({
          reply: "No medical history found."
        });
      }

      const last10 = history.messages || [];
      const historyText = last10
        .map((m, i) =>
          `${i + 1}. ${m.predictions
            .map(p => `${p.disease} (${p.confidence}%)`)
            .join(", ")}`
        )
        .join("\n");

      const historyPrompt = `
You are a medical assistant.

The following is verified medical history.

${historyText}

User question:
"${englishMessage}"

Answer only using this history.
If not available, clearly say so.
`;

      const historyResult = await callModelWithRetry(model, historyPrompt);
      let historyReply = historyResult.response.text();
      historyReply = await translateBackToUserLanguage(model, message, historyReply);

      // Return both the LLM summary and the raw last-10 history records
      return NextResponse.json({
        reply: historyReply,
        history: last10.map(m => ({
          text: m.text,
          predictions: m.predictions,
          createdAt: m.createdAt
        }))
      });
    }

    /* ---------- ML PREDICTION ---------- */
    const mlRes = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: englishMessage })
    });

    const mlData = await mlRes.json();
    console.log("ML response:", mlData);

    /*
      Expected ML format:
      {
        predictions: [
          { disease: "", confidence: number },
          { disease: "", confidence: number },
          { disease: "", confidence: number }
        ],
        inputs: ""
      }
    */

    // Normalize ML response shape.
    // Supported formats:
    // - { predictions: [{ disease, confidence }, ...] }
    // - { top3: [{ disease, confidence }, ...], disease, confidence }
    // - { disease, confidence, top3 }
    const mlPredictionsRaw =
      (Array.isArray(mlData?.predictions) && mlData.predictions) ||
      (Array.isArray(mlData?.top3) && mlData.top3) ||
      (mlData?.disease ? [{ disease: mlData.disease, confidence: mlData.confidence }] : []);

    const mlTop3 = normalizePredictions(mlPredictionsRaw);
    console.log("ML Top3 predictions:", mlTop3);

    /* ---------- GEMINI PREDICTION (JSON) ---------- */
    let geminiTop3 = [];
    try {
      const geminiPred = await getGeminiPredictionsJSON(model, englishMessage);
      geminiTop3 = normalizePredictions(geminiPred?.predictions);
    } catch (e) {
      console.warn("Gemini predictions failed; falling back to ML.", e?.message || e);
      geminiTop3 = [];
    }
    console.log("Gemini Top3 predictions:", geminiTop3);

    const mlTop1 = mlTop3?.[0]?.confidence ?? 0;
    const gemTop1 = geminiTop3?.[0]?.confidence ?? 0;

    const chosenSource = gemTop1 > mlTop1 ? "gemini" : "ml";
    const top3 = (chosenSource === "gemini" && geminiTop3.length > 0) ? geminiTop3 : mlTop3;
    console.log("Chosen source:", chosenSource, "Top3:", top3);

    /* ---------- SAVE HISTORY ---------- */
    const session = await auth();
    const userId = session?.user?.id;

    if (userId && top3.length > 0) {
      try {
        await connectDB();
        await chatModel.updateOne(
          { userId },
          {
            $push: {
              messages: {
                text: englishMessage,
                predictions: top3,
                createdAt: new Date()
              }
            }
          },
          { upsert: true }
        );
      } catch (e) {
        console.error("MongoDB write failed (save history):", e);
      }
    }

    /* ---------- PRECAUTIONS JSON ---------- */
    let precautions = top3.length > 0 ? await getPrecautionsJSON(model, top3) : null;
    // Localize precautions JSON values to the same language as the user's original message
    try {
      const precTranslatePrompt = `Translate the following JSON VALUES into the SAME LANGUAGE as the ORIGINAL USER MESSAGE.\n\nRULES:\n- Output ONLY valid JSON.\n- Preserve keys and structure EXACTLY.\n- Translate only string values.\n\nORIGINAL USER MESSAGE:\n"""${message}"""\n\nJSON:\n\n${JSON.stringify(precautions)}`;
      const precRes = await callModelWithRetry(model, precTranslatePrompt);
      let precText = (precRes.response.text() || '').trim();
      if (precText.startsWith('```')) {
        precText = precText.replace(/^```(?:json)?/i, '').replace(/```\s*$/i, '').trim();
      }
      const localized = JSON.parse(precText);
      if (localized && typeof localized === 'object' && 'diseases' in localized) {
        precautions = localized;
      }
    } catch (e) {
      console.warn('Precautions localization failed, using English.', e?.message || e);
    }
    console.log("Precautions JSON:", precautions);

    /* ---------- USER FRIENDLY SUMMARY ---------- */
    const summaryPrompt = `
You are a medical assistant.

The user's symptoms text (English):
"""${englishMessage}"""

Predicted conditions (name and confidence):
${top3
      .map((p, i) => `${i + 1}. ${p.disease} (${Math.round(Number(p.confidence) || 0)}%)`)
      .join("\n")}

Write a helpful response that is consistent with the predicted conditions above.

Rules:
- Short paragraphs
- Simple language
- No markdown
- Friendly tone
- End with a medical disclaimer
`;

    const summaryResult = await callModelWithRetry(model, summaryPrompt);
    let summaryReply = summaryResult.response.text();
    summaryReply = await translateBackToUserLanguage(model, message, summaryReply);
    console.log("Summary reply:", summaryReply);

    /* ---------- LAST 10 PREDICTIONS REPORT ---------- */
    let historyReport = null;
    try {
      await connectDB();
      const session2 = await auth();
      const userId2 = session2?.user?.id;
      if (userId2) {
        const history10 = await chatModel.findOne(
          { userId: userId2 },
          { messages: { $slice: -10 } }
        );
        if (history10 && Array.isArray(history10.messages)) {
          const flat = history10.messages
            .flatMap(m => Array.isArray(m.predictions) ? m.predictions : [])
            .map(p => ({ disease: p.disease, confidence: Number(p.confidence) || 0 }));
          const agg = {};
          for (const p of flat) {
            const key = p.disease || "Unknown";
            if (!agg[key]) agg[key] = { disease: key, count: 0, maxConfidence: 0 };
            agg[key].count += 1;
            if (p.confidence > agg[key].maxConfidence) agg[key].maxConfidence = p.confidence;
          }
          historyReport = Object.values(agg)
            .sort((a, b) => b.count - a.count || b.maxConfidence - a.maxConfidence)
            .slice(0, 10);
        }
      }
    } catch (e) {
      console.warn("Failed to build last-10 predictions report:", e?.message || e);
    }

    /* ---------- FINAL RESPONSE ---------- */
    return NextResponse.json({
      reply: summaryReply,
      predictions: top3,
      precautions,
      historyReport,
      source: chosenSource
    });

  } catch (err) {
    console.error("CHAT API ERROR:", err);
    const message = (err && err.message) ? err.message : "Unknown error";
    return NextResponse.json(
      { reply: `Server error occurred: ${message}` },
      { status: 500 }
    );
  }
}
