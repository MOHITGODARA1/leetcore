import { motion as Motion } from "framer-motion";
import ArrayIllustration from "./ArrayIllustration";

function HeroSection({ hero }) {
  if (!hero) return null;
  return (
    <section id={hero.id} className="relative overflow-hidden  bg-[#101012]/88 p-5  sm:p-7">
      {/* <div className="absolute left-0 top-0 h-full w-[3px] bg-[#f46717]" /> */}
      {/* <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#f46717] via-orange-300/35 to-transparent" /> */}
      <div className="grid items-center gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">{hero.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-5xl">{hero.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">{hero.subtitle}</p>
          {/* <div className="mt-5 rounded-lg border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm font-medium text-orange-100">
            {hero.accent}
          </div> */}
          {/* <div className="mt-5 grid grid-cols-3 gap-3">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/8 bg-white/[0.04] p-3">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-[11px] text-white/48">{stat.label}</p>
              </div>
            ))}
          </div> */}
        </Motion.div>
        <ArrayIllustration values={hero.visual.values} labels={hero.visual.labels} />
      </div>
    </section>
  );
}

export default HeroSection;
