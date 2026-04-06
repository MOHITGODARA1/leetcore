function RightTips() {
    const tips = [
        {
            title: "Hashing",
            tip: "Use for fast lookup, frequency count, or duplicate detection",
            color: "text-purple-400",
        },
        {
            title: "Arrays",
            tip: "Use Sliding Window for subarray/substring problems with contiguous range",
            color: "text-blue-400",
        },


    ];

    return (
        <div className="h-full text-white p-4 flex flex-col gap-6 overflow-y-auto ">

            {/* Header */}
            <div>
                <h2 className="text-sm font-semibold text-gray-400 mb-4">
                    💡 DSA Smart Tips
                </h2>

                <div className="flex flex-col gap-4">

                    {tips.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#333333] p-4 rounded-lg  transition cursor-pointer"
                        >
                            {/* Title */}
                            <div className={`font-semibold ${item.color}`}>
                                {item.title}
                            </div>

                            {/* Tip */}
                            <div className="text-sm text-gray-400 mt-1">
                                {item.tip}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default RightTips;