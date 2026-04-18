import React from "react";

const PODIUM = [
    {
        rank: 2,
        name: "Brian Ngo",
        avatar: "/avatars/brian.png",
        points: "Earn 2,000 points",
        prize: "50,000",
        height: "h-32",
        order: "order-1",
        avatarSize: "w-16 h-16",
        trophyColor: "text-[#6b7280]",
        podiumBg: "bg-[#0d0d0d]",
        border: "border-[#1f1f1f]",
        avatarBorder: "border-[#1f1f1f]",
    },
    {
        rank: 1,
        name: "Jolie Joie",
        avatar: "/avatars/jolie.png",
        points: "Earn 2,000 points",
        prize: "100,000",
        height: "h-48",
        order: "order-2",
        avatarSize: "w-20 h-20",
        trophyColor: "text-[#b8941f]",
        podiumBg: "bg-[#0d0d0d]",
        border: "border-[#2a2a2a]",
        avatarBorder: "border-[#2a2a2a]",
    },
    {
        rank: 3,
        name: "David Do",
        avatar: "/avatars/david.png",
        points: "Earn 2,000 points",
        prize: "20,000",
        height: "h-24",
        order: "order-3",
        avatarSize: "w-16 h-16",
        trophyColor: "text-[#7a4f2e]",
        podiumBg: "bg-[#0d0d0d]",
        border: "border-[#1f1f1f]",
        avatarBorder: "border-[#1f1f1f]",
    },
];

function TrophyIcon({ className }) {
    return (
        <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2v2H5C3.9 4 3 4.9 3 6v2c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V18H8v2h8v-2h-3v-2.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V6c0-1.1-.9-2-2-2h-2V2H7zm0 2h10v6c0 1.65-1.35 3-3 3h-4c-1.65 0-3-1.35-3-3V4zM5 6h2v4.78A3.01 3.01 0 0 1 5 8V6zm12 0h2v2c0 1.3-.84 2.4-2 2.78V6z" />
        </svg>
    );
}

function DiamondIcon({ className }) {
    return (
        <svg className={className} width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5L2 9l10 12L22 9l-3-6zm-7 14.5L4.5 9.5 7 5h10l2.5 4.5L12 17.5z" />
        </svg>
    );
}

function Topthreeweekly() {
    return (
        <div className="flex flex-col items-center w-full">
            {/* Podium Row */}
            <div className="flex items-end justify-center gap-3 px-4 pb-0 w-full max-w-sm">
                {PODIUM.map((player) => (
                    <div key={player.rank} className={`flex flex-col items-center ${player.order}`}>
                        {/* Avatar */}
                        <div
                            className={`${player.avatarSize} rounded-2xl overflow-hidden border ${player.avatarBorder} mb-2 bg-[#111111]`}
                        >
                            <img
                                src={player.avatar}
                                alt={player.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.style.background = "#161616";
                                }}
                            />
                        </div>

                        {/* Name */}
                        <p className="text-white font-medium text-xs mb-2 text-center">{player.name}</p>

                        {/* Podium Block */}
                        <div
                            className={`w-28 ${player.height} ${player.podiumBg} border-t border-x ${player.border} rounded-t-xl flex flex-col items-center pt-3 gap-1`}
                        >
                            <TrophyIcon className={player.trophyColor} />
                            <p className="text-[#3a3a3a] text-[9px] mt-1">{player.points}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <DiamondIcon className="text-[#555555]" />
                                <span className="text-white font-bold text-lg">{player.prize}</span>
                            </div>
                            <p className="text-[#3a3a3a] text-[9px]">Prize</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Timer — below all podium blocks */}
            <div className="mt-6 flex flex-col items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#555555">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm.01 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                </svg>
                <p className="text-[#3a3a3a] text-[10px] tracking-widest uppercase">Season ends in</p>
                <CountdownTimer />
            </div>
        </div>
    );
}

function CountdownTimer() {
    const [time, setTime] = React.useState({ d: 10, h: 23, m: 59, s: 29 });

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => {
                let { d, h, m, s } = prev;
                s--;
                if (s < 0) { s = 59; m--; }
                if (m < 0) { m = 59; h--; }
                if (h < 0) { h = 23; d--; }
                if (d < 0) { d = 0; h = 0; m = 0; s = 0; }
                return { d, h, m, s };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 mt-1">
            {[
                { val: time.d, label: "d" },
                { val: time.h, label: "h" },
                { val: time.m, label: "m" },
                { val: time.s, label: "s" },
            ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center">
                    <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg w-12 h-10 flex items-center justify-center">
                        <span className="text-white font-bold text-base">
                            {String(val).padStart(2, "0")}
                        </span>
                    </div>
                    <span className="text-[#3a3a3a] text-[9px] mt-1 uppercase tracking-wider">{label}</span>
                </div>
            ))}
        </div>
    );
}

export default Topthreeweekly;