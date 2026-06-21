import SectionFrame from "./SectionFrame";

function IntroductionSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="space-y-3 text-sm leading-7 text-white/68">
        {section.content?.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      {section.highlights && section.highlights.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {section.highlights.map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70">
              {item}
            </span>
          ))}
        </div>
      )}
    </SectionFrame>
  );
}

export default IntroductionSection;
