import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import SectionFrame from "./SectionFrame";

function InterviewQuestionsSection({ section }) {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleIndex = (index) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const questions = section.questions || [];

  return (
    <SectionFrame section={section}>
      <div className="mt-4 space-y-3">
        {questions.map((item, index) => {
          const isOpen = !!openIndexes[index];

          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.015] backdrop-blur-md transition-all duration-300 hover:border-orange-500/30 hover:bg-white/[0.03]"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-white/90 transition hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-orange-400">
                    <HelpCircle size={17} />
                  </div>
                  <span className="text-sm sm:text-base">{item.question}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-white/40 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-orange-400" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-[1000px] border-t border-white/5 opacity-100 py-4"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="px-5 pl-16 text-sm leading-relaxed text-white/70 whitespace-pre-line">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export default InterviewQuestionsSection;
