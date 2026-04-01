// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import DashNavbar from "../../Components/dahboardnav";
import DSARoadmap from "./component/graph";
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}profile`, {
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    // 🔄 Loading state
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                Loading...
            </div>
        );
    }

    // 🚫 Not logged in
    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center text-white bg-[#0a0a0a]">
                <h1 className="text-xl">Not Logged In ❌</h1>
            </div>
        );
    }

    return (
        <>
            <DashNavbar />
            <DSARoadmap />
        </>
    );
};

export default Dashboard;