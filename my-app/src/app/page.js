export default function Home() {
  return (
    <div className="space-y-24 bg-black">
      <section className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text gradient-flow">
            AI Symptom to Disease Predictor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Describe your symptoms in natural language and get AI-assisted guidance. Fast, simple, and designed for clarity. Not a substitute for professional medical advice.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="/chatbot" className="rounded-full bg-[#0fd4c3]/90 text-black px-6 py-3 text-sm font-semibold hover:bg-[#0f766e] transition-colors shadow">
              Start Diagnosis
            </a>
            <a href="/contact" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-[#0fd4c3]/90 hover:bg-white/10 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-3">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#0fd4c3]/90">Input Symptoms</h3>
              <p className="mt-2 text-sm text-zinc-400">Type a short description like “fever, headache, body ache for 2 days”.</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#0fd4c3]/90">Model Analysis</h3>
              <p className="mt-2 text-sm text-zinc-400">BioBERT processes your text and predicts a likely condition with confidence.</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#0fd4c3]/90">Clear Guidance</h3>
              <p className="mt-2 text-sm text-zinc-400">Get a plain-language explanation and next-step suggestions.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#0fd4c3]/90 mb-6">Key Features</h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-zinc-400">Fast AI inferences powered by a dedicated service.</p>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-zinc-400">Human-friendly explanations for every prediction.</p>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-zinc-400">Responsive UI with smooth transitions and dark theme.</p>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-zinc-400">Privacy-first: we only analyze the text you provide.</p>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-zinc-400">Accessible design and keyboard-friendly interactions.</p>
            </div>
            <div className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <p className="text-sm text-zinc-400">Built on Next.js and Tailwind CSS for performance.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass rounded-3xl p-8 text-center">
            <h3 className="text-xl font-semibold text-[#0fd4c3]/90">Start your health check now</h3>
            <p className="mt-2 text-sm text-zinc-400">It takes less than a minute to describe your symptoms.</p>
            <div className="mt-6">
              <a href="/chatbot" className="rounded-full bg-[#0f766e]/90 text-black px-6 py-3 text-sm font-semibold hover:bg-[#0f766e] transition-colors shadow">
                Open Chat
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
