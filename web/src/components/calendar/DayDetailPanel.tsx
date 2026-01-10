"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { format, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { LunarCalculator, WEEKDAY_NAMES, GIO_DIA_CHI, CON_GIAP } from "@/lib/lunar";
import { FengShuiRepository, DayScore } from "@/lib/fengshui";
import { HolidayRepository, getHolidayColor } from "@/lib/holidays";
import type { MonthTheme } from "@/lib/theme";

interface DayDetailPanelProps {
  selectedDate: Date;
  theme: MonthTheme;
}

export function DayDetailPanel({ selectedDate, theme }: DayDetailPanelProps) {
  const lunarDate = useMemo(
    () => LunarCalculator.toLunar(selectedDate),
    [selectedDate]
  );
  const yearInfo = useMemo(
    () => LunarCalculator.getYearInfo(lunarDate.year),
    [lunarDate.year]
  );
  const fengShuiData = useMemo(
    () => FengShuiRepository.getByDate(selectedDate),
    [selectedDate]
  );
  const dayScore = useMemo(() => {
    if (!fengShuiData) return null;
    return DayScore.calculate(fengShuiData);
  }, [fengShuiData]);
  const holidays = useMemo(
    () => HolidayRepository.getByDate(selectedDate),
    [selectedDate]
  );

  // Get upcoming holidays (next 5)
  const upcomingHolidays = useMemo(() => {
    const allHolidays = HolidayRepository.getAllHolidays();
    return allHolidays
      .filter((h) => !h.isPast && h.daysUntil > 0)
      .slice(0, 5);
  }, []);

  const weekday = WEEKDAY_NAMES[selectedDate.getDay()];
  const isTodayDate = isToday(selectedDate);
  const isHoangDao = fengShuiData?.t12g === 1;

  // Get hoàng đạo hours with zodiac info (all hours, not just first 3)
  const hoangDaoHours = useMemo(() => {
    if (!fengShuiData?.hd) return [];
    return GIO_DIA_CHI.filter((gio) => fengShuiData.hd.includes(gio.chi))
      .map((gio) => ({
        ...gio,
        emoji: CON_GIAP[GIO_DIA_CHI.findIndex((g) => g.chi === gio.chi)]?.emoji || "🐉",
      }));
  }, [fengShuiData]);

  return (
    <div className="flex-1 min-w-[300px] max-w-[380px] flex flex-col gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide pt-1">
      {/* Date Info Card - Clickable to detail page */}
      <Link href={`/day/${format(selectedDate, "yyyy-MM-dd")}`}>
        <div
          className="glass-panel-light dark:glass-panel-dark rounded-2xl lg:rounded-3xl p-5 lg:p-6 relative overflow-hidden group shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          style={{ borderColor: `${theme.primaryAccent}15` }}
        >
        <div
          className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl transition-colors"
          style={{ backgroundColor: `${theme.primaryAccent}15` }}
        />

        <div className="flex justify-between items-start mb-4 lg:mb-6">
          <div>
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  backgroundColor: isHoangDao ? `${theme.accentGold}20` : 'rgba(100,100,100,0.2)',
                  color: isHoangDao ? theme.accentGold : '#888',
                }}
              >
                ★ {isHoangDao ? "HOÀNG ĐẠO" : "HẮC ĐẠO"}
              </span>
            </div>
            <p
              className="text-lg lg:text-xl font-bold mb-1"
              style={{ color: theme.primaryAccent }}
            >
              {weekday}
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight">
              {selectedDate.getDate()}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
              Âm lịch
            </div>
            <div
              className="text-2xl lg:text-3xl font-black"
              style={{ color: theme.accentGold }}
            >
              {lunarDate.day}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold tracking-wide mt-1 uppercase">
              Tháng {lunarDate.month}
            </div>
          </div>
        </div>

        {/* Can Chi Info */}
        <div
          className="space-y-3 border-t pt-4 lg:pt-6"
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
        </div>
        </div>
      </Link>

      {/* Hoàng Đạo Hours */}
      {hoangDaoHours.length > 0 && (
        <HoangDaoHoursSection hoangDaoHours={hoangDaoHours} theme={theme} />
      )}

      {/* Good/Bad Activities */}
      {fengShuiData && (
        <div className="grid grid-cols-1 gap-3">
          {/* Good activities */}
          <div className="bg-white/80 dark:bg-[#1a2e2b] rounded-xl lg:rounded-2xl p-4 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-sm font-bold">
                  check_circle
                </span>
              </div>
              <h4 className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                Nên làm
              </h4>
            </div>
            <div className="flex flex-col gap-1.5">
              {fengShuiData.ga?.map((activity, index) => (
                <p
                  key={index}
                  className="text-emerald-700 dark:text-emerald-400 text-xs leading-relaxed"
                >
                  {activity}
                </p>
              ))}
            </div>
          </div>

          {/* Bad activities */}
          <div className="bg-white/80 dark:bg-[#2a1d1d] rounded-xl lg:rounded-2xl p-4 border border-rose-100 dark:border-red-500/20 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 rounded-lg bg-rose-100 dark:bg-red-500/20 text-rose-600 dark:text-red-400">
                <span className="material-symbols-outlined text-sm font-bold">
                  cancel
                </span>
              </div>
              <h4 className="text-rose-700 dark:text-red-400 font-bold text-xs">
                Kiêng kỵ
              </h4>
            </div>
            <div className="flex flex-col gap-1.5">
              {fengShuiData.ba?.map((activity, index) => (
                <p
                  key={index}
                  className="text-rose-700 dark:text-red-400 text-xs leading-relaxed"
                >
                  {activity}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Holidays Section */}
      {upcomingHolidays.length > 0 && (
        <div className="glass-panel-light dark:glass-panel-dark rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-500 dark:text-[#9cbab2] mb-4 uppercase tracking-widest">
            Sắp tới
          </h3>
          <div className="flex flex-col gap-3">
            {upcomingHolidays.map((holiday) => {
              const holidayColor = getHolidayColor(holiday.category, holiday.type, holiday.isImportant);
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
                    <p className="text-sm font-bold" style={{ color: '#1e293b' }}>
                      {holiday.name}
                    </p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
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
  );
}

// Hoàng Đạo Hours Section with scroll arrows
interface HoangDaoHoursSectionProps {
  hoangDaoHours: Array<{
    chi: string;
    timeRange: string;
    emoji: string;
  }>;
  theme: MonthTheme;
}

function HoangDaoHoursSection({ hoangDaoHours, theme }: HoangDaoHoursSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position
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
      scrollEl.addEventListener('scroll', checkScroll);
      // Also check on resize
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [hoangDaoHours]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 140; // Approximate width of one card
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <span
          className="material-symbols-outlined text-lg font-bold"
          style={{ color: theme.accentGold }}
        >
          schedule
        </span>
        <h3 className="text-[11px] font-black text-slate-500 dark:text-[#9cbab2] uppercase tracking-widest">
          Giờ Hoàng Đạo
        </h3>
      </div>
      
      {/* Scroll container with arrows */}
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            style={{ color: theme.primaryAccent }}
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
        )}
        
        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            style={{ color: theme.primaryAccent }}
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
