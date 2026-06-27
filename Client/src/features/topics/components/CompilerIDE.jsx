import { useMemo } from "react";
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
  const answerStats = useMemo(() => {
    const trimmed = note.trim();
    return {
      characters: note.length,
      lines: note ? note.split("\n").length : 0,
      words: trimmed ? trimmed.split(/\s+/).length : 0
    };
  }, [note]);

  return (
    <div className="flex-1 w-full flex flex-col h-full bg-[#0d0d11]/90 border border-white/10 rounded-2xl overflow-hidden min-h-[550px]">
      {/* IDE Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#131318]/50">
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
            title="Clear Code"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-[320px] bg-[#0c0c0f] overflow-hidden relative border-b border-white/5">
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
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            },
            theme: "vs-dark",
            tabSize: 4,
            insertSpaces: true
          }}
        />
      </div>

      {/* Compiler Console / Tabbed Output Pane */}
      <div className="border-t border-white/10 bg-[#0d0d12]">
        {/* Tab Headers */}
        <div className="flex border-b border-white/5 px-2 bg-[#0a0a0d]">
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

        {/* Tab Content Panels */}
        <div className="p-4 h-48 overflow-y-auto bg-[#0d0d12]">
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
                className="w-full h-24 rounded border border-white/10 bg-[#16161a] p-2 text-white outline-none focus:border-orange-500/50 resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          )}

          {activeTab === "results" && (
            <div className="flex flex-col gap-2.5">
              {testResults.length === 0 && !customResult && !runStatus && (
                <p className="text-white/40 italic text-xs">Run your code to execute tests and view results here.</p>
              )}

              {runStatus && (
                <p className="text-white/70 font-bold mb-1 text-[11px]">{runStatus}</p>
              )}

              {/* Visible Test Case Results */}
              {testResults.length > 0 && (
                <div className="grid gap-2">
                  {testResults.map((res) => (
                    <div
                      key={res.index}
                      className={`rounded border p-2.5 ${
                        res.passed
                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-100"
                          : "border-red-500/20 bg-red-500/5 text-red-100"
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

              {/* C++ Compile Error */}
              {compileError && (
                <div className="rounded border border-red-500/25 bg-red-500/5 p-3 text-red-100 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
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
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#121217]/90 p-3.5 flex-wrap gap-2.5">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={
                needsGithubReconnect
                  ? "text-amber-400 font-bold"
                  : runStatus && !runStatus.toLowerCase().includes("passed") && !runStatus.toLowerCase().includes("succeeded")
                    ? "text-red-400 font-bold"
                    : submitStatus || runStatus
                      ? "text-emerald-400 font-bold"
                      : "text-white/40"
              }
            >
              {submitStatus || runStatus || answerStatus || "Ready"}
            </span>
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 transition-colors cursor-pointer"
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
