export default function ContactPage() {
  return (
    <section className="w-full">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 rounded-xl border border-white/10 bg-zinc-900/40 p-6 sm:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-zinc-100">Contact Us</h1>
          <p className="text-zinc-300">
            Have questions about AI-Symptom or need support? Send us a message and we’ll get back to you.
          </p>
          <div className="space-y-3 text-sm text-zinc-300">
            <p>
              Email:
              <a href="mailto:support@example.com" className="ml-2 text-white underline">
                support@example.com
              </a>
            </p>
            <p>
              Twitter:
              <a href="https://x.com" target="_blank" rel="noreferrer" className="ml-2 text-white underline">
                @ai-symptom
              </a>
            </p>
            <p className="text-zinc-400">Response time: within 1–2 business days</p>
          </div>
        </div>
        <form className="space-y-3">
          <div className="space-y-1">
            <label className="block text-sm text-zinc-300">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-zinc-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-zinc-300">Message</label>
            <textarea
              rows={5}
              placeholder="How can we help?"
              className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-black hover:bg-white"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
