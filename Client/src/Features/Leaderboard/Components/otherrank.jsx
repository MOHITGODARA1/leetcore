import React from "react";

const OTHER_RANKS = [
    { rank: 4, name: "Sarah Kim", prize: "15,000", points: 1850 },
    { rank: 5, name: "Marcus Lee", prize: "10,000", points: 1720 },
    { rank: 6, name: "Priya Patel", prize: "8,000", points: 1600 },
    { rank: 7, name: "Jake Torres", prize: "6,000", points: 1480 },
    { rank: 8, name: "Nina Walsh", prize: "4,000", points: 1350 },
    { rank: 9, name: "Omar Raza", prize: "2,500", points: 1210 },
    { rank: 10, name: "Ella Stone", prize: "1,000", points: 1090 },
    { rank: 11, name: "Sarah Kim", prize: "15,000", points: 1000 },
    { rank: 12, name: "Marcus Lee", prize: "10,000", points: 900 },
    { rank: 13, name: "Priya Patel", prize: "8,000", points: 800 },
    { rank: 14, name: "Jake Torres", prize: "6,000", points: 700 },
    { rank: 15, name: "Nina Walsh", prize: "4,000", points: 600 },
    { rank: 16, name: "Omar Raza", prize: "2,500", points: 500 },
    { rank: 17, name: "Ella Stone", prize: "1,000", points: 400 },
];

function DiamondIcon({ className }) {
    return (
        <svg className={className} width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5L2 9l10 12L22 9l-3-6zm-7 14.5L4.5 9.5 7 5h10l2.5 4.5L12 17.5z" />
        </svg>
    );
}

function Otherrank() {
    return (
        <div className="w-full bg-[#141414] p-6 mt-6 rounded-xl">

            {/* Table Header */}
            <div className="grid grid-cols-4 px-6 pb-3 text-[11px] tracking-widest uppercase text-[#6a645f] border-b border-white/[0.05]">
                <span>Rank</span>
                <span>Username</span>
                <span className="text-center">Points</span>
                <span className="text-right">Reward</span>
            </div>

            {/* Rows */}
            <div className="flex flex-col">
                {OTHER_RANKS.map((player) => (
                    <div
                        key={player.rank}
                        className="grid grid-cols-4 items-center px-6 py-4 border-b border-white/[0.04]  transition-all"
                    >
                        {/* Rank */}
                        <span className="text-[#e8c547] font-bold text-sm">
                            #{player.rank}
                        </span>

                        {/* Username */}
                        <span className="text-white text-sm font-medium truncate">
                            {player.name}
                        </span>

                        {/* Points */}
                        <span className="text-[#6a645f] text-sm text-center">
                            {player.points.toLocaleString()}
                        </span>

                        {/* Reward */}
                        <div className="flex items-center justify-end gap-2">
                            <DiamondIcon className="text-[#6a645f]" />
                            <span className="text-white font-semibold text-sm">
                                {player.prize}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Otherrank;