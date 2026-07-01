import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DashboardPageShell from "../dashboard/components/DashboardPageShell";
import Docsleftnavbar from "./components/leftdocs";
import DocsContent from "./components/DocsContent";
import docs from "../Docs/docs.json";

function Docomentation() {
    const { topic } = useParams();
    const topicKey = decodeURIComponent(topic || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const doc = docs[topicKey];
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [topicKey]);

    return (
        <DashboardPageShell className="h-[calc(100vh-112px)] min-h-0 overflow-hidden" contentClass="border-white/5 bg-white/8 backdrop-blur-xl">
            <div className="flex h-full min-h-0 flex-col lg:flex-row">
                <Docsleftnavbar doc={doc} topicName={decodeURIComponent(topic || "")} />
                <div ref={scrollRef} className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                    <DocsContent doc={doc} />
                </div>
            </div>
        </DashboardPageShell>
    );
}

export default Docomentation;
