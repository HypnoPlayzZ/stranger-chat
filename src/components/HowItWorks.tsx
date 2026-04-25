"use client";

import { signIn, useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";
import MagneticButton from "@/components/MagneticButton";

const steps = [
  {
    num: "01",
    title: "Sign In",
    description:
      "Quick Google sign-in to verify you're human. We don't store or show your identity.",
  },
  {
    num: "02",
    title: "Get Matched",
    description:
      "Our smart pairing system instantly connects you with a random anonymous person.",
  },
  {
    num: "03",
    title: "Start Talking",
    description:
      "Chat freely. When you're done, disconnect and find someone new.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative" style={{ background: "#09090b" }}>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
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
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.2)",
              color: "#818cf8",
            }}
          >
            Getting Started
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span style={{ color: "#fafafa" }}>How It </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              Works
            </span>
          </h2>
          <p className="max-w-lg mx-auto" style={{ color: "#a1a1aa" }}>
            Start chatting with strangers in under a minute
          </p>
        </motion.div>

        <div className="relative flex flex-col md:flex-row gap-6">
          {/* Connecting line (desktop) — indigo gradient */}
          <div
            className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px -translate-y-1/2 z-0"
            style={{
              background: "linear-gradient(90deg, rgba(99,102,241,0.4), rgba(129,140,248,0.5), rgba(99,102,241,0.4))",
            }}
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              className="flex-1 relative z-10"
            >
              <SpotlightCard
                className="rounded-2xl h-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(99,102,241,0.2)] transition-all duration-300"
              >
                <div className="p-6 text-center h-full" style={{ backdropFilter: "blur(20px)" }}>
                  {/* Large gradient number */}
                  <div
                    className="text-5xl font-black mb-4 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #6366f1, #818cf8)",
                      opacity: 0.8,
                    }}
                  >
                    {s.num}
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#fafafa" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
                    {s.description}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-14"
        >
          <HowItWorksCTA />
          <p className="text-xs mt-4" style={{ color: "#52525b" }}>
            No credit card required. No data collected.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksCTA() {
  const { data: session } = useSession();

  if (session) {
    return (
      <MagneticButton>
        <a
          href="/chat"
          className="btn-glow inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25"
          style={{
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            boxShadow: "0 0 30px rgba(99,102,241,0.3)",
          }}
        >
          Go to Chat
          <ArrowRight className="w-5 h-5" />
        </a>
      </MagneticButton>
    );
  }

  return (
    <MagneticButton>
      <button
        onClick={() => signIn("google", { callbackUrl: "/chat" })}
        className="btn-glow inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          boxShadow: "0 0 30px rgba(99,102,241,0.3)",
        }}
      >
        Get Started — It&apos;s Free
        <ArrowRight className="w-5 h-5" />
      </button>
    </MagneticButton>
  );
}
