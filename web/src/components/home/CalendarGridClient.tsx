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
}

type ActivityFilter = "all" | "hoangdao" | "cuoihoi" | "khaitruong" | "xaydung" | "xuathanh";

const ACTIVITY_FILTERS: { id: ActivityFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "hoangdao", label: "★ Hoàng Đạo" },
  { id: "cuoihoi", label: "Cưới hỏi" },
  { id: "khaitruong", label: "Khai trương" },
  { id: "xaydung", label: "Xây dựng" },
  { id: "xuathanh", label: "Xuất hành" },
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
        /khai trương|kinh doanh|giao dịch|tài|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/khai trương/i.test(baText)
      );
    case "xaydung":
      return (
        !["Kiến", "Mãn", "Thu"].includes(data.t12) &&
        /xây|cất|khởi tạo|khởi công|trổ cửa|sửa chữa|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
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
}: CalendarGridClientProps) {
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  return (
    <div className="glass-panel-light rounded-2xl lg:rounded-3xl flex flex-col p-4 lg:p-6 overflow-hidden shadow-xl">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2 lg:mb-4">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`text-center text-[10px] lg:text-xs font-black uppercase tracking-widest ${
              index === 6
                ? "text-red-500"
                : index === 5
                ? "text-emerald-600"
                : "text-slate-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 lg:gap-1.5">
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
            />
          );
        })}
      </div>

      {/* Auspicious Activity Filter Bar */}
      <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Lọc ngày tốt:
        </span>
        {ACTIVITY_FILTERS.map((item) => {
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveFilter(item.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "text-white shadow-sm"
                  : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
              style={isActive ? { backgroundColor: theme.primaryAccent } : {}}
            >
              {item.label}
            </button>
          );
        })}
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
}

function CalendarDayCellClient({
  date,
  currentMonth,
  selectedDate,
  theme,
  onSelect,
  filterActive = false,
  isFilterMatch = true,
}: CalendarDayCellClientProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isSelected = selectedDate && isSameDay(date, selectedDate);
  const isTodayDate = isToday(date);
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

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
      return "Rằm";
    }
    return lunarDate.day.toString();
  }, [lunarDate]);

  // Determine cell styles
  const getCellStyles = () => {
    if (isTodayDate) {
      return {
        className: "today-cell rounded-lg lg:rounded-xl scale-105 z-20",
        style: {
          backgroundColor: theme.primaryAccent,
          boxShadow: theme.todayCellShadow,
        },
      };
    }
    if (isSelected) {
      return {
        className: "rounded-lg border-2 shadow-lg",
        style: {
          borderColor: theme.accentGold,
          backgroundColor: `${theme.primaryAccent}08`,
          boxShadow: `0 8px 20px -4px ${theme.accentGold}25`,
        },
      };
    }
    if (filterActive && isCurrentMonth) {
      if (isFilterMatch) {
        return {
          className: "rounded-lg ring-1 ring-emerald-500/60 bg-emerald-50/70",
          style: {},
        };
      }
      return {
        className: "rounded-lg opacity-35",
        style: {},
      };
    }
    return {
      className: "hover:bg-white/80 rounded-lg",
      style: {},
    };
  };

  const { className: cellClassName, style: cellStyle } = getCellStyles();
  const dateHref = `/day/${format(date, "yyyy-MM-dd")}`;

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
    >
      <div className={`calendar-cell ${cellClassName}`} style={cellStyle}>
        {/* Solar date */}
        <span
          className={`text-sm lg:text-lg font-bold ${
            isTodayDate
              ? "text-white"
              : !isCurrentMonth
              ? "text-slate-400/60"
              : isSunday
              ? "text-red-500"
              : isSaturday
              ? "text-emerald-600"
              : "text-slate-700"
          }`}
        >
          {date.getDate()}
        </span>

        {/* Lunar date with event indicator */}
        <div className="flex items-center gap-0.5">
          <span
            className={`text-[9px] lg:text-[10px] font-bold ${
              isTodayDate
                ? "text-white/90"
                : !isCurrentMonth
                ? "text-slate-400/50"
                : lunarDate.day === 1 || lunarDate.day === 15
                ? "text-red-500"
                : ""
            }`}
            style={
              !isTodayDate &&
              isCurrentMonth &&
              lunarDate.day !== 1 &&
              lunarDate.day !== 15
                ? { color: theme.accentGold }
                : {}
            }
          >
            {lunarDisplay}
          </span>
          {/* Event indicator - next to lunar date */}
          {isCurrentMonth && hasHoliday && (
            <div
              className={`size-1 lg:size-1.5 rounded-full flex-shrink-0 ${
                isTodayDate ? "bg-white" : "bg-red-400"
              }`}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
