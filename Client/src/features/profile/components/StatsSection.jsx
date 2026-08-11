function StatName({ children }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--pf-faint)]">{children}</p>;
}

export function StatBand({ stats, contest }) {
  const { solvedCount, totalQuestions, acceptanceRate, currentStreak, longestStreak, totalSubmissions } = stats;
  const overallPercent = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  const isRanked = Boolean(contest?.isRanked);

  const items = [
    {
      label: "Solved",
      value: solvedCount,
      sub: `${overallPercent}% of ${totalQuestions}`,
      valueClass: "text-[var(--pf-text)]",
    },
    {
      label: "Rating",
      value: isRanked ? contest.rating : "—",
      sub: isRanked ? "contest rating" : "not ranked yet",
      valueClass: "text-[var(--pf-text)]",
    },
    {
      label: "Rank",
      value: isRanked ? `#${contest.rank}` : "—",
      sub: isRanked ? `top ${Math.max(1, 100 - (contest.percentile || 0))}%` : "awaiting rank",
      valueClass: "text-[var(--pf-text)]",
    },
    {
      label: "Acceptance",
      value: `${acceptanceRate}%`,
      sub: "avg. of solved",
      valueClass: "text-[var(--pf-accepted)]",
    },
    {
      label: "Streak",
      value: `${currentStreak}d`,
      sub: `longest ${longestStreak}d`,
      valueClass: "text-[var(--pf-text)]",
    },
    {
      label: "Submissions",
      value: totalSubmissions,
      sub: "accepted",
      valueClass: "text-[var(--pf-text)]",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 divide-x divide-y divide-[var(--pf-divider)] overflow-hidden rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] sm:grid-cols-3 lg:grid-cols-6"
      role="list"
      aria-label="Profile statistics"
    >
      {items.map((item) => (
        <div key={item.label} role="listitem" className="bg-transparent px-4 py-3 sm:px-5 sm:py-4">
          <StatName>{item.label}</StatName>
          <p className={`mt-1 text-lg font-semibold tabular-nums tracking-tight sm:text-xl ${item.valueClass}`}>
            {item.value}
          </p>
          <p className="mt-0.5 truncate text-[10.5px] text-[var(--pf-faint)]">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Solved ring: one donut replaces all difficulty progress bars ---------- */

const RING_RADIUS = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SEGMENT_GAP = 3;

function ringSegments(breakdown) {
  const series = [
    { label: "Easy", ...(breakdown?.Easy || { solved: 0, total: 0 }), color: "var(--pf-easy)" },
    { label: "Medium", ...(breakdown?.Medium || { solved: 0, total: 0 }), color: "var(--pf-medium)" },
    { label: "Hard", ...(breakdown?.Hard || { solved: 0, total: 0 }), color: "var(--pf-hard)" },
  ];

  const totalSolved = series.reduce((sum, item) => sum + item.solved, 0);

  let offset = 0;
  const arcs = series
    .filter((item) => item.solved > 0)
    .map((item) => {
      const frac = totalSolved > 0 ? item.solved / totalSolved : 0;
      const arcLength = frac * RING_CIRCUMFERENCE;
      const visible = Math.max(0, arcLength - SEGMENT_GAP);
      const dash = `${visible} ${RING_CIRCUMFERENCE - visible}`;
      const arc = { ...item, dash, offset };
      offset += arcLength;
      return arc;
    });

  return { series, arcs, totalSolved };
}

function LegendRow({ label, solved, total, color }) {
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="flex items-center gap-2 font-medium text-[var(--pf-text)]">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="tabular-nums text-[12px] text-[var(--pf-muted)]">
        <span className="font-semibold text-[var(--pf-text)]">{solved}</span>
        <span className="text-[var(--pf-faint)]">/{total}</span>
        <span className="ml-1.5 text-[var(--pf-faint)]">· {percent}%</span>
      </span>
    </div>
  );
}

export function SolvedRingCard({ stats }) {
  const { solvedCount, totalQuestions, difficultyBreakdown } = stats;
  const overall = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  const { series, arcs, totalSolved } = ringSegments(difficultyBreakdown);

  return (
    <section className="pf-card flex flex-col rounded-2xl p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">Solved by Difficulty</h2>
        <span className="text-[11px] tabular-nums text-[var(--pf-faint)]">
          <span className="font-semibold text-[var(--pf-accent)]">{overall}%</span> complete
        </span>
      </div>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        {/* Donut ring */}
        <div className="relative shrink-0">
          <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90" role="img" aria-label={`${solvedCount} of ${totalQuestions} questions solved`}>
            <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke="var(--pf-surface-2)" strokeWidth="12" />
            {arcs.map((arc) => (
              <circle
                key={arc.label}
                cx="70"
                cy="70"
                r={RING_RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={arc.dash}
                strokeDashoffset={arc.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-4xl font-bold tabular-nums tracking-tight text-[var(--pf-text)]">{totalSolved}</p>
              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--pf-faint)]">solved</p>
            </div>
          </div>
        </div>

        {/* Legend — counts only, no progress bars */}
        <div className="w-full min-w-0 space-y-3.5">
          {series.map((row) => (
            <LegendRow key={row.label} {...row} />
          ))}
          <p className="border-t border-[var(--pf-divider)] pt-3 text-[12px] text-[var(--pf-faint)]">
            {solvedCount} of {totalQuestions} total questions
          </p>
        </div>
      </div>
    </section>
  );
}