import React from "react";

function highlightCode(code) {
  if (!code) return "";

  // Regex rules:
  // 1: Comments (// ... or # ...)
  // 2: Strings ("..." or '...')
  // 3: Types (int, float, double, char, string, bool, void, vector, auto, etc.)
  // 4: Keywords (new, delete, return, if, else, for, while, do, switch, case, break, continue, etc.)
  // 5: Builtins (std, cout, cin, endl, print, console, log, push_back, pop_back, insert, etc.)
  // 6: Numbers (integers, floats)
  const regex = /(\/\/.*|#.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(int|float|double|char|string|bool|void|vector|auto|var|let|const|class|struct|typename|template|unsigned|long|short)\b|\b(new|delete|return|if|else|for|while|do|switch|case|break|continue|namespace|using|public|private|protected|static|final|import|export|from|default)\b|\b(std|cout|cin|endl|print|console|log|Math|push_back|pop_back|insert|erase|length|size|empty|clear|begin|end)\b|\b(\d+)\b/g;

  let lastIndex = 0;
  const children = [];
  let match;

  const re = new RegExp(regex);

  while ((match = re.exec(code)) !== null) {
    const matchIndex = match.index;
    const matchText = match[0];

    if (matchIndex > lastIndex) {
      children.push(code.substring(lastIndex, matchIndex));
    }

    let className = "";
    if (match[1]) {
      className = "text-[#6a9955] italic"; // Comment (VS Code soft green)
    } else if (match[2]) {
      className = "text-[#ce9178] font-medium"; // String (VS Code terracotta)
    } else if (match[3]) {
      className = "text-[#4ec9b0] font-semibold"; // Type (VS Code soft teal)
    } else if (match[4]) {
      className = "text-[#569cd6] font-semibold"; // Keyword (VS Code soft blue)
    } else if (match[5]) {
      className = "text-[#dcdcaa]"; // Builtin (VS Code soft yellow)
    } else if (match[6]) {
      className = "text-[#b5cea8] font-mono"; // Number (VS Code pale green)
    }

    children.push(
      <span key={matchIndex} className={className}>
        {matchText}
      </span>
    );

    lastIndex = re.lastIndex;
  }

  if (lastIndex < code.length) {
    children.push(code.substring(lastIndex));
  }

  return children;
}

function CodeBlock({ code, tone = "default" }) {
  const border =
    tone === "wrong" ? "border-red-500/35" : tone === "correct" ? "border-emerald-500/35" : "border-white/10";
  const glow =
    tone === "wrong" ? "bg-red-950/15" : tone === "correct" ? "bg-emerald-950/15" : "bg-[#070708]";

  return (
    <pre className={`overflow-x-auto rounded-lg  text-zinc-100 p-4 text-xs leading-6  shadow-inner sm:text-sm`}>
      <code>{highlightCode(code)}</code>
    </pre>
  );
}

export default CodeBlock;
