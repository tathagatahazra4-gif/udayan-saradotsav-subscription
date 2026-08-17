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
        p-4
        md:p-5
        text-white
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-xl
        min-h-[130px]
        md:min-h-[160px]
        overflow-hidden
      `}
    >
      <div
        className={`
          grid
          ${icon
            ? "grid-cols-[minmax(0,1fr)_48px] md:grid-cols-[minmax(0,1fr)_56px]"
            : "grid-cols-1"
          }
          items-center
          gap-3
          h-full
          w-full
        `}
      >
        {/* Text Section */}

        <div className="min-w-0 overflow-visible">
          <p className="text-xs md:text-sm opacity-90 font-medium leading-snug">
            {title}
          </p>

          <h2
            className="
              mt-2
              font-bold
              leading-none
              whitespace-nowrap
              text-[clamp(1.25rem,2.1vw,2rem)]
            "
          >
            {value}
          </h2>
        </div>

        {/* Icon Section */}

        {icon && (
          <div
            className="
              shrink-0
              w-12
              h-12
              md:w-14
              md:h-14
              flex
              items-center
              justify-center
              text-2xl
              md:text-4xl
              opacity-80
            "
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}