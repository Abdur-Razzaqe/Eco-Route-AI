"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardStats() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // মডেলের enum এর সাথে মিল রেখে ডিফল্ট স্টেট 'driving'
  const [transportType, setTransportType] = useState("driving");
  const [distance, setDistance] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
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
          userName: user?.displayName || "Anonymous User", // <-- ফায়ারবেস থেকে ইউজারের নাম পাঠানো হচ্ছে
          userEmail: user?.email, // <-- ফায়ারবেস থেকে ইউজারের ইমেইল পাঠানো হচ্ছে
          transportType,
          distance: Number(distance),
        }),
      });

      const result = await response.json();
      if (result.success) {
        // মডেলের নতুন ফিল্ড carbonEmission রিড করা হচ্ছে
        setMessage(
          `🌱 Success! Generated ${result.data.carbonEmission} kg of CO2.`,
        );
        setDistance(""); // ফর্ম রিসেট
      } else {
        setMessage("❌ Something went wrong.");
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Eco-Route Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Welcome, {user.displayName || user.email}!
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl border border-red-500/20 transition duration-200"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-slate-200">
                AI Carbon Tracking
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your journey data is strictly validated against your custom
                schema rules. Walking and Bicycling have absolutely zero carbon
                impact!
              </p>
            </div>
            <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs">
              🔒 <b>Mongoose Schema Guard active:</b> Timestamps will
              automatically manage your userName, userEmail, and activity
              records.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
