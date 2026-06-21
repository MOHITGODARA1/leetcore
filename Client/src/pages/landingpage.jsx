import { useState } from "react";
import LandingNavbar from "../features/landing/landingnavbar";
import HeroSection from "../features/landing/herosection";
import Features from "../features/landing/feature";
import Feedback from "../features/landing/feedback";
import AboutCreator from "../features/landing/aboutcreator";
import Footer from "../features/landing/footer";
import Login from "../auth/Login";

function LandingPage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <div className=" min-h-screen">
                {/* Navbar with padding */}
                <div className="h-16 px-4 sm:px-6 lg:px-10 py-3">
                    <LandingNavbar onLoginClick={() => setIsLoginOpen(true)} />
                </div>

                {/* Hero */}
                <HeroSection onLoginClick={() => setIsLoginOpen(true)} />
                {/* Features */}
                <Features />
                {/* Feedback */}
                <Feedback />
                {/* About Creator */}
                <AboutCreator />
                {/* Footer */}
                <Footer />
            </div>

            {/* Login Modal */}
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    )
}
export default LandingPage;
