import React from "react";
import DashNavbar from "../Components/dahboardnav";
import TopThree from "../Leaderboard/Topthree";
import Otherrank from "../Leaderboard/otherrank";
function Leaderboardpage() {
    return (
        <div
            className="min-h-screen"
            style={{
                background: "#080808",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <DashNavbar />

            {/* Subtle radial glow — gray only */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse at 50% 0%, rgba(40,40,40,0.4) 0%, transparent 55%),
                        radial-gradient(ellipse at 15% 85%, rgba(25,25,25,0.3) 0%, transparent 45%),
                        radial-gradient(ellipse at 85% 65%, rgba(25,25,25,0.3) 0%, transparent 45%)
                    `,
                }}
            />

            {/* Stars */}
            <StarField />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center mt-10 pt-12 pb-24 px-4">
                <p className="font-mono text-[#6a645f] text-[11px] tracking-[0.25em] uppercase mb-2">
                    Season 1
                </p>

                <h1 className="font-syne text-4xl font-extrabold tracking-tight text-white mb-10">
                    Leaderboard
                </h1>
                <TopThree />
                <Otherrank />
            </div>
        </div>
    );
}

function StarField() {
    const stars = React.useMemo(() =>
        Array.from({ length: 100 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 1.5 + 0.3,
            opacity: Math.random() * 0.25 + 0.05,
        })), []
    );

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                    }}
                />
            ))}
        </div>
    );
}

export default Leaderboardpage;