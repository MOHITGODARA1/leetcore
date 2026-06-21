import { motion as Motion } from "framer-motion";
import SectionFrame from "./SectionFrame";

function RealLifeExampleSection({ section }) {
  if (section.type === "comparison") {
    return (
      <SectionFrame section={section}>
        <div className="grid gap-6 md:grid-cols-2">
          {["array", "vector"].map((key) => {
            const data = section[key];
            if (!data) return null;
            return (
              <div key={key} className="rounded-lg border border-white/10 bg-black/24 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white capitalize">
                  {key}: {data.title}
                </h4>
                <p className="mt-3 text-sm leading-6 text-white/66">{data.description}</p>
                {data.diagram && (
                  <pre className="mt-4 overflow-x-auto rounded border border-white/5 bg-black/40 p-3 font-mono text-xs text-orange-200">
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
