// FeedbackRow.jsx

import FeedbackCard from "./FeedbackCard";

function FeedbackRow({ data, reverse = false }) {
    return (
        <div className="relative overflow-hidden">

            {/* Fade Effect */}
            <div className="absolute left-0 top-0 w-16 sm:w-40 h-full bg-gradient-to-r from-[#080808] to-transparent z-20" />

            <div className="absolute right-0 top-0 w-16 sm:w-40 h-full bg-gradient-to-l from-[#080808] to-transparent z-20" />

            {/* Moving Row */}
            <div
                className={`
          flex
          gap-8
          w-max
          ${reverse ? "animate-marqueeReverse" : "animate-marquee"}
        `}
            >
                {[...data, ...data].map((item, index) => (
                    <FeedbackCard key={index} item={item} />
                ))}
            </div>
        </div>
    );
}

export default FeedbackRow;
