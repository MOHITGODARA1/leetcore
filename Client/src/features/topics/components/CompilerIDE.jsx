import { useMemo, useState, useRef, useEffect } from "react";
import {
  Copy,
  Trash2,
  Play,
  Send,
  Loader2,
  TerminalSquare
} from "lucide-react";
import Editor from "@monaco-editor/react";

function CompilerIDE({
  language,
  onLanguageChange,
  note,
  onNoteChange,
  onClearAnswer,
  onCopyAnswer,
  answerStatus,
  runStatus,
  submitStatus,
  testResults,
  compileError,
  customInput,
  onCustomInputChange,
  customResult,
  activeTab,
  onTabChange,
  runningSolution,
  submittingSolution,
  needsGithubReconnect,
  onReconnectGithub,
  onRunSolution,
  onSubmitSolution,
  question
}) {
  const ideContainerRef = useRef(null);
  const [consoleHeight, setConsoleHeight] = useState(240); // Default height in pixels
  const [isResizing, setIsResizing] = useState(false);

  const answerStats = useMemo(() => {
    const trimmed = note.trim();
    return {
      characters: note.length,
      lines: note ? note.split("\n").length : 0,
      words: trimmed ? trimmed.split(/\s+/).length : 0
    };
  }, [note]);

  const testStats = useMemo(() => {
    if (!testResults || testResults.length === 0) return null;
    const visibleResults = testResults.slice(0, 3);
    const hiddenResults = testResults.slice(3);

    const totalVisible = visibleResults.length;
    const passedVisible = visibleResults.filter(r => r.passed).length;
    const totalHidden = hiddenResults.length;
    const passedHidden = hiddenResults.filter(r => r.passed).length;

    const allPassed = testResults.every(r => r.passed);
    const someFailed = testResults.some(r => !r.passed);

    return {
      visibleResults,
      hiddenResults,
      totalVisible,
      passedVisible,
      totalHidden,
      passedHidden,
      allPassed,
      someFailed
    };
  }, [testResults]);

  // Resizing mouse/drag listeners
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !ideContainerRef.current) return;
      
      const containerRect = ideContainerRef.current.getBoundingClientRect();
      // Console height is the container bottom position minus cursor Y
      let newHeight = containerRect.bottom - e.clientY;
      
      // Enforce 10% min height and 90% max height of the overall IDE container
      const minHeight = containerRect.height * 0.1;
      const maxHeight = containerRect.height * 0.9;
      
      if (newHeight < minHeight) newHeight = minHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;
      
      setConsoleHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <div 
      ref={ideContainerRef}
      className="flex-1 w-full flex flex-col h-full bg-[#0d0d11]/90 border border-white/10 rounded-2xl overflow-hidden min-h-[550px]"
    >
      {/* IDE Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#131318]/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <TerminalSquare size={16} className="text-orange-400" />
          <span className="text-sm font-bold text-white">Editor</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="ml-3 rounded border border-white/10 bg-[#16161a] px-2 py-1 text-xs font-bold text-white outline-none cursor-pointer focus:border-orange-500/50"
          >
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {answerStatus && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full select-none transition-all duration-300 animate-in fade-in slide-in-from-right-1">
              {answerStatus}
            </span>
          )}
          <button
            type="button"
            onClick={onCopyAnswer}
            className="p-1.5 hover:bg-white/5 rounded text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Copy Code"
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={onClearAnswer}
            className="p-1.5 hover:bg-red-500/10 rounded text-white/60 hover:text-red-400 transition-colors cursor-pointer"
            title="Reset Code to Template"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 bg-[#0c0c0f] overflow-hidden relative border-b border-white/5 min-h-0">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : "javascript"}
          theme="vs-dark"
          value={note}
          onChange={(val) => onNoteChange(val || "")}
          options={{
            fontSize: 13,
            fontFamily: "var(--font-mono, monospace)",
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            lineNumbersMinChars: 3,
            folding: true,
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6
            },
            theme: "vs-dark",
            tabSize: 4,
            insertSpaces: true
          }}
        />
      </div>

      {/* Resizable Divider Handle */}
      <div
        onMouseDown={startResizing}
        className={`h-2 cursor-row-resize relative z-30 transition-all duration-150 flex items-center justify-center border-t border-b border-white/10 ${
          isResizing ? "bg-orange-500/35" : "bg-white/5 hover:bg-orange-500/20"
        }`}
        title="Drag up or down to resize output panel"
      >
        <div className={`w-8 h-1 rounded transition-colors ${isResizing ? "bg-orange-400" : "bg-white/20"}`} />
      </div>

      {/* Compiler Console / Tabbed Output Pane */}
      <div 
        style={{ height: `${consoleHeight}px` }} 
        className="flex flex-col bg-[#0d0d12] flex-shrink-0 min-h-0 relative z-10"
      >
        {/* Tab Headers */}
        <div className="flex border-b border-white/5 px-2 bg-[#0a0a0d] flex-shrink-0">
          <button
            type="button"
            onClick={() => onTabChange("testcases")}
            className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "testcases"
                ? "border-b border-orange-500 text-orange-400"
                : "text-white/45 hover:text-white/80"
            }`}
          >
            Test Cases
          </button>
          <button
            type="button"
            onClick={() => onTabChange("customInput")}
            className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "customInput"
                ? "border-b border-orange-500 text-orange-400"
                : "text-white/45 hover:text-white/80"
            }`}
          >
            Custom Input
          </button>
          <button
            type="button"
            onClick={() => onTabChange("results")}
            className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "results"
                ? "border-b border-orange-500 text-orange-400"
                : "text-white/45 hover:text-white/80"
            }`}
          >
            Test Results
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="p-4 flex-1 overflow-y-auto bg-[#0d0d12]">
          {activeTab === "testcases" && (
            <div className="flex flex-col gap-3">
              {(question?.testCases || []).slice(0, 3).map((tc, index) => (
                <div
                  key={index}
                  className="rounded border border-white/5 bg-white/[0.01] p-3 text-[11px] font-mono leading-relaxed"
                >
                  <p className="font-semibold text-white/80">Case {index + 1}:</p>
                  <p className="mt-1 text-white/60">
                    <span className="text-white/40">Input:</span> {tc.input}
                  </p>
                  <p className="mt-0.5 text-white/60">
                    <span className="text-white/40">Output:</span> {tc.output}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "customInput" && (
            <div className="flex flex-col gap-2 h-full">
              <label htmlFor="custom-input-box" className="text-[10px] uppercase font-black tracking-wider text-white/40">
                Provide custom stdin:
              </label>
              <textarea
                id="custom-input-box"
                value={customInput}
                onChange={(e) => onCustomInputChange(e.target.value)}
                placeholder={
                  language === "cpp"
                    ? "Example (Two Sum):\n4\n2 7 11 15\n9"
                    : "Enter custom inputs"
                }
                className="w-full h-full min-h-[80px] rounded border border-white/10 bg-[#16161a] p-2 text-white outline-none focus:border-orange-500/50 resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          )}

          {activeTab === "results" && (
            <div className="flex flex-col gap-2.5">
              {runningSolution || submittingSolution ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2.5">
                  <Loader2 size={24} className="animate-spin text-orange-500" />
                </div>
              ) : (
                <>
                  {testResults.length === 0 && !customResult && !runStatus && (
                    <p className="text-white/40 italic text-xs">Run your code to execute tests and view results here.</p>
                  )}

                  {/* {runStatus && (
                    <p
                      className={`font-bold mb-1 text-[11px] ${
                        compileError || (testStats && testStats.someFailed) || (customResult && !customResult.passed)
                          ? "text-red-400"
                          : (testStats && testStats.allPassed) || (customResult && customResult.passed)
                            ? "text-emerald-400"
                            : "text-white/70"
                      }`}
                    >
                      {testStats
                        ? testStats.allPassed
                          ? `All test cases passed! (Visible: ${testStats.passedVisible}/${testStats.totalVisible}, Hidden: ${testStats.passedHidden}/${testStats.totalHidden})`
                          : `Failed on test cases. (Visible: ${testStats.passedVisible}/${testStats.totalVisible}, Hidden: ${testStats.passedHidden}/${testStats.totalHidden} passed)`
                        : runStatus}
                    </p>
                  )} */}

                  {/* Visible Test Case Results (Max 3) */}
                  {testStats && testStats.visibleResults.length > 0 && (
                    <div className="grid gap-2">
                      {testStats.visibleResults.map((res) => (
                        <div
                          key={res.index}
                          className={`rounded  p-2.5 ${
                            res.passed
                              ? " text-emerald-400"
                              : " text-red-400"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-[11px]">
                            <span>Case {res.index}</span>
                            <span>{res.passed ? "Passed" : "Failed"}</span>
                          </div>
                          <div className="mt-1.5 grid gap-0.5 text-white/60">
                            <p><span className="font-semibold text-white/80">Input:</span> {res.input}</p>
                            <p><span className="font-semibold text-white/80">Expected:</span> {res.expected}</p>
                            <p><span className="font-semibold text-white/80">Actual:</span> {res.actual}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hidden Test Case Summary Panel */}
                  {testStats && testStats.totalHidden > 0 && (
                    <div
                      className={`rounded-xl  p-3 flex items-center justify-between text-xs font-semibold ${
                        testStats.passedHidden === testStats.totalHidden
                          ? " text-emerald-400"
                          : " text-red-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          testStats.passedHidden === testStats.totalHidden ? "bg-emerald-400" : "bg-red-400"
                        }`} />
                        <span>Hidden Test Cases</span>
                      </div>
                      <span className="font-mono  px-2.5 py-0.5 rounded  ">
                        {testStats.passedHidden} / {testStats.totalHidden} Passed
                      </span>
                    </div>
                  )}

                  {/* C++ / JS Compile Error */}
                  {compileError && (
                    <div className="rounded  p-3 text-red-400 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                      {compileError}
                    </div>
                  )}

                  {/* Custom Run Result */}
                  {customResult && (
                    <div className={`rounded border p-2.5 ${
                      customResult.passed ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-100" : "border-red-500/20 bg-red-500/5 text-red-100"
                    }`}>
                      <p className="font-bold text-[11px] mb-1.5">Custom Execution Output:</p>
                      {customResult.stdout && (
                        <div className="mb-2">
                          <p className="font-semibold text-white/80 text-[10px] uppercase">stdout:</p>
                          <pre className="bg-black/30 p-2 rounded text-white/80 text-[11px] mt-1 overflow-x-auto">{customResult.stdout}</pre>
                        </div>
                      )}
                      {customResult.stderr && (
                        <div>
                          <p className="font-semibold text-red-400 text-[10px] uppercase">stderr / compiler logs:</p>
                          <pre className="bg-red-950/10 p-2 rounded text-red-300 text-[11px] mt-1 overflow-x-auto">{customResult.stderr}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#121217]/90 p-3.5 flex-wrap gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs">
            {runningSolution || submittingSolution ? (
              <Loader2 size={16} className="animate-spin text-orange-500" />
            ) : (
              <>
                <span
                  className={
                    needsGithubReconnect
                      ? "text-amber-400 font-bold"
                      : compileError || (testStats && testStats.someFailed) || (customResult && !customResult.passed)
                        ? "text-red-400 font-bold"
                        : (testStats && testStats.allPassed) || (customResult && customResult.passed)
                          ? "text-emerald-400 font-bold"
                          : submitStatus || runStatus || answerStatus
                            ? "text-white/60 font-semibold"
                            : "text-white/40"
                  }
                >
                  {needsGithubReconnect
                    ? "GitHub Reconnect Needed"
                    : testStats
                      ? testStats.allPassed
                        ? `All test cases passed! (${testStats.passedVisible}/${testStats.totalVisible} visible, ${testStats.passedHidden}/${testStats.totalHidden} hidden)`
                        : `Failed execution. (${testStats.passedVisible}/${testStats.totalVisible} visible, ${testStats.passedHidden}/${testStats.totalHidden} hidden passed)`
                      : submitStatus || runStatus || answerStatus || "Ready"}
                </span>
              </>
            )}
            {needsGithubReconnect && (
              <button
                type="button"
                onClick={onReconnectGithub}
                className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-bold text-amber-100 hover:bg-amber-400/20 transition-colors cursor-pointer"
              >
                Reconnect GitHub
              </button>
            )}
            <span className="text-white/30 ml-2 font-medium">
              ({answerStats.words} words · {answerStats.lines} lines)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRunSolution}
              disabled={runningSolution || submittingSolution || !note.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/25 bg-green-500 font-bold px-4 py-2 text-sm  text-white  disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 transition-colors cursor-pointer"
            >
              {runningSolution ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              Run Tests
            </button>
            <button
              type="button"
              onClick={needsGithubReconnect ? onReconnectGithub : onSubmitSolution}
              disabled={submittingSolution || runningSolution || (!needsGithubReconnect && !note.trim())}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 transition-colors cursor-pointer"
            >
              {submittingSolution ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Send size={12} />
              )}
              {needsGithubReconnect ? "Reconnect GitHub" : "Commit to GitHub"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompilerIDE;
