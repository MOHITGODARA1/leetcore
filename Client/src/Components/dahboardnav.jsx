import { useEffect, useState, useRef } from "react";

const DashNavbar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/profile`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, [API_URL]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        fetch(`${API_URL}/logout`, {
            method: "POST",
            credentials: "include",
        }).then(() => {
            window.location.href = "/";
        });
    };

    const navLinks = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Leaderboard", href: "/leaderboard" },
        { label: "Weekly Leaderboard", href: "/weeklyleaderboard" }
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
                .dash-font-syne  { font-family: 'Syne', sans-serif; }
                .dash-font-dmono { font-family: 'DM Mono', monospace; }

                @keyframes dashLogoIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
                @keyframes dashActsIn { from{opacity:0;transform:translateX(20px)}  to{opacity:1;transform:translateX(0)} }
                @keyframes dashLinkIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes dashHexGlow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.35) drop-shadow(0 0 10px #e8c547)} }
                @keyframes dashDropIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

                .dash-anim-logo { animation: dashLogoIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                .dash-anim-acts { animation: dashActsIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .dash-anim-l1   { animation: dashLinkIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
                .dash-anim-l2   { animation: dashLinkIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.16s both; }
                .dash-hex-pulse { animation: dashHexGlow 3s ease-in-out infinite; }
                .dash-dropdown  { animation: dashDropIn 0.22s cubic-bezier(0.16,1,0.3,1) both; }

                .dash-nav-line::after {
                    content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,#e8c547 35%,#ff6b35 65%,transparent);
                    opacity:0; transform:scaleX(0); transition:opacity .5s,transform .5s;
                }
                .dash-nav-line.scrolled::after { opacity:.6; transform:scaleX(1); }

                .dash-nav-link {
                    position: relative;
                    font-size: 0.7rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    transition: color 0.2s;
                    text-decoration: none;
                }
                .dash-nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0; right: 0;
                    height: 1px;
                    background: #e8c547;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
                }
                .dash-nav-link:hover::after,
                .dash-nav-link.active::after { transform: scaleX(1); }

                .dash-avatar-btn {
                    cursor: pointer;
                    border: none;
                    padding: 0;
                    background: transparent;
                    border-radius: 6px;
                    transition: box-shadow 0.2s, transform 0.15s;
                }
                .dash-avatar-btn:hover { transform: scale(1.06); }
                .dash-avatar-btn.open { box-shadow: 0 0 0 2px #e8c547; }

                .dash-drop-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 9px 14px;
                    font-size: 0.78rem;
                    letter-spacing: 0.04em;
                    color: #b0a89c;
                    background: transparent;
                    border: none;
                    text-decoration: none;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s;
                    border-radius: 6px;
                    font-family: 'DM Mono', monospace;
                }
                .dash-drop-item:hover { background: rgba(232,197,71,0.08); color: #e8e6e1ff; }
                .dash-drop-item.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; }

                .dash-drop-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                    margin: 4px 0;
                }
            `}</style>

            <nav
                className={`dash-nav-line fixed top-0 inset-x-0 z-50 flex items-center px-8 transition-all duration-300 ${scrolled
                    ? "scrolled bg-[#1f1f1f] backdrop-blur-xl border-b border-white/[0.07] shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                    : "bg-[#1f1f1f] backdrop-blur-lg"
                    }`}
                style={{ height: 70 }}
            >
                {/* Logo */}
                <a href="/" className="dash-anim-logo flex items-center gap-2.5 no-underline shrink-0">
                    <div
                        className="dash-hex-pulse w-9 h-9 bg-[#e8c547] grid place-items-center shrink-0"
                        style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
                    >
                        <div
                            className="w-4 h-4 bg-[#0a0a0a]"
                            style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
                        />
                    </div>
                    <div>
                        <p className="dash-font-syne font-black text-[1.2rem] text-[#f0ece4] leading-none tracking-tight m-0">
                            Leet<span className="text-[#e8c547]">Core</span>
                        </p>
                        <span className="dash-font-dmono text-[0.48rem] tracking-[0.2em] uppercase text-[#4a4540] block mt-0.5">
                            Judge System
                        </span>
                    </div>
                </a>

                {/* Nav Links */}
                {!loading && user && (
                    <div className="hidden md:flex items-center gap-6 ml-10">
                        {navLinks.map((link, i) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`dash-nav-link dash-font-dmono dash-anim-l${i + 1} ${window.location.pathname === link.href
                                    ? "text-white active"
                                    : "text-[#6b6560]"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}

                {/* Right Side */}
                <div className="dash-anim-acts flex items-center gap-4 ml-auto">

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className="w-9 h-9 rounded-md bg-[#1a1a1a] animate-pulse" />
                    )}

                    {/* Not Logged In */}
                    {!loading && !user && (
                        <a
                            href="/signin"
                            className="dash-font-syne font-bold text-[0.75rem] tracking-[0.04em] uppercase px-5 py-[7px] rounded-md bg-[#e8c547] text-[#0a0a0a] hover:bg-[#f0d060] hover:-translate-y-px transition-all duration-200 no-underline"
                        >
                            Sign In →
                        </a>
                    )}

                    {/* Avatar + Dropdown */}
                    {!loading && user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className={`dash-avatar-btn w-9 h-9 rounded-md overflow-hidden ${dropdownOpen ? "open" : ""}`}
                                onClick={() => setDropdownOpen((v) => !v)}
                                aria-label="Open user menu"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="user"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#e8c547] to-[#ff6b35] flex items-center justify-center text-[#0a0a0a] font-bold text-sm dash-font-syne">
                                        {getInitials(user.name || user.username)}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div
                                    className="dash-dropdown absolute right-0 mt-3 w-52 bg-[#0f0f13]/95 backdrop-blur-xl border border-white/[0.09] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] p-2 z-[999]"
                                >
                                    {/* User Info */}
                                    <div className="px-3 py-2.5 mb-1">
                                        <p className="dash-font-syne font-bold text-[#f0ece4] text-sm leading-none">
                                            {user.name || user.username}
                                        </p>
                                        {user.email && (
                                            <p className="dash-font-dmono text-[#4a4540] text-[0.62rem] mt-1 tracking-wide truncate">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="dash-drop-divider" />

                                    <a href="/dashboard" className="dash-drop-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                                        </svg>
                                        Dashboard
                                    </a>

                                    <a href="/leaderboard" className="dash-drop-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                                        </svg>
                                        Leaderboard
                                    </a>

                                    <a href="/profile" className="dash-drop-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                        </svg>
                                        Profile
                                    </a>

                                    <div className="dash-drop-divider" />

                                    <button onClick={handleLogout} className="dash-drop-item danger w-full text-left">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default DashNavbar;