/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, REDUCED_MOTION_QUERY, EASE_OUT } from "../../../../lib/gsap";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Scroll-triggered reveal hook. Fades + lifts (optionally de-blurs) the
 * target element once as it enters the viewport.
 */
export function useGsapReveal({ start = "top 82%", y = 26, blur = 6, delay = 0, duration = 0.9, scrollTrigger = true } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reduced) {
        gsap.set(ref.current, { autoAlpha: 1, clearProps: "all" });
        return;
      }

      gsap.set(ref.current, {
        autoAlpha: 0,
        y,
        filter: blur ? `blur(${blur}px)` : undefined,
      });

      gsap.to(ref.current, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        delay,
        ease: EASE_OUT,
        scrollTrigger: scrollTrigger
          ? { trigger: ref.current, start, once: true }
          : undefined,
      });
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Wrapper component for scroll-triggered reveals.
 */
export function Reveal({
  children,
  className = "",
  start = "top 82%",
  y = 26,
  blur = 6,
  delay = 0,
  duration = 0.9,
  ...props
}) {
  const Comp = "div";
  const ref = useGsapReveal({ start, y, blur, delay, duration });

  return (
    <Comp ref={ref} className={className} {...props}>
      {children}
    </Comp>
  );
}

/**
 * Masked line reveal for display type. Children should be plain text;
 * each <span className="reveal-line">/inner span creates a curtain reveal.
 */
export function useGsapLineReveal(ref, { delay = 0, stagger = 0.09 } = {}) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const lines = ref.current.querySelectorAll("[data-reveal-line]");
      gsap.set(lines, { autoAlpha: 1, yPercent: 118 });
      gsap.to(lines, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1.05,
        ease: EASE_OUT,
        stagger,
        delay,
      });
    },
    { scope: ref }
  );
}

export default Reveal;