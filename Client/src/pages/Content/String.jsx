import { useState, useEffect, useRef } from "react";

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
    const str = "hello";

    return (
        <Card>
            <STitle icon="🔤" text="What is a String?" />
            <p className="text-gray-300 mb-4">
                A <b>string</b> is a sequence of characters stored in memory.
                Each character can be accessed using an index, similar to arrays.
            </p>

            <div className="flex gap-2">
                {str.split("").map((ch, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-[#333] border border-[#555] flex items-center justify-center rounded">
                            {ch}
                        </div>
                        <span className="text-xs text-gray-400">[{i}]</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

/* --- LIVE OPS --- */
function LiveOps() {
    const [str, setStr] = useState("hello");
    const [input, setInput] = useState("");

    return (
        <Card>
            <STitle icon="⚡" text="Live Operations" />

            <div className="flex gap-2 mb-4">
                {str.split("").map((ch, i) => (
                    <div key={i} className="w-10 h-10 bg-[#333] flex items-center justify-center rounded">
                        {ch}
                    </div>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter character"
                className="bg-[#222] border border-[#444] px-3 py-2 rounded mb-3 w-full"
            />

            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setStr((s) => s + (input || "a"))}>append</button>
                <button onClick={() => setStr((s) => s.slice(0, -1))}>remove</button>
                <button onClick={() => setStr((s) => s.split("").reverse().join(""))}>reverse</button>
                <button onClick={() => setStr((s) => s.toUpperCase())}>uppercase</button>
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
                <b>Two Pointer (Palindrome):</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function isPalindrome(s){
  let l=0,r=s.length-1;
  while(l<r){
    if(s[l]!==s[r]) return false;
    l++; r--;
  }
  return true;
}`}
            </pre>

            <p className="text-gray-300 mt-4 mb-2">
                <b>Sliding Window:</b>
            </p>
            <pre className="text-sm bg-[#222] p-3 rounded">
                {`function longestSubstring(s){
  let set=new Set(),l=0,max=0;
  for(let r=0;r<s.length;r++){
    while(set.has(s[r])){
      set.delete(s[l++]);
    }
    set.add(s[r]);
    max=Math.max(max,r-l+1);
  }
  return max;
}`}
            </pre>
        </Card>
    );
}

/* --- METHODS --- */
function Methods() {
    return (
        <Card>
            <STitle icon="🔍" text="String Methods" />

            <pre className="bg-[#222] p-3 rounded text-sm">
                {`"hello".slice(1,4)   // "ell"
"hello".includes("ll") // true
"hello".indexOf("l")   // 2
"hello".replace("l","x") // "hexlo"
"hello".split("") // ["h","e","l","l","o"]`}
            </pre>
        </Card>
    );
}

/* --- ROOT --- */
export default function StringPage() {
    return (
        <div className="arr-root text-white p-6 max-w-[1000px] mx-auto">
            <GlobalStyles />

            <h1 className="text-3xl font-bold mb-2">Strings</h1>
            <p className="text-gray-400 mb-6">
                Learn string manipulation — essential for parsing, searching, and pattern problems.
            </p>

            <Intro />
            <LiveOps />
            <Patterns />
            <Methods />
        </div>
    );
}