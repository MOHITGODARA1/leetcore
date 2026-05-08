function Login({ isOpen, onClose }) {
    if (!isOpen) return null;

    const handleGithubLogin = () => {
        // Redirect to backend GitHub OAuth route
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        window.location.assign(`${apiUrl}/api/v1/auth/github/login`);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F46717]/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-[#F46717] text-xl font-bold transition-colors"
                >
                    ✕
                </button>

                {/* Login Card */}
                <div className="bg-[#111113] border border-white/10 rounded-3xl p-7 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col items-center">

                    {/* Logo & Header */}
                    <img src="/leetcorelogo.png" alt="LeetCore Logo" className="h-26 mb-1" />


                    <p className="text-gray-400 text-sm text-center mb-10 leading-relaxed px-4">
                        Sign in to practice, track progress, and prepare for your next big interview.
                    </p>

                    <button
                        onClick={handleGithubLogin}
                        className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-4
                            bg-white
                            text-black
                            font-semibold
                            text-lg
                            px-6
                            py-4
                            rounded-2xl
                            cursor-pointer
                            transition-all
                            duration-300
                            shadow-lg
                        "
                    >
                        {/* GitHub Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        Continue with GitHub
                    </button>

                    <div className="mt-8 text-center text-[13px] text-gray-500">
                        By continuing, you agree to LeetCore's{" "}
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline decoration-gray-600 underline-offset-2">Terms</a>{" "}
                        and{" "}
                        <a href="#" className="text-gray-400 hover:text-white transition-colors underline decoration-gray-600 underline-offset-2">Privacy</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
