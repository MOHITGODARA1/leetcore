import { Award, Clock, Flame, Target } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import ConsistencyBar from "../../Profile/components/consistencybar";
import { useDashboardStats } from "../hooks/useDashboardStats";

function StatTile({ icon, label, value }) {
    return (
        <div className="rounded-lg border border-white/8 bg-[#151516] p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white/50">{label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F46717]/15 text-[#F46717]">
                    {icon}
                </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
        </div>
    );
}

function DashboardGamification() {
    const { user } = useAuth();
    const { data, loading } = useDashboardStats(user?._id);
    const stats = user?.stats || data?.stats || {};
    const badgesCount = user?.badges?.length ?? stats.badgesCount ?? 0;

    return (
        <section className="px-4 pb-5 sm:px-6">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-white/45">Learning momentum</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">Gamification</h2>
                </div>
                {loading && <span className="text-xs text-white/40">Syncing stats...</span>}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile icon={<Flame size={17} />} label="Current streak" value={`${stats.currentStreak || 0}d`} />
                <StatTile icon={<Target size={17} />} label="Active days" value={stats.totalActiveDays || 0} />
                <StatTile icon={<Clock size={17} />} label="Study minutes" value={stats.totalStudyMinutes || 0} />
                <StatTile icon={<Award size={17} />} label="Badges" value={badgesCount} />
            </div>

            <div className="mt-4">
                <ConsistencyBar userId={user?._id} />
            </div>
        </section>
    );
}

export default DashboardGamification;
