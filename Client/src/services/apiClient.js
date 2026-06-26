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
                // Fetch CSRF token using standard axios to avoid request interceptor recursion
                const response = await axios.get(`${apiUrl}/api/v1/csrf-token`, {
                    withCredentials: true
                });
                csrfToken = response.data.csrfToken;
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

// Reset cached CSRF token on 403 failures
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 403) {
            csrfToken = null;
        }
        return Promise.reject(error);
    }
);

export default apiClient;
