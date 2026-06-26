import { useParams } from "react-router-dom";
import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import PatternQuestions from "./PatternQuestions";

function Practice() {
    const { topic } = useParams();
    const topicName = decodeURIComponent(topic || "");

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

            <main
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
                    p-6
                "
            >
                <div>
                    <PatternQuestions embedded topicNameOverride={topicName} />
                </div>
            </main>
        </div>
    );
}

export default Practice;
