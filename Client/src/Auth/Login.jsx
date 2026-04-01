const Login = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const handleGithubLogin = () => {
        window.location.href = `${API_URL}/github`;
    };

    const handleGoogleLogin = () => {
        alert("Google login not implemented yet");
    };

    return (
        <div className="w-full flex flex-col items-center">

            {/* Google */}
            <button
                onClick={handleGoogleLogin}
                className="group w-full mb-4 flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-xl font-medium hover:bg-[#f0f0f0] transition-all"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" />
                <span>Continue with Google</span>
            </button>

            {/* GitHub */}
            <button
                onClick={handleGithubLogin}
                className="group w-full flex items-center justify-center gap-3 bg-[#0d1117] text-white py-3.5 rounded-xl border border-white/[0.1] hover:bg-[#161b22] transition-all"
            >
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" className="w-6 h-6 invert" />
                <span>Continue with GitHub</span>
            </button>

        </div>
    );
};

export default Login;