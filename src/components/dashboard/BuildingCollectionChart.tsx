"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: any[];
}

export default function BuildingCollectionChart({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Building-wise Collection
      </h2>

      <ResponsiveContainer
        width="100%"
        height={450}
      >
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="building" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="collection"
            fill="#16a34a"
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}