import { Trophy, TrendingUp, Users } from "lucide-react";

function WeeklyChart({ weeklySolved }) {
  const maxCount = Math.max(1, ...weeklySolved.map((day) => day.solvedCount));

  return (
    <div className="flex h-24 items-end gap-1.5">
      {weeklySolved.map((day) => {
        const percent = Math.round((day.solvedCount / maxCount) * 100);
        return (
          <div
            key={day.date}
            className="group relative flex flex-1 flex-col items-center justify-end"
          >
            <span className="pointer-events-none absolute -top-5 text-[10px] tabular-nums text-[var(--pf-text)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {day.solvedCount}
            </span>
            <div
              className="w-full rounded-sm bg-[var(--pf-accent)]/80 transition-colors duration-150 group-hover:bg-[var(--pf-accent)]"
              style={{ height: `${Math.max(4, percent)}%` }}
              role="img"
              aria-label={`${day.label}: ${day.solvedCount} solved`}
            />
          </div>
        );
      })}
    </div>
  );
}

function ContestSection({ contest }) {
  const { rank, totalUsers, percentile, isRanked } = contest;
  const weeklySolved = contest.weeklySolved || [];
  const weeklyTotal = weeklySolved.reduce((total, day) => total + (day.solvedCount || 0), 0);

  return (
    <section className="pf-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">
          <Trophy size={15} className="text-[var(--pf-faint)]" />
          Contest Standing
        </h2>
        {isRanked ? (
          <span className="rounded-md bg-[var(--pf-accent-soft)] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--pf-accent)]">
            #{rank}
          </span>
        ) : (
          <span className="rounded-md bg-[var(--pf-surface-2)] px-2 py-0.5 text-[11px] text-[var(--pf-faint)]">unranked</span>
        )}
      </div>

      {isRanked ? (
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--pf-border)] bg-[var(--pf-divider)]">
          <div className="bg-[var(--pf-surface)] px-4 py-3.5">
            <p className="flex items-center gap-1.5 text-[11px] text-[var(--pf-muted)]">
              <TrendingUp size={13} className="text-[var(--pf-faint)]" />
              Rank
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-[var(--pf-text)]">#{rank}</p>
            <p className="mt-0.5 text-[10.5px] tabular-nums text-[var(--pf-faint)]">top {Math.max(1, 100 - (percentile || 0))}%</p>
          </div>
          <div className="bg-[var(--pf-surface)] px-4 py-3.5">
            <p className="flex items-center gap-1.5 text-[11px] text-[var(--pf-muted)]">
              <Users size={13} className="text-[var(--pf-faint)]" />
              Cohort
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-[var(--pf-text)]">{totalUsers}</p>
            <p className="mt-0.5 text-[10.5px] text-[var(--pf-faint)]">ranked users</p>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-[var(--pf-border-strong)] px-4 py-6 text-center">
          <p className="text-[13px] font-medium text-[var(--pf-text)]">No contest data yet</p>
          <p className="mx-auto mt-1 max-w-[240px] text-[12px] leading-relaxed text-[var(--pf-muted)]">
            Your standing appears here once a rating is calculated.
          </p>
        </div>
      )}

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between text-[11px]">
          <span className="text-[var(--pf-muted)]">Activity · last 7 days</span>
          <span className="tabular-nums font-medium text-[var(--pf-text)]">{weeklyTotal} solved</span>
        </div>
        {weeklySolved.length > 0 ? (
          <WeeklyChart weeklySolved={weeklySolved} />
        ) : (
          <p className="py-4 text-center text-[12px] text-[var(--pf-faint)]">No activity this week yet.</p>
        )}
      </div>
    </section>
  );
}

export default ContestSection;