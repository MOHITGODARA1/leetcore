import SectionFrame from "./SectionFrame";
import { renderFormattedText } from "./utils.jsx";

function DefinitionSection({ section }) {
  const isDual = section.type === "dual_callout";
  const leftKey = section.left ? "left" : "array";
  const rightKey = section.right ? "right" : "vector";
  const leftTitle = section.leftTitle || "Array";
  const rightTitle = section.rightTitle || "Vector";

  return (
    <SectionFrame section={section}>
      {isDual ? (
        <div className={`grid gap-4  ${section.cards ? "sm:grid-cols-1" : "sm:grid-cols-1"}`}>
          {section.cards ? (
            section.cards.map((card, idx) => (
              <div key={idx} className=" p-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{card.title}</h4>
                <p className="mt-2 text-sm leading-6 text-white/70">{renderFormattedText(card.content)}</p>
              </div>
            ))
          ) : (
            <>
              <div className=" p-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{leftTitle}</h4>
                <p className="mt-2 text-sm leading-6 text-white/80">{renderFormattedText(section[leftKey])}</p>
              </div>
              <div className=" p-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">{rightTitle}</h4>
                <p className="mt-2 text-sm leading-6 text-white/80">{renderFormattedText(section[rightKey])}</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="p-5 text-sm leading-8 text-white/70">
          {renderFormattedText(section.content)}
        </p>
      )}
    </SectionFrame>
  );
}

export default DefinitionSection;
