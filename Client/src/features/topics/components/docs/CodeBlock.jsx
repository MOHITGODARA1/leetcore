function CodeBlock({ code, tone = "default" }) {
  const border =
    tone === "wrong" ? "border-red-500/35" : tone === "correct" ? "border-emerald-500/35" : "border-white/10";
  const glow =
    tone === "wrong" ? "bg-red-950/15" : tone === "correct" ? "bg-emerald-950/15" : "bg-[#070708]";

  return (
    <pre className={`overflow-x-auto rounded-lg ${border} ${glow} border p-4 text-xs leading-6 text-orange-50 shadow-inner sm:text-sm`}>
      <code>{code}</code>
    </pre>
  );
}

export default CodeBlock;
