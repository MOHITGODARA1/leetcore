import { useState, useEffect, useRef } from "react";

function RightCalender() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [direction, setDirection] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [displayDate, setDisplayDate] = useState(today);
    const [hoveredDay, setHoveredDay] = useState(null);

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    const navigate = (dir) => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            const next = new Date(year, month + (dir === "next" ? 1 : -1), 1);
            setDisplayDate(next);
            setCurrentDate(next);
            setDirection(null);
            setAnimating(false);
        }, 260);
    };

    const isToday = (day) =>
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const monthName = displayDate.toLocaleString("default", { month: "long" });

    return (
        <div style={{
            padding: "20px 16px 16px",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            userSelect: "none",
            height: "100%",
            boxSizing: "border-box",
        }}>
            <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(32px); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-32px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(-32px); opacity: 0; }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0);   opacity: 1; }
          to   { transform: translateX(32px); opacity: 0; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .cal-grid {
          animation-duration: 0.26s;
          animation-timing-function: cubic-bezier(.22,.68,0,1.1);
          animation-fill-mode: both;
        }
        .cal-grid.exit-left  { animation-name: slideOutToLeft; }
        .cal-grid.exit-right { animation-name: slideOutToRight; }
        .cal-grid.enter-right { animation-name: slideInFromRight; }
        .cal-grid.enter-left  { animation-name: slideInFromLeft; }
        .day-cell {
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .day-cell:hover {
          background: rgba(255,255,255,0.08) !important;
          transform: scale(1.12);
        }
        .nav-btn {
          transition: background 0.15s ease, color 0.15s ease, transform 0.12s ease;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          transform: scale(1.1);
        }
        .nav-btn:active { transform: scale(0.92); }
        .today-cell {
          animation: popIn 0.4s cubic-bezier(.22,.68,0,1.2) both;
        }
      `}</style>

            {/* Header */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "18px",
            }}>
                <button className="nav-btn" onClick={() => navigate("prev")}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M8 2.5L4.5 6.5L8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div style={{ textAlign: "center" }}>
                    <div style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.88)",
                        letterSpacing: "-0.01em",
                    }}>
                        {monthName}
                    </div>
                    <div style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.3)",
                        marginTop: "1px",
                        fontFamily: "'JetBrains Mono', monospace",
                    }}>
                        {year}
                    </div>
                </div>

                <button className="nav-btn" onClick={() => navigate("next")}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M5 2.5L8.5 6.5L5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Weekday labels */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                marginBottom: "8px",
                gap: "2px",
            }}>
                {WEEKDAYS.map((d, i) => (
                    <div key={i} style={{
                        textAlign: "center",
                        fontSize: "10px",
                        fontWeight: 500,
                        color: (i === 0 || i === 6)
                            ? "rgba(239,68,68,0.45)"
                            : "rgba(255,255,255,0.22)",
                        letterSpacing: "0.04em",
                        paddingBottom: "4px",
                    }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Separator */}
            <div style={{
                height: "1px",
                background: "rgba(255,255,255,0.05)",
                marginBottom: "10px",
            }} />

            {/* Days grid */}
            <div
                key={`${year}-${month}`}
                className={`cal-grid ${animating
                        ? direction === "next" ? "exit-left" : "exit-right"
                        : direction === "next" ? "enter-right" : direction === "prev" ? "enter-left" : "enter-right"
                    }`}
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "3px",
                }}
            >
                {days.map((day, i) => {
                    const isTd = day && isToday(day);
                    const isWknd = day && ((i % 7 === 0) || (i % 7 === 6));
                    return (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "34px",
                        }}>
                            {day ? (
                                <div
                                    className={`day-cell ${isTd ? "today-cell" : ""}`}
                                    onMouseEnter={() => setHoveredDay(`${year}-${month}-${day}`)}
                                    onMouseLeave={() => setHoveredDay(null)}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontWeight: isTd ? 600 : 400,
                                        cursor: "pointer",
                                        background: isTd
                                            ? "#22c55e"
                                            : "transparent",
                                        color: isTd
                                            ? "#fff"
                                            : isWknd
                                                ? "rgba(239,68,68,0.55)"
                                                : "rgba(255,255,255,0.65)",
                                        boxShadow: isTd
                                            ? "0 0 14px rgba(34,197,94,0.45)"
                                            : "none",
                                        position: "relative",
                                    }}
                                >
                                    {day}
                                    {isTd && (
                                        <span style={{
                                            position: "absolute",
                                            bottom: "3px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: "3px",
                                            height: "3px",
                                            borderRadius: "50%",
                                            background: "#fff",
                                            opacity: 0.7,
                                        }} />
                                    )}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RightCalender;