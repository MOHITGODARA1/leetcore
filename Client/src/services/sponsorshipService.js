import apiClient from "./apiClient";

export const sponsorshipService = {
    submitSponsorshipRequest: (payload) => apiClient.post("/sponsorship", payload),
};
