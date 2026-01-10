"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { LunarDate, YearInfo } from "@/lib/lunar";
import type { DayFengShuiData, DayScoreResult } from "@/lib/fengshui";
import type { MonthTheme } from "@/lib/theme";
import { DayScoreCircle } from "@/components/common/DayScoreCircle";
import { WEEKDAY_NAMES } from "@/lib/lunar";

interface DayHeaderCardProps {
  date: Date;
  lunarDate: LunarDate;
  yearInfo: YearInfo;
  fengShuiData: DayFengShuiData | null;
  dayScore: DayScoreResult | null;
  monthTheme: MonthTheme;
}

export function DayHeaderCard({
  date,
  lunarDate,
  yearInfo,
  fengShuiData,
  dayScore,
  monthTheme,
}: DayHeaderCardProps) {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const monthName = format(date, "MMMM", { locale: vi });

  // Determine if it's a good day based on 12 Trực
  const isGoodDay = fengShuiData?.t12g === 1;

  return (
    <div
      className="rounded-2xl p-6 text-white shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${monthTheme.primaryAccent}dd, ${monthTheme.primaryAccent})`,
      }}
    >
      <div className="flex items-start justify-between">
        {/* Left side - Solar date */}
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90 tracking-wider uppercase">
            {weekday}
          </p>
          <p className="text-7xl font-bold leading-none mt-1">
            {date.getDate()}
          </p>
          <p className="text-lg opacity-90 mt-1 capitalize">
            {monthName}, {date.getFullYear()}
          </p>

          {/* Can Chi badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {fengShuiData?.dgz && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Ngày {fengShuiData.dgz}
              </span>
            )}
            {fengShuiData?.mgz && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Tháng {fengShuiData.mgz}
              </span>
            )}
          </div>
        </div>

        {/* Right side - Lunar info & Score */}
        <div className="flex flex-col items-end">
          {/* Day score */}
          {dayScore && (
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <DayScoreCircle score={dayScore.score} size={80} />
            </div>
          )}

          {/* Lunar date */}
          <div className="mt-3 text-right">
            <p className="text-sm opacity-80">Âm lịch</p>
            <p className="text-xl font-bold">
              {lunarDate.day}/{lunarDate.month}
            </p>
            <p className="text-sm opacity-80">{yearInfo.canChi.full}</p>
          </div>
        </div>
      </div>

      {/* Day type badge */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            isGoodDay
              ? "bg-emerald-400/30 text-emerald-100"
              : "bg-orange-400/30 text-orange-100"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isGoodDay ? "bg-emerald-300" : "bg-orange-300"
            }`}
          />
          {isGoodDay ? "Ngày Hoàng Đạo" : "Ngày Hắc Đạo"} • {fengShuiData?.t12}
        </span>
      </div>
    </div>
  );
}
