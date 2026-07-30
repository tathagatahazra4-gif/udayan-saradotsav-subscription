"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  color: string;
  icon?: ReactNode;
}

export default function StatCard({
  title,
  value,
  color,
  icon,
}: Props) {
  return (
    <div
      className={`${color} rounded-2xl shadow-lg p-6 text-white transition-transform duration-300 hover:scale-105`}
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-sm opacity-90">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div className="text-4xl opacity-80">
          {icon}
        </div>

      </div>
    </div>
  );
}