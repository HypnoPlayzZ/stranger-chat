"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, SkipForward, X, Flag } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onTyping: () => void;
  disabled: boolean;
  onNewChat?: () => void;
  onDisconnect?: () => void;
  onReport?: () => void;
  showActions?: boolean;
}

export default function ChatInput({
  input,
  onInputChange,
  onSend,
  onTyping,
  disabled,
  onNewChat,
  onDisconnect,
  onReport,
  showActions,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="shrink-0 bg-white/[0.03] backdrop-blur-[20px] border-t border-white/[0.08]">
      <div className="p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              onInputChange(e.target.value);
              onTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-[#fafafa] outline-none focus:border-[#6366f1]/40 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] placeholder:text-[#52525b] transition-all resize-none overflow-hidden disabled:opacity-40"
            maxLength={2000}
            autoFocus
          />
          <motion.button
            type="button"
            onClick={onSend}
            disabled={!input.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#818cf8] flex items-center justify-center shrink-0 transition-opacity disabled:opacity-30 shadow-lg shadow-[#6366f1]/20"
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        {/* Character count + mobile actions */}
        <div className="flex items-center justify-between mt-2 px-1">
          {showActions && (
            <div className="flex items-center gap-3 sm:hidden">
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  className="flex items-center gap-1 text-xs text-[#52525b] hover:text-[#818cf8] transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  New
                </button>
              )}
              {onDisconnect && (
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-1 text-xs text-[#f43f5e]/60 hover:text-[#f43f5e] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  End
                </button>
              )}
              {onReport && (
                <button
                  onClick={onReport}
                  className="flex items-center gap-1 text-xs text-[#52525b] hover:text-[#f43f5e] transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report
                </button>
              )}
            </div>
          )}
          {input.length > 1800 && (
            <span
              className={`text-[10px] ml-auto ${input.length > 1950 ? "text-[#f43f5e]" : "text-[#52525b]"}`}
            >
              {input.length}/2000
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
