import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckSquare, Award, ChevronRight, Play, ExternalLink, X, Search } from "lucide-react";
import { questionService } from "../../../services/questionService";

export default function RecentActivity({ userId }) {
    const [recentSolved, setRecentSolved] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(true);
    const [recommendedQuestion, setRecommendedQuestion] = useState(null);
    const [loadingRec, setLoadingRec] = useState(true);
    const [activeTab, setActiveTab] = useState("recent");

    const [showModal, setShowModal] = useState(false);
    const [allSubmissions, setAllSubmissions] = useState([]);
    const [loadingAll, setLoadingAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpenModal = async () => {
        setShowModal(true);
        setLoadingAll(true);
        try {
            const response = await questionService.getRecentSolved({ all: true });
            if (response.data?.success) {
                setAllSubmissions(response.data.recentSolved || []);
            }
        } catch (error) {
            console.error("Failed to fetch all submissions:", error);
        } finally {
            setLoadingAll(false);
        }
    };

    useEffect(() => {
        if (!userId) return;

        let mounted = true;
        
        // Fetch recent solved questions
        const fetchRecentSolved = async () => {
            setLoadingRecent(true);
            try {
                const response = await questionService.getRecentSolved();
                if (mounted && response.data?.success) {
                    setRecentSolved(response.data.recentSolved || []);
                }
            } catch (error) {
                console.error("Failed to load recent solved questions:", error);
            } finally {
                if (mounted) {
                    setLoadingRecent(false);
                }
            }
        };

        // Fetch recommended next question
        const fetchRecommendation = async () => {
            setLoadingRec(true);
            try {
                const response = await questionService.getRecommendation();
                if (mounted && response.data?.success) {
                    setRecommendedQuestion(response.data.recommendedQuestion);
                }
            } catch (error) {
                console.error("Failed to load recommended question:", error);
            } finally {
                if (mounted) {
                    setLoadingRec(false);
                }
            }
        };

        fetchRecentSolved();
        fetchRecommendation();

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
        { id: "recommendation", label: "Recommendation", icon: <Award size={14} /> },
    ];

    const filteredSubmissions = allSubmissions.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pattern?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full rounded-2xl bg-[#121215]/60 border border-white/[0.05] shadow-lg backdrop-blur-md p-6 relative min-h-[220px]">
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

                <button 
                    onClick={handleOpenModal}
                    className="text-xs text-white/40 hover:text-white transition flex items-center gap-0.5 cursor-pointer bg-transparent border-none outline-none font-semibold"
                >
                    View all submissions
                    <ChevronRight size={12} />
                </button>
            </div>

            {/* Content Body */}
            {activeTab === "recent" ? (
                loadingRecent ? (
                    /* Skeleton Loader for Recent */
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
                )
            ) : (
                /* Recommendation Tab */
                loadingRec ? (
                    /* Skeleton Loader for Recommendation */
                    <div className="p-4 bg-white/3 border border-white/5 rounded-xl animate-pulse">
                        <div className="h-5 bg-white/10 rounded w-1/2 mb-3" />
                        <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
                        <div className="h-10 bg-white/10 rounded w-full" />
                    </div>
                ) : !recommendedQuestion ? (
                    <div className="text-center py-8 text-white/30 text-xs">
                        Congratulations! You have completed all DSA questions.
                    </div>
                ) : (
                    /* Recommended Question Display Card */
                    <div className="p-5 bg-white/3 border border-white/5 rounded-xl hover:border-white/10 transition duration-150 relative overflow-hidden flex flex-col gap-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                                <span className="text-[10px] text-[#F46717] font-bold uppercase tracking-wider bg-[#F46717]/10 px-2.5 py-0.5 rounded-full border border-[#F46717]/20">
                                    SOLVE NEXT
                                </span>
                                <h3 className="text-lg font-bold text-white mt-2 leading-snug">
                                    {recommendedQuestion.problemNumber ? `${recommendedQuestion.problemNumber}. ` : ""}{recommendedQuestion.title}
                                </h3>
                                <p className="text-xs text-white/50 mt-1 capitalize font-medium">
                                    {recommendedQuestion.topic} Topic • {recommendedQuestion.pattern?.replace(/-/g, " ")} Pattern
                                </p>
                            </div>

                            <span className={`
                                px-2.5 py-0.5 rounded-full text-xs font-semibold border
                                ${recommendedQuestion.difficulty === "Easy"
                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                    : recommendedQuestion.difficulty === "Hard"
                                    ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                    : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                }
                            `}>
                                {recommendedQuestion.difficulty}
                            </span>
                        </div>

                        {recommendedQuestion.estimatedTime && (
                            <div className="flex items-center gap-1.5 text-xs text-white/40">
                                <span>Estimated time:</span>
                                <span className="text-white/60 font-semibold">{recommendedQuestion.estimatedTime}</span>
                            </div>
                        )}

                        <a
                            href={recommendedQuestion.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                inline-flex 
                                items-center 
                                justify-center 
                                gap-2 
                                w-full 
                                px-4 
                                py-3 
                                rounded-xl 
                                bg-orange-500 
                                text-white 
                                font-bold 
                                text-sm 
                                hover:bg-orange-600 
                                transition-all 
                                duration-150 
                                shadow-lg 
                                shadow-orange-500/20
                                cursor-pointer
                                select-none
                            "
                        >
                            <Play size={14} fill="currentColor" />
                            Practice on LeetCode
                            <ExternalLink size={12} className="opacity-70 ml-0.5" />
                        </a>
                    </div>
                )
            )}
            {/* Submissions History Modal */}
            {showModal && createPortal(
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
                    onClick={() => { setShowModal(false); setSearchTerm(""); }}
                >
                    <div 
                        className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#141416] p-6 text-white shadow-2xl relative flex flex-col max-h-[85vh] animate-in fade-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 mb-4 flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-bold">Solved History</h2>
                                <p className="text-xs text-white/40 mt-1">Complete record of your accepted submissions ({allSubmissions.length} total)</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setShowModal(false); setSearchTerm(""); }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative mb-4 flex-shrink-0">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search by title, topic, or pattern..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-10 text-sm text-white placeholder-white/35 focus:outline-none focus:border-white/20 focus:bg-white/8 transition-all"
                            />
                        </div>

                        {/* List Area */}
                        <div className="overflow-y-auto space-y-2 pr-1 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {loadingAll ? (
                                <div className="space-y-3 py-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3.5 bg-white/3 border border-white/5 rounded-xl animate-pulse">
                                            <div className="h-4 bg-white/10 rounded w-1/3" />
                                            <div className="h-3 bg-white/10 rounded w-16" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredSubmissions.length === 0 ? (
                                <div className="text-center py-8 text-white/30 text-xs">
                                    {searchTerm ? "No matching solved questions found." : "No solved questions found."}
                                </div>
                            ) : (
                                filteredSubmissions.map((item) => (
                                    <a
                                        key={item.problemId}
                                        href={item.leetcodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                                                    {item.problemNumber ? `${item.problemNumber}. ` : ""}{item.title}
                                                </span>
                                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-60 text-white/60 transition-opacity" />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-white/40">
                                                <span className="capitalize">{item.topic?.replace(/-/g, " ")}</span>
                                                <span>•</span>
                                                <span className="capitalize">{item.pattern?.replace(/-/g, " ")}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`
                                                px-2 py-0.5 rounded-full text-[10px] font-semibold border
                                                ${item.difficulty === "Easy"
                                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                    : item.difficulty === "Hard"
                                                    ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                                                    : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                                }
                                            `}>
                                                {item.difficulty}
                                            </span>
                                            <span className="text-[10px] text-white/30 font-light">
                                                {formatTimeAgo(item.solvedAt)}
                                            </span>
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
