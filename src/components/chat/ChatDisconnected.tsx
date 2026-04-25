"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Clock, WifiOff, ThumbsUp, ThumbsDown, Home } from "lucide-react";

interface ChatDisconnectedProps {
  messageCount: number;
  connectedAt: number | null;
  strangerAvatar: string;
  onNewChat: () => void;
  onGoHome: () => void;
  onKarmaVote: (delta: number) => void;
}

const ENCOURAGING_MESSAGES = [
  "Every conversation is a new adventure!",
  "Great chat! Ready for the next one?",
  "You never know who you'll meet next.",
  "That was interesting! Want to keep going?",
  "Another connection made. Keep chatting!",
];

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export default function ChatDisconnected({
  messageCount,
  connectedAt,
  strangerAvatar,
  onNewChat,
  onGoHome,
  onKarmaVote,
}: ChatDisconnectedProps) {
  const [voted, setVoted] = useState(false);

  const encouragement = useMemo(
    () =>
      ENCOURAGING_MESSAGES[
        Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)
      ],
    []
  );

  const handleVote = (delta: number) => {
    if (voted) return;
    setVoted(true);
    onKarmaVote(delta);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="shrink-0 bg-white/[0.03] backdrop-blur-[20px] border-t border-white/[0.08] p-6"
    >
      <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-[#27272a] border border-white/[0.1] flex items-center justify-center text-3xl"
        >
          {strangerAvatar}
        </motion.div>

        <p className="text-[#a1a1aa] text-sm font-medium">Chat ended</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[11px] text-[#52525b]">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {messageCount} messages
          </span>
          {connectedAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(Date.now() - connectedAt)}
            </span>
          )}
        </div>

        {/* Karma voting */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#52525b]">
            How was this chat?
          </span>
          <button
            onClick={() => handleVote(1)}
            disabled={voted}
            className={`p-2 rounded-lg transition-all ${
              voted
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#10b981]/10 hover:text-[#10b981] text-[#52525b]"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleVote(-1)}
            disabled={voted}
            className={`p-2 rounded-lg transition-all ${
              voted
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#f43f5e]/10 hover:text-[#f43f5e] text-[#52525b]"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        {/* Encouraging message */}
        <p className="text-[11px] text-[#52525b] italic text-center">
          {encouragement}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white font-medium text-sm shadow-lg shadow-[#6366f1]/20"
          >
            New Chat
          </motion.button>
          <motion.button
            onClick={onGoHome}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 px-6 py-2.5 rounded-xl border border-white/[0.1] text-[#a1a1aa] hover:text-[#fafafa] hover:border-white/[0.2] transition-all text-sm flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
