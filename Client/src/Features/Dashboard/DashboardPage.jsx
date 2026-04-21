import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import DashNavbar from "../../Components/dahboardnav";
import LeftNavbar from "./component/Leftnavbar";
import RightNavbar from "./component/RightNavbar";
import DSAGraph from "./Graphs/DsaGraph";
import OSGraph from "./Graphs/operatingSystemGraph";
import NetworkGraph from "./Graphs/NetworkGraph";
import DBsGraph from "./Graphs/DbmsGraph";
import OOPSGraph from "./Graphs/OOPSGraph";
import LLDGraph from "./Graphs/LLDGraph";
import SystemDesgineGraph from "./Graphs/SystemDesgine";
import InterviewPrepGraph from "./Graphs/InterviewPrep";

const Dashboard = () => {
    const { subject } = useParams();
    const activeSubject = subject ? subject.toLowerCase() : "dsa";
    const API_URL = import.meta.env.VITE_API_URL;

    const [leftOpen, setLeftOpen] = useState(false);
    const leftRef = useRef(null);

    // Close left drawer when clicking outside
    useEffect(() => {
        if (!leftOpen) return;
        const handleClick = (e) => {
            if (leftRef.current && !leftRef.current.contains(e.target)) {
                setLeftOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("touchstart", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("touchstart", handleClick);
        };
    }, [leftOpen]);

    // Close drawer on route/subject change
    useEffect(() => {
        setLeftOpen(false);
    }, [subject]);

    const renderGraph = () => {
        switch (activeSubject) {
            case "dsa": return <DSAGraph />;
            case "operating-system": return <OSGraph />;
            case "networks": return <NetworkGraph />;
            case "dbms": return <DBsGraph />;
            case "oops": return <OOPSGraph />;
            case "lld": return <LLDGraph />;
            case "system-design": return <SystemDesgineGraph />;
            case "interview-prep": return <InterviewPrepGraph />;
            default: return <DSAGraph />;
        }
    };

    return (
        <>
            {/* Navbar — pass hamburger toggle & state */}
            <DashNavbar
                onHamburgerClick={() => setLeftOpen((v) => !v)}
                hamburgerOpen={leftOpen}
            />

            <div className="flex h-screen overflow-hidden">

                {/* ── Left Sidebar ── */}
                {/* Desktop: always visible, fixed */}
                <div className="hidden lg:block fixed top-0 left-0 h-full z-30">
                    <LeftNavbar />
                </div>

                {/* Mobile: drawer overlay */}
                {leftOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 flex">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        {/* Drawer */}
                        <div
                            ref={leftRef}
                            className="relative z-50 h-full"
                            style={{ width: "256px" }}
                        >
                            <LeftNavbar />
                        </div>
                    </div>
                )}

                {/* ── Center Content ── */}
                <div
                    className="
                        flex-1
                        mt-[10vh] h-[90vh]
                        bg-[#0d0f11]
                        relative z-10
                        overflow-hidden
                        lg:ml-64 lg:mr-80
                    "
                >
                    {renderGraph()}
                </div>

                {/* ── Right Sidebar ── desktop only ── */}
                <div className="hidden lg:block fixed top-0 right-0 h-full z-30">
                    <RightNavbar />
                </div>
            </div>
        </>
    );
};

export default Dashboard;