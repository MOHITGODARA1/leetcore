import { useEffect, useState } from "react";
import {
    Award as AwardIcon, Lock, X, ArrowLeft,
    Target, Compass, Map, Activity, ShieldCheck, Crown,
    Flame, Zap, Gem, Dumbbell, Trophy,
    Code, Type, Link as LinkIcon, Layers, ListCollapse, GitFork, Network
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import BadgeModal from "../../gamification/components/BadgeModal";
import { createPortal } from "react-dom";
import { useDashboardStats } from "../../gamification/hooks/useDashboardStats";
import { BadgeIcon } from "./BadgeIcon";

// 19 Local Predefined Badges with Unique Icons and Gradients
const PREDEFINED_ACHIEVEMENTS = [
    // Question Milestones
    {
        name: "The Initiator",
        slug: "initiator",
        description: "Solve 20 tracked problems.",
        category: "study",
        rarity: "common",
        xpReward: 100,
        icon: Target,
        gradient: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
        check: (stats) => stats.solved >= 20
    },
    {
        name: "Problem Solver",
        slug: "problem-solver",
        description: "Solve 50 tracked problems.",
        category: "study",
        rarity: "common",
        xpReward: 200,
        icon: Compass,
        gradient: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
        check: (stats) => stats.solved >= 50
    },
    {
        name: "DSA Explorer",
        slug: "dsa-explorer",
        description: "Solve 100 tracked problems.",
        category: "study",
        rarity: "rare",
        xpReward: 400,
        icon: Map,
        gradient: "from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]",
        check: (stats) => stats.solved >= 100
    },
    {
        name: "Algorithm Addict",
        slug: "algo-addict",
        description: "Solve 250 tracked problems.",
        category: "study",
        rarity: "rare",
        xpReward: 600,
        icon: Activity,
        gradient: "from-purple-500/20 to-fuchsia-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]",
        check: (stats) => stats.solved >= 250
    },
    {
        name: "Core Master",
        slug: "core-master",
        description: "Solve 500 tracked problems.",
        category: "study",
        rarity: "epic",
        xpReward: 1000,
        icon: ShieldCheck,
        gradient: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
        check: (stats) => stats.solved >= 500
    },
    {
        name: "LeetCore Legend",
        slug: "leetcore-legend",
        description: "Solve 1000 tracked problems.",
        category: "study",
        rarity: "legendary",
        xpReward: 2000,
        icon: Crown,
        gradient: "from-yellow-400/30 to-amber-500/20 border-yellow-500/40 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.25)] border-dashed",
        check: (stats) => stats.solved >= 1000
    },
    
    // Streaks
    {
        name: "Week Warrior",
        slug: "week-warrior",
        description: "Maintain a 7-day learning streak.",
        category: "streak",
        rarity: "rare",
        xpReward: 250,
        icon: Flame,
        gradient: "from-orange-500/25 to-red-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]",
        check: (stats) => stats.streak >= 7
    },
    {
        name: "Consistency Champion",
        slug: "consistency-champion",
        description: "Maintain a 14-day learning streak.",
        category: "streak",
        rarity: "rare",
        xpReward: 500,
        icon: Flame,
        gradient: "from-rose-500/25 to-pink-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
        check: (stats) => stats.streak >= 14
    },
    {
        name: "Unbreakable",
        slug: "unbreakable",
        description: "Maintain a 30-day learning streak.",
        category: "streak",
        rarity: "epic",
        xpReward: 1000,
        icon: Gem,
        gradient: "from-cyan-500/25 to-teal-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]",
        check: (stats) => stats.streak >= 30
    },
    {
        name: "Iron Discipline",
        slug: "iron-discipline",
        description: "Maintain a 60-day learning streak.",
        category: "streak",
        rarity: "epic",
        xpReward: 1800,
        icon: Dumbbell,
        gradient: "from-slate-500/25 to-zinc-500/10 border-zinc-500/30 text-zinc-300 shadow-[0_0_10px_rgba(100,116,139,0.1)]",
        check: (stats) => stats.streak >= 60
    },
    {
        name: "Annual Warrior",
        slug: "annual-warrior",
        description: "Maintain a 365-day learning streak.",
        category: "streak",
        rarity: "legendary",
        xpReward: 5000,
        icon: Trophy,
        gradient: "from-yellow-500/25 to-orange-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
        check: (stats) => stats.streak >= 365
    },

    // Topic Completion
    {
        name: "Array Master",
        slug: "array-master",
        description: "Master all questions in the Arrays topic.",
        category: "mastery",
        rarity: "rare",
        xpReward: 500,
        icon: Code,
        gradient: "from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.1)]",
        check: (stats) => stats.isTopicComplete("Array")
    },
    {
        name: "String Specialist",
        slug: "string-specialist",
        description: "Master all questions in the Strings topic.",
        category: "mastery",
        rarity: "rare",
        xpReward: 500,
        icon: Type,
        gradient: "from-pink-500/20 to-purple-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.1)]",
        check: (stats) => stats.isTopicComplete("String")
    },
    {
        name: "Hashing Hero",
        slug: "hashing-hero",
        description: "Master all questions in the Hashing topic.",
        category: "mastery",
        rarity: "rare",
        xpReward: 500,
        icon: Code,
        gradient: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
        check: (stats) => stats.isTopicComplete("Hashing")
    },
    {
        name: "Search Master",
        slug: "search-master",
        description: "Master all questions in the Binary Search topic.",
        category: "mastery",
        rarity: "rare",
        xpReward: 500,
        icon: Target,
        gradient: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.1)]",
        check: (stats) => stats.isTopicComplete("Binary Search")
    },
    {
        name: "Linked List Expert",
        slug: "linked-list-expert",
        description: "Master all questions in the Linked List topic.",
        category: "mastery",
        rarity: "rare",
        xpReward: 500,
        icon: LinkIcon,
        gradient: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.1)]",
        check: (stats) => stats.isTopicComplete("Linked List")
    },
    {
        name: "Stack Sensei",
        slug: "stack-sensei",
        description: "Master all questions in the Stack topic.",
        category: "mastery",
        rarity: "rare",
        xpReward: 500,
        icon: Layers,
        gradient: "from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]",
        check: (stats) => stats.isTopicComplete("Stack")
    },
    {
        name: "Queue Commander",
        slug: "queue-commander",
        description: "Master all questions in the Queue topic.",
        category: "mastery",
        rarity: "rare",
        xpReward: 500,
        icon: ListCollapse,
        gradient: "from-lime-500/20 to-green-500/10 border-lime-500/30 text-lime-400 shadow-[0_0_10px_rgba(132,204,22,0.1)]",
        check: (stats) => stats.isTopicComplete("Queue")
    }
];

function Milestone({ progressData, loading: progressLoading }) {
    const { user } = useAuth();
    const { data: dashboardData } = useDashboardStats(user?._id);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        if (!showGallery) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setShowGallery(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showGallery]);

    if (progressLoading) {
        return (
            <div className="w-full h-full bg-[#121215]/60 border border-white/[0.05] rounded-2xl p-5 text-white shadow-lg backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[200px] sm:min-h-[238px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                
                {/* Header Skeleton */}
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1.5">
                        <div className="w-[110px] h-[16px] rounded bg-white/[0.03] shimmer-skeleton" />
                        <div className="w-[80px] h-[12px] rounded bg-white/[0.03] shimmer-skeleton mt-1" />
                    </div>
                    <div className="w-[20px] h-[20px] rounded bg-white/[0.03] shimmer-skeleton" />
                </div>

                {/* Badges Layout Area Skeleton */}
                <div className="space-y-4 my-auto">
                    {/* 1. First Three Badges Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-2">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/[0.03] shimmer-skeleton" />
                                <div className="w-[70px] h-[12px] rounded bg-white/[0.03] shimmer-skeleton" />
                                <div className="w-[45px] h-[10px] rounded bg-white/[0.03] shimmer-skeleton" />
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.03]" />

                    {/* 2. Secondary Badges list */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="w-9 h-9 rounded-full bg-white/[0.03] shimmer-skeleton" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Resolve Stats for qualification checks
    const solved = typeof user?.stats?.totalProblemsSolved === "number"
        ? user.stats.totalProblemsSolved
        : progressData?.totalSolved || 0;
    const streak = typeof user?.stats?.maxStreak === "number"
        ? user.stats.maxStreak
        : dashboardData?.stats?.maxStreak || user?.stats?.maxStreak || 0;
    const topics = progressData?.topics || [];
    
    const isTopicComplete = (topicName) => {
        const topicObj = topics.find(t => t.topic === topicName || t.name === topicName);
        return topicObj ? (topicObj.solved >= topicObj.total && topicObj.total > 0) : false;
    };

    const statsContext = { solved, streak, isTopicComplete };

    // Resolve lock status for each badge
    const earnedSlugs = new Set();
    const activeBadgesList = user?.badges || [];
    activeBadgesList.forEach(ub => {
        const badge = ub.badgeId || ub;
        if (badge.slug) earnedSlugs.add(badge.slug);
    });

    const finalBadgeCollection = PREDEFINED_ACHIEVEMENTS.map(badge => {
        const isUnlocked = earnedSlugs.has(badge.slug) || (badge.check && badge.check(statsContext));
        
        let earnedAtDate = null;
        if (isUnlocked) {
            const match = activeBadgesList.find(ub => (ub.badgeId?.slug || ub.slug) === badge.slug);
            earnedAtDate = match?.earnedAt || new Date();
        }

        return {
            ...badge,
            unlocked: isUnlocked,
            earnedAt: earnedAtDate
        };
    });

    const unlockedCount = finalBadgeCollection.filter(b => b.unlocked).length;
    const totalCount = finalBadgeCollection.length;

    // Categorized groups for modal
    const studyBadges = finalBadgeCollection.filter(b => b.category === "study");
    const streakBadges = finalBadgeCollection.filter(b => b.category === "streak");
    const masteryBadges = finalBadgeCollection.filter(b => b.category === "mastery" || b.category === "problem-solving");

    const renderBadgeCard = (badge, idx) => {
        const IconComp = badge.icon || AwardIcon;
        return (
            <div
                key={idx}
                onClick={() => setSelectedBadge(badge)}
                className={`
                    group relative flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer
                    ${badge.unlocked 
                        ? `${badge.gradient} hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(249,115,22,0.12)]` 
                        : "border-white/[0.03] bg-white/[0.01] text-neutral-600 grayscale opacity-40 hover:opacity-55"
                    }
                `}
            >
                {/* Left: BadgeIcon with Lock overlay */}
                <div className="relative flex-shrink-0 flex items-center justify-center w-11 h-11">
                    <BadgeIcon slug={badge.slug} size={44} unlocked={badge.unlocked} className="transition-transform duration-300 group-hover:scale-105" />
                    {!badge.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-[0.5px]">
                            <Lock size={12} className="text-white/80" />
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-neutral-200 group-hover:text-white truncate">
                            {badge.name}
                        </h4>
                        <span className={`text-[7.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border leading-none ${
                            badge.unlocked 
                                ? "bg-orange-500/10 text-orange-400 border-orange-500/20" 
                                : "bg-neutral-800/40 text-neutral-500 border-neutral-700/30"
                        }`}>
                            {badge.unlocked ? "Unlocked" : "Locked"}
                        </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                        {badge.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[8.5px] font-semibold text-neutral-500">
                        <span className="capitalize">{badge.rarity}</span>
                        <span>•</span>
                        <span>+{badge.xpReward} XP</span>
                    </div>
                </div>
            </div>
        );
    };

    // Sort all unlocked badges by earnedAt descending (most recent first)
    const unlockedBadges = finalBadgeCollection
        .filter(b => b.unlocked)
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

    const lockedBadges = finalBadgeCollection.filter(b => !b.unlocked);

    // Combine them, putting the most recent earned badges first
    const displayCollection = [...unlockedBadges, ...lockedBadges];

    // First 3 are featured (Noticeably Larger)
    const featuredBadges = displayCollection.slice(0, 3);

    // Next 6 badges are secondary (Smaller)
    const secondaryBadges = displayCollection.slice(3, 9);

    return (
        <div className="w-full h-full bg-[#121215]/60 border border-white/[0.05] rounded-2xl p-5 text-white shadow-lg backdrop-blur-md relative overflow-hidden transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/[0.02] rounded-full blur-2xl pointer-events-none" />
            
            <Motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col justify-between h-full w-full"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Badges Earned</h3>
                        <p className="text-[10px] text-neutral-500 mt-0.5">Unlocked {unlockedCount} / {totalCount}</p>
                    </div>
                    <button
                        onClick={() => setShowGallery(true)}
                        className="text-base font-bold text-neutral-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                    >
                        →
                    </button>
                </div>

                {/* Badges Layout Area */}
                <div className="space-y-4">
                    
                    {/* 1. First Three Badges (Featured & 30-40% Larger) */}
                    <div className="grid grid-cols-3 gap-3">
                        {featuredBadges.map((badge, idx) => {
                            const IconComp = badge.icon || AwardIcon;
                            return (
                                <Motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBadge(badge)}
                                        title={`${badge.name}: ${badge.description}`}
                                        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 cursor-pointer"
                                    >
                                        <BadgeIcon slug={badge.slug} size={64} unlocked={badge.unlocked} className="transition-transform duration-300 group-hover:scale-110" />
                                        {!badge.unlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-[0.5px]">
                                                <Lock size={14} className="text-white/80" />
                                            </div>
                                        )}
                                    </button>
                                    <span className="text-[10px] font-bold text-neutral-300 mt-1.5 truncate max-w-full leading-tight">
                                        {badge.name}
                                    </span>
                                     <span className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${badge.unlocked ? "text-orange-500/90" : "text-neutral-600"}`}>
                                         {badge.unlocked ? "Unlocked" : "Locked"}
                                     </span>
                                </Motion.div>
                            );
                        })}
                    </div>

                    {/* Divider line */}
                    <div className="h-px bg-white/[0.03]" />

                    {/* 2. Secondary Badges (Smaller) */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {secondaryBadges.map((badge, idx) => {
                            const IconComp = badge.icon || AwardIcon;
                            return (
                                <Motion.button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedBadge(badge)}
                                    title={`${badge.name}: ${badge.description}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 + idx * 0.05, ease: "easeOut" }}
                                    className="group relative flex items-center justify-center w-9 h-9 transition-all duration-300 cursor-pointer"
                                >
                                    <BadgeIcon slug={badge.slug} size={36} unlocked={badge.unlocked} className="transition-transform duration-300 group-hover:scale-110" />
                                    {!badge.unlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-[0.5px]">
                                            <Lock size={10} className="text-white/80" />
                                        </div>
                                    )}
                                </Motion.button>
                            );
                        })}
                    </div>

                </div>
            </Motion.div>

            {/* Gallery Modal Overlay */}
            {showGallery && createPortal(
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
                    onClick={() => setShowGallery(false)}
                >
                    <div 
                        className="w-full max-w-3xl rounded-2xl border border-white/[0.05] bg-[#0e0e12] p-5 sm:p-6 text-white shadow-2xl flex flex-col h-[75vh] max-h-[700px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-4 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowGallery(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
                                    title="Go back"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <h2 className="text-md font-bold tracking-tight">Badges Earned Gallery</h2>
                                    <p className="text-[11px] text-neutral-400 mt-0.5">
                                        Unlocked {unlockedCount} of {totalCount} total achievements
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowGallery(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white cursor-pointer"
                                aria-label="Close achievements"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Content (Categorized Badges) */}
                        <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent">
                            
                            {/* Category 1: Question Milestones */}
                            {studyBadges.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500/90 border-b border-white/[0.02] pb-1.5 text-left">Question Milestones</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        {studyBadges.map((badge, idx) => renderBadgeCard(badge, idx))}
                                    </div>
                                </div>
                            )}

                            {/* Category 2: Streak Badges */}
                            {streakBadges.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500/90 border-b border-white/[0.02] pb-1.5 text-left">Consistency Streaks</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        {streakBadges.map((badge, idx) => renderBadgeCard(badge, idx))}
                                    </div>
                                </div>
                            )}

                            {/* Category 3: Topic Mastery */}
                            {masteryBadges.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500/90 border-b border-white/[0.02] pb-1.5 text-left">Topic Mastery</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        {masteryBadges.map((badge, idx) => renderBadgeCard(badge, idx))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="mt-4 pt-3 border-t border-white/[0.05] text-center font-medium flex-shrink-0">
                            <p className="text-[10px] text-neutral-400">
                                Complete topics and maintain streaks to unlock badges.
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Detailed Badge Info Modal */}
            {selectedBadge && createPortal(
                <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />,
                document.body
            )}
        </div>
    );
}

export default Milestone;
