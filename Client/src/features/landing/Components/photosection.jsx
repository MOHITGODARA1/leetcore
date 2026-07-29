import React from "react";
import {
  ArrowLeft,
  Home,
  Brain,
  Trophy,
  Clock,
  CheckCircle2,
  BarChart2,
  ThumbsUp,
  ThumbsDown,
  Tag,
  Bookmark,
  Copy,
  Trash2,
  Play,
  GitCommit,
} from "lucide-react";

/* ---------------------------------------------------------
   Design tokens
   bg canvas   #0a0a0b
   panel       #111114
   panel alt   #17171b
   line        rgba(255,255,255,0.07)
   text hi     #f2f1ee
   text lo     #8b8b93
   orange      #ff6a2c  (signature glow)
   orange dim  #ff6a2c33
   mint        #34d399  (solved state only)
--------------------------------------------------------- */

const Pill = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#1c1c20", fg: "#c9c9cf", border: "rgba(255,255,255,0.08)" },
    solved: { bg: "rgba(52,211,153,0.10)", fg: "#4ade95", border: "rgba(52,211,153,0.25)" },
    easy: { bg: "rgba(52,211,153,0.10)", fg: "#4ade95", border: "rgba(52,211,153,0.25)" },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

const Tag_ = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 14px",
      borderRadius: 8,
      fontSize: 13,
      color: "#d6d6dc",
      background: "#19191d",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    {children}
  </span>
);

const Highlight = ({ children }) => (
  <span
    style={{
      background: "#1d1d21",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 6,
      padding: "1px 8px",
      fontWeight: 600,
      color: "#f2f1ee",
      margin: "0 2px",
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

const NavIcon = ({ Icon, label, active }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      padding: "14px 0",
      color: active ? "#ff6a2c" : "#6f6f78",
      cursor: "pointer",
    }}
  >
    <Icon size={20} strokeWidth={1.8} />
    <span style={{ fontSize: 11, letterSpacing: 0.2 }}>{label}</span>
  </div>
);

/* ---- fake syntax-highlighted C++ lines (display only) ---- */
const codeLines = [
  [{ t: "#include ", c: "#ff6a2c" }, { t: "<iostream>", c: "#8fd3a8" }],
  [{ t: "#include ", c: "#ff6a2c" }, { t: "<vector>", c: "#8fd3a8" }],
  [{ t: "#include ", c: "#ff6a2c" }, { t: "<unordered_map>", c: "#8fd3a8" }],
  [],
  [{ t: "using namespace ", c: "#ff6a2c" }, { t: "std;", c: "#c9c9cf" }],
  [],
  [{ t: "int ", c: "#5aa9e6" }, { t: "main() {", c: "#e8e8ea" }],
  [{ t: "  int ", c: "#5aa9e6" }, { t: "n;", c: "#e8e8ea" }],
  [{ t: "  cin >> n;", c: "#c9c9cf" }],
  [],
  [{ t: "  vector<", c: "#5aa9e6" }, { t: "int", c: "#5aa9e6" }, { t: "> nums(n);", c: "#e8e8ea" }],
  [{ t: "  for ", c: "#ff6a2c" }, { t: "(int i = 0; i < n; i++) {", c: "#e8e8ea" }],
  [{ t: "    cin >> nums[i];", c: "#c9c9cf" }],
  [{ t: "  }", c: "#e8e8ea" }],
  [],
  [{ t: "  int ", c: "#5aa9e6" }, { t: "target;", c: "#e8e8ea" }],
  [{ t: "  cin >> target;", c: "#c9c9cf" }],
  [],
  [
    { t: "  unordered_map<", c: "#5aa9e6" },
    { t: "int, int", c: "#5aa9e6" },
    { t: "> mp;", c: "#e8e8ea" },
  ],
  [],
  [{ t: "  for ", c: "#ff6a2c" }, { t: "(int i = 0; i < n; i++) {", c: "#e8e8ea" }],
  [{ t: "    int ", c: "#5aa9e6" }, { t: "complement = target - nums[i];", c: "#e8e8ea" }],
];

function CompilerPhotoSection() {
  return (
    <section
      style={{
        background: "#0a0a0b",
        padding: "0px 24px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient orange glow field behind everything */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          height: 600,
          background:
            "radial-gradient(ellipse at center, rgba(255,106,44,0.16) 0%, rgba(255,106,44,0.05) 45%, transparent 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      

      {/* ---- product shot ---- */}
      <div
        style={{
          position: "relative",
          maxWidth: 1320,
          margin: "0 auto",
          background: "#0d0d0f",
          boxShadow:
            "0 40px 100px -20px rgba(255,106,44,0.35), 0 0 0 1px rgba(255,255,255,0.03), 0 60px 140px -40px rgba(0,0,0,0.7)",
          display: "flex",
          overflow: "hidden",
          minHeight: 620,
        }}
      >
        {/* ---- rail ---- */}
        <div
          style={{
            width: 84,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 24,
            background: "#0b0b0d",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background:
                "linear-gradient(135deg, #ff6a2c, #ff9152)",
              marginBottom: 28,
            }}
          />
          <NavIcon Icon={Home} label="Home" active />
          <NavIcon Icon={Brain} label="OA" />
          <NavIcon Icon={Trophy} label="Contest" />
        </div>

        {/* ---- left: problem panel ---- */}
        <div
          style={{
            flex: "1 1 50%",
            padding: "28px 36px 36px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#8b8b93",
              fontSize: 14,
              marginBottom: 22,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} />
            Back to Array Practice
          </div>

          <div style={{ fontSize: 13, color: "#6f6f78", marginBottom: 14 }}>
            Dashboard&nbsp;/&nbsp;Problems&nbsp;/&nbsp;
            <span style={{ color: "#d6d6dc" }}>Two Sum</span>
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#f5f4f1",
              margin: "0 0 18px",
            }}
          >
            1. Two Sum
          </h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <Pill tone="easy">Easy</Pill>
            <Pill>
              <Clock size={13} /> 15 min
            </Pill>
            <Pill tone="solved">
              <CheckCircle2 size={13} /> Solved
            </Pill>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
            <Pill>
              <BarChart2 size={13} color="#a78bfa" /> 52.1% acceptance
            </Pill>
            <Pill>
              <ThumbsUp size={13} /> 55,000
            </Pill>
            <Pill>
              <ThumbsDown size={13} /> 1,800
            </Pill>
          </div>

          <div style={{ fontSize: 11, letterSpacing: 1, color: "#6f6f78", marginBottom: 10 }}>
            ASKED BY COMPANIES
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {["Amazon", "Google", "Meta", "Apple", "Microsoft", "Netflix"].map((c) => (
              <Tag_ key={c}>{c}</Tag_>
            ))}
          </div>

          <div style={{ fontSize: 11, letterSpacing: 1, color: "#6f6f78", marginBottom: 10 }}>
            TOPICS
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            <Tag_>
              <Tag size={13} color="#ff9152" /> Array
            </Tag_>
            <Tag_>
              <Bookmark size={13} color="#ff9152" /> Hash Map
            </Tag_>
          </div>

          <p style={{ color: "#c9c9cf", fontSize: 15.5, lineHeight: 1.9, margin: 0 }}>
            You are <Highlight>given</Highlight> a list of numbers and a{" "}
            <Highlight>target</Highlight> value.
            <br />
            <Highlight>Find</Highlight> the two different numbers in the list
            that <Highlight>add</Highlight> up to the <Highlight>target</Highlight>
            , and <Highlight>return</Highlight> their indices.
            <br />
            <Highlight>Exactly one</Highlight> valid answer exists, and the
            same element <Highlight>cannot</Highlight> be used twice.
          </p>
        </div>

        {/* ---- right: editor panel ---- */}
        <div style={{ flex: "1 1 50%", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#e8e8ea", fontSize: 15, fontWeight: 600 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "rgba(255,106,44,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GitCommit size={13} color="#ff8a52" />
              </div>
              Editor
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 13,
                  color: "#c9c9cf",
                  background: "#19191d",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "4px 10px",
                }}
              >
                C++
              </span>
            </div>
            <div style={{ display: "flex", gap: 14, color: "#6f6f78" }}>
              <Copy size={16} style={{ cursor: "pointer" }} />
              <Trash2 size={16} style={{ cursor: "pointer" }} />
            </div>
          </div>

          {/* code */}
          <div
            style={{
              flex: 1,
              background: "#0c0c0e",
              padding: "18px 0",
              fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
              fontSize: 13.5,
              lineHeight: 1.85,
              overflow: "hidden",
            }}
          >
            {codeLines.map((line, i) => (
              <div key={i} style={{ display: "flex" }}>
                <div
                  style={{
                    width: 44,
                    textAlign: "right",
                    color: "#4a4a52",
                    paddingRight: 18,
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ whiteSpace: "pre", color: "#e8e8ea" }}>
                  {line.length === 0 ? "\u00A0" : line.map((seg, j) => (
                    <span key={j} style={{ color: seg.c }}>
                      {seg.t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* test cases */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: 22, padding: "14px 24px 0" }}>
              {["Test Cases", "Custom Input", "Test Results"].map((tab, i) => (
                <div
                  key={tab}
                  style={{
                    fontSize: 14,
                    color: i === 0 ? "#ff8a52" : "#8b8b93",
                    paddingBottom: 12,
                    borderBottom: i === 0 ? "2px solid #ff6a2c" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px 20px" }}>
              <div
                style={{
                  background: "#141417",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  color: "#c9c9cf",
                  lineHeight: 1.8,
                }}
              >
                <div style={{ color: "#f2f1ee", fontWeight: 600, marginBottom: 4 }}>Case 1:</div>
                <div>Input: nums = [2,7,11,15], target = 9</div>
                <div>Output: [0,1]</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 24px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ fontSize: 13, color: "#6f6f78" }}>Ready · 84 words · 33 lines</span>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #ff6a2c, #ff8a52)",
                  color: "#0a0a0b",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 8px 24px -6px rgba(255,106,44,0.6)",
                }}
              >
                <Play size={14} fill="#0a0a0b" /> Run Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompilerPhotoSection;