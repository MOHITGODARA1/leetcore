import { useState } from "react";

/* --- SAME GLOBAL STYLES --- */
const GlobalStyles = () => (
    <style>{`
    .arr-root { font-family: 'Syne', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  `}</style>
);

const Card = ({ children }) => (
    <div className="rounded-[20px] p-7 mb-6 bg-[#1a1a1a] border border-[#2a2a2a]">
        {children}
    </div>
);

const STitle = ({ icon, text }) => (
    <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <span>{icon}</span> {text}
    </h2>
);

/* --- INTRO --- */
function Intro() {
    const arr = [2, 1, 5, 1, 3, 2];
    const k = 3;

    return (
        <Card>
            <STitle icon="🪟" text="What is Sliding Window?" />
            <p className="text-gray-300 mb-4">
                <b>Sliding Window</b> is used to process a subset (window) of elements
                efficiently by sliding it across the array instead of recalculating every time.
            </p>

            <div className="flex gap-2">
                {arr.map((num, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-[#333] border border-[#555] flex items-center justify-center rounded">
                            {num}
                        </div>
                        <span className="text-xs text-gray-400">[{i}]</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                Window size (k) = {k}
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const arr = [2, 1, 5, 1, 3, 2];
    const k = 3;

    const [start, setStart] = useState(0);

    const end = start + k - 1;

    return (
        <Card>
            <STitle icon="⚡" text="Live Sliding Window" />

            <div className="flex gap-2 mb-4">
                {arr.map((num, i) => (
                    <div
                        key={i}
                        className={`w-10 h-10 flex items-center justify-center rounded
                        ${i >= start && i <= end ? "bg-blue-500" : "bg-[#333]"}`}
                    >
                        {num}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() =>
                        setStart((s) => Math.min(s + 1, arr.length - k))
                    }
                >
                    slide →
                </button>
                <button onClick={() => setStart(0)}>reset</button>
            </div>

            <div className="text-sm text-gray-400 mt-3">
                Window: [{start} ... {end}]
            </div>
        </Card>
    );
}

/* --- PATTERNS --- */
function Patterns() {
    return (
        <Card>
            <STitle icon="💡" text="Patterns" />

            <p className="text-gray-300 mb-2">
                <b>Max Sum Subarray (Fixed Size k):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function maxSum(arr, k){
  let windowSum = 0;
  let maxSum = 0;

  for(let i = 0; i < k; i++){
    windowSum += arr[i];
  }

  maxSum = windowSum;

  for(let i = k; i < arr.length; i++){
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Longest Substring Without Repeating:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function longestUnique(s){
  let set = new Set();
  let left = 0, maxLen = 0;

  for(let right = 0; right < s.length; right++){
    while(set.has(s[right])){
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Sliding Window" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Subarray / substring problems
✔ Fixed or variable window size
✔ Maximum / minimum sum
✔ Longest / shortest substring

Time Complexity: O(n)
Space Complexity: O(1) or O(k)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function SlidingWindowPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Sliding Window</h1>
            <p className="text-gray-400 mb-6">
                Learn sliding window to optimize subarray and substring problems
                by reducing nested loops into linear time solutions.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}