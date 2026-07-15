import React from "react";

/**
 * Parses text and formats inline code (wrapped in backticks) and bold text (wrapped in double stars).
 * Replaces backticks with a styled <code> tag using bg-white/8 and border-white/4.
 * Replaces bold text with a <strong> tag.
 */
export function renderFormattedText(text) {
  if (!text) return "";
  
  // Regex to split by backticks `code` or double asterisks **bold**
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      return (
        <code 
          key={index} 
          className="font-mono bg-white/8 border border-white/4 px-1.5 py-0.5 rounded font-semibold text-xs md:text-sm select-all mx-0.5 text-orange-200/85"
        >
          {code}
        </code>
      );
    } else if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-white">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}
