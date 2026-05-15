import {
    Play,
    Flame,
    Trophy,
} from "lucide-react";

function RightTips() {

    const runs = [
        {
            icon: Play,
            text: "Start solving your first DSA question today.",
        },
        {
            icon: Flame,
            text: "Maintain your daily coding streak consistently.",
        },
        {
            icon: Trophy,
            text: "Complete challenges and unlock achievements.",
        }
    ];

    return (

        <div
            className="
                relative
                w-[94%]
                rounded-3xl
                border
                border-white/10
                bg-white
                dark:bg-neutral-900
                p-6
                overflow-hidden
            "
        >



            {/* Heading */}
            <div className="relative z-10 mb-6">

                <h2
                    className="
                        text-xl
                        font-semibold
                        text-black
                        dark:text-white
                    "
                >
                    Run Your Ads
                </h2>



            </div>

            {/* Content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    gap-3
                "
            >


                {/* CTA Button */}
                <button
                    className="
                        mt-2
                        w-full
                        rounded-2xl
                        bg-[#F46717]
                        py-3
                        text-md
                        font-medium
                        text-white
                        transition-all
                        duration-300
                        hover:scale-[1.02]
                        cursor-pointer
                    "
                >
                    Run Your Ad
                </button>

            </div>
        </div>

    );

}

export default RightTips;
