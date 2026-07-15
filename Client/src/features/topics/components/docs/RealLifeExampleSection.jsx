import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import SectionFrame from "./SectionFrame";
import { renderFormattedText } from "./utils.jsx";

// function StringGrowthAnimation() {
//   const words = ["C", "CA", "CAT", "CATS", "CATSP", "CATSPA", "CATSPAC", "CATSPACE"];
//   const [step, setStep] = useState(0);
//   const [reallocated, setReallocated] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setStep((prev) => {
//         const next = (prev + 1) % words.length;
//         if (next === 4) {
//           setReallocated(true);
//           setTimeout(() => setReallocated(false), 1500);
//         }
//         return next;
//       });
//     }, 1500);
//     return () => clearInterval(timer);
//   }, []);

//   const currentWord = words[step];
//   const size = currentWord.length;
//   const capacity = size <= 4 ? 4 : 8;

//   return (
//     <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-md">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <div>
//           <h4 className="text-sm font-bold text-white tracking-tight">C++ std::string Dynamic Memory Simulator</h4>
//           <p className="text-xs text-white/50 mt-1">Watch how std::string automatically reallocates memory as characters grow</p>
//         </div>
//         <div className="flex gap-4">
//           <div className="text-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
//             <span className="text-[10px] text-white/40 block uppercase tracking-wider">Size</span>
//             <span className="font-mono text-sm font-bold text-white">{size}</span>
//           </div>
//           <div className={`text-center border px-3 py-1.5 rounded-lg transition-all duration-300 ${reallocated ? "bg-orange-500/20 border-orange-500/50 scale-105" : "bg-white/5 border-white/10"}`}>
//             <span className="text-[10px] text-white/40 block uppercase tracking-wider">Capacity</span>
//             <span className="font-mono text-sm font-bold text-[#f46717]">{capacity}</span>
//           </div>
//         </div>
//       </div>

//       <div className="rounded-lg border border-white/5 bg-[#111113] p-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <span className="h-2.5 w-2.5 rounded-full bg-orange-400 animate-pulse" />
//           <span className="text-xs font-mono text-white/80">s += &quot;{words[step].slice(-1)}&quot;;</span>
//         </div>
//         <div className="font-mono text-sm text-white/90">
//           s = &quot;<span className="text-orange-400">{currentWord}</span>&quot;
//         </div>
//       </div>

//       <div className="flex flex-col gap-2">
//         <div className="text-[10px] font-bold uppercase tracking-wider text-white/30">Memory Buckets (RAM)</div>
//         <div className="flex flex-wrap gap-1.5 min-h-[56px] items-center p-2 rounded-lg bg-black/20 border border-white/5">
//           {Array.from({ length: capacity }).map((_, i) => {
//             const char = currentWord[i];
//             const hasChar = i < size;
//             return (
//               <Motion.div
//                 key={i}
//                 layout
//                 className={`relative flex h-11 w-11 items-center justify-center rounded border font-mono text-sm font-semibold transition-all duration-300 ${
//                   hasChar
//                     ? "border-orange-500/30 bg-orange-500/5 text-orange-200"
//                     : i === size
//                     ? "border-white/20 bg-[#161619] text-white/40"
//                     : "border-white/5 bg-[#0f0f11] text-white/20"
//                 }`}
//               >
//                 {hasChar ? char : i === size ? "\\0" : ""}
//                 <span className="absolute bottom-0.5 right-1 text-[8px] text-white/22">{i}</span>
//               </Motion.div>
//             );
//           })}
//         </div>
//       </div>

//       <AnimatePresence>
//         {reallocated && (
//           <Motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2 text-xs text-orange-200"
//           >
//             <span>⚡</span>
//             <span><strong>Reallocation triggered!</strong> Size exceeded capacity ({size} &gt; 4). Memory automatically doubled to capacity of 8.</span>
//           </Motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

function RealLifeExampleSection({ section }) {
  const { topic } = useParams();
  const topicLower = topic?.toLowerCase();
  const isString = topicLower === "string" || topicLower === "strings";

  // if (isString) {
  //   return (
  //     <SectionFrame section={section}>
  //       <StringGrowthAnimation />
  //     </SectionFrame>
  //   );
  // }

  const photo = section.photo || section.image || section.imageUrl;

  if (photo) {
    return <SectionFrame section={section} />;
  }

  if (section.type === "comparison") {
    const keys = [];
    if (section.left) keys.push("left");
    if (section.center) keys.push("center");
    if (section.right) keys.push("right");
    if (keys.length === 0) {
      if (section.array) keys.push("array");
      if (section.vector) keys.push("vector");
    }
    const gridColsClass = keys.length === 3 ? "md:grid-cols-3" : keys.length === 2 ? "md:grid-cols-2" : "grid-cols-1";
    return (
      <SectionFrame section={section}>
        <div className={`grid gap-6 ${gridColsClass}`}>
          {keys.map((key) => {
            const data = section[key];
            if (!data) return null;
            const displayTitle = key === "left" || key === "center" || key === "right" ? data.title || key : `${key}: ${data.title}`;
            return (
              <div key={key} className="rounded-lg border border-white/4 bg-white/8 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white capitalize">
                  {displayTitle}
                </h4>
                <p className="mt-3 text-sm leading-6 text-white/70">{renderFormattedText(data.description)}</p>
                {data.diagram && (
                  <pre className="mt-4 overflow-x-auto rounded  p-3 font-mono text-xs text-zinc-300">
                    {data.diagram}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame section={section}>
      <div>
        <div className="space-y-3 text-sm leading-7 text-white/70">
          {section.content?.map((text, idx) => (
            <p key={idx}>{renderFormattedText(text)}</p>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export default RealLifeExampleSection;
