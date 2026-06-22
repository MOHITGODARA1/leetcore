import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { consistencyService } from "../../services/consistencyService";

const MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Calendar() {
    const today = new Date();
    const { user } = useAuth();
    const userId = user?._id;

    const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
    const [activityMap, setActivityMap] = useState(new Map());
    const [timeLeft, setTimeLeft] = useState("");

    // Countdown timer for midnight tonight
    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const endOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59,
                999
            );
            const diff = endOfDay.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft("00:00:00 left");
                return;
            }
            const hrs = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
            const mins = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
            const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
            setTimeLeft(`${hrs}:${mins}:${secs} left`);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch user consistency data
    useEffect(() => {
        if (!userId) return;
        const fetchConsistency = async () => {
            try {
                const params = { days: 365 };
                if (view.year < today.getFullYear()) {
                    params.year = view.year;
                }
                const response = await consistencyService.getConsistencyData(userId, params);
                if (response?.data?.heatmap) {
                    const map = new Map();
                    response.data.heatmap.forEach((day) => {
                        if (day.date) {
                            map.set(day.date, (day.problemsSolved || 0) > 0);
                        }
                    });
                    setActivityMap(map);
                }
            } catch (err) {
                console.error("Failed to fetch calendar consistency:", err);
            }
        };
        fetchConsistency();
    }, [userId, view.year]);

    const prevMonth = () => {
        setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
    };

    const nextMonth = () => {
        setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));
    };

    // Calculate cells
    const firstDay = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
        cells.push({ day: null, type: "empty" });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, type: "current" });
    }
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const remaining = totalCells - cells.length;
    for (let i = 0; i < remaining; i++) {
        cells.push({ day: null, type: "empty" });
    }



    return (
        <div className="w-[94%] mx-auto my-2 bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden text-sm font-sans shadow-lg p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <span className="text-white font-semibold text-md leading-tight">Day {today.getDate()}</span>
                    <span className="text-white/40 text-xs font-mono mt-0.5">{timeLeft}</span>
                </div>

                {/* Right controls + Badge */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                    </button>

                    {/* Hexagon Challenge Badge */}
                    <div className="relative w-10 h-10 flex items-center justify-center select-none">
                        <svg className="absolute w-full h-full text-[#b38f4f]/15" viewBox="0 0 100 100">
                            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="currentColor" stroke="#b38f4f" strokeWidth="4" />
                        </svg>
                        <div className="z-10 flex items-center justify-center text-center">
                            <span className="text-[11px] font-bold text-[#e1b467] leading-none uppercase tracking-wide">{MONTHS_SHORT[view.month]}</span>
                        </div>
                    </div>

                    <button
                        onClick={nextMonth}
                        className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {DAY_HEADERS.map((d, i) => (
                    <div key={i} className="text-[10px] font-medium text-white/30 uppercase tracking-wider py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {cells.map(({ day, type }, idx) => {
                    if (type === "empty") {
                        return <div key={idx} className="aspect-square" />;
                    }

                    const yearStr = view.year;
                    const monthStr = String(view.month + 1).padStart(2, "0");
                    const dayStr = String(day).padStart(2, "0");
                    const dateKey = `${yearStr}-${monthStr}-${dayStr}`;

                    const isCompleted = activityMap.get(dateKey) || false;
                    const isToday =
                        day === today.getDate() &&
                        view.month === today.getMonth() &&
                        view.year === today.getFullYear();

                    if (isCompleted) {
                        return (
                            <div key={idx} className="aspect-square flex items-center justify-center">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#30a2ff] hover:bg-white/5 transition relative cursor-pointer" title={`${dateKey}: Solved`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                    </svg>
                                </div>
                            </div>
                        );
                    }

                    if (isToday) {
                        return (
                            <div key={idx} className="aspect-square flex items-center justify-center">
                                <div className="w-7 h-7 rounded-full bg-[#2DB55E] flex items-center justify-center text-white text-[11px] font-bold shadow-md shadow-[#2DB55E]/30 cursor-pointer">
                                    {day}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className="aspect-square flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full hover:bg-white/5 flex items-center justify-center text-white/80 text-[11px] font-normal transition cursor-pointer">
                                {day}
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}
