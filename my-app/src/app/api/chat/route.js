import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "../../../auth";
import chatModel from "../../../database/chat.js";
import { connectDB } from "../../../database/db.js";
import { connect } from "node:http2";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { message } = await req.json();

    console.log("User message:", message);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const intentPrompt = `
Classify the following message strictly as either:

SYMPTOM
CHAT
HISTORY

Message: "${message}"

Reply with only one word.
`;

    const intentResult = await model.generateContent(intentPrompt);
    const intent = intentResult.response.text().trim();

    if (intent === "CHAT") {
      const chatPrompt = `
You are a friendly medical assistant chatbot.
Reply naturally and politely to this message:

"${message}"
`;

      const chatResult = await model.generateContent(chatPrompt);
      const reply = chatResult.response.text();

      return NextResponse.json({ reply });
    }

    if (intent === "HISTORY") {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return NextResponse.json({ messages: [] });
      }

      const history = await chatModel.findOne(
        { userId },
        { messages: { $slice: -10 } }
      );

      const last = history?.messages?.[0];
      if (!last) {
        return NextResponse.json({
          reply: "No medical history found.",
        });
      }
      
      const historyText = history.messages.map(
          (m, i) =>
            `${i + 1}. Disease: ${m.disease}, Confidence: ${m.confidence}%`
        )
        .join("\n");
      const prompt = `
You are a medical assistant chatbot.

The following is the user's verified medical history retrieved from the system database.
You ARE allowed to use it to answer the user.
-Do NOT use **, ###, --- or bullet symbols.

Disease history:
${historyText}

User question:
"${message}"

Answer only using this history.
If the history does not contain the answer, say so clearly.
Do NOT say you don't have access to records.
`;
      const historyResult = await model.generateContent(prompt);
      const reply = historyResult.response.text();
      return NextResponse.json({ reply });
    }

    const result = await fetch(
    "http://localhost:8000/predict",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    }
  );

    const response = await result.json();
    const session = await auth();
    const userId = session?.user?.id;

    console.log("ML response:", response);

    const disease = response.disease;
    const confidence = response.confidence;
   

    if (userId && disease && confidence !== undefined) {
      const text = response.inputs;

      await chatModel.updateOne(
        { userId },
        {
          $push: {
            messages: {
              text,
              disease,
              confidence: parseFloat(confidence.toFixed(4)),
            },
          },
        },
        { upsert: true }
      );
    }
    const prompt = `
You are a medical assistant chatbot.

ML Prediction:
Disease: ${disease}
Confidence: ${confidence}%

Rules:
- Write in short paragraphs.
- Do NOT use markdown.
- Do NOT use **, ###, --- or bullet symbols.
- Use simple sentences.
- Keep it friendly and professional.
- End with a short medical disclaimer.

Now respond to the user.
`;

    const resultGemini = await model.generateContent(prompt);
    const reply = resultGemini.response.text();

    return NextResponse.json({
      reply,
      disease,
      confidence,
    });
  } catch (err) {
    console.error("CHAT API ERROR:", err);
    return NextResponse.json(
      { reply: "Server error occurred." },
      { status: 500 }
    );
  }
}
