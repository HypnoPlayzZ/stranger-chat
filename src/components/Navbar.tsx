"use client";

import { useState } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleSignInButton from "./GoogleSignInButton";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(9,9,11,0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              Whispr
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#a1a1aa" }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm transition-colors duration-200 hover:text-white"
              style={{ color: "#a1a1aa" }}
            >
              How It Works
            </a>
            <GoogleSignInButton />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden transition-colors duration-200 cursor-pointer"
            style={{ color: "#a1a1aa" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(24,24,27,0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="px-4 py-5 flex flex-col gap-4">
              <a
                href="#features"
                className="text-sm transition-colors duration-200 hover:text-white"
                style={{ color: "#a1a1aa" }}
                onClick={() => setMobileOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm transition-colors duration-200 hover:text-white"
                style={{ color: "#a1a1aa" }}
                onClick={() => setMobileOpen(false)}
              >
                How It Works
              </a>
              <GoogleSignInButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
