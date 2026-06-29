import {
    Brain,
    LaptopMinimalCheck,
    BarChart3,
    Network,
    Boxes
} from "lucide-react";
import HorizontalCarousel from "../common/HorizontalCarousel";

function Dashmainnavbar() {
    const categories = [
        {
            title: "DSA",
            targetId: "dsa",
            icon: <Brain size={38} strokeWidth={2.5} />,
            bg: "bg-[#cf8a75]",
        },
        {
            title: "OS",
            targetId: "operating-system",
            icon: <LaptopMinimalCheck size={38} strokeWidth={2.5} />,
            bg: "bg-[#bca878]",
        },
        {
            title: "CN",
            targetId: "computer-networks",
            icon: <BarChart3 size={38} strokeWidth={2.5} />,
            bg: "bg-[#95c592]",
        },
        {
            title: "DBMS",
            targetId: "database-management-system",
            icon: <Network size={38} strokeWidth={2.5} />,
            bg: "bg-[#74c6d0]",
        },
        {
            title: "OOPs",
            targetId: "object-oriented-programming",
            icon: <Boxes size={38} strokeWidth={2.5} />,
            bg: "bg-[#84d8d8]",
        },
    ];

    const scrollToCategory = (targetId) => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full text-white py-4 pb-2">
            {/* Heading */}
            <h1 className="text-xl mb-3 font-semibold tracking-wide px-8">
                Categories
            </h1>

            {/* Cards Slider */}
            <HorizontalCarousel className="py-2 -my-2 select-none">
                {categories.map((item, index) => (
                    <button
                        type="button"
                        onClick={() => scrollToCategory(item.targetId)}
                        key={index}
                        className="
                            min-w-[138px]
                            sm:min-w-[150px]
                            h-[136px]
                            sm:h-[140px]
                            bg-white/[0.045]
                            border
                            border-white/10
                            rounded-2xl
                            flex
                            flex-col
                            items-center
                            justify-center
                            lc-interactive
                            cursor-pointer
                            flex-shrink-0
                        "
                    >
                        {/* Top Capsule */}
                        <div
                            className={`
                                ${item.bg}
                                w-[88%]
                                h-[78px]
                                sm:h-[80px]
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                text-white
                                mb-2
                            `}
                        >
                            {item.icon}
                        </div>

                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-semibold tracking-wide mt-2">
                            {item.title}
                        </h2>
                    </button>
                ))}
            </HorizontalCarousel>
        </div>
    );
}

export default Dashmainnavbar;
