const COMPANIES = [
    { name: "Google", logo: "G", color: "#e8c547" },
    { name: "Meta", logo: "M", color: "#c9f069" },
    { name: "Amazon", logo: "A", color: "#ff9f43" },
    { name: "Microsoft", logo: "Ms", color: "#e8c547" },
    { name: "Netflix", logo: "N", color: "#ff6b35" },
    { name: "Apple", logo: "Ap", color: "#c9f069" },
    { name: "Uber", logo: "U", color: "#e8c547" },
    { name: "Stripe", logo: "S", color: "#c9f069" },
    { name: "Airbnb", logo: "Ab", color: "#ff9f43" },
    { name: "LinkedIn", logo: "In", color: "#e8c547" },
];

const STATS = [
    { value: "10K+", label: "Active Learners", icon: "◈" },
    { value: "400+", label: "Problems & Roadmaps", icon: "⬡" },
    { value: "92%", label: "Placement Rate", icon: "◆" },
    { value: "4", label: "CS Domains", icon: "⬢" },
];

// Duplicate for seamless infinite scroll
const TICKER = [...COMPANIES, ...COMPANIES];

function TrustedBy() {
    return (
        <section className="relative w-full bg-[#0e1014] py-20 overflow-hidden border-y border-white/[0.05]">

            {/* Dot grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.012]"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Top + bottom fade edges */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#111318] to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111318] to-transparent pointer-events-none z-10" />

            <div className="relative max-w-7xl mx-auto px-6 z-20">

                {/* ── HEADER ── */}
                <div className="text-center mb-16">
                    <p className="font-['DM_Mono',monospace] text-[0.58rem] tracking-[0.28em] uppercase text-[#3a3530] mb-4 flex items-center justify-center gap-3">
                        <span className="inline-block w-8 h-px bg-[#e8c547]/30" />
                        Engineers from top companies
                        <span className="inline-block w-8 h-px bg-[#e8c547]/30" />
                    </p>
                    <h2 className="font-['Syne',sans-serif] font-black text-[1.8rem] md:text-[2.4rem] text-[#f0ece4] leading-tight tracking-tight">
                        Trusted by engineers at
                        {/* <span className="text-[#e8c547]"> world-class</span> companies */}
                    </h2>
                    <p className="font-['DM_Mono',monospace] text-[0.75rem] text-[#8a8580] mt-3 tracking-[0.03em]">
                        LeetCore users have landed roles at the most competitive companies on the planet.
                    </p>
                </div>

                {/* ── INFINITE TICKER ── */}
                <div className="relative overflow-hidden mb-16">
                    {/* Left + right fade masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                        style={{ background: "linear-gradient(90deg, #0e1014, transparent)" }} />
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                        style={{ background: "linear-gradient(-90deg, #0e1014, transparent)" }} />

                    <div className="flex gap-4 animate-[ticker_28s_linear_infinite] w-max">
                        {TICKER.map((co, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/[0.07] bg-[#15171c] shrink-0 group hover:border-white/[0.15] transition-all duration-300 cursor-default"
                            >
                                {/* Logo circle */}
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.65rem] font-['Syne',sans-serif] font-black shrink-0"
                                    style={{ background: `${co.color}18`, color: co.color }}
                                >
                                    {co.logo}
                                </div>
                                <span className="font-['DM_Mono',monospace] text-[0.75rem] tracking-[0.04em] text-[#6b6560] group-hover:text-[#a09890] transition-colors duration-200 whitespace-nowrap">
                                    {co.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── STATS GRID ── */}
                {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="relative rounded-2xl border border-white/[0.07] bg-[#15171c] p-6 overflow-hidden group hover:border-[#e8c547]/20 transition-all duration-300"
                            style={{ animation: `fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s both` }}
                        >
                            {/* Subtle glow on hover */}
                {/*<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,197,71,0.05) 0%, transparent 70%)" }} />

                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#e8c547]/50 text-sm">{stat.icon}</span>
                        <span className="font-['DM_Mono',monospace] text-[0.55rem] tracking-[0.18em] uppercase text-[#3a3530]">
                            {stat.label}
                        </span>
                    </div>
                    <div className="font-['Syne',sans-serif] font-black text-[2.4rem] text-[#f0ece4] leading-none tracking-tight">
                        {stat.value}
                    </div>
                </div>
            </div>
                    
                </div> */}
            </div >

            <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section >
    );
}

export default TrustedBy;