import axios from "axios";

const AUTH_TOKEN_KEY = "leetcore_auth_token";

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;
