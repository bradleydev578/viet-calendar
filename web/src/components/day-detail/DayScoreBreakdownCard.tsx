"use client";

import { useMemo } from "react";
import { DayScore } from "@/lib/fengshui";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import type { MonthTheme } from "@/lib/theme";
import { DayScoreCircle } from "@/components/common/DayScoreCircle";

interface DayScoreBreakdownCardProps {
  fengShuiData: DayFengShuiData;
  theme: MonthTheme;
  compact?: boolean;
}

const DAI_KY_STARS = new Set([
  "Tam Nương",
  "Nguyệt Kỵ",
  "Dương Công Kỵ",
  "Thụ tử",
  "Sát chủ",
  "Nguyệt phá",
]);

function formatDelta(val: number): string {
  if (val > 0) return `+${val}đ`;
  if (val < 0) return `${val}đ`;
  return "0đ";
}

export function DayScoreBreakdownCard({
  fengShuiData,
  theme,
  compact = false,
}: DayScoreBreakdownCardProps) {
  const scoreResult = useMemo(
    () => DayScore.calculate(fengShuiData),
    [fengShuiData]
  );

  const isHoangDao = fengShuiData.t12g === 1;
  const daiKyList = useMemo(
    () => (fengShuiData.bs || []).filter((s) => DAI_KY_STARS.has(s)),
    [fengShuiData.bs]
  );

  const qualityDesc = useMemo(() => {
    switch (scoreResult.quality) {
      case "excellent":
        return "Ngày đại cát, rất thuận lợi cho hầu hết các việc trọng đại.";
      case "good":
        return "Ngày khá tốt, thuận lợi triển khai công việc quan trọng theo giờ đẹp.";
      case "normal":
        return "Ngày trung bình: có cát tinh nâng đỡ nhưng vẫn có yếu tố cần lưu ý.";
      case "bad":
        return "Ngày chưa thuận, nên cân nhắc chọn ngày khác cho việc đại sự.";
      case "very_bad":
        return "Ngày nhiều hung tinh, chỉ nên làm việc thường nhật và giữ tâm an.";
    }
  }, [scoreResult.quality]);

  const factors = useMemo(() => {
    const b = scoreResult.breakdown;
    return [
      {
        label: `12 Trực (${fengShuiData.t12})`,
        sub: isHoangDao ? "Ngày Hoàng Đạo" : "Ngày Hắc Đạo",
        delta: b.truc12,
      },
      {
        label: `28 Sao (${fengShuiData.s28})`,
        sub: fengShuiData.s28g === 1 ? "Nhị Thập Bát Tú Cát" : "Nhị Thập Bát Tú Hung",
        delta: b.star28,
      },
      {
        label: `Sao tốt (${fengShuiData.gs?.length || 0})`,
        sub:
          fengShuiData.gs && fengShuiData.gs.length > 0
            ? fengShuiData.gs.slice(0, 2).join(", ")
            : "Không có cát tinh",
        delta: b.goodStars,
      },
      {
        label: `Sao xấu (${fengShuiData.bs?.length || 0})`,
        sub:
          daiKyList.length > 0
            ? `Có Đại Kỵ: ${daiKyList.join(", ")}`
            : fengShuiData.bs && fengShuiData.bs.length > 0
            ? fengShuiData.bs.slice(0, 2).join(", ")
            : "Ít hung tinh",
        delta: b.badStars,
      },
      {
        label: `Việc nên / kiêng`,
        sub: `${fengShuiData.ga?.length || 0} nên • ${fengShuiData.ba?.length || 0} kiêng`,
        delta: b.goodActivities + b.badActivities,
      },
      {
        label: `Giờ Hoàng Đạo (${fengShuiData.hd?.length || 0})`,
        sub: "Nâng đỡ khởi sự trong ngày",
        delta: b.hoangDaoHours,
      },
    ];
  }, [scoreResult.breakdown, fengShuiData, isHoangDao, daiKyList]);

  return (
    <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="shrink-0 bg-slate-50/90 rounded-2xl p-2 border border-slate-100">
            <DayScoreCircle score={scoreResult.score} size={compact ? 74 : 84} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                  isHoangDao
                    ? "bg-amber-100 text-amber-900 border border-amber-300/60"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {isHoangDao ? "★ Hoàng Đạo" : "• Hắc Đạo"}
              </span>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: `${theme.primaryAccent}14`,
                  color: theme.primaryAccent,
                }}
              >
                {DayScore.getQualityLabel(scoreResult.quality)} ({scoreResult.score}/100đ)
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1.5">
              Phân Tích Điểm Phong Thủy Ngày
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
              {qualityDesc}
            </p>
          </div>
        </div>
      </div>

      {daiKyList.length > 0 && (
        <div className="mt-3.5 px-3.5 py-2.5 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-xs text-rose-800 flex items-start gap-2">
          <span className="shrink-0 font-bold">⚠️ Lưu ý Đại Kỵ:</span>
          <span>
            Ngày phạm <strong>{daiKyList.join(", ")}</strong> nên điểm tối đa được giới hạn ở{" "}
            <strong>62đ</strong>; cần thận trọng khi làm việc đại sự.
          </span>
        </div>
      )}

      {fengShuiData.sc && (
        <div className="mt-3.5 px-3.5 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900">
          <span className="font-extrabold">📌 Ghi chú đặc biệt: </span>
          <span>{fengShuiData.sc}</span>
        </div>
      )}

      {/* Breakdown Grid */}
      <div
        className={`mt-4 grid gap-2 ${
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {factors.map((item) => {
          const isPos = item.delta > 0;
          const isNeg = item.delta < 0;
          return (
            <div
              key={item.label}
              className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/60 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-slate-800 truncate">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {item.sub}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-lg text-[11px] font-black shrink-0 tabular-nums ${
                  isPos
                    ? "bg-emerald-100 text-emerald-800"
                    : isNeg
                    ? "bg-rose-100 text-rose-800"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {formatDelta(item.delta)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-slate-400">
        Điểm chuẩn bắt đầu từ 50đ, cộng/trừ theo Ngọc Hạp Thông Thư & Hiệp Kỷ Biện Phương Thư.
      </p>
    </section>
  );
}
