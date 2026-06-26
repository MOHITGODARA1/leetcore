import { useEffect, useMemo, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { consistencyService } from "../../../services/consistencyService";

function ConsistencyBar({ userId: userIdProp }) {
    const { user } = useAuth();
    const userId = userIdProp || user?._id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(userId));
    const [selectedYear, setSelectedYear] = useState("current"); // "current" or "previous"
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [data, loading]);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        let mounted = true;

        const fetchConsistency = async () => {
            setLoading(true);

            try {
                const params = { days: 365 };
                if (selectedYear === "previous") {
                    const prevYear = new Date().getFullYear() - 1;
                    params.year = prevYear;
                }
                const response = await consistencyService.getConsistencyData(userId, params);

                if (mounted) {
                    setData(response.data);
                }
            } catch (error) {
                console.error("Failed to load consistency:", error);

                if (mounted) {
                    setData(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchConsistency();

        return () => {
            mounted = false;
        };
    }, [userId, selectedYear]);

    const months = useMemo(() => {
        const result = [];
        const date = new Date();
        if (selectedYear === "previous") {
            date.setFullYear(new Date().getFullYear() - 1);
            date.setMonth(11); // December of previous year
        }
        for (let i = 11; i >= 0; i--) {
            const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
            const label = d.toLocaleDateString("en-US", { month: "short" });
            const year = d.getFullYear();
            const monthVal = d.getMonth();
            const daysCount = new Date(year, monthVal + 1, 0).getDate();
            result.push({
                label,
                year,
                monthVal,
                daysCount,
            });
        }
        return result;
    }, [selectedYear]);

    const activityMap = useMemo(() => {
        const map = new Map();
        if (data?.heatmap) {
            data.heatmap.forEach((day) => {
                if (day.date) {
                    map.set(day.date, day);
                }
            });
        }
        return map;
    }, [data?.heatmap]);

    const totalSolved = data?.heatmap?.reduce((total, day) => total + (day.problemsSolved || 0), 0) || 0;
    const totalActiveDays = user?.stats?.totalActiveDays || data?.activeDays || 0;
    const maxStreak = user?.stats?.maxStreak || 0;

    return (
        <div
            className="
                w-full
                rounded-2xl
                bg-[#121215]/60
                border
                border-white/[0.05]
                shadow-lg
                backdrop-blur-md
                p-6
                overflow-hidden
                relative
                min-h-[220px]
            "
        >
            {/* Header */}
            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    gap-4
                    items-center
                    justify-between
                    mb-5
                    relative
                    z-10
                "
            >
                {/* Left */}
                <div>
                    <h1
                        className="
                            text-md
                            font-semibold
                            text-white
                        "
                    >
                        {loading ? "--" : totalSolved}
                        <span
                            className="
                                text-gray-400
                                font-light
                                text-sm
                                ml-2
                            "
                        >
                            problems solved in the selected period
                        </span>
                    </h1>
                </div>

                {/* Right Year Toggle & Stats */}
                <div
                    className="
                        flex
                        items-center
                        gap-6
                        flex-wrap
                        text-gray-400
                        text-sm
                        font-light
                    "
                >
                    {/* Year selection toggle tabs */}
                    <div className="flex gap-1.5 bg-white/5 border border-white/10 p-1 rounded-xl">
                        <button
                            onClick={() => setSelectedYear("current")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                selectedYear === "current" ? "bg-orange-500 text-white" : "text-white/60 hover:text-white"
                            }`}
                        >
                            Current Year
                        </button>
                        <button
                            onClick={() => setSelectedYear("previous")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                selectedYear === "previous" ? "bg-orange-500 text-white" : "text-white/60 hover:text-white"
                            }`}
                        >
                            Previous Year ({new Date().getFullYear() - 1})
                        </button>
                    </div>

                    <p>
                        Total active days:
                        <span className="text-white font-semibold ml-2">
                            {loading ? "--" : totalActiveDays}
                        </span>
                    </p>

                    <p>
                        Max streak:
                        <span className="text-white font-semibold ml-2">
                            {loading ? "--" : maxStreak}
                        </span>
                    </p>
                </div>
            </div>

            {/* Heatmap */}
            <div
                ref={scrollRef}
                className="
                    flex
                    gap-6
                    overflow-x-auto
                    relative
                    z-10
                "
            >
                {months.map((monthObj) => {
                    const startDayOfWeek = new Date(monthObj.year, monthObj.monthVal, 1).getDay();
                    const emptyArray = Array.from({ length: startDayOfWeek });
                    const daysArray = Array.from({ length: monthObj.daysCount }, (_, i) => i + 1);
                    return (
                        <div
                            key={`${monthObj.year}-${monthObj.monthVal}`}
                            className="
                                flex
                                flex-col
                                items-center
                                gap-3
                                flex-shrink-0
                            "
                        >
                            {/* Grid */}
                            <div
                                className="
                                    grid
                                    grid-flow-col
                                    gap-[5px]
                                "
                                style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
                            >
                                {emptyArray.map((_, index) => (
                                    <div
                                        key={`empty-${monthObj.year}-${monthObj.monthVal}-${index}`}
                                        className="w-3 h-3 bg-transparent"
                                    />
                                ))}
                                {daysArray.map((dayVal) => {
                                    const yearStr = monthObj.year;
                                    const monthStr = String(monthObj.monthVal + 1).padStart(2, '0');
                                    const dayStr = String(dayVal).padStart(2, '0');
                                    const dateKey = `${yearStr}-${monthStr}-${dayStr}`;
                                    
                                    const dayData = activityMap.get(dateKey);
                                    const solvedCount = dayData?.problemsSolved || 0;
                                    
                                    let bgClass = "bg-[#161b22] border border-white/[0.01]";
                                    if (loading) {
                                        bgClass = "bg-white/10 animate-pulse";
                                    } else if (solvedCount > 0) {
                                        if (solvedCount === 1) {
                                            bgClass = "bg-[#0e4429] hover:bg-[#0e4429]/80";
                                        } else if (solvedCount === 2) {
                                            bgClass = "bg-[#006d32] hover:bg-[#006d32]/80";
                                        } else if (solvedCount === 3) {
                                            bgClass = "bg-[#26a641] hover:bg-[#26a641]/80";
                                        } else {
                                            bgClass = "bg-[#39d353] hover:bg-[#39d353]/80";
                                        }
                                    }
                                    
                                    return (
                                        <div
                                            key={dateKey}
                                            className={`
                                                w-3
                                                h-3
                                                rounded-[2px]
                                                ${bgClass}
                                            `}
                                            title={`${dateKey}: ${dayData?.problemsSolved || 0} solved`}
                                        />
                                    );
                                })}
                            </div>

                            {/* Month */}
                            <p
                                className="
                                    text-gray-400
                                    text-sm
                                    font-medium
                                "
                            >
                                {monthObj.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ConsistencyBar;
