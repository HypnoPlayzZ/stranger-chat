"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flag } from "lucide-react";

interface ReportModalProps {
  show: boolean;
  reportReason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const REPORT_REASONS = [
  "Harassment / Abuse",
  "Spam / Advertising",
  "Inappropriate content",
  "Threatening behavior",
];

export default function ReportModal({
  show,
  reportReason,
  onReasonChange,
  onSubmit,
  onClose,
}: ReportModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#18181b] border border-white/[0.1] backdrop-blur-[20px] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f43f5e]/10 border border-[#f43f5e]/20 flex items-center justify-center">
                <Flag className="w-5 h-5 text-[#f43f5e]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#fafafa]">
                  Report User
                </h3>
                <p className="text-xs text-[#52525b]">
                  Your identity will not be shared
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => onReasonChange(reason)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    reportReason === reason
                      ? "bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-[#f43f5e]"
                      : "bg-white/[0.04] border border-white/[0.06] text-[#a1a1aa] hover:bg-white/[0.06] hover:text-[#fafafa]"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.1] text-[#a1a1aa] hover:text-[#fafafa] hover:border-white/[0.2] transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={!reportReason}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#f43f5e]/80 hover:bg-[#f43f5e] text-white text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit Report
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
