import { ArrowRight, Brain, CheckCircle2, Clock3, FileText, LaptopMinimalCheck, ShieldCheck } from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";

function OnlineAssessmentPage() {
    const assessments = [
        { title: "DSA Screening Set", level: "Medium", duration: "70 min", questions: 8, status: "Ready" },
        { title: "Core CS Fundamentals", level: "Mixed", duration: "45 min", questions: 20, status: "Ready" },
        { title: "Operating Systems Drill", level: "Easy", duration: "30 min", questions: 15, status: "New" },
    ];

    const checkpoints = [
        "Timed practice with interview-style pressure",
        "Topic-wise feedback after submission",
        "Balanced mix of coding and core CS questions",
    ];

    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white">
                <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
                    <div>
                        <p className="text-sm text-[#F46717] font-semibold">Online Assessment</p>
                        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-normal">
                            Practice OA rounds with structure
                        </h1>
                        <p className="mt-3 max-w-2xl text-white/55 leading-7">
                            Train for company-style assessments with timed sets, clean progress, and focused review.
                        </p>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90 transition">
                        Start quick OA
                        <ArrowRight size={18} />
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
                    <section className="space-y-4">
                        {assessments.map((assessment) => (
                            <article key={assessment.title} className="rounded-2xl border border-white/8 bg-[#111113] p-5 sm:p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#F46717]/15 text-[#F46717] flex items-center justify-center flex-shrink-0">
                                            <LaptopMinimalCheck size={22} />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-semibold">{assessment.title}</h2>
                                                <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-300">{assessment.status}</span>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/50">
                                                <span className="inline-flex items-center gap-2"><Brain size={15} /> {assessment.level}</span>
                                                <span className="inline-flex items-center gap-2"><Clock3 size={15} /> {assessment.duration}</span>
                                                <span className="inline-flex items-center gap-2"><FileText size={15} /> {assessment.questions} questions</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="rounded-2xl bg-[#F46717] px-5 py-3 text-sm font-semibold text-white hover:bg-[#ff7d34] transition">
                                        Open assessment
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>

                    <aside className="rounded-2xl border border-white/8 bg-white/6 p-5 sm:p-6">
                        <div className="w-11 h-11 rounded-2xl bg-green-400/10 text-green-300 flex items-center justify-center">
                            <ShieldCheck size={22} />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold">Before you start</h2>
                        <div className="mt-5 space-y-4">
                            {checkpoints.map((item) => (
                                <p key={item} className="flex gap-3 text-sm leading-6 text-white/60">
                                    <CheckCircle2 size={18} className="mt-0.5 text-green-300 flex-shrink-0" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardPageShell>
    );
}

export default OnlineAssessmentPage;
