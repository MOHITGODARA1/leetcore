import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Code2,
  Lock,
} from "lucide-react";
import topicsData from "../data/topics.json";
import theoryData from "../data/theory.json";
import { getCompletedTopics, setCompletedTopic } from "../storage";
import { ACTIVITY_UPDATED_EVENT } from "../../../services/activityProgress";

function CodeBlock({ sql }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--lc-line)] bg-[#0b0b0d]">
      <div className="flex items-center gap-2 border-b border-[var(--lc-line)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--lc-muted)]">
        <Code2 size={13} />
        SQL
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[#7dd3a8]">
        <code>{sql}</code>
      </pre>
    </div>
  );
}

function Tip({ text }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--lc-line)] bg-[#15803d]/10 px-4 py-3.5">
      <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#4ade80]" />
      <p className="text-[13px] leading-relaxed text-[var(--lc-text)]/85">{text}</p>
    </div>
  );
}

function Section({ section }) {
  switch (section.type) {
    case "intro":
      return <p className="text-[15px] leading-relaxed text-[var(--lc-text)]/85">{section.text}</p>;
    case "heading":
      return <h2 className="text-lg font-bold tracking-tight text-[var(--lc-text)]">{section.text}</h2>;
    case "paragraph":
      return <p className="text-sm leading-relaxed text-[var(--lc-text)]/70">{section.text}</p>;
    case "code":
      return <CodeBlock sql={section.sql} />;
    case "list":
      return (
        <div>
          {section.title ? (
            <h3 className="mb-2.5 text-[13px] font-semibold tracking-tight text-[var(--lc-text)]">{section.title}</h3>
          ) : null}
          <ul className="space-y-2">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--lc-text)]/70">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "tip":
    case "tiptext":
      return <Tip text={section.text} />;
    default:
      return null;
  }
}

function SQLtopic({ topicId }) {
  const navigate = useNavigate();
  const topicKey = topicId ? topicId.toLowerCase() : "";
  const data = theoryData[topicKey];

  const [completedTopics, setCompletedTopics] = useState(() => getCompletedTopics());
  const completed = completedTopics.includes(topicKey);

  useEffect(() => {
    const sync = () => setCompletedTopics(getCompletedTopics());
    window.addEventListener("storage", sync);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, sync);
    };
  }, []);

  // Lock check — same sequential unlock as the roadmap
  useEffect(() => {
    if (!topicKey) return;
    const node = topicsData.topics.find((t) => t.id === topicKey);
    if (!node) return;

    const isUnlocked = () => {
      if (node.order === 0) return true;
      const prev = topicsData.topics.find((t) => t.order === node.order - 1);
      if (!prev) return false;
      return getCompletedTopics().includes(prev.id);
    };

    if (!isUnlocked()) {
      navigate("/dashboard/sql", { replace: true });
    }
  }, [topicKey, navigate]);

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-[var(--lc-line)] bg-[var(--lc-panel)] text-[var(--lc-muted)]">
          <Lock size={20} />
        </span>
        <p className="text-sm text-[var(--lc-muted)]">Topic not found.</p>
        <Link to="/dashboard/sql" className="text-sm font-semibold text-[#4ade80] hover:text-[var(--lc-text)]">
          Back to roadmap
        </Link>
      </div>
    );
  }

  const node = topicsData.topics.find((t) => t.id === topicKey);
  const prevNode = topicsData.topics.find((t) => t.order === (node?.order || 0) - 1);
  const nextNode = topicsData.topics.find((t) => t.order === (node?.order || 0) + 1);
  const nextUnlocked = nextNode ? completed : false;

  const handleComplete = () => {
    setCompletedTopic(topicKey);
    setCompletedTopics(getCompletedTopics());
  };

  const journeyPercent =
    topicsData.topics.length > 0
      ? Math.round((completedTopics.length / topicsData.topics.length) * 100)
      : 0;

  return (
    <div className="h-full overflow-y-auto pr-1 scroll-smooth">
      <div className="mx-auto max-w-3xl pb-10 pt-2">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/sql"
            className="lc-pressable flex items-center gap-1.5 rounded-lg border border-[var(--lc-line)] bg-[var(--lc-input)] px-3 py-1.5 text-[12px] font-medium text-[var(--lc-muted)] hover:text-[var(--lc-text)] transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Roadmap
          </Link>
          <span className="font-mono text-[11px] text-[var(--lc-muted)]">
            Station {node?.order != null && node.order + 1} of {topicsData.topics.length}
          </span>
        </div>

        {/* Journey progress — always visible on the topic page */}
        <div className="mt-4 rounded-xl border border-[var(--lc-line)] bg-[var(--lc-panel)] p-4">
          <div className="flex items-center justify-between gap-3 text-[12px]">
            <span className="flex items-center gap-2 font-semibold text-[var(--lc-text)]">
              <GraduationCap size={14} className="text-[#4ade80]" />
              Journey Progress
            </span>
            <span className="font-semibold tabular-nums text-[var(--lc-text)]">
              {completedTopics.length}
              <span className="font-normal text-[var(--lc-muted)]"> / {topicsData.topics.length} stations</span>
            </span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[var(--lc-input)]">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${journeyPercent}%`, backgroundColor: "#4ade80" }}
            />
          </div>
          <p className="mt-2 text-[11px] text-[var(--lc-muted)]">
            {journeyPercent}% of journey
            {nextNode ? ` · Complete this station to unlock ${nextNode.label}` : " · all stations complete"}
          </p>
        </div>

        {/* Article header */}
        <header className="mt-6">
          <div className="flex items-center gap-2 rounded-md border border-[#15803d]/30 bg-[#15803d]/10 px-2.5 py-1 text-[11px] font-semibold text-[#4ade80] w-fit">
            <GraduationCap size={12} />
            THEORY
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--lc-text)] sm:text-4xl">
            {data.title}
          </h1>
          <p className="mt-2 font-mono text-[13px] text-[#4ade80]">{data.subtitle}</p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--lc-text)]/75">{data.summary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {completed ? (
              <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[13px] font-semibold text-emerald-400">
                <CheckCircle2 size={16} />
                Completed
              </span>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="lc-pressable inline-flex items-center gap-2 rounded-xl bg-[#16a34a] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#15803d]"
              >
                <Check size={16} />
                Mark as complete
              </button>
            )}
          </div>
        </header>

        {/* Theory body */}
        <div className="mt-8 space-y-6">
          {data.sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div>

        {/* Key takeaways */}
        {data.keypoints?.length > 0 && (
          <div className="mt-10 rounded-2xl border border-[var(--lc-line)] bg-[var(--lc-panel)] p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight text-[var(--lc-text)]">
              <ListChecks size={16} className="text-[#4ade80]" />
              Key takeaways
            </h2>
            <ul className="mt-4 space-y-2.5">
              {data.keypoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[var(--lc-text)]/70">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prev / next navigation */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--lc-line)] pt-6">
          {prevNode ? (
            <Link
              to={`/dashboard/sql/${prevNode.id}`}
              className="group flex min-w-0 items-center gap-2 text-[13px] text-[var(--lc-muted)] hover:text-[var(--lc-text)] transition-colors duration-200"
            >
              <ArrowLeft size={14} className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="truncate">{prevNode.label}</span>
            </Link>
          ) : (
            <span />
          )}

          {nextNode &&
            (nextUnlocked ? (
              <Link
                to={`/dashboard/sql/${nextNode.id}`}
                className="group flex min-w-0 items-center gap-2 rounded-xl border border-[#15803d]/30 bg-[#15803d]/10 px-4 py-2 text-[13px] font-semibold text-[#4ade80] transition-colors duration-200 hover:bg-[#15803d]/20"
              >
                <span className="truncate">{nextNode.label}</span>
                <ArrowRight size={14} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <span className="flex items-center gap-2 rounded-xl border border-[var(--lc-line)] bg-[var(--lc-input)] px-4 py-2 text-[12.5px] font-medium text-[var(--lc-muted)]">
                <Lock size={13} />
                Complete this topic to continue
                <span className="hidden sm:inline truncate">· {nextNode.label}</span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SQLtopic;