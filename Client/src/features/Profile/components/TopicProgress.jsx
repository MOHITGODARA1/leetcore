import { useState } from "react";
import { Link } from "react-router-dom";

function TopicProgress({ topics = [], loading = false }) {
    const [showAll, setShowAll] = useState(false);

    if (loading) {
        return (
            <div className="w-full space-y-3 animate-pulse">
                <div className="h-4 w-28 bg-white/10 rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="h-20 bg-[#121215]/50 border border-white/[0.05] rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const sortedTopics = [...topics].sort((a, b) => b.solved - a.solved);
    const displayedTopics = showAll ? sortedTopics : sortedTopics.slice(0, 5);

    return (
        <div className="w-full space-y-3.5 text-white">
            <div className="flex justify-between items-baseline">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Learning Progress</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Your concept mastery across topics</p>
                </div>
                {topics.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs font-bold text-orange-500/90 hover:text-orange-400 transition-colors cursor-pointer"
                    >
                        {showAll ? "Show Less" : "View All Topics"}
                    </button>
                )}
            </div>

            {/* Horizontal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {displayedTopics.map((topic, index) => {
                    const solvedPct = topic.total > 0 ? ((topic.solved / topic.total) * 100) : 0;

                    return (
                        <Link
                            key={index}
                            to={`/dashboard/dsa/Practice/${encodeURIComponent(topic.topic)}`}
                            className="group flex flex-col justify-between p-3.5 rounded-xl bg-[#121215]/50 border border-white/[0.05] hover:border-orange-500/20 hover:bg-white/[0.03] transition-all duration-200 shadow-sm"
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

                            {/* Minimal Progress Bar */}
                            <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden border border-white/[0.01] mt-2">
                                <div
                                    className="bg-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${solvedPct}%` }}
                                />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default TopicProgress;
