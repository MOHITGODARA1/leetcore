import { Activity, CheckCircle2, CircleDashed, Circle } from "lucide-react";

const timeAgo = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  const days = Math.floor(minutes / 1440);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const difficultyTone = {
  Easy: "var(--pf-easy)",
  Medium: "var(--pf-medium)",
  Hard: "var(--pf-hard)",
};

function ProblemRow({ problem }) {
  const tone = difficultyTone[problem.difficulty] || "var(--pf-muted)";

  return (
    <li className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-[var(--pf-surface-2)]">
      {problem.accepted ? (
        <CheckCircle2 size={17} className="shrink-0 text-[var(--pf-accepted)]" aria-hidden="true" />
      ) : (
        <CircleDashed size={17} className="shrink-0 text-[var(--pf-attempted)]" aria-hidden="true" />
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-[var(--pf-text)]">{problem.name}</p>
        <p className="mt-0.5 text-[11px] text-[var(--pf-faint)]">
          {problem.topicLabel} · {problem.attempts} attempt{problem.attempts !== 1 ? "s" : ""}
        </p>
      </div>

      <span
        className="shrink-0 rounded px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide"
        style={{ color: tone, backgroundColor: "var(--pf-surface-2)" }}
      >
        {problem.difficulty}
      </span>

      <span
        className="flex w-24 shrink-0 items-center justify-end gap-1.5 text-[11px]"
        style={{ color: problem.accepted ? "var(--pf-accepted)" : "var(--pf-attempted)" }}
      >
        <span aria-hidden="true">✓</span>
        {problem.accepted ? "Accepted" : "Attempted"}
      </span>

      <span className="hidden w-16 shrink-0 text-right text-[11px] tabular-nums text-[var(--pf-faint)] sm:block">
        {timeAgo(problem.at)}
      </span>
    </li>
  );
}

function RecentActivitySection({ recentProblems }) {
  const started = recentProblems || [];

  return (
    <section className="pf-card overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 px-5 pb-3 pt-5 sm:px-6">
        <Activity size={15} className="text-[var(--pf-faint)]" aria-hidden="true" />
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--pf-text)]">Recent Activity</h2>
        {started.length > 0 && (
          <span className="ml-auto text-[11px] tabular-nums text-[var(--pf-faint)]">{started.length} problems</span>
        )}
      </div>

      {started.length === 0 ? (
        <div className="px-6 pb-8 pt-4 text-center">
          <Circle size={18} className="mx-auto text-[var(--pf-faint)]" aria-hidden="true" />
          <p className="mt-2 text-[13px] font-medium text-[var(--pf-text)]">No solved problems yet</p>
          <p className="mt-1 text-[12px] text-[var(--pf-muted)]">
            Your accepted and attempted problems will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--pf-divider)]">
          {started.map((problem) => (
            <ProblemRow key={problem.questionId} problem={problem} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecentActivitySection;