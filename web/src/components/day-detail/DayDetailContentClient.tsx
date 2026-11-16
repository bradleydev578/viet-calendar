"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isToday } from "date-fns";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import { UniversalDayCalculator } from "@/lib/fengshui/UniversalDayCalculator";
import { HolidayRepository, getHolidayColor } from "@/lib/holidays";
import { getMonthTheme } from "@/lib/theme";
import { parseDateString, formatDateString } from "@/lib/date-utils";
import { TopHeader, Footer } from "@/components/layout";
import { DayDetailSections } from "./DayDetailSections";
import { CalendarGridClient } from "@/components/home/CalendarGridClient";
import { WallCalendarBloc } from "@/components/home/WallCalendarBloc";
import { createFengShuiCache, fetchFengShuiByMonth } from "@/lib/fengshui/client";

interface DayDetailContentClientProps {
  dateString: string;
  initialFengShuiData: DayFengShuiData | null;
  initialMonthData: DayFengShuiData[];
  initialQuote?: string;
}

export function DayDetailContentClient({
  dateString,
  initialFengShuiData,
  initialMonthData,
  initialQuote,
}: DayDetailContentClientProps) {
  const router = useRouter();
  const date = useMemo(
    () => parseDateString(dateString) || new Date(),
    [dateString]
  );
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0)
  );
  const [copied, setCopied] = useState(false);
  const [, setCacheVersion] = useState(0);

  // Sync currentMonth when route dateString changes
  useEffect(() => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0));
  }, [date]);

  // Cache for feng shui data
  const fengShuiCache = useMemo(() => {
    const cache = createFengShuiCache();
    if (initialFengShuiData) {
      cache.set(initialFengShuiData);
    }
    cache.setMany(initialMonthData);
    return cache;
  }, [initialFengShuiData, initialMonthData]);

  // Fetch month data when month changes
  const fetchMonthData = useCallback(
    async (monthDate: Date) => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth() + 1;

      const firstDayStr = `${year}-${String(month).padStart(2, "0")}-01`;
      if (fengShuiCache.has(firstDayStr)) {
        return;
      }

      try {
        const data = await fetchFengShuiByMonth(year, month);
        fengShuiCache.setMany(data);
        setCacheVersion((v) => v + 1);
      } catch (error) {
        console.error("Error fetching month data:", error);
      }
    },
    [fengShuiCache]
  );

  useEffect(() => {
    fetchMonthData(currentMonth);
  }, [currentMonth, fetchMonthData]);

  // Ensure we always have fengShuiData even if outside static JSON years
  const fengShuiData = useMemo(
    () => initialFengShuiData || UniversalDayCalculator.calculate(date),
    [initialFengShuiData, date]
  );

  const monthTheme = getMonthTheme(date.getMonth() + 1);
  const isTodayDate = isToday(date);
  const todayStr = formatDateString(new Date());

  const prevDate = useMemo(
    () =>
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - 1,
        12,
        0,
        0
      ),
    [date]
  );
  const nextDate = useMemo(
    () =>
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
        12,
        0,
        0
      ),
    [date]
  );

  // Get upcoming holidays from the selected date (next 5)
  const upcomingHolidays = useMemo(() => {
    return HolidayRepository.getUpcomingFromDate(date, 5);
  }, [date]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1,
        12,
        0,
        0
      )
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1,
        12,
        0,
        0
      )
    );
  };

  const handleSelectMonth = (monthNum: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), monthNum - 1, 1, 12, 0, 0)
    );
  };

  const handleSelectYear = (yearNum: number) => {
    setCurrentMonth(
      new Date(yearNum, currentMonth.getMonth(), 1, 12, 0, 0)
    );
  };

  const handleToday = () => {
    const now = new Date();
    const targetStr = formatDateString(now);
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1, 12, 0, 0));
    if (targetStr !== dateString) {
      router.push(`/day/${targetStr}`);
    }
  };

  const handleDateJump = (nextVal: string) => {
    if (parseDateString(nextVal) && nextVal !== dateString) {
      router.push(`/day/${nextVal}`);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const getCachedData = useCallback(
    (calDate: Date) =>
      fengShuiCache.get(calDate) || UniversalDayCalculator.calculate(calDate),
    [fengShuiCache]
  );

  return (
    <div
      className="relative flex flex-col min-h-dvh w-full overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: monthTheme.background }}
    >
      {/* Decorative seasonal ambient glow circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-28 -left-28 w-[480px] h-[480px] rounded-full blur-[110px] opacity-40"
          style={{ backgroundColor: monthTheme.blurCircle1 }}
        />
        <div
          className="absolute top-1/3 -right-28 w-[420px] h-[420px] rounded-full blur-[110px] opacity-35"
          style={{ backgroundColor: monthTheme.blurCircle2 }}
        />
      </div>

      {/* Top Header with Navigation */}
      <TopHeader theme={monthTheme} monthNumber={date.getMonth() + 1} />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 space-y-5">
        {/* Top Breadcrumb & Quick Day Switcher Bar */}
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl px-4 py-2.5 border border-white/80 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 flex-wrap">
            <Link
              href="/"
              className="hover:text-slate-900 flex items-center gap-1"
            >
              ← Trang chủ Lịch Treo Tường
            </Link>
            <span className="text-slate-300">/</span>
            <span
              className="font-extrabold"
              style={{ color: monthTheme.primaryAccent }}
            >
              Chi tiết ngày {format(date, "dd/MM/yyyy")}
            </span>
            {isTodayDate && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 text-white text-[10px] font-extrabold rounded-full"
                style={{ backgroundColor: monthTheme.primaryAccent }}
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                HÔM NAY
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold flex-wrap">
            <Link
              href={`/day/${format(prevDate, "yyyy-MM-dd")}`}
              prefetch={false}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
            >
              ← Ngày {format(prevDate, "dd/MM")}
            </Link>
            {!isTodayDate && (
              <Link
                href={`/day/${todayStr}`}
                prefetch={false}
                className="px-3 py-1.5 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: monthTheme.primaryAccent }}
              >
                Hôm nay
              </Link>
            )}
            <Link
              href={`/day/${format(nextDate, "yyyy-MM-dd")}`}
              prefetch={false}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
            >
              Ngày {format(nextDate, "dd/MM")} →
            </Link>
            <label className="sr-only" htmlFor="day-detail-date-jump">
              Chọn ngày khác
            </label>
            <input
              id="day-detail-date-jump"
              type="date"
              min="1900-01-01"
              max="2100-12-31"
              value={dateString}
              onChange={(e) => handleDateJump(e.target.value)}
              aria-label="Chọn ngày khác"
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold border border-slate-200/70 focus:outline-none cursor-pointer"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? "✓ Đã chép" : "🔗 Chép link"}
            </button>
          </div>
        </div>

        {/* ========================================================
            DETAIL-FIRST MAIN ROW:
            Left 4 Cols (Sticky Wall Calendar Bloc) + Right 8 Cols (Full Detailed Analysis Above-the-fold)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-5">
            <WallCalendarBloc
              selectedDate={date}
              theme={monthTheme}
              fengShuiData={fengShuiData}
              quote={initialQuote}
              showDetailLink={false}
              isMainHeading
            />
          </div>

          <div className="lg:col-span-8">
            <DayDetailSections
              fengShuiData={fengShuiData}
              theme={monthTheme}
              isTodayDate={isTodayDate}
              hoursSectionId="gio-hoang-dao"
            />
          </div>
        </div>

        {/* ========================================================
            LOWER EXPLORATION ROW:
            Left 8 Cols (Month Calendar Board) + Right 4 Cols (Upcoming Holidays & Tools)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8">
            <CalendarGridClient
              currentDate={currentMonth}
              selectedDate={date}
              theme={monthTheme}
              getCachedData={getCachedData}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              onSelectMonth={handleSelectMonth}
              onSelectYear={handleSelectYear}
            />
          </div>

          {/* Right 4 Cols: Upcoming Holidays & Quick Tools */}
          <div className="lg:col-span-4 space-y-5">
            {upcomingHolidays.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                    🎉 Sự kiện & Ngày lễ sắp tới
                  </h3>
                  <Link
                    href="/holidays"
                    className="text-xs font-bold hover:underline"
                    style={{ color: monthTheme.primaryAccent }}
                  >
                    Tất cả →
                  </Link>
                </div>
                <div className="flex flex-col gap-2.5">
                  {upcomingHolidays.map((holiday) => {
                    const holidayColor = getHolidayColor(
                      holiday.category,
                      holiday.type,
                      holiday.isImportant
                    );
                    return (
                      <Link
                        key={holiday.id}
                        href={`/day/${format(holiday.startDate, "yyyy-MM-dd")}`}
                        prefetch={false}
                        className="flex items-center gap-3 bg-slate-50/90 hover:bg-white rounded-2xl p-2.5 border border-slate-200/60 transition-colors"
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs"
                          style={{
                            backgroundColor: `${holidayColor}20`,
                            color: holidayColor,
                          }}
                        >
                          {format(holiday.startDate, "d/M")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-slate-800 truncate">
                            {holiday.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {holiday.daysUntil === 0
                              ? "Hôm nay"
                              : `${holiday.daysUntil} ngày nữa`}
                            {holiday.vacationBadge
                              ? ` • ${holiday.vacationBadge}`
                              : ""}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Tool Links Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-lg space-y-3">
              <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                🧭 Tiện ích Lịch Việt Vạn Sự
              </h3>
              <Link
                href="/doi-ngay-am-duong"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors"
              >
                <div className="text-xs font-extrabold text-slate-800">
                  🔄 Đổi Ngày Âm Dương (1900–2100)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Chuyển đổi nhanh Dương lịch ↔ Âm lịch & Can Chi
                </div>
              </Link>
              <Link
                href="/xem-ngay-tot"
                className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors"
              >
                <div className="text-xs font-extrabold text-slate-800">
                  ✨ Xem Ngày Tốt Hợp Tuổi
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Chọn ngày lành cho cưới hỏi, khai trương, động thổ
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Global V2 Footer */}
      <Footer />
    </div>
  );
}
