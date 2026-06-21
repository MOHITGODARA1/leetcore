import { useEffect, useState } from "react";
import {
    ArrowRight,
    Bell,
    BookOpen,
    CheckCircle2,
    Code2,
    Database,
    Layers3,
    Network,
    Target,
} from "lucide-react";

const patterns = [
    {
        title: "Arrays",
        progress: 76,
        items: ["Two pointer", "Sliding window", "Prefix sum"],
    },
    {
        title: "Strings",
        progress: 58,
        items: ["Palindrome", "Pattern match", "Anagram"],
    },
    {
        title: "HashMap",
        progress: 84,
        items: ["Frequency", "Pair sum", "Hashing"],
    },
];

const subjects = [
    { title: "Operating System", meta: "15 concepts", icon: Layers3 },
    { title: "Computer Networks", meta: "20 concepts", icon: Network },
    { title: "DBMS", meta: "25 concepts", icon: Database },
    { title: "OOPS", meta: "30 concepts", icon: Code2 },
];

function FeatureShell({ children, className = "" }) {
    return (
        <div className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101011]/82 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition duration-300  ${className}`}>
            <div className="absolute inset-0  opacity-70 transition duration-300 " />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function RoadmapPreview() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % patterns.length);
        }, 2600);

        return () => clearInterval(interval);
    }, []);

    return (
        <FeatureShell className="lg:col-span-7">
            <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="mt-4 max-w-xl text-xl font-semibold leading-tight text-white sm:text-2xl">
                            Move from random questions to a clear interview path.
                        </h2>
                    </div>


                </div>

                <div className="mt-5 grid gap-2.5">
                    {patterns.map((pattern, index) => (
                        <button
                            key={pattern.title}
                            onClick={() => setActive(index)}
                            className={`w-full rounded-2xl border px-3 py-2.5 text-left transition duration-300 ${active === index
                                ? "border-white/10 bg-white/[0.025] hover:border-white/20"
                                : "border-white/10 bg-white/[0.025] hover:border-white/20"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-base font-semibold text-white">
                                        {pattern.title}
                                    </h3>
                                    <div className="mt-1.5 hidden flex-wrap gap-1.5 sm:flex">
                                        {pattern.items.map((item) => (
                                            <span key={item} className="rounded-full bg-black/35 border border-[#ff8a45] px-2.5 py-1 text-[11px] text-[#c8c8d0]">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <span className="text-sm font-semibold text-white">
                                    {pattern.progress}%
                                </span>
                            </div>

                            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-700"
                                    style={{ width: `${pattern.progress}%` }}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </FeatureShell>
    );
}

function SubjectTracker() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % subjects.length);
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    return (
        <FeatureShell className="lg:col-span-5">
            <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <div>

                        <h2 className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                            Know what to study next.
                        </h2>
                    </div>
                    <BookOpen className="text-white" size={26} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {subjects.map((subject, index) => {
                        const Icon = subject.icon;
                        return (
                            <div
                                key={subject.title}
                                className={`flex items-center gap-2.5 rounded-2xl border p-3 transition duration-300 ${active === index
                                    ? "border-white/10 bg-white/[0.025]"
                                    : "border-white/10 bg-white/[0.025]"
                                    }`}
                            >
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#F46717]/25 bg-[#F46717]/10 text-[#F46717]">
                                    <Icon size={17} />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                                        {subject.title}
                                    </h3>
                                    <p className="text-xs text-[#9b9ba6] sm:text-sm">
                                        {subject.meta}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </FeatureShell>
    );
}

function InterviewPrep() {
    return (
        <FeatureShell className="lg:col-span-5">
            <div className="p-4 sm:p-5">

                <h2 className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">
                    Practice with context, not just answers.
                </h2>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-3.5">
                    <div className="flex items-center gap-4">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F46717] text-lg font-bold text-white">
                            1
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">
                                Online Assessment
                            </h3>
                            <p className="text-sm text-[#9b9ba6]">
                                Asked 5 days ago
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-[#b7b7c2]">
                        Recently asked arrays pattern with hints, edge cases, and an efficient approach path.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {["Approach", "Edge cases", "Complexity"].map((item) => (
                            <span key={item} className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-3 py-1 text-xs text-[#c8c8d0]">
                                <CheckCircle2 size={13} className="text-[#F46717]" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </FeatureShell>
    );
}

function DailyConsistency() {
    const [ring, setRing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setRing((prev) => !prev);
        }, 900);

        return () => clearInterval(interval);
    }, []);

    return (
        <FeatureShell className="lg:col-span-7">
            <div className="grid gap-4 p-4 sm:grid-cols-[1fr_180px] sm:p-5">
                <div>

                    <h2 className="mt-1.5 max-w-md text-xl font-semibold text-white sm:text-2xl">
                        Stay consistent without losing track.
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#b7b7c2]">
                        A compact reminder flow for weak topics, revision, and daily practice streaks.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {["OS revision", "DBMS notes", "2 DSA problems"].map((item) => (
                            <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-sm text-white">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="relative grid min-h-[150px] place-items-center rounded-2xl border border-[#F46717]/25 bg-[#F46717]/10">
                    <div className="absolute inset-3 grid grid-cols-4 gap-2 opacity-60">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="rounded-xl bg-white/[0.07]" />
                        ))}
                    </div>

                    <Bell
                        size={68}
                        className={`relative z-10 fill-[#F46717]/35 text-[#F46717] transition duration-500 ${ring ? "rotate-6 scale-105" : "-rotate-6"}`}
                    />
                </div>
            </div>
        </FeatureShell>
    );
}

function FeatureSection() {
    return (
        <section className="bg-transparent px-6 py-6 sm:px-8 sm:py-10 md:px-16">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <RoadmapPreview />
                    <SubjectTracker />
                    <InterviewPrep />
                    <DailyConsistency />
                </div>
            </div>
        </section>
    );
}

export default FeatureSection;
