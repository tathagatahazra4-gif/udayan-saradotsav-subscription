"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props {
  stats: any;
}

export default function CollectionCharts({ stats }: Props) {
  const pieData = [
    {
      name: "Paid",
      value: stats.paidFlats,
    },
    {
      name: "Pending",
      value: stats.pendingFlats,
    },
  ];

  const barData = [
    {
      name: "Collection",
      Amount: stats.totalCollection,
    },
    {
      name: "Today",
      Amount: stats.todaysCollection,
    },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

      {/* Pie Chart */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-4">
          Paid vs Pending Flats
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* Bar Chart */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-4">
          Collection Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={barData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Amount"
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}