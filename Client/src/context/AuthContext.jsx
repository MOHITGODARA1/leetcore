/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
const apiClient = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("leetcore_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthContext = createContext();
const AUTH_TOKEN_KEY = "leetcore_auth_token";

const getTokenFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchToken = searchParams.get("token") || "";

    if (searchToken) {
        searchParams.delete("token");
        const nextSearch = searchParams.toString();

        window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`
        );

        return searchToken;
    }

    const hash = window.location.hash || "";
    const queryIndex = hash.indexOf("?");

    if (queryIndex === -1) {
        return "";
    }

    const route = hash.slice(0, queryIndex);
    const params = new URLSearchParams(hash.slice(queryIndex + 1));
    const token = params.get("token") || "";

    if (!token) {
        return "";
    }

    params.delete("token");

    const nextQuery = params.toString();
    const nextHash = `${route || "#/"}${nextQuery ? `?${nextQuery}` : ""}`;

    window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${nextHash}`
    );

    return token;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const urlToken = getTokenFromUrl();

                if (urlToken) {
                    localStorage.setItem(AUTH_TOKEN_KEY, urlToken);
                }

                const token = localStorage.getItem(AUTH_TOKEN_KEY);
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const response = await apiClient.get("/auth/me");
                setUser(response.data.user);
            } catch (err) {
                // Only log out the user and clear token if the error is an explicit 401/403
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                    setUser(null);
                } else {
                    // For temporary server/network errors, keep the token so session persists
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
            window.location.assign("/");
        };

        window.addEventListener("leetcore_unauthorized", handleUnauthorized);
        return () => {
            window.removeEventListener("leetcore_unauthorized", handleUnauthorized);
        };
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setUser(null);
            window.location.assign("/");
        }
    }, []);

    const contextValue = useMemo(() => ({
        user,
        setUser,
        loading,
        logout,
    }), [user, loading, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
