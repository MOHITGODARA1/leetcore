import { useState } from "react";
import { Link } from "react-router-dom";

function TopicProgress({ topics = [], loading = false }) {
    const [showAll, setShowAll] = useState(false);

    if (loading) {
        return (
            <div className="w-full space-y-3.5 text-white rounded-2xl border border-white/[0.06] bg-[#121215]/45 p-4 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.16)]">
                <style>{`
                    @keyframes lc-shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .lc-skeleton-bg {
                        background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
                        background-size: 200% 100%;
                        animation: lc-shimmer 1.6s infinite linear;
                    }
                `}</style>
                <div className="flex justify-between items-baseline">
                    <div>
                        <div className="h-3.5 w-28 rounded lc-skeleton-bg" />
                        <div className="h-2.5 w-36 rounded mt-1.5 lc-skeleton-bg" />
                    </div>
                    <div className="h-4 w-4 rounded lc-skeleton-bg" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-between p-3.5 rounded-xl bg-[#121215]/55 border border-white/[0.06] min-h-[82px]"
                        >
                            <div className="h-3 w-16 rounded lc-skeleton-bg" />
                            <div className="h-2.5 w-10 rounded mt-3 lc-skeleton-bg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const sortedTopics = [...topics].sort((a, b) => b.solved - a.solved);
    const displayedTopics = showAll ? sortedTopics : sortedTopics.slice(0, 5);

    return (
        <div className="w-full space-y-3.5 text-white rounded-2xl border border-white/[0.06] bg-[#121215]/45 p-4 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.16)] lc-animate-fade-up">
            <style>{`
                @keyframes lc-fade-up {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .lc-animate-fade-up {
                    animation: lc-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                @keyframes lc-badge-fade-in-up {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .lc-badge-stagger {
                    opacity: 0;
                    animation: lc-badge-fade-in-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>
            <div className="flex justify-between items-baseline">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Learning Progress</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Your concept mastery across topics</p>
                </div>
                {topics.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-neutral-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer text-sm font-bold"
                    >
                        {showAll ? "←" : "→"}
                    </button>
                )}
            </div>

            {/* Horizontal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {displayedTopics.map((topic, index) => {
                    return (
                        <Link
                            key={index}
                            to={`/dashboard/dsa/Practice/${encodeURIComponent(topic.topic)}`}
                            className="group flex flex-col justify-between p-3.5 rounded-xl bg-[#121215]/55 border border-white/[0.06] hover:border-orange-500/30 hover:shadow-[0_0_12px_rgba(249,115,22,0.08)] hover:bg-white/[0.04] transition-all duration-200 shadow-sm lc-badge-stagger"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Header details */}
                            <div className="flex justify-between items-baseline gap-2 min-w-0">
                                <span className="text-xs font-bold text-neutral-300 group-hover:text-white transition-colors truncate">
                                    {topic.name}
                                </span>
                            </div>
                            
                            {/* Solved Ratio */}
                            <div className="text-[10px] font-semibold text-neutral-400 mt-2">
                                <span className="text-neutral-200 font-semibold">{topic.solved}</span>
                                <span className="text-neutral-500 font-normal"> / {topic.total}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default TopicProgress;
