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

    return (
        <div className="h-full text-white p-4 flex flex-col gap-6 overflow-y-auto">

            {/* Learn Today */}
            <div>
                <h2 className="text-sm font-semibold mb-3 text-gray-300">
                    Learn Today
                </h2>

                <div className="flex flex-wrap gap-3">
                    {learnToday.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-[#333333] px-3 py-2 rounded-full cursor-pointer hover:bg-[#3a3a3a] transition"
                        >
                            <span className="text-gray-300 text-sm">{item}</span>


                        </div>
                    ))}
                </div>
            </div>

            {/* Revision Today */}
            <div>
                <h2 className="text-sm font-semibold mb-3 text-gray-300">
                    Revision Today
                </h2>

                <div className="flex flex-wrap gap-3">
                    {revisionToday.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-[#333333] px-3 py-2 rounded-full cursor-pointer hover:bg-[#3a3a3a] transition"
                        >
                            <span className="text-gray-300 text-sm">{item}</span>


                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default RightSuggestion;