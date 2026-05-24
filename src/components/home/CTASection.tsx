"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Floating animation for the container
    gsap.to(sectionRef.current, {
      y: 15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div
          ref={sectionRef}
          className="relative rounded-3xl bg-gradient-to-br from-emerald-600/15 via-teal-600/10 to-emerald-600/15 border border-emerald-500/30 p-12 sm:p-16 lg:p-20 overflow-hidden shadow-2xl shadow-emerald-600/20 backdrop-blur-xl"
        >
          {/* Background blur effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="text-center space-y-8 relative z-10">
            <div className="flex items-center justify-center gap-2 bg-emerald-500/20 border border-emerald-500/40 px-4 py-2.5 rounded-full w-fit mx-auto backdrop-blur-md">
              <Leaf size={16} className="text-emerald-300 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-300">
                Ready to Make an Impact?
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Start Your Sustainable Journey <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Today</span>
            </h2>

            <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Join thousands of individuals and businesses committed to reducing
              their carbon footprint. Get instant access to advanced tracking,
              smart recommendations, and a global community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-8 sm:px-10 py-4 rounded-xl transition duration-300 shadow-lg shadow-emerald-600/40 group w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#about"
                className="text-emerald-300 hover:text-emerald-200 font-semibold transition w-full sm:w-auto text-center py-4"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
