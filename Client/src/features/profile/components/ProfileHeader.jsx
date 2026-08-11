import { useEffect, useState } from "react";
import { Check, Copy, Flame, Globe2, Lock, MapPinOff, Pencil, Share2, X } from "lucide-react";
import { getPublicProfileUrl, updateMyProfile } from "../../../services/profile";

const getInitials = (name) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
};

const formatJoined = (dateString) => {
  if (!dateString) return "Recently joined";
  return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

/* Full-width identity banner. No data is invented here:
   - role/title ← user.bio (the closest real field; the model has no title)
   - location   ← omitted (no field exists on the User model)
   - rank/streak/standing map to real contest + streak data. */
const USERNAME_PATTERN = /^[a-z0-9_-]{3,30}$/;

function ProfileHeader({ user, stats, contest, topicProgress, onUserUpdate }) {
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [publicEnabled, setPublicEnabled] = useState(user?.publicProfileEnabled !== false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const name = user?.name || user?.username || "Coder";
  const initials = getInitials(name);
  const joinedDate = user?.createdAt || user?.lastLogin || null;
  const showAvatar = Boolean(user?.avatar) && !imageFailed;

  const rank = contest?.rank != null && contest?.rank !== "-" ? `#${contest.rank}` : "—";
  const streak = stats?.currentStreak ?? 0;
  const longestStreak = stats?.longestStreak ?? 0;
  const topPercent = contest?.isRanked ? Math.max(1, 100 - (contest.percentile || 0)) : null;

  // Gray skill pills from real topic progress (only started topics count as skills).
  const skills = (topicProgress || [])
    .filter((topic) => topic.total > 0 && topic.solved > 0)
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 8)
    .map((topic) => topic.label);

  useEffect(() => {
    setUsername(user?.username || "");
    setPublicEnabled(user?.publicProfileEnabled !== false);
  }, [user?.username, user?.publicProfileEnabled]);

  const copyProfileLink = async () => {
    const shareUrl = getPublicProfileUrl(user?.username);
    const shareData = {
      title: `${name} on LeetCore`,
      text: `View ${name}'s LeetCore profile`,
      url: shareUrl,
    };

    try {
      if (navigator.share && publicEnabled) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const saveProfileSettings = async () => {
    const nextUsername = username.trim().toLowerCase();

    if (!USERNAME_PATTERN.test(nextUsername)) {
      setFeedback("Use 3-30 lowercase letters, numbers, underscores, or hyphens.");
      return;
    }

    try {
      setSaving(true);
      setFeedback("");
      const updatedUser = await updateMyProfile({
        username: nextUsername,
        publicProfileEnabled: publicEnabled,
      });
      onUserUpdate?.(updatedUser);
      setUsername(updatedUser.username || nextUsername);
      setPublicEnabled(updatedUser.publicProfileEnabled !== false);
      setEditing(false);
      setFeedback("Profile settings saved.");
      window.setTimeout(() => setFeedback(""), 1800);
    } catch (error) {
      setFeedback(error.response?.data?.message || "Unable to save profile settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="pf-card overflow-hidden rounded-2xl">
      {/* Identity row */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--border-color)] bg-[var(--bg-card-alt)] text-lg font-semibold tracking-wide text-[var(--text-secondary)] sm:h-20 sm:w-20">
            {showAvatar ? (
              <img
                src={user.avatar}
                alt={name}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </span>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="min-w-0 break-words text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">{name}</h1>
              <span className="font-mono text-[12px] text-[var(--text-muted)]">@{user?.username || "guest"}</span>
            </div>
            {user?.bio && <p className="mt-1 max-w-[58ch] break-words text-[13px] text-[var(--text-secondary)]">{user.bio}</p>}
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-[var(--text-muted)]">
              <span>Joined {formatJoined(joinedDate)}</span>
              <span className="hidden text-[var(--border-color)] sm:inline">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPinOff size={12} aria-hidden="true" /> Location not set
              </span>
              <span className="hidden text-[var(--border-color)] sm:inline">·</span>
              <span className="inline-flex items-center gap-1">
                {publicEnabled ? <Globe2 size={12} aria-hidden="true" /> : <Lock size={12} aria-hidden="true" />}
                {publicEnabled ? "Public profile" : "Private profile"}
              </span>
            </p>
            {feedback && <p className="mt-2 text-[12px] text-[var(--accent-gold)]">{feedback}</p>}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="pf-btn-ghost inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium"
          >
            {editing ? <X size={15} aria-hidden="true" /> : <Pencil size={15} aria-hidden="true" />}
            {editing ? "Close" : "Edit"}
          </button>
          <button
            type="button"
            onClick={copyProfileLink}
            disabled={!publicEnabled || !user?.username}
            className="pf-btn-ghost inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Check size={15} className="text-[var(--text-primary)]" /> : publicEnabled && navigator.share ? <Share2 size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Shared" : "Share profile"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="grid gap-3 border-t border-[var(--border-color)] bg-[var(--bg-card-alt)] px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-end sm:px-6">
          <label className="min-w-0">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">Public username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="pf-input h-10 w-full rounded-lg px-3 text-[14px]"
              maxLength={30}
              autoComplete="username"
              spellCheck="false"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <label className="pf-btn-ghost inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-[13px] font-medium">
              <input
                type="checkbox"
                checked={publicEnabled}
                onChange={(event) => setPublicEnabled(event.target.checked)}
                className="h-4 w-4 accent-[var(--accent-gold)]"
              />
              Public
            </label>
            <button
              type="button"
              onClick={saveProfileSettings}
              disabled={saving}
              className="pf-btn-solid h-10 rounded-lg px-4 text-[13px] font-semibold disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Stat strip: rank / streak / standing */}
      <div className="grid grid-cols-3 divide-x divide-[var(--border-color)] border-t border-[var(--border-color)] sm:grid-cols-3">
        <div className="bg-[var(--bg-card-alt)] px-4 py-3 text-center sm:px-6 sm:py-3.5">
          <p className="text-lg font-bold tabular-nums tracking-tight text-[var(--text-primary)] sm:text-xl">{rank}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Rank</p>
        </div>
        <div className="bg-[var(--bg-card-alt)] px-4 py-3 text-center sm:px-6 sm:py-3.5">
          <p className="inline-flex items-center gap-1.5 text-lg font-bold tabular-nums tracking-tight text-[var(--text-primary)] sm:text-xl">
            <Flame size={17} className="text-[var(--accent-gold)]" aria-hidden="true" />
            {streak}d
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Streak · longest {longestStreak}d</p>
        </div>
        <div className="bg-[var(--bg-card-alt)] px-4 py-3 text-center sm:px-6 sm:py-3.5">
          <p className="text-lg font-bold tabular-nums tracking-tight text-[var(--text-primary)] sm:text-xl">
            {topPercent != null ? `${topPercent}%` : "—"}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Top %</p>
        </div>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-[var(--border-color)] bg-[var(--bg-card)] px-5 py-3.5 sm:px-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">Skills</span>
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[var(--border-color)] bg-[var(--bg-card-alt)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-primary)]"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-[12px] text-[var(--text-muted)]">Solve your first problem to earn skill tags.</span>
        )}
      </div>
    </section>
  );
}

export default ProfileHeader;
