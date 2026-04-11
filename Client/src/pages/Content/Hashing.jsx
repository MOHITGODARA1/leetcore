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
    const arr = [1, 2, 2, 3, 3, 3];

    const freq = {};
    arr.forEach((num) => {
        freq[num] = (freq[num] || 0) + 1;
    });

    return (
        <Card>
            <STitle icon="🧠" text="What is Hashing?" />
            <p className="text-gray-300 mb-4">
                <b>Hashing</b> stores data in key-value pairs using a hash map or object.
                It allows fast lookup, insertion, and deletion in <b>O(1)</b> time.
            </p>

            <div className="flex gap-2 flex-wrap">
                {Object.entries(freq).map(([key, value], i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="px-4 py-2 bg-[#333] border border-[#555] rounded">
                            {key} : {value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                Frequency map using hashing
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const [map, setMap] = useState({});
    const [input, setInput] = useState("");

    const addValue = () => {
        if (!input) return;
        setMap((prev) => ({
            ...prev,
            [input]: (prev[input] || 0) + 1,
        }));
        setInput("");
    };

    return (
        <Card>
            <STitle icon="⚡" text="Live Hashing" />

            <div className="flex gap-2 mb-4">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter value"
                    className="px-3 py-2 bg-[#222] border border-[#555] rounded text-white"
                />
                <button onClick={addValue}>Add</button>
                <button onClick={() => setMap({})}>Reset</button>
            </div>

            <div className="flex gap-2 flex-wrap">
                {Object.entries(map).map(([key, value], i) => (
                    <div
                        key={i}
                        className="px-3 py-2 bg-[#333] border border-[#555] rounded"
                    >
                        {key} : {value}
                    </div>
                ))}
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
                <b>Frequency Count:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function countFreq(arr){
  let map = {};

  for(let num of arr){
    map[num] = (map[num] || 0) + 1;
  }

  return map;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Two Sum (Using Hashing):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function twoSum(arr, target){
  let map = {};

  for(let i = 0; i < arr.length; i++){
    let diff = target - arr[i];

    if(map[diff] !== undefined){
      return [map[diff], i];
    }

    map[arr[i]] = i;
  }
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Hashing" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Frequency counting
✔ Duplicate detection
✔ Fast lookup problems
✔ Pair sum (unsorted array)

Time Complexity: O(n)
Space Complexity: O(n)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function HashingPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Hashing</h1>
            <p className="text-gray-400 mb-6">
                Learn hashing to solve problems with fast lookups, frequency counting,
                and optimized searching.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}