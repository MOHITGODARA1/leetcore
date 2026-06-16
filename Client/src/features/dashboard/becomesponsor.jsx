import { useState, useEffect } from "react";
import {
    HeartHandshake, Building2, User, Mail, Phone, MessageSquare, Send,
    CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, Star, Users, BarChart3, Zap
} from "lucide-react";
import DashboardPageShell from "./components/DashboardPageShell";
import { useAuth } from "../../context/AuthContext";
import { sponsorshipService } from "../../services/sponsorshipService";

const BENEFITS = [
    {
        icon: Users,
        title: "Targeted Audience",
        text: "Directly reach students, engineers, and developers preparing for technical interviews, DSA, and system design.",
        stat: "50k+",
        statLabel: "active learners",
    },
    {
        icon: BarChart3,
        title: "High Engagement",
        text: "Sponsor card placements are integrated contextually into learning dashboards without intrusive ads.",
        stat: "4.2×",
        statLabel: "avg. click rate",
    },
    {
        icon: Zap,
        title: "Empower the Community",
        text: "Every sponsorship helps keep the platform free, funding education and support for early-career developers.",
        stat: "100%",
        statLabel: "education impact",
    },
];

const LOGOS = ["Google", "Microsoft", "Stripe", "Notion", "Vercel", "Linear"];

function SuccessState({ message, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-green-400/10 flex items-center justify-center border border-green-400/25">
                <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Request Received!</h2>
            <p className="text-sm text-white/50 max-w-sm leading-6">
                {message || "Thank you for your interest in sponsoring our platform. Our team has received your request and will contact you shortly to discuss the opportunity."}
            </p>
            <button
                type="button"
                onClick={onReset}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/4 px-5 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <ArrowRight size={14} />
                Submit another request
            </button>
        </div>
    );
}

export default function BecomeSponsorPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (user) {
            setForm((f) => ({
                ...f,
                contactName: user.name || user.username || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    const validate = () => {
        const e = {};
        if (!form.companyName.trim()) {
            e.companyName = "Organization/Company Name is required";
        }
        if (!form.contactName.trim()) {
            e.contactName = "Contact Person Name is required";
        }
        if (!form.email.trim()) {
            e.email = "Email Address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            e.email = "Please enter a valid email address";
        }
        if (!form.phone.trim()) {
            e.phone = "Phone Number is required";
        } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(form.phone.trim())) {
            e.phone = "Please enter a valid phone number";
        }
        if (!form.message.trim()) {
            e.message = "Sponsorship Details / Message is required";
        } else if (form.message.trim().length < 20) {
            e.message = "Please tell us a bit more (at least 20 characters)";
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        setErrorMsg("");
        try {
            const payload = {
                companyName: form.companyName.trim(),
                contactName: form.contactName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                message: form.message.trim(),
            };
            const response = await sponsorshipService.submitSponsorshipRequest(payload);
            if (response.data && response.data.success) {
                setSuccessMsg(response.data.message);
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Failed to submit sponsorship request:", err);
            setErrorMsg(
                err.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setForm({
            companyName: "",
            contactName: user?.name || user?.username || "",
            email: user?.email || "",
            phone: "",
            message: "",
        });
        setErrors({});
        setErrorMsg("");
        setSuccessMsg("");
    };

    return (
        <DashboardPageShell>
            <div className="p-5 sm:p-8 text-white max-w-6xl mx-auto">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F46717]/20 bg-[#F46717]/8 text-[#F46717] text-xs font-semibold uppercase tracking-wider mb-5">
                        <HeartHandshake size={14} />
                        Sponsor Us
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        Reach developers & support{" "}
                        <span className="bg-gradient-to-r from-[#F46717] to-[#ff8c4b] bg-clip-text text-transparent">
                            early-career talent
                        </span>
                    </h1>
                    <p className="mt-4 text-white/50 text-sm sm:text-base leading-7 max-w-2xl mx-auto">
                        Partner with LeetCore to build brand awareness with high-intent learners, while funding scholarships, server resources, and tools for students and developers worldwide.
                    </p>
                </div>

                {/* Social Proof logos */}
                <div className="mb-12 border border-white/5 rounded-2xl bg-white/2 p-4 sm:p-5 flex items-center justify-center gap-5 sm:gap-10 flex-wrap opacity-50 hover:opacity-75 transition-opacity">
                    <span className="text-xs text-white/40 uppercase tracking-widest font-semibold shrink-0">
                        Supporting organizations like
                    </span>
                    {LOGOS.map((logo) => (
                        <span key={logo} className="text-sm font-bold tracking-wider text-white/30 hover:text-white/60 transition-colors uppercase">
                            {logo}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
                    {/* Left side: benefits & guide */}
                    <div className="space-y-6">
                        {/* Benefits cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {BENEFITS.map(({ icon: Icon, title, text, stat, statLabel }) => (
                                <div key={title} className="rounded-2xl border border-white/8 bg-[#111113]/80 p-5 hover:border-[#F46717]/30 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-[#F46717]/10 text-[#F46717] flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <Icon size={18} />
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                                    <p className="mt-2 text-xs leading-5 text-white/40">{text}</p>
                                    <div className="mt-4 flex items-baseline gap-1.5 border-t border-white/5 pt-3">
                                        <span className="text-xl font-bold text-[#F46717] font-mono">{stat}</span>
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider">{statLabel}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Why Sponsor Section */}
                        <div className="rounded-2xl border border-white/8 bg-[#111113]/80 p-6 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Sparkles className="text-[#F46717]" size={18} />
                                Why sponsor LeetCore?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "Direct Recruitment", desc: "Build developer relations and advertise hiring directly to top performing programmers." },
                                    { title: "Product Adoption", desc: "Get tools, APIs, and cloud services adopted by students and developers early in their workflow." },
                                    { title: "Sustaining Open Education", desc: "Provide high quality DSA, gamified practice sheets, and mock tests to learners." },
                                    { title: "Brand Alignment", desc: "Showcase your company's alignment with open-source education, tech diversity, and community building." },
                                ].map(({ title, desc }) => (
                                    <div key={title} className="flex gap-3">
                                        <ShieldCheck className="text-green-400 shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <p className="text-sm font-semibold">{title}</p>
                                            <p className="text-xs text-white/40 leading-5 mt-1">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sponsorship tiers */}
                        <div className="rounded-2xl border border-white/8 bg-[#111113]/80 p-6 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Star className="text-yellow-400" size={18} />
                                Flexible levels to suit your goals
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { name: "Starter", desc: "Best for individual creators, open source projects, and local tech groups.", highlight: false },
                                    { name: "Growth (Popular)", desc: "Perfect for scaling startups, developer tooling, and mid-sized teams.", highlight: true },
                                    { name: "Enterprise / Partner", desc: "Full co-branded placement, tailored challenges, and direct hiring access.", highlight: false }
                                ].map(({ name, desc, highlight }) => (
                                    <div key={name} className={`p-4 rounded-xl border text-xs leading-5 transition-all ${
                                        highlight
                                            ? "border-[#F46717] bg-[#F46717]/5 text-white"
                                            : "border-white/5 bg-white/2 text-white/50"
                                    }`}>
                                        <p className={`font-semibold text-sm ${highlight ? "text-[#F46717]" : "text-white"}`}>{name}</p>
                                        <p className="mt-2 text-white/40 leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side: form or success state */}
                    <div className="rounded-2xl border border-white/8 bg-[#111113] p-5 sm:p-6 sticky top-6">
                        {submitted ? (
                            <SuccessState message={successMsg} onReset={handleReset} />
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-white/6 mb-3">
                                    <div className="w-9 h-9 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center">
                                        <Sparkles size={16} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white leading-tight">Become a Partner</h2>
                                        <p className="text-[10px] text-white/35 mt-0.5">We review requests in 48 hours</p>
                                    </div>
                                </div>

                                {/* Company Name */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-white/50 font-medium mb-1.5">
                                        <Building2 size={13} className="text-white/30" />
                                        Organization / Company Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.companyName}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, companyName: e.target.value }));
                                            setErrors((er) => ({ ...er, companyName: null }));
                                        }}
                                        placeholder="e.g. Acme Corporation"
                                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white/4 text-white placeholder:text-white/20 outline-none transition-colors ${
                                            errors.companyName ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-[#F46717]"
                                        }`}
                                    />
                                    {errors.companyName && (
                                        <p className="text-[11px] text-red-400 mt-1">{errors.companyName}</p>
                                    )}
                                </div>

                                {/* Contact Person Name */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-white/50 font-medium mb-1.5">
                                        <User size={13} className="text-white/30" />
                                        Contact Person Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.contactName}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, contactName: e.target.value }));
                                            setErrors((er) => ({ ...er, contactName: null }));
                                        }}
                                        placeholder="e.g. Jane Doe"
                                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white/4 text-white placeholder:text-white/20 outline-none transition-colors ${
                                            errors.contactName ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-[#F46717]"
                                        }`}
                                    />
                                    {errors.contactName && (
                                        <p className="text-[11px] text-red-400 mt-1">{errors.contactName}</p>
                                    )}
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-white/50 font-medium mb-1.5">
                                        <Mail size={13} className="text-white/30" />
                                        Email Address <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.email}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, email: e.target.value }));
                                            setErrors((er) => ({ ...er, email: null }));
                                        }}
                                        placeholder="e.g. jane@acme.com"
                                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white/4 text-white placeholder:text-white/20 outline-none transition-colors ${
                                            errors.email ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-[#F46717]"
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-white/50 font-medium mb-1.5">
                                        <Phone size={13} className="text-white/30" />
                                        Phone Number <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.phone}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, phone: e.target.value }));
                                            setErrors((er) => ({ ...er, phone: null }));
                                        }}
                                        placeholder="e.g. +1 (555) 019-2834"
                                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white/4 text-white placeholder:text-white/20 outline-none transition-colors ${
                                            errors.phone ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-[#F46717]"
                                        }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Sponsorship Message */}
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-white/50 font-medium mb-1.5">
                                        <MessageSquare size={13} className="text-white/30" />
                                        Sponsorship Details / Message <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={form.message}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, message: e.target.value }));
                                            setErrors((er) => ({ ...er, message: null }));
                                        }}
                                        placeholder="How would you like to sponsor us? (Starter, Growth, Partner tiers, target placements, developer advocacy details...)"
                                        className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm bg-white/4 text-white placeholder:text-white/20 outline-none transition-colors ${
                                            errors.message ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-[#F46717]"
                                        }`}
                                    />
                                    {errors.message && (
                                        <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>
                                    )}
                                </div>

                                {errorMsg && (
                                    <p className="text-xs text-red-400 font-medium bg-red-400/10 border border-red-400/20 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                                        <AlertTriangle size={14} className="shrink-0" />
                                        {errorMsg}
                                    </p>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all shadow-md ${
                                        loading
                                            ? "bg-[#F46717]/60 cursor-not-allowed"
                                            : "bg-[#F46717] hover:bg-[#ff7d34] hover:shadow-[#F46717]/25 active:scale-95"
                                    }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            Submitting…
                                        </span>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            Submit interest
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-white/30 leading-relaxed text-center">
                                    No immediate commitments. We review requests and provide tailored options in under 48 hours.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </DashboardPageShell>
    );
}