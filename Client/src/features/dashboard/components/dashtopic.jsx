import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Stack,
  Database,
  Cpu,
  Network,
  Brain,
  Target,
  TreeStructure,
  Code,
  Binary,
  FileCode,
  GitBranch,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  CircleNotch,
  Lock,
  Hourglass,
} from "@phosphor-icons/react";
import { useGsapEntrance, useActivitySummary } from "../hooks";

const topics = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    total: 8,
    link: "/dashboard/data-structures-and-algorithms",
    icon: Stack,
  },
  {
    id: "sql",
    title: "SQL",
    total: 12,
    link: "/dashboard/sql",
    icon: Database,
  },
  {
    id: "os",
    title: "Operating System",
    total: 3,
    link: "/dashboard/operating-system",
    icon: Cpu,
    locked: true,
  },
  {
    id: "cn",
    title: "Computer Networks",
    total: 3,
    link: "/dashboard/computer-networks",
    icon: Network,
    locked: true,
  },
  {
    id: "system-design",
    title: "System Design",
    total: 6,
    link: "/dashboard/system-design",
    icon: Brain,
    locked: true,
  },
  {
    id: "lld",
    title: "Low Level Design",
    total: 10,
    link: "/dashboard/low-level-design",
    icon: TreeStructure,
    locked: true,
  },
  {
    id: "oop",
    title: "Object Oriented Programming",
    total: 5,
    link: "/dashboard/object-oriented-programming",
    icon: Code,
    locked: true,
  },
  {
    id: "aptitude",
    title: "Aptitude",
    total: 4,
    link: "/dashboard/aptitude",
    icon: Target,
    locked: true,
  },
  {
    id: "programming-fundamentals",
    title: "Programming Fundamentals",
    total: 8,
    link: "/dashboard/programming-fundamentals",
    icon: Binary,
    locked: true,
  },
  {
    id: "cpp",
    title: "C++",
    total: 4,
    link: "/dashboard/c-plus-plus",
    icon: FileCode,
    locked: true,
  },
  {
    id: "git",
    title: "Git & GitHub",
    total: 8,
    link: "/dashboard/git-and-github",
    icon: GitBranch,
    locked: true,
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    total: 6,
    link: "/dashboard/interview-preparation",
    icon: ShieldCheck,
    locked: true,
  },
];

const HINDI = {
  levels: "स्तर",
  progress: "प्रगति",
  percentComplete: "पूर्ण",
  notStarted: "अभी शुरू नहीं",
  inProgress: "प्रगति में",
  completed: "पूर्ण",
  start: "शुरू करें",
  continue: "जारी रखें",
  review: "समीक्षा करें",
};

const filterTopics = (topicsList, activeTab) => {
  if (activeTab === "All Topics") return topicsList;
  if (activeTab === "Algorithms" || activeTab === "Data Structures") {
    return topicsList.filter((t) =>
      ["Data Structures & Algorithms", "Programming Fundamentals", "C++"].includes(t.title)
    );
  }
  if (activeTab === "Database") {
    return topicsList.filter((t) => t.title === "SQL");
  }
  if (activeTab === "Operating System") {
    return topicsList.filter((t) => t.title === "Operating System");
  }
  if (activeTab === "Computer Networks") {
    return topicsList.filter((t) => t.title === "Computer Networks");
  }
  if (activeTab === "OOPs") {
    return topicsList.filter((t) => t.title === "Object Oriented Programming");
  }
  if (activeTab === "System Design") {
    return topicsList.filter((t) => t.title === "System Design");
  }
  if (activeTab === "Low Level Design") {
    return topicsList.filter((t) => t.title === "Low Level Design");
  }
  if (activeTab === "Prep & Tools") {
    return topicsList.filter((t) =>
      ["Aptitude", "Git & GitHub", "Interview Preparation"].includes(t.title)
    );
  }
  return topicsList;
};

/**
 * Resolve real progress for a topic from the live activity summary.
 * The "Data Structures & Algorithms" card aggregates every tracked DSA
 * topic, so its count is the real solved/total across the whole curriculum.
 * Topics without a tracked source yet report 0 with their planned level
 * count (the honest "not started" state).
 */
const resolveProgress = (topic, topicProgress) => {
  if (!topicProgress) return null;

  if (topic.id === "dsa") {
    const agg = topicProgress.reduce(
      (acc, tp) => {
        if (tp.id === "sql") return acc;
        return { solved: acc.solved + (tp.solved || 0), total: acc.total + (tp.total || 0) };
      },
      { solved: 0, total: 0 }
    );
    const solved = agg.solved;
    const total = agg.total || topic.total;
    return { solved, total, percent: total > 0 ? solved / total : 0 };
  }

  const match = topicProgress.find((tp) => tp.id === topic.id);
  if (match && match.total > 0) {
    return { solved: match.solved || 0, total: match.total, percent: match.solved / match.total };
  }

  return { solved: 0, total: topic.total, percent: 0 };
};

/**
 * Single accurate progress track.
 * The fill is the user's real completion fraction (solved / total),
 * so 2/35 levels renders at ~5.7% — never an arbitrary amount.
 */
function ProgressRoadmap({ percent, completed, fill = "var(--dash-success)" }) {
  const pct = completed
    ? 1
    : Math.max(0, Math.min(1, Number(percent) || 0));

  return (
    <div
      className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--dash-line-strong)]"
      role="img"
      aria-label={`${Math.round(pct * 100)} percent complete`}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${pct * 100}%`, backgroundColor: fill }}
      />
    </div>
  );
}

function TopicCard({ topic, onLocked }) {
  const Icon = topic.icon;
  const progress = topic.progress;
  const loading = !progress;
  const solved = progress?.solved ?? 0;
  const total = progress?.total ?? topic.total;
  const percent = progress?.percent ?? 0;
  const isCompleted = percent >= 1 && total > 0;
  const inProgress = solved > 0 && !isCompleted;
  const percentLabel = Math.round(percent * 100);
  const isLocked = topic.locked;

  const sharedClass =
    "group relative flex h-full w-full flex-col rounded-xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

  const iconTileClass =
    "grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--dash-line)] bg-[var(--dash-panel-2)] text-[var(--dash-muted)]";

  if (isLocked) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onLocked?.(topic)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onLocked?.(topic);
          }
        }}
        className={`${sharedClass} cursor-pointer border-dashed border-[var(--dash-line-strong)] bg-[var(--dash-panel)] hover:-translate-y-[2px] hover:border-[var(--dash-line-focus)] hover:bg-[var(--dash-panel-2)] active:scale-[0.99]`}
        aria-label={`${topic.title}: locked, work in progress`}
      >
        {/* Locked badge */}
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-[var(--dash-line)] bg-[var(--dash-panel-2)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--dash-faint)]">
          <Lock size={10} weight="fill" />
          Locked
        </span>

        {/* Header — topic name, left; icon tile, right */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight text-[var(--dash-muted)] [text-wrap:balance]">
              {topic.title}
            </h3>
            <p className="mt-1.5 font-mono text-[12px] font-medium text-[var(--dash-faint)]">
              Coming soon
            </p>
          </div>

          <span className={iconTileClass}>
            <Icon size={40} weight="bold" />
          </span>
        </div>

        {/* Footer — status + action */}
        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between border-t border-[var(--dash-line)] pt-4">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--dash-faint)]">
              <Lock size={13} weight="fill" />
              Locked
            </span>

            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--dash-muted)] transition-colors duration-300 group-hover:text-[var(--dash-text)]">
              Work in progress
              <ArrowRight size={13} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={topic.link}
      className={`${sharedClass} bg-[var(--dash-panel)] hover:-translate-y-[2px] hover:bg-[var(--dash-panel-2)] active:scale-[0.99] ${
        isCompleted
          ? "border-[var(--dash-success-soft)] hover:border-[var(--dash-success)]"
          : "border-[var(--dash-line)] hover:border-[var(--dash-line-strong)]"
      }`}
      aria-label={`${topic.title}: ${solved} of ${total} levels completed`}
    >
      {/* Header — topic name, left; icon tile, right */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight text-[var(--dash-text)] [text-wrap:balance]">
            {topic.title}
          </h3>
          {loading ? (
            <div className="mt-2 h-3 w-24 rounded-full bg-[var(--dash-panel-2)] animate-pulse" />
          ) : (
            <p className="mt-1.5 font-mono text-[12px] font-medium tabular-nums text-[var(--dash-muted)]">
              {solved}
              <span className="text-[var(--dash-faint)]">/{total} levels</span>
            </p>
          )}
        </div>

        <span className={iconTileClass}>
          <Icon size={40} weight="bold" />
        </span>
      </div>

      {/* Progress summary */}
      {loading ? (
        <div className="mt-auto space-y-3 pt-6">
          <div className="h-3 w-32 rounded-full bg-[var(--dash-panel-2)] animate-pulse" />
          <div className="h-2 w-full rounded-full bg-[var(--dash-panel-2)] animate-pulse" />
        </div>
      ) : (
        <div className="mt-auto pt-6">
          <span
            className="font-mono text-[13px] font-semibold tabular-nums tracking-tight"
            style={{ color: isCompleted ? "var(--dash-success)" : "var(--dash-text)" }}
          >
            {percentLabel}
            <span className="text-[var(--dash-faint)]">%</span>
          </span>

          <div className="mt-3">
            <ProgressRoadmap percent={percent} completed={isCompleted} />
          </div>
        </div>
      )}

      {/* Footer — status + action */}
      <div className="mt-5 flex items-center justify-between border-t border-[var(--dash-line)] pt-4">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--dash-success)]">
            <CheckCircle size={14} weight="fill" />
            Completed
          </span>
        ) : inProgress ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--dash-success)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-success)]" />
            In progress
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--dash-faint)]">
            <CircleNotch size={13} weight="duotone" />
            Not started
          </span>
        )}

        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--dash-muted)] transition-colors duration-300 group-hover:text-[var(--dash-text)]">
          {isCompleted ? "Review" : inProgress ? "Continue" : "Start"}
          <ArrowRight size={13} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--dash-line-strong)] bg-[var(--dash-elevated)] px-6 py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl border border-[var(--dash-line)] bg-[var(--dash-panel)] text-[var(--dash-faint)]">
        <CircleNotch size={20} weight="duotone" />
      </span>
      <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-[var(--dash-text)]">
        No topics in this view
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--dash-muted)]">
        Nothing here yet. Try another category or check back soon.
      </p>
    </div>
  );
}

function DashTopic({ activeTab }) {
  const sectionRef = useRef(null);
  const activity = useActivitySummary();
  const topicProgress = Array.isArray(activity.topicProgress) ? activity.topicProgress : [];
  const filtered = filterTopics(topics, activeTab).map((topic) => ({
    ...topic,
    progress: resolveProgress(topic, topicProgress),
  }));
  const [toast, setToast] = useState(null);

  useGsapEntrance(sectionRef, { y: 16, stagger: 0.05 });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div ref={sectionRef} className="pb-6 pt-8">
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((topic) => (
            <div key={topic.id} data-reveal>
              <TopicCard topic={topic} onLocked={setToast} />
            </div>
          ))}
        </div>
      )}

      {/* "Work in progress" toast for locked topics */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-elevated)] px-4 py-3 shadow-[var(--shadow-lg)]"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--dash-warning-soft)] text-[var(--dash-warning)]">
            <Hourglass size={18} weight="duotone" />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[var(--dash-text)]">
              Work is in progress
            </p>
            <p className="text-[12px] text-[var(--dash-muted)]">
              {toast.title} is being built. Check back in an upcoming LeetCore update.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashTopic;