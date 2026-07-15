import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Copy,
  Check,
  GitBranch,
  GitPullRequest,
  Star,
  Users,
  Bug,
  Cpu,
  FileText,
  Layout,
  AlertCircle,
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

function Contribute() {
  const [copied, setCopied] = useState(false);
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
    { label: "Add DSA Questions", icon: HelpCircle, desc: "Submit placement interview problems." },
    { label: "Improve UI/UX", icon: Layout, desc: "Refine layouts and visual systems." },
    { label: "Report Issues", icon: AlertCircle, desc: "Find bugs and document repro steps." }
  ];

  const stats = [
    { label: "Contributors", value: "2", icon: Users },
    { label: "GitHub Stars", value: "4", icon: Star },
    
    { label: "Pull Requests", value: "22", icon: GitPullRequest }
  ];

  return (
    <section className="bg-transparent px-6 py-16 sm:px-8 sm:py-20 md:px-16 relative overflow-hidden border-t border-white/5">
      {/* Subtle Dot Grid Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading and Call-to-Action */}
          <div className="lg:col-span-5 flex flex-col justify-between self-stretch">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f46717] bg-[#f46717]/10 px-3 py-1 rounded-full w-fit select-none">
                Open Source
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4 leading-none">
                Build LeetCore Together
              </h2>
              <p className="text-sm text-white/60 mt-4 leading-relaxed font-medium">
                LeetCore is open source and community-driven. Whether you want to fix bugs, improve the UI, add new features, write documentation, or contribute interview questions, your contributions are always welcome.
              </p>
              <p className="text-xs text-white/45 mt-3 leading-relaxed">
                Join our open-source community to build the ultimate placement prep platform and help students prepare for top software engineering placements.
              </p>
            </div>

            {/* Buttons & Copyable Link Container */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f46717] hover:bg-[#d85610] px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer select-none"
                >
                  <GithubIcon size={14} />
                  Contribute on GitHub
                </a>
                <Link
                  to="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2.5 text-xs font-bold text-white/80 hover:text-white transition-colors cursor-pointer select-none"
                >
                  <BookOpen size={14} />
                  View Documentation
                </Link>
              </div>

              {/* Copyable Link Block */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2 max-w-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <GithubIcon size={12} className="text-white/40 shrink-0" />
                  <span className="font-mono text-[10px] text-white/50 truncate select-all">
                    github.com/mohitgodara/leetcore
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-white/40 hover:text-white transition-colors shrink-0 cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Contribution Stats Grid */}
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.01] p-3 flex items-center gap-3 select-none">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/70">
                      <Icon size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 block font-semibold">{stat.label}</span>
                      <span className="text-sm font-black text-white leading-none mt-0.5 block">{stat.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Contribution Areas Grid and Graphic */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Visual Git Branch Animation Block */}
            <div className="w-full rounded-2xl border border-white/5 bg-[#09090b]/40 p-4 h-36 flex items-center justify-between relative overflow-hidden select-none">
              <div className="flex flex-col justify-between h-full relative z-10">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400">Git Workflow</span>
                  <h4 className="text-xs font-bold text-white mt-1">Fork, commit, and open a Pull Request</h4>
                </div>
                <p className="text-[10px] text-white/40 max-w-[200px] leading-tight">
                  Every contribution, no matter how small, helps thousands of students prepare for placements.
                </p>
              </div>

              {/* Minimal SVG Git graph */}
              <div className="absolute right-4 top-0 bottom-0 w-48 hidden sm:flex items-center justify-center opacity-80 pointer-events-none">
                <svg viewBox="0 0 160 80" className="w-full h-full overflow-visible">
                  {/* Master Branch line */}
                  <line x1="10" y1="40" x2="150" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  
                  {/* Feature Branch line */}
                  <path d="M 40 40 Q 60 15, 80 15 T 120 40" fill="none" stroke="#f46717" strokeWidth="2.5" />
                  
                  {/* Nodes */}
                  <circle cx="20" cy="40" r="4" fill="rgba(255,255,255,0.3)" />
                  <circle cx="40" cy="40" r="4.5" fill="#f46717" />
                  <circle cx="80" cy="15" r="4.5" fill="#f46717" />
                  <circle cx="120" cy="40" r="4.5" fill="#f46717" />
                  <circle cx="140" cy="40" r="4" fill="rgba(255,255,255,0.3)" />
                  
                  {/* Pull Request Label */}
                  <rect x="62" y="24" width="36" height="12" rx="3" fill="#f46717" />
                  <text x="80" y="32" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">PR #2</text>
                </svg>
              </div>
            </div>

            {/* 6 Contribution area cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {contributionAreas.map((area, idx) => {
                const Icon = area.icon;
                return (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-[#09090b]/80 p-4 hover:border-white/10 hover:bg-[#0c0c0e]/95 transition-all duration-300 flex flex-col justify-between min-h-[100px] select-none">
                    <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-[#f46717]">
                      <Icon size={12} />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-white tracking-tight">{area.label}</h4>
                      <p className="text-[10px] text-white/50 mt-1 leading-snug">{area.desc}</p>
                    </div>
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
