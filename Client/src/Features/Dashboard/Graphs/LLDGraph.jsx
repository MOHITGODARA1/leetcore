import { useNavigate, useParams } from "react-router-dom";
import { ReactFlow, Background, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeStyle = {
    background: "#161616ff",
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
        color: "#e9e9e3ff",
    },
    style: {
        stroke: "#e9e9e3ff",
        strokeWidth: 1.6,
        opacity: 0.75,
    },
};

export default function LLDGraph() {
    const navigate = useNavigate();
    const { subject } = useParams();

    const nodes = [
        { id: "1", data: { label: "OOP Fundamentals", slug: "oop-fundamentals" }, position: { x: 160, y: 0 }, style: nodeStyle },
        { id: "2", data: { label: "UML Diagrams", slug: "uml-diagrams" }, position: { x: 480, y: 0 }, style: nodeStyle },
        { id: "3", data: { label: "SOLID Principles", slug: "solid-principles" }, position: { x: 60, y: 120 }, style: nodeStyle },
        { id: "4", data: { label: "Design Patterns", slug: "design-patterns" }, position: { x: 330, y: 120 }, style: nodeStyle },
        { id: "5", data: { label: "Class Diagrams", slug: "class-diagrams" }, position: { x: 570, y: 120 }, style: nodeStyle },
        { id: "6", data: { label: "Creational Patterns", slug: "creational-patterns" }, position: { x: 60, y: 240 }, style: nodeStyle },
        { id: "7", data: { label: "Structural Patterns", slug: "structural-patterns" }, position: { x: 310, y: 240 }, style: nodeStyle },
        { id: "8", data: { label: "Behavioral Patterns", slug: "behavioral-patterns" }, position: { x: 560, y: 240 }, style: nodeStyle },
        { id: "9", data: { label: "Parking Lot", slug: "parking-lot" }, position: { x: 60, y: 360 }, style: nodeStyle },
        { id: "10", data: { label: "Elevator System", slug: "elevator-system" }, position: { x: 300, y: 360 }, style: nodeStyle },
        { id: "11", data: { label: "Booking System", slug: "booking-system" }, position: { x: 555, y: 360 }, style: nodeStyle },
        { id: "12", data: { label: "Chess / Snake Game", slug: "chess-snake-game" }, position: { x: 60, y: 480 }, style: nodeStyle },
        { id: "13", data: { label: "ATM / Vending Machine", slug: "atm-vending" }, position: { x: 300, y: 480 }, style: nodeStyle },
        { id: "14", data: { label: "Splitwise / LMS", slug: "splitwise-lms" }, position: { x: 555, y: 480 }, style: nodeStyle },
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
        { id: "e5-8", source: "5", target: "8" },
        { id: "e6-9", source: "6", target: "9" },
        { id: "e7-10", source: "7", target: "10" },
        { id: "e8-10", source: "8", target: "10" },
        { id: "e8-11", source: "8", target: "11" },
        { id: "e9-12", source: "9", target: "12" },
        { id: "e10-13", source: "10", target: "13" },
        { id: "e11-14", source: "11", target: "14" },
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
            <div
                style={{
                    position: "absolute",
                    inset: 0,
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