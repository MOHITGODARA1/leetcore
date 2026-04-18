import { useEffect, useState } from "react";

function RightSuggestion() {
    const learnToday = [
        "Binary Search",
        "OS: Process Scheduling",
        "Two Pointer"
    ];

    const revisionToday = [
        "Arrays Basics",
        "OOPS Concepts",
    ];

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const pillStyle =
        "flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer " +
        "bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] " +
        "border border-[#3a3a3a] text-gray-300 text-sm " +
        "transition-all duration-300 ease-out " +
        "hover:scale-105 hover:shadow-lg hover:shadow-black/30 " +
        "hover:border-[#4a4a4a] hover:text-white";

    return (
        <div className="h-full text-white p-5 flex flex-col gap-8 overflow-y-auto">

            {/* Learn Today */}
            <div
                className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
            >
                <h2 className="text-xs tracking-wider uppercase font-semibold mb-4 text-gray-400">
                    Learn Today
                </h2>

                <div className="flex flex-wrap gap-3">
                    {learnToday.map((item, index) => (
                        <div
                            key={index}
                            className={`${pillStyle}`}
                            style={{
                                transitionDelay: `${index * 80}ms`,
                            }}
                        >
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revision Today */}
            <div
                className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                style={{ transitionDelay: "150ms" }}
            >
                <h2 className="text-xs tracking-wider uppercase font-semibold mb-4 text-gray-400">
                    Revision Today
                </h2>

                <div className="flex flex-wrap gap-3">
                    {revisionToday.map((item, index) => (
                        <div
                            key={index}
                            className={`${pillStyle}`}
                            style={{
                                transitionDelay: `${index * 80}ms`,
                            }}
                        >
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default RightSuggestion;