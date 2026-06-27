import { Link } from "react-router-dom";

function Topics() {
    const getTopicPath = (section, topicName) => {
        const encodedTopic = encodeURIComponent(topicName);
        return `/dashboard/dsa/${section}/${encodedTopic}`;
    };

    const dsaTopics = [

        // FOUNDATION
        {
            title: "Arrays & Vectors",
            topic: "Array",
            description:
                "Learn traversal, prefix sums, sliding window and more.",
        },

        {
            title: "Strings",
            topic: "String",
            description:
                "Master string traversal, patterns and manipulations.",
        },

        {
            title: "Hashing",
            topic: "Hashing",
            description:
                "Solve problems using maps, sets and frequency counting.",
        },
        

        {
            title: "Binary Search",
            topic: "Binary Search",
            description:
                "Master searching techniques and optimization problems.",
        },

        // LINKED LIST + STACKS
        {
            title: "Linked List",
            topic: "Linked List",
            description:
                "Understand pointers, fast-slow patterns and operations.",
        },

        {
            title: "Stack",
            topic: "Stack",
            description:
                "Solve monotonic stack and expression problems.",
        },

        {
            title: "Queue",
            topic: "Queue",
            description:
                "Learn queues, dequeues and BFS foundations.",
        },

        // RECURSION
        // {
        //     title: "Recursion",
        //     topic: "Recursion",
        //     description:
        //         "Build recursive thinking and divide problems elegantly.",
        // },

        // {
        //     title: "Backtracking",
        //     topic: "Backtracking",
        //     description:
        //         "Generate combinations, permutations and search spaces.",
        // },

        // TREES
        // {
        //     title: "Trees",
        //     topic: "Trees",
        //     description:
        //         "Learn traversals, depth, height and recursive trees.",
        // },

        // {
        //     title: "Binary Search Tree",
        //     topic: "Binary Search Tree",
        //     description:
        //         "Master ordered trees and efficient searching.",
        // },

        // {
        //     title: "Heap / Priority Queue",
        //     topic: "Heap / Priority Queue",
        //     description:
        //         "Solve top-k and priority-based problems efficiently.",
        // },

        // GRAPHS
        // {
        //     title: "Graphs",
        //     topic: "Graphs",
        //     description:
        //         "Understand BFS, DFS and graph traversal techniques.",
        // },

        // {
        //     title: "Trie",
        //     topic: "Trie",
        //     description:
        //         "Efficiently solve prefix and dictionary problems.",
        // },

        // ADVANCED
        // {
        //     title: "Greedy",
        //     topic: "Greedy",
        //     description:
        //         "Learn local optimization strategies for interview problems.",
        // },

        // {
        //     title: "Dynamic Programming",
        //     topic: "Dynamic Programming",
        //     description:
        //         "Master memoization, tabulation and optimization patterns.",
        // },

        // {
        //     title: "Bit Manipulation",
        //     topic: "Bit Manipulation",
        //     description:
        //         "Solve problems using binary operations efficiently.",
        // },

    ];



    const sections = [
        {
            title: "Operating System",
            cardColor: "from-[#c1af7f] to-[#7a5534]",
            buttonColor: "bg-[#dbcba1]",
            textColor: "text-[#fff6de]",
            glow: "bg-[#fff0c8]/20",
        },
        {
            title: "Computer Networks",
            cardColor: "from-[#96c792] to-[#496f43]",
            buttonColor: "bg-[#b9d7b7]",
            textColor: "text-[#efffed]",
            glow: "bg-[#d9ffd6]/20",
        },
        {
            title: "Database Management System",
            cardColor: "from-[#73c8d1] to-[#315d64]",
            buttonColor: "bg-[#abd0d5]",
            textColor: "text-[#eaffff]",
            glow: "bg-[#d5f7ff]/20",
        },
        {
            title: "Object Oriented Programming",
            cardColor: "from-[#d7cf59] to-[#746c24]",
            buttonColor: "bg-[#e3dc8f]",
            textColor: "text-[#fffbd1]",
            glow: "bg-[#fff8bf]/20",
        },
    ];

    return (

        <div className="min-h-screen text-white px-4 sm:px-6 py-6 sm:py-8">

            {/* DSA Section */}
            <section
                id="dsa"
                className="mb-16"
            >

                <h1
                    className="text-xl font-semibold mb-5 sm:mb-6 lc-safe-text"
                >
                    Data Structure and Algorithms <span className="text-zinc-300 font-medium">(Follow the Flow)</span>
                </h1>

                {/* Cards */}
                <div
                    className="
                        flex
                        gap-4
                        sm:gap-5
                        lc-scroll-x
                        snap-x
                        snap-proximity
                        cursor-default
                    "
                >

                    {dsaTopics.map((topic, index) => (

                        <div
                            key={index}
                            className="
                                relative
                                w-[244px]
                                sm:w-[260px]
                                min-h-[152px]
                                flex-shrink-0
                                snap-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-[#cf8a75]
                                to-[#8f4f39]
                                overflow-hidden
                                p-5
                                flex
                                flex-col
                                justify-between
                                
                                
                            "
                        >

                            {/* Circle */}
                            <div
                                className="
                                    absolute
                                    bottom-[-20px]
                                    left-[-10px]
                                    w-[80px]
                                    h-[80px]
                                    rounded-full
                                    bg-white/10
                                "
                            />

                            {/* Content */}
                            <div className="relative z-10">

                                <h2
                                    className="
                                        text-xl
                                        font-bold
                                        text-white
                                        lc-safe-text
                                    "
                                >
                                    {topic.title}
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-white/72
                                        mt-1
                                        leading-relaxed
                                    "
                                >
                                    {topic.description}
                                </p>

                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <Link to={getTopicPath("Docs", topic.topic)} className="
                                        relative
                                        z-10
                                        flex-1
                                        min-w-0
                                        h-8
                                        mt-4
                                        rounded-md
                                        text-sm
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-white/20
                                        bg-white
                                        text-black
                                        transition-all
                                        duration-300
                                        hover:bg-orange-50
                                        active:scale-[0.98]
                                        cursor-pointer
                                    ">

                                    Start

                                </Link>

                                <Link to={getTopicPath("Practice", topic.topic)} className="
                                        relative
                                        z-10
                                        flex-1
                                        min-w-0
                                        h-8
                                        mt-4
                                        rounded-md
                                        text-sm
                                        font-semibold
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-white/20
                                        bg-white/14
                                        text-white
                                        transition-all
                                        duration-300
                                        hover:bg-white/20
                                        active:scale-[0.98]
                                        cursor-pointer
                                    ">

                                    Practice

                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

            {/* Other Sections */}
            {sections.map((section, index) => (

                <section
                    key={index}
                    id={section.title.toLowerCase().replaceAll(" ", "-")}
                    className="mb-14 sm:mb-16"
                >

                    {/* Title */}
                    <h2
                        className="text-xl font-semibold mb-5 sm:mb-6 lc-safe-text"
                    >
                        {section.title}
                    </h2>

                    {/* Cards */}
                    <div
                        className="
                            flex
                            gap-4
                            sm:gap-5
                            lc-scroll-x
                            snap-x
                            snap-proximity
                        "
                    >

                        {[1, 2, 3, 4, 5, 6].map((item) => (

                            <div
                                key={item}
                                className={`
                                    relative
                                    w-[250px]
                                    sm:w-[260px]
                                    min-h-[152px]
                                    flex-shrink-0
                                    snap-center
                                    rounded-2xl
                                    overflow-hidden
                                    p-5
                                    flex
                                    flex-col
                                    justify-between
                                    border
                                    border-white/10
                                    bg-gradient-to-br
                                    ${section.cardColor}
                                    shadow-[0_16px_45px_rgba(0,0,0,0.2)]
                                    lc-interactive
                                `}
                            >

                                {/* Glow */}
                                <div
                                    className={`
                                        absolute
                                        top-[-40px]
                                        right-[-30px]
                                        w-[140px]
                                        h-[140px]
                                        rounded-full
                                        blur-2xl
                                        ${section.glow}
                                    `}
                                />

                                {/* Circle */}
                                <div
                                    className="
                                        absolute
                                        bottom-[-20px]
                                        left-[-10px]
                                        w-[80px]
                                        h-[80px]
                                        rounded-full
                                        bg-white/10
                                    "
                                />

                                {/* Lock Overlay
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        z-30
                                        backdrop-blur-[2px]
                                        bg-black/20
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                    "
                                >

                                    
                                    <div
                                        className="
                                            w-14
                                            h-14
                                            rounded-2xl
                                            bg-black/30
                                            border
                                            border-white/10
                                            flex
                                            items-center
                                            justify-center
                                            mb-4
                                            shadow-xl
                                        "
                                    >
                                        🔒
                                    </div>

                                    <h3
                                        className="
                                            text-base
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Work in Progress
                                    </h3>

                                    <p
                                        className="
                                            text-sm
                                            text-white/70
                                            mt-2
                                            text-center
                                            px-4
                                        "
                                    >
                                        New content is currently being built.
                                    </p>

                                </div> */}

                                {/* Content */}
                                <div className="relative z-10">

                                    <h2
                                        className={`
                                            text-xl
                                            font-bold
                                            ${section.textColor}
                                            lc-safe-text
                                        `}
                                    >
                                        {section.title}
                                    </h2>

                                    <p
                                        className={`
                                            text-sm
                                            mt-3
                                            leading-relaxed
                                            text-white/74
                                        `}
                                    >
                                        Build strong fundamentals and prepare for interviews.
                                    </p>

                                </div>

                                {/* Disabled Button */}
                                <button
                                    disabled
                                    className={`
                                        relative
                                        z-10
                                        w-full
                                        min-h-9
                                        rounded-lg
                                        text-sm
                                        font-semibold
                                        opacity-70
                                        cursor-not-allowed
                                        border
                                        mt-2
                                        border-white/10
                                        ${section.buttonColor}
                                        text-black/80
                                    `}
                                >
                                    Coming Soon
                                </button>

                            </div>

                        ))}

                    </div>

                </section>

            ))}

        </div>

    );

}

export default Topics;
