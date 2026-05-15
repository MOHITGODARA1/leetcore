import {
    Brain,
    LaptopMinimalCheck,
    BarChart3,
    Network,
    Boxes
} from "lucide-react";

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
        <div className="w-full text-white p-6">

            {/* Heading */}
            <h1 className="text-xl mb-6 font-semibold font-monospace tracking-wide">
                Categories
            </h1>

            {/* Cards */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                {categories.map((item, index) => (
                    <div
                        onClick={() => scrollToCategory(item.targetId)}
                        key={index}
                        className="
              min-w-[170px]
              h-[150px]
              bg-white/9
              border
              border-white/9
              rounded-[40px]
              flex
              flex-col
              items-center
              justify-center
              shadow-lg
              transition-all
              duration-300
              
              cursor-pointer
            "
                    >
                        {/* Top Capsule */}
                        <div
                            className={`
                ${item.bg}
                w-[90%]
                h-[90px]
                rounded-[40px]
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
                        <h2 className="text-lg tracking-wide mt-2">
                            {item.title}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashmainnavbar;
