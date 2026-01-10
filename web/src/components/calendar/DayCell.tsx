"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format, isSameDay, isToday, isSaturday, isSunday } from "date-fns";
import { LunarCalculator } from "@/lib/lunar";
import { FengShuiRepository } from "@/lib/fengshui/FengShuiRepository";
import { DayScore } from "@/lib/fengshui/DayScore";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
}

export function DayCell({ date, isCurrentMonth }: DayCellProps) {
  const lunarDate = useMemo(() => LunarCalculator.toLunar(date), [date]);
  const fengShuiData = useMemo(() => FengShuiRepository.getByDate(date), [date]);

  const dayScore = useMemo(() => {
    if (!fengShuiData) return null;
    return DayScore.calculate(fengShuiData);
  }, [fengShuiData]);

  const isCurrentDay = isToday(date);
  const isSat = isSaturday(date);
  const isSun = isSunday(date);

  // Determine text color
  const getTextColor = () => {
    if (!isCurrentMonth) return "text-neutral-300";
    if (isCurrentDay) return "text-white";
    if (isSun) return "text-danger-600";
    if (isSat) return "text-primary-600";
    return "text-neutral-800";
  };

  // Determine lunar text color
  const getLunarTextColor = () => {
    if (!isCurrentMonth) return "text-neutral-300";
    if (isCurrentDay) return "text-white/80";
    if (isSun) return "text-danger-400";
    if (isSat) return "text-primary-400";
    return "text-neutral-500";
  };

  // Format lunar date display
  const lunarDisplay = useMemo(() => {
    if (lunarDate.day === 1) {
      return `${lunarDate.day}/${lunarDate.month}`;
    }
    return lunarDate.day.toString();
  }, [lunarDate]);

  // Score indicator color
  const getScoreIndicator = () => {
    if (!dayScore || !isCurrentMonth) return null;
    const { quality } = dayScore;
    const colorMap = {
      excellent: "bg-emerald-500",
      good: "bg-lime-500",
      normal: "bg-yellow-500",
      bad: "bg-orange-500",
      very_bad: "bg-red-500",
    };
    return colorMap[quality] || "bg-gray-400";
  };

  const scoreIndicatorColor = getScoreIndicator();

  return (
    <Link
      href={`/day/${format(date, "yyyy-MM-dd")}`}
      className={`
        calendar-cell
        relative flex flex-col items-center justify-center
        min-h-[60px] sm:min-h-[70px] md:min-h-[80px]
        p-1 rounded-lg cursor-pointer
        ${isCurrentDay ? "bg-secondary-500 shadow-lg" : "hover:bg-neutral-100"}
        ${!isCurrentMonth ? "opacity-50" : ""}
      `}
    >
      {/* Solar date */}
      <span className={`text-lg sm:text-xl font-semibold ${getTextColor()}`}>
        {date.getDate()}
      </span>

      {/* Lunar date */}
      <span className={`text-xs ${getLunarTextColor()}`}>{lunarDisplay}</span>

      {/* Score indicator dot */}
      {scoreIndicatorColor && (
        <div
          className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${scoreIndicatorColor}`}
        />
      )}

      {/* Today indicator ring */}
      {isCurrentDay && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-secondary-300 ring-offset-2" />
      )}
    </Link>
  );
}
