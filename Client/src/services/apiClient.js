import axios from "axios";

const AUTH_TOKEN_KEY = "leetcore_auth_token";

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let csrfToken = null;

apiClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Fetch and attach CSRF token for mutating requests
    const method = config.method?.toLowerCase();
    if (["post", "put", "delete", "patch"].includes(method)) {
        if (!csrfToken) {
            try {
                const response = await axios.get(
                    `${config.baseURL || "http://localhost:4000/api/v1"}/csrf-token`,
                    { withCredentials: true }
                );
                csrfToken = response.data.csrfToken;
            } catch (err) {
                console.error("Failed to fetch CSRF token:", err);
            }
        }
        if (csrfToken) {
            config.headers["X-CSRF-Token"] = csrfToken;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.get(
                    `${originalRequest.baseURL || "http://localhost:4000/api/v1"}/csrf-token`,
                    { withCredentials: true }
                );
                csrfToken = response.data.csrfToken;
                originalRequest.headers["X-CSRF-Token"] = csrfToken;
                return apiClient(originalRequest);
            } catch (err) {
                console.error("Failed to refresh CSRF token on retry:", err);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
