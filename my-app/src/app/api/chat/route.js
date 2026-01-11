import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message } = await req.json();

    console.log("User message:", message);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


    const intentPrompt = `
Classify the following message strictly as either:

SYMPTOM
CHAT

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


    const result = await fetch(
      "https://biobert-api-630237788367.asia-south1.run.app/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }), 
      }
    );

    const response = await result.json();

    console.log("ML response:", response);

    const disease = response.predicted_disease;
    const confidence = response.confidence_score;
    const confidencePercent = (confidence * 100).toFixed(2);


    const prompt = `
You are a medical assistant chatbot.

ML Prediction:
Disease: ${disease}
Confidence: ${confidencePercent}%

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
      confidence: confidencePercent,
    });
  } catch (err) {
    console.error("CHAT API ERROR:", err);
    return NextResponse.json(
      { reply: "Server error occurred." },
      { status: 500 }
    );
  }
}
