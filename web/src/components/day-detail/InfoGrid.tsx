"use client";

import type { DayFengShuiData } from "@/lib/fengshui";
import type { MonthTheme } from "@/lib/theme";

interface InfoGridProps {
  fengShuiData: DayFengShuiData;
  theme?: MonthTheme;
}

export function InfoGrid({ fengShuiData }: InfoGridProps) {
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
      badge: fengShuiData.t12g === 1 ? "Hoàng Đạo" : "Hắc Đạo",
      badgeColor: fengShuiData.t12g === 1 ? "bg-emerald-600" : "bg-amber-600",
    },
    {
      icon: "💧",
      label: "Ngũ Hành Nạp Âm",
      value: fengShuiData.nh || "—",
    },
    {
      icon: "⭐",
      label: "Nhị Thập Bát Tú (28 Sao)",
      value: fengShuiData.s28,
      badge: fengShuiData.s28g === 1 ? "Cát Tú" : "Hung Tú",
      badgeColor: fengShuiData.s28g === 1 ? "bg-emerald-600" : "bg-rose-600",
    },
  ];

  return (
    <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
          📊 Thần Sát & Thông Số Chi Tiết
        </h2>
        <span className="text-[11px] font-semibold text-slate-400">
          Ngọc Hạp Thông Thư
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/60"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-base">{item.icon}</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="text-sm sm:text-base font-extrabold text-slate-900">
                {item.value}
              </p>
              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold text-white px-2.5 py-0.5 rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Conflicting Ages (Tuổi xung khắc) */}
      {fengShuiData.age && fengShuiData.age.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/60 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
            ⚡ Tuổi Xung Khắc Trong Ngày
          </div>
          <div className="flex flex-wrap gap-1.5">
            {fengShuiData.age.map((a, idx) => (
              <span
                key={idx}
                className="text-xs font-bold bg-white text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200/70"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Full Good/Bad Stars (Never truncated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/60">
          <p className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider mb-2">
            ✨ Sao Tốt ({fengShuiData.gs?.length || 0})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fengShuiData.gs && fengShuiData.gs.length > 0 ? (
              fengShuiData.gs.map((star, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold bg-white text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-200/60"
                >
                  {star}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Không có cát tinh nổi bật</span>
            )}
          </div>
        </div>

        <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200/60">
          <p className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider mb-2">
            💀 Sao Xấu ({fengShuiData.bs?.length || 0})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fengShuiData.bs && fengShuiData.bs.length > 0 ? (
              fengShuiData.bs.map((star, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold bg-white text-rose-800 px-2.5 py-1 rounded-xl border border-rose-200/60"
                >
                  {star}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Không có hung tinh đáng ngại</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
