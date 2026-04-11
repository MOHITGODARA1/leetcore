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
    const nodes = [10, 20, 30, 40];

    return (
        <Card>
            <STitle icon="🔗" text="What is Linked List?" />
            <p className="text-gray-300 mb-4">
                A <b>Linked List</b> is a linear data structure where elements
                (nodes) are connected using pointers instead of contiguous memory.
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
                Each node stores data + pointer to next node
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const [list, setList] = useState([10, 20, 30]);

    const addNode = () => {
        const val = Math.floor(Math.random() * 100);
        setList([...list, val]);
    };

    const removeNode = () => {
        setList(list.slice(0, -1));
    };

    return (
        <Card>
            <STitle icon="⚡" text="Live Linked List" />

            <div className="flex items-center gap-2 mb-4">
                {list.map((val, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="px-4 py-2 bg-[#333] border border-[#555] rounded">
                            {val}
                        </div>
                        {i !== list.length - 1 && (
                            <span className="text-gray-400">→</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={addNode}>Insert Node</button>
                <button onClick={removeNode}>Delete Last</button>
                <button onClick={() => setList([])}>Reset</button>
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
                <b>Reverse Linked List:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function reverse(head){
  let prev = null;
  let curr = head;

  while(curr){
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Detect Cycle (Floyd’s Algorithm):</b>
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
            <STitle icon="🔍" text="When to Use Linked List" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ Dynamic memory allocation
✔ Frequent insert/delete operations
✔ Implement stacks & queues
✔ Graph & tree structures

Time Complexity:
Access: O(n)
Insert/Delete: O(1)

Space Complexity: O(n)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function LinkedListPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Linked List</h1>
            <p className="text-gray-400 mb-6">
                Learn linked lists to efficiently manage dynamic data with fast
                insertions and deletions.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}