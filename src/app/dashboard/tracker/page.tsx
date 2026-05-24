"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Navigation,
  ChevronRight,
  Sparkles,
  Award,
  Trophy,
  Info,
} from "lucide-react";

export default function CarbonTrackerPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    transportType: "driving",
    distance: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<{
    carbonEmission: number;
    pointsEarned: number;
    aiSuggestion: string;
    mode: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const generateAISuggestion = (
    type: string,
    dist: number,
    emission: number,
  ) => {
    if (type === "bicycling" || type === "walking") {
      return `Brilliant! By choosing to ${type === "bicycling" ? "cycle" : "walk"} for ${dist} km, you prevented approximately ${(dist * 0.21).toFixed(2)} kg of CO2 from entering the atmosphere. This is the optimal sustainable choice!`;
    }
    if (type === "transit") {
      return `Good job using public transit! You emitted ${emission.toFixed(2)} kg of CO2, which is about 60% less than driving a personal car for the same distance. Consider walking for last-mile connectivity.`;
    }
    if (dist < 3) {
      return `Your driving emitted ${emission.toFixed(2)} kg of CO2. Since this trip was under 3km, you could easily swap this with cycling or walking next time to save fuel and earn 5x more Green Points!`;
    }
    return `This drive generated ${emission.toFixed(2)} kg of CO2. To offset this impact, try combining multiple errands into one trip or consider carpooling whenever possible.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.distance || Number(formData.distance) <= 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const aiMsg = generateAISuggestion(
          formData.transportType,
          Number(formData.distance),
          data.carbonEmission,
        );
        setResult({
          carbonEmission: data.carbonEmission,
          pointsEarned: data.pointsEarned,
          aiSuggestion: aiMsg,
          mode: formData.transportType,
        });
        setFormData({
          transportType: "driving",
          distance: "",
          description: "",
        });
      } else {
        setError(data.message || "Failed to compute carbon stats.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the eco-server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 💡 ফিক্স ১: min-h-screen এবং ব্যাকগ্রাউন্ড নিশ্চিত করা হয়েছে যাতে নিচে কোনো হোয়াইট স্পেস না থাকে
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 p-4 min-h-screen text-slate-100 pb-20"
    >
      {/* হেডার */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Leaf className="text-emerald-400" /> AI Carbon Tracker
        </h1>
        <p className="text-slate-400 text-sm">
          Log your daily commutes to compute eco-impact and earn tradeable green
          rewards.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* মেইন গ্রিড লেআউট */}
      {/* 💡 ফিক্স ২: items-stretch ব্যবহার করা হয়েছে যাতে ডানের এবং বামের কলামের হাইট সবসময় সমান থাকে */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* বাম দিকের কলাম: ইনপুট ফর্ম */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Mode of Transportation
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "driving", label: "🚗 Car/Bike" },
                  { id: "transit", label: "🚌 Bus/Train" },
                  { id: "bicycling", label: "🚲 Cycling" },
                  { id: "walking", label: "🚶 Walking" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, transportType: item.id })
                    }
                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                      formData.transportType === item.id
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Distance Covered (KM)
              </label>
              <div className="relative">
                <Navigation
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 12.5"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: e.target.value })
                  }
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Trip Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Went to office"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-1 shadow-lg"
            >
              {loading ? "Calculating Impact..." : "Compute & Log Impact"}
              <ChevronRight size={16} />
            </button>
          </form>
        </div>

        {/* ডানের কলাম: ইনস্ট্যান্ট লাইভ রেজাল্ট ও AI কার্ড */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4 w-full h-full flex flex-col justify-between"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <Leaf size={14} className="text-emerald-400" /> Carbon
                      Footprint
                    </div>
                    <h3
                      className={`text-2xl font-black ${result.carbonEmission === 0 ? "text-emerald-400" : "text-amber-500"}`}
                    >
                      {result.carbonEmission.toFixed(2)}{" "}
                      <span className="text-sm font-normal text-slate-500">
                        kg CO2
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Generated emission for this specific log.
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <Award size={14} className="text-amber-400" /> Points
                      Earned
                    </div>
                    <h3 className="text-2xl font-black text-amber-400">
                      +{result.pointsEarned}{" "}
                      <span className="text-sm font-normal text-slate-500">
                        Points
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Successfully deposited to your wallet.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden flex-1 mt-4 flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-400">
                    <Trophy size={80} />
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                    <Sparkles size={16} />
                    <span>EcoRoute AI Insight</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {result.aiSuggestion}
                  </p>
                </div>
              </motion.div>
            ) : (
              // ডিফল্ট গাইড স্টেট কন্টেইনার
              // 💡 ফিক্স ৩: h-full এবং flex-1 দিয়ে এটিকে ফর্মের সমান হাইট দেওয়া হয়েছে যাতে নিচে ফাঁকা না দেখায়
              <div className="w-full h-full min-h-[380px] sm:min-h-full border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-900/20 backdrop-blur-sm">
                <div className="p-4 rounded-full bg-slate-900/50 mb-3 text-slate-600">
                  <Info size={32} />
                </div>
                <h4 className="text-sm font-bold text-slate-400 mb-1">
                  Awaiting Impact Computations
                </h4>
                <p className="text-xs max-w-sm">
                  Fill out the travel log parameters on the left. The live
                  carbon telemetry and AI optimization strategy will render here
                  instantly.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
