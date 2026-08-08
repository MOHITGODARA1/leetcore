import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  SquaresFour,
  Brain,
  Notebook,
  Building,
  User,
  Flame,
  Bell,
  CaretRight,
  RocketLaunch,
} from "@phosphor-icons/react";
import { useGSAP, gsap, prefersReducedMotion } from "../../lib/gsap";

const MENU = [
  { label: "Dashboard", href: "/dashboard", icon: SquaresFour, end: true },
  {
    label: "Interview Prep",
    href: "/dashboard/data-structures-and-algorithms",
    icon: Brain,
  },
  {
    label: "Online Assessment",
    href: "/dashboard/what's-next-on-leetcore",
    icon: Notebook,
  },
  {
    label: "Companies",
    href: "/dashboard/Career-oppertunity-on-leetcore",
    icon: Building,
  },
];

const EASE = "cubic-bezier(0.16,1,0.3,1)";

function Upperdashnavbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const islandRef = useRef(null);
  const overlayRef = useRef(null);
  const notifWrapRef = useRef(null);

  const activeHref = MENU.find((item) =>
    item.end ? pathname === item.href : pathname.startsWith(item.href)
  )?.href;

  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e) {
      if (notifWrapRef.current && !notifWrapRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [notifOpen]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        islandRef.current,
        { y: -28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out" }
      );
    },
    { scope: islandRef }
  );

  useGSAP(
    () => {
      if (!menuOpen) return;
      if (prefersReducedMotion()) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: "expo.out" }
        );
        gsap.fromTo(
          overlayRef.current.querySelectorAll("[data-menu-item]"),
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.06, ease: "expo.out", delay: 0.1 }
        );
      }, overlayRef);
      return () => ctx.revert();
    },
    { dependencies: [menuOpen] }
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-3 pt-3 sm:px-5 sm:pt-4">
        {/* Floating glass island — outer bezel shell */}
        <div
          ref={islandRef}
          className="relative mx-auto flex h-[4.25rem] w-full max-w-[1440px] items-center justify-between gap-3 rounded-[2.5rem] border border-white/10 p-2 pl-3 bg-white/8 sm:pl-4"
        >
          {/* Inner core surface */}
          {/* <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2.5rem-1px)] bg-[var(--dash-panel)]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" /> */}

          {/* Ambient amber micro-glow behind the brand */}
          

          {/* Brand cluster */}
          <Link
            to="/dashboard"
            aria-label="LeetCore dashboard home"
            className="group relative z-10 flex shrink-0 items-center gap-3"
          >
            <img
                src="/leetcorelogo.png"
                alt="LeetCore logo"
                className="h-9 w-9 object-contain"
              />
            
            
          </Link>

          {/* Primary nav */}
          <nav
            aria-label="Primary"
            className="relative z-10 flex min-w-0 flex-1 items-center justify-center"
          >
            <ul className="flex items-center gap-1">
              {MENU.map((item) => {
                const Icon = item.icon;
                const isActive = activeHref === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group inline-flex h-10 items-center gap-2 rounded-full px-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] sm:px-4 ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-[var(--dash-muted)] hover:bg-[var(--dash-panel-2)] hover:text-[var(--dash-text)]"
                      }`}
                    >
                      <Icon
                        size={17}
                        weight={isActive ? "fill" : "duotone"}
                        className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-px"
                      />
                      <span className="hidden whitespace-nowrap text-[13.5px] font-medium tracking-tight xl:inline">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="relative z-10 flex shrink-0 items-center gap-2">
            <span className="hidden h-10 items-center gap-2 rounded-full border border-[var(--dash-line)] bg-[var(--dash-panel)] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--dash-warning)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:inline-flex">
              <Flame size={15} weight="duotone" className="text-[var(--dash-warning)]" />
              Streak
            </span>

            <div ref={notifWrapRef} className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative grid h-10 w-10 place-items-center rounded-full border border-[var(--dash-line)] bg-[var(--dash-panel)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.94] ${
                  notifOpen
                    ? "text-[var(--dash-warning)] border-[var(--dash-line-strong)]"
                    : "text-[var(--dash-muted)] hover:border-[var(--dash-line-strong)] hover:text-[var(--dash-text)]"
                }`}
              >
                <Bell size={17} weight={notifOpen ? "fill" : "duotone"} />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--dash-success)] ring-2 ring-[var(--dash-panel)]" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-3xl border border-[var(--dash-line)] bg-[var(--dash-panel)]/95 shadow-[var(--shadow-xl)] backdrop-blur-xl">
                  <div className="border-b border-[var(--dash-line)] px-4 pt-3 pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
                    Notifications
                  </div>
                  <div className="flex items-start gap-3 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--dash-warning)]/15 text-[var(--dash-warning)]">
                      <RocketLaunch size={18} weight="duotone" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold leading-snug text-[var(--dash-text)]">
                        Welcome onboard LeetCore! 🚀
                      </p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--dash-muted)]">
                        You&rsquo;re all set to start your interview prep. Good
                        luck, and happy coding!
                      </p>
                      <Link
                        to="/dashboard"
                        onClick={() => setNotifOpen(false)}
                        className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--dash-warning)] transition-colors duration-300 hover:text-[var(--dash-text)]"
                      >
                        <span>Go to Dashboard</span>
                        <CaretRight size={12} weight="bold" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* profile */}
            <Link
              to="/dashboard/profile"
              aria-label="Open profile"
              className="group flex h-10 items-center gap-2 rounded-full border border-[var(--dash-line)] bg-[var(--dash-panel)] pr-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--dash-line-strong)] active:scale-[0.97]"
            >
              <span className="ml-1 grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[var(--dash-line-strong)] bg-[var(--dash-panel-2)] text-[var(--dash-muted)]">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <User size={15} weight="duotone" />
                )}
              </span>
              <CaretRight
                size={12}
                weight="bold"
                className="text-[var(--dash-faint)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
              />
            </Link>

            {/* Mobile hamburger — morphs to X */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="dash-mobile-menu"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--dash-line)] bg-[var(--dash-panel)] lg:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 bg-[var(--dash-text)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "rotate-45" : "-translate-y-[3.5px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-[var(--dash-text)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "-rotate-45" : "translate-y-[3.5px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        id="dash-mobile-menu"
        ref={overlayRef}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-[var(--dash-bg)]/92 px-7 pb-10 pt-28 backdrop-blur-2xl lg:hidden ${
          menuOpen ? "" : "pointer-events-none invisible"
        }`}
      >
        <ul className="flex flex-col gap-1.5">
          {MENU.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;
            return (
              <li key={item.label} data-menu-item>
                <Link
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-center gap-4 rounded-[1.25rem] border-b border-[var(--dash-line)] px-2 py-4 transition-colors duration-300 ${
                    isActive ? "text-[var(--dash-accent)]" : "text-[var(--dash-text)]"
                  }`}
                >
                  <span className="font-mono text-xs text-[var(--dash-faint)]">
                    0{idx + 1}
                  </span>
                  <Icon
                    size={22}
                    weight={isActive ? "fill" : "duotone"}
                    className="-mb-px text-[var(--dash-accent)]"
                  />
                  <span className="font-display text-3xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-[var(--dash-accent)]">
                    {item.label}
                  </span>
                  <CaretRight
                    size={16}
                    className="ml-auto text-[var(--dash-faint)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div data-menu-item>
          <Link
            to="/dashboard/profile"
            onClick={() => setMenuOpen(false)}
            className="flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--dash-text)] text-[15px] font-semibold text-[var(--dash-bg)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97]"
          >
            <User size={17} weight="duotone" />
            View profile
          </Link>
        </div>
      </div>
    </>
  );
}

export default Upperdashnavbar;