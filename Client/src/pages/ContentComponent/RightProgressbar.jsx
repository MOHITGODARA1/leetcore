

function RightProgressbar() {
    const topic = "Arrays & Hashing";

    const total = 25;
    const solved = 0;

    const easy = { solved: 0, total: 10 };
    const medium = { solved: 0, total: 10 };
    const hard = { solved: 0, total: 5 };

    const progress = solved / total;

    // Circle config
    const radius = 55;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className=" text-white p-5 rounded-xl flex flex-col gap-5">

            {/* 🔹 Topic Name */}
            <div className="text-sm text-gray-400">Current Topic</div>
            <div className="text-lg font-semibold">{topic}</div>

            {/* 🔹 Progress Section */}
            <div className="flex items-center justify-between gap-4">

                {/* Circle */}
                <div className="relative flex items-center justify-center">

                    <svg height={radius * 2} width={radius * 2}>
                        {/* Background */}
                        <circle
                            stroke="#333333"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />

                        {/* Progress */}
                        <circle
                            stroke="#FACC15"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{
                                strokeDashoffset,
                                transition: "stroke-dashoffset 0.8s ease",
                            }}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            transform={`rotate(-90 ${radius} ${radius})`}
                        />
                    </svg>

                    {/* Center */}
                    <div className="absolute text-center">
                        <div className="text-2xl font-bold">
                            {Math.round(progress * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Completed</div>
                    </div>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-2">

                    <div className="bg-[#333333] px-2 py-1.5 rounded-md text-center min-w-[86px]">
                        <div className="text-teal-400 text-xs font-medium">Easy</div>
                        <div className="text-[11px] text-gray-300">
                            {easy.solved}/{easy.total}
                        </div>
                    </div>

                    <div className="bg-[#333333] px-2 py-1.5 rounded-md text-center min-w-[50px]">
                        <div className="text-yellow-400 text-xs font-medium">Med.</div>
                        <div className="text-[11px] text-gray-300">
                            {medium.solved}/{medium.total}
                        </div>
                    </div>

                    <div className="bg-[#333333] px-2 py-1.5 rounded-md text-center min-w-[50px]">
                        <div className="text-red-400 text-xs font-medium">Hard</div>
                        <div className="text-[11px] text-gray-300">
                            {hard.solved}/{hard.total}
                        </div>
                    </div>

                </div>
            </div>

            {/* 🔹 Questions Solved */}
            <div className="bg-[#333333] rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm text-gray-400">Questions Solved</span>
                <span className="font-semibold">
                    {solved} <span className="text-gray-500">/ {total}</span>
                </span>
            </div>

        </div>
    );
}

export default RightProgressbar;