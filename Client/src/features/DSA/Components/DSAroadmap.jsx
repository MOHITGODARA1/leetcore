import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= DATA ================= */
// Metro-map rule: every edge is either purely vertical (same x) or a
// perfect 45° diagonal (|dx| === |dy|).
//
// `completed` is the only status left — it only drives the progress bar
// at the top now, not the node's look. Every node renders the same way.
const NODES = [
  { id: "arrays",    label: "Arrays",                x: 0,    y: 60,  completed: true },
  { id: "strings",   label: "Strings",               x: 200,  y: 60,  completed: true },
  { id: "twoptr",    label: "Two Pointers",          x: 200,  y: 200, completed: true},

  { id: "sliding",   label: "Sliding Window",        x: 390,  y: 100, completed: false },
  { id: "kadan",     label: "Kadan's",               x: 590,  y: 100, completed: false },
  { id: "prekad",    label: "Prefix Sum",             x: 390,  y: 300, completed: false },
  { id: "hashing",   label: "Hashing",               x: 590,  y: 300, completed: false },
  { id: "binsearch", label: "Binary Search",         x: 690,  y: 200, completed: false },

  { id: "linked",    label: "Linked List",           x: 900,  y: 200, completed: false },
  { id: "stackq",    label: "Stack & Queue",         x: 1100,  y: 200, completed: false },

  { id: "recur",     label: "Recursion & Backtrack", x: 900,  y: 350, completed: false },

  { id: "trees",     label: "Trees",  x: 900,  y: 500, completed: false},

  { id: "graph",     label: "Graph ",         x: 780,  y: 600, completed: false },

  { id: "dp",        label: "Dynamic Programming",   x: 780,  y: 720, completed: false },
  { id: "advanced",  label: "Greedy",                x: 550, y: 720, completed: false },

  { id: "Tries",     label: "Tries",                 x: 1020,  y: 600, completed: false },
  { id: "Heaps",     label: "Heaps",                 x: 1020,  y: 720, completed: false },
];

const EDGES = [
  ["arrays", "strings"], ["strings", "twoptr"],
  ["twoptr", "sliding"], ["sliding", "kadan"], ["hashing", "binsearch"], ["kadan", "binsearch"],
  ["twoptr", "prekad"], ["prekad", "hashing"],
  ["linked", "stackq"], ["binsearch", "linked"], ["linked", "recur"], ["recur", "trees"],
  ["trees", "graph"], ["graph", "dp"], ["trees", "Tries"], ["Tries", "Heaps"], ["dp", "Heaps"],
  ["Heaps", "advanced"],
];

const TOPIC_ROUTES = {
  arrays: "arrays",
  strings: "strings",
  twoptr: "two-pointers",
  sliding: "sliding-window",
  kadan: "kadans",
  prekad: "prefix-sum",
  hashing: "hashing",
  binsearch: "binary-search",
  linked: "linked-list",
  stackq: "stack-and-queue",
  recur: "recursion-and-backtracking",
  trees: "trees-heaps-and-tries",
  graph: "graph-bfs-dfs",
  dp: "dynamic-programming",
  advanced: "greedy",
  Tries: "tries",
  Heaps: "heaps",
};

const BOX_COLOR = "#81D8D0";
const LINE_COLOR = "#ffffff";

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const PAD = 10;
const W = Math.max(...NODES.map((n) => n.x)) + PAD;
const H = Math.max(...NODES.map((n) => n.y)) + PAD;
const completedCount = NODES.filter((n) => n.completed).length;
const progressPct = Math.round((completedCount / NODES.length) * 100);

// SVG needs transform-box: fill-box for hover-scale to pivot from the
// rect's own center instead of the SVG's (0,0) corner.
const hoverStyle = { transformBox: "fill-box", transformOrigin: "center" };

function Node({ node, onSelect }) {
  // Taller boxes than before — width scales with label length, height only.
  const rectWidth = Math.max(160, node.label.length * 9.5 + 32);
  const rectHeight = 72;
  const rx = 15;

  // Per-topic progress: uses node.progress (0-100) if provided, else falls
  // back to the boolean `completed` flag (100 or 0).
  const progressPct = typeof node.progress === "number"
    ? Math.max(0, Math.min(100, node.progress))
    : node.completed ? 100 : 0;

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
      stroke={BOX_COLOR}
      strokeWidth={1.5}
      strokeOpacity={0.3}
    />
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(node);
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
      className="cursor-pointer outline-none group"
      role="link"
      tabIndex={0}
      aria-label={`Open ${node.label}`}
      onClick={() => onSelect(node)}
      onKeyDown={handleKeyDown}
    >
      {hitArea}
      {halo}
      <g
        className="transition-transform duration-200 ease-out  group-active:scale-[0.97] group-focus-visible:scale-105"
        style={hoverStyle}
      >
        <rect
          x={node.x - rectWidth / 2}
          y={node.y - rectHeight / 2}
          width={rectWidth-10}
          height={rectHeight-12}
          rx={rx}
          fill={BOX_COLOR}
          stroke={BOX_COLOR}
          strokeWidth={2}
        />
        <text
          x={node.x-5}
          y={node.y - 15}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none text-[15px] font-semibold"
          style={{ fill: "#000000" }}
        >
          {node.label}
        </text>

        {/* per-topic progress bar */}
        <rect
          x={barX-5}
          y={barY-20}
          width={barWidth}
          height={barHeight}
          rx={barHeight / 2}
          fill="rgba(0,0,0,0.18)"
        />
        <rect
          x={barX-5}
          y={barY-20}
          width={(barWidth * progressPct) / 100}
          height={barHeight}
          rx={barHeight / 2}
          fill="#0f172a"
        />
      </g>
    </g>
  );
}

function Edges() {
  return EDGES.map(([fromId, toId], i) => {
    const a = byId[fromId];
    const b = byId[toId];
    return (
      <path
        key={i}
        d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
        stroke={LINE_COLOR}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        opacity={0.9}
      />
    );
  });
}

export default function RoadmapMap() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  const changeScale = (nextScale) => {
    setScale((current) => {
      const resolved = typeof nextScale === "function" ? nextScale(current) : nextScale;
      return Math.max(0.85, Math.min(1.65, resolved));
    });
  };

  const resetView = () => setScale(1);

  const handleNodeSelect = (node) => {
    navigate(`/dashboard/data-structures-and-algorithms/${TOPIC_ROUTES[node.id]}`);
  };

  return (
    <div className="w-full">
      

      <div className="relative w-full h-[600px] overflow-hidden shadow-2xl shadow-black/30">
        

        {/* map — viewBox auto-fits the h-[600px] container, so the complete
            roadmap is always fully visible. No drag/wheel panning: the map
            is fixed in place, zoom buttons are the only way to scale it. */}
        <svg
          viewBox={`-80 0 ${W + 160} ${H + 70}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect x="-80" y="0" width={W + 160} height={H + 70} fill="url(#roadmapGrid)" />
          <defs>
            <pattern id="roadmapGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1.15" fill="#223047" opacity="0.52" />
            </pattern>
          </defs>
          <g
            style={{
              transform: `scale(${scale})`,
              transformOrigin: `${W / 2}px ${H / 2}px`,
              transition: "transform 0.18s ease",
            }}
          >
            <Edges />
            {NODES.map((n) => (
              <Node key={n.id} node={n} onSelect={handleNodeSelect} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}