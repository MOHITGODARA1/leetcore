// Footer.jsx

function Footer() {
    return (
        <footer className="w-full bg-[#080808] border-t border-white/10 pt-16 sm:pt-20 pb-10 overflow-hidden relative">

            {/* Background Glow */}

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-10 border-b border-white/10">

                    {/* Brand */}
                    <div>

                        <div className="flex mb-2 gap-3">


                            <img src="/leetcorelogo.png" alt="logo" className='h-16' />



                        </div>

                        <p className="text-[#b7b7c2] text-sm leading-6 max-w-sm">
                            Modern platform for mastering Core CS subjects,
                            coding fundamentals, and placement preparation
                            through structured learning.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-5 mt-10">

                            <div
                                className="
                  w-12
                  h-12
                  rounded-full
                  bg-white/5
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  hover:bg-[#F46717]
                  hover:border-[#F46717]
                  transition
                  duration-300
                  cursor-pointer
                "
                            >
                                in
                            </div>

                            <div
                                className="
                  w-12
                  h-12
                  rounded-full
                  bg-white/5
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  hover:bg-[#F46717]
                  hover:border-[#F46717]
                  transition
                  duration-300
                  cursor-pointer
                "
                            >
                                ▶
                            </div>

                            <div
                                className="
                  w-12
                  h-12
                  rounded-full
                  bg-white/5
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  hover:bg-[#F46717]
                  hover:border-[#F46717]
                  transition
                  duration-300
                  cursor-pointer
                "
                            >
                                𝕏
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h2 className="text-white text-xl mb-5">
                            Product
                        </h2>

                        <div className="flex flex-col gap-3 text-[#b7b7c2] text-base">

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                Roadmaps
                            </a>

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                Practice
                            </a>

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                Interview Prep
                            </a>

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                Progress Tracking
                            </a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h2 className="text-white text-xl  mb-5">
                            Resources
                        </h2>

                        <div className="flex flex-col gap-3 text-[#b7b7c2] text-base">

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                OS Notes
                            </a>

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                DBMS Notes
                            </a>

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                CN Notes
                            </a>

                            <a
                                href="#"
                                className="hover:text-white transition duration-300"
                            >
                                OOPS Concepts
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-white text-xl  mb-5">
                            Connect
                        </h2>

                        <div className="flex flex-col gap-3 text-[#b7b7c2] text-base">

                            <p>
                                Mohit Godara
                            </p>

                            <p>
                                Full Stack Developer
                            </p>

                            <p>
                                Founder of LeetCore
                            </p>

                            <p className="text-[#F46717]">
                                mohitgodara816@gmail.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-5">

                    <p className="text-gray-500 text-sm">
                        © 2026 LeetCore. All rights reserved.
                    </p>

                    <div className="flex items-center gap-8 text-gray-500 text-sm">

                        <a
                            href="#"
                            className="hover:text-white transition duration-300"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="#"
                            className="hover:text-white transition duration-300"
                        >
                            Terms of Service
                        </a>

                        <a
                            href="#"
                            className="hover:text-white transition duration-300"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
