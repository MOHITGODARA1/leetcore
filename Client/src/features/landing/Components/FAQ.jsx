import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { useGsapReveal } from "./ui/Reveal";

const faqs = [
  {
    question: "What is LeetCore?",
    answer:
      "LeetCore is a placement preparation platform that helps students master DSA, Operating Systems, DBMS, OOP, Computer Networks, and System Design through structured roadmaps and interactive practice.",
  },
  {
    question: "Is LeetCore completely free to use?",
    answer:
      "Yes. You can access most learning resources, roadmaps, and practice content for free. Premium features may be introduced in the future.",
  },
  {
    question: "How is LeetCore different from other platforms?",
    answer:
      "Unlike platforms that focus only on coding, LeetCore prepares you for complete placements by covering DSA, CS core subjects, interview preparation, and progress tracking in one place.",
  },
  {
    question: "Can I track my learning progress?",
    answer:
      "Yes. LeetCore tracks completed topics, solved problems, weak areas, and your overall placement readiness.",
  },
  {
    question: "Which programming languages are supported?",
    answer:
      "You can solve coding problems using C++, Java, Python, and JavaScript. More languages will be added over time.",
  },
  {
    question: "Will new topics and features be added?",
    answer:
      "Absolutely. We continuously improve LeetCore by adding new subjects, interview questions, company-specific preparation, and learning tools.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const headingRef = useGsapReveal({});

  return (
    <section id="feedback" className="relative border-t border-[var(--color-border)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Heading column */}
          <div className="lg:col-span-5">
<div ref={headingRef}>
              <h2 className="lc-text-balance font-display text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
                Questions, answered
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--color-text-muted)]">
                Everything you need to know before you start. Still unsure?
                Ask us on GitHub.
              </p>
            </div>
          </div>

          {/* Accordion — divider style, no boxes */}
          <div className="lg:col-span-7">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border-b border-[var(--color-border)] transition-colors duration-300 ${
                    isOpen ? "border-[var(--color-border-strong)]" : ""
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span
                        className={`text-[15px] font-semibold transition-colors duration-300 ${
                          isOpen
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                          isOpen
                            ? "rotate-180 border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                            : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                        } transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                        aria-hidden="true"
                      >
                        <CaretDown size={14} weight="bold" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-hidden={!isOpen}
                    className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pr-8 text-sm leading-7 text-[var(--color-text-muted)]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;