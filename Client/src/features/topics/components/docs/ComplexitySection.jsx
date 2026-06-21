import SectionFrame from "./SectionFrame";

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
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.12em] text-white/50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8 bg-black/18 text-white/68">
            {section.rows?.map((row, index) => (
              <tr key={index} className="transition hover:bg-orange-500/[0.06]">
                {isSimpleTable ? (
                  <>
                    <td className="px-4 py-3 font-semibold text-white">{row.situation}</td>
                    <td className="px-4 py-3 text-orange-200">{row.choice}</td>
                  </>
                ) : isComparisonTable ? (
                  <>
                    <td className="px-4 py-3 font-semibold text-white">{row.operation}</td>
                    <td className="px-4 py-3 font-mono">{row.array}</td>
                    <td className="px-4 py-3 font-mono">{row.vector}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-semibold text-white">{row.operation}</td>
                    <td className="px-4 py-3 font-mono">{row.best}</td>
                    <td className="px-4 py-3 font-mono">{row.average}</td>
                    <td className="px-4 py-3 font-mono">{row.worst}</td>
                    <td className="px-4 py-3 font-mono">{row.space}</td>
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
