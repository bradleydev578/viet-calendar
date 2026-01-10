"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { LunarCalculator } from "@/lib/lunar";
import type { MonthTheme } from "@/lib/theme";

interface CalendarHeaderProps {
  currentDate: Date;
  theme: MonthTheme;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  theme,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const lunarDate = LunarCalculator.toLunar(currentDate);
  const yearInfo = LunarCalculator.getYearInfo(lunarDate.year);

  return (
    <div className="flex items-center gap-3">
      {/* Prev Month */}
      <button
        onClick={onPrevMonth}
        className="p-2 rounded-full hover:bg-white/60 transition-colors flex items-center justify-center group active:scale-95"
        style={{ color: theme.primaryAccent }}
      >
        <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform">
          chevron_left
        </span>
      </button>

      {/* Month & Year */}
      <div className="flex flex-col items-center min-w-[180px] lg:min-w-[220px]">
        <h2 className="text-xl lg:text-2xl font-extrabold text-slate-800 leading-none capitalize">
          {format(currentDate, "MMMM, yyyy", { locale: vi })}
        </h2>
        <p
          className="text-[10px] lg:text-xs font-bold uppercase tracking-wider mt-1"
          style={{ color: theme.primaryAccent }}
        >
          {theme.name} • {yearInfo.canChi.full}
        </p>
      </div>

      {/* Next Month */}
      <button
        onClick={onNextMonth}
        className="p-2 rounded-full hover:bg-white/60 transition-colors flex items-center justify-center group active:scale-95"
        style={{ color: theme.primaryAccent }}
      >
        <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">
          chevron_right
        </span>
      </button>
    </div>
  );
}
