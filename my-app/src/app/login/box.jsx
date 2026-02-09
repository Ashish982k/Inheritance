const Box = ({ icon, text }) => {
  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 hover:bg-white/10 hover:border-accent-bright/30 transition-all btn-press"
      aria-label={text}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Box;
