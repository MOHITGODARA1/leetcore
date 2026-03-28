import React from "react";

const TIMELINE = [
    { year: "2023", event: "Started grinding DSA with zero structure" },
    { year: "2024", event: "Got placed after 6 months of focused prep" },
    { year: "2025", event: "Built LeetCore to fix what was broken" },
    { year: "2026", event: "10K+ learners on the same path" },
];

function AboutBuilder() {
    return (
        <section className="relative w-full bg-[#111318] overflow-hidden">

            {/* ================= PART 1 ================= */}
            <div className="relative border-b border-white/[0.05]">

                {/* Background grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.014]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                    }}
                />

                {/* Glow */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(232,197,71,0.04) 0%, transparent 65%)",
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ================= LEFT → YOUR PHOTO ================= */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-[340px]">

                            {/* <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#15171c] aspect-[4/4.5] group"> */}

                            {/* Glow effect */}
                            {/* <div className="absolute -inset-3 bg-[#e8c547]/10 blur-2xl opacity-40 group-hover:opacity-70 transition duration-500" /> */}

                            {/* YOUR IMAGE */}
                            <img
                                src="/profile.png"   // 👉 replace this
                                alt="Mohit"
                                className="relative w-full h-full object-cover"
                            />

                            {/* Overlay gradient */}
                            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" /> */}

                            {/* Name */}
                            <div className="absolute bottom-4 left-4">
                                <p className="text-[#f0ece4] font-bold text-sm">Mohit Godara</p>
                                <p className="text-[#e8c547] text-xs">Software Engineer</p>
                            </div>

                            {/* Accent dots */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-[#e8c547] rounded-full opacity-60" />
                            <div className="absolute top-7 right-7 w-1 h-1 bg-[#c9f069] rounded-full opacity-40" />
                            {/* </div> */}

                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-white/[0.1] bg-[#1a1c22] px-5 py-4 shadow-xl">
                                <p className="text-xs text-[#8a8a8a]">Building since</p>
                                <p className="text-xl font-bold text-[#f0ece4]">2023</p>
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT → TEXT ================= */}
                    <div>

                        <p className="text-xs tracking-widest uppercase text-[#4a4540] mb-5 flex items-center gap-2">
                            <span className="inline-block w-5 h-px bg-[#e8c547]/40" />
                            The origin story
                        </p>

                        <h2 className="text-3xl md:text-4xl font-black text-[#f0ece4] mb-8">
                            Built for developers,<br />
                            <span className="text-[#e8c547]">by a developer.</span>
                        </h2>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm text-[#4a4540] leading-relaxed">
                                LeetCore started as a personal frustration with scattered learning resources.
                                Every topic felt disconnected — jumping between random tutorials with no clear path forward.
                            </p>

                            <p className="text-sm text-[#4a4540] leading-relaxed">
                                So I built what I wished existed: a structured roadmap to master CS fundamentals step by step.
                            </p>

                            <p className="text-sm text-[#4a4540] leading-relaxed">
                                Today, developers use LeetCore to prepare for interviews and build strong foundations.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-3">
                            {TIMELINE.map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="font-bold text-[#e8c547] w-10">
                                        {item.year}
                                    </span>
                                    <div className="w-px h-4 bg-white/[0.06]" />
                                    <span className="text-xs text-[#3a3530]">
                                        {item.event}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

        </section>
    );
}

export default AboutBuilder;