import { useState, useEffect } from "react";

function RightCalender() {
    const today = new Date();
    const [displayDate, setDisplayDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [direction, setDirection] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [activeDates, setActiveDates] = useState([]);

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
                const res = await fetch(`${API_URL}/api/v5/streak`, {
                    credentials: "include"
                });
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

    return (
        <div style={{
            padding: "16px 14px",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            userSelect: "none",
            width: "100%",
            boxSizing: "border-box",
        }}>
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
                .nav-btn { background: transparent; border: none; color: rgba(255,255,255,0.35); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s, transform 0.12s; }
                .nav-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); transform: scale(1.1); }
                .nav-btn:active { transform: scale(0.92); }
                .today-cell { animation: popIn 0.4s cubic-bezier(.22,.68,0,1.2) both; }
            `}</style>

            {/* Header: Day N + countdown */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                        Day {today.getDate()}
                    </span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {timeLeft} left
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
            <div style={{ textAlign: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.02em" }}>
                    {monthName} {year}
                </span>
            </div>

            {/* Weekday labels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "6px" }}>
                {WEEKDAYS.map((d, i) => (
                    <div key={i} style={{
                        textAlign: "center",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: (i === 0 || i === 6) ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.25)",
                        letterSpacing: "0.03em",
                        paddingBottom: "6px",
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "8px" }} />

            {/* Days grid */}
            <div
                key={`${year}-${month}`}
                className={`cal-grid ${animating
                    ? direction === "next" ? "exit-left" : "exit-right"
                    : direction === "next" ? "enter-right" : direction === "prev" ? "enter-left" : "enter-right"
                    }`}
                style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}
            >
                {days.map((day, i) => {
                    const isTd = day && isToday(day);
                    const isPd = day && isPast(day);
                    const isWknd = day && (i % 7 === 0 || i % 7 === 6);
                    const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : "";
                    const isActive = day && activeDates.includes(dateStr);
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "36px", gap: "2px" }}>
                            {day ? (
                                <>
                                    <div
                                        className={`day-cell ${isTd ? "today-cell" : ""}`}
                                        onMouseEnter={() => setHoveredDay(`${year}-${month}-${day}`)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            fontWeight: isTd ? 700 : 400,
                                            cursor: "pointer",
                                            background: isActive ? "#22c55e" : "transparent",
                                            color: isActive ? "#fff" : isWknd ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.85)",
                                            border: isTd && !isActive ? "1px solid rgba(34, 197, 94, 0.4)" : "none",
                                        }}
                                    >
                                        {day}
                                    </div>
                                    {isPd && (
                                        <div style={{
                                            width: "4px",
                                            height: "4px",
                                            borderRadius: "50%",
                                            background: isActive ? "#22c55e" : "#ef4444",
                                            opacity: isActive ? 0.9 : 0.7,
                                            marginTop: "-4px",
                                        }} />
                                    )}
                                </>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RightCalender;