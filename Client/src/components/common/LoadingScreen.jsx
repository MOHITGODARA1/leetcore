import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingPhrases = [
  "Loading LeetCore...",
  "Initializing components...",
  "Allocating contiguous memory...",
  "Optimizing pointer variables...",
  "Balancing search trees...",
  "Traversing graph networks...",
  "Preparing sandbox compiler...",
  "Syncing user profile..."
];

function LoadingScreen() {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % loadingPhrases.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#060608] flex flex-col items-center justify-center overflow-hidden px-4 text-white select-none">
      {/* Background Central Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(244,103,23,0.12)_0%,transparent_60%)] blur-3xl animate-gentle-pulse" />

      {/* Pulsing and Glowing LeetCore Logo */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ 
          scale: [1, 1.04, 1],
          opacity: 1,
          filter: [
            "drop-shadow(0 0 12px rgba(244, 103, 23, 0.12))",
            "drop-shadow(0 0 30px rgba(244, 103, 23, 0.45))",
            "drop-shadow(0 0 12px rgba(244, 103, 23, 0.12))"
          ]
        }}
        transition={{ 
          scale: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
          filter: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
          opacity: { duration: 0.6 }
        }}
        className="relative mb-8"
      >
        <img 
          src="/leetcorelogo.png" 
          alt="LeetCore Logo" 
          className="h-28 w-28 object-contain" 
        />
      </motion.div>

      {/* Loading Progress Bar Container */}
      <div className="w-56 h-1 bg-white/5 rounded-full overflow-hidden relative mb-4">
        {/* Animated Loading Bar */}
        <motion.div 
          className="h-full bg-gradient-to-r from-[#f46717] via-amber-500 to-[#f46717]" 
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.8, 
            ease: "easeInOut" 
          }}
          style={{ width: "100%" }}
        />
      </div>

      {/* Animated Cycling DSA Phrases */}
      <div className="h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-sm font-semibold tracking-wide text-white/50"
          >
            {loadingPhrases[phraseIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LoadingScreen;
