import { useRef } from "react";
import { ArrowRight, MapTrifold, PencilSimpleLine, TrendUp, BookOpen } from "@phosphor-icons/react";
import { gsap, useGSAP, EASE_OUT } from "../../lib/gsap";
import { useReducedMotion } from "./Components/ui/Reveal";
import { Badge } from "./Components/ui/Badge";
import StrokeText from "./Components/StrokeText";
import TextLoop from "./Components/TextLoop";

const TRUST_ITEMS = [
    { icon: MapTrifold, label: "Structured roadmaps for real placement prep" },
    { icon: PencilSimpleLine, label: "Interactive questions with instant feedback" },
    { icon: TrendUp, label: "Track weak topics and progress" },
    { icon: BookOpen, label: "Core CS concepts in simple Hinglish notes" },
];

function HeroSection({ onLoginClick }) {
    const rootRef = useRef(null);
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            if (reduced) return;
            const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

            tl.fromTo(
                "[data-hero-sub]",
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: 0.8 },
                0.85
            )
                .fromTo(
                    "[data-hero-ctas]",
                    { autoAlpha: 0, y: 18 },
                    { autoAlpha: 1, y: 0, duration: 0.8 },
                    1.0
                )
                .fromTo(
                    "[data-hero-trust]",
                    { autoAlpha: 0, y: 16 },
                    { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05 },
                    1.15
                );
        },
        { scope: rootRef }
    );

    return (
        <section
            ref={rootRef}
            id="top"
            className="lc-hero-glow relative overflow-hidden pb-24 pt-36 sm:pt-30 lg:pb-28 lg:pt-35"
        >
            {/* Blueprint grid fading at the top */}
            <div className="lc-bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />

            {/* Ambient looping wordmark band in the background */}
            <div className="pointer-events-none absolute inset-x-0 bottom-6 sm:bottom-10 lg:bottom-14" aria-hidden="true">
                <TextLoop
                    className="text-loop--hero"
                    text="leetcore"
                    shape="wave"
                    speed={70}
                    direction="forward"
                    separator="✦"
                    curviness={80}
                    fontSize={72}
                    fontWeight={800}
                    letterSpacing={4}
                    uppercase
                    ribbon
                    ribbonWidth={86}
                    pauseOnHover={false}
                />
            </div>

            <div className="relative mx-auto w-full max-w-[920px] px-6 text-center sm:px-8">
               

                {/* Headline — masked curtain reveal */}
                <h1 className="lc-text-balance mt-7 font-display text-[clamp(2.75rem,6.5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-text)]">
                    <span className="block overflow-hidden pb-1">
                        <span data-reveal-line className="block">
                            Learn faster,
                        </span>
                    </span>
                    <span className="block overflow-hidden ">
                        <span data-reveal-line className="block">
                            master core subjects,
                        </span>
                    </span>
                    <span className="block overflow-hidden pb-1">
                        <StrokeText
                            className="stroke-text--hero"
                            text="crack every interview."
                            strokeWidth={1.3}
                            drawDuration={1.2}
                            fillDelay={0.12}
                            stagger={0.035}
                            ease="power2.inOut"
                            trigger="scroll"
                            fillMode="wipe"
                            fontSize={128}
                            fontWeight={800}
                            letterSpacing={-3}
                        />
                    </span>
                </h1>

                {/* Subhead */}
                <p
                    data-hero-sub
                    className="mx-auto mt-6 max-w-[58ch] text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base"
                >
                    Operating Systems, DBMS, Computer Networks, and OOPS — through
                    structured roadmaps, curated practice questions, and interactive
                    learning built for placements.
                </p>

                {/* CTAs */}
                <div data-hero-ctas className="mx-auto mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                    <button
                        type="button"
                        onClick={onLoginClick}
                        className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-4 text-[15px] font-semibold text-[var(--color-text-inverse)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] active:translate-y-0 active:scale-[0.97]"
                    >
                        Start learning
                        <ArrowRight
                            size={18}
                            weight="bold"
                            className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
                        />
                    </button>

                    <button
                        type="button"
                        onClick={onLoginClick}
                        className="group/cta inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-6 py-4 text-[15px] font-semibold text-[var(--color-text)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] active:translate-y-0 active:scale-[0.97]"
                    >
                        Explore roadmaps
                        <span
                            className="grid h-[1.65em] w-[1.65em] place-items-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-0.5"
                            aria-hidden="true"
                        >
                            <ArrowRight size={15} weight="bold" />
                        </span>
                    </button>
                </div>

                {/* Trust indicators */}
                <ul data-hero-trust className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:mt-14">
                    {TRUST_ITEMS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <li key={idx} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                <Icon size={16} weight="duotone" className="text-[var(--color-text-faint)]" />
                                <span>{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}

export default HeroSection;