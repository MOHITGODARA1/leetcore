import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const difficultyConfig = {
    Easy: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", dot: "#22c55e" },
    Medium: { color: "#EAB308", bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", dot: "#EAB308" },
    Hard: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", dot: "#ef4444" },
};

const order = { Easy: 1, Medium: 2, Hard: 3 };

function QuestionRow({ q, index, checked, onToggle, animDelay }) {
    const [hovered, setHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [checking, setChecking] = useState(false);
    const cfg = difficultyConfig[q.difficulty] || {};
    const isDone = !!checked[q.question_name];

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), animDelay);
        return () => clearTimeout(t);
    }, [animDelay]);

    const handleCheck = (e) => {
        e.stopPropagation();
        setChecking(true);
        setTimeout(() => setChecking(false), 400);
        onToggle(q.question_name);
    };

    return (
        <div
            onClick={() => window.open(q.link, "_blank")}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                marginBottom: "4px",
                background: hovered
                    ? "rgba(255,255,255,0.04)"
                    : isDone
                        ? "rgba(34,197,94,0.03)"
                        : "transparent",
                border: hovered
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid transparent",
                transform: mounted
                    ? hovered ? "translateX(4px)" : "translateX(0)"
                    : "translateX(-18px)",
                opacity: mounted ? 1 : 0,
                transition: "transform 0.32s cubic-bezier(.22,.68,0,1.2), opacity 0.32s ease, background 0.18s ease, border-color 0.18s ease",
            }}
        >
            {/* Left side */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                {/* Checkbox */}
                <div
                    onClick={handleCheck}
                    style={{
                        width: 22,
                        height: 22,
                        flexShrink: 0,
                        borderRadius: "50%",
                        border: isDone ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                        background: isDone ? "#22c55e" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transform: checking ? "scale(1.35)" : "scale(1)",
                        transition: "transform 0.25s cubic-bezier(.22,.68,0,1.5), background 0.2s ease, border-color 0.2s ease",
                        boxShadow: isDone ? "0 0 10px rgba(34,197,94,0.35)" : "none",
                    }}
                >
                    {isDone && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                style={{
                                    strokeDasharray: 16,
                                    strokeDashoffset: checking ? 16 : 0,
                                    transition: "stroke-dashoffset 0.35s ease",
                                }}
                            />
                        </svg>
                    )}
                </div>

                {/* Index + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.2)",
                        flexShrink: 0,
                        width: "24px",
                        textAlign: "right",
                    }}>
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        color: isDone ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                        textDecoration: isDone ? "line-through rgba(255,255,255,0.2)" : "none",
                        transition: "color 0.2s ease",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        {q.question_name}
                    </span>
                </div>
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, marginLeft: "12px" }}>
                <span style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: cfg.color,
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.02em",
                }}>
                    {q.difficulty}
                </span>
                <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    style={{
                        opacity: hovered ? 0.6 : 0.2,
                        transform: hovered ? "translateX(3px)" : "translateX(0)",
                        transition: "opacity 0.18s, transform 0.18s ease",
                    }}
                >
                    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}

function StatsBar({ questions, checked }) {
    const total = questions.length;
    const done = Object.values(checked).filter(Boolean).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const easy = questions.filter(q => q.difficulty === "Easy").length;
    const medium = questions.filter(q => q.difficulty === "Medium").length;
    const hard = questions.filter(q => q.difficulty === "Hard").length;

    return (
        <div style={{ marginBottom: "28px" }}>
            {/* Progress row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                    {[{ label: "Easy", count: easy, color: "#22c55e" },
                    { label: "Medium", count: medium, color: "#EAB308" },
                    { label: "Hard", count: hard, color: "#ef4444" }].map(d => (
                        <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>
                                {d.count} {d.label}
                            </span>
                        </div>
                    ))}
                </div>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {done}/{total}
                </span>
            </div>

            {/* Track */}
            <div style={{
                height: "3px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "99px",
                overflow: "hidden",
            }}>
                <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #22c55e, #86efac)",
                    borderRadius: "99px",
                    transition: "width 0.5s cubic-bezier(.22,.68,0,1)",
                }} />
            </div>
        </div>
    );
}

function PracticeQuestion() {
    const { topic } = useParams();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`${API_URL}/api/v2/questions/${topic}`);
                const data = await res.json();
                setQuestions(data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [topic, API_URL]);

    const [checked, setChecked] = useState({});

    // Fetch progress from DB
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch(`${API_URL}/api/v3/progress?topic=${topic}`, {
                    credentials: "include"
                });
                if (!res.ok) throw new Error("Failed to fetch progress");
                const data = await res.json();
                
                if (data.solvedQuestions) {
                    const newChecked = {};
                    data.solvedQuestions.forEach(q => {
                        newChecked[q.question_name] = true;
                    });
                    setChecked(newChecked);
                }
            } catch (err) {
                console.error("Error fetching progress:", err);
            }
        };
        fetchProgress();
    }, [topic, API_URL]);

    // Update progress in DB
    const toggleCheck = async (question_name) => {
        if (checked[question_name]) return; // Prevent "unsolve" since backend doesn't support it yet
        
        const q = questions.find(q => q.question_name === question_name);
        if (!q) return;

        // Optimistic UI update
        setChecked(prev => ({ ...prev, [question_name]: true }));

        try {
            const res = await fetch(`${API_URL}/api/v3/progress/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    topic,
                    question_name,
                    difficulty: q.difficulty
                })
            });
            
            if (!res.ok) throw new Error("Failed to update progress");

            // Notify RightProgressbar to refresh
            window.dispatchEvent(new Event("progressUpdated"));
            
        } catch (err) {
            console.error("Error updating progress:", err);
            // Revert optimism on error
            setChecked(prev => ({ ...prev, [question_name]: false }));
        }
    };

    const sorted = [...questions].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    const filtered = filter === "All" ? sorted : sorted.filter(q => q.difficulty === filter);

    if (loading) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "200px", gap: "8px",
            }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#EAB308",
                        animation: `bounce 0.9s ease-in-out ${i * 0.15}s infinite`,
                    }} />
                ))}
                <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.3; }
            50% { transform: translateY(-8px); opacity: 1; }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "950px", margin: "0 auto", padding: "0 16px" }}>

            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "-0.02em",
                    margin: "0 0 4px",
                }}>
                    {topic}
                </h1>
                <p style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "'Inter', sans-serif",
                    margin: 0,
                }}>
                    {questions.length} problems
                </p>
            </div>

            {/* Stats */}
            <StatsBar questions={questions} checked={checked} />

            {/* Filter pills */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
                {["All", "Easy", "Medium", "Hard"].map(f => {
                    const active = filter === f;
                    const cfg = difficultyConfig[f];
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: "5px 14px",
                                borderRadius: "20px",
                                border: active
                                    ? `1px solid ${cfg ? cfg.border : "rgba(255,255,255,0.25)"}`
                                    : "1px solid rgba(255,255,255,0.08)",
                                background: active
                                    ? cfg ? cfg.bg : "rgba(255,255,255,0.07)"
                                    : "transparent",
                                color: active
                                    ? cfg ? cfg.color : "rgba(255,255,255,0.8)"
                                    : "rgba(255,255,255,0.35)",
                                fontSize: "12px",
                                fontWeight: 500,
                                fontFamily: "'Inter', sans-serif",
                                cursor: "pointer",
                                transition: "all 0.18s ease",
                            }}
                        >
                            {f}
                        </button>
                    );
                })}
            </div>

            {/* List */}
            <div>
                {filtered.map((q, index) => (
                    <QuestionRow
                        key={q.question_name}
                        q={q}
                        index={sorted.indexOf(q)}
                        checked={checked}
                        onToggle={toggleCheck}
                        animDelay={index * 40}
                    />
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{
                    textAlign: "center",
                    padding: "48px 0",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "13px",
                    fontFamily: "'Inter', sans-serif",
                }}>
                    No problems found
                </div>
            )}
        </div>
    );
}

export default PracticeQuestion;