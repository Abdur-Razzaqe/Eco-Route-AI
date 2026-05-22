"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function DashboardStats() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [transportType, setTransportType] = useState("driving");
  const [distance, setDistance] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  // ডাটাবেজ থেকে ডাটা আনা
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

  // ডাটাবেজ থেকে ডাটা ডিলিট করার ফাংশন
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      const response = await fetch(`/api/activity?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        fetchActivities(); // ডাটা ডিলিট হওয়ার পর চার্ট ও টেবিল অটো রিফ্রেশ
      }
    } catch (err) {
      console.error("Failed to delete:", err);
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
        fetchActivities();
      } else {
        setMessage("❌ Something went wrong.");
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  // 📊 অ্যানালিটিক্স ক্যালকুলেশন
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

  // 🥧 পাই-চার্টের জন্য ডাটা ফরম্যাট করা
  const chartDataMap = activities.reduce((acc: any, item) => {
    const type =
      item.transportType === "driving"
        ? "🚗 Driving"
        : item.transportType === "transit"
          ? "🚌 Transit"
          : item.transportType === "bicycling"
            ? "🚲 Cycling"
            : "🚶 Walking";
    acc[type] = (acc[type] || 0) + (item.carbonEmission || 0);
    return acc;
  }, {});

  const chartData = Object.keys(chartDataMap)
    .map((key) => ({
      name: key,
      value: Number(chartDataMap[key].toFixed(2)),
    }))
    .filter((item) => item.value > 0); // শুধু নির্গমন থাকা টাইপগুলো দেখাবে

  const COLORS = ["#f87171", "#fb923c", "#34d399", "#60a5fa"];

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

        {/* 📈 অ্যানালিটিক্স কার্ড */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Travel Distance
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white">
                {totalDistance.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">km</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Carbon Footprint
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-orange-400">
                {totalEmissions.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400">kg CO2</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Eco-Friendly Trips
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-emerald-400">
                {ecoFriendlyTrips}
              </span>
              <span className="text-sm text-slate-400">trips</span>
            </div>
          </div>
        </div>

        {/* 🛠️ মেইন গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* বাম কলাম: ফর্ম ও পাই-চার্ট */}
          <div className="space-y-6">
            <main className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
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
                    <option value="driving">
                      🚗 Driving (Personal Vehicle)
                    </option>
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

            {/* 🥧 ফেমাস পাই-চার্ট সেকশন */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-64 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-slate-300">
                Emissions by Transport (kg)
              </h3>
              {chartData.length === 0 ? (
                <p className="text-xs text-slate-500 text-center my-auto">
                  No emission data to display.
                </p>
              ) : (
                <div className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          borderColor: "#1e293b",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        iconSize={8}
                        wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* ডান কলাম: লাইভ হিস্ট্রি টেবিল (ডিলিট বাটন সহ) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-[544px]">
            <div className="overflow-y-auto pr-1">
              <h2 className="text-xl font-semibold mb-4 text-slate-200">
                Recent Carbon History
              </h2>

              {activities.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">
                  No journey logs found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Distance</th>
                        <th className="pb-3">Emission</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {activities.map((activity) => (
                        <tr
                          key={activity._id}
                          className="hover:bg-slate-850/40 transition group"
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
                          <td className="py-3.5 text-slate-500 text-xs">
                            {new Date(activity.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </td>
                          {/* 🗑️ ডিলিট বাটন অ্যাকশন */}
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDelete(activity._id)}
                              className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 transition"
                              title="Delete log"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-emerald-500/5 text-slate-400 border border-emerald-500/10 rounded-xl text-xs flex justify-between items-center">
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
