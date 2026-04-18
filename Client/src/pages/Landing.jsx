import Navbar from "../Components/navbar";
import HeroLeft from "../Features/landingpage/HeroSection";
import HeroGraph from "../Features/landingpage/Graph";
import Recommendations from "../Features/landingpage/recomendation";
import TrustedBy from "../Features/landingpage/trusted";
import BecomeSponsor from "../Features/landingpage/Sponser";
import Footer from "../Components/Footer";
function Landing() {
    return (
        <div className="min-h-screen bg-[#111318] overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-[70px]">

                {/* Background glow */}
                <div className="fixed inset-0 pointer-events-none z-0
          bg-[radial-gradient(ellipse_80%_60%_at_75%_50%,rgba(232,197,71,0.06)_0%,transparent_60%),
               radial-gradient(ellipse_60%_50%_at_15%_80%,rgba(201,240,105,0.04)_0%,transparent_55%)]"
                />

                {/* Dot grid */}
                <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] 
          bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] 
          bg-[length:40px_40px]"
                />

                {/* 🔥 MAIN LAYOUT FIX */}
                <div className="relative z-10 w-full px-6 lg:px-20 
          grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] 
          items-center min-h-[calc(100vh-70px)]"
                >

                    {/* LEFT TEXT */}
                    <div className="max-w-[520px]">
                        <HeroLeft />
                    </div>

                    {/* RIGHT GRAPH (DOMINANT) */}
                    <div className="relative flex justify-center items-center 
            translate-x-4 lg:translate-x-16 xl:translate-x-24"
                    >
                        {/* depth wrapper */}
                        <div className="perspective-[1200px]">
                            <div className="transform rotate-x-[6deg] rotate-y-[-6deg]">
                                <HeroGraph />
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {/* Recommendations Section */}
            <Recommendations />
            <TrustedBy />
            <BecomeSponsor />
            <Footer />
        </div>
    );
}

export default Landing;