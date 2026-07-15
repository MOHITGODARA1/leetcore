import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  ThumbsDown,
  ThumbsUp,
  Tag,
  Lightbulb,
  Cpu,
  ChevronDown,
  AlertCircle,
  BookOpen,
  Play
} from "lucide-react";

// Utility to format code terms, action verbs, and constraints in the description text
const highlightKeywords = (text) => {
  if (!text) return "";

  // 1. Code terms (original regex pattern, escapes cleaned for dynamic RegExp construction)
  const codeRegexStr = "\\b(?:[a-zA-Z_][a-zA-Z0-9_]*\\[[a-zA-Z0-9_i\\-\\+\\s]+\\](?:\\[[a-zA-Z0-9_i\\-\\+\\s]+\\])?|[a-zA-Z_][a-zA-Z0-9_]*\\.(?:length|size(?:\\(\\))?)|O\\([a-zA-Z0-9_ \\+\\*\\^/\\(\\)]+\\)|[a-zA-Z_][a-zA-Z0-9_]*\\s*(?:<=|>=|<|>|==|!=)\\s*[a-zA-Z0-9_]+|mid\\s*=\\s*left\\s*\\+\\s*\\(right\\s*-\\s*left\\)\\s*\\/\\s*2|\\(left\\s*\\+\\s*right\\)\\s*\\/\\s*2)\\b|\\b(?:nums|target|prices|left|right|mid|low|high|sum|val|head|root|grid|matrix|k|n|m|i|j|true|false|null|nullptr|path|res|subset|candidates|board|word|state|graph|visited|adj|dist|cost|edges|dp|memo|capacity|weight|value)\\b|(?<!\\w)-1\\b";

  // 2. Main action verbs
  const actionRegexStr = "\\b(?:Find|Return|Calculate|Determine|Check|Sort|Search|Move|Build|Add|Shift|Pick|Count|Given|Solve)\\b";

  // 3. Highlighted constraints & terms
  const termsRegexStr = "\\b(?:without using division|in-place|without using extra space|single pass|faster than checking every element|O\\(log n\\) time|O\\(n\\) time|O\\(1\\) extra space|optimal complexity|sorted|unsorted|increasing order|rotated|exactly one|same element twice|only one|cannot|always)\\b";

  // Enclose the union inside a single capture group
  const regex = new RegExp(`(${codeRegexStr}|${actionRegexStr}|${termsRegexStr})`, "gi");

  const parts = text.split(regex);

  // Helper check regexes
  const isCode = new RegExp(`^(?:${codeRegexStr})$`, "i");
  const isAction = new RegExp(`^(?:${actionRegexStr})$`, "i");
  const isTerm = new RegExp(`^(?:${termsRegexStr})$`, "i");

  return parts.map((part, idx) => {
    if (!part) return null;

    if (isCode.test(part)) {
      return (
        <code
          key={idx}
          className="font-mono bg-white/8 px-1.5 py-0.5 rounded font-semibold border border-white/10 mx-0.5 text-xs md:text-sm select-all text-white"
        >
          {part}
        </code>
      );
    }

    if (isAction.test(part) || isTerm.test(part)) {
      return (
        <span
          key={idx}
          className="bg-white/8 px-1.5 py-0.5 rounded font-semibold border border-white/10 mx-0.5 text-xs md:text-sm text-white/95 whitespace-nowrap"
        >
          {part}
        </span>
      );
    }

    return part;
  });
};

// Utility to split the description text by newlines and sentences
const renderFormattedDescription = (description) => {
  if (!description) return null;

  let descText = "";
  if (typeof description === "string") {
    descText = description;
  } else if (Array.isArray(description)) {
    descText = description.join("\n");
  } else if (typeof description === "object") {
    descText = JSON.stringify(description);
  } else {
    descText = String(description);
  }

  const blocks = descText.split("\n");
  const allSentences = [];

  blocks.forEach((block) => {
    const trimmed = block.trim();
    if (!trimmed) return;
    const sentences = trimmed.split(/(?<=[.!?])\s+(?=[A-Z])/);
    allSentences.push(...sentences);
  });

  return (
    <div className="flex flex-col gap-4 select-text">
      {allSentences.map((sentence, idx) => {
        const trimmed = sentence.trim();
        if (!trimmed) return null;
        return (
          <p key={idx} className="text-white text-base md:text-md leading-relaxed tracking-tight font-medium text-white/90">
            {highlightKeywords(trimmed)}
          </p>
        );
      })}
    </div>
  );
};


function ProblemDescription({
  topicName,
  question,
  difficultyColor,
  details,
  nextQuestions,
  formatPattern,
  timeLeft,
  timerStarted,
  onStartTimer
}) {
  return (
    <div className="flex-1 w-full flex flex-col gap-6 overflow-y-auto pr-3 h-full pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <Link
          to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to {topicName} Practice
        </Link>
      </div>

      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-xs text-white/45 font-bold">
          <Link to="/dashboard" className="hover:text-orange-400 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link
            to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
            className="hover:text-orange-400 transition-colors"
          >
            Problems
          </Link>
          <span>/</span>
          <span className="text-white/75">{question?.title}</span>
        </div>

        <div>
          <div className="flex justify-between items-center w-full gap-4">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {question?.problemNumber ? `${question.problemNumber}. ` : ""}
              {question?.title}
            </h1>
            {timeLeft !== undefined && timeLeft > 0 && (
              <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap shadow-[0_0_12px_rgba(16,185,129,0.08)] select-none">
                <Clock size={14} className="text-emerald-400 animate-pulse" />
                <span className="font-mono text-sm md:text-base font-bold text-white/80">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60) < 10 ? "0" : ""}{timeLeft % 60}
                </span>
              </span>
            )}
            {timeLeft === 0 && (
              <span className="flex items-center gap-1.5 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 whitespace-nowrap select-none">
                <AlertCircle size={14} className="text-rose-400" />
                <span className="font-mono text-sm md:text-base font-bold text-rose-400">
                  0:00
                </span>
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full font-bold border ${difficultyColor}`}>
              {question?.difficulty}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/55 font-semibold bg-white/5 px-2.5 py-1 rounded-full">
              <Clock size={12} className="text-orange-400" />
              {question?.estimatedTime}
            </span>
            {question?.solved && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold   px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.08)]">
                <CheckCircle2 size={12} />
                Solved
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
            {question?.acceptanceRate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 font-semibold">
                <BarChart3 size={12} className="text-purple-400" />
                {question.acceptanceRate} acceptance
              </span>
            )}
            {typeof question?.likes === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 font-semibold">
                <ThumbsUp size={12} className="text-emerald-400" />
                {question.likes.toLocaleString()} likes
              </span>
            )}
            {typeof question?.dislikes === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 font-semibold">
                <ThumbsDown size={12} className="text-rose-400" />
                {question.dislikes.toLocaleString()} dislikes
              </span>
            )}
          </div>
        </div>

        {question?.companies?.length > 0 && (
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Asked by Companies
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(question.companies || []).map((company) => (
                <span key={company} className="px-2.5 py-1 rounded-lg border border-white/[0.04] bg-white/5 text-xs font-semibold text-white/80">
                  {company}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Topics</h2>
          <div className="mt-2 flex flex-wrap gap-3.5 text-xs font-semibold text-white/85">
            {(question?.tags?.length ? question.tags : [topicName, formatPattern(question?.pattern)]).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/[0.03] whitespace-nowrap">
                <Tag size={11} className="text-orange-400/80" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Description Panel */}
      <section className="flex flex-col gap-3">
        {/* <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">
          <BookOpen size={13} className="text-orange-400" />
          <span>Problem Statement</span>
        </div> */}
        <div className="relative overflow-hidden rounded-xl   p-2 md:p-3 shadow-xl leading-relaxed ">
          <div className="flex flex-col gap-4 select-text">
            {renderFormattedDescription(details.description)}
          </div>
        </div>
      </section>

      {/* Examples section */}
      <section className="flex flex-col gap-5">
        {details.examples.map((example, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider   text-white px-2 py-0.5 rounded">
                Example {index + 1}
              </span>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/1 p-4 text-xs font-mono leading-relaxed text-white/90 shadow-inner">
              <div className="flex items-baseline gap-2 pb-2 border-b border-white/[0.03]">
                <span className="font-bold text-white/40 select-none text-[10px] uppercase">Input:</span>
                <span className="text-white/80 font-bold break-all">{example.input}</span>
              </div>
              <div className="flex items-baseline gap-2 py-2 border-b border-white/[0.03]">
                <span className="font-bold text-white/40 select-none text-[10px] uppercase">Output:</span>
                <span className="text-white/80 font-bold break-all">{example.output}</span>
              </div>
              {example.explanation && (
                <div className="mt-2.5 pt-2 pl-3 border-l-2 border-orange-400 text-white/70 flex items-start gap-2">
                 
                  <div>
                    <span className="font-bold text-white/80 block text-[10px] uppercase select-none mb-0.5">Explanation:</span>
                    <span className="text-neutral-300 leading-relaxed font-sans text-xs font-medium block whitespace-pre-wrap">{example.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Constraints */}
      <section className="border-t border-white/8 pt-5">
        <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3">Constraints</h2>
        <div className="rounded-xl border border-white/1 bg-white/8 p-4">
          <ul className="flex flex-col gap-2.5 text-xs text-neutral-300 font-semibold font-mono">
            {details.constraints.map((constraint) => (
              <li key={constraint} className="flex items-start gap-2.5">
                
                <span className="leading-normal">{constraint}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Time & Space Complexity */}
      <section className="flex gap-3 md:flex-col">
        <div className="rounded-xl  p-2 text-xs font-semibold text-neutral-400 flex items-center gap-3">
          <Clock size={16} className="text-orange-400 shrink-0" />
          <div>
            <span className="text-[13px] font-black uppercase tracking-wider text-white/40 block mb-0.5">Expected Time Complexity: <span className="text-white/80 font-mono">{details.expectedTimeComplexity}</span></span>
          </div>
        </div>
        <div className="rounded-xl  p-2 text-xs font-semibold text-neutral-400 flex items-center gap-3">
          <Cpu size={16} className="text-blue-400 shrink-0" />
          <div>
            <span className="text-[13px] font-black uppercase tracking-wider text-white/40 block mb-0.5">Expected Space Complexity: <span className="text-white/80 font-mono">{details.expectedSpaceComplexity}</span></span>
            
          </div>
        </div>
      </section>

      {question?.followUp?.length > 0 && (
        <section className="border-t border-white/10 pt-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Follow-up Challenge</h2>
          <div className="flex flex-col gap-2">
            {question.followUp.map((item) => (
              <div key={item} className="rounded-xl border border-white/[0.05] bg-[#0c0c10] p-4 text-xs font-semibold text-neutral-300 leading-relaxed flex items-start gap-2.5">
                <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hints */}
      <section className="border-t border-white/10 pt-5">
        <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Hints</h2>
        <div className="flex flex-col gap-2.5">
          {details.hints.map((hint, index) => (
            <details key={hint} className="group rounded-xl border border-white/1 bg-white/8 overflow-hidden">
              <summary className="cursor-pointer list-none px-4 py-3 text-xs font-bold text-white/80 hover:text-white transition-colors flex items-center justify-between select-none">
                <span>Hint {index + 1}</span>
                <ChevronDown size={14} className="text-white/40 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <div className="border-t border-white/[0.03] bg-white/[0.01] px-4 py-3 text-xs leading-relaxed text-neutral-300 font-medium">
                {hint}
              </div>
            </details>
          ))}
        </div>
      </section>

      {question?.youtubeVideos?.length > 0 && (
        <section className="border-t border-white/1 pt-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Video Solutions</h2>
          <div className="grid gap-2.5 md:grid-cols-2">
            {question.youtubeVideos.map((video) => (
              <a
                key={video.url}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-white/1 bg-white/8 px-4 py-3 text-xs text-neutral-300 transition-all duration-200 font-semibold"
              >
                <span className="truncate text-white/80">{video.title}</span>
                <ExternalLink size={12} className="text-white/80 flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {nextQuestions.length > 0 && (
        <section className="border-t border-white/10 pt-5">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Up Next</h2>
          <div className="grid gap-2.5 md:grid-cols-2">
            {nextQuestions.map((item) => (
              <Link
                key={item._id}
                to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}/problem/${encodeURIComponent(item._id)}`}
                className="rounded-xl border border-white/1 bg-white/8 p-4  transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/80">{item.difficulty}</span>
                    <h3 className="mt-0.5 font-bold text-sm text-white/80  transition-colors">{item.title}</h3>
                    <p className="mt-1 text-[10px] font-semibold text-neutral-400">{formatPattern(item.pattern)}</p>
                  </div>
                  <ArrowRight size={14} className="text-white/80 flex-shrink-0  transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {question?.leetcodeUrl && (
        <div className="flex justify-start pt-4 border-t border-white/5">
          <a
            href={question.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-xs font-black hover:bg-neutral-100 hover:shadow-lg transition-all"
          >
            <ExternalLink size={14} />
            Open in LeetCode
          </a>
        </div>
      )}
    </div>
  );
}

export default ProblemDescription;
