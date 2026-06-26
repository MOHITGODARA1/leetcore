import { useEffect, useState } from "react";
import { 
    X, Award, Target, Compass, Map, Activity, ShieldCheck, Crown, 
    Flame, Gem, Dumbbell, Trophy, Code, Type, Link as LinkIcon, 
    Layers, ListCollapse, GitFork, Network, Zap 
} from "lucide-react";

// Icon mapping matching milestone.jsx
const ICON_MAPPING = {
    "initiator": Target,
    "problem-solver": Compass,
    "dsa-explorer": Map,
    "algo-addict": Activity,
    "core-master": ShieldCheck,
    "leetcore-legend": Crown,
    "week-warrior": Flame,
    "consistency-champion": Flame,
    "unbreakable": Gem,
    "iron-discipline": Dumbbell,
    "annual-warrior": Trophy,
    "array-master": Code,
    "string-specialist": Type,
    "linked-list-expert": LinkIcon,
    "stack-sensei": Layers,
    "queue-commander": ListCollapse,
    "tree-explorer": GitFork,
    "graph-navigator": Network,
    "dp-architect": Zap
};

// Gradient mapping matching milestone.jsx
const GRADIENT_MAPPING = {
    "initiator": "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    "problem-solver": "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    "dsa-explorer": "from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]",
    "algo-addict": "from-purple-500/20 to-fuchsia-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    "core-master": "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    "leetcore-legend": "from-yellow-400/30 to-amber-500/20 border-yellow-500/40 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] border-dashed",
    "week-warrior": "from-orange-500/25 to-red-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.25)]",
    "consistency-champion": "from-rose-500/25 to-pink-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)]",
    "unbreakable": "from-cyan-500/25 to-teal-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]",
    "iron-discipline": "from-slate-500/25 to-zinc-500/10 border-zinc-500/30 text-zinc-300 shadow-[0_0_15px_rgba(100,116,139,0.15)]",
    "annual-warrior": "from-yellow-500/25 to-orange-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.25)]",
    "array-master": "from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]",
    "string-specialist": "from-pink-500/20 to-purple-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
    "linked-list-expert": "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]",
    "stack-sensei": "from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]",
    "queue-commander": "from-lime-500/20 to-green-500/10 border-lime-500/30 text-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.2)]",
    "tree-explorer": "from-emerald-500/20 to-green-600/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    "graph-navigator": "from-violet-500/20 to-indigo-500/10 border-violet-500/30 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]",
    "dp-architect": "from-red-500/25 to-rose-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
};

function BadgeEarnedPopup({ badge, onClose }) {
    const IconComp = ICON_MAPPING[badge?.slug] || Award;
    const gradientClass = GRADIENT_MAPPING[badge?.slug] || "from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4 animate-fade-in">
            <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 p-6 text-white shadow-2xl text-center overflow-hidden animate-scale-in">
                {/* Sparkle backgrounds */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* Celebration Header */}
                <div className="space-y-1 mt-2">
                    <p className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">Achievement Unlocked!</p>
                    <h2 className="text-xl font-extrabold tracking-tight">Congratulations!</h2>
                </div>

                {/* Badge Centerpiece */}
                <div className="my-6 flex justify-center">
                    <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border bg-black/40 ${gradientClass}`}>
                        <IconComp size={48} className="animate-pulse" />
                        <div className="absolute inset-0 rounded-full border border-dashed border-white/5 animate-spin duration-[15s]" />
                    </div>
                </div>

                {/* Badge Details */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">{badge?.name}</h3>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                        {badge?.description}
                    </p>
                </div>

                {/* XP Reward Badge */}
                {badge?.xpReward > 0 && (
                    <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                        <span>+{badge?.xpReward} XP Reward</span>
                    </div>
                )}

                {/* Action button */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-sm font-bold text-white shadow-lg cursor-pointer"
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
}

export default BadgeEarnedPopup;
