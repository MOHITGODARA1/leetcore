import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Sparkles } from "lucide-react";
import SectionFrame from "./SectionFrame";

function PracticeRoadmapSection({ section }) {
  if (!section.nextTopic) return null;

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
            Excellent progress! Keep the momentum going and jump directly into the next key data structure to strengthen your algorithms foundation.
          </p>

          {/* Interactive Button */}
          <Motion.div 
            className="mt-8"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={`/dashboard/dsa/Docs/${encodeURIComponent(section.nextTopic)}`}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 font-bold text-white transition-all duration-300 shadow-[0_0_30px_rgba(244,103,23,0.25)] hover:shadow-[0_0_40px_rgba(244,103,23,0.5)] cursor-pointer"
            >
              <span>Next Up: {section.nextTitle || section.nextTopic}</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Motion.div>
        </div>
      </div>
    </SectionFrame>
  );
}

export default PracticeRoadmapSection;
