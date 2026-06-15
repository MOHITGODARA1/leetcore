import apiClient from "./apiClient";

export const feedbackService = {
    submitFeedback: (payload) => apiClient.post("/feedback", payload),
};
