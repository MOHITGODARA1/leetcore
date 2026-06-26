import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  Search
} from "lucide-react";
import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";

const formatPattern = (pattern = "") =>
  pattern
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const difficultyRank = {
  Easy: 0,
  Medium: 1,
  Hard: 2
};

const sortQuestionsByDifficulty = (items = []) =>
  [...items].sort((a, b) => {
    const rankDiff = (difficultyRank[a.difficulty] ?? 3) - (difficultyRank[b.difficulty] ?? 3);
    if (rankDiff !== 0) return rankDiff;

    return (Number(a.problemNumber) || 0) - (Number(b.problemNumber) || 0);
  });

function QuestionListContent({ topicNameOverride }) {
  const { topic, pattern } = useParams();
  const topicName = topicNameOverride || decodeURIComponent(topic || "");
  const patternName = decodeURIComponent(pattern || "");

  const { user, setUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams({ topic: topicName });
        if (patternName) {
          query.set("pattern", patternName);
        }

        let response;
        try {
          response = await apiClient.get(`/questions?${query.toString()}`);
        } catch (err) {
          if (patternName || err.response?.status !== 400) {
            throw err;
          }

          const patternsResponse = await apiClient.get(
            `/questions/patterns?topic=${encodeURIComponent(topicName)}`
          );
          const patterns = patternsResponse.data?.patterns || [];
          const topicQuestions = [];

          for (const item of patterns) {
            if (topicQuestions.length >= 25) break;

            const patternResponse = await apiClient.get(
              `/questions?topic=${encodeURIComponent(topicName)}&pattern=${encodeURIComponent(item.slug)}`
            );
            topicQuestions.push(...(patternResponse.data?.questions || []));
          }

          response = {
            data: {
              success: true,
              questions: topicQuestions.slice(0, 25)
            }
          };
        }

        if (isMounted && response.data?.success) {
          setQuestions(sortQuestionsByDifficulty(response.data.questions || []));
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load questions from server");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (topicName) {
      fetchQuestions();
    }

    return () => {
      isMounted = false;
    };
  }, [topicName, patternName, user?._id]);

  const handleToggleSolve = async (problemId, questionPattern) => {
    if (!user) {
      setToast({ text: "Please sign in to save your progress!", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setTogglingId(problemId);
      setQuestions((prev) =>
        prev.map((q) => (q._id === problemId ? { ...q, solved: !q.solved } : q))
      );

      const response = await apiClient.post("/questions/toggle-solve", {
        problemId,
        topic: topicName,
        pattern: questionPattern
      });

      if (response.data?.success) {
        setToast({
          text: response.data.solved ? "+15 XP Earned!" : "-15 XP Removed",
          type: response.data.solved ? "success" : "info"
        });
        setTimeout(() => setToast(null), 2500);

        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            xp: response.data.xp,
            level: response.data.level,
            stats: response.data.stats,
            badges: response.data.badges || prevUser.badges
          };
        });
      }
    } catch (err) {
      console.error("Error toggling solve status:", err);
      setQuestions((prev) =>
        prev.map((q) => (q._id === problemId ? { ...q, solved: !q.solved } : q))
      );
      setToast({ text: "Failed to update progress on server", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setTogglingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = questions.length;
    const solved = questions.filter((q) => q.solved).length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
    const totalMinutesLeft = questions.reduce((sum, q) => {
      if (q.solved) return sum;
      const match = q.estimatedTime?.match(/(\d+)/);
      return match ? sum + Number(match[1]) : sum;
    }, 0);
    const hours = Math.floor(totalMinutesLeft / 60);
    const mins = totalMinutesLeft % 60;

    return {
      total,
      solved,
      percentage,
      timeLeftStr: hours > 0 ? `${hours}h ${mins}m` : `${mins} min`
    };
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const term = search.toLowerCase();

    return sortQuestionsByDifficulty(questions.filter((q) => {
      const companies = Array.isArray(q.companies) ? q.companies : [];
      const matchesSearch =
        q.title.toLowerCase().includes(term) ||
        formatPattern(q.pattern).toLowerCase().includes(term) ||
        companies.some((company) => company.toLowerCase().includes(term)) ||
        (q.problemNumber && String(q.problemNumber).includes(term));
      const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Solved" && q.solved) ||
        (statusFilter === "Unsolved" && !q.solved);

      return matchesSearch && matchesDifficulty && matchesStatus;
    }));
  }, [difficultyFilter, questions, search, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl
            font-bold shadow-xl border transition-all duration-300
            ${
              toast.type === "success"
                ? "bg-orange-500/90 text-white border-orange-400 shadow-orange-500/25"
                : toast.type === "error"
                  ? "bg-red-500/90 text-white border-red-400 shadow-red-500/25"
                  : "bg-zinc-800/95 text-white border-zinc-700 shadow-black/45"
            }
          `}
        >
          <Award className="w-5 h-5" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
        <Link to="/dashboard" className="hover:text-orange-400 transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={12} />
        {patternName ? (
          <Link
            to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
            className="hover:text-orange-400 transition-colors"
          >
            {topicName}
          </Link>
        ) : (
          <span className="text-orange-300">{topicName}</span>
        )}
        {patternName && (
          <>
            <ChevronRight size={12} />
            <span className="text-orange-200">{formatPattern(patternName)}</span>
          </>
        )}
      </div>

      {/* Header Block */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            {patternName && (
              <Link
                to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 text-white/70 hover:text-white transition-all"
              >
                <ArrowLeft size={16} />
              </Link>
            )}
            <h1 className="text-3xl font-black text-white tracking-tight">
              {patternName ? formatPattern(patternName) : `${topicName} Practice`}
            </h1>
          </div>
          <p className="mt-2 text-white/60 text-sm max-w-2xl">
            {patternName
              ? `Solve curated ${formatPattern(patternName)} questions to build muscle memory for this pattern.`
              : "Start directly with 25 curated questions. Open any problem to see details, examples, hints, and your answer notepad."}
          </p>
        </div>

        <div className="w-full lg:w-72 p-4 rounded-2xl bg-zinc-900/50 border border-white/10 flex flex-col gap-3">
          <div className="flex justify-between text-xs font-semibold text-white/60">
            <span>PROGRESS</span>
            <span>
              {stats.solved} / {stats.total} Solved
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/40">Est. Time Remaining:</span>
            <span className="text-orange-400 font-bold flex items-center gap-1">
              <Clock size={12} /> {stats.timeLeftStr}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-zinc-950/40 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search problem, pattern, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/40 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  difficultyFilter === diff
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
            {["All", "Solved", "Unsolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === status
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-white/60 text-sm">Fetching questions...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <div>
            <h3 className="text-white font-bold text-lg">Error Occurred</h3>
            <p className="text-red-400/80 text-sm mt-1">{error}</p>
          </div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
          <p className="text-white/40 text-sm">No questions found matching your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/5 rounded-2xl bg-zinc-950/20 backdrop-blur-md">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                <th className="py-4 px-6 w-16">Status</th>
                <th className="py-4 px-4">Problem Name</th>
                <th className="py-4 px-4 w-32">Difficulty</th>
                <th className="py-4 px-4 w-40">Patterns</th>
                <th className="py-4 px-4 w-28">Est. Time</th>
                <th className="py-4 px-4">Companies</th>
                <th className="py-4 px-6 w-24 text-center">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuestions.map((q) => {
                const difficultyColor =
                  q.difficulty === "Easy"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : q.difficulty === "Hard"
                      ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                      : "text-amber-400 bg-amber-500/10 border-amber-500/20";
                const companies = Array.isArray(q.companies) ? q.companies : [];

                return (
                  <tr key={q._id} className="group hover:bg-white/5 transition-colors duration-250">
                    <td className="py-4 px-6 align-middle">
                      <button
                        disabled={togglingId === q._id}
                        onClick={() => handleToggleSolve(q._id, q.pattern)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          q.solved
                            ? "bg-orange-500 border-orange-500 text-white scale-110"
                            : "border-white/20 hover:border-orange-500/50 group-hover:scale-105"
                        }`}
                        aria-label={q.solved ? "Mark unsolved" : "Mark solved"}
                      >
                        {q.solved && <Check size={12} strokeWidth={4} />}
                      </button>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <Link
                        to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}/problem/${encodeURIComponent(q._id)}`}
                        className="text-white font-semibold hover:text-orange-400 transition-colors"
                      >
                        {q.title}
                      </Link>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${difficultyColor}`}>
                        {q.difficulty}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                        {formatPattern(q.pattern)}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-white/60 align-middle">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-white/35" />
                        {q.estimatedTime}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <div className="flex flex-wrap gap-1.5">
                        {companies.map((company) => (
                          <span
                            key={company}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-white/50 font-medium"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center align-middle">
                      <a
                        href={q.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-200"
                        aria-label="Open on LeetCode"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PatternQuestions({ embedded = false, topicNameOverride }) {
  if (embedded) {
    return <QuestionListContent topicNameOverride={topicNameOverride} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#070709] flex flex-col md:flex-row gap-3 p-3 overflow-x-hidden">
      <div className="w-full md:w-[85px] lg:w-[90px] md:h-[calc(100vh-24px)] flex-shrink-0">
        <DashLeftNavBar />
      </div>

      <main className="flex-1 min-h-[calc(100vh-112px)] md:h-[calc(100vh-24px)] overflow-y-auto rounded-2xl md:rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-6">
        <QuestionListContent topicNameOverride={topicNameOverride} />
      </main>
    </div>
  );
}

export default PatternQuestions;
