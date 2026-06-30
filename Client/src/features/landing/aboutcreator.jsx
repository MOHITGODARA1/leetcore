// TeamSection.jsx

import { useEffect, useRef, useState } from "react";

const team = [
    {
        name: "Mohit Godara",
        role: "Founder & Full Stack Developer",
        quote: "Building things that actually help people learn.",
        img: "./mohit.png", // replace with real image path
    },
    {
        name: "Isha Yadav",
        role: "Co-Founder ",
        quote: "Pixels with purpose, every single time.",
        img: "./isha.png",
    },
    {
        name: "Khushi Sharma",
        role: "Content Strategist",
        quote: "If it scales quietly, I did my job right.",
        img: "./khushi.jpeg",
    },
    {
        name: "Sakshi Sinha",
        role: "UI/UX Designer",
        quote: "Good design is invisible until it's gone.",
        img: "./sakshi.png",
    },
    {
        name: "Aditya Singh",
        role: "Backend Developer",
        quote: "I debug in production",
        img: "./aditya.png",
    },
];

// duplicate so the loop wraps seamlessly
const loopedTeam = [...team, ...team, ...team];

// how often the carousel advances (ms) — increase to slow it down further
const STEP_INTERVAL = 3000;
// how long the glide animation takes (ms) — increase for a slower, smoother glide
const SCROLL_DURATION = 1200;

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function TeamSection() {
    const trackRef = useRef(null);
    const cardRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(team.length); // start in the middle copy

    // advance one card forward on a timer
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => prev + 1);
        }, STEP_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // smoothly glide the track so the active card's CENTER aligns with
    // the track's center, then silently reset once we pass through the
    // duplicated copies so the loop never visibly jumps
    useEffect(() => {
        const track = trackRef.current;
        const card = cardRefs.current[activeIndex];
        if (!track || !card) return;

        const getCenterTarget = (targetCard) => {
            const trackRect = track.getBoundingClientRect();
            const cardRect = targetCard.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const trackCenter = trackRect.left + trackRect.width / 2;
            return track.scrollLeft + (cardCenter - trackCenter);
        };

        const target = getCenterTarget(card);
        const start = track.scrollLeft;
        const distance = target - start;
        let startTime = null;
        let frameId;

        const animateScroll = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / SCROLL_DURATION, 1);
            track.scrollLeft = start + distance * easeInOutQuad(progress);
            if (progress < 1) {
                frameId = requestAnimationFrame(animateScroll);
            }
        };

        frameId = requestAnimationFrame(animateScroll);

        let resetTimeout;
        if (activeIndex >= team.length * 2) {
            const resetIndex = activeIndex - team.length;
            resetTimeout = setTimeout(() => {
                const resetCard = cardRefs.current[resetIndex];
                if (resetCard) {
                    track.scrollLeft = getCenterTarget(resetCard);
                }
                setActiveIndex(resetIndex);
            }, SCROLL_DURATION + 50);
        }

        return () => {
            cancelAnimationFrame(frameId);
            clearTimeout(resetTimeout);
        };
    }, [activeIndex]);

    return (
        <section className="w-full bg-transparent py-20 sm:py-28 lg:py-32 overflow-hidden relative">

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <h2 className="text-[2.1rem] sm:text-4xl md:text-5xl text-center mb-14">
                    <span className="text-white">Meet The </span>
                    <span className="text-[#F46717]">Team</span>
                </h2>
            </div>

            {/* Track is outside the padded wrapper so its true center
                lines up with the viewport center for accurate focusing */}
            <div
                ref={trackRef}
                className="flex gap-6 overflow-x-hidden py-6 px-6"
                style={{ scrollbarWidth: "none" }}
            >
                {loopedTeam.map((member, i) => {
                    const isActive = i === activeIndex;
                    return (
                        <div
                            key={i}
                            ref={(el) => (cardRefs.current[i] = el)}
                            className={`
                                relative
                                flex-shrink-0
                                w-[260px] sm:w-[300px]
                                h-[360px] sm:h-[400px]
                                rounded-2xl
                                overflow-hidden
                                border border-white/10
                                transition-all duration-500 ease-out
                                ${
                                    isActive
                                        ? "scale-110 border-[#F46717]/50  z-10"
                                        : "scale-90 opacity-60"
                                }
                            `}
                        >
                            {/* Full-bleed developer photo */}
                            {member.img ? (
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full bg-[#111113] flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">
                                        Photo
                                    </span>
                                </div>
                            )}

                            {/* Black gradient overlay at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />

                            {/* Name, role, quote — sitting on the gradient */}
                            <div className="absolute bottom-0 left-0 right-0 px-5 py-5 text-left">
                                <h3 className="text-white text-md font-semibold">
                                    {member.name}
                                </h3>
                                <p className="text-[#F46717] text-sm font-medium mt-1">
                                    {member.role}
                                </p>
                                <p className="text-gray-300 text-xs mt-2 leading-relaxed italic">
                                    "{member.quote}"
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default TeamSection;