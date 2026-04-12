import { useState, useEffect, useRef } from "react";

const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    .sk-root { font-family: 'Syne', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp 0.55s ease both; }
    @keyframes scanLine { 0% { top:0; opacity:0.12; } 50% { opacity:0.18; } 100% { top:100%; opacity:0; } }
    .scan { position:relative; overflow:hidden; }
    .scan::after { content:''; position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#38bdf8,transparent); animation: scanLine 3s linear infinite; }
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
    <div className={`rounded-[20px] p-7 mb-6 bg-[#1a1a1a] border border-[#2a2a2a] relative overflow-hidden ${className}`}>
        {children}
    </div>
);

const STitle = ({ icon, text }) => (
    <h2 className="text-xl font-extrabold mb-[18px] flex items-center gap-2.5 m-0">
        <span>{icon}</span> {text}
    </h2>
);

/* ─── STACK VISUAL COMPONENT ─── */
const StackVisual = ({ items, topHighlight = true, flashIdx = null }) => (
    <div className="flex flex-col items-center gap-0 w-fit">
        {/* Open top indicator */}
        <div className="flex items-center gap-2 mb-1">
            <div style={{ width: 120, height: 2, borderLeft: "2px solid #929292", borderRight: "2px solid #929292", borderTop: "none", borderBottom: "none", opacity: 0.4 }} />
            <span className="text-[10px] font-mono text-[#929292]">open top</span>
        </div>
        {/* Items — reversed so top of stack is at visual top */}
        {[...items].reverse().map((val, ri) => {
            const i = items.length - 1 - ri;
            const isTop = i === items.length - 1;
            const isFlash = flashIdx === i;
            return (
                <div
                    key={`${val}-${i}`}
                    style={{
                        width: 120,
                        height: 44,
                        background: isFlash ? "#facc1510" : isTop && topHighlight ? "#22d3a510" : "#333",
                        border: `2px solid ${isFlash ? "#facc15" : isTop && topHighlight ? "#22d3a5" : "#929292"}`,
                        borderTop: ri === 0 ? undefined : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingLeft: 14,
                        paddingRight: 10,
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 14,
                        fontWeight: 700,
                        color: isFlash ? "#facc15" : isTop && topHighlight ? "#22d3a5" : "#e2e8f0",
                        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                        transform: isFlash ? "scale(1.04)" : "scale(1)",
                    }}
                >
                    <span>{val}</span>
                    {isTop && <span style={{ fontSize: 9, color: isTop && topHighlight ? "#22d3a5" : "#929292", fontFamily: "monospace" }}>← TOP</span>}
                </div>
            );
        })}
        {items.length === 0 && (
            <div style={{ width: 120, height: 44, background: "#222", border: "2px dashed #333", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="text-[11px] font-mono text-[#929292]">empty</span>
            </div>
        )}
        {/* Closed bottom */}
        <div style={{ width: 120, height: 3, background: "#929292", opacity: 0.5, borderRadius: "0 0 4px 4px" }} />
        <span className="text-[10px] font-mono text-[#929292] mt-1">closed bottom</span>
    </div>
);

/* ─── 1. INTRO ─── */
function Intro() {
    const [step, setStep] = useState(0);
    const snapshots = [
        { stack: [], action: "Start with an empty stack.", op: null },
        { stack: [10], action: "push(10) → 10 enters. It's now the only element — it's the TOP.", op: "push" },
        { stack: [10, 20], action: "push(20) → 20 lands on top of 10. TOP is now 20.", op: "push" },
        { stack: [10, 20, 30], action: "push(30) → 30 lands on top. TOP is now 30.", op: "push" },
        { stack: [10, 20], action: "pop() → 30 is removed first (LIFO). TOP returns to 20.", op: "pop" },
        { stack: [10], action: "pop() → 20 removed. TOP is now 10.", op: "pop" },
        { stack: [], action: "pop() → 10 removed. Stack is empty again.", op: "pop" },
    ];
    const cur = snapshots[step];

    return (
        <Section>
            <Card>
                <STitle icon="📚" text="What is a Stack?" />
                <p className="text-white/90 leading-[1.75] mb-4 text-[15px]">
                    A <strong>stack</strong> is a linear data structure that follows the{" "}
                    <strong>LIFO</strong> principle — <strong>Last In, First Out</strong>. Think of a stack
                    of plates: you always add and remove from the top. You can never reach the bottom plate
                    without removing all the plates above it first.
                </p>

                <div className="bg-[#1e2d3a] border border-[#306ed233] rounded-xl px-4 py-3 text-sm text-white mb-5">
                    <strong className="text-[#22d3a5]">The rule:</strong> Only the <strong>top element</strong> is ever accessible.
                    Push adds to top. Pop removes from top. Peek reads the top without removing it.
                    All three operations are <strong>O(1)</strong>.
                </div>

                {/* Animated intro stepper */}
                <p className="text-xs text-[#929292] font-mono mb-3">// Step through push and pop to see LIFO in action</p>
                <div className="flex gap-8 items-start flex-wrap mb-4">
                    <StackVisual items={cur.stack} />
                    <div className="flex-1 min-w-[200px]">
                        <div
                            className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs mb-3"
                            style={{ animation: "fadeUp 0.2s ease" }}
                        >
                            <span style={{ color: cur.op === "push" ? "#22d3a5" : cur.op === "pop" ? "#f43f5e" : "#aaacae" }}>
                                {cur.op ? `${cur.op}()` : "//"}
                            </span>{" "}
                            <span className="text-[#aaacae]">{cur.action}</span>
                        </div>
                        <div className="text-xs font-mono text-[#aaacae] mb-3">
                            stack.length = <strong className="text-white">{cur.stack.length}</strong>
                            {cur.stack.length > 0 && (
                                <> &nbsp;|&nbsp; top = <strong className="text-[#22d3a5]">{cur.stack[cur.stack.length - 1]}</strong></>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStep(s => Math.max(0, s - 1))}
                                className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-xs font-mono"
                            >← Prev</button>
                            <button
                                onClick={() => setStep(s => Math.min(snapshots.length - 1, s + 1))}
                                className="bg-[#22d3a515] border border-[#22d3a544] rounded-lg px-4 py-1.5 text-[#22d3a5] cursor-pointer text-xs font-mono font-bold"
                            >Next →</button>
                            <span className="text-xs font-mono text-[#929292] self-center">{step + 1}/{snapshots.length}</span>
                        </div>
                    </div>
                </div>

                {/* Real-world analogies */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                        { title: "Stack of plates", body: "You always take the top plate. Adding a plate goes on top. You never reach the bottom without removing everything above." },
                        { title: "Browser back button", body: "Each page you visit is pushed. Pressing Back pops the current page and returns to the previous one." },
                        { title: "Undo / Redo", body: "Every action is pushed. Ctrl+Z pops the last action to undo it. Ctrl+Y pushes it back to redo." },
                        { title: "Function call stack", body: "When a function calls another, it's pushed. When it returns, it's popped. Recursion is a stack in action." },
                    ].map((item, i) => (
                        <div key={i} className="bg-[#222] rounded-xl p-3.5 border border-[#2a2a2a]">
                            <div className="text-xs font-bold text-white mb-1.5">{item.title}</div>
                            <p className="text-[11px] text-[#aaacae] leading-[1.65] m-0">{item.body}</p>
                        </div>
                    ))}
                </div>

                {/* Code snippets */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { lang: "JavaScript", code: `// JS array works as a stack\nconst stack = [];\n\nstack.push(10);  // [10]\nstack.push(20);  // [10, 20]\nstack.push(30);  // [10, 20, 30]\n\nstack.pop();     // 30 removed\nstack.at(-1);    // peek → 20` },
                        { lang: "C++", code: `#include <stack>\nusing namespace std;\n\nstack<int> st;\n\nst.push(10);   // push\nst.push(20);\nst.push(30);\n\nst.pop();      // removes 30\nst.top();      // peek → 20\nst.size();     // 2` },
                    ].map((ex, i) => (
                        <div key={i} className="bg-[#222] rounded-xl px-4 py-3.5 border border-[#2a2a2a]">
                            <div className="text-[11px] font-bold mb-2 font-mono text-[#aaacae]">{ex.lang}</div>
                            <pre className="m-0 font-mono text-xs text-[#aaacae] whitespace-pre-wrap leading-[1.7]">{ex.code}</pre>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 2. HOW IT WORKS IN MEMORY ─── */
function MemoryLayout() {
    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🧠" text="How a Stack Works Internally" />
                <p className="text-white/90 leading-[1.75] mb-4 text-[15px]">
                    A stack is an <strong>abstract data type</strong> — it's a set of rules (push/pop/peek from top only),
                    not a specific memory layout. It can be implemented two ways:
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-[#222] rounded-xl p-4 border border-[#2a2a2a]">
                        <div className="font-mono text-xs font-bold text-white mb-2">Using an Array</div>
                        <div className="overflow-x-auto mb-3">
                            <div className="flex gap-0 min-w-max">
                                {[10, 20, 30, "TOP↑"].map((val, i) => (
                                    <div key={i} style={{
                                        width: i === 3 ? 48 : 52,
                                        height: 40,
                                        background: i === 2 ? "#22d3a510" : i === 3 ? "transparent" : "#333",
                                        border: i === 3 ? "none" : `1px solid ${i === 2 ? "#22d3a5" : "#929292"}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontFamily: "JetBrains Mono, monospace", fontSize: i === 3 ? 9 : 13,
                                        fontWeight: 700,
                                        color: i === 2 ? "#22d3a5" : i === 3 ? "#929292" : "#e2e8f0",
                                    }}>{val}</div>
                                ))}
                            </div>
                            <div className="flex gap-0">
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{ width: 52, textAlign: "center", fontSize: 9, color: "#929292", fontFamily: "monospace" }}>[{i}]</div>
                                ))}
                            </div>
                        </div>
                        <p className="text-[11px] text-[#aaacae] leading-[1.65] m-0">
                            A pointer called <code className="text-white">top</code> tracks the last filled index.
                            push increments top, pop decrements it. O(1) for both. Downside: fixed capacity (unless dynamic).
                        </p>
                    </div>
                    <div className="bg-[#222] rounded-xl p-4 border border-[#2a2a2a]">
                        <div className="font-mono text-xs font-bold text-white mb-2">Using a Linked List</div>
                        <div className="flex items-center gap-1 mb-3">
                            {["30\n(TOP)", "20", "10"].map((val, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <div style={{
                                        padding: "6px 10px", background: i === 0 ? "#22d3a510" : "#333",
                                        border: `1px solid ${i === 0 ? "#22d3a5" : "#929292"}`,
                                        borderRadius: 6, fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                                        color: i === 0 ? "#22d3a5" : "#e2e8f0", textAlign: "center",
                                        whiteSpace: "pre",
                                    }}>{val}</div>
                                    {i < 2 && <span style={{ color: "#929292", fontSize: 12 }}>→</span>}
                                    {i === 2 && <span style={{ fontSize: 10, color: "#929292", fontFamily: "monospace" }}>→ null</span>}
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-[#aaacae] leading-[1.65] m-0">
                            Head of the linked list = top of stack. push prepends a new node, pop removes the head.
                            O(1) for both. Benefit: truly dynamic size. Downside: pointer overhead per node.
                        </p>
                    </div>
                </div>

                <div className="bg-[#1e2d3a] border border-[#306ed233] rounded-xl px-4 py-3 text-sm text-white">
                    <strong className="text-[#22d3a5]">In JavaScript:</strong> Arrays are dynamic by default — <code>push()</code> and{" "}
                    <code>pop()</code> already give you O(1) stack behavior. In C++, use{" "}
                    <code>std::stack</code> (backed by <code>std::deque</code>) or a <code>vector</code> with{" "}
                    <code>push_back</code>/<code>pop_back</code>.
                </div>
            </Card>
        </Section>
    );
}

/* ─── 3. LIVE OPERATIONS ─── */
function LiveOps() {
    const [stack, setStack] = useState([10, 20, 30]);
    const [input, setInput] = useState("");
    const [log, setLog] = useState([]);
    const [flashIdx, setFlashIdx] = useState(null);

    const addLog = (msg, color = "#22d3a5") =>
        setLog(p => [{ msg, color }, ...p].slice(0, 6));

    const flash = (idx, cb) => {
        setFlashIdx(idx);
        setTimeout(() => { setFlashIdx(null); cb && cb(); }, 500);
    };

    const val = () => parseInt(input) || Math.floor(Math.random() * 90 + 10);

    const ops = [
        {
            label: "push(x)", color: "#22d3a5",
            action() {
                const v = val();
                setStack(p => [...p, v]);
                addLog(`push(${v}) → added to top. O(1)`, "#22d3a5");
                setInput("");
            },
        },
        {
            label: "pop()", color: "#f43f5e",
            action() {
                if (!stack.length) { addLog("pop() → stack is empty!", "#f43f5e"); return; }
                const top = stack[stack.length - 1];
                flash(stack.length - 1, () => setStack(p => p.slice(0, -1)));
                addLog(`pop() → removed ${top} from top. O(1)`, "#f43f5e");
            },
        },
        {
            label: "peek()", color: "#f59e0b",
            action() {
                if (!stack.length) { addLog("peek() → stack is empty!", "#f43f5e"); return; }
                flash(stack.length - 1, null);
                addLog(`peek() → top is ${stack[stack.length - 1]}. O(1), no removal`, "#f59e0b");
            },
        },
        {
            label: "isEmpty()", color: "#a78bfa",
            action() {
                addLog(`isEmpty() → ${stack.length === 0}. size = ${stack.length}`, "#a78bfa");
            },
        },
        {
            label: "size()", color: "#38bdf8",
            action() {
                addLog(`size() → ${stack.length} elements`, "#38bdf8");
            },
        },
        {
            label: "reset", color: "#929292",
            action() {
                setStack([]);
                addLog("Stack cleared.", "#929292");
            },
        },
    ];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="⚡" text="Live Operations" />
                <p className="text-[#aaacae] text-sm mb-4">
                    Click operations to mutate the stack. All operations affect only the top — that's the whole point.
                </p>

                <div className="flex gap-8 items-start flex-wrap mb-4">
                    <StackVisual items={stack} flashIdx={flashIdx} />
                    <div className="flex-1 min-w-[200px]">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Value for push (blank = random)"
                            className="w-full bg-[#333] border border-[#929292] rounded-[10px] px-3.5 py-2.5 text-white font-mono text-[13px] outline-none mb-3"
                        />
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {ops.map(op => (
                                <button
                                    key={op.label}
                                    onClick={op.action}
                                    className="rounded-xl py-2.5 px-2 cursor-pointer font-mono text-xs font-bold transition-all duration-[180ms] hover:-translate-y-0.5"
                                    style={{ background: op.color + "15", border: `1px solid ${op.color}44`, color: op.color }}
                                >
                                    {op.label}
                                </button>
                            ))}
                        </div>
                        <div className="text-xs font-mono text-[#aaacae]">
                            size: <strong className="text-white">{stack.length}</strong>
                            {stack.length > 0 && <> &nbsp;|&nbsp; top: <strong className="text-[#22d3a5]">{stack[stack.length - 1]}</strong></>}
                            {stack.length === 0 && <> &nbsp;|&nbsp; <span className="text-[#f43f5e]">empty</span></>}
                        </div>
                    </div>
                </div>

                {log.length > 0 && (
                    <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs">
                        {log.map((l, i) => (
                            <div key={i} className="mb-[3px]" style={{ color: i === 0 ? l.color : "#aaacae", opacity: 1 - i * 0.15 }}>
                                {i === 0 ? "▶ " : "  "}{l.msg}
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
        { op: "push(x) — add to top", big: "O(1)", bar: 5, note: "Increment top pointer and assign — instant" },
        { op: "pop() — remove from top", big: "O(1)", bar: 5, note: "Read top, decrement pointer — instant" },
        { op: "peek() — read top", big: "O(1)", bar: 5, note: "Just read arr[top] without modifying anything" },
        { op: "isEmpty() / size()", big: "O(1)", bar: 5, note: "Check or return the top pointer value" },
        { op: "Search for element", big: "O(n)", bar: 52, note: "Must pop elements one by one until found" },
        { op: "Access element at index i", big: "O(n)", bar: 52, note: "Stacks don't support random access — must pop to reach" },
        { op: "Space", big: "O(n)", bar: 52, note: "One slot per element pushed onto the stack" },
    ];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="⏱️" text="Time & Space Complexity" />
                <p className="text-[#aaacae] text-sm mb-5">Bars animate as you scroll. Shorter = faster.</p>
                <div ref={ref} className="flex flex-col gap-2.5">
                    {rows.map((r, i) => (
                        <div key={i} className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] text-white/90">{r.op}</span>
                                <span className="text-white font-bold font-mono text-xs">{r.big}</span>
                            </div>
                            <div className="h-1.5 bg-[#333] rounded-full overflow-hidden mb-1.5">
                                <div style={{
                                    height: "100%", borderRadius: 99, background: "#306ed2",
                                    width: visible ? `${r.bar}%` : "0%",
                                    transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`,
                                }} />
                            </div>
                            <div className="text-[11px] text-[#929292]">{r.note}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-5 bg-[#1e2d3a] border border-[#306ed233] rounded-xl px-4 py-3 text-sm text-white">
                    <strong className="text-[#22d3a5]">Key insight:</strong> Stack's power is that push, pop, and peek are all{" "}
                    <strong>O(1)</strong>. It sacrifices random access (O(n)) in exchange for a strict, fast, predictable interface.
                    This constraint is what makes it useful — not a bug, but a feature.
                </div>
            </Card>
        </Section>
    );
}

/* ─── 5. ALGORITHM PATTERNS ─── */

function ParenthesesViz() {
    const input = "({[]})";
    const steps = [
        { i: 0, ch: "(", stack: ["("], action: "Opening bracket → push onto stack", match: null },
        { i: 1, ch: "{", stack: ["(", "{"], action: "Opening bracket → push onto stack", match: null },
        { i: 2, ch: "[", stack: ["(", "{", "["], action: "Opening bracket → push onto stack", match: null },
        { i: 3, ch: "]", stack: ["(", "{"], action: "Closing ']' → pop '[' from top. '[' matches ']' ✔", match: true },
        { i: 4, ch: "}", stack: ["("], action: "Closing '}' → pop '{' from top. '{' matches '}' ✔", match: true },
        { i: 5, ch: ")", stack: [], action: "Closing ')' → pop '(' from top. '(' matches ')' ✔", match: true },
        { i: 6, ch: null, stack: [], action: "Stack is empty → all brackets matched → valid! ✔", match: true },
    ];
    const [step, setStep] = useState(0);
    const cur = steps[step];

    return (
        <div className="mt-4">
            <p className="text-xs text-[#929292] font-mono mb-3">// Input: "({[]})" — step through character by character</p>
            {/* Input display */}
            <div className="flex gap-1.5 mb-4 flex-wrap">
                {input.split("").map((ch, i) => (
                    <div key={i} style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: i === cur.i ? "#facc1510" : i < cur.i ? "#22d3a510" : "#333",
                        border: `2px solid ${i === cur.i ? "#facc15" : i < cur.i ? "#22d3a544" : "#929292"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 700,
                        color: i === cur.i ? "#facc15" : i < cur.i ? "#22d3a5" : "#e2e8f0",
                        transition: "all 0.25s ease",
                    }}>{ch}</div>
                ))}
                {cur.ch && (
                    <div className="flex items-center ml-2">
                        <span className="text-[10px] font-mono text-[#facc15]">← current</span>
                    </div>
                )}
            </div>
            {/* Stack state */}
            <div className="flex gap-6 items-start mb-4">
                <div>
                    <div className="text-[11px] font-mono text-[#929292] mb-2">Stack state:</div>
                    <StackVisual items={cur.stack} topHighlight={cur.stack.length > 0} />
                </div>
                <div className="flex-1 bg-[#222] border border-[#2a2a2a] rounded-xl px-3.5 py-3 font-mono text-xs text-[#aaacae] self-start">
                    {cur.action}
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <button onClick={() => setStep(s => Math.max(0, s - 1))} className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-xs font-mono">← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="bg-[#6366f115] border border-[#6366f144] rounded-lg px-4 py-1.5 text-[#6366f1] cursor-pointer text-xs font-mono font-bold">Next →</button>
                <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}

function MonotonicViz() {
    const arr = [2, 1, 5, 6, 2, 3];
    const steps = [];
    {
        let st = [];
        let res = new Array(arr.length).fill(-1);
        for (let i = arr.length - 1; i >= 0; i--) {
            const before = [...st];
            while (st.length && st[st.length - 1] <= arr[i]) st.pop();
            const nge = st.length ? st[st.length - 1] : -1;
            res = [...res]; res[i] = nge;
            st.push(arr[i]);
            steps.push({ i, val: arr[i], stackBefore: before, stackAfter: [...st], nge, res: [...res] });
        }
    }
    steps.reverse();
    const [step, setStep] = useState(0);
    const cur = steps[step];

    return (
        <div className="mt-4">
            <p className="text-xs text-[#929292] font-mono mb-3">// Find next greater element for each index (iterate right to left)</p>
            <div className="flex gap-1.5 mb-4 flex-wrap">
                {arr.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div style={{
                            width: 44, height: 44, borderRadius: 8,
                            background: i === cur.i ? "#facc1510" : "#333",
                            border: `2px solid ${i === cur.i ? "#facc15" : "#929292"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                            color: i === cur.i ? "#facc15" : "#e2e8f0", transition: "all 0.25s ease",
                        }}>{v}</div>
                        <span className="text-[10px] font-mono text-[#aaacae]">
                            {cur.res[i] !== -1 ? `→${cur.res[i]}` : "→-1"}
                        </span>
                    </div>
                ))}
            </div>
            <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#aaacae] mb-3">
                arr[{cur.i}]={cur.val} → next greater = <strong style={{ color: cur.nge !== -1 ? "#22d3a5" : "#f43f5e" }}>{cur.nge !== -1 ? cur.nge : "none (-1)"}</strong>
                &nbsp;| stack after: [{cur.stackAfter.join(", ")}]
            </div>
            <div className="flex gap-2 items-center">
                <button onClick={() => setStep(s => Math.max(0, s - 1))} className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-xs font-mono">← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="bg-[#6366f115] border border-[#6366f144] rounded-lg px-4 py-1.5 text-[#6366f1] cursor-pointer text-xs font-mono font-bold">Next →</button>
                <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}

function Patterns() {
    const [active, setActive] = useState(0);
    const pats = [
        {
            name: "Valid Parentheses",
            desc: "Use a stack to match opening and closing brackets. Push opening brackets, pop when you see a closing one and verify they match. If the stack is empty at the end, the string is valid.",
            when: "Bracket matching, HTML tag validation, expression parsing.",
            viz: <ParenthesesViz />,
            code: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n\n  for (const ch of s) {\n    if ('({['.includes(ch)) {\n      stack.push(ch);         // opening → push\n    } else {\n      if (stack.pop() !== map[ch]) return false; // mismatch\n    }\n  }\n\n  return stack.length === 0; // must be fully matched\n}`,
        },
        {
            name: "Monotonic Stack",
            desc: "Maintain a stack that is always sorted (increasing or decreasing). When a new element violates the order, pop elements until the order is restored. Each element is pushed and popped at most once → O(n) total.",
            when: "Next greater/smaller element, largest rectangle in histogram, daily temperatures.",
            viz: <MonotonicViz />,
            code: `function nextGreater(arr) {\n  const stack = [];\n  const res = new Array(arr.length).fill(-1);\n\n  // Iterate right to left\n  for (let i = arr.length - 1; i >= 0; i--) {\n    // Pop elements that are <= current (not "greater")\n    while (stack.length && stack.at(-1) <= arr[i]) {\n      stack.pop();\n    }\n\n    // Top of stack is first element greater than arr[i]\n    if (stack.length) res[i] = stack.at(-1);\n\n    stack.push(arr[i]);\n  }\n\n  return res;\n}\n\n// [2,1,5,6,2,3] → [5,5,6,-1,3,-1]`,
        },
        {
            name: "Min Stack",
            desc: "Design a stack that supports push, pop, peek, and getMin in O(1). The trick: maintain a parallel 'min stack' that tracks the current minimum at every level of the main stack.",
            when: "Any problem requiring tracking min/max alongside stack operations.",
            viz: (
                <div className="mt-4">
                    <p className="text-xs text-[#929292] font-mono mb-3">// Two parallel stacks: main + minTracker</p>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Main Stack", items: [5, 3, 7, 2], color: "#22d3a5" },
                            { label: "Min Stack (current min at each level)", items: [5, 3, 3, 2], color: "#f59e0b" },
                        ].map(({ label, items, color }) => (
                            <div key={label}>
                                <div className="text-[11px] font-mono mb-2" style={{ color }}>{label}</div>
                                <div className="flex flex-col items-start gap-0">
                                    {[...items].reverse().map((v, ri) => {
                                        const isTop = ri === 0;
                                        return (
                                            <div key={ri} style={{
                                                width: 110, height: 38,
                                                background: isTop ? color + "15" : "#333",
                                                border: `1px solid ${isTop ? color : "#929292"}`,
                                                borderTop: ri === 0 ? `1px solid ${isTop ? color : "#929292"}` : "none",
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                paddingLeft: 12, paddingRight: 8,
                                                fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 700,
                                                color: isTop ? color : "#e2e8f0",
                                            }}>
                                                <span>{v}</span>
                                                {isTop && <span style={{ fontSize: 9, color }}>TOP</span>}
                                            </div>
                                        );
                                    })}
                                    <div style={{ width: 110, height: 3, background: "#929292", opacity: 0.5 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#aaacae] mt-3">
                        getMin() → peek minStack top = <strong className="text-[#22d3a5]">2</strong> &nbsp;(O(1), no scanning needed)
                    </div>
                </div>
            ),
            code: `class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = []; // tracks current min at each level\n  }\n\n  push(val) {\n    this.stack.push(val);\n    const currMin = this.minStack.length\n      ? Math.min(val, this.minStack.at(-1))\n      : val;\n    this.minStack.push(currMin);\n  }\n\n  pop() {\n    this.stack.pop();\n    this.minStack.pop(); // always pop together\n  }\n\n  top()    { return this.stack.at(-1); }\n  getMin() { return this.minStack.at(-1); } // O(1)!\n}`,
        },
        {
            name: "Evaluate Expression",
            desc: "Stacks are the natural data structure for expression evaluation. Push numbers, and when you hit an operator, pop two numbers, apply the operator, and push the result back.",
            when: "Reverse Polish Notation (RPN), calculator problems, compiler expression parsing.",
            viz: (
                <div className="mt-4">
                    <p className="text-xs text-[#929292] font-mono mb-3">// Evaluate RPN: ['2','3','4','*','+'] = 2 + (3*4) = 14</p>
                    <div className="flex flex-col gap-2">
                        {[
                            { token: "2", action: "Push 2", stack: [2] },
                            { token: "3", action: "Push 3", stack: [2, 3] },
                            { token: "4", action: "Push 4", stack: [2, 3, 4] },
                            { token: "*", action: "Pop 4 and 3 → 3 × 4 = 12 → Push 12", stack: [2, 12] },
                            { token: "+", action: "Pop 12 and 2 → 2 + 12 = 14 → Push 14", stack: [14] },
                        ].map((row, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div style={{
                                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                    background: "({[*+".includes(row.token) ? "#f59e0b10" : "#22d3a510",
                                    border: `1px solid ${"({[*+".includes(row.token) ? "#f59e0b44" : "#22d3a544"}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                                    color: "({[*+".includes(row.token) ? "#f59e0b" : "#22d3a5",
                                }}>{row.token}</div>
                                <div className="text-xs font-mono text-[#aaacae] flex-1">{row.action}</div>
                                <div className="text-xs font-mono text-[#929292]">[{row.stack.join(",")}]</div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            code: `function evalRPN(tokens) {\n  const stack = [];\n  const ops = {\n    '+': (a, b) => a + b,\n    '-': (a, b) => a - b,\n    '*': (a, b) => a * b,\n    '/': (a, b) => Math.trunc(a / b),\n  };\n\n  for (const token of tokens) {\n    if (ops[token]) {\n      const b = stack.pop(); // second operand\n      const a = stack.pop(); // first operand\n      stack.push(ops[token](a, b));\n    } else {\n      stack.push(Number(token));\n    }\n  }\n\n  return stack[0]; // final result\n}\n\n// evalRPN(['2','3','4','*','+']) → 14`,
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
                            className="rounded-xl px-4 py-2 cursor-pointer text-xs font-bold transition-all duration-200"
                            style={{
                                background: active === i ? "#000" : "#333",
                                border: `1px solid ${active === i ? "#e2e8f0" : "#929292"}`,
                                color: active === i ? "#e2e8f0" : "#aaacae",
                            }}
                        >
                            {pt.name}
                        </button>
                    ))}
                </div>
                <div className="bg-[#22222288] border border-[#2a2a2a] rounded-2xl p-4">
                    <p className="text-sm text-white mb-1.5">{p.desc}</p>
                    <p className="text-xs text-[#22d3a5] mb-0"><strong>Use when:</strong> {p.when}</p>
                    {p.viz}
                    <p className="text-[11px] text-[#929292] font-mono mt-4 mb-2">// Code</p>
                    <pre className="bg-[#1a1a1a] border-l-[3px] border-[#22d3a5] rounded-[0_10px_10px_0] px-4 py-3.5 font-mono text-xs text-[#aaacae] leading-[1.75] whitespace-pre-wrap m-0">
                        {p.code}
                    </pre>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 6. C++ SECTION ─── */
function CppSection() {
    const [tab, setTab] = useState(0);
    const tabs = [
        {
            label: "std::stack",
            code: `#include <stack>\n#include <iostream>\nusing namespace std;\n\nint main() {\n    stack<int> st;\n\n    st.push(10);      // push\n    st.push(20);\n    st.push(30);\n\n    cout << st.top();  // peek → 30\n    st.pop();          // remove 30\n    cout << st.top();  // → 20\n\n    cout << st.size(); // → 2\n    cout << st.empty();// → false\n\n    return 0;\n}`,
        },
        {
            label: "Stack from Array",
            code: `// Manual stack using array\nclass Stack {\n    int arr[1000];\n    int top = -1;\npublic:\n    void push(int x) {\n        arr[++top] = x;   // pre-increment then assign\n    }\n\n    int pop() {\n        if (top == -1) throw "underflow";\n        return arr[top--]; // return then decrement\n    }\n\n    int peek() {\n        if (top == -1) throw "empty";\n        return arr[top];\n    }\n\n    bool isEmpty() { return top == -1; }\n    int  size()    { return top + 1; }\n};`,
        },
        {
            label: "Min Stack C++",
            code: `#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;\n    stack<int> minSt;\npublic:\n    void push(int val) {\n        st.push(val);\n        int m = minSt.empty()\n            ? val\n            : min(val, minSt.top());\n        minSt.push(m);\n    }\n\n    void pop() {\n        st.pop();\n        minSt.pop();\n    }\n\n    int top()    { return st.top(); }\n    int getMin() { return minSt.top(); } // O(1)\n};`,
        },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="⚙️" text="C++ Implementation" />
                <div className="flex gap-2 mb-5">
                    {tabs.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => setTab(i)}
                            className="rounded-[10px] px-3.5 py-[7px] cursor-pointer text-xs font-bold transition-all duration-200"
                            style={{
                                background: tab === i ? "#38bdf822" : "#333",
                                border: `1px solid ${tab === i ? "#38bdf8" : "#929292"}`,
                                color: tab === i ? "#38bdf8" : "#aaacae",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <pre
                    className="scan bg-[#222] border border-[#929292] rounded-xl px-5 py-[18px] font-mono text-[13px] text-[#aaacae] leading-[1.75] whitespace-pre-wrap m-0"
                    style={{ borderLeft: "3px solid #38bdf8" }}
                >
                    {tabs[tab].code}
                </pre>
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
                            bug: "Stack underflow — calling pop() or peek() on an empty stack",
                            fix: "Always check isEmpty() before pop() or peek(). In JS, stack.pop() on an empty array returns undefined silently — add an explicit guard: if (!stack.length) return;",
                            severity: "#f43f5e",
                        },
                        {
                            bug: "Popping in wrong order for expression evaluation",
                            fix: "When evaluating a - b, the first pop() gives b (second operand) and the second pop() gives a (first operand). Get this order wrong and subtraction/division produce incorrect results.",
                            severity: "#f43f5e",
                        },
                        {
                            bug: "Forgetting to check stack is empty after parentheses matching",
                            fix: "An input like '(((' passes all individual checks (no mismatch) but the stack is not empty at the end. Always return stack.length === 0, not just true.",
                            severity: "#f59e0b",
                        },
                        {
                            bug: "Using stack when you need random access",
                            fix: "Stacks only expose the top. If you need to inspect or modify elements in the middle, use an array or deque instead. Don't hack around stack's interface.",
                            severity: "#f59e0b",
                        },
                        {
                            bug: "Stack overflow in recursion — too many recursive calls",
                            fix: "Each function call adds a frame to the call stack. Deep recursion (e.g. on n=100,000) causes stack overflow. Convert to iterative with an explicit stack, or add memoization to reduce depth.",
                            severity: "#f43f5e",
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
        { icon: "✅", title: "Recognize the LIFO signal", body: "Keywords like 'undo', 'backtrack', 'previous state', 'matching pairs', or 'nested structure' almost always indicate a stack solution." },
        { icon: "🎯", title: "Monotonic stack is a pattern", body: "Anytime you see 'next greater/smaller element', 'largest rectangle', or 'trapping rain water' — think monotonic stack. It reduces O(n²) brute force to O(n)." },
        { icon: "⚡", title: "Use a dummy or sentinel value", body: "For parentheses problems, pushing a sentinel '#' at the start avoids empty-stack checks. For min stack, push Infinity initially so getMin() never crashes." },
        { icon: "🧠", title: "Simulate recursion with a stack", body: "Any recursive DFS can be rewritten iteratively using an explicit stack. Interviewers may ask you to do this to avoid call stack overflow." },
        { icon: "❌", title: "Don't use stack when…", body: "You need to access elements by index, iterate from both ends, or require FIFO ordering — use array, deque, or queue instead." },
        { icon: "📌", title: "Test these edge cases", body: "Empty input, single element, all opening brackets, all same characters, very deeply nested input, expression with only one number." },
    ];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🎓" text="Interview Tips" />
                <div className="grid grid-cols-2 gap-3">
                    {tips.map((t, i) => (
                        <div key={i} className="bg-[#222] rounded-2xl p-4" style={{ borderLeft: "3px solid #22d3a5" }}>
                            <div className="text-[13px] font-bold mb-1.5 text-white">{t.icon} {t.title}</div>
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
        ["push(x)", "Add x to top — O(1)"],
        ["pop()", "Remove and return top — O(1)"],
        ["peek() / top()", "Read top without removing — O(1)"],
        ["isEmpty()", "Check if stack has no elements — O(1)"],
        ["size()", "Number of elements — O(1)"],
        ["stack.at(-1)", "JS: peek at top element"],
        ["st.top()", "C++: peek at top element"],
        ["st.empty()", "C++: true if stack is empty"],
        ["LIFO", "Last In First Out — the core rule"],
        ["Monotonic stack", "Stack maintained in sorted order"],
        ["Call stack", "OS uses a stack for function calls"],
        ["DFS iterative", "Replace recursion stack with explicit stack"],
        ["Min stack trick", "Parallel stack tracking min at each level"],
        ["Valid parentheses", "Push open, pop and match on close"],
        ["RPN evaluation", "Push numbers, pop two on operator"],
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
                            style={{ gridTemplateColumns: "200px 1fr" }}
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
export default function StackPage() {
    return (
        <div className="sk-root min-h-screen text-white px-5 py-8" style={{ maxWidth: 1000, margin: "0 auto" }}>
            <GlobalStyles />

            <div className="text-center mb-10 fade-up">
                <h1 className="text-4xl font-extrabold tracking-tight m-0">Stack</h1>
                <p className="text-[#aaacae] text-base mt-2.5 leading-[1.7]">
                    LIFO in action — the data structure behind undo, recursion, parsing, and monotonic algorithms.
                </p>
            </div>

            <Intro />
            <MemoryLayout />
            <LiveOps />
            <Complexity />
            <Patterns />
            <CppSection />
            <Mistakes />
            <InterviewTips />
            <QuickRef />

            <div className="text-center py-6 text-[#929292] text-[13px]">
                Master the stack — it's the engine behind recursion, DFS, and expression parsing 🚀
            </div>
        </div>
    );
}