import {
  MagnifyingGlass,
  ArrowsDownUp,
  SlidersHorizontal,
  Flame,
} from "@phosphor-icons/react";
import { useActivitySummary, CountUp } from "../hooks";

const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

function ProgressRing({ solved = 0, total = 0 }) {
  const percent = total > 0 ? Math.min(100, (solved / total) * 100) : 0;
  const dashOffset = RING_C * (1 - percent / 100);

  return (
    <div className="relative h-11 w-11">
      <svg viewBox="0 0 44 44" width="44" height="44" className="-rotate-90">
        <circle
          cx="22"
          cy="22"
          r={RING_R}
          fill="none"
          stroke="var(--dash-line)"
          strokeWidth="3.5"
        />
        <circle
          cx="22"
          cy="22"
          r={RING_R}
          fill="none"
          stroke="var(--dash-accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={dashOffset}
          opacity="0.9"
          className="transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </svg>
    </div>
  );
}

function Searchbar() {
  const { solvedCount = 0, totalQuestions = 0, streakCount = 0 } =
    useActivitySummary();

  return (
    <div className="flex w-full flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
      {/* Search + actions */}
      <div className="flex items-center gap-3">
        <label className="group flex h-11 w-full max-w-[272px] cursor-text items-center gap-3 rounded-xl border border-[var(--dash-line)] bg-[var(--dash-panel)] px-4 shadow-[var(--shadow-sm)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:border-[var(--dash-accent)] focus-within:ring-4 focus-within:ring-[var(--dash-accent-softer)]">
          <MagnifyingGlass
            size={17}
            weight="duotone"
            className="shrink-0 text-[var(--dash-faint)] transition-colors duration-200 group-focus-within:text-[var(--dash-accent)]"
          />
          <input
            type="text"
            placeholder="Search topics"
            className="w-full bg-transparent text-[14px] text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-faint)]"
          />
          <kbd className="hidden shrink-0 rounded-md border border-[var(--dash-line)] bg-[var(--dash-panel-2)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--dash-faint)] sm:block">
            /
          </kbd>
        </label>

        <button
          type="button"
          aria-label="Sort topics"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--dash-line)] bg-[var(--dash-panel)] text-[var(--dash-muted)] shadow-[var(--shadow-sm)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--dash-accent)] hover:text-[var(--dash-accent)] active:translate-y-0 active:scale-[0.97]"
        >
          <ArrowsDownUp size={16} weight="duotone" />
        </button>

        <button
          type="button"
          aria-label="Filter topics"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--dash-line)] bg-[var(--dash-panel)] text-[var(--dash-muted)] shadow-[var(--shadow-sm)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--dash-accent)] hover:text-[var(--dash-accent)] active:translate-y-0 active:scale-[0.97]"
        >
          <SlidersHorizontal size={16} weight="duotone" />
        </button>
      </div>

      {/* Progress readout */}
      <div className="flex items-center gap-3.5">
        <ProgressRing solved={solvedCount} total={totalQuestions} />
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline gap-1.5 font-mono text-sm tabular-nums">
            <span className="font-display text-lg font-bold text-[var(--dash-text)]">
              <CountUp value={solvedCount} />
            </span>
            <span className="text-[var(--dash-faint)]">/ {totalQuestions}</span>
          </div>
          <span className="text-[11px] font-medium text-[var(--dash-faint)]">
            problems solved
          </span>
        </div>
        {streakCount > 0 && (
          <span className="hidden items-center gap-1.5 rounded-full border border-[var(--dash-warning-soft)] bg-[var(--dash-warning-soft)] px-3 py-1.5 text-[12px] font-semibold tabular-nums text-[var(--dash-warning)] sm:inline-flex">
            <Flame size={14} weight="fill" />
            {streakCount}-day streak
          </span>
        )}
      </div>
    </div>
  );
}

export default Searchbar;