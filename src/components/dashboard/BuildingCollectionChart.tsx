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

export default function BuildingCollectionChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  // Sort and show only top 15 with collection, or all if collection is 0
  const hasCollection = data.some((d: any) => d.collection > 0);

  // If collection is 0 for all, show Paid count instead
  const dataKey = hasCollection? "collection" : "paid";
  const label = hasCollection? "Collection" : "Paid Flats";

  // Height grows with number of buildings - no more overlap
  const chartHeight = Math.max(350, data.length * 32);

  return (
    <div className="w-full">
      <p className="text-xs text-gray-500 mb-2">
        Showing {data.length} buildings - {label}
      </p>
      <div className="w-full overflow-y-auto max-h- pr-2">
        <div style={{ height: `${chartHeight}px`, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="building"
                type="category"
                width={65}
                tick={{ fontSize: 11, fontWeight: 600 }}
                interval={0}
              />
              <Tooltip formatter={(v: any) => hasCollection? `₹${v}` : `${v} flats`} />
              <Bar
                dataKey={dataKey}
                fill={hasCollection? "#16a34a" : "#2563eb"}
                radius={[0, 8, 8, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}