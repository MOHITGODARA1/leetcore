import { useState, useEffect, useRef } from "react";

const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    .ll-root { font-family: 'Syne', sans-serif; }
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

/* ─── NODE COMPONENT ─── */
const Node = ({ val, isHead, isTail, isHighlight, isActive, showNull = false }) => (
    <div className="flex items-center gap-0">
        <div className="flex flex-col items-center">
            {isHead && <span className="text-[10px] font-mono text-[#22d3a5] mb-1">HEAD</span>}
            {isTail && !isHead && <span className="text-[10px] font-mono text-[#f43f5e] mb-1">TAIL</span>}
            {!isHead && !isTail && <span className="text-[10px] font-mono text-transparent mb-1">·</span>}
            <div
                style={{
                    display: "flex",
                    border: `2px solid ${isActive ? "#facc15" : isHighlight ? "#22d3a5" : "#929292"}`,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: isActive ? "#facc1510" : isHighlight ? "#22d3a510" : "#333",
                    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: isActive ? "translateY(-6px) scale(1.08)" : "scale(1)",
                }}
            >
                <div
                    style={{
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 14,
                        fontWeight: 700,
                        color: isActive ? "#facc15" : isHighlight ? "#22d3a5" : "#e2e8f0",
                        borderRight: `1px solid ${isActive ? "#facc1544" : "#929292"}`,
                    }}
                >
                    {val}
                </div>
                <div
                    style={{
                        width: 36,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#929292",
                    }}
                >
                    {showNull ? "null" : "•→"}
                </div>
            </div>
        </div>
        {!showNull && (
            <div style={{ width: 20, height: 2, background: "#929292", marginTop: 14 }} />
        )}
    </div>
);

/* ─── 1. INTRO ─── */
function Intro() {
    const [clicked, setClicked] = useState(null);
    const nodes = [
        { val: 10, addr: "0xA100", next: "0xB200" },
        { val: 20, addr: "0xB200", next: "0xC300" },
        { val: 30, addr: "0xC300", next: "0xD400" },
        { val: 40, addr: "0xD400", next: "null" },
    ];

    return (
        <Section>
            <Card>
                <STitle icon="🔗" text="What is a Linked List?" />
                <p className="text-white/90 leading-[1.75] mb-4 text-[15px]">
                    A <strong>linked list</strong> is a linear data structure where elements (called <strong>nodes</strong>)
                    are stored at <strong>random memory locations</strong> and connected via pointers. Unlike arrays,
                    there is no index — to reach node 3, you must traverse from node 1 → 2 → 3.
                </p>
                <p className="text-xs text-[#aaacae] font-mono mb-3">// Click any node to inspect its memory</p>

                {/* Visual */}
                <div className="flex items-start gap-0 flex-wrap mb-4 overflow-x-auto pb-2">
                    {nodes.map((n, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-0 cursor-pointer"
                            onClick={() => setClicked(clicked === i ? null : i)}
                        >
                            <Node
                                val={n.val}
                                isHead={i === 0}
                                isTail={i === nodes.length - 1}
                                isHighlight={clicked === i}
                                showNull={i === nodes.length - 1}
                            />
                            {i < nodes.length - 1 && <div style={{ width: 0 }} />}
                        </div>
                    ))}
                </div>

                {/* Inspector */}
                {clicked !== null && (
                    <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs mb-4" style={{ animation: "fadeUp 0.25s ease" }}>
                        <div className="text-[#929292] text-[11px] mb-2">// Node Inspector</div>
                        <div className="text-[#aaacae]">node.data = <span className="text-white font-bold">{nodes[clicked].val}</span></div>
                        <div className="text-[#aaacae]">node.addr = <span className="text-white font-bold">{nodes[clicked].addr}</span></div>
                        <div className="text-[#aaacae]">node.next = <span className="text-[#22d3a5] font-bold">{nodes[clicked].next}</span></div>
                    </div>
                )}

                {/* Array vs Linked List comparison */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#222] rounded-xl p-4 border border-[#2a2a2a]">
                        <div className="font-mono text-xs font-bold text-[#f43f5e] mb-2">Array — contiguous memory</div>
                        <div className="flex gap-1 mb-2">
                            {[10, 20, 30, 40].map((v, i) => (
                                <div key={i} style={{ width: 36, height: 36, background: "#333", border: "1px solid #929292", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{v}</div>
                            ))}
                        </div>
                        <p className="text-[11px] text-[#aaacae] leading-[1.6]">All elements sit side-by-side. Index access is instant — O(1). But inserting in the middle requires shifting all elements right.</p>
                    </div>
                    <div className="bg-[#222] rounded-xl p-4 border border-[#2a2a2a]">
                        <div className="font-mono text-xs font-bold text-[#22d3a5] mb-2">Linked List — scattered memory</div>
                        <div className="flex items-center gap-1 mb-2">
                            {["A100", "B200", "C300"].map((addr, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <div style={{ padding: "4px 6px", background: "#333", border: "1px solid #929292", fontSize: 9, fontFamily: "monospace", borderRadius: 4 }}>{addr}</div>
                                    {i < 2 && <span style={{ fontSize: 10, color: "#929292" }}>→</span>}
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-[#aaacae] leading-[1.6]">Nodes live anywhere in memory, linked by pointers. Insert/delete at a known position is O(1). But finding element i costs O(n).</p>
                    </div>
                </div>

                {/* Code snippets */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { lang: "JavaScript", code: `// Node definition\nclass Node {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n  }\n}\n\nconst head = new Node(10);\nhead.next = new Node(20);\nhead.next.next = new Node(30);` },
                        { lang: "C++", code: `// Node definition\nstruct Node {\n  int val;\n  Node* next;\n  Node(int v) :\n    val(v), next(nullptr) {}\n};\n\nNode* head = new Node(10);\nhead->next = new Node(20);\nhead->next->next = new Node(30);` },
                    ].map((ex, i) => (
                        <div key={i} className="bg-[#222] rounded-xl px-4 py-3 border border-[#2a2a2a]">
                            <div className="text-[11px] font-bold mb-2 font-mono text-[#aaacae]">{ex.lang}</div>
                            <pre className="m-0 font-mono text-xs text-[#aaacae] whitespace-pre-wrap leading-[1.7]">{ex.code}</pre>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

/* ─── 2. TYPES ─── */
function Types() {
    const [active, setActive] = useState(0);
    const types = [
        {
            name: "Singly Linked",
            desc: "Each node points only to the next node. Traversal is one-directional (head → tail). Most common type.",
            when: "Stacks, queues, simple traversal problems.",
            visual: (
                <div className="flex items-center gap-0 flex-wrap mt-3 overflow-x-auto pb-1">
                    {[10, 20, 30, 40].map((v, i) => (
                        <Node key={i} val={v} isHead={i === 0} isTail={i === 3} showNull={i === 3} />
                    ))}
                </div>
            ),
            code: `class Node {\n  constructor(val) {\n    this.val = val;\n    this.next = null; // one pointer\n  }\n}`,
        },
        {
            name: "Doubly Linked",
            desc: "Each node has two pointers: next and prev. You can traverse in both directions. Uses more memory.",
            when: "Browser history (back/forward), LRU cache, undo/redo.",
            visual: (
                <div className="flex items-center gap-2 flex-wrap mt-3 overflow-x-auto pb-1">
                    {[10, 20, 30, 40].map((v, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <div style={{ display: "flex", border: "2px solid #929292", borderRadius: 10, overflow: "hidden", background: "#333" }}>
                                <div style={{ width: 30, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#929292", fontFamily: "monospace", borderRight: "1px solid #929292" }}>←</div>
                                <div style={{ width: 40, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: "#e2e8f0", borderRight: "1px solid #929292" }}>{v}</div>
                                <div style={{ width: 30, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#929292", fontFamily: "monospace" }}>→</div>
                            </div>
                            {i < 3 && <span style={{ color: "#929292", fontSize: 12 }}>⇄</span>}
                        </div>
                    ))}
                </div>
            ),
            code: `class Node {\n  constructor(val) {\n    this.val = val;\n    this.next = null; // forward pointer\n    this.prev = null; // backward pointer\n  }\n}`,
        },
        {
            name: "Circular",
            desc: "The tail node points back to the head instead of null. There is no definitive end — traversal loops forever.",
            when: "Round-robin scheduling, music playlists, game loops.",
            visual: (
                <div className="mt-3">
                    <div className="flex items-center gap-0 overflow-x-auto pb-1">
                        {[10, 20, 30, 40].map((v, i) => (
                            <Node key={i} val={v} isHead={i === 0} showNull={false} />
                        ))}
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 20, height: 2, background: "#929292" }} />
                            <div style={{ fontSize: 10, color: "#f59e0b", fontFamily: "monospace", border: "1px solid #f59e0b44", background: "#f59e0b11", padding: "2px 6px", borderRadius: 6 }}>→ HEAD</div>
                        </div>
                    </div>
                    <div className="text-[11px] text-[#f59e0b] font-mono mt-2">// tail.next points back to head — no null!</div>
                </div>
            ),
            code: `// After building the list:\ntail.next = head; // circular!\n\n// Traversal needs a stopping condition:\nlet curr = head;\ndo {\n  console.log(curr.val);\n  curr = curr.next;\n} while (curr !== head);`,
        },
    ];
    const t = types[active];

    return (
        <Section delay={0.05}>
            <Card>
                <STitle icon="🧠" text="Types of Linked Lists" />
                <div className="flex gap-2 flex-wrap mb-5">
                    {types.map((ty, i) => (
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
                            {ty.name}
                        </button>
                    ))}
                </div>
                <div className="bg-[#22222288] border border-[#2a2a2a] rounded-2xl p-4">
                    <p className="text-sm text-white mb-1.5">{t.desc}</p>
                    <p className="text-xs text-[#22d3a5] mb-3"><strong>Use when:</strong> {t.when}</p>
                    {t.visual}
                    <p className="text-[11px] text-[#929292] font-mono mt-4 mb-2">// Node definition</p>
                    <pre className="bg-[#1a1a1a] border-l-[3px] border-[#22d3a5] rounded-[0_10px_10px_0] px-4 py-3.5 font-mono text-xs text-[#aaacae] leading-[1.75] whitespace-pre-wrap m-0">{t.code}</pre>
                </div>
            </Card>
        </Section>
    );
}

/* ─── 3. LIVE OPERATIONS ─── */
function LiveOps() {
    const [list, setList] = useState([10, 20, 30, 40, 50]);
    const [input, setInput] = useState("");
    const [posInput, setPosInput] = useState("");
    const [log, setLog] = useState([]);
    const [flashIdx, setFlashIdx] = useState(null);
    const [deleteIdx, setDeleteIdx] = useState(null);

    const addLog = (msg, color = "#22d3a5") =>
        setLog((p) => [{ msg, color }, ...p].slice(0, 6));

    const flash = (idx, cb) => {
        setFlashIdx(idx);
        setTimeout(() => { setFlashIdx(null); cb && cb(); }, 500);
    };

    const val = () => parseInt(input) || Math.floor(Math.random() * 90 + 10);

    const ops = [
        {
            label: "insertHead(x)", color: "#22d3a5",
            action() {
                const v = val();
                setList((p) => [v, ...p]);
                addLog(`insertHead(${v}) → O(1), set new head`, "#22d3a5");
                setInput("");
            },
        },
        {
            label: "insertTail(x)", color: "#22d3a5",
            action() {
                const v = val();
                flash(list.length, () => setList((p) => [...p, v]));
                addLog(`insertTail(${v}) → O(n), traverse to end`, "#22d3a5");
                setInput("");
            },
        },
        {
            label: "deleteHead()", color: "#f43f5e",
            action() {
                if (!list.length) return;
                const r = list[0];
                flash(0, () => setList((p) => p.slice(1)));
                addLog(`deleteHead() → removed ${r}, O(1)`, "#f43f5e");
            },
        },
        {
            label: "deleteTail()", color: "#f43f5e",
            action() {
                if (!list.length) return;
                const r = list[list.length - 1];
                flash(list.length - 1, () => setList((p) => p.slice(0, -1)));
                addLog(`deleteTail() → removed ${r}, O(n)`, "#f43f5e");
            },
        },
        {
            label: "insertAt(pos, x)", color: "#f59e0b",
            action() {
                const v = val();
                const pos = parseInt(posInput) ?? 0;
                if (isNaN(pos) || pos < 0 || pos > list.length) {
                    addLog(`Invalid position: ${pos}`, "#f43f5e"); return;
                }
                setList((p) => [...p.slice(0, pos), v, ...p.slice(pos)]);
                addLog(`insertAt(${pos}, ${v}) → O(n), traverse to pos`, "#f59e0b");
                setInput("");
            },
        },
        {
            label: "reverse()", color: "#a78bfa",
            action() {
                setList((p) => [...p].reverse());
                addLog("reverse() → O(n), flip all next pointers", "#a78bfa");
            },
        },
    ];

    return (
        <Section delay={0.06}>
            <Card>
                <STitle icon="⚡" text="Live Operations" />
                <p className="text-[#aaacae] text-sm mb-4">
                    Click operations to mutate the linked list. Notice which are O(1) and which require O(n) traversal.
                </p>

                {/* List display */}
                <div className="flex items-start gap-0 flex-wrap min-h-[80px] mb-4 overflow-x-auto pb-2">
                    {list.map((v, i) => (
                        <div
                            key={`${v}-${i}`}
                            style={{
                                opacity: deleteIdx === i ? 0 : 1,
                                transition: "opacity 0.4s ease",
                            }}
                        >
                            <Node
                                val={v}
                                isHead={i === 0}
                                isTail={i === list.length - 1}
                                isActive={flashIdx === i}
                                showNull={i === list.length - 1}
                            />
                        </div>
                    ))}
                    {list.length === 0 && (
                        <span className="text-[#929292] font-mono text-sm">null ← empty list</span>
                    )}
                </div>

                {/* Inputs */}
                <div className="flex gap-2 mb-3 flex-wrap">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Value (blank = random)"
                        className="flex-1 min-w-[160px] bg-[#333] border border-[#929292] rounded-[10px] px-3.5 py-2.5 text-white font-mono text-[13px] outline-none"
                    />
                    <input
                        value={posInput}
                        onChange={(e) => setPosInput(e.target.value)}
                        placeholder="Position (for insertAt)"
                        className="w-[180px] bg-[#333] border border-[#929292] rounded-[10px] px-3.5 py-2.5 text-white font-mono text-[13px] outline-none"
                    />
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {ops.map((op) => (
                        <button
                            key={op.label}
                            onClick={op.action}
                            className="rounded-xl py-2.5 px-1.5 cursor-pointer font-mono text-xs font-bold transition-all duration-[180ms] hover:-translate-y-0.5"
                            style={{
                                background: op.color + "15",
                                border: `1px solid ${op.color}44`,
                                color: op.color,
                            }}
                        >
                            {op.label}
                        </button>
                    ))}
                </div>

                {/* Log */}
                {log.length > 0 && (
                    <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-4 py-3 font-mono text-xs">
                        {log.map((l, i) => (
                            <div
                                key={i}
                                className="mb-[3px]"
                                style={{ color: i === 0 ? l.color : "#aaacae", opacity: 1 - i * 0.15 }}
                            >
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
        { op: "Access by index", big: "O(n)", bar: 52, note: "Must traverse from head — no random access" },
        { op: "Search (unsorted)", big: "O(n)", bar: 52, note: "Visit each node until found" },
        { op: "Insert at head", big: "O(1)", bar: 5, note: "Just update head pointer — instant" },
        { op: "Insert at tail (no tail ptr)", big: "O(n)", bar: 52, note: "Must traverse to the end first" },
        { op: "Insert at tail (with tail ptr)", big: "O(1)", bar: 5, note: "Maintain a tail pointer to skip traversal" },
        { op: "Insert at position i", big: "O(n)", bar: 52, note: "Traverse to position i, then rewire pointers" },
        { op: "Delete at head", big: "O(1)", bar: 5, note: "Move head to head.next — instant" },
        { op: "Delete at position i", big: "O(n)", bar: 52, note: "Traverse to i-1, update next pointer" },
        { op: "Space", big: "O(n)", bar: 52, note: "Each node stores data + at least one pointer" },
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
                                <div
                                    style={{
                                        height: "100%",
                                        borderRadius: 99,
                                        background: "#306ed2",
                                        width: visible ? `${r.bar}%` : "0%",
                                        transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`,
                                    }}
                                />
                            </div>
                            <div className="text-[11px] text-[#929292]">{r.note}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 bg-[#1e2d3a] border border-[#306ed233] rounded-xl px-4 py-3 text-sm text-white">
                    <strong className="text-[#22d3a5]">Key insight:</strong> Linked lists trade <strong>O(1) random access</strong> (array strength) for{" "}
                    <strong>O(1) head insert/delete</strong>. Use them when insertion/deletion frequency vastly outweighs lookups.
                </div>
            </Card>
        </Section>
    );
}

/* ─── 5. ALGORITHM PATTERNS ─── */
function ReverseViz() {
    const init = [1, 2, 3, 4, 5];
    const steps = [
        { prev: null, curr: 0, desc: "prev=null, curr→1. Save next=2, point curr.next→prev(null), advance.", state: [null, 1, 2, 3, 4, 5] },
        { prev: 0, curr: 1, desc: "prev→1, curr→2. Save next=3, point curr.next→1, advance.", state: [1, 2, 3, 4, 5] },
        { prev: 1, curr: 2, desc: "prev→2, curr→3. Save next=4, point curr.next→2, advance.", state: [2, 1, null, 3, 4, 5] },
        { prev: 2, curr: 3, desc: "prev→3, curr→4. Save next=5, point curr.next→3, advance.", state: [3, 2, 1, null, 4, 5] },
        { prev: 3, curr: 4, desc: "prev→4, curr=null. Return prev as new head.", state: [5, 4, 3, 2, 1] },
    ];
    const [step, setStep] = useState(0);
    const cur = steps[step];

    return (
        <div className="mt-4">
            <p className="text-xs text-[#929292] font-mono mb-3">// Three-pointer technique: prev, curr, next</p>
            <div className="flex items-center gap-2 flex-wrap mb-3">
                {init.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono" style={{
                            color: i === cur.curr ? "#facc15" : i === cur.prev ? "#22d3a5" : "transparent"
                        }}>
                            {i === cur.curr ? "curr" : i === cur.prev ? "prev" : "·"}
                        </span>
                        <div style={{
                            width: 44, height: 44, borderRadius: 8,
                            background: i === cur.curr ? "#facc1510" : i === cur.prev ? "#22d3a510" : "#333",
                            border: `2px solid ${i === cur.curr ? "#facc15" : i === cur.prev ? "#22d3a5" : "#929292"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                            color: i === cur.curr ? "#facc15" : i === cur.prev ? "#22d3a5" : "#e2e8f0",
                            transition: "all 0.3s ease",
                        }}>{v}</div>
                    </div>
                ))}
            </div>
            <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#aaacae] mb-3">
                {cur.desc}
            </div>
            <div className="flex gap-2 items-center">
                <button onClick={() => setStep(s => Math.max(0, s - 1))} className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-[13px]">← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="bg-[#6366f115] border border-[#6366f144] rounded-lg px-4 py-1.5 text-[#6366f1] cursor-pointer text-[13px] font-bold">Next →</button>
                <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}

function FloydViz() {
    const nodes = [1, 2, 3, 4, 5, 3]; // 5 links back to index 2 (val=3) — cycle
    const steps = [
        { slow: 0, fast: 0, desc: "Both start at head (index 0). slow moves ×1, fast moves ×2." },
        { slow: 1, fast: 2, desc: "slow→2, fast→4. No match yet." },
        { slow: 2, fast: 4, desc: "slow→3, fast→3 (cycle!). slow === fast → cycle detected!" },
    ];
    const [step, setStep] = useState(0);
    const cur = steps[step];

    return (
        <div className="mt-4">
            <p className="text-xs text-[#929292] font-mono mb-1">// 1→2→3→4→5→3 (5 points back to node with val 3)</p>
            <p className="text-xs text-[#929292] font-mono mb-3">// slow moves 1 step, fast moves 2 steps per iteration</p>
            <div className="flex items-center gap-0 flex-wrap mb-3 overflow-x-auto pb-1">
                {[1, 2, 3, 4, 5].map((v, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="flex gap-1 text-[10px] font-mono h-4 mb-1">
                            {cur.slow === i && <span className="text-[#22d3a5]">S</span>}
                            {cur.fast === i && <span className="text-[#f43f5e]">F</span>}
                            {cur.slow !== i && cur.fast !== i && <span className="text-transparent">·</span>}
                        </div>
                        <div className="flex items-center gap-0">
                            <div style={{
                                width: 44, height: 44, borderRadius: "8px 0 0 8px",
                                background: cur.slow === i && cur.fast === i ? "#facc1510" : cur.slow === i ? "#22d3a510" : cur.fast === i ? "#f43f5e10" : "#333",
                                border: `2px solid ${cur.slow === i && cur.fast === i ? "#facc15" : cur.slow === i ? "#22d3a5" : cur.fast === i ? "#f43f5e" : "#929292"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                                color: cur.slow === i && cur.fast === i ? "#facc15" : cur.slow === i ? "#22d3a5" : cur.fast === i ? "#f43f5e" : "#e2e8f0",
                                transition: "all 0.3s ease",
                            }}>{v}</div>
                            {i < 4 && <div style={{ width: 16, height: 2, background: "#929292" }} />}
                            {i === 4 && <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 8, height: 2, background: "#929292" }} />
                                <span style={{ fontSize: 10, color: "#f59e0b", fontFamily: "monospace", border: "1px solid #f59e0b44", background: "#f59e0b11", padding: "1px 5px", borderRadius: 4 }}>→[2]</span>
                            </div>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#aaacae] mb-3">
                {cur.desc}
            </div>
            <div className="flex gap-2 items-center">
                <button onClick={() => setStep(s => Math.max(0, s - 1))} className="bg-[#333] border border-[#929292] rounded-lg px-4 py-1.5 text-[#aaacae] cursor-pointer text-[13px]">← Prev</button>
                <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="bg-[#6366f115] border border-[#6366f144] rounded-lg px-4 py-1.5 text-[#6366f1] cursor-pointer text-[13px] font-bold">Next →</button>
                <span className="text-xs text-[#929292] font-mono">Step {step + 1}/{steps.length}</span>
            </div>
        </div>
    );
}

function Patterns() {
    const [active, setActive] = useState(0);
    const pats = [
        {
            name: "Reverse List",
            desc: "Reverse a singly linked list in-place using three pointers: prev, curr, next. No extra space needed.",
            when: "Palindrome check, reverse k-group, reorder list.",
            viz: <ReverseViz />,
            code: `function reverse(head) {\n  let prev = null;\n  let curr = head;\n\n  while (curr) {\n    let next = curr.next; // save next\n    curr.next = prev;    // reverse pointer\n    prev = curr;         // advance prev\n    curr = next;         // advance curr\n  }\n\n  return prev; // new head\n}`,
        },
        {
            name: "Floyd's Cycle",
            desc: "Use two pointers (slow × 1, fast × 2). If a cycle exists, fast will lap slow and they'll meet inside the cycle.",
            when: "Detect cycle, find cycle start, find duplicate number.",
            viz: <FloydViz />,
            code: `function hasCycle(head) {\n  let slow = head;\n  let fast = head;\n\n  while (fast && fast.next) {\n    slow = slow.next;       // move 1 step\n    fast = fast.next.next;  // move 2 steps\n\n    if (slow === fast) return true; // met!\n  }\n\n  return false; // fast hit null → no cycle\n}`,
        },
        {
            name: "Two Pointers",
            desc: "Use a slow and fast pointer with a gap. Fast starts k steps ahead. When fast reaches tail, slow is at the target.",
            when: "Find middle node, find Nth from end, merge sorted lists.",
            viz: (
                <div className="mt-4">
                    <p className="text-xs text-[#929292] font-mono mb-2">// Find middle node: fast moves ×2, slow moves ×1</p>
                    <div className="flex items-center gap-0 flex-wrap mb-3">
                        {[1, 2, 3, 4, 5].map((v, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="text-[10px] font-mono h-4 mb-1" style={{ color: i === 2 ? "#22d3a5" : "transparent" }}>{i === 2 ? "mid" : "·"}</div>
                                <div className="flex items-center">
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 8,
                                        background: i === 2 ? "#22d3a510" : "#333",
                                        border: `2px solid ${i === 2 ? "#22d3a5" : "#929292"}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                                        color: i === 2 ? "#22d3a5" : "#e2e8f0",
                                    }}>{v}</div>
                                    {i < 4 && <div style={{ width: 16, height: 2, background: "#929292" }} />}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#222] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#aaacae]">
                        When fast reaches null (n=5 nodes), slow is at index 2 = middle ✔
                    </div>
                </div>
            ),
            code: `function findMiddle(head) {\n  let slow = head;\n  let fast = head;\n\n  while (fast && fast.next) {\n    slow = slow.next;      // 1 step\n    fast = fast.next.next; // 2 steps\n  }\n\n  return slow; // middle node\n}\n\n// Find Nth from end:\nfunction nthFromEnd(head, n) {\n  let fast = head;\n  for (let i = 0; i < n; i++) fast = fast.next;\n  let slow = head;\n  while (fast) { slow = slow.next; fast = fast.next; }\n  return slow;\n}`,
        },
        {
            name: "Merge Sorted",
            desc: "Merge two sorted linked lists by comparing heads and always picking the smaller one. O(n+m) time, O(1) space.",
            when: "Merge K sorted lists, sort a linked list (merge sort).",
            viz: (
                <div className="mt-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <div className="text-xs font-mono text-[#22d3a5] mb-2">List A</div>
                            <div className="flex items-center gap-0">
                                {[1, 3, 5].map((v, i) => (
                                    <div key={i} className="flex items-center">
                                        <div style={{ width: 40, height: 40, borderRadius: 8, background: "#22d3a510", border: "2px solid #22d3a5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#22d3a5" }}>{v}</div>
                                        {i < 2 && <div style={{ width: 12, height: 2, background: "#929292" }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-mono text-[#f43f5e] mb-2">List B</div>
                            <div className="flex items-center gap-0">
                                {[2, 4, 6].map((v, i) => (
                                    <div key={i} className="flex items-center">
                                        <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f43f5e10", border: "2px solid #f43f5e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#f43f5e" }}>{v}</div>
                                        {i < 2 && <div style={{ width: 12, height: 2, background: "#929292" }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-[#929292] mb-2">Merged result:</div>
                    <div className="flex items-center gap-0 flex-wrap">
                        {[1, 2, 3, 4, 5, 6].map((v, i) => (
                            <div key={i} className="flex items-center">
                                <div style={{ width: 40, height: 40, borderRadius: 8, background: "#333", border: `2px solid ${i % 2 === 0 ? "#22d3a5" : "#f43f5e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: i % 2 === 0 ? "#22d3a5" : "#f43f5e" }}>{v}</div>
                                {i < 5 && <div style={{ width: 12, height: 2, background: "#929292" }} />}
                            </div>
                        ))}
                    </div>
                </div>
            ),
            code: `function mergeSorted(l1, l2) {\n  let dummy = new Node(0);\n  let curr = dummy;\n\n  while (l1 && l2) {\n    if (l1.val <= l2.val) {\n      curr.next = l1;\n      l1 = l1.next;\n    } else {\n      curr.next = l2;\n      l2 = l2.next;\n    }\n    curr = curr.next;\n  }\n\n  curr.next = l1 || l2; // attach remainder\n  return dummy.next;    // skip dummy head\n}`,
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
            label: "Node & List",
            code: `#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n    Node(int v) : val(v), next(nullptr) {}\n};\n\nclass LinkedList {\npublic:\n    Node* head = nullptr;\n\n    void insertHead(int v) {\n        Node* n = new Node(v);\n        n->next = head;\n        head = n;\n    }\n\n    void insertTail(int v) {\n        Node* n = new Node(v);\n        if (!head) { head = n; return; }\n        Node* curr = head;\n        while (curr->next) curr = curr->next;\n        curr->next = n;\n    }\n\n    void print() {\n        Node* curr = head;\n        while (curr) {\n            cout << curr->val;\n            if (curr->next) cout << " -> ";\n            curr = curr->next;\n        }\n        cout << " -> null" << endl;\n    }\n};`,
        },
        {
            label: "Reverse",
            code: `Node* reverse(Node* head) {\n    Node* prev = nullptr;\n    Node* curr = head;\n\n    while (curr) {\n        Node* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n\n    return prev; // new head\n}\n\n// Usage:\n// Before: 1 -> 2 -> 3 -> null\n// After:  3 -> 2 -> 1 -> null`,
        },
        {
            label: "Detect Cycle",
            code: `bool hasCycle(Node* head) {\n    Node* slow = head;\n    Node* fast = head;\n\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n\n        if (slow == fast) return true;\n    }\n\n    return false;\n}\n\n// Find cycle start:\nNode* cycleStart(Node* head) {\n    Node* slow = head;\n    Node* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) break;\n    }\n    slow = head;\n    while (slow != fast) {\n        slow = slow->next;\n        fast = fast->next;\n    }\n    return slow;\n}`,
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
                            bug: "NullPointerException — accessing .next on null",
                            fix: "Always check: while (curr !== null) and while (fast !== null && fast.next !== null) before accessing pointers.",
                            severity: "#f43f5e",
                        },
                        {
                            bug: "Losing the list — not saving next before rewiring",
                            fix: "In reversal or any pointer rewiring, always save let next = curr.next BEFORE setting curr.next = something_else. Once overwritten, the rest of the list is lost.",
                            severity: "#f43f5e",
                        },
                        {
                            bug: "Off-by-one — returning wrong node for Nth from end",
                            fix: "Trace through a 3-element list by hand. Check whether your loop condition uses < n or <= n and whether you return slow or slow.next.",
                            severity: "#f59e0b",
                        },
                        {
                            bug: "Memory leak in C++ — forgetting delete on removed nodes",
                            fix: "When deleting a node: save Node* toDelete = curr; advance curr; then delete toDelete;. Never delete a node and then access its .next.",
                            severity: "#f59e0b",
                        },
                        {
                            bug: "Infinite loop on circular list traversal",
                            fix: "For circular lists, use do { ... } while (curr !== head) instead of while (curr !== null) — null is never reached.",
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
        { icon: "✅", title: "Always clarify the type", body: "Singly or doubly linked? Does it have a tail pointer? Is it circular? These determine which operations are O(1) vs O(n)." },
        { icon: "🎯", title: "Use a dummy head node", body: "For insertion/deletion problems, prepend a dummy node: let dummy = new Node(0); dummy.next = head. This avoids special-casing the head and simplifies code significantly." },
        { icon: "⚡", title: "Draw it out first", body: "Pointer problems are notoriously hard to reason about mentally. Draw boxes and arrows, trace each step. Interviewers appreciate seeing your thought process." },
        { icon: "🧠", title: "Fast/slow pointer is very common", body: "Floyd's algorithm (slow/fast pointers) solves: detect cycle, find cycle start, find middle, find Nth from end. Recognize the pattern instantly." },
        { icon: "❌", title: "Don't use LL when…", body: "Random access is needed (use array). Memory is tight (each node has pointer overhead). Cache performance matters — arrays are far more cache-friendly." },
        { icon: "📌", title: "Test these edge cases", body: "Empty list (head=null), single node, two nodes, cycle at tail vs middle, merging when one list is empty." },
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
        ["head", "Pointer to the first node"],
        ["tail", "Pointer to the last node (optional)"],
        ["node.next", "Pointer to next node (null if last)"],
        ["node.prev", "Pointer to previous node (doubly LL)"],
        ["insertHead(x)", "O(1) — update head pointer"],
        ["insertTail(x)", "O(1) with tail ptr / O(n) without"],
        ["deleteHead()", "O(1) — move head to head.next"],
        ["deleteTail()", "O(n) singly / O(1) doubly with tail"],
        ["search(x)", "O(n) — must traverse from head"],
        ["access(i)", "O(n) — no random access"],
        ["reverse()", "O(n) — three-pointer technique"],
        ["hasCycle()", "O(n) — Floyd's slow/fast pointers"],
        ["findMiddle()", "O(n) — slow/fast, stop when fast=null"],
        ["nthFromEnd(n)", "O(n) — gap of n between fast and slow"],
        ["merge(l1, l2)", "O(n+m) — dummy head + compare"],
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
export default function LinkedListPage() {
    return (
        <div className="ll-root min-h-screen text-white px-5 py-8" style={{ maxWidth: 1000, margin: "0 auto" }}>
            <GlobalStyles />

            <div className="text-center mb-10 fade-up">
                <h1 className="text-4xl font-extrabold tracking-tight m-0">Linked Lists</h1>
                <p className="text-[#aaacae] text-base mt-2.5 leading-[1.7]">
                    Dynamic memory, pointer magic, and the foundation of stacks, queues, and graphs.
                </p>
            </div>

            <Intro />
            <Types />
            <LiveOps />
            <Complexity />
            <Patterns />
            <CppSection />
            <Mistakes />
            <InterviewTips />
            <QuickRef />

            <div className="text-center py-6 text-[#929292] text-[13px]">
                Master linked lists — pointers are the gateway to trees, graphs, and advanced data structures 🚀
            </div>
        </div>
    );
}