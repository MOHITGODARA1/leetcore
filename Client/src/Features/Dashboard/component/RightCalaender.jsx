import { useState, useEffect, useRef } from "react";

function RightCalender() {
    const today = new Date();
    const [displayDate, setDisplayDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [direction, setDirection] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [activeDates, setActiveDates] = useState([]);
    const [cellSize, setCellSize] = useState(28);
    const containerRef = useRef(null);

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    const totalRows = Math.ceil(days.length / 7);

    // Compute cell size from BOTH container width AND height so it fits vertically too
    useEffect(() => {
        const calc = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.offsetWidth;
            const h = containerRef.current.offsetHeight;

            // Width-based: 7 cols, 14px padding each side, 6×2px gaps
            const sizeFromWidth = Math.floor((w - 28 - 12) / 7);

            // Height-based: account for header (~44px), month label (~30px),
            // weekday row (~24px), divider (~9px), dot space (6px/row)
            const fixedVertical = 44 + 30 + 24 + 9;
            const dotSpace = totalRows * 6;
            const availableForCells = h - fixedVertical - dotSpace - 16; // 16px bottom padding
            const sizeFromHeight = Math.floor(availableForCells / totalRows);

            const size = Math.max(20, Math.min(36, Math.min(sizeFromWidth, sizeFromHeight)));
            setCellSize(size);
        };

        calc();
        const ro = new ResizeObserver(calc);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [totalRows]);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
                const res = await fetch(`${API_URL}/api/v5/streak`, { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.streak) {
                        setActiveDates(data.streak.activeDates || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching streak:", error);
            }
        };
        fetchStreak();

        const tick = () => {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 999);
            const diff = end - now;
            const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
            setTimeLeft(`${h}:${m}:${s}`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const navigate = (dir) => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setDisplayDate(new Date(year, month + (dir === "next" ? 1 : -1), 1));
            setDirection(null);
            setAnimating(false);
        }, 260);
    };

    const isToday = (day) =>
        day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const isPast = (day) => {
        const d = new Date(year, month, day);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return d <= todayStart;
    };

    const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
    const monthName = displayDate.toLocaleString("default", { month: "long" });

    const scale = cellSize / 28;
    const dayFontSize = Math.max(10, Math.round(12 * scale));
    const dotSize = Math.max(3, Math.round(4 * scale));
    // Row height = cell + dot gap + dot — compressed when small
    const rowHeight = cellSize + dotSize + 4;

    return (
        <div
            ref={containerRef}
            style={{
                padding: "14px 12px",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                userSelect: "none",
                width: "100%",
                height: "100%",           // fill parent fully
                boxSizing: "border-box",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",        // never scroll
            }}
        >
            <style>{`
                @keyframes slideInFromRight { from { transform: translateX(28px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideInFromLeft  { from { transform: translateX(-28px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideOutToLeft   { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-28px); opacity: 0; } }
                @keyframes slideOutToRight  { from { transform: translateX(0); opacity: 1; } to { transform: translateX(28px); opacity: 0; } }
                @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
                .cal-grid { animation-duration: 0.26s; animation-timing-function: cubic-bezier(.22,.68,0,1.1); animation-fill-mode: both; }
                .cal-grid.exit-left   { animation-name: slideOutToLeft; }
                .cal-grid.exit-right  { animation-name: slideOutToRight; }
                .cal-grid.enter-right { animation-name: slideInFromRight; }
                .cal-grid.enter-left  { animation-name: slideInFromLeft; }
                .day-cell { transition: background 0.15s ease, transform 0.15s ease; }
                .day-cell:hover { background: rgba(255,255,255,0.09) !important; transform: scale(1.12); }
                .nav-btn { background: transparent; border: none; color: rgba(255,255,255,0.35); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s, transform 0.12s; flex-shrink: 0; }
                .nav-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); transform: scale(1.1); }
                .nav-btn:active { transform: scale(0.92); }
                .today-cell { animation: popIn 0.4s cubic-bezier(.22,.68,0,1.2) both; }
            `}</style>

            {/* Header: Day N + countdown */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", minWidth: 0, flex: "1 1 auto" }}>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
                        Day {today.getDate()}
                    </span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {timeLeft} left
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                    <button className="nav-btn" onClick={() => navigate("prev")}>
                        <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                            <path d="M8 2.5L4.5 6.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="nav-btn" onClick={() => navigate("next")}>
                        <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                            <path d="M5 2.5L8.5 6.5L5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Month label */}
            <div style={{ textAlign: "center", marginBottom: "10px", flexShrink: 0 }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.02em" }}>
                    {monthName} {year}
                </span>
            </div>

            {/* Weekday labels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "4px", flexShrink: 0 }}>
                {WEEKDAYS.map((d, i) => (
                    <div key={i} style={{
                        textAlign: "center",
                        fontSize: Math.max(9, Math.round(11 * scale)) + "px",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.25)",
                        letterSpacing: "0.03em",
                        paddingBottom: "4px",
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "6px", flexShrink: 0 }} />

            {/* Days grid — flex-grow so it fills remaining space */}
            <div style={{ flex: "1 1 0", minHeight: 0, display: "flex", alignItems: "center" }}>
                <div
                    key={`${year}-${month}`}
                    className={`cal-grid ${animating
                        ? direction === "next" ? "exit-left" : "exit-right"
                        : direction === "next" ? "enter-right" : direction === "prev" ? "enter-left" : "enter-right"
                        }`}
                    style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", width: "100%" }}
                >
                    {days.map((day, i) => {
                        const isTd = day && isToday(day);
                        const isPd = day && isPast(day);
                        const isWknd = day && (i % 7 === 0 || i % 7 === 6);
                        const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : "";
                        const isActive = day && activeDates.includes(dateStr);
                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: rowHeight + "px", gap: "2px" }}>
                                {day ? (
                                    <>
                                        <div
                                            className={`day-cell ${isTd ? "today-cell" : ""}`}
                                            onMouseEnter={() => setHoveredDay(`${year}-${month}-${day}`)}
                                            onMouseLeave={() => setHoveredDay(null)}
                                            style={{
                                                width: cellSize + "px",
                                                height: cellSize + "px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: dayFontSize + "px",
                                                fontWeight: isTd ? 700 : 400,
                                                cursor: "pointer",
                                                background: isActive ? "#22c55e" : "transparent",
                                                color: isActive ? "#fff" : isWknd ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.85)",
                                                border: isTd && !isActive ? "1px solid rgba(34, 197, 94, 0.4)" : "none",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {day}
                                        </div>
                                        {isPd && (
                                            <div style={{
                                                width: dotSize + "px",
                                                height: dotSize + "px",
                                                borderRadius: "50%",
                                                background: isActive ? "#22c55e" : "#ef4444",
                                                opacity: isActive ? 0.9 : 0.7,
                                                marginTop: "-2px",
                                            }} />
                                        )}
                                    </>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RightCalender;