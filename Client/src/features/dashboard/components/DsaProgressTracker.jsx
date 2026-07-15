import { useEffect, useMemo, useState } from "react";
import { questionService } from "../../../services/questionService";

function DsaProgressTracker() {
    const [progress, setProgress] = useState({ totalSolved: 0, totalQuestions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const fetchProgress = async () => {
            try {
                const response = await questionService.getProgress();
                if (active && response?.data?.success) {
                    setProgress({
                        totalSolved: response.data.totalSolved || 0,
                        totalQuestions: response.data.totalQuestions || 0,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch DSA progress:", err);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchProgress();

        return () => {
            active = false;
        };
    }, []);

    const { totalSolved, totalQuestions } = progress;
    const percentage = useMemo(() => {
        if (!totalQuestions) return 0;
        return Math.min(100, Math.max(0, (totalSolved / totalQuestions) * 100));
    }, [totalSolved, totalQuestions]);

    const radius = 78;
    const circumference = Math.PI * radius;
    const dashOffset = circumference - (circumference * percentage) / 100;

    return (
        <section className="w-[94%] bg-white/8 border border-white/8 rounded-3xl lc-panel px-5 pt-5 pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="lc-kicker">
                        DSA Progress
                    </p>
                    <h2 className="mt-1 text-sm font-semibold text-white">
                        Problems Done
                    </h2>
                </div>
            </div>

            <div className="relative mt-4 h-[112px]">
                <svg viewBox="0 0 200 112" className="h-full w-full overflow-visible">
                    <path
                        d="M 22 98 A 78 78 0 0 1 178 98"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="16"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 22 98 A 78 78 0 0 1 178 98"
                        fill="none"
                        stroke="#2E8B57"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-700 ease-out"
                    />
                </svg>

                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
                    <div className="text-3xl font-semibold tracking-tight text-white tabular-nums">
                        {loading ? "--" : totalSolved}
                        <span className="text-lg font-medium text-white/35">/{totalQuestions}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DsaProgressTracker;
