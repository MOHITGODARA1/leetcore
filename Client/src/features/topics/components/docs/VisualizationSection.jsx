import { useMemo, useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionFrame from "./SectionFrame";

function applyOperation(array, operation, value, index) {
  const isStringArray = array.some(x => typeof x === "string");
  let next = isStringArray ? [...array].map(x => String(x)) : [...array];
  
  const normalizedIndex = Number.isNaN(index) ? 0 : Math.max(0, Math.min(index, next.length));
  const safeIndex = Math.min(normalizedIndex, Math.max(next.length - 1, 0));
  let returnValue = null;

  // --- Query / Non-mutating operations ---
  if (operation.startsWith("top")) {
    returnValue = next.length > 0 ? String(next[next.length - 1]) : "Underflow / Empty";
  } else if (operation.startsWith("front")) {
    returnValue = next.length > 0 ? String(next[0]) : "Underflow / Empty";
  } else if (operation.startsWith("back") && !operation.startsWith("push_back") && !operation.startsWith("pop_back")) {
    returnValue = next.length > 0 ? String(next[next.length - 1]) : "Underflow / Empty";
  } else if (operation.startsWith("empty")) {
    returnValue = next.length === 0 ? "true" : "false";
  } else if (operation.startsWith("size") || operation.startsWith("length")) {
    returnValue = String(next.length);
  } else if (operation.startsWith("search")) {
    const valIndex = next.indexOf(value);
    returnValue = valIndex !== -1 ? `Found at index ${valIndex}` : "nullptr (Not Found)";
  }
  
  // --- Linked List specific operations ---
  else if (operation.startsWith("insertAtHead")) {
    next.unshift(value);
    returnValue = "Void (Node Inserted)";
  } else if (operation.startsWith("insertAtTail")) {
    next.push(value);
    returnValue = "Void (Node Inserted)";
  } else if (operation.startsWith("deleteHead")) {
    if (next.length > 0) {
      const popped = next.shift();
      returnValue = `Deleted Head: ${popped}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  } else if (operation.startsWith("deleteTail")) {
    if (next.length > 0) {
      const popped = next.pop();
      returnValue = `Deleted Tail: ${popped}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  } else if (operation.startsWith("deleteNode")) {
    const valIndex = next.indexOf(value);
    if (valIndex !== -1) {
      next.splice(valIndex, 1);
      returnValue = `Void (Deleted Node with value ${value})`;
    } else {
      returnValue = "Value not found in list";
    }
  } else if (operation.startsWith("reverse")) {
    next.reverse();
    returnValue = "Void (List Reversed)";
  }
  
  // --- Stack specific operations ---
  else if (operation.startsWith("push") && !operation.includes("back") && !operation.includes("front") && !operation.includes("at")) {
    next.push(value);
    returnValue = `Pushed ${value}`;
  } else if (operation.startsWith("pop") && !operation.includes("back") && !operation.includes("front") && !operation.includes("at")) {
    if (next.length > 0) {
      const popped = next.pop();
      returnValue = `Popped ${popped}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  }
  
  // --- Queue specific operations ---
  else if (operation.startsWith("enqueue") || (operation.startsWith("push") && operation.includes("back"))) {
    next.push(value);
    returnValue = `Enqueued ${value}`;
  } else if (operation.startsWith("dequeue") || (operation.startsWith("pop") && operation.includes("front"))) {
    if (next.length > 0) {
      const popped = next.shift();
      returnValue = `Dequeued ${popped}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  }
  
  // --- Hashing specific operations ---
  else if (operation.startsWith("freq[key]++") || operation.startsWith("insert(key)")) {
    next.push(value);
    returnValue = `Incremented frequency of '${value}'`;
  } else if (operation.startsWith("erase(key)")) {
    const valIndex = next.indexOf(value);
    if (valIndex !== -1) {
      next.splice(valIndex, 1);
      returnValue = `Erased key '${value}'`;
    } else {
      returnValue = `Key '${value}' not found`;
    }
  }

  // --- String specific operations ---
  else if (operation.startsWith("toUpperCase")) {
    if (next[safeIndex] !== undefined) {
      const old = next[safeIndex];
      next[safeIndex] = String(next[safeIndex]).toUpperCase();
      returnValue = `Converted '${old}' to uppercase`;
    }
  } else if (operation.startsWith("toLowerCase")) {
    if (next[safeIndex] !== undefined) {
      const old = next[safeIndex];
      next[safeIndex] = String(next[safeIndex]).toLowerCase();
      returnValue = `Converted '${old}' to lowercase`;
    }
  }

  // --- General array / vector operations ---
  else if (operation.startsWith("push_back") || operation === "Push") {
    next.push(value);
    returnValue = `Pushed ${value}`;
  } else if (operation.startsWith("pop_back") || operation === "Pop") {
    if (next.length > 0) {
      const popped = next.pop();
      returnValue = `Popped ${popped}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  } else if (operation.startsWith("insert") || operation === "Insert") {
    next.splice(normalizedIndex, 0, value);
    returnValue = `Inserted ${value} at index ${normalizedIndex}`;
  } else if (operation.startsWith("erase") || operation === "Erase") {
    if (next.length > 0) {
      const popped = next.splice(safeIndex, 1)[0];
      returnValue = `Erased ${popped} at index ${safeIndex}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  }

  // Keep binary search arrays sorted
  const isNumeric = next.every(x => !Number.isNaN(Number(x)));
  const wasSorted = [...array].every((x, i, arr) => i === 0 || Number(x) >= Number(arr[i-1]));
  if (isNumeric && wasSorted && next.length > 1) {
    next.sort((a, b) => Number(a) - Number(b));
  }

  return { next, returnValue };
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
  const [returnValue, setReturnValue] = useState(null);

  const preview = useMemo(() => {
    const parsedValue = isStringArray ? String(value) : (Number.isNaN(Number(value)) ? value : Number(value));
    return applyOperation(before, operation, parsedValue, Number(index));
  }, [before, index, operation, value, isStringArray]);

  function runVisualization() {
    setAfter(preview.next);
    setBefore(preview.next);
    setReturnValue(preview.returnValue);
  }

  // Reset return value when inputs change
  useEffect(() => {
    setReturnValue(null);
  }, [operation, value, index]);

  // Determine if index input is needed for selected operation
  const needsIndex = useMemo(() => {
    const op = operation.toLowerCase();
    return op.includes("index") || op.includes("insert") || op.includes("erase") || op.includes("middle");
  }, [operation]);

  // Determine if value input is needed for selected operation
  const needsValue = useMemo(() => {
    const op = operation.toLowerCase();
    return op.includes("value") || op.includes("push") || op.includes("insert") || op.includes("val") || op.includes("key") || op.includes("char");
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
                  maxLength={isStringArray ? 10 : undefined}
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
          {returnValue !== null && (
            <Motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-md border border-[#f46717]/20 bg-[#f46717]/5 p-3 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f46717]/70">Operation Output</p>
              <p className="mt-1 font-mono text-sm font-bold text-white/90">{returnValue}</p>
            </Motion.div>
          )}
        </div>
      </div>
    </SectionFrame>
  );
}

export default VisualizationSection;
