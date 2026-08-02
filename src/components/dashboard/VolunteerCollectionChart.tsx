"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

interface Props {
  data: {
    volunteer: string;
    amount: number;
    flats: number;
  }[];
}

export default function VolunteerCollectionChart({
  data,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

      <h2 className="text-xl font-bold text-blue-900 mb-6">
        Volunteer-wise Collection
      </h2>

      <div style={{ width: "100%", height: 420 }}>

        <ResponsiveContainer>

          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 90,
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="volunteer"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={110}
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="amount"
              name="Collection Amount (₹)"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}