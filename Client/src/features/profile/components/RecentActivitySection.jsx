import {
  Activity,
  CheckCircle2,
  CircleDashed,
  Crown,
  Flame,
  Layers,
  Medal,
  Rocket,
  Sparkles,
  Star,
} from "lucide-react";

const timeAgo = (isoString) => {
  if (!isoString) return "—";
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
  Easy: "var(--accent-success)",
  Medium: "var(--accent-gold)",
  Hard: "var(--accent-error)",
};

/* Map the achievement "icon" string from profileData to a real icon + tone.
   Milestones render gold, solve/consistency events render green. */
const ACHIEVEMENT_ICONS = {
  rocket: { Icon: Rocket, tone: "var(--accent-gold)" },
  star: { Icon: Star, tone: "var(--accent-gold)" },
  medal: { Icon: Medal, tone: "var(--accent-gold)" },
  flame: { Icon: Flame, tone: "var(--accent-gold)" },
  crown: { Icon: Crown, tone: "var(--accent-gold)" },
  layers: { Icon: Layers, tone: "var(--accent-info)" },
  "circle-check": { Icon: CheckCircle2, tone: "var(--accent-success)" },
  sparkles: { Icon: Sparkles, tone: "var(--text-muted)" },
};

const getTs = (event) => {
  if (!event.at) return -Infinity;
  return new Date(event.at).getTime();
};

function TimelineRow({ isLast }) {
  if (isLast) return null;
  return (
    <span
      className="pointer-events-none absolute left-[17px] top-0 bottom-0 hidden w-px -translate-x-1/2 bg-[var(--border-color)] sm:block"
      aria-hidden="true"
    />
  );
}

function RecentActivitySection({ recentProblems, achievements }) {
  const submissions = (recentProblems || []).map((problem) => ({
    kind: "submission",
    at: problem.at,
    icon: problem.accepted ? CheckCircle2 : CircleDashed,
    tone: problem.accepted ? "var(--accent-success)" : "var(--accent-error)",
    title: problem.name,
    meta: `${problem.topicLabel} · ${problem.attempts} attempt${problem.attempts !== 1 ? "s" : ""}`,
    difficulty: problem.difficulty,
    accepted: problem.accepted,
  }));

  const badges = (achievements || []).map((achievement) => {
    const { Icon, tone } = ACHIEVEMENT_ICONS[achievement.icon] || { Icon: Sparkles, tone: "var(--text-muted)" };
    return {
      kind: "badge",
      at: achievement.date,
      icon: Icon,
      tone,
      title: achievement.title,
      meta: achievement.description,
    };
  });

  const merged = [...submissions, ...badges].sort((a, b) => getTs(b) - getTs(a));

  return (
    <section className="pf-card overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-5 py-4">
        <Activity size={14} className="text-[var(--text-muted)]" aria-hidden="true" />
        <h2 className="text-[13px] font-semibold tracking-tight text-[var(--text-primary)]">Recent Activity</h2>
        {merged.length > 0 && (
          <span className="ml-auto text-[11.5px] tabular-nums text-[var(--text-muted)]">{merged.length} events</span>
        )}
      </div>

      {merged.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <CircleDashed size={18} className="mx-auto text-[var(--text-muted)]" aria-hidden="true" />
          <p className="mt-2 text-[13px] font-medium text-[var(--text-primary)]">No activity yet</p>
          <p className="mt-1 text-[12px] text-[var(--text-muted)]">
            Your submissions and earned badges will appear here.
          </p>
        </div>
      ) : (
        <ul className="px-5 py-4 sm:px-6">
          {merged.map((event, index) => {
            const Icon = event.icon;
            return (
              <li key={`${event.kind}-${event.title}-${index}`} className="relative flex gap-3.5 pb-5">
                <TimelineRow isLast={index === merged.length - 1} />
                <span
                  className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--border-color)] bg-[var(--bg-card-alt)]"
                  style={{ color: event.tone }}
                >
                  <Icon size={15} aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{event.title}</p>
                      <p className="mt-0.5 text-[11.5px] leading-relaxed text-[var(--text-muted)]">{event.meta}</p>
                    </div>
                    <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-muted)]">{timeAgo(event.at)}</span>
                  </div>

                  {event.difficulty && (
                    <span
                      className="mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{
                        color: difficultyTone[event.difficulty],
                        backgroundColor: "var(--bg-secondary)",
                      }}
                    >
                      {event.difficulty}
                      {event.accepted ? " · accepted" : " · attempted"}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default RecentActivitySection;