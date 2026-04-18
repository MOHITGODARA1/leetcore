function HeroLeft() {
    return (
        <div className="flex flex-col justify-center h-full py-8 select-none">

            {/* Headline */}
            <h1 className="font-syne font-black leading-[1.08] tracking-tight mb-5 animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
                {/* <span className="block text-[#f0ece4] text-[3rem] lg:text-[3.4rem]">Master the</span> */}

                <span className="block text-[3rem] lg:text-[3rem] bg-[#f0ece4] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3.5s_linear_infinite]">
                    Core of CS.
                </span>
            </h1>

            {/* Subtext */}
            <p className="font-dmono text-[0.82rem] leading-[1.85] text-[#8a8580] tracking-[0.02em] mb-8 max-w-[420px] animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.35s_both]">
                System-oriented problems across DSA, Operating Systems,<br />
                Computer Networks & Databases — built for engineers<br />
            </p>

            {/* CTA */}
            <div className="flex items-center gap-3 mb-10 flex-wrap animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.48s_both]">

                {/* Primary */}
                <button className="relative overflow-hidden bg-[#e8c547] text-[#0a0a0a] font-syne font-bold text-[0.82rem] tracking-[0.05em] uppercase px-7 py-3.5 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                    <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.3)_50%,transparent)] translate-x-[-100%]" />
                    Start
                </button>

                {/* Ghost */}
                <button className="border border-white/10 text-[#8a8580] font-dmono text-[0.75rem] tracking-[0.08em] uppercase px-7 py-3.5 rounded-lg transition-all duration-200 hover:border-white/25 hover:text-[#f0ece4] hover:bg-white/5">
                    View Roadmap
                </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 mb-8 flex-wrap animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.58s_both]">
                {[
                    { val: "400+", label: "Problems" },
                    { val: "4", label: "Domains" },
                ].map(({ val, label }) => (
                    <div
                        key={label}
                        className="rounded-lg px-5 py-3 text-center border border-white/10 bg-white/5 hover:border-[#e8c547]/30 hover:bg-[#e8c547]/5 transition"
                    >
                        <div className="font-syne font-black text-[1.35rem] text-[#f0ece4] leading-none">
                            {val}
                        </div>
                        <div className="font-dmono text-[0.58rem] tracking-[0.14em] uppercase text-[#8a8580] mt-1">
                            {label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HeroLeft;