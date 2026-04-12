import { useState, useEffect, useRef } from "react";

const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    .bs-root { font-family: 'Syne', sans-serif; }
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
            { threshold: 0.1 }
        );
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        }}>
            {children}
        </div>
    );
}

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

/* ─── 1. INTRO ─── */
function Intro() {
    return (
        <Section>
            <Card>
                <STitle icon="📦" text="The Core Intuition" />
                <p className="text-[#ccc] text-[14px] leading-[1.75] mb-4">
                    Imagine a 1000-page dictionary. To find "Xenon," you don't start at page 1 — you flip to the
                    middle, realize you're at M, then jump to the ¾ mark, and so on. That's binary search. At
                    every step you <strong>eliminate half the remaining possibilities</strong>. After just 10
                    steps, you can find any word in a 1,000-page book.
                </p>
                <div className="bg-[#1e2d3a] border border-[#306ed233] rounded-xl px-4 py-3 text-sm text-white mb-4">
                    <strong className="text-[#22d3a5]">Critical requirement:</strong> The array{" "}
                    <strong>must be sorted</strong>. Binary search exploits sorted order — if elements were
                    random, we couldn't decide which half to discard.
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#222] rounded-xl p-4">
                        <div className="font-mono text-xs font-bold text-[#f43f5e] mb-2">Linear Search — O(n)</div>
                        <p className="text-xs text-[#aaacae] leading-[1.7]">
                            For n=1,000,000: up to{" "}
                            <strong className="text-[#f43f5e]">1,000,000</strong> comparisons worst case. If each
                            takes 1ms, that's 16 minutes.
                        </p>
                    </div>
                    <div className="bg-[#222] rounded-xl p-4">
                        <div className="font-mono text-xs font-bold text-[#22d3a5] mb-2">Binary Search — O(log n)</div>
                        <p className="text-xs text-[#aaacae] leading-[1.7]">
                            For n=1,000,000: at most{" "}
                            <strong className="text-[#22d3a5]">20</strong> comparisons. log₂(1,000,000) ≈ 20.
                            Same dataset, 50,000× faster.
                        </p>
                    </div>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 2. LIVE STEP-BY-STEP ─── */
function LiveOps() {
    const generateSorted = (size) => {
        const set = new Set();
        while (set.size < size) set.add(Math.floor(Math.random() * 99) + 1);
        return [...set].sort((a, b) => a - b);
    };

    const [arrSize, setArrSize] = useState(8);
    const [arr, setArr] = useState([2, 5, 8, 12, 16, 23, 38, 45]);
    const [target, setTarget] = useState(23);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(7);
    const [mid, setMid] = useState(null);
    const [step, setStep] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const [eliminated, setEliminated] = useState([]);
    const [found, setFound] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [log, setLog] = useState("// Press \"Next step\" to begin the search");
    const [autoPlaying, setAutoPlaying] = useState(false);
    const autoRef = useRef(null);

    const reset = (a = arr, t = target) => {
        setLeft(0);
        setRight(a.length - 1);
        setMid(null);
        setStep(0);
        setComparisons(0);
        setEliminated([]);
        setFound(null);
        setNotFound(false);
        setLog('// Press "Next step" to begin the search');
        clearInterval(autoRef.current);
        setAutoPlaying(false);
    };

    const regenerate = () => {
        const a = generateSorted(arrSize);
        setArr(a);
        reset(a, target);
    };

    const nextStep = (
        curLeft = left,
        curRight = right,
        curElim = eliminated,
        curComps = comparisons,
        curStep = step
    ) => {
        if (found !== null || notFound) return;
        if (curLeft > curRight) {
            setNotFound(true);
            setLog(`// Target ${target} not found — search space exhausted (left > right)`);
            return;
        }
        const m = Math.floor((curLeft + curRight) / 2);
        const newComps = curComps + 1;
        const newStep = curStep + 1;
        setMid(m);
        setComparisons(newComps);
        setStep(newStep);

        if (arr[m] === target) {
            setFound(m);
            setLog(`// Step ${newStep}: arr[${m}] = ${arr[m]} === ${target} ✔ Found at index ${m}! (${newComps} comparison${newComps > 1 ? "s" : ""})`);
        } else if (arr[m] < target) {
            const newElim = [...curElim, ...Array.from({ length: m - curLeft + 1 }, (_, i) => curLeft + i)];
            setEliminated(newElim);
            setLeft(m + 1);
            setLog(`// Step ${newStep}: arr[${m}] = ${arr[m]} < ${target} → discard left half, set left = ${m + 1}`);
            return { newLeft: m + 1, newRight: curRight, newElim, newComps, newStep };
        } else {
            const newElim = [...curElim, ...Array.from({ length: curRight - m + 1 }, (_, i) => m + i)];
            setEliminated(newElim);
            setRight(m - 1);
            setLog(`// Step ${newStep}: arr[${m}] = ${arr[m]} > ${target} → discard right half, set right = ${m - 1}`);
            return { newLeft: curLeft, newRight: m - 1, newElim, newComps, newStep };
        }
    };

    const handleNextStep = () => {
        nextStep();
    };

    const startAutoPlay = () => {
        if (autoPlaying) { clearInterval(autoRef.current); setAutoPlaying(false); return; }
        setAutoPlaying(true);
        let l = left, r = right, elim = [...eliminated], comps = comparisons, s = step;
        const tick = () => {
            if (found !== null || notFound || l > r) { clearInterval(autoRef.current); setAutoPlaying(false); return; }
            const m = Math.floor((l + r) / 2);
            comps++; s++;
            setMid(m); setComparisons(comps); setStep(s);
            if (arr[m] === target) {
                setFound(m);
                setLog(`// Step ${s}: arr[${m}] = ${arr[m]} === ${target} ✔ Found at index ${m}! (${comps} comparisons)`);
                clearInterval(autoRef.current); setAutoPlaying(false);
            } else if (arr[m] < target) {
                elim = [...elim, ...Array.from({ length: m - l + 1 }, (_, i) => l + i)];
                setEliminated([...elim]); l = m + 1; setLeft(l);
                setLog(`// Step ${s}: arr[${m}] = ${arr[m]} < ${target} → set left = ${l}`);
            } else {
                elim = [...elim, ...Array.from({ length: r - m + 1 }, (_, i) => m + i)];
                setEliminated([...elim]); r = m - 1; setRight(r);
                setLog(`// Step ${s}: arr[${m}] = ${arr[m]} > ${target} → set right = ${r}`);
            }
            if (l > r && arr[m] !== target) {
                setNotFound(true);
                setLog(`// Target ${target} not found — search space exhausted`);
                clearInterval(autoRef.current); setAutoPlaying(false);
            }
        };
        autoRef.current = setInterval(tick, 900);
    };

    const getBoxStyle = (i) => {
        if (found === i) return { background: "#22d3a522", border: "2px solid #22d3a5", color: "#22d3a5", transform: "translateY(-8px) scale(1.12)", boxShadow: "0 0 20px #22d3a544" };
        if (eliminated.includes(i)) return { background: "#6366f108", border: "2px solid #6366f133", color: "#6366f155" };
        if (mid === i) return { background: "#facc1522", border: "2px solid #facc15", color: "#facc15", transform: "translateY(-6px) scale(1.08)" };
        if (i === left && i === right) return { background: "#22d3a511", border: "2px solid #22d3a5", color: "#22d3a5" };
        if (i === left) return { background: "#22d3a511", border: "2px solid #22d3a5", color: "#22d3a5" };
        if (i === right) return { background: "#f43f5e11", border: "2px solid #f43f5e", color: "#f43f5e" };
        return { background: "#333", border: "2px solid #929292", color: "#e2e8f0" };
    };

    const currentMid = mid !== null ? mid : Math.floor((left + right) / 2);

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⚡" text="Step-by-Step Visualizer" />
                <p className="text-[#aaacae] text-sm mb-4">
                    Customize the array and target. Watch L (left), M (mid), and R (right) pointers move.
                </p>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[#aaacae] text-sm">Target:</span>
                        <input
                            type="number"
                            value={target}
                            onChange={(e) => { setTarget(Number(e.target.value)); reset(arr, Number(e.target.value)); }}
                            className="w-20 bg-[#333] border border-[#929292] rounded-lg px-3 py-1.5 text-white font-mono text-sm outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#aaacae] text-sm">Size:</span>
                        <select
                            value={arrSize}
                            onChange={(e) => setArrSize(Number(e.target.value))}
                            className="bg-[#333] border border-[#929292] rounded-lg px-3 py-1.5 text-white font-mono text-sm outline-none"
                        >
                            {[6, 8, 10, 12].map((s) => <option key={s} value={s}>{s} elements</option>)}
                        </select>
                    </div>
                    <button
                        onClick={regenerate}
                        className="bg-[#33333388] border border-[#929292] rounded-xl px-4 py-2 font-mono text-xs font-bold text-[#aaacae] cursor-pointer hover:-translate-y-0.5 transition-all"
                    >
                        Regenerate
                    </button>
                </div>

                {/* Array display */}
                <div className="flex gap-2 flex-wrap mb-4">
                    {arr.map((num, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="text-[11px] font-mono" style={{ color: mid === i ? "#facc15" : i === left ? "#22d3a5" : i === right ? "#f43f5e" : "transparent" }}>
                                {mid === i ? "M" : i === left && i === right ? "L=R" : i === left ? "L" : i === right ? "R" : "·"}
                            </div>
                            <div
                                style={{
                                    width: 48, height: 48,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    borderRadius: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700,
                                    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                                    ...getBoxStyle(i),
                                }}
                            >
                                {num}
                            </div>
                            <span className="text-[10px] text-[#929292] font-mono">[{i}]</span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex gap-4 flex-wrap mb-4">
                    {[
                        { color: "#22d3a5", label: "L — left pointer" },
                        { color: "#facc15", label: "M — mid (checked)" },
                        { color: "#f43f5e", label: "R — right pointer" },
                        { color: "#6366f1", label: "Eliminated" },
                    ].map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5 text-xs">
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                            {l.label}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 flex-wrap items-center mb-3">
                    <button
                        onClick={handleNextStep}
                        disabled={found !== null || notFound}
                        className="bg-[#22d3a515] border border-[#22d3a544] rounded-xl px-4 py-2 font-mono text-xs font-bold text-[#22d3a5] cursor-pointer hover:-translate-y-0.5 transition-all disabled:opacity-40"
                    >
                        Next step →
                    </button>
                    <button
                        onClick={() => reset()}
                        className="bg-[#33333388] border border-[#929292] rounded-xl px-4 py-2 font-mono text-xs font-bold text-[#aaacae] cursor-pointer hover:-translate-y-0.5 transition-all"
                    >
                        Reset
                    </button>
                    <button
                        onClick={startAutoPlay}
                        className="bg-[#6366f115] border border-[#6366f144] rounded-xl px-4 py-2 font-mono text-xs font-bold text-[#6366f1] cursor-pointer hover:-translate-y-0.5 transition-all"
                    >
                        {autoPlaying ? "Pause ⏸" : "Auto play ▶"}
                    </button>
                    <span className="bg-[#22d3a515] border border-[#22d3a544] text-[#22d3a5] font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg">
                        Step {step}
                    </span>
                    <span className="bg-[#6366f115] border border-[#6366f144] text-[#6366f1] font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg">
                        {comparisons} comparison{comparisons !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Log */}
                <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs text-[#aaacae] min-h-[44px]">
                    <span style={{ color: found !== null ? "#22d3a5" : notFound ? "#f43f5e" : "#aaacae" }}>{log}</span>
                </div>

                {/* Pointer readout */}
                <div className="flex gap-4 mt-3 font-mono text-xs">
                    <span>left: <strong className="text-[#22d3a5]">{left}</strong></span>
                    <span>mid: <strong className="text-[#facc15]">{mid !== null ? mid : "—"}</strong></span>
                    <span>right: <strong className="text-[#f43f5e]">{right}</strong></span>
                    <span>target: <strong className="text-white">{target}</strong></span>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 3. DECISION LOGIC ─── */
function DecisionLogic() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🧠" text="The Decision Logic" />
                <p className="text-[#aaacae] text-sm mb-4">
                    At every step, exactly one of three things happens. Understanding this is the whole algorithm.
                </p>
                <div className="flex flex-col gap-3 mb-4">
                    {[
                        {
                            color: "#22d3a5",
                            title: "arr[mid] === target → FOUND ✔",
                            body: "The middle element is exactly what we're looking for. Return the index. Done.",
                        },
                        {
                            color: "#f59e0b",
                            title: "arr[mid] < target → Search RIGHT half",
                            body: `The middle is too small. Since the array is sorted, everything to the LEFT of mid is also too small. Discard the entire left half. Set left = mid + 1.`,
                        },
                        {
                            color: "#6366f1",
                            title: "arr[mid] > target → Search LEFT half",
                            body: `The middle is too large. Everything to the RIGHT of mid is also too large. Discard the entire right half. Set right = mid - 1.`,
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="bg-[#222] rounded-[0_10px_10px_0] px-4 py-3.5"
                            style={{ borderLeft: `3px solid ${item.color}` }}
                        >
                            <div className="font-mono text-xs font-bold mb-1.5" style={{ color: item.color }}>
                                {item.title}
                            </div>
                            <p className="text-xs text-[#aaacae] leading-[1.65]">{item.body}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-[#2d2010] border border-[#f59e0b33] rounded-xl px-4 py-3 text-sm">
                    <strong className="text-[#f59e0b]">⚠ Loop terminates when left {">"} right.</strong>{" "}
                    <span className="text-[#aaacae]">
                        This means we've exhausted the search space — the target isn't in the array. Return{" "}
                        <code className="text-white">-1</code>.
                    </span>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 4. CODE PATTERNS ─── */
const PATTERNS = [
    {
        name: "Classic Search",
        desc: "Find any occurrence of target. Returns index or -1 if not found.",
        when: "Use when: elements are unique, or you just need any occurrence.",
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Avoid overflow: use (left + right) >>> 1 in Java/C++
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;       // found
    else if (arr[mid] < target) left = mid + 1; // search right
    else right = mid - 1;                       // search left
  }

  return -1; // not found
}`,
    },
    {
        name: "Lower Bound",
        desc: "First index where arr[i] >= target. Finds leftmost occurrence or insertion point.",
        when: "Use when: duplicates exist and you need the first occurrence; or to count elements < target.",
        code: `function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length; // note: arr.length, not arr.length - 1
  let ans = arr.length;   // default: target > all elements

  while (left <= right - 1) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] >= target) {
      ans = mid;       // mid is a candidate, try further left
      right = mid - 1;
    } else {
      left = mid + 1;  // too small, go right
    }
  }

  return ans; // index of first element >= target
}

// Example:
// arr = [1, 3, 3, 3, 7], target = 3
// lowerBound → 1 (first '3' is at index 1)`,
    },
    {
        name: "Upper Bound",
        desc: "First index where arr[i] > target. One past the last occurrence.",
        when: "Use when: you need the count of occurrences (upperBound - lowerBound), or the last occurrence.",
        code: `function upperBound(arr, target) {
  let left = 0;
  let right = arr.length;
  let ans = arr.length;

  while (left <= right - 1) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] > target) {
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return ans; // index of first element > target
}

// Count occurrences of target:
function countOccurrences(arr, target) {
  return upperBound(arr, target) - lowerBound(arr, target);
}

// Example:
// arr = [1, 3, 3, 3, 7], target = 3
// upperBound → 4, lowerBound → 1 → count = 3`,
    },
    {
        name: "Search on Answer",
        desc: "Binary search on the answer space, not an array. A powerful optimization pattern.",
        when: "Use when: asked to minimize/maximize something and you can verify a candidate answer in O(n).",
        code: `// Problem: Koko eating bananas
// Given piles and h hours, find minimum eating speed k
// such that Koko can finish all bananas in h hours.

function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles); // speed can be 1 to max pile

  while (left < right) {
    let mid = Math.floor((left + right) / 2);

    // Can Koko eat all piles at speed 'mid' within h hours?
    if (canFinish(piles, mid, h)) {
      right = mid; // mid works, try smaller (minimize)
    } else {
      left = mid + 1; // too slow, need higher speed
    }
  }

  return left; // minimum valid speed
}

function canFinish(piles, speed, h) {
  let hours = 0;
  for (const pile of piles) {
    hours += Math.ceil(pile / speed);
  }
  return hours <= h;
}

// Pattern template:
// lo = minimum possible answer
// hi = maximum possible answer
// while (lo < hi) → binary search on [lo, hi]
// if (check(mid)) → try smaller (right = mid)
// else → try larger (left = mid + 1)`,
    },
];

function Patterns() {
    const [active, setActive] = useState(0);
    const p = PATTERNS[active];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="💡" text="Code Patterns" />
                <div className="flex gap-2 flex-wrap mb-5">
                    {PATTERNS.map((pat, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="rounded-xl px-4 py-2 cursor-pointer font-mono text-xs font-bold transition-all duration-200"
                            style={{
                                background: active === i ? "#000" : "#333",
                                border: `1px solid ${active === i ? "#e2e8f0" : "#929292"}`,
                                color: active === i ? "#e2e8f0" : "#aaacae",
                            }}
                        >
                            {pat.name}
                        </button>
                    ))}
                </div>
                <div className="bg-[#22222288] border border-[#2a2a2a] rounded-2xl p-4">
                    <p className="text-sm text-white mb-1.5">{p.desc}</p>
                    <p className="text-xs text-[#22d3a5] mb-4">
                        <strong>Use when:</strong> {p.when.replace("Use when: ", "")}
                    </p>
                    <pre className="bg-[#1a1a1a] border-l-[3px] border-[#22d3a5] rounded-[0_10px_10px_0] px-4 py-4 font-mono text-xs text-[#aaacae] leading-[1.75] whitespace-pre-wrap m-0">
                        {p.code}
                    </pre>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 5. COMPLEXITY ─── */
function Complexity() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [n, setN] = useState(10);

    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const actualN = Math.pow(2, n);
    const logN = n;
    const speedup = Math.round(actualN / logN);

    const rows = [
        { op: "Best case (target is mid)", big: "O(1)", bar: 3, note: "Target found on the very first check" },
        { op: "Average case", big: "O(log n)", bar: 30, note: "Halves the search space each step" },
        { op: "Worst case (not found)", big: "O(log n)", bar: 30, note: "All log n steps exhausted, return -1" },
        { op: "Space (iterative)", big: "O(1)", bar: 3, note: "Only left, right, mid variables needed" },
        { op: "Space (recursive)", big: "O(log n)", bar: 30, note: "Call stack grows log n frames deep" },
    ];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="⏱️" text="Complexity Deep Dive" />
                <p className="text-[#aaacae] text-sm mb-4">
                    Drag to see how binary search scales versus linear search as n grows.
                </p>

                {/* Slider */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-[#aaacae] text-sm">n = 2^{n} =</span>
                    <input
                        type="range" min="1" max="30" value={n}
                        onChange={(e) => setN(Number(e.target.value))}
                        className="flex-1"
                        style={{ accentColor: "#22d3a5", minWidth: 120 }}
                    />
                    <span className="font-mono text-sm font-bold text-[#22d3a5] min-w-[90px]">
                        {actualN.toLocaleString()}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                        { label: "Linear O(n)", value: actualN.toLocaleString(), color: "#f43f5e" },
                        { label: "Binary O(log n)", value: logN, color: "#22d3a5" },
                        { label: "Speedup factor", value: `${speedup.toLocaleString()}×`, color: "#6366f1" },
                    ].map((s) => (
                        <div key={s.label} className="bg-[#222] rounded-xl p-3">
                            <div className="font-mono text-[11px] font-bold mb-1" style={{ color: s.color }}>{s.label}</div>
                            <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
                            <div className="text-[11px] text-[#aaacae] mt-1">comparisons</div>
                        </div>
                    ))}
                </div>

                {/* Complexity table */}
                <div ref={ref} className="flex flex-col gap-2">
                    {rows.map((r, i) => (
                        <div key={i} className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[13px] text-white">{r.op}</span>
                                <span className="font-mono text-xs font-bold text-[#22d3a5]">{r.big}</span>
                            </div>
                            <div className="h-1.5 bg-[#333] rounded-full overflow-hidden mb-1">
                                <div
                                    style={{
                                        height: "100%", borderRadius: 99, background: "#22d3a5",
                                        width: visible ? `${r.bar}%` : "0%",
                                        transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                                    }}
                                />
                            </div>
                            <div className="text-[11px] text-[#aaacae]">{r.note}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 6. VARIANTS ─── */
function Variants() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🔍" text="Common Variants & When to Use Each" />
                <div className="flex flex-col gap-3">
                    {[
                        {
                            title: "1. Find exact element",
                            when: "arr = [1,3,5,7,9] → find(7) → index 3",
                            body: "Standard binary search. Use when elements are unique or you just need any occurrence. Returns index or -1.",
                        },
                        {
                            title: "2. Lower bound (first occurrence / first ≥ target)",
                            when: "arr = [1,3,3,3,7] → lowerBound(3) → index 1",
                            body: "Find the leftmost position where target could be inserted. Useful with duplicates, or to count elements smaller than target.",
                        },
                        {
                            title: "3. Upper bound (last occurrence + 1 / first > target)",
                            when: "arr = [1,3,3,3,7] → upperBound(3) → index 4",
                            body: "One past the last occurrence. Combine with lower bound to count all occurrences: count = upper - lower.",
                        },
                        {
                            title: "4. Rotated sorted array",
                            when: "arr = [4,5,6,7,0,1,2] → find(0) → index 4",
                            body: "At least one half of any split is always sorted. Check which half is sorted, decide which half contains target, then recurse. O(log n).",
                        },
                        {
                            title: "5. Search on answer space",
                            when: "\"Find minimum speed to eat bananas in H hours\"",
                            body: "Binary search on the answer itself (not the array). Define a monotonic check function — if a candidate answer works, try smaller; if not, try larger. One of the most powerful patterns in competitive programming.",
                        },
                        {
                            title: "6. Find peak element",
                            when: "arr = [1,3,5,4,2] → peak at index 2 (value 5)",
                            body: "A peak is an element greater than its neighbors. If arr[mid] < arr[mid+1], peak is to the right. Otherwise it's to the left or at mid. O(log n).",
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-[#222] rounded-xl p-4">
                            <div className="font-mono text-xs font-bold text-white mb-1.5">{item.title}</div>
                            <p className="text-xs text-[#aaacae] leading-[1.65] mb-2">{item.body}</p>
                            <div className="font-mono text-[11px] text-[#6366f1]">{item.when}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 7. COMMON MISTAKES ─── */
function Mistakes() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⚠️" text="Common Bugs & How to Avoid Them" />
                <div className="flex flex-col gap-3">
                    {[
                        {
                            bug: "Off-by-one: while (left < right) vs while (left <= right)",
                            fix: "Use left <= right for standard search (loop exits when left > right, meaning not found). Use left < right for lower/upper bound variants.",
                            severity: "#f43f5e",
                        },
                        {
                            bug: "Integer overflow with mid = (left + right) / 2",
                            fix: "In languages with fixed-size integers (Java, C++): use mid = left + (right - left) / 2. In JavaScript this isn't an issue due to floating-point numbers, but adopt the habit.",
                            severity: "#f59e0b",
                        },
                        {
                            bug: "Infinite loop: forgetting to update left or right",
                            fix: "Always set left = mid + 1 or right = mid - 1, never left = mid or right = mid (except in specific bound variants). If mid never changes, you loop forever.",
                            severity: "#f43f5e",
                        },
                        {
                            bug: "Applying binary search on an unsorted array",
                            fix: "Binary search only works on sorted data. If input isn't sorted, either sort it first (O(n log n)) or use a different approach.",
                            severity: "#f43f5e",
                        },
                        {
                            bug: "Returning mid after the loop ends (should return -1)",
                            fix: "After the while loop exits with left > right, the target wasn't found. Return -1. A common mistake is returning mid, which still holds the last checked index.",
                            severity: "#f59e0b",
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-[#222] rounded-xl p-4" style={{ borderLeft: `3px solid ${item.severity}` }}>
                            <div className="font-mono text-xs font-bold mb-2" style={{ color: item.severity }}>
                                ✗ Bug: {item.bug}
                            </div>
                            <div className="text-xs text-[#aaacae] leading-[1.65]">
                                <strong className="text-[#22d3a5]">✔ Fix:</strong> {item.fix}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 8. INTERVIEW TIPS ─── */
function InterviewTips() {
    const tips = [
        { icon: "✅", title: "Confirm the array is sorted", body: "Always ask. If not sorted, you can't use binary search directly. Sorting first adds O(n log n) — sometimes still worth it." },
        { icon: "🎯", title: "Identify the search space", body: "It doesn't have to be an array. The search space could be a range of integers (answer space), a matrix, or even a floating-point range." },
        { icon: "⚡", title: "Know which variant to use", body: "Exact match? Classic. First occurrence? Lower bound. Last occurrence? Upper bound. Minimize/maximize? Search on answer." },
        { icon: "🧠", title: "Verify termination", body: "Mentally trace: does left or right always move? Does the loop always terminate? Write a 3-element example and step through it." },
        { icon: "❌", title: "Don't use binary search when…", body: "The data isn't sorted and you can't sort it. Or when the search space isn't monotone (check function must be: false…false…true…true, never mixed)." },
        { icon: "📌", title: "Test edge cases aloud", body: "Empty array [], single element, target at index 0, target at last index, target not present, all same elements." },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🎓" text="Interview Tips" />
                <div className="grid grid-cols-2 gap-3">
                    {tips.map((t, i) => (
                        <div
                            key={i}
                            className="bg-[#222] rounded-2xl p-4"
                            style={{ borderLeft: "3px solid #22d3a5" }}
                        >
                            <div className="text-[13px] font-bold mb-1.5 text-white">
                                {t.icon} {t.title}
                            </div>
                            <p className="text-xs text-[#aaacae] leading-[1.65] m-0">{t.body}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 9. QUICK REFERENCE ─── */
function QuickRef() {
    const rows = [
        ["left = 0, right = n-1", "Initialize pointers to both ends"],
        ["mid = Math.floor((l+r)/2)", "Safe midpoint calculation"],
        ["left <= right", "Loop condition for classic search"],
        ["left < right", "Loop condition for bound variants"],
        ["left = mid + 1", "Discard left half (arr[mid] < target)"],
        ["right = mid - 1", "Discard right half (arr[mid] > target)"],
        ["return mid", "Target found at index mid"],
        ["return -1", "Target not in array"],
        ["return left", "Insertion point (lower bound result)"],
        ["lowerBound(arr, x)", "First index where arr[i] >= x"],
        ["upperBound(arr, x)", "First index where arr[i] > x"],
        ["upper - lower", "Count of occurrences of x"],
        ["O(log n) time", "Max steps = ceil(log₂(n))"],
        ["O(1) space", "Iterative version only stores 3 vars"],
        ["O(log n) space", "Recursive version — call stack depth"],
    ];

    return (
        <Section delay={0.04}>
            <Card>
                <STitle icon="📋" text="Quick Reference" />
                <div className="flex flex-col gap-1">
                    {rows.map(([code, desc], i) => (
                        <div
                            key={i}
                            className={`grid gap-3 px-3 py-2 rounded-lg items-center ${i % 2 === 0 ? "bg-[#222]" : "bg-transparent"}`}
                            style={{ gridTemplateColumns: "230px 1fr" }}
                        >
                            <code className="font-mono text-xs font-bold text-white">{code}</code>
                            <span className="text-xs text-[#aaacae]">{desc}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── ROOT ─── */
export default function BinarySearchPage() {
    return (
        <div className="bs-root text-white min-h-screen px-5 py-8" style={{ maxWidth: 1000, margin: "0 auto" }}>
            <GlobalStyles />

            <div className="text-center mb-10 fade-up">
                <h1 className="text-4xl font-extrabold tracking-tight m-0">Binary Search</h1>
                <p className="text-[#aaacae] text-base mt-2.5 leading-[1.7]">
                    The art of cutting your problem in half — repeatedly. Master this and you'll think logarithmically forever.
                </p>
            </div>

            <Intro />
            <LiveOps />
            <DecisionLogic />
            <Patterns />
            <Complexity />
            <Variants />
            <Mistakes />
            <InterviewTips />
            <QuickRef />

            <div className="text-center py-6 text-[#929292] text-[13px]">
                Binary search is the foundation of efficient algorithms — practice it until it's instinct 🚀
            </div>
        </div>
    );
}