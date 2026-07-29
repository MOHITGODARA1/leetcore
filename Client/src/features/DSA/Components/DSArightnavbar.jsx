import {
  Flame,
  Route,
  Trophy,
  Target,
  BarChart3,
  CircleCheckBig,
  Bug,
  Star,
  Mail,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaDiscord,
  FaTwitter,
  
} from "react-icons/fa";
function DSARightNavbar() {
  return (
    <aside className="hidden xl:block w-80 h-full overflow-y-auto border-l border-white/7 bg-white/6 p-6 flex-shrink-0">

      {/* Current Journey */}
      <div className="grid grid-cols-2 gap-4 ">
        <div className="rounded-xl bg-white/9 p-4">
          <Flame className="text-[#E0A03B]" size={18} />
          <p className="text-sm text-white/80 mt-3">
            Day Streak
          </p>
          <h3 className="text-2xl font-bold">
            21
          </h3>
        </div>

        <div className="rounded-xl  bg-white/9 p-4">
          <Target className="text-[#4F8EF7]" size={18} />
          <p className="text-sm text-white mt-3">
            Questions Left
          </p>
          <h3 className="text-2xl font-bold">
            143
          </h3>
        </div>
      </div>

      <div className="rounded-2xl   mt-6 bg-white/9 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Route size={18} className="text-white/80" />
          <h2 className="font-semibold text-white">
            Sliding window
          </h2>
        </div>

        

        <h3 className="text-md font-semibold mt-1">
          
        </h3>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Journey Progress</span>
            <span>68%</span>
          </div>

          <div className="h-2 rounded-full bg-white/40 overflow-hidden">
            <div className="h-full w-[68%] rounded-full bg-green-400"></div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        

        <div className="rounded-xl  bg-white/9 p-4">
          <Trophy className="text-[#F2A640]" size={18} />
          <p className="text-sm text-white/80 mt-3">
            Contest Rank
          </p>
          <h3 className="text-2xl font-bold">
            #842
          </h3>
        </div>

        <div className="rounded-xl  bg-white/9 p-4">
          <CircleCheckBig className="text-green-400" size={18} />
          <p className="text-sm text-white/80 mt-3">
            Readiness
          </p>
          <h3 className="text-2xl font-bold">
            84%
          </h3>
        </div>

      </div>

      {/* Weekly Progress */}
      <div className="rounded-2xl  bg-white/9 p-5 mt-6">

        <div className="flex items-center gap-2 mb-5">
          <BarChart3 size={18} />
          <h2 className="font-semibold">
            Weekly Progress
          </h2>
        </div>

        <svg
          viewBox="0 0 320 120"
          className="w-full h-32"
          fill="none"
        >
          <polyline
            points="10,90 55,70 100,75 145,45 190,55 235,28 290,18"
            stroke="#F2A640"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {[10, 55, 100, 145, 190, 235, 290].map((x, i) => {
            const y = [90, 70, 75, 45, 55, 28, 18][i];
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#F2A640"
              />
            );
          })}
        </svg>

        <div className="flex justify-between text-xs text-white/80 mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

      </div>
      <div className="flex justify-center mt-6 w-full item-center">
        <div className=" w-[90%] flex justify-between gap-4">
          <Bug size={20} className="text-white/70"/>
          <FaInstagram size={20} className="text-white/70"/>
          <FaLinkedin size={20} className="text-white/70"/>
          <FaGithub size={20} className="text-white/70"/>
          <FaYoutube size={20} className="text-white/70"/>
          <Star size={20} className="text-white/70"/>
        </div>
      </div>

      
    </aside>
  );
}

export default DSARightNavbar;
