import { useState } from "react";
import { ChevronDown, ArrowUpRight, Mail } from "lucide-react";
import Upperdashnavbar from "../components/common/dashuppernavbar";

// TODO: replace with your real Google Form link(s).
// Add a role-specific `applicationLink` to override this default per role.
const DEFAULT_APPLICATION_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSeITvavMDN_gIFwa2YPVGDVauvn8uqbVAp3yI4vg-EHFm7wAA/viewform?usp=publish-editor";

const roles = [
  {
    title: "Campus Ambassador",
    type: "Part Time",
    salary: "2k - 5K",
    location: "Boston, United States",
    description:
      "Own inventory forecasting and supply-chain accuracy across our gene-editing reagent lines, working closely with lab operations to keep critical materials always in stock.",
  },
  {
    title: "Senior Software Developer",
    type: "Full Time",
    salary: "10k - 20K",
    location: "Remote",
    description:
      "Build the platform that connects our AI models to CRISPR design pipelines — backend services, data infrastructure, and internal tooling used by our research teams daily.",
  },
  {
    title: "Junior UI/UX Fullstack Designer",
    type: "Part Time",
    salary: "1k - 3K",
    location: "Remote",
    description:
      "Design and ship interfaces for scientists and engineers, translating complex genomic workflows into clear, usable product experiences across web and internal tools.",
  },
];

function Career() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  const handleApply = (role) => {
    const link = role.applicationLink || DEFAULT_APPLICATION_LINK;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Upperdashnavbar />

      <div className="min-h-screen bg-[#070709] text-white p-6 sm:p-8">
        <div className="max-w-6xl mx-auto py-4 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
          {/* Left sidebar */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-white/40 mb-3">
                CAREERS
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.05] mb-3">
                Our Open
                <br />
                Roles
              </h1>
              <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-xs">
                Join us in building the tools that help engineers land the
                job they're preparing for.
              </p>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold tracking-wide text-white/40 mb-2">
                  OR CONTACT US
                </p>
                <a
                  href="mailto:leetcoreoffical@gmail.com"
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  leetcoreoffical@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Right: roles list */}
          <div>
            <p className="text-xs font-semibold tracking-wide text-white/40 mb-4">
              {roles.length} OPEN ROLES
            </p>

            <div className="border-t border-white/10">
              {roles.map((role, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={role.title}
                    className={`border-b border-white/10 transition-colors duration-200 ${
                      isOpen ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <div className="py-7 px-1">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            {role.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-white/50">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-white/70">
                              {role.type}
                            </span>
                            <span>{role.salary}</span>
                            <span className="text-white/20">•</span>
                            <span>{role.location}</span>
                          </div>

                          {isOpen && (
                            <p className="mt-5 text-sm text-white/60 leading-relaxed max-w-xl">
                              {role.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => toggle(i)}
                            aria-label="Toggle details"
                            aria-expanded={isOpen}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-colors"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <button
                            onClick={() => handleApply(role)}
                            className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 active:bg-indigo-600 transition-colors cursor-pointer"
                          >
                            Submit Application
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer info blocks */}
            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <span className="inline-block rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70 mb-4">
                  How It Works
                </span>
                <p className="text-sm text-white/60 leading-relaxed">
                  By integrating advanced artificial intelligence with CRISPR
                  technology, we provide cutting-edge solutions to unlock the
                  full potential of gene editing.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <span className="inline-block rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70 mb-4">
                  Contact Us
                </span>
                <p className="text-sm text-white/60 leading-relaxed">
                  Precision gene editing meets AI-driven insights to unlock
                  the future of medicine, agriculture, and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Career;