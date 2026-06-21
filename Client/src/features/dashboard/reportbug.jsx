import { useState } from "react";
import {
    Bug, Send, CheckCircle2, AlertTriangle,
    Monitor, Smartphone, Tablet, CheckCircle, Clock
} from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";
import { useAuth } from "../../context/AuthContext";
import { bugService } from "../../services/bugService";

const BUG_AREAS = [
    { value: "profile", label: "Profile" },
    { value: "dashboard", label: "Dashboard" },
    { value: "auth", label: "Login / Logout" },
    { value: "practice", label: "Practice questions" },
    { value: "editor", label: "Code editor" },
    { value: "other", label: "Other" },
];

const DEVICES = [
    { value: "desktop", label: "Desktop", icon: Monitor },
    { value: "tablet", label: "Tablet", icon: Tablet },
    { value: "mobile", label: "Mobile", icon: Smartphone },
];

const MAX_CHARS = 1000;

function SuccessState({ message, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Bug report submitted!</h2>
            <p className="text-sm text-white/50 max-w-xs leading-6">
                {message || "Our team will investigate and may follow up via your account email. Thanks for helping make LeetCore better."}
            </p>
            <button onClick={onReset} className="mt-2 text-sm text-[#F46717] hover:underline">
                Submit another report
            </button>
        </div>
    );
}

export default function ReportBugPage() {
    const { user } = useAuth();
    const [area, setArea] = useState("dashboard");
    const [device, setDevice] = useState("desktop");
    const [title, setTitle] = useState("");
    const [steps, setSteps] = useState("");
    const [expected, setExpected] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const charsLeft = MAX_CHARS - steps.length;
    const canSubmit = title.trim().length > 3 && steps.trim().length > 10 && !loading;

    const handleSubmit = async () => {
        if (!canSubmit || !user) return;
        setLoading(true);
        setErrorMsg("");
        try {
            // Concatenate expected behaviour if provided
            const fullDescription = expected.trim() 
                ? `${steps}\n\nExpected behavior:\n${expected}`
                : steps;

            const payload = {
                userId: user._id,
                name: user.name || user.username,
                email: user.email,
                device,
                bugArea: area,
                bugTitle: title,
                bugDescription: fullDescription,
            };
            const response = await bugService.submitBugReport(payload);
            if (response.data && response.data.success) {
                setSuccessMsg(response.data.message);
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Failed to submit bug report:", err);
            setErrorMsg(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setTitle("");
        setSteps("");
        setExpected("");
        setArea("dashboard");
        setDevice("desktop");
        setErrorMsg("");
        setSuccessMsg("");
    };

    // Progress: title + steps + expected = 3 segments
    const progress = Math.round(
        ((title.trim().length > 3 ? 34 : 0) +
        (steps.trim().length > 10 ? 33 : 0) +
        (expected.trim().length > 3 ? 33 : 0))
    );

    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white">
                {/* Header */}
                <div className="max-w-5xl">
                    <p className="text-sm text-[#F46717] font-semibold tracking-wide uppercase">Report Bug</p>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Found{" "}
                        <span className="bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                            something broken?
                        </span>
                    </h1>
                    <p className="mt-3 max-w-2xl text-white/50 leading-7">
                        Share the issue and steps to reproduce so we can fix it fast. The more detail, the better.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                    {/* Form card */}
                    <div className="rounded-2xl border border-white/8 bg-[#111113] overflow-hidden">
                        {/* Progress bar */}
                        <div className="h-1 bg-white/5 relative">
                            <div
                                className="h-full bg-[#F46717] transition-all duration-500 shadow-[0_0_12px_#F46717]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="p-5 sm:p-7">
                            {submitted ? (
                                <SuccessState message={successMsg} onReset={handleReset} />
                            ) : (
                                <div className="space-y-7">

                                    {/* Area + Device row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
                                                <Bug size={14} className="text-red-400" />
                                                <span>Bug area</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {BUG_AREAS.map(({ value, label }) => (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => setArea(value)}
                                                        className={`px-3 py-1.5 rounded-xl border text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                                            area === value
                                                                ? "border-[#F46717] bg-[#F46717]/10 text-white shadow-md shadow-[#F46717]/5"
                                                                : "border-white/10 bg-white/4 text-white/55 hover:border-white/20 hover:text-white"
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
                                                <Monitor size={14} className="text-blue-400" />
                                                <span>Device</span>
                                            </label>
                                            <div className="flex gap-2">
                                                {DEVICES.map(({ value, label, icon: Icon }) => (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => setDevice(value)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                                            device === value
                                                                ? "border-[#F46717] bg-[#F46717]/10 text-white shadow-md shadow-[#F46717]/5"
                                                                : "border-white/10 bg-white/4 text-white/55 hover:border-white/20 hover:text-white"
                                                        }`}
                                                    >
                                                        <Icon size={13} />
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Priority picker removed */}

                                    {/* Title */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
                                            <AlertTriangle size={14} className="text-yellow-400" />
                                            <span>Bug title <span className="text-red-400">*</span></span>
                                        </label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Profile cards overlap on mobile"
                                            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#F46717] focus:ring-1 focus:ring-[#F46717] transition-all duration-300"
                                        />
                                    </div>

                                    {/* Steps to reproduce */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white/70">
                                                <Clock size={14} className="text-orange-400" />
                                                <span>Steps to reproduce <span className="text-red-400">*</span></span>
                                            </label>
                                            <span className={`text-xs tabular-nums ${charsLeft < 100 ? "text-red-400" : "text-white/25"}`}>
                                                {charsLeft} left
                                            </span>
                                        </div>
                                        <textarea
                                            rows={5}
                                            maxLength={MAX_CHARS}
                                            value={steps}
                                            onChange={(e) => setSteps(e.target.value)}
                                            placeholder={"1. Go to...\n2. Click on...\n3. See the error"}
                                            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#F46717] focus:ring-1 focus:ring-[#F46717] transition-all duration-300 font-mono"
                                        />
                                    </div>

                                    {/* Expected behaviour */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
                                            <CheckCircle2 size={14} className="text-green-400" />
                                            <span>Expected behaviour</span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={expected}
                                            onChange={(e) => setExpected(e.target.value)}
                                            placeholder="What should have happened instead?"
                                            className="w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#F46717] focus:ring-1 focus:ring-[#F46717] transition-all duration-300"
                                        />
                                    </div>

                                    {errorMsg && (
                                        <p className="text-sm text-red-400 font-medium bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-xl">
                                            {errorMsg}
                                        </p>
                                    )}

                                    {/* Footer */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-white/6">
                                        <p className="text-xs text-white/35 leading-5 max-w-xs">
                                            Reports are linked to your account. We may follow up if we need more info.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={!canSubmit}
                                            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all shadow-md ${
                                                canSubmit
                                                    ? "bg-[#F46717] text-white hover:bg-[#ff7d34] hover:shadow-[#F46717]/20 active:scale-95"
                                                    : "bg-white/5 text-white/25 cursor-not-allowed"
                                            }`}
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                    Submitting…
                                                </span>
                                            ) : (
                                                <><Send size={15} />Submit report</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-4">
                        {/* Tips */}
                        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.01] p-5 hover:border-red-500/30 hover:bg-red-500/[0.02] transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-red-500/12 text-red-400 flex items-center justify-center mb-4">
                                <Bug size={18} />
                            </div>
                            <h2 className="text-base font-semibold mb-3">A useful bug report includes</h2>
                            <div className="space-y-3">
                                {[
                                    "The exact page or route where it happened",
                                    "Your browser and device size if layout-related",
                                    "The behaviour you expected vs. what occurred",
                                ].map((tip) => (
                                    <div key={tip} className="flex items-start gap-2.5 font-sans">
                                        <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-white/55 leading-5">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="rounded-2xl border border-yellow-500/20 border-l-4 border-l-yellow-500 bg-yellow-500/[0.03] p-5 hover:border-yellow-500/40 hover:bg-yellow-500/[0.05] transition-all duration-300">
                            <div className="flex items-center gap-2 text-yellow-400 mb-3">
                                <AlertTriangle size={18} />
                                <span className="font-semibold text-sm">Account Issue Notice</span>
                            </div>
                            <p className="text-sm text-white/55 leading-6">
                                For account access issues, try signing out and back in before submitting. This resolves most auth-related bugs.
                            </p>
                        </div>

                        {/* Priority legend removed */}
                    </aside>
                </div>
            </div>
        </DashboardPageShell>
    );
}