function PracticeArray() {
    const questions = [
        { title: "Two Sum", link: "https://leetcode.com/problems/two-sum/" },
        { title: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Contains Duplicate", link: "https://leetcode.com/problems/contains-duplicate/" },
        { title: "Product of Array Except Self", link: "https://leetcode.com/problems/product-of-array-except-self/" },
        { title: "Maximum Subarray", link: "https://leetcode.com/problems/maximum-subarray/" },
        { title: "Maximum Product Subarray", link: "https://leetcode.com/problems/maximum-product-subarray/" },
        { title: "Find Minimum in Rotated Sorted Array", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        { title: "Search in Rotated Sorted Array", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { title: "3Sum", link: "https://leetcode.com/problems/3sum/" },
        { title: "Container With Most Water", link: "https://leetcode.com/problems/container-with-most-water/" },
        { title: "Trapping Rain Water", link: "https://leetcode.com/problems/trapping-rain-water/" },
        { title: "Subarray Sum Equals K", link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
        { title: "Longest Consecutive Sequence", link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
        { title: "Merge Intervals", link: "https://leetcode.com/problems/merge-intervals/" },
        { title: "Insert Interval", link: "https://leetcode.com/problems/insert-interval/" },
    ];

    return (
        <div className="w-full">
            <h1 className="text-2xl font-semibold mb-6">Practice Array</h1>

            <div className="grid gap-3">
                {questions.map((q, index) => (
                    <div
                        key={index}
                        onClick={() => window.open(q.link, "_blank")}
                        className="cursor-pointer border border-[#3a3a3a] bg-[#1a1a1a] hover:bg-[#222] transition-all duration-200 rounded-lg px-4 py-3 flex items-center justify-between"
                    >
                        <span className="text-sm text-gray-200">
                            {index + 1}. {q.title}
                        </span>

                        <span className="text-xs text-gray-400">
                            Open →
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PracticeArray;