
const EDGE = "#ffffff";
const SW = 5;

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
    { label: "OSI Model", x: 240, y: 30, w: 130 },
    { label: "TCP/UDP", x: 120, y: 170, w: 130 },
    { label: "IP Addressing", x: 380, y: 170, w: 130 },
    { label: "Routing", x: 44, y: 310, w: 130 },
    { label: "DNS", x: 238, y: 310, w: 130 },
    { label: "HTTP/HTTPS", x: 418, y: 310, w: 130 },
    { label: "Security", x: 250, y: 460, w: 130 },
    { label: "Firewall", x: 90, y: 630, w: 130 },
    { label: "Load Balancer", x: 270, y: 630, w: 130 },
    { label: "CDN", x: 460, y: 630, w: 130 },
];

const OFFSET = 110;

function Node({ label, x, y, w }) {
    return (
        <div style={{
            position: "absolute",
            left: x + OFFSET,
            top: y,
            width: w,
            height: 45,
            background: "#4f5bd5",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 11,
            fontWeight: 500,
            padding: "0 12px",
        }}>
            {label}
        </div>
    );
}

function NetworkGraph() {
    return (
        <div style={{ position: "relative", width: "100%", height: 740, background: "#0d0f11" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <g transform={`translate(${OFFSET}, 0)`}>
                    {edges.map((d, i) => (
                        <path key={i} d={d} stroke={EDGE} strokeWidth={SW} fill="none" />
                    ))}
                </g>
            </svg>
            {nodes.map((n) => <Node key={n.label} {...n} />)}
        </div>
    );
}
export default NetworkGraph;