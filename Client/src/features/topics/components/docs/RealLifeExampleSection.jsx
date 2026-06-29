import { motion as Motion } from "framer-motion";
import SectionFrame from "./SectionFrame";

function RealLifeExampleSection({ section }) {
  if (section.type === "comparison") {
    const keys = [];
    if (section.left) keys.push("left");
    if (section.center) keys.push("center");
    if (section.right) keys.push("right");
    if (keys.length === 0) {
      if (section.array) keys.push("array");
      if (section.vector) keys.push("vector");
    }
    const gridColsClass = keys.length === 3 ? "md:grid-cols-3" : keys.length === 2 ? "md:grid-cols-2" : "grid-cols-1";
    return (
      <SectionFrame section={section}>
        <div className={`grid gap-6 ${gridColsClass}`}>
          {keys.map((key) => {
            const data = section[key];
            if (!data) return null;
            const displayTitle = key === "left" || key === "center" || key === "right" ? data.title || key : `${key}: ${data.title}`;
            return (
              <div key={key} className="rounded-lg border border-white/10 bg-black/24 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white capitalize">
                  {displayTitle}
                </h4>
                <p className="mt-3 text-sm leading-6 text-white/66">{data.description}</p>
                {data.diagram && (
                  <pre className="mt-4 overflow-x-auto rounded border border-white/5 bg-black/40 p-3 font-mono text-xs text-zinc-300">
                    {data.diagram}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame section={section}>
      <div>
        <div className="space-y-3 text-sm leading-7 text-white/66">
          {section.content?.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export default RealLifeExampleSection;
