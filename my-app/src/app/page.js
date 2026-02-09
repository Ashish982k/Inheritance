export default function Home() {
  return (
    <div className="space-y-20 sm:space-y-24 px-4 py-8">
      {/* Hero Section */}
      <section className="pt-6 sm:pt-10 animate-fade-in">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text gradient-flow animate-slide-up">
            AI Symptom to Disease Predictor
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-300 sm:text-lg leading-relaxed">
            Describe your symptoms in natural language and get AI-assisted guidance. Fast, simple, and designed for clarity.
            <span className="block mt-2 text-sm text-zinc-400">Not a substitute for professional medical advice.</span>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="/chatbot"
              className="w-full sm:w-auto rounded-full bg-accent-bright/90 text-black px-8 py-3.5 text-sm font-semibold hover:bg-accent-bright hover:shadow-lg hover:shadow-accent-bright/30 transition-all btn-press"
            >
              Start Diagnosis
            </a>
            <a
              href="/contact"
              className="w-full sm:w-auto rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-accent-bright/90 hover:bg-white/10 hover:border-accent-bright/40 transition-all btn-press"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="animate-slide-up">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            <span className="gradient-flow bg-clip-text text-transparent">How It Works</span>
          </h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bright/20 text-accent-bright mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-accent-bright mb-2">Input Symptoms</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Type a short description like "fever, headache, body ache for 2 days".
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bright/20 text-accent-bright mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-accent-bright mb-2">Model Analysis</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                AI processes your text and predicts a likely condition with confidence scores.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-bright/20 text-accent-bright mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-accent-bright mb-2">Clear Guidance</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Get a plain-language explanation and next-step suggestions for your health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            <span className="gradient-flow bg-clip-text text-transparent">Key Features</span>
          </h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="text-accent-bright mb-3 text-2xl">⚡</div>
              <h4 className="text-base font-semibold text-zinc-100 mb-2">Fast AI Inference</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Powered by a dedicated AI service for instant predictions.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="text-accent-bright mb-3 text-2xl">💬</div>
              <h4 className="text-base font-semibold text-zinc-100 mb-2">Human-Friendly</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Clear explanations for every prediction, no medical jargon.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="text-accent-bright mb-3 text-2xl">🎨</div>
              <h4 className="text-base font-semibold text-zinc-100 mb-2">Beautiful Design</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Responsive UI with smooth transitions and modern dark theme.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="text-accent-bright mb-3 text-2xl">🔒</div>
              <h4 className="text-base font-semibold text-zinc-100 mb-2">Privacy First</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We only analyze the text you provide, nothing else is stored.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="text-accent-bright mb-3 text-2xl">♿</div>
              <h4 className="text-base font-semibold text-zinc-100 mb-2">Accessible</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Keyboard-friendly interactions and screen reader support.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift hover:shadow-lg transition-all">
              <div className="text-accent-bright mb-3 text-2xl">🚀</div>
              <h4 className="text-base font-semibold text-zinc-100 mb-2">High Performance</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Built on Next.js and Tailwind CSS for blazing speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-8 sm:pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-3xl p-8 sm:p-10 text-center hover-lift transition-all">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              Start Your Health Check Now
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              It takes less than a minute to describe your symptoms and get AI-powered insights.
            </p>
            <div className="mt-6 sm:mt-8">
              <a
                href="/chatbot"
                className="inline-block rounded-full bg-accent-bright/90 text-black px-8 py-3.5 text-sm font-semibold hover:bg-accent-bright hover:shadow-lg hover:shadow-accent-bright/30 transition-all btn-press"
              >
                Open Chatbot
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
