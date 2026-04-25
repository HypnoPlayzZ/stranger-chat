"use client";

import { signIn, useSession } from "next-auth/react";
import { ArrowRight, Users, MessageSquare, Globe } from "lucide-react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import MagneticButton from "@/components/MagneticButton";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { duration: 2000 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) motionVal.set(target);
  }, [isInView, motionVal, target]);

  useEffect(() => {
    const unsubscribe = springVal.on("change", (v) => {
      const val = Math.floor(v);
      if (val >= 1000000) setDisplay(`${(val / 1000000).toFixed(1)}M`);
      else if (val >= 1000) setDisplay(`${Math.floor(val / 1000)}K`);
      else setDisplay(String(val));
    });
    return unsubscribe;
  }, [springVal]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const headlineWords1 = ["Conversations", "that"];
const headlineWords2 = ["actually", "matter."];

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Static gradient mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99,102,241,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 60% 80% at 80% 20%, rgba(129,140,248,0.05) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 50% 80%, rgba(99,102,241,0.04) 0%, transparent 70%)
            `,
          }}
        />
      </div>

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#10b981" }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "#10b981" }} />
          </span>
          <span className="text-sm font-medium" style={{ color: "#10b981" }}>
            1,200+ online now
          </span>
        </motion.div>

        {/* Heading with word-by-word reveal */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ color: "#fafafa" }}>
          <span className="block">
            {headlineWords1.map((word, i) => (
              <span key={word} className="inline-block overflow-hidden mr-[0.3em]">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="block">
            {headlineWords2.map((word, i) => (
              <span key={word} className="inline-block overflow-hidden mr-[0.3em]">
                <motion.span
                  className="inline-block bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #818cf8)" }}
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: (headlineWords1.length + i) * 0.08, ease: "easeOut" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          style={{ color: "#a1a1aa" }}
        >
          Whispr matches you with real people for anonymous conversations. No profiles, no algorithms, no small talk — just honest human connection.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {session ? (
            <MagneticButton>
              <a
                href="/chat"
                className="btn-glow flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  boxShadow: "0 0 30px rgba(99,102,241,0.3)",
                }}
              >
                Go to Chat
                <ArrowRight className="w-5 h-5" />
              </a>
            </MagneticButton>
          ) : (
            <MagneticButton>
              <button
                onClick={() => signIn("google", { callbackUrl: "/chat" })}
                className="btn-glow flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  boxShadow: "0 0 30px rgba(99,102,241,0.3)",
                }}
              >
                Start Chatting
                <ArrowRight className="w-5 h-5" />
              </button>
            </MagneticButton>
          )}
          <a
            href="#features"
            className="px-8 py-4 rounded-full font-medium transition-all duration-300 hover:border-indigo-500/30"
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#a1a1aa",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            Learn More
          </a>
        </motion.div>

        {/* Trust stats with animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mt-16"
        >
          {[
            { icon: Users, target: 50000, suffix: "+", label: "Users" },
            { icon: MessageSquare, target: 1000000, suffix: "+", label: "Messages" },
            { icon: Globe, target: 120, suffix: "+", label: "Countries" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.15)" }}
              >
                <stat.icon className="w-5 h-5" style={{ color: "#6366f1" }} />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold" style={{ color: "#fafafa" }}>
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-xs" style={{ color: "#52525b" }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
