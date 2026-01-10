"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { LunarCalculator } from "@/lib/lunar";

interface MonthHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function MonthHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: MonthHeaderProps) {
  const yearInfo = LunarCalculator.getYearInfo(currentDate.getFullYear());
  const monthName = format(currentDate, "MMMM", { locale: vi });
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-4 px-2">
      {/* Previous month button */}
      <button
        onClick={onPrevMonth}
        className="p-2 rounded-full hover:bg-white/50 transition-colors"
        aria-label="Tháng trước"
      >
        <svg
          className="w-6 h-6 text-neutral-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Month and year display */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-neutral-800 capitalize">
          {monthName} {year}
        </h2>
        <p className="text-sm text-neutral-600">
          {yearInfo.canChi.full} • {yearInfo.animalEmoji} Năm {yearInfo.animal}
        </p>
      </div>

      {/* Next month button */}
      <button
        onClick={onNextMonth}
        className="p-2 rounded-full hover:bg-white/50 transition-colors"
        aria-label="Tháng sau"
      >
        <svg
          className="w-6 h-6 text-neutral-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

    </div>
  );
}
