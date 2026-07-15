import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardPageShell from "../dashboard/components/DashboardPageShell";
import Docsleftnavbar from "./components/leftdocs";
import DocsContent from "./components/DocsContent";
import docs from "../Docs/docs.json";
import { ChevronRight } from "lucide-react";

function Docomentation() {
    const { topic } = useParams();
    const topicKey = decodeURIComponent(topic || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const doc = docs[topicKey];
    const scrollRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [topicKey]);

    return (
        <DashboardPageShell className="h-[calc(100vh-112px)] min-h-0 overflow-hidden" contentClass="border-white/5 bg-white/8 backdrop-blur-xl">
            <div className="flex h-full min-h-0 flex-col lg:flex-row relative">
                <Docsleftnavbar 
                    doc={doc} 
                    topicName={decodeURIComponent(topic || "")} 
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <div ref={scrollRef} className="min-h-0 min-w-0 flex-1 overflow-y-auto relative">
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="absolute top-4 left-4 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0f0f11]/90 text-white/70 hover:text-white hover:bg-white/10 hover:border-orange-500/30 transition-all duration-200 shadow-md backdrop-blur-md"
                            title="Show Sidebar"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}
                    <DocsContent doc={doc} />
                </div>
            </div>
        </DashboardPageShell>
    );
}

export default Docomentation;
