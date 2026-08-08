import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const clampX = (value) => Math.min(Math.max(value, 4), 96);

const buildSmoothPath = (points) => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] || points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
};

function ReadinessSection({ readiness }) {
  const { score, status, description, stats, rank, history } = readiness;

  const scores = history.map((point) => point.score);
  const maxScore = Math.max(...scores, 50);
  const minScore = Math.min(...scores, maxScore);
  const span = Math.max(20, maxScore - minScore);

  const mapped = history.map((point, index) => {
    const x = history.length > 1 ? 6 + (index / (history.length - 1)) * 88 : 50;
    const t = (point.score - minScore) / span;
    const y = 12 + (1 - t) * 76;

    return { ...point, x, y };
  });

  const last = mapped[mapped.length - 1];
  const path = buildSmoothPath(mapped);

  return (
    <section className="pf-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tabular-nums tracking-tight text-[var(--pf-accent)]">{score}</span>
          <span className="text-[13px] text-[var(--pf-faint)]">placement readiness</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[var(--pf-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--pf-accent)]">
            {status}
          </span>
          {rank && (
            <span className="rounded-md bg-[var(--pf-surface-2)] px-2 py-0.5 text-[11px] tabular-nums text-[var(--pf-muted)]">
              {rank.top} · {rank.rank}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[7fr_5fr]">
        <div className="flex flex-col gap-4">
          <div className="space-y-2.5">
            {readiness.categories.map((category) => (
              <div key={category.id}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="text-[var(--pf-muted)]">{category.label}</span>
                  <span className="tabular-nums font-medium text-[var(--pf-text)]">{category.score}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--pf-surface-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--pf-accent)]/85 transition-[width] duration-150"
                    style={{ width: `${category.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[12px] leading-relaxed text-[var(--pf-muted)]">{description}</p>

          <div className="mt-auto flex items-center gap-6 pt-2 text-[12px] text-[var(--pf-faint)]">
            <span>
              <span className="font-semibold tabular-nums text-[var(--pf-text)]">{stats.problemsSolved}</span> solved
            </span>
            <span>
              <span className="font-semibold tabular-nums text-[var(--pf-text)]">{stats.consistency}%</span> consistency
            </span>
            <span>
              <span className="font-semibold tabular-nums text-[var(--pf-text)]">{stats.mockInterviews}</span> mocks
            </span>
            <Link
              to="/dashboard/data-structures-and-algorithms"
              className="ml-auto inline-flex items-center gap-1 font-semibold text-[var(--pf-accent)] transition-colors duration-150 hover:text-[var(--pf-text)]"
            >
              Roadmap
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="relative h-36 sm:h-40">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              role="img"
              aria-label="Placement readiness trend over the last six months"
            >
              <path d={path} fill="none" style={{ stroke: "var(--pf-accent)" }} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {mapped.map((point) => (
              <span
                key={point.date}
                className="absolute h-1.5 w-1.5 rounded-full bg-[var(--pf-accent)]/60"
                style={{ left: `${clampX(point.x)}%`, top: `${point.y}%`, transform: "translate(-50%, -50%)" }}
              />
            ))}

            {last && (
              <>
                <span
                  className="absolute h-2.5 w-2.5 rounded-full border-2 bg-[var(--pf-bg)]"
                  style={{
                    left: `${clampX(last.x)}%`,
                    top: `${last.y}%`,
                    transform: "translate(-50%, -50%)",
                    borderColor: "var(--pf-accent)",
                  }}
                />
                <div
                  className="absolute z-10 whitespace-nowrap rounded-md bg-[var(--pf-surface-3)] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--pf-text)]"
                  style={{
                    left: `${clampX(last.x)}%`,
                    top: `${Math.max(last.y, 10)}%`,
                    transform: "translate(-50%, calc(-100% - 8px))",
                  }}
                >
                  {last.score}%
                </div>
              </>
            )}
          </div>

          <div className="relative mt-2 h-4 border-t border-[var(--pf-divider)]">
            {mapped.map((point) => (
              <span
                key={point.date}
                className="absolute -translate-x-1/2 pt-1 text-[9.5px] font-medium uppercase tracking-wide text-[var(--pf-faint)]"
                style={{ left: `${clampX(point.x)}%` }}
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReadinessSection;