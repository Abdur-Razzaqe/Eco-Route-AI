"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  // 💡 সঠিক টাইপ ডিক্লেয়ারেশন
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats = [
    { number: "50", label: "Active Users" }, // GSAP Snap এর জন্য শুধু সংখ্যা রাখা ভালো
    { number: "2500000", label: "Tons CO₂ Reduced" },
    { number: "85", label: "User Satisfaction" },
    { number: "140", label: "Countries" },
  ];

  useEffect(() => {
    // ScrollTrigger এর টাইপ সেফটি
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      onEnter: () => {
        if (!hasAnimated) {
          animateStats();
          setHasAnimated(true);
        }
      },
    });

    return () => trigger.kill();
  }, [hasAnimated]);

  const animateStats = () => {
    // 💡 NodeListOf টাইপ কাস্টিং
    const numberElements =
      containerRef.current?.querySelectorAll(".stat-number");
    if (!numberElements) return;

    numberElements.forEach((element) => {
      // 💡 টাইপ স্ক্রিপ্টকে বোঝানো যে এটি একটি HTMLElement
      const el = element as HTMLElement;
      const finalValue = el.getAttribute("data-value");

      if (finalValue) {
        gsap.to(el, {
          textContent: finalValue,
          duration: 2.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          // রেজাল্ট দেখানোর সময় K বা M যোগ করতে চাইলে এখানে আরও লজিক দেওয়া যায়
        });
      }
    });
  };

  return (
    <section className="py-32 border-t border-slate-800/50 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950/50 to-transparent">
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Our Global Impact
          </h2>
          <p className="text-slate-400 text-lg">
            Millions working together for a sustainable future
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-emerald-500/40 hover:bg-slate-900/60 transition-all duration-300"
            >
              <p
                className="stat-number text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3"
                data-value={stat.number}
              >
                0
              </p>
              <p className="text-slate-300 text-sm sm:text-base font-medium group-hover:text-emerald-300 transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
