import SectionFrame from "./SectionFrame";

function DefinitionSection({ section }) {
  return (
    <SectionFrame section={section}>
      {section.type === "dual_callout" ? (
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Array</h4>
            <p className="mt-2 text-sm leading-6 text-white/68">{section.array}</p>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Vector</h4>
            <p className="mt-2 text-sm leading-6 text-white/68">{section.vector}</p>
          </div>
        </div>
      ) : (
        <p className="p-5 text-sm leading-8 text-orange-50 sm:text-sm text-white/68">
          {section.content}
        </p>
      )}
    </SectionFrame>
  );
}

export default DefinitionSection;
