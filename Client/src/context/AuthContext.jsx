/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import axios from "axios";

const AuthContext = createContext();
const AUTH_TOKEN_KEY = "leetcore_auth_token";

const getTokenFromUrl = () => {
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

const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || "";

const getAuthHeaders = () => {
    const token = getStoredToken();

    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

    useEffect(() => {

        const fetchUser = async () => {

            try {
                const urlToken = getTokenFromUrl();

                if (urlToken) {
                    localStorage.setItem(AUTH_TOKEN_KEY, urlToken);
                }

                const response = await axios.get(
                    `${apiUrl}/api/v1/auth/me`,
                    {
                        withCredentials: true,
                        headers: getAuthHeaders(),
                    }
                );

                setUser(response.data.user);

            } catch {

                localStorage.removeItem(AUTH_TOKEN_KEY);
                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, [apiUrl]);

    const logout = async () => {
        try {
            await axios.post(
                `${apiUrl}/api/v1/auth/logout`,
                {},
                {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                }
            );
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setUser(null);
            window.location.assign("/");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
