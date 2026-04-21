import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function VideoSuggestion() {
    const { topic } = useParams();
    const [current, setCurrent] = useState(0);
    const [videos, setVideos] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const activeTopic = topic || "arrays";
                const response = await fetch(`${API_URL}/api/v4/video-suggestion/${activeTopic}`);
                const resData = await response.json();
                if (resData.success) {
                    setVideos(resData.data);
                } else {
                    console.error("Failed to fetch videos");
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchVideos();
        setCurrent(0); // Reset to first video when topic changes
    }, [topic]);

    return (
        <div className="min-h-screen text-white px-4 py-6 max-w-5xl mx-auto">
            {videos.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400">Loading videos...</p>
                </div>
            ) : (
                <>
                    {/* Featured Player */}
                    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-6">
                        <div className="relative w-full pt-[56.25%]">
                            <iframe
                                key={current}
                                src={`https://www.youtube.com/embed/${videos[current].id}?autoplay=1`}
                                title={videos[current].title}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
                            <h2 className="text-base font-semibold">{videos[current].title}</h2>
                            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                                {current + 1} of {videos.length}
                            </span>
                        </div>
                    </div>

                    {/* Playlist */}
                    <p className="text-sm text-gray-400 mb-3">Arrays — {videos.length} videos</p>
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3">
                        {videos.map((video, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1
              ${current === index ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-gray-500"}`}
                            >
                                <div className="relative w-full pt-[56.25%] bg-gray-900">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                        alt={video.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    {current !== index && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black/60 rounded-full p-2">
                                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <polygon points="5,3 19,12 5,21" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2.5">
                                    <p className="text-xs text-gray-400 mb-0.5">Video {index + 1}</p>
                                    <h3 className="text-xs font-semibold leading-snug">{video.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default VideoSuggestion;