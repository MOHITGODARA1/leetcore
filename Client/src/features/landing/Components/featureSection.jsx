import { useRef } from "react";
import {
  MapTrifold,
  Target,
  Gauge,
  TrendUp,
  ChartBar,
  CheckCircle,
  Check,
} from "@phosphor-icons/react";
import { gsap, useGSAP } from "../../../lib/gsap";
import { Card, Reveal } from "./ui";

const ROADMAP = [
  { label: "Data Structures & Algorithms", status: "completed" },
  { label: "System Design Concepts", status: "active" },
  { label: "Database Management (DBMS)", status: "locked" },
  { label: "Operating Systems (OS)", status: "locked" },
  { label: "Computer Networks (CN)", status: "locked" },
];

const QUESTIONS = [
  { name: "Two Sum", diff: "Easy", solved: true },
  { name: "Reverse Linked List", diff: "Medium", solved: true },
  { name: "LRU Cache Implementation", diff: "Hard", solved: false },
];

const PROGRESS = [
  { label: "Arrays & Vectors", pct: 76 },
  { label: "DBMS Concepts", pct: 58 },
  { label: "System Design", pct: 35 },
];

const COMPARISON = [
  { label: "Avg user", h: 42, highlight: false },
  { label: "You", h: 76, highlight: true },
  { label: "Top 1%", h: 95, highlight: false },
];

const COMPANIES = [
  { name: "Google", pct: 82, ready: true },
  { name: "Microsoft", pct: 78, ready: true },
  { name: "Amazon", pct: 64, ready: false },
  { name: "Adobe", pct: 71, ready: true },
];

const DIFF_STYLES = {
  Easy: "text-[var(--color-success)] bg-[var(--color-success-soft)]",
  Medium: "text-[var(--color-warning)] bg-[var(--color-warning-soft)]",
  Hard: "text-[var(--color-error)] bg-[var(--color-error-soft)]",
};

function CardIcon({ icon }) {
  const Icon = icon;
  return (
    <div className="mb-4 grid h-9 w-9 place-items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-muted)]">
      <Icon size={18} weight="duotone" />
    </div>
  );
}

function FeatureSection() {
  return (
    <section id="features" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        {/* Section header */}
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
            A placement prep that goes the{" "}
            <span className="text-[var(--color-accent)]">full route</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-muted)]">
            Curated roadmaps, focused practice, honest progress signals — every
            piece of the flow is built to move you toward the offer, not to
            distract you from it.
          </p>
        </Reveal>

        <FeaturesGrid />
      </div>
    </section>
  );
}

function FeaturesGrid() {
  const gridRef = useGsapGrid();

  return (
    <div ref={gridRef} className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* 1 — Roadmap (tall) */}
      <div data-feature-card className="min-h-[420px] md:col-span-1 md:row-span-2">
        <Card className="flex h-full flex-col justify-between rounded-[24px] p-6 md:p-7" hover>
          <div>
            <CardIcon icon={MapTrifold} />
            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
              Structured core-subject roadmap
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
              DSA, OS, DBMS, OOP, CN and System Design in the right order —
              no more picking tutorials out of thin air.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3.5 pl-1.5">
            {ROADMAP.map((item, idx) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${
                    item.status === "completed"
                      ? "border-[var(--color-success)]/40 bg-[var(--color-success-soft)] text-[var(--color-success)]"
                      : item.status === "active"
                        ? "border-[var(--color-accent)]/50 bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20"
                        : "border-[var(--color-border)] bg-[var(--color-bg-panel-hover)] text-[var(--color-text-faint)]"
                  }`}
                >
                  {item.status === "completed" ? (
                    <Check size={11} weight="bold" />
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={`text-[13px] ${
                    item.status === "completed"
                      ? "text-[var(--color-text-muted)]"
                      : item.status === "active"
                        ? "font-semibold text-[var(--color-text)]"
                        : "text-[var(--color-text-faint)]"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 2 — Curated questions (wide) */}
      <div data-feature-card="1" className="min-h-[220px] md:col-span-2">
        <Card className="flex h-full flex-col justify-between rounded-[24px] p-6 md:p-7" hover>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xs">
              <CardIcon icon={Target} />
              <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
                Limited, high-quality questions
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                A hand-picked list of the questions that actually show up —
                not thousands of random problems.
              </p>
            </div>

            <div className="w-full shrink-0 space-y-2 md:w-[300px]">
              {QUESTIONS.map((q) => (
                <div
                  key={q.name}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel-hover)] px-3.5 py-2.5"
                >
                  <span className="truncate font-mono text-[12px] text-[var(--color-text-muted)]">
                    {q.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-md px-1.5 py-0.5 text-[9.5px] font-bold ${DIFF_STYLES[q.diff]}`}>
                      {q.diff}
                    </span>
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full ${
                        q.solved
                          ? "bg-[var(--color-success)] text-[#0a0a0b]"
                          : "bg-[var(--color-bg-panel)] text-[var(--color-text-faint)]"
                      }`}
                    >
                      <Check size={10} weight="bold" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 3 — Readiness score */}
      <div data-feature-card="2" className="min-h-[220px]">
        <Card className="flex h-full flex-col justify-between rounded-[24px] p-6" hover>
          <div>
            <CardIcon icon={Gauge} />
            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
              Placement readiness score
            </h3>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
                <circle
                  cx="60"
                  cy="60"
                  r="34"
                  fill="none"
                  stroke="var(--color-bg-panel-hover)"
                  strokeWidth="8"
                />
                <circle
                  data-gauge-fill
                  cx="60"
                  cy="60"
                  r="34"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="213.6"
                  strokeDashoffset="213.6"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-[var(--color-text)]">
                    82
                  </div>
                  <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 4 — Progress tracking */}
      <div data-feature-card="3" className="min-h-[220px]">
        <Card className="flex h-full flex-col justify-between rounded-[24px] p-6" hover>
          <div>
            <CardIcon icon={TrendUp} />
            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
              Live progress tracking
            </h3>
          </div>
          <div className="mt-8 space-y-4">
            {PROGRESS.map((bar) => (
              <div key={bar.label}>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] font-semibold text-[var(--color-text-muted)]">
                  <span>{bar.label}</span>
                  <span className="tabular-nums">{bar.pct}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-bg-panel-hover)]">
                  <div
                    data-progress-fill
                    className="h-full origin-left rounded-full bg-[var(--color-accent)]"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 5 — Compare performance (wide) */}
      <div data-feature-card="4" className="min-h-[220px] md:col-span-2">
        <Card className="flex h-full flex-col justify-between rounded-[24px] p-6 md:p-7" hover>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[240px]">
              <CardIcon icon={ChartBar} />
              <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
                Compare your performance
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                See exactly where you stand against other serious candidates.
              </p>
            </div>

            <div className="flex h-[104px] w-full shrink-0 items-end gap-4 border-b border-[var(--color-border)] pb-0 md:w-[280px]">
              {COMPARISON.map((bar) => (
                <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <div className="flex w-full flex-1 items-end overflow-hidden">
                    <div
                      data-compare-fill
                      style={{ height: `${bar.h}%`, transformOrigin: "bottom" }}
                      className={`w-full origin-bottom rounded-t-md ${
                        bar.highlight
                          ? "bg-[var(--color-accent)]"
                          : "bg-[var(--color-bg-panel-hover)]"
                      }`}
                    />
                  </div>
                  <span className="whitespace-nowrap font-mono text-[9px] font-semibold text-[var(--color-text-faint)]">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 6 — Company prep */}
      <div data-feature-card="5" className="min-h-[220px]">
        <Card className="flex h-full flex-col justify-between rounded-[24px] p-6" hover>
          <div>
            <CardIcon icon={CheckCircle} />
            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
              Company prep analysis
            </h3>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2">
            {COMPANIES.map((co) => (
              <div
                key={co.name}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel-hover)] px-3 py-2"
              >
                <span className="text-[12px] font-semibold text-[var(--color-text-muted)]">
                  {co.name}
                </span>
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[9px] font-black ${
                    co.ready
                      ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                      : "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
                  }`}
                >
                  {co.pct}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function useGsapGrid() {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const cards = gridRef.current.querySelectorAll("[data-feature-card]");
      const gaugeFill = gridRef.current.querySelector("[data-gauge-fill]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 78%",
          once: true,
        },
        defaults: { ease: "expo.out" },
      });

      tl.fromTo(
        cards,
        { autoAlpha: 0, y: 34, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.1 }
      );

      if (gaugeFill) {
        tl.fromTo(
          gaugeFill,
          { strokeDashoffset: 213.6 },
          { strokeDashoffset: 213.6 * 0.18, duration: 1.3, ease: "power2.inOut" },
          "-=0.8"
        );
      }

      gridRef.current.querySelectorAll("[data-progress-fill]").forEach((el) => {
        tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out" }, "-=0.7");
      });

      gridRef.current
        .querySelectorAll("[data-compare-fill]")
        .forEach((el) => {
          tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "power3.out" }, "-=0.7");
        });
    },
    { scope: gridRef }
  );

  return gridRef;
}

export default FeatureSection;