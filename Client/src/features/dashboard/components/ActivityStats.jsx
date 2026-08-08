import { useRef } from "react";
import {
  CheckCircle,
  Flame,
  Gauge,
  TrendUp,
  ArrowRight,
} from "@phosphor-icons/react";
import {
  useActivitySummary,
  CountUp,
  ProgressBar,
  useGsapEntrance,
} from "../hooks";

function WeeklyChart({ weeklyProgress }) {
  const days =
    weeklyProgress && weeklyProgress.length
      ? weeklyProgress
      : [
          { label: "Mon", solvedCount: 0 },
          { label: "Tue", solvedCount: 0 },
          { label: "Wed", solvedCount: 0 },
          { label: "Thu", solvedCount: 0 },
          { label: "Fri", solvedCount: 0 },
          { label: "Sat", solvedCount: 0 },
          { label: "Sun", solvedCount: 0 },
        ];

  const max = Math.max(1, ...days.map((day) => day.solvedCount || 0));
  const todayIndex = days.findIndex((day) => day.isToday);

  return (
    <div className="flex h-36 items-end gap-2.5 pt-2" role="img" aria-label="Problems solved per day, last 7 days">
      {days.map((day, index) => {
        const height = Math.max(6, Math.round(((day.solvedCount || 0) / max) * 100));
        const isToday = day.isToday || index === todayIndex;
        return (
          <div key={day.date || day.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="h-5 font-mono text-[10px] tabular-nums text-[var(--dash-faint)]">
              {day.solvedCount || ""}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-md transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  day.solvedCount
                    ? isToday
                      ? "dash-bar-today"
                      : "dash-bar-default"
                    : "dash-bar-muted"
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className={`text-[10px] font-medium tabular-nums ${isToday ? "font-semibold text-[var(--dash-accent)]" : "text-[var(--dash-faint)]"}`}>
              {day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sub, tone, soft, isActive }) {
  return (
    <div className="group rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-panel)] p-5 shadow-[var(--shadow-sm)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--dash-line-strong)]">
      <div className="flex items-center justify-between">
        <span
          className="grid h-9 w-9 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: soft, color: tone }}
        >
          <Icon size={17} weight="duotone" />
        </span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-[var(--dash-success)]" : "bg-[var(--dash-line-strong)]"
          }`}
        />
      </div>
      <div
        className="mt-5 font-display text-[26px] font-bold leading-none tabular-nums tracking-tight"
        style={{ color: tone }}
      >
        <CountUp value={value} />
      </div>
      <p className="mt-1.5 text-[13px] font-medium text-[var(--dash-muted)]">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-[var(--dash-faint)]">{sub}</p>}
    </div>
  );
}

function ActivityStats() {
  const activity = useActivitySummary();
  const sectionRef = useRef(null);

  useGsapEntrance(sectionRef, { y: 14 });

  const solved = activity.solvedCount || 0;
  const total = activity.totalQuestions || 0;
  const streak = activity.streakCount || 0;
  const readiness = activity.readinessScore || 0;
  const weekly = activity.weeklySolved || 0;
  const currentTopic = activity.currentTopic || {
    label: "Arrays",
    solved: 0,
    total: 0,
    percent: 0,
  };
  const weeklyProgress = activity.weeklyProgress || [];

  const tiles = [
    {
      key: "solved",
      icon: CheckCircle,
      label: "Solved",
      value: solved,
      tone: "var(--dash-success)",
      soft: "var(--dash-success-soft)",
      active: solved > 0,
      sub: `${Math.round((solved / Math.max(total, 1)) * 100)}% of ${total} questions`,
    },
    {
      key: "streak",
      icon: Flame,
      label: "Day streak",
      value: streak,
      tone: "var(--dash-warning)",
      soft: "var(--dash-warning-soft)",
      active: streak > 0,
      sub: "Keep the momentum",
    },
    {
      key: "readiness",
      icon: Gauge,
      label: "Placement readiness",
      value: readiness,
      tone: "var(--dash-violet)",
      soft: "var(--dash-violet-soft)",
      active: readiness > 0,
      sub: "computed each day",
    },
    {
      key: "week",
      icon: TrendUp,
      label: "Solved this week",
      value: weekly,
      tone: "var(--dash-accent)",
      soft: "var(--dash-accent-soft)",
      active: weekly > 0,
      sub: "past 7 days",
    },
  ];

  return (
    <section ref={sectionRef} className="pt-10">
      <div className="flex items-center justify-between pb-4">
        <div className="dash-eyebrow">
          <span className="dash-eyebrow-dot animate-gentle-pulse" />
          Progress
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--dash-faint)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-success)]" />
          Synced with your activity
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.key} data-reveal>
            <StatTile {...tile} />
          </div>
        ))}
      </div>

      <div data-reveal className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Weekly activity chart */}
        <div className="rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-panel)] p-5 shadow-[var(--shadow-sm)] lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-[var(--dash-text)]">
                Last 7 days
              </h3>
              <p className="mt-1 text-[12px] text-[var(--dash-faint)]">
                Questions solved each day
              </p>
            </div>
            <span className="dash-chip border border-[var(--dash-line)] px-3 py-1 text-[11px] font-semibold tabular-nums text-[var(--dash-accent)]">
              {weekly} solved
            </span>
          </div>
          <div className="mt-6">
            <WeeklyChart weeklyProgress={weeklyProgress} />
          </div>
        </div>

        {/* Current focus progress */}
        <div className="flex flex-col rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-panel)] p-5 shadow-[var(--shadow-sm)] lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--dash-accent-soft)] text-[var(--dash-accent)]">
              <ArrowRight size={16} weight="duotone" />
            </span>
            <h3 className="font-display text-[15px] font-semibold tracking-tight text-[var(--dash-text)]">
              {currentTopic.label || "Arrays"}
            </h3>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-[var(--dash-text)]">
              {currentTopic.solved || 0}
              <span className="text-base text-[var(--dash-faint)]">
                {" "}/ {currentTopic.total || 0}
              </span>
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-[var(--dash-accent)]">
              {currentTopic.percent || 0}%
            </span>
          </div>

          <div className="mt-4">
            <ProgressBar percent={currentTopic.percent} fill="var(--dash-accent)" />
          </div>

          <p className="mt-6 text-[12px] leading-relaxed text-[var(--dash-faint)]">
            Complete this topic to unlock the next module in your roadmap.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ActivityStats;