"use client";

import { useState } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your assistant. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSend(e) {
    e.preventDefault();

    const text = input.trim();
    if (!text || busy) return;

    setMessages((cur) => [...cur, { role: "user", content: text }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: data.reply,
          disease: data.disease,
          confidence: data.confidence,
        },
      ]);
    } catch (err) {
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }

    setBusy(false);
  }

  return (
    <section className="flex h-[calc(100dvh-4rem)] w-full flex-col bg-black">
      <div className="w-full h-full flex-1 p-4 sm:p-6">
        <div className="mx-auto h-full w-full max-w-5xl glass rounded-3xl flex flex-col shadow-[0_0_28px_rgba(15,118,110,0.12)]">
          <div className="border-b border-white/10 p-4 text-sm font-semibold text-zinc-200">
            <span className="bg-clip-text text-transparent gradient-flow">Medical AI Assistant</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-3xl glass px-4 py-3 text-zinc-100 ring-1 ring-emerald-400/20"
                    : "mr-auto max-w-[80%] rounded-3xl glass px-4 py-3 text-zinc-100"
                }
              >
                {/* Assistant structured output */}
                {m.role === "assistant" && m.disease && m.confidence && (
                  <div className="font-bold mb-2 mt-2">
                    Disease: {m.disease} <br />
                    Confidence: {m.confidence}%
                  </div>
                )}

                <p className="text-sm leading-relaxed">{m.content}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 border-t border-white/10 p-3 sticky bottom-0 bg-transparent"
          >
            <div className="flex-1 glass rounded-3xl p-2.5 focus-within:ring-2 focus-within:ring-emerald-400/40">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms..."
                className="w-full bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500 text-base"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-press rounded-full bg-emerald-400/90 hover:bg-emerald-400 text-black px-5 py-2.5 text-sm font-semibold shadow-[0_0_24px_rgba(52,211,153,0.35)] disabled:opacity-50"
            >
              {busy ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
