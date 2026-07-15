import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function WeakConceptAnalysis({ progressData, loading }) {
  const [showAll, setShowAll] = useState(false);

  if (loading || !progressData) {
    return (
      <div className="w-full bg-[#121215]/68 border border-white/[0.08] rounded-2xl p-5 sm:p-6 text-white shadow-[0_18px_55px_rgba(0,0,0,0.2)] backdrop-blur-md shimmer-skeleton min-h-[300px]">
        <div className="h-6 w-48 bg-white/5 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded" />
          <div className="h-8 bg-white/5 rounded" />
          <div className="h-8 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  const { analysis } = progressData;
  const weakTopics = analysis?.weakTopics || [];
  
  // Conditionally render top 5 or all 17 topics
  const displayedTopics = showAll ? weakTopics : weakTopics.slice(0, 5);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full bg-white/8 border border-white/8 rounded-2xl p-5 sm:p-6 text-white shadow-[0_18px_55px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden transition-all duration-300"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-white/[0.05]">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-400">
            Weak Topic Detection
          </h3>
          <p className="text-xs text-neutral-500 font-semibold mt-0.5">
            Topics Detected From Your Performance
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          {showAll ? (
            <>
              Show Less <ChevronRight size={14} className="mt-0.5 rotate-180" />
            </>
          ) : (
            <>
              View Topics <ChevronRight size={14} className="mt-0.5" />
            </>
          )}
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-wider text-white/40 pb-3">
              <th className="pb-3 pt-1 text-left font-bold w-1/4">Topic</th>
              <th className="pb-3 pt-1 text-center font-bold">Attempted</th>
              <th className="pb-3 pt-1 text-center font-bold">Solved</th>
              <th className="pb-3 pt-1 text-center font-bold">Accuracy</th>
              <th className="pb-3 pt-1 text-center font-bold">Avg Time Taken</th>
              <th className="pb-3 pt-1 text-center font-bold">Weakness Score</th>
              <th className="pb-3 pt-1 text-right font-bold w-24">Practice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {displayedTopics.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-xs text-neutral-500 font-semibold">
                  No weakness stats collected yet. Start solving questions to generate an analysis.
                </td>
              </tr>
            ) : (
              displayedTopics.map((topic, index) => (
                <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 text-left align-middle font-bold text-xs text-white">
                    {topic.name}
                  </td>
                  <td className="py-4 text-center align-middle font-bold text-xs text-white">
                    {topic.attempted}
                  </td>
                  <td className="py-4 text-center align-middle font-bold text-xs text-white">
                    {topic.solved}
                  </td>
                  <td className="py-4 text-center align-middle font-bold text-xs text-white">
                    {topic.accuracy}
                  </td>
                  <td className="py-4 text-center align-middle font-bold text-xs text-white">
                    {topic.avgTimeTaken}
                  </td>
                  <td className="py-4 text-center align-middle font-bold text-xs text-white">
                    {topic.weaknessScore}
                  </td>
                  <td className="py-4 text-right align-middle">
                    <Link
                      to={`/dashboard/dsa/Practice/${encodeURIComponent(topic.topic)}`}
                      className="inline-flex px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[10px] font-black text-white/70 hover:text-white hover:border-orange-500/30 hover:shadow-[0_0_8px_rgba(249,115,22,0.08)] hover:bg-[#ff7a29]/10 transition-all duration-200"
                    >
                      Practice
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Motion.div>
  );
}

export default WeakConceptAnalysis;
