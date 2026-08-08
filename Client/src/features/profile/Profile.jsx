import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import Upperdashnavbar from "../../components/common/dashuppernavbar";
import { useAuth } from "../../context/AuthContext";
import { getProfileData } from "./profileData";
import { ACTIVITY_UPDATED_EVENT } from "../../services/activityProgress";

import ProfileHeader from "./components/ProfileHeader";
import { StatBand, ProblemDistribution } from "./components/StatsSection";
import ReadinessSection from "./components/ReadinessSection";
import HeatmapSection from "./components/HeatmapSection";
import RecentActivitySection from "./components/RecentActivitySection";
import ContestSection from "./components/ContestSection";
import SkillSection from "./components/SkillSection";
import DSAProgress from "./components/DSAProgress";

function ProfileSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading profile">
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--pf-surface)]" />
      <div className="grid grid-cols-6 gap-px overflow-hidden rounded-2xl border border-[var(--pf-border)]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-[var(--pf-surface)] px-4 py-3 sm:px-5 sm:py-4">
            <div className="h-2.5 w-14 rounded bg-[var(--pf-surface-2)]" />
            <div className="mt-2 h-5 w-10 rounded bg-[var(--pf-surface-2)]" />
            <div className="mt-1.5 h-2 w-16 rounded bg-[var(--pf-surface-2)]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[19rem] animate-pulse rounded-2xl bg-[var(--pf-surface)] lg:col-span-2" />
        <div className="h-[19rem] animate-pulse rounded-2xl bg-[var(--pf-surface)]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl bg-[var(--pf-surface)] lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl bg-[var(--pf-surface)]" />
      </div>
    </div>
  );
}

/* ============================================================
   LeetCore Profile — LeetCode-inspired competitive-programmer
   identity + performance record. Dark-only, data-driven.
   ============================================================ */
function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfileData();
      setProfile(data);
      setError(null);
    } catch {
      setError("Unable to load your profile right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const refresh = () => loadProfile();
    window.addEventListener(ACTIVITY_UPDATED_EVENT, refresh);

    return () => {
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, refresh);
    };
  }, [loadProfile]);

  const recentProblems = (profile?.recentProblems || []).map((problem) => ({
    ...problem,
    topicLabel: profile?.getTopicLabel ? profile.getTopicLabel(problem.topicId) : "Interview Prep",
  }));

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] text-[var(--pf-text)]">
      <Upperdashnavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] px-6 py-20 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[var(--pf-surface-2)] text-[var(--pf-hard)]">
              <AlertTriangle size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-[var(--pf-text)]">{error}</p>
            <button
              type="button"
              onClick={loadProfile}
              className="pf-btn-solid mt-4 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="animate-slide-up">
              <ProfileHeader user={user} />
            </div>

            <div className="mt-4 animate-slide-up" style={{ animationDelay: "60ms" }}>
              <StatBand stats={profile.stats} contest={profile.contest} />
            </div>

            {/* Two-column analytics: main 2 / rail 1.
              Desktop: Activity + Skills + Recent (left) beside Problem + Contest + DSA (right).
              Mobile: Problem → Activity → Contest → Skills → DSA → Readiness → Recent. */}
            <div className="mt-4 animate-slide-up grid gap-4 lg:grid-cols-3" style={{ animationDelay: "120ms" }}>
              {/* Main column 65% */}
              <div className="order-2 lg:order-1 lg:col-span-2">
                <HeatmapSection heatmap={profile.heatmap} longestStreak={profile.stats.longestStreak} />
              </div>
              {/* Rail 35% */}
              <div className="order-1 lg:order-2">
                <ProblemDistribution
                  difficultyBreakdown={profile.stats.difficultyBreakdown}
                  solvedCount={profile.stats.solvedCount}
                  totalQuestions={profile.stats.totalQuestions}
                />
              </div>

              <div className="order-4 lg:order-3 lg:col-span-2">
                <SkillSection topicProgress={profile.topicProgress} />
              </div>
              <div className="order-3 lg:order-4">
                <ContestSection contest={profile.contest} />
              </div>

              <div className="order-5 lg:order-6">
                <DSAProgress stats={profile.stats} />
              </div>
              <div className="order-7 lg:order-5 lg:col-span-2">
                <RecentActivitySection recentProblems={recentProblems} />
              </div>

              <div className="order-6 lg:order-7 lg:col-span-3">
                <ReadinessSection readiness={profile.readiness} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;