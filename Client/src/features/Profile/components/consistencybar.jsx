function ConsistencyBar() {

    const months = [
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec",
        "Jan", "Feb", "Mar", "Apr", "May"
    ];

    const getActivity = (monthIndex, dayIndex) => {
        const levels = [
            "bg-white/10",
            "bg-green-900",
            "bg-green-700",
            "bg-green-500",
            "bg-green-300",
        ];

        return levels[(monthIndex * 7 + dayIndex * 3) % levels.length];
    };

    return (

        <div
            className="
                w-full
                rounded-xl
                bg-[#1F1F22]
                border
                border-white/5
                p-6
                overflow-hidden
                relative
                min-h-[220px]
            "
        >



            {/* Header */}
            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    gap-4
                    items-center
                    justify-between
                    mb-5
                    relative
                    z-10
                "
            >

                {/* Left */}
                <div>

                    <h1
                        className="
                            text-md
                            font-semibold
                            text-white
                        "
                    >
                        893
                        <span
                            className="
                                text-gray-400
                                font-light
                                text-sm
                                ml-2
                            "
                        >
                            submissions in the past one year
                        </span>
                    </h1>

                </div>

                {/* Right Stats */}
                <div
                    className="
                        flex
                        items-center
                        gap-10
                        flex-wrap
                        text-gray-400
                        text-sm
                        font-light
                    "
                >

                    <p>
                        Total active days:
                        <span className="text-white font-semibold ml-2">
                            193
                        </span>
                    </p>

                    <p>
                        Max streak:
                        <span className="text-white font-semibold ml-2">
                            85
                        </span>
                    </p>


                </div>

            </div>

            {/* Heatmap */}
            <div
                className="
                    flex
                    gap-6
                    overflow-x-auto
                    relative
                    z-10
                "
            >

                {months.map((month, monthIndex) => (

                    <div
                        key={monthIndex}
                        className="
                            flex
                            flex-col
                            items-center
                            gap-3
                            flex-shrink-0
                        "
                    >

                        {/* Grid */}
                        <div
                            className="
                                grid
                                grid-cols-4
                                gap-[5px]
                            "
                        >

                            {[...Array(28)].map((_, index) => (

                                <div
                                    key={index}
                                    className={`
                                        w-3
                                        h-3
                                        rounded-[2px]
                                        ${getActivity(monthIndex, index)}
                                    `}
                                />

                            ))}

                        </div>

                        {/* Month */}
                        <p
                            className="
                                text-gray-400
                                text-sm
                                font-medium
                            "
                        >
                            {month}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default ConsistencyBar;
