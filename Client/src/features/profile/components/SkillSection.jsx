import { Code2 } from "lucide-react";

const progressColor = (percent) => {
  if (percent >= 75) return "var(--pf-easy)";
  if (percent >= 40) return "var(--pf-medium)";
  return "var(--pf-hard)";
};

function SkillBar({ label, solved, total, percent }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[9.5rem] shrink-0 truncate text-[12.5px] text-[var(--pf-muted)]">{label}</span>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--pf-surface-2)]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${label} progress ${percent}%`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%`, backgroundColor: progressColor(percent) }}
        />
      </div>
      <span className="w-16 shrink-0 text-right text-[12px] tabular-nums text-[var(--pf-muted)]">
        <span className="font-semibold text-[var(--pf-text)]">{solved}</span>
        <span className="text-[var(--pf-faint)]">/{total}</span>
      </span>
    </div>
  );
}

function SkillSection({ topicProgress }) {
  const active = [...(topicProgress || [])]
    .filter((topic) => topic.total > 0)
    .sort((a, b) => b.percent - a.percent);

  const started = active.filter((topic) => topic.solved > 0).length;
  const avg = active.length > 0 ? Math.round(active.reduce((sum, topic) => sum + topic.percent, 0) / active.length) : 0;

  return (
    <section className="pf-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">LeetCore Skills</h2>
        <p className="text-[11px] tabular-nums text-[var(--pf-faint)]">
          <span className="font-semibold text-[var(--pf-accent)]">{started}</span> topics in progress
          <span className="mx-1.5 text-[var(--pf-divider)]">·</span>
          avg <span className="font-semibold text-[var(--pf-text)]">{avg}%</span>
        </p>
      </div>

      <div className="mt-5 space-y-2.5">
        {active.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[var(--pf-faint)]">
            Solve your first problem to see your topic performance.
          </p>
        ) : (
          active.map((topic) => <SkillBar key={topic.id} {...topic} />)
        )}
      </div>
    </section>
  );
}

export default SkillSection;