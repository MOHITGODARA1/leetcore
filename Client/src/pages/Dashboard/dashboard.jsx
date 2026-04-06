import { useEffect, useState } from "react";
import DashNavbar from "../../Components/dahboardnav";
import LeftNavbar from "./component/Leftnavbar";
import RightNavbar from "./component/RightNavbar";
import DSAGraph from "./component/Graphs/DSAGraph";
import OSGraph from "./component/Graphs/operatingSystemGraph";
import NetworkGraph from "./component/Graphs/NetworkGraph";
import DBsGraph from "./component/Graphs/DbmsGraph";
import OOPSGraph from "./component/Graphs/OOPSGraph";
import LLDGraph from "./component/Graphs/LLDGraph";
import SystemDesgineGraph from "./component/Graphs/SystemDesgine";
import InterviewPrepGraph from "./component/Graphs/InterviewPrep";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSubject, setActiveSubject] = useState("DSA");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/profile`, {
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then(data => {
                setUser(data.user); // ✅ FIXED
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, [API_URL]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center text-white bg-[#0a0a0a]">
                <h1 className="text-xl">Not Logged In ❌</h1>
            </div>
        );
    }

    const renderGraph = () => {
        switch (activeSubject) {
            case "DSA": return <DSAGraph />;
            case "Operating System": return <OSGraph />;
            case "Networks": return <NetworkGraph />;
            case "DBMS": return <DBsGraph />;
            case "OOPS": return <OOPSGraph />;
            case "Low Level Design": return <LLDGraph />;
            case "System Design": return <SystemDesgineGraph />;
            case "Interview Prep": return <InterviewPrepGraph />;
            default: return <DSAGraph />;
        }
    };

    return (
        <>
            <DashNavbar />
            <div className="flex">

                {/* Left Sidebar */}
                <LeftNavbar
                    active={activeSubject}
                    setActive={setActiveSubject}
                />

                {/* Center Content (FIXED) */}
                <div className="ml-64 mr-80 mt-[10vh] h-[90vh] w-full bg-[#0d0f11] relative z-10">
                    {renderGraph()}
                </div>

                {/* Right Sidebar */}
                <RightNavbar />
            </div>
        </>
    );
};

export default Dashboard;