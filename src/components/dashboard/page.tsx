"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.uid) return;
      const res = await fetch(`/api/activity?userId=${user.uid}`);
      const result = await res.json();
      if (result.success) setActivities(result.data);
    };
    fetchActivities();
  }, [user]);

  const totalDistance = activities.reduce(
    (sum, item) => sum + (item.distance || 0),
    0,
  );
  const totalEmissions = activities.reduce(
    (sum, item) => sum + (item.carbonEmission || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">System Overview</h1>
        <p className="text-slate-400 text-sm">
          Real-time sustainability metrics for your profile.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Total Distance
          </p>
          <p className="text-3xl font-bold text-white mt-2">
            {totalDistance.toFixed(1)} km
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Carbon Footprint
          </p>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {totalEmissions.toFixed(2)} kg
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Eco Score
          </p>
          <p className="text-3xl font-bold text-emerald-500 mt-2">A+</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl h-64 flex items-center justify-center">
        <p className="text-slate-500 italic text-sm">
          Pie Chart and detailed stats will appear here...
        </p>
      </div>
    </div>
  );
}
