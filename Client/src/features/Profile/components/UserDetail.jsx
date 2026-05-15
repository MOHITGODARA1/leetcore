import { CalendarDays, ExternalLink, Mail, MapPin, Trophy, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

function UserDetail() {
    const { user } = useAuth();

    const displayName = user?.name || user?.username || "LeetCore Coder";
    const username = user?.username ? `@${user.username}` : "@leetcore";
    const joined = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })
        : "This season";

    const stats = [
        { label: "Problems", value: "225" },
        { label: "Streak", value: "85d" },
        { label: "Rank", value: "Top 8%" },
    ];


    return (

        <div
            className="
                h-full
                flex
                flex-col
                p-5
                sm:p-6
                relative
                text-white
            "
        >
            <div className="flex flex-col items-center text-center">
                <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-[#1f1f22] border border-white/10 overflow-hidden flex items-center justify-center">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <User size={42} className="text-white/60" />
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-[#F46717] border-4 border-[#101011] flex items-center justify-center">
                        <Trophy size={16} />
                    </div>
                </div>

                <h1 className="mt-5 text-2xl font-semibold leading-tight break-words max-w-full">
                    {displayName}
                </h1>
                <p className="mt-1 text-sm text-white/50 break-all">{username}</p>

                {user?.bio ? (
                    <p className="mt-4 text-sm leading-6 text-white/65">{user.bio}</p>
                ) : (
                    <p className="mt-4 text-sm leading-6 text-white/65">
                        Building interview confidence one focused practice session at a time.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 my-6">
                {stats.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/8 bg-white/6 p-3 text-center">
                        <p className="text-base font-semibold">{item.value}</p>
                        <p className="mt-1 text-[11px] text-white/45">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-3 text-sm text-white/65">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                    <Mail size={16} className="text-[#F46717] flex-shrink-0" />
                    <span className="truncate">{user?.email || "No email connected"}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                    <CalendarDays size={16} className="text-[#F46717] flex-shrink-0" />
                    <span>Joined {joined}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                    <MapPin size={16} className="text-[#F46717] flex-shrink-0" />
                    <span>India Standard Time</span>
                </div>
            </div>

            {user?.profileUrl && (
                <a
                    href={user.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black px-4 py-3 text-sm font-semibold transition hover:bg-white/90"
                >
                    View GitHub
                    <ExternalLink size={16} />
                </a>
            )}


        </div>

    );
}

export default UserDetail;
