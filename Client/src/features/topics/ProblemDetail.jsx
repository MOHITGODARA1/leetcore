import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";
import DashboardPageShell from "../dashboard/components/DashboardPageShell";
import apiClient from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";
import ProblemDescription from "./components/ProblemDescription";
import CompilerIDE from "./components/CompilerIDE";

const formatPattern = (pattern = "") =>
  pattern
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const toCamelCase = (str = "") => {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .map((word, i) => (i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join("");
};

const getTemplate = (lang, question) => {
  if (lang === "cpp") {
    return `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\n// Write your C++ code here. Read inputs via cin and print output via cout.\nint main() {\n    // Solution code...\n    return 0;\n}\n`;
  }
  const funcName = question ? toCamelCase(question.title) : "solve";
  return `function ${funcName}(nums, target) {\n  // Write your JavaScript solution here\n  \n}`;
};

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
  const { setUser } = useAuth();
  const topicName = decodeURIComponent(topic || "");
  const decodedProblemId = decodeURIComponent(problemId || "");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState("");
  const [answerStatus, setAnswerStatus] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [runStatus, setRunStatus] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [runningSolution, setRunningSolution] = useState(false);
  const [submittingSolution, setSubmittingSolution] = useState(false);
  const [needsGithubReconnect, setNeedsGithubReconnect] = useState(false);
  const [topicQuestions, setTopicQuestions] = useState([]);

  // Active Countdown Timer States and Effects
  const [timeLeft, setTimeLeft] = useState(2400);
  const [timerActive, setTimerActive] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [solvedTime, setSolvedTime] = useState("");

  const formatElapsedTime = (elapsedSeconds) => {
    if (elapsedSeconds < 0) return "0 sec";
    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} sec`;
    }
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    if (secs === 0) {
      return `${mins} min`;
    }
    return `${mins} min ${secs} sec`;
  };

  const handleStartTimer = () => {
    setTimerStarted(true);
    setTimerActive(true);
    localStorage.setItem(`leetcore-timer-started:${decodedProblemId}`, "true");
    if (timeLeft !== undefined) {
      localStorage.setItem(`leetcore-timer-timeLeft:${decodedProblemId}`, timeLeft.toString());
    }
  };

  useEffect(() => {
    if (!question) return;

    if (question.solved) {
      setTimerStarted(true);
      setTimerActive(false);
      setTimeLeft(undefined);
      setShowTimeoutModal(false);
      return;
    }

    const savedTime = localStorage.getItem(`leetcore-timer-timeLeft:${decodedProblemId}`);
    const savedStarted = localStorage.getItem(`leetcore-timer-started:${decodedProblemId}`);

    let limit = 2400; // Default Medium: 40 min
    const diff = question.difficulty?.toLowerCase();
    if (diff === "easy" || diff === "eassy") limit = 1500; // Easy: 25 min
    else if (diff === "medium" || diff === "mideum") limit = 2400; // Medium: 40 min
    else if (diff === "hard") limit = 3600; // Hard: 60 min

    if (savedStarted === "true" && savedTime !== null) {
      const parsedTime = parseInt(savedTime, 10);
      setTimeLeft(parsedTime);
      setTimerStarted(true);
      setTimerActive(parsedTime > 0);
    } else {
      // First time entering! Start the timer automatically
      setTimeLeft(limit);
      setTimerStarted(true);
      setTimerActive(true);
      localStorage.setItem(`leetcore-timer-started:${decodedProblemId}`, "true");
      localStorage.setItem(`leetcore-timer-timeLeft:${decodedProblemId}`, limit.toString());
    }

    setShowTimeoutModal(false);
  }, [question, decodedProblemId]);

  useEffect(() => {
    if (!timerActive || timeLeft === undefined || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          setShowTimeoutModal(true);
          localStorage.setItem(`leetcore-timer-timeLeft:${decodedProblemId}`, "0");
          return 0;
        }
        const newTime = prev - 1;
        localStorage.setItem(`leetcore-timer-timeLeft:${decodedProblemId}`, newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft, decodedProblemId]);

  // New IDE States
  const [language, setLanguage] = useState("cpp");
  const [customInput, setCustomInput] = useState("");
  const [customResult, setCustomResult] = useState(null);
  const [activeTab, setActiveTab] = useState("testcases");
  const [compileError, setCompileError] = useState("");

  const noteKey = `leetcore-note:${topicName}:${decodedProblemId}:${language}`;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Resizable Layout States & Handlers
  const containerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(50); // Default to 50%
  const [isResizing, setIsResizing] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  const startResizing = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidthPx = e.clientX - containerRect.left;
      let newLeftWidthPercent = (newLeftWidthPx / containerRect.width) * 100;
      
      // Clamp between 10% and 90%
      if (newLeftWidthPercent < 10) newLeftWidthPercent = 10;
      if (newLeftWidthPercent > 90) newLeftWidthPercent = 90;
      
      setLeftWidth(newLeftWidthPercent);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Fetch question details
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
    }

    return () => {
      isMounted = false;
    };
  }, [decodedProblemId, topicName]);

  // Sync draft code per language in localStorage
  useEffect(() => {
    if (topicName && decodedProblemId) {
      const savedNote = localStorage.getItem(noteKey);
      if (savedNote) {
        setNote(savedNote);
      } else {
        setNote(getTemplate(language, question));
      }
    }
  }, [noteKey, question, language, topicName, decodedProblemId]);

  const details = useMemo(() => getFallbackDetails(question, topicName), [question, topicName]);
  const nextQuestions = useMemo(() => {
    const currentIndex = topicQuestions.findIndex((item) => item._id === decodedProblemId);
    if (currentIndex === -1) return [];

    return topicQuestions.slice(currentIndex + 1, currentIndex + 3);
  }, [decodedProblemId, topicQuestions]);


  const handleNoteChange = (value) => {
    setNote(value);
    localStorage.setItem(noteKey, value);
    setAnswerStatus("Saved");
    setSubmitStatus("");
    setRunStatus("");
    setTestResults([]);
    setCompileError("");
    setNeedsGithubReconnect(false);

    // Auto-start timer on first edit if not started yet
    if (!timerStarted && question && !question.solved) {
      handleStartTimer();
    }
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
    const template = getTemplate(language, question);
    setNote(template);
    localStorage.setItem(noteKey, template);
    setAnswerStatus("Reset code");
    setSubmitStatus("");
    setRunStatus("");
    setTestResults([]);
    setCompileError("");
    setNeedsGithubReconnect(false);
  };

  const handleReconnectGithub = () => {
    window.location.assign(`${apiUrl}/api/v1/auth/github/login`);
  };

  const handleLanguageChange = (newLang) => {
    localStorage.setItem(noteKey, note);
    setLanguage(newLang);
    const nextKey = `leetcore-note:${topicName}:${decodedProblemId}:${newLang}`;
    const saved = localStorage.getItem(nextKey);
    if (saved) {
      setNote(saved);
    } else {
      setNote(getTemplate(newLang, question));
    }
    setRunStatus("");
    setSubmitStatus("");
    setTestResults([]);
    setCompileError("");
    setCustomResult(null);
  };

  const handleRunSolution = async () => {
    if (!note.trim()) {
      setRunStatus(`Write your ${language === "cpp" ? "C++" : "JavaScript"} solution before running tests.`);
      return false;
    }

    const isCustom = activeTab === "customInput";

    try {
      setRunningSolution(true);
      setActiveTab("results");
      setRunStatus(isCustom ? "Executing custom input..." : "Running visible test cases...");
      setSubmitStatus("");
      setTestResults([]);
      setCompileError("");
      setCustomResult(null);

      const response = await apiClient.post("/questions/run-solution", {
        problemId: decodedProblemId,
        topic: topicName,
        solution: note,
        language,
        customInput: isCustom ? customInput : undefined
      });

      setCompileError(response.data?.compileError || "");

      if (isCustom) {
        setCustomResult(response.data);
        setRunStatus(response.data?.message || "Custom input executed.");
      } else {
        setTestResults(response.data?.results || []);
        setRunStatus(response.data?.message || "All visible test cases passed.");

        if (response.data?.solved) {
          setQuestion((prevQuestion) =>
            prevQuestion ? { ...prevQuestion, solved: true } : prevQuestion
          );
          setTimerActive(false);

          // Calculate time taken
          if (timeLeft !== undefined) {
            let limit = 2400;
            const diff = question?.difficulty?.toLowerCase();
            if (diff === "easy" || diff === "eassy") limit = 1500;
            else if (diff === "medium" || diff === "mideum") limit = 2400;
            else if (diff === "hard") limit = 3600;

            const timeTaken = limit - timeLeft;
            const formatted = formatElapsedTime(timeTaken);
            setSolvedTime(formatted);
            setShowSuccessModal(true);
          }
          
          if (!response.data?.alreadySolved) {
            setUser((prevUser) => {
              if (!prevUser) return prevUser;
              return {
                ...prevUser,
                xp: response.data.xp,
                level: response.data.level,
                stats: response.data.stats,
                badges: response.data.badges || prevUser.badges
              };
            });
          }
        }
      }
      return Boolean(response.data?.passed);
    } catch (err) {
      setCompileError(err.response?.data?.compileError || "");

      if (isCustom) {
        setCustomResult(err.response?.data || { passed: false, stderr: err.message, message: "Execution Failed" });
        setRunStatus(err.response?.data?.message || "Execution Failed.");
      } else {
        const results = err.response?.data?.results || [];
        setTestResults(results);
        setRunStatus(
          err.response?.data?.message ||
            "Code did not pass the visible test cases."
        );
      }
      return false;
    } finally {
      setRunningSolution(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!note.trim()) {
      setSubmitStatus("Write your solution before submitting.");
      return;
    }

    try {
      setSubmittingSolution(true);
      setActiveTab("results");
      setSubmitStatus("Running tests before GitHub push...");
      setNeedsGithubReconnect(false);
      setCompileError("");

      const response = await apiClient.post("/questions/submit-solution", {
        problemId: decodedProblemId,
        topic: topicName,
        solution: note,
        language
      });

      setCompileError(response.data?.compileError || "");

      setSubmitStatus(
        response.data?.message ||
          "This solution will save in your GitHub with repo name Leetcore-submission"
      );
      setRunStatus(response.data?.message ? "All visible test cases passed." : runStatus);
      setTestResults(response.data?.results || testResults);

      if (response.data?.solved) {
        setQuestion((prevQuestion) =>
          prevQuestion ? { ...prevQuestion, solved: true } : prevQuestion
        );
        setTimerActive(false);

        // Calculate time taken
        if (timeLeft !== undefined) {
          let limit = 2400;
          const diff = question?.difficulty?.toLowerCase();
          if (diff === "easy" || diff === "eassy") limit = 1500;
          else if (diff === "medium" || diff === "mideum") limit = 2400;
          else if (diff === "hard") limit = 3600;

          const timeTaken = limit - timeLeft;
          const formatted = formatElapsedTime(timeTaken);
          setSolvedTime(formatted);
          setShowSuccessModal(true);
        }
      }

      if (response.data?.stats) {
        setUser((prevUser) => {
          if (!prevUser) return prevUser;

          return {
            ...prevUser,
            xp: response.data.xp,
            level: response.data.level,
            stats: response.data.stats
          };
        });
      }
    } catch (err) {
      console.error("Failed to submit solution:", err);
      const shouldReconnect = err.response?.status === 409 || err.response?.status === 403;
      setNeedsGithubReconnect(shouldReconnect);
      setCompileError(err.response?.data?.compileError || "");
      if (err.response?.data?.results) {
        setTestResults(err.response.data.results);
        setRunStatus(err.response.data.message);
      }
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
    <DashboardPageShell className="p-5 overflow-hidden flex flex-col" contentClass="border-white/5 bg-[#0e0e11]/85 backdrop-blur-xl">
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
          <div
            ref={containerRef}
            className={`flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden h-full relative ${
              isResizing ? "select-none" : ""
            }`}
          >
            {/* Left Column (Description) */}
            <div
              style={isLargeScreen ? { width: `${leftWidth}%` } : {}}
              className="w-full lg:h-full overflow-hidden flex flex-col lg:pr-3 mb-6 lg:mb-0"
            >
              <ProblemDescription
                topicName={topicName}
                question={question}
                difficultyColor={difficultyColor}
                details={details}
                nextQuestions={nextQuestions}
                formatPattern={formatPattern}
                timeLeft={timeLeft}
                timerStarted={timerStarted}
                onStartTimer={handleStartTimer}
              />
            </div>

            {/* Resizable Divider (Only on Desktop) */}
            <div
              onMouseDown={startResizing}
              className={`hidden lg:flex w-1 bg-white/5 hover:bg-orange-500/40 cursor-col-resize self-stretch items-center justify-center transition-all select-none group relative mx-1.5 rounded-full ${
                isResizing ? "bg-orange-500/40 w-1.5" : ""
              }`}
            >
              <div className="w-[2px] h-6 bg-white/10 group-hover:bg-orange-400 rounded transition-colors" />
            </div>

            {/* Right Column (IDE) */}
            <div
              style={isLargeScreen ? { width: `${100 - leftWidth}%` } : {}}
              className="w-full lg:h-full overflow-hidden flex flex-col lg:pl-3"
            >
              <CompilerIDE
                language={language}
                onLanguageChange={handleLanguageChange}
                note={note}
                onNoteChange={handleNoteChange}
                onClearAnswer={handleClearAnswer}
                onCopyAnswer={handleCopyAnswer}
                answerStatus={answerStatus}
                runStatus={runStatus}
                submitStatus={submitStatus}
                testResults={testResults}
                compileError={compileError}
                customInput={customInput}
                onCustomInputChange={setCustomInput}
                customResult={customResult}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                runningSolution={runningSolution}
                submittingSolution={submittingSolution}
                needsGithubReconnect={needsGithubReconnect}
                onReconnectGithub={handleReconnectGithub}
                onRunSolution={handleRunSolution}
                onSubmitSolution={handleSubmitSolution}
                question={question}
              />
            </div>
          </div>
        )}

      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative max-w-md w-full bg-[#111114] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500">
              <Clock size={28} className="animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">Time Limit Exceeded</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              need to hard work in your life bro this is <strong className="text-white capitalize">{question?.difficulty || "Medium"}</strong> and you did not abel to solve in <strong className="text-white">{question?.difficulty === "Easy" ? "25 min" : question?.difficulty === "Hard" ? "60 min" : "40 min"}</strong> so practice every day keep it up
            </p>
            <div className="mt-2 w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowTimeoutModal(false)}
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 font-bold text-white transition-colors cursor-pointer text-sm"
              >
                Keep Trying
              </button>
              <button
                type="button"
                onClick={() => {
                  let limit = 2400;
                  const diff = question?.difficulty?.toLowerCase();
                  if (diff === "easy" || diff === "eassy") limit = 1500;
                  else if (diff === "medium" || diff === "mideum") limit = 2400;
                  else if (diff === "hard") limit = 3600;
                  setTimeLeft(limit);
                  setTimerStarted(true);
                  setTimerActive(true);
                  setShowTimeoutModal(false);
                  localStorage.setItem(`leetcore-timer-started:${decodedProblemId}`, "true");
                  localStorage.setItem(`leetcore-timer-timeLeft:${decodedProblemId}`, limit.toString());
                }}
                className="w-full rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition-colors cursor-pointer"
              >
                Reset Timer
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative max-w-md w-full bg-[#111114] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
              <CheckCircle2 size={28} className="animate-bounce" />
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">Congratulations!</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              All test cases passed! You solved this <strong className="text-white capitalize">{question?.difficulty || "Medium"}</strong> question in <strong className="text-orange-400 font-bold">{solvedTime}</strong>. Great job!
            </p>
            <div className="mt-2 w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 font-bold text-white transition-colors cursor-pointer text-sm"
              >
                Awesome
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

export default ProblemDetail;
