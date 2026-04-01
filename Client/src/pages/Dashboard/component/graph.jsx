import { useState } from "react";

const ACCENT = "#e8c547";

const NODES = [
    { id: "arrays", label: "Arrays & Hashing", tier: 0, col: 0, desc: "Core collection operations, frequency maps" },
    { id: "strings", label: "Strings", tier: 0, col: 3, desc: "Manipulation, parsing, encoding" },
    { id: "math", label: "Math & Bit Ops", tier: 0, col: 6, desc: "Modular arithmetic, bitwise tricks" },
    { id: "twoptr", label: "Two Pointers", tier: 1, col: 0, desc: "Left-right sweep, shrink window" },
    { id: "sliding", label: "Sliding Window", tier: 1, col: 2, desc: "Fixed & variable size windows" },
    { id: "stack", label: "Stack", tier: 1, col: 4, desc: "LIFO, monotonic stacks" },
    { id: "queue", label: "Queue / Deque", tier: 1, col: 6, desc: "BFS helper, sliding max" },
    { id: "sorting", label: "Sorting", tier: 2, col: 0, desc: "Merge, quick, counting sorts" },
    { id: "binsearch", label: "Binary Search", tier: 2, col: 2, desc: "Search & bisect on sorted data" },
    { id: "hashing", label: "Hash Maps & Sets", tier: 2, col: 4, desc: "O(1) lookup, collision handling" },
    { id: "backtrack", label: "Backtracking", tier: 3, col: 5, desc: "Permutations, subsets, N-Queens" },
    { id: "greedy", label: "Greedy", tier: 3, col: 1, desc: "Interval scheduling, local optimal" },
    { id: "heaps", label: "Heaps / Priority Q", tier: 3, col: 3, desc: "Min/max heap, K-th element" },
    { id: "tries", label: "Tries", tier: 3, col: 7, desc: "Prefix trees, autocomplete" },
    { id: "linkedlist", label: "Linked List", tier: 2, col: 6, desc: "Singly, doubly, cycle detection" },
    { id: "graphs", label: "Graphs", tier: 4, col: 0, desc: "Adj list, BFS/DFS, components" },
    { id: "dp", label: "Dynamic Programming", tier: 4, col: 3, desc: "Memoization, tabulation, subproblems" },
    { id: "trees", label: "Trees & BST", tier: 4, col: 6, desc: "DFS, BFS, LCA, traversals" },
    { id: "dijkstra", label: "Shortest Paths", tier: 5, col: 0, desc: "Dijkstra, Bellman-Ford, Floyd" },
    { id: "unionfind", label: "Union-Find", tier: 5, col: 2, desc: "DSU, path compression, MST" },
    { id: "seg", label: "Segment Trees", tier: 5, col: 4, desc: "Range queries, lazy propagation" },
    { id: "topo", label: "Topological Sort", tier: 5, col: 6, desc: "DAG ordering, Kahn's, cycle detect" },
];

const EDGES = [
    ["arrays", "twoptr"], ["arrays", "sliding"],
    ["strings", "sliding"], ["strings", "stack"],
    ["math", "stack"], ["math", "queue"],
    ["twoptr", "sorting"], ["twoptr", "binsearch"],
    ["stack", "linkedlist"], ["queue", "linkedlist"],
    ["sliding", "hashing"],
    ["linkedlist", "trees"], ["linkedlist", "tries"],
    ["hashing", "heaps"], ["hashing", "backtrack"],
    ["binsearch", "heaps"], ["binsearch", "greedy"],
    ["backtrack", "dp"], ["backtrack", "trees"],
    ["trees", "topo"],
    ["heaps", "dp"],
    ["sorting", "greedy"],
    // ["heaps", "graphs"],
    ["tries", "trees"],
    // ["sorting", "greedy"], ["sorting", "dp"],
    ["graphs", "dijkstra"], ["graphs", "unionfind"],
    ["dp", "seg"],
    ["greedy", "dp"], ["greedy", "graphs"],
];

const NW = 130, NH = 48, CW = 148, RH = 110, PX = 20, PY = 30;

function pos(node) {
    return { x: PX + node.col * CW, y: PY + node.tier * RH };
}

function curvePath(a, b) {
    const ax = pos(a).x + NW / 2, ay = pos(a).y + NH;
    const bx = pos(b).x + NW / 2, by = pos(b).y;
    const dy = by - ay;
    return `M${ax},${ay}C${ax},${ay + dy * 0.5} ${bx},${by - dy * 0.5} ${bx},${by}`;
}

function wrapLabel(label, maxW) {
    const words = label.split(" ");
    const charW = 6.5;
    const lines = [], cur = [];
    words.forEach(w => {
        const test = [...cur, w].join(" ");
        if (test.length * charW > maxW && cur.length) {
            lines.push(cur.join(" ")); cur.length = 0;
        }
        cur.push(w);
    });
    if (cur.length) lines.push(cur.join(" "));
    return lines;
}

const SYNE = "'Syne', sans-serif";
const DMONO = "'DM Mono', monospace";

export default function DSARoadmap() {
    const [completed, setCompleted] = useState(new Set());
    const [tooltip, setTooltip] = useState(null);

    const toggle = (id) => setCompleted(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const pct = NODES.length ? Math.round((completed.size / NODES.length) * 100) : 0;

    return (
        <>
            {/* Google Fonts — same import as Navbar */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>

            <div
                className="min-h-screen flex flex-col"
                style={{ background: "#0a0a0a", color: "#f0ece4", fontFamily: SYNE }}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-end justify-between flex-wrap gap-4 px-12 pt-12 pb-7 mt-10"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <div>
                        {/* Label tag — DM Mono like navbar brand subtitle */}
                        <span style={{
                            fontFamily: DMONO,
                            fontSize: "0.48rem",
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "#4a4540",
                            display: "block",
                            marginBottom: 10,
                        }}>
                            Learning Path
                        </span>

                        {/* Title — Syne font-black like navbar brand */}
                        <h1 style={{
                            fontFamily: SYNE,
                            fontWeight: 800,
                            fontSize: "1.9rem",
                            lineHeight: 1.15,
                            color: "#f0ece4",
                            margin: 0,
                        }}>
                            DSA Roadmap
                            <br />
                            {/* <span style={{ color: ACCENT }}>Dependency Graph</span> */}
                        </h1>

                        {/* Subtitle — DM Mono like navbar tagline */}
                        <p style={{
                            fontFamily: DMONO,
                            fontSize: "0.6rem",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#4a4540",
                            marginTop: 10,
                        }}>
                            Click any node to mark complete
                        </p>
                    </div>

                    {/* Progress block */}
                    {/* <div className="text-right" style={{ minWidth: 180 }}>
                        
                        <p style={{
                            fontFamily: DMONO,
                            fontSize: "0.6rem",
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.3)",
                            marginBottom: 8,
                            textTransform: "uppercase",
                        }}>
                            {completed.size} / {NODES.length} topics
                        </p>

                       
                        <div
                            className="rounded-full overflow-hidden"
                            style={{ width: 180, height: 2, background: "rgba(255,255,255,0.08)", marginLeft: "auto" }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, background: ACCENT }}
                            />
                        </div>

                        
                        <p style={{
                            fontFamily: SYNE,
                            fontWeight: 800,
                            fontSize: "1.5rem",
                            color: ACCENT,
                            marginTop: 8,
                        }}>
                            {pct}%
                        </p>
                    </div> */}
                </div>

                    {/* ── Graph ── */}
                    <div className="w-full overflow-x-auto">
                        <svg
                            viewBox="0 0 1170 680"
                            style={{ width: "100%", minWidth: 900, height: "auto", display: "block" }}
                        >
                            <defs>
                                <marker id="arr" viewBox="0 -4 8 8" refX="7" refY="0"
                                    markerWidth="5" markerHeight="5" orient="auto">
                                    <path d="M0,-4L8,0L0,4" fill="rgba(255,255,255,0.25)" />
                                </marker>
                                <marker id="arr-done" viewBox="0 -4 8 8" refX="7" refY="0"
                                    markerWidth="5" markerHeight="5" orient="auto">
                                    <path d="M0,-4L8,0L0,4" fill={ACCENT} />
                                </marker>
                            </defs>

                            {/* Edges */}
                            {EDGES.map(([aId, bId], i) => {
                                const a = NODES.find(n => n.id === aId);
                                const b = NODES.find(n => n.id === bId);
                                if (!a || !b) return null;
                                const bothDone = completed.has(aId) && completed.has(bId);
                                return (
                                    <path
                                        key={i}
                                        d={curvePath(a, b)}
                                        fill="none"
                                        stroke={bothDone ? ACCENT : "rgba(255,255,255,0.22)"}
                                        strokeWidth={bothDone ? 2.5 : 2}
                                        markerEnd={bothDone ? "url(#arr-done)" : "url(#arr)"}
                                    />
                                );
                            })}

                            {/* Nodes */}
                            {NODES.map(node => {
                                const p = pos(node);
                                const done = completed.has(node.id);
                                const lines = wrapLabel(node.label, NW - 18);

                                return (
                                    <g
                                        key={node.id}
                                        transform={`translate(${p.x},${p.y})`}
                                        style={{ cursor: "pointer" }}
                                        onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, node })}
                                        onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                                        onMouseLeave={() => setTooltip(null)}
                                        onClick={() => toggle(node.id)}
                                    >
                                        <rect
                                            width={NW} height={NH} rx={6}
                                            fill={done ? "rgba(232,197,71,0.1)" : "#0f1014"}
                                            stroke={done ? ACCENT : "rgba(255,255,255,0.14)"}
                                            strokeWidth={done ? 1.5 : 1}
                                        />

                                        {/* Node label — Syne bold */}
                                        {lines.length === 1 ? (
                                            <text
                                                x={NW / 2} y={NH / 2}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                fill={done ? ACCENT : "rgba(255,255,255,0.8)"}
                                                fontSize={10}
                                                fontWeight={700}
                                                style={{ fontFamily: SYNE }}
                                            >
                                                {node.label}
                                            </text>
                                        ) : (
                                            <text
                                                textAnchor="middle"
                                                fill={done ? ACCENT : "rgba(255,255,255,0.8)"}
                                                fontSize={10}
                                                fontWeight={700}
                                                style={{ fontFamily: SYNE }}
                                            >
                                                {lines.map((line, i) => (
                                                    <tspan
                                                        key={i}
                                                        x={NW / 2}
                                                        y={NH / 2 + (i - (lines.length - 1) / 2) * 13}
                                                    >
                                                        {line}
                                                    </tspan>
                                                ))}
                                            </text>
                                        )}

                                        {/* Checkmark — DM Mono */}
                                        {done && (
                                            <text
                                                x={NW - 10} y={14}
                                                fontSize={10}
                                                fill={ACCENT}
                                                textAnchor="middle"
                                                style={{ fontFamily: DMONO }}
                                            >
                                                ✓
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* ── Tooltip ── */}
                    {tooltip && (
                        <div
                            className="fixed z-50 pointer-events-none rounded-lg px-4 py-3"
                            style={{
                                top: tooltip.y + 14,
                                left: tooltip.x + 16,
                                background: "#0f1014",
                                border: "1px solid rgba(232,197,71,0.18)",
                                maxWidth: 220,
                            }}
                        >
                            {/* Topic name — Syne bold */}
                            <p style={{
                                fontFamily: SYNE,
                                fontWeight: 800,
                                fontSize: "0.75rem",
                                color: ACCENT,
                                marginBottom: 4,
                            }}>
                                {tooltip.node.label}
                            </p>
                            {/* Description — DM Mono */}
                            <p style={{
                                fontFamily: DMONO,
                                fontSize: "0.55rem",
                                letterSpacing: "0.08em",
                                color: "rgba(255,255,255,0.4)",
                                lineHeight: 1.7,
                            }}>
                                {tooltip.node.desc}
                            </p>
                        </div>
                    )}
                </div>
            </>
            );
}