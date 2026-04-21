import { useEffect, useState } from "react";

function RightSuggestion() {
    const exams = [
        { name: "Amazon OA", count: 3 },
        { name: "Flipkart OA", count: 5 },
        { name: "Google OA", count: 2 },
        { name: "Microsoft OA", count: 4 },
        { name: "Infosys OA", count: 7 },
        { name: "TCS NQT", count: 6 },
        { name: "Analytical", count: 8 },
        { name: "English", count: 5 },
        { name: "Quantitative", count: 9 },
        { name: "Logical Reasoning", count: 4 },
        { name: "Verbal Ability", count: 3 },
        { name: "Wipro OA", count: 5 },
    ];

    const learnToday = [
        { name: "Binary Search", count: 24 },
        { name: "OS: Process Scheduling", count: 12 },
        { name: "Two Pointer", count: 18 },
    ];

    const revisionToday = [
        { name: "Arrays", count: 31 },
        { name: "OOPS", count: 9 },
        { name: "DBMS", count: 9 },
        { name: "Networks", count: 9 },
    ];

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const pillStyle =
        "inline-flex items-center rounded-full cursor-pointer overflow-hidden " +
        "bg-[#2a2a2a] border border-[#3a3a3a] h-7 " +
        "transition-all duration-200 ease-out " +
        "hover:scale-105 hover:border-[#4a4a4a] " +
        "max-w-full min-w-0";

    const PillItem = ({ item, delay }) => (
        <div
            className={pillStyle}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <span className="px-2 sm:px-3 text-xs sm:text-sm text-gray-300 whitespace-nowrap truncate">
                {item.name}
            </span>
            <span
                className="h-5 px-1.5 sm:px-2 w-auto min-w-[24px] sm:min-w-[28px] mr-1 flex items-center justify-center rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: "#F59E0B", color: "#1a1a1a" }}
            >
                {item.count}
            </span>
        </div>
    );

    return (
        <div className="h-full w-full text-white p-3 sm:p-4 md:p-5 flex flex-col gap-4 sm:gap-6 overflow-y-auto overflow-x-hidden">

            {/* Exams */}
            <div
                className={`transition-all duration-500 min-w-0 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
                <h2 className="text-xs tracking-wider uppercase font-semibold mb-3 sm:mb-4 text-gray-400">
                    Placement Exams
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {exams.map((item, index) => (
                        <PillItem key={index} item={item} delay={index * 50} />
                    ))}
                </div>
            </div>

        </div>
    );
}

export default RightSuggestion;