import apiClient from "./apiClient";

export const questionService = {
    getRecentSolved: () => apiClient.get("/questions/recent-solved"),
};
