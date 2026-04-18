import React from "react";

const REASONS = [
    { num: "01", title: "10K+ active learners", desc: "A focused, growing community of developers preparing for top-tier engineering roles." },
    { num: "02", title: "High-intent audience", desc: "These aren't casual readers — they're developers actively seeking tools, jobs, and resources." },
    { num: "03", title: "Direct hiring pipeline", desc: "Reach candidates before they even start applying. Sponsor a roadmap module they use every day." },
    { num: "04", title: "Built by a developer", desc: "No agency fluff. You work directly with the founder — fast, honest, and aligned with your goals." },
    { num: "05", title: "3.2M monthly impressions", desc: "Consistent, organic traffic from developers searching for DSA and interview prep content." },
    { num: "06", title: "Flexible sponsorship tiers", desc: "From a simple logo placement to a full co-branded module — we work with your budget and goals." },
];

const GOOGLE_FORM_URL = "https://forms.gle/your-form-id";

function BecomeSponsor() {
    return (
        <section className="relative w-full bg-[#111318] overflow-hidden">

            {/* Background dots */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.014]"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                }}
            />

            {/* Glow */}
            <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(232,197,71,0.04) 0%, transparent 65%)",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-24">

                {/* Header */}
                <p className="text-xs tracking-widest uppercase text-[#6a645f] mb-5 flex items-center gap-2">
                    <span className="inline-block w-5 h-px bg-[#e8c547]/40" />
                    Sponsorship
                </p>

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-[#f0ece4] leading-tight">
                        Why sponsor<br />
                        <span className="text-[#e8c547]">LeetCore?</span>
                    </h2>

                    <p className="text-sm text-[#6a645f] leading-relaxed max-w-md">
                        LeetCore is where motivated developers grind to land their dream jobs.
                        Your brand, in front of an audience that's hiring-ready and actively levelling up.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-white/[0.05] rounded-2xl overflow-hidden mb-16">
                    {REASONS.map((item, i) => (
                        <div
                            key={i}
                            className="p-7 border-b border-r border-white/[0.05] bg-[#111318] hover:bg-[#23272c] transition-colors duration-200"
                        >
                            <p className="text-xs tracking-widest uppercase text-[#6a645f] mb-3">
                                {item.num}
                            </p>
                            <p className="text-sm font-bold text-[#f0ece4] mb-2">
                                {item.title}
                            </p>
                            <p className="text-xs text-[#6a645f] leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-6 flex-wrap">
                    <a
                        href={GOOGLE_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#e8c547] text-[#111318] font-black text-sm px-8 py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-150"
                    >
                        Become a sponsor
                        <span>→</span>
                    </a>

                    <span className="text-xs text-[#5a544f]">
                        Takes 2 minutes · We reply within 48 hours
                    </span>
                </div>
            </div>
        </section>
    );
}

export default BecomeSponsor;