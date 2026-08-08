import { useRef, useState } from "react";
import { gsap, useGSAP, EASE_OUT, prefersReducedMotion } from "../../lib/gsap";

import Upperdashnavbar from "../../components/common/dashuppernavbar";
import Mainboxes from "./components/mainboxes";
import Dashtopic from "./components/dashtopic";
import Mainnavbar from "./components/mainnavbar";
import Searchbar from "./components/Searchbar";
import ActivityStats from "./components/ActivityStats";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("All Topics");
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const hero = heroRef.current;
      if (!hero) return;

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

      tl.fromTo(
        hero.querySelectorAll("[data-hero-piece]"),
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
        0.1
      );

      if (statsRef.current) {
        tl.fromTo(
          statsRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          "-=0.25"
        );
      }
    }
  );

  return (
    <div className="dash-shell flex h-screen flex-col overflow-hidden bg-[var(--dash-bg)] text-[var(--dash-text)]">
      {/*
        THESIS     — Warm ink-and-paper SaaS command center: premium neutral ground,
                     tinted task surfaces, muted-blue interactive accent, emerald success,
                     amber streak, rose errors, violet/teal data accents; orange < 5%.
        OWN-WORLD  — Warm ivory panels + ink/charcoal type, hairline borders, hint of hue
                     per card, soft ambient washes, restrained shadows, GSAP reveals.
        STORY      — The visitor scans state first: solved, streak, readiness, week, then
                     topics. Every metric has a color-coded skin; every card lifts on hover.
        FIRST VIEW — Eyebrow pill + headline w/ accent term, ambient canvas wash, then a
                     tinted tri-row: stats, week chart, current-focus progress.
        FINISH     — unreviewed and undocumented is unfinished; this build ends with a
                     review pass, the verdict, and DESIGN.md recorded in the skill docs.
      */}
      <Upperdashnavbar />

      {/* Main Content — full width */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="relative mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-10">
          {/* Ambient canvas wash */}
          <div aria-hidden="true" className="dash-ambient pointer-events-none absolute inset-x-0 top-0 h-80" />


          <Mainboxes />

          <Mainnavbar activeTab={activeTab} setActiveTab={setActiveTab} />

          <Searchbar />

          <Dashtopic activeTab={activeTab} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;