"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { format, isToday } from "date-fns";
import { LunarCalculator, WEEKDAY_NAMES } from "@/lib/lunar";
import { HolidayRepository } from "@/lib/holidays";
import { UniversalDayCalculator } from "@/lib/fengshui/UniversalDayCalculator";
import { DayScore } from "@/lib/fengshui";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import type { MonthTheme } from "@/lib/theme";
import { DayDetailSections } from "@/components/day-detail/DayDetailSections";
import { MaterialIcon } from "@/components/common";
import { trackDateView } from "@/lib/firebase/analytics";

interface DayDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  theme: MonthTheme;
  fengShuiData: DayFengShuiData | null;
  onSelectDate: (date: Date) => void;
  scrollTarget?: "top" | "hours";
}

export function DayDetailDrawer({
  isOpen,
  onClose,
  selectedDate,
  theme,
  fengShuiData,
  onSelectDate,
  scrollTarget = "top",
}: DayDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [entered, setEntered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const isTodayDate = isToday(selectedDate);

  const effectiveFengShuiData = useMemo(
    () => fengShuiData || UniversalDayCalculator.calculate(selectedDate),
    [fengShuiData, selectedDate]
  );

  const lunarDate = useMemo(
    () => LunarCalculator.toLunar(selectedDate),
    [selectedDate]
  );
  const yearInfo = useMemo(
    () => LunarCalculator.getYearInfo(lunarDate.year),
    [lunarDate.year]
  );
  const dayHolidays = useMemo(
    () => HolidayRepository.getByDate(selectedDate),
    [selectedDate]
  );
  const scoreResult = useMemo(
    () => DayScore.calculate(effectiveFengShuiData),
    [effectiveFengShuiData]
  );

  const weekday = WEEKDAY_NAMES[selectedDate.getDay()];
  const isHoangDao = effectiveFengShuiData.t12g === 1;

  const prevDate = useMemo(
    () =>
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() - 1,
        12,
        0,
        0
      ),
    [selectedDate]
  );

  const nextDate = useMemo(
    () =>
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + 1,
        12,
        0,
        0
      ),
    [selectedDate]
  );

  // Trigger smooth entrance animation, lock body scroll, and handle Escape key
  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }

    const frame = requestAnimationFrame(() => setEntered(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Analytics & scroll target handling when opened or date changes
  useEffect(() => {
    if (!isOpen) return;

    trackDateView(dateKey, `${lunarDate.day}/${lunarDate.month}`);

    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (scrollTarget === "hours") {
        const hoursEl = container.querySelector("#drawer-gio-hoang-dao");
        if (hoursEl) {
          hoursEl.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      container.scrollTo({ top: 0, behavior: "smooth" });
    }, 90);

    return () => clearTimeout(timer);
  }, [isOpen, dateKey, scrollTarget, lunarDate.day, lunarDate.month]);

  if (!isOpen) {
    return null;
  }

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/day/${dateKey}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard permission unavailable
    }
  };

  const plaqueGradient = `linear-gradient(135deg, ${theme.primaryAccent} 0%, ${
    theme.darkAccent || theme.primaryHover
  } 100%)`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết ngày ${format(selectedDate, "dd/MM/yyyy")}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-200 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel: Bottom Sheet on Mobile, Right Slide-over on Desktop */}
      <div
        className={`relative z-10 w-full sm:max-w-2xl h-[92dvh] sm:h-full rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl shadow-2xl border-t sm:border-t-0 sm:border-l border-white/80 flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          entered
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-y-0 sm:translate-x-full"
        }`}
        style={{ backgroundColor: theme.background }}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 bg-white/90 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Sticky Drawer Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/70 px-4 sm:px-6 py-3.5 shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-md shrink-0"
                style={{ background: plaqueGradient }}
              >
                <span className="text-lg leading-none">
                  {String(selectedDate.getDate()).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-bold uppercase opacity-90 mt-0.5">
                  T{selectedDate.getMonth() + 1}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                    {weekday}, {format(selectedDate, "dd/MM/yyyy")}
                  </h2>
                  {isTodayDate && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white"
                      style={{ backgroundColor: theme.primaryAccent }}
                    >
                      HÔM NAY
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600 mt-0.5">
                  <span className="font-bold text-amber-700">
                    {lunarDate.day}/{lunarDate.month} Âm
                    {effectiveFengShuiData.lp ? " (Nhuận)" : ""}
                  </span>
                  <span>•</span>
                  <span className="font-semibold">
                    Ngày {effectiveFengShuiData.dgz}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-slate-500">
                    Năm {yearInfo.canChi.full}
                  </span>
                  <span>•</span>
                  <span
                    className={`font-extrabold ${
                      isHoangDao ? "text-amber-700" : "text-slate-600"
                    }`}
                  >
                    {isHoangDao ? "★ Hoàng Đạo" : "Hắc Đạo"} ({scoreResult.score}đ)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng chi tiết ngày"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <MaterialIcon name="close" className="text-xl" />
            </button>
          </div>

          {/* Quick Day Stepper & Link Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectDate(prevDate)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                ← {format(prevDate, "dd/MM")}
              </button>
              {!isTodayDate && (
                <button
                  type="button"
                  onClick={() => onSelectDate(new Date())}
                  className="px-2.5 py-1.5 rounded-xl text-white text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  Hôm nay
                </button>
              )}
              <button
                type="button"
                onClick={() => onSelectDate(nextDate)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {format(nextDate, "dd/MM")} →
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {copied ? "✓ Đã chép" : "🔗 Chép link"}
              </button>
              <Link
                href={`/day/${dateKey}`}
                prefetch={false}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-white shadow-xs transition-opacity hover:opacity-95"
                style={{ backgroundColor: theme.primaryAccent }}
              >
                Mở trang riêng ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5"
        >
          {/* Holidays on this date */}
          {dayHolidays.length > 0 && (
            <div className="space-y-2">
              {dayHolidays.map((h) => (
                <div
                  key={h.id}
                  className="px-4 py-3 rounded-2xl bg-red-50/95 border border-red-200/80 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-red-700">
                      🎉 {h.name}
                    </span>
                    {h.vacationBadge && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {h.vacationBadge}
                      </span>
                    )}
                  </div>
                  {h.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {h.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Full Detailed Sections (Score Breakdown, 12 Canh Giờ, Ngọc Hạp, Stars, Directions) */}
          <DayDetailSections
            fengShuiData={effectiveFengShuiData}
            theme={theme}
            isTodayDate={isTodayDate}
            compact
            hoursSectionId="drawer-gio-hoang-dao"
          />

          {/* Bottom Navigation Footer */}
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-4 border border-white/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/day/${dateKey}`}
              prefetch={false}
              className="text-xs font-extrabold hover:underline"
              style={{ color: theme.primaryAccent }}
            >
              Xem trang đầy đủ ngày {format(selectedDate, "dd/MM/yyyy")} →
            </Link>
            <Link
              href="/xem-ngay-tot"
              className="text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Tìm ngày tốt hợp tuổi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
