import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Target,
  GitPullRequest,
  BarChart3,
  CheckCircle2,
  CircleDashed,
  Lock,
} from "lucide-react";
import { ACTIVITY_UPDATED_EVENT, getActivitySummary } from "../../../services/activityProgress";
import topicsData from "../data/topics.json";
import { getCompletedTopics } from "../storage";

const ACCENT = "#15803d";
const ACCENT_SOFT = "rgba(21,128,61,0.16)";

const defaultActivity = {
  streakCount: 0,
  readinessScore: 0,
  weeklySolved: 0,
  weeklyProgress: [],
};

function SQLrightnavbar() {
  const [activity, setActivity] = useState(defaultActivity);
  const [completed, setCompleted] = useState(() => getCompletedTopics());

  useEffect(() => {
    let mounted = true;

    const loadActivity = async () => {
      const summary = await getActivitySummary();
      if (mounted) setActivity(summary || defaultActivity);
    };

    const handleActivityUpdate = (event) => {
      if (event.detail) {
        setActivity(event.detail);
      } else {
        loadActivity();
      }
    };

    const syncCompleted = () => setCompleted(getCompletedTopics());

    loadActivity();
    window.addEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, syncCompleted);
    window.addEventListener("storage", syncCompleted);

    return () => {
      mounted = false;
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, syncCompleted);
      window.removeEventListener("storage", syncCompleted);
    };
  }, []);

  const topics = topicsData.topics;
  const completedCount = topics.filter((t) => completed.includes(t.id)).length;
  const currentTopic = topics.find((t) => !completed.includes(t.id));

  const chart = useMemo(() => {
    const days = activity.weeklyProgress?.length
      ? activity.weeklyProgress
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
          label,
          solvedCount: 0,
        }));
    const maxSolved = Math.max(1, ...days.map((day) => day.solvedCount || 0));
    const xStart = 10;
    const xGap = 280 / Math.max(days.length - 1, 1);
    const points = days.map((day, index) => {
      const x = Math.round(xStart + index * xGap);
      const normalized = (day.solvedCount || 0) / maxSolved;
      const y = Math.round(92 - normalized * 74);
      return { ...day, x, y };
    });

    return {
      days,
      polyline: points.map((point) => `${point.x},${point.y}`).join(" "),
    };
  }, [activity.weeklyProgress]);

  return (
    <aside className="hidden lg:flex h-full w-72 shrink-0 flex-col overflow-y-auto p-6 xl:w-80">
      {/* Current Journey */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--lc-line)] bg-white/[0.08] p-4">
          <Flame size={20} className="text-[#4ade80]" />
          <p className="mt-3 text-[13px] text-[var(--lc-muted)]">Day Streak</p>
          <h3 className="mt-0.5 text-2xl font-bold tabular-nums text-[var(--lc-text)]">
            {activity.streakCount || 0}
          </h3>
        </div>

        <div className="rounded-xl border border-[var(--lc-line)] bg-white/[0.08] p-4">
          <Target size={16} className="text-green-400" />
          <p className="mt-3 text-[13px] text-[var(--lc-muted)]">Topics Done</p>
          <h3 className="mt-0.5 text-2xl font-bold tabular-nums text-[var(--lc-text)]">
            {completedCount}
          </h3>
        </div>
      </div>

      {/* Current topic + journey progress */}
      <div className="mt-6 rounded-2xl border border-[var(--lc-line)] bg-white/[0.08] p-5">
        <div className="flex items-center gap-2">
          <GitPullRequest size={17} style={{ color: ACCENT }} />
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[var(--lc-text)]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            {currentTopic?.label || "Journey complete"}
          </h2>
        </div>

        <p className="mt-3 text-[13px] font-medium tabular-nums text-[var(--lc-muted)]">
          {completedCount}/{topics.length} topics
        </p>
      </div>

      {/* Topic guide */}
      <div className="mt-6 rounded-2xl border border-[var(--lc-line)] bg-white/[0.08] p-5">
        <h2 className="text-[15px] font-semibold text-[var(--lc-text)]">Theory Track</h2>
        <ul className="mt-3 space-y-1">
          {topics.map((topic, index) => {
            const isDone = completed.includes(topic.id);
            const isCurrent = currentTopic?.id === topic.id;
            return (
              <li key={topic.id}>
                <Link
                  to={`/dashboard/sql/${topic.id}`}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-150 ${
                    isCurrent
                      ? "bg-[#15803d]/15 text-[#4ade80]"
                      : "text-[var(--lc-muted)] hover:bg-[var(--lc-input)] hover:text-[var(--lc-text)]"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className="font-mono text-[10px] tabular-nums text-[var(--lc-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{topic.label}</span>
                  {isDone ? (
                    <CheckCircle2 size={14} className="shrink-0 text-[#4ade80]" />
                  ) : isCurrent ? (
                    <CircleDashed size={14} className="shrink-0 text-[#4ade80]" />
                  ) : index > 0 && !completed.includes(topics[index - 1].id) ? (
                    <Lock size={12} className="shrink-0 text-[var(--lc-muted)]" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Weekly Progress */}
      <div className="mt-6 rounded-2xl border border-[var(--lc-line)] bg-white/[0.08] p-5">
        <div className="mb-5 flex items-center gap-2">
          <BarChart3 size={16} style={{ color: ACCENT }} />
          <h2 className="text-[15px] font-semibold text-[var(--lc-text)]">Weekly Progress</h2>
          <span className="ml-auto text-[12px] font-semibold tabular-nums text-[var(--lc-muted)]">
            {activity.weeklySolved || 0} solved
          </span>
        </div>

        <svg viewBox="0 0 320 120" className="h-32 w-full" fill="none">
          <polyline points={chart.polyline} stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {chart.days
            .filter((day) => day.solvedCount > 0)
            .map((point) => (
              <circle key={point.label + point.x} cx={point.x} cy={point.y} r="4" fill="#4ade80" />
            ))}
        </svg>

        <div className="mt-2 flex justify-between text-[11px] font-medium tabular-nums text-[var(--lc-muted)]">
          {chart.days.map((day) => (
            <span key={day.date || day.label}>{day.label}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SQLrightnavbar;