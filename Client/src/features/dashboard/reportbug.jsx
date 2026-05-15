import { AlertTriangle, Bug, CheckCircle2, Send } from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";

function ReportBugPage() {
    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white">
                <div className="max-w-5xl">
                    <p className="text-sm text-[#F46717] font-semibold">Report Bug</p>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-normal">
                        Found something broken?
                    </h1>
                    <p className="mt-3 max-w-2xl text-white/55 leading-7">
                        Share the issue and the steps to reproduce it so it can be fixed quickly.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                    <form className="rounded-2xl border border-white/8 bg-[#111113] p-5 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm text-white/65">Bug area</span>
                                <select className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#F46717]">
                                    <option className="bg-[#111113]">Profile</option>
                                    <option className="bg-[#111113]">Dashboard</option>
                                    <option className="bg-[#111113]">Login or logout</option>
                                    <option className="bg-[#111113]">Practice questions</option>
                                    <option className="bg-[#111113]">Other</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm text-white/65">Priority</span>
                                <select className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#F46717]">
                                    <option className="bg-[#111113]">Normal</option>
                                    <option className="bg-[#111113]">High</option>
                                    <option className="bg-[#111113]">Critical</option>
                                </select>
                            </label>
                        </div>

                        <label className="mt-5 block">
                            <span className="text-sm text-white/65">Title</span>
                            <input
                                placeholder="Example: Profile cards overlap on mobile"
                                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#F46717]"
                            />
                        </label>

                        <label className="mt-5 block">
                            <span className="text-sm text-white/65">Steps to reproduce</span>
                            <textarea
                                rows="7"
                                placeholder="1. Open... 2. Click... 3. See..."
                                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#F46717]"
                            />
                        </label>

                        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-white/45">Screenshots can be added when bug storage is connected.</p>
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F46717] px-5 py-3 font-semibold text-white hover:bg-[#ff7d34] transition">
                                <Send size={18} />
                                Submit report
                            </button>
                        </div>
                    </form>

                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                            <div className="w-11 h-11 rounded-2xl bg-red-500/15 text-red-300 flex items-center justify-center">
                                <Bug size={20} />
                            </div>
                            <h2 className="mt-4 text-lg font-semibold">A useful bug report includes</h2>
                            <div className="mt-4 space-y-3 text-sm text-white/60">
                                <p className="flex gap-2"><CheckCircle2 size={17} className="text-green-300 flex-shrink-0" /> The page or route where it happened.</p>
                                <p className="flex gap-2"><CheckCircle2 size={17} className="text-green-300 flex-shrink-0" /> Device size and browser if layout is involved.</p>
                                <p className="flex gap-2"><CheckCircle2 size={17} className="text-green-300 flex-shrink-0" /> The exact behavior you expected.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-yellow-300/15 bg-yellow-300/8 p-5">
                            <AlertTriangle className="text-yellow-300" size={22} />
                            <p className="mt-3 text-sm leading-6 text-white/60">
                                For account access issues, log out and sign in again after submitting the report.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardPageShell>
    );
}

export default ReportBugPage;
