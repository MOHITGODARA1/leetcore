import DashLeftNavBar from "./components/dashleftnavbar";
import DashMain from "./components/dashmain";
import DashRightNavBar from "./components/dashrightnavbar";

function Dashboard({ user }) {

    return (

        <div
            className="
                w-full
                min-h-screen
                bg-[#070709]
                flex
                gap-3
                p-3
                overflow-hidden
            "
        >

            {/* Left Navbar */}
            <div
                className="
                    w-[85px]
                    lg:w-[90px]
                    h-[calc(100vh-24px)]
                    flex-shrink-0
                "
            >
                <DashLeftNavBar />
            </div>

            {/* Main Section */}
            <div
                className="
                    flex-1
                    h-[calc(100vh-24px)]
                    overflow-y-auto
                    rounded-3xl
                    border
                    border-white/5
                    bg-white/8
                    backdrop-blur-xl
                "
            >
                <DashMain />
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