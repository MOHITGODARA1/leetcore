import { useParams } from "react-router-dom";
import DashLeftNavBar from "../dashboard/components/dashleftnavbar";
import Docsleftnavbar from "./components/leftdocs";
import DocsContent from "./components/DocsContent";
import docs from "../Docs/docs.json";

function Docomentation(){
    const { topic } = useParams();
    const topicKey = decodeURIComponent(topic || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const doc = docs[topicKey];

    return(
        <>
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
            <div
                className="
                    flex-1
                    h-[calc(100vh-112px)]
                    md:h-[calc(100vh-24px)]
                    overflow-hidden
                    rounded-2xl
                    md:rounded-3xl
                    border
                    border-white/5
                    bg-white/8
                    backdrop-blur-xl
                "
            >
                <div className="flex h-full min-h-0 flex-col lg:flex-row">
                    <Docsleftnavbar doc={doc} topicName={decodeURIComponent(topic || "")} />
                    <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                        <DocsContent doc={doc} />
                    </div>
                </div>
            </div>
         </div>
        </>
    )
}
export default Docomentation;
