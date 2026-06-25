import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import UserDetail from "./components/UserDetail";
import OverallProgress from "./components/overallProgress";
import Milestone from "./components/milestone";
import ConsistencyBar from "./components/consistencybar";
import ContestRating from "./components/contestrating";
import Suggestion from "./components/suggestion";
import RecentActivity from "./components/RecentActivity";
import { useAuth } from "../../context/AuthContext";

function Profile() {
    const { user } = useAuth();

    return (
        <div
            className="
                w-full
                min-h-screen
                bg-[#070709]
                flex
                flex-col
                lg:flex-row
                gap-3
                p-3
                overflow-x-hidden
            "
        >

            {/* Left Navbar */}
            <div
                className="
                    w-full
                    md:w-[85px]
                    lg:w-[90px]
                    md:h-[calc(100vh-24px)]
                    flex-shrink-0
                "
            >
                <DashLeftNavBar />
            </div>
            {/* Scrollable container for Profile card and Main Dashboard content */}
            <div
                className="
                   flex-1
                   min-w-0
                   md:h-[calc(100vh-24px)]
                   overflow-y-auto
                   overflow-x-hidden
                   flex
                   flex-col
                   lg:flex-row
                   gap-3
                   pr-1
                "
            >
                {/* User Detail Card wrapper */}
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
                        border-white/5
                        bg-white/8
                        backdrop-blur-xl
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
                       space-y-4
                       h-fit
                    "
                >
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_1px_minmax(220px,0.8fr)] w-full min-w-0 rounded-2xl border border-white/5 bg-white/8 overflow-hidden">
                        <OverallProgress />
                        <div
                            className="
                                hidden
                                lg:block
                                w-px
                                h-[85%]
                                bg-white/20
                                self-center
                            "
                        />
                        <Milestone />
                    </div>
                    <div
                        className="
                            w-full
                            bg-white/8
                        "
                    >
                        <ConsistencyBar userId={user?._id} />
                    </div>
                    <div
                        className="
                            w-full
                            bg-white/8
                        "
                    >
                        <RecentActivity userId={user?._id} />
                    </div>
                </div>
            </div>



        </div>

    );

}

export default Profile;
