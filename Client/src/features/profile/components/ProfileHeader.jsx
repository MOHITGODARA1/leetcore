import { useState } from "react";
import { CalendarDays, Mail, Globe, Copy, Check } from "lucide-react";

const formatJoined = (dateString) => {
  if (!dateString) return "Recently joined";
  return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const getInitials = (name) => {
  const parts = name.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
};

function ProfileHeader({ user }) {
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const name = user?.name || user?.username || "Coder";
  const username = user?.username || "guest";
  const initials = getInitials(name);
  const joinedDate = user?.createdAt || user?.lastLogin || null;
  const showAvatar = Boolean(user?.avatar) && !imageFailed;

  return (
    <section className="pf-card rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {showAvatar ? (
              <img
                src={user.avatar}
                alt={name}
                onError={() => setImageFailed(true)}
                className="h-14 w-14 rounded-xl border border-[var(--pf-border)] object-cover"
              />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-xl border border-[var(--pf-border)] bg-[var(--pf-surface-2)] text-base font-semibold tracking-wide text-[var(--pf-faint)]">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <h1 className="text-xl font-bold tracking-tight text-[var(--pf-text)]">{name}</h1>
              <span className="font-mono text-[12.5px] text-[var(--pf-faint)]">@{username}</span>
            </div>

            {user?.bio && <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-[var(--pf-muted)]">{user.bio}</p>}

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[var(--pf-muted)]">
              {user?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="shrink-0 text-[var(--pf-faint)]" aria-hidden="true" />
                  <span className="lc-safe-text">{user.email}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} className="shrink-0 text-[var(--pf-faint)]" aria-hidden="true" />
                Joined {formatJoined(joinedDate)}
              </span>
              {user?.profileUrl && (
                <a
                  href={user.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition-colors duration-150 hover:text-[var(--pf-text)]"
                >
                  <Globe size={13} className="shrink-0 text-[var(--pf-faint)]" aria-hidden="true" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={copyProfileLink}
            className="pf-btn-ghost inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium"
          >
            {copied ? <Check size={15} className="text-[var(--pf-text)]" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeader;