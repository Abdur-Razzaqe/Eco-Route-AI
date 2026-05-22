"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardStats() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [transportType, setTransportType] = useState("driving");
  const [distance, setDistance] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // হিস্ট্রি ডাটা স্টেট
  const [activities, setActivities] = useState<any[]>([]);

  // ডাটাবেজ থেকে ডাটা ফেচ করার ফাংশন
  const fetchActivities = async () => {
    if (!user?.uid) return;
    try {
      const response = await fetch(`/api/activity?userId=${user.uid}`);
      const result = await response.json();
      if (result.success) {
        setActivities(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchActivities();
    }
  }, [user, loading, router]);

  const handleTrackRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distance || Number(distance) <= 0) return;

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          userName: user?.displayName || "Anonymous User",
          userEmail:
            user?.email || user?.providerData[0]?.email || "no-email@test.com",
          transportType,
          distance: Number(distance),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage(
          `🌱 Success! Generated ${result.data.carbonEmission} kg of CO2.`,
        );
        setDistance("");
        fetchActivities(); // টেবিল ও কার্ড অটো রিফ্রেশ হবে
      } else {
        setMessage("❌ Something went wrong.");
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  // 📊 রিয়েল-টাইম অ্যানালিটিক্স ক্যালকুলেশন লজিক
  const totalDistance = activities.reduce(
    (sum, item) => sum + (item.distance || 0),
    0,
  );
  const totalEmissions = activities.reduce(
    (sum, item) => sum + (item.carbonEmission || 0),
    0,
  );
  const ecoFriendlyTrips = activities.filter(
    (item) => item.carbonEmission === 0,
  ).length;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 🎫 হেডার */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Eco-Route Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Welcome back,{" "}
              <span className="text-emerald-400 font-medium">
                {user.displayName || user.email}
              </span>
              !
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl border border-red-500/20 transition duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </header>

        {/* 📈 ফেমাস অ্যানালিটিক্স কার্ড সেকশন */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* কার্ড ১: মোট দূরত্ব */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Travel Distance
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white">
                {totalDistance.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">km</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              🚗 Combined mileage of all trips
            </span>
          </div>

          {/* কার্ড ২: মোট নির্গমন */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Carbon Footprint
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                className={`text-3xl font-bold ${totalEmissions > 20 ? "text-red-400" : "text-orange-400"}`}
              >
                {totalEmissions.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400">kg CO2</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              ⚠️ Net environmental impact
            </span>
          </div>

          {/* াকার্ড ৩: গ্রিন স্কোর */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Eco-Friendly Trips
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-emerald-400">
                {ecoFriendlyTrips}
              </span>
              <span className="text-sm text-slate-400">trips</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-2">
              🌱 Zero-emission (Walking/Cycling)
            </span>
          </div>
        </div>

        {/* নিচের মেইন কন্টেন্ট গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🛠️ ফর্ম সেকশন (বাম পাশে) */}
          <main className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400">
              Track New Journey
            </h2>
            <form onSubmit={handleTrackRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Transport Type
                </label>
                <select
                  value={transportType}
                  onChange={(e) => setTransportType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="driving">🚗 Driving (Personal Vehicle)</option>
                  <option value="transit">🚌 Transit (Bus / Train)</option>
                  <option value="bicycling">🚲 Bicycling</option>
                  <option value="walking">🚶 Walking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl transition duration-200 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Calculate & Save"}
              </button>
            </form>

            {message && (
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm text-emerald-400 font-medium">
                {message}
              </div>
            )}
          </main>

          {/* 📊 লাইভ হিস্ট্রি টেবিল সেকশন (ডান পাশে ২ কলাম জুড়ে) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-200">
                Recent Carbon History
              </h2>

              {activities.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">
                  No journey logs found. Start tracking above!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Distance</th>
                        <th className="pb-3">Emission</th>
                        <th className="pb-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {activities.map((activity) => (
                        <tr
                          key={activity._id}
                          className="hover:bg-slate-850/40 transition"
                        >
                          <td className="py-3.5 capitalize font-medium text-slate-300">
                            {activity.transportType === "driving" &&
                              "🚗 Driving"}
                            {activity.transportType === "transit" &&
                              "🚌 Transit"}
                            {activity.transportType === "bicycling" &&
                              "🚲 Cycling"}
                            {activity.transportType === "walking" &&
                              "🚶 Walking"}
                          </td>
                          <td className="py-3.5 text-slate-400">
                            {activity.distance} km
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-md font-medium text-xs ${activity.carbonEmission === 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                            >
                              {activity.carbonEmission} kg
                            </span>
                          </td>
                          <td className="py-3.5 text-right text-slate-500 text-xs">
                            {new Date(activity.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-emerald-500/5 text-slate-400 border border-emerald-500/10 rounded-xl text-xs flex justify-between items-center">
              <span>
                💡 Total Logs: <b>{activities.length} trips</b>
              </span>
              <span className="text-emerald-400">Live Syncing Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
