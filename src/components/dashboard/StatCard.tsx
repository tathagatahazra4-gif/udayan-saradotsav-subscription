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
      className={`
        ${color}
        rounded-2xl
        shadow-lg
        p-4 md:p-6
        text-white
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-xl
        min-h-[130px]
        md:min-h-[160px]
        flex
        items-center
      `}
    >
      <div className="flex justify-between items-center w-full">

        <div className="flex-1">

          <p className="text-xs md:text-sm opacity-90 font-medium">
            {title}
          </p>

          <h2 className="text-2xl md:text-4xl font-bold mt-2 break-words">
            {value}
          </h2>

        </div>

        {icon && (
          <div className="text-3xl md:text-5xl opacity-80 ml-4 shrink-0">
            {icon}
          </div>
        )}

      </div>
    </div>
  );
}