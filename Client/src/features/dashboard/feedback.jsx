import { useState } from "react";
import {
    MessageSquare, Send, Smile, Star,
    CheckCircle, CheckCircle2, Clock, Lightbulb, Bug, Palette, MoreHorizontal
} from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";
import { useAuth } from "../../context/AuthContext";
import { feedbackService } from "../../services/feedbackService";

const FEEDBACK_CATEGORIES = [
    { value: "experience", label: "Product experience", icon: Smile, color: "text-blue-400", bg: "bg-blue-400/10" },
    { value: "quality", label: "Question quality", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { value: "bug", label: "Bug report", icon: Bug, color: "text-red-400", bg: "bg-red-400/10" },
    { value: "design", label: "Dashboard design", icon: Palette, color: "text-purple-400", bg: "bg-purple-400/10" },
    { value: "other", label: "Other", icon: MoreHorizontal, color: "text-white/50", bg: "bg-white/5" },
];


const MAX_CHARS = 1000;

function StarRating({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                >
                    <Star
                        size={24}
                        className={`transition-colors ${
                            n <= (hovered || value) ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

function SuccessState({ message, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Thanks for the feedback!</h2>
            <p className="text-sm text-white/50 max-w-xs leading-6">
                {message || "We read every submission. If your feedback needs a response, we'll follow up via your account email."}
            </p>
            <button
                onClick={onReset}
                className="mt-2 text-sm text-[#F46717] hover:underline"
            >
                Submit more feedback
            </button>
        </div>
    );
}

export default function FeedbackPage() {
    const { user } = useAuth();
    const [category, setCategory] = useState("experience");
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const selectedCategory = FEEDBACK_CATEGORIES.find((c) => c.value === category);
    const charsLeft = MAX_CHARS - text.length;
    const canSubmit = rating > 0 && text.trim().length > 10 && !loading;

    const handleSubmit = async () => {
        if (!canSubmit || !user) return;
        setLoading(true);
        setErrorMsg("");
        try {
            const payload = {
                userId: user._id,
                name: user.name || user.username,
                email: user.email,
                about: category,
                rating,
                message: text,
            };
            const response = await feedbackService.submitFeedback(payload);
            if (response.data && response.data.success) {
                setSuccessMsg(response.data.message);
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Failed to submit feedback:", err);
            setErrorMsg(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setRating(0);
        setText("");
        setCategory("experience");
        setErrorMsg("");
        setSuccessMsg("");
    };

    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white">
                {/* Header */}
                <div className="max-w-5xl">
                    <p className="text-sm text-[#F46717] font-semibold tracking-wide uppercase">Feedback</p>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Help{" "}
                        <span className="bg-gradient-to-r from-[#F46717] to-[#ff8c4b] bg-clip-text text-transparent">
                            shape LeetCore
                        </span>
                    </h1>
                    <p className="mt-3 max-w-2xl text-white/50 leading-7">
                        Tell us what feels smooth, what feels confusing, and what would make practice easier.
                        Every submission is read by the team.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                    {/* Main form card */}
                    <div className="rounded-2xl border border-white/8 bg-[#111113] overflow-hidden">
                        {/* Progress indicator */}
                        <div className="h-1 bg-white/5 relative">
                            <div
                                className="h-full bg-[#F46717] transition-all duration-500 shadow-[0_0_12px_#F46717]"
                                style={{
                                    width: `${Math.min(
                                        ((rating > 0 ? 33 : 0) + (text.length > 10 ? 34 : 0) + (category ? 33 : 0)),
                                        100
                                    )}%`,
                                }}
                            />
                        </div>

                        <div className="p-5 sm:p-7">
                            {submitted ? (
                                <SuccessState message={successMsg} onReset={handleReset} />
                            ) : (
                                <div className="space-y-7">
                                    {/* Category picker */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                                            <MessageSquare size={14} className="text-[#F46717]" />
                                            <span>What's this about?</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {FEEDBACK_CATEGORIES.map(({ value, label, icon: Icon, color, bg }) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setCategory(value)}
                                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
                                                        category === value
                                                            ? "border-[#F46717] bg-[#F46717]/10 text-white shadow-md shadow-[#F46717]/5"
                                                            : "border-white/10 bg-white/4 text-white/55 hover:border-white/20 hover:text-white"
                                                    }`}
                                                >
                                                    <Icon
                                                        size={14}
                                                        className={category === value ? "text-[#F46717]" : color}
                                                    />
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Star rating */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                                            <Smile size={14} className="text-yellow-400" />
                                            <span>How would you rate your experience?</span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <StarRating value={rating} onChange={setRating} />
                                            {rating > 0 && (
                                                <span className="text-sm text-white/40">
                                                    {["", "Frustrating", "Needs work", "Okay", "Good", "Excellent!"][rating]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Textarea */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-white/70">
                                                <Palette size={14} className="text-blue-400" />
                                                <span>Your feedback</span>
                                            </label>
                                            <span
                                                className={`text-xs tabular-nums ${
                                                    charsLeft < 100 ? "text-red-400" : "text-white/25"
                                                }`}
                                            >
                                                {charsLeft} left
                                            </span>
                                        </div>
                                        <textarea
                                            rows={6}
                                            maxLength={MAX_CHARS}
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="What should we improve? Specific examples (page, device, expected behaviour) are the most helpful."
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
                                            Feedback is linked to your account so we can follow up if needed.
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
                                                    Sending…
                                                </span>
                                            ) : (
                                                <>
                                                    <Send size={15} />
                                                    Send feedback
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Sidebar */}
                    <aside className="space-y-4">
                        {/* Stats row */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { 
                                    icon: Star, 
                                    color: "text-yellow-400", 
                                    iconBg: "bg-yellow-400/10", 
                                    value: "4.8", 
                                    label: "Avg rating",
                                    cardClass: "border-yellow-500/10 bg-yellow-500/[0.02] hover:border-yellow-500/30 hover:bg-yellow-500/[0.04]"
                                },
                                { 
                                    icon: Smile, 
                                    color: "text-green-400", 
                                    iconBg: "bg-green-400/10", 
                                    value: "92%", 
                                    label: "Happy users",
                                    cardClass: "border-green-500/10 bg-green-500/[0.02] hover:border-green-500/30 hover:bg-green-500/[0.04]"
                                },
                                { 
                                    icon: MessageSquare, 
                                    color: "text-blue-400", 
                                    iconBg: "bg-blue-400/10", 
                                    value: "1.2k", 
                                    label: "Total reviews",
                                    cardClass: "border-blue-500/10 bg-blue-500/[0.02] hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
                                },
                                { 
                                    icon: CheckCircle, 
                                    color: "text-[#F46717]", 
                                    iconBg: "bg-[#F46717]/10", 
                                    value: "87%", 
                                    label: "Issues resolved",
                                    cardClass: "border-[#F46717]/10 bg-[#F46717]/[0.02] hover:border-[#F46717]/30 hover:bg-[#F46717]/[0.04]"
                                },
                            ].map(({ icon: Icon, color, iconBg, value, label, cardClass }) => (
                                <div key={label} className={`rounded-2xl border p-4 hover:-translate-y-0.5 transition-all duration-300 cursor-default shadow-sm hover:shadow-md ${cardClass}`}>
                                    <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
                                        <Icon size={16} className={color} />
                                    </div>
                                    <p className="text-xl font-semibold">{value}</p>
                                    <p className="text-xs text-white/40 mt-0.5">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tips card */}
                        <div className="rounded-2xl border border-white/8 bg-[#111113] p-5 hover:border-[#F46717]/20 hover:bg-white/[0.01] transition-all duration-300">
                            <div className="w-10 h-10 rounded-xl bg-[#F46717]/12 text-[#F46717] flex items-center justify-center mb-4">
                                <MessageSquare size={18} />
                            </div>
                            <h2 className="text-base font-semibold mb-3">What helps most?</h2>
                            <ul className="space-y-3">
                                {[
                                    "Include the page or section you were on",
                                    "Mention your device or screen size",
                                    "Describe what you expected to happen",
                                ].map((tip) => (
                                    <li key={tip} className="flex items-start gap-2.5 text-sm text-white/50 leading-5">
                                        <CheckCircle2 size={14} className="text-[#F46717] mt-0.5 shrink-0" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardPageShell>
    );
}