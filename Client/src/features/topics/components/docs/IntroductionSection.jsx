import SectionFrame from "./SectionFrame";
import { renderFormattedText } from "./utils.jsx";

function IntroductionSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="space-y-1 text-[14px] leading-7 text-white/80">
        {section.content?.map((text, idx) => (
          <p key={idx}>{renderFormattedText(text)}</p>
        ))}
      </div>
      {section.highlights && section.highlights.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {section.highlights.map((item) => (
            <span key={item} className="rounded-full border border-white/4 bg-white/8 px-3.5 py-1.5 text-xs text-white/80 font-medium">
              {item}
            </span>
          ))}
        </div>
      )}
    </SectionFrame>
  );
}

export default IntroductionSection;
