import { useState, useEffect, useRef } from "react";

// ── PALETTE — matches Array component exactly ────────────
// bg:        #0f0f13  card: #1e1e1e  surface: #333333
// border:    #929292ff  muted text: #aaacaeff
// teal:      #22d3a5   (match / success)
// indigo:    #6366f1   (window / selection)
// rose:      #f43f5e   (mismatch / warning)
// amber:     #f59e0b   (active / interactive)
// sky:       #38bdf8   (methods / C++ tab)

const C = {
    bg: "#0f0f13",
    card: "#1e1e1e",
    surface: "#333333",
    border: "#929292ff",
    text: "rgba(255,255,255,0.9)",
    muted: "#aaacaeff",
    dim: "#929292ff",

    teal: "#22d3a5",
    tealBg: "#22d3a518",
    tealBd: "#22d3a544",

    indigo: "#6366f1",
    indigoBg: "#6366f118",
    indigoBd: "#6366f133",

    rose: "#f43f5e",
    roseBg: "#f43f5e18",
    roseBd: "#f43f5e44",

    amber: "#f59e0b",
    amberBg: "#f59e0b18",
    amberBd: "#f59e0b44",

    sky: "#38bdf8",
    skyBg: "#38bdf818",
    skyBd: "#38bdf844",
};

// ── SHARED COMPONENTS ────────────────────────────────────
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
    .str-root { font-family: 'Syne', sans-serif; background: ${C.bg}; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp 0.55s ease both; }
    input:focus { outline: none; }
    input::placeholder { color: #929292ff; }
    button { font-family: 'JetBrains Mono', monospace; }
  `}</style>
);

const Badge = ({ children, color = C.teal }) => (
    <span style={{
        background: color + "22", border: `1px solid ${color}55`,
        color, borderRadius: 8, padding: "2px 10px",
        fontSize: 12, fontWeight: 700, display: "inline-block",
        fontFamily: "JetBrains Mono, monospace",
    }}>
        {children}
    </span>
);

function Section({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
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

const Card = ({ children, accentColor }) => (
    <div style={{
        background: C.card, borderRadius: 20, padding: "1.75rem",
        marginBottom: "1.5rem", position: "relative", overflow: "hidden",
        border: `1px solid ${C.border}`,
        borderLeft: accentColor ? `3px solid ${accentColor}` : `1px solid ${C.border}`,
    }}>
        {children}
    </div>
);

const STitle = ({ icon, text }) => (
    <h2 style={{
        fontSize: 20, fontWeight: 800, marginBottom: 18, marginTop: 0,
        display: "flex", alignItems: "center", gap: 10,
        color: C.text, fontFamily: "Syne, sans-serif",
    }}>
        <span>{icon}</span> {text}
    </h2>
);

const Pre = ({ children, accentColor = C.indigo }) => (
    <pre style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 10, padding: "1rem 1.25rem",
        fontSize: 13, lineHeight: 1.85, overflowX: "auto",
        color: C.muted, fontFamily: "JetBrains Mono, monospace",
        margin: "0.75rem 0", whiteSpace: "pre",
    }}>
        {children}
    </pre>
);

const Note = ({ children }) => (
    <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: "0.75rem" }}>
        {children}
    </p>
);

const Tag = ({ children, color = C.indigo }) => (
    <code style={{
        background: color + "22", border: `1px solid ${color}44`,
        borderRadius: 5, padding: "1px 7px",
        fontSize: 12, fontFamily: "JetBrains Mono, monospace", color,
    }}>
        {children}
    </code>
);

const StepBtn = ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{
        background: disabled ? "transparent" : C.indigoBg,
        border: `1px solid ${disabled ? C.border : C.indigo}`,
        borderRadius: 8, padding: "6px 16px",
        color: disabled ? C.dim : C.indigo,
        fontFamily: "JetBrains Mono, monospace", fontSize: 13,
        cursor: disabled ? "default" : "pointer", transition: "all 0.15s",
        fontWeight: 700,
    }}>
        {children}
    </button>
);

// ── 01 WHAT IS A STRING ──────────────────────────────────
function Intro() {
    const [clicked, setClicked] = useState(null);
    const [hov, setHov] = useState(null);
    const str = "hello";

    return (
        <Section>
            <Card accentColor={C.indigo}>
                <STitle icon="🔤" text="What is a String?" />
                <Note>
                    A <strong style={{ color: C.text }}>string</strong> is a sequence of characters stored in{" "}
                    <span style={{ color: C.sky, fontWeight: 600 }}>contiguous memory</span> — like an array of chars,
                    each occupying one slot. You access any character in <Tag color={C.teal}>O(1)</Tag> using its index.
                </Note>
                <Note>
                    In JavaScript, strings are <strong style={{ color: C.amber }}>immutable</strong> — you cannot
                    change a character in place. Every operation returns a brand-new string.
                </Note>

                <p style={{ fontSize: 12, color: C.dim, marginBottom: 10, fontFamily: "JetBrains Mono, monospace" }}>
          // Click any box to inspect it
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                    {str.split("").map((ch, i) => (
                        <div
                            key={i}
                            onClick={() => setClicked(clicked === i ? null : i)}
                            onMouseEnter={() => setHov(i)}
                            onMouseLeave={() => setHov(null)}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}
                        >
                            <span style={{
                                fontSize: 10, fontFamily: "JetBrains Mono, monospace",
                                color: hov === i ? C.indigo : C.dim, transition: "color 0.2s",
                            }}>
                                {(0x1000 + i * 4).toString(16).toUpperCase()}
                            </span>
                            <div style={{
                                width: 60, height: 60,
                                background: clicked === i ? C.indigoBg : C.surface,
                                border: `2px solid ${clicked === i ? C.indigo : C.border}`,
                                borderRadius: 12,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 700,
                                color: clicked === i ? C.indigo : C.muted,
                                transform: clicked === i ? "translateY(-4px)" : hov === i ? "translateY(-4px)" : "translateY(0)",
                                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                            }}>
                                {ch}
                            </div>
                            <span style={{
                                fontSize: 11, fontFamily: "JetBrains Mono, monospace",
                                color: clicked === i ? C.indigo : C.dim,
                            }}>
                                [{i}]
                            </span>
                        </div>
                    ))}
                </div>

                {clicked !== null && (
                    <div style={{
                        background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: 12, padding: "14px 18px",
                        fontFamily: "JetBrains Mono, monospace", fontSize: 13,
                        marginBottom: 16, animation: "fadeUp 0.25s ease",
                    }}>
                        <div style={{ color: C.dim, fontSize: 11, marginBottom: 6 }}>// Inspector</div>
                        <div style={{ color: C.muted }}>
                            s[{clicked}] = <span style={{ color: C.indigo, fontWeight: 700 }}>"{str[clicked]}"</span>
                        </div>
                        <div style={{ color: C.muted }}>
                            charCode → <span style={{ color: C.amber, fontWeight: 700 }}>{str.charCodeAt(clicked)}</span>
                        </div>
                        <div style={{ color: C.muted }}>
                            address → <span style={{ color: C.sky, fontWeight: 700 }}>0x{(0x1000 + clicked * 4).toString(16).toUpperCase()}</span>
                        </div>
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <p style={{ fontSize: 11, color: C.dim, marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>// Memory layout</p>
                        <Pre accentColor={C.indigo}>{`Index:  [0]  [1]  [2]  [3]  [4]
Value:   h    e    l    l    o
ASCII:  104  101  108  108  111`}</Pre>
                    </div>
                    <div>
                        <p style={{ fontSize: 11, color: C.dim, marginBottom: 6, fontFamily: "JetBrains Mono, monospace" }}>// Key accesses</p>
                        <Pre accentColor={C.indigo}>{`s = "hello"
s.length      // 5
s[0]          // "h"  (first)
s[s.length-1] // "o"  (last)
s[5]          // undefined`}</Pre>
                    </div>
                </div>
            </Card>
        </Section>
    );
}

// ── 02 LIVE OPERATIONS ───────────────────────────────────
function LiveOps() {
    const [str, setStr] = useState("hello");
    const [input, setInput] = useState("");
    const [log, setLog] = useState([]);
    const [flashIdx, setFlashIdx] = useState(null);

    const addLog = (msg, color = C.teal) => setLog(p => [{ msg, color }, ...p].slice(0, 6));

    const ops = [
        {
            label: "append(x)", color: C.teal,
            action: () => {
                const c = input || "a";
                const r = str + c;
                setStr(r); setInput("");
                addLog(`append("${c}") → "${r}"`, C.teal);
                setFlashIdx(r.length - 1);
                setTimeout(() => setFlashIdx(null), 500);
            },
        },
        {
            label: "removeLast()", color: C.rose,
            action: () => {
                if (!str.length) return;
                const old = str[str.length - 1];
                setFlashIdx(str.length - 1);
                setTimeout(() => { setStr(s => s.slice(0, -1)); setFlashIdx(null); }, 400);
                addLog(`removeLast() → removed "${old}"`, C.rose);
            },
        },
        {
            label: "reverse()", color: C.amber,
            action: () => {
                const r = str.split("").reverse().join("");
                setStr(r);
                addLog(`reverse("${str}") → "${r}"`, C.amber);
            },
        },
        {
            label: "toUpperCase()", color: C.sky,
            action: () => {
                const r = str.toUpperCase();
                setStr(r);
                addLog(`toUpperCase() → "${r}"`, C.sky);
            },
        },
        {
            label: "toLowerCase()", color: C.indigo,
            action: () => {
                const r = str.toLowerCase();
                setStr(r);
                addLog(`toLowerCase() → "${r}"`, C.indigo);
            },
        },
        {
            label: "trim()", color: C.amber,
            action: () => {
                const r = ("  " + str + "  ").trim();
                setStr(r);
                addLog(`"  ${str}  ".trim() → "${r}"`, C.amber);
            },
        },
    ];

    return (
        <Section delay={0.05}>
            <Card accentColor={C.amber}>
                <STitle icon="⚡" text="Live Operations" />
                <Note>
                    Every operation returns a <strong style={{ color: C.amber }}>new string</strong> —
                    the original is never mutated. Immutability in action.
                </Note>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, minHeight: 72, alignItems: "flex-end" }}>
                    {(str || " ").split("").map((ch, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{
                                width: 48, height: 48,
                                background: flashIdx === i ? C.amberBg : C.surface,
                                border: `2px solid ${flashIdx === i ? C.amber : C.border}`,
                                borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 700,
                                color: flashIdx === i ? C.amber : C.muted,
                                transform: flashIdx === i ? "translateY(-8px) scale(1.15)" : "scale(1)",
                                boxShadow: flashIdx === i ? `0 0 20px ${C.amber}55` : "none",
                                transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                            }}>
                                {ch}
                            </div>
                            <span style={{ fontSize: 10, color: C.dim, fontFamily: "JetBrains Mono, monospace" }}>[{i}]</span>
                        </div>
                    ))}
                </div>

                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter char for append (blank = 'a')"
                    style={{
                        width: "100%", background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: 10, padding: "10px 14px", color: C.text,
                        fontFamily: "JetBrains Mono, monospace", fontSize: 13,
                        marginBottom: 14, boxSizing: "border-box",
                    }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                    {ops.map(op => (
                        <button
                            key={op.label}
                            onClick={op.action}
                            style={{
                                background: op.color + "15", border: `1px solid ${op.color}44`,
                                borderRadius: 12, padding: "10px 6px",
                                color: op.color, fontFamily: "JetBrains Mono, monospace",
                                fontSize: 12, fontWeight: 700, cursor: "pointer",
                                transition: "all 0.18s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = op.color + "28"}
                            onMouseLeave={e => e.currentTarget.style.background = op.color + "15"}
                        >
                            {op.label}
                        </button>
                    ))}
                </div>

                {log.length > 0 && (
                    <div style={{
                        background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: 12, padding: "12px 16px",
                        fontFamily: "JetBrains Mono, monospace", fontSize: 12,
                    }}>
                        {log.map((l, i) => (
                            <div key={i} style={{
                                color: i === 0 ? l.color : C.muted,
                                opacity: 1 - i * 0.15, marginBottom: 3,
                            }}>
                                {i === 0 ? "▶ " : "  "}{l.msg}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </Section>
    );
}

// ── 03 TWO POINTER ───────────────────────────────────────
function TwoPointer() {
    const [word, setWord] = useState("racecar");
    const [step, setStep] = useState(0);

    const chars = word.split("");
    const maxSteps = Math.floor(chars.length / 2);
    const l = step;
    const r = chars.length - 1 - step;
    const done = step >= maxSteps;
    const isPalin = word === word.split("").reverse().join("");
    const curMatch = !done && chars[l] === chars[r];

    return (
        <Section delay={0.05}>
            <Card accentColor={C.teal}>
                <STitle icon="👆" text="Two Pointer — Palindrome Check" />
                <Note>
                    Place one pointer at each end. Move them inward simultaneously.
                    If any pair mismatches — not a palindrome.
                    Time: <Tag color={C.teal}>O(n)</Tag> Space: <Tag color={C.teal}>O(1)</Tag>.
                </Note>

                <input
                    value={word}
                    onChange={e => { setWord(e.target.value.toLowerCase()); setStep(0); }}
                    placeholder="type a word..."
                    style={{
                        width: "100%", background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: 10, padding: "10px 14px", color: C.text,
                        fontFamily: "JetBrains Mono, monospace", fontSize: 14,
                        marginBottom: 14, boxSizing: "border-box",
                    }}
                />

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    {chars.map((ch, i) => {
                        const isL = !done && i === l;
                        const isR = !done && i === r && l !== r;
                        const matched = done && isPalin;

                        let bg = C.surface, border = C.border, color = C.muted;
                        if (isL || isR) {
                            bg = curMatch ? C.tealBg : C.roseBg;
                            border = curMatch ? C.teal : C.rose;
                            color = curMatch ? C.teal : C.rose;
                        } else if (matched) { bg = C.tealBg; border = C.teal; color = C.teal; }

                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <span style={{
                                    fontSize: 11, fontFamily: "JetBrains Mono, monospace",
                                    color: isL ? C.teal : isR ? C.rose : "transparent",
                                }}>
                                    {isL ? "L" : isR ? "R" : "."}
                                </span>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 10,
                                    border: `2px solid ${border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace", fontSize: 15, fontWeight: 700,
                                    background: bg, color, transition: "all 0.35s ease",
                                }}>
                                    {ch}
                                </div>
                                <span style={{ fontSize: 10, color: C.dim, fontFamily: "JetBrains Mono, monospace" }}>{i}</span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", gap: 8, margin: "12px 0", alignItems: "center", flexWrap: "wrap" }}>
                    <StepBtn onClick={() => setStep(s => Math.min(s + 1, maxSteps))} disabled={done}>Next →</StepBtn>
                    <StepBtn onClick={() => setStep(0)}>Reset</StepBtn>
                    <span style={{
                        fontSize: 12, fontFamily: "JetBrains Mono, monospace",
                        color: done ? (isPalin ? C.teal : C.rose) : C.muted,
                    }}>
                        {done
                            ? `"${word}" is ${isPalin ? "a palindrome ✓" : "NOT a palindrome ✗"}`
                            : `s[${l}]="${chars[l]}" vs s[${r}]="${chars[r]}" → ${curMatch ? "match ✓" : "mismatch ✗"}`}
                    </span>
                </div>

                <Pre accentColor={C.teal}>{`function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;  // mismatch
    l++;
    r--;
  }
  return true;
}

isPalindrome("racecar") // true
isPalindrome("hello")   // false`}</Pre>
            </Card>
        </Section>
    );
}

// ── 04 SLIDING WINDOW ────────────────────────────────────
function SlidingWindow() {
    const [str, setStr] = useState("abcabcbb");
    const [wStep, setWStep] = useState(0);

    const computeSteps = s => {
        const steps = [];
        let set = new Set(), l = 0, max = 0;
        for (let r = 0; r < s.length; r++) {
            while (set.has(s[r])) { set.delete(s[l]); l++; }
            set.add(s[r]);
            if (r - l + 1 > max) max = r - l + 1;
            steps.push({ l, r, window: s.slice(l, r + 1), max });
        }
        return steps;
    };

    const steps = computeSteps(str);
    const cur = steps[Math.min(wStep, steps.length - 1)] || { l: 0, r: 0, window: "", max: 0 };

    return (
        <Section delay={0.06}>
            <Card accentColor={C.indigo}>
                <STitle icon="🪟" text="Sliding Window — Longest Unique Substring" />
                <Note>
                    Maintain a window <Tag color={C.indigo}>[l, r]</Tag> with a Set tracking unique chars.
                    When a duplicate enters, shrink from the left until it is removed.
                    Time: <Tag color={C.teal}>O(n)</Tag> Space: <Tag color={C.amber}>O(k)</Tag> where k = charset size.
                </Note>

                <input
                    value={str}
                    onChange={e => { setStr(e.target.value); setWStep(0); }}
                    placeholder="type a string..."
                    style={{
                        width: "100%", background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: 10, padding: "10px 14px", color: C.text,
                        fontFamily: "JetBrains Mono, monospace", fontSize: 14,
                        marginBottom: 14, boxSizing: "border-box",
                    }}
                />

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {str.split("").map((ch, i) => {
                        const inWindow = i >= cur.l && i <= cur.r;
                        const isLeft = i === cur.l && inWindow;
                        const isRight = i === cur.r && inWindow;
                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div style={{
                                    width: 40, height: 40,
                                    background: inWindow ? C.indigoBg : C.surface,
                                    border: `2px solid ${inWindow ? C.indigo : C.border}`,
                                    borderRadius: isLeft ? "10px 4px 4px 10px" : isRight ? "4px 10px 10px 4px" : inWindow ? 4 : 10,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                                    color: inWindow ? C.indigo : C.dim, transition: "all 0.35s ease",
                                }}>
                                    {ch}
                                </div>
                                <span style={{ fontSize: 10, color: C.dim, fontFamily: "JetBrains Mono, monospace" }}>{i}</span>
                            </div>
                        );
                    })}
                </div>

                <div style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: "10px 14px",
                    fontFamily: "JetBrains Mono, monospace", fontSize: 12,
                    color: C.indigo, marginBottom: 12,
                }}>
                    Window [{cur.l}..{cur.r}] → <strong style={{ color: C.indigo }}>"{cur.window}"</strong>
                    {"  "}max = <strong style={{ color: cur.window.length === cur.max ? C.teal : C.amber }}>{cur.max}</strong>
                    {cur.window.length === cur.max && <span style={{ color: C.teal }}> ← MAX</span>}
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <StepBtn onClick={() => setWStep(s => Math.min(s + 1, steps.length - 1))} disabled={wStep >= steps.length - 1}>
                        Next →
                    </StepBtn>
                    <StepBtn onClick={() => setWStep(0)}>Reset</StepBtn>
                    <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: C.dim }}>
                        Step {wStep + 1}/{steps.length}
                    </span>
                </div>

                <Pre accentColor={C.indigo}>{`function longestUnique(s) {
  let set = new Set(), l = 0, max = 0;
  for (let r = 0; r < s.length; r++) {
    while (set.has(s[r])) {   // shrink from left
      set.delete(s[l]);
      l++;
    }
    set.add(s[r]);
    max = Math.max(max, r - l + 1);
  }
  return max;
}

longestUnique("abcabcbb") // 3  →  "abc"`}</Pre>
            </Card>
        </Section>
    );
}

// ── 05 FREQUENCY MAP ─────────────────────────────────────
function FrequencyMap() {
    const [word, setWord] = useState("anagram");

    const freq = {};
    for (const ch of word) freq[ch] = (freq[ch] || 0) + 1;
    const maxFreq = Math.max(1, ...Object.values(freq));
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);

    return (
        <Section delay={0.05}>
            <Card accentColor={C.amber}>
                <STitle icon="📊" text="Frequency Map" />
                <Note>
                    Count character occurrences in <Tag color={C.teal}>O(n)</Tag> with a hash map.
                    Powers anagram detection, first unique character, and character replacement problems.
                </Note>

                <input
                    value={word}
                    onChange={e => setWord(e.target.value.toLowerCase().replace(/[^a-z]/g, ""))}
                    placeholder="type lowercase letters..."
                    style={{
                        width: "100%", background: C.surface, border: `1px solid ${C.border}`,
                        borderRadius: 10, padding: "10px 14px", color: C.text,
                        fontFamily: "JetBrains Mono, monospace", fontSize: 14,
                        marginBottom: 14, boxSizing: "border-box",
                    }}
                />

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "flex-end" }}>
                    {entries.map(([ch, count]) => (
                        <div key={ch} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: C.amber }}>{count}</span>
                            <div style={{
                                width: 36,
                                height: Math.max(16, Math.round((count / maxFreq) * 80)),
                                background: C.amberBg, border: `1px solid ${C.amberBd}`,
                                borderRadius: 5, transition: "height 0.3s",
                            }} />
                            <span style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: C.text }}>{ch}</span>
                        </div>
                    ))}
                </div>

                <Pre accentColor={C.amber}>{`function charFrequency(s) {
  const map = {};
  for (const ch of s) {
    map[ch] = (map[ch] || 0) + 1;
  }
  return map;
}

// Anagram check using frequency map
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const map = charFrequency(s);
  for (const ch of t) {
    if (!map[ch]) return false;
    map[ch]--;
  }
  return true;
}

isAnagram("anagram", "nagaram") // true
isAnagram("rat",     "car")     // false`}</Pre>
            </Card>
        </Section>
    );
}

// ── 06 COMPLEXITY ────────────────────────────────────────
function Complexity() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    const rows = [
        { op: "Access s[i]", time: "O(1)", color: C.teal, bar: 5, note: "Direct index — instant" },
        { op: "Search / indexOf", time: "O(n·m)", color: C.rose, bar: 78, note: "n = string, m = pattern" },
        { op: "Concatenation (+)", time: "O(n)", color: C.amber, bar: 52, note: "New string allocated each time" },
        { op: "slice / substring", time: "O(k)", color: C.sky, bar: 28, note: "k = length of slice" },
        { op: "split / join", time: "O(n)", color: C.amber, bar: 52, note: "Creates array of substrings" },
        { op: "reverse", time: "O(n)", color: C.amber, bar: 52, note: "split + reverse + join" },
        { op: "Frequency map", time: "O(n)", color: C.amber, bar: 52, note: "k = unique chars (space)" },
        { op: "Two pointer check", time: "O(n)", color: C.teal, bar: 52, note: "O(1) space — no allocation" },
        { op: "Sliding window", time: "O(n)", color: C.teal, bar: 52, note: "k = charset size (space)" },
    ];

    return (
        <Section delay={0.06}>
            <Card accentColor={C.rose}>
                <STitle icon="⏱️" text="Time Complexity" />
                <Note>Bars animate as you scroll. Shorter = faster. Key trap: concatenation in a loop is <Tag color={C.rose}>O(n²)</Tag>.</Note>
                <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {rows.map((r, i) => (
                        <div key={i} style={{
                            background: C.surface, border: `1px solid ${C.border}`,
                            borderRadius: 12, padding: "12px 16px",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                                <span style={{ fontSize: 13, color: C.text }}>{r.op}</span>
                                <span style={{ color: r.color, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>{r.time}</span>
                            </div>
                            <div style={{ height: 6, background: C.bg, borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                                <div style={{
                                    height: "100%", borderRadius: 99, background: r.color,
                                    width: visible ? `${r.bar}%` : "0%",
                                    transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`,
                                    boxShadow: `0 0 10px ${r.color}55`,
                                }} />
                            </div>
                            <div style={{ fontSize: 11, color: C.dim }}>{r.note}</div>
                        </div>
                    ))}
                </div>

                <Pre accentColor={C.rose}>{`// BAD — O(n²): new string every iteration
let result = "";
for (let i = 0; i < n; i++) result += chars[i];

// GOOD — O(n): collect, join once at the end
const parts = [];
for (let i = 0; i < n; i++) parts.push(chars[i]);
const result = parts.join("");`}</Pre>
            </Card>
        </Section>
    );
}

// ── 07 BUILT-IN METHODS ──────────────────────────────────
function Methods() {
    const [active, setActive] = useState(0);

    const methods = [
        { name: "slice()", color: C.teal, desc: "Extract a portion (no mutation)", code: `"hello".slice(1, 4)       // "ell"\n"hello".slice(-2)         // "lo"` },
        { name: "indexOf()", color: C.indigo, desc: "First occurrence index, -1 if absent", code: `"hello".indexOf("ll")     // 2\n"hello".indexOf("x")      // -1` },
        { name: "includes()", color: C.sky, desc: "Boolean existence check", code: `"hello".includes("ell")   // true\n"hello".includes("xyz")   // false` },
        { name: "split()", color: C.amber, desc: "String → array by delimiter", code: `"a,b,c".split(",")        // ["a","b","c"]\n"hi".split("")           // ["h","i"]` },
        { name: "replace()", color: C.rose, desc: "Replace FIRST occurrence", code: `"aabbaa".replace("a","x") // "xabbaa"\n// Use replaceAll() for all` },
        { name: "replaceAll()", color: C.rose, desc: "Replace ALL occurrences", code: `"aabbaa".replaceAll("a","x")  // "xxbbxx"` },
        { name: "trim()", color: C.teal, desc: "Strip leading/trailing whitespace", code: `"  hi  ".trim()           // "hi"\n"  hi  ".trimStart()      // "hi  "` },
        { name: "padStart()", color: C.sky, desc: "Pad beginning to reach target length", code: `"5".padStart(3, "0")      // "005"\n"7".padStart(4, "*")      // "***7"` },
        { name: "repeat()", color: C.indigo, desc: "Repeat string n times", code: `"ab".repeat(3)            // "ababab"` },
        { name: "charCodeAt()", color: C.amber, desc: "Get ASCII/UTF-16 code at index", code: `"A".charCodeAt(0)         // 65\n"a".charCodeAt(0)         // 97` },
    ];

    const m = methods[active];

    return (
        <Section delay={0.05}>
            <Card accentColor={C.sky}>
                <STitle icon="🔍" text="String Methods" />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                    {methods.map((me, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            style={{
                                background: active === i ? me.color + "22" : C.surface,
                                border: `1px solid ${active === i ? me.color : C.border}`,
                                borderRadius: 999, padding: "5px 13px",
                                color: active === i ? me.color : C.muted,
                                fontFamily: "JetBrains Mono, monospace", fontSize: 12,
                                fontWeight: 700, cursor: "pointer", transition: "all 0.18s",
                            }}
                        >
                            {me.name}
                        </button>
                    ))}
                </div>

                <div style={{
                    background: C.surface, border: `1px solid ${m.color}44`,
                    borderRadius: 16, padding: 18,
                }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                        <Badge color={m.color}>{m.name}</Badge>
                        <span style={{ fontSize: 13, color: C.muted }}>{m.desc}</span>
                    </div>
                    <Pre accentColor={m.color}>{m.code}</Pre>
                </div>
            </Card>
        </Section>
    );
}

// ── 08 INTERVIEW TIPS ────────────────────────────────────
function InterviewTips() {
    const tips = [
        { icon: "✅", color: C.teal, title: "Clarify constraints first", body: "Is it lowercase only? ASCII or Unicode? Can it have spaces? This shapes your approach." },
        { icon: "🎯", color: C.indigo, title: "Identify the pattern", body: "Pair check → Two Pointer. Subarray/substring → Sliding Window. Char counts → Frequency Map." },
        { icon: "⚡", color: C.amber, title: "Brute force → optimize", body: "State the O(n²) naive first, then show how you reduce it. Interviewers love seeing iteration." },
        { icon: "🧠", color: C.sky, title: "Use array for building", body: "Never concat in a loop — O(n²). Collect chars in an array, join once at the end — O(n)." },
        { icon: "❌", color: C.rose, title: "Watch off-by-one bugs", body: "Is slice(1,4) inclusive? Does indexOf return -1 on miss? Test with a 3-char example." },
        { icon: "📌", color: C.amber, title: "Test edge cases", body: 'Empty "", single char "a", all same "aaaa", special chars, very long inputs.' },
    ];

    return (
        <Section delay={0.05}>
            <Card accentColor={C.indigo}>
                <STitle icon="🎓" text="Interview Tips" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {tips.map((t, i) => (
                        <div key={i} style={{
                            background: C.surface, borderRadius: 16, padding: 16,
                            border: `1px solid ${t.color}22`,
                            borderLeft: `3px solid ${t.color}`,
                        }}>
                            <div style={{
                                fontSize: 13, fontWeight: 700, marginBottom: 6,
                                color: t.color, fontFamily: "Syne, sans-serif",
                            }}>
                                {t.icon} {t.title}
                            </div>
                            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: 0 }}>{t.body}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

// ── 09 QUICK REFERENCE ───────────────────────────────────
function QuickRef() {
    const rows = [
        ["s.length", "Number of characters", C.teal],
        ["s[i]", "Access index i — O(1)", C.teal],
        ["s.slice(a, b)", "Copy a..b (exclusive end)", C.sky],
        ["s.indexOf(x)", "Find index (-1 if absent)", C.indigo],
        ["s.includes(x)", "Boolean existence check", C.indigo],
        ["s.split(sep)", "String → array", C.amber],
        ["arr.join(sep)", "Array → string", C.amber],
        ["s.replace(a, b)", "Replace first match", C.rose],
        ["s.replaceAll(a, b)", "Replace all matches", C.rose],
        ["s.trim()", "Strip whitespace", C.teal],
        ["s.padStart(n, ch)", "Left-pad to length n", C.sky],
        ["s.repeat(n)", "Repeat n times", C.indigo],
        ["s.toUpperCase()", "All uppercase", C.amber],
        ["s.toLowerCase()", "All lowercase", C.amber],
        ["s.charCodeAt(i)", "ASCII code at index i", C.sky],
        ["String.fromCharCode(n)", "Code number → char", C.sky],
    ];

    return (
        <Section delay={0.04}>
            <Card accentColor={C.sky}>
                <STitle icon="📋" text="Quick Reference" />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {rows.map(([method, desc, color], i) => (
                        <div key={i} style={{
                            display: "grid", gridTemplateColumns: "220px 1fr",
                            gap: 12, padding: "8px 12px", borderRadius: 8,
                            background: i % 2 === 0 ? C.surface : "transparent",
                            alignItems: "center",
                        }}>
                            <code style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, color: "white" }}>{method}</code>
                            <span style={{ fontSize: 12, color: C.muted }}>{desc}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </Section>
    );
}

// ── ROOT ─────────────────────────────────────────────────
export default function StringPage() {
    return (
        <div className="str-root" style={{
            minHeight: "100vh", color: C.text,
            padding: "2rem 1.25rem", maxWidth: 900, margin: "0 auto",
        }}>
            <GlobalStyles />

            <div style={{ textAlign: "center", marginBottom: 40 }} className="fade-up">
                <h1 style={{
                    fontSize: 36, fontWeight: 800, margin: 0,
                    letterSpacing: "-0.02em", color: C.text,
                    fontFamily: "Syne, sans-serif",
                }}>
                    Strings
                </h1>
                <p style={{ fontSize: 15, color: C.muted, marginTop: 10, lineHeight: 1.7 }}>
                    Immutable character sequences — master indexing, two pointers,
                    sliding window, and frequency maps.
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
                    <Badge color={C.teal}>Beginner Friendly</Badge>
                    <Badge color={C.indigo}>Interactive</Badge>
                    <Badge color={C.sky}>JS Focused</Badge>
                    <Badge color={C.rose}>Interview Ready</Badge>
                </div>
            </div>

            <Intro />
            <LiveOps />
            <TwoPointer />
            <SlidingWindow />
            <FrequencyMap />
            <Complexity />
            <Methods />
            <InterviewTips />
            <QuickRef />

            <div style={{ textAlign: "center", padding: "1.5rem 0", color: C.dim, fontSize: 13 }}>
                Keep practicing — strings are everywhere in DSA 🚀
            </div>
        </div>
    );
}