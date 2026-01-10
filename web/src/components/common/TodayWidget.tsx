"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { LunarCalculator, WEEKDAY_NAMES } from "@/lib/lunar";
import { FengShuiRepository } from "@/lib/fengshui/FengShuiRepository";
import { DayScore } from "@/lib/fengshui/DayScore";
import { QuoteRepository } from "@/lib/quotes/QuoteRepository";
import { DayScoreCircle } from "./DayScoreCircle";

export function TodayWidget() {
  const today = useMemo(() => new Date(), []);
  const lunarDate = useMemo(() => LunarCalculator.toLunar(today), [today]);
  const yearInfo = useMemo(
    () => LunarCalculator.getYearInfo(lunarDate.year),
    [lunarDate.year]
  );
  const fengShuiData = useMemo(
    () => FengShuiRepository.getByDate(today),
    [today]
  );
  const dayScore = useMemo(() => {
    if (!fengShuiData) return null;
    return DayScore.calculate(fengShuiData);
  }, [fengShuiData]);
  const quote = useMemo(() => QuoteRepository.getQuoteOfTheDay(today), [today]);

  const weekday = WEEKDAY_NAMES[today.getDay()];
  const dateStr = format(today, "dd/MM/yyyy");

  // Get hoàng đạo hours display
  const hoangDaoDisplay = useMemo(() => {
    if (!fengShuiData?.hd) return "Đang tải...";
    return fengShuiData.hd.slice(0, 4).join(", ");
  }, [fengShuiData]);

  return (
    <Link href={`/day/${format(today, "yyyy-MM-dd")}`}>
      <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          {/* Left side - Date info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-secondary-600 bg-secondary-100 px-2 py-0.5 rounded-full">
                HÔM NAY
              </span>
            </div>

            <h3 className="text-lg font-bold text-neutral-800">{weekday}</h3>
            <p className="text-sm text-neutral-600">{dateStr}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {/* Lunar date badge */}
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                Âm lịch: {lunarDate.day}/{lunarDate.month}
              </span>

              {/* Year Can Chi */}
              <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full">
                {yearInfo.canChi.full}
              </span>
            </div>
          </div>

          {/* Right side - Day score */}
          {dayScore && (
            <div className="ml-4">
              <DayScoreCircle score={dayScore.score} size={70} />
            </div>
          )}
        </div>

        {/* Quote of the day */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <p className="text-sm text-amber-800 italic text-center">
            &ldquo;{quote.text}&rdquo;
          </p>
        </div>

        {/* Quick info row */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {/* Hoàng đạo hours */}
          <div className="bg-neutral-50 rounded-lg p-2">
            <div className="text-xs text-neutral-500 mb-1">☀️ Giờ Hoàng Đạo</div>
            <div className="text-xs font-medium text-neutral-700 truncate">
              {hoangDaoDisplay}
            </div>
          </div>

          {/* Tiết khí */}
          <div className="bg-neutral-50 rounded-lg p-2">
            <div className="text-xs text-neutral-500 mb-1">🌿 Tiết Khí</div>
            <div className="text-xs font-medium text-neutral-700">
              {fengShuiData?.tk || "—"}
            </div>
          </div>

          {/* Ngũ hành */}
          <div className="bg-neutral-50 rounded-lg p-2">
            <div className="text-xs text-neutral-500 mb-1">💧 Ngũ Hành</div>
            <div className="text-xs font-medium text-neutral-700">
              {fengShuiData?.nh || "—"}
            </div>
          </div>
        </div>

        {/* View detail hint */}
        <div className="mt-3 text-center text-xs text-neutral-400">
          Nhấn để xem chi tiết →
        </div>
      </div>
    </Link>
  );
}
