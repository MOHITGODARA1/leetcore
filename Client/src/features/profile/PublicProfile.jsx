import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Check, Copy, ExternalLink, Flame, Share2, Trophy } from "lucide-react";
import { getPublicProfile, getPublicProfileUrl } from "../../services/profile";

const getInitials = (name) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
};

const formatJoined = (dateString) => {
  if (!dateString) return "Recently joined";
  return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

function PublicProfileSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6 lg:px-8" aria-busy="true">
      <div className="h-44 animate-pulse rounded-2xl bg-[var(--bg-card)]" />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-2xl bg-[var(--bg-card)]" />
        <div className="h-28 animate-pulse rounded-2xl bg-[var(--bg-card)]" />
        <div className="h-28 animate-pulse rounded-2xl bg-[var(--bg-card)]" />
      </div>
      <div className="mt-5 h-72 animate-pulse rounded-2xl bg-[var(--bg-card)]" />
    </main>
  );
}

function PublicProfile() {
  const { username = "" } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setProfile(await getPublicProfile(username));
    } catch (err) {
      setError(err.response?.status === 404 ? "This profile is private or does not exist." : "Unable to load this profile right now.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const user = profile?.user;
  const summary = profile?.summary;
  const name = user?.name || user?.username || "Coder";
  const shareUrl = useMemo(() => getPublicProfileUrl(user?.username || username), [user?.username, username]);
  const startedTopics = (summary?.topicProgress || [])
    .filter((topic) => topic.total > 0 && topic.solved > 0)
    .sort((a, b) => b.percent - a.percent || b.solved - a.solved);

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${name} on LeetCore`, text: `View ${name}'s LeetCore profile`, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"><PublicProfileSkeleton /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <main className="mx-auto w-full max-w-[720px] px-4 py-10 sm:px-6">
          <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <ArrowLeft size={16} aria-hidden="true" /> Home
          </Link>
          <section className="pf-card rounded-2xl px-6 py-16 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-alt)] text-[var(--accent-error)]">
              <AlertTriangle size={20} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Profile unavailable</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{error}</p>
            <button type="button" onClick={loadProfile} className="pf-btn-solid mt-5 rounded-lg px-4 py-2 text-sm font-semibold">
              Try again
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <main className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <ArrowLeft size={16} aria-hidden="true" /> LeetCore
          </Link>
          <button type="button" onClick={shareProfile} className="pf-btn-ghost inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium">
            {copied ? <Check size={15} aria-hidden="true" /> : navigator.share ? <Share2 size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Shared" : "Share profile"}
          </button>
        </div>

        <section className="pf-card overflow-hidden rounded-2xl">
          <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--border-color)] bg-[var(--bg-card-alt)] text-lg font-semibold tracking-wide text-[var(--text-secondary)]">
              {user?.avatar && !imageFailed ? (
                <img src={user.avatar} alt={name} onError={() => setImageFailed(true)} className="h-full w-full object-cover" />
              ) : (
                getInitials(name)
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="break-words text-2xl font-bold tracking-tight text-[var(--text-primary)]">{name}</h1>
              <p className="mt-1 font-mono text-[12px] text-[var(--text-muted)]">@{user?.username}</p>
              {user?.bio && <p className="mt-3 max-w-[62ch] break-words text-sm leading-6 text-[var(--text-secondary)]">{user.bio}</p>}
              <p className="mt-3 text-[12px] text-[var(--text-muted)]">Joined {formatJoined(user?.createdAt)}</p>
            </div>
            {user?.profileUrl && (
              <a href={user.profileUrl} target="_blank" rel="noreferrer" className="pf-btn-ghost inline-flex items-center gap-2 self-start rounded-lg px-3.5 py-2 text-[13px] font-medium md:self-center">
                <ExternalLink size={15} aria-hidden="true" /> GitHub
              </a>
            )}
          </div>
          <div className="grid grid-cols-3 divide-x divide-[var(--border-color)] border-t border-[var(--border-color)]">
            <div className="bg-[var(--bg-card-alt)] px-3 py-3 text-center">
              <p className="text-xl font-bold tabular-nums">{summary?.solvedCount || 0}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Solved</p>
            </div>
            <div className="bg-[var(--bg-card-alt)] px-3 py-3 text-center">
              <p className="inline-flex items-center justify-center gap-1.5 text-xl font-bold tabular-nums">
                <Flame size={17} className="text-[var(--accent-gold)]" aria-hidden="true" />
                {summary?.activeDays || 0}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Active days</p>
            </div>
            <div className="bg-[var(--bg-card-alt)] px-3 py-3 text-center">
              <p className="inline-flex items-center justify-center gap-1.5 text-xl font-bold tabular-nums">
                <Trophy size={17} className="text-[var(--accent-gold)]" aria-hidden="true" />
                {summary?.totalSubmissions || 0}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Submissions</p>
            </div>
          </div>
        </section>

        <section className="pf-card mt-5 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">Topic progress</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{summary?.solvedCount || 0} of {summary?.totalQuestions || 0} DSA problems solved</p>
            </div>
          </div>
          {startedTopics.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {startedTopics.slice(0, 10).map((topic) => (
                <div key={topic.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-alt)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-semibold text-[var(--text-primary)]">{topic.label}</p>
                    <p className="shrink-0 text-xs tabular-nums text-[var(--text-muted)]">{topic.solved}/{topic.total}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-card-hover)]">
                    <div className="h-full rounded-full bg-[var(--accent-gold)]" style={{ width: `${Math.max(0, Math.min(100, topic.percent))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-alt)] px-4 py-8 text-center text-sm text-[var(--text-muted)]">
              No public progress yet.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PublicProfile;
