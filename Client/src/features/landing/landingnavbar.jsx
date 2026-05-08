function LandingNavbar({ onLoginClick }) {
    return (
        <nav
            className="
        fixed
        top-0
        left-0
        w-full
        z-50
        px-4
        sm:px-6
        lg:px-10
        py-3
      "
        >
            <div
                className="
          w-full
          max-w-5xl
          min-h-[58px]
          mx-auto
          rounded-[24px]
          flex
          items-center
          justify-between
          gap-4
          px-4
          sm:px-6

          bg-[#111113]/90
          backdrop-blur-2xl
          border border-white/12

        "
            >
                {/* Logo */}
                <div className="flex items-center cursor-pointer shrink-0">

                    <img src="/leetcorelogo.png" alt="LeetcoreLogo" className="h-20 sm:h-24 -my-5" />
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onLoginClick}
                        className="
              bg-[#F46717]
              cursor-pointer
              min-w-[104px]
              sm:min-w-[140px]
              h-11
              flex
              items-center
              justify-center
              text-white
              rounded-xl
              font-semibold

              

              transition-all
              duration-300
            "
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default LandingNavbar;
