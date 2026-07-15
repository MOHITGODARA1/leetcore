import { useParams } from "react-router-dom";
import SectionFrame from "./SectionFrame";

const formatDynamicCodeSnippet = (topic, op, stl) => {
  const topicLower = topic?.toLowerCase() || "";
  const opLower = op.toLowerCase();

  if (topicLower.includes("string")) {
    if (opLower.includes("append")) return "s.push_back('a');  // or s += \"abc\";";
    if (opLower.includes("substring")) return "string sub = s.substr(index, length);";
    if (opLower.includes("find")) return "size_t pos = s.find(\"pattern\");";
    if (opLower.includes("erase")) return "s.erase(index, count);";
    if (opLower.includes("length")) return "int len = s.size();  // or s.length();";
    if (opLower.includes("traverse")) return "for (char c : s) { ... }";
    if (opLower.includes("access")) return "char c = s[index];  // s.at(index)";
    if (opLower.includes("update")) return "s[index] = 'x';";
  }

  if (topicLower.includes("binary")) {
    if (opLower.includes("standard")) return "binary_search(arr.begin(), arr.end(), target); // returns bool";
    if (opLower.includes("lower bound")) return "auto it = lower_bound(arr.begin(), arr.end(), target);";
    if (opLower.includes("upper bound")) return "auto it = upper_bound(arr.begin(), arr.end(), target);";
    if (opLower.includes("first")) return "// Match logic:\nif (arr[mid] == target) {\n    ans = mid; high = mid - 1;  // Keep looking left\n}";
    if (opLower.includes("last")) return "// Match logic:\nif (arr[mid] == target) {\n    ans = mid; low = mid + 1;   // Keep looking right\n}";
    if (opLower.includes("rotated")) return "// Identify sorted half:\nif (arr[low] <= arr[mid]) { ... } else { ... }";
    if (opLower.includes("space") || opLower.includes("answer")) return "while (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (isPossible(mid)) { ans = mid; high = mid - 1; }\n    else low = mid + 1;\n}";
  }

  return stl;
};

function OperationsSection({ section }) {
  const { topic } = useParams();
  const topicLower = topic?.toLowerCase();
  const isHashing = topicLower === "hashing";
  const isBinarySearch = topicLower === "binarysearch" || topicLower === "binary-search";

  // Check if columns contain Average to identify Hashing-style time complexity grids
  const isHashingStyle = section.columns?.some(c => c.toLowerCase().includes("avg")) || isHashing;

  return (
    <SectionFrame section={section}>
      {/* 1. Note Callout for Specific Core Topics */}
      {isHashingStyle && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 leading-relaxed shadow-lg">
          <span className="font-bold text-white mr-1.5">💡 Note:</span>
          Hashing performs operations in <strong className="text-white">O(1) average time</strong> by mapping keys directly to array buckets. In the worst-case scenario (e.g. due to hash collisions where all keys map to the same bucket), complexity degrades to <strong className="text-white">O(N)</strong>.
        </div>
      )}

      {isBinarySearch && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 leading-relaxed shadow-lg">
          <span className="font-bold text-white mr-1.5">💡 Note:</span>
          All Binary Search operations run in logarithmic time complexity, <strong className="text-white">O(log N)</strong>, by dividing the search range in half at each step. This requires the input collection to be sorted (for array index lookups) or follow a monotonic condition (for parametric range lookups).
        </div>
      )}

      {/* 2. STL functions block if present */}
      {section.functions && (
        <div className="mb-6">
          <h5 className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/44 mb-3">
            {section.panelTitle || "STL Functions & API Reference"}
          </h5>
          <div className="flex flex-wrap gap-2">
            {section.functions.map((item) => (
              <code key={item} className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-white/80 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200 cursor-default">
                {item}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* 3. Dynamic Card Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.rows.map((row) => {
          const hasComplexity = !!row.complexity;
          const stlCode = formatDynamicCodeSnippet(topicLower, row.operation, row.stl);

          return (
            <div key={row.operation} className="flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 hover:bg-white/[0.035] transition-all duration-200">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-sm font-bold text-white tracking-tight">{row.operation}</h4>
                  {hasComplexity && (
                    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white border border-white/20 whitespace-nowrap">
                      {row.complexity}
                    </span>
                  )}
                  {isBinarySearch && (
                    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white border border-white/20 whitespace-nowrap">
                      O(log n)
                    </span>
                  )}
                </div>

                {isHashingStyle ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white border border-white/20">
                      Avg: {row.description}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60 border border-white/10">
                      Worst: {row.stl}
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-white/60 leading-relaxed">{row.description}</p>
                )}
              </div>

              {/* Code/details block at the bottom */}
              {!isHashingStyle && stlCode && (
                <div className="mt-4 font-mono text-[11px] text-zinc-300 bg-black/40 rounded-lg px-2.5 py-2 border border-white/5 whitespace-pre-wrap">
                  {stlCode}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export default OperationsSection;
