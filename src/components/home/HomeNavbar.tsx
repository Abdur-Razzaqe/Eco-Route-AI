"use client";

import Link from "next/link";
import { Leaf, ArrowUpRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import gsap from "gsap";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      "nav",
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-700/50 rounded-2xl px-6 py-3.5 shadow-2xl shadow-slate-950/50">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-emerald-500/30">
                🌱
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent hidden sm:inline">
                EcoRoute AI
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: "Home", href: "#hero" },
                { label: "About", href: "#about" },
                { label: "Features", href: "#features" },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="relative text-sm font-medium text-slate-300 hover:text-emerald-300 px-4 py-2 transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-medium text-slate-300 hover:text-emerald-300 transition px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/40 group"
              >
                <span className="hidden sm:inline">Launch App</span>
                <span className="sm:hidden">Launch</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-slate-800/50 rounded-lg transition"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-700/50 space-y-3">
              {[
                { label: "Home", href: "#hero" },
                { label: "About", href: "#about" },
                { label: "Features", href: "#features" },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-slate-300 hover:text-emerald-300 px-4 py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
