"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";

const messages = [
  { side: "left", text: "Hey! Where are you from? :wave:" },
  { side: "right", text: "Somewhere in Asia! How about you?" },
  { side: "left", text: "Europe! Love meeting people from different places" },
  { side: "right", text: "Same! That's why I love this app" },
  { side: "left", text: "So what do you do for fun?" },
  { side: "right", text: "Music production and hiking. You?" },
];

const testimonials = [
  {
    quote: "Talked to someone from Tokyo for 3 hours about music production. We still email each other.",
    location: "Brazil",
    flag: "\uD83C\uDDE7\uD83C\uDDF7",
    name: "Ana, 23",
    stars: 5,
  },
  {
    quote: "The icebreaker suggestions are genius. No more awkward 'hey' openers.",
    location: "Germany",
    flag: "\uD83C\uDDE9\uD83C\uDDEA",
    name: "Max, 28",
    stars: 5,
  },
  {
    quote: "I was skeptical but the conversations here are genuinely deeper than any dating app.",
    location: "Canada",
    flag: "\uD83C\uDDE8\uD83C\uDDE6",
    name: "Priya, 25",
    stars: 4,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function AppMockup() {
  return (
    <section id="demo" className="relative py-20 sm:py-28 overflow-hidden" style={{ background: "#18181b" }}>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#6366f1",
            }}
          >
            Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span style={{ color: "#fafafa" }}>See It in </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              Action
            </span>
          </h2>
          <p className="max-w-lg mx-auto" style={{ color: "#a1a1aa" }}>
            A glimpse of what your next conversation could look like
          </p>
        </motion.div>

        {/* Chat mockup window */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#09090b",
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#f43f5e" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
            </div>
            <div className="flex-1 flex justify-center">
              <div
                className="px-4 py-1 rounded-lg text-xs"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#52525b",
                }}
              >
                whispr.chat
              </div>
            </div>
          </div>

          {/* Chat header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: "rgba(99,102,241,0.2)" }}
              >
                <span role="img" aria-label="anonymous">{"\uD83D\uDC64"}</span>
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ background: "#10b981", borderColor: "#09090b" }}
              />
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: "#fafafa" }}>
                Anonymous Stranger
              </div>
              <div className="text-xs" style={{ color: "#10b981" }}>Online</div>
            </div>
          </div>

          {/* Messages area */}
          <div className="px-6 py-6 space-y-4" style={{ minHeight: "320px", background: "#09090b" }}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 text-sm ${
                    msg.side === "right" ? "rounded-2xl rounded-tr-sm" : "rounded-2xl rounded-tl-sm"
                  }`}
                  style={
                    msg.side === "right"
                      ? {
                          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                          color: "#ffffff",
                        }
                      : {
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#fafafa",
                        }
                  }
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input area */}
          <div
            className="px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#09090b" }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-sm flex-1" style={{ color: "#52525b" }}>
                Type a message...
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.location}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <SpotlightCard
                className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(99,102,241,0.2)] transition-all duration-300"
              >
                <div className="p-5">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4"
                        style={{
                          color: j < t.stars ? "#f59e0b" : "#27272a",
                          fill: j < t.stars ? "#f59e0b" : "none",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm italic mb-3" style={{ color: "#a1a1aa" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium" style={{ color: "#fafafa" }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "#52525b" }}>
                      {t.flag} {t.location}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
