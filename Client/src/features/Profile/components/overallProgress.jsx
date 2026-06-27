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

    const totalSolved = typeof progressData?.totalSolved === "number"
        ? progressData.totalSolved
        : user?.stats?.totalProblemsSolved || 0;
    const totalQuestions = progressData?.totalQuestions || 0;
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
            {/* Soft glowing ambient radial gradients */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/[0.02] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 w-full h-full max-w-4xl mx-auto relative z-10">
                
                {/* Left Side: Circular Centerpiece */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                    <div className="relative h-[145px] w-[145px] xl:h-[165px] xl:w-[165px]">
                        <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full">
                            <defs>
                                <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
                                    <stop offset="50%" stopColor="#d946ef" /> {/* Fuchsia */}
                                    <stop offset="100%" stopColor="#f97316" /> {/* Orange */}
                                </linearGradient>
                            </defs>
                            {/* Background Circle */}
                            <circle
                                cx="100"
                                cy="100"
                                r="75"
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="12"
                            />
                            {/* Animated Progress Ring */}
                            <circle
                                cx="100"
                                cy="100"
                                r="75"
                                fill="none"
                                stroke="url(#sunsetGrad)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                                {totalSolved}
                                <span className="text-xs sm:text-sm text-neutral-500 font-medium ml-0.5">
                                    /{totalQuestions}
                                </span>
                            </h3>
                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-gradient-to-r from-indigo-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mt-2">
                                {percentage}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Compressed Metrics */}
                <div className="flex-1 w-full space-y-5 max-w-md">
                    
                    {/* Level Details & Progress Bar */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 rounded-md bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(249,115,22,0.08)]">
                                    Level {level}
                                </div>
                                <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 uppercase tracking-wider">
                                    {xp} XP
                                </span>
                            </div>
                            <span className="text-xs sm:text-sm text-neutral-400 font-semibold flex items-center gap-1">
                                <span className="text-pink-400 font-bold text-sm sm:text-base">{problemsNeededForNext}</span>
                                <span>{problemsNeededForNext === 1 ? "problem" : "problems"} to Level {level + 1}</span>
                            </span>
                        </div>
                        {/* Sleek level progress bar */}
                        <div className="relative">
                            <div className="w-full bg-white/[0.04] h-2.5 rounded-full overflow-hidden border border-white/[0.01]">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                                    style={{ width: `${levelProgressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.03]" />

                    {/* Stats List (Difficulty Breakdown & Streak) */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-semibold">
                        {/* Difficulty breakdown */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-neutral-400">Easy</span>
                                <span className="text-white ml-0.5">{difficultyStats.easy}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-neutral-400">Med</span>
                                <span className="text-white ml-0.5">{difficultyStats.medium}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-neutral-400">Hard</span>
                                <span className="text-white ml-0.5">{difficultyStats.hard}</span>
                            </div>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-1.5">
                            <Flame size={15} className="text-orange-500 flex-shrink-0 animate-pulse" />
                            <span className="text-neutral-400">Streak:</span>
                            <span className="text-white">{currentStreak}d</span>
                            <span className="text-[10px] sm:text-xs text-neutral-500 font-normal ml-0.5">
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
