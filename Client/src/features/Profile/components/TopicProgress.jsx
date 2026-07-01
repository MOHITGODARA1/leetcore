import { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

function TopicProgress({ topics = [], loading = false }) {
    const [showAll, setShowAll] = useState(false);

    if (loading) {
        return (
            <div className="w-full space-y-3.5 text-white rounded-2xl border border-white/[0.06] bg-[#121215]/45 p-4 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.16)] min-h-[148px]">
                {/* Header Skeleton */}
                <div className="flex justify-between items-baseline">
                    <div className="space-y-1.5">
                        <div className="w-[120px] h-[16px] rounded bg-white/[0.03] shimmer-skeleton" />
                        <div className="w-[180px] h-[12px] rounded bg-white/[0.03] shimmer-skeleton mt-1" />
                    </div>
                </div>

                {/* Grid Skeletons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-between p-3.5 rounded-xl bg-[#121215]/55 border border-white/[0.06] h-[78px] text-left"
                        >
                            <div className="w-[70px] h-[14px] rounded bg-white/[0.03] shimmer-skeleton" />
                            <div className="w-[40px] h-[12px] rounded bg-white/[0.03] shimmer-skeleton mt-2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const sortedTopics = [...topics].sort((a, b) => b.solved - a.solved);
    const displayedTopics = showAll ? sortedTopics : sortedTopics.slice(0, 5);

    return (
        <Motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full space-y-3.5 text-white rounded-2xl border border-white/[0.06] bg-[#121215]/45 p-4 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.16)]"
        >
            <div className="flex justify-between items-baseline">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Learning Progress</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Your concept mastery across topics</p>
                </div>
                {topics.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-base font-bold text-neutral-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                    >
                        {showAll ? "←" : "→"}
                    </button>
                )}
            </div>

            {/* Horizontal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {displayedTopics.map((topic, index) => {
                    const solvedPct = topic.total > 0 ? ((topic.solved / topic.total) * 100) : 0;

                    return (
                        <Motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                        >
                            <Link
                                to={`/dashboard/dsa/Practice/${encodeURIComponent(topic.topic)}`}
                                className="group flex flex-col justify-between p-3.5 rounded-xl bg-[#121215]/55 border border-white/[0.06] hover:border-orange-500/30 hover:shadow-[0_0_12px_rgba(249,115,22,0.08)] hover:bg-white/[0.04] transition-all duration-200 shadow-sm"
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
                        </Motion.div>
                    );
                })}
            </div>
        </Motion.div>
    );
}

export default TopicProgress;
