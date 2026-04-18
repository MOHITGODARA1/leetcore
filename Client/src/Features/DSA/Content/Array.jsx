import { useState, useEffect, useRef } from "react";

const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    .arr-root { font-family: 'Syne', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp 0.55s ease both; }
    @keyframes scanLine { 0% { top:0; opacity:0.12; } 50% { opacity:0.18; } 100% { top:100%; opacity:0; } }
    .scan { position:relative; overflow:hidden; }
    .scan::after { content:''; position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#38bdf8,transparent); animation: scanLine 3s linear infinite; }
    .glow-yellow { box-shadow: 0 0 24px rgba(250,204,21,0.4); }
    .glow-yellow-sm { box-shadow: 0 0 20px rgba(250,204,21,0.5); }
  `}</style>
);

const Badge = ({ children, color = "#facc15" }) => (
    <span
        style={{
            background: color + "22",
            border: `1px solid ${color}55`,
            color,
            borderRadius: 8,
            padding: "2px 10px",
            fontSize: 12,
            fontWeight: 700,
            display: "inline-block",
            fontFamily: "JetBrains Mono, monospace",
        }}
    >
        {children}
    </span>
);

function Section({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
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

const Card = ({ children, className = "" }) => (
    <div
        className={` rounded-[20px] p-7 mb-6 relative overflow-hidden ${className}`}
    >
        {children}
    </div>
);

const STitle = ({ icon, text }) => (
    <h2 className="text-xl font-extrabold mb-[18px] flex items-center gap-2.5 m-0">
        <span>{icon}</span> {text}
    </h2>
);

/* ─── 1. INTRO ─── */
function Intro() {
    const [clicked, setClicked] = useState(null);
    const [hov, setHov] = useState(null);
    const items = [10, 20, 30, 40, 50];
    return (
        <Section>
            <Card>
                {/* Radial glow decoration */}
                <div
                    className="absolute pointer-events-none"

                />
                <STitle icon="📦" text="What is an Array?" />
                <p className="text-white/90 leading-[1.75] mb-5 text-[15px]">
                    An <span className="font-bold">array</span> is a collection of elements stored in{" "}
                    <span className="text-blue-400 cursor-pointer font-semibold "><a href="https://www.geeksforgeeks.org/operating-systems/difference-between-contiguous-and-noncontiguous-memory-allocation/" target="_blank">contiguous memory</a></span> — like a row of numbered lockers, each
                    holding one item. You jump to any slot instantly using its index.
                </p>
                <p className="text-xs text-[#aaacaeff] mb-2.5 font-mono">// Click any box to inspect it</p>
                <div className="flex gap-2.5 flex-wrap mb-4">
                    {items.map((num, i) => (
                        <div
                            key={i}
                            onClick={() => setClicked(clicked === i ? null : i)}
                            onMouseEnter={() => setHov(i)}
                            onMouseLeave={() => setHov(null)}
                            className="cursor-pointer flex flex-col items-center gap-1"
                        >
                            <span
                                className="font-mono text-[10px] transition-colors duration-200"
                                style={{ color: hov === i ? "#6366f1" : "#aaacaeff" }}
                            >
                                {(1000 + i * 4).toString(16).toUpperCase()}
                            </span>
                            <div
                                style={{
                                    width: 60,
                                    height: 60,
                                    background: "#333333",
                                    border: `2px solid #929292ff`,
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace",
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: clicked === i ? "white" : "#aaacaeff",
                                    transform: clicked === i ? "translateY(-1px)" : hov === i ? "translateY(-4px)" : "translateY(0)",
                                    // boxShadow: clicked === i ? "0 0 24px rgba(250,204,21,0.4)" : "none",
                                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                                }}
                            >
                                {num}
                            </div>
                            <span
                                className="font-mono text-[11px] transition-colors duration-200"
                                style={{ color: clicked === i ? "white" : "#aaacaeff" }}
                            >
                                [{i}]
                            </span>
                        </div>
                    ))}
                </div>
                {clicked !== null && (
                    <div
                        className="bg-[#333333] rounded-xl px-[18px] py-3.5 font-mono text-[13px] mb-3.5"
                        style={{ animation: "fadeUp 0.25s ease" }}
                    >
                        <div className="text-aaacaeff text-[11px] mb-1.5">// Inspector</div>
                        <div className="text-aaacaeff">
                            arr[{clicked}] = <span className="font-bold">{items[clicked]}</span>
                        </div>
                        <div className="text-aaacaeff">
                            address: <span className="font-bold">0x{(1000 + clicked * 4).toString(16).toUpperCase()}</span>
                        </div>
                        <div className="text-aaacaeff">
                            offset: <span className="font-bold">{clicked} × 4 = {clicked * 4} bytes</span>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { lang: "JavaScript", color: "#aaacaeff", code: `const arr = [10, 20, 30, 40, 50];\nconsole.log(arr[2]); // 30` },
                        { lang: "C++", color: "#aaacaeff", code: `int arr[5] = {10,20,30,40,50};\ncout << arr[2]; // 30` },
                    ].map((ex, i) => (
                        <div
                            key={i}
                            className="bg-[#333333] rounded-xl px-4 py-3.5"
                            style={{ border: `1px solid ${ex.color}33` }}
                        >
                            <div
                                className="text-[11px] font-bold mb-2 font-mono"
                                style={{ color: ex.color }}
                            >
                                {ex.lang}
                            </div>
                            <pre className="m-0 font-mono text-xs text-aaacaeff whitespace-pre-wrap">{ex.code}</pre>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 2. MEMORY LAYOUT ─── */
function MemoryLayout() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🧠" text="How Arrays Live in Memory" />
                <p className="text-white/90 leading-[1.75] mb-5 text-[15px]">
                    Elements sit <span className=" font-bold">back-to-back</span> in RAM. Formula:{" "}
                    <span className="font-bold">arr[i] = base + i × size</span>. That's why access is always{" "}
                    <span className="font-bold">O(1)</span>.
                </p>
                <div className="overflow-x-auto pb-2">
                    <div className="flex gap-0 min-w-max">
                        {[10, 20, 30, 40, 50].map((val, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div
                                    style={{
                                        width: 88,
                                        height: 44,
                                        background: i % 2 === 0 ? "#333333" : "#2A2A2A",
                                        border: "1px solid #929292ff",
                                        borderLeft: i === 0 ? "2px solid #6366f1" : "none",
                                        borderRight: i === 4 ? "2px solid #6366f1" : "1px solid #929292ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "JetBrains Mono, monospace",
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: "#facc15",
                                        position: "relative",
                                    }}
                                >
                                    {val}
                                    <span className="absolute top-[3px] right-[5px] text-[9px] text-[#929292ff] font-mono">[{i}]</span>
                                </div>
                                <div className="text-[10px] text-[#929292ff] font-mono mt-1">{1000 + i * 4}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-[18px] bg-blue-500/20 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-white">
                    ✔ Contiguous layout lets the CPU <strong>prefetch</strong> the next element while processing the current —
                    arrays are cache-friendly and blazing fast.
                </div>
            </Card>
        </Section>
    );
}

/* ─── 3. LIVE OPERATIONS ─── */
function LiveOps() {
    const [arr, setArr] = useState([10, 20, 30, 40, 50]);
    const [input, setInput] = useState("");
    const [log, setLog] = useState([]);
    const [flashIdx, setFlashIdx] = useState(null);

    const flash = (idx, cb) => {
        setFlashIdx(idx);
        setTimeout(() => { setFlashIdx(null); cb && cb(); }, 480);
    };
    const addLog = (msg, color = "#22d3a5") => setLog((p) => [{ msg, color }, ...p].slice(0, 6));
    const val = () => parseInt(input) || Math.floor(Math.random() * 90 + 10);

    const ops = [
        {
            label: "push(x)", color: "#22d3a5",
            action() { const v = val(); flash(arr.length, () => setArr((p) => [...p, v])); addLog(`push(${v}) → added to end`, "#22d3a5"); setInput(""); },
        },
        {
            label: "pop()", color: "#f43f5e",
            action() { if (!arr.length) return; const r = arr[arr.length - 1]; flash(arr.length - 1, () => setArr((p) => p.slice(0, -1))); addLog(`pop() → removed ${r}`, "#f43f5e"); },
        },
        {
            label: "unshift(x)", color: "#f59e0b",
            action() { const v = val(); setArr((p) => [v, ...p]); addLog(`unshift(${v}) → added to front`, "#f59e0b"); setInput(""); },
        },
        {
            label: "shift()", color: "#a78bfa",
            action() { if (!arr.length) return; const r = arr[0]; flash(0, () => setArr((p) => p.slice(1))); addLog(`shift() → removed ${r}`, "#a78bfa"); },
        },
        {
            label: "sort()", color: "#38bdf8",
            action() { setArr((p) => [...p].sort((a, b) => a - b)); addLog("sort() → sorted ascending", "#38bdf8"); },
        },
        {
            label: "reverse()", color: "#fb7185",
            action() { setArr((p) => [...p].reverse()); addLog("reverse() → flipped", "#fb7185"); },
        },
    ];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="⚡" text="Live Operations" />
                <p className="text-[#aaacaeff] text-sm mb-[18px]">
                    Click buttons to mutate the array and watch it change in real time.
                </p>
                <div className="flex gap-2 flex-wrap min-h-[76px] mb-4 items-end">
                    {arr.map((v, i) => (
                        <div key={`${v}-${i}`} className="flex flex-col items-center gap-1">
                            <div
                                style={{
                                    width: 52,
                                    height: 52,
                                    background: flashIdx === i ? "#facc1518" : "#333333",
                                    border: `2px solid ${flashIdx === i ? "#facc15" : "#929292ff"}`,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: flashIdx === i ? "#facc15" : "#e2e8f0",
                                    transform: flashIdx === i ? "translateY(-10px) scale(1.15)" : "scale(1)",
                                    boxShadow: flashIdx === i ? "0 0 20px rgba(250,204,21,0.5)" : "none",
                                    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                                }}
                            >
                                {v}
                            </div>
                            <span className="font-mono text-[10px] text-[#929292ff]">[{i}]</span>
                        </div>
                    ))}
                    {arr.length === 0 && (
                        <span className="text-[#929292ff] font-mono text-sm">[ ] ← empty</span>
                    )}
                </div>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a number (blank = random)"
                    className="w-full bg-[#333333] border border-[#929292ff] rounded-[10px] px-3.5 py-2.5 text-white/90 font-mono text-[13px] outline-none mb-3.5"
                />
                <div className="grid grid-cols-3 gap-2 mb-[18px]">
                    {ops.map((op) => (
                        <button
                            key={op.label}
                            onClick={op.action}
                            className="rounded-xl py-2.5 px-1.5 cursor-pointer font-mono text-xs font-bold transition-all duration-[180ms] hover:-translate-y-0.5"
                            style={{
                                background: op.color + "15",
                                border: `1px solid ${op.color}44`,
                                color: "blue-500/20",
                            }}
                        // onMouseEnter={(e) => (e.currentTarget.style.background = op.color + "28")}
                        // onMouseLeave={(e) => (e.currentTarget.style.background = op.color + "15")}
                        >
                            {op.label}
                        </button>
                    ))}
                </div>
                {log.length > 0 && (
                    <div className="bg-[#333333] border border-[#929292ff] rounded-xl px-4 py-3 font-mono text-xs">
                        {log.map((l, i) => (
                            <div
                                key={i}
                                className="mb-[3px]"
                                style={{ color: i === 0 ? l.color : "white/20", opacity: 1 - i * 0.15 }}
                            >
                                {i === 0 ? "▶ " : "  "}
                                {l.msg}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </Section>
    );
}

/* ─── 4. COMPLEXITY ─── */
function Complexity() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const rows = [
        { op: "Access arr[i]", big: "O(1)", color: "#306ed2ff", bar: 5, note: "Direct memory jump — instant" },
        { op: "Search (unsorted)", big: "O(n)", color: "#306ed2ff", bar: 52, note: "Must check every element" },
        { op: "Search (sorted)", big: "O(log n)", color: "#306ed2ff", bar: 28, note: "Binary search halves the space" },
        { op: "Insert at end", big: "O(1)*", color: "#306ed2ff", bar: 5, note: "*Amortized — occasional resize" },
        { op: "Insert at position", big: "O(n)", color: "#306ed2ff", bar: 52, note: "Elements after must shift right" },
        { op: "Delete at end", big: "O(1)", color: "#306ed2ff", bar: 5, note: "Just decrement length" },
        { op: "Delete at position", big: "O(n)", color: "#306ed2ff", bar: 52, note: "Elements after must shift left" },
        { op: "Sort", big: "O(n log n)", color: "#306ed2ff", bar: 78, note: "Timsort (JS) · Introsort (C++)" },
    ];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="⏱️" text="Time Complexity" />
                <p className="text-[#aaacaeff] text-sm mb-5">Bars animate as you scroll. Shorter = faster.</p>
                <div ref={ref} className="flex flex-col gap-2.5">
                    {rows.map((r, i) => (
                        <div key={i} className="bg-[#333333] border border-[#929292ff] rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] text-white/90">{r.op}</span>
                                <span className="text-white/90 font-bold">{r.big}</span>
                            </div>
                            <div className="h-1.5 bg-[#333333] rounded-full overflow-hidden mb-1.5">
                                <div
                                    style={{
                                        height: "100%",
                                        borderRadius: 99,
                                        background: r.color,
                                        width: visible ? `${r.bar}%` : "0%",
                                        transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`,
                                        boxShadow: `0 0 10px ${r.color}55`,
                                    }}
                                />
                            </div>
                            <div className="text-[11px] text-[#929292ff]">{r.note}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 5. PATTERNS ─── */
function TwoPointerViz() {
    const arr = [1, 3, 5, 7, 9, 11, 13];
    const target = 14;
    const steps = [];
    let l = 0, r = arr.length - 1;
    while (l < r) {
        const sum = arr[l] + arr[r];
        steps.push({ l, r, sum, found: sum === target });
        if (sum < target) l++;
        else if (sum > target) r--;
        else break;
    }
    const [step, setStep] = useState(0);
    const cur = steps[step] || steps[steps.length - 1];

    return (
        <div className="mt-4">
            <p className="text-xs text-[#929292ff] font-mono mb-2.5">// Target: {target}. Find two numbers that sum to it.</p>
            <div className="flex gap-2 mb-3.5 flex-wrap">
                {arr.map((v, i) => {
                    const isL = i === cur.l, isR = i === cur.r;
                    return (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <span
                                className="text-[11px] font-mono"
                                style={{ color: isL ? "#22d3a5" : isR ? "#f43f5e" : "transparent" }}
                            >
                                {isL ? "L" : isR ? "R" : "·"}
                            </span>
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    background: isL ? "#22d3a522" : isR ? "#f43f5e22" : "#333333",
                                    border: `2px solid ${isL ? "#22d3a5" : isR ? "#f43f5e" : "#929292ff"}`,
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: isL ? "#22d3a5" : isR ? "#f43f5e" : "#e2e8f0",
                                    transition: "all 0.35s ease",
                                }}
                            >
                                {v}
                            </div>
                            <span className="text-[10px] text-[#929292ff] font-mono">[{i}]</span>
                        </div>
                    );
                })}
            </div>
            <div className="bg-[#333333] border border-[#929292ff] rounded-[10px] px-3.5 py-2.5 font-mono text-xs mb-3">
                <span style={{ color: "#22d3a5" }}>arr[{cur.l}]</span> +{" "}
                <span style={{ color: "#f43f5e" }}>arr[{cur.r}]</span> ={" "}
                <span style={{ color: cur.found ? "#22d3a5" : "#facc15", fontWeight: 700 }}>{cur.sum}</span>
                {cur.found && <span style={{ color: "#22d3a5" }}> ✔ Found!</span>}
                {!cur.found && cur.sum < target && <span className="text-[#aaacaeff]"> &lt; {target}, move L →</span>}
                {!cur.found && cur.sum > target && <span className="text-[#aaacaeff]"> &gt; {target}, move R ←</span>}
            </div>
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="bg-[#333333] border border-[#929292ff] rounded-lg px-4 py-1.5 text-[#aaacaeff] cursor-pointer text-[13px]"
                >
                    ← Prev
                </button>
                <button
                    onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                    className="bg-indigo-500/[0.13] border border-indigo-500/[0.27] rounded-lg px-4 py-1.5 text-indigo-400 cursor-pointer text-[13px] font-bold"
                >
                    Next →
                </button>
                <span className="text-xs text-[#929292ff] font-mono">
                    Step {step + 1}/{steps.length}
                </span>
            </div>
        </div>
    );
}

function SlidingWindowViz() {
    const arr = [2, 1, 5, 1, 3, 2];
    const k = 3;
    const steps = [];
    for (let i = 0; i <= arr.length - k; i++)
        steps.push({ start: i, end: i + k - 1, sum: arr.slice(i, i + k).reduce((a, b) => a + b, 0) });
    const maxSum = Math.max(...steps.map((s) => s.sum));
    const [step, setStep] = useState(0);
    const cur = steps[step];

    return (
        <div className="mt-4">
            <p className="text-xs text-[#929292ff] font-mono mb-2.5">// Find max sum subarray of size k={k}</p>
            <div className="flex gap-2 mb-3.5">
                {arr.map((v, i) => {
                    const inW = i >= cur.start && i <= cur.end;
                    return (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    background: inW ? "#6366f122" : "#333333",
                                    border: `2px solid ${inW ? "#6366f1" : "#929292ff"}`,
                                    borderRadius:
                                        inW && i === cur.start
                                            ? "10px 4px 4px 10px"
                                            : inW && i === cur.end
                                                ? "4px 10px 10px 4px"
                                                : inW
                                                    ? "4px"
                                                    : "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: inW ? "#6366f1" : "#e2e8f0",
                                    transition: "all 0.35s ease",
                                }}
                            >
                                {v}
                            </div>
                            <span className="text-[10px] text-[#929292ff] font-mono">[{i}]</span>
                        </div>
                    );
                })}
            </div>
            <div className="bg-[#333333] border border-[#929292ff] rounded-[10px] px-3.5 py-2.5 font-mono text-xs mb-3 text-indigo-400">
                Window [{cur.start}..{cur.end}] → sum ={" "}
                <strong style={{ color: cur.sum === maxSum ? "#22d3a5" : "#6366f1" }}>{cur.sum}</strong>
                {cur.sum === maxSum && <span style={{ color: "#22d3a5" }}> ← MAX</span>}
            </div>
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="bg-[#333333] border border-[#929292ff] rounded-lg px-4 py-1.5 text-[#aaacaeff] cursor-pointer text-[13px]"
                >
                    ← Prev
                </button>
                <button
                    onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                    className="bg-indigo-500/[0.13] border border-indigo-500/[0.27] rounded-lg px-4 py-1.5 text-indigo-400 cursor-pointer text-[13px] font-bold"
                >
                    Next →
                </button>
                <span className="text-xs text-[#929292ff] font-mono">
                    Step {step + 1}/{steps.length}
                </span>
            </div>
        </div>
    );
}

function PrefixSumViz() {
    const arr = [3, 1, 4, 1, 5, 9, 2];
    const prefix = [0];
    for (const v of arr) prefix.push(prefix[prefix.length - 1] + v);
    const [qL, setQL] = useState(1);
    const [qR, setQR] = useState(4);
    const rangeSum = prefix[qR + 1] - prefix[qL];

    return (
        <div className="mt-4">
            <p className="text-xs text-[#929292ff] font-mono mb-2.5">// Drag L/R sliders to query any range in O(1)</p>
            <div className="flex gap-1.5 mb-3">
                {arr.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-[3px]">
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                background: i >= qL && i <= qR ? "#f59e0b22" : "#333333",
                                border: `2px solid ${i >= qL && i <= qR ? "#f59e0b" : "#929292ff"}`,
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "JetBrains Mono, monospace",
                                fontSize: 14,
                                fontWeight: 700,
                                color: i >= qL && i <= qR ? "#f59e0b" : "#e2e8f0",
                                transition: "all 0.25s",
                            }}
                        >
                            {v}
                        </div>
                        <span className="text-[10px] text-[#929292ff] font-mono">[{i}]</span>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
                {[["L", qL, setQL, "#22d3a5"], ["R", qR, setQR, "#f43f5e"]].map(([lbl, val, set, col]) => (
                    <div key={lbl}>
                        <div className="text-xs font-mono mb-1" style={{ color: col }}>
                            {lbl} = {val}
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={arr.length - 1}
                            value={val}
                            onChange={(e) => set(Number(e.target.value))}
                            className="w-full"
                            style={{ accentColor: col }}
                        />
                    </div>
                ))}
            </div>
            <div className="bg-[#333333] border border-amber-400/[0.27] rounded-[10px] px-3.5 py-2.5 font-mono text-xs text-amber-400">
                sum({qL}..{qR}) = prefix[{qR + 1}] - prefix[{qL}] = {prefix[qR + 1]} - {prefix[qL]} ={" "}
                <strong>{rangeSum}</strong>
            </div>
        </div>
    );
}

function Patterns() {
    const [active, setActive] = useState(0);
    const pats = [
        {
            name: "Two Pointer", color: "#aaacaeff", icon: "",
            desc: "Two indices (L, R) move toward each other. Best for sorted arrays and pair problems.",
            when: "Sorted arrays, pair/triplet sums, palindrome check.",
            viz: <TwoPointerViz />,
            code: `function twoSum(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const sum = nums[l] + nums[r];\n    if (sum === target) return [l, r];\n    sum < target ? l++ : r--;\n  }\n}`,
        },
        {
            name: "Sliding Window", color: "#aaacaeff", icon: "",
            desc: "Maintain a fixed or variable window. Slide it across, reusing overlap to avoid O(n²).",
            when: "Max/min sum subarray, longest substring, fixed window.",
            viz: <SlidingWindowViz />,
            code: `function maxSumWindow(arr, k) {\n  let sum = arr.slice(0,k).reduce((a,b)=>a+b);\n  let max = sum;\n  for (let i = k; i < arr.length; i++) {\n    sum += arr[i] - arr[i - k];\n    max = Math.max(max, sum);\n  }\n  return max;\n}`,
        },
        {
            name: "Prefix Sum", color: "#aaacaeff", icon: "",
            desc: "Precompute cumulative sums. Any range query then answers in O(1).",
            when: "Range queries, subarray sum = K, frequency arrays.",
            viz: <PrefixSumViz />,
            code: `function buildPrefix(arr) {\n  const p = [0];\n  for (const v of arr) p.push(p.at(-1) + v);\n  return p;\n}\n// sum(L,R) = prefix[R+1] - prefix[L]`,
        },
    ];
    const p = pats[active];

    return (
        <Section delay={0.07}>
            <Card>
                <STitle icon="💡" text="Algorithm Patterns" />
                <div className="flex gap-2 mb-5 flex-wrap">
                    {pats.map((pt, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="rounded-xl px-4 py-2 cursor-pointer text-[13px] font-bold transition-all duration-200"
                            style={{
                                background: active === i ? "black" : "#333333",
                                border: `1px solid ${active === i ? "white/90" : "#929292ff"}`,
                                color: "white/90",
                            }}
                        >
                            {pt.icon} {pt.name}
                        </button>
                    ))}
                </div>
                <div
                    className="rounded-2xl p-[18px]"
                    style={{
                        background: p.color + "0d",
                        border: `1px solid ${p.color}33`,
                    }}
                >
                    <p className="text-sm text-white/90 leading-[1.7] mb-2">{p.desc}</p>
                    <p className="text-xs mb-0" style={{ color: p.color }}>
                        <strong>Use when:</strong> {p.when}
                    </p>
                    {p.viz}
                    <p className="text-[11px] text-[#929292ff] font-mono mt-4 mb-2">// Code</p>
                    <pre
                        className="bg-[#333333] rounded-[10px] px-4 py-3.5 font-mono text-xs text-[#aaacaeff] leading-[1.75] whitespace-pre-wrap m-0"
                        style={{ borderLeft: `3px solid ${p.color}` }}
                    >
                        {p.code}
                    </pre>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 6. JS METHODS ─── */
function Methods() {
    const [active, setActive] = useState(0);
    const methods = [
        { name: "map()", color: "white/90", desc: "Transform every element", code: `[1,2,3].map(x => x * 2)\n// → [2, 4, 6]`, result: () => JSON.stringify([1, 2, 3].map((x) => x * 2)) },
        { name: "filter()", color: "white/90", desc: "Keep elements passing test", code: `[1,2,3,4,5].filter(x => x > 2)\n// → [3, 4, 5]`, result: () => JSON.stringify([1, 2, 3, 4, 5].filter((x) => x > 2)) },
        { name: "reduce()", color: "white/90", desc: "Reduce to a single value", code: `[1,2,3,4].reduce((s,x) => s+x, 0)\n// → 10`, result: () => String([1, 2, 3, 4].reduce((s, x) => s + x, 0)) },
        { name: "find()", color: "white/90", desc: "First matching element", code: `[5,12,8,130].find(x => x > 10)\n// → 12`, result: () => String([5, 12, 8, 130].find((x) => x > 10)) },
        { name: "some()", color: "white/90", desc: "Any element truthy?", code: `[1,2,3].some(x => x > 2)\n// → true`, result: () => String([1, 2, 3].some((x) => x > 2)) },
        { name: "every()", color: "white/90", desc: "All elements truthy?", code: `[2,4,6].every(x => x%2===0)\n// → true`, result: () => String([2, 4, 6].every((x) => x % 2 === 0)) },
        { name: "flat()", color: "white/90", desc: "Flatten nested arrays", code: `[[1,2],[3,4]].flat()\n// → [1, 2, 3, 4]`, result: () => JSON.stringify([[1, 2], [3, 4]].flat()) },
        { name: "slice()", color: "white/90", desc: "Copy portion (no mutation)", code: `[10,20,30,40,50].slice(1,4)\n// → [20, 30, 40]`, result: () => JSON.stringify([10, 20, 30, 40, 50].slice(1, 4)) },
        { name: "indexOf()", color: "white/90", desc: "Find index (-1 if absent)", code: `[10,20,30].indexOf(20)\n// → 1`, result: () => String([10, 20, 30].indexOf(20)) },
    ];
    const m = methods[active];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="🔍" text="JS Array Methods" />
                <div className="flex gap-1.5 flex-wrap mb-5">
                    {methods.map((me, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="rounded-full py-[5px] px-[13px] cursor-pointer font-mono text-xs font-bold transition-all duration-[180ms]"
                            style={{
                                background: active === i ? "black" : "#333333",
                                border: `1px solid ${active === i ? "white/90" : "#929292ff"}`,
                                color: active === i ? "white/90" : "white/90",
                            }}
                        >
                            {me.name}
                        </button>
                    ))}
                </div>
                <div
                    className="rounded-2xl p-[18px]"
                    style={{ border: `1px solid ${m.color}44`, background: "#333333" }}
                >
                    <div className="flex gap-2.5 items-center mb-3.5">
                        <Badge color={m.color}>{m.name}</Badge>
                        <span className="text-[13px] text-[#aaacaeff]">{m.desc}</span>
                    </div>
                    <pre className="m-0 mb-3.5 font-mono text-[13px] text-[#aaacaeff] leading-[1.75] whitespace-pre-wrap">
                        {m.code}
                    </pre>
                    <div
                        className="rounded-[10px] px-3.5 py-2.5 font-mono text-[13px]"
                        style={{
                            background: m.color + "11",
                            border: `1px solid ${m.color}33`,
                            color: m.color,
                        }}
                    >
                        Live output: <strong>{m.result()}</strong>
                    </div>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 7. C++ ─── */
function CppSection() {
    const [tab, setTab] = useState(0);
    const tabs = [
        {
            label: "Raw Array",
            code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[5] = {10, 20, 30, 40, 50};\n    cout << arr[2];      // 30\n\n    for (int x : arr)    // range-based loop\n        cout << x << " ";\n\n    return 0;\n}`,
        },
        {
            label: "std::vector",
            code: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30, 40, 50};\n\n    v.push_back(60);          // add end\n    v.pop_back();             // remove last\n    v.insert(v.begin()+2,99); // insert at 2\n\n    sort(v.begin(), v.end());\n    cout << v.size();         // length\n    return 0;\n}`,
        },
        {
            label: "2D Array",
            code: `#include <vector>\nusing namespace std;\n\nint main() {\n    int mat[3][3] = {\n        {1, 2, 3},\n        {4, 5, 6},\n        {7, 8, 9}\n    };\n    cout << mat[1][2]; // 6\n\n    // Vector of vectors\n    vector<vector<int>> g(3, vector<int>(3, 0));\n    g[0][0] = 1;\n    return 0;\n}`,
        },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⚙️" text="C++ Arrays" />
                <div className="flex gap-2 mb-5">
                    {tabs.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => setTab(i)}
                            className="rounded-[10px] px-3.5 py-[7px] cursor-pointer text-xs font-bold transition-all duration-200"
                            style={{
                                background: tab === i ? "#38bdf822" : "#333333",
                                border: `1px solid ${tab === i ? "#38bdf8" : "#929292ff"}`,
                                color: tab === i ? "#38bdf8" : "#475569",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <pre
                    className="scan bg-[#333333] border border-[#929292ff] rounded-xl px-5 py-[18px] font-mono text-[13px] text-[#aaacaeff] leading-[1.75] whitespace-pre-wrap m-0"
                    style={{ borderLeft: "3px solid #38bdf8" }}
                >
                    {tabs[tab].code}
                </pre>
            </Card>
        </Section>
    );
}

/* ─── 8. INTERVIEW TIPS ─── */
function InterviewTips() {
    const tips = [
        { icon: "✅", color: "white/90", title: "Ask constraints first", body: "Is it sorted? Duplicates? Size limits? This tells you which pattern to apply." },
        { icon: "🎯", color: "white/90", title: "Identify the pattern", body: "Sorted + pairs → Two Pointer. Subarray → Sliding Window. Range queries → Prefix Sum." },
        { icon: "⚡", color: "white/90", title: "Brute force first", body: "State the O(n²) solution, then optimize. Interviewers love watching you iterate." },
        { icon: "🧠", color: "white/90", title: "Watch off-by-one bugs", body: "Clarify: is the range inclusive? Use < or ≤? Test with a 3-element example." },
        { icon: "❌", color: "white/90", title: "Don't use arrays when…", body: "Frequent insert/delete in the middle → LinkedList. Key-value → HashMap. Unique values → Set." },
        { icon: "📌", color: "white/90", title: "Test edge cases", body: "Empty [], single element [x], all same [1,1,1], negatives, INT_MAX overflow in C++." },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🎓" text="Interview Tips" />
                <div className="grid grid-cols-2 gap-3">
                    {tips.map((t, i) => (
                        <div
                            key={i}
                            className="bg-[#333333] rounded-2xl p-4"
                            style={{
                                border: `1px solid ${t.color}22`,
                                borderLeft: `3px solid ${t.color}`,
                            }}
                        >
                            <div className="text-[13px] font-bold mb-1.5" style={{ color: t.color }}>
                                {t.icon} {t.title}
                            </div>
                            <p className="text-xs text-[#aaacaeff] leading-[1.65] m-0">{t.body}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 9. QUICK REF ─── */
function QuickRef() {
    const rows = [
        ["arr.length / arr.size()", "Number of elements", "white/90"],
        ["arr[i]", "Access index i — O(1)", "white/90"],
        ["arr.push(x) / push_back", "Add to end — O(1)*", "white/90"],
        ["arr.pop() / pop_back", "Remove last — O(1)", "white/90"],
        ["arr.unshift(x)", "Add to front — O(n)", "white/90"],
        ["arr.shift()", "Remove first — O(n)", "white/90"],
        ["arr.indexOf(x)", "Find index (-1 if absent)", "white/90"],
        ["arr.includes(x)", "Boolean existence check", "white/90"],
        ["arr.slice(a,b)", "Copy a..b (no mutation)", "white/90"],
        ["arr.splice(i,n)", "Remove n elements at i", "white/90"],
        ["arr.concat(arr2)", "Merge two arrays", "white/90"],
        ["arr.flat(depth)", "Flatten nested arrays", "white/90"],
        ["arr.reverse()", "Reverse in place", "white/90"],
        ["arr.sort(fn)", "Sort — O(n log n)", "white/90"],
        ["arr.fill(val,a,b)", "Fill range with val", "white/90"],
        ["arr.join(sep)", "Array → string", "white/90"],
    ];

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="📋" text="Quick Reference" />
                <div className="flex flex-col gap-1">
                    {rows.map(([method, desc, color], i) => (
                        <div
                            key={i}
                            className={`grid gap-3 px-3 py-2 rounded-lg items-center ${i % 2 === 0 ? "bg-[#333333]" : "bg-transparent"}`}
                            style={{ gridTemplateColumns: "220px 1fr" }}
                        >
                            <code className="font-mono text-xs font-bold" style={{ color }}>{method}</code>
                            <span className="text-xs text-[#aaacaeff]">{desc}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── ROOT ─── */
export default function Array() {
    return (
        <div className="arr-root min-h-screen text-white/90 px-5 py-8" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <GlobalStyles />
            <div className="text-center mb-10 fade-up">
                <h1 className="text-4xl font-extrabold m-0 tracking-tight text-white/90">Arrays & Hashing</h1>
                <p className="text-base text-[#aaacaeff] mt-2.5 leading-[1.7]">
                    The most fundamental data structure — master this, master everything else.
                </p>
                {/* <div className="flex gap-2 justify-center mt-4 flex-wrap">
                    <Badge color="#22d3a5">Beginner Friendly</Badge>
                    <Badge color="#6366f1">Interactive</Badge>
                    <Badge color="#38bdf8">C++ &amp; JS</Badge>
                    <Badge color="#f43f5e">Interview Ready</Badge>
                </div> */}
            </div>
            <Intro />
            <MemoryLayout />
            <LiveOps />
            <Complexity />
            <Patterns />
            <Methods />
            <CppSection />
            <InterviewTips />
            <QuickRef />
            <div className="text-center py-6 text-[#929292ff] text-[13px]">
                Keep practicing — arrays are the foundation of DSA 🚀
            </div>
        </div>
    );
}