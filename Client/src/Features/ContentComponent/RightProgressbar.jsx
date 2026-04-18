import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function RightProgressbar() {
    const { topic } = useParams();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const [stats, setStats] = useState({
        topic: topic || "Topic",
        total: 1, // avoid divide by 0
        solved: 0,
        easy: { solved: 0, total: 1 },
        medium: { solved: 0, total: 1 },
        hard: { solved: 0, total: 1 }
    });

    const fetchProgress = async () => {
        if (!topic) return;
        try {
            const res = await fetch(`${API_URL}/api/v3/progress?topic=${topic}`, {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setStats({
                    topic: data.topic,
                    total: data.total || 1,
                    solved: data.solved || 0,
                    easy: data.easy || { solved: 0, total: 1 },
                    medium: data.medium || { solved: 0, total: 1 },
                    hard: data.hard || { solved: 0, total: 1 }
                });
            }
        } catch (err) {
            console.error("Error fetching progress for sidebar:", err);
        }
    };

    useEffect(() => {
        fetchProgress();
        
        window.addEventListener("progressUpdated", fetchProgress);
        return () => window.removeEventListener("progressUpdated", fetchProgress);
    }, [topic, API_URL]);

    const { total, solved, easy, medium, hard } = stats;
    const progress = total > 0 ? (solved / total) : 0;
    
    const radius = 46;
    const stroke = 9;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progress * circumference;

    const eBarRef = useRef(null);
    const mBarRef = useRef(null);
    const hBarRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => {
            if (eBarRef.current) eBarRef.current.style.width = `${easy.total > 0 ? (easy.solved / easy.total) * 100 : 0}%`;
            if (mBarRef.current) mBarRef.current.style.width = `${medium.total > 0 ? (medium.solved / medium.total) * 100 : 0}%`;
            if (hBarRef.current) hBarRef.current.style.width = `${hard.total > 0 ? (hard.solved / hard.total) * 100 : 0}%`;
        }, 100);
        return () => clearTimeout(t);
    }, [stats]);

    const DiffRow = ({ label, color, data, barRef }) => (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium" style={{ color }}>{label}</span>
                <span className="text-[11px] text-gray-500 tabular-nums">{data.solved} / {data.total}</span>
            </div>
            <div className="h-[5px] bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                    ref={barRef}
                    className="h-full rounded-full w-0 transition-all duration-[1000ms] ease-out"
                    style={{ background: color }}
                />
            </div>
        </div>
    );

    return (
        <div className="text-white p-5 rounded-xl flex flex-col gap-5 animate-[fadeUp_0.35s_ease_both]">

            {/* Topic */}
            <div>
                <div className="text-[11px] font-medium tracking-widest uppercase text-gray-500 mb-1">
                    Current topic
                </div>
                <div className="text-base font-medium">{stats.topic}</div>
            </div>

            {/* Ring + Difficulty */}
            <div className="flex items-center gap-4">

                {/* Ring */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                    <svg width="110" height="110" viewBox="0 0 110 110">
                        <circle cx="55" cy="55" r={radius} fill="none" stroke="#1e1e1e" strokeWidth={stroke} />
                        <circle
                            cx="55" cy="55" r={radius}
                            fill="none"
                            stroke="#FACC15"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 55 55)"
                            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}
                        />
                    </svg>
                    <div className="absolute text-center">
                        <div className="text-xl font-medium">{Math.round(progress * 100)}%</div>
                        <div className="text-[10px] text-gray-500">completed</div>
                    </div>
                </div>

                {/* Difficulty bars */}
                <div className="flex flex-col gap-3 flex-1">
                    <DiffRow label="Easy" color="#1D9E75" data={easy} barRef={eBarRef} />
                    <DiffRow label="Med." color="#BA7517" data={medium} barRef={mBarRef} />
                    <DiffRow label="Hard" color="#E24B4A" data={hard} barRef={hBarRef} />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#1e1e1e] rounded-lg px-3.5 py-2.5 flex justify-between items-center">
                <span className="text-xs text-gray-400">Questions solved</span>
                <span className="text-sm font-medium">
                    {solved} <span className="text-gray-500 font-normal">/ {total}</span>
                </span>
            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

export default RightProgressbar;