// RightSection.jsx

function RightSection() {
    return (
        <div className="flex-1 relative min-h-[340px] sm:min-h-[460px] lg:h-[680px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-8 rounded-full  blur-[90px] animate-gentle-pulse" />
            <img
                src="/heroimage.png"
                alt="hero"
                className="relative z-10 w-full max-w-[620px] h-auto object-contain drop-shadow-[0_30px_70px_rgba(244,103,23,0.12)]"
            />
        </div>
    );
}

export default RightSection;
