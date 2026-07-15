import { useNavigate } from "react-router-dom";

function RightAds() {
    const navigate = useNavigate();

    return (
        <div
            className="
                w-[94%]
                mx-auto
                bg-white/8
                border
                border-white/8
                rounded-3xl
                lc-panel
                p-6
            "
        >
            <div className="space-y-2">
                <h2 className="text-base font-semibold text-white">
                    Advertise on LeetCore
                </h2>

                <p className="text-sm leading-relaxed text-neutral-400">
                    Reach students preparing for placements,
                    interviews, and technical careers.
                </p>
            </div>

            <button
                onClick={() => navigate("/dashboard/become-sponsor")}
                className="
                    mt-6
                    w-full
                    rounded-2xl
                    bg-orange-400
                    text-black
                    font-semibold
                    py-3
                    text-sm
                    transition-all
                    duration-200
                    hover:bg-orange-300
                    active:scale-[0.98]
                    cursor-pointer
                "
            >
                Run Your Advertisement
            </button>
        </div>
    );
}

export default RightAds;
