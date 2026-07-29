import { useState, useMemo } from "react";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import Upperdashnavbar from "../components/common/dashuppernavbar";

const updates = [
  {
    date: "July 19, 2022",
    emoji: "🎨",
    title: "A fresh look and feel",
    author: "Mohit Godara",
    authorImg:
      "https://res.cloudinary.com/dznwqaqjw/image/upload/v1784952223/photo-2_kwbknn.jpg",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=700&fit=crop",
    tags: ["Performance", "Search", "User Interface"],
    readTime: "7 min read",
    summary:
      "A redesigned interface built around clarity, speed, and one consistent visual language across every screen.",
    body: "We announced Leetcore to the world almost two years ago. Since then, the design of the app has mostly stayed the same, even as the number of topics, tracks, and features kept growing. That growth started to show: cards looked inconsistent, colors were applied ad hoc, and it was getting harder to tell at a glance what needed your attention. Today, we're announcing a fresh look and feel that addresses this directly, built from feedback shared by our growing community over the last few months.",
    highlights: [
      {
        title: "One consistent color system",
        detail:
          "Every topic now has a single, deliberate accent color that carries through its icon, progress bar, and buttons — no more random colors per card.",
      },
      {
        title: "Clearer progress tracking",
        detail:
          "Progress bars now show exactly how many levels are done, in progress, or locked, so you always know where you left off.",
      },
      {
        title: "Faster page loads",
        detail:
          "Images across the app now load lazily and layouts were simplified, cutting initial dashboard load time noticeably.",
      },
      {
        title: "Better contrast and readability",
        detail:
          "Buttons, links, and interactive elements now meet stronger contrast standards so they're easier to spot and use.",
      },
    ],
    whyItMatters:
      "A consistent visual system means less time figuring out the interface and more time practicing. When color and progress mean the same thing everywhere, you can scan your whole dashboard in seconds instead of reading every card individually.",
  },
];

const filters = ["All Updates", "Performance", "Search", "User Interface"];

function WhatsNew() {
  const [filter, setFilter] = useState("All Updates");

  const filtered = useMemo(() => {
    if (filter === "All Updates") return updates;
    return updates.filter((u) => u.tags.includes(filter));
  }, [filter]);

  return (
    <div className="min-h-screen bg-[#070709] text-white">
      <Upperdashnavbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-indigo-300/90 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full mb-3">
            <Sparkles size={12} strokeWidth={2.5} />
            CHANGELOG
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            News & Improvements
          </h1>
          <p className="mt-2 text-sm text-gray-400 max-w-xl">
            A running record of what's changed on Leetcore — new features,
            fixes, and the reasoning behind each decision, explained in
            plain terms.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200
                ${
                  active
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.03] text-gray-400 border-white/10 hover:text-white hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Updates */}
        <div className="flex flex-col gap-6">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-500 border border-dashed border-white/10 rounded-xl">
              No updates in this category yet.
            </div>
          )}

          {filtered.map((update) => (
            <article
              key={update.title}
              className="border border-white/[0.06] bg-[#0D0D12] rounded-2xl p-6 sm:p-8"
            >
              {/* Top meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <p className="text-xs font-semibold text-gray-500">
                  {update.date} · {update.readTime}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {update.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-gray-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title + summary */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3">
                <span className="mr-2">{update.emoji}</span>
                {update.title}
              </h2>
              <p className="text-[15px] text-gray-300 leading-relaxed mb-6 max-w-2xl">
                {update.summary}
              </p>

              {/* Hero image */}
              <div className="overflow-hidden rounded-xl border border-white/[0.06] mb-6">
                <img
                  src={update.image}
                  alt={update.title}
                  loading="lazy"
                  className="w-full h-[280px] sm:h-[360px] object-cover"
                />
              </div>

              {/* Full body */}
              <p className="text-sm text-gray-300 leading-relaxed mb-8 max-w-2xl">
                {update.body}
              </p>

              {/* Highlights */}
              {update.highlights && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wide">
                    What changed, in detail
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {update.highlights.map((h) => (
                      <div
                        key={h.title}
                        className="flex gap-3 border border-white/[0.06] bg-white/[0.02] rounded-xl p-4"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-indigo-300 shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-sm font-semibold text-white mb-1">
                            {h.title}
                          </p>
                          <p className="text-[13px] text-gray-400 leading-relaxed">
                            {h.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why it matters */}
              {update.whyItMatters && (
                <div className="border-l-2 border-indigo-400/40 pl-4 mb-8">
                  <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wide mb-1.5">
                    Why it matters
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                    {update.whyItMatters}
                  </p>
                </div>
              )}

              {/* Author + CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <img
                    src={update.authorImg}
                    alt={update.author}
                    loading="lazy"
                    className="h-8 w-8 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <p className="text-xs font-semibold text-gray-300">
                      {update.author}
                    </p>
                    <p className="text-[11px] text-gray-500">Author</p>
                  </div>
                </div>

                <button className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-colors">
                  Read full update
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WhatsNew;