import { useNavigate } from "react-router-dom";

const EDGE = "#ffffff";
const SW = 5;
const OFFSET = 110;

const edges = [
    "M305 75 C305 120, 185 140, 185 170",
    "M305 75 C305 120, 445 140, 445 170",
    "M185 215 C185 260, 110 280, 110 310",
    "M185 215 C185 260, 300 280, 300 310",
    "M445 215 C445 260, 480 280, 480 310",
    "M110 355 C200 420, 300 420, 315 460",
    "M300 355 C300 420, 315 420, 315 460",
    "M480 355 C400 420, 315 420, 315 460",
    "M315 505 C315 560, 155 580, 155 630",
    "M315 505 C315 560, 335 580, 335 630",
    "M315 505 C315 560, 525 580, 525 630",
];

const nodes = [
    { label: "Arrays & Hashing", x: 240, y: 30, path: "/dsa/arrays" },
    { label: "Two Pointers", x: 120, y: 170, path: "/dsa/two-pointers" },
    { label: "Stack", x: 380, y: 170, path: "/dsa/stack" },
    { label: "Linked List", x: 44, y: 310, path: "/dsa/linked-list" },
    { label: "Sliding Window", x: 238, y: 310, path: "/dsa/sliding-window" },
    { label: "Binary Search", x: 418, y: 310, path: "/dsa/binary-search" },
    { label: "Trees", x: 250, y: 460, path: "/dsa/trees" },
    { label: "Tries", x: 90, y: 630, path: "/dsa/tries" },
    { label: "Heap / Prio. Queue", x: 270, y: 630, path: "/dsa/heap" },
    { label: "Backtracking", x: 460, y: 630, path: "/dsa/backtracking" },
];

function Node({ label, x, y, path }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            className="absolute flex items-center 
            justify-center rounded-lg bg-[#e8c547] text-black 
            text-xs font-medium px-3 cursor-pointer hover:bg-[#ecd061] 
            transition z-20 hover:scale-105 transition-all duration-200"
            style={{
                left: x + OFFSET,
                top: y,
                width: 130,
                height: 45,
            }}
        >
            {label}
        </div>
    );
}

export default function DSAGraph() {
    return (
        <div className="relative w-full h-[740px] bg-[#0d0f11] overflow-hidden">

            {/* SVG Layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="w-full h-full overflow-visible pointer-events-none">
                    <g transform={`translate(${OFFSET}, 0)`}>
                        {edges.map((d, i) => (
                            <path
                                key={i}
                                d={d}
                                stroke={EDGE}
                                strokeWidth={SW}
                                fill="none"
                            />
                        ))}
                    </g>
                </svg>
            </div>

            {/* Nodes Layer */}
            <div className="absolute inset-0 z-10">
                {nodes.map((n) => (
                    <Node key={n.label} {...n} />
                ))}
            </div>
        </div>
    );
}