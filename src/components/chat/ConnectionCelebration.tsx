"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function ConnectionCelebration() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        angle: Math.random() * 360,
        distance: 100 + Math.random() * 200,
        size: 3 + Math.random() * 4,
        color: ["#6366f1", "#818cf8", "#a5b4fc", "#f59e0b"][
          Math.floor(Math.random() * 4)
        ],
        duration: 0.6 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0.5],
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
