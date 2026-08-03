import { useEffect, useMemo, useState } from "react";
import {
  Flame,
  Route,
  Trophy,
  Target,
  BarChart3,
  CircleCheckBig,
  Bug,
  Star,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import { ACTIVITY_UPDATED_EVENT, getActivitySummary } from "../../../services/activityProgress";

const defaultActivity = {
  solvedCount: 0,
  totalQuestions: 0,
  streakCount: 0,
  readinessScore: 0,
  weeklySolved: 0,
  currentTopic: {
    label: "Arrays",
    solved: 0,
    total: 0,
    percent: 0,
  },
  weeklyProgress: [],
  contestRank: {
    rank: "-",
  },
};

function DSARightNavbar() {
  const [activity, setActivity] = useState(defaultActivity);

  useEffect(() => {
    let mounted = true;

    const loadActivity = async () => {
      const summary = await getActivitySummary();
      if (mounted) {
        setActivity(summary || defaultActivity);
      }
    };

    const handleActivityUpdate = (event) => {
      if (event.detail) {
        setActivity(event.detail);
      } else {
        loadActivity();
      }
    };

    loadActivity();
    window.addEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
    window.addEventListener("storage", loadActivity);

    return () => {
      mounted = false;
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
      window.removeEventListener("storage", loadActivity);
    };
  }, []);

  const currentTopic = activity.currentTopic || defaultActivity.currentTopic;
  const questionsLeft = Math.max(0, (activity.totalQuestions || 0) - (activity.solvedCount || 0));
  const rankText = activity.contestRank?.rank && activity.contestRank.rank !== "-"
    ? `#${activity.contestRank.rank}`
    : "--";
  const weeklyProgress = activity.weeklyProgress?.length
    ? activity.weeklyProgress
    : defaultActivity.weeklyProgress;

  const chart = useMemo(() => {
    const days = weeklyProgress.length
      ? weeklyProgress
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
          label,
          solvedCount: 0,
        }));
    const maxSolved = Math.max(1, ...days.map((day) => day.solvedCount || 0));
    const xStart = 10;
    const xGap = 280 / Math.max(days.length - 1, 1);
    const points = days.map((day, index) => {
      const x = Math.round(xStart + index * xGap);
      const normalized = (day.solvedCount || 0) / maxSolved;
      const y = Math.round(92 - normalized * 74);
      return { ...day, x, y };
    });

    return {
      days,
      points,
      polyline: points.map((point) => `${point.x},${point.y}`).join(" "),
    };
  }, [weeklyProgress]);

  return (
    <aside className="hidden xl:block w-80 h-full overflow-y-auto border-l border-white/7 bg-white/6 p-6 flex-shrink-0">

      {/* Current Journey */}
      <div className="grid grid-cols-2 gap-4 ">
        <div className="rounded-xl bg-white/9 p-4">
          <Flame className="text-[#E0A03B]" size={18} />
          <p className="text-sm text-white/80 mt-3">
            Day Streak
          </p>
          <h3 className="text-2xl font-bold">
            {activity.streakCount || 0}
          </h3>
        </div>

        <div className="rounded-xl  bg-white/9 p-4">
          <Target className="text-[#E0A03B]" size={18} />
          <p className="text-sm text-white mt-3">
            Questions Left
          </p>
          <h3 className="text-2xl font-bold">
            {questionsLeft}
          </h3>
        </div>
      </div>

      <div className="rounded-2xl   mt-6 bg-white/9 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Route size={18} className="text-white/80" />
          <h2 className="font-semibold text-white">
            {currentTopic.label}
          </h2>
        </div>

        <h3 className="text-md font-semibold mt-1 text-white/60">
          {currentTopic.solved}/{currentTopic.total} solved
        </h3>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Journey Progress</span>
            <span>{currentTopic.percent || 0}%</span>
          </div>

          <div className="h-2 rounded-full bg-white/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-400"
              style={{ width: `${currentTopic.percent || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        

        <div className="rounded-xl  bg-white/9 p-4">
          <Trophy className="text-[#F2A640]" size={18} />
          <p className="text-sm text-white/80 mt-3">
            Contest Rank
          </p>
          <h3 className="text-2xl font-bold">
            {rankText}
          </h3>
        </div>

        <div className="rounded-xl  bg-white/9 p-4">
          <CircleCheckBig className="text-green-400" size={18} />
          <p className="text-sm text-white/80 mt-3">
            Readiness
          </p>
          <h3 className="text-2xl font-bold">
            {activity.readinessScore || 0}%
          </h3>
        </div>

      </div>

      {/* Weekly Progress */}
      <div className="rounded-2xl  bg-white/9 p-5 mt-6">

        <div className="flex items-center gap-2 mb-5">
          <BarChart3 size={18} />
          <h2 className="font-semibold">
            Weekly Progress
          </h2>
          <span className="ml-auto text-xs font-semibold text-white/55">
            {activity.weeklySolved || 0} solved
          </span>
        </div>

        <svg
          viewBox="0 0 320 120"
          className="w-full h-32"
          fill="none"
        >
          <polyline
            points={chart.polyline}
            stroke="#F2A640"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chart.points.map((point) => (
            <circle
              key={`${point.label}-${point.x}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#F2A640"
            />
          ))}
        </svg>

        <div className="flex justify-between text-xs text-white/80 mt-2">
          {chart.days.map((day) => (
            <span key={day.date || day.label}>{day.label}</span>
          ))}
        </div>

      </div>
      <div className="flex justify-center mt-6 w-full item-center">
        <div className=" w-[90%] flex justify-between gap-4">
          <Bug size={20} className="text-white/70"/>
          <FaInstagram size={20} className="text-white/70"/>
          <FaLinkedin size={20} className="text-white/70"/>
          <FaGithub size={20} className="text-white/70"/>
          <FaYoutube size={20} className="text-white/70"/>
          <Star size={20} className="text-white/70"/>
        </div>
      </div>

      
    </aside>
  );
}

export default DSARightNavbar;
