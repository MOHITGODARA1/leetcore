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
  CircleNotch,
} from "@phosphor-icons/react";
import { useGsapEntrance } from "../hooks";
import BorderGlow from "../../../components/ui/BorderGlow";

const topics = [
  {
    title: "Data Structures & Algorithms",
    progress: 0,
    total: 8,
    link: "/dashboard/data-structures-and-algorithms",
    icon: Stack,
    color: "#3b82f6",
  },
  {
    title: "SQL",
    progress: 0,
    total: 5,
    link: "/dashboard/sql",
    icon: Database,
    color: "#22c55e",
  },
  {
    title: "Operating System",
    progress: 0,
    total: 3,
    link: "/dashboard/operating-system",
    icon: Cpu,
    color: "#8b5cf6",
  },
  {
    title: "Computer Networks",
    progress: 0,
    total: 3,
    link: "/dashboard/computer-networks",
    icon: Network,
    color: "#06b6d4",
  },
  {
    title: "System Design",
    progress: 0,
    total: 6,
    link: "/dashboard/system-design",
    icon: Brain,
    color: "#6366f1",
  },
  {
    title: "Low Level Design",
    progress: 0,
    total: 10,
    link: "/dashboard/low-level-design",
    icon: TreeStructure,
    color: "#14b8a6",
  },
  {
    title: "Object Oriented Programming",
    progress: 0,
    total: 5,
    link: "/dashboard/object-oriented-programming",
    icon: Code,
    color: "#10b981",
  },
  {
    title: "Aptitude",
    progress: 0,
    total: 4,
    link: "/dashboard/aptitude",
    icon: Target,
    color: "#f59e0b",
  },
  {
    title: "Programming Fundamentals",
    progress: 0,
    total: 8,
    link: "/dashboard/programming-fundamentals",
    icon: Binary,
    color: "#0ea5e9",
  },
  {
    title: "C++",
    progress: 0,
    total: 4,
    link: "/dashboard/c-plus-plus",
    icon: FileCode,
    color: "#38bdf8",
  },
  {
    title: "Git & GitHub",
    progress: 0,
    total: 8,
    link: "/dashboard/git-and-github",
    icon: GitBranch,
    color: "#f97316",
  },
  {
    title: "Interview Preparation",
    progress: 0,
    total: 6,
    link: "/dashboard/interview-preparation",
    icon: ShieldCheck,
    color: "#f43f5e",
  },
];

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

function TopicCard({ topic }) {
  const percentage = (topic.progress / topic.total) * 100;
  const isInProgress = topic.progress > 0;
  const Icon = topic.icon;
  const iconColor = topic.color || "#d97706";
  const tone = "var(--dash-warning)";
  const soft = "rgba(217, 119, 6, 0.12)";

  return (
    <BorderGlow
      className="border-glow-card--edge-static h-full w-full"
      edgeSensitivity={22}
      glowColor="32 92 46"
      backgroundColor="rgba(255, 255, 255, 0.08)"
      borderRadius={20}
      glowRadius={34}
      glowIntensity={1.1}
      coneSpread={20}
      fillOpacity={0}
      colors={["#d97706", "#f59e0b", "#b45309"]}
    >
      <Link
        to={topic.link}
        className="group relative flex h-full w-full flex-col"
        aria-label={`${topic.title}: ${topic.progress} of ${topic.total} completed`}
      >
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] p-5">
        <div className="relative">
          {/* Header: Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
              style={{ color: iconColor }}
            >
              <Icon size={24} weight="duotone" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[16px] font-semibold leading-snug text-[var(--dash-text)] [text-wrap:balance]">
                {topic.title}
              </h3>
              <p className="mt-1 font-mono text-[12px] font-medium tabular-nums text-[var(--dash-faint)]">
                {topic.progress}/{topic.total} completed
              </p>
            </div>

            <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--dash-line)] text-[var(--dash-faint)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-[var(--dash-line-strong)] group-hover:text-[var(--dash-text)]">
              <ArrowRight size={15} weight="bold" />
            </span>
          </div>

          {/* Progress segments */}
          <div className="mt-6 flex w-full items-center" aria-hidden="true">
            {Array.from({ length: topic.total }).map((_, i) => {
              const isFilled = i < topic.progress;
              const isLast = i === topic.total - 1;

              return (
                <div key={i} className="flex flex-1 items-center last:flex-none">
                  <div
                    className="h-3 w-3 rounded-full transition-all duration-300"
                    style={
                      isFilled
                        ? {
                            backgroundColor: tone,
                            boxShadow: `0 0 0 2px var(--dash-panel), 0 0 0 4px ${soft}`,
                          }
                        : { backgroundColor: "var(--dash-line-strong)" }
                    }
                  />
                  {!isLast && (
                    <div
                      className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: i < topic.progress - 1 ? tone : "var(--dash-line)",
                        opacity: i < topic.progress - 1 ? 0.55 : 1,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">
            <span
              className="text-[11px] font-semibold tracking-wide"
              style={{ color: isInProgress ? tone : "var(--dash-faint)" }}
            >
              {isInProgress ? `${Math.round(percentage)}% complete` : "Not started"}
            </span>

            <span
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--dash-faint)] transition-colors duration-300"
            >
              {isInProgress ? "Continue" : "Start"}
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
    </BorderGlow>
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
  const filtered = filterTopics(topics, activeTab);

  useGsapEntrance(sectionRef, { y: 16, stagger: 0.05 });

  return (
    <div ref={sectionRef} className="pb-6 pt-8">
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((topic) => (
            <div key={topic.title} data-reveal>
              <TopicCard topic={topic} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashTopic;