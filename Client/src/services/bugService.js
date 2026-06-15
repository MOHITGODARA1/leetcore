import apiClient from "./apiClient";

export const bugService = {
    submitBugReport: (payload) => apiClient.post("/bugs", payload),
};
