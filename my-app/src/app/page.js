export default function Home() {
  return (
    <div className="space-y-24">

      <section className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text gradient-flow">
            AI Symptom to Disease Predictor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Describe your symptoms in natural language and get quick, AI-assisted guidance. Not a substitute for professional medical advice.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="/chatbot" className="rounded-full bg-[#0f766e]/90 text-black px-6 py-3 text-sm font-semibold hover:bg-[#0f766e] transition-colors shadow">
              Start Diagnosis
            </a>
            <a href="/contact" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/10 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </section>

      
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#098f84]/90 mb-6">How the AI Diagnosis Works</h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass rounded-3xl p-6">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="text-lg font-semibold text-[#0bbaac]/90">Enter Symptoms</h3>
              <p className="mt-2 text-sm text-zinc-400">Type your symptoms in simple language — no medical terms required.</p>
            </div>
            <div className="glass rounded-3xl p-6">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="text-lg font-semibold text-[#0bbaac]/90">AI Processing</h3>
              <p className="mt-2 text-sm text-zinc-400">The model analyzes symptom patterns and medical context.</p>
            </div>
            <div className="glass rounded-3xl p-6">
              <div className="text-2xl mb-2">🔎</div>
              <h3 className="text-lg font-semibold text-[#0bbaac]/90">Predictions</h3>
              <p className="mt-2 text-sm text-zinc-400">You get likely conditions with confidence indicators.</p>
            </div>
            <div className="glass rounded-3xl p-6">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="text-lg font-semibold text-[#0bbaac]/90">Guidance</h3>
              <p className="mt-2 text-sm text-zinc-400">Receive clear next steps and safety guidance in plain language.</p>
            </div>
          </div>
        </div>
      </section>

    
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#0bbaac]/90 mb-6">Health Conditions It Can Help With</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {[
              'Fever & infections',
              'Respiratory issues',
              'Digestive problems',
              'Headaches & fatigue',
              'Skin issues',
              'General wellness',
            ].map((label) => (
              <div key={label} className="glass rounded-2xl p-4 text-center">
                <span className="text-sm font-medium text-zinc-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#0bbaac]/90 mb-6">Key Benefits</h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Instant symptom analysis',
              'Easy chatbot interaction',
              'Saves time vs. searching online',
              'AI-powered accuracy',
              'Private & secure',
              'Designed for clarity',
            ].map((benefit) => (
              <div key={benefit} className="glass rounded-3xl p-6 hover:shadow-lg transition-shadow">
                <p className="text-sm text-zinc-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="glass rounded-3xl p-8">
            <h3 className="text-xl font-semibold text-[#0bbaac]/90">AI + Healthcare Vision</h3>
            <p className="mt-3 text-sm text-zinc-400">
              This platform uses artificial intelligence to assist users in understanding possible health conditions quickly and responsibly — bridging the gap between symptoms and medical awareness.
            </p>
          </div>
        </div>
      </section>

     
      <section>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-[#0bbaac]/90">Safety & Disclaimer</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              <li>Not a replacement for doctors or emergency care.</li>
              <li>For informational and educational purposes.</li>
              <li>Seek qualified medical professionals for serious concerns.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Final Call To Action */}
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass rounded-3xl p-8 text-center">
            <h3 className="text-xl font-semibold text-[#0bbaac]/90">Start Your AI Health Check Now</h3>
            <p className="mt-2 text-sm text-zinc-400">It takes less than a minute to describe your symptoms.</p>
            <div className="mt-6">
              <a href="/chatbot" className="rounded-full bg-[#0f766e]/90 text-black px-6 py-3 text-sm font-semibold hover:bg-[#0f766e] transition-colors shadow">
                Begin Diagnosis
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
