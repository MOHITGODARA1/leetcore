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

function DifficultyRow({ label, solved, total, colorVar }) {
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[13px]">
        <span className="flex items-center gap-2 font-medium text-[var(--pf-text)]">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: `var(${colorVar})` }} />
          {label}
        </span>
        <span className="tabular-nums text-[12px] text-[var(--pf-muted)]">
          <span className="font-semibold text-[var(--pf-text)]">{solved}</span>
          <span className="text-[var(--pf-faint)]">/{total}</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${label} problems solved ${percent}%`}
        className="h-1.5 overflow-hidden rounded-full bg-[var(--pf-surface-2)]"
      >
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%`, backgroundColor: `var(${colorVar})` }}
        />
      </div>
    </div>
  );
}

export function ProblemDistribution({ difficultyBreakdown, solvedCount, totalQuestions }) {
  const rows = [
    { label: "Easy", ...(difficultyBreakdown?.Easy || { solved: 0, total: 0 }), colorVar: "--pf-easy" },
    { label: "Medium", ...(difficultyBreakdown?.Medium || { solved: 0, total: 0 }), colorVar: "--pf-medium" },
    { label: "Hard", ...(difficultyBreakdown?.Hard || { solved: 0, total: 0 }), colorVar: "--pf-hard" },
  ];

  return (
    <section className="pf-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">Solved by Difficulty</h2>
        <span className="text-[11px] tabular-nums text-[var(--pf-faint)]">
          <span className="font-semibold text-[var(--pf-accent)]">{solvedCount}</span> / {totalQuestions}
        </span>
      </div>
      <div className="mt-5 space-y-5">
        {rows.map((row) => (
          <DifficultyRow key={row.label} {...row} />
        ))}
      </div>
    </section>
  );
}

export function StreakCard({ stats }) {
  const { currentStreak, longestStreak, solvedCount, totalQuestions } = stats;
  const ratio = longestStreak > 0 ? Math.round((currentStreak / longestStreak) * 100) : 0;
  const overall = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  return (
    <section className="pf-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">Streak</h2>
        <span className="text-[12px] tabular-nums text-[var(--pf-faint)]">
          longest <span className="font-semibold text-[var(--pf-text)]">{longestStreak}d</span>
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold tabular-nums tracking-tight text-[var(--pf-accent)]">{currentStreak}</span>
        <span className="text-[13px] text-[var(--pf-faint)]">days</span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[var(--pf-muted)]">Current vs longest</span>
            <span className="tabular-nums font-medium text-[var(--pf-text)]">
              {currentStreak} / {longestStreak}
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-[var(--pf-surface-2)]"
            role="progressbar"
            aria-valuenow={ratio}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Current streak relative to longest"
          >
            <div className="h-full rounded-full bg-[var(--pf-accent)] transition-[width] duration-150" style={{ width: `${ratio}%` }} />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[var(--pf-muted)]">Overall progress</span>
            <span className="tabular-nums font-medium text-[var(--pf-text)]">{overall}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--pf-surface-2)]">
            <div className="h-full rounded-full bg-[var(--pf-surface-3)] transition-[width] duration-150" style={{ width: `${overall}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}