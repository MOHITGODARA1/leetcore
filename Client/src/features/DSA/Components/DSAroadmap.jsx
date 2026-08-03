import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import topicsData from "../data/topics.json";
import questionsData from "../data/questions.json";

/* ================= DATA ================= */
const NODES = topicsData.topics;
const EDGES = topicsData.edges;

const BOX_COLOR = "#f46717";
const LINE_COLOR = "#ffffff";
const LOCKED_FILL = "#151516";
const LOCKED_STROKE = "rgba(255,255,255,0.14)";
const LOCKED_TEXT = "rgba(255,255,255,0.36)";

const PAD = 10;
const W = Math.max(...NODES.map((n) => n.x)) + PAD;
const H = Math.max(...NODES.map((n) => n.y)) + PAD;

// SVG needs transform-box: fill-box for hover-scale to pivot from the
// rect's own center instead of the SVG's (0,0) corner.
const hoverStyle = { transformBox: "fill-box", transformOrigin: "center" };

function Node({ node, onSelect, unlocked, progressPct }) {
  const rectWidth = Math.max(160, node.label.length * 9.5 + 32);
  const rectHeight = 72;
  const rx = 15;

  const barWidth = rectWidth - 24;
  const barHeight = 6;
  const barX = node.x - barWidth / 2;
  const barY = node.y + rectHeight / 2 - 12;

  const halo = node.isInterchange && (
    <rect
      x={node.x - rectWidth / 2 - 6}
      y={node.y - rectHeight / 2 - 6}
      width={rectWidth + 12}
      height={rectHeight + 12}
      rx={rx + 4}
      fill="none"
      stroke={unlocked ? BOX_COLOR : LOCKED_STROKE}
      strokeWidth={1.5}
      strokeOpacity={0.3}
    />
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(node, unlocked);
    }
  };

  const hitArea = (
    <rect
      x={node.x - rectWidth / 2 - 10}
      y={node.y - rectHeight / 2 - 10}
      width={rectWidth + 20}
      height={rectHeight + 20}
      fill="transparent"
    />
  );

  return (
    <g
      className={`outline-none group ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
      role="link"
      tabIndex={0}
      aria-label={`Open ${node.label}${unlocked ? "" : " (Locked)"}`}
      onClick={() => onSelect(node, unlocked)}
      onKeyDown={handleKeyDown}
      opacity={unlocked ? 1 : 0.5}
    >
      {hitArea}
      {halo}
      <g
        className={`transition-transform duration-200 ease-out ${unlocked ? "group-active:scale-[0.97] group-focus-visible:scale-105" : ""}`}
        style={hoverStyle}
      >
        <rect
          x={node.x - rectWidth / 2}
          y={node.y - rectHeight / 2}
          width={rectWidth - 10}
          height={rectHeight - 12}
          rx={rx}
          fill={unlocked ? BOX_COLOR : LOCKED_FILL}
          stroke={unlocked ? BOX_COLOR : LOCKED_STROKE}
          strokeWidth={2}
        />
        <text
          x={node.x - 5}
          y={unlocked ? node.y - 12 : node.y - 4}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none text-[15px] font-bold"
          style={{ fill: unlocked ? "#ffffff" : LOCKED_TEXT }}
        >
          {node.label}
        </text>

        {unlocked ? (
          <>
            {/* per-topic progress bar */}
            <rect
              x={barX - 5}
              y={barY - 16}
              width={barWidth}
              height={barHeight}
              rx={barHeight / 2}
              fill="rgba(0,0,0,0.18)"
            />
            <rect
              x={barX - 5}
              y={barY - 16}
              width={(barWidth * progressPct) / 100}
              height={barHeight}
              rx={barHeight / 2}
              fill="rgba(0,0,0,0.42)"
            />
          </>
        ) : (
          /* Lock Icon */
          <g transform={`translate(${node.x - 5}, ${node.y + 16})`}>
            <rect x="-6" y="-3" width="12" height="9" rx="1.5" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
            <path d="M-3.5 -3 V-6 A3.5 3.5 0 0 1 3.5 -6 V-3" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
          </g>
        )}
      </g>
    </g>
  );
}

function Edges({ unlockedMap }) {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return EDGES.map(([fromId, toId], i) => {
    const a = byId[fromId];
    const b = byId[toId];
    if (!a || !b) return null;

    // Connect line is unlocked if both nodes are unlocked
    const edgeUnlocked = unlockedMap[fromId] && unlockedMap[toId];

    return (
      <path
        key={i}
        d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
        stroke={edgeUnlocked ? LINE_COLOR : "rgba(255,255,255,0.12)"}
        strokeWidth={4}
        strokeDasharray={edgeUnlocked ? "none" : "6,6"}
        fill="none"
        strokeLinecap="round"
        opacity={edgeUnlocked ? 0.9 : 0.4}
        className="transition-all duration-300"
      />
    );
  });
}

export default function RoadmapMap() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
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

  const changeScale = (nextScale) => {
    setScale((current) => {
      const resolved = typeof nextScale === "function" ? nextScale(current) : nextScale;
      return Math.max(0.85, Math.min(1.65, resolved));
    });
  };

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
  NODES.forEach((node) => {
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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-[rgba(17,17,19,0.95)] border border-[rgba(244,103,23,0.28)] text-white/80 text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 z-50">
          <svg className="w-4 h-4 shrink-0 text-[var(--lc-orange)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-8v6m0 5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{alertMessage}</span>
        </div>
      )}

      <div className="relative w-full h-[600px] overflow-hidden shadow-2xl shadow-black/30 border border-white/5 rounded-2xl bg-[var(--lc-panel)]">
        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 bg-[rgba(17,17,19,0.8)] backdrop-blur-md border border-white/10 rounded-xl p-1.5">
          <button
            onClick={() => changeScale((s) => s - 0.1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/55 hover:text-white transition-colors duration-150 text-base font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <div className="text-[10px] font-mono text-white/55 w-10 text-center select-none">
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={() => changeScale((s) => s + 0.1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/55 hover:text-white transition-colors duration-150 text-base font-bold"
            title="Zoom In"
          >
            +
          </button>
        </div>

        {/* map — viewBox auto-fits the h-[600px] container */}
        <svg
          viewBox={`-80 0 ${W + 160} ${H + 70}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect x="-80" y="0" width={W + 160} height={H + 70} fill="url(#roadmapGrid)" />
          <defs>
            <pattern id="roadmapGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1.15" fill="rgba(255,255,255,0.14)" opacity="0.6" />
            </pattern>
          </defs>
          <g
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${W / 2}px ${H / 2}px`,
              transition: "transform 0.18s ease",
            }}
          >
            <Edges unlockedMap={unlockedMap} />
            {NODES.map((n) => {
              const stats = getTopicStats(n.id);
              const unlocked = unlockedMap[n.id];
              return (
                <Node
                  key={n.id}
                  node={n}
                  unlocked={unlocked}
                  progressPct={stats.progress}
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
