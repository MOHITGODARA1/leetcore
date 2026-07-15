// LandingNavbar.jsx

function LandingNavbar({ onLoginClick }) {
    const navItems = [
        { name: "Features", href: "#features" },
        { name: "Feedback", href: "#feedback" },
        { name: "Creators", href: "#creators" },
        { name: "GitHub", href: "#github" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-10 py-4">
            <div className="max-w-7xl mx-auto">

                <div className="h-20 flex items-center justify-between rounded-2xl  px-8">

                    {/* Logo */}
                    <a
                        href="/"
                        className="flex items-center gap-3 shrink-0"
                    >
                        <img
                            src="https://res.cloudinary.com/dznwqaqjw/image/upload/v1783667749/ChatGPT_Image_Jul_10_2026_12_45_19_PM_xoj6ah.png"
                            alt="Leetcore Logo"
                            className="h-12 w-12 object-contain"
                        />

                        <span className="text-2xl font-bold tracking-tight text-white">
                            Leetcore
                        </span>
                    </a>

                    {/* Navigation */}
                    <ul className="hidden lg:flex items-center gap-10">

                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className="relative text-[15px] font-medium text-gray-300 transition-all duration-300 hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-orange-400 after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}

                    </ul>

                    {/* Sign In */}
                    <button
                        onClick={onLoginClick}
                        className="h-11 rounded-full cursor-pointer bg-white px-7 font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        Sign In
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default LandingNavbar;