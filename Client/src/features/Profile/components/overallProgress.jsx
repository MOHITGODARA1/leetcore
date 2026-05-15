function OverallProgress() {

    const topics = [
        {
            name: "Arrays",
            solved: 34,
            total: 120,
            color: "#cf8a75",
            bg: "#cf8a75",
        },
        {
            name: "Strings",
            solved: 21,
            total: 95,
            color: "#cf8a75",
            bg: "bg-yellow-400",
        },
        {
            name: "Linked List",
            solved: 14,
            total: 60,
            color: "#cf8a75",
            bg: "bg-red-400",
        },
        {
            name: "Binary",
            solved: 14,
            total: 60,
            color: "#cf8a75",
            bg: "bg-red-400",
        },
        {
            name: "Stack",
            solved: 14,
            total: 60,
            color: "#cf8a75",
            bg: "bg-red-400",
        },
        {
            name: "Queue",
            solved: 14,
            total: 60,
            color: "#cf8a75",
            bg: "bg-red-400",
        },
    ];

    return (

        <div
            className="
                w-full
                min-h-[320px]
                flex
                flex-col
                lg:flex-row
                items-center
                justify-between
                gap-6
                px-5
                sm:px-8
                py-6
                relative
                overflow-hidden
            "
        >





            {/* Left Side */}
            <div
                className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-center
                    flex-1
                "
            >

                <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">

                    {/* Ring */}
                    <svg viewBox="0 0 300 300">

                        {/* Background */}
                        <circle
                            cx="150"
                            cy="150"
                            r="95"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="12"
                        />

                        {/* Progress */}
                        <circle
                            cx="150"
                            cy="150"
                            r="95"
                            fill="none"
                            stroke="#F46717"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="597"
                            strokeDashoffset="200"
                        />

                    </svg>

                    {/* Center Content */}
                    <div
                        className="
                            absolute
                            inset-0
                            flex
                            flex-col
                            items-center
                            justify-center
                        "
                    >

                        <h1
                            className="
                                text-md
                                font-bold
                                text-white
                            "
                        >
                            225
                            <span
                                className="
                                    text-md
                                    text-gray-300
                                "
                            >
                                /3930
                            </span>
                        </h1>

                        <p
                            className="
                                text-sm
                                text-gray-300
                                mt-2
                            "
                        >
                            ✓ Solved
                        </p>

                    </div>

                </div>

            </div>

            {/* Right Side */}
            <div
                className="
        relative
        z-10
        grid
        grid-cols-2
        sm:grid-cols-3
        gap-3

        w-full
        lg:w-[350px]
    "
            >

                {topics.map((topic, index) => (

                    <div
                        key={index}
                        className="
                rounded-2xl
                bg-white/10
                
                px-3
                py-3
                flex
                
                flex-col
                items-center
                justify-center
                text-center
                h-[60px]
            "
                    >

                        <h2
                            className={`
                    text-xs
                    font-bold
                    mb-1
                    leading-tight
                    text-green-500
                `}
                        >
                            {topic.name}
                        </h2>

                        <p
                            className="
                    text-xs
                    font-semibold
                    text-white
                "
                        >
                            {topic.solved}

                            <span
                                className="
                        text-gray-400
                        text-xs
                    "
                            >
                                /{topic.total}
                            </span>

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default OverallProgress;
