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

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
                    {
                        withCredentials: true,
                    }
                );

                setUser(response.data.user);

            } catch (error) {

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
