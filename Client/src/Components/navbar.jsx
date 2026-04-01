import { useState, useEffect, useRef } from "react";
import Login from "../Auth/Login";
// const NAV_LINKS = [
//     { label: "DSA", icon: "⬡", desc: "Data Structures & Algorithms" },
//     { label: "OS", icon: "◈", desc: "Operating Systems" },
//     { label: "Network", icon: "⬢", desc: "Computer Networks" },
//     { label: "Database", icon: "◆", desc: "Database Systems" },
// ];

function Navbar() {
    const [active, setActive] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const [indStyle, setIndStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const [openAuth, setOpenAuth] = useState(false);

    const navRef = useRef(null);
    const btnRefs = useRef({});

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const key = hovered ?? active;
        if (key && btnRefs.current[key] && navRef.current) {
            const elR = btnRefs.current[key].getBoundingClientRect();
            const navR = navRef.current.getBoundingClientRect();
            setIndStyle({ left: elR.left - navR.left, width: elR.width, opacity: 1 });
        } else {
            setIndStyle(s => ({ ...s, opacity: 0 }));
        }
    }, [hovered, active]);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-syne  { font-family: 'Syne', sans-serif; }
        .font-dmono { font-family: 'DM Mono', monospace; }

        @keyframes logoIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes actsIn { from{opacity:0;transform:translateX(20px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes linkIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hexGlow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.35) drop-shadow(0 0 10px #e8c547)} }
        @keyframes modalOverlayIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.92) translateY(15px)} to{opacity:1;transform:scale(1) translateY(0)} }

        .anim-logo { animation: logoIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-acts { animation: actsIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .anim-l1   { animation: linkIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
        .anim-l2   { animation: linkIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.16s both; }
        .anim-l3   { animation: linkIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
        .anim-l4   { animation: linkIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.32s both; }
        .hex-pulse  { animation: hexGlow 3s ease-in-out infinite; }
        .anim-modal-overlay { animation: modalOverlayIn 0.4s ease-out both; }
        .anim-modal { animation: modalIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }

        .lc-ind { transition: left .32s cubic-bezier(0.16,1,0.3,1), width .32s cubic-bezier(0.16,1,0.3,1), opacity .2s; }

        .lc-tip {
          position:absolute; bottom:-36px; left:50%;
          transform:translateX(-50%) translateY(4px);
          background:#111; border:1px solid rgba(255,255,255,0.08);
          color:#6b6560; font-size:0.6rem; letter-spacing:0.1em;
          white-space:nowrap; padding:4px 10px; border-radius:4px;
          opacity:0; pointer-events:none; transition:all 0.18s; z-index:99;
        }
        .lc-navbtn:hover .lc-tip { opacity:1; transform:translateX(-50%) translateY(0); }

        .shine::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(120deg,transparent,rgba(255,255,255,0.28) 50%,transparent);
          transform:translateX(-100%); transition:transform 0.5s;
        }
        .shine:hover::before { transform:translateX(100%); }

        .nav-line::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,#e8c547 35%,#ff6b35 65%,transparent);
          opacity:0; transform:scaleX(0); transition:opacity .5s,transform .5s;
        }
        .nav-line.scrolled::after { opacity:.6; transform:scaleX(1); }
      `}</style>
            <nav
                className={`nav-line fixed top-0 inset-x-0 z-50 flex items-center px-8 transition-all duration-300 ${scrolled
                    ? "scrolled bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                    : ""
                    }`}
                style={{ height: 70 }}
            >
                <a href="#" className="anim-logo flex items-center gap-2.5 no-underline shrink-0">
                    <div
                        className="hex-pulse w-9 h-9 bg-[#e8c547] grid place-items-center shrink-0"
                        style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
                    >
                        <div
                            className="w-4 h-4 bg-[#0a0a0a]"
                            style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
                        />
                    </div>
                    <div>
                        <p className="font-syne font-black text-[1.2rem] text-[#f0ece4] leading-none tracking-tight m-0">
                            Leet<span className="text-[#e8c547]">Core</span>
                        </p>
                        <span className="font-dmono text-[0.48rem] tracking-[0.2em] uppercase text-[#4a4540] block mt-0.5">
                            Judge System
                        </span>
                    </div>
                </a>
                <div className="anim-acts hidden md:flex items-center gap-2.5 shrink-0 ml-auto">

                    <button
                        onClick={() => setOpenAuth(true)}
                        className="shine relative mr-5 overflow-hidden font-syne font-bold text-[0.75rem] tracking-[0.04em] uppercase px-5 py-[7px] rounded-md bg-[#e8c547] text-[#0a0a0a] hover:bg-[#f0d060] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(232,197,71,0.3)] transition-all duration-200 cursor-pointer border-none"
                    >
                        Sign In →
                    </button>
                </div>
                <button
                    className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1.5 ml-auto"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {[
                        menuOpen ? "translate-y-[7px] rotate-45" : "",
                        menuOpen ? "opacity-0" : "",
                        menuOpen ? "-translate-y-[7px] -rotate-45" : "",
                    ].map((cls, i) => (
                        <span key={i} className={`block w-[22px] h-px bg-[#f0ece4] rounded transition-all duration-300 ${cls}`} />
                    ))}
                </button>
            </nav>
            <div
                className={`md:hidden fixed inset-x-0 z-40 flex flex-col px-8 pb-6 pt-4 gap-2 bg-[#0a0a0a]/97 backdrop-blur-xl border-b border-white/[0.07] transition-all duration-300 ${menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                style={{ top: 70 }}
            >
                <div className="flex gap-2.5 mt-3">
                    <button
                        onClick={() => { setOpenAuth(true); setMenuOpen(false); }}
                        className="flex-1 font-syne font-bold text-[0.75rem] uppercase py-3 rounded-md bg-[#e8c547] text-[#0a0a0a] cursor-pointer border-none hover:bg-[#f0d060] transition-colors"
                    >
                        Sign In →
                    </button>
                </div>
            </div>

            {openAuth && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div
                        className="anim-modal-overlay absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => setOpenAuth(false)}
                    ></div>

                    {/* Modal */}
                    <div className="anim-modal w-full max-w-md bg-[#0f0f13]/90 backdrop-blur-2xl border border-white/[0.1] rounded-[24px] p-8 relative shadow-[0_0_80px_rgba(232,197,71,0.15)] z-10 flex flex-col items-center">

                        {/* Hex Top Decoration */}
                        <div className="absolute -top-6 w-12 h-12 bg-[#e8c547] grid place-items-center shadow-[0_0_30px_rgba(232,197,71,0.4)]"
                            style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
                            <div className="w-6 h-6 bg-[#0f0f13] flex items-center justify-center"
                                style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
                                <span className="w-2 h-2 bg-[#e8c547] block rounded-full shadow-[0_0_10px_#e8c547]"></span>
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            onClick={() => setOpenAuth(false)}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#888] hover:text-white transition-colors border border-white/[0.05] cursor-pointer"
                        >
                            ✕
                        </button>

                        {/* Title */}
                        <div className="text-center mt-6 mb-8 w-full">
                            <h2 className="text-[#f0ece4] font-syne font-bold text-2xl tracking-tight mb-2">
                                Welcome to Leet<span className="text-[#e8c547]">Core</span>
                            </h2>
                            <p className="text-[#888] text-sm">Sign in to sync your progress and compete.</p>
                        </div>

                        <Login />

                        {/* Divider line */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent my-8"></div>

                        {/* Footer */}
                        <p className="text-xs text-[#666] text-center max-w-[250px] leading-relaxed">
                            By continuing, you agree to LeetCore's <br />
                            <a href="#" className="text-[#e8c547] hover:text-[#f0d060] transition-colors hover:underline no-underline">Terms of Service</a> and <a href="#" className="text-[#e8c547] hover:text-[#f0d060] transition-colors hover:underline no-underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;