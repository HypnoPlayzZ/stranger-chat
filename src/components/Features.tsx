"use client";

import { Shield, Zap, Globe, EyeOff, Shuffle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";

const features = [
  {
    icon: EyeOff,
    title: "Fully Anonymous",
    description:
      "No usernames, no profiles, no history. Your identity stays completely hidden.",
    color: "#6366f1",
    span: "lg:col-span-2 lg:row-span-2",
    big: true,
  },
  {
    icon: Shuffle,
    title: "Smart Matching",
    description:
      "Get paired with a random stranger instantly. Don't vibe? Skip to the next one.",
    color: "#818cf8",
    span: "lg:col-span-2",
    big: false,
  },
  {
    icon: Zap,
    title: "Instant Connect",
    description:
      "No waiting rooms, no queues. Start chatting within seconds of hitting connect.",
    color: "#f59e0b",
    span: "lg:col-span-1",
    big: false,
  },
  {
    icon: Shield,
    title: "Safe & Moderated",
    description:
      "AI-powered moderation keeps conversations clean and free from harmful content.",
    color: "#10b981",
    span: "lg:col-span-1",
    big: false,
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Connect with people from every corner of the world. Break barriers, not rules.",
    color: "#818cf8",
    span: "lg:col-span-2",
    big: false,
  },
  {
    icon: Lock,
    title: "End-to-End Encrypted",
    description:
      "Messages are encrypted in transit. No one can read your conversations — not even us.",
    color: "#6366f1",
    span: "lg:col-span-2",
    big: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 relative" style={{ background: "#18181b" }}>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#6366f1",
            }}
          >
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span style={{ color: "#fafafa" }}>Why </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              Whispr
            </span>
            <span style={{ color: "#fafafa" }}>?</span>
          </h2>
          <p className="max-w-lg mx-auto" style={{ color: "#a1a1aa" }}>
            Built for privacy-first, authentic conversations with strangers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08 }}
                className={feature.span}
              >
                <SpotlightCard
                  className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl hover:border-[rgba(99,102,241,0.2)] transition-all duration-300 h-full"
                >
                  <div className="p-6 h-full flex flex-col justify-center group cursor-default">
                    <div className={`relative ${feature.big ? "w-16 h-16" : "w-12 h-12"} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {/* Glow behind icon */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                        style={{ background: feature.color, filter: "blur(8px)" }}
                      />
                      <div
                        className="relative w-full h-full rounded-xl flex items-center justify-center"
                        style={{ background: `${feature.color}18` }}
                      >
                        <Icon className={`${feature.big ? "w-8 h-8" : "w-6 h-6"}`} style={{ color: feature.color }} />
                      </div>
                    </div>
                    <h3
                      className={`${feature.big ? "text-2xl" : "text-lg"} font-semibold mb-2`}
                      style={{ color: "#fafafa" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
                      {feature.description}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
