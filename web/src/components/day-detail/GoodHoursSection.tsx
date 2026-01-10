"use client";

import { GIO_DIA_CHI, CON_GIAP } from "@/lib/lunar";
import type { MonthTheme } from "@/lib/theme";

interface GoodHoursSectionProps {
  hoangDaoHours: string[];
  theme?: MonthTheme;
}

export function GoodHoursSection({ hoangDaoHours, theme }: GoodHoursSectionProps) {
  // Map hours to their info
  const hoursInfo = GIO_DIA_CHI.map((gio, index) => {
    const isHoangDao = hoangDaoHours.includes(gio.chi);
    const zodiac = CON_GIAP[index];
    return {
      ...gio,
      isHoangDao,
      emoji: zodiac.emoji,
      animal: zodiac.animal,
    };
  });

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-neutral-800">
          ☀️ Giờ Tốt Trong Ngày
        </h2>
        <span className="text-xs text-neutral-500">
          Giờ Hoàng Đạo được đánh dấu
        </span>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {hoursInfo.map((hour) => (
            <div
              key={hour.chi}
              className={`
                flex flex-col items-center p-2 rounded-xl transition-all
                ${
                  hour.isHoangDao
                    ? "border-2"
                    : "bg-neutral-50"
                }
              `}
              style={hour.isHoangDao && theme ? {
                backgroundColor: `${theme.primaryAccent}15`,
                borderColor: `${theme.primaryAccent}40`,
              } : {}}
            >
              <span className="text-2xl">{hour.emoji}</span>
              <span
                className={`text-sm font-medium mt-1 ${
                  hour.isHoangDao ? "text-slate-800" : "text-neutral-700"
                }`}
                style={hour.isHoangDao && theme ? { color: theme.primaryAccent } : {}}
              >
                {hour.chi}
              </span>
              <span className="text-xs text-neutral-500">{hour.timeRange}</span>
              {hour.isHoangDao && (
                <span
                  className="mt-1 text-xs text-white px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: theme?.primaryAccent || '#10b981' }}
                >
                  Tốt
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
