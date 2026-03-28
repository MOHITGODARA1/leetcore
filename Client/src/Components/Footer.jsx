const LINKS = {
    Platform: [
        { label: "DSA Problems", href: "#" },
        { label: "OS Concepts", href: "#" },
        { label: "Networks", href: "#" },
        { label: "Databases", href: "#" },
        { label: "Roadmaps", href: "#" },
    ],
    Resources: [
        { label: "Video Library", href: "#" },
        { label: "Cheat Sheets", href: "#" },
        { label: "Interview Prep", href: "#" },
        { label: "Blog", href: "#" },
    ],
    Company: [
        { label: "About", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Use", href: "#" },
    ],
};

const SOCIALS = [
    {
        name: "GitHub",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
        ),
    },
    {
        name: "Twitter / X",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: "YouTube",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
];

function Footer() {
    return (
        <footer className="relative w-full bg-[#0e1014] border-t border-white/[0.05] overflow-hidden">

            {/* Dot grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.012]"
                style={{
                    backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "36px 36px",
                }}
            />

            {/* Top gold glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(232,197,71,0.05) 0%, transparent 70%)",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-16">

                {/* ── TOP SECTION ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 pt-16 pb-12 border-b border-white/[0.05]">

                    {/* Brand column */}
                    <div>
                        {/* Logo */}
                        <a href="#" className="flex items-center gap-2.5 no-underline mb-5 w-fit">
                            <div
                                className="w-8 h-8 bg-[#e8c547] grid place-items-center shrink-0"
                                style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
                            >
                                <div
                                    className="w-3.5 h-3.5 bg-[#0e1014]"
                                    style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
                                />
                            </div>
                            <div>
                                <p className="font-['Syne',sans-serif] font-black text-[1.1rem] text-[#f0ece4] leading-none tracking-tight m-0">
                                    Leet<span className="text-[#e8c547]">Core</span>
                                </p>
                                <span className="font-['DM_Mono',monospace] text-[0.45rem] tracking-[0.2em] uppercase text-[#3a3530] block mt-0.5">
                                    Judge System
                                </span>
                            </div>
                        </a>

                        <p className="font-['DM_Mono',monospace] text-[0.72rem] leading-[1.85] text-[#8a8a8a] tracking-[0.01em] mb-6 max-w-[260px]">
                            System-oriented CS problems across DSA, OS, Networks, and Databases. Built for engineers who think deep.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-2">
                            {SOCIALS.map(s => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    aria-label={s.name}
                                    className="w-8 h-8 rounded-lg border border-white/[0.07] bg-[#15171c] flex items-center justify-center text-[#4a4540] hover:text-[#e8c547] hover:border-[#e8c547]/25 transition-all duration-200"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(LINKS).map(([section, links]) => (
                        <div key={section}>
                            <h4 className="font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.22em] uppercase text-[#8a8a8a] mb-5">
                                {section}
                            </h4>
                            <ul className="space-y-3 list-none p-0 m-0">
                                {links.map(link => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="font-['DM_Mono',monospace] text-[0.72rem] tracking-[0.03em] text-[#8a8a8a] hover:text-[#f0ece4] transition-colors duration-200 no-underline flex items-center gap-1.5 group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-px bg-[#e8c547] transition-all duration-200 overflow-hidden" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ── NEWSLETTER ── */}
                <div className="py-8 border-b border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <p className="font-['Syne',sans-serif] font-bold text-[0.95rem] text-[#f0ece4] mb-1">
                            Stay in the loop
                        </p>
                        <p className="font-['DM_Mono',monospace] text-[0.65rem] text-[#8a8a8a] tracking-[0.02em]">
                            New problems, roadmap updates, and placement tips — no spam.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="font-['DM_Mono',monospace] text-[0.72rem] tracking-[0.03em] px-4 py-2.5 rounded-lg bg-[#15171c] border border-white/[0.08] text-[#f0ece4] placeholder-[#8a8a8a] outline-none focus:border-[#e8c547]/30 transition-colors duration-200 w-full md:w-[220px]"
                        />
                        <button className="shrink-0 font-['Syne',sans-serif] font-bold text-[0.72rem] tracking-[0.04em] uppercase px-5 py-2.5 rounded-lg bg-[#8a8a8a] text-[#0a0a0a] hover:bg-[#f0d060] hover:-translate-y-px transition-all duration-200 border-none cursor-pointer">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* ── BOTTOM BAR ── */}
                <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="font-['DM_Mono',monospace] text-[0.62rem] tracking-[0.06em] text-[#8a8a8a]">
                        © 2025 LeetCore. All rights reserved.
                    </p>

                    {/* Status pill */}

                </div>
            </div>
        </footer>
    );
}

export default Footer;