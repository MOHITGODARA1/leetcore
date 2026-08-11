/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, EASE_OUT, prefersReducedMotion } from "../../lib/gsap";
import {
  ACTIVITY_UPDATED_EVENT,
  getActivitySummary,
} from "../../services/activityProgress";

const DEFAULT_ACTIVITY = {
  solvedCount: 0,
  totalQuestions: 0,
  streakCount: 0,
  readinessScore: 0,
  weeklySolved: 0,
  currentTopic: { label: "Arrays", solved: 0, total: 0, percent: 0 },
  weeklyProgress: [],
  topicProgress: [],
};

/**
 * Live activity summary — mirrors the DSA sidebar's data source so the home
 * overview stays in sync with the real/account progress.
 */
export function useActivitySummary() {
  const [activity, setActivity] = useState(DEFAULT_ACTIVITY);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const summary = await getActivitySummary();
      if (mounted) setActivity(summary || DEFAULT_ACTIVITY);
    };

    const handleUpdate = (event) => {
      if (event.detail) {
        setActivity(event.detail);
      } else {
        load();
      }
    };

    load();
    window.addEventListener(ACTIVITY_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", load);

    return () => {
      mounted = false;
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", load);
    };
  }, []);

  return activity;
}

const formatNumber = (value) => Math.round(value).toLocaleString("en-US");

/**
 * A quiet GSAP count-up that animates a <span>'s text content toward `value`.
 * Falls back to an instant render under prefers-reduced-motion.
 */
export function CountUp({ value, className }) {
  const ref = useRef(null);
  const valueRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = formatNumber(value);
      valueRef.current = value;
      return;
    }

    const proxy = { v: valueRef.current || 0 };
    const target = Number(value) || 0;

    gsap.to(proxy, {
      v: target,
      duration: 1.15,
      ease: EASE_OUT,
      overwrite: "auto",
      onUpdate: () => {
        el.textContent = formatNumber(proxy.v);
      },
      onComplete: () => {
        el.textContent = formatNumber(target);
        valueRef.current = target;
      },
    });
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(value)}
    </span>
  );
}

/**
 * Staggered entrance for a group of `[data-reveal]` nodes inside `root`.
 */
export function useGsapEntrance(root, { y = 18, stagger = 0.04, delay = 0 } = {}) {
  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      const targets = root.current.querySelectorAll("[data-reveal]");
      if (!targets.length) return;

      gsap.set(targets, { autoAlpha: 0, y });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: EASE_OUT,
        stagger,
        delay,
      });
    },
    { scope: root }
  );
}

/**
 * Minimal animated progress bar shared across dashboard widgets.
 */
export function ProgressBar({ percent, className = "", fill = "var(--dash-accent)" }) {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const width = `${Math.max(0, Math.min(100, percent || 0))}%`;
    if (prefersReducedMotion()) {
      el.style.width = width;
      return;
    }
    gsap.to(el, { width, duration: 0.9, ease: EASE_OUT, overwrite: "auto" });
  }, [percent]);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent || 0)}
      aria-valuemin="0"
      aria-valuemax="100"
      className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--dash-line)]"
    >
      <div
        ref={barRef}
        style={{ width: "0%", backgroundColor: fill }}
        className={`h-full rounded-full ${className}`}
      />
    </div>
  );
}