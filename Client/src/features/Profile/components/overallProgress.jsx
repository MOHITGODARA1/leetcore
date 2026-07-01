import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { questionService } from "../../../services/questionService";
import { useDashboardStats } from "../../gamification/hooks/useDashboardStats";

// Smooth CountUp Component using requestAnimationFrame
function CountUp({ end, duration = 800, decimals = 0 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const endVal = parseFloat(end);
        if (isNaN(endVal) || endVal === 0) {
            setCount(end);
            return;
        }

        const startTime = performance.now();
        let animationFrameId;

        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                setCount(endVal.toFixed(decimals));
            } else {
                const progress = elapsedTime / duration;
                const easeProgress = progress * (2 - progress); // Ease out quad
                const currentCount = easeProgress * endVal;
                setCount(currentCount.toFixed(decimals));
                animationFrameId = requestAnimationFrame(updateCount);
            }
        };

        animationFrameId = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration, decimals]);

    return <>{count}</>;
}

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

    // Use global user solved count and level to match UserDetail component
    const actualSolved = user?.stats?.totalProblemsSolved || dashboardData?.stats?.totalProblemsSolved || totalSolved;
    const level = user?.level || dashboardData?.stats?.level || 1;

    const nextLevelTarget = 5 * level * (level + 1);
    const problemsNeededForNext = nextLevelTarget - actualSolved;

    // Clean LeetCore brand orange styling
    const circleColor = "#2E8B57"; 

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
            <div className="w-full bg-[#121215]/68 border border-white/[0.08] rounded-2xl p-5 sm:p-6 text-white shadow-[0_18px_55px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden">
                <style>{`
                    @keyframes lc-shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                    .lc-skeleton-bg {
                        background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
                        background-size: 200% 100%;
                        animation: lc-shimmer 1.6s infinite linear;
                    }
                `}</style>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 w-full h-full max-w-4xl mx-auto">
                    {/* Circle Placeholder */}
                    <div className="relative flex-shrink-0">
                        <div className="h-[145px] w-[145px] xl:h-[165px] xl:w-[165px] rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center">
                            <div className="h-[121px] w-[121px] xl:h-[141px] xl:w-[141px] rounded-full bg-[#121215]/90 flex flex-col items-center justify-center">
                                <div className="h-6 w-16 rounded lc-skeleton-bg" />
                                <div className="h-4 w-10 rounded mt-2 lc-skeleton-bg" />
                            </div>
                        </div>
                    </div>
                    {/* Metrics Placeholder */}
                    <div className="flex-1 w-full space-y-5 max-w-md">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 rounded-md lc-skeleton-bg" />
                                    <div className="h-6 w-16 rounded-md lc-skeleton-bg" />
                                </div>
                                <div className="h-5 w-32 rounded lc-skeleton-bg" />
                            </div>
                        </div>
                        <div className="h-px bg-white/[0.03]" />
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-4 w-12 rounded lc-skeleton-bg" />
                                <div className="h-4 w-12 rounded lc-skeleton-bg" />
                                <div className="h-4 w-12 rounded lc-skeleton-bg" />
                            </div>
                            <div className="h-4 w-28 rounded lc-skeleton-bg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentStreak = dashboardData?.stats?.currentStreak || user?.stats?.currentStreak || 0;
    const maxStreak = dashboardData?.stats?.maxStreak || user?.stats?.maxStreak || 0;

    return (
        <div className="w-full h-full bg-[#121215]/68 border border-white/[0.08] rounded-2xl p-5 sm:p-6 text-white shadow-[0_18px_55px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden transition-all duration-300 lc-animate-fade-up">
            <style>{`
                @keyframes lc-fade-up {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .lc-animate-fade-up {
                    animation: lc-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>
            
            {/* Soft glowing ambient radial gradients */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/[0.02] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 w-full h-full max-w-4xl mx-auto relative z-10">
                
                {/* Left Side: Circular Centerpiece */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                    <div className="relative h-[145px] w-[145px] xl:h-[165px] xl:w-[165px]">
                        <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full">
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
                                stroke={circleColor}
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                                <CountUp end={totalSolved} />
                                <span className="text-xs sm:text-sm text-neutral-500 font-medium ml-0.5">
                                    /{totalQuestions}
                                </span>
                            </h3>
                            <p
                                className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-2"
                                style={{ color: circleColor }}
                            >
                                <CountUp end={percentage} decimals={1} />%
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
                                <div className="px-3 py-1 rounded-md text-neutral-300 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(249,115,22,0.08)]">
                                    Level <CountUp end={level} />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400 uppercase tracking-wider">
                                    <CountUp end={xp} /> XP
                                </span>
                            </div>
                             <span className="text-xs mt-2 sm:text-sm text-neutral-400 font-semibold flex items-center gap-1">
                                <span className="font-semibold text-neutral-300 text-sm sm:text-base duration-500">
                                    <CountUp end={problemsNeededForNext} />
                                </span>
                                <span>{problemsNeededForNext === 1 ? "problem" : "problems"} to Level {level + 1}</span>
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.03]" />

                    {/* Stats List (Difficulty Breakdown & Streak) */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-semibold">
                        {/* Difficulty breakdown */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-neutral-400">Easy</span>
                                <span className="text-white ml-0.5"><CountUp end={difficultyStats.easy} /></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-neutral-400">Med</span>
                                <span className="text-white ml-0.5"><CountUp end={difficultyStats.medium} /></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                <span className="text-neutral-400">Hard</span>
                                <span className="text-white ml-0.5"><CountUp end={difficultyStats.hard} /></span>
                            </div>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-1.5">
                            <Flame size={15} className="text-orange-500 flex-shrink-0" />
                            <span className="text-neutral-400">Streak:</span>
                            <span className="text-white"><CountUp end={currentStreak} />d</span>
                            <span className="text-[10px] sm:text-xs text-neutral-500 font-normal ml-0.5">
                                (Max: <CountUp end={maxStreak} />d)
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default OverallProgress;
