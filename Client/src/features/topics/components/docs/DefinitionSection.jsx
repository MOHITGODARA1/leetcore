import SectionFrame from "./SectionFrame";

function DefinitionSection({ section }) {
  const isDual = section.type === "dual_callout";
  const leftKey = section.left ? "left" : "array";
  const rightKey = section.right ? "right" : "vector";
  const leftTitle = section.leftTitle || "Array";
  const rightTitle = section.rightTitle || "Vector";

  return (
    <SectionFrame section={section}>
      {isDual ? (
        <div className={`grid gap-4 p-5 ${section.cards ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {section.cards ? (
            section.cards.map((card, idx) => (
              <div key={idx} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{card.title}</h4>
                <p className="mt-2 text-sm leading-6 text-white/68">{card.content}</p>
              </div>
            ))
          ) : (
            <>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{leftTitle}</h4>
                <p className="mt-2 text-sm leading-6 text-white/68">{section[leftKey]}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{rightTitle}</h4>
                <p className="mt-2 text-sm leading-6 text-white/68">{section[rightKey]}</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="p-5 text-sm leading-8 text-white/68">
          {section.content}
        </p>
      )}
    </SectionFrame>
  );
}

export default DefinitionSection;
