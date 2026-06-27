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
  Tag
} from "lucide-react";

function ProblemDescription({
  topicName,
  question,
  difficultyColor,
  details,
  nextQuestions,
  formatPattern
}) {
  return (
    <div className="flex-1 w-full flex flex-col gap-6 overflow-y-auto pr-3 h-full pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <Link
          to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to {topicName} Practice
        </Link>
      </div>

      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-xs text-white/45 font-semibold">
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
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            {question?.problemNumber ? `${question.problemNumber}. ` : ""}
            {question?.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full font-bold border ${difficultyColor}`}>
              {question?.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 text-white/55">
              <Clock size={12} />
              {question?.estimatedTime}
            </span>
            {question?.platform && (
              <span className="inline-flex items-center gap-1 text-white/55">
                <ExternalLink size={12} />
                {question.platform}
              </span>
            )}
            {question?.solved && (
              <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
                <CheckCircle2 size={12} />
                Solved
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
            {question?.acceptanceRate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                <BarChart3 size={12} />
                {question.acceptanceRate} acceptance
              </span>
            )}
            {typeof question?.likes === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                <ThumbsUp size={12} />
                {question.likes.toLocaleString()} likes
              </span>
            )}
            {typeof question?.dislikes === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                <ThumbsDown size={12} />
                {question.dislikes.toLocaleString()} dislikes
              </span>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-wide text-white/45">
            Asked by {question?.companies?.length || 0} Companies
          </h2>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {(question?.companies || []).map((company) => (
              <span key={company} className="px-2.5 py-1 rounded-full bg-[#29292f] text-xs font-semibold text-white/80">
                {company}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-wide text-white/45">Topics</h2>
          <div className="mt-2.5 flex flex-wrap gap-4 text-xs font-semibold text-white/80">
            {(question?.tags?.length ? question.tags : [topicName, formatPattern(question?.pattern)]).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1">
                <Tag size={12} className="text-white/35" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 pt-6">
        <p className="text-sm md:text-base leading-7 text-white/90 whitespace-pre-wrap">{details.description}</p>
      </section>

      <section className="flex flex-col gap-6">
        {details.examples.map((example, index) => (
          <div key={index}>
            <h2 className="text-lg font-black text-white">Example {index + 1}:</h2>
            <div className="mt-3 rounded-lg bg-[#28282e]/50 border border-white/5 p-4 text-sm leading-6 text-white/80">
              <p>
                <span className="font-black text-white">Input:</span> {example.input}
              </p>
              <p>
                <span className="font-black text-white">Output:</span> {example.output}
              </p>
              {example.explanation && (
                <p className="mt-1">
                  <span className="font-black text-white">Explanation:</span> {example.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-black text-white">Constraints:</h2>
        <ul className="mt-3 flex flex-col gap-2 pl-5 text-sm text-white/80 list-disc marker:text-slate-500">
          {details.constraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-2.5 md:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-black/10 px-4 py-3 text-sm text-white/70">
          <span className="font-black text-white">Expected Time:</span>{" "}
          {details.expectedTimeComplexity}
        </div>
        <div className="rounded-xl border border-white/5 bg-black/10 px-4 py-3 text-sm text-white/70">
          <span className="font-black text-white">Expected Space:</span>{" "}
          {details.expectedSpaceComplexity}
        </div>
      </section>

      {question?.followUp?.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-white">Follow-up</h2>
          <div className="mt-3 flex flex-col gap-2">
            {question.followUp.map((item) => (
              <p key={item} className="rounded-xl border border-white/5 bg-black/10 px-4 py-3 text-sm text-white/75">
                {item}
              </p>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-black text-white">Hints</h2>
        <div className="mt-3 flex flex-col gap-2">
          {details.hints.map((hint, index) => (
            <details key={hint} className="group rounded-xl border border-white/5 bg-black/10">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-white/85 flex items-center justify-between">
                <span>Hint {index + 1}</span>
                <span className="text-white/40 group-open:rotate-180 transition-transform">&darr;</span>
              </summary>
              <p className="border-t border-white/5 px-4 py-3 text-xs leading-6 text-white/65">
                {hint}
              </p>
            </details>
          ))}
        </div>
      </section>

      {question?.youtubeVideos?.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-white">Videos</h2>
          <div className="mt-3 grid gap-2.5 md:grid-cols-2">
            {question.youtubeVideos.map((video) => (
              <a
                key={video.url}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white/75 hover:border-orange-500/20 hover:text-white transition-colors"
              >
                <span className="font-bold truncate">{video.title}</span>
                <ExternalLink size={14} className="text-orange-400 flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}

      {question?.relatedProblems?.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-white">Related Problems</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {question.relatedProblems.map((item) => (
              <span key={item} className="rounded-full bg-[#29292f] px-2.5 py-1 text-xs font-semibold text-white/80">
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {nextQuestions.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-white">Next Questions</h2>
          <div className="mt-3 grid gap-2.5 md:grid-cols-2">
            {nextQuestions.map((item) => (
              <Link
                key={item._id}
                to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}/problem/${encodeURIComponent(item._id)}`}
                className="rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:border-orange-500/20 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/40">{item.difficulty}</p>
                    <h3 className="mt-0.5 font-bold text-sm text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-white/45">{formatPattern(item.pattern)}</p>
                  </div>
                  <ArrowRight size={16} className="text-orange-400 flex-shrink-0" />
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
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-white/10 text-black text-xs font-black hover:bg-white/95 transition-all"
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
