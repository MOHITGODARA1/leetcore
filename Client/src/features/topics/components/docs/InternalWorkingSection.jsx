import SectionFrame from "./SectionFrame";

function InternalWorkingSection({ section }) {
  if (section.type === "array_vector_internal") {
    return (
      <SectionFrame section={section}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Array Contiguous Memory */}
          <div className="rounded-lg border border-white/10 bg-black/24 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Array Contiguous Memory</h4>
            <div className="mt-4 overflow-x-auto rounded border border-white/8 bg-black/30 p-3">
              <table className="w-full min-w-[360px] text-center text-xs font-mono">
                <thead>
                  <tr className="text-white/50">
                    <th className="py-2 text-left">Index</th>
                    {section.array.memory.values.map((_, i) => (
                      <th key={i} className="py-2">[{i}]</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr className="border-t border-b border-white/8">
                    <td className="py-3 text-left font-semibold text-white/50">Value</td>
                    {section.array.memory.values.map((val, i) => (
                      <td key={i} className="py-3 bg-white/[0.02]">{val}</td>
                    ))}
                  </tr>
                  <tr className="text-orange-200/70">
                    <td className="py-2 text-left text-white/50">Address</td>
                    {section.array.memory.addresses.map((addr, i) => (
                      <td key={i} className="py-2">{addr}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-sm leading-6 text-white/64">
              {section.array.explanation?.map((text) => (
                <p key={text}>• {text}</p>
              ))}
            </div>
          </div>

          {/* Vector Growth and Capacity */}
          <div className="rounded-lg border border-white/10 bg-black/24 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Vector Dynamic Growth</h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded border border-white/5 bg-white/[0.015] p-3 text-center">
                <span className="text-xs text-white/50">Current Size</span>
                <p className="mt-1 text-2xl font-bold text-white">{section.vector.size}</p>
              </div>
              <div className="rounded border border-white/5 bg-white/[0.015] p-3 text-center">
                <span className="text-xs text-white/50">Current Capacity</span>
                <p className="mt-1 text-2xl font-bold text-[#f46717]">{section.vector.capacity}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs text-white/50">Growth Pattern (Capacity):</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {section.vector.growthPattern?.map((cap, i) => (
                  <span key={i} className="rounded bg-[#f46717]/10 border border-[#f46717]/20 px-2.5 py-1 text-xs font-mono text-orange-200">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/64">{section.vector.capacityExplanation}</p>
            {section.vector.reallocation && (
              <div className="mt-4 rounded border border-[#f46717]/25 bg-[#f46717]/5 p-3 text-xs font-mono text-orange-200/90">
                Vector automatically reallocates memory: {section.vector.reallocation.oldCapacity} → {section.vector.reallocation.newCapacity} when full.
              </div>
            )}
          </div>
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame section={section}>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/24 p-4">
          {section.memory && Object.entries(section.memory).map(([key, values]) => (
            <div key={key} className="grid min-w-[520px] grid-cols-[86px_1fr] border-b border-white/8 py-3 last:border-b-0">
              <span className="capitalize text-white/56">{key}</span>
              <div className="grid grid-cols-5 gap-2">
                {values.map((value) => (
                  <span key={`${key}-${value}`} className="rounded-md border border-white/8 bg-white/[0.035] px-2 py-2 text-center font-mono text-sm text-white/80">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className=" p-4">
          <div className="space-y-3 text-sm leading-6 text-white/64">
            {section.explanation?.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          {section.formula && (
            <div className="mt-5 rounded-lg border border-orange-300/25 bg-black/28 p-4">
              <p className="font-mono text-sm text-orange-100">{section.formula.label}</p>
              <p className="mt-3 font-mono text-lg font-semibold text-[#f46717]">{section.formula.example}</p>
            </div>
          )}
        </div>
      </div>
    </SectionFrame>
  );
}

export default InternalWorkingSection;
