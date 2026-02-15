"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your assistant. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  async function downscaleImage(file, { maxSize = 768, quality = 0.8 } = {}) {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) {
        URL.revokeObjectURL(objectUrl);
        return file;
      }

      const scale = Math.min(1, maxSize / Math.max(w, h));
      if (scale >= 1) {
        URL.revokeObjectURL(objectUrl);
        return file;
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return file;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
      if (!blob) return file;

      const name = (file.name || "upload").replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], name, { type: "image/jpeg" });
    } catch {
      return file;
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    recognitionRef.current = rec;
    return () => {
      try {
        rec.onstart = null;
        rec.onend = null;
        rec.onerror = null;
        rec.onresult = null;
        rec.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  async function sendText(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || busy) return;

    setMessages((cur) => [...cur, { role: "user", content: trimmed }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      const top1 = Array.isArray(data?.predictions) && data.predictions.length > 0 ? data.predictions[0] : null;

      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: data.reply,
          disease: top1?.disease,
          confidence: top1?.confidence,
          predictions: data?.predictions,
          precautions: data?.precautions,
          historyReport: data?.historyReport,
          history: data?.history,
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

  async function handleSend(e) {
    e.preventDefault();
    await sendText(input);
  }

  async function toggleVoice() {
    if (!voiceSupported || busy) return;
    const rec = recognitionRef.current;
    if (!rec) return;

    if (listening) {
      try {
        rec.stop();
      } catch {}
      return;
    }

    let finalText = "";
    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      const combined = (finalText + interim).trim();
      if (combined) setInput(combined);
    };

    rec.onend = async () => {
      setListening(false);
      const text = (finalText || input || "").trim();
      if (text) {
        await sendText(text);
      }
    };

    try {
      rec.start();
    } catch (e) {
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: "Voice input failed to start. Please try again." },
      ]);
    }
  }

  async function handleImageUpload(file) {
    if (!file || busy) return;
    setBusy(true);

    setMessages((cur) => [
      ...cur,
      { role: "user", content: `Uploaded image: ${file.name || "image"}` },
      { role: "assistant", content: "Uploading image..." },
    ]);

    try {
      const optimized = await downscaleImage(file);
      const form = new FormData();
      form.append("file", optimized);

      const res = await fetch("/api/predict-image", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "API error");

      const preds = Array.isArray(data?.predictions) ? data.predictions : [];
      const top1 = preds.length > 0 ? preds[0] : null;
      const label = top1?.disease ? `Predicted disease from image: ${top1.disease}` : "Image prediction completed.";

      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: label,
          disease: top1?.disease,
          confidence: top1?.confidence,
          predictions: preds,
        },
      ]);
    } catch (err) {
      const msg = err?.message ? String(err.message) : "Image upload failed. Please try again.";
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content: msg,
        },
      ]);
    }

    setBusy(false);
  }

  return (
    <section className="relative min-h-[calc(100dvh-6rem)] w-full flex flex-col">
      {/* Ambient background layers */}
      <div className="noise-overlay" />
      <div className="bg-grid" />

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4">
          <div className="relative overflow-hidden glass card rounded-[24px] px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide text-white">
                  <span className="gradient-flow bg-clip-text text-transparent">
                    AI Health Prediction System
                  </span>
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-zinc-300">Early insights. Smarter care.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Panel */}
        <div className="px-4 sm:px-6 pb-6 flex-1 flex flex-col min-h-0">
          <div className="mt-6 glass card rounded-[24px] flex-1 flex flex-col min-h-0">
            <div className="border-b border-white/10 p-4 text-sm font-medium text-zinc-200">
              Medical Chatbot
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28">
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl bg-gradient-to-br from-cyan-400/15 to-emerald-400/10 border border-white/10 px-4 py-3 text-zinc-50 shadow-[0_10px_30px_rgba(0,0,0,0.35)] animate-slide-up"
                        : "mr-auto max-w-[85%] rounded-2xl glass px-4 py-3 text-zinc-100 animate-slide-up"
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

                    {/* Prediction Results: Top 3 with circular progress rings */}
                    {m.role === "assistant" &&
                      Array.isArray(m.predictions) &&
                      m.predictions.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-zinc-200 mb-2">
                            Prediction Results
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {m.predictions.slice(0, 3).map((p, idx) => {
                              const pct = Math.max(
                                0,
                                Math.min(100, Math.round(Number(p.confidence) || 0))
                              );
                              return (
                                <div
                                  key={idx}
                                  className="glass-strong rounded-2xl p-3 flex items-center gap-3"
                                >
                                  <div className="ring" style={{ "--p": pct }} data-p={pct}>
                                    <div className="ring-label">{pct}%</div>
                                  </div>
                                  <div>
                                    <div className="text-zinc-100 font-semibold text-sm">
                                      {p.disease}
                                    </div>
                                    <div className="text-xs text-zinc-400">Confidence</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {m.role === "assistant" && m.precautions?.diseases && (
                      <div className="mt-3 text-sm">
                        <div className="font-semibold mb-1">🩺 Medical Assistant</div>
                        <div className="text-zinc-300 mb-2">
                          Based on common symptoms, here are some possible conditions and
                          precautions. This is not a diagnosis.
                        </div>
                        <div className="space-y-3">
                          {m.precautions.diseases.map((d, idx) => {
                            const syms = Array.isArray(d.common_symptoms)
                              ? d.common_symptoms.slice(0, 3)
                              : [];
                            const precs = Array.isArray(d.precautions)
                              ? d.precautions.slice(0, 3)
                              : [];
                            const pred = Array.isArray(m.predictions)
                              ? m.predictions.find((p) => p.disease === d.name)
                              : null;
                            const confidence = pred ? Math.round(Number(pred.confidence)) : null;
                            return (
                              <div
                                key={idx}
                                className="rounded-lg bg-zinc-800/50 border border-white/10 p-3"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-zinc-100">{d.name}</span>
                                  {confidence !== null && (
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${
                                        confidence < 70
                                          ? "bg-blue-200 text-blue-900"
                                          : confidence < 85
                                          ? "bg-green-200 text-green-900"
                                          : "bg-emerald-300 text-emerald-900"
                                      }`}
                                    >
                                      Confidence: {confidence}%
                                    </span>
                                  )}
                                </div>
                                {syms.length > 0 && (
                                  <div className="mt-1">
                                    <strong className="text-zinc-200">Symptoms</strong>
                                    <ul className="list-disc pl-5 mt-1 text-zinc-200">
                                      {syms.map((s, i) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {precs.length > 0 && (
                                  <div className="mt-2">
                                    <strong className="text-zinc-200">Precautions</strong>
                                    <ul className="list-disc pl-5 mt-1 text-zinc-200">
                                      {precs.map((p, i) => (
                                        <li key={i}>{p}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {m.precautions.disclaimer && (
                          <div className="text-xs text-zinc-300 mt-2">
                            {m.precautions.disclaimer}
                          </div>
                        )}
                      </div>
                    )}

                    {m.role === "assistant" &&
                      Array.isArray(m.historyReport) &&
                      m.historyReport.length > 0 && (
                        <div className="mt-3 text-sm">
                          <div className="font-semibold mb-1">Last 10 predictions</div>
                          <ul className="space-y-1">
                            {m.historyReport.map((r, i) => (
                              <li
                                key={i}
                                className="flex items-center justify-between bg-zinc-800/40 rounded-md px-3 py-1.5"
                              >
                                <span className="text-zinc-100">{r.disease}</span>
                                <span className="text-xs text-zinc-300">
                                  {r.count}x · max {Math.round(r.maxConfidence)}%
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {m.role === "assistant" &&
                      Array.isArray(m.history) &&
                      m.history.length > 0 && (
                        <div className="mt-3 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold mb-1">Medical History (Last 10)</div>
                            <a
                              href="/api/history/pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs rounded-md bg-[#0fd4c3]/90 px-3 py-1 text-black hover:bg-[#0fd4c3]"
                            >
                              Download PDF
                            </a>
                          </div>
                          <ul className="space-y-1">
                            {m.history.map((h, i) => (
                              <li key={i} className="bg-zinc-800/40 rounded-md px-3 py-1.5">
                                <div className="text-zinc-300 text-xs mb-1">
                                  {h.createdAt ? new Date(h.createdAt).toLocaleString() : ""}
                                </div>
                                <div className="text-zinc-100">
                                  {Array.isArray(h.predictions) && h.predictions.length > 0
                                    ? h.predictions.map((p, idx) => (
                                        <span key={idx} className="mr-2">
                                          {p.disease} ({Math.round(Number(p.confidence) || 0)}%)
                                        </span>
                                      ))
                                    : "(no predictions)"}
                                </div>
                                {h.text && (
                                  <div className="text-zinc-200 text-xs mt-1">
                                    Input: {h.text}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-white/10 p-3 sm:p-4 bg-[rgba(11,16,32,0.65)] backdrop-blur-xl">
              <form onSubmit={handleSend} className="flex flex-wrap sm:flex-nowrap items-end gap-2 sm:gap-3">
                <div className="flex-1 min-w-full sm:min-w-0 glass-strong rounded-2xl px-3 py-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-zinc-400" aria-hidden="true">📝</span>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder="Describe your symptoms..."
                      rows={1}
                      className="w-full resize-none bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500 text-sm sm:text-base leading-relaxed"
                      aria-label="Symptom description input"
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-xs text-zinc-400">
                      Enter to send · Shift+Enter for new line
                    </div>
                    <button
                      type="button"
                      onClick={toggleVoice}
                      disabled={busy || !voiceSupported}
                      className="text-zinc-300/80 disabled:opacity-50 hover:text-accent-bright transition-colors p-1"
                      aria-label={
                        voiceSupported
                          ? listening
                            ? "Stop voice input"
                            : "Start voice input"
                          : "Voice input not supported"
                      }
                    >
                      {listening ? "⏹" : "🎙"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      handleImageUpload(file);
                    }}
                    aria-label="Upload image file"
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-press flex-1 sm:flex-none h-[44px] rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-100 px-4 text-sm font-semibold border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    aria-label="Upload image"
                  >
                    <span aria-hidden="true">📷</span>
                    <span className="ml-2 sm:hidden">Image</span>
                  </button>
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    className="btn-press flex-1 sm:flex-none h-[44px] rounded-2xl bg-accent-bright/90 hover:bg-accent-bright text-black px-5 text-sm font-semibold shadow-lg hover:shadow-accent-bright/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    aria-label="Send message"
                  >
                    {busy ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
