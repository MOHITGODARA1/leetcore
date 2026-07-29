import { Search, ArrowUpDown, Filter } from "lucide-react";

function Searchbar() {
  return (
    <div className="mt-5 flex w-full items-center justify-between px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex h-10 w-[280px] items-center gap-3 rounded-full bg-white/10 px-5">
          <Search size={20} className="text-white/50" />

          <input
            type="text"
            placeholder="Search Topics"
            className="w-full bg-transparent text-[15px] text-white placeholder:text-white/50 outline-none "
          />
        </div>

        {/* Sort */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/15 hover:text-white">
          <ArrowUpDown size={15} />
        </button>

        {/* Filter */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/15 hover:text-white">
          <Filter size={15} />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 mr-4">
        <svg
          className="-rotate-90"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            fill="none"
          />

          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="#22c55e"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="50.27"
            strokeDashoffset="50.27"
          />
        </svg>

        <span className="text-sm font-medium text-white/70">
          <span className="text-white">0</span>/12 Solved
        </span>
      </div>
    </div>
  );
}

export default Searchbar;