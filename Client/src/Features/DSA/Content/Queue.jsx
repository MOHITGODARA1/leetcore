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
    const queue = [10, 20, 30];

    return (
        <Card>
            <STitle icon="🚶" text="What is Queue?" />
            <p className="text-gray-300 mb-4">
                A <b>Queue</b> is a linear data structure that follows
                <b> FIFO (First In First Out)</b> principle.
            </p>

            <div className="flex items-center gap-2">
                {queue.map((val, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-14 h-10 bg-[#333] border border-[#555] flex items-center justify-center rounded">
                            {val}
                        </div>
                        {i !== queue.length - 1 && (
                            <span className="text-gray-400">→</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 text-sm text-gray-400">
                Front → remove | Rear → insert
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const [queue, setQueue] = useState([10, 20, 30]);

    const enqueue = () => {
        const val = Math.floor(Math.random() * 100);
        setQueue([...queue, val]);
    };

    const dequeue = () => {
        if (queue.length === 0) return;
        setQueue(queue.slice(1));
    };

    return (
        <Card>
            <STitle icon="⚡" text="Live Queue" />

            <div className="flex items-center gap-2 mb-4">
                {queue.map((val, i) => (
                    <div
                        key={i}
                        className={`w-14 h-10 flex items-center justify-center rounded
                        ${i === 0 ? "bg-green-500" : ""}
                        ${i === queue.length - 1 ? "bg-blue-500" : ""}
                        ${i !== 0 && i !== queue.length - 1 ? "bg-[#333]" : ""}`}
                    >
                        {val}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={enqueue}>Enqueue</button>
                <button onClick={dequeue}>Dequeue</button>
                <button onClick={() => setQueue([])}>Reset</button>
            </div>

            <div className="text-sm text-gray-400 mt-3">
                Front Index: 0 | Rear Index: {queue.length - 1}
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
                <b>Basic Queue Implementation:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`class Queue {
  constructor(){
    this.items = [];
  }

  enqueue(x){
    this.items.push(x);
  }

  dequeue(){
    return this.items.shift();
  }

  front(){
    return this.items[0];
  }
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Sliding Window Maximum (Queue based):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function maxSlidingWindow(nums, k){
  let deque = [];
  let res = [];

  for(let i = 0; i < nums.length; i++){
    while(deque.length && deque[0] <= i - k){
      deque.shift();
    }

    while(deque.length && nums[deque[deque.length - 1]] < nums[i]){
      deque.pop();
    }

    deque.push(i);

    if(i >= k - 1){
      res.push(nums[deque[0]]);
    }
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
            <STitle icon="🔍" text="When to Use Queue" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`✔ FIFO processing
✔ BFS traversal (graphs/trees)
✔ Scheduling systems
✔ Sliding window problems
✔ Buffer handling

Time Complexity:
Enqueue: O(1)
Dequeue: O(1)

Space Complexity: O(n)`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function QueuePage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Queue</h1>
            <p className="text-gray-400 mb-6">
                Learn queue to process data in FIFO order, widely used in
                scheduling, buffering, and graph traversal.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}