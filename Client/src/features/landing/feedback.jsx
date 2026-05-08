// Feedback.jsx

import FeedbackRow from "./Components/FeedbackRow";

function Feedback() {
    const feedbackData = [
        {
            name: "Rohit Sharma",
            role: "SDE Intern at Amazon",
            profile: "https://i.pravatar.cc/100?img=11",
            video:
                "",
            feedback:
                "LeetCore finally made OS and DBMS understandable for me. Earlier I used to memorize everything, now I actually understand concepts deeply.",
        },

        {
            name: "Anusha Jha",
            role: "Software Engineer",
            profile: "https://i.pravatar.cc/100?img=22",
            video:
                "YOUR_VIDEO_LINK_HERE",
            feedback:
                "The structured roadmap and Hinglish explanations helped me stay consistent and confident during placement preparation.",
        },

        {
            name: "Aakash T B",
            role: "Frontend Developer",
            profile: "https://i.pravatar.cc/100?img=15",
            video:
                "YOUR_VIDEO_LINK_HERE",
            feedback:
                "I stopped feeling lost while studying core subjects. The learning flow feels modern and motivating.",
        },

        {
            name: "Sanika Deokule",
            role: "Software Engineer Intern",
            profile: "https://i.pravatar.cc/100?img=29",
            video:
                "YOUR_VIDEO_LINK_HERE",
            feedback:
                "LeetCore feels like a senior guiding juniors instead of another boring educational platform.",
        },
    ];

    return (
        <section className="w-full bg-transparent py-20 sm:py-28 lg:py-50 overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">

                {/* Header */}
                <div className="flex flex-col lg:flex-row items-start justify-between mb-14 sm:mb-20 gap-10 lg:gap-12">

                    <div>
                        <h1
                            className="
                text-[2.35rem]
                sm:text-4xl
                md:text-5xl
                
                leading-[1.05]
                tracking-normal
              "
                        >
                            <span className="text-[#F46717]">
                                Dekh bhai
                            </span>

                            <br />

                            <span className="text-white">
                                Inho ne to samjh liya
                            </span>

                            <br />

                            <span className="text-white">
                                Abb teri bari hai
                            </span>
                        </h1>
                    </div>

                    <div className="max-w-xl">
                        <p className="text-[#b7b7c2] text-base sm:text-md leading-[1.5]">
                            Thousands of students are improving their core CS
                            fundamentals, placement preparation, and coding confidence
                            through structured learning and practical understanding.
                        </p>

                        <div className="mt-10">
                            <h3 className="text-white text-4xl font-semibold">
                                1,000+
                            </h3>

                            <p className="text-[#8f8f9a] text-sm mt-2">
                                Active Learners
                            </p>
                        </div>
                    </div>
                </div>

                {/* Top Moving Row */}
                <FeedbackRow data={feedbackData} />

                {/* Bottom Moving Row */}
                <div className="mt-10">
                    <FeedbackRow data={feedbackData} reverse />
                </div>
            </div>
        </section>
    );
}

export default Feedback;
