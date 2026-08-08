import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingNavbar from "../features/landing/landingnavbar";
import HeroSection from "../features/landing/herosection";
import Features from "../features/landing/feature";
import Contribute from "../features/landing/contribute";
import FAQ from "../features/landing/Components/FAQ";
import Footer from "../features/landing/footer";
import Login from "../auth/Login";

function LandingPage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard", { replace: true });
        }
    }, [loading, user, navigate]);

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            {/* Accessibility: skip to content */}
            <a href="#main" className="lc-skip-link">
                Skip to content
            </a>

            {/* Fixed film grain — pointer-events-none, GPU-safe */}
            <div className="lc-grain" aria-hidden="true" />

            {/* Floating glass navbar */}
            <LandingNavbar onLoginClick={() => setIsLoginOpen(true)} />

            <main id="main">
                {/* Hero */}
                <HeroSection onLoginClick={() => setIsLoginOpen(true)} />

                {/* Features */}
                <Features />

                {/* Contribute / Open Source */}
                <Contribute />

                {/* FAQ */}
                <FAQ />


                {/* Footer */}
                <Footer />
            </main>

            {/* Login Modal */}
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </div>
    );
}

export default LandingPage;