import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"

function ProtectedRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070709] flex items-center justify-center px-4 text-white">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-6 py-4 text-sm text-white/70">
                    Loading LeetCore...
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;
