import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
    {
        question: "What is Leetcore?",
        answer:
            "Leetcore is a placement preparation platform that helps students master DSA, Operating Systems, DBMS, OOP, Computer Networks, and System Design through structured roadmaps and interactive practice.",
    },
    {
        question: "Is Leetcore completely free to use?",
        answer:
            "Yes. You can access most learning resources, roadmaps, and practice content for free. Premium features may be introduced in the future.",
    },
    {
        question: "How is Leetcore different from other platforms?",
        answer:
            "Unlike platforms that focus only on coding, Leetcore prepares you for complete placements by covering DSA, CS core subjects, interview preparation, and progress tracking in one place.",
    },
    {
        question: "Can I track my learning progress?",
        answer:
            "Yes. Leetcore tracks completed topics, solved problems, weak areas, and your overall placement readiness.",
    },
    {
        question: "Which programming languages are supported?",
        answer:
            "You can solve coding problems using C++, Java, Python, and JavaScript. More languages will be added over time.",
    },
    {
        question: "Will new topics and features be added?",
        answer:
            "Absolutely. We continuously improve Leetcore by adding new subjects, interview questions, company-specific preparation, and learning tools.",
    },
];

function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="w-full py-28 bg-[#09090B]">
            <div className="w-[90%] lg:w-[75%] mx-auto">

                {/* Heading */}
                <div className=" mb-16">
                   

                    <h2 className="text-4xl md:text-5xl font-galindo font-black  text-white leading-tight">
                        Frequently Asked
                       <span className="text-white/60"> Questions</span>
                    </h2>

                    
                </div>

                {/* FAQ */}
                <div className="rounded-3xl border border-white/10 overflow-hidden bg-[#0D0D0F]">

                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className={`border-b border-white/10 last:border-none`}
                            >
                                <button
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="w-full flex items-center justify-between px-8 py-8 text-left transition hover:bg-white/[0.02]"
                                >
                                    <span className="text-white text-xl font-medium">
                                        {faq.question}
                                    </span>

                                    <FiChevronDown
                                        className={`text-2xl text-zinc-400 transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        isOpen
                                            ? "max-h-40 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="px-8 pb-8 pr-20 text-zinc-400 leading-8">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FAQ;