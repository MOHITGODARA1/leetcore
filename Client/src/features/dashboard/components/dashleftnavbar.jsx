import {
    Home,
    Brain,
    Trophy,
    User,
    LogOut,
    Flag,
    MessageSquare,
    HeartHandshake

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
                bg-white/8
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
            "
        >

            {/* Top Section */}
            <div className="flex md:flex-col items-center w-auto md:w-full">

                {/* Logo */}
                <Link to="/dashboard" className="mr-4 md:mr-0 md:mb-8">

                    <div
                        className="
                            w-8
                            h-8
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
                <div className="flex md:flex-col items-center gap-2 md:gap-7">

                    {navItems.map((item, index) => {

                        const Icon = item.icon;
                        const isActive = pathname === item.to;

                        return (

                            <Link
                                to={item.to}
                                key={index}
                                className={`
                                    relative
                                    w-[56px]
                                    h-[56px]
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
                        transition
                        overflow-hidden
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

                {/* Dropdown Menu */}
                {/* Dropdown Menu */}
                {
                    showMenu && (
                        <div
                            className="
                absolute
                right-0
                top-14
                md:top-auto
                md:bottom-16
                md:left-14
                md:right-auto
                w-52
                rounded-2xl
                bg-[#161616]
                border
                border-white/10
                shadow-2xl
                z-50
                overflow-hidden
                backdrop-blur-xl
            "
                        >

                            {/* Profile */}
                            <Link
                                to="/dashboard/profile"
                                className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    text-white
                    hover:bg-white/5
                    transition
                "
                            >
                                <User size={18} />
                                Profile
                            </Link>

                            {/* Feedback */}
                            <Link
                                to="/dashboard/feedback"
                                className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    text-white
                    hover:bg-white/5
                    transition
                "
                            >
                                <MessageSquare size={18} />
                                Feedback
                            </Link>

                            {/* Report Bug */}
                            <Link
                                to="/dashboard/reportbug"
                                className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    text-white
                    hover:bg-white/5
                    transition
                "
                            >
                                <Flag size={18} />
                                Report Bug
                            </Link>

                            {/* Become Sponsor */}
                            <Link
                                to="/dashboard/become-sponsor"
                                className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    text-white
                    hover:bg-white/5
                    transition
                "
                            >
                                <HeartHandshake size={18} />
                                Become Sponsor
                            </Link>

                            {/* Divider */}
                            <div className="h-[1px] bg-white/10" />

                            {/* Logout */}
                            <button
                                onClick={logout}
                                className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    text-red-400
                    hover:bg-red-500/10
                    transition
                "
                            >
                                <LogOut size={18} />
                                Logout
                            </button>

                        </div>
                    )
                }

            </div>

        </div>

    );

}

export default DashLeftNavBar;
