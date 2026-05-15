import { TrendingUp } from "lucide-react";

function ContestRating() {
    const points = [32, 58, 42, 74, 63, 88, 79];

    return (
        <div className="min-h-[260px] w-full bg-white/8 border border-white/5 rounded-2xl p-5 text-white overflow-hidden">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-white/45">Weekly contests</p>
                    <h1 className="mt-1 text-xl font-semibold">Contest Rating</h1>
                </div>
                <div className="rounded-2xl bg-green-500/10 px-3 py-2 text-sm text-green-300 flex items-center gap-2">
                    <TrendingUp size={16} />
                    +128
                </div>
            </div>

            <div className="mt-6">
                <div className="flex items-end gap-3 h-28">
                    {points.map((point, index) => (
                        <div key={index} className="flex-1 rounded-t-xl bg-white/8 overflow-hidden flex items-end">
                            <div
                                className="w-full rounded-t-xl bg-gradient-to-t from-[#F46717] to-[#ffb088]"
                                style={{ height: `${point}%` }}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex justify-between text-[11px] text-white/35">
                    <span>W1</span>
                    <span>W2</span>
                    <span>W3</span>
                    <span>W4</span>
                    <span>W5</span>
                    <span>W6</span>
                    <span>W7</span>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#1F1F22] p-3">
                    <p className="text-lg font-semibold">1654</p>
                    <p className="text-[11px] text-white/45">Current</p>
                </div>
                <div className="rounded-2xl bg-[#1F1F22] p-3">
                    <p className="text-lg font-semibold">1812</p>
                    <p className="text-[11px] text-white/45">Peak</p>
                </div>
                <div className="rounded-2xl bg-[#1F1F22] p-3">
                    <p className="text-lg font-semibold">24</p>
                    <p className="text-[11px] text-white/45">Played</p>
                </div>
            </div>
        </div>
    );
}

export default ContestRating;
