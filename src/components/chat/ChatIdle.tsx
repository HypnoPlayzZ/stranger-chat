"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Hash, X, Plus } from "lucide-react";

interface ChatIdleProps {
  interests: string[];
  interestInput: string;
  onInterestInputChange: (value: string) => void;
  onAddInterest: () => void;
  onRemoveInterest: (index: number) => void;
  onStartChat: () => void;
  streak: number;
}

export default function ChatIdle({
  interests,
  interestInput,
  onInterestInputChange,
  onAddInterest,
  onRemoveInterest,
  onStartChat,
  streak,
}: ChatIdleProps) {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center gap-6 p-4 sm:p-8"
    >
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#6366f1]/[0.04] blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#818cf8]/[0.04] blur-[100px]" />
      </div>

      {/* Animated orb icon */}
      <div className="relative">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/20"
        >
          <Search className="w-10 h-10 text-white" />
        </motion.div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] blur-xl opacity-30 -z-10" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#fafafa]">
          Find a Stranger
        </h2>
        <p className="text-[#a1a1aa] text-sm sm:text-base max-w-md">
          Get matched with a random anonymous person. Your identity stays
          completely hidden.
        </p>
      </div>

      {/* Streak badge */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-sm font-medium"
        >
          <span>🔥</span>
          {streak}-day streak
        </motion.div>
      )}

      {/* Interest input section */}
      <div className="w-full max-w-md space-y-3">
        <label className="text-xs text-[#52525b] uppercase tracking-wider font-medium flex items-center gap-1.5">
          <Hash className="w-3 h-3" />
          Add interests to find like-minded people
        </label>

        {/* Interest chips */}
        <div className="flex flex-wrap gap-2 min-h-[28px]">
          <AnimatePresence>
            {interests.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 backdrop-blur-sm"
              >
                <Hash className="w-3 h-3 text-[#818cf8]" />
                {tag}
                <button
                  onClick={() => onRemoveInterest(index)}
                  className="ml-0.5 text-[#6366f1]/60 hover:text-[#fafafa] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Interest form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAddInterest();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={interestInput}
            onChange={(e) => onInterestInputChange(e.target.value)}
            placeholder={
              interests.length >= 5
                ? "Max 5 interests"
                : "e.g. music, gaming, travel..."
            }
            disabled={interests.length >= 5}
            className="flex-1 bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-[#fafafa] outline-none focus:border-[#6366f1]/40 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)] placeholder:text-[#52525b] transition-all disabled:opacity-40"
            maxLength={30}
          />
          <button
            type="submit"
            disabled={interests.length >= 5 || !interestInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.1] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Start button */}
      <motion.button
        onClick={onStartChat}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white font-semibold text-lg shadow-lg shadow-[#6366f1]/25 hover:shadow-xl hover:shadow-[#6366f1]/30 transition-shadow"
      >
        Start Chatting
      </motion.button>
    </motion.div>
  );
}
