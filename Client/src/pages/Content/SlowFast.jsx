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
    const nodes = [1, 2, 3, 4, 5];

    return (
        <Card>
            <STitle icon="🐢🐇" text="Slow & Fast Pointer" />
            <p className="text-gray-300 mb-4">
                The <b>Slow & Fast Pointer</b> technique uses two pointers moving at
                different speeds to solve linked list problems efficiently.
            </p>

            <div className="flex items-center gap-2">
                {nodes.map((val, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-[#333] border border-[#555] rounded">
                            {val}
                        </div>
                        {i !== nodes.length - 1 && (
                            <span className="text-gray-400">→</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                Slow moves 1 step, Fast moves 2 steps
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const nodes = [1, 2, 3, 4, 5, 6];

    const [slow, setSlow] = useState(0);
    const [fast, setFast] = useState(0);

    return (
        <Card>
            <STitle icon="⚡" text="Live Slow & Fast Movement" />

            <div className="flex items-center gap-2 mb-4">
                {nodes.map((val, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div
                            className={`px-4 py-2 rounded border
                            ${i === slow ? "bg-green-500" : ""}
                            ${i === fast ? "bg-red-500" : ""}
                            ${i !== slow && i !== fast ? "bg-[#333] border-[#555]" : ""}`}
                        >
                            {val}
                        </div>
                        {i !== nodes.length - 1 && (
                            <span className="text-gray-400">→</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => {
                        setSlow((s) => Math.min(s + 1, nodes.length - 1));
                        setFast((f) => Math.min(f + 2, nodes.length - 1));
                    }}
                >
                    move →
                </button>

                <button
                    onClick={() => {
                        setSlow(0);
                        setFast(0);
                    }}
                >
                    reset
                </button>
            </div>

            <div className="text-sm text-gray-400 mt-3">
                Slow Index: {slow} | Fast Index: {fast}
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
                <b>Find Middle of Linked List:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function findMiddle(head){
  let slow = head;
  let fast = head;

  while(fast && fast.next){
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Detect Cycle:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function hasCycle(head){
  let slow = head;
  let fast = head;

  while(fast && fast.next){
    slow = slow.next;
    fast = fast.next.next;

    if(slow === fast) return true;
  }

  return false;
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="When to Use Slow & Fast Pointer" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Find middle element
✔ Detect cycle in linked list
✔ Find start of cycle
✔ Palindrome linked list

Time Complexity: O(n)
Space Complexity: O(1)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function SlowFastPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Slow & Fast Pointer</h1>
            <p className="text-gray-400 mb-6">
                Learn the tortoise and hare technique to solve linked list problems
                efficiently using two pointers moving at different speeds.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}