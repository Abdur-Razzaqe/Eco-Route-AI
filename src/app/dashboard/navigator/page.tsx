"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Bike,
  Car,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";

const EcoMap = dynamic(() => import("@/components/dashboard/EcoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm">
      Loading Live Tracking System...
    </div>
  ),
});

export default function EcoNavigatorPage() {
  const [startInput, setStartInput] = useState("Dhaka");
  const [endInput, setEndInput] = useState("");

  const [startCoords, setStartCoords] = useState<[number, number]>([
    23.8103, 90.4125,
  ]);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);

  const [distance, setDistance] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🌍 Nominatim API দিয়ে জায়গার নাম থেকে স্থানাঙ্ক (Lat, Lon) বের করার ফাংশন
  const fetchCoordinates = async (
    placeName: string,
  ): Promise<[number, number] | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`,
      );
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleLiveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startInput || !endInput) return;

    setSearching(true);
    setError(null);
    setIsCalculated(false);

    // ১. স্টার্ট এবং এন্ড পয়েন্ট দুটোরই আসল কোঅর্ডিনেট লাইভ ফেচ করা হচ্ছে
    const startLoc = await fetchCoordinates(startInput);
    const endLoc = await fetchCoordinates(endInput);

    if (!startLoc) {
      setError(`Could not find location coordinates for: "${startInput}"`);
      setSearching(false);
      return;
    }
    if (!endLoc) {
      setError(`Could not find destination coordinates for: "${endInput}"`);
      setSearching(false);
      return;
    }

    // ২. ম্যাপের স্থানাঙ্ক আপডেট
    setStartCoords(startLoc);
    setEndCoords(endLoc);
    setSearching(false);
  };

  // ম্যাপের ভেতরের রুট ইঞ্জিন যখন আসল রাস্তার দূরত্ব হিসাব শেষ করবে, তখন এটি কল হবে
  const handleDistanceCallback = (calculatedDistance: number) => {
    setDistance(calculatedDistance);
    setIsCalculated(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6 p-2 pb-16 text-slate-100"
    >
      {/* হেডার */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Navigation className="text-cyan-400 animate-pulse" size={24} /> Live
          Global Eco-Navigator
        </h1>
        <p className="text-slate-400 text-sm">
          Type any global city or address to instantly track real-time routes
          and evaluate emissions.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* মেইন গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* বাম পাশ: গ্লোবাল সার্চ ইঞ্জিন প্যানেল */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Search size={16} className="text-cyan-400" /> Live Address
              Tracker
            </h3>

            <form onSubmit={handleLiveTracking} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  From (Start Address)
                </label>
                <input
                  type="text"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  placeholder="e.g. Mirpur, Dhaka"
                  required
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 mt-1 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  To (Destination Address)
                </label>
                <input
                  type="text"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  placeholder="e.g. Gulshan 2, Dhaka"
                  required
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 mt-1 focus:outline-none focus:border-cyan-500/50 placeholder-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={searching}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Locating Coordinates...
                  </>
                ) : (
                  "Track Real-Time Route"
                )}
              </button>
            </form>
          </div>

          {/* লাইভ কার্বন নির্গমন অ্যানালিটিক্স */}
          {isCalculated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Actual Road Distance
                </span>
                <span className="text-sm font-extrabold text-cyan-400">
                  {distance} KM
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <Car size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">
                      Gasoline Combustion
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      Traditional Transit
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-400">
                  +{(distance * 0.21).toFixed(2)} kg CO2
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Bike size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">
                      Eco-Friendly Option
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      Bicycling / Green Walk
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">
                    0.00 kg CO2
                  </span>
                  <p className="text-[9px] text-amber-400 font-semibold">
                    +{Math.round(distance * 10)} Pts Credit
                  </p>
                </div>
              </div>

              <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl flex gap-2 items-start">
                <Sparkles
                  size={14}
                  className="text-cyan-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-cyan-300">
                    AI Routing Strategy:
                  </strong>{" "}
                  This exact path has been verified via OpenStreetMap logs.
                  Choosing the eco-friendly alternative preserves{" "}
                  <span className="text-emerald-400 font-bold">
                    {(distance * 0.21).toFixed(2)}kg of carbon impact
                  </span>{" "}
                  for the ecosystem.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* ডান পাশ: লাইভ ট্র্যাকিং ম্যাপ */}
        <div className="lg:col-span-7">
          <EcoMap
            startCoords={startCoords}
            endCoords={endCoords}
            onDistanceCalculate={handleDistanceCallback}
          />
        </div>
      </div>
    </motion.div>
  );
}
