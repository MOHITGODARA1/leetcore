import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Copy,
  Check,
  Star,
  Users,
  GitPullRequest,
  GithubLogo,
  Bug,
  Cpu,
  FileText,
  Layout,
  ListChecks,
  WarningCircle,
} from "@phosphor-icons/react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "./Components/ui/Reveal";

function ContributionCard({ icon, label, desc }) {
  const Icon = icon;
  return (
    <div className="group flex min-h-[104px] flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-panel-hover)]">
      <div className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-panel-hover)] text-[var(--color-accent)] transition-colors duration-300 group-hover:border-[var(--color-accent)]/40">
        <Icon size={16} weight="duotone" />
      </div>
      <div className="mt-4">
        <h4 className="text-[13px] font-bold tracking-tight text-[var(--color-text)]">
          {label}
        </h4>
        <p className="mt-1 text-[11.5px] leading-snug text-[var(--color-text-muted)]">
          {desc}
        </p>
      </div>
    </div>
  );
}

function Contribute() {
  const [copied, setCopied] = useState(false);
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  const repoUrl = "https://github.com/MOHITGODARA1/leetcore";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(repoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contributionAreas = [
    { label: "Fix Bugs", icon: Bug, desc: "Solve open issues and refactor code." },
    { label: "Add Features", icon: Cpu, desc: "Build new interactive modules." },
    { label: "Improve Docs", icon: FileText, desc: "Write guides and document APIs." },
    { label: "Add DSA Questions", icon: ListChecks, desc: "Submit placement interview problems." },
    { label: "Improve UI/UX", icon: Layout, desc: "Refine layouts and visual systems." },
    { label: "Report Issues", icon: WarningCircle, desc: "Find bugs and document repro steps." },
  ];

  const stats = [
    { label: "Contributors", value: 2, icon: Users },
    { label: "GitHub Stars", value: 4, icon: Star },
    { label: "Pull Requests", value: 22, icon: GitPullRequest },
  ];

  useGSAP(
    () => {
      const cards = rootRef.current.querySelectorAll("[data-reveal]");
      if (reduced) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 78%", once: true },
          }
        );

        // animated counters
        rootRef.current.querySelectorAll("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count) || 0;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = Math.round(obj.val);
            },
          });
        });
      }, rootRef);
      return () => ctx.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="creators"
      className="relative overflow-hidden border-t border-[var(--color-border)] py-20 sm:py-24 lg:py-28"
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 70% 60% at 30% 20%, black, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 30% 20%, black, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left column */}
          <div className="flex flex-col justify-between self-stretch lg:col-span-5">
            <div>
              <h2
                data-reveal
                className="lc-text-balance font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl"
              >
                Build LeetCore together
              </h2>
              <p
                data-reveal
                className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--color-text-muted)]"
              >
                LeetCore is open source and community-driven. Fix bugs, improve
                the UI, add features, write docs, or submit interview questions
                — every contribution helps a student prepare.
              </p>

              <div data-reveal className="mt-8 flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/cta inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--color-text)] px-5 text-sm font-bold text-[var(--color-text-inverse)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
                  >
                    <GithubLogo size={16} weight="fill" />
                    Contribute on GitHub
                  </a>
                  <Link
                    to="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-5 text-sm font-bold text-[var(--color-text)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] active:translate-y-0 active:scale-[0.97]"
                  >
                    <BookOpen size={16} weight="duotone" />
                    View documentation
                  </Link>
                </div>

                {/* Copyable repo link */}
                <div className="flex max-w-sm items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-3.5 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <GithubLogo size={14} className="shrink-0 text-[var(--color-text-faint)]" />
                    <span className="truncate font-mono text-[11px] text-[var(--color-text-muted)] select-all">
                      github.com/mohitgodara/leetcore
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--color-text-faint)] transition-colors duration-200 hover:bg-[var(--color-bg-panel-hover)] hover:text-[var(--color-text)]"
                    title="Copy link"
                    aria-label="Copy repository link"
                  >
                    {copied ? (
                      <Check size={14} weight="bold" className="text-[var(--color-success)]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div data-reveal className="mt-10 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label}>
                    <div className="flex items-center gap-2 text-[var(--color-accent)]">
                      <Icon size={16} weight="duotone" />
                      <span
                        className="font-display text-2xl font-bold tabular-nums text-[var(--color-text)]"
                        data-count={stat.value}
                        aria-label={`${stat.value} ${stat.label}`}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <span className="mt-1 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-faint)]">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Git workflow banner */}
            <div
              data-reveal
              className="relative flex min-h-[140px] items-center justify-between overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] p-6"
            >
              <div className="relative z-10">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Git workflow
                </span>
                <h4 className="mt-1 font-display text-base font-semibold text-[var(--color-text)]">
                  Fork, commit, and open a pull request
                </h4>
                <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-[var(--color-text-muted)]">
                  Every contribution, however small, helps students prepare for
                  placements.
                </p>
              </div>

              <svg
                viewBox="0 0 160 80"
                className="pointer-events-none absolute bottom-0 right-2 top-0 hidden w-48 sm:block"
                aria-hidden="true"
              >
                <line
                  x1="10"
                  y1="40"
                  x2="150"
                  y2="40"
                  stroke="var(--color-border)"
                  strokeWidth="3"
                />
                <path
                  d="M 40 40 Q 60 15, 80 15 T 120 40"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                />
                <circle cx="20" cy="40" r="4" fill="var(--color-text-faint)" />
                <circle cx="40" cy="40" r="4.5" fill="var(--color-accent)" />
                <circle cx="80" cy="15" r="4.5" fill="var(--color-accent)" />
                <circle cx="120" cy="40" r="4.5" fill="var(--color-accent)" />
                <circle cx="140" cy="40" r="4" fill="var(--color-text-faint)" />
                <rect x="62" y="24" width="36" height="12" rx="3" fill="var(--color-accent)" />
                <text
                  x="80"
                  y="32.5"
                  fill="#0a0a0b"
                  fontSize="6"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  PR #2
                </text>
              </svg>
            </div>

            {/* Contribution areas */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {contributionAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div key={area.label} data-reveal>
                    <ContributionCard icon={Icon} label={area.label} desc={area.desc} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contribute;