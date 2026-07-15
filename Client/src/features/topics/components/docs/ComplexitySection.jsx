import SectionFrame from "./SectionFrame";
import { renderFormattedText } from "./utils.jsx";

function ComplexitySection({ section }) {
  const isComparisonTable = section.type === "comparison_table";
  const isSimpleTable = section.type === "table";

  let columns = [];
  if (isComparisonTable) {
    columns = ["Operation", "Array", "Vector"];
  } else if (isSimpleTable) {
    columns = ["Situation", "Best Alternative"];
  } else {
    columns = section.columns || ["Operation", "Best Case", "Average Case", "Worst Case", "Space Complexity"];
  }

  return (
    <SectionFrame section={section}>
      <div className="overflow-x-auto rounded-lg border border-white/4 bg-white/8">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-white/10 text-xs uppercase tracking-[0.12em] text-white/60 border-b border-white/8">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/4 bg-black/10 text-white/70">
            {section.rows?.map((row, index) => (
              <tr key={index} className="transition hover:bg-white/[0.04]">
                {isSimpleTable ? (
                   <>
                     <td className="px-4 py-3 font-semibold text-white">{renderFormattedText(row.situation)}</td>
                     <td className="px-4 py-3 text-white/80">{renderFormattedText(row.choice)}</td>
                   </>
                ) : isComparisonTable ? (
                   <>
                     <td className="px-4 py-3 font-semibold text-white">{renderFormattedText(row.operation || row.feature)}</td>
                     <td className="px-4 py-3 font-mono text-white/80">{renderFormattedText(row.array)}</td>
                     <td className="px-4 py-3 font-mono text-white/80">{renderFormattedText(row.vector)}</td>
                   </>
                ) : section.keys ? (
                  section.keys.map((key, kIdx) => (
                    <td key={kIdx} className={`px-4 py-3 ${kIdx === 0 ? "font-semibold text-white" : "font-mono"}`}>
                      {renderFormattedText(row[key])}
                    </td>
                  ))
                ) : (
                  <>
                    <td className="px-4 py-3 font-semibold text-white">{renderFormattedText(row.operation)}</td>
                    <td className="px-4 py-3 font-mono">{renderFormattedText(row.best)}</td>
                    <td className="px-4 py-3 font-mono">{renderFormattedText(row.average)}</td>
                    <td className="px-4 py-3 font-mono">{renderFormattedText(row.worst)}</td>
                    <td className="px-4 py-3 font-mono">{renderFormattedText(row.space)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionFrame>
  );
}

export default ComplexitySection;
