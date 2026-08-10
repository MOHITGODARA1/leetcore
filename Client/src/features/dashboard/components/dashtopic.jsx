import { useRef } from "react";
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
  Check,
  CheckCircle,
  CircleNotch,
} from "@phosphor-icons/react";
import { useGsapEntrance, useActivitySummary } from "../hooks";

const topics = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    total: 8,
    link: "/dashboard/data-structures-and-algorithms",
    icon: Stack,
    color: "#3b82f6",
  },
  {
    id: "sql",
    title: "SQL",
    total: 5,
    link: "/dashboard/sql",
    icon: Database,
    color: "#22c55e",
  },
  {
    id: "os",
    title: "Operating System",
    total: 3,
    link: "/dashboard/operating-system",
    icon: Cpu,
    color: "#8b5cf6",
  },
  {
    id: "cn",
    title: "Computer Networks",
    total: 3,
    link: "/dashboard/computer-networks",
    icon: Network,
    color: "#06b6d4",
  },
  {
    id: "system-design",
    title: "System Design",
    total: 6,
    link: "/dashboard/system-design",
    icon: Brain,
    color: "#6366f1",
  },
  {
    id: "lld",
    title: "Low Level Design",
    total: 10,
    link: "/dashboard/low-level-design",
    icon: TreeStructure,
    color: "#14b8a6",
  },
  {
    id: "oop",
    title: "Object Oriented Programming",
    total: 5,
    link: "/dashboard/object-oriented-programming",
    icon: Code,
    color: "#10b981",
  },
  {
    id: "aptitude",
    title: "Aptitude",
    total: 4,
    link: "/dashboard/aptitude",
    icon: Target,
    color: "#f59e0b",
  },
  {
    id: "programming-fundamentals",
    title: "Programming Fundamentals",
    total: 8,
    link: "/dashboard/programming-fundamentals",
    icon: Binary,
    color: "#0ea5e9",
  },
  {
    id: "cpp",
    title: "C++",
    total: 4,
    link: "/dashboard/c-plus-plus",
    icon: FileCode,
    color: "#38bdf8",
  },
  {
    id: "git",
    title: "Git & GitHub",
    total: 8,
    link: "/dashboard/git-and-github",
    icon: GitBranch,
    color: "#f97316",
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    total: 6,
    link: "/dashboard/interview-preparation",
    icon: ShieldCheck,
    color: "#f43f5e",
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
      (acc, tp) => ({ solved: acc.solved + (tp.solved || 0), total: acc.total + (tp.total || 0) }),
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

/* Roadmap checkpoints across the track, in completion fraction */
const CHECKPOINTS = [0, 0.25, 0.5, 0.75, 1];

/**
 * Thick roadmap track with circular milestone nodes.
 * The track fill is the user's real completion fraction (solved / total),
 * so 2/35 levels renders at ~5.7% — never an arbitrary amount.
 */
function ProgressRoadmap({ percent, completed }) {
  const pct = Math.max(0, Math.min(1, Number(percent) || 0));
  const isDone = completed || pct >= 1;
  const current = CHECKPOINTS.find((c) => pct === 0 || c > pct);

  return (
    <div
      className="relative"
      role="img"
      aria-label={`${Math.round(pct * 100)} percent complete`}
    >
      {/* Track */}
      <div className="h-2 w-full rounded-full bg-[var(--dash-line-strong)]" />
      {/* Accurate fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[var(--dash-success)]"
        style={{ width: `${pct * 100}%` }}
      />
      {/* Milestone nodes */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        {CHECKPOINTS.map((checkpoint) => {
          const reached = pct > 0 && pct >= checkpoint;
          const isCurrent = checkpoint === current;
          return (
            <div
              key={checkpoint}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${checkpoint * 100}%` }}
            >
              {isDone || reached ? (
                <span className="grid h-[13px] w-[13px] place-items-center rounded-full bg-[var(--dash-success)] ring-2 ring-[var(--dash-panel)]">
                  {isDone ? (
                    <Check size={8} weight="bold" className="text-[var(--dash-bg)]" />
                  ) : (
                    <span className="h-[5px] w-[5px] rounded-full bg-[var(--dash-bg)]" />
                  )}
                </span>
              ) : isCurrent ? (
                <span className="grid h-[15px] w-[15px] place-items-center rounded-full border-2 border-[var(--dash-success)] bg-[var(--dash-panel)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-success)]" />
                </span>
              ) : (
                <span className="h-[11px] w-[11px] rounded-full bg-[var(--dash-line-strong)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopicCard({ topic }) {
  const Icon = topic.icon;
  const progress = topic.progress;
  const loading = !progress;
  const solved = progress?.solved ?? 0;
  const total = progress?.total ?? topic.total;
  const percent = progress?.percent ?? 0;
  const isCompleted = percent >= 1 && total > 0;
  const inProgress = solved > 0 && !isCompleted;
  const percentLabel = Math.round(percent * 100);

  return (
    <Link
      to={topic.link}
      className="group relative flex h-full w-full flex-col rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-panel)] p-5 shadow-[var(--shadow-xs)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:border-[var(--dash-line-strong)] hover:bg-[var(--dash-panel-2)]"
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

        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[var(--dash-line)] bg-[var(--dash-panel-2)] text-[var(--dash-muted)] transition-colors duration-300 group-hover:text-[var(--dash-text)]">
          <Icon size={25} weight="duotone" />
        </span>
      </div>

      {/* Progress summary */}
      {loading ? (
        <div className="mt-auto space-y-3 pt-8">
          <div className="h-3 w-32 rounded-full bg-[var(--dash-panel-2)] animate-pulse" />
          <div className="h-2 w-full rounded-full bg-[var(--dash-panel-2)] animate-pulse" />
        </div>
      ) : (
        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[13px] font-semibold tabular-nums tracking-tight"
              style={{ color: isCompleted ? "var(--dash-success)" : "var(--dash-text)" }}
            >
              {percentLabel}
              <span className="text-[var(--dash-faint)]">%</span>
            </span>
            <span className="text-[11px] font-medium text-[var(--dash-faint)]">
              of curriculum complete
            </span>
          </div>

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
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--dash-accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-accent)]" />
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
  const topicProgress = activity.topicProgress;
  const filtered = filterTopics(topics, activeTab).map((topic) => ({
    ...topic,
    progress: resolveProgress(topic, topicProgress),
  }));

  useGsapEntrance(sectionRef, { y: 16, stagger: 0.05 });

  return (
    <div ref={sectionRef} className="pb-6 pt-8">
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((topic) => (
            <div key={topic.id} data-reveal>
              <TopicCard topic={topic} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashTopic;