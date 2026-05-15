import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import UserDetail from "./components/UserDetail";
import OverallProgress from "./components/overallProgress";
import Milestone from "./components/milestone";
import ConsistencyBar from "./components/consistencybar";
import ContestRating from "./components/contestrating";
import Suggestion from "./components/suggestion";

function Profile() {

    return (
        <div
            className="
                w-full
                min-h-screen
                bg-[#070709]
                flex
                flex-col
                md:flex-row
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
            <div
                className="
                   w-full
                   md:w-[280px]
                   xl:w-[320px]
                   md:h-[calc(100vh-24px)]
                    rounded-2xl
                    md:rounded-3xl
                    border
                    border-white/5
                    bg-white/8
                    backdrop-blur-xl
                    overflow-hidden
                "
            >
                <UserDetail />
            </div>

            <div
                className="
                   flex-1
                   md:h-[calc(100vh-24px)]
                   overflow-y-auto
                   space-y-4
                "
            >
                <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_1px_0.85fr] w-full rounded-2xl border border-white/5 bg-white/8 overflow-hidden">
                    <OverallProgress />
                    <div
                        className="
                            hidden
                            xl:block
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
                        rounded-2xl
                        bg-white/8
                    "
                >
                    <ConsistencyBar />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">
                    <Suggestion />
                    <ContestRating />
                </div>

            </div>



        </div>

    );

}

export default Profile;
