import { ACTIVITY_UPDATED_EVENT } from "../../services/activityProgress";

export const SQL_COMPLETED_KEY = "leetcore_sql_completed";

export const getCompletedTopics = () => {
  try {
    return JSON.parse(localStorage.getItem(SQL_COMPLETED_KEY) || "[]");
  } catch {
    return [];
  }
};

export const setCompletedTopic = (topicId) => {
  const list = getCompletedTopics();
  if (list.includes(topicId)) return list;
  const next = [...list, topicId];
  localStorage.setItem(SQL_COMPLETED_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(ACTIVITY_UPDATED_EVENT));
  return next;
};