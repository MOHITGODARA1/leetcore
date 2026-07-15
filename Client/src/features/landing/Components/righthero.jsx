import { useEffect, useState } from "react";
import { ChevronDown, Folder, MousePointer2, CheckCircle2 } from "lucide-react";

const SHEET_SECTIONS = [
  { n: 1, title: "Learn the basics", done: 0, total: 11 },
  { n: 2, title: "Learn Important Sorting Techniques", done: 0, total: 5 },
  { n: 3, title: "Solve Problems on Arrays", done: 0, total: 15 },
  { n: 4, title: "Binary Search", done: 0, total: 10 },
  { n: 5, title: "Strings", done: 0, total: 5 },
  { n: 6, title: "Linked List", done: 0, total: 12 },
  { n: 7, title: "Learn Stack and Queue", done: 0, total: 8 },
];

const JOIN_CARDS = [
  {
    name: "Anusha Jha",
    company: "Deloitte",
    initials: "AJ",
    avatarBg: "bg-blue-900",
    className: "-top-6 -left-8 sm:-left-14 -rotate-6",
    delay: "0.5s",
  },
  {
    name: "Kushagra S.",
    company: "LinkedIn",
    initials: "KS",
    avatarBg: "bg-slate-700",
    className: "-top-8 -right-4 sm:-right-14 rotate-3",
    delay: "0.8s",
  },
  {
    name: "Rohit Sharma",
    company: "Amazon",
    initials: "RS",
    avatarBg: "bg-amber-900",
    className: "-bottom-7 left-1/2 -translate-x-1/2 rotate-2",
    delay: "1.1s",
  },
];

function JoinCard({ name, company, initials, avatarBg, className, delay }) {
  return (
    <div
      className={`lc-pop lc-float absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d10]/95 px-3.5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 hover:scale-[1.03] ${className}`}
      style={{ animationDelay: delay }}
    >
      <div
        className={`relative h-10 w-10 shrink-0 rounded-full ${avatarBg} ring-2 ring-orange-500/80 flex items-center justify-center text-xs font-semibold text-white`}
      >
        {initials}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-lime-400 ring-2 ring-[#0d0d10]" />
      </div>
      <div className="whitespace-nowrap leading-tight">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-[11px] text-white/50">
          Joined <span className="font-semibold text-white/90">{company}</span>
        </p>
      </div>
    </div>
  );
}

function SheetRow({ n, title, done, total, isLast, index, activeIndex }) {
  const isScanned = index === activeIndex;
  return (
    <div
      className={`group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-500 ${
        !isLast ? "border-b border-white/5" : ""
      } ${isScanned ? "bg-orange-500/[0.06]" : "hover:bg-white/[0.03]"}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-medium transition-colors duration-500 ${
            isScanned ? "bg-orange-500/20 text-orange-300" : "bg-white/10 text-white/70"
          }`}
        >
          {n}
        </span>
        <span className="truncate text-[13.5px] font-medium text-white/85">{title}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[13px] tabular-nums text-white/40">
          {done}/{total}
        </span>
        <ChevronDown className="h-4 w-4 text-white/40 transition-transform duration-300 group-hover:translate-y-0.5" />
      </div>
    </div>
  );
}

function LanguageBadge({ label, colorClass, className, delay }) {
  return (
    <div
      className={`lc-pop lc-float-slow absolute z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0d0d10] text-[11px] font-bold shadow-lg ${colorClass} ${className}`}
      style={{ animationDelay: delay }}
    >
      {label}
    </div>
  );
}

function RightSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SHEET_SECTIONS.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex-1 relative min-h-[300px] sm:min-h-[460px] lg:h-[680px] w-full flex items-center justify-center overflow-hidden bg-[#050506]">
      <style>{`
        @keyframes lcFadeUp { from { opacity: 0; transform: translateY(18px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes lcFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes lcFloatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes lcSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes lcSpinRev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .lc-pop { opacity: 0; animation: lcFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .lc-float { animation: lcFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards, lcFloat 5s ease-in-out 0.7s infinite; }
        .lc-float-slow { animation: lcFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards, lcFloatSlow 6.5s ease-in-out 0.7s infinite; }
        .lc-ring-spin { animation: lcSpin 60s linear infinite; }
        .lc-ring-spin-rev { animation: lcSpinRev 46s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lc-pop, .lc-float, .lc-float-slow, .lc-ring-spin, .lc-ring-spin-rev { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ambient rings */}
      <div className="lc-ring-spin absolute h-[92%] w-[92%] rounded-full border border-dashed border-white/[0.06]" />
      <div className="lc-ring-spin-rev absolute h-[70%] w-[70%] rounded-full border border-white/[0.05]" />
      <div className="absolute h-[48%] w-[48%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-8 rounded-full bg-orange-500/5 blur-3xl animate-pulse" />

      {/* floating language badges */}
      <LanguageBadge
        label="PY"
        colorClass="text-yellow-300"
        className="-top-1 left-1/2 -translate-x-1/2"
        delay="0.2s"
      />
      <LanguageBadge
        label="JAVA"
        colorClass="text-orange-400"
        className="bottom-2 left-[6%]"
        delay="0.35s"
      />

      {/* central sheet card wrapper (join cards anchor to this, not the section) */}
      <div className="relative z-10 w-[88%] max-w-[440px] lc-pop" style={{ animationDelay: "0.15s" }}>
        <div className="relative rounded-2xl border border-white/10 bg-[#0d0d10]/95 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-sm">
          {/* language selector row */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <span className="rounded-md bg-white/5 px-2.5 py-1 text-[12px] font-medium text-white/60">
              Java ⌄
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Autosaved
            </span>
          </div>

          {/* problem tab */}
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
            <Folder className="h-4 w-4 text-white/50" />
            <span className="text-[12px] font-semibold tracking-wide text-white/60">
              PROBLEM
            </span>
          </div>

          {/* title row */}
          <div className="relative flex items-center gap-2 border-b border-white/5 px-5 py-4">
            <span className="text-[15px] font-bold tracking-wide text-white">
              LEETCORE SHEET
            </span>
            <MousePointer2 className="absolute right-6 h-4 w-4 fill-white text-white animate-pulse" />
          </div>

          {/* section list */}
          <div className="max-h-[320px] overflow-hidden">
            {SHEET_SECTIONS.map((s, i) => (
              <SheetRow
                key={s.n}
                {...s}
                isLast={i === SHEET_SECTIONS.length - 1}
                index={i}
                activeIndex={activeIndex}
              />
            ))}
          </div>
        </div>

        {/* floating "joined" testimonial cards — anchored to the card, not the section */}
        {JOIN_CARDS.map((c) => (
          <JoinCard key={c.name} {...c} />
        ))}
      </div>
    </div>
  );
}

export default RightSection;