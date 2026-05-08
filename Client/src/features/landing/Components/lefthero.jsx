// LeftSection.jsx
import { FiMap, FiEdit3, FiTrendingUp, FiBookOpen } from "react-icons/fi";

function LeftSection({ onLoginClick }) {
    return (
        <div className="flex-1 text-white ">

            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border-1 border-white text-white text-sm font-semibold mb-7">
                1,000+ Learners
            </div>

            {/* Heading */}
            <h1 className="text-[2.75rem] sm:text-5xl lg:text-6xl leading-[1.05] tracking-normal text-white max-w-2xl">
                Core CS <br />
                <span className="text-[#F46717]">Is Baar Actually</span> <br />
                Samajh Aayega.
            </h1>

            {/* Description */}
            <p className="text-[#b7b7c2] text-base sm:text-sm mt-5 leading-relaxed max-w-xl">
                Learn Operating Systems, DBMS, Computer Networks, and OOPS
                through structured roadmaps, practice questions, and
                interactive learning designed for placements.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-9">

                <button onClick={onLoginClick} className="bg-white text-black px-8 py-4 rounded-2xl font-semibold cursor-pointer  transition duration-300">
                    Start Learning
                </button>

                <button onClick={onLoginClick} className="bg-[#F46717] text-white px-8 py-4 rounded-2xl font-semibold cursor-pointer lc-orange-glow  transition duration-300">
                    Explore Roadmaps →
                </button>
            </div>

            {/* Features */}

            <div className="mt-10 flex flex-col gap-4 text-[#b7b7c2]">

                <div className="flex items-center gap-3 text-sm">
                    <FiMap className="text-[#b7b7c2] text-lg" />
                    Follow structured roadmaps designed for real placement preparation
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <FiEdit3 className="text-[#b7b7c2] text-lg" />
                    Practice interactive questions with instant feedback and explanations
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <FiTrendingUp className="text-[#b7b7c2] text-lg" />
                    Track weak topics, monitor progress, and improve consistently
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <FiBookOpen className="text-[#b7b7c2] text-lg" />
                    Learn difficult CS concepts through simple Hinglish explanations
                </div>

            </div>
        </div>
    );
}

export default LeftSection;
