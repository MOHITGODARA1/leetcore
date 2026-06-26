import axios from "axios";

const AUTH_TOKEN_KEY = "leetcore_auth_token";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

const apiClient = axios.create({
    baseURL: `${apiUrl}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let csrfToken = null;
let csrfTokenPromise = null;

const fetchCsrfToken = () => {
    if (!csrfTokenPromise) {
        // Fetch CSRF token using standard axios to avoid request interceptor recursion
        csrfTokenPromise = axios.get(`${apiUrl}/api/v1/csrf-token`, {
            withCredentials: true
        }).then(response => {
            csrfToken = response.data.csrfToken;
            csrfTokenPromise = null;
            return csrfToken;
        }).catch(err => {
            csrfTokenPromise = null;
            throw err;
        });
    }
    return csrfTokenPromise;
};

apiClient.interceptors.request.use(async (config) => {
    // 1. Attach Auth Token
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Fetch and attach CSRF token for mutating requests (POST, PUT, DELETE, PATCH)
    const method = config.method ? config.method.toLowerCase() : "";
    if (["post", "put", "delete", "patch"].includes(method)) {
        if (!csrfToken) {
            try {
                await fetchCsrfToken();
            } catch (err) {
                console.error("Failed to fetch CSRF token on mutating request:", err);
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
            csrfToken = null;
            csrfTokenPromise = null;
            try {
                const newToken = await fetchCsrfToken();
                originalRequest.headers["X-CSRF-Token"] = newToken;
                return apiClient(originalRequest);
            } catch (err) {
                console.error("Failed to refresh CSRF token on retry:", err);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
