"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface ChatSearchingProps {
  interests: string[];
  onCancel: () => void;
}

const SEARCH_PHRASES = [
  "Scanning the globe...",
  "Finding your match...",
  "Almost there...",
  "Connecting worlds...",
];

export default function ChatSearching({
  interests,
  onCancel,
}: ChatSearchingProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % SEARCH_PHRASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="searching"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center gap-6 p-4"
    >
      {/* Pulsing rings animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: [0.5, 1.5], opacity: [0.6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          >
            <div className="w-full h-full rounded-full border-2 border-[#6366f1]/40" />
          </motion.div>
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/30"
        >
          <Search className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#fafafa]">
          Looking for someone
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </h2>
        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-[#a1a1aa] text-sm"
            >
              {SEARCH_PHRASES[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating interest tags */}
      {interests.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {interests.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -4, 0] }}
              transition={{
                opacity: { delay: i * 0.1 },
                y: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              }}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20"
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      )}

      <motion.button
        onClick={onCancel}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-6 py-2.5 rounded-xl border border-white/[0.1] text-[#a1a1aa] hover:text-[#fafafa] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all text-sm"
      >
        Cancel
      </motion.button>
    </motion.div>
  );
}
