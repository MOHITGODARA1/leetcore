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

const CodeBlock = ({ code }) => (
    <pre className="bg-[#222] rounded-xl px-4 py-3.5 font-mono text-xs text-[#aaacae] leading-[1.75] whitespace-pre-wrap m-0"
        style={{ borderLeft: "3px solid #929292" }}>
        {code}
    </pre>
);

/* ─── 1. INTRO ─── */
function Intro() {
    return (
        <Section>
            <Card>
                <STitle icon="🪟" text="What is Sliding Window?" />
                <p className="text-[#c9cdd4] leading-[1.75] mb-4 text-[15px]">
                    <strong className="text-white">Sliding Window</strong> is a technique that maintains a{" "}
                    <strong className="text-white">contiguous subset</strong> of elements (a "window") and slides it
                    across the array or string. Instead of recomputing the window's value from scratch each time, you{" "}
                    <strong className="text-white">add the incoming element and remove the outgoing one</strong> — turning
                    O(n·k) into <strong className="text-white">O(n)</strong>.
                </p>
                <p className="text-[#c9cdd4] leading-[1.75] mb-5 text-[15px]">
                    Think of it like a train window: as the train moves, one new thing enters your view and one old
                    thing exits. You don't redescribe the entire landscape — you just note the change.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        {
                            label: "❌ Brute Force — O(n·k)",
                            code: `for (let i = 0; i <= n - k; i++) {
  let sum = 0;
  for (let j = i; j < i + k; j++) {
    sum += arr[j]; // recalculate every time
  }
  max = Math.max(max, sum);
}`,
                        },
                        {
                            label: "✅ Sliding Window — O(n)",
                            code: `let sum = arr.slice(0, k).reduce(...);
for (let i = k; i < n; i++) {
  sum += arr[i];      // add incoming
  sum -= arr[i - k];  // remove outgoing
  max = Math.max(max, sum);
}`,
                        },
                    ].map((ex, i) => (
                        <div key={i} className="bg-[#333] rounded-xl px-4 py-3.5" style={{ border: "1px solid #92929233" }}>
                            <div className="text-[11px] font-bold mb-2 font-mono text-[#aaacae]">{ex.label}</div>
                            <pre className="m-0 font-mono text-xs text-[#aaacae] whitespace-pre-wrap">{ex.code}</pre>
                        </div>
                    ))}
                </div>

                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-white">
                    <strong>Key Insight:</strong> The window overlap between step i and step i+1 is{" "}
                    <code className="bg-[#333] px-1 rounded font-mono text-xs">k-1</code> elements. Reusing that
                    overlap — instead of recomputing — is the entire trick.
                </div>
            </Card>
        </Section>
    );
}

/* ─── 2. FIXED WINDOW MECHANICS ─── */
function FixedWindowDemo() {
    const arr = [2, 1, 5, 1, 3, 2];
    const [k, setK] = useState(3);
    const maxK = arr.length;

    const steps = [];
    for (let i = 0; i <= arr.length - k; i++) {
        const sum = arr.slice(i, i + k).reduce((a, b) => a + b, 0);
        steps.push({ start: i, end: i + k - 1, sum });
    }
    const maxSum = Math.max(...steps.map(s => s.sum));
    const [step, setStep] = useState(0);
    const cur = steps[Math.min(step, steps.length - 1)];

    useEffect(() => setStep(0), [k]);

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="🔬" text="Fixed Window — Step by Step" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    A <strong className="text-white">fixed window</strong> has a constant size k. At each step, the
                    window slides one position: we subtract the leftmost element and add the new rightmost one.
                    No nested loop needed.
                </p>

                <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#929292] font-mono text-xs">window size k =</span>
                    {[2, 3, 4].map(v => (
                        <button key={v} onClick={() => setK(v)}
                            className="rounded-lg px-3 py-1.5 font-mono text-xs font-bold cursor-pointer transition-all"
                            style={{
                                background: k === v ? "#000" : "#333",
                                border: `1px solid ${k === v ? "#fff" : "#929292"}`,
                                color: k === v ? "#fff" : "#929292",
                            }}>
                            {v}
                        </button>
                    ))}
                </div>

                {/* Array visual */}
                <div className="flex gap-2 mb-3 flex-wrap">
                    {arr.map((v, i) => {
                        const inW = i >= cur.start && i <= cur.end;
                        const isLeft = i === cur.start;
                        const isRight = i === cur.end;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-mono font-bold h-3.5"
                                    style={{ color: isLeft ? "#22d3a5" : isRight ? "#f43f5e" : "transparent" }}>
                                    {isLeft ? "L" : isRight ? "R" : " "}
                                </span>
                                <div style={{
                                    width: 52, height: 52,
                                    background: inW ? "#22222a" : "#333",
                                    border: `2px solid ${isLeft ? "#22d3a5" : isRight ? "#f43f5e" : inW ? "#fff" : "#929292"}`,
                                    borderRadius: isLeft ? "10px 4px 4px 10px" : isRight ? "4px 10px 10px 4px" : inW ? "4px" : "10px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace", fontSize: 15, fontWeight: 700,
                                    color: inW ? "#fff" : "#555",
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
                    Window [{cur.start}..{cur.end}]
                    {" = "}{arr.slice(cur.start, cur.end + 1).join(" + ")}
                    {" = "}
                    <strong style={{ color: cur.sum === maxSum ? "#22d3a5" : "#fff" }}>{cur.sum}</strong>
                    {cur.sum === maxSum && <span style={{ color: "#22d3a5" }}> ← MAX</span>}
                    {step > 0 && (
                        <span className="text-[#929292]">
                            {" "}(removed {arr[cur.start - 1]}, added {arr[cur.end]})
                        </span>
                    )}
                </div>

                {/* All windows summary */}
                <div className="flex gap-2 flex-wrap mb-3">
                    {steps.map((s, i) => (
                        <div key={i}
                            onClick={() => setStep(i)}
                            className="cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs transition-all"
                            style={{
                                background: i === step ? "#22222a" : "#222",
                                border: `1px solid ${i === step ? "#fff" : s.sum === maxSum ? "#929292" : "#2a2a2a"}`,
                                color: s.sum === maxSum ? "#fff" : "#929292",
                                fontWeight: s.sum === maxSum ? 700 : 400,
                            }}>
                            [{s.start}..{s.end}]={s.sum}{s.sum === maxSum ? " ★" : ""}
                        </div>
                    ))}
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

/* ─── 3. VARIABLE WINDOW DEMO ─── */
function VariableWindowDemo() {
    const presets = ["abcabcbb", "bbbbb", "pwwkew", "abba"];
    const [strIdx, setStrIdx] = useState(0);
    const [step, setStep] = useState(0);
    const s = presets[strIdx];

    // compute all steps of the longest substring without repeating
    const steps = (() => {
        const result = [];
        const set = new Set();
        let left = 0, maxLen = 0, maxStart = 0;
        for (let right = 0; right < s.length; right++) {
            const shrinks = [];
            while (set.has(s[right])) {
                shrinks.push(left);
                set.delete(s[left]);
                left++;
            }
            set.add(s[right]);
            if (right - left + 1 > maxLen) {
                maxLen = right - left + 1;
                maxStart = left;
            }
            result.push({ left, right, window: s.slice(left, right + 1), shrinks, maxLen, maxStart });
        }
        return result;
    })();

    const cur = steps[Math.min(step, steps.length - 1)];
    useEffect(() => setStep(0), [strIdx]);

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="📏" text="Variable Window — Longest Unique Substring" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    A <strong className="text-white">variable window</strong> grows and shrinks based on a condition.
                    Here: expand the right pointer to include new chars, but shrink from the left whenever a duplicate
                    enters. The window always holds only unique characters.
                </p>

                <div className="flex gap-2 flex-wrap mb-4">
                    {presets.map((p, i) => (
                        <button key={i} onClick={() => setStrIdx(i)}
                            className="rounded-lg px-3 py-1.5 font-mono text-xs font-bold cursor-pointer transition-all"
                            style={{
                                background: strIdx === i ? "#000" : "#333",
                                border: `1px solid ${strIdx === i ? "#fff" : "#929292"}`,
                                color: strIdx === i ? "#fff" : "#929292",
                            }}>
                            "{p}"
                        </button>
                    ))}
                </div>

                {/* String visual */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                    {s.split("").map((ch, i) => {
                        const inW = i >= cur.left && i <= cur.right;
                        const isLeft = i === cur.left;
                        const isRight = i === cur.right;
                        const isMaxW = i >= cur.maxStart && i < cur.maxStart + cur.maxLen && step === steps.length - 1;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-mono font-bold h-3.5"
                                    style={{ color: isLeft && isRight ? "#fff" : isLeft ? "#22d3a5" : isRight ? "#f43f5e" : "transparent" }}>
                                    {isLeft && isRight ? "LR" : isLeft ? "L" : isRight ? "R" : " "}
                                </span>
                                <div style={{
                                    width: 38, height: 38,
                                    background: inW ? "#22222a" : "#333",
                                    border: `2px solid ${isRight ? "#f43f5e" : isLeft ? "#22d3a5" : inW ? "#929292" : "#555"}`,
                                    borderRadius: 8, display: "flex", alignItems: "center",
                                    justifyContent: "center", fontFamily: "JetBrains Mono, monospace",
                                    fontSize: 14, fontWeight: 700,
                                    color: inW ? "#fff" : "#444",
                                    transition: "all 0.3s ease",
                                }}>
                                    {ch}
                                </div>
                                <span className="text-[9px] text-[#929292] font-mono">[{i}]</span>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-[#333] border border-[#929292] rounded-xl px-4 py-3 font-mono text-xs mb-3">
                    Window: "<strong className="text-white">{cur.window}</strong>"
                    {" "}(size {cur.window.length})
                    {cur.shrinks.length > 0 && (
                        <span className="text-[#929292]"> — shrunk from left ({cur.shrinks.length}x) to remove duplicate '{s[cur.right]}'</span>
                    )}
                    {"  "}best so far: <strong className="text-white">"{s.slice(cur.maxStart, cur.maxStart + cur.maxLen)}"</strong> (len {cur.maxLen})
                </div>

                <div className="flex gap-2 items-center">
                    <button onClick={() => setStep(s => Math.max(0, s - 1))}
                        className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-[13px] hover:bg-[#444]">← Prev</button>
                    <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                        className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-1.5 text-indigo-400 cursor-pointer text-[13px] font-bold hover:bg-indigo-500/20">
                        Next →</button>
                    <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
                    {step === steps.length - 1 && (
                        <span className="font-mono text-xs text-white bg-[#333] border border-[#929292] px-3 py-1 rounded-lg">
                            Answer: {cur.maxLen}
                        </span>
                    )}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 4. PATTERNS ─── */
function Patterns() {
    const [active, setActive] = useState(0);

    const patterns = [
        {
            name: "Fixed Size",
            when: "Window size k is given. Max/min sum, average, product in a subarray of length k.",
            how: "Compute first window. Then slide: add arr[right], subtract arr[right-k]. O(n) single pass.",
            code: `function maxSumSubarray(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i];        // add incoming element
    windowSum -= arr[i - k];   // remove outgoing element
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
// [2,1,5,1,3,2], k=3 → 9  (window [5,1,3])`,
            examples: ["Max Sum Subarray of Size K", "Average of Subarrays", "Max Product Subarray"],
            complexity: "Time: O(n) — Space: O(1)",
        },
        {
            name: "Variable (Shrink Left)",
            when: "No fixed size. Find longest/shortest window satisfying a condition (unique chars, sum ≤ K, etc.).",
            how: "Expand right pointer. When condition is violated, shrink from left until valid again.",
            code: `function longestUniqueSubstring(s) {
  const seen = new Set();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // shrink until no duplicate
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
// "abcabcbb" → 3  ("abc")`,
            examples: ["Longest Substr No Repeat", "Longest Substr K Distinct", "Fruits Into Baskets"],
            complexity: "Time: O(n) — Space: O(k)",
        },
        {
            name: "Minimum Window",
            when: "Find smallest window containing all required elements (e.g. all chars of pattern t).",
            how: "Expand right until window is valid. Then shrink left as far as possible while still valid.",
            code: `function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);

  let have = 0, required = need.size;
  let left = 0, minLen = Infinity, minStart = 0;
  const window = new Map();

  for (let right = 0; right < s.length; right++) {
    window.set(s[right], (window.get(s[right]) || 0) + 1);
    if (need.has(s[right]) && window.get(s[right]) === need.get(s[right]))
      have++;

    while (have === required) {           // valid window — try to shrink
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      window.set(s[left], window.get(s[left]) - 1);
      if (need.has(s[left]) && window.get(s[left]) < need.get(s[left]))
        have--;
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}
// s="ADOBECODEBANC", t="ABC" → "BANC"`,
            examples: ["Minimum Window Substring", "Smallest Subarray with K Distinct"],
            complexity: "Time: O(n + m) — Space: O(n + m)",
        },
        {
            name: "At-Most K Trick",
            when: "Count subarrays with exactly K distinct. Can't do it directly — use 'at most K' subtraction.",
            how: "exactly(K) = atMost(K) - atMost(K-1). Both are standard variable window problems.",
            code: `function subarraysWithKDistinct(nums, k) {
  return atMost(nums, k) - atMost(nums, k - 1);
}

function atMost(nums, k) {
  const count = new Map();
  let left = 0, result = 0;

  for (let right = 0; right < nums.length; right++) {
    count.set(nums[right], (count.get(nums[right]) || 0) + 1);

    while (count.size > k) {
      count.set(nums[left], count.get(nums[left]) - 1);
      if (count.get(nums[left]) === 0) count.delete(nums[left]);
      left++;
    }
    result += right - left + 1; // all subarrays ending at right
  }
  return result;
}
// [1,2,1,2,3], k=2 → 7`,
            examples: ["Subarrays with K Distinct", "Count Nice Subarrays", "Number of Substrings"],
            complexity: "Time: O(n) — Space: O(k)",
        },
    ];

    const p = patterns[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="💡" text="Pattern Variants" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    Sliding window is not one trick — it's a family of four strategies. The key decision is always:
                    is the window size fixed or does it grow and shrink?
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
                            <span key={i} className="bg-[#222] border border-[#333] rounded-full px-2.5 py-0.5 text-[11px] font-mono text-[#aaacae]">{ex}</span>
                        ))}
                    </div>
                    <div className="mt-3 text-xs font-mono text-[#929292]">{p.complexity}</div>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 5. COMPLEXITY ─── */
function Complexity() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const rows = [
        { op: "Fixed window (size k)", time: "O(n)", space: "O(1)", bar: 50, note: "Single pass — add right, remove left" },
        { op: "Variable window (unique chars)", time: "O(n)", space: "O(k)", bar: 50, note: "Each element enters and leaves the window once" },
        { op: "Minimum window substring", time: "O(n+m)", space: "O(n+m)", bar: 60, note: "n = string length, m = pattern length" },
        { op: "At-most K trick", time: "O(n)", space: "O(k)", bar: 50, note: "Two passes of variable window — still O(n)" },
        { op: "Brute force (all subarrays)", time: "O(n²)", space: "O(1)", bar: 85, note: "What sliding window replaces" },
        { op: "Brute force with inner compute", time: "O(n·k)", space: "O(1)", bar: 100, note: "Recalculate sum/max inside every window" },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⏱️" text="Complexity Reference" />
                <p className="text-[#aaacae] text-sm mb-5">
                    All sliding window variants achieve O(n). Each element is processed at most twice — once entering, once leaving.
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
                                    background: i < 4 ? "#306ed2" : "#555",
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

/* ─── 6. CLASSIC PROBLEMS ─── */
function ClassicProblems() {
    const [active, setActive] = useState(0);
    const problems = [
        {
            title: "Max Sum Subarray of Size K",
            difficulty: "Easy",
            code: `function maxSumSubarray(arr, k) {
  let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let max = sum;

  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    max = Math.max(max, sum);
  }
  return max;
}
// [2,1,5,1,3,2], k=3 → 9`,
        },
        {
            title: "Longest Substr Without Repeating",
            difficulty: "Medium",
            code: `function lengthOfLongestSubstring(s) {
  const seen = new Map(); // char → last index
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    if (seen.has(s[right]) && seen.get(s[right]) >= left) {
      left = seen.get(s[right]) + 1; // jump left past the duplicate
    }
    seen.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
// "abcabcbb" → 3  "pwwkew" → 3`,
        },
        {
            title: "Permutation in String",
            difficulty: "Medium",
            code: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0);
  const have = new Array(26).fill(0);
  const a = "a".charCodeAt(0);

  for (const c of s1) need[c.charCodeAt(0) - a]++;

  for (let r = 0; r < s2.length; r++) {
    have[s2[r].charCodeAt(0) - a]++;
    if (r >= s1.length) have[s2[r - s1.length].charCodeAt(0) - a]--;
    if (have.join() === need.join()) return true;
  }
  return false;
}
// s1="ab", s2="eidbaooo" → true`,
        },
        {
            title: "Minimum Window Substring",
            difficulty: "Hard",
            code: `function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);

  let have = 0, required = need.size;
  let left = 0, minLen = Infinity, minStart = 0;
  const window = new Map();

  for (let right = 0; right < s.length; right++) {
    window.set(s[right], (window.get(s[right]) || 0) + 1);
    if (need.has(s[right]) && window.get(s[right]) === need.get(s[right]))
      have++;

    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1; minStart = left;
      }
      window.set(s[left], window.get(s[left]) - 1);
      if (need.has(s[left]) && window.get(s[left]) < need.get(s[left])) have--;
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}
// "ADOBECODEBANC", "ABC" → "BANC"`,
        },
        {
            title: "Max Consecutive Ones III",
            difficulty: "Medium",
            code: `// Flip at most k zeros. Find max window of 1s.
function longestOnes(nums, k) {
  let left = 0, zeros = 0, maxLen = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;

    // too many zeros — shrink from left
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
// [1,1,1,0,0,0,1,1,1,1,0], k=2 → 6`,
        },
    ];

    const diffColor = { Easy: "#22d3a5", Medium: "#facc15", Hard: "#f43f5e" };
    const t = problems[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="📋" text="Classic Problems & Templates" />
                <p className="text-[#c9cdd4] text-sm mb-4 leading-[1.7]">
                    These five problems cover every sliding window variant you'll encounter in interviews.
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

/* ─── 7. FIXED vs VARIABLE COMPARISON ─── */
function Comparison() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⚖️" text="Fixed vs Variable Window" />
                <p className="text-[#c9cdd4] text-sm mb-5 leading-[1.7]">
                    The most important decision when using sliding window is choosing the right variant.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                        {
                            label: "Fixed Window",
                            clues: ["k is given in the problem", "Window size never changes", "\"subarray of length k\"", "\"consecutive k elements\""],
                            examples: ["Max sum of size k", "Average of size k", "Find all anagrams"],
                            template: `let sum = first k elements
for i = k to n-1:
  sum += arr[i]
  sum -= arr[i-k]
  update answer`,
                        },
                        {
                            label: "Variable Window",
                            clues: ["No k given — find longest/shortest", "Condition on window content", "\"longest substring with...\"", "\"minimum subarray such that...\""],
                            examples: ["Longest no-repeat substr", "Min window substr", "Shortest subarray ≥ sum"],
                            template: `left = 0
for right = 0 to n-1:
  add s[right] to window
  while window invalid:
    remove s[left], left++
  update answer`,
                        },
                    ].map((col, ci) => (
                        <div key={ci} className="bg-[#333] rounded-2xl p-4" style={{ borderLeft: "3px solid #929292" }}>
                            <div className="text-sm font-bold text-white mb-3">{col.label}</div>
                            <div className="text-[11px] text-[#929292] font-mono mb-1.5">CLUES IN PROBLEM:</div>
                            {col.clues.map((c, i) => (
                                <div key={i} className="text-xs text-[#aaacae] mb-1">→ {c}</div>
                            ))}
                            <div className="text-[11px] text-[#929292] font-mono mt-3 mb-1.5">EXAMPLES:</div>
                            {col.examples.map((e, i) => (
                                <div key={i} className="text-xs text-[#aaacae] mb-1">· {e}</div>
                            ))}
                            <div className="text-[11px] text-[#929292] font-mono mt-3 mb-1.5">TEMPLATE:</div>
                            <pre className="font-mono text-[10px] text-[#aaacae] leading-[1.6]">{col.template}</pre>
                        </div>
                    ))}
                </div>

                <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3.5">
                    <div className="text-xs font-mono text-[#929292] mb-2">// Pattern recognition</div>
                    <pre className="font-mono text-xs text-[#aaacae] leading-[1.7]">{`"max/min sum of subarray size k"    → Fixed window
"longest subarray/string with ..."  → Variable (expand + shrink)
"shortest subarray containing ..."  → Variable (shrink left greedily)
"count subarrays with exactly K"    → atMost(K) - atMost(K-1)
"permutation / anagram in string"   → Fixed window + frequency map`}</pre>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 8. WHEN TO USE ─── */
function WhenToUse() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🧠" text="Decision Guide" />
                <p className="text-[#c9cdd4] text-sm mb-5 leading-[1.7]">
                    Recognising when to use sliding window is the real skill.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                        {
                            label: "✅ Use Sliding Window when…",
                            items: ["Input is array or string", "Problem involves a contiguous subarray/substring", "Looking for max, min, longest, shortest, count", "O(n²) brute force iterates all subarrays", "Window condition depends only on elements inside it"],
                            good: true,
                        },
                        {
                            label: "❌ Don't use Sliding Window when…",
                            items: ["Subarray elements don't need to be contiguous", "Order of elements doesn't matter → use sorting/hashing", "Need global max across non-adjacent elements → DP", "Problem has overlapping subproblems → DP/memoize", "Pair/triplet search on sorted array → Two Pointer"],
                            good: false,
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

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-white">
                    <strong>The O(2n) proof:</strong> In variable window, the right pointer moves from 0 → n (n steps).
                    The left pointer also moves from 0 → at most n (n steps total, not n per right step). Combined: at most
                    2n pointer moves — that's why the whole algorithm is <strong>O(n)</strong>, not O(n²).
                </div>
            </Card>
        </Section>
    );
}

/* ─── 9. INTERVIEW TIPS ─── */
function InterviewTips() {
    const tips = [
        { icon: "🔍", title: "Spot 'contiguous subarray'", body: "That phrase is the strongest signal for sliding window. Also watch for 'longest/shortest substring' and 'subarray with condition'." },
        { icon: "⚖️", title: "Fixed vs variable first", body: "Before writing any code, decide: is the window size given (fixed) or do I find it (variable)? This determines your entire template." },
        { icon: "📊", title: "State brute force explicitly", body: "Say 'the naive approach iterates all O(n²) subarrays with an inner sum loop — that's O(n·k). Sliding window reduces this to O(n) by reusing overlap.'" },
        { icon: "🧪", title: "Track the invariant", body: "Every variable window has an invariant: 'the window is always valid'. Write it in a comment. When the invariant breaks, shrink left until it's restored." },
        { icon: "⚠️", title: "Watch the left pointer", body: "The most common bug: forgetting to remove the left element's contribution when shrinking. Always pair 'left++' with 'undo effect of arr[left]'." },
        { icon: "🎯", title: "Know the at-most trick", body: "'Exactly K distinct' can't be done directly. Use atMost(K) - atMost(K-1). This converts an impossible direct count into two easy sliding windows." },
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
        ["Fixed window setup", "Compute first window with reduce/loop"],
        ["Fixed slide step", "sum += arr[i]; sum -= arr[i-k]"],
        ["Variable window setup", "left = 0; expand with right pointer"],
        ["Expand right", "window.add(s[right]); right++"],
        ["Shrink left", "while invalid: window.remove(s[left]); left++"],
        ["Window size", "right - left + 1"],
        ["Update answer", "After each right step, before next expand"],
        ["O(2n) proof", "right moves n steps; left moves ≤ n total"],
        ["At-most K trick", "exactly(K) = atMost(K) - atMost(K-1)"],
        ["Anagram check", "Fixed window + frequency array of size 26"],
        ["Map window", "map.set(ch, (map.get(ch)||0)+1) on expand"],
        ["Map shrink", "decrement; delete if count reaches 0"],
        ["Valid window check", "map.size ≤ k, or have === required"],
        ["Edge case: k > n", "Return 0 or handle before loop"],
        ["All-negative array", "Track max, not just positive sums"],
        ["Empty string", "Check s.length === 0 before starting"],
    ];

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="📋" text="Quick Reference" />
                <div className="flex flex-col gap-1">
                    {rows.map(([method, desc], i) => (
                        <div key={i}
                            className={`grid gap-3 px-3 py-2 rounded-lg items-center ${i % 2 === 0 ? "bg-[#333]" : "bg-transparent"}`}
                            style={{ gridTemplateColumns: "220px 1fr" }}>
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
export default function SlidingWindowPage() {
    return (
        <div className="arr-root min-h-screen text-white px-5 py-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <GlobalStyles />
            <div className="text-center mb-10 fade-up">
                <h1 className="text-4xl font-extrabold m-0 tracking-tight text-white">Sliding Window</h1>
                <p className="text-base text-[#aaacae] mt-2.5 leading-[1.7]">
                    Turn O(n·k) nested loops into O(n) — by reusing what you already know about the previous window.
                </p>
            </div>

            <Intro />
            <FixedWindowDemo />
            <VariableWindowDemo />
            <Patterns />
            <Complexity />
            <ClassicProblems />
            <Comparison />
            <WhenToUse />
            <InterviewTips />
            <QuickRef />

            <div className="text-center py-6 text-[#929292] text-[13px]">
                The window is always valid — just keep sliding 🚀
            </div>
        </div>
    );
}