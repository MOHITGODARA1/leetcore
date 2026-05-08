// FeatureHeading.jsx

function FeatureHeading() {
    return (
        <section className="w-full bg-transparent py-16 sm:py-16 lg:py-16 overflow-hidden relative">

            {/* Background Glow */}

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">

                    {/* Left Side */}
                    <div>



                        {/* Main Heading */}
                        <h1
                            className="
                text-[2.5rem]
                sm:text-4xl
                md:text-5xl
               
                leading-[1.05]
                tracking-normal
              "
                        >
                            <span className="text-white">
                                Theory Se
                            </span>

                            <br />

                            <span className="text-[#F46717]">
                                Zyada Ab Real
                            </span>



                            <br />

                            <span className="text-white">
                                Understanding Hogi .
                            </span>
                        </h1>
                    </div>

                    {/* Right Side */}
                    <div className="relative mt-4 lg:mt-15">

                        {/* Vertical Line */}
                        <div className="absolute -left-10 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

                        <p
                            className="
                text-[#b7b7c2]
                text-base
                sm:text-sm
                leading-[1.4]
                font-light
                max-w-2xl
              "
                        >
                            A single platform that combines structured learning,
                            real practice, roadmap-based progression, and smart
                            guidance so you can master Operating Systems, DBMS,
                            Computer Networks, and coding fundamentals with confidence.
                        </p>

                        {/* Bottom Stats */}
                        <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-14">

                            <div className="rounded-2xl  p-4">
                                <h3 className="text-white text-3xl sm:text-4xl font-bold">
                                    10K+
                                </h3>

                                <p className="text-[#8f8f9a] mt-2 text-sm sm:text-base">
                                    Active Learners
                                </p>
                            </div>

                            <div className="rounded-2xl  p-4">
                                <h3 className="text-white text-3xl sm:text-4xl font-bold">
                                    250+
                                </h3>

                                <p className="text-[#8f8f9a] mt-2 text-sm sm:text-base">
                                    Practice Questions
                                </p>
                            </div>

                            <div className="rounded-2xl  p-4">
                                <h3 className="text-white text-3xl sm:text-4xl font-bold">
                                    4
                                </h3>

                                <p className="text-[#8f8f9a] mt-2 text-sm sm:text-base">
                                    Core Subjects
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeatureHeading;
