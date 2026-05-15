import {
    ArrowRight,
} from "lucide-react";

function Badges() {

    const badges = [
        {
            days: "7",
            color: "from-lime-300 to-green-500",
        },
        {
            days: "30",
            color: "from-cyan-300 to-blue-600",
        },
        {
            days: "100",
            color: "from-sky-300 to-blue-400",
        },
    ];

    return (

        <div
            className="
                relative
                w-full
                overflow-hidden
                p-5
            "
        >



            {/* Header */}
            <div
                className="
                    flex
                    items-start
                    justify-between
                    relative
                    z-10
                "
            >

                <div>

                    <p
                        className="
                            text-gray-400
                            text-md
                            font-light
                        "
                    >
                        Badges
                    </p>

                    <h1
                        className="
                            text-lg
                            font-bold
                            text-white
                            mt-2
                        "
                    >
                        4
                    </h1>

                </div>

                {/* Arrow */}
                <button
                    className="
                        w-10
                        h-10
                        
                        flex
                        items-center
                        justify-center
                    "
                >

                    <ArrowRight
                        size={30}
                        className="text-gray-300"
                    />

                </button>

            </div>

            {/* Badges */}
            <div
                className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    sm:gap-8
                    xl:gap-12
                    mt-3
                    relative
                    z-10
                    flex-wrap
                "
            >

                {badges.map((badge, index) => (

                    <div
                        key={index}
                        className="
                            relative
                            w-[80px]
                            h-[80px]
                            flex
                            items-center
                            justify-center
                        "
                    >

                        {/* Outer Hexagon */}
                        <div
                            className="
                                absolute
                                inset-0
                                clip-path-hexagon
                                bg-white/10
                                border
                                border-white/10
                                backdrop-blur-xl
                            "
                            style={{
                                clipPath:
                                    "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)"
                            }}
                        />

                        {/* Inner Circle */}
                        <div
                            className={`
                                w-[72px]
                                h-[72px]
                                rounded-full
                                bg-gradient-to-br
                                ${badge.color}
                                shadow-[0_0_25px_rgba(255,255,255,0.2)]
                                flex
                                flex-col
                                items-center
                                justify-center
                                border
                                border-white/20
                            `}
                        >

                            <span
                                className="
                                    text-[11px]
                                    font-medium
                                    text-black/70
                                "
                            >
                                DAYS
                            </span>

                            <span
                                className="
                                    text-2xl
                                    font-bold
                                    text-black/80
                                "
                            >
                                {badge.days}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

            {/* Footer */}
            <div
                className="
                    mt-2
                    relative
                    z-10
                "
            >

                <p
                    className="
                        text-gray-400
                        text-sm
                        font-medium
                    "
                >
                    Most Recent Badge
                </p>

                <h2
                    className="
                        text-md
                        font-medium
                        text-white
                        mt-3
                    "
                >
                    100 Days Badge 2026
                </h2>

            </div>

        </div>

    );

}

export default Badges;
