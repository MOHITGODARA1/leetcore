import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import Patterns from "./pattern";
import Heading from "./heading";

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
                    flex
                    flex-col
                    gap-6
                "
            >
                {/* Navigation Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-white/50 font-medium select-none">
                    <Link
                        to="/dashboard"
                        className="hover:text-orange-400 transition-colors"
                    >
                        DSA
                    </Link>
                    <ChevronRight size={12} />
                    <span className="text-orange-300">{topicName}</span>
                </div>
                
                <div>
                    <Heading />
                </div>
                <div>
                    <Patterns topicName={topicName} />
                </div>
            </main>
        </div>
    );
}

export default Practice;
