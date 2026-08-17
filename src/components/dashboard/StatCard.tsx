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
        md:p-6
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
          flex
          items-center
          justify-between
          gap-4
          h-full
        `}
      >
        {/* Text Section */}

        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm opacity-90 font-medium leading-snug">
            {title}
          </p>

          <h2
            className="
              mt-2
              text-xl
              sm:text-2xl
              md:text-3xl
              xl:text-4xl
              font-bold
              leading-none
              whitespace-nowrap
              overflow-hidden
              text-ellipsis
            "
          >
            {value}
          </h2>
        </div>

        {/* Icon Section */}

        {icon && (
          <div
            className="
              flex-shrink-0
              w-10
              h-10
              sm:w-12
              sm:h-12
              md:w-14
              md:h-14
              flex
              items-center
              justify-center
              text-2xl
              sm:text-3xl
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