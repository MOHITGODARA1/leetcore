import CodeBlock from "./CodeBlock";
import SectionFrame from "./SectionFrame";

function CommonMistakesSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="space-y-4">
        {section.items?.map((item) => (
          <article key={item.title} className="rounded-lg border border-white/10 bg-black/24 p-4">
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {item.wrong && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-red-200">{item.wrongLabel || "Wrong Code"}</p>
                  <CodeBlock code={item.wrong} tone="wrong" />
                </div>
              )}
              {item.correct && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-emerald-200">{item.correctLabel || "Correct Code"}</p>
                  <CodeBlock code={item.correct} tone="correct" />
                </div>
              )}
            </div>
            {(item.explanation || item.why) && (
              <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/62">
                {item.explanation || item.why}
              </p>
            )}
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

export default CommonMistakesSection;
