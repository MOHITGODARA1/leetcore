import { useEffect, useState } from "react";
import { Loader2, Flame } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { questionService } from "../../../services/questionService";
import { useDashboardStats } from "../../gamification/hooks/useDashboardStats";

function OverallProgress({ progressData, loading }) {
    const { user } = useAuth();
    const { data: dashboardData } = useDashboardStats(user?._id);

    const [difficultyStats, setDifficultyStats] = useState({ easy: 0, medium: 0, hard: 0 });
    const [statsLoading, setStatsLoading] = useState(true);
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    // Fetch difficulty counts from solved history
    useEffect(() => {
        if (!user?._id) return;
        let isMounted = true;
        setStatsLoading(true);

        questionService.getRecentSolved({ all: true })
            .then(res => {
                if (isMounted && res.data?.success) {
                    const list = res.data.recentSolved || [];
                    const counts = { easy: 0, medium: 0, hard: 0 };
                    list.forEach(item => {
                        const diff = (item.difficulty || "Medium").toLowerCase();
                        if (diff === "easy") counts.easy++;
                        else if (diff === "hard") counts.hard++;
                        else counts.medium++;
                    });
                    setDifficultyStats(counts);
                }
            })
            .catch(err => {
                console.error("Failed to fetch solved history details:", err);
            })
            .finally(() => {
                if (isMounted) {
                    setStatsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [user?._id]);

    const totalSolved = typeof user?.stats?.totalProblemsSolved === "number"
        ? user.stats.totalProblemsSolved
        : progressData?.totalSolved || 0;
    const totalQuestions = progressData?.totalQuestions || 3060;
    const percentage = totalQuestions > 0 ? parseFloat(((totalSolved / totalQuestions) * 100).toFixed(1)) : 0;

    // Level calculation matching backend formula
    let level = 1;
    while (5 * level * (level + 1) <= totalSolved) {
        level++;
    }
    const currentLevelMin = 5 * (level - 1) * level;
    const nextLevelTarget = 5 * level * (level + 1);
    const problemsInCurrentLevel = totalSolved - currentLevelMin;
    const totalProblemsForNextLevel = nextLevelTarget - currentLevelMin;
    const levelProgressPercent = Math.min(100, Math.max(0, (problemsInCurrentLevel / totalProblemsForNextLevel) * 100));
    const problemsNeededForNext = nextLevelTarget - totalSolved;
    
    // XP
    const xp = user?.xp || dashboardData?.stats?.xp || 0;

    // SVG circle math: Radius = 75, Circumference = 2 * PI * r = 471.24
    const strokeDasharray = 471.24;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * animatedPercentage) / 100;

    // Animate the progress ring on load
    useEffect(() => {
        if (!loading && progressData) {
            const timer = setTimeout(() => {
                setAnimatedPercentage(percentage);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [loading, progressData, percentage]);

    if (loading || statsLoading) {
        return (
            <div className="w-full bg-[#121215]/60 border border-white/[0.05] rounded-2xl p-6 text-white flex flex-col items-center justify-center min-h-[140px] shadow-lg backdrop-blur-md animate-pulse">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            </div>
        );
    }

    const currentStreak = dashboardData?.stats?.currentStreak || user?.stats?.currentStreak || 0;
    const maxStreak = dashboardData?.stats?.maxStreak || user?.stats?.maxStreak || 0;

    return (
        <div className="w-full bg-[#121215]/60 border border-white/[0.05] rounded-2xl p-5 sm:p-6 text-white shadow-lg backdrop-blur-md relative overflow-hidden transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
                
                {/* Left Side: Circular Centerpiece */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                    <div className="relative h-[115px] w-[115px] xl:h-[125px] xl:w-[125px]">
                        <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full">
                            <defs>
                                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f97316" />
                                    <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                            </defs>
                            {/* Background Circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="75"
                                fill="none"
                                stroke="rgba(255,255,255,0.03)"
                                strokeWidth="10"
                            />
                            {/* Animated Progress Ring */}
                            <circle
                                cx="100"
                                cy="100"
                                r="75"
                                fill="none"
                                stroke="url(#orangeGrad)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                {totalSolved}
                                <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium ml-0.5">
                                    /{totalQuestions}
                                </span>
                            </h3>
                            <p className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-widest text-orange-500 mt-0.5">
                                {percentage}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Compressed Metrics */}
                <div className="flex-1 w-full space-y-3.5">
                    
                    {/* Level Details & Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-xs sm:text-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">Level {level}</span>
                                <span className="text-[10px] sm:text-[11px] text-neutral-400 font-medium">• {xp} XP</span>
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-semibold">
                                {problemsNeededForNext} {problemsNeededForNext === 1 ? "problem" : "problems"} to Level {level + 1}
                            </span>
                        </div>
                        {/* Sleek level progress bar */}
                        <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden border border-white/[0.01]">
                            <div
                                className="bg-orange-500 h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${levelProgressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.03]" />

                    {/* Stats List (Difficulty Breakdown & Streak) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs font-semibold">
                        {/* Difficulty breakdown */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-neutral-400">Easy</span>
                                <span className="text-white ml-0.5">{difficultyStats.easy}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span className="text-neutral-400">Med</span>
                                <span className="text-white ml-0.5">{difficultyStats.medium}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span className="text-neutral-400">Hard</span>
                                <span className="text-white ml-0.5">{difficultyStats.hard}</span>
                            </div>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-1.5">
                            <Flame size={13} className="text-orange-500 flex-shrink-0" />
                            <span className="text-neutral-400">Streak:</span>
                            <span className="text-white">{currentStreak}d</span>
                            <span className="text-[9px] text-neutral-500 font-normal ml-0.5">
                                (Max: {maxStreak}d)
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default OverallProgress;
