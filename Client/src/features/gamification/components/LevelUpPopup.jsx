import { X, Trophy, Sparkles } from "lucide-react";

function LevelUpPopup({ level, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4 animate-fade-in">
            <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 p-6 text-white shadow-2xl text-center overflow-hidden animate-scale-in">
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
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-orange-500 uppercase">
                        <Sparkles size={10} className="animate-spin duration-3000" />
                        <span>Level Accomplished!</span>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Level Up!</h2>
                </div>

                {/* Centerpiece Level Indicator */}
                <div className="my-7 flex justify-center">
                    <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl border border-orange-500/30 bg-orange-500/5 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Level</span>
                            <span className="text-4xl font-black text-white leading-none mt-1">{level}</span>
                        </div>
                        {/* Orbiting particles style border */}
                        <div className="absolute inset-0 rounded-2xl border border-dashed border-white/5 animate-spin duration-[20s]" />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                    <h3 className="text-md font-bold text-white">Rank Promoted</h3>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                        Fantastic job! Your persistent problem solving has unlocked Level {level}. Keep pushing to reach new heights.
                    </p>
                </div>

                {/* Action button */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-sm font-bold text-white shadow-lg cursor-pointer"
                >
                    Awesome, Let's Continue!
                </button>
            </div>
        </div>
    );
}

export default LevelUpPopup;
