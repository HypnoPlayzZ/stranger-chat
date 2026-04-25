"use client";

import { useState, useEffect, useCallback } from "react";

interface UserStats {
  totalConversations: number;
  totalMessages: number;
  longestChat: number;
  currentStreak: number;
  lastChatDate: string;
  karma: number;
  level: number;
  xp: number;
}

const DEFAULT_STATS: UserStats = {
  totalConversations: 0,
  totalMessages: 0,
  longestChat: 0,
  currentStreak: 0,
  lastChatDate: "",
  karma: 0,
  level: 1,
  xp: 0,
};

const XP_PER_LEVEL = 100;

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("whispr-stats");
      if (saved) setStats(JSON.parse(saved));
    } catch {
      // localStorage not available
    }
  }, []);

  const recordChat = useCallback((messageCount: number, duration: number) => {
    setStats((prev) => {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      let streak = prev.currentStreak;
      if (prev.lastChatDate === yesterday) streak += 1;
      else if (prev.lastChatDate !== today) streak = 1;

      const xpGain = Math.min(messageCount * 2, 50) + 10;
      const totalXp = prev.xp + xpGain;
      const newLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;

      const newStats: UserStats = {
        ...prev,
        totalConversations: prev.totalConversations + 1,
        totalMessages: prev.totalMessages + messageCount,
        longestChat: Math.max(prev.longestChat, duration),
        currentStreak: streak,
        lastChatDate: today,
        xp: totalXp,
        level: newLevel,
      };
      try {
        localStorage.setItem("whispr-stats", JSON.stringify(newStats));
      } catch {
        // localStorage not available
      }
      return newStats;
    });
  }, []);

  const addKarma = useCallback((delta: number) => {
    setStats((prev) => {
      const newStats = { ...prev, karma: prev.karma + delta };
      try {
        localStorage.setItem("whispr-stats", JSON.stringify(newStats));
      } catch {
        // localStorage not available
      }
      return newStats;
    });
  }, []);

  return { stats, recordChat, addKarma };
}
