import { motion as Motion } from "framer-motion";

function ArrayIllustration({ values = [], labels = [] }) {
  return (
    <div className="relative min-h-[180px] overflow-hidden rounded-lg border border-white/10 bg-black/25 p-5">
      <div className="absolute inset-x-6 top-8 h-px bg-orange-400/25" />
      <div className="grid h-full grid-cols-5 place-items-center gap-3">
        {values.map((value, index) => (
          <Motion.div
            key={`${value}-${index}`}
            initial={{ opacity: 0, y: 22, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="h-14 w-14 rotate-45 rounded-md border border-orange-300/20 bg-gradient-to-br from-[#f46717] to-[#36140a] shadow-[0_16px_34px_rgba(244,103,23,0.22)]" />
            <span className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] text-white/60">
              {labels[index] ?? index}
            </span>
            <span className="font-mono text-xs text-orange-100">{value}</span>
          </Motion.div>
        ))}
      </div>
    </div>
  );
}

export default ArrayIllustration;
