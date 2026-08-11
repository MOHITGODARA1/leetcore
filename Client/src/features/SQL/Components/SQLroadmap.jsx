import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "@phosphor-icons/react";
import topicsData from "../data/topics.json";
import { getCompletedTopics } from "../storage";
import { ACTIVITY_UPDATED_EVENT } from "../../../services/activityProgress";

/* ================= DATA ================= */
const NODES = topicsData.topics;
const EDGES = topicsData.edges;

/* Palette — same warm paper canvas as the Algorithms Metro, but the
   accent + card tint shift to a SQL-green so the two tracks read as
   cousins, not copies. */
const ACCENT = "#15803d";
const KANVAS = "#f7f5f0";
const CARD_FILL = "#A8C0A2";
const CARD_STROKE = "rgba(24,24,28,0.14)";
const NODE_TEXT = "#1c1c22";
const TRACK_FILL = "rgba(28,28,34,0.09)";
const LOCKED_FILL = "#EDEBE5";
const LOCKED_STROKE = "rgba(24,24,28,0.16)";
const LOCKED_TEXT = "rgba(28,28,34,0.4)";
const LOCKED_LOCK = "rgba(28,28,34,0.35)";
const LINE_COLOR = "#f7f5f0";
const LINE_LOCKED = "#f7f5f0";

const PAD = 10;
const W = Math.max(...NODES.map((n) => n.x)) + PAD;
const H = Math.max(...NODES.map((n) => n.y)) + PAD;

const hoverStyle = { transformBox: "fill-box", transformOrigin: "center" };

function Node({ node, onSelect, unlocked, completed, isCurrent }) {
  const rectWidth = Math.max(168, node.label.length * 9 + 36);
  const rectHeight = 74;
  const rx = 10;

  const barWidth = rectWidth - 28;
  const barHeight = 5;
  const barY = node.y + 13;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(node, unlocked);
    }
  };

  const cardFill = unlocked ? CARD_FILL : LOCKED_FILL;
  const cardStroke = unlocked && isCurrent ? ACCENT : unlocked ? CARD_STROKE : LOCKED_STROKE;
  const labelFill = unlocked ? NODE_TEXT : LOCKED_TEXT;

  return (
    <g
      className={`outline-none group ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
      role="link"
      tabIndex={0}
      aria-label={`Open ${node.label}${unlocked ? "" : " (Locked)"}${completed ? " · Completed" : ""}`}
      onClick={() => onSelect(node, unlocked)}
      onKeyDown={handleKeyDown}
      opacity={unlocked ? 1 : 0.55}
    >
      <g
        className={`transition-transform duration-200 ease-out ${unlocked ? "group-hover:scale-[1.02] group-active:scale-[0.98] group-focus-visible:scale-[1.03]" : ""}`}
        style={hoverStyle}
      >
        <rect
          x={node.x - (rectWidth - 10) / 2}
          y={node.y - rectHeight / 2}
          width={rectWidth - 10}
          height={rectHeight - 10}
          rx={rx}
          fill={cardFill}
          stroke={cardStroke}
          strokeWidth={isCurrent ? 2 : 1.4}
        />

        {/* Completed badge */}
        {completed && (
          <g transform={`translate(${node.x + (rectWidth - 10) / 2 - 12}, ${node.y - rectHeight / 2 + 12})`}>
            <circle r="9" fill={ACCENT} />
            <path
              d="M -4 0 L -1 3 L 4 -3"
              fill="none"
              stroke="#f7f5f0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        <text
          x={node.x}
          y={node.y - 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none font-display text-[16px] font-bold tracking-tight"
          style={{ fill: labelFill }}
        >
          {node.label}
        </text>

        {unlocked ? (
          <>
            <rect
              x={node.x - barWidth / 2}
              y={barY}
              width={barWidth}
              height={barHeight}
              rx={barHeight / 2}
              fill={TRACK_FILL}
            />
            {completed && (
              <rect
                x={node.x - barWidth / 2}
                y={barY}
                width={barWidth}
                height={barHeight}
                rx={barHeight / 2}
                fill={ACCENT}
              />
            )}
          </>
        ) : (
          <g transform={`translate(${node.x}, ${node.y + 15})`}>
            <rect x="-5.5" y="-3" width="11" height="9" rx="2" fill="none" stroke={LOCKED_LOCK} strokeWidth="1.5" />
            <path d="M-3.5 -3 V-5.5 A3.5 3.5 0 0 1 3.5 -5.5 V-3" fill="none" stroke={LOCKED_LOCK} strokeWidth="1.5" />
          </g>
        )}
      </g>
    </g>
  );
}

function Edges({ unlockedMap, currentTopicId }) {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return EDGES.map(([fromId, toId], i) => {
    const a = byId[fromId];
    const b = byId[toId];
    if (!a || !b) return null;

    const edgeUnlocked = unlockedMap[fromId] && unlockedMap[toId];
    const touchesCurrent =
      edgeUnlocked && (fromId === currentTopicId || toId === currentTopicId);

    return (
      <path
        key={i}
        d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
        stroke={LINE_COLOR}
        strokeWidth={edgeUnlocked ? (touchesCurrent ? 3 : 2.25) : 1.75}
        strokeDasharray={edgeUnlocked ? "none" : "4,6"}
        fill="none"
        strokeLinecap="round"
        opacity={edgeUnlocked ? (touchesCurrent ? 0.85 : 0.75) : 0.7}
        className="transition-all duration-300"
      />
    );
  });
}

export default function SQLroadmap() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(() => getCompletedTopics());
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const sync = () => setCompleted(getCompletedTopics());
    const onActivity = () => setCompleted(getCompletedTopics());
    window.addEventListener("storage", sync);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, onActivity);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, onActivity);
    };
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const isCompleted = (topicId) => completed.includes(topicId);

  const unlockedMap = {};
  NODES.forEach((node) => {
    if (node.order === 0) {
      unlockedMap[node.id] = true;
    } else {
      const prevTopic = NODES.find((t) => t.order === node.order - 1);
      unlockedMap[node.id] = prevTopic ? isCompleted(prevTopic.id) : false;
    }
  });

  const currentTopicId = NODES.find((n) => unlockedMap[n.id] && !isCompleted(n.id))?.id;

  const handleNodeSelect = (node, unlocked) => {
    if (!unlocked) {
      const prevTopic = NODES.find((t) => t.order === node.order - 1);
      const prevLabel = prevTopic ? prevTopic.label : "previous topic";
      setAlertMessage(`This topic is locked! Finish reading ${prevLabel} to unlock.`);
      return;
    }
    navigate(`/dashboard/sql/${node.id}`);
  };

  const completedCount = NODES.filter((n) => completed.includes(n.id)).length;
  const percent = NODES.length > 0 ? Math.round((completedCount / NODES.length) * 100) : 0;

  return (
    <div className="w-full relative">
      {/* Journey progress — always visible, no matter the sidebar */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-[13px] font-semibold tracking-tight text-[var(--lc-text)]">
          <span className="text-[#4ade80] tabular-nums">{completedCount}</span>
          <span className="text-[var(--lc-muted)]">
            {" "}
            / {NODES.length} stations completed
          </span>
        </p>
        <div className="h-2 min-w-[120px] max-w-xs flex-1 overflow-hidden rounded-full bg-[var(--lc-input)]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${percent}%`, backgroundColor: ACCENT }}
          />
        </div>
        <span className="text-[12px] font-semibold tabular-nums text-[var(--lc-muted)]">
          {percent}% of journey
        </span>
      </div>

      {alertMessage && (
        <div
          role="alert"
          className="absolute top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-xl border border-[rgba(21,128,61,0.3)] bg-[var(--lc-panel)] px-4 py-2.5 text-xs font-semibold text-[var(--lc-text)] shadow-[var(--shadow-lg)] animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <Lock size={13} weight="fill" className="shrink-0 text-[#15803d]" />
          <span className="text-[var(--lc-muted)]">{alertMessage}</span>
        </div>
      )}

      <div className="relative w-full h-[560px] xl:h-[600px] overflow-hidden rounded-2xl shadow-[var(--shadow-md)]">
        <svg
          viewBox={`-80 0 ${W + 160} ${H + 70}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <Edges unlockedMap={unlockedMap} currentTopicId={currentTopicId} />
          {NODES.map((n) => {
            const unlocked = unlockedMap[n.id];
            return (
              <Node
                key={n.id}
                node={n}
                unlocked={unlocked}
                completed={isCompleted(n.id)}
                isCurrent={n.id === currentTopicId}
                onSelect={handleNodeSelect}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}