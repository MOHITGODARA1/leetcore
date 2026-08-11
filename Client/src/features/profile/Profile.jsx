import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getProfileData } from "./profileData";
import { ACTIVITY_UPDATED_EVENT } from "../../services/activityProgress";

import Upperdashnavbar from "../../components/common/dashuppernavbar";
import ProfileHeader from "./components/ProfileHeader";
import { StatBand, SolvedRingCard } from "./components/StatsSection";
import { ReadinessSnapshot } from "./components/ReadinessSection";
import HeatmapSection from "./components/HeatmapSection";
import RecentActivitySection from "./components/RecentActivitySection";
import ContestSection from "./components/ContestSection";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "coding", label: "Coding Activity" },
  { id: "contest", label: "Contest Standing" },
  { id: "recent", label: "Recent Activity" },
  { id: "readiness", label: "Placement Readiness" },
];

function ProfileSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading profile">
      <div className="h-40 animate-pulse rounded-2xl bg-[var(--bg-card)]" />
      <div className="h-24 animate-pulse rounded-2xl bg-[var(--bg-card)]" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[22rem] animate-pulse rounded-2xl bg-[var(--bg-card)] lg:col-span-2" />
        <div className="h-[22rem] animate-pulse rounded-2xl bg-[var(--bg-card)]" />
      </div>
    </div>
  );
}

function TabBar({ active, onChange }) {
  return (
    <div className="flex overflow-x-auto border-b border-[var(--border-color)]" role="tablist" aria-label="Profile sections">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative shrink-0 px-4 py-3 text-[13px] font-medium tracking-tight transition-colors duration-150 whitespace-nowrap ${
              isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.label}
            {isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--accent-gold)]" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Upperdashnavbar />

      <main className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-20 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-alt)] text-[var(--accent-error)]">
              <AlertTriangle size={20} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{error}</p>
            <button
              type="button"
              onClick={loadProfile}
              className="pf-btn-solid mt-4 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="animate-slide-up space-y-5">
            <ProfileHeader
              user={user}
              stats={profile.stats}
              contest={profile.contest}
              topicProgress={profile.topicProgress}
              onUserUpdate={setUser}
            />

            <TabBar active={activeTab} onChange={setActiveTab} />

            <div key={activeTab} className="animate-slide-up">
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <StatBand stats={profile.stats} contest={profile.contest} />
                  <div className="grid gap-5 lg:grid-cols-2">
                    <SolvedRingCard stats={profile.stats} />
                    <ReadinessSnapshot readiness={profile.readiness} />
                  </div>
                </div>
              )}

              {activeTab === "coding" && <HeatmapSection heatmap={profile.heatmap} longestStreak={profile.stats.longestStreak} />}

              {activeTab === "contest" && <ContestSection contest={profile.contest} history={profile.readiness.history} />}

              {activeTab === "recent" && (
                <RecentActivitySection recentProblems={recentProblems} achievements={profile.achievements} />
              )}

              {activeTab === "readiness" && <ReadinessSection readiness={profile.readiness} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
