export default function Home() {
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] w-full items-center justify-center bg-black">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text gradient-flow sm:text-6xl">
          AI Symptom Detector
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
          Leverage AI to analyze your symptoms and get guidance in seconds. This tool provides an intuitive chat experience to explore possible causes and next steps.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="/chatbot" className="rounded-md bg-zinc-100 px-5 py-2 text-sm font-medium text-black hover:bg-white">
            Open Chatbot
          </a>
          <a href="/contact" className="rounded-md border border-white/20 px-5 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
