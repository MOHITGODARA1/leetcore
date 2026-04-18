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
    const dp = [0, 1, 1, 2, 3, 5];

    return (
        <Card>
            <STitle icon="🧠" text="What is Dynamic Programming?" />
            <p className="text-gray-300 mb-4">
                <b>Dynamic Programming (DP)</b> is an optimization technique used to
                solve problems by breaking them into smaller overlapping subproblems
                and storing their results.
            </p>

            <div className="flex gap-2">
                {dp.map((val, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-[#333] border border-[#555] flex items-center justify-center rounded">
                            {val}
                        </div>
                        <span className="text-xs text-gray-400">dp[{i}]</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                Example: Fibonacci DP table
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const n = 6;
    const [dp, setDp] = useState([0, 1, ...Array(n - 1).fill(null)]);
    const [i, setI] = useState(2);

    const nextStep = () => {
        if (i >= n) return;

        const newDp = [...dp];
        newDp[i] = newDp[i - 1] + newDp[i - 2];

        setDp(newDp);
        setI(i + 1);
    };

    return (
        <Card>
            <STitle icon="⚡" text="Live DP Build (Fibonacci)" />

            <div className="flex gap-2 mb-4">
                {dp.map((val, idx) => (
                    <div
                        key={idx}
                        className={`w-12 h-12 flex items-center justify-center rounded
                        ${idx === i ? "bg-yellow-500 text-black" : ""}
                        ${val !== null && idx !== i ? "bg-green-500" : ""}
                        ${val === null ? "bg-[#333]" : ""}`}
                    >
                        {val !== null ? val : "?"}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={nextStep}>next step →</button>
                <button
                    onClick={() => {
                        setDp([0, 1, ...Array(n - 1).fill(null)]);
                        setI(2);
                    }}
                >
                    reset
                </button>
            </div>

            <div className="text-sm text-gray-400 mt-3">
                Building dp[{i}]
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
                <b>Fibonacci (Bottom-Up):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function fib(n){
  let dp = new Array(n + 1).fill(0);

  dp[1] = 1;

  for(let i = 2; i <= n; i++){
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>0/1 Knapsack:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function knapsack(wt, val, W){
  let n = wt.length;
  let dp = Array.from({length: n+1}, () => Array(W+1).fill(0));

  for(let i = 1; i <= n; i++){
    for(let w = 0; w <= W; w++){
      if(wt[i-1] <= w){
        dp[i][w] = Math.max(
          val[i-1] + dp[i-1][w - wt[i-1]],
          dp[i-1][w]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }

  return dp[n][W];
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Dynamic Programming" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Overlapping subproblems
✔ Optimal substructure
✔ Optimization problems (max/min)
✔ Recursion + memoization

Time Complexity: Reduced (often O(n) or O(n*m))
Space Complexity: O(n) or O(n*m)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function DynamicProgrammingPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Dynamic Programming</h1>
            <p className="text-gray-400 mb-6">
                Master dynamic programming to optimize recursive problems using
                memoization and tabulation techniques.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}