import { Activity, Medal, TrendingUp, Users } from "lucide-react";

/* ------------------------------------------------------------------
   Contest Standing
   Line chart of the real readiness-score history (6 monthly points)
   drawn as a single gold line over a dark #3A3A3A grid. "Rating" uses
   contest.rating, which the data model derives from the readiness score.
   ------------------------------------------------------------------ */

const VIEW_W = 400;
const VIEW_H = 170;
const PAD_LEFT = 4;
const PAD_TOP = 10;
const PAD_RIGHT = 4;
const PAD_BOTTOM = 20;

const GRID_HEIGHT = VIEW_H - PAD_TOP - PAD_BOTTOM;

const scoreToXY = (score, minScore, span, index, count) => {
  const x = count > 1 ? PAD_LEFT + (index / (count - 1)) * (VIEW_W - PAD_LEFT - PAD_RIGHT) : VIEW_W / 2;
  const t = span > 0 ? (score - minScore) / span : 0.5;
  const y = PAD_TOP + (1 - t) * GRID_HEIGHT;
  return { x, y };
};

/* Tier label derived purely from the real readiness score — a presentational
   bucketing of real data, not an invented metric. */
const getTier = (score) => {
  if (score >= 80) return { name: "Knight", tone: "var(--accent-gold)" };
  if (score >= 65) return { name: "Soldier", tone: "var(--accent-info)" };
  if (score >= 45) return { name: "Cadet", tone: "var(--text-secondary)" };
  return { name: "Rookie", tone: "var(--text-muted)" };
};

function RatingLineChart({ history }) {
  const scores = history.map((point) => point.score);
  if (scores.length === 0) return null;

  const maxScore = Math.max(...scores, 100);
  const minScore = Math.min(...scores, 0);
  const span = Math.max(20, maxScore - minScore);

  const points = history.map((point, index) => ({
    ...point,
    ...scoreToXY(point.score, minScore, span, index, history.length),
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => PAD_TOP + (1 - t) * GRID_HEIGHT);

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-44 w-full select-none"
        role="img"
        aria-label="Contest rating over the last six months"
      >
        {/* Horizontal grid */}
        {gridLines.map((y) => (
          <line key={y} x1={PAD_LEFT - 2} x2={VIEW_W - PAD_RIGHT} y1={y} y2={y} stroke="var(--border-color)" strokeWidth="1" />
        ))}

        {/* Baseline series */}
        <path d={linePath} fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map((point) => (
          <circle key={point.date} cx={point.x} cy={point.y} r="2.75" fill="var(--bg-card)" stroke="var(--accent-gold)" strokeWidth="1.5">
            <title>{`${point.label}: ${point.score}`}</title>
          </circle>
        ))}

        {/* Last label */}
        {points[points.length - 1] && (
          <text
            x={points[points.length - 1].x}
            y={Math.max(4, points[points.length - 1].y - 8)}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="var(--accent-gold)"
            className="tabular-nums"
          >
            {points[points.length - 1].score}
          </text>
        )}

        {/* Month labels */}
        {points.map((point, index) => {
          const isLast = index === points.length - 1;
          return (
            <text
              key={point.date}
              x={point.x}
              y={VIEW_H - 4}
              textAnchor={isLast ? "end" : index === 0 ? "start" : "middle"}
              fontSize="8.5"
              fill="var(--text-muted)"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function ContestSection({ contest, history }) {
  const { rank, totalUsers, percentile, rating, isRanked } = contest;
  const points = history || [];
  const tier = getTier(rating);
  const topPercent = isRanked ? Math.max(1, 100 - (percentile || 0)) : null;

  return (
    <div className="pf-card rounded-2xl">
      {/* Header card: rating + rank + tier */}
      <div className="grid gap-px overflow-hidden rounded-t-2xl border-b border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-3">
        <div className="bg-[var(--bg-card)] px-5 py-5">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            <TrendingUp size={13} className="text-[var(--text-muted)]" aria-hidden="true" />
            Rating
          </p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-[var(--text-primary)]">
            {isRanked ? rating : "—"}
          </p>
          <p className="mt-0.5 text-[11.5px] text-[var(--text-muted)]">
            {isRanked ? "current contest rating" : "not ranked yet"}
          </p>
        </div>

        <div className="bg-[var(--bg-card)] px-5 py-5">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
            <Users size={13} className="text-[var(--text-muted)]" aria-hidden="true" />
            Global rank
          </p>
          <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight text-[var(--text-primary)]">
            {isRanked ? `#${rank}` : "—"}
          </p>
          <p className="mt-0.5 text-[11.5px] text-[var(--text-muted)]">
            {topPercent != null ? `top ${topPercent}% of ${totalUsers}` : "awaiting first rating"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 bg-[var(--bg-card)] px-5 py-5">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
              <Medal size={13} className="text-[var(--text-muted)]" aria-hidden="true" />
              Tier
            </p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight" style={{ color: tier.tone }}>
              {tier.name}
            </p>
            <p className="mt-0.5 text-[11.5px] text-[var(--text-muted)]">derived from readiness score</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 pb-5 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[13px] font-semibold tracking-tight text-[var(--text-primary)]">
            <Activity size={14} className="text-[var(--text-muted)]" aria-hidden="true" />
            Rating history
          </h2>
          <span className="text-[11.5px] tabular-nums text-[var(--text-muted)]">last 6 months</span>
        </div>

        {points.length > 0 ? (
          <RatingLineChart history={points} />
        ) : (
          <p className="py-10 text-center text-[12.5px] text-[var(--text-muted)]">
            No rating history yet — your trend line appears once you&rsquo;re ranked.
          </p>
        )}
      </div>
    </div>
  );
}

export default ContestSection;