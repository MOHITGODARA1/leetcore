function Login({ isOpen, onClose }) {
    if (!isOpen) return null;

    const handleGithubLogin = () => {
        // Redirect to backend GitHub OAuth route
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        window.location.assign(`${apiUrl}/api/v1/auth/github/login`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-overlay)] p-4 backdrop-blur-md">
            <div className="relative z-10 w-full max-w-md">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close login"
                    className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-muted)] transition-colors duration-300 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] active:scale-95"
                >
                    <span className="sr-only">Close</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Login Card */}
                <div className="flex flex-col items-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] p-6 shadow-[var(--shadow-2xl)] sm:p-9">
                    <img src="/leetcorelogo.png" alt="LeetCore Logo" className="mb-1 h-16 object-contain" />

                    <p className="mb-10 px-4 text-center text-sm leading-relaxed text-[var(--color-text-muted)]">
                        Sign in to practice, track progress, and prepare for your next big interview.
                    </p>

                    <button
                        onClick={handleGithubLogin}
                        className="flex w-full items-center justify-center gap-4 rounded-xl bg-[var(--color-text)] px-6 py-4 text-lg font-semibold text-[var(--color-text-inverse)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                    >
                        {/* GitHub Icon */}
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Continue with GitHub
                    </button>

                    <div className="mt-8 text-center text-[13px] text-[var(--color-text-faint)]">
                        By continuing, you agree to LeetCore's{" "}
                        <a href="#" className="text-[var(--color-text-muted)] underline decoration-[var(--color-border-strong)] underline-offset-2 transition-colors hover:text-[var(--color-text)]">
                            Terms
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[var(--color-text-muted)] underline decoration-[var(--color-border-strong)] underline-offset-2 transition-colors hover:text-[var(--color-text)]">
                            Privacy
                        </a>.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;