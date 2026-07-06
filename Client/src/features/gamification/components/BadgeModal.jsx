import { X, Calendar, Lock } from "lucide-react";
import { useEffect } from "react";
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

function BadgeModal({ badge, onClose }) {
  const glowColorClass = GLOW_COLORS[badge?.slug] || "from-orange-500 to-yellow-500";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!badge) {
    return null;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 p-6 text-white shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft swirling glow background (extremely subtle) */}
        <div 
          className={`absolute left-1/2 top-[120px] -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-tr ${glowColorClass} blur-3xl opacity-[0.06] animate-spin pointer-events-none`} 
          style={{ animationDuration: "15s" }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black tracking-widest text-[#F46717] uppercase">
            {badge.category} Achievement
          </p>
          <h2 className="text-xl font-black tracking-tight">{badge.name}</h2>
        </div>

        {/* Badge Visual Section */}
        <div className="my-8 flex flex-col items-center justify-center relative select-none">
          {/* Rotating dashed background orbit */}
          <div className="absolute w-36 h-36 rounded-full border border-dashed border-white/10 animate-spin" style={{ animationDuration: "25s" }} />
          
          {/* Solid pedestal deck */}
          <div className="absolute w-30 h-30 rounded-full border border-white/5 bg-black/40 shadow-inner flex items-center justify-center" />

          {/* Floating new high-fidelity Badge */}
          <div className="relative z-10 animate-soft-float drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
            <BadgeIcon slug={badge.slug} size={110} unlocked={badge.unlocked} />
          </div>
        </div>

        {/* Badge Description */}
        <div className="space-y-2 text-center">
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
            {badge.description}
          </p>
        </div>

        {/* Status / Earned Date */}
        <div className="mt-5 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[10px] font-semibold text-neutral-400">
          {badge.unlocked ? (
            <>
              <Calendar size={13} className="text-[#F46717]" />
              <span>Unlocked on {formatDate(badge.earnedAt)}</span>
            </>
          ) : (
            <>
              <Lock size={13} className="text-neutral-500" />
              <span>Currently Locked</span>
            </>
          )}
        </div>

        {/* Metadata Details Cards */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left">
            <p className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Rarity</p>
            <p className="mt-1 text-xs font-black capitalize text-neutral-200">{badge.rarity}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left">
            <p className="text-[10px] font-bold text-white/45 uppercase tracking-wider">Reward</p>
            <p className="mt-1 text-xs font-black text-orange-400">+{badge.xpReward || 0} XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BadgeModal;

