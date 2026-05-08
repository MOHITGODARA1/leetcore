import {
    Home,
    Brain,
    Trophy,
    User,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext"
function DashLeftNavBar() {
    const { user } = useAuth();

    const navItems = [
        {
            name: "Home",
            icon: Home,
            active: true,
        },
        {
            name: "OA",
            icon: Brain,
            active: false,
        },
        {
            name: "Contest",
            icon: Trophy,
            active: false,
        },
    ];

    return (

        <div
            className="
                h-full
                rounded-2xl
                ml-[0.2vw]
                w-[85px]
                bg-white/8
                border-r
                border-white/10
                flex
                flex-col
                items-center
                justify-between
                py-6
            "
        >

            {/* Top Section */}
            <div className="flex flex-col items-center w-full">

                {/* Logo */}
                <div className="mb-8">

                    {/* Replace later with your logo */}
                    <div
                        className="
                            w-8
                            h-8
                            rounded-2xl
                            bg-[#111]
                            flex
                            items-center
                            justify-center
                            text-white
                            text-2xl
                            font-bold
                        "
                    >
                        <img src="./Prefixlogo.png" alt="" />
                    </div>

                </div>

                {/* Divider */}
                <div
                    className="
                        w-10
                        h-[1px]
                        bg-white/10
                        mb-8
                    "
                />

                {/* Navigation */}
                <div className="flex flex-col items-center gap-7">

                    {navItems.map((item, index) => {

                        const Icon = item.icon;

                        return (

                            <button
                                key={index}
                                className={`
                                    relative
                                    w-[60px]
                                    h-[63px]
                                    rounded-2xl
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-2
                                    transition-all
                                    duration-300

                                    ${item.active
                                        ? `
                                            bg-[#111]
                                            
                                            text-white
                                            
                                          `
                                        : `
                                            text-gray-400
                                            hover:text-white
                                            hover:bg-white/5
                                          `
                                    }
                                `}
                            >

                                {/* Active Glow Line */}
                                {item.active && (
                                    <div
                                        className="
                                            absolute
                                            left-0
                                            top-0
                                            h-full
                                            w-[3px]
                                            bg-[#F46717]
                                            rounded-full
                                        "
                                    />
                                )}

                                <Icon
                                    size={20}
                                    className={
                                        item.active
                                            ? "text-white"
                                            : "text-white/70"
                                    }
                                />

                                <span
                                    className="
                                        text-[10px]
                                        font-medium
                                    "
                                >
                                    {item.name}
                                </span>

                            </button>

                        );

                    })}

                </div>

            </div>

            {/* Bottom Profile */}
            <button
                className="
                    w-12
                    h-12
                    rounded-full
                    bg-[#3A3A45]
                    flex
                    items-center
                    justify-center
                    border
                    border-white/10
                    hover:scale-105
                    transition
                "
            >
                {
                    user.avatar ? (
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <User
                            size={28}
                            className="text-gray-300"
                        />
                    )
                }

            </button>

        </div>

    );

}

export default DashLeftNavBar;