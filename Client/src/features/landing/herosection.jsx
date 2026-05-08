// HeroSection.jsx
import LeftSection from "./Components/lefthero";
import RightSection from "./Components/righthero";


function HeroSection({ onLoginClick }) {
    return (
        <section className="w-full min-h-[calc(100vh-64px)] bg-transparent overflow-hidden relative">


            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-14 pb-20 lg:pt-20 lg:pb-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10 relative z-10">

                {/* Left */}
                <LeftSection onLoginClick={onLoginClick} />

                {/* Right */}
                <RightSection />
            </div>
        </section>
    );
}

export default HeroSection;
