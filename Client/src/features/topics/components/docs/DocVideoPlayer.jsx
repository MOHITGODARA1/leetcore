import React, { useState } from "react";
import { Play, PlayCircle, Video } from "lucide-react";

function getYouTubeId(url) {
  if (!url) return null;
  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts[1]) {
      return parts[1].split(/[?#]/)[0];
    }
  }
  if (url.includes("youtube.com/watch")) {
    const parts = url.split("v=");
    if (parts[1]) {
      return parts[1].split(/[&#]/)[0];
    }
  }
  if (url.includes("youtube.com/embed/")) {
    const parts = url.split("youtube.com/embed/");
    if (parts[1]) {
      return parts[1].split(/[?#]/)[0];
    }
  }
  return null;
}

function DocVideoPlayer({ doc }) {
  const videosSection = doc?.sections?.find((s) => s.type === "videos");
  const videos = videosSection?.items || [];

  const [activeIdx, setActiveIdx] = useState(0);

  if (videos.length === 0) return null;

  const activeVideo = videos[activeIdx];
  const activeVideoId = getYouTubeId(activeVideo.url);

  return (
    <section className="scroll-mt-4  rounded-2xl p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80">
            <Video size={16} />
          </span>
          <h2 className="text-base font-semibold text-white sm:text-lg">
            Featured Video Tutorial
          </h2>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Video {activeIdx + 1} of {videos.length}
        </span>
      </div>

      <div className="grid gap-2 lg:grid-cols-3">
        {/* Main YouTube Iframe Player */}
        <div className="lg:col-span-2">
          {activeVideoId ? (
            <div className="relative md:h-110 w-full aspect-video overflow-hidden rounded-xl ">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&autoplay=0`}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={activeVideo.title}
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 text-white/40">
              <Video size={48} className="stroke-1" />
              <p className="mt-2 text-sm">Unable to load video player</p>
            </div>
          )}
        </div>

        {/* Playlist / Video Selector */}
        <div className="flex flex-col justify-between lg:col-span-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-2 px-1">
              Select Lesson
            </span>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 lg:max-h-[300px]">
              {videos.map((video, idx) => {
                const isActive = idx === activeIdx;
                const vId = getYouTubeId(video.url);
                const thumb = vId 
                  ? `https://img.youtube.com/vi/${vId}/mqdefault.jpg` 
                  : null;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-full flex gap-3 text-left p-2.5 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? "bg-orange-500/10 border-orange-500/40 text-white shadow-[0_0_15px_rgba(244,103,23,0.1)]"
                        : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:border-white/10 hover:text-white"
                    }`}
                  >
                    {/* Tiny Thumbnail */}
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-black/20 border border-white/5">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={video.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/30">
                          <Play size={14} />
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <PlayCircle size={18} className="text-orange-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-tight truncate ${isActive ? "text-orange-400" : "text-white"}`}>
                        {video.title}
                      </p>
                      <p className="mt-1 text-[10px] text-white/40 font-mono">
                        {video.channel} • {video.duration}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs leading-normal text-white/50">
            <span className="font-semibold text-white/70">Playing on LeetCore:</span> You are watching this tutorial directly inside LeetCore. Keep mastering DSA!
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocVideoPlayer;
