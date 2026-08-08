import { useEffect, useRef, useState } from "react";
import { useGSAP, gsap, ScrollTrigger } from "../../lib/gsap";
import { useReducedMotion } from "./Components/ui/Reveal";

const REPO_URL = "https://github.com/MOHITGODARA1/leetcore";

const NAV_ITEMS = [
  { name: "Features", href: "#features", id: "features" },
  { name: "Creators", href: "#creators", id: "creators" },
  { name: "FAQ", href: "#feedback", id: "feedback" },
  { name: "GitHub", href: REPO_URL, external: true },
];

function LandingNavbar({ onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const reduced = useReducedMotion();

  // Entrance animation
  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        navRef.current,
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out", delay: 0.1 }
      );
    },
    { scope: navRef }
  );

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const sections = NAV_ITEMS.filter((item) => !item.external)
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 60%",
        onToggle: (self) => {
          if (self.isActive) setActiveId(section.id);
        },
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Staggered overlay menu reveal
  useGSAP(
    () => {
      if (menuOpen && !reduced) {
        const ctx = gsap.context(() => {
          gsap.fromTo(
            overlayRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4, ease: "expo.out" }
          );
          gsap.fromTo(
            overlayRef.current.querySelectorAll("[data-menu-item]"),
            { y: 28, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07, ease: "expo.out", delay: 0.12 }
          );
        }, overlayRef);
        return () => ctx.revert();
      }
    },
    { dependencies: [menuOpen] }
  );

  // Lock body scroll while the overlay is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleNav = (e, item) => {
    if (item.external) return; // let the anchor navigate
    e.preventDefault();
    // eslint-disable-next-line react-hooks/immutability
    document.body.style.overflow = ""; // release scroll lock before scrolling
    closeMenu();
    const target = document.querySelector(item.href);
    if (target) {
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5"
      >
        <nav
          className="flex w-full max-w-[1200px] items-center justify-between rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/70 py-2 pl-3 pr-2 shadow-[var(--shadow-md)] backdrop-blur-xl sm:pl-4 sm:pr-3"
          aria-label="Primary"
        >
          {/* Logo */}
          <a href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-panel)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
              <img
                src="/leetcorelogo.png"
                alt="LeetCore logo"
                className="h-6 w-6 object-contain"
              />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[var(--color-text)]">
              LeetCore
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = !item.external && item.id === activeId;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-current={isActive ? "true" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-panel)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLoginClick}
              className="hidden h-10 items-center rounded-full bg-[var(--color-text)] px-5 text-sm font-semibold text-[var(--color-text-inverse)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] sm:inline-flex"
            >
              Sign in
            </button>

            {/* Mobile hamburger — morphs to X */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="lc-mobile-menu"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-panel)] lg:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-4 bg-[var(--color-text)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "rotate-45" : "-translate-y-[3.5px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-4 bg-[var(--color-text)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? "-rotate-45" : "translate-y-[3.5px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <div
        id="lc-mobile-menu"
        ref={overlayRef}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-[var(--color-bg)]/90 px-8 backdrop-blur-2xl lg:hidden ${
          menuOpen ? "" : "pointer-events-none invisible"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map((item, idx) => (
            <li key={item.name} data-menu-item>
              <a
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={() => handleNav(null, item)}
                className="group flex items-baseline gap-4 border-b border-[var(--color-border)] py-5"
              >
                <span className="font-mono text-xs text-[var(--color-text-faint)]">
                  0{idx + 1}
                </span>
                <span className={`font-display text-4xl font-semibold tracking-tight transition-colors duration-300 ${
                  !item.external && item.id === activeId
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text)] group-hover:text-[var(--color-accent)]"
                }`}>
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            closeMenu();
            onLoginClick();
          }}
          data-menu-item
          className="mt-10 inline-flex h-13 items-center justify-center rounded-full bg-[var(--color-text)] px-8 py-4 text-base font-semibold text-[var(--color-text-inverse)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97]"
        >
          Sign in
        </button>
      </div>
    </>
  );
}

export default LandingNavbar;