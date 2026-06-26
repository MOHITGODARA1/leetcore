import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  PencilLine,
  Send,
  ThumbsDown,
  ThumbsUp,
  Tag,
  Trash2
} from "lucide-react";
import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import apiClient from "../../services/apiClient";

const formatPattern = (pattern = "") =>
  pattern
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const difficultyRank = {
  Easy: 0,
  Medium: 1,
  Hard: 2
};

const sortQuestionsByDifficulty = (items = []) =>
  [...items].sort((a, b) => {
    const rankDiff = (difficultyRank[a.difficulty] ?? 3) - (difficultyRank[b.difficulty] ?? 3);
    if (rankDiff !== 0) return rankDiff;

    return (Number(a.problemNumber) || 0) - (Number(b.problemNumber) || 0);
  });

const getFallbackDetails = (question, topicName) => {
  const title = question?.title || "Selected Problem";
  const pattern = formatPattern(question?.pattern || "");
  const tags = Array.isArray(question?.tags) ? question.tags.join(", ") : topicName;

  return {
    description:
      question?.description ||
      `Solve "${title}" using the ${pattern || topicName} approach. Focus on identifying the input constraints, choosing the right data structure, and writing a solution that handles edge cases clearly.`,
    examples:
      question?.examples?.length
        ? question.examples
        : [
            {
              input: "Use the sample tests from the linked problem statement.",
              output: "Write the expected result after tracing your approach.",
              explanation: "Before coding, dry-run the core idea on one small case and one edge case."
            }
          ],
    expectedTimeComplexity:
      question?.expectedTimeComplexity || question?.timeComplexity || "Aim for the optimal complexity expected by the pattern.",
    expectedSpaceComplexity:
      question?.expectedSpaceComplexity || question?.spaceComplexity || "Depends on your chosen approach.",
    constraints:
      question?.constraints?.length
        ? question.constraints
        : [
            "Read the linked problem statement for exact input limits.",
            "Handle boundary values and duplicate elements.",
            "Return an answer that matches the required output format."
          ],
    hints:
      question?.hints?.length
        ? question.hints
        : [
            `Map the problem to ${pattern || tags}.`,
            "Write down the invariant your algorithm must maintain.",
            "Check empty input, duplicates, and boundary values before finalizing."
          ]
  };
};

function ProblemDetail() {
  const { topic, problemId } = useParams();
  const topicName = decodeURIComponent(topic || "");
  const decodedProblemId = decodeURIComponent(problemId || "");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState("");
  const [answerStatus, setAnswerStatus] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [submittingSolution, setSubmittingSolution] = useState(false);
  const [needsGithubReconnect, setNeedsGithubReconnect] = useState(false);
  const [topicQuestions, setTopicQuestions] = useState([]);

  const noteKey = `leetcore-note:${topicName}:${decodedProblemId}`;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    let isMounted = true;

    const loadTopicQuestions = async () => {
      try {
        const response = await apiClient.get(`/questions?topic=${encodeURIComponent(topicName)}`);
        return sortQuestionsByDifficulty(response.data?.questions || []);
      } catch (err) {
        if (err.response?.status !== 400 && err.response?.status !== 404) {
          throw err;
        }

        const patternsResponse = await apiClient.get(
          `/questions/patterns?topic=${encodeURIComponent(topicName)}`
        );
        const patterns = patternsResponse.data?.patterns || [];
        const questions = [];

        for (const item of patterns) {
          const patternResponse = await apiClient.get(
            `/questions?topic=${encodeURIComponent(topicName)}&pattern=${encodeURIComponent(item.slug)}`
          );
          questions.push(...(patternResponse.data?.questions || []));
        }

        return sortQuestionsByDifficulty(questions);
      }
    };

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;

        try {
          response = await apiClient.get(
            `/questions/detail/${encodeURIComponent(decodedProblemId)}?topic=${encodeURIComponent(topicName)}`
          );
        } catch (err) {
          if (err.response?.status !== 404) {
            throw err;
          }

          const questions = await loadTopicQuestions();
          const fallbackQuestion = questions.find((itemQuestion) => itemQuestion._id === decodedProblemId);

          if (!fallbackQuestion) {
            throw err;
          }

          response = {
            data: {
              success: true,
              question: fallbackQuestion
            }
          };
        }

        if (isMounted && response.data?.success) {
          setQuestion(response.data.question);
          const questions = await loadTopicQuestions();
          if (isMounted) {
            setTopicQuestions(questions);
          }
        }
      } catch (err) {
        console.error("Error fetching question detail:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load question details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (topicName && decodedProblemId) {
      fetchQuestion();
      setNote(localStorage.getItem(noteKey) || "");
    }

    return () => {
      isMounted = false;
    };
  }, [decodedProblemId, noteKey, topicName]);

  const details = useMemo(() => getFallbackDetails(question, topicName), [question, topicName]);
  const nextQuestions = useMemo(() => {
    const currentIndex = topicQuestions.findIndex((item) => item._id === decodedProblemId);
    if (currentIndex === -1) return [];

    return topicQuestions.slice(currentIndex + 1, currentIndex + 3);
  }, [decodedProblemId, topicQuestions]);
  const answerStats = useMemo(() => {
    const trimmed = note.trim();
    return {
      characters: note.length,
      lines: note ? note.split("\n").length : 0,
      words: trimmed ? trimmed.split(/\s+/).length : 0
    };
  }, [note]);

  const handleNoteChange = (value) => {
    setNote(value);
    localStorage.setItem(noteKey, value);
    setAnswerStatus("Saved");
    setSubmitStatus("");
    setNeedsGithubReconnect(false);
  };

  const handleCopyAnswer = async () => {
    if (!note.trim()) {
      setAnswerStatus("Nothing to copy");
      return;
    }

    await navigator.clipboard.writeText(note);
    setAnswerStatus("Copied");
  };

  const handleClearAnswer = () => {
    setNote("");
    localStorage.removeItem(noteKey);
    setAnswerStatus("Cleared");
    setSubmitStatus("");
    setNeedsGithubReconnect(false);
  };

  const handleReconnectGithub = () => {
    window.location.assign(`${apiUrl}/api/v1/auth/github/login`);
  };

  const handleSubmitSolution = async () => {
    if (!note.trim()) {
      setSubmitStatus("Write your solution before submitting.");
      return;
    }

    try {
      setSubmittingSolution(true);
      setSubmitStatus("Saving solution to GitHub...");
      setNeedsGithubReconnect(false);

      const response = await apiClient.post("/questions/submit-solution", {
        problemId: decodedProblemId,
        topic: topicName,
        solution: note,
      });

      setSubmitStatus(
        response.data?.message ||
          "This solution will save in your GitHub with repo name Leetcore-submission"
      );
    } catch (err) {
      console.error("Failed to submit solution:", err);
      const shouldReconnect = err.response?.status === 409 || err.response?.status === 403;
      setNeedsGithubReconnect(shouldReconnect);
      setSubmitStatus(
        err.response?.data?.message ||
          "Could not save this solution to GitHub. Please try again."
      );
    } finally {
      setSubmittingSolution(false);
    }
  };

  const difficultyColor =
    question?.difficulty === "Easy"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : question?.difficulty === "Hard"
        ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
        : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="w-full min-h-screen bg-[#070709] flex flex-col md:flex-row gap-3 p-3 overflow-x-hidden">
      <div className="w-full md:w-[85px] lg:w-[90px] md:h-[calc(100vh-24px)] flex-shrink-0">
        <DashLeftNavBar />
      </div>

      <main className="flex-1 min-h-[calc(100vh-112px)] md:h-[calc(100vh-24px)] overflow-y-auto rounded-2xl md:rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-6">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-white/60 text-sm">Loading question...</p>
          </div>
        ) : error ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
            <p className="text-red-400 font-semibold">{error}</p>
            <Link
              to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold"
            >
              Back to Practice
            </Link>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col gap-10 pb-8">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <Link
                to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}`}
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-orange-400 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to {topicName} Practice
              </Link>
            </div>

            <section className="flex flex-col gap-7">
              <div className="flex items-center gap-2 text-sm text-white/45 font-semibold">
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
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {question?.problemNumber ? `${question.problemNumber}. ` : ""}
                  {question?.title}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                  <span className={`inline-flex px-3 py-1 rounded-full font-bold border ${difficultyColor}`}>
                    {question?.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-white/55">
                    <Clock size={14} />
                    {question?.estimatedTime}
                  </span>
                  {question?.platform && (
                    <span className="inline-flex items-center gap-1.5 text-white/55">
                      <ExternalLink size={14} />
                      {question.platform}
                    </span>
                  )}
                  {question?.solved && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-300">
                      <CheckCircle2 size={14} />
                      Solved
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/55">
                  {question?.acceptanceRate && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
                      <BarChart3 size={14} />
                      {question.acceptanceRate} acceptance
                    </span>
                  )}
                  {typeof question?.likes === "number" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
                      <ThumbsUp size={14} />
                      {question.likes.toLocaleString()} likes
                    </span>
                  )}
                  {typeof question?.dislikes === "number" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
                      <ThumbsDown size={14} />
                      {question.dislikes.toLocaleString()} dislikes
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-white/45">
                  Asked by {question?.companies?.length || 0} Companies
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(question?.companies || []).map((company) => (
                    <span key={company} className="px-3 py-1.5 rounded-full bg-[#29292f] text-sm font-semibold text-white/80">
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-white/45">Topics</h2>
                <div className="mt-3 flex flex-wrap gap-5 text-sm font-semibold text-white/80">
                  {(question?.tags?.length ? question.tags : [topicName, formatPattern(question?.pattern)]).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5">
                      <Tag size={13} className="text-white/35" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="border-t border-white/10 pt-10">
              <p className="text-lg md:text-xl leading-9 text-white/75">{details.description}</p>
            </section>

            <section className="flex flex-col gap-8">
              {details.examples.map((example, index) => (
                <div key={index}>
                  <h2 className="text-xl font-black text-white">Example {index + 1}:</h2>
                  <div className="mt-5 rounded-lg bg-[#28282e] p-5 text-base leading-7 text-white/80">
                    <p>
                      <span className="font-black text-white">Input:</span> {example.input}
                    </p>
                    <p>
                      <span className="font-black text-white">Output:</span> {example.output}
                    </p>
                    {example.explanation && (
                      <p>
                        <span className="font-black text-white">Explanation:</span> {example.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-xl font-black text-white">Constraints:</h2>
              <ul className="mt-5 flex flex-col gap-4 pl-6 text-lg text-white/80 list-disc marker:text-slate-500">
                {details.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg text-white/70">
                <span className="font-black text-white">Expected Time Complexity:</span>{" "}
                {details.expectedTimeComplexity}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg text-white/70">
                <span className="font-black text-white">Expected Space Complexity:</span>{" "}
                {details.expectedSpaceComplexity}
              </div>
            </section>

            {question?.followUp?.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-white">Follow-up</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {question.followUp.map((item) => (
                    <p key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/70">
                      {item}
                    </p>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-black text-white">Hints</h2>
              <div className="mt-4 flex flex-col gap-3">
                {details.hints.map((hint, index) => (
                  <details key={hint} className="group rounded-xl border border-white/10 bg-black/20">
                    <summary className="cursor-pointer list-none px-5 py-4 text-base font-bold text-white/85">
                      <span className="mr-2 text-white/70 group-open:hidden">&gt;</span>
                      <span className="mr-2 text-white/70 hidden group-open:inline">v</span>
                      Hint {index + 1}
                    </summary>
                    <p className="border-t border-white/10 px-5 py-4 text-sm leading-7 text-white/65">
                      {hint}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {question?.testCases?.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-white">Test Cases</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {question.testCases.map((testCase, index) => (
                    <div key={`${testCase.input}-${index}`} className="rounded-lg bg-[#28282e] p-5 text-base leading-7 text-white/80">
                      <p>
                        <span className="font-black text-white">Input:</span> {testCase.input}
                      </p>
                      <p>
                        <span className="font-black text-white">Output:</span> {testCase.output}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {question?.youtubeVideos?.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-white">Videos</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {question.youtubeVideos.map((video) => (
                    <a
                      key={video.url}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/75 hover:border-orange-500/30 hover:text-white transition-colors"
                    >
                      <span className="font-bold">{video.title}</span>
                      <ExternalLink size={15} className="text-orange-400" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {question?.relatedProblems?.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-white">Related Problems</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {question.relatedProblems.map((item) => (
                    <span key={item} className="rounded-full bg-[#29292f] px-3 py-1.5 text-sm font-semibold text-white/80">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {nextQuestions.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-white">Next Questions</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {nextQuestions.map((item) => (
                    <Link
                      key={item._id}
                      to={`/dashboard/dsa/Practice/${encodeURIComponent(topicName)}/problem/${encodeURIComponent(item._id)}`}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-orange-500/30 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-white/40">{item.difficulty}</p>
                          <h3 className="mt-1 font-black text-white">{item.title}</h3>
                          <p className="mt-2 text-sm text-white/45">{formatPattern(item.pattern)}</p>
                        </div>
                        <ArrowRight size={18} className="text-orange-400 flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="border-t border-white/10 pt-8">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/45 overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xl font-black text-white">
                      <PencilLine size={20} className="text-orange-400" />
                      Your Answer
                    </div>
                    <p className="mt-1 text-sm text-white/45">
                      Draft your solution, final code, dry run, or explanation. It saves on this device automatically.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAnswer}
                      className="inline-flex items-center cursor-pointer gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {answerStatus === "Copied" ? <Check size={14} /> : <Copy size={14} />}
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={needsGithubReconnect ? handleReconnectGithub : handleSubmitSolution}
                      disabled={submittingSolution || (!needsGithubReconnect && !note.trim())}
                      className="inline-flex items-center gap-2 rounded-lg  bg-white px-3 py-2 text-xs font-bold text-black cursor-pointer disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/35 transition-colors"
                    >
                      {submittingSolution ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      {needsGithubReconnect ? "Reconnect GitHub" : "commit to GitHub"}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAnswer}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={14} />
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={note}
                  onChange={(event) => handleNoteChange(event.target.value)}
                  placeholder={`Write your answer here...\n\nApproach:\nComplexity:\nCode:`}
                  className="min-h-[520px] w-full resize-y bg-black/45 p-5 font-mono text-sm leading-7 text-white outline-none placeholder-white/28 focus:bg-black/55"
                />

                <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={submitStatus ? (needsGithubReconnect ? "text-amber-300" : "text-emerald-300") : ""}>
                    {submitStatus || answerStatus || "Ready"}
                    </span>
                    {needsGithubReconnect && (
                      <button
                        type="button"
                        onClick={handleReconnectGithub}
                        className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-bold text-amber-100 hover:bg-amber-400/20 transition-colors"
                      >
                        Reconnect GitHub
                      </button>
                    )}
                  </div>
                  <span>
                    {answerStats.words} words · {answerStats.lines} lines · {answerStats.characters} characters
                  </span>
                </div>
              </div>
            </section>

            {question?.leetcodeUrl && (
              <div className="flex justify-start">
                <a
                  href={question.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border text-black text-sm font-black transition-all"
                >
                  <ExternalLink size={16} />
                  Open in LeetCode
                </a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProblemDetail;
