import { useEffect, useState } from "react";
import DashboardPageShell from "../dashboard/components/DashboardPageShell";
import UserDetail from "./components/UserDetail";
import OverallProgress from "./components/overallProgress";
import Milestone from "./components/milestone";
import PlacementReadinessCard from "./components/PlacementReadinessCard";
// import TopicProgress from "./components/TopicProgress";
import WeakConceptAnalysis from "./components/WeakConceptAnalysis";
import ConsistencyBar from "./components/consistencybar";
import ContestRating from "./components/contestrating";
import Suggestion from "./components/suggestion";
import RecentActivity from "./components/RecentActivity";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/apiClient";

function Profile() {
    const { user } = useAuth();
    const [progressData, setProgressData] = useState(null);
    const [progressLoading, setProgressLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchProgress = async () => {
            setProgressLoading(true);
            try {
                const response = await apiClient.get("/questions/progress");
                if (isMounted && response.data?.success) {
                    setProgressData(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch overall progress:", err);
            } finally {
                if (isMounted) {
                    setProgressLoading(false);
                }
            }
        };

        fetchProgress();
        return () => {
            isMounted = false;
        };
    }, [user?._id]);

    return (
        <DashboardPageShell className="pt-1 pl-0 pr-0 sm:pr-2 pb-1 flex flex-col lg:flex-row gap-5 lg:gap-5" plain={true} bgClass="bg-[#070709]">
            {/* Left Column: User Detail Card wrapper */}
            <div
                className="
                       w-full
                       lg:w-[280px]
                       2xl:w-[320px]
                       h-fit
                       lg:h-full
                        rounded-2xl
                        md:rounded-3xl
                        border
                        border-white/8
                        bg-white/8
                        
                        overflow-hidden
                        flex-shrink-0
                    "
            >
                <UserDetail />
            </div>

            {/* Main Content Area */}
            <div
                className="
                       flex-1
                       min-w-0
                       space-y-5
                       lg:space-y-5
                       h-fit
                    "
            >
                <PlacementReadinessCard progressData={progressData} loading={progressLoading} />

                {/* Row 1: Overall Progress & Badges Earned (Side-by-side) */}
                <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-4 lg:gap-5 w-full min-w-0 items-stretch">
                    <OverallProgress progressData={progressData} loading={progressLoading} />
                    <Milestone progressData={progressData} loading={progressLoading} />
                </div>

                {/* Row 2: Learning Progress (Horizontal Compact block) */}
                {/* <TopicProgress topics={progressData?.topics || []} loading={progressLoading} /> */}

                {/* DSA Solve Capability & Weak Point Analyzer */}
                <WeakConceptAnalysis progressData={progressData} loading={progressLoading} />

                {/* Row 3: Heatmap (Consistency chart) */}
                <ConsistencyBar userId={user?._id} />

                {/* Row 4: Recent Activity */}
                <RecentActivity userId={user?._id} />
            </div>
        </DashboardPageShell>
    );

}

export default Profile;
