import { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";
import CodeBlock from "./CodeBlock";
import SectionFrame from "./SectionFrame";

function SyntaxSection({ section }) {
  const [activeTab, setActiveTab] = useState(section.tabs[0]?.label);
  const [copied, setCopied] = useState(false);
  const active = section.tabs.find((tab) => tab.label === activeTab) || section.tabs[0];

  async function copyCode() {
    await navigator.clipboard.writeText(active.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <SectionFrame section={section}>
      <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-black/22 p-2">
        {section.tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            className={`rounded-md px-4 py-2 text-sm transition ${active.label === tab.label ? "bg-[#f46717] text-white" : "text-white/62 hover:bg-white/8 hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-[#070708]">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <span className="font-mono text-xs text-white/46">{active.language}</span>
          <button type="button" onClick={copyCode} className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-orange-300/35 hover:text-white">
            {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <CodeBlock code={active.code} />
      </div>
    </SectionFrame>
  );
}

export default SyntaxSection;
