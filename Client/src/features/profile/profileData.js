import questionsData from "../DSA/data/questions.json";
import topicsData from "../DSA/data/topics.json";
import { getActivitySummary } from "../../services/activityProgress";

const SOLVED_KEY = "leetcore_solved_questions";
const LOCAL_ACTIVITY_KEY = "leetcore_local_activity";
const SUBMISSION_HISTORY_KEY = "leetcore_submission_history";

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parsePercent = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const getSolvedQuestionIds = () => readJson(SOLVED_KEY, []);

const getLocalActivity = () =>
  readJson(LOCAL_ACTIVITY_KEY, { dailyActivity: [], totalSubmissions: 0 });

const getQuestionMeta = (questionId) => {
  for (const [topicId, questions] of Object.entries(questionsData)) {
    const question = questions.find((item) => item.id === questionId);
    if (question) {
      return { topicId, difficulty: question.difficulty || "Medium", name: question.name || "" };
    }
  }

  return { topicId: "", difficulty: "Medium", name: "" };
};

const getAllQuestions = () =>
  Object.entries(questionsData).flatMap(([topicId, questions]) =>
    questions.map((question) => ({ ...question, topicId }))
  );

const getDifficultyTotals = () => {
  const totals = { Easy: 0, Medium: 0, Hard: 0 };

  Object.values(questionsData).forEach((questions) => {
    questions.forEach((question) => {
      if (totals[question.difficulty] != null) {
        totals[question.difficulty] += 1;
      }
    });
  });

  return totals;
};

const getSolvedDifficultyBreakdown = (solvedIds) => {
  const breakdown = { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } };
  const totals = getDifficultyTotals();

  Object.keys(breakdown).forEach((difficulty) => {
    breakdown[difficulty].total = totals[difficulty] || 0;
  });

  solvedIds.forEach((id) => {
    const { difficulty } = getQuestionMeta(id);
    if (breakdown[difficulty]) {
      breakdown[difficulty].solved += 1;
    }
  });

  return breakdown;
};

const getAverageAcceptanceRate = (solvedIds) => {
  const allQuestions = getAllQuestions();
  const byId = new Map(allQuestions.map((question) => [question.id, question]));

  const rates = solvedIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((question) => parsePercent(question.acceptanceRate));

  if (rates.length === 0) {
    return 0;
  }

  return Math.round(rates.reduce((total, rate) => total + rate, 0) / rates.length);
};

const getLongestStreak = (dailyActivity) => {
  const solvedDates = dailyActivity
    .filter((day) => day.solvedCount > 0)
    .map((day) => day.date)
    .sort();

  if (solvedDates.length === 0) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let index = 1; index < solvedDates.length; index += 1) {
    const previous = new Date(`${solvedDates[index - 1]}T00:00:00Z`);

    if (toDateKey(addDays(previous, 1)) === solvedDates[index]) {
      current += 1;
    } else {
      current = 1;
    }

    longest = Math.max(longest, current);
  }

  return longest;
};

const buildHeatmap = (dailyActivity, weeks = 52) => {
  const byDate = new Map(dailyActivity.map((day) => [day.date, day.solvedCount || 0]));
  const today = new Date();

  const start = addDays(today, -(weeks * 7 - 1));
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const days = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    const date = toDateKey(cursor);
    const count = byDate.get(date) || 0;

    days.push({
      date,
      count,
      level: count >= 5 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0,
    });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const columns = [];
  for (let index = 0; index < days.length; index += 7) {
    columns.push(days.slice(index, index + 7));
  }

  const monthLabels = [];
  let lastMonth = -1;

  columns.forEach((column) => {
    const month = new Date(`${column[0].date}T00:00:00Z`).getUTCMonth();

    if (month !== lastMonth) {
      monthLabels.push({
        index: monthLabels.length,
        label: new Date(`${column[0].date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      });
      lastMonth = month;
    }
  });

  const totalActiveDays = days.filter((day) => day.count > 0).length;
  const totalSolvedInRange = days.reduce((total, day) => total + day.count, 0);

  return { columns, monthLabels, totalActiveDays, totalSolvedInRange };
};

const buildRecentActivity = (dailyActivity, limit = 12) => {
  return [...dailyActivity]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit)
    .map((day) => ({
      date: day.date,
      solvedCount: day.solvedCount || 0,
      submissions: day.submissions || 0,
      label: new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
    }));
};

const buildAchievements = ({ dailyActivity, topicProgress, solvedCount, longestStreak }) => {
  const events = [];

  const pushEvent = (type, title, description, icon, date = null) => {
    events.push({ id: `${type}-${events.length}`, type, title, description, icon, date });
  };

  const solveMilestones = [
    { target: 1, name: "First Steps", description: "Solved your very first problem", icon: "rocket" },
    { target: 5, name: "Getting Started", description: "Solved 5 problems", icon: "star" },
    { target: 10, name: "Double Digits", description: "Solved 10 problems", icon: "star" },
    { target: 25, name: "Quarter Century", description: "Solved 25 problems", icon: "medal" },
    { target: 50, name: "Halfway Hero", description: "Solved 50 problems", icon: "medal" },
  ];

  solveMilestones.forEach((milestone) => {
    if (solvedCount >= milestone.target) {
      pushEvent("milestone", milestone.name, milestone.description, milestone.icon);
    }
  });

  const streakMilestones = [
    { target: 3, name: "On a Roll", description: "Reached a 3 day streak", icon: "flame" },
    { target: 7, name: "Unstoppable", description: "Reached a 7 day streak", icon: "flame" },
    { target: 14, name: "Fortnight Fire", description: "Reached a 14 day streak", icon: "flame" },
    { target: 30, name: "Monthly Legend", description: "Reached a 30 day streak", icon: "crown" },
  ];

  streakMilestones.forEach((milestone) => {
    if (longestStreak >= milestone.target) {
      pushEvent("milestone", milestone.name, milestone.description, milestone.icon);
    }
  });

  topicProgress
    .filter((topic) => topic.total > 0 && topic.percent === 100)
    .forEach((topic) => {
      pushEvent("topic", `${topic.label} Mastered`, `Completed all ${topic.total} ${topic.label} problems`, "layers");
    });

  [...dailyActivity]
    .filter((day) => day.solvedCount > 0)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6)
    .forEach((day) => {
      pushEvent(
        "solved",
        `Solved ${day.solvedCount} problem${day.solvedCount > 1 ? "s" : ""}`,
        `Accepted submission${day.submissions > 1 ? "s" : ""} on ${new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}`,
        "circle-check",
        day.date
      );
    });

  if (events.length === 0) {
    pushEvent("empty", "No achievements yet", "Solve your first problem to start earning badges", "sparkles");
  }

  return events;
};

const buildTopicProgress = () => {
  const solvedSet = new Set(getSolvedQuestionIds());

  return topicsData.topics.map((topic) => {
    const total = questionsData[topic.id]?.length || 0;
    const solved = (questionsData[topic.id] || []).filter((question) => solvedSet.has(question.id)).length;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

    return {
      id: topic.id,
      label: topic.label,
      order: topic.order,
      solved,
      total,
      percent,
    };
  });
};

const buildRecentProblems = (limit = 8) => {
  const history = readJson(SUBMISSION_HISTORY_KEY, {});
  const entries = Object.entries(history)
    .map(([questionId, record]) => {
      const { name, difficulty, topicId } = getQuestionMeta(questionId);
      if (!name) return null;

      const accepted = Number(record.acceptedSubmissions || 0) > 0;
      const latest = Array.isArray(record.submissions) ? record.submissions[0] : null;
      const latestMs = latest?.id ? Number(String(latest.id).split("-").pop()) : null;
      const at = accepted
        ? record.firstAcceptedAt || new Date(latestMs || Date.now()).toISOString()
        : new Date(latestMs || Date.now()).toISOString();

      return {
        questionId,
        name,
        difficulty,
        topicId,
        accepted,
        attempts: Number(record.attempts || record.totalSubmissions || 0),
        at,
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, limit);

  return entries;
};

const getTopicLabel = (topicId) => {
  const topic = topicsData.topics.find((item) => item.id === topicId);
  return topic?.label || "Interview Prep";
};

const buildContest = (summary, solvedCount, weeklySolved) => {
  const rank = summary?.contestRank?.rank;
  const fallbackRank = solvedCount > 0 ? 1 : "-";

  return {
    rank: rank != null && rank !== "-" ? rank : fallbackRank,
    totalUsers: summary?.contestRank?.totalUsers ?? 1,
    percentile: summary?.contestRank?.percentile ?? (solvedCount > 0 ? 100 : 0),
    rating: summary?.readinessScore || 0,
    weeklySolved: weeklySolved || [],
    isRanked: rank != null && rank !== "-",
  };
};

const READINESS_CATEGORY_WEIGHTS = [
  { id: "dsaProgress", label: "DSA Progress", weight: 30 },
  { id: "coreSubjects", label: "Core Subjects", weight: 10 },
  { id: "aptitude", label: "Aptitude", weight: 10 },
  { id: "projects", label: "Projects", weight: 10 },
  { id: "resume", label: "Resume", weight: 10 },
  { id: "contestPerformance", label: "Contest Performance", weight: 15 },
  { id: "dailyConsistency", label: "Daily Consistency", weight: 15 },
];

const computeFactorScores = (snapshot) => {
  const {
    solvedPercent,
    breadthPercent,
    avgTopicPercent,
    acceptanceRate,
    depthPercent,
    submissions,
    consistency,
    streak,
    contestFactor,
  } = snapshot;

  return {
    dsaProgress: clamp(Math.round(solvedPercent * 0.6 + breadthPercent * 0.4), 0, 100),
    coreSubjects: avgTopicPercent,
    aptitude: clamp(Math.round(acceptanceRate * 0.6 + depthPercent * 0.4), 0, 100),
    projects: clamp(Math.round(Math.min(100, submissions) * 0.5 + consistency * 0.5), 0, 100),
    resume: clamp(Math.round(solvedPercent * 0.5 + Math.min(40, streak * 4) + Math.min(10, Math.floor(submissions / 10))), 0, 100),
    contestPerformance: clamp(Math.round(contestFactor), 0, 100),
    dailyConsistency: clamp(Math.round(consistency * 0.6 + Math.min(40, streak * 4)), 0, 100),
  };
};

const getReadinessStatus = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Average";
  return "Needs Improvement";
};

const getReadinessSummary = (score) => {
  if (score >= 80) return "Your preparation is in excellent shape for interviews.";
  if (score >= 65) return "Solid preparation — keep strengthening your weak areas.";
  if (score >= 45) return "You're making steady progress — stay consistent to improve.";
  return "Focus on the fundamentals to build momentum.";
};

const streakUpTo = (byDate, endDate) => {
  let cursor = endDate;

  if (!byDate.get(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;

  while (byDate.get(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

const buildReadinessHistory = ({
  dailyActivity,
  totalQuestions,
  contestFactor,
  acceptanceRate,
  depthPercent,
  currentScore,
}) => {
  const byDate = new Map(dailyActivity.map((day) => [day.date, day]));
  const dateKeys = [...byDate.keys()].sort();
  const now = new Date();
  const pointCount = 6;
  const points = [];

  for (let offset = pointCount - 1; offset >= 0; offset -= 1) {
    const monthIndex = (now.getMonth() - offset + 12) % 12;
    const year = now.getFullYear() - (monthIndex > now.getMonth() ? 1 : 0);
    const boundary = offset === 0
      ? now
      : new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));
    const boundaryKey = toDateKey(boundary);

    let cumulativeSolved = 0;
    let cumulativeSubmissions = 0;

    for (const key of dateKeys) {
      if (key > boundaryKey) break;
      const day = byDate.get(key);
      cumulativeSolved += day.solvedCount || 0;
      cumulativeSubmissions += day.submissions || 0;
    }

    let weeklySolved = 0;
    for (let day = addDays(boundary, -6); day <= boundary; day = addDays(day, 1)) {
      weeklySolved += byDate.get(toDateKey(day))?.solvedCount || 0;
    }

    const snapshot = {
      solvedPercent: totalQuestions > 0 ? Math.round((cumulativeSolved / totalQuestions) * 100) : 0,
      breadthPercent: totalQuestions > 0 ? Math.round((cumulativeSolved / totalQuestions) * 100) : 0,
      avgTopicPercent: totalQuestions > 0 ? Math.round((cumulativeSolved / totalQuestions) * 100) : 0,
      acceptanceRate,
      depthPercent,
      submissions: cumulativeSubmissions,
      consistency: clamp(Math.round((weeklySolved / 7) * 100), 0, 100),
      streak: streakUpTo(byDate, boundary),
      contestFactor,
    };

    const factorScores = computeFactorScores(snapshot);
    const score = clamp(
      Math.round(
        READINESS_CATEGORY_WEIGHTS.reduce(
          (total, category) => total + factorScores[category.id] * category.weight,
          0
        ) / 100
      ),
      0,
      100
    );

    points.push({
      date: toDateKey(boundary),
      label: boundary.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      score,
    });
  }

  points[points.length - 1].score = currentScore;

  return points;
};

const buildReadiness = ({
  topicProgress,
  solvedCount,
  totalQuestions,
  acceptanceRate,
  currentStreak,
  weeklySolved,
  totalSubmissions,
  difficultyBreakdown,
  contest,
  dailyActivity,
}) => {
  const trackedTopics = topicProgress.filter((topic) => topic.total > 0);
  const totalTopics = Math.max(1, trackedTopics.length);
  const startedTopics = topicProgress.filter((topic) => topic.solved > 0).length;
  const avgTopicPercent = Math.round(
    trackedTopics.reduce((total, topic) => total + topic.percent, 0) / totalTopics
  );

  const solvedPercent = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  const breadthPercent = Math.round((startedTopics / totalTopics) * 100);
  const consistency = clamp(Math.round((weeklySolved / 7) * 100), 0, 100);

  const medium = difficultyBreakdown?.Medium || { solved: 0, total: 0 };
  const hard = difficultyBreakdown?.Hard || { solved: 0, total: 0 };
  const depthWeighted = medium.total * 2 + hard.total * 3;
  const depthPercent = depthWeighted > 0
    ? clamp(Math.round(((medium.solved * 2 + hard.solved * 3) / depthWeighted) * 100), 0, 100)
    : 0;

  const isRanked = Boolean(contest?.isRanked);
  const percentile = contest?.percentile ?? 0;
  const contestFactor = isRanked ? percentile : 30;

  const factorScores = computeFactorScores({
    solvedPercent,
    breadthPercent,
    avgTopicPercent,
    acceptanceRate,
    depthPercent,
    submissions: totalSubmissions,
    consistency,
    streak: currentStreak,
    contestFactor,
  });

  const categories = READINESS_CATEGORY_WEIGHTS.map((category) => ({
    ...category,
    score: factorScores[category.id],
  }));

  const score = clamp(
    Math.round(
      categories.reduce((total, category) => total + category.score * category.weight, 0) / 100
    ),
    0,
    100
  );

  const history = buildReadinessHistory({
    dailyActivity,
    totalQuestions,
    contestFactor,
    acceptanceRate,
    depthPercent,
    currentScore: score,
  });

  return {
    score,
    status: getReadinessStatus(score),
    description: getReadinessSummary(score),
    stats: {
      problemsSolved: solvedCount,
      consistency,
      mockInterviews: 0,
    },
    rank: isRanked
      ? { top: `Top ${Math.max(1, 100 - percentile)}%`, rank: `#${contest.rank}` }
      : null,
    categories,
    history,
  };
};

export const getProfileData = async () => {
  const summary = await getActivitySummary();

  const solvedIds = getSolvedQuestionIds();
  const localActivity = getLocalActivity();
  const dailyActivity = localActivity.dailyActivity || [];

  const topicProgress = buildTopicProgress();
  const difficultyBreakdown = getSolvedDifficultyBreakdown(solvedIds);
  const longestStreak = getLongestStreak(dailyActivity);
  const solvedCount = solvedIds.length;
  const acceptanceRate = getAverageAcceptanceRate(solvedIds);
  const heatmap = buildHeatmap(dailyActivity);
  const recentActivity = buildRecentActivity(dailyActivity);
  const recentProblems = buildRecentProblems();
  const achievements = buildAchievements({ dailyActivity, topicProgress, solvedCount, longestStreak });
  const weeklySolved = summary?.weeklyProgress || [];
  const contest = buildContest(summary, solvedCount, weeklySolved);
  const totalQuestions = Object.values(questionsData).reduce((total, questions) => total + questions.length, 0);

  const readiness = buildReadiness({
    topicProgress,
    solvedCount,
    totalQuestions,
    acceptanceRate,
    currentStreak: summary?.streakCount || 0,
    weeklySolved: summary?.weeklySolved || 0,
    totalSubmissions: localActivity.totalSubmissions || 0,
    difficultyBreakdown,
    contest,
    dailyActivity,
  });

  return {
    summary,
    stats: {
      solvedCount,
      totalQuestions,
      totalSubmissions: localActivity.totalSubmissions || 0,
      acceptanceRate,
      currentStreak: summary?.streakCount || 0,
      longestStreak,
      readinessScore: readiness.score,
      weeklySolved: summary?.weeklySolved || 0,
      difficultyBreakdown,
    },
    readiness,
    topicProgress,
    heatmap,
    recentActivity,
    recentProblems,
    getTopicLabel,
    achievements,
    contest,
    lastActivityAt: localActivity.lastActivityAt || summary?.lastActivityAt || null,
    isLocal: summary?.isLocal ?? true,
  };
};
