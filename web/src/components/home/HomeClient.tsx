"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { getMonthTheme } from "@/lib/theme";
import { TopHeader, Footer } from "@/components/layout";
import { InfoSections } from "@/components/home/InfoSections";
import { HolidayRepository, getHolidayColor } from "@/lib/holidays";
import { GIO_DIA_CHI, CON_GIAP } from "@/lib/lunar";
import { parseDateString, formatDateString } from "@/lib/date-utils";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import { UniversalDayCalculator } from "@/lib/fengshui/UniversalDayCalculator";
import {
  fetchFengShuiByDate,
  fetchFengShuiByMonth,
  createFengShuiCache,
} from "@/lib/fengshui/client";

import { CalendarGridClient } from "./CalendarGridClient";
import { WallCalendarBloc } from "./WallCalendarBloc";

interface HomeClientProps {
  initialFengShuiData: DayFengShuiData | null;
  initialMonthData: DayFengShuiData[];
  initialQuote: string;
  initialDate: string; // YYYY-MM-DD date string from server (Vietnam timezone)
}

export function HomeClient({
  initialFengShuiData,
  initialMonthData,
  initialQuote,
  initialDate,
}: HomeClientProps) {
  const initialParsedDate = useMemo(
    () => parseDateString(initialDate) || new Date(),
    [initialDate]
  );

  const [currentDate, setCurrentDate] = useState<Date>(initialParsedDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialParsedDate);
  const [isFullMonthView, setIsFullMonthView] = useState(false);
  const [, setCacheVersion] = useState(0);

  // Cache for feng shui data
  const fengShuiCache = useMemo(() => {
    const cache = createFengShuiCache();
    if (initialFengShuiData) {
      cache.set(initialFengShuiData);
    }
    cache.setMany(initialMonthData);
    return cache;
  }, [initialFengShuiData, initialMonthData]);

  // Initialize directly with server-prefetched data so SSR renders full content
  const [fengShuiData, setFengShuiData] = useState<DayFengShuiData | null>(
    initialFengShuiData
  );

  // Sync with client local date if ISR snapshot is from a previous day
  useEffect(() => {
    const clientToday = new Date();
    if (formatDateString(clientToday) !== formatDateString(initialParsedDate)) {
      setCurrentDate(clientToday);
      setSelectedDate(clientToday);
    }
  }, [initialParsedDate]);

  const activeMonthNumber = currentDate.getMonth() + 1;
  const activeYearNumber = currentDate.getFullYear();

  const theme = useMemo(
    () => getMonthTheme(activeMonthNumber),
    [activeMonthNumber]
  );

  // Get upcoming holidays (next 4)
  const upcomingHolidays = useMemo(() => {
    return HolidayRepository.getUpcomingFromDate(selectedDate, 4);
  }, [selectedDate]);

  // Get 6 Giờ Hoàng Đạo with zodiac icons
  const hoangDaoHours = useMemo(() => {
    const hdList = fengShuiData?.hd || [];
    return GIO_DIA_CHI.filter((gio) => hdList.includes(gio.chi)).map((gio) => ({
      ...gio,
      emoji:
        CON_GIAP[GIO_DIA_CHI.findIndex((g) => g.chi === gio.chi)]?.emoji || "🐉",
    }));
  }, [fengShuiData]);

  // Fetch data for selected date (1900-2100 via UniversalDayCalculator fallback)
  const fetchDataForDate = useCallback(
    async (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");

      const cached = fengShuiCache.get(dateStr);
      if (cached) {
        setFengShuiData(cached);
        return;
      }

      const computed = UniversalDayCalculator.calculate(date);
      setFengShuiData(computed);

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

  // Fetch month data when month changes
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

  const handleSelectMonth = (monthNum: number) => {
    const targetYear = currentDate.getFullYear();
    const maxDayInTargetMonth = new Date(targetYear, monthNum, 0).getDate();
    const targetDay = Math.min(selectedDate.getDate(), maxDayInTargetMonth);
    const nextDate = new Date(targetYear, monthNum - 1, targetDay, 12, 0, 0);
    setCurrentDate(new Date(targetYear, monthNum - 1, 1, 12, 0, 0));
    setSelectedDate(nextDate);
  };

  const handleSelectYear = (yearNum: number) => {
    const monthIndex = currentDate.getMonth();
    const maxDay = new Date(yearNum, monthIndex + 1, 0).getDate();
    const targetDay = Math.min(selectedDate.getDate(), maxDay);
    setCurrentDate(new Date(yearNum, monthIndex, 1, 12, 0, 0));
    setSelectedDate(new Date(yearNum, monthIndex, targetDay, 12, 0, 0));
  };

  const handlePrevMonth = () => {
    const prev = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
      12,
      0,
      0
    );
    setCurrentDate(prev);
    const maxDay = new Date(prev.getFullYear(), prev.getMonth() + 1, 0).getDate();
    setSelectedDate(
      new Date(
        prev.getFullYear(),
        prev.getMonth(),
        Math.min(selectedDate.getDate(), maxDay),
        12,
        0,
        0
      )
    );
  };

  const handleNextMonth = () => {
    const next = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
      12,
      0,
      0
    );
    setCurrentDate(next);
    const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    setSelectedDate(
      new Date(
        next.getFullYear(),
        next.getMonth(),
        Math.min(selectedDate.getDate(), maxDay),
        12,
        0,
        0
      )
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
    (date: Date) =>
      fengShuiCache.get(date) || UniversalDayCalculator.calculate(date),
    [fengShuiCache]
  );

  return (
    <div
      className="relative flex flex-col min-h-dvh w-full overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.background }}
    >
      {/* Dynamic Seasonal Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-28 -left-28 w-[480px] h-[480px] rounded-full blur-[110px] opacity-40 transition-all duration-700"
          style={{ backgroundColor: theme.blurCircle1 }}
        />
        <div
          className="absolute top-1/3 -right-28 w-[420px] h-[420px] rounded-full blur-[110px] opacity-35 transition-all duration-700"
          style={{ backgroundColor: theme.blurCircle2 }}
        />
      </div>

      {/* Global V2 Top Header */}
      <TopHeader theme={theme} monthNumber={activeMonthNumber} />

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 space-y-5">
        {/* ========================================================
            MAIN SPLIT-VIEW ROW:
            Left (5 cols) 3D Wall Calendar Bloc + Right (7 cols) Month Grid
            Equal Height (items-stretch)
            ======================================================== */}
        {!isFullMonthView ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* LEFT (5 COLS): 3D WALL CALENDAR BLOC */}
            <div className="lg:col-span-5 h-full">
              <WallCalendarBloc
                selectedDate={selectedDate}
                theme={theme}
                fengShuiData={fengShuiData}
                quote={initialQuote}
                onSelectDate={handleSelectDate}
                showDetailLink
                isMainHeading
              />
            </div>

            {/* RIGHT (7 COLS): TALL MONTHLY CALENDAR BOARD */}
            <div className="lg:col-span-7 h-full">
              <CalendarGridClient
                currentDate={currentDate}
                selectedDate={selectedDate}
                theme={theme}
                onSelectDate={handleSelectDate}
                getCachedData={getCachedData}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onToday={handleToday}
                onSelectMonth={handleSelectMonth}
                onSelectYear={handleSelectYear}
                isFullView={false}
                onToggleFullView={() => setIsFullMonthView(true)}
              />
            </div>
          </div>
        ) : (
          /* EXPANDED 12-COL FULL MONTH FLIP-BOARD VIEW */
          <div className="space-y-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-3.5 border border-white/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryAccent}, ${
                      theme.darkAccent || theme.primaryHover
                    })`,
                  }}
                >
                  {String(selectedDate.getDate()).padStart(2, "0")}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">
                    Đang chọn: Ngày {format(selectedDate, "dd/MM/yyyy")} • Ngày{" "}
                    {fengShuiData?.dgz || "—"} (Trực {fengShuiData?.t12 || "—"})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    💧 {fengShuiData?.nh || "—"} •{" "}
                    {fengShuiData?.t12g === 1 ? "★ Ngày Hoàng Đạo" : "Ngày Hắc Đạo"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/day/${format(selectedDate, "yyyy-MM-dd")}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  Xem chi tiết ngày →
                </Link>
                <button
                  type="button"
                  onClick={() => setIsFullMonthView(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ◫ Thu về chế độ 2 cột (Bloc + Lịch tháng)
                </button>
              </div>
            </div>

            <CalendarGridClient
              currentDate={currentDate}
              selectedDate={selectedDate}
              theme={theme}
              onSelectDate={handleSelectDate}
              getCachedData={getCachedData}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              onSelectMonth={handleSelectMonth}
              onSelectYear={handleSelectYear}
              isFullView
              onToggleFullView={() => setIsFullMonthView(false)}
            />
          </div>
        )}

        {/* ========================================================
            BOTTOM ROW:
            Left (5 cols) 6 Giờ Hoàng Đạo + Right (7 cols) Ngọc Hạp & Sự Kiện
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT (5 COLS): 6 GIỜ HOÀNG ĐẠO TRONG NGÀY */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 border border-white/80 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                🕒 6 Giờ Hoàng Đạo Trong Ngày
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Tốt cho xuất hành & cầu tài
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3">
              {hoangDaoHours.length > 0 ? (
                hoangDaoHours.map((h) => (
                  <div
                    key={h.chi}
                    className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-2.5 hover:bg-amber-50 transition-colors"
                  >
                    <span className="text-xl select-none" aria-hidden="true">
                      {h.emoji}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">
                        Giờ {h.chi}
                      </div>
                      <div className="text-[10px] font-bold text-amber-800">
                        {h.timeRange}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-xs text-slate-500 py-4 text-center">
                  Đang tải thông tin giờ Hoàng Đạo...
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Chọn giờ tốt hợp tuổi để khởi sự hanh thông</span>
              <Link
                href={`/day/${format(selectedDate, "yyyy-MM-dd")}`}
                prefetch={false}
                className="font-bold hover:underline"
                style={{ color: theme.primaryAccent }}
              >
                Xem cả 12 canh giờ →
              </Link>
            </div>
          </div>

          {/* RIGHT (7 COLS): VIỆC NÊN LÀM & SỰ KIỆN SẮP TỚI */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Card 1: Việc Nên Làm & Kiêng Kỵ (Ngọc Hạp Thông Thư) */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    📜 Ngọc Hạp Thông Thư
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Trực {fengShuiData?.t12 || "—"} • Sao {fengShuiData?.s28 || "—"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-[11px] font-extrabold text-emerald-700 uppercase mb-1.5 flex items-center gap-1">
                      <span>✓ Việc nên làm (Cát)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(fengShuiData?.ga && fengShuiData.ga.length > 0
                        ? fengShuiData.ga.slice(0, 6)
                        : ["Cầu phúc, tế tự", "Xuất hành", "Giao dịch"]
                      ).map((act, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-extrabold text-rose-700 uppercase mb-1.5 flex items-center gap-1">
                      <span>✕ Việc kiêng kỵ (Hung)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(fengShuiData?.ba && fengShuiData.ba.length > 0
                        ? fengShuiData.ba.slice(0, 4)
                        : ["Kiện tụng, tranh chấp"]
                      ).map((act, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200/60"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium truncate max-w-[60%]">
                  Sao xấu:{" "}
                  {fengShuiData?.bs && fengShuiData.bs.length > 0
                    ? fengShuiData.bs.slice(0, 2).join(", ")
                    : "Ít hung tinh"}
                </span>
                <Link
                  href="/xem-ngay-tot"
                  className="font-bold hover:underline shrink-0"
                  style={{ color: theme.primaryAccent }}
                >
                  Xem ngày tốt →
                </Link>
              </div>
            </div>

            {/* Card 2: Lịch Nghỉ Lễ & Sự Kiện Sắp Tới */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    🎉 Sự Kiện & Ngày Lễ Sắp Tới
                  </span>
                  <Link
                    href="/holidays"
                    className="text-xs font-bold hover:underline"
                    style={{ color: theme.primaryAccent }}
                  >
                    Tất cả →
                  </Link>
                </div>

                <div className="space-y-2">
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
                        className="p-2.5 rounded-2xl bg-slate-50/90 hover:bg-white border border-slate-200/60 flex items-center justify-between gap-2 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0"
                            style={{
                              backgroundColor: `${holidayColor}18`,
                              color: holidayColor,
                            }}
                          >
                            {format(holiday.startDate, "d/M")}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-slate-800 truncate">
                              {holiday.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {holiday.vacationBadge ||
                                (holiday.type === "lunar"
                                  ? "Lễ truyền thống Âm lịch"
                                  : "Sự kiện Dương lịch")}
                            </div>
                          </div>
                        </div>
                        <span
                          className="px-2 py-1 rounded-lg text-[10px] font-extrabold shrink-0"
                          style={{
                            backgroundColor: `${theme.primaryAccent}15`,
                            color: theme.primaryAccent,
                          }}
                        >
                          {holiday.daysUntil === 0
                            ? "Hôm nay"
                            : `${holiday.daysUntil} ngày`}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Cập nhật chuẩn lịch nghỉ Lễ, Tết 2026–2027</span>
                <Link
                  href="/doi-ngay-am-duong"
                  className="font-bold hover:underline shrink-0"
                  style={{ color: theme.primaryAccent }}
                >
                  Đổi ngày →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Cultural Knowledge Sections */}
        <InfoSections theme={theme} />
      </main>

      {/* Global V2 Footer */}
      <Footer />
    </div>
  );
}
