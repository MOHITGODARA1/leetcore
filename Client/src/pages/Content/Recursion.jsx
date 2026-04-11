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
            <STitle icon="🔁" text="What is Recursion?" />
            <p className="text-gray-300 mb-4">
                <b>Recursion</b> is a technique where a function calls itself
                to solve smaller subproblems until a <b>base case</b> is reached.
            </p>

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`function countdown(n){
  if(n === 0) return;   // base case
  console.log(n);
  countdown(n - 1);     // recursive call
}`}
            </pre>

            <div className="mt-4 text-sm text-gray-400">
                Break problem → Solve smaller → Combine result
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const [stack, setStack] = useState([]);
    const [n, setN] = useState(4);

    const runRecursion = () => {
        let temp = [];
        function helper(x) {
            temp.push(`call(${x})`);
            if (x === 0) {
                temp.push("return");
                return;
            }
            helper(x - 1);
            temp.push(`return(${x})`);
        }
        helper(n);
        setStack(temp);
    };

    return (
        <Card>
            <STitle icon="⚡" text="Call Stack Visualization" />

            <div className="flex flex-col-reverse items-center gap-2 mb-4">
                {stack.map((val, i) => (
                    <div
                        key={i}
                        className="w-40 text-center py-2 bg-[#333] border border-[#555] rounded"
                    >
                        {val}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <input
                    type="number"
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    className="px-3 py-2 bg-[#222] border border-[#555] rounded text-white w-24"
                />
                <button onClick={runRecursion}>Run</button>
                <button onClick={() => setStack([])}>Reset</button>
            </div>

            <div className="text-sm text-gray-400 mt-3">
                Visualizing function calls & returns
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
                <b>Factorial:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function factorial(n){
  if(n === 0) return 1;
  return n * factorial(n - 1);
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Fibonacci (Recursive):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function fib(n){
  if(n <= 1) return n;
  return fib(n-1) + fib(n-2);
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Recursion" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Divide & conquer problems
✔ Tree / graph traversal
✔ Backtracking problems
✔ Problems with repetitive structure

Time Complexity: Depends (can be exponential)
Space Complexity: O(n) (call stack)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function RecursionPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Recursion</h1>
            <p className="text-gray-400 mb-6">
                Learn recursion to break problems into smaller subproblems using
                self-calling functions and understand call stack behavior.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}