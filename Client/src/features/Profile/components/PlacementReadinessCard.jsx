import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { activityService } from "../../../services/activityService";
import { useDashboardStats } from "../../gamification/hooks/useDashboardStats";

const TREND_DAYS = 30;
const GRAPH_WIDTH = 520;
const GRAPH_HEIGHT = 150;
const GRAPH_PADDING = 18;

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getRecentDateKeys = (days) => {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));
    return toDateKey(date);
  });
};

const getMonthLabel = (dateKey) => new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", {
  month: "short",
  year: "numeric",
});

function PlacementReadinessCard({ progressData, loading }) {
  const { user } = useAuth();
  const { data: dashboardData } = useDashboardStats(user?._id);
  const [activityDays, setActivityDays] = useState([]);
  const [activityLoading, setActivityLoading] = useState(Boolean(user?._id));

  useEffect(() => {
    if (!user?._id) {
      setActivityDays([]);
      setActivityLoading(false);
      return;
    }

    let mounted = true;

    const fetchActivityTrend = async () => {
      setActivityLoading(true);

      try {
        const response = await activityService.getUserActivity(user._id, { days: TREND_DAYS });
        if (mounted) {
          setActivityDays(response.data?.activities || []);
        }
      } catch (error) {
        console.error("Failed to load placement readiness trend:", error);
        if (mounted) {
          setActivityDays([]);
        }
      } finally {
        if (mounted) {
          setActivityLoading(false);
        }
      }
    };

    fetchActivityTrend();

    return () => {
      mounted = false;
    };
  }, [user?._id]);

  const totalSolved = typeof progressData?.totalSolved === "number"
    ? progressData.totalSolved
    : dashboardData?.stats?.totalProblemsSolved ?? user?.stats?.totalProblemsSolved ?? 0;
  const totalQuestions = progressData?.totalQuestions || 300; // Fallback to 300 questions total

  const actualSolved = totalSolved;

  const trendDays = useMemo(() => {
    const activityMap = new Map(
      activityDays.map((day) => [day.date, day])
    );

    return getRecentDateKeys(TREND_DAYS).map((date) => {
      const activity = activityMap.get(date);
      return {
        date,
        problemsSolved: activity?.problemsSolved || 0,
        active: Boolean(activity?.active && (activity?.problemsSolved || 0) > 0),
      };
    });
  }, [activityDays]);

  const solvedProgressPercentage = totalQuestions > 0
    ? Math.min(100, (actualSolved / totalQuestions) * 100)
    : 0;

  const consistencyPercentage = trendDays.length > 0
    ? (trendDays.filter((day) => day.problemsSolved > 0).length / trendDays.length) * 100
    : 0;

  const placementReadyPercentage = Math.round(
    Math.min(100, solvedProgressPercentage * 0.65 + consistencyPercentage * 0.35)
  );

  const trend = useMemo(() => {
    const startValue = Math.max(4, placementReadyPercentage - 8);
    const values = [];
    trendDays.forEach((day, index) => {
      if (index === 0) {
        values.push(Math.max(0, Math.min(100, startValue + (day.problemsSolved > 0 ? 1.6 : -1.2))));
      } else {
        const previous = values[index - 1];
        const delta = day.problemsSolved > 0
          ? Math.min(4.5, 1.2 + day.problemsSolved * 0.9)
          : -2.4;

        values.push(Math.max(0, Math.min(100, previous + delta)));
      }
    });

    if (values.length > 0) {
      values[values.length - 1] = placementReadyPercentage;
    }

    return trendDays.map((day, index) => ({
      ...day,
      value: values[index] ?? placementReadyPercentage,
    }));
  }, [placementReadyPercentage, trendDays]);

  const chart = useMemo(() => {
    const values = trend.map((day) => day.value);
    const minValue = Math.max(0, Math.min(...values, placementReadyPercentage) - 8);
    const maxValue = Math.min(100, Math.max(...values, placementReadyPercentage) + 8);
    const valueRange = Math.max(maxValue - minValue, 1);
    const innerWidth = GRAPH_WIDTH - GRAPH_PADDING * 2;
    const innerHeight = GRAPH_HEIGHT - GRAPH_PADDING * 2;
    const pointGap = trend.length > 1 ? innerWidth / (trend.length - 1) : innerWidth;

    const points = trend.map((day, index) => {
      const x = GRAPH_PADDING + index * pointGap;
      const y = GRAPH_PADDING + ((maxValue - day.value) / valueRange) * innerHeight;
      return { ...day, x, y };
    });

    return {
      points,
      linePath: points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" "),
      lastPoint: points[points.length - 1],
      startLabel: points[0] ? getMonthLabel(points[0].date) : "",
      endLabel: points[points.length - 1] ? getMonthLabel(points[points.length - 1].date) : "",
    };
  }, [placementReadyPercentage, trend]);

  const problemRank = progressData?.problemRank
    ?? dashboardData?.stats?.problemRank
    ?? user?.stats?.problemRank
    ?? null;
  const totalRankedUsers = progressData?.totalRankedUsers
    ?? dashboardData?.stats?.totalRankedUsers
    ?? user?.stats?.totalRankedUsers
    ?? 0;
  const percentile = problemRank === 1
    ? 1
    : typeof progressData?.rankPercentile === "number"
      ? progressData.rankPercentile
      : dashboardData?.stats?.problemRankPercentile ?? user?.stats?.problemRankPercentile ?? 100;
  const percentileBadge = problemRank === 1
    ? "Top 1%"
    : progressData?.rankBadge
      ?? dashboardData?.stats?.percentileBadge
      ?? user?.stats?.percentileBadge
      ?? "Top 100%";

  // Bell-curve heights of 11 distribution bars
  const barHeights = [15, 25, 42, 58, 78, 96, 82, 64, 46, 28, 12];

  // Map smaller top-percentile values to the stronger side of the chart
  const highlightedBarIndex = useMemo(() => {
    return Math.min(10, Math.max(0, Math.ceil((100 - percentile) / 10)));
  }, [percentile]);

  if (loading) {
    return (
      <div className="w-full h-[180px] bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl animate-pulse" />
    );
  }

  return (
    <div className="w-full border border-white/5 bg-white/8 rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      
      {/* Left Column: Placement Readiness */}
      <div className="flex-1 md:w-[35%] flex items-center justify-center gap-5">
        {/* Score & Call-to-action */}
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a6a6aa] block mb-2">
            Placement Readiness
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
              {placementReadyPercentage}%
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#ff9800] mt-1">Consistency Based</h4>
          <p className="text-[11px] text-[#a6a6aa] mt-1.5 leading-tight font-medium max-w-[260px]">
            {placementReadyPercentage < 20 
              ? "Solve daily to push this trend upward." 
              : placementReadyPercentage < 50 
                ? "Daily practice is building your placement rhythm." 
                : placementReadyPercentage < 80 
                  ? "Good momentum. Missing days will pull the score down." 
                  : "Strong and consistent placement preparation."}
          </p>
          <div className="mt-4 flex items-center gap-3 text-[10px] font-semibold text-[#a6a6aa]">
            <span>{Math.round(solvedProgressPercentage)}% solved</span>
            <span className="h-1 w-1 rounded-full bg-[#ff9800]" />
            <span>{Math.round(consistencyPercentage)}% consistent</span>
          </div>
          <Link
            to="/dashboard"
            className="mt-3.5 inline-flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-all duration-200"
          >
            View Roadmap →
          </Link>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-[1px] bg-white/10 self-stretch my-2" />

      {/* Right Column: Consistency Trend */}
      <div className=" w-full md:w-[60%] flex flex-col justify-between self-stretch min-h-[150px]">
        <div className="flex items-start justify-between gap-4 px-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a6a6aa] block">
              Daily Solve Trend
            </span>
            <span className="text-[10px] text-[#a6a6aa] block mt-1 font-medium">
              {activityLoading ? "loading activity" : "up on solved days, down on missed days"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-white leading-none">{percentileBadge}</span>
            <span className="text-[10px] text-[#a6a6aa] block mt-1 font-medium">
              {problemRank && totalRankedUsers ? `#${problemRank} of ${totalRankedUsers}` : "rank pending"}
            </span>
          </div>
        </div>

        <div className="mt-3 w-full">
          <div className="relative h-[150px]">
            <svg
              viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
              role="img"
              aria-label="Placement readiness daily trend"
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              <path
                d={chart.linePath}
                fill="none"
                stroke="#ff9800"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chart.lastPoint && (
                <>
                  <circle
                    cx={chart.lastPoint.x}
                    cy={chart.lastPoint.y}
                    r="5"
                    fill="#f2f2f2"
                    stroke="#d8d8d8"
                    strokeWidth="2"
                  />
                  <path
                    d={`M ${chart.lastPoint.x - 8} ${chart.lastPoint.y + 31} L ${chart.lastPoint.x} ${chart.lastPoint.y + 21} L ${chart.lastPoint.x + 8} ${chart.lastPoint.y + 31}`}
                    fill="#3b3b3f"
                    stroke="#5b5b62"
                    strokeWidth="1"
                  />
                </>
              )}
            </svg>

            {chart.lastPoint && (
              <div
                className="absolute rounded-md border border-[#5b5b62] bg-[#343438] px-2.5 py-1.5 text-sm font-bold text-[#d7d7dc] shadow-[0_12px_28px_rgba(0,0,0,0.32)]"
                style={{
                  left: `${(chart.lastPoint.x / GRAPH_WIDTH) * 100}%`,
                  top: `${(chart.lastPoint.y / GRAPH_HEIGHT) * 100}%`,
                  transform: "translate(-50%, 28px)",
                }}
              >
                {placementReadyPercentage}%
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center justify-between text-sm md:text-base font-bold text-[#a6a6aa]">
            <span>{chart.startLabel}</span>
            <span>{chart.endLabel}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PlacementReadinessCard;
