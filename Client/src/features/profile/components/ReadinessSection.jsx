import { Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* Placement Readiness — circular score ring + category breakdown drawn as
   compact mini rings instead of progress bars. All values are REAL model
   fields; nothing is invented. */

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ScoreRing({ score }) {
  const tone = score >= 80 ? "var(--accent-success)" : "var(--accent-gold)";
  const dashOffset = RING_CIRCUMFERENCE * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <div className="relative grid place-items-center rounded-full bg-[var(--bg-secondary)] p-2">
      <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" role="img" aria-label={`Placement readiness score ${score} out of 100`}>
        <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="var(--bg-card)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={RING_RADIUS}
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-bold tabular-nums tracking-tight" style={{ color: tone }}>
          {score}
        </p>
        <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]">/ 100</p>
      </div>
    </div>
  );
}

const ringTone = (value) => {
  if (value >= 80) return "var(--accent-success)";
  if (value >= 45) return "var(--accent-gold)";
  return "var(--border-strong)";
};

/* Tiny donut per category — conveys progress without a bar per row. */
const MINI_RADIUS = 20;
const MINI_CIRC = 2 * Math.PI * MINI_RADIUS;

function MiniRing({ label, value }) {
  const tone = ringTone(value);
  const offset = MINI_CIRC * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative">
        <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90" role="img" aria-label={`${label}: ${value}%`}>
          <circle cx="24" cy="24" r={MINI_RADIUS} fill="none" stroke="var(--bg-card-alt)" strokeWidth="4.5" />
          <circle
            cx="24"
            cy="24"
            r={MINI_RADIUS}
            fill="none"
            stroke={tone}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={MINI_CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 400ms ease" }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
          {value}
        </span>
      </div>
      <span className="max-w-[6rem] text-[11px] leading-tight text-[var(--text-muted)]">{label}</span>
    </div>
  );
}

/* Compact snapshot used on the Overview tab — score, status, one-line summary. */
export function ReadinessSnapshot({ readiness }) {
  const { score, status, description } = readiness;

  return (
    <section className="pf-card flex flex-col rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">
          <Gauge size={15} className="text-[var(--pf-faint)]" aria-hidden="true" />
          Placement Readiness
        </h2>
        <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-alt)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-primary)]">
          {status}
        </span>
      </div>

      <div className="mt-5 flex flex-1 items-center gap-6">
        <ScoreRing score={score} />
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] leading-relaxed text-[var(--text-muted)]">{description}</p>
          <Link
            to="/dashboard/data-structures-and-algorithms"
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--accent-gold)] transition-colors duration-150 hover:text-[var(--text-primary)]"
          >
            View full report
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReadinessSection({ readiness }) {
  const { score, status, description, stats, rank, categories } = readiness;

  const checklist = [
    ...(categories || []).map((category) => ({
      label: category.label,
      value: category.score,
    })),
    { label: "Mock Interviews", value: stats?.mockInterviews ?? 0 },
  ];

  return (
    <section className="pf-card rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold tracking-tight text-[var(--text-primary)]">
          <Gauge size={14} className="text-[var(--text-muted)]" aria-hidden="true" />
          Placement Readiness
        </h2>
        {rank && (
          <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-alt)] px-2 py-0.5 text-[11px] tabular-nums text-[var(--text-secondary)]">
            {rank.top} · {rank.rank}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
        {/* Ring + status */}
        <div className="flex flex-col items-center gap-3">
          <ScoreRing score={score} />
          <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-alt)] px-2.5 py-1 text-[12px] font-semibold text-[var(--text-primary)]">
            {status}
          </span>
          <p className="max-w-[210px] text-center text-[11.5px] leading-relaxed text-[var(--text-muted)]">{description}</p>
        </div>

        {/* Category mini-rings */}
        <div className="min-w-0">
          <p className="mb-4 text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)]">Breakdown</p>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
            {checklist.map((item) => (
              <MiniRing key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--border-color)] pt-4 text-[12px] text-[var(--text-muted)]">
            <span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">{stats?.problemsSolved ?? 0}</span> solved
            </span>
            <span>
              <span className="font-semibold tabular-nums text-[var(--text-primary)]">{stats?.consistency ?? 0}%</span> consistency
            </span>
            <Link
              to="/dashboard/data-structures-and-algorithms"
              className="ml-auto inline-flex items-center gap-1 font-semibold text-[var(--accent-gold)] transition-colors duration-150 hover:text-[var(--text-primary)]"
            >
              Roadmap
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReadinessSection;