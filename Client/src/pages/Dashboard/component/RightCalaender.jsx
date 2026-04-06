import { useState } from "react";

function RightCalender() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
        days.push(i);
    }

    const handlePrev = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNext = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    return (
        <div className="h-full text-white p-4">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrev} className="text-gray-400 hover:text-white">
                    ◀
                </button>

                <h2 className="font-semibold">
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </h2>

                <button onClick={handleNext} className="text-gray-400 hover:text-white">
                    ▶
                </button>
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i}>{d}</div>
                ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((day, i) => (
                    <div key={i} className="h-10 flex items-center justify-center">
                        {day ? (
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition
                ${isToday(day)
                                        ? "bg-green-500 text-white"
                                        : "text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                {day}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>

        </div>
    );
}

export default RightCalender;