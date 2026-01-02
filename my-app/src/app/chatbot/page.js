"use client";
import { useState } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);

    // Demo echo response; replace with API call if needed.
    await new Promise((r) => setTimeout(r, 500));
    setMessages((cur) => [
      ...cur,
      { role: "assistant", content: `You said: ${text}` },
    ]);
    setBusy(false);
  }

  return (
    <section className="flex h-[calc(100dvh-4rem)] w-full flex-col bg-black">
      <div className="w-full h-full flex-1 p-4 sm:p-6">
        <div className="flex h-full flex-col rounded-xl border border-white/10 bg-zinc-900/40">
          <div className="border-b border-white/10 p-3 text-sm font-medium text-zinc-200">Chatbot</div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-lg bg-zinc-800 px-4 py-2 text-zinc-100"
                    : "mr-auto max-w-[80%] rounded-lg bg-zinc-700 px-4 py-2 text-zinc-100"
                }
              >
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-black hover:bg-white disabled:opacity-50"
            >
              {busy ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
