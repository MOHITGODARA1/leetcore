import axios from "axios";
import { csrfRequestInterceptor } from "./csrf";
import questionsData from "../features/DSA/data/questions.json";
import topicsData from "../features/DSA/data/topics.json";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const AUTH_TOKEN_KEY = "leetcore_auth_token";
const SOLVED_KEY = "leetcore_solved_questions";
const LOCAL_ACTIVITY_KEY = "leetcore_local_activity";
export const ACTIVITY_UPDATED_EVENT = "leetcore_activity_updated";

const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.request.use(csrfRequestInterceptor);

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getQuestionMeta = (questionId, fallbackTopicId = "") => {
  for (const [topicId, questions] of Object.entries(questionsData)) {
    const question = questions.find((item) => item.id === questionId);
    if (question) {
      return {
        topicId,
        difficulty: question.difficulty || "Medium",
      };
    }
  }

  return {
    topicId: fallbackTopicId,
    difficulty: "Medium",
  };
};

const getAllQuestionIds = () => Object.values(questionsData).flat().map((question) => question.id);

const getTopicProgress = (solvedQuestions) => {
  const solvedSet = new Set(solvedQuestions);

  return topicsData.topics.map((topic) => {
    const total = questionsData[topic.id]?.length || 0;
    const solved = (questionsData[topic.id] || []).filter((question) => solvedSet.has(question.id)).length;

    return {
      id: topic.id,
      label: topic.label,
      order: topic.order,
      solved,
      total,
      percent: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  });
};

const getWeeklyProgress = (dailyActivity) => {
  const activityByDate = new Map(dailyActivity.map((day) => [day.date, day]));
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const dateKey = toDateKey(date);
    const day = activityByDate.get(dateKey);

    return {
      date: dateKey,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      solvedCount: day?.solvedCount || 0,
      submissions: day?.submissions || 0,
    };
  });
};

const getStreakCount = (dailyActivity) => {
  const solvedDates = new Set(dailyActivity.filter((day) => day.solvedCount > 0).map((day) => day.date));
  let cursor = new Date();

  if (!solvedDates.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (solvedDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

export const buildLocalActivitySummary = () => {
  const solvedQuestions = readJson(SOLVED_KEY, []).filter((id) => getAllQuestionIds().includes(id));
  const localActivity = readJson(LOCAL_ACTIVITY_KEY, { dailyActivity: [], totalSubmissions: 0 });
  const topicProgress = getTopicProgress(solvedQuestions);
  const currentTopic = topicProgress.find((topic) => topic.total > 0 && topic.solved < topic.total)
    || topicProgress.find((topic) => topic.total > 0)
    || { id: "arrays", label: "Arrays", solved: 0, total: 0, percent: 0 };
  const weeklyProgress = getWeeklyProgress(localActivity.dailyActivity || []);
  const weeklySolved = weeklyProgress.reduce((total, day) => total + day.solvedCount, 0);
  const streakCount = getStreakCount(localActivity.dailyActivity || []);
  const solvedCount = solvedQuestions.length;
  const totalQuestions = getAllQuestionIds().length;
  const readinessScore = clamp(Math.round((streakCount * 8) + (weeklySolved * 6) + (solvedCount * 2)), 0, 100);

  return {
    solvedCount,
    totalQuestions,
    streakCount,
    readinessScore,
    weeklySolved,
    currentTopic,
    topicProgress,
    weeklyProgress,
    contestRank: {
      rank: solvedCount > 0 ? 1 : "-",
      totalUsers: 1,
      percentile: solvedCount > 0 ? 100 : 0,
    },
    lastActivityAt: localActivity.lastActivityAt || null,
    isLocal: true,
  };
};

export const getActivitySummary = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    try {
      const response = await apiClient.get("/activity/summary");
      return response.data.summary;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  }

  return buildLocalActivitySummary();
};

const recordLocalAcceptedSubmission = ({ questionId, topicId }) => {
  const solvedQuestions = readJson(SOLVED_KEY, []);
  const wasAlreadySolved = solvedQuestions.includes(questionId);
  const nextSolvedQuestions = wasAlreadySolved ? solvedQuestions : [...solvedQuestions, questionId];
  const localActivity = readJson(LOCAL_ACTIVITY_KEY, { dailyActivity: [], totalSubmissions: 0 });
  const todayKey = toDateKey();
  const day = (localActivity.dailyActivity || []).find((item) => item.date === todayKey);

  if (day) {
    day.submissions += 1;
    if (!wasAlreadySolved) day.solvedCount += 1;
  } else {
    localActivity.dailyActivity = [
      ...(localActivity.dailyActivity || []),
      {
        date: todayKey,
        submissions: 1,
        solvedCount: wasAlreadySolved ? 0 : 1,
      },
    ];
  }

  localActivity.totalSubmissions = (localActivity.totalSubmissions || 0) + 1;
  localActivity.lastActivityAt = new Date().toISOString();
  const meta = getQuestionMeta(questionId, topicId);
  localActivity.lastSolvedTopicId = meta.topicId;

  writeJson(SOLVED_KEY, nextSolvedQuestions);
  writeJson(LOCAL_ACTIVITY_KEY, localActivity);

  return {
    solvedQuestions: nextSolvedQuestions,
    summary: buildLocalActivitySummary(),
  };
};

export const recordAcceptedSubmission = async (payload) => {
  const localResult = recordLocalAcceptedSubmission(payload);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  let summary = localResult.summary;

  if (token) {
    try {
      const meta = getQuestionMeta(payload.questionId, payload.topicId);
      const response = await apiClient.post("/activity/submissions/accepted", {
        questionId: payload.questionId,
        topicId: meta.topicId,
        difficulty: payload.difficulty || meta.difficulty,
        language: payload.language,
        runtimeMs: payload.runtimeMs,
        memoryKb: payload.memoryKb,
      });
      summary = response.data.summary;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  }

  window.dispatchEvent(new CustomEvent(ACTIVITY_UPDATED_EVENT, { detail: summary }));

  return {
    solvedQuestions: localResult.solvedQuestions,
    summary,
  };
};
