import { motion as Motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Trophy } from "lucide-react";
import SectionFrame from "./SectionFrame";

const topicNames = {
  array: "Arrays",
  string: "Strings",
  hashing: "Hashing",
  binarysearch: "Binary Search",
  linkedlist: "Linked List",
  stack: "Stack",
  queue: "Queue"
};

function PracticeRoadmapSection({ section }) {
  const { topic } = useParams();
  if (!section.nextTopic) return null;

  const currentTopicDisplayName = topicNames[topic?.toLowerCase()] || (topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "Topic");

  return (
    <SectionFrame section={section}>
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/[0.07] via-zinc-950/60 to-black/80 p-8 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        {/* Glow effects */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-500/10 blur-[60px]" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-orange-500/5 blur-[60px]" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Completion Badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
            <Trophy size={12} /> Section Completed
          </div>

          <h3 className="max-w-md text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            You've mastered this chapter!
          </h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/58">
            Excellent progress! Keep the momentum going. You can start practicing problems on this topic immediately or jump directly to the next key chapter.
          </p>

          {/* Side-by-Side Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* 1. Practice Button (Secondary Action styled) */}
            <Motion.div 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/dashboard/dsa/Practice/${encodeURIComponent(topic)}`}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-orange-500/30 px-8 py-3.5 font-bold text-white/90 transition-all duration-300 cursor-pointer"
              >
                <span>Practice {currentTopicDisplayName}</span>
                <ArrowRight size={18} className="opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Motion.div>

            {/* 2. Next Chapter Button (Primary Action styled) */}
            <Motion.div 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/dashboard/dsa/Docs/${encodeURIComponent(section.nextTopic)}`}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 font-bold text-white transition-all duration-300 shadow-[0_0_30px_rgba(244,103,23,0.25)] hover:shadow-[0_0_40px_rgba(244,103,23,0.5)] cursor-pointer"
              >
                <span>Next Chapter: {section.nextTitle || section.nextTopic}</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Motion.div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

export default PracticeRoadmapSection;
