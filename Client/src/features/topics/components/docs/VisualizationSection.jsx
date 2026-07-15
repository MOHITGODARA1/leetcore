import { useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import SectionFrame from "./SectionFrame";

function applyOperation(array, operation, value, index) {
  const isStringArray = array.some(x => typeof x === "string");
  let next = isStringArray ? [...array].map(x => String(x)) : [...array];

  const normalizedIndex = Number.isNaN(index) ? 0 : Math.max(0, Math.min(index, next.length));
  const safeIndex = Math.min(normalizedIndex, Math.max(next.length - 1, 0));
  let returnValue = null;
  // Tracks which index in the *resulting* array should be highlighted, and why,
  // so the UI can draw the user's eye to what actually changed.
  let changedIndex = null;
  let changeType = null; // "add" | "update" | "found"

  // --- Query / Non-mutating operations ---
  if (operation.startsWith("top")) {
    returnValue = next.length > 0 ? String(next[next.length - 1]) : "Underflow / Empty";
  } else if (operation.startsWith("front")) {
    returnValue = next.length > 0 ? String(next[0]) : "Underflow / Empty";
  } else if (operation.startsWith("back") && !operation.startsWith("push_back") && !operation.startsWith("pop_back")) {
    returnValue = next.length > 0 ? String(next[next.length - 1]) : "Underflow / Empty";
  } else if (operation.includes("empty")) {
    returnValue = next.length === 0 ? "true" : "false";
  } else if (operation.includes("size") || operation.includes("length")) {
    returnValue = String(next.length);
  } else if (operation.startsWith("search")) {
    const valIndex = next.indexOf(value);
    if (valIndex !== -1) {
      returnValue = `Found at index ${valIndex}`;
      changedIndex = valIndex;
      changeType = "found";
    } else {
      returnValue = "nullptr (Not Found)";
    }
  }

  // --- Linked List specific operations ---
  else if (operation.startsWith("insertAtHead")) {
    next.unshift(value);
    returnValue = "Void (Node Inserted)";
    changedIndex = 0;
    changeType = "add";
  } else if (operation.startsWith("insertAtTail")) {
    next.push(value);
    returnValue = "Void (Node Inserted)";
    changedIndex = next.length - 1;
    changeType = "add";
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
    changedIndex = next.length - 1;
    changeType = "add";
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
    changedIndex = next.length - 1;
    changeType = "add";
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
    changedIndex = next.length - 1;
    changeType = "add";
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
  else if (operation.includes("toupper") || operation.startsWith("toUpperCase")) {
    if (next[safeIndex] !== undefined) {
      const old = next[safeIndex];
      next[safeIndex] = String(next[safeIndex]).toUpperCase();
      returnValue = `s[${safeIndex}] = toupper('${old}')`;
      changedIndex = safeIndex;
      changeType = "update";
    }
  } else if (operation.includes("tolower") || operation.startsWith("toLowerCase")) {
    if (next[safeIndex] !== undefined) {
      const old = next[safeIndex];
      next[safeIndex] = String(next[safeIndex]).toLowerCase();
      returnValue = `s[${safeIndex}] = tolower('${old}')`;
      changedIndex = safeIndex;
      changeType = "update";
    }
  }

  // --- General array / vector operations ---
  else if (operation.includes("push_back") || operation === "Push") {
    next.push(value);
    returnValue = isStringArray ? `s.push_back('${value}')` : `vec.push_back(${value})`;
    changedIndex = next.length - 1;
    changeType = "add";
  } else if (operation.includes("pop_back") || operation === "Pop") {
    if (next.length > 0) {
      const popped = next.pop();
      returnValue = isStringArray ? `s.pop_back() -> '${popped}'` : `vec.pop_back() -> ${popped}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  } else if (operation.includes("insert") || operation === "Insert") {
    next.splice(normalizedIndex, 0, value);
    returnValue = isStringArray
      ? `s.insert(${normalizedIndex}, 1, '${value}')`
      : `vec.insert(vec.begin() + ${normalizedIndex}, ${value})`;
    changedIndex = normalizedIndex;
    changeType = "add";
  } else if (operation.includes("erase") || operation === "Erase") {
    if (next.length > 0) {
      const popped = next.splice(safeIndex, 1)[0];
      returnValue = isStringArray
        ? `s.erase(${safeIndex}, 1) -> '${popped}'`
        : `vec.erase(vec.begin() + ${safeIndex}) -> ${popped}`;
    } else {
      returnValue = "Underflow / Empty";
    }
  }

  // Keep binary search arrays sorted
  const isNumeric = next.every(x => !Number.isNaN(Number(x)));
  const wasSorted = [...array].every((x, i, arr) => i === 0 || Number(x) >= Number(arr[i - 1]));
  if (isNumeric && wasSorted && next.length > 1) {
    next.sort((a, b) => Number(a) - Number(b));
    // Sorting can move the changed element, so re-locate it by value rather than
    // trusting the pre-sort index.
    if (changedIndex !== null && changeType !== "found") {
      const movedIndex = next.indexOf(String(value));
      if (movedIndex !== -1) changedIndex = movedIndex;
    }
  }

  return { next, returnValue, changedIndex, changeType };
}

const HIGHLIGHT_STYLES = {
  add: "ring-2 ring-emerald-400/80 bg-emerald-400/10",
  update: "ring-2 ring-sky-400/80 bg-sky-400/10",
  found: "ring-2 ring-amber-400/80 bg-amber-400/10",
};

function ArrayRow({ label, values, indexLabel, valueLabel, highlight }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/22 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/44">{label}</p>

      <div className="grid grid-cols-[64px_1fr] gap-4 items-center">
        {/* Left Labels */}
        <div className="flex flex-col gap-[30px] text-[10px] font-bold uppercase tracking-wider text-white/33 select-none">
          <span>{indexLabel}</span>
          <span>{valueLabel}</span>
        </div>

        {/* Right Scrollable Values */}
        <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="flex gap-2 min-w-max pb-1">
            {values.map((value, index) => {
              const isHighlighted = highlight && highlight.index === index;
              return (
                <div key={`${value}-${index}`} className="flex flex-col items-center gap-2 w-12 flex-shrink-0">
                  <span className="font-mono text-white/48 text-[10px]">{index}</span>
                  <Motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.82 }}
                    className={`flex h-12 w-full items-center justify-center rounded-md border font-mono text-sm font-semibold text-white/90 transition-colors duration-700 ${
                      isHighlighted
                        ? `border-transparent ${HIGHLIGHT_STYLES[highlight.type] || ""}`
                        : "border-white/15 bg-[#111113]"
                    }`}
                  >
                    {value}
                  </Motion.div>
                </div>
              );
            })}
            {values.length === 0 && (
              <div className="flex items-center justify-center h-16 w-full text-white/30 text-xs italic">
                Empty
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualizationSection({ section }) {
  const initialArray = useMemo(
    () => section.initialArray || [10, 20, 30, 40, 50],
    [section.initialArray]
  );
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
  const [value, setValue] = useState(isStringArray ? "A" : "60");
  const [index, setIndex] = useState("2");
  const [returnValue, setReturnValue] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const highlightTimeout = useRef(null);

  useEffect(() => () => clearTimeout(highlightTimeout.current), []);

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

  const isDeletionOp = useMemo(() => /pop|dequeue|delete|erase/i.test(operation), [operation]);

  // The valid index range depends on whether we're inserting (can target the
  // one-past-the-end slot) or accessing/removing an existing element.
  const maxIndex = needsIndex
    ? (operation.toLowerCase().includes("insert") ? before.length : Math.max(before.length - 1, 0))
    : 0;

  const trimmedValue = String(value).trim();
  const parsedIndex = Number(index);

  let disabledReason = null;
  if (isDeletionOp && before.length === 0) {
    disabledReason = "Array is empty — nothing to remove";
  } else if (needsValue && trimmedValue === "") {
    disabledReason = `Enter ${controls.valueLabel.toLowerCase()} to continue`;
  } else if (needsIndex && (index === "" || Number.isNaN(parsedIndex))) {
    disabledReason = `Enter ${controls.indexLabel.toLowerCase()} to continue`;
  } else if (needsIndex && (parsedIndex < 0 || parsedIndex > maxIndex)) {
    disabledReason = `Index must be between 0 and ${maxIndex}`;
  }

  const canRun = disabledReason === null;

  const preview = useMemo(() => {
    if (!canRun) return null;
    const parsedValue = isStringArray ? trimmedValue : (Number.isNaN(Number(trimmedValue)) ? trimmedValue : Number(trimmedValue));
    return applyOperation(before, operation, parsedValue, parsedIndex);
  }, [before, parsedIndex, operation, trimmedValue, isStringArray, canRun]);

  function runVisualization() {
    if (!canRun || !preview) return;
    setAfter(preview.next);
    setBefore(preview.next);
    setReturnValue(preview.returnValue);

    clearTimeout(highlightTimeout.current);
    if (preview.changedIndex !== null) {
      setHighlight({ index: preview.changedIndex, type: preview.changeType });
      highlightTimeout.current = setTimeout(() => setHighlight(null), 1600);
    } else {
      setHighlight(null);
    }
  }

  function resetVisualization() {
    clearTimeout(highlightTimeout.current);
    setBefore(initialArray);
    setAfter(initialArray);
    setReturnValue(null);
    setHighlight(null);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") runVisualization();
  }

  const hasRunOnce = returnValue !== null;

  return (
    <SectionFrame section={section}>
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <ArrayRow label={labels.before} values={before} indexLabel={labels.index} valueLabel={labels.value} />
          <ArrayRow
            label={labels.after}
            values={after}
            indexLabel={labels.index}
            valueLabel={labels.value}
            highlight={highlight}
          />
        </div>
        <div className="rounded-lg border border-white/10 bg-black/24 p-4">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">
            {controls.operationLabel}
            <select
              value={operation}
              onChange={(event) => {
                setOperation(event.target.value);
                setReturnValue(null);
                setHighlight(null);
              }}
              className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm normal-case text-white focus:border-[#f46717]/60 focus:outline-none"
            >
              {operations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {needsValue ? (
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">
                {controls.valueLabel}
                <input
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    setReturnValue(null);
                  }}
                  onKeyDown={handleKeyDown}
                  type={isStringArray ? "text" : "number"}
                  maxLength={isStringArray ? 10 : undefined}
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm normal-case text-white focus:border-[#f46717]/60 focus:outline-none"
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
                  onChange={(event) => {
                    setIndex(event.target.value);
                    setReturnValue(null);
                  }}
                  onKeyDown={handleKeyDown}
                  type="number"
                  min={0}
                  max={maxIndex}
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm normal-case text-white focus:border-[#f46717]/60 focus:outline-none"
                />
                <span className="mt-1 block text-[10px] font-normal normal-case tracking-normal text-white/30">
                  Valid range: 0–{maxIndex}
                </span>
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
            disabled={!canRun}
            title={disabledReason || undefined}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition ${
              canRun
                ? "bg-[#f46717] hover:bg-[#ff7a2b] cursor-pointer"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            <Play size={16} />
            {controls.buttonLabel}
          </button>

          {!canRun && disabledReason && (
            <p className="mt-2 text-center text-[11px] text-white/40">{disabledReason}</p>
          )}

          {hasRunOnce && (
            <button
              type="button"
              onClick={resetVisualization}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-white/25 hover:text-white/80"
            >
              <RotateCcw size={13} />
              Reset to initial state
            </button>
          )}

          {returnValue !== null && (
            <Motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              aria-live="polite"
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