import {
    Flame,
    Trophy,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";

function Motivation() {

    return (

        <div
            className="
                w-[96%]
                rounded-3xl
                border
                border-white/10
                bg-[#111114]
                p-6
                text-white
                overflow-hidden
                relative
                backdrop-blur-2xl
            "
        >

            {/* Soft Pink Glow */}
            <div
                className="
                    absolute
                    top-[-80px]
                    right-[-40px]
                    w-[240px]
                    h-[240px]
                    rounded-full
                    bg-pink-400/10
                    blur-[120px]
                    pointer-events-none
                "
            />

            {/* Soft Orange Glow */}
            <div
                className="
                    absolute
                    bottom-[-70px]
                    left-[-50px]
                    w-[220px]
                    h-[220px]
                    rounded-full
                    bg-orange-400/10
                    blur-[110px]
                    pointer-events-none
                "
            />

            {/* Purple Accent Glow */}
            <div
                className="
                    absolute
                    top-[35%]
                    left-[40%]
                    w-[120px]
                    h-[120px]
                    rounded-full
                    bg-violet-400/10
                    blur-[80px]
                    pointer-events-none
                "
            />

            {/* Soft Gradient Overlay */}
            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-pink-500/[0.03]
                    via-transparent
                    to-orange-400/[0.03]
                    pointer-events-none
                "
            />

            {/* Floating Glass Circle */}
            <div
                className="
                    absolute
                    top-5
                    right-8
                    w-24
                    h-24
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.03]
                    backdrop-blur-3xl
                "
            />

            {/* Small Floating Blur */}
            <div
                className="
                    absolute
                    bottom-7
                    right-16
                    w-8
                    h-8
                    rounded-full
                    bg-orange-300/20
                    blur-md
                "
            />

            {/* Grid Texture */}
            <div
                className="
                    absolute
                    inset-0
                    opacity-[0.02]
                    bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    bg-[size:32px_32px]
                "
            />

            {/* Content */}
            <div
                className="
                    relative
                    z-10
                "
            >

                {/* Top Label */}


                {/* Quote Section */}
                <div
                    className="
                        relative
                    "
                >

                    {/* Large Quote */}
                    <div
                        className="
                            absolute
                            -top-7
                            -left-1
                            text-8xl
                            font-bold
                            text-white/[0.04]
                            select-none
                        "
                    >
                        "
                    </div>

                    <p
                        className="
                            relative
                            z-10
                            text-[14px]
                            sm:text-md
                            leading-relaxed
                            text-gray-100
                            font-medium
                        "
                    >
                        Dekh la bhai aaj question nahi kiya to maa ki sogan lag ja gi bhai... abhi check kar raha hu.
                    </p>

                </div>

            </div>

        </div>

    );

}

export default Motivation;