"use client";

import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import gsap from "gsap";

export default function HeroSection() {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      ".hero-badge",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
      .fromTo(
        ".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-buttons > *",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" },
        "-=0.4"
      );

    // Floating animation for background glow
    gsap.to(".hero-glow", {
      y: 20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center min-h-[90vh] justify-center overflow-hidden"
    >
      {/* Small glowing badge */}
      <div className="hero-badge flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-full text-emerald-300 text-xs font-semibold mb-8 tracking-wide backdrop-blur-md">
        <Leaf size={14} className="animate-pulse" /> Empowering Climate Tech for Tomorrow
      </div>

      {/* Main bold heading */}
      <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] max-w-5xl">
        Optimizing Life & Logistics for a{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
          Green Future
        </span>
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle mt-8 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
        EcoRoute AI provides intelligent carbon footprint tracking and
        sustainable routing algorithms for individuals and modern logistics
        providers.
      </p>

      {/* CTA Buttons */}
      <div className="hero-buttons mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm px-8 py-4 rounded-xl transition duration-300 shadow-xl shadow-emerald-600/30 group"
        >
          Get Started Free
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
        <a
          href="#about"
          className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-800/60 backdrop-blur-md text-slate-200 font-semibold text-sm px-8 py-4 rounded-xl border border-slate-700/60 transition duration-300 text-center hover:border-emerald-500/40"
        >
          Learn Our Mission
        </a>
      </div>

      {/* Background animated glow */}
      <div className="hero-glow absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 w-96 sm:w-[600px] h-96 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-full blur-3xl" />

      {/* Additional accent glow */}
      <div className="absolute bottom-1/4 right-0 -z-10 w-80 h-80 bg-gradient-to-l from-teal-500/15 to-transparent rounded-full blur-3xl" />
    </section>
  );
}
