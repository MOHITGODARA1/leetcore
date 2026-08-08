import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { X, ExternalLink, BookOpen, CheckCircle } from "lucide-react";
import questions from "../data/questions.json";
import topicsData from "../data/topics.json";

function Topicquestion() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [solvedQuestions] = useState(() =>
    JSON.parse(localStorage.getItem("leetcore_solved_questions") || "[]")
  );

  const topicKey = topic ? topic.toLowerCase() : "";
  const topicQuestions = questions[topicKey] || [];

  // Safe redirect if topic is locked
  useEffect(() => {
    if (!topicKey) return;
    
    const currentTopicData = topicsData.topics.find((t) => t.id === topicKey);
    if (!currentTopicData) return;

    const isUnlocked = () => {
      if (currentTopicData.order === 0) return true;
      const prevTopic = topicsData.topics.find((t) => t.order === currentTopicData.order - 1);
      if (!prevTopic) return false;
      const prevQuestions = questions[prevTopic.id] || [];
      const solved = JSON.parse(localStorage.getItem("leetcore_solved_questions") || "[]");
      return prevQuestions.length > 0 && prevQuestions.every((q) => solved.includes(q.id));
    };

    if (!isUnlocked()) {
      navigate("/dashboard/data-structures-and-algorithms");
    }
  }, [topicKey, navigate]);

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

  const completedQuestionsCount = topicQuestions.filter(q => solvedQuestions.includes(q.id)).length;

  return (
    <div className="w-full md:w-96 xl:w-[450px] flex-shrink-0 border-l border-white/10 bg-[#171719] h-full flex flex-col overflow-hidden relative z-20 animate-in slide-in-from-right duration-300">
      
      {/* Header section */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#202022]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/5 text-white/70">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {formatTitle(topicKey)}
            </h1>
            <p className="text-xs text-white/55 mt-0.5">
              Practice problems to master this topic
            </p>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/55 hover:text-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {topicQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-white/55 text-sm">No questions available for this topic yet.</p>
            <p className="text-xs text-white/40 mt-1">Please check back later or update the JSON.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topicQuestions.map((question, index) => {
              const isSolved = solvedQuestions.includes(question.id);
              return (
                <div
                  key={index}
                  className={`group rounded-lg border p-5 transition-all duration-200 ${
                    isSolved 
                      ? "border-emerald-500/20 bg-emerald-500/10 hover:border-emerald-500/30"
                      : "border-white/10 bg-[#202022] hover:border-white/20 hover:bg-[#242426]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h2 className={`text-base font-semibold transition-colors duration-200 leading-snug ${
                      isSolved ? "text-white/75 group-hover:text-white" : "text-white/70 group-hover:text-white"
                    }`}>
                      {question.name}
                    </h2>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSolved && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle size={10} />
                          Solved
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                          question.difficulty === "Easy"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : question.difficulty === "Medium"
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs text-white/55">
                    <span>Acceptance: {question.acceptanceRate}</span>
                    
                    <Link
                      to={`/dashboard/data-structures-and-algorithms/${topicKey}/${question.id}`}
                      className="flex items-center gap-1 text-white/70 hover:text-white font-medium transition-colors duration-200"
                    >
                      Solve Problem
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Stats bar */}
      <div className="p-4 bg-white/5 border-t border-white/10 text-center text-xs text-white/40 flex justify-between items-center">
        <span>Total: {topicQuestions.length} questions</span>
        <span>Solved: {completedQuestionsCount} / {topicQuestions.length}</span>
      </div>
    </div>
  );
}

export default Topicquestion;
