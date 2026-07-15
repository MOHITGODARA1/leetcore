import { Link } from "react-router-dom";
import {
  Compass,
  Target,
  LineChart,
  CheckCircle2,
  BarChart3,
  Layers3
} from "lucide-react";

function FeatureCard({ children, className = "" }) {
  return (
    <div className={`group relative rounded-[24px] border border-white/5 bg-white/8 p-5 md:p-6 flex flex-col justify-between  transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.15)] ${className}`}>
      {children}
    </div>
  );
}

function FeatureSection() {
  return (
    <section className="bg-transparent px-6 py-12 sm:px-8 sm:py-16 md:px-16 relative overflow-hidden">
      {/* Subtle Dot Grid Background Element */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Card 1: Structured Core Subject Roadmap (Col 1, Row 1 & 2 - Tall Card) */}
          <FeatureCard className="md:col-span-1 md:row-span-2 min-h-[380px] md:min-h-[460px]">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="h-8 w-8 rounded-lg  flex items-center justify-center border border-white/25 text-white/80  mb-1 select-none">
                  <Compass size={18} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Structured Core Subject Roadmap</h3>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  Learn DSA, Operating Systems, DBMS, OOP, Computer Networks, and System Design in the right order with a complete placement-focused roadmap.
                </p>
              </div>

              {/* Learning Timeline Graphic */}
              <div className="mt-8 flex flex-col gap-4 pl-2 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10 select-none">
                {[
                  { label: "Data Structures & Algorithms", status: "completed" },
                  { label: "System Design Concepts", status: "active" },
                  { label: "Database Management (DBMS)", status: "locked" },
                  { label: "Operating Systems (OS)", status: "locked" },
                  { label: "Computer Networks (CN)", status: "locked" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 relative z-10">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center border text-[9px] font-bold ${
                      item.status === "completed" 
                        ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-400"
                        : item.status === "active"
                          ? "bg-[#f46717]/20 border-[#f46717]/35 text-[#f46717] animate-pulse"
                          : "bg-white/5 border-white/10 text-white/40"
                    }`}>
                      {item.status === "completed" ? "✓" : idx + 1}
                    </div>
                    <span className={`text-xs font-semibold ${
                      item.status === "completed" ? "text-white/60" : item.status === "active" ? "text-white" : "text-white/30"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Card 2: Limited, High-Quality Questions (Cols 2 & 3, Row 1 - Wide Card) */}
          <FeatureCard className="md:col-span-2 md:row-span-1 min-h-[220px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 h-full">
              <div className="max-w-md">
                <div className="h-8 w-8 rounded-lg  flex items-center justify-center text-white/80 border border-white/25 mb-4 select-none">
                  <Target size={18} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Limited, High-Quality Questions</h3>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  Practice only the most important interview questions instead of solving thousands of random problems. Focus on core concepts that actually matter.
                </p>
              </div>

              {/* Question list checklist graphic */}
              <div className="w-full md:w-[260px] rounded-xl border border-white/5 bg-white/[0.01] p-3 flex flex-col gap-2 shrink-0 select-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#f46717]">Curated Placement List</span>
                {[
                  { name: "Two Sum", diff: "Easy", solved: true },
                  { name: "Reverse Linked List", diff: "Medium", solved: true },
                  { name: "LRU Cache Implementation", diff: "Hard", solved: false }
                ].map((q, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/40 rounded-lg p-2 border border-white/5">
                    <span className="text-xs text-white/80 font-mono truncate mr-2">{q.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        q.diff === "Easy" ? "text-emerald-400 bg-emerald-500/10" : q.diff === "Hard" ? "text-rose-400 bg-rose-500/10" : "text-amber-400 bg-amber-500/10"
                      }`}>{q.diff}</span>
                      <span className={`h-2 w-2 rounded-full ${q.solved ? "bg-emerald-500" : "bg-white/10"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Card 3: Placement Readiness Score (Col 2, Row 2 - Square Card) */}
          <FeatureCard className="md:col-span-1 md:row-span-1 min-h-[220px]">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="h-8 w-8 rounded-lg  flex items-center justify-center text-white/80 border border-white/25 mb-4 select-none">
                  <LineChart size={18} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Placement Readiness Score</h3>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  Receive an AI-powered score that measures your placement readiness based on progress and performance.
                </p>
              </div>

              {/* Gauge Meter Graphic */}
              <div className="mt-6 flex items-center justify-center select-none">
                <div className="h-24 w-24 rounded-full border-4 border-white/5 flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-4 border-t-green-400 border-r-green-400 border-b-white/5 border-l-transparent pointer-events-none" />
                  <span className="text-xl font-black text-white leading-none">82%</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-green-400 mt-1">Ready</span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Card 4: Live Progress Tracking (Col 3, Row 2 - Square Card) */}
          <FeatureCard className="md:col-span-1 md:row-span-1 min-h-[220px]">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="h-8 w-8 rounded-lg  flex items-center justify-center text-white/80 border border-white/25 mb-4 select-none">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Live Progress Tracking</h3>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  Track your learning journey in real time with topic completion, progress percentages, and insights.
                </p>
              </div>

              {/* Progress bars stack graphic */}
              <div className="mt-6 flex flex-col gap-2 select-none">
                {[
                  { label: "Arrays & Vectors", pct: 76 },
                  { label: "DBMS Concepts", pct: 58 },
                  { label: "System Design", pct: 35 }
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between items-center text-[9px] text-white/60 mb-0.5 font-bold">
                      <span>{bar.label}</span>
                      <span>{bar.pct}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div style={{ width: `${bar.pct}%` }} className="h-full bg-green-400 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Card 5: Compare Your Performance (Cols 1 & 2, Row 3 - Wide Card) */}
          <FeatureCard className="md:col-span-2 md:row-span-1 min-h-[220px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 h-full">
              <div className="max-w-md">
                <div className="h-8 w-8 rounded-lg  flex items-center justify-center text-white/80 border border-white/25 mb-4 select-none">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Compare Your Performance</h3>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  Compare your progress, rankings, and readiness score with other LeetCore users to understand exactly where you stand in the overall developer distribution.
                </p>
              </div>

              {/* Comparison Bar Graph Graphic */}
              <div className="w-full md:w-[240px] h-24 flex items-end gap-3 px-4 pb-1 border-b border-white/5 shrink-0 select-none">
                {[
                  { label: "Avg User", h: 42, color: "bg-white/10" },
                  { label: "You", h: 76, color: "bg-[#FFD700]" },
                  { label: "Top 1%", h: 95, color: "bg-white/20" }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div style={{ height: `${bar.h}%` }} className={`w-full rounded-t-sm transition-all duration-500 ${bar.color}`} />
                    <span className="text-[8px] font-bold text-white/40 whitespace-nowrap">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Card 6: Company Preparation Analysis (Col 3, Row 3 - Standard Card) */}
          <FeatureCard className="md:col-span-1 md:row-span-1 min-h-[220px]">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="h-8 w-8 rounded-lg  flex items-center justify-center text-white/80 border border-white/25 mb-4 select-none">
                  <Layers3 size={18} />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Company Prep Analysis</h3>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">
                  Check whether you're ready for top tech companies based on your score, along with improvement tips.
                </p>
              </div>

              {/* Company list ticks graphic */}
              <div className="mt-6 grid grid-cols-2 gap-2 select-none">
                {[
                  { name: "Google", pct: 82, ready: true },
                  { name: "Microsoft", pct: 78, ready: true },
                  { name: "Amazon", pct: 64, ready: false },
                  { name: "Adobe", pct: 71, ready: true }
                ].map((co, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg border border-white/5 bg-white/[0.01]">
                    <span className="text-[9px] font-bold text-white/70">{co.name}</span>
                    <span className={`text-[8px] font-black uppercase px-1 py-0.25 rounded ${
                      co.ready ? "text-emerald-400 bg-emerald-500/5" : "text-amber-400 bg-amber-500/5"
                    }`}>{co.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
