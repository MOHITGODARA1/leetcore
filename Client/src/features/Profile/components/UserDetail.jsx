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
        <div className="h-full flex flex-col p-6 text-white font-sans">
            {/* User Identity Section */}
            <div className="flex items-center gap-4">
                <div className="w-21 h-21 rounded-lg bg-neutral-900 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
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
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F46717]/10 text-[#F46717] border border-[#F46717]/20 uppercase tracking-wider">
                            Level {level}
                        </span>
                        <span className="text-[9px] text-neutral-500 font-medium">
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
                    className="mt-9 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg border border-white/10 bg-white/5 text-neutral-200 text-xs font-semibold hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
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
            <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4 mt-4 text-center">
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
