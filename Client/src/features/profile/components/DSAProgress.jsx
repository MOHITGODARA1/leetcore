import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function DSAProgress({ stats }) {
  const { solvedCount, totalQuestions, difficultyBreakdown } = stats;
  const overall = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;

  const rows = [
    {
      label: "Easy",
      solved: difficultyBreakdown?.Easy?.solved || 0,
      total: difficultyBreakdown?.Easy?.total || 0,
      colorVar: "--pf-easy",
    },
    {
      label: "Medium",
      solved: difficultyBreakdown?.Medium?.solved || 0,
      total: difficultyBreakdown?.Medium?.total || 0,
      colorVar: "--pf-medium",
    },
    {
      label: "Hard",
      solved: difficultyBreakdown?.Hard?.solved || 0,
      total: difficultyBreakdown?.Hard?.total || 0,
      colorVar: "--pf-hard",
    },
  ];

  return (
    <section className="pf-card flex flex-col rounded-2xl p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">DSA Progress</h2>
        <span className="text-[11px] tabular-nums text-[var(--pf-faint)]">
          <span className="font-semibold text-[var(--pf-text)]">{solvedCount}</span> / {totalQuestions} questions
        </span>
      </div>

      <div className="mt-4">
        <div className="flex h-2 overflow-hidden rounded-full bg-[var(--pf-surface-2)]">
          <div
            className="h-full rounded-l-full bg-[var(--pf-accent)] transition-[width] duration-150"
            style={{ width: `${overall}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] tabular-nums text-[var(--pf-faint)]">{overall}% complete</p>
      </div>

      <div className="mt-5 space-y-3.5">
        {rows.map((row) => {
          const percent = row.total > 0 ? Math.round((row.solved / row.total) * 100) : 0;
          return (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-[var(--pf-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `var(${row.colorVar})` }} />
                  {row.label}
                </span>
                <span className="tabular-nums text-[var(--pf-faint)]">
                  <span className="font-semibold text-[var(--pf-text)]">{row.solved}</span>/{row.total} · {percent}%
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[var(--pf-surface-2)]">
                <div
                  className="h-full rounded-full transition-[width] duration-150"
                  style={{ width: `${percent}%`, backgroundColor: `var(${row.colorVar})` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Link
        to="/dashboard/data-structures-and-algorithms"
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12px] font-semibold text-[var(--pf-accent)] transition-colors duration-150 hover:text-[var(--pf-text)]"
      >
        Open roadmap
        <ArrowRight size={13} />
      </Link>
    </section>
  );
}

export default DSAProgress;