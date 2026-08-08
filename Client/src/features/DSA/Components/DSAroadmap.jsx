import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "@phosphor-icons/react";
import topicsData from "../data/topics.json";
import questionsData from "../data/questions.json";

/* ================= DATA ================= */
const NODES = topicsData.topics;
const EDGES = topicsData.edges;

/* Palette — warm paper canvas + ink text, air-light cards, hairline
   borders, amber kept strictly for the active/current/progress path. */
const ORANGE = "#d97706";
const KANVAS = "#f7f5f0";
const GRID_DOT = "rgba(24,24,28,0.08)";
const CARD_FILL = "#A4B885";
const CARD_STROKE = "rgba(24,24,28,0.14)";
const CARD_STROKE_ACTIVE = "rgba(24,24,28,0.22)";
const NODE_TEXT = "#1c1c22";
const META_TEXT = "rgba(28,28,34,0.55)";
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

// SVG needs transform-box: fill-box for hover-scale to pivot from the
// rect's own center instead of the SVG's (0,0) corner.
const hoverStyle = { transformBox: "fill-box", transformOrigin: "center" };

function Node({ node, onSelect, unlocked, progressPct, completed, isCurrent }) {
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

  const cardStroke = unlocked && isCurrent ? ORANGE : unlocked ? CARD_STROKE : LOCKED_STROKE;

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
      {/* {hitArea}
      {currentRing}
      {halo} */}
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
        
        <text
          x={node.x}
          y={node.y - 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none font-display text-[16px]  font-bold tracking-tight"
          style={{ fill: labelFill }}
        >
          {node.label}
        </text>

        {unlocked ? (
          <>
            {/* per-topic progress bar */}
            <rect
              x={node.x - barWidth / 2}
              y={barY}
              width={barWidth}
              height={barHeight}
              rx={barHeight / 2}
              fill={TRACK_FILL}
            />
            <rect
              x={node.x - barWidth / 2}
              y={barY}
              width={(barWidth * progressPct) / 100}
              height={barHeight}
              rx={barHeight / 2}
              
              fill={completed ? ORANGE : isCurrent ? ORANGE : "rgba(217,119,6,0.85)"}
            />
            
          </>
        ) : (
          /* Lock Icon */
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

    // Connect line is unlocked if both nodes are unlocked
    const edgeUnlocked = unlockedMap[fromId] && unlockedMap[toId];
    const touchesCurrent =
      edgeUnlocked && (fromId === currentTopicId || toId === currentTopicId);

    return (
      <path
        key={i}
        d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
        stroke={edgeUnlocked ? (touchesCurrent ? LINE_COLOR : LINE_COLOR) : LINE_LOCKED}
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

export default function RoadmapMap() {
  const navigate = useNavigate();
  const [scale] = useState(1);
  const [solvedQuestions] = useState(() =>
    JSON.parse(localStorage.getItem("leetcore_solved_questions") || "[]")
  );
  const [alertMessage, setAlertMessage] = useState("");

  // Clear alert after 3s
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Helper: check topic statistics
  const getTopicStats = (topicId) => {
    const qList = questionsData[topicId] || [];
    const total = qList.length;
    const solved = qList.filter((q) => solvedQuestions.includes(q.id)).length;
    const completed = total > 0 && solved === total;
    const progress = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { total, solved, completed, progress };
  };

  // Build unlocking map for all nodes
  const unlockedMap = {};
  const statsMap = {};
  NODES.forEach((node) => {
    const stats = getTopicStats(node.id);
    statsMap[node.id] = stats;
    if (node.order === 0) {
      unlockedMap[node.id] = true;
    } else {
      const prevTopic = NODES.find((t) => t.order === node.order - 1);
      if (prevTopic) {
        const prevStats = getTopicStats(prevTopic.id);
        unlockedMap[node.id] = prevStats.completed;
      } else {
        unlockedMap[node.id] = false;
      }
    }
  });

  // Current topic = the earliest unlocked topic that isn't complete yet
  const currentTopicId = NODES.find(
    (n) => unlockedMap[n.id] && !statsMap[n.id].completed
  )?.id;

  const handleNodeSelect = (node, unlocked) => {
    if (!unlocked) {
      const prevTopic = NODES.find((t) => t.order === node.order - 1);
      const prevLabel = prevTopic ? prevTopic.label : "previous topic";
      setAlertMessage(`This topic is locked! Complete all questions in ${prevLabel} to unlock.`);
      return;
    }
    const firstQuestion = questionsData[node.id]?.[0];
    if (firstQuestion) {
      navigate(`/dashboard/data-structures-and-algorithms/${node.id}/${firstQuestion.id}`);
      return;
    }
    navigate(`/dashboard/data-structures-and-algorithms/${node.id}`);
  };

  return (
    <div className="w-full relative">
      {/* Locked Alert Popup */}
      {alertMessage && (
        <div
          role="alert"
          className="absolute top-4 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-xl border border-[rgba(217,119,6,0.3)] bg-[var(--lc-panel)] px-4 py-2.5 text-xs font-semibold text-[var(--lc-text)] shadow-[var(--shadow-lg)] animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <Lock size={13} weight="fill" className="shrink-0 text-[#d97706]" />
          <span className="text-[var(--lc-muted)]">{alertMessage}</span>
        </div>
      )}

      <div className="relative w-full h-[560px] xl:h-[600px] overflow-hidden rounded-2xl  shadow-[var(--shadow-md)]">
        {/* map — viewBox auto-fits the h-[600px] container */}
        <svg
          viewBox={`-80 0 ${W + 160} ${H + 70}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="roadGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(24,24,28,0.09)" opacity="0.9" />
            </pattern>
          </defs>
          {/* solid light canvas + dot grid on top */}
          {/* <rect x="-80" y="0" width={W + 160} height={H + 70} fill="#f7f5f0" />
          <rect x="-80" y="0" width={W + 160} height={H + 70} fill="url(#roadGrid)" /> */}
          <g
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${W / 2}px ${H / 2}px`,
              transition: "transform 0.18s ease",
            }}
          >
            <Edges unlockedMap={unlockedMap} currentTopicId={currentTopicId} />
            {NODES.map((n) => {
              const stats = statsMap[n.id];
              const unlocked = unlockedMap[n.id];
              return (
                <Node
                  key={n.id}
                  node={n}
                  unlocked={unlocked}
                  progressPct={stats.progress}
                  completed={stats.completed}
                  isCurrent={n.id === currentTopicId}
                  onSelect={handleNodeSelect}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
