import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Terminal,
  GitBranch,
  Target,
  LineChart,
  Award,
  Search,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");

  const docSections = [
    {
      id: "intro",
      title: "Introduction",
      icon: BookOpen,
      content: (
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome to LeetCore</h2>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            LeetCore is a premium, open-source educational platform designed to streamline interview preparation for software engineering placements. Instead of solving thousands of random problems, LeetCore provides a structured learning roadmap covering core subjects, high-quality question curation, and AI-powered readiness metrics.
          </p>
          <div className="mt-6 p-4 rounded-xl border border-[#f46717]/20 bg-[#f46717]/5 flex items-start gap-3">
            <Zap size={18} className="text-[#f46717] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">The LeetCore Philosophy</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Consistency, core concept mastery, and real-world placement readiness score tracking. We aim to help developers prepare in weeks, not years.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "roadmap",
      title: "Structured Roadmaps",
      icon: Target,
      content: (
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Structured Learning Path</h2>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            Practice patterns are divided into structured topics to build solid problem-solving fundamentals. The subjects are arranged to ensure you master basics before moving to advanced algorithms:
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              { subject: "Data Structures & Algorithms", details: "Arrays, Strings, Hashing, Binary Search, Linked Lists, Stacks, Queues, Graphs, and DP." },
              { subject: "Core Computer Science", details: "Operating Systems (OS), Database Management (DBMS), Object-Oriented Programming (OOP), and Computer Networks." },
              { subject: "System Design", details: "Learn scalable system architecture principles and low-level / high-level designs." }
            ].map((item, idx) => (
              <li key={idx} className="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-start gap-2.5">
                <ChevronRight size={14} className="text-orange-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.subject}</h4>
                  <p className="text-xs text-white/50 mt-0.5">{item.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "compiler",
      title: "Compiler & IDE Options",
      icon: Terminal,
      content: (
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Compiler IDE & Sandbox</h2>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            LeetCore has a built-in, low-latency compiler sandbox that supports typing and executing solution code in real-time.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                C++ STL (Standard Library)
              </h4>
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                Supports complete compilation with headers, `std::vector`, `std::string`, `std::unordered_map`, and complex standard library algorithms.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Reset Code Template
              </h4>
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                Clicking the reset button restores the question's starter code boilerplate instead of completely clearing the editor workspace.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "github",
      title: "GitHub Automations",
      icon: GitBranch,
      content: (
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Save Progress to GitHub</h2>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            Whenever you submit a correct solution that passes the test cases, LeetCore automatically commits and pushes your code directly to your GitHub account under a dedicated repository: <code className="font-mono text-orange-400 bg-orange-400/5 px-1.5 py-0.5 rounded border border-orange-500/10 text-xs">Leetcore-submission</code>.
          </p>
          <div className="mt-5 p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#f46717]/10 flex items-center justify-center text-[#f46717] border border-[#f46717]/25 shrink-0">
              <GithubIcon size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">OAuth Connectivity</h4>
              <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                Connect your account via GitHub sign-in inside the Auth controller. The compiler IDE automatically tracks access status and prompts reconnection if authorization expires.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "readiness",
      title: "Placement Readiness Score",
      icon: LineChart,
      content: (
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Placement Readiness Score</h2>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            Your Placement Readiness percentage is a composite score tracked in real-time. It evaluates progress based on two major components:
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
              <h4 className="text-xs font-bold text-white">1. Solved Progress (65% weight)</h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                The ratio of curated interview questions you have solved compared to the total questions available in the roadmap.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
              <h4 className="text-xs font-bold text-white">2. Consistency Trend (35% weight)</h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Your daily solving history over a 30-day window. The trend-line shifts upward on days you solve problems and curves down on missed days.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "gamification",
      title: "Gamification & Badges",
      icon: Award,
      content: (
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">XP, Levels, and Mastery Badges</h2>
          <p className="text-sm text-white/70 mt-3 leading-relaxed">
            LeetCore incorporates gamification features to keep you motivated during placement preparation:
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              { title: "Experience Points (XP)", desc: "Earned by running, submitting, and correctly solving roadmap problems." },
              { title: "Milestone Badges", desc: "Unlock predefined milestones for solving streak counts, question milestones, and topic masteries." },
              { title: "Dynamic Leveling", desc: "Your level updates automatically as you solve more questions and earn XP." }
            ].map((item, idx) => (
              <li key={idx} className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      )
    }
  ];

  // Filtering sections based on search query
  const filteredSections = docSections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col">
      
      {/* Header bar */}
      <header className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 hover:bg-white/5 rounded-xl border border-white/5 text-white/60 hover:text-white transition-colors"
              title="Back to Landing Page"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white tracking-tight">LeetCore</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-500/20 select-none">
                Docs
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative max-w-sm w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/[0.02] pl-9 pr-4 py-2 text-xs font-semibold text-white placeholder-white/30 outline-none focus:border-[#f46717]/40 focus:bg-white/[0.03] transition-all"
            />
          </div>
        </div>
      </header>

      {/* Main layout container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2 self-start lg:sticky lg:top-24">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 mb-2">
            Documentation sections
          </span>
          {filteredSections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all select-none cursor-pointer ${
                  isSelected
                    ? "border-orange-500/20 bg-orange-500/5 text-[#f46717] font-bold"
                    : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={14} />
                <span className="text-xs font-semibold">{sec.title}</span>
              </button>
            );
          })}
          {filteredSections.length === 0 && (
            <div className="p-3 text-center text-xs text-white/30 bg-white/[0.01] rounded-xl border border-dashed border-white/5">
              <HelpCircle size={16} className="mx-auto text-white/20 mb-1" />
              No matching sections
            </div>
          )}
        </aside>

        {/* Content Panel */}
        <article className="flex-1 rounded-2xl border border-white/5 bg-[#09090b]/40 p-6 md:p-8 min-h-[400px]">
          {docSections.map((sec) => {
            if (sec.id !== activeSection) return null;
            return (
              <div key={sec.id} className="animate-in fade-in duration-300">
                {sec.content}
              </div>
            );
          })}
        </article>

      </main>

      {/* Footer bar */}
      <footer className="border-t border-white/5 bg-[#09090b]/80 px-6 py-6 mt-12 text-center select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-white/40">
          <div className="flex items-center justify-center gap-1.5 font-bold text-white/60">
            <ShieldCheck size={12} className="text-[#f46717]" />
            LeetCore Documentation System
          </div>
          <p>© {new Date().getFullYear()} LeetCore. Open source under MIT License.</p>
        </div>
      </footer>

    </div>
  );
}

export default DocsPage;
