// AboutCreator.jsx

import { Link } from "react-router-dom";

function AboutCreator() {
    return (
        <section className="w-full bg-transparent py-20 sm:py-28 lg:py-32 overflow-hidden relative">

            {/* Background Glow */}
            <div className="absolute right-0 top-40 w-[400px] h-[400px] bg-[#F46717]/10 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

                    {/* LEFT CONTENT */}
                    <div>

                        {/* Heading */}
                        <h1
                            className="
                text-[2.35rem]
                sm:text-4xl
                md:text-5xl
               
                leading-[1]
                tracking-normal
              "
                        >
                            <span className="text-[#F46717]">
                                A Developer,
                            </span>

                            <br />

                            <span className="text-white">
                                Not Just
                            </span>

                            <br />

                            <span className="text-white">
                                Another Creator.
                            </span>
                        </h1>

                        {/* About Text */}
                        <div
                            className="
                mt-9
                sm:mt-12
                space-y-8
                text-[#b7b7c2]
                text-base
                sm:text-md
                leading-[1.65]
                font-light
                max-w-3xl
              "
                        >
                            <p>
                                Hey, I’m Mohit — a full stack developer and a student
                                deeply passionate about building products that actually
                                help developers learn better.
                                <br />
                                <br />
                                During my own preparation journey, I realized that most
                                students struggle not because they are incapable,
                                but because learning core CS subjects often feels
                                confusing, unstructured, and overwhelming.
                                <br />
                                <br />
                                That’s why I started building LeetCore —
                                a platform focused on making Operating Systems,
                                DBMS, Computer Networks, and coding fundamentals
                                easier to understand through structured learning,
                                practical explanations, and relatable teaching.
                                <br />
                                <br />


                                I genuinely believe students don’t need more
                                complicated content.
                                They need clarity, direction, consistency,
                                and someone who explains concepts like a mentor,
                                not a textbook.
                                <br />
                                <br />

                                Let’s build strong fundamentals,
                                one topic at a time.
                                <br />
                                <br />
                            </p>
                        </div>

                        {/* CTA */}
                        {/* <button
                            className="
                mt-8
                bg-[#F46717]
                text-white
                px-10
                py-4
                rounded-full
                text-md
                font-semibold

                hover:scale-105
                hover:shadow-[0px_0px_40px_rgba(244,103,23,0.4)]

                transition-all
                duration-300
              "
                        >
                            Explore LeetCore →
                        </button> */}

                        {/* Social Cards */}
                        <div className="mt-10 space-y-5">


                            <Link to="https://github.com/MOHITGODARA1" target="_blank" className="
                  w-full
                  max-w-lg
                  bg-white/[0.035]
                  border border-white/10
                  backdrop-blur-2xl
                  rounded-2xl
                  px-6
                  py-3
                  flex
                  items-center
                  gap-5
                  
                  transition
                  duration-300
                ">
                                <div
                                    className="
                    w-12
                    h-12
                    rounded-full
                    bg-[#111113]
                    border border-white/10
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xl
                    
                  "
                                >
                                    ▶
                                </div>

                                <div>
                                    <h3 className="text-white text-md font-semibold">
                                        @leetcore
                                    </h3>

                                    <p className="text-gray-400 text-sm mt-1">
                                        Learning Core CS The Modern Way
                                    </p>
                                </div>
                            </Link>




                            <Link to="https://www.linkedin.com/in/mohit-godara816/" target="_blank" className="
                  w-full
                  max-w-lg
                  bg-white/[0.035]
                  border border-white/10
                  backdrop-blur-2xl
                  rounded-2xl
                  px-6
                  py-3
                  flex
                  items-center
                  gap-5
                  
                  transition
                  duration-300
                ">
                                <div
                                    className="
                                            w-12
                                            h-12
                                            rounded-full
                                            bg-[#111113]
                                            border border-white/10
                                            flex
                                            items-center
                                            justify-center
                                            text-white
                                            text-md
                                            font-semibold
                                        "
                                >
                                    in
                                </div>

                                <div>
                                    <h3 className="text-white text-md font-semibold">
                                        Mohit Godara
                                    </h3>

                                    <p className="text-gray-400 text-sm mt-1">
                                        Building LeetCore & developer-focused products
                                    </p>
                                </div>
                            </Link>

                        </div>
                    </div>

                    {/* RIGHT IMAGE SECTION */}
                    <div className="relative flex items-center justify-center">



                        {/* Image Placeholder */}
                        <div
                            className="
                relative
                w-full
                max-w-[520px]
                min-h-[520px]
                sm:min-h-[640px]
                rounded-[32px]
                flex
                items-center
                justify-center




                
              "
                        >
                            {/* ADD YOUR IMAGE HERE */}
                            <span className="text-gray-600 text-2xl">
                                <img src="/profile.png" alt="profile" className="w-full max-w-[430px] rounded-full border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.35)]" />
                            </span>

                            {/* Floating Labels */}
                            <div
                                className="
                  absolute
                  top-8
                  left-0
                  sm:left-[-24px]
                  bg-[#101011]/90
                  border border-[#F46717]/30
                  backdrop-blur-xl

                  px-6
                  py-3
                  rounded-full

                  text-white
                  text-md
                  font-medium
                "
                            >
                                Full Stack Developer
                            </div>

                            <div
                                className="
                  absolute
                  bottom-16
                  right-0
                  sm:right-[-20px]

                  bg-[#101011]/90
                  border border-[#F46717]/30
                  backdrop-blur-xl

                  px-6
                  py-3
                  rounded-full

                  text-white
                  text-md
                  font-medium
                "
                            >
                                Building LeetCore
                            </div>

                            <div
                                className="
                  absolute
                  top-[45%]
                  right-0
                  sm:right-[-30px]

                  bg-[#101011]/90
                  border border-[#F46717]/30
                  backdrop-blur-xl

                  px-6
                  py-3
                  rounded-full

                  text-white
                  text-md
                  font-medium
                "
                            >
                                CS Learning Simplified
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutCreator;
