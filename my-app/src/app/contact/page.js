export default function ContactPage() {
  return (
    <section className="w-full">
      {/* Centered glass card */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="glass rounded-3xl p-6 sm:p-8 mt-6 sm:mt-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">Contact Us</h1>
            <p className="mt-2 text-sm text-zinc-400">Questions, feedback, or support — we’d love to hear from you.</p>
          </div>

          <form className="space-y-6">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                id="name"
                placeholder="Your name"
                className="peer w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-zinc-100 placeholder-transparent outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30"
              />
              <label
                htmlFor="name"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 bg-transparent text-sm text-zinc-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-300 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs"
              >
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="peer w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-zinc-100 placeholder-transparent outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30"
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 bg-transparent text-sm text-zinc-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-300 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs"
              >
                Email
              </label>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="message"
                rows={5}
                placeholder="How can we help?"
                className="peer w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-zinc-100 placeholder-transparent outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30"
              />
              <label
                htmlFor="message"
                className="pointer-events-none absolute left-4 top-3 bg-transparent text-sm text-zinc-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-300 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs"
              >
                Message
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#0fd4c3]/90 px-6 py-3 text-sm font-semibold text-black hover:bg-[#0b998d]/90 transition-colors shadow"
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-zinc-500">
            <p>We typically reply within 1–2 business days. For urgent issues, email
              <a href="mailto:support@example.com" className="ml-1 text-zinc-300 underline">support@example.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
