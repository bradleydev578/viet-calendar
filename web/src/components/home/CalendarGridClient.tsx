"use client";

import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { LunarCalculator } from "@/lib/lunar";
import { HolidayRepository } from "@/lib/holidays";
import type { MonthTheme } from "@/lib/theme";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import Link from "next/link";

interface CalendarGridClientProps {
  currentDate: Date;
  selectedDate?: Date;
  theme: MonthTheme;
  onSelectDate?: (date: Date) => void;
  getCachedData: (date: Date) => DayFengShuiData | undefined;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onToday?: () => void;
  onSelectMonth?: (monthNum: number) => void;
  onSelectYear?: (yearNum: number) => void;
  isFullView?: boolean;
  onToggleFullView?: () => void;
  showHeader?: boolean;
}

export type ActivityFilter =
  | "all"
  | "hoangdao"
  | "cuoihoi"
  | "khaitruong"
  | "xaydung"
  | "xuathanh";

const ACTIVITY_FILTERS: { id: ActivityFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "hoangdao", label: "★ Hoàng Đạo" },
  { id: "cuoihoi", label: "💍 Cưới hỏi" },
  { id: "khaitruong", label: "🏪 Khai trương" },
  { id: "xaydung", label: "🏗️ Xây dựng" },
  { id: "xuathanh", label: "✈️ Xuất hành" },
];

const DAI_KY_STARS = new Set([
  "Tam Nương",
  "Nguyệt Kỵ",
  "Dương Công Kỵ",
  "Thụ tử",
  "Sát chủ",
  "Nguyệt phá",
]);

function matchesActivityFilter(
  filter: ActivityFilter,
  data?: DayFengShuiData
): boolean {
  if (filter === "all") return true;
  if (!data) return false;
  const isHoangDao = data.t12g === 1;
  if (filter === "hoangdao") return isHoangDao;

  if (!isHoangDao) return false;
  if (["Phá", "Nguy", "Bế"].includes(data.t12)) return false;
  if ((data.bs || []).some((s) => DAI_KY_STARS.has(s))) return false;

  const gaText = (data.ga || []).join(" ");
  const baText = (data.ba || []).join(" ");

  switch (filter) {
    case "cuoihoi":
      return (
        data.t12 !== "Trừ" &&
        /cưới|hôn|gả|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/cưới|hôn|gả/i.test(baText)
      );
    case "khaitruong":
      return (
        /khai trương|kinh doanh|giao dịch|tài|trăm việc đều tốt|mọi việc đều tốt/i.test(
          gaText
        ) && !/khai trương/i.test(baText)
      );
    case "xaydung":
      return (
        !["Kiến", "Mãn", "Thu"].includes(data.t12) &&
        /xây|cất|khởi tạo|khởi công|trổ cửa|sửa chữa|trăm việc đều tốt|mọi việc đều tốt/i.test(
          gaText
        ) &&
        !/xây cất|khởi tạo|động thổ/i.test(baText)
      );
    case "xuathanh":
      return (
        !["Trừ", "Định", "Chấp", "Thu"].includes(data.t12) &&
        /xuất hành|đi|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/xuất hành/i.test(baText)
      );
    default:
      return true;
  }
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function CalendarGridClient({
  currentDate,
  selectedDate,
  theme,
  onSelectDate,
  getCachedData,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectMonth,
  onSelectYear,
  isFullView = false,
  onToggleFullView,
  showHeader = true,
}: CalendarGridClientProps) {
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");
  const [showDayChi, setShowDayChi] = useState(false);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const monthNum = currentDate.getMonth() + 1;
  const yearNum = currentDate.getFullYear();

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-4 sm:p-6 border border-white/80 shadow-xl h-full flex flex-col justify-between">
      {/* Calendar Header & Filter Bar */}
      {showHeader && (
        <div className="flex flex-col gap-3 pb-3.5 mb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Lịch Tháng {monthNum}/{yearNum}
                </h2>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{
                    backgroundColor: `${theme.primaryAccent}15`,
                    color: theme.primaryAccent,
                  }}
                >
                  {theme.motif || "🌸"} {theme.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {onPrevMonth && (
                <button
                  type="button"
                  onClick={onPrevMonth}
                  aria-label="Tháng trước"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ‹
                </button>
              )}

              {onSelectMonth && (
                <select
                  aria-label="Chọn tháng"
                  value={monthNum}
                  onChange={(e) => onSelectMonth(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-extrabold focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Tháng {m}
                    </option>
                  ))}
                </select>
              )}

              {onSelectYear && (
                <select
                  aria-label="Chọn năm"
                  value={yearNum}
                  onChange={(e) => onSelectYear(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-extrabold focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 201 }, (_, i) => 1900 + i).map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              )}

              {onNextMonth && (
                <button
                  type="button"
                  onClick={onNextMonth}
                  aria-label="Tháng sau"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  ›
                </button>
              )}

              {onToday && (
                <button
                  type="button"
                  onClick={onToday}
                  className="px-2.5 py-1.5 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  Hôm nay
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowDayChi((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  showDayChi
                    ? "text-white border-transparent shadow-2xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
                style={showDayChi ? { backgroundColor: theme.primaryAccent } : {}}
                title="Hiện/ẩn Can Chi (Tý, Sửu, Dần, Mão...) trên từng ô lịch"
              >
                <span>{showDayChi ? "✓ Can Chi" : "Can Chi"}</span>
              </button>

              {onToggleFullView && (
                <button
                  type="button"
                  onClick={onToggleFullView}
                  className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title={
                    isFullView
                      ? "Thu về chế độ 2 cột (Bloc + Lịch tháng)"
                      : "Phóng to Bảng Lịch Tháng toàn màn hình"
                  }
                >
                  {isFullView ? "◫ Xem 2 cột" : "⛶ Phóng to"}
                </button>
              )}
            </div>
          </div>

          {/* Activity Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-0.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Lọc ngày tốt:
            </span>
            {ACTIVITY_FILTERS.map((item) => {
              const isActive = activeFilter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveFilter(item.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                  style={
                    isActive ? { backgroundColor: theme.primaryAccent } : {}
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`py-1 ${
              index === 6
                ? "text-red-500"
                : index === 5
                ? "text-emerald-600"
                : "text-slate-400"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - Taller cells to stretch and balance with Left 3D Bloc */}
      <div className="grid grid-cols-7 auto-rows-fr gap-1.5 sm:gap-2 flex-1">
        {calendarDays.map((day) => {
          const dayData = getCachedData(day);
          const isMatched = matchesActivityFilter(activeFilter, dayData);
          return (
            <CalendarDayCellClient
              key={day.toISOString()}
              date={day}
              currentMonth={currentDate}
              selectedDate={selectedDate}
              theme={theme}
              onSelect={onSelectDate}
              fengShuiData={dayData}
              filterActive={activeFilter !== "all"}
              isFilterMatch={isMatched}
              isFullView={isFullView}
              showDayChi={showDayChi}
            />
          );
        })}
      </div>

      {/* Compact filter bar if showHeader is false */}
      {!showHeader && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Lọc:
          </span>
          {ACTIVITY_FILTERS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveFilter(item.id)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
                style={isActive ? { backgroundColor: theme.primaryAccent } : {}}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="text-amber-500">★</span> Ngày Hoàng Đạo
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{" "}
            Mùng 1 / Rằm / Lễ
          </span>
          <span className="flex items-center gap-1">
            <span className="text-emerald-600 font-bold">T7</span> Thứ Bảy
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-500 font-bold">CN</span> Chủ Nhật
          </span>
        </div>
        <Link
          href="/xem-ngay-tot"
          className="font-bold hover:underline"
          style={{ color: theme.primaryAccent }}
        >
          Tra cứu ngày tốt chi tiết →
        </Link>
      </div>
    </div>
  );
}

interface CalendarDayCellClientProps {
  date: Date;
  currentMonth: Date;
  selectedDate?: Date;
  theme: MonthTheme;
  onSelect?: (date: Date) => void;
  fengShuiData?: DayFengShuiData;
  filterActive?: boolean;
  isFilterMatch?: boolean;
  isFullView?: boolean;
  showDayChi?: boolean;
}

function CalendarDayCellClient({
  date,
  currentMonth,
  selectedDate,
  theme,
  onSelect,
  fengShuiData,
  filterActive = false,
  isFilterMatch = true,
  isFullView = false,
  showDayChi = false,
}: CalendarDayCellClientProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isSelected = selectedDate && isSameDay(date, selectedDate);
  const isTodayDate = isToday(date);
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;
  const isHoangDao = fengShuiData?.t12g === 1;

  // Get lunar date
  const lunarDate = useMemo(() => LunarCalculator.toLunar(date), [date]);

  // Check for holidays
  const holidays = useMemo(() => HolidayRepository.getByDate(date), [date]);
  const hasHoliday = holidays.length > 0;

  // Format lunar date display
  const lunarDisplay = useMemo(() => {
    if (lunarDate.day === 1) {
      return `${lunarDate.day}/${lunarDate.month}`;
    }
    if (lunarDate.day === 15) {
      return `15/${lunarDate.month}`;
    }
    return lunarDate.day.toString();
  }, [lunarDate]);

  // Extract short Chi of the day (e.g. "Tân Mão" -> "Mão")
  const dayChiShort = useMemo(() => {
    if (!fengShuiData?.dgz) return "";
    const parts = fengShuiData.dgz.split(" ");
    return isFullView ? fengShuiData.dgz : parts[parts.length - 1] || "";
  }, [fengShuiData, isFullView]);

  const dateHref = `/day/${format(date, "yyyy-MM-dd")}`;

  // Active / Selected / Today styling matching Mẫu A
  const isHighlighted = isSelected || (!selectedDate && isTodayDate);

  const cellStyle: React.CSSProperties = isHighlighted
    ? {
        background: `linear-gradient(135deg, ${theme.primaryAccent}, ${
          theme.darkAccent || theme.primaryHover
        })`,
        boxShadow: `0 10px 22px -5px ${theme.primaryAccent}66`,
      }
    : isTodayDate
    ? {
        borderColor: theme.primaryAccent,
        backgroundColor: `${theme.primaryAccent}10`,
      }
    : {};

  const filterDimClass =
    filterActive && isCurrentMonth && !isFilterMatch ? "opacity-25" : "";
  const filterHighlightClass =
    filterActive && isCurrentMonth && isFilterMatch && !isHighlighted
      ? "ring-2 ring-emerald-500/70 bg-emerald-50/70"
      : "";

  return (
    <Link
      href={dateHref}
      prefetch={false}
      onClick={(e) => {
        if (onSelect && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          e.preventDefault();
          onSelect(date);
        }
      }}
      className="block h-full"
    >
      <div
        className={`relative h-full min-h-[54px] sm:min-h-[68px] p-1.5 sm:p-2 rounded-2xl border transition-all duration-200 flex flex-col justify-between text-left cursor-pointer ${
          !isCurrentMonth
            ? "opacity-35 bg-slate-50/40 border-transparent"
            : isHighlighted
            ? "text-white border-transparent scale-[1.03] z-10"
            : isTodayDate
            ? "border-2 bg-white shadow-xs"
            : "bg-white/85 hover:bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
        } ${filterDimClass} ${filterHighlightClass}`}
        style={cellStyle}
      >
        {/* Top Row: Solar Day + Short Chi */}
        <div className="flex items-start justify-between w-full">
          <span
            className={`text-sm sm:text-base font-extrabold leading-none ${
              isHighlighted
                ? "text-white"
                : !isCurrentMonth
                ? "text-slate-400"
                : isSunday
                ? "text-red-500"
                : isSaturday
                ? "text-emerald-600"
                : "text-slate-800"
            }`}
          >
            {date.getDate()}
          </span>
          {showDayChi && isCurrentMonth && dayChiShort && (
            <span
              className={`text-[9px] font-bold truncate max-w-[55%] ${
                isHighlighted ? "text-white/80" : "text-slate-400"
              }`}
            >
              {dayChiShort}
            </span>
          )}
        </div>

        {/* Optional Holiday Label in Full View */}
        {isFullView && isCurrentMonth && hasHoliday && (
          <div
            className={`text-[9px] font-bold truncate my-0.5 ${
              isHighlighted ? "text-amber-200" : "text-red-600"
            }`}
          >
            🎉 {holidays[0].name}
          </div>
        )}

        {/* Bottom Row: Hoàng Đạo Star + Holiday Dot + Lunar Date */}
        <div className="flex items-end justify-between w-full mt-1">
          <div className="flex items-center gap-0.5">
            {isCurrentMonth && isHoangDao ? (
              <span
                className={`text-[10px] leading-none ${
                  isHighlighted ? "text-amber-200" : "text-amber-500"
                }`}
                title="Ngày Hoàng Đạo"
              >
                ★
              </span>
            ) : (
              <span className="text-[10px] leading-none opacity-0">•</span>
            )}
            {isCurrentMonth && hasHoliday && (
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${
                  isHighlighted ? "bg-amber-200" : "bg-red-500"
                }`}
                title={holidays.map((h) => h.name).join(", ")}
              />
            )}
          </div>

          <span
            className={`text-[10px] font-extrabold leading-none ${
              isHighlighted
                ? "text-amber-200"
                : lunarDate.day === 1 || lunarDate.day === 15
                ? "text-red-600 font-black"
                : "text-amber-600"
            }`}
          >
            {lunarDisplay}
          </span>
        </div>
      </div>
    </Link>
  );
}
