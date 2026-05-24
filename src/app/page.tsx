"use client";

import HomeNavbar from "@/components/home/HomeNavbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-[#020617] via-[#0f1419] to-[#020617] text-slate-100 min-h-screen overflow-x-hidden selection:bg-emerald-500/30">
      <HomeNavbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
