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
    const stack = [10, 20, 30];

    return (
        <Card>
            <STitle icon="📚" text="What is Stack?" />
            <p className="text-gray-300 mb-4">
                A <b>Stack</b> is a linear data structure that follows the
                <b> LIFO (Last In First Out)</b> principle.
            </p>

            <div className="flex flex-col-reverse items-center gap-2">
                {stack.map((val, i) => (
                    <div
                        key={i}
                        className="w-16 h-10 bg-[#333] border border-[#555] flex items-center justify-center rounded"
                    >
                        {val}
                    </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                Top element is accessed first
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const [stack, setStack] = useState([10, 20, 30]);

    const push = () => {
        const val = Math.floor(Math.random() * 100);
        setStack([...stack, val]);
    };

    const pop = () => {
        if (stack.length === 0) return;
        setStack(stack.slice(0, -1));
    };

    return (
        <Card>
            <STitle icon="⚡" text="Live Stack" />

            <div className="flex flex-col-reverse items-center gap-2 mb-4">
                {stack.map((val, i) => (
                    <div
                        key={i}
                        className={`w-16 h-10 flex items-center justify-center rounded
                        ${i === stack.length - 1 ? "bg-green-500" : "bg-[#333]"}`}
                    >
                        {val}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={push}>Push</button>
                <button onClick={pop}>Pop</button>
                <button onClick={() => setStack([])}>Reset</button>
            </div>

            <div className="text-sm text-gray-400 mt-3">
                Top Index: {stack.length - 1}
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
                <b>Valid Parentheses:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function isValid(s){
  let stack = [];

  for(let ch of s){
    if(ch === '(' || ch === '{' || ch === '['){
      stack.push(ch);
    } else {
      let top = stack.pop();

      if(
        (ch === ')' && top !== '(') ||
        (ch === '}' && top !== '{') ||
        (ch === ']' && top !== '[')
      ){
        return false;
      }
    }
  }

  return stack.length === 0;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Next Greater Element:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function nextGreater(arr){
  let stack = [];
  let res = new Array(arr.length).fill(-1);

  for(let i = arr.length - 1; i >= 0; i--){
    while(stack.length && stack[stack.length - 1] <= arr[i]){
      stack.pop();
    }

    if(stack.length){
      res[i] = stack[stack.length - 1];
    }

    stack.push(arr[i]);
  }

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
            <STitle icon="🔍" text="When to Use Stack" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Expression evaluation
✔ Parentheses matching
✔ Monotonic stack problems
✔ Undo/Redo operations
✔ DFS traversal

Time Complexity: O(n)
Space Complexity: O(n)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function StackPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Stack</h1>
            <p className="text-gray-400 mb-6">
                Learn stack to solve problems using LIFO strategy, widely used in
                parsing, recursion, and monotonic structures.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}