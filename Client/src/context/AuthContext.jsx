/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const response = await axios.get(
                    `${apiUrl}/api/v1/auth/me`,
                    {
                        withCredentials: true,
                    }
                );

                setUser(response.data.user);

            } catch {

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
                }
            );
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
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
