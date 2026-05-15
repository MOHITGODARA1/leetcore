import { Link } from "react-router-dom";

function Topics() {

    const dsaTopics = [

        // FOUNDATION
        {
            title: "Arrays",
            start: "/dashboard/dsa/arrays/arrayStart",
            practice: "/dashboard/dsa/arrays/arrayPractice",
            description:
                "Learn traversal, prefix sums, sliding window and more.",
        },

        {
            title: "Strings",
            start: "/dashboard/dsa/strings/stringStart",
            practice: "/dashboard/dsa/strings/stringPractice",
            description:
                "Master string traversal, patterns and manipulations.",
        },

        {
            title: "Hashing",
            start: "/dashboard/dsa/hashing/hashingStart",
            practice: "/dashboard/dsa/hashing/hashingPractice",
            description:
                "Solve problems using maps, sets and frequency counting.",
        },

        {
            title: "Two Pointers",
            start: "/dashboard/dsa/two-pointers/twoPointerStart",
            practice: "/dashboard/dsa/two-pointers/twoPointerPractice",
            description:
                "Optimize array and string problems efficiently.",
        },

        {
            title: "Sliding Window",
            start: "/dashboard/dsa/sliding-window/slidingWindowStart",
            practice: "/dashboard/dsa/sliding-window/slidingWindowPractice",
            description:
                "Handle subarrays and substrings with optimized windows.",
        },

        {
            title: "Binary Search",
            start: "/dashboard/dsa/binary-search/binarySearchStart",
            practice: "/dashboard/dsa/binary-search/binarySearchPractice",
            description:
                "Master searching techniques and optimization problems.",
        },

        // LINKED LIST + STACKS
        {
            title: "Linked List",
            start: "/dashboard/dsa/linked-list/linkedListStart",
            practice: "/dashboard/dsa/linked-list/linkedListPractice",
            description:
                "Understand pointers, fast-slow patterns and operations.",
        },

        {
            title: "Stack",
            start: "/dashboard/dsa/stack/stackStart",
            practice: "/dashboard/dsa/stack/stackPractice",
            description:
                "Solve monotonic stack and expression problems.",
        },

        {
            title: "Queue",
            start: "/dashboard/dsa/queue/queueStart",
            practice: "/dashboard/dsa/queue/queuePractice",
            description:
                "Learn queues, dequeues and BFS foundations.",
        },

        // RECURSION
        {
            title: "Recursion",
            start: "/dashboard/dsa/recursion/recursionStart",
            practice: "/dashboard/dsa/recursion/recursionPractice",
            description:
                "Build recursive thinking and divide problems elegantly.",
        },

        {
            title: "Backtracking",
            start: "/dashboard/dsa/backtracking/backtrackingStart",
            practice: "/dashboard/dsa/backtracking/backtrackingPractice",
            description:
                "Generate combinations, permutations and search spaces.",
        },

        // TREES
        {
            title: "Trees",
            start: "/dashboard/dsa/trees/treesStart",
            practice: "/dashboard/dsa/trees/treesPractice",
            description:
                "Learn traversals, depth, height and recursive trees.",
        },

        {
            title: "Binary Search Tree",
            start: "/dashboard/dsa/bst/bstStart",
            practice: "/dashboard/dsa/bst/bstPractice",
            description:
                "Master ordered trees and efficient searching.",
        },

        {
            title: "Heap / Priority Queue",
            start: "/dashboard/dsa/heap/heapStart",
            practice: "/dashboard/dsa/heap/heapPractice",
            description:
                "Solve top-k and priority-based problems efficiently.",
        },

        // GRAPHS
        {
            title: "Graphs",
            start: "/dashboard/dsa/graphs/graphsStart",
            practice: "/dashboard/dsa/graphs/graphsPractice",
            description:
                "Understand BFS, DFS and graph traversal techniques.",
        },

        {
            title: "Trie",
            start: "/dashboard/dsa/trie/trieStart",
            practice: "/dashboard/dsa/trie/triePractice",
            description:
                "Efficiently solve prefix and dictionary problems.",
        },

        // ADVANCED
        {
            title: "Greedy",
            start: "/dashboard/dsa/greedy/greedyStart",
            practice: "/dashboard/dsa/greedy/greedyPractice",
            description:
                "Learn local optimization strategies for interview problems.",
        },

        {
            title: "Dynamic Programm..",
            start: "/dashboard/dsa/dp/dpStart",
            practice: "/dashboard/dsa/dp/dpPractice",
            description:
                "Master memoization, tabulation and optimization patterns.",
        },

        {
            title: "Bit Manipulation",
            start: "/dashboard/dsa/bit-manipulation/bitManipulationStart",
            practice: "/dashboard/dsa/bit-manipulation/bitManipulationPractice",
            description:
                "Solve problems using binary operations efficiently.",
        },

    ];



    const sections = [
        {
            title: "Operating System",
            cardColor: "bg-[#c1af7f]",
            buttonColor: "bg-[#dbcba1]",
            textColor: "text-[#5f4a00]",
            glow: "bg-[#fff0c8]/20",
        },
        {
            title: "Computer Networks",
            cardColor: "bg-[#96c792]",
            buttonColor: "bg-[#b9d7b7]",
            textColor: "text-[#05660f]",
            glow: "bg-[#d9ffd6]/20",
        },
        {
            title: "Database Management System",
            cardColor: "bg-[#73c8d1]",
            buttonColor: "bg-[#abd0d5]",
            textColor: "text-[#083c47]",
            glow: "bg-[#d5f7ff]/20",
        },
        {
            title: "Object Oriented Programming",
            cardColor: "bg-[#d7cf59]",
            buttonColor: "bg-[#e3dc8f]",
            textColor: "text-[#5f5400]",
            glow: "bg-[#fff8bf]/20",
        },
    ];

    return (

        <div className="min-h-screen text-white px-6 py-8">

            {/* DSA Section */}
            <section
                id="dsa"
                className="mb-16"
            >

                <h1
                    className="
                        text-xl
                        mb-8
                    "
                >
                    Data Structure and Algorithms <span className="text-zinc-300 font-medium">(Follow the Flow)</span>
                </h1>

                {/* Cards */}
                <div
                    className="
                        flex
                        gap-8
                        overflow-x-auto
                        scrollbar-hide
                        snap-x
                        snap-mandatory
                        pb-4
                    "
                >

                    {dsaTopics.map((topic, index) => (

                        <div
                            key={index}
                            className="
                                relative
                                w-[250px]
                                h-[160px]
                                flex-shrink-0
                                snap-center
                                rounded-[20px]
                                bg-[#cf8a75]
                                overflow-hidden
                                p-5
                                flex
                                flex-col
                                justify-between
                                border
                                border-white/10
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
                                        font-semibold
                                        text-black
                                    "
                                >
                                    {topic.title}
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-black/70
                                        mt-1
                                        leading-relaxed
                                    "
                                >
                                    {topic.description}
                                </p>

                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <Link to={topic.start} className="
                                        relative
                                        z-10
                                        w-[46%]
                                        h-[35px]
                                        rounded-[8px]
                                        text-sm
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-black/50
                                        bg-[#deab99]
                                        text-black
                                        transition-all
                                        duration-300
                                        hover:scale-[1.02]
                                        cursor-pointer
                                    ">

                                    Start

                                </Link>

                                <Link to={topic.practice} className="
                                        relative
                                        z-10
                                        w-[46%]
                                        h-[35px]
                                        rounded-[8px]
                                        text-sm
                                        flex
                                        items-center
                                        justify-center
                                        border
                                        border-black/50
                                        bg-[#deab99]
                                        text-black
                                        transition-all
                                        duration-300
                                        hover:scale-[1.02]
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
                    className="mb-16"
                >

                    {/* Title */}
                    <h2
                        className="
                            text-xl
                            mb-8
                        "
                    >
                        {section.title}
                    </h2>

                    {/* Cards */}
                    <div
                        className="
                            flex
                            gap-8
                            overflow-x-auto
                            scrollbar-hide
                            snap-x
                            snap-mandatory
                            pb-4
                        "
                    >

                        {[1, 2, 3, 4, 5, 6].map((item) => (

                            <div
                                key={item}
                                className={`
                                    relative
                                    w-[260px]
                                    h-[190px]
                                    flex-shrink-0
                                    snap-center
                                    rounded-[28px]
                                    overflow-hidden
                                    p-5
                                    flex
                                    flex-col
                                    justify-between
                                    border
                                    border-white/10
                                    ${section.cardColor}
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

                                {/* Lock Overlay */}
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

                                    {/* Lock Icon */}
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
                                            text-lg
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

                                </div>

                                {/* Content */}
                                <div className="relative z-10">

                                    <h2
                                        className={`
                                            text-2xl
                                            font-bold
                                            ${section.textColor}
                                        `}
                                    >
                                        {section.title}
                                    </h2>

                                    <p
                                        className={`
                                            text-sm
                                            mt-3
                                            leading-relaxed
                                            ${section.textColor}
                                            opacity-80
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
                                        h-[45px]
                                        rounded-[14px]
                                        text-base
                                        font-semibold
                                        opacity-60
                                        cursor-not-allowed
                                        ${section.buttonColor}
                                        ${section.textColor}
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