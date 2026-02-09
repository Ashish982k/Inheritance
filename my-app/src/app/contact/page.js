"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // "", "sending", "success", "error"

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would typically call your API:
      // const response = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <section className="w-full px-4 py-8">
      {/* Centered glass card */}
      <div className="mx-auto max-w-3xl">
        <div className="glass rounded-3xl p-6 sm:p-8 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              <span className="gradient-flow bg-clip-text text-transparent">Contact Us</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Questions, feedback, or support — we'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="peer w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-accent-bright/60 focus:ring-2 focus:ring-accent-bright/30 transition-all"
              />
              <label
                htmlFor="name"
                className="pointer-events-none absolute left-4 -top-2.5 bg-background px-1 text-xs text-accent-bright/80 transition-all"
              >
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="peer w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-accent-bright/60 focus:ring-2 focus:ring-accent-bright/30 transition-all"
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute left-4 -top-2.5 bg-background px-1 text-xs text-accent-bright/80 transition-all"
              >
                Email
              </label>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="How can we help?"
                className="peer w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-accent-bright/60 focus:ring-2 focus:ring-accent-bright/30 resize-none transition-all"
              />
              <label
                htmlFor="message"
                className="pointer-events-none absolute left-4 -top-2.5 bg-background px-1 text-xs text-accent-bright/80 transition-all"
              >
                Message
              </label>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 px-4 py-3 text-sm text-accent-emerald animate-slide-up">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 animate-slide-up">
                ✗ Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-accent-bright/90 px-6 py-3 text-sm font-semibold text-black hover:bg-accent-bright-hover transition-all shadow-lg hover:shadow-accent-bright/30 disabled:opacity-60 disabled:cursor-not-allowed btn-press"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-zinc-500">
            <p>
              We typically reply within 1–2 business days. For urgent issues, email{" "}
              <a
                href="mailto:support@example.com"
                className="text-accent-bright/80 hover:text-accent-bright underline transition-colors"
              >
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
