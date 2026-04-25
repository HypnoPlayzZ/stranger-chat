"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { getPusherClient } from "@/lib/pusher-client";
import { useUserStats } from "@/hooks/useUserStats";
import type { Channel } from "pusher-js";

import ChatHeader from "./ChatHeader";
import ChatIdle from "./ChatIdle";
import ChatSearching from "./ChatSearching";
import ChatMessages from "./ChatMessages";
import type { ChatMessage } from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatDisconnected from "./ChatDisconnected";
import ReportModal from "./ReportModal";
import ConnectionCelebration from "./ConnectionCelebration";

type Status = "idle" | "searching" | "connected" | "disconnected";

const EMOJI_AVATARS = [
  "\u{1F98A}", "\u{1F419}", "\u{1F335}", "\u{1F3AD}", "\u{1F98B}",
  "\u{1F344}", "\u{1F52E}", "\u{1F319}", "\u{1F3AA}", "\u{1F438}",
  "\u{1F989}", "\u{1F30A}", "\u{1F3AF}", "\u{1FA90}", "\u{1F433}",
  "\u{1F9CA}", "\u{1F338}", "\u{1F361}", "\u{1F525}", "\u{1F9F8}",
];

function getStrangerAvatar(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return EMOJI_AVATARS[Math.abs(hash) % EMOJI_AVATARS.length];
}

export default function ChatApp() {
  const { data: session } = useSession();
  const { stats, recordChat, addKarma } = useUserStats();

  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [strangerTyping, setStrangerTyping] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [sharedInterests, setSharedInterests] = useState<string[]>([]);

  const roomChannelRef = useRef<Channel | null>(null);
  const userChannelRef = useRef<Channel | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentRef = useRef(0);

  const strangerAvatar = roomId ? getStrangerAvatar(roomId) : "\u{1F464}";

  const playSound = useCallback(
    (type: "message" | "connect" | "disconnect") => {
      if (!soundEnabled) return;
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.1;

        if (type === "message") {
          osc.frequency.value = 800;
          osc.type = "sine";
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } else if (type === "connect") {
          osc.frequency.value = 523;
          osc.type = "sine";
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
          const osc2 = ctx.createOscillator();
          osc2.connect(gain);
          osc2.frequency.value = 659;
          osc2.type = "sine";
          osc2.start(ctx.currentTime + 0.15);
          osc2.stop(ctx.currentTime + 0.3);
        } else {
          osc.frequency.value = 400;
          osc.type = "sine";
          osc.start();
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.3
          );
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch {
        // Audio not available
      }
    },
    [soundEnabled]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      roomChannelRef.current?.unbind_all();
      userChannelRef.current?.unbind_all();
      const pusher = getPusherClient();
      if (roomChannelRef.current)
        pusher.unsubscribe(roomChannelRef.current.name);
      if (userChannelRef.current)
        pusher.unsubscribe(userChannelRef.current.name);
    };
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        text,
        fromMe: false,
        timestamp: Date.now(),
        type: "system",
      },
    ]);
  }, []);

  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1200);
  }, []);

  const subscribeToRoom = useCallback(
    (newRoomId: string, myParticipantId: string) => {
      const pusher = getPusherClient();

      if (roomChannelRef.current) {
        roomChannelRef.current.unbind_all();
        pusher.unsubscribe(roomChannelRef.current.name);
      }

      const channel = pusher.subscribe(`room-${newRoomId}`);
      roomChannelRef.current = channel;

      channel.bind(
        "new-message",
        (data: {
          id: string;
          text: string;
          from: string;
          timestamp: number;
        }) => {
          if (data.from !== myParticipantId) {
            setMessages((prev) => [
              ...prev,
              {
                id: data.id,
                text: data.text,
                fromMe: false,
                timestamp: data.timestamp,
                type: "message",
              },
            ]);
            setStrangerTyping(false);
            setMessageCount((c) => c + 1);
            playSound("message");

            // Auto-acknowledge received message
            fetch("/api/chat/ack", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                roomId: newRoomId,
                messageId: data.id,
                participantId: myParticipantId,
              }),
            }).catch(() => {});
          }
        }
      );

      channel.bind("typing", (data: { from: string; isTyping: boolean }) => {
        if (data.from !== myParticipantId) {
          setStrangerTyping(data.isTyping);
        }
      });

      channel.bind("partner-disconnected", (data: { from: string }) => {
        if (data.from !== myParticipantId) {
          setStatus("disconnected");
          setStrangerTyping(false);
          addSystemMessage("Stranger has disconnected.");
          playSound("disconnect");
        }
      });

      channel.bind(
        "message-reaction",
        (data: { messageId: string; emoji: string; from: string }) => {
          if (data.from !== myParticipantId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.messageId
                  ? {
                      ...msg,
                      reactions: [
                        ...(msg.reactions || []),
                        { emoji: data.emoji, from: data.from },
                      ],
                    }
                  : msg
              )
            );
          }
        }
      );

      channel.bind(
        "message-ack",
        (data: { messageId: string; from: string }) => {
          if (data.from !== myParticipantId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.messageId
                  ? { ...msg, delivered: true }
                  : msg
              )
            );
          }
        }
      );
    },
    [addSystemMessage, playSound]
  );

  const handleConnect = async () => {
    setStatus("searching");
    setMessages([]);
    setMessageCount(0);
    setStrangerTyping(false);
    setConnectedAt(null);
    setSharedInterests([]);

    try {
      const res = await fetch("/api/chat/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });
      const data = await res.json();
      setOnlineCount(data.onlineCount || 0);

      if (data.status === "matched") {
        setRoomId(data.roomId);
        setParticipantId(data.participantId);
        setStatus("connected");
        setConnectedAt(Date.now());
        setSharedInterests(data.sharedInterests || []);
        subscribeToRoom(data.roomId, data.participantId);
        addSystemMessage("You are now connected with a stranger. Say hi!");
        playSound("connect");
        triggerCelebration();
      } else {
        setParticipantId(data.participantId);
        const pusher = getPusherClient();

        if (userChannelRef.current) {
          userChannelRef.current.unbind_all();
          pusher.unsubscribe(userChannelRef.current.name);
        }

        const userChannel = pusher.subscribe(`user-${data.participantId}`);
        userChannelRef.current = userChannel;

        userChannel.bind("matched", (matchData: { roomId: string; sharedInterests?: string[] }) => {
          setRoomId(matchData.roomId);
          setStatus("connected");
          setConnectedAt(Date.now());
          setSharedInterests(matchData.sharedInterests || []);
          subscribeToRoom(matchData.roomId, data.participantId);
          addSystemMessage("You are now connected with a stranger. Say hi!");
          playSound("connect");
          triggerCelebration();

          userChannel.unbind_all();
          pusher.unsubscribe(userChannel.name);
          userChannelRef.current = null;
        });
      }
    } catch {
      setStatus("idle");
      addSystemMessage("Failed to connect. Please try again.");
    }
  };

  const handleDisconnect = async () => {
    if (roomId && participantId) {
      // Record stats before clearing
      const duration = connectedAt ? Date.now() - connectedAt : 0;
      recordChat(messageCount, duration);

      fetch("/api/chat/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, participantId }),
      }).catch(() => {});
    }

    const pusher = getPusherClient();
    if (roomChannelRef.current) {
      roomChannelRef.current.unbind_all();
      pusher.unsubscribe(roomChannelRef.current.name);
      roomChannelRef.current = null;
    }
    if (userChannelRef.current) {
      userChannelRef.current.unbind_all();
      pusher.unsubscribe(userChannelRef.current.name);
      userChannelRef.current = null;
    }

    setStatus("idle");
    setRoomId(null);
    setParticipantId(null);
    setMessages([]);
    setInput("");
    setStrangerTyping(false);
    setMessageCount(0);
    setConnectedAt(null);
    playSound("disconnect");
  };

  const handleGoHome = () => {
    handleDisconnect();
  };

  const handleNewChat = async () => {
    if (roomId && participantId) {
      const duration = connectedAt ? Date.now() - connectedAt : 0;
      recordChat(messageCount, duration);

      fetch("/api/chat/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, participantId }),
      }).catch(() => {});
    }

    const pusher = getPusherClient();
    if (roomChannelRef.current) {
      roomChannelRef.current.unbind_all();
      pusher.unsubscribe(roomChannelRef.current.name);
      roomChannelRef.current = null;
    }

    setRoomId(null);
    setParticipantId(null);
    setMessages([]);
    setInput("");
    setStrangerTyping(false);
    setMessageCount(0);
    setConnectedAt(null);

    handleConnect();
  };

  const handleCancelSearch = async () => {
    if (participantId) {
      fetch(`/api/chat/match?participantId=${participantId}`, {
        method: "DELETE",
      }).catch(() => {});
    }

    const pusher = getPusherClient();
    if (userChannelRef.current) {
      userChannelRef.current.unbind_all();
      pusher.unsubscribe(userChannelRef.current.name);
      userChannelRef.current = null;
    }

    setStatus("idle");
    setParticipantId(null);
  };

  const handleSend = async () => {
    if (!input.trim() || status !== "connected" || !roomId || !participantId)
      return;

    const text = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        text,
        fromMe: true,
        timestamp: Date.now(),
        type: "message",
      },
    ]);
    setMessageCount((c) => c + 1);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, participantId, message: text }),
      });
    } catch {
      addSystemMessage("Failed to send message.");
    }
  };

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || status !== "connected" || !roomId || !participantId)
        return;

      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          text,
          fromMe: true,
          timestamp: Date.now(),
          type: "message",
        },
      ]);
      setMessageCount((c) => c + 1);

      fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, participantId, message: text }),
      }).catch(() => {
        addSystemMessage("Failed to send message.");
      });
    },
    [status, roomId, participantId, addSystemMessage]
  );

  const handleTyping = () => {
    if (!roomId || !participantId || status !== "connected") return;

    const now = Date.now();
    if (now - lastTypingSentRef.current < 2000) return;
    lastTypingSentRef.current = now;

    fetch("/api/chat/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, participantId, isTyping: true }),
    }).catch(() => {});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      fetch("/api/chat/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, participantId, isTyping: false }),
      }).catch(() => {});
    }, 3000);
  };

  const handleAddInterest = () => {
    const tag = interestInput.trim().toLowerCase();
    if (tag && !interests.includes(tag) && interests.length < 5) {
      setInterests((prev) => [...prev, tag]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    setInterests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReport = async () => {
    if (!roomId || !reportReason.trim()) return;

    try {
      await fetch("/api/chat/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, reason: reportReason.trim() }),
      });
      setShowReport(false);
      setReportReason("");
      addSystemMessage(
        "Report submitted. Thank you for helping keep Whispr safe."
      );
      handleDisconnect();
    } catch {
      addSystemMessage("Failed to submit report.");
    }
  };

  const handleReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!roomId || !participantId) return;

      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: [
                  ...(msg.reactions || []),
                  { emoji, from: participantId },
                ],
              }
            : msg
        )
      );

      fetch("/api/chat/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, messageId, emoji, participantId }),
      }).catch(() => {});
    },
    [roomId, participantId]
  );

  const handleKarmaVote = (delta: number) => {
    addKarma(delta);
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] font-[Inter,sans-serif] relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#6366f1]/[0.04] blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#818cf8]/[0.04] blur-[100px]" />
      </div>

      {showCelebration && <ConnectionCelebration />}

      <ChatHeader
        status={status}
        onlineCount={onlineCount}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onNewChat={handleNewChat}
        onDisconnect={handleDisconnect}
        onReport={() => setShowReport(true)}
        connectedAt={connectedAt}
        strangerAvatar={strangerAvatar}
        stats={{ level: stats.level, xp: stats.xp }}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <ChatIdle
              key="idle"
              interests={interests}
              interestInput={interestInput}
              onInterestInputChange={setInterestInput}
              onAddInterest={handleAddInterest}
              onRemoveInterest={handleRemoveInterest}
              onStartChat={handleConnect}
              streak={stats.currentStreak}
            />
          )}

          {status === "searching" && (
            <ChatSearching
              key="searching"
              interests={interests}
              onCancel={handleCancelSearch}
            />
          )}

          {(status === "connected" || status === "disconnected") && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <ChatMessages
                messages={messages}
                strangerTyping={strangerTyping}
                status={status}
                strangerAvatar={strangerAvatar}
                onSendMessage={handleSendMessage}
                onReaction={handleReaction}
                sharedInterests={sharedInterests}
              />

              {status === "connected" ? (
                <ChatInput
                  input={input}
                  onInputChange={setInput}
                  onSend={handleSend}
                  onTyping={handleTyping}
                  disabled={false}
                  onNewChat={handleNewChat}
                  onDisconnect={handleDisconnect}
                  onReport={() => setShowReport(true)}
                  showActions={true}
                />
              ) : (
                <ChatDisconnected
                  messageCount={messageCount}
                  connectedAt={connectedAt}
                  strangerAvatar={strangerAvatar}
                  onNewChat={handleNewChat}
                  onGoHome={handleGoHome}
                  onKarmaVote={handleKarmaVote}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ReportModal
        show={showReport}
        reportReason={reportReason}
        onReasonChange={setReportReason}
        onSubmit={handleReport}
        onClose={() => {
          setShowReport(false);
          setReportReason("");
        }}
      />

      {/* Signed in notice */}
      {status === "idle" && session?.user?.name && (
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <p className="text-[#52525b] text-xs">
            Signed in as {session.user.name} -- your name is hidden from
            strangers
          </p>
        </div>
      )}
    </div>
  );
}
