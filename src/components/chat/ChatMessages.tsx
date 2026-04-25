"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomIcebreakers } from "@/lib/icebreakers";

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
  type: "message" | "system";
  reactions?: { emoji: string; from: string }[];
  delivered?: boolean;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  strangerTyping: boolean;
  status: "idle" | "searching" | "connected" | "disconnected";
  strangerAvatar: string;
  onSendMessage: (text: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  sharedInterests: string[];
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatMessages({
  messages,
  strangerTyping,
  status,
  strangerAvatar,
  onSendMessage,
  onReaction,
  sharedInterests,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);

  const REACTIONS = ["👍", "😂", "❤️", "😮", "🔥"];

  const icebreakers = useMemo(() => getRandomIcebreakers(3), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, strangerTyping]);

  const showIcebreakers =
    status === "connected" &&
    messages.filter((m) => m.type === "message").length <= 2;

  // Helper to check if a stranger message is the first in a consecutive group
  function isFirstInGroup(index: number): boolean {
    const msg = messages[index];
    if (msg.fromMe || msg.type === "system") return false;
    if (index === 0) return true;
    const prev = messages[index - 1];
    return prev.fromMe || prev.type === "system";
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Shared interests bar */}
      {status === "connected" && sharedInterests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto"
        >
          <span className="text-[10px] uppercase tracking-wider text-[#52525b] shrink-0">
            Shared:
          </span>
          {sharedInterests.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#818cf8]/10 text-[#818cf8] border border-[#818cf8]/20 shrink-0"
            >
              #{tag}
            </span>
          ))}
        </motion.div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            if (msg.type === "system") {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-2"
                >
                  <span className="text-[11px] text-[#52525b] bg-white/[0.03] px-3 py-1 rounded-full inline-block">
                    {msg.text}
                  </span>
                </motion.div>
              );
            }
            const firstInGroup = isFirstInGroup(index);
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
              >
                {/* Stranger avatar */}
                {!msg.fromMe && firstInGroup && (
                  <span className="text-lg mr-2 mt-1 shrink-0 select-none">
                    {strangerAvatar}
                  </span>
                )}
                {!msg.fromMe && !firstInGroup && (
                  <span className="w-[1.75rem] mr-2 shrink-0" />
                )}

                <div
                  className="max-w-[75%] group relative"
                  onMouseEnter={() => setHoveredMsgId(msg.id)}
                  onMouseLeave={() => setHoveredMsgId(null)}
                >
                  {/* Reaction hover bar */}
                  <AnimatePresence>
                    {hoveredMsgId === msg.id && onReaction && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute -top-8 z-10 flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-[#27272a] border border-white/[0.1] shadow-lg ${
                          msg.fromMe ? "right-0" : "left-0"
                        }`}
                      >
                        {REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => onReaction(msg.id, emoji)}
                            className="w-7 h-7 rounded-full hover:bg-white/[0.1] flex items-center justify-center text-sm transition-all hover:scale-125"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed ${
                      msg.fromMe
                        ? "bg-gradient-to-r from-[#6366f1]/20 to-[#818cf8]/20 text-[#fafafa] rounded-2xl rounded-br-md border border-[#6366f1]/15 shadow-md shadow-[#6366f1]/5 ring-1 ring-inset ring-white/[0.05]"
                        : "bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] text-[#fafafa] rounded-2xl rounded-bl-md shadow-md shadow-black/10 ring-1 ring-inset ring-white/[0.03]"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div
                      className={`flex gap-1 mt-0.5 ${msg.fromMe ? "justify-end mr-1" : "ml-1"}`}
                    >
                      {msg.reactions.map((r, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/[0.06] border border-white/[0.08] rounded-full px-1.5 py-0.5"
                        >
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className={`flex items-center gap-1.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      msg.fromMe ? "justify-end mr-1" : "ml-1"
                    }`}
                  >
                    <span className="text-[10px] text-[#52525b]">
                      {formatTime(msg.timestamp)}
                    </span>
                    {/* Read receipts on sent messages */}
                    {msg.fromMe && (
                      <span className="text-[10px] text-[#52525b]">
                        {msg.delivered ? "\u2713\u2713" : "\u2713"}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Icebreakers */}
        {showIcebreakers && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-3 space-y-2"
          >
            <p className="text-[11px] text-[#52525b] text-center">
              Not sure what to say? Try an icebreaker:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {icebreakers.map((text) => (
                <motion.button
                  key={text}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSendMessage(text)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#818cf8] bg-[#6366f1]/10 border border-[#6366f1]/20 hover:bg-[#6366f1]/15 transition-colors max-w-[250px] text-left"
                >
                  {text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {strangerTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start items-center gap-2"
            >
              <span className="text-lg select-none">{strangerAvatar}</span>
              <div className="bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#52525b]">
                    Stranger is typing
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#a1a1aa]"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export type { ChatMessage };
