// FeedbackCard.jsx

function FeedbackCard({ item }) {
    const hasVideo = item.video && item.video !== "YOUR_VIDEO_LINK_HERE";

    return (
        <div
            className="
        min-w-[280px]
        sm:min-w-[290px]
        h-[380px]
        sm:h-[380px]
        rounded-3xl
        overflow-hidden
        bg-[#111113]
        border border-white/10
        backdrop-blur-2xl
        relative
        group
        hover:border-white/70
        cursor-pointer
        transition-all
        duration-500
      "
        >
            {/* Video */}
            {hasVideo ? (
                <video
                    src={item.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
            ) : (
                <div className="w-full h-full bg-[#19191d]" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-10">

                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={item.profile}
                        alt=""
                        className="w-12 h-12 rounded-full border-2 "
                    />

                    <div>
                        <h3 className="text-white text-md font-semibold">
                            {item.name}
                        </h3>

                        <p className="text-gray-400 text-sm">
                            {item.role}
                        </p>
                    </div>
                </div>

                <p className="text-gray-300 text-sm leading-7 line-clamp-4">
                    {item.feedback}
                </p>
            </div>
        </div>
    );
}

export default FeedbackCard;
