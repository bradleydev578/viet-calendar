"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { getMonthTheme, type MonthTheme } from "@/lib/theme";
import { Footer } from "@/components/layout";
import { InfoSections } from "@/components/home/InfoSections";
import { HolidayRepository, getHolidayColor } from "@/lib/holidays";
import { LunarCalculator, WEEKDAY_NAMES, GIO_DIA_CHI, CON_GIAP } from "@/lib/lunar";
import { parseDateString, formatDateString } from "@/lib/date-utils";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import { UniversalDayCalculator } from "@/lib/fengshui/UniversalDayCalculator";
import { fetchFengShuiByDate, fetchFengShuiByMonth, createFengShuiCache } from "@/lib/fengshui/client";
import { MaterialIcon } from "@/components/common";

import { TopHeaderV1 } from "./TopHeaderV1";
import { CalendarHeaderV1 } from "./CalendarHeaderV1";
import { CalendarGridClientV1 } from "./CalendarGridClientV1";
import { DayDetailPanelClientV1 } from "./DayDetailPanelClientV1";

interface HomeClientV1Props {
  initialFengShuiData: DayFengShuiData | null;
  initialMonthData: DayFengShuiData[];
  initialQuote: string;
  initialDate: string;
}

export function HomeClientV1({
  initialFengShuiData,
  initialMonthData,
  initialQuote,
  initialDate,
}: HomeClientV1Props) {
  const initialParsedDate = useMemo(
    () => parseDateString(initialDate) || new Date(),
    [initialDate]
  );

  const [currentDate, setCurrentDate] = useState<Date>(initialParsedDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialParsedDate);
  const [, setCacheVersion] = useState(0);

  const fengShuiCache = useMemo(() => {
    const cache = createFengShuiCache();
    if (initialFengShuiData) {
      cache.set(initialFengShuiData);
    }
    cache.setMany(initialMonthData);
    return cache;
  }, [initialFengShuiData, initialMonthData]);

  const [fengShuiData, setFengShuiData] = useState<DayFengShuiData | null>(
    initialFengShuiData
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clientToday = new Date();
    if (formatDateString(clientToday) !== formatDateString(initialParsedDate)) {
      setCurrentDate(clientToday);
      setSelectedDate(clientToday);
    }
  }, [initialParsedDate]);

  const theme = useMemo(
    () => getMonthTheme(currentDate.getMonth() + 1),
    [currentDate]
  );

  const upcomingHolidays = useMemo(() => {
    return HolidayRepository.getUpcomingFromDate(selectedDate, 5);
  }, [selectedDate]);

  const fetchDataForDate = useCallback(
    async (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const cached = fengShuiCache.get(dateStr);
      if (cached) {
        setFengShuiData(cached);
        setIsLoading(false);
        return;
      }

      const computed = UniversalDayCalculator.calculate(date);
      setFengShuiData(computed);
      setIsLoading(false);

      try {
        const data = await fetchFengShuiByDate(date);
        if (data) {
          fengShuiCache.set(data);
          setFengShuiData(data);
        }
      } catch {
        // Keep computed data on error
      }
    },
    [fengShuiCache]
  );

  const fetchMonthData = useCallback(
    async (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

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
    fetchDataForDate(selectedDate);
  }, [selectedDate, fetchDataForDate]);

  useEffect(() => {
    fetchMonthData(currentDate);
  }, [currentDate, fetchMonthData]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1, 12, 0, 0)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1, 12, 0, 0)
    );
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    if (
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0));
    }
  };

  const getCachedData = useCallback(
    (date: Date) => fengShuiCache.get(date) || UniversalDayCalculator.calculate(date),
    [fengShuiCache]
  );

  return (
    <div
      className="relative flex flex-col min-h-dvh lg:h-dvh w-full overflow-hidden font-[Manrope] antialiased"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="glow-circle w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] top-[-100px] lg:top-[-150px] left-[-50px] lg:left-[-100px]"
        style={{ backgroundColor: theme.blurCircle1 }}
      />
      <div
        className="glow-circle w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bottom-[-50px] lg:bottom-[-100px] right-[-50px] lg:right-[-100px]"
        style={{ backgroundColor: theme.blurCircle2 }}
      />
      <div
        className="glow-circle w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] top-[30%] left-[40%] opacity-20"
        style={{ backgroundColor: theme.blurCircle1 }}
      />

      <TopHeaderV1 theme={theme} />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 px-4 lg:px-8 flex flex-col overflow-y-auto pb-6">
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
            <div className="lg:flex-[1.6] lg:max-w-[700px]">
              <div className="py-4 flex justify-center">
                <CalendarHeaderV1
                  currentDate={currentDate}
                  theme={theme}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onToday={handleToday}
                  onSelectDate={handleSelectDate}
                  isMainHeading
                />
              </div>

              <CalendarGridClientV1
                currentDate={currentDate}
                selectedDate={selectedDate}
                theme={theme}
                onSelectDate={handleSelectDate}
                getCachedData={getCachedData}
              />

              <div className="lg:hidden">
                <div className="flex items-center justify-center py-4">
                  <button
                    type="button"
                    onClick={handleToday}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-95 hover:shadow-md"
                    style={{
                      backgroundColor: `${theme.primaryAccent}10`,
                      borderColor: `${theme.primaryAccent}30`,
                      color: theme.primaryAccent,
                    }}
                  >
                    <MaterialIcon name="today" className="text-[18px]" />
                    <span className="text-xs font-bold">Hôm nay</span>
                  </button>
                </div>

                <div className="mt-2">
                  <MobileDayDetailV1
                    selectedDate={selectedDate}
                    theme={theme}
                    fengShuiData={fengShuiData}
                    isLoading={isLoading}
                  />
                </div>

                {upcomingHolidays.length > 0 && (
                  <div className="mt-2 glass-panel-light rounded-xl p-4 shadow-sm">
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
                            href={`/day/${format(holiday.startDate, "yyyy-MM-dd")}`}
                            prefetch={false}
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
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-bold truncate"
                                style={{ color: "#1e293b" }}
                              >
                                {holiday.name}
                              </p>
                              <p className="text-xs" style={{ color: "#64748b" }}>
                                {holiday.daysUntil} ngày nữa
                                {holiday.vacationBadge ? ` • ${holiday.vacationBadge}` : ""}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4 px-2">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50">
                    <MaterialIcon
                      name="format_quote"
                      className="text-lg"
                      style={{ color: theme.accentGold }}
                    />
                    <p className="text-sm text-slate-600 italic leading-relaxed text-center">
                      &ldquo;{initialQuote}&rdquo;
                    </p>
                  </div>
                </div>

                <InfoSections theme={theme} />
              </div>

              <div className="hidden lg:block">
                <div className="mt-4 px-2">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50">
                    <MaterialIcon
                      name="format_quote"
                      className="text-lg"
                      style={{ color: theme.accentGold }}
                    />
                    <p className="text-sm text-slate-600 italic leading-relaxed text-center">
                      &ldquo;{initialQuote}&rdquo;
                    </p>
                  </div>
                </div>

                <InfoSections theme={theme} />
              </div>
            </div>

            <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:min-w-[340px] lg:max-w-[400px]">
              <div className="flex items-center justify-center py-4">
                <button
                  type="button"
                  onClick={handleToday}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all active:scale-95 hover:shadow-md"
                  style={{
                    backgroundColor: `${theme.primaryAccent}10`,
                    borderColor: `${theme.primaryAccent}30`,
                    color: theme.primaryAccent,
                  }}
                >
                  <MaterialIcon name="today" className="text-[18px]" />
                  <span className="text-xs font-bold">Hôm nay</span>
                </button>
              </div>

              <DayDetailPanelClientV1
                selectedDate={selectedDate}
                theme={theme}
                fengShuiData={fengShuiData}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

interface MobileDayDetailV1Props {
  selectedDate: Date;
  theme: MonthTheme;
  fengShuiData: DayFengShuiData | null;
  isLoading: boolean;
}

function MobileDayDetailV1({
  selectedDate,
  theme,
  fengShuiData,
  isLoading,
}: MobileDayDetailV1Props) {
  const lunarDate = useMemo(
    () => LunarCalculator.toLunar(selectedDate),
    [selectedDate]
  );
  const yearInfo = useMemo(
    () => LunarCalculator.getYearInfo(lunarDate.year),
    [lunarDate.year]
  );

  const weekday = WEEKDAY_NAMES[selectedDate.getDay()];
  const isHoangDao = fengShuiData?.t12g === 1;
  const selectedDateHolidays = useMemo(
    () => HolidayRepository.getByDate(selectedDate),
    [selectedDate]
  );

  const hoangDaoHours = useMemo(() => {
    if (!fengShuiData?.hd) return [];
    return GIO_DIA_CHI.filter((gio) => fengShuiData.hd.includes(gio.chi)).map(
      (gio) => ({
        ...gio,
        emoji:
          CON_GIAP[GIO_DIA_CHI.findIndex((g) => g.chi === gio.chi)]?.emoji ||
          "🐉",
      })
    );
  }, [fengShuiData]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="glass-panel-light rounded-2xl p-5 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/day/${format(selectedDate, "yyyy-MM-dd")}`} prefetch={false}>
        <div
          className="glass-panel-light rounded-2xl p-5 relative overflow-hidden group shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          style={{ borderColor: `${theme.primaryAccent}15` }}
        >
          <div
            className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl"
            style={{ backgroundColor: `${theme.primaryAccent}15` }}
          />

          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: isHoangDao
                      ? `${theme.accentGold}20`
                      : "rgba(100,100,100,0.15)",
                    color: isHoangDao ? theme.accentGold : "#475569",
                  }}
                >
                  ★ {isHoangDao ? "HOÀNG ĐẠO" : "HẮC ĐẠO"}
                </span>
              </div>
              <p
                className="text-lg font-bold mb-1"
                style={{ color: theme.primaryAccent }}
              >
                {weekday}
              </p>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                {selectedDate.getDate()}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
                Âm lịch
              </div>
              <div
                className="text-2xl font-black"
                style={{ color: theme.accentGold }}
              >
                {lunarDate.day}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-wide mt-1 uppercase">
                Tháng {lunarDate.month}
              </div>
            </div>
          </div>

          <div
            className="space-y-3 border-t pt-4"
            style={{ borderColor: `${theme.primaryAccent}20` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.accentGold }}
              />
              <p className="text-sm text-slate-600">
                Ngày{" "}
                <span className="font-black text-slate-800">
                  {fengShuiData?.dgz || "—"}
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `${theme.primaryAccent}60` }}
                />
                <p className="text-sm text-slate-500">
                  Tháng{" "}
                  <span className="font-bold text-slate-700">
                    {fengShuiData?.mgz || "—"}
                  </span>{" "}
                  • Năm{" "}
                  <span className="font-bold text-slate-700">
                    {yearInfo.canChi.full}
                  </span>
                </p>
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: theme.primaryAccent }}
              >
                Chi tiết →
              </span>
            </div>

            {selectedDateHolidays.length > 0 && (
              <div className="pt-2 space-y-1.5">
                {selectedDateHolidays.map((h) => (
                  <div
                    key={h.id}
                    className="flex flex-col gap-0.5 px-3 py-2 rounded-xl bg-red-50/90 border border-red-100"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-red-700">
                        🎉 {h.name}
                      </span>
                      {h.vacationBadge && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          {h.vacationBadge}
                        </span>
                      )}
                    </div>
                    {h.description && (
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {h.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      {hoangDaoHours.length > 0 && (
        <MobileHoangDaoHoursV1 hoangDaoHours={hoangDaoHours} theme={theme} />
      )}

      {fengShuiData && (
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white/80 rounded-xl p-4 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-lg bg-emerald-100 text-emerald-600">
                <MaterialIcon name="check_circle" className="text-sm font-bold" />
              </div>
              <h4 className="text-emerald-700 font-bold text-xs">Nên làm</h4>
            </div>
            <div className="flex flex-col gap-1.5">
              {fengShuiData.ga?.map((activity, index) => (
                <p
                  key={index}
                  className="text-emerald-700 text-xs leading-relaxed"
                >
                  {activity}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-4 border border-rose-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-lg bg-rose-100 text-rose-600">
                <MaterialIcon name="cancel" className="text-sm font-bold" />
              </div>
              <h4 className="text-rose-700 font-bold text-xs">Kiêng kỵ</h4>
            </div>
            <div className="flex flex-col gap-1.5">
              {fengShuiData.ba?.map((activity, index) => (
                <p
                  key={index}
                  className="text-rose-700 text-xs leading-relaxed"
                >
                  {activity}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileHoangDaoHoursV1Props {
  hoangDaoHours: Array<{
    chi: string;
    timeRange: string;
    emoji: string;
  }>;
  theme: MonthTheme;
}

function MobileHoangDaoHoursV1({
  hoangDaoHours,
  theme,
}: MobileHoangDaoHoursV1Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        scrollEl.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [hoangDaoHours]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 140;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <MaterialIcon
          name="schedule"
          className="text-lg font-bold"
          style={{ color: theme.accentGold }}
        />
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
          Giờ Hoàng Đạo
        </h3>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Cuộn giờ hoàng đạo sang trái"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center"
            style={{ color: theme.primaryAccent }}
          >
            <MaterialIcon name="chevron_left" className="text-[18px]" />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Cuộn giờ hoàng đạo sang phải"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center"
            style={{ color: theme.primaryAccent }}
          >
            <MaterialIcon name="chevron_right" className="text-[18px]" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {hoangDaoHours.map((hour) => (
            <div
              key={hour.chi}
              className="flex-shrink-0 flex items-center gap-3 bg-slate-700/90 rounded-xl p-2 pr-4 shadow-sm min-w-[120px]"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
                <span className="text-lg">{hour.emoji}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{hour.chi}</div>
                <div className="text-[10px] text-white/70">{hour.timeRange}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
