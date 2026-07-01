import { ArrowUpRight, Play } from "lucide-react";
import ArrayIllustration from "./ArrayIllustration";
import SectionFrame from "./SectionFrame";

function getYouTubeId(url) {
  if (!url) return null;
  // Handle youtu.be/<id>
  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts[1]) {
      return parts[1].split(/[?#]/)[0];
    }
  }
  // Handle youtube.com/watch?v=<id>
  if (url.includes("youtube.com/watch")) {
    const parts = url.split("v=");
    if (parts[1]) {
      return parts[1].split(/[&#]/)[0];
    }
  }
  // Handle youtube.com/embed/<id>
  if (url.includes("youtube.com/embed/")) {
    const parts = url.split("youtube.com/embed/");
    if (parts[1]) {
      return parts[1].split(/[?#]/)[0];
    }
  }
  return null;
}

function RecommendedVideosSection({ section }) {
  return (
    <SectionFrame section={section}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((video) => {
          const videoId = getYouTubeId(video.url);
          const thumbnailUrl = videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : null;

          return (
            <article
              key={video.title}
              className="group overflow-hidden rounded-lg border border-white/10 bg-black/24 transition hover:-translate-y-1 hover:border-orange-400/35"
            >
              <div className="relative h-[180px] overflow-hidden bg-black/25">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <ArrayIllustration values={video.thumbnail.values} />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors duration-300">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/62 text-white backdrop-blur transition-transform duration-300 group-hover:scale-110">
                    <Play size={20} fill="currentColor" />
                  </span>
                </div>
                <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 font-mono text-xs text-white">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white transition-colors duration-300 group-hover:text-orange-400">
                  {video.title}
                </h3>
                <p className="mt-1 text-sm text-white/52">{video.channel}</p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
                >
                  Open
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}

export default RecommendedVideosSection;

