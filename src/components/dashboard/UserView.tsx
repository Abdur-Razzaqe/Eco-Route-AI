"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion"; // 💡 Variants টাইপ ইম্পোর্ট করা হলো
import { Leaf, Award, Footprints, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// 💡 containerVariants-এ Variants টাইপ ডিফাইন করা হলো
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// 💡 itemVariants-এ Variants টাইপ ডিফাইন করা হলো
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function UserView({ user }: { user: any }) {
  // 🎯 সার্ভার সাইড মাউন্ট ট্র্যাকিং স্টেট (Recharts এরর ফিক্সের জন্য)
  const [isMounted, setIsMounted] = useState(false);

  // ডাইনামিক স্টেটস
  const [stats, setStats] = useState({
    totalCo2Saved: "0.0",
    greenPoints: 0,
    totalTrips: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(
    "Loading AI recommendations...",
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true); // 🚀 ব্রাউজারে কম্পোনেন্ট লোড হলে ট্রু হবে

    if (user?.uid) {
      // ব্যাকএন্ড এপিআই থেকে লাইভ ডাটা রিড করা হচ্ছে
      fetch(`/api/dashboard-summary?uid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStats(data.stats);
            setChartData(data.chartData);
            setAiSuggestion(data.aiSuggestion);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading summary:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-slate-400 text-sm">
        Syncing live ecosystem metrics...
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* ১. হেডার সেকশন */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {user?.displayName || "Eco Warrior"}
          </span>{" "}
          👋
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Track your daily carbon impact, optimize travels, and claim
          sustainable rewards.
        </p>
      </motion.div>

      {/* ২. ডাইনামিক স্ট্যাটসカード গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* লাইভ কার্বন সেভ */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Leaf size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total CO2 Saved
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {stats.totalCo2Saved}{" "}
              <span className="text-lg font-medium text-slate-500">kg</span>
            </h3>
          </div>
        </motion.div>

        {/* লাইভ গ্রিন পয়েন্ট */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Award size={24} />
            </div>
            <a
              href="/dashboard/market"
              className="text-xs font-medium text-amber-400 flex items-center gap-0.5 hover:underline"
            >
              Redeem <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Green Points Balance
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {stats.greenPoints}{" "}
              <span className="text-lg font-medium text-slate-500">Pts</span>
            </h3>
          </div>
        </motion.div>

        {/* লাইভ ট্রিপস */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
              <Footprints size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Eco Travel Logs
            </p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {stats.totalTrips}{" "}
              <span className="text-lg font-medium text-slate-500">Trips</span>
            </h3>
          </div>
        </motion.div>
      </div>

      {/* 📊 ৩. ডাইনামিক পাই চার্ট এবং এআই সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md min-w-0"
        >
          <h3 className="text-lg font-bold text-white mb-2">
            Carbon Footprint Breakdown
          </h3>
          <p className="text-slate-400 text-xs mb-6">
            Visual presentation of your emission distribution by categories.
          </p>

          <div className="w-full h-64 min-w-0 relative flex justify-center items-center">
            {isMounted && chartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={250}
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || "#10b981"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-xs tracking-wide">
                No emission breakdown data available
              </div>
            )}
          </div>
        </motion.div>

        {/* ডাইনামিক এআই সাজেশন বক্স */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              AI Environmental Recommendations
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {aiSuggestion}
            </p>
          </div>
          <div className="pt-6 border-t border-slate-800/60 mt-6">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
              🌱 Elite Green Tier Active
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
