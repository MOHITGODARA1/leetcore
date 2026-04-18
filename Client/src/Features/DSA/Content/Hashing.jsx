import { useState, useEffect, useRef } from "react";

const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    .arr-root { font-family: 'Syne', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp 0.55s ease both; }
  `}</style>
);

function Section({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.08 }
        );
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

const Card = ({ children }) => (
    <div className="rounded-[20px] p-7 mb-5 bg-[#1a1a1a] border border-[#2a2a2a] relative overflow-hidden">
        {children}
    </div>
);

const STitle = ({ icon, text }) => (
    <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 text-white">
        <span>{icon}</span> {text}
    </h2>
);

const CodeBlock = ({ code, borderColor = "#929292" }) => (
    <pre
        className="bg-[#222] rounded-xl px-4 py-3.5 font-mono text-xs text-[#aaacae] leading-[1.75] whitespace-pre-wrap m-0"
        style={{ borderLeft: `3px solid ${borderColor}` }}
    >
        {code}
    </pre>
);

/* ─── 1. INTRO ─── */
function Intro() {
    const [clicked, setClicked] = useState(null);
    const [hov, setHov] = useState(null);

    const pairs = [
        { key: '"apple"', value: 3, hash: "0x1A4" },
        { key: '"banana"', value: 1, hash: "0x2F7" },
        { key: '"cherry"', value: 5, hash: "0x3C2" },
        { key: '"date"', value: 2, hash: "0x4B1" },
    ];

    return (
        <Section>
            <Card>
                <STitle icon="🧠" text="What is Hashing?" />
                <p className="text-[#c9cdd4] leading-[1.75] mb-4 text-[15px]">
                    <strong className="text-white">Hashing</strong> is a technique that maps data (keys) to fixed-size
                    values (indices) using a <strong className="text-white">hash function</strong>. This allows{" "}
                    <strong className="text-white">O(1) average</strong> time for insertion, deletion, and lookup — instead
                    of O(n) linear search.
                </p>
                <p className="text-[#c9cdd4] leading-[1.75] mb-5 text-[15px]">
                    Think of it like a <strong className="text-white">dictionary</strong> — you look up a word directly
                    instead of reading every page. The hash function computes exactly which "page" (bucket) to jump to.
                </p>

                <p className="text-xs text-[#929292] mb-3 font-mono">// Click any key-value pair to inspect it</p>
                <div className="flex gap-3 flex-wrap mb-4">
                    {pairs.map((p, i) => (
                        <div
                            key={i}
                            onClick={() => setClicked(clicked === i ? null : i)}
                            onMouseEnter={() => setHov(i)}
                            onMouseLeave={() => setHov(null)}
                            className="cursor-pointer flex flex-col items-center gap-1"
                        >
                            <span className="font-mono text-[10px] transition-colors duration-200"
                                style={{ color: hov === i ? "#6366f1" : "#929292" }}>
                                {p.hash}
                            </span>
                            <div style={{
                                minWidth: 100, padding: "10px 14px",
                                background: "#333", border: `2px solid #929292`,
                                borderRadius: 12, display: "flex", alignItems: "center",
                                justifyContent: "center", fontFamily: "JetBrains Mono, monospace",
                                fontSize: 12, fontWeight: 700,
                                color: clicked === i ? "white" : "#aaacae",
                                transform: clicked === i ? "translateY(-2px)" : hov === i ? "translateY(-4px)" : "translateY(0)",
                                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                            }}>
                                {p.key} → {p.value}
                            </div>
                        </div>
                    ))}
                </div>

                {clicked !== null && (
                    <div className="bg-[#333] rounded-xl px-5 py-4 font-mono text-[13px] mb-4"
                        style={{ animation: "fadeUp 0.25s ease" }}>
                        <div className="text-[11px] text-[#929292] mb-2">// Inspector</div>
                        <div className="text-[#aaacae]">key: <span className="text-white font-bold">{pairs[clicked].key}</span></div>
                        <div className="text-[#aaacae]">value: <span className="text-white font-bold">{pairs[clicked].value}</span></div>
                        <div className="text-[#aaacae]">bucket address: <span className="text-white font-bold">{pairs[clicked].hash}</span></div>
                        <div className="text-[#aaacae]">lookup cost: <span className="text-white font-bold">O(1)</span></div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { lang: "JavaScript (Map)", code: `const map = new Map();\nmap.set("apple", 3);\nmap.get("apple"); // 3\nmap.has("apple"); // true` },
                        { lang: "JavaScript (Object)", code: `const freq = {};\nfreq["apple"] = 3;\nfreq["apple"]; // 3\n"apple" in freq; // true` },
                    ].map((ex, i) => (
                        <div key={i} className="bg-[#333] rounded-xl px-4 py-3.5" style={{ border: "1px solid #92929233" }}>
                            <div className="text-[11px] font-bold mb-2 font-mono text-[#aaacae]">{ex.lang}</div>
                            <pre className="m-0 font-mono text-xs text-[#aaacae] whitespace-pre-wrap">{ex.code}</pre>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 2. HOW HASHING WORKS ─── */
function HowItWorks() {
    const [inputKey, setInputKey] = useState("hello");
    const tableSize = 7;

    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % tableSize;
        }
        return hash;
    };

    const bucket = hashCode(inputKey || "hello");

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="⚙️" text="How a Hash Function Works" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    A <strong className="text-white">hash function</strong> takes any key and converts it to a number
                    (the bucket index). The same key always maps to the same bucket — that's what makes lookup O(1).
                    Below is a simplified version: <code className="bg-[#333] px-1.5 py-0.5 rounded font-mono text-xs">hash = (hash × 31 + charCode) % tableSize</code>.
                </p>

                <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#929292] font-mono text-xs">key =</span>
                    <input
                        value={inputKey}
                        onChange={e => setInputKey(e.target.value.slice(0, 12))}
                        placeholder="type a key..."
                        className="bg-[#333] border border-[#929292] rounded-[10px] px-3.5 py-2 text-white font-mono text-[13px] outline-none w-40"
                    />
                    <span className="text-[#929292] font-mono text-xs">→ bucket</span>
                    <span className="bg-[#333] border border-[#929292] rounded-lg px-3 py-1.5 font-mono text-sm text-white font-bold">{bucket}</span>
                </div>

                {/* Hash table buckets */}
                <div className="flex gap-2 flex-wrap mb-4">
                    {Array.from({ length: tableSize }, (_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-mono text-[#929292]">bucket</span>
                            <div style={{
                                width: 64, height: 48,
                                background: i === bucket ? "#22222a" : "#333",
                                border: `2px solid ${i === bucket ? "#fff" : "#929292"}`,
                                borderRadius: 10, display: "flex", alignItems: "center",
                                justifyContent: "center", fontFamily: "JetBrains Mono, monospace",
                                fontSize: 12, fontWeight: 700,
                                color: i === bucket ? "#fff" : "#555",
                                transition: "all 0.3s ease",
                            }}>
                                {i === bucket ? `"${(inputKey || "hello").slice(0, 4)}"` : "—"}
                            </div>
                            <span className="text-[10px] font-mono text-[#929292]">[{i}]</span>
                        </div>
                    ))}
                </div>

                <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs text-[#aaacae] leading-[1.7]">
                    <div className="text-[#929292] mb-1">// Step by step for "{inputKey || "hello"}"</div>
                    {(inputKey || "hello").split("").map((ch, i) => {
                        let h = 0;
                        for (let j = 0; j <= i; j++) h = (h * 31 + (inputKey || "hello").charCodeAt(j)) % tableSize;
                        return (
                            <div key={i}>
                                char '{ch}' (code {(inputKey || "hello").charCodeAt(i)}) → hash = <span className="text-white">{h}</span>
                            </div>
                        );
                    })}
                    <div className="mt-1 text-white">Final bucket: <strong>{bucket}</strong></div>
                </div>

                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-white">
                    <strong>Collision:</strong> Two different keys can hash to the same bucket. Real hash maps handle this via{" "}
                    <strong>chaining</strong> (a linked list at each bucket) or <strong>open addressing</strong> (probe to the next empty slot).
                </div>
            </Card>
        </Section>
    );
}

/* ─── 3. LIVE HASHING ─── */
function LiveOps() {
    const [map, setMap] = useState({ "apple": 2, "banana": 1 });
    const [keyInput, setKeyInput] = useState("");
    const [valInput, setValInput] = useState("");
    const [searchKey, setSearchKey] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [log, setLog] = useState([]);
    const [flashKey, setFlashKey] = useState(null);

    const addLog = (msg) => setLog(p => [msg, ...p].slice(0, 6));

    const flash = (key, cb) => {
        setFlashKey(key);
        setTimeout(() => { setFlashKey(null); cb && cb(); }, 500);
    };

    const handleSet = () => {
        if (!keyInput) return;
        const v = valInput || String(Math.floor(Math.random() * 9 + 1));
        flash(keyInput, () => setMap(p => ({ ...p, [keyInput]: Number(v) || v })));
        addLog(`set("${keyInput}", ${v}) → O(1) insert`);
        setKeyInput(""); setValInput("");
    };

    const handleDelete = (k) => {
        flash(k, () => setMap(p => { const n = { ...p }; delete n[k]; return n; }));
        addLog(`delete("${k}") → O(1) remove`);
    };

    const handleSearch = () => {
        if (!searchKey) return;
        const found = searchKey in map;
        setSearchResult({ key: searchKey, found, value: map[searchKey] });
        addLog(`get("${searchKey}") → ${found ? map[searchKey] : "undefined"} (O(1))`);
    };

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="⚡" text="Live Hash Map" />
                <p className="text-[#929292] text-sm mb-5 font-mono">
                    // Insert, delete, and search keys in real time
                </p>

                {/* Current map display */}
                <div className="flex gap-2 flex-wrap min-h-[60px] mb-5 items-start">
                    {Object.entries(map).map(([k, v]) => (
                        <div key={k} className="flex flex-col items-center gap-1">
                            <div style={{
                                padding: "8px 14px", minWidth: 80,
                                background: flashKey === k ? "#22222a" : "#333",
                                border: `2px solid ${flashKey === k ? "#fff" : "#929292"}`,
                                borderRadius: 10, display: "flex", alignItems: "center",
                                justifyContent: "center", fontFamily: "JetBrains Mono, monospace",
                                fontSize: 12, fontWeight: 700,
                                color: flashKey === k ? "#fff" : "#aaacae",
                                transform: flashKey === k ? "translateY(-8px) scale(1.08)" : "scale(1)",
                                transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                                cursor: "pointer",
                            }}
                                onClick={() => handleDelete(k)}
                                title="Click to delete"
                            >
                                {k}: {v}
                            </div>
                            <span className="text-[9px] text-[#929292] font-mono">click to delete</span>
                        </div>
                    ))}
                    {Object.keys(map).length === 0 && (
                        <span className="text-[#929292] font-mono text-sm">{"{ } ← empty"}</span>
                    )}
                </div>

                {/* Insert controls */}
                <div className="flex gap-2 mb-3 flex-wrap">
                    <input value={keyInput} onChange={e => setKeyInput(e.target.value)}
                        placeholder="key (string)"
                        className="bg-[#333] border border-[#929292] rounded-[10px] px-3 py-2 text-white font-mono text-[13px] outline-none w-36" />
                    <input value={valInput} onChange={e => setValInput(e.target.value)}
                        placeholder="value (blank=random)"
                        className="bg-[#333] border border-[#929292] rounded-[10px] px-3 py-2 text-white font-mono text-[13px] outline-none w-40" />
                    <button onClick={handleSet}
                        className="bg-[#333] border border-[#929292] rounded-xl px-4 py-2 text-white font-mono text-xs font-bold cursor-pointer hover:bg-[#444] transition-all">
                        set(key, val)
                    </button>
                    <button onClick={() => { setMap({}); setLog([]); addLog("map cleared"); }}
                        className="bg-[#333] border border-[#929292] rounded-xl px-4 py-2 text-[#929292] font-mono text-xs font-bold cursor-pointer hover:bg-[#444] transition-all">
                        clear()
                    </button>
                </div>

                {/* Search controls */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    <input value={searchKey} onChange={e => setSearchKey(e.target.value)}
                        placeholder="search key..."
                        className="bg-[#333] border border-[#929292] rounded-[10px] px-3 py-2 text-white font-mono text-[13px] outline-none w-36" />
                    <button onClick={handleSearch}
                        className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-2 text-indigo-400 font-mono text-xs font-bold cursor-pointer hover:bg-indigo-500/20 transition-all">
                        get(key)
                    </button>
                </div>

                {searchResult && (
                    <div className={`rounded-xl px-4 py-3 font-mono text-xs mb-3 ${searchResult.found ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                        {searchResult.found
                            ? `✔ map.get("${searchResult.key}") = ${searchResult.value} — found in O(1)`
                            : `✘ map.get("${searchResult.key}") = undefined — key not found`
                        }
                    </div>
                )}

                {log.length > 0 && (
                    <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs">
                        {log.map((l, i) => (
                            <div key={i} style={{ color: i === 0 ? "#e2e8f0" : "#555", opacity: 1 - i * 0.15 }}>
                                {i === 0 ? "▶ " : "  "}{l}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </Section>
    );
}

/* ─── 4. FREQUENCY MAP DEMO ─── */
function FrequencyDemo() {
    const presets = [
        [1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
        [5, 1, 5, 2, 5, 3, 5],
        [7, 7, 8, 8, 9],
    ];
    const [active, setActive] = useState(0);
    const [step, setStep] = useState(0);

    const arr = presets[active];
    const steps = [];
    const map = {};
    for (let i = 0; i < arr.length; i++) {
        map[arr[i]] = (map[arr[i]] || 0) + 1;
        steps.push({ idx: i, val: arr[i], map: { ...map } });
    }
    const cur = steps[Math.min(step, steps.length - 1)];

    useEffect(() => setStep(0), [active]);

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="📊" text="Frequency Map — Step by Step" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    A <strong className="text-white">frequency map</strong> counts how many times each value appears.
                    It's the foundation for dozens of interview problems: top-K elements, anagram detection, majority
                    element, and more. Step through to watch the map build element by element.
                </p>

                <div className="flex gap-2 mb-4">
                    {presets.map((p, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className="rounded-lg px-3 py-1.5 font-mono text-xs font-bold cursor-pointer transition-all"
                            style={{
                                background: active === i ? "#000" : "#333",
                                border: `1px solid ${active === i ? "#fff" : "#929292"}`,
                                color: active === i ? "#fff" : "#929292",
                            }}>
                            [{p.join(",")}]
                        </button>
                    ))}
                </div>

                {/* Array */}
                <div className="flex gap-2 flex-wrap mb-4">
                    {arr.map((v, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div style={{
                                width: 40, height: 40,
                                background: i === cur.idx ? "#22222a" : i < cur.idx ? "#1e1e1e" : "#333",
                                border: `2px solid ${i === cur.idx ? "#fff" : i < cur.idx ? "#444" : "#929292"}`,
                                borderRadius: 8, display: "flex", alignItems: "center",
                                justifyContent: "center", fontFamily: "JetBrains Mono, monospace",
                                fontSize: 13, fontWeight: 700,
                                color: i === cur.idx ? "#fff" : i < cur.idx ? "#555" : "#aaacae",
                                transition: "all 0.3s ease",
                            }}>
                                {v}
                            </div>
                            <span className="text-[10px] text-[#929292] font-mono">[{i}]</span>
                        </div>
                    ))}
                </div>

                {/* Current map state */}
                <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs mb-3">
                    <div className="text-[#929292] mb-2">// freq map at step {step + 1}</div>
                    <div className="flex gap-3 flex-wrap">
                        {Object.entries(cur.map).map(([k, v]) => (
                            <span key={k} style={{
                                background: Number(k) === cur.val ? "#22222a" : "#333",
                                border: `1px solid ${Number(k) === cur.val ? "#fff" : "#929292"}`,
                                borderRadius: 6, padding: "3px 10px", color: "#aaacae",
                                fontWeight: Number(k) === cur.val ? 700 : 400,
                                color: Number(k) === cur.val ? "#fff" : "#aaacae",
                                transition: "all 0.3s ease",
                            }}>
                                {k}: {v}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-[#333] border border-[#929292] rounded-xl px-4 py-3 font-mono text-xs mb-3">
                    Processing arr[{cur.idx}] = <strong className="text-white">{cur.val}</strong>
                    {" → "}freq[{cur.val}] = <strong className="text-white">{cur.map[cur.val]}</strong>
                </div>

                <div className="flex gap-2 items-center">
                    <button onClick={() => setStep(s => Math.max(0, s - 1))}
                        className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-[13px] hover:bg-[#444]">← Prev</button>
                    <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                        className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-1.5 text-indigo-400 cursor-pointer text-[13px] font-bold hover:bg-indigo-500/20">
                        Next →</button>
                    <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 5. PATTERNS ─── */
function Patterns() {
    const [active, setActive] = useState(0);

    const patterns = [
        {
            name: "Frequency Count",
            when: "Count occurrences, find duplicates, top-K elements",
            how: "Iterate once, store counts in a map. O(n) time, O(n) space.",
            code: `function countFrequency(arr) {
  const freq = new Map();

  for (const num of arr) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  return freq;
}

// Usage
const freq = countFrequency([1, 2, 2, 3, 3, 3]);
// Map { 1 → 1, 2 → 2, 3 → 3 }`,
            examples: ["Top K Frequent", "Sort Characters by Freq", "Find All Duplicates"],
        },
        {
            name: "Two Sum (Hash)",
            when: "Find a pair summing to target — works on UNSORTED arrays",
            how: "For each element, check if (target - element) is already in the map.",
            code: `function twoSum(nums, target) {
  const seen = new Map(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return null;
}

// Input: [2, 7, 11, 15], target=9 → [0, 1]`,
            examples: ["Two Sum", "Subarray Sum = K", "Pair with Difference K"],
        },
        {
            name: "Anagram Detection",
            when: "Check if two strings use the same characters",
            how: "Build a frequency map for one string, decrement for the other. All zeros = anagram.",
            code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const freq = {};
  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;
  for (const ch of t) {
    if (!freq[ch]) return false;
    freq[ch]--;
  }
  return true;
}

// "anagram" vs "nagaram" → true
// "rat"     vs "car"     → false`,
            examples: ["Valid Anagram", "Group Anagrams", "Find All Anagrams"],
        },
        {
            name: "Sliding Window + Hash",
            when: "Longest substring with at most K distinct chars, window conditions",
            how: "Expand with right pointer. Shrink with left when map constraint is violated.",
            code: `function longestKDistinct(s, k) {
  const freq = new Map();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);

    while (freq.size > k) {
      freq.set(s[left], freq.get(s[left]) - 1);
      if (freq.get(s[left]) === 0) freq.delete(s[left]);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
            examples: ["Longest Substr K Distinct", "Minimum Window Substr", "Fruits Into Baskets"],
        },
        {
            name: "Prefix Sum + Hash",
            when: "Subarray with exact sum K, count subarrays",
            how: "Store prefix sums in map. If (prefixSum - K) exists, a valid subarray ends here.",
            code: `function subarraySum(nums, k) {
  const prefixCount = new Map([[0, 1]]);
  let sum = 0, count = 0;

  for (const num of nums) {
    sum += num;

    if (prefixCount.has(sum - k)) {
      count += prefixCount.get(sum - k);
    }
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1);
  }
  return count;
}

// Count subarrays with sum = k`,
            examples: ["Subarray Sum = K", "Continuous Subarray Sum", "Count Nice Subarrays"],
        },
    ];

    const p = patterns[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="💡" text="Pattern Variants" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    Hashing powers five major problem patterns. Each pattern solves a whole category of LeetCode problems once
                    you recognise the template.
                </p>

                <div className="flex gap-2 flex-wrap mb-5">
                    {patterns.map((pt, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className="rounded-xl px-4 py-2 cursor-pointer text-[13px] font-bold transition-all duration-200"
                            style={{
                                background: active === i ? "#000" : "#333",
                                border: `1px solid ${active === i ? "#fff" : "#929292"}`,
                                color: active === i ? "#fff" : "#929292",
                            }}>
                            {pt.name}
                        </button>
                    ))}
                </div>

                <div className="bg-[#1e1e1e] rounded-2xl p-5 border border-[#2a2a2a]">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#333] rounded-xl p-3.5">
                            <div className="text-[11px] text-[#929292] font-mono mb-1">WHEN TO USE</div>
                            <div className="text-sm text-[#e2e8f0]">{p.when}</div>
                        </div>
                        <div className="bg-[#333] rounded-xl p-3.5">
                            <div className="text-[11px] text-[#929292] font-mono mb-1">HOW IT WORKS</div>
                            <div className="text-sm text-[#e2e8f0]">{p.how}</div>
                        </div>
                    </div>

                    <div className="text-[11px] text-[#929292] font-mono mb-2">// Implementation</div>
                    <CodeBlock code={p.code} />

                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                        <span className="text-[11px] text-[#929292] font-mono">LeetCode problems:</span>
                        {p.examples.map((ex, i) => (
                            <span key={i} className="bg-[#222] border border-[#333] rounded-full px-2.5 py-0.5 text-[11px] font-mono text-[#aaacae]">
                                {ex}
                            </span>
                        ))}
                    </div>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 6. COMPLEXITY ─── */
function Complexity() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const rows = [
        { op: "Insert (set key)", time: "O(1)*", space: "O(n)", bar: 5, note: "*Amortized — occasional rehash on resize" },
        { op: "Lookup (get key)", time: "O(1)*", space: "O(n)", bar: 5, note: "Direct bucket access via hash function" },
        { op: "Delete (remove key)", time: "O(1)*", space: "O(n)", bar: 5, note: "Hash to bucket, remove entry" },
        { op: "Check existence (has)", time: "O(1)*", space: "O(n)", bar: 5, note: "Same as lookup — just checks presence" },
        { op: "Iterate all keys", time: "O(n)", space: "O(n)", bar: 52, note: "Must visit every stored key once" },
        { op: "Worst case (many collisions)", time: "O(n)", space: "O(n)", bar: 52, note: "All keys collide into one bucket — chain traversal" },
        { op: "Build freq map", time: "O(n)", space: "O(n)", bar: 52, note: "One pass through the input array" },
        { op: "Array lookup (no hash)", time: "O(n)", space: "O(1)", bar: 52, note: "Linear scan — what hashing replaces" },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⏱️" text="Complexity Reference" />
                <p className="text-[#aaacae] text-sm mb-5">
                    Hash map O(1) operations are why it's the most powerful tool for reducing O(n²) to O(n). Bars animate on scroll.
                </p>
                <div ref={ref} className="flex flex-col gap-2.5">
                    {rows.map((r, i) => (
                        <div key={i} className="bg-[#333] border border-[#929292] rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[13px] text-[#e2e8f0]">{r.op}</span>
                                <div className="flex gap-2">
                                    <span className="text-[11px] font-mono bg-[#222] px-2 py-0.5 rounded text-white">{r.time}</span>
                                    <span className="text-[11px] font-mono bg-[#222] px-2 py-0.5 rounded text-[#929292]">{r.space}</span>
                                </div>
                            </div>
                            <div className="h-1.5 bg-[#222] rounded-full overflow-hidden mb-1.5">
                                <div style={{
                                    height: "100%", borderRadius: 99,
                                    background: i < 4 ? "#306ed2" : "#306ed2",
                                    width: visible ? `${r.bar}%` : "0%",
                                    transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`,
                                }} />
                            </div>
                            <div className="text-[11px] text-[#929292]">{r.note}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 7. CLASSIC PROBLEMS ─── */
function ClassicProblems() {
    const [active, setActive] = useState(0);
    const problems = [
        {
            title: "Contains Duplicate",
            difficulty: "Easy",
            code: `function containsDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
// [1,2,3,1] → true   [1,2,3,4] → false`,
        },
        {
            title: "Group Anagrams",
            difficulty: "Medium",
            code: `function groupAnagrams(strs) {
  const map = new Map();

  for (const str of strs) {
    const key = str.split("").sort().join(""); // sorted form = canonical key
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
}
// ["eat","tea","tan","ate","nat","bat"]
// → [["eat","tea","ate"],["tan","nat"],["bat"]]`,
        },
        {
            title: "Top K Frequent Elements",
            difficulty: "Medium",
            code: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  // bucket sort by frequency
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, cnt] of freq) buckets[cnt].push(num);

  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  return result.slice(0, k);
}
// [1,1,1,2,2,3], k=2 → [1, 2]`,
        },
        {
            title: "Longest Consecutive Sequence",
            difficulty: "Medium",
            code: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const n of set) {
    // only start counting from sequence beginnings
    if (!set.has(n - 1)) {
      let cur = n, length = 1;
      while (set.has(cur + 1)) { cur++; length++; }
      longest = Math.max(longest, length);
    }
  }
  return longest;
}
// [100,4,200,1,3,2] → 4  (sequence: 1,2,3,4)`,
        },
        {
            title: "Subarray Sum Equals K",
            difficulty: "Medium",
            code: `function subarraySum(nums, k) {
  const prefixCount = new Map([[0, 1]]);
  let sum = 0, count = 0;

  for (const num of nums) {
    sum += num;
    // if (sum - k) was seen before, a subarray ending here sums to k
    count += prefixCount.get(sum - k) || 0;
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1);
  }
  return count;
}
// [1,1,1], k=2 → 2`,
        },
    ];

    const diffColor = { Easy: "#22d3a5", Medium: "#facc15", Hard: "#f43f5e" };
    const t = problems[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="📋" text="Classic Problems & Templates" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    These five problems are the most frequently asked hashing problems in interviews. Each template
                    covers a whole family of problems.
                </p>

                <div className="flex gap-2 flex-wrap mb-5">
                    {problems.map((tp, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className="rounded-xl px-3 py-1.5 cursor-pointer text-xs font-bold transition-all duration-200"
                            style={{
                                background: active === i ? "#000" : "#333",
                                border: `1px solid ${active === i ? "#fff" : "#929292"}`,
                                color: active === i ? "#fff" : "#929292",
                            }}>
                            {tp.title.split(" ")[0]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 mb-3">
                    <span className="text-white font-bold">{t.title}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full font-bold"
                        style={{ background: diffColor[t.difficulty] + "22", color: diffColor[t.difficulty], border: `1px solid ${diffColor[t.difficulty]}44` }}>
                        {t.difficulty}
                    </span>
                </div>
                <CodeBlock code={t.code} />
            </Card>
        </Section>
    );
}

/* ─── 8. MAP vs SET vs OBJECT ─── */
function MapVsSet() {
    const [active, setActive] = useState(0);
    const tabs = [
        {
            label: "Map",
            when: "Key-value pairs, keys are not strings, insertion order matters",
            code: `const map = new Map();

map.set("a", 1);         // insert
map.get("a");            // 1 — O(1)
map.has("a");            // true — O(1)
map.delete("a");         // O(1)
map.size;                // 0

// Iterate in insertion order
for (const [key, val] of map) { ... }

// Any key type — not just strings!
map.set([1,2], "array key");
map.set({id: 1}, "object key");`,
        },
        {
            label: "Set",
            when: "Unique values only, fast existence check, deduplication",
            code: `const set = new Set();

set.add(1);              // insert
set.add(1);              // no-op — already exists
set.has(1);              // true — O(1)
set.delete(1);           // O(1)
set.size;                // 0

// Deduplicate an array
const unique = [...new Set([1,2,2,3,3,3])];
// [1, 2, 3]

// Iterate
for (const val of set) { ... }`,
        },
        {
            label: "Object {}",
            when: "Simple string keys, JSON-compatible data, config maps",
            code: `const obj = {};

obj["key"] = 1;          // insert
obj["key"];              // 1 — O(1) average
"key" in obj;            // true
delete obj["key"];       // O(1)
Object.keys(obj).length; // 0

// ⚠ Keys are always coerced to strings
obj[1] === obj["1"];     // true

// ⚠ No guaranteed insertion order (pre-ES2015)
// ✔ Faster for simple string keys in V8`,
        },
        {
            label: "WeakMap / WeakRef",
            when: "Cache tied to object lifetime, avoid memory leaks",
            code: `const cache = new WeakMap();

let obj = { id: 1 };
cache.set(obj, "cached data");
cache.get(obj); // "cached data"

// When obj is garbage collected,
// the cache entry is automatically removed.
// Perfect for DOM node caches.

// ⚠ Keys must be objects, not primitives
// ⚠ Not iterable — can't list keys`,
        },
    ];
    const t = tabs[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🗂️" text="Map vs Set vs Object" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    JavaScript gives you four hashing tools. Picking the right one signals seniority in interviews.
                </p>

                <div className="flex gap-2 flex-wrap mb-5">
                    {tabs.map((tb, i) => (
                        <button key={i} onClick={() => setActive(i)}
                            className="rounded-xl px-4 py-2 cursor-pointer text-[13px] font-bold transition-all duration-200"
                            style={{
                                background: active === i ? "#000" : "#333",
                                border: `1px solid ${active === i ? "#fff" : "#929292"}`,
                                color: active === i ? "#fff" : "#929292",
                            }}>
                            {tb.label}
                        </button>
                    ))}
                </div>

                <div className="bg-[#333] rounded-xl p-3.5 mb-3">
                    <div className="text-[11px] text-[#929292] font-mono mb-1">BEST FOR</div>
                    <div className="text-sm text-[#e2e8f0]">{t.when}</div>
                </div>
                <CodeBlock code={t.code} />
            </Card>
        </Section>
    );
}

/* ─── 9. WHEN TO USE ─── */
function WhenToUse() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🧠" text="Decision Guide" />
                <p className="text-[#c9cdd4] text-sm mb-5 leading-[1.7]">
                    The skill isn't implementing a hash map — it's <strong className="text-white">knowing when to reach for one</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                        {
                            label: "✅ Use Hashing when…",
                            items: [
                                "Need O(1) lookup / insert",
                                "Counting frequencies",
                                "Detecting duplicates",
                                "Caching computed results (memoize)",
                                "Two Sum on unsorted array",
                                "Grouping items by property",
                                "Set membership / existence checks",
                            ], good: true,
                        },
                        {
                            label: "❌ Don't use Hashing when…",
                            items: [
                                "Need sorted order → use TreeMap/Array sort",
                                "Range queries → use sorted array + binary search",
                                "Pair sum on sorted array → use two pointer (O(1) space)",
                                "Memory is severely constrained (O(n) space cost)",
                                "Worst-case guarantee needed (collisions break O(1))",
                                "Keys are integers in a range → use array as index",
                            ], good: false,
                        },
                    ].map((col, ci) => (
                        <div key={ci} className="bg-[#333] rounded-2xl p-4"
                            style={{ borderLeft: `3px solid ${col.good ? "#22d3a5" : "#f43f5e"}` }}>
                            <div className="text-sm font-bold mb-3" style={{ color: col.good ? "#22d3a5" : "#f43f5e" }}>
                                {col.label}
                            </div>
                            {col.items.map((item, i) => (
                                <div key={i} className="text-xs text-[#aaacae] mb-1.5 leading-[1.5]">
                                    {col.good ? "→" : "×"} {item}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3.5">
                    <div className="text-xs font-mono text-[#929292] mb-2">// Pattern recognition</div>
                    <pre className="font-mono text-xs text-[#aaacae] leading-[1.7]">{`"find if X exists"              → Set / Map lookup
"count how many times"          → Frequency Map
"find pair summing to target"   → Hash Map (Two Sum)
"group items with same X"       → Map<key, List>
"longest with at most K"        → Sliding Window + Map
"subarray summing to K"         → Prefix Sum + Map
"detect cycle / duplicate"      → Set membership`}</pre>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 10. INTERVIEW TIPS ─── */
function InterviewTips() {
    const tips = [
        { icon: "🔍", title: "Spot the O(n²) clue", body: "If the brute force needs nested loops to compare or search, a hash map almost always brings it to O(n). That's the interview signal." },
        { icon: "🗝️", title: "Choose your key carefully", body: "The key is everything. For anagrams, the key is the sorted string. For subarrays, it's the prefix sum. Wrong key = wrong solution." },
        { icon: "📦", title: "Initialise with a default", body: "Always handle the missing-key case: `map.get(k) || 0`. Forgetting this causes silent bugs when the key doesn't exist yet." },
        { icon: "🔢", title: "Prefix sum + map combo", body: "For subarray sum problems, pair a running sum with a map. Store prefixCount[0] = 1 before the loop — it handles subarrays starting at index 0." },
        { icon: "🧪", title: "Test with edge cases", body: "Empty input, single element, all same values, negative numbers, target = 0. Hash maps with negative keys behave fine — check your logic, not the structure." },
        { icon: "💾", title: "State the space trade-off", body: "Always mention you're trading O(n) space for O(1) time. Interviewers want to hear you know the cost — it shows deeper understanding." },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🎓" text="Interview Tips" />
                <div className="grid grid-cols-2 gap-3">
                    {tips.map((t, i) => (
                        <div key={i} className="bg-[#333] rounded-2xl p-4" style={{ borderLeft: "3px solid #929292" }}>
                            <div className="text-[13px] font-bold text-white mb-1.5">{t.icon} {t.title}</div>
                            <p className="text-xs text-[#aaacae] leading-[1.65] m-0">{t.body}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 11. QUICK REF ─── */
function QuickRef() {
    const rows = [
        ["new Map()", "Create empty map"],
        ["map.set(k, v)", "Insert / update key — O(1)"],
        ["map.get(k)", "Get value by key — O(1)"],
        ["map.has(k)", "Check key exists — O(1)"],
        ["map.delete(k)", "Remove key — O(1)"],
        ["map.size", "Number of entries"],
        ["new Set()", "Create empty set"],
        ["set.add(v)", "Add value — O(1)"],
        ["set.has(v)", "Check membership — O(1)"],
        ["set.delete(v)", "Remove value — O(1)"],
        ["[...new Set(arr)]", "Deduplicate array"],
        ["Object.keys(obj)", "Array of all keys"],
        ["Object.values(obj)", "Array of all values"],
        ["Object.entries(obj)", "Array of [key, value] pairs"],
        ["for (const [k,v] of map)", "Iterate map in order"],
        ["map.get(k) || 0", "Safe default for missing key"],
    ];

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="📋" text="Quick Reference" />
                <div className="flex flex-col gap-1">
                    {rows.map(([method, desc], i) => (
                        <div key={i}
                            className={`grid gap-3 px-3 py-2 rounded-lg items-center ${i % 2 === 0 ? "bg-[#333]" : "bg-transparent"}`}
                            style={{ gridTemplateColumns: "260px 1fr" }}>
                            <code className="font-mono text-xs font-bold text-white">{method}</code>
                            <span className="text-xs text-[#929292]">{desc}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── ROOT ─── */
export default function HashingPage() {
    return (
        <div className="arr-root min-h-screen text-white px-5 py-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <GlobalStyles />
            <div className="text-center mb-10 fade-up">
                <h1 className="text-4xl font-extrabold m-0 tracking-tight text-white">Hashing</h1>
                <p className="text-base text-[#aaacae] mt-2.5 leading-[1.7]">
                    The single most powerful technique for reducing O(n²) solutions to O(n). Master the map.
                </p>
            </div>

            <Intro />
            <HowItWorks />
            <LiveOps />
            <FrequencyDemo />
            <Patterns />
            <Complexity />
            <ClassicProblems />
            <MapVsSet />
            <WhenToUse />
            <InterviewTips />
            <QuickRef />

            <div className="text-center py-6 text-[#929292] text-[13px]">
                When in doubt, throw a hash map at it — then explain why 🚀
            </div>
        </div>
    );
}