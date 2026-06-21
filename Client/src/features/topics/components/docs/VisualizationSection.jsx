import { useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionFrame from "./SectionFrame";

function applyOperation(array, operation, value, index) {
  const next = [...array];
  const normalizedIndex = Number.isNaN(index) ? 0 : Math.max(0, Math.min(index, next.length));

  if (operation === "push_back()") next.push(value);
  if (operation === "pop_back()") next.pop();
  if (operation === "insert()") next.splice(normalizedIndex, 0, value);
  if (operation === "erase()") next.splice(Math.min(normalizedIndex, Math.max(next.length - 1, 0)), 1);

  return next;
}

function ArrayRow({ label, values, indexLabel, valueLabel }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/22 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/44">{label}</p>
      <div className="grid grid-cols-[72px_1fr] gap-3 text-xs">
        <span className="pt-2 text-white/52">{indexLabel}</span>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(values.length, 1)}, minmax(42px, 1fr))` }}>
          {values.map((_, index) => (
            <span key={`index-${index}`} className="text-center font-mono text-white/64">{index}</span>
          ))}
        </div>
        <span className="pt-3 text-white/52">{valueLabel}</span>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(values.length, 1)}, minmax(42px, 1fr))` }}>
          {values.map((value, index) => (
            <Motion.div
              layout
              key={`${value}-${index}`}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.82 }}
              className="flex h-12 items-center justify-center rounded-md border border-orange-300/18 bg-[#111113] font-mono text-sm text-orange-200"
            >
              {value}
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualizationSection({ section }) {
  const initialArray = section.initialArray || [10, 20, 30, 40, 50];
  const operations = section.operations || ["push_back()", "pop_back()", "insert()", "erase()"];
  const controls = section.controls || {
    operationLabel: "Operation",
    valueLabel: "Value",
    indexLabel: "Index",
    buttonLabel: "Run Visualization"
  };
  const labels = section.labels || {
    before: "Before Operation",
    after: "After Operation",
    index: "Index",
    value: "Value"
  };

  const [before, setBefore] = useState(initialArray);
  const [after, setAfter] = useState(initialArray);
  const [operation, setOperation] = useState(operations[0] || "");
  const [value, setValue] = useState(60);
  const [index, setIndex] = useState(2);

  const preview = useMemo(
    () => applyOperation(before, operation, Number(value), Number(index)),
    [before, index, operation, value],
  );

  function runVisualization() {
    setAfter(preview);
    setBefore(preview);
  }

  return (
    <SectionFrame section={section}>
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <ArrayRow label={labels.before} values={before} indexLabel={labels.index} valueLabel={labels.value} />
          <ArrayRow label={labels.after} values={after} indexLabel={labels.index} valueLabel={labels.value} />
        </div>
        <div className="rounded-lg border border-white/10 bg-black/24 p-4">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">{controls.operationLabel}</label>
          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value)}
            className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white"
          >
            {operations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">
              {controls.valueLabel}
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                type="number"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm normal-case text-white"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">
              {controls.indexLabel}
              <input
                value={index}
                onChange={(event) => setIndex(event.target.value)}
                type="number"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm normal-case text-white"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={runVisualization}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#f46717] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff7a2b]"
          >
            <Play size={16} />
            {controls.buttonLabel}
          </button>
        </div>
      </div>
    </SectionFrame>
  );
}

export default VisualizationSection;
