import { useEffect, useState } from "react";
import { CheckSquare, List, Code, MessageSquare, ChevronRight } from "lucide-react";
import { questionService } from "../../../services/questionService";

export default function RecentActivity({ userId }) {
    const [recentSolved, setRecentSolved] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("recent");

    useEffect(() => {
        if (!userId) return;

        let mounted = true;
        const fetchRecentSolved = async () => {
            setLoading(true);
            try {
                const response = await questionService.getRecentSolved();
                if (mounted && response.data?.success) {
                    setRecentSolved(response.data.recentSolved || []);
                }
            } catch (error) {
                console.error("Failed to load recent solved questions:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchRecentSolved();

        return () => {
            mounted = false;
        };
    }, [userId]);

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffSecs < 60) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const tabs = [
        { id: "recent", label: "Recent AC", icon: <CheckSquare size={14} /> },
        { id: "list", label: "List", icon: <List size={14} /> },
        { id: "solutions", label: "Solutions", icon: <Code size={14} /> },
        { id: "discuss", label: "Discuss", icon: <MessageSquare size={14} /> },
    ];

    return (
        <div className="w-full rounded-xl bg-[#1F1F22] border border-white/5 p-6 relative min-h-[220px]">
            {/* Tab Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-xl">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-3 
                                    py-1.5 
                                    rounded-lg 
                                    text-xs 
                                    font-semibold 
                                    transition-all 
                                    flex 
                                    items-center 
                                    gap-2
                                    ${isActive ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white"}
                                `}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <button className="text-xs text-white/40 hover:text-white transition flex items-center gap-0.5 cursor-pointer">
                    View all submissions
                    <ChevronRight size={12} />
                </button>
            </div>

            {/* Content Body */}
            {activeTab !== "recent" ? (
                <div className="text-center py-8 text-white/30 text-xs">
                    No items in this tab.
                </div>
            ) : loading ? (
                /* Skeleton Loader */
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl animate-pulse"
                        >
                            <div className="h-4 bg-white/10 rounded w-1/3" />
                            <div className="h-3 bg-white/10 rounded w-16" />
                        </div>
                    ))}
                </div>
            ) : recentSolved.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-xs">
                    No recent solved questions found.
                </div>
            ) : (
                /* Recent AC List */
                <div className="space-y-2">
                    {recentSolved.map((item) => (
                        <div
                            key={item.problemId}
                            className="
                                flex 
                                items-center 
                                justify-between 
                                p-3.5 
                                bg-white/3
                                border 
                                border-white/5 
                                rounded-xl 
                                hover:bg-white/5
                                hover:border-white/10
                                transition-all
                                duration-150
                                group 
                                cursor-pointer
                            "
                        >
                            <span className="text-sm text-white/80 group-hover:text-white font-medium transition-colors">
                                {item.title}
                            </span>
                            <span className="text-xs text-white/40 font-light">
                                {formatTimeAgo(item.solvedAt)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
