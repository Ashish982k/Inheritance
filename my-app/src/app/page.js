"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    
    gsap.utils.toArray(".scroll-animate").forEach((elem) => {
      gsap.from(elem, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // simple hero headline animation
    gsap.from(".hero-head", {
      opacity: 0,
      y: -40,
      duration: 1.2,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="space-y-20 sm:space-y-24 px-4 py-8">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[80vh] md:h-[90vh] bg-cover bg-center
                        animate-fade-in scroll-animate"
               style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-3xl text-center px-4">
          <h1 className="hero-head text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            AI Symptom to Disease Predictor
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Describe your symptoms in natural language and get AI-assisted guidance. Fast, simple, and designed for clarity.
          </p>
          <span className="block mt-2 text-sm text-zinc-400">Not a substitute for professional medical advice.</span>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/chatbot"
              className="inline-block rounded-full bg-accent-bright text-black px-8 py-3.5 text-base font-semibold hover:bg-accent-bright/90 transition-all"
            >
              Start Diagnosis
            </a>
            <a
              href="/contact"
              className="inline-block rounded-full border border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="animate-slide-up scroll-animate">
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
      <section className="scroll-animate">
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
      <section className="pb-8 sm:pb-12 scroll-animate">
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
