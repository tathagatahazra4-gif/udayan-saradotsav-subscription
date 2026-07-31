"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#16a34a", "#ef4444"];

const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, name } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill={name === "Paid"? "#16a34a" : "#ef4444"} textAnchor={x > cx? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CollectionCharts({ stats }: { stats: any }) {
  const pieData = [
    { name: "Paid", value: Number(stats?.paidFlats) || 0 },
    { name: "Pending", value: Number(stats?.pendingFlats) || 0 },
  ];
  const barData = [
    { name: "Total", Amount: Number(stats?.totalCollection) || 0 },
    { name: "Today", Amount: Number(stats?.todaysCollection) || 0 },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="w-full">
        <h3 className="font-semibold text-center mb-4">Paid vs Pending Flats</h3>
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, bottom: 40, left: 80, right: 80 }}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={renderCustomLabel} labelLine={true}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full mt-42">
        <h3 className="font-semibold text-center mb-4">Collection Overview</h3>
        {/* TALLER - NO WHITE SPACE BELOW */}
        <div style={{ width: "100%", height: 900 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Amount" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={70} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}