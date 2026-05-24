"use client";

import { ShieldAlert, Cpu, Globe2 } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  // 💡 TypeScript-কে বলে দেওয়া হলো যে এটি একটি HTML div এলিমেন্টের রেফারেন্স
  const containerRef = useRef<HTMLDivElement>(null);

  const points = [
    {
      icon: <ShieldAlert className="text-orange-400" size={28} />,
      title: "The Carbon Crisis",
      desc: "Climate change is accelerating. Over the next decade, tracking and lowering individual and commercial carbon emissions will be standard global practice.",
    },
    {
      icon: <Cpu className="text-emerald-400" size={28} />,
      title: "AI-Driven Logistics",
      desc: "Our engine optimizes delivery routes, avoiding traffic congestion and excessive idling, reducing emission overhead by up to 55% for businesses.",
    },
    {
      icon: <Globe2 className="text-teal-400" size={28} />,
      title: "Sustainable Ecosystem",
      desc: "By integrating sustainable marketplaces and verified carbon reporting tools, we empower everyday change makers to contribute directly.",
    },
  ];

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".about-card");
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  }, []);

  return (
    <section
      id="about"
      className="py-32 border-t border-slate-800/50 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="text-center space-y-6">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            About EcoRoute AI
          </h2>
          <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Why Smart Living Needs Artificial Intelligence
          </p>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            We bridge the gap between heavy technological computation and
            everyday eco-friendly practices.
          </p>
        </div>

        {/* 3 Main Points Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {points.map((point, index) => (
            <div
              key={index}
              className="about-card group bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-lg border border-slate-700/50 p-10 rounded-2xl space-y-5 hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-slate-950/80 w-fit rounded-xl border border-slate-700/60 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                {point.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
