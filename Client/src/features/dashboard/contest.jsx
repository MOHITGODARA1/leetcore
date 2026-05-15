import { CalendarDays, Medal, Play, Target, Trophy, Users } from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";

function ContestPage() {
    const contests = [
        { name: "Weekly DSA Sprint", date: "Sunday, 8:00 PM", participants: "1.2K", prize: "Rating boost" },
        { name: "Core CS Challenge", date: "Wednesday, 7:30 PM", participants: "680", prize: "Badge unlock" },
        { name: "Placement Mock Battle", date: "Friday, 9:00 PM", participants: "940", prize: "Leaderboard rank" },
    ];

    const standings = [
        { rank: 1, name: "codewithmohit", score: 980 },
        { rank: 2, name: "stack_master", score: 940 },
        { rank: 3, name: "graph_runner", score: 910 },
    ];

    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                    <section className="rounded-2xl border border-white/8 bg-[#111113] p-6 sm:p-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#F46717]/15 text-[#F46717] flex items-center justify-center">
                            <Trophy size={24} />
                        </div>
                        <p className="mt-6 text-sm text-[#F46717] font-semibold">Contest</p>
                        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold leading-tight tracking-normal">
                            Compete, learn, and climb the leaderboard
                        </h1>
                        <p className="mt-4 max-w-2xl text-white/55 leading-7">
                            Join timed contests across DSA and core CS. Review misses, track your rank, and build speed.
                        </p>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
                                <Target className="text-[#F46717]" size={22} />
                                <p className="mt-4 text-2xl font-semibold">24</p>
                                <p className="text-sm text-white/45">Contests played</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
                                <Medal className="text-yellow-300" size={22} />
                                <p className="mt-4 text-2xl font-semibold">Top 8%</p>
                                <p className="text-sm text-white/45">Best rank</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/8 p-5">
                                <Users className="text-green-300" size={22} />
                                <p className="mt-4 text-2xl font-semibold">3.1K</p>
                                <p className="text-sm text-white/45">Active players</p>
                            </div>
                        </div>
                    </section>

                    <aside className="rounded-2xl border border-white/8 bg-white/6 p-5 sm:p-6">
                        <h2 className="text-xl font-semibold">Top standings</h2>
                        <div className="mt-5 space-y-3">
                            {standings.map((user) => (
                                <div key={user.name} className="flex items-center justify-between rounded-2xl bg-[#111113] border border-white/6 p-4">
                                    <div>
                                        <p className="text-sm text-white/45">#{user.rank}</p>
                                        <p className="font-semibold">{user.name}</p>
                                    </div>
                                    <p className="text-[#F46717] font-semibold">{user.score}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                <section className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {contests.map((contest) => (
                        <article key={contest.name} className="rounded-2xl border border-white/8 bg-white/6 p-5">
                            <h2 className="text-lg font-semibold">{contest.name}</h2>
                            <div className="mt-4 space-y-3 text-sm text-white/55">
                                <p className="flex items-center gap-2"><CalendarDays size={16} className="text-[#F46717]" /> {contest.date}</p>
                                <p className="flex items-center gap-2"><Users size={16} className="text-[#F46717]" /> {contest.participants} registered</p>
                                <p className="flex items-center gap-2"><Medal size={16} className="text-[#F46717]" /> {contest.prize}</p>
                            </div>
                            <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F46717] px-5 py-3 font-semibold text-white hover:bg-[#ff7d34] transition">
                                <Play size={17} />
                                Join contest
                            </button>
                        </article>
                    ))}
                </section>
            </div>
        </DashboardPageShell>
    );
}

export default ContestPage;
