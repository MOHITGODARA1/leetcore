function ContentNavbar({ active, setActive }) {
    const navItems = [
        { id: "doc", label: "Documentation" },
        { id: "video", label: "Video" },
        { id: "practice", label: "Practice" },
        { id: "discussion", label: "Discussion" },
    ];

    return (
        <div className="w-full px-4 sm:px-6 lg:px-16 pt-4 sticky top-[70px] z-40 backdrop-blur-md bg-[#0d0f11]">

            {/* Scrollable container */}
            <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 h-12 overflow-x-auto scrollbar-hide">

                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`relative text-xs sm:text-sm tracking-wider whitespace-nowrap flex-shrink-0 h-full flex items-center transition-all duration-300
                        ${active === item.id
                                ? "text-white font-medium"
                                : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {item.label}

                        {/* Active underline */}
                        {active === item.id && (
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FACC15]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom border */}
            <div className="border-b border-gray-600 w-full mt-1"></div>
        </div>
    );
}

export default ContentNavbar;