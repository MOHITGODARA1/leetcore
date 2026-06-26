import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const preferredSectionIds = [
  "introduction",
  "One Line Definition",
  "Real Life Example",
  "why-learn",
  "visualization",
  "internal-working",
  "syntax",
  "complexity",
  "common-mistakes",
  "practice-roadmap",
];

function formatTitle(section) {
  return section.title === "Time and Space Complexity" ? "Time & Space Complexity" : section.title;
}

function Docsleftnavbar({ doc, topicName }) {
  const sections = useMemo(() => {
    const docSections = doc?.sections || [];
    const preferred = preferredSectionIds
      .map((id) => docSections.find((section) => section.id === id))
      .filter(Boolean);

    return preferred.length ? preferred : docSections;
  }, [doc]);

  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!sections.length) return undefined;

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-22% 0px -62% 0px",
        threshold: [0.12, 0.24, 0.4, 0.6],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  function handleSectionClick(event, sectionId) {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) return;

    setActiveId(sectionId);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId}`);
  }

  return (
    <aside className="w-full border-b border-white/5 bg-[#0b0b0c] lg:h-full lg:w-[355px] lg:flex-shrink-0 lg:border-b-0 lg:border-r lg:border-white/5">
      <div className="p-4 lg:sticky lg:top-0 lg:max-h-full lg:overflow-y-auto lg:px-8 lg:py-10">
        <div className="mb-5 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-orange-200/70 lg:mb-8 select-none">
          <Link
            to="/dashboard"
            className="hover:text-orange-400 transition-colors"
          >
            DSA
          </Link>
          <ChevronRight size={12} className="text-orange-200/40" />
          <span>{doc?.topic || topicName}</span>
        </div>

        <nav aria-label="Documentation sections">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-5 lg:overflow-visible lg:pb-0">
            {sections.map((section) => {
              const activeSectionId = activeId || sections[0]?.id;
              const isActive = activeSectionId === section.id;

              return (
                <li key={section.id} className="shrink-0 lg:shrink">
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => handleSectionClick(event, section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className="group flex min-w-max items-center gap-4 rounded-lg py-1 pr-3 transition lg:min-w-0 lg:gap-7"
                  >
                    <span
                      className={`
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition
                        lg:h-7 lg:w-7
                        ${
                          isActive
                            ? "border-[#f46717] bg-[#f46717] shadow-[0_0_24px_rgba(244,103,23,0.36)]"
                            : "border-[#ff8585]/85 bg-transparent group-hover:border-orange-300"
                        }
                      `}
                    >
                      <span
                        className={`
                          h-2.5 w-2.5 rounded-full transition
                          ${isActive ? "bg-white" : "bg-transparent group-hover:bg-orange-200/70"}
                        `}
                      />
                    </span>

                    <span
                      className={`
                        max-w-[245px] whitespace-normal text-left text-sm   tracking-[-0.01em] transition
                        sm:text-sm lg:text-[15px]
                        ${isActive ? "text-white" : "text-white/92 group-hover:text-orange-100"}
                      `}
                    >
                      {formatTitle(section)}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Docsleftnavbar;
