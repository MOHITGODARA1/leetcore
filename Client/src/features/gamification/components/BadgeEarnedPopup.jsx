import { useEffect } from "react";
import { X } from "lucide-react";
import { BadgeIcon } from "../../Profile/components/BadgeIcon";

// Glow color gradient mapping matching badge themes
const GLOW_COLORS = {
  "initiator": "from-orange-500 to-red-500",
  "problem-solver": "from-emerald-500 to-teal-500",
  "dsa-explorer": "from-indigo-500 to-purple-500",
  "algo-addict": "from-purple-500 to-pink-500",
  "core-master": "from-amber-500 to-yellow-500",
  "leetcore-legend": "from-yellow-400 to-amber-500",
  "week-warrior": "from-orange-500 to-red-500",
  "consistency-champion": "from-rose-500 to-pink-500",
  "unbreakable": "from-cyan-500 to-teal-500",
  "iron-discipline": "from-slate-400 to-zinc-500",
  "annual-warrior": "from-yellow-500 to-orange-500",
  "array-master": "from-teal-500 to-emerald-500",
  "string-specialist": "from-pink-500 to-purple-500",
  "hashing-hero": "from-blue-500 to-indigo-500",
  "search-master": "from-violet-500 to-purple-500",
  "linked-list-expert": "from-sky-500 to-blue-500",
  "stack-sensei": "from-orange-500 to-red-500",
  "queue-commander": "from-lime-500 to-green-500"
};

function BadgeEarnedPopup({ badge, onClose }) {
  const glowColorClass = GLOW_COLORS[badge?.slug] || "from-orange-500 to-yellow-500";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 p-6 text-white shadow-2xl text-center overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft swirling glow background (non-blinking) */}
        <div 
          className={`absolute left-1/2 top-[120px] -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-tr ${glowColorClass} blur-3xl opacity-20 animate-spin pointer-events-none`} 
          style={{ animationDuration: "15s" }}
        />

        {/* Floating background particles (non-blinking) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="80" r="1.5" fill="#FFE066" className="opacity-20" />
          <circle cx="320" cy="110" r="2.5" fill="#FFF" className="opacity-30 animate-bounce" style={{ animationDuration: "6s" }} />
          <circle cx="70" cy="200" r="2" fill="#4DABF7" className="opacity-30 animate-bounce" style={{ animationDuration: "5s" }} />
          <circle cx="280" cy="260" r="1.5" fill="#38D9A9" className="opacity-20" />
          <path d="M 280 60 L 282 63 L 285 63 L 283 65 L 284 68 L 280 66 L 276 68 L 277 65 L 275 63 L 278 63 Z" fill="#FFE066" className="opacity-20" />
          <path d="M 60 270 L 62 273 L 65 273 L 63 275 L 64 278 L 60 276 L 56 278 L 57 275 L 55 273 L 58 273 Z" fill="#FF8787" className="opacity-30 animate-bounce" style={{ animationDuration: "7s" }} />
        </svg>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Celebration Header */}
        <div className="space-y-1 mt-2">
          <p className="text-[10px] font-black tracking-widest text-orange-500 uppercase">
            Achievement Unlocked!
          </p>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Congratulations!
          </h2>
        </div>

        {/* Badge Centerpiece Showcase */}
        <div className="my-8 flex flex-col items-center justify-center relative select-none">
          {/* Rotating dashed background orbit */}
          <div className="absolute w-36 h-36 rounded-full border border-dashed border-white/10 animate-spin" style={{ animationDuration: "25s" }} />
          
          {/* Solid pedestal deck */}
          <div className="absolute w-30 h-30 rounded-full border border-white/5 bg-black/40 shadow-inner flex items-center justify-center" />

          {/* Floating new high-fidelity Badge */}
          <div className="relative z-10 animate-soft-float drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
            <BadgeIcon slug={badge?.slug} size={110} unlocked={true} />
          </div>
        </div>

        {/* Badge Details */}
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-white leading-tight">
            {badge?.name}
          </h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            {badge?.description}
          </p>
        </div>

        {/* Rarity & XP Badge Container */}
        <div className="mt-6 flex justify-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-neutral-300">
            {badge?.rarity}
          </span>
          {badge?.xpReward > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-wider">
              +{badge?.xpReward} XP Reward
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 transition-all text-sm font-black text-white shadow-lg shadow-orange-500/15 cursor-pointer"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

export default BadgeEarnedPopup;

