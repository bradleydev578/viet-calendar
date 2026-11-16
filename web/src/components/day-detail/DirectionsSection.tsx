"use client";

import type { Direction } from "@/lib/fengshui";
import type { MonthTheme } from "@/lib/theme";

interface DirectionsSectionProps {
  directions: Direction[];
  theme?: MonthTheme;
}

const DIRECTION_HINTS: Record<string, string> = {
  "hỷ": "Hướng đón tin vui, cưới hỏi, cầu duyên, gặp gỡ quý nhân",
  "tài": "Hướng cầu tài lộc, khai trương, giao dịch, ký kết hợp đồng",
  "hạc": "Hướng nên tránh khi xuất hành (Hạc Thần du hành)",
};

function getDirectionHint(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, hint] of Object.entries(DIRECTION_HINTS)) {
    if (lower.includes(key)) return hint;
  }
  return null;
}

export function DirectionsSection({ directions }: DirectionsSectionProps) {
  const renderStars = (rating: number = 3) => {
    return (
      <div className="flex gap-0.5" aria-label={`Đánh giá ${rating} trên 5 sao`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-amber-400" : "text-slate-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
          🧭 Phương Hướng Xuất Hành
        </h2>
        <span className="text-[11px] font-semibold text-slate-400">
          Theo Khổng Minh Lục Diệu
        </span>
      </div>

      <div className="space-y-2.5">
        {directions.map((dir, index) => {
          const hint = getDirectionHint(dir.n);
          const isHacThan = dir.n.toLowerCase().includes("hạc");
          return (
            <div
              key={index}
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${
                isHacThan
                  ? "bg-rose-50/50 border-rose-200/60"
                  : "bg-slate-50/90 border-slate-200/60"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-slate-800">
                    {dir.n}:
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      isHacThan ? "text-rose-700" : "text-slate-900"
                    }`}
                  >
                    {dir.d}
                  </span>
                </div>
                {hint && (
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {hint}
                  </p>
                )}
              </div>
              <div className="shrink-0">{renderStars(dir.r)}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
