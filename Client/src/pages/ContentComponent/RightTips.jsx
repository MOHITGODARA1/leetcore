import { useState } from "react";

const tips = [
    {
        title: "Hashing",
        tip: "Use for fast lookup, frequency count, or duplicate detection",
        color: "purple",
        badge: "O(1)",
        icon: "#",
    },
    {
        title: "Arrays",
        tip: "Use sliding window for subarray/substring problems with contiguous range",
        color: "blue",
        badge: "O(n)",
        icon: "[]",
    },
    {
        title: "Arrays",
        tip: "Use prefix sum to quickly compute range sums and detect subarrays with given sum",
        color: "green",
        badge: "O(n)",
        icon: "∑",
    }
];

const colorMap = {
    purple: {
        icon: "bg-purple-500/10 text-purple-400",
        title: "text-purple-400",
        badge: "bg-purple-500/10 text-purple-400",
    },
    blue: {
        icon: "bg-blue-500/10 text-blue-400",
        title: "text-blue-400",
        badge: "bg-blue-500/10 text-blue-400",
    },
    green: {
        icon: "bg-green-500/10 text-green-400",
        title: "text-green-400",
        badge: "bg-green-500/10 text-green-400",
    },
};

function RightTips() {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="h-full text-white p-4 flex flex-col gap-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
                <h2 className="text-[11px] font-medium tracking-widest uppercase text-gray-500">
                    DSA Smart Tips
                </h2>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
                {tips.map((item, index) => {
                    const c = colorMap[item.color];
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            className={`
                flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer
                transition-all duration-200 ease-out
                ${hovered === index
                                    ? "bg-[#2a2a2a] border-[#444] -translate-y-0.5"
                                    : "bg-[#1e1e1e] border-[#2e2e2e]"
                                }
              `}
                            style={{
                                animation: `slideIn 0.3s ease both`,
                                animationDelay: `${index * 0.07 + 0.04}s`,
                            }}
                        >
                            {/* Icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold font-mono flex-shrink-0 mt-0.5 ${c.icon}`}>
                                {item.icon}
                            </div>

                            {/* Body */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-medium mb-1 ${c.title}`}>
                                    {item.title}
                                </p>
                                <p className="text-[12px] text-gray-400 leading-snug">
                                    {item.tip}
                                </p>
                            </div>

                            {/* Badge */}
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${c.badge}`}>
                                {item.badge}
                            </span>
                        </div>
                    );
                })}
            </div>

            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

export default RightTips;