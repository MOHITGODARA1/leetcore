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
    return (
        <Card>
            <STitle icon="🔙" text="What is Backtracking?" />
            <p className="text-gray-300 mb-4">
                <b>Backtracking</b> is a recursive technique that explores all
                possibilities and <b>undoes choices</b> when a path is invalid.
            </p>

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`choose → explore → unchoose

Example:
[1, 2]
→ [1]
→ [1,2]
← backtrack
→ [2]`}
            </pre>

            <div className="mt-4 text-sm text-gray-400">
                Try → Explore → Backtrack → Try next
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const nums = [1, 2, 3];
    const [path, setPath] = useState([]);
    const [result, setResult] = useState([]);

    const generate = () => {
        let res = [];

        function backtrack(curr, remaining) {
            res.push([...curr]);

            for (let i = 0; i < remaining.length; i++) {
                curr.push(remaining[i]);

                backtrack(
                    curr,
                    remaining.filter((_, idx) => idx !== i)
                );

                curr.pop(); // 🔥 backtrack
            }
        }

        backtrack([], nums);
        setResult(res);
    };

    return (
        <Card>
            <STitle icon="⚡" text="Live Backtracking (Permutations)" />

            <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Generated:</div>
                <div className="flex flex-wrap gap-2">
                    {result.map((arr, i) => (
                        <div
                            key={i}
                            className="px-3 py-1 bg-[#333] border border-[#555] rounded"
                        >
                            [{arr.join(",")}]
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={generate}>Generate</button>
                <button onClick={() => setResult([])}>Reset</button>
            </div>

            <div className="text-sm text-gray-400 mt-3">
                Generating all permutations using backtracking
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
                <b>Permutations:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function permute(nums){
  let res = [];

  function backtrack(path, used){
    if(path.length === nums.length){
      res.push([...path]);
      return;
    }

    for(let i = 0; i < nums.length; i++){
      if(used[i]) continue;

      used[i] = true;
      path.push(nums[i]);

      backtrack(path, used);

      path.pop();
      used[i] = false;
    }
  }

  backtrack([], []);
  return res;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Subsets:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function subsets(nums){
  let res = [];

  function backtrack(start, path){
    res.push([...path]);

    for(let i = start; i < nums.length; i++){
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(0, []);
  return res;
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Backtracking" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Generate all combinations / permutations
✔ Constraint problems (N-Queens, Sudoku)
✔ Decision trees
✔ Recursive exploration problems

Time Complexity: Exponential
Space Complexity: O(n) (recursion stack)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function BacktrackingPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Backtracking</h1>
            <p className="text-gray-400 mb-6">
                Learn backtracking to explore all possible solutions by making
                choices and undoing them when needed.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}