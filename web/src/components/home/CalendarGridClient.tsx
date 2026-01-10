"use client";

import { useMemo } from "react";
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

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function CalendarGridClient({
  currentDate,
  selectedDate,
  theme,
  onSelectDate,
  getCachedData,
}: CalendarGridClientProps) {
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  return (
    <div className="glass-panel-light dark:glass-panel-dark rounded-2xl lg:rounded-3xl flex flex-col p-4 lg:p-6 overflow-hidden shadow-xl">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2 lg:mb-4">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`text-center text-[10px] lg:text-xs font-black uppercase tracking-widest ${
              index === 0
                ? "text-red-400"
                : index === 6
                ? "text-emerald-500"
                : "text-slate-400 dark:text-[#9cbab2]"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 lg:gap-1.5">
        {calendarDays.map((day) => (
          <CalendarDayCellClient
            key={day.toISOString()}
            date={day}
            currentMonth={currentDate}
            selectedDate={selectedDate}
            theme={theme}
            onSelect={onSelectDate}
            fengShuiData={getCachedData(day)}
          />
        ))}
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
}

function CalendarDayCellClient({
  date,
  currentMonth,
  selectedDate,
  theme,
  onSelect,
  fengShuiData,
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
    return {
      className: "hover:bg-white/80 dark:hover:bg-white/5 rounded-lg",
      style: {},
    };
  };

  const { className: cellClassName, style: cellStyle } = getCellStyles();

  return (
    <Link href={`/day/${format(date, "yyyy-MM-dd")}`}>
      <div
        className={`calendar-cell ${cellClassName}`}
        style={cellStyle}
        onClick={() => onSelect?.(date)}
      >
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
