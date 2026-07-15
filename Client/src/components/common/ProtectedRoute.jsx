import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

function ProtectedRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;
