import { ArrowUpRight, Play } from "lucide-react";
import ArrayIllustration from "./ArrayIllustration";
import SectionFrame from "./SectionFrame";

function RecommendedVideosSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((video) => (
          <article key={video.title} className="overflow-hidden rounded-lg border border-white/10 bg-black/24 transition hover:-translate-y-1 hover:border-orange-400/35">
            <div className="relative">
              <ArrayIllustration values={video.thumbnail.values} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/62 text-white backdrop-blur">
                  <Play size={20} fill="currentColor" />
                </span>
              </div>
              <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white">{video.duration}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white">{video.title}</h3>
              <p className="mt-1 text-sm text-white/52">{video.channel}</p>
              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-orange-300/25 bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/18"
              >
                Open
                <ArrowUpRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

export default RecommendedVideosSection;
