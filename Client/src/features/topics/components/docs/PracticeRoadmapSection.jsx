import SectionFrame from "./SectionFrame";

function PracticeRoadmapSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="grid gap-4 lg:grid-cols-3">
        {section.groups.map((group) => (
          <article key={group.level} className="rounded-lg border border-white/10 bg-black/24 p-4 transition hover:-translate-y-1 hover:border-orange-400/35">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{group.level}</h3>
                <p className="mt-1 text-sm text-white/48">{group.count} Questions</p>
              </div>
              <span className="rounded-full border border-orange-300/25 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-100">
                {group.progress}%
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-[#f46717]" style={{ width: `${group.progress}%` }} />
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-white/62">
              {group.questions.map((question) => (
                <li key={`${group.level}-${question}`} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-300" />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

export default PracticeRoadmapSection;
