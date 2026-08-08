import { useEffect, useMemo, useState } from "react";
import {
  Flame,
  GitPullRequest,
  Trophy,
  Target,
  BarChart3,
  CircleCheckBig,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import { ACTIVITY_UPDATED_EVENT, getActivitySummary } from "../../../services/activityProgress";

const defaultActivity = {
  solvedCount: 0,
  totalQuestions: 0,
  streakCount: 0,
  readinessScore: 0,
  weeklySolved: 0,
  currentTopic: {
    label: "Arrays",
    solved: 0,
    total: 0,
    percent: 0,
  },
  weeklyProgress: [],
  contestRank: {
    rank: "-",
  },
};

const accent = "var(--lc-orange)";
const accentSoft = "var(--lc-orange-soft)";

function DSARightNavbar() {
  const [activity, setActivity] = useState(defaultActivity);

  useEffect(() => {
    let mounted = true;

    const loadActivity = async () => {
      const summary = await getActivitySummary();
      if (mounted) {
        setActivity(summary || defaultActivity);
      }
    };

    const handleActivityUpdate = (event) => {
      if (event.detail) {
        setActivity(event.detail);
      } else {
        loadActivity();
      }
    };

    loadActivity();
    window.addEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
    window.addEventListener("storage", loadActivity);

    return () => {
      mounted = false;
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
      window.removeEventListener("storage", loadActivity);
    };
  }, []);

  const currentTopic = activity.currentTopic || defaultActivity.currentTopic;
  const questionsLeft = Math.max(0, (activity.totalQuestions || 0) - (activity.solvedCount || 0));
  const rankText = activity.contestRank?.rank && activity.contestRank.rank !== "-"
    ? `#${activity.contestRank.rank}`
    : "--";
  const weeklyProgress = activity.weeklyProgress?.length
    ? activity.weeklyProgress
    : defaultActivity.weeklyProgress;

  const chart = useMemo(() => {
    const days = weeklyProgress.length
      ? weeklyProgress
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
      points,
      polyline: points.map((point) => `${point.x},${point.y}`).join(" "),
    };
  }, [weeklyProgress]);

  return (
    <aside className="hidden xl:flex h-full w-80 shrink-0 flex-col overflow-y-auto p-6">

      {/* Current Journey */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--lc-line)] bg-white/[0.08] p-4">
          <div >
            <Flame size={20} className="text-orange-400" />
          </div>
          <p className="mt-3 text-[13px] text-[var(--lc-muted)]">Day Streak</p>
          <h3 className="mt-0.5 text-2xl font-bold tabular-nums text-[var(--lc-text)]">
            {activity.streakCount || 0}
          </h3>
        </div>

        <div className="rounded-xl border border-[var(--lc-line)] bg-white/[0.08] p-4">
          <div>
            <Target size={16} className="text-green-400" />
          </div>
          <p className="mt-3 text-[13px] text-[var(--lc-muted)]">Questions Left</p>
          <h3 className="mt-0.5 text-2xl font-bold tabular-nums text-[var(--lc-text)]">
            {questionsLeft}
          </h3>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--lc-line)] bg-white/[0.08] p-5">
        <div className="flex items-center gap-2">
          <GitPullRequest size={17} style={{ color: accent }} />
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[var(--lc-text)]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            {currentTopic.label}
          </h2>
        </div>

        <p className="mt-3 text-[13px] font-medium tabular-nums text-[var(--lc-muted)]">
          {currentTopic.solved}/{currentTopic.total} solved
        </p>

        <div className="mt-4">
          <div className="mb-2 flex justify-between text-[12px] text-[var(--lc-muted)]">
            <span>Journey Progress</span>
            <span className="font-semibold tabular-nums text-[var(--lc-text)]">
              {currentTopic.percent || 0}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[var(--lc-input)]">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${currentTopic.percent || 0}%`, backgroundColor: accent }}
            />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--lc-line)] bg-white/[0.08] p-4">
          <div className="grid h-8 w-8 items-center justify-center rounded-lg" style={{ background: accentSoft }}>
            <Trophy size={16} className="text-[var(--lc-orange)]" />
          </div>
          <p className="mt-3 text-[13px] text-[var(--lc-muted)]">Contest Rank</p>
          <h3 className="mt-0.5 text-2xl font-bold tabular-nums text-[var(--lc-text)]">
            {rankText}
          </h3>
        </div>

        <div className="rounded-xl border border-[var(--lc-line)] bg-white/[0.08] p-4">
          <div className="grid h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
            <CircleCheckBig size={16} className="text-emerald-400" />
          </div>
          <p className="mt-3 text-[13px] text-[var(--lc-muted)]">Readiness</p>
          <h3 className="mt-0.5 text-2xl font-bold tabular-nums text-[var(--lc-text)]">
            {activity.readinessScore || 0}%
          </h3>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mt-6 rounded-2xl border border-[var(--lc-line)] bg-white/[0.08] p-5">
        <div className="mb-5 flex items-center gap-2">
          <BarChart3 size={16} style={{ color: accent }} />
          <h2 className="text-[15px] font-semibold text-[var(--lc-text)]">
            Weekly Progress
          </h2>
          <span className="ml-auto text-[12px] font-semibold tabular-nums text-[var(--lc-muted)]">
            {activity.weeklySolved || 0} solved
          </span>
        </div>

        <svg viewBox="0 0 320 120" className="h-32 w-full" fill="none">
          <polyline
            points={chart.polyline}
            stroke="#F2A640"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chart.points.map((point) => (
            <circle
              key={`${point.label}-${point.x}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#F2A640"
            />
          ))}
        </svg>

        <div className="mt-2 flex justify-between text-[11px] font-medium tabular-nums text-[var(--lc-muted)]">
          {chart.days.map((day) => (
            <span key={day.date || day.label}>{day.label}</span>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center pt-6">
        <div
          className="flex w-[90%] justify-between gap-4"
          aria-hidden="true"
        >
          {[
            { icon: FaInstagram, label: "Instagram" },
            { icon: FaLinkedin, label: "LinkedIn" },
            { icon: FaGithub, label: "GitHub" },
            { icon: FaYoutube, label: "YouTube" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="text-[var(--lc-muted)]">
              <Icon size={20} />
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default DSARightNavbar;