import { useState } from "react";
import DashNavbar from "../../../Components/dahboardnav";
import ContentrightNav from "../../ContentComponent/ContentrightNav";
import ContentNavbar from "../../../Components/ContentNav";
import Stack from "../Content/Stack";
import PracticeArray from "../Components/PracticeQuestion";
import Arraydiscussion from "../../Discussion/Arraydiscussion";
import VideoSuggestion from "../Components/VideoSuggestion";
function Stackpage() {
    const [activeTab, setActiveTab] = useState("doc"); // ✅ default active

    return (
        <div className=" min-h-screen text-white flex flex-col">
            <DashNavbar />

            <div className="flex-1 pt-[70px] flex">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* ✅ pass state */}
                    <ContentNavbar active={activeTab} setActive={setActiveTab} />

                    <div className="p-8 lg:p-12 xl:px-16 pb-20 max-w-7xl mx-auto w-full">

                        {/* ✅ conditional rendering */}
                        {activeTab === "doc" && <Stack />}
                        {activeTab === "video" && <VideoSuggestion />}
                        {activeTab === "practice" && <PracticeArray />}
                        {activeTab === "discussion" && <Arraydiscussion />}

                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-94 flex-shrink-0 p-6 hidden lg:block mr-2">
                    <div className="sticky top-[94px] h-[calc(100vh-120px)]">
                        <ContentrightNav />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stackpage;