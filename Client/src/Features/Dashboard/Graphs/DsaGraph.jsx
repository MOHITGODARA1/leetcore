import { useNavigate, useParams } from "react-router-dom";
import { ReactFlow, Background, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeStyle = {
    background: "#161616",
    color: "#f5f5f5",
    border: "1px solid #3a3a3a",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: "500",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
};

const defaultEdgeOptions = {
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#636362ff", // yellow
    },
    style: {
        stroke: "#636362ff",
        strokeWidth: 1.6,
        opacity: 0.75,
    },
};

export default function DSAGraph() {
    const navigate = useNavigate();
    const { subject } = useParams();

    const nodes = [
        { id: "1", data: { label: "Arrays", slug: "arrays" }, position: { x: 200, y: 0 }, style: nodeStyle },
        { id: "2", data: { label: "String", slug: "string" }, position: { x: 500, y: 0 }, style: nodeStyle },
        { id: "3", data: { label: "Two Pointer", slug: "two-pointers" }, position: { x: 100, y: 120 }, style: nodeStyle },
        { id: "4", data: { label: "Hashing", slug: "hashing" }, position: { x: 350, y: 120 }, style: nodeStyle },
        { id: "5", data: { label: "Sliding Window", slug: "sliding-window" }, position: { x: 600, y: 120 }, style: nodeStyle },
        { id: "6", data: { label: "Binary Search", slug: "binary-search" }, position: { x: 250, y: 240 }, style: nodeStyle },
        { id: "7", data: { label: "Linked List", slug: "linked-list" }, position: { x: 550, y: 240 }, style: nodeStyle },
        { id: "8", data: { label: "Stack", slug: "stack" }, position: { x: 150, y: 360 }, style: nodeStyle },
        { id: "9", data: { label: "Queue", slug: "queue" }, position: { x: 350, y: 360 }, style: nodeStyle },
        { id: "10", data: { label: "Slow & Fast", slug: "slow-fast" }, position: { x: 650, y: 360 }, style: nodeStyle },
        { id: "11", data: { label: "Dynamic Programming", slug: "dynamic-programming" }, position: { x: 100, y: 480 }, style: nodeStyle },
        { id: "12", data: { label: "Recursion", slug: "recursion" }, position: { x: 350, y: 480 }, style: nodeStyle },
        { id: "13", data: { label: "Backtracking", slug: "backtracking" }, position: { x: 600, y: 480 }, style: nodeStyle },
    ];

    const edges = [
        { id: "e1-3", source: "1", target: "3" },
        { id: "e1-4", source: "1", target: "4" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e2-5", source: "2", target: "5" },
        { id: "e3-6", source: "3", target: "6" },
        { id: "e4-6", source: "4", target: "6" },
        { id: "e4-7", source: "4", target: "7" },
        { id: "e5-7", source: "5", target: "7" },
        { id: "e6-8", source: "6", target: "8" },
        { id: "e6-9", source: "6", target: "9" },
        { id: "e7-10", source: "7", target: "10" },
        { id: "e8-11", source: "8", target: "11" },
        { id: "e9-12", source: "9", target: "12" },
        { id: "e10-13", source: "10", target: "13" },
    ];

    const onNodeClick = (event, node) => {
        const slug = node?.data?.slug;
        if (slug) {
            navigate(`/dashboard/${subject}/${slug}`);
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "700px",
                position: "relative",
                overflow: "hidden",
                background: "#0d0f11",
            }}
        >
            {/* Subtle Yellow Motion Background */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at 25% 30%, rgba(250,204,21,0.12), transparent 40%), radial-gradient(circle at 75% 70%, rgba(250,204,21,0.08), transparent 40%)",
                    animation: "moveBg 16s linear infinite",
                }}
            />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeClick={onNodeClick}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#2a2a2a" gap={28} />
            </ReactFlow>

            <style>{`
                @keyframes moveBg {
                    0% { transform: translate(0,0); }
                    50% { transform: translate(-20px, -20px); }
                    100% { transform: translate(0,0); }
                }
            `}</style>
        </div>
    );
}