import { BadgeCheck, HeartHandshake, Megaphone, Send, Sparkles, Users } from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";

function BecomeSponsorPage() {
    const benefits = [
        {
            icon: Users,
            title: "Reach focused learners",
            text: "Show your brand to students preparing for DSA, core CS, and placement interviews.",
        },
        {
            icon: Megaphone,
            title: "Useful placement",
            text: "Sponsor cards appear in calm dashboard surfaces where users already expect guidance.",
        },
        {
            icon: BadgeCheck,
            title: "Simple partnership",
            text: "Start with a compact placement and scale once the audience fit is clear.",
        },
    ];

    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white">
                <section className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
                    <div className="rounded-2xl border border-white/8 bg-[#111113] p-6 sm:p-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#F46717]/15 text-[#F46717] flex items-center justify-center">
                            <HeartHandshake size={24} />
                        </div>
                        <p className="mt-6 text-sm text-[#F46717] font-semibold">Become a Sponsor</p>
                        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold leading-tight tracking-normal">
                            Support better interview preparation
                        </h1>
                        <p className="mt-4 max-w-2xl text-white/55 leading-7">
                            Partner with LeetCore to reach learners who are actively building technical interview skills.
                        </p>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {benefits.map((benefit) => {
                                const Icon = benefit.icon;

                                return (
                                    <div key={benefit.title} className="rounded-2xl border border-white/8 bg-white/5 p-5">
                                        <div className="w-10 h-10 rounded-xl bg-white/8 text-[#F46717] flex items-center justify-center">
                                            <Icon size={18} />
                                        </div>
                                        <h2 className="mt-4 text-base font-semibold">{benefit.title}</h2>
                                        <p className="mt-2 text-sm leading-6 text-white/50">{benefit.text}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-white/8 bg-white/6 p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-yellow-300" size={22} />
                            <h2 className="text-xl font-semibold">Sponsor request</h2>
                        </div>

                        <form className="mt-5 space-y-4">
                            <label className="block">
                                <span className="text-sm text-white/65">Company or creator name</span>
                                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#F46717]" placeholder="Your brand" />
                            </label>
                            <label className="block">
                                <span className="text-sm text-white/65">Email</span>
                                <input className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#F46717]" placeholder="you@example.com" />
                            </label>
                            <label className="block">
                                <span className="text-sm text-white/65">Campaign goal</span>
                                <textarea rows="5" className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#F46717]" placeholder="Tell us what you want to promote." />
                            </label>

                            <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F46717] px-5 py-3 font-semibold text-white hover:bg-[#ff7d34] transition">
                                <Send size={18} />
                                Submit interest
                            </button>
                        </form>
                    </aside>
                </section>
            </div>
        </DashboardPageShell>
    );
}

export default BecomeSponsorPage;
