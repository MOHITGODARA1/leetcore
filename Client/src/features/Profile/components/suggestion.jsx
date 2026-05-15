import { ArrowRight, BookOpenCheck, Clock3, Target } from "lucide-react";

function Suggestion() {
    const suggestions = [
        {
            icon: Target,
            title: "Focus on graphs",
            detail: "Your next best topic is BFS, DFS, and shortest path patterns.",
        },
        {
            icon: Clock3,
            title: "25 minute sprint",
            detail: "Keep today light: solve two medium problems and review one old miss.",
        },
        {
            icon: BookOpenCheck,
            title: "Revise arrays",
            detail: "Arrays are strong. A quick pass keeps the fundamentals warm.",
        },
    ];

    return (
        <div className="min-h-[260px] w-full bg-white/8 border border-white/5 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-white/45">Today</p>
                    <h1 className="mt-1 text-xl font-semibold">Smart Suggestions</h1>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/12 transition">
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="mt-5 space-y-3">
                {suggestions.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div key={item.title} className="flex gap-3 rounded-2xl bg-[#1F1F22] border border-white/5 p-4">
                            <div className="w-10 h-10 rounded-xl bg-[#F46717]/15 text-[#F46717] flex items-center justify-center flex-shrink-0">
                                <Icon size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold">{item.title}</h2>
                                <p className="mt-1 text-xs leading-5 text-white/50">{item.detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Suggestion;
