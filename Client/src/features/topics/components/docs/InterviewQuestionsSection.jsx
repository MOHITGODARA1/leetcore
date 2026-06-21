import { ArrowUpRight } from "lucide-react";
import SectionFrame from "./SectionFrame";
import { difficultyClass } from "./difficulty";

function InterviewQuestionsSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="space-y-5">
        {section.categories.map((category) => (
          <div key={category.name} className="overflow-hidden rounded-lg border border-white/10">
            <div className="flex items-center justify-between bg-white/[0.055] px-4 py-3">
              <h3 className="font-semibold text-white">{category.name}</h3>
              <span className="text-xs text-white/46">{category.questions.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-black/24 text-xs uppercase tracking-[0.12em] text-white/42">
                  <tr>
                    {section.columns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8 bg-black/16 text-white/68">
                  {category.questions.map((question) => (
                    <tr key={`${category.name}-${question.name}`} className="transition hover:bg-orange-500/[0.06]">
                      <td className="px-4 py-3 font-semibold text-white">{question.name}</td>
                      <td className="px-4 py-3">{question.platform}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyClass(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3">{question.pattern}</td>
                      <td className="px-4 py-3">
                        <a href={question.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-orange-200 hover:text-orange-100">
                          Open <ArrowUpRight size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}

export default InterviewQuestionsSection;
