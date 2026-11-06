"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { LunarCalculator } from "@/lib/lunar";
import { formatDateString } from "@/lib/date-utils";
import type { MonthTheme } from "@/lib/theme";
import { MaterialIcon } from "@/components/common";

interface CalendarHeaderProps {
  currentDate: Date;
  theme: MonthTheme;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate?: (date: Date) => void;
  isMainHeading?: boolean;
}

const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const AVAILABLE_YEARS = [2025, 2026, 2027];

export function CalendarHeader({
  currentDate,
  theme,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  isMainHeading = false,
}: CalendarHeaderProps) {
  const HeadingTag = isMainHeading ? "h1" : "h2";
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"month" | "convert">("month");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Converter state
  const [convertDirection, setConvertDirection] = useState<"solarToLunar" | "lunarToSolar">("solarToLunar");
  const [inputDay, setInputDay] = useState(() => currentDate.getDate());
  const [inputMonth, setInputMonth] = useState(() => currentDate.getMonth() + 1);
  const [inputYear, setInputYear] = useState(() => currentDate.getFullYear());

  const lunarDate = useMemo(() => LunarCalculator.toLunar(currentDate), [currentDate]);
  const yearInfo = useMemo(() => LunarCalculator.getYearInfo(lunarDate.year), [lunarDate.year]);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Compute converted result
  const convertedResult = useMemo(() => {
    try {
      if (convertDirection === "solarToLunar") {
        const solar = new Date(inputYear, inputMonth - 1, inputDay, 12, 0, 0);
        if (
          solar.getFullYear() !== inputYear ||
          solar.getMonth() !== inputMonth - 1 ||
          solar.getDate() !== inputDay
        ) {
          return null;
        }
        const lunar = LunarCalculator.toLunar(solar);
        const yInfo = LunarCalculator.getYearInfo(lunar.year);
        const dayCanChi = LunarCalculator.getDayCanChi(solar);
        return {
          solarDate: solar,
          lunarDay: lunar.day,
          lunarMonth: lunar.month,
          lunarYear: lunar.year,
          isLeapMonth: lunar.isLeapMonth,
          yearCanChi: yInfo.canChi.full,
          dayCanChi: dayCanChi.full,
        };
      } else {
        const maxDays = LunarCalculator.getDaysInLunarMonth(inputYear, inputMonth, false);
        const safeDay = Math.min(inputDay, maxDays);
        const solar = LunarCalculator.toSolar({
          day: safeDay,
          month: inputMonth,
          year: inputYear,
          isLeapMonth: false,
        });
        const yInfo = LunarCalculator.getYearInfo(inputYear);
        const dayCanChi = LunarCalculator.getDayCanChi(solar);
        return {
          solarDate: new Date(solar.getFullYear(), solar.getMonth() - 1, solar.getDate(), 12, 0, 0),
          lunarDay: safeDay,
          lunarMonth: inputMonth,
          lunarYear: inputYear,
          isLeapMonth: false,
          yearCanChi: yInfo.canChi.full,
          dayCanChi: dayCanChi.full,
        };
      }
    } catch {
      return null;
    }
  }, [convertDirection, inputDay, inputMonth, inputYear]);

  const handleJumpToMonth = (monthIndex: number, year: number) => {
    const newDate = new Date(year, monthIndex, 1, 12, 0, 0);
    if (onSelectDate) {
      onSelectDate(newDate);
    } else {
      router.push(`/day/${formatDateString(newDate)}`);
    }
    setIsOpen(false);
  };

  const handleGoToConvertedDate = () => {
    if (!convertedResult) return;
    if (onSelectDate) {
      onSelectDate(convertedResult.solarDate);
    } else {
      router.push(`/day/${formatDateString(convertedResult.solarDate)}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center gap-3" ref={popoverRef}>
      {/* Prev Month */}
      <button
        type="button"
        onClick={onPrevMonth}
        aria-label="Tháng trước"
        className="p-2 rounded-full hover:bg-white/60 transition-colors flex items-center justify-center group active:scale-95"
        style={{ color: theme.primaryAccent }}
      >
        <MaterialIcon
          name="chevron_left"
          className="text-2xl group-hover:-translate-x-0.5 transition-transform"
        />
      </button>

      {/* Month & Year Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Chọn tháng năm hoặc đổi ngày Âm Dương"
        className="flex flex-col items-center min-w-[180px] lg:min-w-[220px] px-3 py-1 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-1">
          <HeadingTag className="text-xl lg:text-2xl font-extrabold text-slate-800 leading-none capitalize">
            {format(currentDate, "MMMM, yyyy", { locale: vi })}
          </HeadingTag>
          <MaterialIcon
            name="expand_more"
            className={`text-slate-500 text-[18px] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        <p
          className="text-[10px] lg:text-xs font-bold uppercase tracking-wider mt-1"
          style={{ color: theme.primaryAccent }}
        >
          {theme.name} • {yearInfo.canChi.full}
        </p>
      </button>

      {/* Next Month */}
      <button
        type="button"
        onClick={onNextMonth}
        aria-label="Tháng sau"
        className="p-2 rounded-full hover:bg-white/60 transition-colors flex items-center justify-center group active:scale-95"
        style={{ color: theme.primaryAccent }}
      >
        <MaterialIcon
          name="chevron_right"
          className="text-2xl group-hover:translate-x-0.5 transition-transform"
        />
      </button>

      {/* Quick Picker & Lunar-Solar Converter Popover */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-[310px] sm:w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 p-4 text-left">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-3">
            <button
              type="button"
              onClick={() => setActiveTab("month")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "month"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Chọn Tháng/Năm
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("convert")}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "convert"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Đổi Ngày Âm ↔ Dương
            </button>
          </div>

          {activeTab === "month" ? (
            <div className="space-y-3">
              {/* Year selector */}
              <div className="flex items-center justify-center gap-2">
                {AVAILABLE_YEARS.map((yr) => {
                  const isCurrentYr = currentDate.getFullYear() === yr;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleJumpToMonth(currentDate.getMonth(), yr)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isCurrentYr
                          ? "text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      style={isCurrentYr ? { backgroundColor: theme.primaryAccent } : {}}
                    >
                      Năm {yr}
                    </button>
                  );
                })}
              </div>

              {/* 12 Months grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS.map((mLabel, idx) => {
                  const isSelectedMonth = currentDate.getMonth() === idx;
                  return (
                    <button
                      key={mLabel}
                      type="button"
                      onClick={() => handleJumpToMonth(idx, currentDate.getFullYear())}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelectedMonth
                          ? "text-white font-bold shadow-sm"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                      style={isSelectedMonth ? { backgroundColor: theme.primaryAccent } : {}}
                    >
                      {mLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Direction Toggle */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setConvertDirection("solarToLunar")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                    convertDirection === "solarToLunar"
                      ? "border-transparent text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  style={
                    convertDirection === "solarToLunar"
                      ? { backgroundColor: theme.primaryAccent }
                      : {}
                  }
                >
                  Dương → Âm
                </button>
                <button
                  type="button"
                  onClick={() => setConvertDirection("lunarToSolar")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                    convertDirection === "lunarToSolar"
                      ? "border-transparent text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  style={
                    convertDirection === "lunarToSolar"
                      ? { backgroundColor: theme.primaryAccent }
                      : {}
                  }
                >
                  Âm → Dương
                </button>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Ngày
                  </label>
                  <select
                    aria-label="Chọn ngày"
                    value={inputDay}
                    onChange={(e) => setInputDay(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        Ngày {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Tháng
                  </label>
                  <select
                    aria-label="Chọn tháng"
                    value={inputMonth}
                    onChange={(e) => setInputMonth(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Năm
                  </label>
                  <select
                    aria-label="Chọn năm"
                    value={inputYear}
                    onChange={(e) => setInputYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                  >
                    {Array.from({ length: 81 }, (_, i) => 1960 + i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result Box */}
              {convertedResult ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Dương lịch:</span>
                    <span className="font-bold text-slate-800">
                      {format(convertedResult.solarDate, "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Âm lịch:</span>
                    <span className="font-bold" style={{ color: theme.primaryAccent }}>
                      {convertedResult.lunarDay}/{convertedResult.lunarMonth}/
                      {convertedResult.lunarYear}
                      {convertedResult.isLeapMonth ? " (Nhuận)" : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                    <span>Ngày {convertedResult.dayCanChi}</span>
                    <span>Năm {convertedResult.yearCanChi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoToConvertedDate}
                    className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: theme.primaryAccent }}
                  >
                    Xem chi tiết ngày này →
                  </button>
                </div>
              ) : (
                <p className="text-xs text-rose-600 text-center py-2">
                  Ngày không hợp lệ, vui lòng chọn lại.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
