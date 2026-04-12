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
    return (
        <Section>
            <Card>
                <STitle icon="📌" text="What is Two Pointer?" />
                <p className="text-[#c9cdd4] leading-[1.75] mb-4 text-[15px]">
                    The <strong className="text-white">Two Pointer</strong> technique places two indices —{" "}
                    <code className="bg-[#333] px-1.5 py-0.5 rounded text-[#aaacae] font-mono text-xs">left</code> and{" "}
                    <code className="bg-[#333] px-1.5 py-0.5 rounded text-[#aaacae] font-mono text-xs">right</code> — at
                    different positions and moves them based on a condition. This eliminates the need for a nested loop,
                    reducing time complexity from <strong className="text-white">O(n²) → O(n)</strong> while using{" "}
                    <strong className="text-white">O(1)</strong> extra space.
                </p>
                <p className="text-[#c9cdd4] leading-[1.75] mb-5 text-[15px]">
                    It works best on <strong className="text-white">sorted arrays</strong> because sorting gives you a
                    predictable guarantee: moving the left pointer right increases the sum, moving the right pointer left
                    decreases it — letting you eliminate half the search space every step.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        {
                            label: "❌ Brute Force — O(n²)",
                            color: "#929292",
                            code: `for (let i = 0; i < n; i++) {
  for (let j = i+1; j < n; j++) {
    if (arr[i]+arr[j] === target)
      return [i, j];
  }
}`,
                        },
                        {
                            label: "✅ Two Pointer — O(n)",
                            color: "#929292",
                            code: `let l = 0, r = arr.length - 1;
while (l < r) {
  const s = arr[l] + arr[r];
  if (s === target) return [l,r];
  s < target ? l++ : r--;
}`,
                        },
                    ].map((ex, i) => (
                        <div key={i} className="bg-[#333] rounded-xl px-4 py-3.5" style={{ border: `1px solid ${ex.color}33` }}>
                            <div className="text-[11px] font-bold mb-2 font-mono" style={{ color: ex.color }}>
                                {ex.label}
                            </div>
                            <pre className="m-0 font-mono text-xs text-[#aaacae] whitespace-pre-wrap">{ex.code}</pre>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 2. VISUAL MECHANICS ─── */
function Mechanics() {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(arr.length - 1);
    const [history, setHistory] = useState([]);

    const reset = () => { setLeft(0); setRight(arr.length - 1); setHistory([]); };

    const moveLeft = () => {
        if (left < right) {
            setHistory(h => [`L moved: [${left}] → [${left + 1}]`, ...h].slice(0, 5));
            setLeft(l => l + 1);
        }
    };
    const moveRight = () => {
        if (right > left) {
            setHistory(h => [`R moved: [${right}] → [${right - 1}]`, ...h].slice(0, 5));
            setRight(r => r - 1);
        }
    };

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="🔬" text="How the Pointers Move" />
                <p className="text-[#929292] text-sm mb-4 font-mono">
                    // Use the buttons to move the pointers and observe how they converge
                </p>

                {/* Array visual */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {arr.map((num, i) => {
                        const isL = i === left;
                        const isR = i === right;
                        const between = i > left && i < right;
                        return (
                            <div key={i} className="arr-item flex flex-col items-center gap-1">
                                <span
                                    className="text-[11px] font-mono font-bold h-4"
                                    style={{ color: isL ? "#22d3a5" : isR ? "#f43f5e" : "transparent" }}
                                >
                                    {isL ? "L" : isR ? "R" : " "}
                                </span>
                                <div
                                    style={{
                                        width: 52,
                                        height: 52,
                                        background: isL ? "#22d3a522" : isR ? "#f43f5e22" : between ? "#22222a" : "#333",
                                        border: `2px solid ${isL ? "#22d3a5" : isR ? "#f43f5e" : between ? "#444" : "#929292"}`,
                                        borderRadius: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "JetBrains Mono, monospace",
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: isL ? "#22d3a5" : isR ? "#f43f5e" : between ? "#555" : "#e2e8f0",
                                        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                    }}
                                >
                                    {num}
                                </div>
                                <span className="text-[10px] text-[#929292] font-mono">[{i}]</span>
                            </div>
                        );
                    })}
                </div>

                {/* State display */}
                <div className="bg-[#333] border border-[#929292] rounded-xl px-4 py-3 font-mono text-xs mb-4">
                    <span style={{ color: "#22d3a5" }}>L = {left}</span>
                    {"  "}
                    <span style={{ color: "#f43f5e" }}>R = {right}</span>
                    {"  "}
                    <span className="text-[#aaacae]">
                        sum = arr[{left}] + arr[{right}] ={" "}
                        <strong className="text-white">{arr[left] + arr[right]}</strong>
                    </span>
                    {"  "}
                    {left >= right && <span className="text-yellow-400">⚠ Pointers met — stop!</span>}
                </div>

                {/* Controls */}
                <div className="flex gap-2 flex-wrap mb-4">
                    {[
                        { label: "L →  move left", action: moveLeft, disabled: left >= right },
                        { label: "← move right  R", action: moveRight, disabled: right <= left },
                        { label: "reset", action: reset, disabled: false },
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={btn.action}
                            disabled={btn.disabled}
                            className="rounded-xl py-2 px-4 font-mono text-xs font-bold transition-all duration-200 cursor-pointer"
                            style={{
                                background: btn.disabled ? "#222" : "#333",
                                border: `1px solid ${btn.disabled ? "#333" : "#929292"}`,
                                color: btn.disabled ? "#444" : "#e2e8f0",
                                cursor: btn.disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {/* History log */}
                {history.length > 0 && (
                    <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs">
                        {history.map((h, i) => (
                            <div key={i} style={{ color: i === 0 ? "#e2e8f0" : "#555", opacity: 1 - i * 0.18 }}>
                                {i === 0 ? "▶ " : "  "}{h}
                            </div>
                        ))}
                    </div>
                )}

                {/* Key insight */}
                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-white">
                    <strong>Key Insight:</strong> Each step eliminates at least one element from consideration. After at most{" "}
                    <code className="font-mono text-xs bg-[#333] px-1 rounded">n</code> moves the pointers meet — that's why
                    it's <strong>O(n)</strong>.
                </div>
            </Card>
        </Section>
    );
}

/* ─── 3. INTERACTIVE TWO SUM ─── */
function TwoSumDemo() {
    const arr = [1, 3, 5, 7, 9, 11, 13];
    const [target, setTarget] = useState(14);
    const steps = (() => {
        const s = [];
        let l = 0, r = arr.length - 1;
        while (l < r) {
            const sum = arr[l] + arr[r];
            s.push({ l, r, sum, found: sum === target });
            if (sum === target) break;
            else if (sum < target) l++;
            else r--;
        }
        return s;
    })();
    const [step, setStep] = useState(0);
    const cur = steps[Math.min(step, steps.length - 1)];

    useEffect(() => setStep(0), [target]);

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="🎯" text="Two Sum — Step by Step" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    Given a <strong className="text-white">sorted array</strong>, find two numbers that sum to a target. Click
                    through each step to see exactly how the algorithm decides which pointer to move.
                </p>

                {/* Target selector */}
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#929292] font-mono text-xs">target =</span>
                    {[8, 14, 20, 24].map(t => (
                        <button
                            key={t}
                            onClick={() => setTarget(t)}
                            className="rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-all duration-200 cursor-pointer"
                            style={{
                                background: target === t ? "#000" : "#333",
                                border: `1px solid ${target === t ? "#fff" : "#929292"}`,
                                color: target === t ? "#fff" : "#929292",
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Array */}
                <div className="flex gap-2 mb-3 flex-wrap">
                    {arr.map((v, i) => {
                        const isL = i === cur.l, isR = i === cur.r;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span className="text-[11px] font-mono font-bold h-4"
                                    style={{ color: isL ? "#22d3a5" : isR ? "#f43f5e" : "transparent" }}>
                                    {isL ? "L" : isR ? "R" : " "}
                                </span>
                                <div style={{
                                    width: 48, height: 48,
                                    background: cur.found && (isL || isR) ? "#22d3a522" : isL ? "#22d3a514" : isR ? "#f43f5e14" : "#333",
                                    border: `2px solid ${cur.found && (isL || isR) ? "#22d3a5" : isL ? "#22d3a5" : isR ? "#f43f5e" : "#929292"}`,
                                    borderRadius: 10,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                                    color: cur.found && (isL || isR) ? "#22d3a5" : isL ? "#22d3a5" : isR ? "#f43f5e" : "#e2e8f0",
                                    transition: "all 0.35s ease",
                                }}>
                                    {v}
                                </div>
                                <span className="text-[10px] text-[#929292] font-mono">[{i}]</span>
                            </div>
                        );
                    })}
                </div>

                {/* Step info */}
                <div className="bg-[#333] border border-[#929292] rounded-xl px-4 py-3 font-mono text-xs mb-3">
                    <span style={{ color: "#22d3a5" }}>arr[{cur.l}]={arr[cur.l]}</span>
                    {" + "}
                    <span style={{ color: "#f43f5e" }}>arr[{cur.r}]={arr[cur.r]}</span>
                    {" = "}
                    <span style={{ color: cur.found ? "#22d3a5" : "#facc15", fontWeight: 700 }}>{cur.sum}</span>
                    {cur.found && <span style={{ color: "#22d3a5" }}> ✔ Found! Return [{cur.l}, {cur.r}]</span>}
                    {!cur.found && cur.sum < target && (
                        <span className="text-[#aaacae]"> &lt; {target} → move L right (need bigger sum)</span>
                    )}
                    {!cur.found && cur.sum > target && (
                        <span className="text-[#aaacae]"> &gt; {target} → move R left (need smaller sum)</span>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex gap-2 items-center">
                    <button onClick={() => setStep(s => Math.max(0, s - 1))}
                        className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-[13px] hover:bg-[#444]">
                        ← Prev
                    </button>
                    <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                        className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-1.5 text-indigo-400 cursor-pointer text-[13px] font-bold hover:bg-indigo-500/20">
                        Next →
                    </button>
                    <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 4. PALINDROME DEMO ─── */
function PalindromeDemo() {
    const examples = ["racecar", "hello", "madam", "world", "level", "abcba"];
    const [word, setWord] = useState("racecar");
    const [custom, setCustom] = useState("");

    const check = (s) => {
        const steps = [];
        let l = 0, r = s.length - 1;
        while (l <= r) {
            steps.push({ l, r, match: s[l] === s[r] });
            if (s[l] !== s[r]) break;
            l++; r--;
        }
        return steps;
    };

    const target = custom.trim() || word;
    const steps = check(target);
    const [step, setStep] = useState(0);
    const cur = steps[Math.min(step, steps.length - 1)];
    const isPalin = steps.every(s => s.match);

    useEffect(() => setStep(0), [target]);

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="🔁" text="Palindrome Check" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    A string is a <strong className="text-white">palindrome</strong> if it reads the same forwards and
                    backwards. Two pointer places <code className="bg-[#333] px-1 rounded font-mono text-xs">L</code> at
                    the start and <code className="bg-[#333] px-1 rounded font-mono text-xs">R</code> at the end, comparing
                    characters and moving inward. One mismatch → not a palindrome.
                </p>

                <div className="flex gap-2 flex-wrap mb-4">
                    {examples.map(w => (
                        <button key={w} onClick={() => { setWord(w); setCustom(""); }}
                            className="rounded-lg px-3 py-1.5 font-mono text-xs font-bold cursor-pointer transition-all"
                            style={{
                                background: word === w && !custom ? "#000" : "#333",
                                border: `1px solid ${word === w && !custom ? "#fff" : "#929292"}`,
                                color: word === w && !custom ? "#fff" : "#929292",
                            }}>
                            {w}
                        </button>
                    ))}
                </div>

                <input
                    value={custom}
                    onChange={e => setCustom(e.target.value.toLowerCase().replace(/[^a-z]/g, ""))}
                    placeholder="Type your own word…"
                    className="w-full bg-[#333] border border-[#929292] rounded-[10px] px-3.5 py-2.5 text-white font-mono text-[13px] outline-none mb-4"
                />

                {/* Character display */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                    {target.split("").map((ch, i) => {
                        const isL = i === cur.l, isR = i === cur.r;
                        const checked = i < cur.l || i > cur.r;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-mono font-bold h-3.5"
                                    style={{ color: isL ? "#22d3a5" : isR ? "#f43f5e" : "transparent" }}>
                                    {isL ? "L" : isR ? "R" : " "}
                                </span>
                                <div style={{
                                    width: 36, height: 36,
                                    background: checked ? (isPalin ? "#22d3a511" : "#f43f5e11") : isL || isR ? (cur.match ? "#22d3a522" : "#f43f5e22") : "#333",
                                    border: `2px solid ${checked ? (isPalin ? "#22d3a544" : "#f43f5e44") : isL || isR ? (cur.match ? "#22d3a5" : "#f43f5e") : "#929292"}`,
                                    borderRadius: 8,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                                    color: checked ? (isPalin ? "#22d3a5" : "#f43f5e") : isL || isR ? (cur.match ? "#22d3a5" : "#f43f5e") : "#e2e8f0",
                                    transition: "all 0.3s ease",
                                }}>
                                    {ch}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-[#333] border border-[#929292] rounded-xl px-4 py-3 font-mono text-xs mb-3">
                    <span style={{ color: "#22d3a5" }}>s[{cur.l}]='{target[cur.l]}'</span>
                    {" vs "}
                    <span style={{ color: "#f43f5e" }}>s[{cur.r}]='{target[cur.r]}'</span>
                    {" → "}
                    {cur.match
                        ? <span style={{ color: "#22d3a5" }}>✔ Match — move both inward</span>
                        : <span style={{ color: "#f43f5e" }}>✘ Mismatch — NOT a palindrome</span>
                    }
                </div>

                <div className="flex gap-2 items-center mb-3">
                    <button onClick={() => setStep(s => Math.max(0, s - 1))}
                        className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-[13px] hover:bg-[#444]">← Prev</button>
                    <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                        className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-1.5 text-indigo-400 cursor-pointer text-[13px] font-bold hover:bg-indigo-500/20">
                        Next →
                    </button>
                    <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
                </div>

                {step === steps.length - 1 && (
                    <div className={`rounded-xl px-4 py-3 text-sm font-bold font-mono ${isPalin ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                        {isPalin ? `✔ "${target}" IS a palindrome` : `✘ "${target}" is NOT a palindrome`}
                    </div>
                )}
            </Card>
        </Section>
    );
}

/* ─── 5. PATTERNS ─── */
function Patterns() {
    const [active, setActive] = useState(0);

    const patterns = [
        {
            name: "Opposite Ends",
            when: "Sorted array, pair problems, palindrome check",
            how: "L starts at index 0, R starts at end. They move toward each other.",
            code: `function twoSum(arr, target) {
  let l = 0, r = arr.length - 1;

  while (l < r) {
    const sum = arr[l] + arr[r];
    if (sum === target) return [l, r];
    else if (sum < target) l++;  // need bigger
    else r--;                    // need smaller
  }
  return null; // no pair found
}`,
            examples: ["Two Sum II", "Valid Palindrome", "3Sum", "Container With Most Water"],
            complexity: "Time: O(n) — Space: O(1)",
        },
        {
            name: "Fast & Slow",
            when: "Cycle detection, finding midpoint, removing duplicates",
            how: "Slow moves 1 step, Fast moves 2 steps. When they meet, a cycle exists.",
            code: `// Remove duplicates from sorted array
function removeDuplicates(nums) {
  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast]; // overwrite
    }
  }
  return slow + 1; // new length
}`,
            examples: ["Remove Duplicates", "Linked List Cycle", "Find Middle Node", "Happy Number"],
            complexity: "Time: O(n) — Space: O(1)",
        },
        {
            name: "Same Direction",
            when: "Subarray problems, partitioning, in-place filter",
            how: "Both pointers move in the same direction. One reads, one writes.",
            code: `// Move all zeros to end, keep order
function moveZeroes(nums) {
  let write = 0;

  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  // fill rest with zeros
  while (write < nums.length) nums[write++] = 0;
}`,
            examples: ["Move Zeroes", "Sort Colors", "Partition Array", "Squares of Sorted Array"],
            complexity: "Time: O(n) — Space: O(1)",
        },
        {
            name: "Merge Two Arrays",
            when: "Merging sorted arrays, comparing two sequences",
            how: "One pointer per array. Advance whichever pointer points to the smaller value.",
            code: `// Merge two sorted arrays
function mergeSorted(a, b) {
  let i = 0, j = 0;
  const result = [];

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) result.push(a[i++]);
    else               result.push(b[j++]);
  }
  // append remaining elements
  return [...result, ...a.slice(i), ...b.slice(j)];
}`,
            examples: ["Merge Sorted Array", "Intersection of Two Arrays", "Compare Version Numbers"],
            complexity: "Time: O(n + m) — Space: O(n + m)",
        },
    ];

    const p = patterns[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="💡" text="Pattern Variants" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    Two pointer is not one trick — it's a family of four distinct movement strategies. Recognising which
                    variant applies is the key interview skill.
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
                    <div className="mt-3 text-xs font-mono text-[#929292]">{p.complexity}</div>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 6. COMPLEXITY TABLE ─── */
function Complexity() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const rows = [
        { op: "Opposite ends (sorted array)", time: "O(n)", space: "O(1)", bar: 50, note: "One pass, both pointers converge" },
        { op: "Fast & slow pointer", time: "O(n)", space: "O(1)", bar: 50, note: "Slow×1, fast×2 — cycle detected when they meet" },
        { op: "Same-direction (read/write)", time: "O(n)", space: "O(1)", bar: 50, note: "In-place filter/partition, single pass" },
        { op: "Merge two sorted arrays", time: "O(n+m)", space: "O(n+m)", bar: 60, note: "One pointer per array, output buffer required" },
        { op: "3Sum (sort + two pointer)", time: "O(n²)", space: "O(1)*", bar: 80, note: "*Excluding output. Outer loop O(n) × inner O(n)" },
        { op: "Brute force (nested loops)", time: "O(n²)", space: "O(1)", bar: 100, note: "What two pointer replaces — shown for contrast" },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⏱️" text="Complexity Reference" />
                <p className="text-[#aaacae] text-sm mb-5">
                    Bars animate on scroll. Two pointer consistently delivers O(n) with O(1) space — that's the win.
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

/* ─── 7. PROBLEM TEMPLATES ─── */
function Templates() {
    const [active, setActive] = useState(0);
    const templates = [
        {
            title: "Two Sum II (Sorted)",
            difficulty: "Easy",
            code: `function twoSum(numbers, target) {
  let l = 0, r = numbers.length - 1;

  while (l < r) {
    const sum = numbers[l] + numbers[r];
    if (sum === target) return [l + 1, r + 1]; // 1-indexed
    else if (sum < target) l++;
    else r--;
  }
}
// Input: [2,7,11,15], target=9 → [1,2]`,
        },
        {
            title: "3Sum",
            difficulty: "Medium",
            code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip dupe

    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        result.push([nums[i], nums[l], nums[r]]);
        while (nums[l] === nums[l+1]) l++; // skip dupes
        while (nums[r] === nums[r-1]) r--; // skip dupes
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return result;
}`,
        },
        {
            title: "Container With Most Water",
            difficulty: "Medium",
            code: `function maxArea(height) {
  let l = 0, r = height.length - 1;
  let max = 0;

  while (l < r) {
    const area = Math.min(height[l], height[r]) * (r - l);
    max = Math.max(max, area);

    // move the shorter wall inward
    // (the taller wall can only hurt, never help)
    if (height[l] < height[r]) l++;
    else r--;
  }
  return max;
}`,
        },
        {
            title: "Valid Palindrome II",
            difficulty: "Easy",
            code: `function validPalindrome(s) {
  function isPalin(l, r) {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++; r--;
    }
    return true;
  }

  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) {
      // try skipping left char OR right char
      return isPalin(l + 1, r) || isPalin(l, r - 1);
    }
    l++; r--;
  }
  return true;
}`,
        },
        {
            title: "Trapping Rain Water",
            difficulty: "Hard",
            code: `function trap(height) {
  let l = 0, r = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;

  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= leftMax) leftMax = height[l];
      else water += leftMax - height[l]; // trapped here
      l++;
    } else {
      if (height[r] >= rightMax) rightMax = height[r];
      else water += rightMax - height[r]; // trapped here
      r--;
    }
  }
  return water;
}`,
        },
    ];

    const diffColor = { Easy: "#22d3a5", Medium: "#facc15", Hard: "#f43f5e" };
    const t = templates[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="📋" text="Classic Problems & Templates" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    These are the most common two pointer problems in interviews. Study the templates — once you see the
                    pattern, variations become easy to adapt.
                </p>

                <div className="flex gap-2 flex-wrap mb-5">
                    {templates.map((tp, i) => (
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

/* ─── 8. WHEN TO USE / NOT USE ─── */
function WhenToUse() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🧠" text="Decision Guide" />
                <p className="text-[#c9cdd4] text-sm mb-5 leading-[1.7]">
                    The hardest part of two pointer isn't the implementation — it's <strong className="text-white">recognising when to use it</strong>.
                    Use this mental checklist when you see an array/string problem.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                        { icon: "✅", label: "Use Two Pointer when…", items: ["Array or string input", "Sorted (or can be sorted)", "Looking for a pair/triplet", "In-place modification needed", "Cycle detection in linked list", "Comparing from both ends"], good: true },
                        { icon: "❌", label: "Don't use Two Pointer when…", items: ["Array is unsorted and sorting isn't allowed", "Need all combinations (use recursion)", "Input is a tree or graph", "You need fast lookups (use HashMap)", "Random access pattern required", "Subarray sum equals K (use prefix sum)"], good: false },
                    ].map((col, ci) => (
                        <div key={ci} className="bg-[#333] rounded-2xl p-4"
                            style={{ borderLeft: `3px solid ${col.good ? "#22d3a5" : "#f43f5e"}` }}>
                            <div className="text-sm font-bold mb-3" style={{ color: col.good ? "#22d3a5" : "#f43f5e" }}>
                                {col.icon} {col.label}
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
                    <div className="text-xs font-mono text-[#929292] mb-2">// Quick pattern matching</div>
                    <pre className="font-mono text-xs text-[#aaacae] leading-[1.7]">{`Problem mentions "pair" + sorted array   → Opposite ends
Problem mentions "cycle" or "midpoint"   → Fast & slow
Problem mentions "in-place" filter       → Same direction
Problem mentions "merge" sorted inputs   → Merge variant
Problem mentions "subarray sum"          → Sliding window (cousin)
Problem mentions "range query"           → Prefix sum (cousin)`}</pre>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 9. INTERVIEW TIPS ─── */
function InterviewTips() {
    const tips = [
        { icon: "🔍", title: "Always ask: is it sorted?", body: "Sorting is the #1 prerequisite. If not sorted, ask if you can sort it — that unlocks two pointer and costs O(n log n)." },
        { icon: "🎯", title: "Name your pointers clearly", body: "Use 'left/right' for opposite ends, 'slow/fast' for Floyd's cycle. Naming signals to the interviewer which variant you're using." },
        { icon: "⚠️", title: "Handle the loop condition", body: "Use `l < r` for opposite ends (pointers must not cross). Use `l <= r` when you need to process the middle element (palindrome)." },
        { icon: "📊", title: "State the brute force first", body: "Always say 'the naive solution is O(n²) with two nested loops' before optimising. It shows you understand what you're replacing." },
        { icon: "🧪", title: "Test with edge cases", body: "Empty array, single element, all duplicates, all same value, answer at the very ends. Two pointer is prone to off-by-one bugs." },
        { icon: "🚀", title: "Extend to 3Sum naturally", body: "Fix one element with a for loop, then run two pointer on the rest. This extends the pattern to k-sum problems systematically." },
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

/* ─── 10. QUICK REF ─── */
function QuickRef() {
    const rows = [
        ["Opposite ends setup", "let l = 0, r = arr.length - 1", "while (l < r)"],
        ["Fast & slow setup", "let slow = 0, fast = 0", "while (fast < n)"],
        ["Same direction", "let write = 0", "for (let read = 0; ...)"],
        ["Move left right", "l++", "when sum < target"],
        ["Move right left", "r--", "when sum > target"],
        ["Move slow", "slow++", "every iteration"],
        ["Move fast", "fast += 2", "every iteration"],
        ["Cycle detected", "slow === fast", "Floyd's algorithm"],
        ["Palindrome check", "while (l <= r)", "compare s[l] and s[r]"],
        ["3Sum outer loop", "for i = 0 → n-2", "skip dupes: if arr[i]===arr[i-1]"],
        ["Skip left dupes", "while arr[l]===arr[l+1] l++", "after finding a result"],
        ["Skip right dupes", "while arr[r]===arr[r-1] r--", "after finding a result"],
    ];

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="📋" text="Quick Reference" />
                <div className="flex flex-col gap-1">
                    {rows.map(([op, code, note], i) => (
                        <div key={i}
                            className={`grid gap-3 px-3 py-2 rounded-lg items-center ${i % 2 === 0 ? "bg-[#333]" : "bg-transparent"}`}
                            style={{ gridTemplateColumns: "160px 1fr 1fr" }}>
                            <span className="text-xs text-[#929292]">{op}</span>
                            <code className="font-mono text-xs font-bold text-white">{code}</code>
                            <span className="text-xs text-[#929292]">{note}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── ROOT ─── */
export default function TwoPointerPage() {
    return (
        <div className="arr-root min-h-screen text-white px-5 py-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <GlobalStyles />
            <div className="text-center mb-10 fade-up">
                <h1 className="text-4xl font-extrabold m-0 tracking-tight text-white">Two Pointer</h1>
                <p className="text-base text-[#aaacae] mt-2.5 leading-[1.7]">
                    Drop nested loops. Master the technique that solves pair problems in O(n) time and O(1) space.
                </p>
            </div>

            <Intro />
            <Mechanics />
            <TwoSumDemo />
            <PalindromeDemo />
            <Patterns />
            <Complexity />
            <Templates />
            <WhenToUse />
            <InterviewTips />
            <QuickRef />

            <div className="text-center py-6 text-[#929292] text-[13px]">
                Two pointer is the bridge between O(n²) thinking and O(n) mastery 🚀
            </div>
        </div>
    );
}