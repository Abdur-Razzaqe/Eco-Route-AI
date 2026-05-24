"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface EmissionChartProps {
  data: Array<{
    transportType: string;
    distance: number;
  }>;
}

export default function EmissionPieChart({ data }: EmissionChartProps) {
  const emissionFactors: { [key: string]: number } = {
    driving: 0.21,
    transit: 0.05,
    walking: 0,
    cycling: 0,
  };

  const transportLabels: { [key: string]: string } = {
    driving: "Car",
    transit: "Transit",
    walking: "Walking",
    cycling: "Cycling",
  };

  // Calculate emissions by transport type
  const chartData = data.reduce((acc: any[], activity) => {
    const existing = acc.find((item) => item.name === activity.transportType);
    const emissions =
      activity.distance * (emissionFactors[activity.transportType] || 0);

    if (existing) {
      existing.value += emissions;
      existing.distance += activity.distance;
    } else {
      acc.push({
        name: transportLabels[activity.transportType] || activity.transportType,
        value: emissions,
        distance: activity.distance,
      });
    }
    return acc;
  }, []);

  const COLORS = ["#f97316", "#10b981", "#3b82f6", "#a855f7"];

  if (chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <p className="text-slate-500 text-sm">No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          // 🛠️ ফিক্সড কোড (যা TypeScript-কে শান্ত করবে):
          label={({ name, percent = 0 }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [
            `${value.toFixed(2)} kg CO₂`,
            "Emissions",
          ]}
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
