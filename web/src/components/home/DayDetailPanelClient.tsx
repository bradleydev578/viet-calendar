"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { LunarCalculator, WEEKDAY_NAMES, GIO_DIA_CHI, CON_GIAP } from "@/lib/lunar";
import { HolidayRepository, getHolidayColor } from "@/lib/holidays";
import type { MonthTheme } from "@/lib/theme";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import { MaterialIcon } from "@/components/common";

interface DayDetailPanelClientProps {
  selectedDate: Date;
  theme: MonthTheme;
  fengShuiData: DayFengShuiData | null;
  isLoading: boolean;
}

export function DayDetailPanelClient({
  selectedDate,
  theme,
  fengShuiData,
  isLoading,
}: DayDetailPanelClientProps) {
  const lunarDate = useMemo(
    () => LunarCalculator.toLunar(selectedDate),
    [selectedDate]
  );
  const yearInfo = useMemo(
    () => LunarCalculator.getYearInfo(lunarDate.year),
    [lunarDate.year]
  );

  // Holidays occurring on selectedDate
  const selectedDateHolidays = useMemo(() => {
    return HolidayRepository.getByDate(selectedDate);
  }, [selectedDate]);

  // Get upcoming holidays (next 5) relative to selectedDate
  const upcomingHolidays = useMemo(() => {
    return HolidayRepository.getUpcomingFromDate(selectedDate, 5);
  }, [selectedDate]);

  const weekday = WEEKDAY_NAMES[selectedDate.getDay()];
  const isHoangDao = fengShuiData?.t12g === 1;

  // Get hoàng đạo hours with zodiac info (all hours, not just first 3)
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
      <div className="flex-1 min-w-[300px] max-w-[380px] flex flex-col gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide pt-1">
        <div className="glass-panel-light rounded-2xl p-5 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[300px] max-w-[380px] flex flex-col gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide pt-1">
      {/* Date Info Card - Clickable to detail page */}
      <Link href={`/day/${format(selectedDate, "yyyy-MM-dd")}`} prefetch={false}>
        <div
          className="glass-panel-light rounded-2xl lg:rounded-3xl p-5 lg:p-6 relative overflow-hidden group shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
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
                className="text-xs font-semibold opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
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

      {/* Hoàng Đạo Hours */}
      {hoangDaoHours.length > 0 && (
        <HoangDaoHoursSection hoangDaoHours={hoangDaoHours} theme={theme} />
      )}

      {/* Good/Bad Activities */}
      {fengShuiData && (
        <div className="grid grid-cols-1 gap-3">
          {/* Good activities */}
          <div className="bg-white/80 rounded-xl lg:rounded-2xl p-4 border border-emerald-100 shadow-sm">
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

          {/* Bad activities */}
          <div className="bg-white/80 rounded-xl lg:rounded-2xl p-4 border border-rose-100 shadow-sm">
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

      {/* Upcoming Holidays Section */}
      {upcomingHolidays.length > 0 && (
        <div className="glass-panel-light rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
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
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {holiday.name}
                    </p>
                    <p className="text-xs text-slate-500">
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

function HoangDaoHoursSection({
  hoangDaoHours,
  theme,
}: HoangDaoHoursSectionProps) {
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

      {/* Scroll container with arrows */}
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Cuộn giờ hoàng đạo sang trái"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            style={{ color: theme.primaryAccent }}
          >
            <MaterialIcon name="chevron_left" className="text-[18px]" />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Cuộn giờ hoàng đạo sang phải"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            style={{ color: theme.primaryAccent }}
          >
            <MaterialIcon name="chevron_right" className="text-[18px]" />
          </button>
        )}

        {/* Scrollable content */}
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
