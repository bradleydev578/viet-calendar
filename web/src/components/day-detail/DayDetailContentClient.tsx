"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { format, isToday } from "date-fns";
import { LunarCalculator, WEEKDAY_NAMES } from "@/lib/lunar";
import { DayScore } from "@/lib/fengshui";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import { HolidayRepository, getHolidayColor } from "@/lib/holidays";
import { getMonthTheme } from "@/lib/theme";
import { TopHeader, Footer } from "@/components/layout";
// Import CalendarHeader directly to avoid tree-shaking issues with barrel exports
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { DayHeaderCard } from "./DayHeaderCard";
import { GoodHoursSection } from "./GoodHoursSection";
import { ActivitiesCard } from "./ActivitiesCard";
import { DirectionsSection } from "./DirectionsSection";
import { InfoGrid } from "./InfoGrid";
import { CalendarGridClient } from "@/components/home/CalendarGridClient";
import { createFengShuiCache, fetchFengShuiByMonth } from "@/lib/fengshui/client";

interface DayDetailContentClientProps {
  dateString: string;
  initialFengShuiData: DayFengShuiData | null;
  initialMonthData: DayFengShuiData[];
}

export function DayDetailContentClient({
  dateString,
  initialFengShuiData,
  initialMonthData,
}: DayDetailContentClientProps) {
  const date = useMemo(() => new Date(dateString), [dateString]);
  const [currentMonth, setCurrentMonth] = useState(new Date(date));

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

      // Check if we already have data for this month
      const firstDayStr = `${year}-${String(month).padStart(2, "0")}-01`;
      if (fengShuiCache.has(firstDayStr)) {
        return;
      }

      try {
        const data = await fetchFengShuiByMonth(year, month);
        fengShuiCache.setMany(data);
      } catch (error) {
        console.error("Error fetching month data:", error);
      }
    },
    [fengShuiCache]
  );

  // Effect to fetch month data when current month changes
  useEffect(() => {
    fetchMonthData(currentMonth);
  }, [currentMonth, fetchMonthData]);

  const lunarDate = useMemo(() => LunarCalculator.toLunar(date), [date]);
  const yearInfo = useMemo(
    () => LunarCalculator.getYearInfo(lunarDate.year),
    [lunarDate.year]
  );

  // Use initial data directly
  const fengShuiData = initialFengShuiData;
  const dayScore = useMemo(() => {
    if (!fengShuiData) return null;
    return DayScore.calculate(fengShuiData);
  }, [fengShuiData]);

  const monthTheme = getMonthTheme(date.getMonth() + 1);
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const isTodayDate = isToday(date);

  // Get upcoming holidays from the selected date (next 5)
  const upcomingHolidays = useMemo(() => {
    return HolidayRepository.getUpcomingFromDate(date, 5);
  }, [date]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  // Helper to get cached data for calendar
  const getCachedData = useCallback(
    (calDate: Date) => fengShuiCache.get(calDate),
    [fengShuiCache]
  );

  return (
    <div
      className="relative flex flex-col min-h-screen w-full overflow-hidden font-[Manrope] antialiased"
      style={{ backgroundColor: monthTheme.background }}
    >
      {/* Decorative blur circles */}
      <div
        className="glow-circle w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] top-[-100px] lg:top-[-150px] left-[-50px] lg:left-[-100px]"
        style={{ backgroundColor: monthTheme.blurCircle1 }}
      />
      <div
        className="glow-circle w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bottom-[-50px] lg:bottom-[-100px] right-[-50px] lg:right-[-100px]"
        style={{ backgroundColor: monthTheme.blurCircle2 }}
      />
      <div
        className="glow-circle w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] top-[30%] left-[40%] opacity-20"
        style={{ backgroundColor: monthTheme.blurCircle1 }}
      />

      {/* Top Header with Navigation */}
      <TopHeader theme={monthTheme} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 px-4 lg:px-8 flex justify-center overflow-y-auto pb-6">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            {/* Desktop: Calendar Section - Left side */}
            <div className="hidden lg:block lg:w-[380px] lg:flex-shrink-0">
              <div className="flex justify-center py-4">
                <CalendarHeader
                  currentDate={currentMonth}
                  theme={monthTheme}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onToday={handleToday}
                />
              </div>
              <CalendarGridClient
                currentDate={currentMonth}
                selectedDate={date}
                theme={monthTheme}
                getCachedData={getCachedData}
              />

              {/* Upcoming Holidays Section - Below calendar (Desktop) */}
              {upcomingHolidays.length > 0 && (
                <div className="mt-4 glass-panel-light dark:glass-panel-dark rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-500 dark:text-[#9cbab2] mb-4 uppercase tracking-widest">
                    Sắp tới
                  </h3>
                  <div className="flex flex-col gap-3">
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
                          className="flex items-center gap-3 hover:bg-white/50 rounded-lg p-2 -mx-2 transition-colors"
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                            style={{
                              backgroundColor: `${holidayColor}20`,
                              color: holidayColor,
                            }}
                          >
                            {format(holiday.startDate, "d/M")}
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-sm font-bold"
                              style={{ color: "#1e293b" }}
                            >
                              {holiday.name}
                            </p>
                            <p className="text-xs" style={{ color: "#64748b" }}>
                              {holiday.daysUntil} ngày nữa
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Day Detail Section - Right side on desktop, First on mobile */}
            <div className="flex-1 max-w-2xl">
              {/* Today badge */}
              {isTodayDate && (
                <div className="flex justify-center mb-4">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-white text-sm font-medium rounded-full"
                    style={{ backgroundColor: monthTheme.primaryAccent }}
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    HÔM NAY
                  </span>
                </div>
              )}

              {/* Header Card */}
              <DayHeaderCard
                date={date}
                lunarDate={lunarDate}
                yearInfo={yearInfo}
                fengShuiData={fengShuiData}
                dayScore={dayScore}
                monthTheme={monthTheme}
              />

              {/* Good Hours Section */}
              {fengShuiData && (
                <GoodHoursSection
                  hoangDaoHours={fengShuiData.hd}
                  theme={monthTheme}
                />
              )}

              {/* Activities Cards */}
              {fengShuiData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <ActivitiesCard
                    title="Việc Nên Làm"
                    activities={fengShuiData.ga}
                    type="good"
                  />
                  <ActivitiesCard
                    title="Việc Không Nên"
                    activities={fengShuiData.ba}
                    type="bad"
                  />
                </div>
              )}

              {/* Directions Section */}
              {fengShuiData && fengShuiData.dir && (
                <DirectionsSection
                  directions={fengShuiData.dir}
                  theme={monthTheme}
                />
              )}

              {/* Info Grid */}
              {fengShuiData && (
                <InfoGrid fengShuiData={fengShuiData} theme={monthTheme} />
              )}

              {/* Navigation to prev/next day */}
              <div className="flex justify-between mt-8">
                <Link
                  href={`/day/${format(
                    new Date(date.getTime() - 86400000),
                    "yyyy-MM-dd"
                  )}`}
                  className="px-4 py-2 bg-white/80 rounded-xl hover:bg-white transition-colors text-slate-700 font-medium shadow-sm"
                >
                  ← Ngày trước
                </Link>
                <Link
                  href={`/day/${format(
                    new Date(date.getTime() + 86400000),
                    "yyyy-MM-dd"
                  )}`}
                  className="px-4 py-2 bg-white/80 rounded-xl hover:bg-white transition-colors text-slate-700 font-medium shadow-sm"
                >
                  Ngày sau →
                </Link>
              </div>

              {/* Mobile: Calendar + Upcoming after day details */}
              <div className="lg:hidden mt-8">
                <div className="flex justify-center py-4">
                  <CalendarHeader
                    currentDate={currentMonth}
                    theme={monthTheme}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onToday={handleToday}
                  />
                </div>
                <CalendarGridClient
                  currentDate={currentMonth}
                  selectedDate={date}
                  theme={monthTheme}
                  getCachedData={getCachedData}
                />

                {/* Upcoming Holidays Section - Mobile */}
                {upcomingHolidays.length > 0 && (
                  <div className="mt-4 glass-panel-light rounded-xl p-4 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-widest">
                      Sắp tới
                    </h3>
                    <div className="flex flex-col gap-3">
                      {upcomingHolidays.map((holiday) => {
                        const holidayColor = getHolidayColor(
                          holiday.category,
                          holiday.type,
                          holiday.isImportant
                        );
                        return (
                          <Link
                            key={holiday.id}
                            href={`/day/${format(
                              holiday.startDate,
                              "yyyy-MM-dd"
                            )}`}
                            className="flex items-center gap-3 hover:bg-white/50 rounded-lg p-2 -mx-2 transition-colors"
                          >
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                              style={{
                                backgroundColor: `${holidayColor}20`,
                                color: holidayColor,
                              }}
                            >
                              {format(holiday.startDate, "d/M")}
                            </div>
                            <div className="flex-1">
                              <p
                                className="text-sm font-bold"
                                style={{ color: "#1e293b" }}
                              >
                                {holiday.name}
                              </p>
                              <p
                                className="text-xs"
                                style={{ color: "#64748b" }}
                              >
                                {holiday.daysUntil} ngày nữa
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
