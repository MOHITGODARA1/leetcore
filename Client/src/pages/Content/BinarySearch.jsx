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
    const arr = [1, 3, 5, 7, 9, 11];

    return (
        <Card>
            <STitle icon="🔎" text="What is Binary Search?" />
            <p className="text-gray-300 mb-4">
                <b>Binary Search</b> is an efficient searching algorithm that works
                on <b>sorted arrays</b> by repeatedly dividing the search space in half.
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
                Works only on sorted arrays
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const arr = [1, 3, 5, 7, 9, 11];
    const target = 7;

    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(arr.length - 1);

    const mid = Math.floor((left + right) / 2);

    return (
        <Card>
            <STitle icon="⚡" text="Live Binary Search" />

            <div className="flex gap-2 mb-4">
                {arr.map((num, i) => (
                    <div
                        key={i}
                        className={`w-10 h-10 flex items-center justify-center rounded
                        ${i === left ? "bg-green-500" : ""}
                        ${i === right ? "bg-red-500" : ""}
                        ${i === mid ? "bg-yellow-500 text-black" : ""}
                        ${i !== left && i !== right && i !== mid ? "bg-[#333]" : ""}`}
                    >
                        {num}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => {
                        if (arr[mid] === target) return;
                        if (arr[mid] < target) setLeft(mid + 1);
                        else setRight(mid - 1);
                    }}
                >
                    next step →
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

            <div className="text-sm text-gray-400 mt-3">
                left: {left} | mid: {mid} | right: {right}
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
                <b>Classic Binary Search:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function binarySearch(arr, target){
  let left = 0;
  let right = arr.length - 1;

  while(left <= right){
    let mid = Math.floor((left + right) / 2);

    if(arr[mid] === target) return mid;
    else if(arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Lower Bound (First Occurrence):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function lowerBound(arr, target){
  let left = 0, right = arr.length - 1;
  let ans = arr.length;

  while(left <= right){
    let mid = Math.floor((left + right) / 2);

    if(arr[mid] >= target){
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return ans;
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Binary Search" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Sorted array searching
✔ Search space reduction
✔ Finding boundaries (lower/upper bound)
✔ Optimization problems (search on answer)

Time Complexity: O(log n)
Space Complexity: O(1)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function BinarySearchPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Binary Search</h1>
            <p className="text-gray-400 mb-6">
                Learn binary search to efficiently find elements in sorted arrays
                by reducing the search space logarithmically.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}