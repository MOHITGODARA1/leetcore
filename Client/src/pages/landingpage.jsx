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
    const [authError, setAuthError] = useState(() => (
        new URLSearchParams(window.location.search).get("auth_error")
            ? "GitHub sign-in could not finish. Please try again in a moment."
            : ""
    ));
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("auth_error")) {
            params.delete("auth_error");
            const nextSearch = params.toString();
            window.history.replaceState(
                null,
                "",
                `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`
            );
        }
    }, []);

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

            {authError && (
                <div className="fixed inset-x-4 top-24 z-50 mx-auto max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-4 py-3 text-sm text-[var(--color-text)] shadow-[var(--shadow-xl)]">
                    <div className="flex items-start justify-between gap-3">
                        <p>{authError}</p>
                        <button
                            type="button"
                            onClick={() => setAuthError("")}
                            className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                            aria-label="Dismiss sign-in error"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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
