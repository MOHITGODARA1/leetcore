import { useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionFrame from "./SectionFrame";

function applyOperation(array, operation, value, index) {
  const isStringArray = array.some(x => typeof x === "string");
  const next = isStringArray ? [...array].map(x => String(x)) : [...array];
  
  const normalizedIndex = Number.isNaN(index) ? 0 : Math.max(0, Math.min(index, next.length));
  const safeIndex = Math.min(normalizedIndex, Math.max(next.length - 1, 0));

  if (operation.startsWith("push_back") || operation === "Push") next.push(value);
  if (operation.startsWith("pop_back") || operation === "Pop") next.pop();
  if (operation.startsWith("insert") || operation === "Insert") next.splice(normalizedIndex, 0, value);
  if (operation.startsWith("erase") || operation === "Erase") next.splice(safeIndex, 1);
  
  // String specific operations
  if (operation.startsWith("toUpperCase")) {
    if (next[safeIndex] !== undefined) {
      next[safeIndex] = String(next[safeIndex]).toUpperCase();
    }
  }
  if (operation.startsWith("toLowerCase")) {
    if (next[safeIndex] !== undefined) {
      next[safeIndex] = String(next[safeIndex]).toLowerCase();
    }
  }

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
              className="flex h-12 items-center justify-center rounded-md border border-white/15 bg-[#111113] font-mono text-sm text-white/90"
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

  const isStringArray = useMemo(() => initialArray.some(x => typeof x === "string"), [initialArray]);

  const [before, setBefore] = useState(initialArray);
  const [after, setAfter] = useState(initialArray);
  const [operation, setOperation] = useState(operations[0] || "");
  const [value, setValue] = useState(isStringArray ? "A" : 60);
  const [index, setIndex] = useState(2);

  const preview = useMemo(() => {
    const parsedValue = isStringArray ? String(value) : (Number.isNaN(Number(value)) ? value : Number(value));
    return applyOperation(before, operation, parsedValue, Number(index));
  }, [before, index, operation, value, isStringArray]);

  function runVisualization() {
    setAfter(preview);
    setBefore(preview);
  }

  // Determine if index input is needed for selected operation
  const needsIndex = useMemo(() => {
    return operation.includes("index") || operation.includes("insert") || operation.includes("erase") || operation.includes("Pop") || operation.includes("pop");
  }, [operation]);

  // Determine if value input is needed for selected operation
  const needsValue = useMemo(() => {
    return operation.includes("push") || operation.includes("insert") || operation.includes("Push") || operation.includes("char");
  }, [operation]);

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
            {needsValue ? (
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">
                {controls.valueLabel}
                <input
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  type={isStringArray ? "text" : "number"}
                  maxLength={isStringArray ? 1 : undefined}
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm normal-case text-white"
                />
              </label>
            ) : (
              <div className="flex flex-col justify-end text-xs text-white/30 italic pb-2">
                No value needed
              </div>
            )}
            {needsIndex ? (
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">
                {controls.indexLabel}
                <input
                  value={index}
                  onChange={(event) => setIndex(event.target.value)}
                  type="number"
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm normal-case text-white"
                />
              </label>
            ) : (
              <div className="flex flex-col justify-end text-xs text-white/30 italic pb-2">
                No index needed
              </div>
            )}
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
