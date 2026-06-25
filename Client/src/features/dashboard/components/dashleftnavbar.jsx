import {
    Home,
    Brain,
    Trophy,
    User,
    LogOut,
    Flag,
    MessageSquare,
    HeartHandshake,
    ChevronRight,

} from "lucide-react";
import logo from "../../../assets/Icons/Prefixlogo.png"
import {
    useState,
    useEffect,
    useRef,
} from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

function DashLeftNavBar() {

    const { user, logout } = useAuth();

    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef(null);

    const { pathname } = useLocation();

    const displayName = user?.name || user?.username || "User";
    const displayEmail = user?.email || "No email added";

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    const navItems = [
        {
            name: "Home",
            icon: Home,
            to: "/dashboard",
        },
        {
            name: "OA",
            icon: Brain,
            to: "/dashboard/online-assessment",
        },
        {
            name: "Contest",
            icon: Trophy,
            to: "/dashboard/contest",
        },
    ];

    return (

        <div
            className="
                h-full
                rounded-2xl
                w-full
                md:w-[85px]
                bg-[#111113]/88
                border
                border-white/10
                flex
                flex-row
                md:flex-col
                items-center
                justify-between
                px-3
                py-3
                md:px-0
                md:py-6
                relative
                shadow-[0_16px_48px_rgba(0,0,0,0.18)]
            "
        >

            {/* Top Section */}
            <div className="flex md:flex-col items-center w-auto md:w-full">

                {/* Logo */}
                <Link to="/dashboard" className="mr-3 md:mr-0 md:mb-8 shrink-0">

                    <div
                        className="
                            w-9
                            h-9
                            rounded-2xl
                            bg-[#111]
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <img
                            src={logo}
                            alt="logo"
                        />
                    </div>

                </Link>

                {/* Divider */}
                <div
                    className="
                        hidden
                        md:block
                        w-10
                        h-[1px]
                        bg-white/10
                        mb-8
                    "
                />

                {/* Navigation */}
                <div className="flex md:flex-col items-center gap-1.5 sm:gap-2 md:gap-7 overflow-x-auto md:overflow-visible scrollbar-hide max-w-full">

                    {navItems.map((item, index) => {

                        const Icon = item.icon;
                        const isActive = pathname === item.to;

                        return (

                            <Link
                                to={item.to}
                                key={index}
                                className={`
                                    relative
                                    min-w-[54px]
                                    w-[54px]
                                    h-[54px]
                                    md:w-[60px]
                                    md:h-[63px]
                                    rounded-xl
                                    md:rounded-2xl
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-1
                                    md:gap-2
                                    transition-all
                                    duration-300
                                    active:scale-[0.97]

                                    ${isActive
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

                                {/* Active Line */}
                                {isActive && (
                                    <div
                                        className="
                                            absolute
                                            left-2
                                            right-2
                                            bottom-0
                                            h-[3px]
                                            md:left-0
                                            md:right-auto
                                            md:top-0
                                            md:h-full
                                            md:w-[3px]
                                            bg-[#F46717]
                                            rounded-full
                                        "
                                    />
                                )}

                                <Icon
                                    size={20}
                                    className={
                                        isActive
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

                            </Link>

                        );

                    })}

                </div>

            </div>

            {/* Profile Section */}
            <div
                className="relative flex-shrink-0"
                ref={menuRef}
            >

                {/* Avatar Button */}
                <button
                    onClick={() =>
                        setShowMenu(!showMenu)
                    }
                    className="
                        w-12
                        h-12
                        rounded-full
                        bg-[#3A3A45]
                        flex
                        items-center
                        justify-center
                        border
                        cursor-pointer
                        border-white/10
                        hover:scale-105
                        transition-all
                        overflow-hidden
                        active:scale-95
                    "
                >

                    {
                        user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="
                                    w-full
                                    h-full
                                    object-cover
                                "
                            />
                        ) : (
                            <User
                                size={28}
                                className="text-gray-300"
                            />
                        )
                    }

                </button>

                {
                    showMenu && (
                        <div
                            className="
                absolute
                right-0
                bottom-16
                md:top-auto
                md:bottom-0
                md:left-[72px]
                md:right-auto
                w-[min(calc(100vw-24px),280px)]
                rounded-[14px]
                bg-[#121214]/95
                border
                border-white/[0.12]
                shadow-[0_24px_80px_rgba(0,0,0,0.62)]
                z-50
                overflow-hidden
                backdrop-blur-xl
            "
                        >
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    bg-[radial-gradient(circle_at_28%_18%,rgba(244,103,23,0.14),transparent_34%),radial-gradient(circle_at_55%_55%,rgba(255,255,255,0.08),transparent_20%)]
                                "
                            />

                            <div className="relative">
                                <div className="flex items-center gap-4 px-5 py-5 border-b border-white/10">
                                    <div
                                        className="
                                            w-9
                                            h-9
                                            rounded-full
                                            bg-[#4A4A56]
                                            border-[3px]
                                            border-white/10
                                            flex
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            shrink-0
                                        "
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={displayName}
                                                className="w-10 h-10 object-cover"
                                            />
                                        ) : (
                                            <User size={28} className="text-gray-200" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-md font-semibold text-white truncate">
                                            {displayName}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {displayEmail}
                                        </p>
                                    </div>
                                </div>

                                <div className="py-3">
                                    <Link
                                        to="/dashboard/profile"
                                        onClick={() => setShowMenu(false)}
                                        className="
                                            group
                                            w-full
                                            flex
                                            items-center
                                            gap-4
                                            px-6
                                            py-2
                                            text-[14px]
                                            font-medium
                                            text-white
                                            hover:bg-white/[0.06]
                                            transition-colors
                                        "
                                    >
                                        <User size={20} className="text-gray-300 group-hover:text-white" />
                                        <span className="flex-1">My Profile</span>
                                    </Link>

                                    <Link
                                        to="/dashboard/feedback"
                                        onClick={() => setShowMenu(false)}
                                        className="
                                            group
                                            w-full
                                            flex
                                            items-center
                                            gap-4
                                            px-6
                                            py-2
                                            text-[14px]
                                            font-medium
                                            text-white
                                            hover:bg-white/[0.06]
                                            transition-colors
                                        "
                                    >
                                        <MessageSquare size={20} className="text-gray-300 group-hover:text-white" />
                                        <span className="flex-1">Feedback</span>
                                    </Link>

                                    <Link
                                        to="/dashboard/reportbug"
                                        onClick={() => setShowMenu(false)}
                                        className="
                                            group
                                            w-full
                                            flex
                                            items-center
                                            gap-4
                                            px-6
                                            py-2
                                            text-[14px]
                                            font-medium
                                            text-white
                                            hover:bg-white/[0.06]
                                            transition-colors
                                        "
                                    >
                                        <Flag size={20} className="text-gray-300 group-hover:text-white" />
                                        <span className="flex-1">Bug Report</span>
                                    </Link>

                                    <Link
                                        to="/dashboard/become-sponsor"
                                        onClick={() => setShowMenu(false)}
                                        className="
                                            group
                                            w-full
                                            flex
                                            items-center
                                            gap-4
                                            px-6
                                            py-2
                                            text-[14px]
                                            font-medium
                                            text-white
                                            hover:bg-white/[0.06]
                                            transition-colors
                                        "
                                    >
                                        <HeartHandshake size={20} className="text-gray-300 group-hover:text-white" />
                                        <span className="flex-1">Become Sponsor</span>
                                        <ChevronRight size={19} className="text-gray-500 group-hover:text-gray-300" />
                                    </Link>
                                </div>

                                <div className="border-t border-white/10 p-3">
                                    <button
                                        onClick={logout}
                                        className="
                                            w-full
                                            flex
                                            items-center
                                            gap-4
                                            rounded-xl
                                            px-3
                                            py-1
                                            text-[14px]
                                            font-medium
                                            text-red-400
                                            hover:bg-red-500/10
                                            transition-colors
                                        "
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    )
                }

            </div>

        </div>

    );

}

export default DashLeftNavBar;
