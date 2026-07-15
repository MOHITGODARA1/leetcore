import { CalendarDays, Mail, MapPin, User } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useDashboardStats } from "../../gamification/hooks/useDashboardStats";

function UserDetail() {
    const { user } = useAuth();
    const { data } = useDashboardStats(user?._id);

    const displayName = user?.name || user?.username || "LeetCore Coder";
    const username = user?.username ? `@${user.username}` : "@leetcore";
    const joined = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })
        : "This season";

    const profileStats = data?.stats || user?.stats || {};
    const totalSolved = profileStats.totalProblemsSolved || 0;
    const currentStreak = profileStats.currentStreak || 0;
    const level = data?.stats?.level || user?.level || 1;
    const xp = data?.stats?.xp || user?.xp || 0;

    return (
        <div className="h-full  flex flex-col p-5 sm:p-6 text-white font-sans">
            {/* User Identity Section */}
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[0_14px_34px_rgba(0,0,0,0.18)]">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                        <User size={28} className="text-neutral-400" />
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-semibold text-neutral-100 truncate leading-tight" title={displayName}>
                        {displayName}
                    </h1>
                    <p className="text-xs text-neutral-400 truncate mt-1" title={username}>
                        {username}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/25 uppercase tracking-wider shadow-[0_0_8px_rgba(249,115,22,0.08)]">
                            Level {level}
                        </span>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10 uppercase tracking-wider">
                            {xp} XP
                        </span>
                    </div>
                </div>
            </div>

            {/* GitHub Profile Link as LeetCode-style Button */}
            {user?.profileUrl && (
                <a
                    href={user.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="lc-pressable mt-8 flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl border border-white/10 bg-white/90 text-black text-xs font-semibold  cursor-pointer"
                >
                    <FiGithub size={13} className="opacity-80" />
                    <span>GitHub Profile</span>
                </a>
            )}

            {/* Bio Section */}
            <div className="mt-5">
                {user?.bio ? (
                    <p className="text-sm leading-relaxed text-neutral-400 break-words">{user.bio}</p>
                ) : (
                    <p className="text-xs leading-relaxed text-neutral-500 italic">
                        Building interview confidence one focused practice session at a time.
                    </p>
                )}
            </div>

            {/* Stats Summary Line */}
            <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4 mt-5 text-center">
                <div className="text-left">
                    <div className="text-sm font-semibold text-white">{totalSolved}</div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Solved</div>
                </div>
                <div className="text-left">
                    <div className="text-sm font-semibold text-white">{currentStreak}d</div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Streak</div>
                </div>
                <div className="text-left">
                    <div className="text-sm font-semibold text-white">{level}</div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">Level</div>
                </div>
            </div>

            {/* Info List */}
            <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                    <Mail size={14} className="text-neutral-500 flex-shrink-0" />
                    <span className="truncate text-neutral-300" title={user?.email}>{user?.email || "No email connected"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                    <CalendarDays size={14} className="text-neutral-500 flex-shrink-0" />
                    <span className="text-neutral-300">Joined {joined}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                    <MapPin size={14} className="text-neutral-500 flex-shrink-0" />
                    <span className="text-neutral-300">India Standard Time</span>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
