"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Volume2,
  VolumeX,
  SkipForward,
  Flag,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface ChatHeaderProps {
  status: "idle" | "searching" | "connected" | "disconnected";
  onlineCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNewChat: () => void;
  onDisconnect: () => void;
  onReport: () => void;
  connectedAt: number | null;
  strangerAvatar: string;
  stats: { level: number; xp: number };
}

function formatTimer(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ChatHeader({
  status,
  onlineCount,
  soundEnabled,
  onToggleSound,
  onNewChat,
  onDisconnect,
  onReport,
  connectedAt,
  strangerAvatar,
  stats,
}: ChatHeaderProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status !== "connected" || !connectedAt) {
      setElapsed(0);
      return;
    }
    setElapsed(Date.now() - connectedAt);
    const interval = setInterval(() => {
      setElapsed(Date.now() - connectedAt);
    }, 1000);
    return () => clearInterval(interval);
  }, [status, connectedAt]);

  const xpInLevel = stats.xp % 100;
  const xpProgress = xpInLevel / 100;

  return (
    <header className="relative z-10 shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 bg-white/[0.04] backdrop-blur-[20px] border-b border-white/[0.08]">
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors" />
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-lg">
            Whispr
          </span>
        </a>

        {status === "connected" && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-[#10b981] text-xs font-medium ml-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
            </span>
            <span className="text-lg mr-1">{strangerAvatar}</span>
            Connected
          </motion.span>
        )}

        {status === "connected" && connectedAt && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#52525b] text-xs font-mono tabular-nums"
          >
            {formatTimer(elapsed)}
          </motion.span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Level badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
          <span className="text-[10px] font-bold text-[#818cf8] uppercase tracking-wider">
            LVL {stats.level}
          </span>
          <div className="w-12 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#818cf8]"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {onlineCount > 0 && (
          <span className="flex items-center gap-1.5 text-[#52525b] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
            </span>
            <Users className="w-3.5 h-3.5" />
            {onlineCount}
          </span>
        )}

        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-lg text-[#52525b] hover:text-[#fafafa] hover:bg-white/[0.06] transition-all"
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {status === "connected" && (
          <>
            <button
              onClick={onNewChat}
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-[#818cf8] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06]"
            >
              <SkipForward className="w-3.5 h-3.5" />
              New Chat
            </button>
            <button
              onClick={onReport}
              className="p-1.5 rounded-lg text-[#52525b] hover:text-[#f43f5e] hover:bg-white/[0.06] transition-all"
              title="Report"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={onDisconnect}
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#f43f5e]/70 hover:text-[#f43f5e] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06]"
            >
              <X className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors px-2 py-1.5 rounded-lg hover:bg-white/[0.06]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
