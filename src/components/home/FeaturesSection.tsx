"use client";

import { BarChart3, Navigation, Zap, TrendingDown } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  // 💡 ১. Ref-এর টাইপ ফিক্স করা হলো
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <BarChart3 className="text-emerald-400" size={32} />,
      title: "Real-Time Carbon Tracking",
      desc: "Monitor your carbon footprint in real-time across all activities and transportation modes.",
    },
    {
      icon: <Navigation className="text-teal-400" size={32} />,
      title: "Smart Route Optimization",
      desc: "AI-powered algorithms find the most eco-friendly routes, reducing emissions by up to 55%.",
    },
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: "Instant Insights",
      desc: "Get actionable recommendations to reduce your carbon footprint immediately.",
    },
    {
      icon: <TrendingDown className="text-blue-400" size={32} />,
      title: "Progress Tracking",
      desc: "Visualize your sustainability journey with detailed analytics and milestone achievements.",
    },
  ];

  useEffect(() => {
    // 💡 ২. NodeListOf<Element> ব্যবহার করে টাইপ সেফটি নিশ্চিত করা হয়েছে
    const cards = containerRef.current?.querySelectorAll(".feature-card");
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

    // Hover animation
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -10,
          boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 0 0 rgba(16, 185, 129, 0)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Cleanup: ইভেন্ট লিসেনার রিমুভ করা ভালো প্র্যাকটিস
    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Powerful Features
          </h2>
          <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Everything You Need for Sustainable Living
          </p>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Comprehensive tools designed to make carbon tracking effortless and
            impactful.
          </p>
        </div>

        {/* 💡 এখানে ref যুক্ত করা হয়েছে */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl space-y-4 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-slate-950/80 w-fit rounded-xl border border-slate-700/60 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 right-0 -z-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
    </section>
  );
}
