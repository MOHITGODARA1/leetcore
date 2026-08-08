import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "./Components/ui/Reveal";
import { GithubLogo, LinkedinLogo, XLogo, YoutubeLogo } from "@phosphor-icons/react";

const PRODUCT_LINKS = [
  { label: "Roadmaps", href: "#features" },
  { label: "Practice", href: "#features" },
  { label: "Interview prep", href: "#feedback" },
  { label: "Progress tracking", href: "#features" },
];

const RESOURCE_LINKS = [
  { label: "OS Notes", href: "#" },
  { label: "DBMS Notes", href: "#" },
  { label: "CN Notes", href: "#" },
  { label: "OOPS Concepts", href: "#" },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/MOHITGODARA1/leetcore", icon: GithubLogo },
  { label: "LinkedIn", href: "#", icon: LinkedinLogo },
  { label: "X", href: "#", icon: XLogo },
  { label: "YouTube", href: "#", icon: YoutubeLogo },
];

function Footer() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        rootRef.current.querySelectorAll("[data-footer-item]"),
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 90%", once: true },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden border-t border-[var(--color-border)] py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-[var(--color-border)] pb-14 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div data-footer-item className="flex items-center gap-3">
              <img
                src="/leetcorelogo.png"
                alt="LeetCore logo"
                className="h-10 w-10 object-contain"
              />
              <span className="font-display text-xl font-bold tracking-tight text-[var(--color-text)]">
                LeetCore
              </span>
            </div>
            <p
              data-footer-item
              className="mt-5 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]"
            >
              A modern platform for mastering core CS subjects, coding
              fundamentals, and placement preparation through structured
              learning.
            </p>
            <div data-footer-item className="mt-8 flex items-center gap-2.5">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-muted)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <h3
              data-footer-item
              className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-faint)]"
            >
              Product
            </h3>
            <ul data-footer-item className="mt-5 space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h3
              data-footer-item
              className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-faint)]"
            >
              Resources
            </h3>
            <ul data-footer-item className="mt-5 space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3
              data-footer-item
              className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-faint)]"
            >
              Connect
            </h3>
            <ul data-footer-item className="mt-5 space-y-3 text-sm leading-6 text-[var(--color-text-muted)]">
              <li>Mohit Godara</li>
              <li>Full Stack Developer</li>
              <li>Founder of LeetCore</li>
              <li>
                <a
                  href="mailto:mohitgodara816@gmail.com"
                  className="text-[var(--color-accent)] transition-opacity duration-200 hover:opacity-80"
                >
                  mohitgodara816@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div data-footer-item className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-sm text-[var(--color-text-faint)]">
            © 2026 LeetCore. All rights reserved.
          </p>
          <div className="flex items-center gap-7 text-sm text-[var(--color-text-faint)]">
            <a href="#" className="transition-colors duration-200 hover:text-[var(--color-text)]">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors duration-200 hover:text-[var(--color-text)]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;