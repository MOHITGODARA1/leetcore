import { useState } from "react";

const CATEGORIES = ["All", "Arrays", "Trees", "Graphs", "DP", "Linked List", "Heap"];

const VIDEOS = [
    {
        id: 1,
        category: "Arrays",
        title: "Two Sum — Every Approach Explained",
        channel: "NeetCode",
        duration: "14:32",
        views: "2.1M",
        difficulty: "Easy",
        topic: "Arrays & Hashing",
        thumbnail: "https://i.ytimg.com/vi/KLlXCFG5TnA/hqdefault.jpg",
        videoId: "KLlXCFG5TnA",
        accent: "#c9f069",
    },
    {
        id: 2,
        category: "Trees",
        title: "Binary Tree Right Side View",
        channel: "NeetCode",
        duration: "10:18",
        views: "890K",
        difficulty: "Medium",
        topic: "Binary Trees",
        thumbnail: "https://i.ytimg.com/vi/d4zLyf32e3I/hqdefault.jpg",
        videoId: "d4zLyf32e3I",
        accent: "#e8c547",
    },
    {
        id: 3,
        category: "DP",
        title: "Longest Common Subsequence — DP Breakdown",
        channel: "Abdul Bari",
        duration: "25:47",
        views: "1.4M",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        thumbnail: "https://i.ytimg.com/vi/sSno9rV8Rhg/hqdefault.jpg",
        videoId: "sSno9rV8Rhg",
        accent: "#e8c547",
    },
    {
        id: 4,
        category: "Graphs",
        title: "Dijkstra's Algorithm Visually Explained",
        channel: "WilliamFiset",
        duration: "19:21",
        views: "760K",
        difficulty: "Hard",
        topic: "Shortest Paths",
        thumbnail: "https://i.ytimg.com/vi/pSqmAO-m7Lk/hqdefault.jpg",
        videoId: "pSqmAO-m7Lk",
        accent: "#ff6b35",
    },
    {
        id: 5,
        category: "Linked List",
        title: "Reverse a Linked List — Iterative & Recursive",
        channel: "NeetCode",
        duration: "9:44",
        views: "1.8M",
        difficulty: "Easy",
        topic: "Linked List",
        thumbnail: "https://i.ytimg.com/vi/G0_I-ZF0S38/hqdefault.jpg",
        videoId: "G0_I-ZF0S38",
        accent: "#c9f069",
    },
    {
        id: 6,
        category: "Heap",
        title: "Kth Largest Element — Heap Deep Dive",
        channel: "Back To Back SWE",
        duration: "17:08",
        views: "540K",
        difficulty: "Medium",
        topic: "Heap / Priority Queue",
        thumbnail: "https://i.ytimg.com/vi/PPllDlQjXEg/hqdefault.jpg",
        videoId: "PPllDlQjXEg",
        accent: "#e8c547",
    },
];

const DIFF = {
    Easy: "text-[#c9f069] bg-[#c9f069]/10 border-[#c9f069]/20",
    Medium: "text-[#e8c547] bg-[#e8c547]/10 border-[#e8c547]/20",
    Hard: "text-[#ff6b35] bg-[#ff6b35]/10 border-[#ff6b35]/20",
};

function VideoCard({ video, index }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="group relative rounded-2xl border border-white/[0.07] bg-[#15171c] overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/[0.16] hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
            style={{ animation: `cardUp 0.55s cubic-bezier(0.16,1,0.3,1) ${0.08 + index * 0.09}s both` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Accent top bar */}
            <div
                className="h-[2px] w-full"
                style={{
                    background: hovered
                        ? `linear-gradient(90deg, ${video.accent} 0%, ${video.accent}44 60%, transparent 100%)`
                        : `linear-gradient(90deg, ${video.accent}30 0%, transparent 60%)`,
                    transition: "background 0.4s",
                }}
            />

            {/* Hover glow */}
            <div
                className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle, ${video.accent}10 0%, transparent 70%)`,
                    opacity: hovered ? 1 : 0,
                }}
            />

            {/* ── THUMBNAIL ── */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                    }}
                />

                {/* Fallback if thumbnail fails */}
                <div
                    className="absolute inset-0 items-center justify-center bg-[#1a1c22] hidden"
                    style={{ display: "none" }}
                >
                    <span className="text-5xl" style={{ color: video.accent }}>▶</span>
                </div>

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#15171c] via-transparent to-transparent opacity-60" />

                {/* Play button overlay on hover */}
                <div
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                    style={{ opacity: hovered ? 1 : 0 }}
                >
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm border"
                        style={{
                            background: `${video.accent}22`,
                            borderColor: `${video.accent}66`,
                        }}
                    >
                        <span className="text-xl pl-1" style={{ color: video.accent }}>▶</span>
                    </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2.5 right-2.5">
                    <span className="font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.06em] px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[#f0ece4]">
                        {video.duration}
                    </span>
                </div>

                {/* Topic pill */}
                <div className="absolute bottom-2.5 left-2.5">
                    <span
                        className="font-['DM_Mono',monospace] text-[0.56rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-md backdrop-blur-sm border"
                        style={{
                            background: "rgba(0,0,0,0.55)",
                            borderColor: `${video.accent}33`,
                            color: video.accent,
                        }}
                    >
                        {video.topic}
                    </span>
                </div>
            </div>

            {/* ── CARD BODY ── */}
            <div className="p-4 pt-3.5">

                {/* Title */}
                <h3 className="font-['Syne',sans-serif] font-bold text-[0.95rem] text-[#e8e4dc] leading-snug mb-2 group-hover:text-white transition-colors duration-200 line-clamp-2">
                    {video.title}
                </h3>

                {/* Channel + views row */}
                <div className="flex items-center gap-2 mb-3">
                    {/* Channel avatar placeholder */}
                    <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[0.5rem] font-bold shrink-0"
                        style={{ background: `${video.accent}22`, color: video.accent }}
                    >
                        {video.channel[0]}
                    </div>
                    <span className="font-['DM_Mono',monospace] text-[0.65rem] text-[#4a4540] tracking-[0.04em]">
                        {video.channel}
                    </span>
                    <span className="text-[#2a2520]">·</span>
                    <span className="font-['DM_Mono',monospace] text-[0.62rem] text-[#3a3530] tracking-[0.04em]">
                        {video.views} views
                    </span>
                </div>

                {/* Footer: difficulty + watch button */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                    <span className={`font-['DM_Mono',monospace] text-[0.58rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border ${DIFF[video.difficulty]}`}>
                        {video.difficulty}
                    </span>

                    <a
                        href={`https://youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex items-center gap-1.5 font-['DM_Mono',monospace] text-[0.63rem] tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-lg border border-white/[0.08] text-[#5a5550] hover:text-[#f0ece4] hover:border-white/20 transition-all duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        Watch
                        <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">↗</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function Recommendations() {
    const [active] = useState("All");

    const filtered = active === "All"
        ? VIDEOS
        : VIDEOS.filter(v => v.category === active);

    return (
        <section className="relative w-full bg-[#111318] py-24 px-6 overflow-hidden">

            {/* Dot grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.014]"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                }}
            />

            {/* Top glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[260px] pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(232,197,71,0.045) 0%, transparent 70%)",
                }}
            />

            <div className="relative max-w-7xl mx-auto">

                {/* ── SECTION HEADER ── */}
                <div className="mb-12">
                    <p className="font-['DM_Mono',monospace] text-[0.58rem] tracking-[0.28em] uppercase text-[#4a4540] mb-5 flex items-center gap-2">
                        <span className="inline-block w-5 h-px bg-[#e8c547]/40" />
                        DSA · Video Library
                        <span className="inline-block w-5 h-px bg-[#e8c547]/40" />
                    </p>

                    {/* Ghost + real title stacked */}
                    <div className="relative mb-1">
                        <h2
                            className="font-['Syne',sans-serif] font-black leading-none tracking-tight select-none pointer-events-none"
                            style={{
                                fontSize: "clamp(3rem, 10vw, 7.5rem)",
                                color: "transparent",
                                WebkitTextStroke: "1px rgba(255,255,255,0.05)",
                            }}
                        >
                            WATCH &amp; LEARN
                        </h2>
                        <div className="absolute bottom-1 left-0.5">
                            <h2 className="font-['Syne',sans-serif] font-black text-[1.6rem] md:text-[2.2rem] text-[#f0ece4] leading-none tracking-tight">
                                Recommended <span className="text-[#e8c547]">Videos</span>
                            </h2>
                        </div>
                    </div>

                    <p className="font-['DM_Mono',monospace] text-[0.73rem] text-[#8a8a8a] tracking-[0.03em] mt-10 max-w-md">
                        Handpicked YouTube explanations for every DSA topic — sorted by quality, not hype.
                    </p>
                </div>

                {/* ── FILTER PILLS ── */}
                {/* <div className="flex items-center gap-2 flex-wrap mb-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.08em] uppercase px-4 py-1.5 rounded-full border transition-all duration-200
                ${active === cat
                                    ? "bg-[#171a20] text-[#f0ece4] border-[#e8c547]"
                                    : "bg-transparent text-[#5a5550] border-white/[0.08] hover:border-white/20 hover:text-[#f0ece4]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    <span className="ml-auto font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.14em] uppercase text-[#2a2520]">
                        {filtered.length} videos
                    </span>
                </div> */}

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

                {/* ── VIDEO GRID ── */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    key={active}
                >
                    {filtered.map((v, i) => (
                        <VideoCard key={v.id} video={v} index={i} />
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
}