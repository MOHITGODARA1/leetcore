import { MessageSquare, Send, Smile, Star } from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";

function FeedbackPage() {
    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white">
                <div className="max-w-5xl">
                    <p className="text-sm text-[#F46717] font-semibold">Feedback</p>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-normal">
                        Help shape LeetCore
                    </h1>
                    <p className="mt-3 max-w-2xl text-white/55 leading-7">
                        Tell us what feels smooth, what feels confusing, and what would make practice easier.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                    <form className="rounded-2xl border border-white/8 bg-[#111113] p-5 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm text-white/65">Feedback type</span>
                                <select className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#F46717]">
                                    <option className="bg-[#111113]">Product experience</option>
                                    <option className="bg-[#111113]">Question quality</option>
                                    <option className="bg-[#111113]">Dashboard design</option>
                                    <option className="bg-[#111113]">Other</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm text-white/65">Rating</span>
                                <select className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#F46717]">
                                    <option className="bg-[#111113]">5 - Excellent</option>
                                    <option className="bg-[#111113]">4 - Good</option>
                                    <option className="bg-[#111113]">3 - Okay</option>
                                    <option className="bg-[#111113]">2 - Needs work</option>
                                    <option className="bg-[#111113]">1 - Frustrating</option>
                                </select>
                            </label>
                        </div>

                        <label className="mt-5 block">
                            <span className="text-sm text-white/65">Your feedback</span>
                            <textarea
                                rows="8"
                                placeholder="What should we improve?"
                                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#F46717]"
                            />
                        </label>

                        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-white/45">Your feedback stays connected to your account so we can follow up.</p>
                            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F46717] px-5 py-3 font-semibold text-white hover:bg-[#ff7d34] transition">
                                <Send size={18} />
                                Send feedback
                            </button>
                        </div>
                    </form>

                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-white/8 bg-white/6 p-5">
                            <div className="w-11 h-11 rounded-2xl bg-[#F46717]/15 text-[#F46717] flex items-center justify-center">
                                <MessageSquare size={20} />
                            </div>
                            <h2 className="mt-4 text-lg font-semibold">What helps most?</h2>
                            <p className="mt-2 text-sm leading-6 text-white/55">
                                Specific examples are gold: the page, the device size, and what you expected to happen.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                                <Star className="text-yellow-300" size={20} />
                                <p className="mt-3 text-2xl font-semibold">4.8</p>
                                <p className="text-xs text-white/45">Avg rating</p>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                                <Smile className="text-green-300" size={20} />
                                <p className="mt-3 text-2xl font-semibold">92%</p>
                                <p className="text-xs text-white/45">Happy users</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardPageShell>
    );
}

export default FeedbackPage;
