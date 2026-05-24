"use client";

import { motion, Variants } from "framer-motion"; // 💡 Variants টাইপ ইম্পোর্ট করা হলো
import { Truck, Fuel, DollarSign, ShieldCheck, Activity } from "lucide-react";

// 💡 containerVariants-এ Variants টাইপ ডিফাইন করা হলো
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

// 💡 itemVariants-এ Variants টাইপ ডিফাইন করা হলো, যার ফলে 'spring' টাইপ নিয়ে আর এরর আসবে না
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function BusinessView() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* হেডার সেকশন */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Logistics{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Control Panel
          </span>{" "}
          📊
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Monitor enterprise fleet status, manage smart eco-routes, and analyze
          operational fuel reductions.
        </p>
      </motion.div>

      {/* বিজনেস স্ট্যাটস গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* কার্ড ১: একটিভ শিপমেন্টস */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Truck size={24} />
            </div>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md animate-pulse">
              <Activity size={10} /> Live Tracking
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active Smart Shipments
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              5{" "}
              <span className="text-lg font-medium text-slate-500">Routes</span>
            </h3>
          </div>
        </motion.div>

        {/* CARD 2: ফুয়েল সেভড */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md hover:border-emerald-500/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Fuel size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Fuel Saved (AI Optimized)
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              142{" "}
              <span className="text-lg font-medium text-slate-500">Liters</span>
            </h3>
          </div>
        </motion.div>

        {/* CARD 3: খরচ সাশ্রয় */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <DollarSign size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md">
              <ShieldCheck size={12} /> Validated
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Carbon Tax Reductions
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">$2,450</h3>
          </div>
        </motion.div>
      </div>

      {/* লজিস্টিকস ওভারভিউ সেকশন */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">
          Enterprise Fleet Dispatch & Green Optimization
        </h3>
        <p className="text-slate-400 text-sm">
          Commercial eco-routing calculation analytics and corporate delivery
          data metrics will reflect here live.
        </p>
      </motion.div>
    </motion.div>
  );
}
