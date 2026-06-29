import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalCarousel({
    children,
    className = "",
    gapClass = "gap-6",
    gradientColor = "from-[#070709]"
}) {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 5);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            el.addEventListener("scroll", checkScroll);
            window.addEventListener("resize", checkScroll);
            
            // Check immediately and on loaded styles
            checkScroll();
            const timer1 = setTimeout(checkScroll, 100);
            const timer2 = setTimeout(checkScroll, 400);
            
            return () => {
                el.removeEventListener("scroll", checkScroll);
                window.removeEventListener("resize", checkScroll);
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [children]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            // Scroll by one screen width minus padding, or a standard 360px block
            const amount = direction === "left" ? -400 : 400;
            scrollContainerRef.current.scrollBy({
                left: amount,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="relative group/carousel w-full">
            {/* Left Edge Gradient Fade */}
            <div 
                className={`
                    absolute left-0 top-0 bottom-0 w-12 
                    bg-gradient-to-r ${gradientColor} via-transparent to-transparent 
                    pointer-events-none z-10 transition-opacity duration-300 
                    ${showLeftArrow ? "opacity-100" : "opacity-0"}
                `} 
            />

            {/* Right Edge Gradient Fade */}
            <div 
                className={`
                    absolute right-0 top-0 bottom-0 w-12 
                    bg-gradient-to-l ${gradientColor} via-transparent to-transparent 
                    pointer-events-none z-10 transition-opacity duration-300 
                    ${showRightArrow ? "opacity-100" : "opacity-0"}
                `} 
            />

            {/* Left Arrow Button */}
            <button
                type="button"
                onClick={() => scroll("left")}
                className={`
                    absolute left-3 top-1/2 -translate-y-1/2 z-20 
                    w-11 h-11 rounded-full 
                    bg-black/60 border border-white/10 
                    flex items-center justify-center 
                    text-white/80 hover:text-white 
                    hover:bg-[#f46717] hover:border-[#f46717]/40 hover:scale-105 
                    transition-all duration-300 shadow-2xl backdrop-blur-md 
                    cursor-pointer active:scale-95
                    ${showLeftArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                aria-label="Scroll left"
            >
                <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            {/* Right Arrow Button */}
            <button
                type="button"
                onClick={() => scroll("right")}
                className={`
                    absolute right-3 top-1/2 -translate-y-1/2 z-20 
                    w-11 h-11 rounded-full 
                    bg-black/60 border border-white/10 
                    flex items-center justify-center 
                    text-white/80 hover:text-white 
                    hover:bg-[#f46717] hover:border-[#f46717]/40 hover:scale-105 
                    transition-all duration-300 shadow-2xl backdrop-blur-md 
                    cursor-pointer active:scale-95
                    ${showRightArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                aria-label="Scroll right"
            >
                <ChevronRight size={22} strokeWidth={2.5} />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className={`
                    flex ${gapClass} 
                    overflow-x-auto overflow-y-hidden 
                    scroll-smooth scrollbar-hide
                    px-8 py-4 -my-4
                    ${className}
                `}
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch"
                }}
            >
                {children}
            </div>
        </div>
    );
}
