import { useState, useMemo, useRef } from "react";
import { Activity } from "lucide-react";

const CELL_SIZE = 11;
const CELL_GAP = 3;
const LEFT_PAD = 32;
const TOP_PAD = 20;
const DAY_LABELS = [
  { row: 1, label: "Mon" },
  { row: 3, label: "Wed" },
  { row: 5, label: "Fri" },
];

const LEVEL_COLORS = [
  "var(--pf-heat-0)",
  "var(--pf-heat-1)",
  "var(--pf-heat-2)",
  "var(--pf-heat-3)",
  "var(--pf-heat-4)",
];

function SummaryCell({ label, value, tone = "var(--pf-text)" }) {
  return (
    <div className="px-4 py-2.5 text-center sm:text-left">
      <p className="text-lg font-semibold tabular-nums tracking-tight" style={{ color: tone }}>
        {value}
      </p>
      <p className="mt-0.5 text-[10.5px] text-[var(--pf-faint)]">{label}</p>
    </div>
  );
}

function HeatmapSection({ heatmap, longestStreak }) {
  const [hovered, setHovered] = useState(null);
  const containerRef = useRef(null);

  const layout = useMemo(() => {
    const { columns, monthLabels } = heatmap;
    const width = LEFT_PAD + columns.length * (CELL_SIZE + CELL_GAP);
    const height = TOP_PAD + 7 * CELL_SIZE + 6 * CELL_GAP + 14;

    const monthPositions = monthLabels.map(({ index, label }) => ({
      label,
      x: LEFT_PAD + index * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
    }));

    return { width, height, monthPositions };
  }, [heatmap]);

  const totalSolved = heatmap.totalSolvedInRange || 0;
  const totalActiveDays = heatmap.totalActiveDays || 0;

  const tooltipStyle = hovered
    ? {
        left: Math.min(Math.max(hovered.x + 12, 8), layout.width - 170),
        top: Math.max(hovered.y - 40, 4),
      }
    : {};

  return (
    <section className="pf-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">
          <Activity size={15} className="text-[var(--pf-faint)]" aria-hidden="true" />
          Coding Activity
        </h2>
        <span className="text-[11px] tabular-nums text-[var(--pf-faint)]">contributions over the last year</span>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-[var(--pf-divider)] overflow-hidden rounded-xl border border-[var(--pf-border)]">
        <SummaryCell label="Active days" value={totalActiveDays} tone="var(--pf-accent)" />
        <SummaryCell label="Longest streak" value={`${longestStreak}d`} />
        <SummaryCell label="Solved · year" value={totalSolved} />
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <div ref={containerRef} className="relative inline-block min-w-full">
          <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            className="mx-auto block max-w-full select-none"
            role="img"
            aria-label="Contribution heatmap of daily coding activity over the last year"
          >
            {layout.monthPositions.map((month) => (
              <text key={month.label + month.x} x={month.x} y={8} textAnchor="middle" fontSize="9" fill="var(--pf-faint)">
                {month.label}
              </text>
            ))}

            {DAY_LABELS.map(({ row, label }) => (
              <text
                key={label}
                x={LEFT_PAD - 5}
                y={TOP_PAD - 1 + row * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + 3}
                textAnchor="end"
                fontSize="8.5"
                fill="var(--pf-faint)"
              >
                {label}
              </text>
            ))}

            {heatmap.columns.map((column, columnIndex) => {
              const cellX = LEFT_PAD + columnIndex * (CELL_SIZE + CELL_GAP);

              return column.map((day, rowIndex) => {
                const cellY = TOP_PAD + rowIndex * (CELL_SIZE + CELL_GAP);
                const isHovered = hovered?.date === day.date;

                return (
                  <rect
                    key={day.date}
                    x={cellX}
                    y={cellY}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx="2.5"
                    fill={LEVEL_COLORS[day.level] || LEVEL_COLORS[0]}
                    stroke={isHovered ? "var(--pf-text)" : "none"}
                    strokeWidth={isHovered ? 1.2 : 0}
                    style={{ cursor: "crosshair" }}
                    onMouseEnter={(event) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      if (!rect) return;
                      setHovered({
                        date: day.date,
                        count: day.count,
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top,
                      });
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered({ date: day.date, count: day.count, x: cellX + 6, y: cellY })}
                    role="img"
                    aria-label={`${day.date}: ${day.count} solved`}
                  >
                    <title>{`${day.date}: ${day.count} solved`}</title>
                  </rect>
                );
              });
            })}
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface-3)] px-3 py-1.5 text-xs"
              style={tooltipStyle}
            >
              <span className="font-semibold tabular-nums text-[var(--pf-text)]">
                {hovered.count === 0 ? "No problems" : `${hovered.count} ${hovered.count === 1 ? "problem" : "problems"}`}
              </span>
              <span className="text-[var(--pf-muted)]"> on {hovered.date}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="text-[11px] text-[var(--pf-faint)]">Longest streak {longestStreak} consecutive days</p>

        <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--pf-faint)]">
          <span>Less</span>
          {LEVEL_COLORS.map((color, index) => (
            <span key={index} className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>
  );
}

export default HeatmapSection;