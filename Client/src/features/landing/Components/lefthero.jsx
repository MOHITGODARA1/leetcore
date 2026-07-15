// LeftSection.jsx
import { FiMap, FiEdit3, FiTrendingUp, FiBookOpen } from "react-icons/fi";

function LeftSection({ onLoginClick }) {
    return (
        <div className="flex-1 text-white w-full max-w-2xl lg:max-w-none">

            {/* Badge */}
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white text-black text-xs font-semibold mb-6 sm:mb-7">
                1,000+ Learners (Soon)
            </div> */}

            {/* Heading */}
            <h1 className="text-[clamp(2.45rem,12vw,4.5rem)] sm:text-4xl lg:text-5xl leading-[1.11] font-semibold tracking-normal text-white max-w-2xl mt-10 lc-safe-text">
                Learn Faster<br />
                {/* <span className="text-white">Is Baar Actually</span> <br /> */}
                
                Master Core Subjects <br />
                Crack Every Interview
            </h1>

            {/* Description */}
            <p className="text-[#b7b7c2] text-sm mt-6 leading-relaxed max-w-lg">
                Learn Operating Systems, DBMS, Computer Networks, and OOPS
                through structured roadmaps, practice questions, and
                interactive learning designed for placements.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-9">

                <button onClick={onLoginClick} className="min-h-12 bg-white text-black  px-8 py-4 w-67 rounded-4xl font-bold cursor-pointer lc-interactive  active:scale-[0.98]">
                    Start Learning
                </button>

                <button onClick={onLoginClick} className="min-h-12 bg-orange-400  w-50 text-black px-4 py-4 rounded-4xl font-semibold cursor-pointer lc-orange-glow lc-interactive  active:scale-[0.98]">
                    Explore Roadmaps →
                </button>
            </div>

            {/* Features */}

            <div className="mt-9 sm:mt-20 flex flex-col gap-3.5 sm:gap-4 text-[#b7b7c2]">

                <div className="flex items-start gap-3 text-sm leading-6">
                    <FiMap className="text-[#b7b7c2] text-lg mt-0.5 shrink-0" />
                    <span>Follow structured roadmaps designed for real placement preparation</span>
                </div>

                <div className="flex items-start gap-3 text-sm leading-6">
                    <FiEdit3 className="text-[#b7b7c2] text-lg mt-0.5 shrink-0" />
                    <span>Practice interactive questions with instant feedback and explanations</span>
                </div>

                <div className="flex items-start gap-3 text-sm leading-6">
                    <FiTrendingUp className="text-[#b7b7c2]     text-lg mt-0.5 shrink-0" />
                    <span>Track weak topics, monitor progress, and improve consistently</span>
                </div>

                <div className="flex items-start gap-3 text-sm leading-6">
                    <FiBookOpen className="text-[#b7b7c2] text-lg mt-0.5 shrink-0" />
                    <span>Learn difficult CS concepts through simple Hinglish explanations</span>
                </div>

            </div>
        </div>
    );
}

export default LeftSection;
