"use client";

import { useEffect, useState } from "react";
import { GIO_DIA_CHI, CON_GIAP } from "@/lib/lunar";
import type { MonthTheme } from "@/lib/theme";

interface GoodHoursSectionProps {
  hoangDaoHours: string[];
  theme?: MonthTheme;
  isTodayDate?: boolean;
  compact?: boolean;
  id?: string;
}

export function GoodHoursSection({
  hoangDaoHours,
  theme,
  isTodayDate = false,
  compact = false,
  id,
}: GoodHoursSectionProps) {
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    if (!isTodayDate) {
      setCurrentHour(null);
      return;
    }
    setCurrentHour(new Date().getHours());
  }, [isTodayDate]);

  const hoursInfo = GIO_DIA_CHI.map((gio, index) => {
    const isHoangDao = hoangDaoHours.includes(gio.chi);
    const zodiac = CON_GIAP[index];
    const isCurrent =
      currentHour !== null &&
      (gio.start === 23
        ? currentHour >= 23 || currentHour < 1
        : currentHour >= gio.start && currentHour < gio.end);

    return {
      ...gio,
      isHoangDao,
      isCurrent,
      emoji: zodiac.emoji,
      animal: zodiac.animal,
    };
  });

  const hoangDaoCount = hoursInfo.filter((h) => h.isHoangDao).length;
  const accent = theme?.primaryAccent || "#10b981";

  return (
    <section
      id={id}
      className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-lg scroll-mt-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>🕒 12 Canh Giờ Trong Ngày</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {hoangDaoCount} Giờ Hoàng Đạo (tốt) • {12 - hoangDaoCount} Giờ Hắc Đạo (nên tránh)
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70">
            ★ Hoàng Đạo
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            Hắc Đạo
          </span>
        </div>
      </div>

      <div
        className={`grid gap-2.5 ${
          compact
            ? "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6"
        }`}
      >
        {hoursInfo.map((hour) => (
          <div
            key={hour.chi}
            className={`relative flex flex-col items-center p-2.5 rounded-2xl border transition-all text-center ${
              hour.isHoangDao
                ? "bg-amber-50/70 border-amber-200/80 shadow-2xs"
                : "bg-slate-50/75 border-slate-200/50 opacity-80"
            }`}
            style={
              hour.isCurrent
                ? {
                    borderColor: accent,
                    boxShadow: `0 0 0 2px ${accent}33`,
                  }
                : undefined
            }
          >
            {hour.isCurrent && (
              <span
                className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-xs"
                style={{ backgroundColor: accent }}
              >
                Hiện tại
              </span>
            )}
            <span className="text-2xl select-none" aria-hidden="true">
              {hour.emoji}
            </span>
            <span
              className={`text-xs sm:text-sm font-extrabold mt-1 ${
                hour.isHoangDao ? "text-slate-900" : "text-slate-600"
              }`}
            >
              Giờ {hour.chi}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 tabular-nums mt-0.5">
              {hour.timeRange}
            </span>
            <span
              className={`mt-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                hour.isHoangDao
                  ? "bg-amber-500 text-white"
                  : "bg-slate-200/80 text-slate-600"
              }`}
            >
              {hour.isHoangDao ? "★ Hoàng Đạo" : "Hắc Đạo"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
