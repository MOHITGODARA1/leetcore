import {
    Lightbulb,
    ArrowUpRight,
    CheckCircle2,
    Brain,
    Clock3,
} from "lucide-react";

function RightTips() {

    const tips = [
        {
            icon: Brain,
            title: "Solve Smart",
            description:
                "Focus on understanding patterns instead of memorizing solutions.",
        },
        {
            icon: Clock3,
            title: "Consistency Wins",
            description:
                "Even 2 quality problems daily beats random 10-hour grinding.",
        },
        {
            icon: CheckCircle2,
            title: "Revise Questions",
            description:
                "Re-solving previous problems improves retention much faster.",
        },
        {
            icon: CheckCircle2,
            title: "Revise Questions",
            description:
                "Re-solving previous problems improves retention much faster.",
        },
    ];

    return (

        <div
            className="
                relative
                w-[96%]
                rounded-3xl
                border
                border-white/10
                bg-white dark:bg-neutral-900
                p-6
                overflow-hidden
                text-white
                
            "
        >

            {/* Background Glow */}


            {/* Grid Texture */}
            <div
                className="
                    absolute
                    inset-0
                    opacity-[0.03]
                    bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    bg-[size:28px_28px]
                "
            />



            {/* Tips */}
            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    gap-4
                "
            >

                {tips.map((tip, index) => {

                    const Icon = tip.icon;

                    return (

                        <div
                            key={index}
                            className="
                                group
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-4
                                "
                            >




                                {/* Text */}
                                <div>

                                    <p
                                        className="
                                            text-sm
                                            text-white
                                            leading-relaxed
                                        "
                                    >
                                        {index + 1}. {tip.description}
                                    </p>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}

export default RightTips;