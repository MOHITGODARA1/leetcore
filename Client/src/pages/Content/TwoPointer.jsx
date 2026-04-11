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
    const arr = [1, 2, 3, 4, 5];

    return (
        <Card>
            <STitle icon="👆👉" text="What is Two Pointer?" />
            <p className="text-gray-300 mb-4">
                The <b>Two Pointer</b> technique uses two indices (left & right)
                to traverse data efficiently. It is commonly used in sorted arrays,
                palindrome problems, and pair searching.
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
                Left → start, Right → end
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const [arr, setArr] = useState([1, 2, 3, 4, 5]);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(arr.length - 1);

    return (
        <Card>
            <STitle icon="⚡" text="Live Two Pointer" />

            <div className="flex gap-2 mb-4">
                {arr.map((num, i) => (
                    <div
                        key={i}
                        className={`w-10 h-10 flex items-center justify-center rounded
                        ${i === left ? "bg-green-500" : ""}
                        ${i === right ? "bg-red-500" : ""}
                        ${i !== left && i !== right ? "bg-[#333]" : ""}`}
                    >
                        {num}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setLeft((l) => Math.min(l + 1, right))}>
                    move left →
                </button>
                <button onClick={() => setRight((r) => Math.max(r - 1, left))}>
                    ← move right
                </button>
                <button
                    onClick={() => {
                        setLeft(0);
                        setRight(arr.length - 1);
                    }}
                >
                    reset
                </button>
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
                <b>Two Sum (Sorted Array):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function twoSum(arr, target){
  let l = 0, r = arr.length - 1;

  while(l < r){
    let sum = arr[l] + arr[r];

    if(sum === target) return [l, r];
    else if(sum < target) l++;
    else r--;
  }
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Palindrome Check:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function isPalindrome(s){
  let l = 0, r = s.length - 1;

  while(l < r){
    if(s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Two Pointer" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Sorted array problems
✔ Pair sum / triplet problems
✔ Palindrome checking
✔ Sliding window optimization

Time Complexity: O(n)
Space Complexity: O(1)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function TwoPointerPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Two Pointer</h1>
            <p className="text-gray-400 mb-6">
                Master the two pointer technique — one of the most powerful tools
                for optimizing array and string problems.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}