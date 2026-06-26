import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Check,
  ExternalLink,
  Clock,
  Search,
  Award,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Filter
} from "lucide-react";
import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";

function formatDisplayName(str) {
  if (!str) return "";
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function PatternQuestions() {
  const { topic, pattern } = useParams();
  const topicName = decodeURIComponent(topic || "");
  const patternName = decodeURIComponent(pattern || "");

  const { user, setUser } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // XP Toast state
  const [toast, setToast] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(
          `/questions?topic=${encodeURIComponent(topicName)}&pattern=${encodeURIComponent(patternName)}`
        );
        if (isMounted && response.data?.success) {
          setQuestions(response.data.questions || []);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        if (isMounted) {
          setError("Failed to load questions from server");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (topicName && patternName) {
      fetchQuestions();
    }
    return () => {
      isMounted = false;
    };
  }, [topicName, patternName, user?._id]);

  const handleToggleSolve = async (problemId) => {
    if (!user) {
      setToast({ text: "Please sign in to save your progress!", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      setTogglingId(problemId);
      // Optimistic UI Update
      setQuestions(prev =>
        prev.map(q => (q._id === problemId ? { ...q, solved: !q.solved } : q))
      );

      const response = await apiClient.post("/questions/toggle-solve", {
        problemId,
        topic: topicName,
        pattern: patternName
      });

      if (response.data?.success) {
        const isSolved = response.data.solved;

        // Show XP Toast
        setToast({
          text: isSolved ? "+15 XP Earned!" : "-15 XP Removed",
          type: isSolved ? "success" : "info"
        });
        setTimeout(() => setToast(null), 2500);

        // Update Global User Context
        setUser(prevUser => {
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
      // Revert Optimistic UI Update on error
      setQuestions(prev =>
        prev.map(q => (q._id === problemId ? { ...q, solved: !q.solved } : q))
      );
      setToast({ text: "Failed to update progress on server", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setTogglingId(null);
    }
  };

  // Compute stats
  const stats = useMemo(() => {
    const total = questions.length;
    const solved = questions.filter(q => q.solved).length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    // Remaining estimated time of unsolved questions
    let totalMinutesLeft = 0;
    questions.forEach(q => {
      if (!q.solved) {
        const match = q.estimatedTime?.match(/(\d+)/);
        if (match) {
          totalMinutesLeft += parseInt(match[1], 10);
        }
      }
    });

    const hours = Math.floor(totalMinutesLeft / 60);
    const mins = totalMinutesLeft % 60;
    const timeLeftStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    return { total, solved, percentage, timeLeftStr };
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.companies.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
        (q.problemNumber && String(q.problemNumber).includes(search));

      const matchesDifficulty =
        difficultyFilter === "All" || q.difficulty === difficultyFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Solved" && q.solved) ||
        (statusFilter === "Unsolved" && !q.solved);

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [questions, search, difficultyFilter, statusFilter]);

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-[#070709]
        flex
        flex-col
        md:flex-row
        gap-3
        p-3
        overflow-x-hidden
      "
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            flex items-center gap-2
            px-5 py-3 rounded-2xl
            font-bold shadow-xl border
            transition-all duration-300
            ${
              toast.type === "success"
                ? "bg-orange-500/90 text-white border-orange-400 shadow-orange-500/25"
                : toast.type === "error"
                ? "bg-red-500/90 text-white border-red-400 shadow-red-500/25"
                : "bg-zinc-800/95 text-white border-zinc-700 shadow-black/45"
            }
            animate-slide-up-fade
          `}
        >
          <Award className="w-5 h-5 animate-pulse" />
          <span>{toast.text}</span>
        </div>
      )}

      <div
        className="
          w-full
          md:w-[85px]
          lg:w-[90px]
          md:h-[calc(100vh-24px)]
          flex-shrink-0
        "
      >
        <DashLeftNavBar />
      </div>

      <main
        className="
          flex-1
          min-h-[calc(100vh-112px)]
          md:h-[calc(100vh-24px)]
          overflow-y-auto
          rounded-2xl
          md:rounded-3xl
          border
          border-white/5
          bg-white/5
          backdrop-blur-xl
          p-6
          flex
          flex-col
          gap-6
        "
      >
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/50 font-medium">
          <Link
            to="/dashboard"
            className="hover:text-orange-400 transition-colors"
          >
            DSA
          </Link>
          <ChevronRight size={12} />
          <Link
            to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
            className="hover:text-orange-400 transition-colors"
          >
            {topicName}
          </Link>
          <ChevronRight size={12} />
          <span className="text-orange-300">{formatDisplayName(patternName)}</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Link
                to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 text-white/70 hover:text-white transition-all"
              >
                <ArrowLeft size={16} />
              </Link>
              <h1 className="text-3xl font-black text-white tracking-tight">
                {formatDisplayName(patternName)}
              </h1>
            </div>
            <p className="mt-2 text-white/60 text-sm max-w-xl">
              Solve these 20 curated questions to build muscle memory for the{" "}
              <span className="text-orange-400 font-semibold">{formatDisplayName(patternName)}</span> pattern.
            </p>
          </div>

          {/* Dynamic Progress Card */}
          <div className="w-full lg:w-72 p-4 rounded-2xl bg-zinc-900/50 border border-white/10 flex flex-col gap-3">
            <div className="flex justify-between text-xs font-semibold text-white/60">
              <span>PROGRESS</span>
              <span>{stats.solved} / {stats.total} Solved</span>
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

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-zinc-950/40 p-4 rounded-2xl border border-white/5">
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search problem, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-orange-500/40 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 transition-all"
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${
                      difficultyFilter === diff
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
              {["All", "Solved", "Unsolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${
                      statusFilter === status
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions Grid/Table */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-white/60 text-sm">Fetching pattern questions...</p>
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
            <p className="text-white/40 text-sm">
              No questions found matching your search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-zinc-950/20 backdrop-blur-md">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/40">
                  <th className="py-4 px-6 w-16">Status</th>
                  <th className="py-4 px-4 w-12">#</th>
                  <th className="py-4 px-4">Problem</th>
                  <th className="py-4 px-4 w-32">Difficulty</th>
                  <th className="py-4 px-4 w-28">Est. Time</th>
                  <th className="py-4 px-4">Companies</th>
                  <th className="py-4 px-6 w-20 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredQuestions.map((q) => {
                  const isEasy = q.difficulty === "Easy";
                  const isHard = q.difficulty === "Hard";
                  const difficultyColor = isEasy
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : isHard
                    ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    : "text-amber-400 bg-amber-500/10 border-amber-500/20";

                  return (
                    <tr
                      key={q._id}
                      className="group hover:bg-white/5 transition-colors duration-250"
                    >
                      {/* Checkbox toggle status */}
                      <td className="py-4 px-6 align-middle">
                        <button
                          disabled={togglingId === q._id}
                          onClick={() => handleToggleSolve(q._id)}
                          className={`
                            w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
                            ${
                              q.solved
                                ? "bg-orange-500 border-orange-500 text-white scale-110"
                                : "border-white/20 hover:border-orange-500/50 group-hover:scale-105"
                            }
                          `}
                        >
                          {q.solved && <Check size={12} strokeWidth={4} />}
                        </button>
                      </td>

                      {/* Problem number */}
                      <td className="py-4 px-4 text-sm font-semibold text-white/30 align-middle">
                        {q.problemNumber || "-"}
                      </td>

                      {/* Problem Title & LeetCode link */}
                      <td className="py-4 px-4 align-middle">
                        <a
                          href={q.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-orange-400 transition-colors flex items-center gap-1.5"
                        >
                          {q.title}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-white/40 transition-opacity" />
                        </a>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-4 align-middle">
                        <span
                          className={`
                            inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border
                            ${difficultyColor}
                          `}
                        >
                          {q.difficulty}
                        </span>
                      </td>

                      {/* Estimated time */}
                      <td className="py-4 px-4 text-xs text-white/60 align-middle">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-white/35" />
                          {q.estimatedTime}
                        </span>
                      </td>

                      {/* Company Pills */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex flex-wrap gap-1.5">
                          {q.companies.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white/5 border border-white/5 hover:border-white/10 text-[10px] text-white/50 font-medium hover:text-white transition-all cursor-default"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action Link button */}
                      <td className="py-4 px-6 text-center align-middle">
                        <a
                          href={q.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold hover:bg-orange-500 hover:text-white transition-all duration-200
                          "
                        >
                          Practice
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default PatternQuestions;
