/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
} from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import apiClient from "../services/apiClient";
import BadgeEarnedPopup from "../features/gamification/components/BadgeEarnedPopup";
import LevelUpPopup from "../features/gamification/components/LevelUpPopup";

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

                const response = await apiClient.get("/auth/me");

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

    const [badgeQueue, setBadgeQueue] = useState([]);
    const [newLevel, setNewLevel] = useState(null);

    const prevBadgeKeysRef = useRef(null);
    const prevLevelRef = useRef(null);

    useEffect(() => {
        if (!user) {
            prevBadgeKeysRef.current = null;
            prevLevelRef.current = null;
            return;
        }

        const getBadgeKey = (b) => {
            const badgeDetails = b?.badgeId || b;
            return badgeDetails?._id || badgeDetails?.slug || (typeof badgeDetails === "string" ? badgeDetails : "");
        };

        const getBadgeDetails = (b) => {
            return b?.badgeId && typeof b.badgeId === "object" ? b.badgeId : b;
        };

        const currentBadges = user.badges || [];
        const prevBadgeKeys = prevBadgeKeysRef.current;

        if (prevBadgeKeys === null) {
            // Initial load of user: save existing badge keys and level without popups
            const initialKeys = new Set();
            currentBadges.forEach(b => {
                const key = getBadgeKey(b);
                if (key) initialKeys.add(key);
            });
            prevBadgeKeysRef.current = initialKeys;
            prevLevelRef.current = user.level;
            return;
        }

        // Subsequent updates: detect new badges
        const newBadges = [];
        currentBadges.forEach(b => {
            const key = getBadgeKey(b);
            if (key && !prevBadgeKeys.has(key)) {
                prevBadgeKeys.add(key);
                const details = getBadgeDetails(b);
                if (details) {
                    newBadges.push(details);
                }
            }
        });

        if (newBadges.length > 0) {
            setBadgeQueue(prev => [...prev, ...newBadges]);
        }

        // Subsequent updates: detect level up
        if (prevLevelRef.current !== null && typeof user.level === "number") {
            if (user.level > prevLevelRef.current) {
                setNewLevel(user.level);
            }
            prevLevelRef.current = user.level;
        } else if (prevLevelRef.current === null && typeof user.level === "number") {
            prevLevelRef.current = user.level;
        }

    }, [user, user?.badges, user?.level]);

    const handleCloseBadge = () => {
        setBadgeQueue(prev => prev.slice(1));
    };

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout");
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
            {newLevel && createPortal(
                <LevelUpPopup
                    level={newLevel}
                    onClose={() => setNewLevel(null)}
                />,
                document.body
            )}
            {badgeQueue.length > 0 && !newLevel && createPortal(
                <BadgeEarnedPopup
                    badge={badgeQueue[0]}
                    onClose={handleCloseBadge}
                />,
                document.body
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
