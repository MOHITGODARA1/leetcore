import { useParams, useNavigate } from "react-router-dom";
import { X, ExternalLink, BookOpen } from "lucide-react";
import questions from "../data/questions.json";

function Topicquestion() {
  const { topic } = useParams();
  const navigate = useNavigate();

  // Normalize and fetch questions
  const topicKey = topic ? topic.toLowerCase() : "";
  const topicQuestions = questions[topicKey] || [];

  const handleClose = () => {
    navigate("/dashboard/data-structures-and-algorithms");
  };

  const formatTitle = (str) => {
    if (!str) return "";
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full md:w-96 xl:w-[450px] flex-shrink-0 border-l border-white/10 bg-[#0B1220]/95 backdrop-blur-md h-full flex flex-col overflow-hidden shadow-2xl relative z-20 animate-in slide-in-from-right duration-300">
      
      {/* Header section */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {formatTitle(topicKey)}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Practice problems to master this topic
            </p>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {topicQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-slate-400 text-sm">No questions available for this topic yet.</p>
            <p className="text-xs text-slate-500 mt-1">Please check back later or update the JSON.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topicQuestions.map((question, index) => (
              <div
                key={index}
                className="group rounded-xl border border-white/5 bg-white/5 p-5 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-cyan-950/20"
              >
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors duration-200 leading-snug">
                    {question.name}
                  </h2>

                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider ${
                      question.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : question.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
                  <span>Acceptance: {question.acceptanceRate}</span>
                  
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                  >
                    Solve Problem
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Stats bar */}
      <div className="p-4 bg-white/5 border-t border-white/10 text-center text-xs text-slate-500">
        Total questions: {topicQuestions.length}
      </div>
    </div>
  );
}

export default Topicquestion;