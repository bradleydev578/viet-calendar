"use client";

import type { DayFengShuiData } from "@/lib/fengshui";
import type { MonthTheme } from "@/lib/theme";

interface InfoGridProps {
  fengShuiData: DayFengShuiData;
  theme?: MonthTheme;
}

export function InfoGrid({ fengShuiData, theme }: InfoGridProps) {
  const infoItems = [
    {
      icon: "🌿",
      label: "Tiết Khí",
      value: fengShuiData.tk || "—",
    },
    {
      icon: "📅",
      label: "12 Trực",
      value: fengShuiData.t12,
      badge: fengShuiData.t12g === 1 ? "Tốt" : "Xấu",
      badgeColor: fengShuiData.t12g === 1 ? "bg-emerald-500" : "bg-orange-500",
    },
    {
      icon: "💫",
      label: "Ngũ Hành",
      value: fengShuiData.nh,
    },
    {
      icon: "⭐",
      label: "28 Sao",
      value: fengShuiData.s28,
      badge: fengShuiData.s28g === 1 ? "Tốt" : "Xấu",
      badgeColor: fengShuiData.s28g === 1 ? "bg-emerald-500" : "bg-orange-500",
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-neutral-800 mb-3">
        📊 Thông Tin Chi Tiết
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs text-neutral-500 uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-neutral-800">{item.value}</p>
              {item.badge && (
                <span
                  className={`text-xs text-white px-2 py-0.5 rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Good/Bad Stars */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* Good Stars */}
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-xs text-emerald-600 uppercase tracking-wide mb-2">
            ✨ Sao Tốt
          </p>
          <div className="flex flex-wrap gap-1">
            {fengShuiData.gs && fengShuiData.gs.length > 0 ? (
              fengShuiData.gs.map((star, index) => (
                <span
                  key={index}
                  className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"
                >
                  {star}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400">Không có</span>
            )}
          </div>
        </div>

        {/* Bad Stars */}
        <div className="bg-red-50 rounded-xl p-4">
          <p className="text-xs text-red-600 uppercase tracking-wide mb-2">
            💀 Sao Xấu
          </p>
          <div className="flex flex-wrap gap-1">
            {fengShuiData.bs && fengShuiData.bs.length > 0 ? (
              fengShuiData.bs.map((star, index) => (
                <span
                  key={index}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full"
                >
                  {star}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400">Không có</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
