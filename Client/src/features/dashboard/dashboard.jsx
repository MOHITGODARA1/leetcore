import DashLeftNavBar from "./components/dashleftnavbar";
import Dashmain from "./components/dashmain";
import DashRightNavBar from "./components/dashrightnavbar";

function Dashboard() {

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

            {/* Main Section */}
            <div
                className="
                    flex-1
                    min-h-[calc(100vh-112px)]
                    md:h-[calc(100vh-24px)]
                    overflow-y-auto
                    rounded-2xl
                    md:rounded-3xl
                    border
                    border-white/5
                    bg-white/8
                    backdrop-blur-xl
                "
            >
                <Dashmain />
            </div>

            {/* Right Sidebar */}
            <div
                className="
                    hidden
                    xl:block
                    w-[320px]
                    2xl:w-[360px]
                    h-[calc(100vh-24px)]
                    overflow-y-auto
                    rounded-3xl
                    border
                    border-white/5
                    bg-white/8
                    backdrop-blur-xl
                    flex-shrink-0
                "
            >
                <DashRightNavBar />
            </div>

        </div>

    );

}

export default Dashboard;
