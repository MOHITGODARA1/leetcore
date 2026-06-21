import SectionFrame from "./SectionFrame";

function OperationsSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="grid gap-4 xl:grid-cols-[1fr_270px]">
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.12em] text-white/50">
              <tr>
                {section.columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8 bg-black/18 text-white/68">
              {section.rows.map((row) => (
                <tr key={row.operation} className="transition cursor-default">
                  <td className="px-4 py-3 font-semibold text-white">{row.operation}</td>
                  <td className="px-4 py-3">{row.description}</td>
                  <td className="px-4 py-3 font-mono text-orange-200">{row.stl}</td>
                  <td className="px-4 py-3 font-mono">{row.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="p-4">
          <h3 className="font-semibold text-white">{section.panelTitle}</h3>
          <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1">
            {section.functions.map((item) => (
              <span key={item} className="rounded-md border border-white/10 bg-black/24 px-3 py-2 font-mono text-xs text-orange-100">
                {item}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </SectionFrame>
  );
}

export default OperationsSection;
