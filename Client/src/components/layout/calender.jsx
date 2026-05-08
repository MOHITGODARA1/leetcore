import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

const COLOR_MAP = {
    red: { dot: "bg-red-500", pip: "#E24B4A", label: "Exam" },
    green: { dot: "bg-green-500", pip: "#4CAF50", label: "Study" },
    amber: { dot: "bg-amber-400", pip: "#EF9F27", label: "Due" },
};

function todayKey() {
    const t = new Date();
    return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
}

export default function Calendar() {
    const today = new Date();
    const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
    const [selected, setSelected] = useState({ day: today.getDate(), month: today.getMonth(), year: today.getFullYear() });
    const [events, setEvents] = useState([
        { day: today.getDate(), month: today.getMonth(), year: today.getFullYear(), name: "Study group", color: "green" },
        { day: today.getDate() + 2, month: today.getMonth(), year: today.getFullYear(), name: "Math exam", color: "red" },
        { day: today.getDate() + 5, month: today.getMonth(), year: today.getFullYear(), name: "Assignment due", color: "amber" },
    ]);
    const [studyDays] = useState(() => {
        const s = new Set();
        for (let i = 0; i < 5; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            if (Math.random() > 0.25) s.add(d.toDateString());
        }
        return s;
    });
    const [eventText, setEventText] = useState("");
    const [activeColor, setActiveColor] = useState("red");

    const { year: viewYear, month: viewMonth } = view;

    const prevMonth = () => setView(v => v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 });

    const nextMonth = () => setView(v => v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: v.month + 1 });

    const addEvent = useCallback(() => {
        const name = eventText.trim();
        if (!name) return;
        setEvents(prev => [...prev, { ...selected, name, color: activeColor }]);
        setEventText("");
    }, [eventText, selected, activeColor]);

    // Build calendar cells (always 42 = 6 rows × 7)
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--)
        cells.push({ day: daysInPrev - i, type: "prev" });
    for (let d = 1; d <= daysInMonth; d++)
        cells.push({ day: d, type: "current" });
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++)
        cells.push({ day: d, type: "next" });

    // Streak (last 7 days)
    const streakDots = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return studyDays.has(d.toDateString());
    });
    const streak = (() => {
        let s = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            if (studyDays.has(d.toDateString())) s++;
            else if (i > 0) break;
        }
        return s;
    })();

    // Events for footer
    const selEvents = events.filter(e =>
        e.day === selected.day && e.month === selected.month && e.year === selected.year);

    const upcomingEvents = events
        .filter(e => new Date(e.year, e.month, e.day) >= today)
        .sort((a, b) => new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day))
        .slice(0, 3);

    const footerTitle = selEvents.length > 0
        ? (selected.month === today.getMonth() && selected.day === today.getDate() && selected.year === today.getFullYear()
            ? "Today"
            : `${MONTHS[selected.month].slice(0, 3)} ${selected.day}`)
        : "Upcoming";

    const footerEvents = selEvents.length > 0 ? selEvents : upcomingEvents;

    return (
        <div className="w-[94%] mx-auto my-2 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden text-sm font-sans shadow-sm">

            {/* Header */}
            <div className="px-4 pt-3 pb-4 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-[15px] font-medium text-neutral-900 dark:text-white">
                        {MONTHS[viewMonth]} {viewYear}
                    </span>
                    <div className="flex gap-1">
                        {[prevMonth, nextMonth].map((fn, i) => (
                            <button
                                key={i}
                                onClick={fn}
                                className="w-7 h-7 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-neutral-500 hover:bg-black/5 dark:hover:bg-white/5 transition"
                            >
                                {i === 0 ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                            </button>
                        ))}
                    </div>
                </div>


            </div>

            {/* Grid */}
            <div className="px-3 py-5">
                <div className="grid grid-cols-7 gap-[2px] mb-1">
                    {DAY_HEADERS.map((d, i) => (
                        <div
                            key={i}
                            className={`text-center text-[10px] font-medium py-1 text-neutral-400"
                                }`}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-[2px]">
                    {cells.map(({ day, type }, idx) => {
                        const cellYear = type === "prev" ? (viewMonth === 0 ? viewYear - 1 : viewYear)
                            : type === "next" ? (viewMonth === 11 ? viewYear + 1 : viewYear) : viewYear;
                        const cellMonth = type === "prev" ? (viewMonth === 0 ? 11 : viewMonth - 1)
                            : type === "next" ? (viewMonth === 11 ? 0 : viewMonth + 1) : viewMonth;

                        const isToday = day === today.getDate() && cellMonth === today.getMonth() && cellYear === today.getFullYear();
                        const isSelected = day === selected.day && cellMonth === selected.month && cellYear === selected.year;
                        const isOther = type !== "current";
                        const colIdx = idx % 7;
                        const isWeekend = colIdx === 0 || colIdx === 6;
                        const dayEvts = events.filter(e => e.day === day && e.month === cellMonth && e.year === cellYear);

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (type !== "current") setView({ year: cellYear, month: cellMonth });
                                    setSelected({ day, month: cellMonth, year: cellYear });
                                }}
                                className={[
                                    "aspect-square flex items-center justify-center relative rounded-lg cursor-pointer transition-all text-[12px]",
                                    isToday ? "bg-[#F46717] text-white font-medium"
                                        : isSelected && !isOther ? "bg-black/5 dark:bg-white/5 font-medium ring-1 ring-black/15 dark:ring-white/15"
                                            : isOther ? "text-neutral-300 dark:text-neutral-600"
                                                : "text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5",
                                ].join(" ")}
                            >
                                {day}

                            </div>
                        );
                    })}
                </div>
            </div>



        </div>
    );
}