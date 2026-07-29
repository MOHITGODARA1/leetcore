import { useState, useEffect } from "react";
import Upperdashnavbar from "../components/common/dashuppernavbar";
import {
  Check,
  PenTool,
  Users,
  FileEdit,
  Wand2,
  Smartphone,
  FileText,
  CalendarDays,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    label: "STEP 1",
    title: "Add complete DSA problems",
    icon: PenTool,
    accent: "#8ecae6",
  },
  {
    label: "STEP 2",
    title: "Complete OS, CN, DBMS implementation",
    icon: Users,
    accent: "#94d2bd",
  },
  {
    label: "STEP 3",
    title: "Complete OOPs, Aptitude, CPP",
    icon: FileEdit,
    accent: "#a78bfa",
  },
  {
    label: "STEP 4",
    title: "Complete Git & GitHub, Low Level Design",
    icon: Wand2,
    accent: "#f4a261",
  },
  {
    label: "STEP 5",
    title: "Complete System Design, Interview Prep",
    icon: Smartphone,
    accent: "#f6bd60",
  },
  {
    label: "STEP 6",
    title: "Add AI suggestions & placement readiness",
    icon: FileText,
    accent: "#ef8da8",
  },
];

// What this specific update actually ships
const includedInUpdate = [
  "Full Operating Systems module with structured topic-wise notes",
  "Complete Computer Networks content, from fundamentals to protocols",
  "DBMS implementation with practice questions per topic",
  "Recruiter-informed roadmaps sequencing what to study and when",
];

// NOTE: placeholder team credits — swap in real names/roles/avatars.
const team = [
  { name: "Mohit Godara", role: "Product & Engineering", initials: "MG" },
  { name: "Isha", role: "OS · CN · DBMS curriculum", initials: "CT" },
  { name: "Sakshi", role: "UI & roadmap experience", initials: "DS" },
];

function Whatsnext() {
  // 0-indexed: steps before this are complete, this one is "current"
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const progressPct = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <>
    <Upperdashnavbar />

    <div className="min-h-screen bg-[#070709] text-white p-6 sm:p-8">
      <style>{`
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPop {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .step-dot { opacity: 0; animation: dotPop 0.4s ease-out forwards; }
        .step-line { transform-origin: left; transform: scaleX(0); animation: lineGrow 0.5s ease-out forwards; }
        .step-card { opacity: 0; animation: stepFadeIn 0.45s ease-out forwards; }
        .fade-in-up { opacity: 0; animation: stepFadeIn 0.5s ease-out forwards; }
      `}</style>
        
      <div className="max-w-7xl mx-auto py-2">
        {/* Section heading */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-white/40 mb-2">
              ROADMAP
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What&rsquo;s next on Leetcore
            </h1>
            <p className="text-sm text-white/40 mt-1.5">
              Track progress across the six milestones on your prep journey.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white leading-none">
              {progressPct}%
            </p>
            <p className="text-xs text-white/40 mt-1">roadmap in motion</p>
          </div>
        </div>

        {/* Panel */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          {/* Progress rail */}
          <div className="relative flex items-center mb-10 px-1">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => setCurrentStep(i)}
                  aria-label={`Go to ${step.label}`}
                  className={`step-dot relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                    i <= currentStep
                      ? "bg-white text-neutral-900 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
                      : "bg-white/[0.03] text-white/40 border border-white/15 hover:border-white/30 hover:text-white/60"
                  }`}
                  style={mounted ? { animationDelay: `${i * 90}ms` } : { opacity: 0 }}
                >
                  {i <= currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </button>

                {i < steps.length - 1 && (
                  <div
                    className={`step-line h-px flex-1 transition-colors duration-300 ${
                      i < currentStep ? "bg-white/50" : "bg-white/10"
                    }`}
                    style={
                      mounted
                        ? { animationDelay: `${i * 90 + 120}ms` }
                        : { transform: "scaleX(0)" }
                    }
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <button
                  key={step.title}
                  onClick={() => setCurrentStep(i)}
                  className={`step-card text-left rounded-xl p-4 border flex flex-col h-full transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.06] ${
                    isActive
                      ? "border-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                      : "border-white/10"
                  }`}
                  style={mounted ? { animationDelay: `${i * 90 + 150}ms` } : { opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${step.accent}1A`,
                        border: `1px solid ${step.accent}33`,
                      }}
                    >
                      <Icon
                        className="h-4.5 w-4.5"
                        strokeWidth={1.9}
                        style={{ color: step.accent }}
                      />
                    </div>
                    {isDone && (
                      <Check className="h-3.5 w-3.5 text-white/50" strokeWidth={2.5} />
                    )}
                  </div>
                  <p
                    className="text-[11px] font-semibold tracking-wide mb-1.5"
                    style={{ color: isActive ? step.accent : "rgba(255,255,255,0.4)" }}
                  >
                    {step.label}
                  </p>
                  <p className="text-[14px] font-semibold leading-snug text-white/90">
                    {step.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Update details */}
        <div
          className="fade-in-up mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          style={mounted ? { animationDelay: "900ms" } : { opacity: 0 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Next Update
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/60 border border-white/10">
              <CalendarDays className="h-3.5 w-3.5" />
              Ships 15 August
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
            OS, CN &amp; DBMS — built the way recruiters actually test it
          </h2>

          <p className="text-sm text-white/60 leading-7 max-w-4xl">
            The next Leetcore update ships complete implementations of{" "}
            <span className="text-white font-medium">
              Operating Systems, Computer Networks, and DBMS
            </span>
            , each with structured learning content, topic-wise practice
            questions, and a guided roadmap. These roadmaps were shaped
            using direct feedback from recruiters and experienced software
            engineers, so the sequencing mirrors what placement interviews
            actually expect rather than a generic syllabus order. Our goal
            is to keep Leetcore evolving with updates that make interview
            prep more focused and more effective, one milestone at a time.
          </p>

          {/* What's included */}
          <div className="mt-7">
            <p className="text-xs font-semibold tracking-wide text-white/40 mb-3">
              WHAT'S INCLUDED
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {includedInUpdate.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/20"
                >
                  <Check className="h-4 w-4 text-[#94d2bd] mt-0.5 shrink-0" />
                  <span className="text-sm text-white/80 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Team credits */}
          <div className="mt-8 pt-7 border-t border-white/10">
            <p className="text-xs font-semibold tracking-wide text-white/40 mb-4">
              BUILT BY
            </p>
            <div className="flex flex-wrap gap-3.5">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">
                      {member.name}
                    </p>
                    <p className="text-xs text-white/40 leading-tight mt-0.5">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Whatsnext;