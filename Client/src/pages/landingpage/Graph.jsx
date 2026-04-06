import { useState } from "react";
import { Link } from "react-router-dom";
const NODES = [
    // Row 0
    { id: "arrays", label: "Arrays & Hashing", x: 280, y: 20 },
    { id: "strings", label: "Strings", x: 500, y: 20 },

    // Row 1
    { id: "two", label: "Two Pointers", x: 100, y: 140 },
    { id: "sliding", label: "Sliding Window", x: 310, y: 140 },
    { id: "stack", label: "Stack", x: 520, y: 140 },

    // Row 2
    { id: "linked", label: "Linked List", x: 60, y: 270 },
    { id: "queue", label: "Queue & Deque", x: 260, y: 270 },
    { id: "hashing", label: "Hashing", x: 460, y: 270 },
    { id: "recursion", label: "Backtracking", x: 660, y: 270 },

    // Row 3
    { id: "bsearch", label: "Binary Search", x: 100, y: 400 },
    { id: "sorting", label: "Sorting", x: 330, y: 400 },
    { id: "trees", label: "Trees", x: 560, y: 400 },

    // Row 4
    { id: "heap", label: "Heap", x: 80, y: 530 },
    { id: "tries", label: "Tries", x: 290, y: 530 },
    { id: "greedy", label: "Greedy", x: 490, y: 530 },
    { id: "graphs", label: "Graphs", x: 680, y: 530 },
];

const EDGES = [
    ["arrays", "two"],
    ["arrays", "sliding"],
    ["arrays", "stack"],
    ["strings", "sliding"],
    ["strings", "stack"],
    ["two", "linked"],
    ["two", "queue"],
    ["sliding", "queue"],
    ["sliding", "hashing"],
    ["stack", "hashing"],
    ["stack", "recursion"],
    ["linked", "bsearch"],
    ["queue", "bsearch"],
    ["queue", "sorting"],
    ["hashing", "sorting"],
    ["recursion", "trees"],
    ["bsearch", "heap"],
    ["bsearch", "tries"],
    ["sorting", "tries"],
    ["sorting", "greedy"],
    ["trees", "tries"],
    ["trees", "greedy"],
    ["trees", "graphs"],
    ["heap", "graphs"],
    ["greedy", "graphs"],
];

const NW = 180;
const NH = 76;

function curvePath(from, to) {
    const fx = from.x + NW / 2;
    const fy = from.y + NH;
    const tx = to.x + NW / 2;
    const ty = to.y;
    const dy = ty - fy;
    return `M${fx},${fy} C${fx},${fy + dy * 0.45} ${tx},${ty - dy * 0.45} ${tx},${ty}`;
}

export default function HeroGraph() {
    const [hovered, setHovered] = useState(null);

    const connectedTo = hovered
        ? new Set(EDGES.flatMap(([a, b]) => a === hovered ? [b] : b === hovered ? [a] : []))
        : new Set();

    return (
        <div style={{
            marginRight: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 16px",
        }}>
            <svg viewBox="0 0 860 630" style={{ height: "550px" }}>
                <defs>
                    <marker id="arr" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M0,-5L10,0L0,5" fill="#e8c547" />
                    </marker>
                    <marker id="arrDim" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M0,-5L10,0L0,5" fill="rgba(255,255,255,0.1)" />
                    </marker>
                </defs>

                {/* Edges */}
                {EDGES.map(([fId, tId], i) => {
                    const from = NODES.find(n => n.id === fId);
                    const to = NODES.find(n => n.id === tId);
                    const active = hovered === fId || hovered === tId;
                    const dim = hovered !== null && !active;
                    return (
                        <path
                            key={i}
                            d={curvePath(from, to)}
                            fill="none"
                            stroke={active ? "#e8c547" : "rgba(255,255,255,0.1)"}
                            strokeWidth={active ? 2.5 : 1.5}
                            markerEnd={active ? "url(#arr)" : "url(#arrDim)"}
                            opacity={dim ? 0.12 : 1}
                            style={{ transition: "stroke 0.2s, opacity 0.2s, stroke-width 0.2s" }}
                        />
                    );
                })}

                {/* Nodes */}
                {NODES.map((node) => {
                    const isHov = hovered === node.id;
                    const isConn = connectedTo.has(node.id);
                    const isDim = hovered !== null && !isHov && !isConn;

                    return (
                        <Link key={node.id} to={`/topic/${node.id}`}>
                            <g
                                transform={`translate(${node.x},${node.y})`}
                                onMouseEnter={() => setHovered(node.id)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ cursor: "pointer" }}
                            >
                                {/* Outer glow ring on hover */}
                                {isHov && (
                                    <rect x="-4" y="-4" width={NW + 8} height={NH + 8} rx="14"
                                        fill="none" stroke="#e8c547" strokeWidth="1.5"
                                        opacity="0.3" style={{ filter: "blur(6px)" }} />
                                )}

                                {/* Card background */}
                                <rect
                                    width={NW} height={NH} rx="10"
                                    fill={isHov ? "#1f232b" : isDim ? "#121519" : "#171a20"}
                                    stroke={
                                        isHov ? "#e8c547" :
                                            isConn ? "rgba(232,197,71,0.4)" :
                                                "rgba(255,255,255,0.08)"
                                    }
                                    strokeWidth={isHov ? 1.5 : 1}
                                    style={{ transition: "all 0.2s" }}
                                />

                                {/* Label */}
                                {node.label.includes("\n") ? (
                                    <>
                                        <text x={NW / 2} y="19" textAnchor="middle"
                                            style={{
                                                fill: isDim ? "rgba(240,236,228,0.2)" : "#f0ece4",
                                                fontSize: "11px", fontFamily: "ui-monospace,monospace",
                                                fontWeight: 600, transition: "fill 0.2s",
                                            }}>
                                            {node.label.split("\n")[0]}
                                        </text>
                                        <text x={NW / 2} y="32" textAnchor="middle"
                                            style={{
                                                fill: isDim ? "rgba(240,236,228,0.2)" : "#f0ece4",
                                                fontSize: "11px", fontFamily: "ui-monospace,monospace",
                                                fontWeight: 600, transition: "fill 0.2s",
                                            }}>
                                            {node.label.split("\n")[1]}
                                        </text>
                                    </>
                                ) : (
                                    <text x={NW / 2} y="42" textAnchor="middle"
                                        style={{
                                            fill: isDim ? "rgba(240,236,228,0.2)" : "#f0ece4",
                                            fontSize: "14px", fontFamily: "ui-monospace,monospace",
                                            fontWeight: 600, transition: "fill 0.2s",
                                        }}>
                                        {node.label}
                                    </text>
                                )}

                                {/* Progress track */}
                                {/*<rect x="10" y="55" width={NW - 20} height="5" rx="2.5"
                                fill="rgba(255,255,255,0.08)" />*/}
                                {/* Progress fill */}
                                {/*<rect x="10" y="42" width={(NW - 20) * prog / 100} height="5" rx="2.5"
                                fill="#e8c547"
                                opacity={isDim ? 0.2 : 1}
                                style={{ transition: "width 0.35s ease, opacity 0.2s" }} />*/}

                                {/* Done tick */}
                                {/*prog === 100 && (
                                <text x={NW - 10} y="23" textAnchor="middle"
                                    style={{ fill: "#e8c547", fontSize: "12px" }}>✓</text>
                            )*/}
                            </g>
                        </Link>
                    );
                })}
            </svg>
        </div>
    );
}