function ContentNavbar({ active, setActive }) {

    const navItems = [
        { id: "doc", label: "Documentation" },
        { id: "video", label: "Video" },
        { id: "practice", label: "Practice" },
        { id: "discussion", label: "Discussion" },
    ];

    return (
        <div className="w-full px-8 lg:px-16 pt-5 pb-0 sticky top-[70px] z-40 backdrop-blur-md bg-[#0d0f11]">
            <div className="flex items-center gap-10 h-12">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`relative text-sm tracking-wider cursor-pointer transition-all duration-300 h-full flex items-center
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
            <div className="border-b border-gray-600 w-full mt-1"></div>
        </div>
    );
}

export default ContentNavbar;