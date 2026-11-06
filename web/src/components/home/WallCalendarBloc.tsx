"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { LunarCalculator, WEEKDAY_NAMES } from "@/lib/lunar";
import { DayScore } from "@/lib/fengshui";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import type { MonthTheme } from "@/lib/theme";
import { HolidayRepository } from "@/lib/holidays";
import { fetchQuoteOfTheDay } from "@/lib/quotes/client";

const quoteCache = new Map<string, string>();

interface WallCalendarBlocProps {
  selectedDate: Date;
  theme: MonthTheme;
  fengShuiData: DayFengShuiData | null;
  quote?: string;
  onSelectDate?: (date: Date) => void;
  showDetailLink?: boolean;
  isMainHeading?: boolean;
}

function getLunarMonthName(lunarMonth: number, isLeap?: number): string {
  const leapSuffix = isLeap ? " (Nhuận)" : "";
  if (lunarMonth === 1) return `THÁNG GIÊNG${leapSuffix}`;
  if (lunarMonth === 12) return `THÁNG CHẠP${leapSuffix}`;
  return `THÁNG ${lunarMonth} ÂM${leapSuffix}`;
}

export function WallCalendarBloc({
  selectedDate,
  theme,
  fengShuiData,
  quote,
  onSelectDate,
  showDetailLink = true,
  isMainHeading = false,
}: WallCalendarBlocProps) {
  const [isTearing, setIsTearing] = useState(false);
  const [dynamicQuote, setDynamicQuote] = useState<string | undefined>(quote);

  const dateKey = format(selectedDate, "yyyy-MM-dd");

  // Trigger subtle paper-tear animation and fetch quote for selectedDate whenever it changes
  useEffect(() => {
    setIsTearing(true);
    const timer = setTimeout(() => setIsTearing(false), 380);

    const cached = quoteCache.get(dateKey);
    if (cached) {
      setDynamicQuote(cached);
    } else {
      let cancelled = false;
      fetchQuoteOfTheDay(selectedDate).then((res) => {
        if (!cancelled && res?.text) {
          quoteCache.set(dateKey, res.text);
          setDynamicQuote(res.text);
        }
      });
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, [dateKey, selectedDate]);

  const lunarDate = useMemo(
    () => LunarCalculator.toLunar(selectedDate),
    [selectedDate]
  );
  const yearInfo = useMemo(
    () => LunarCalculator.getYearInfo(lunarDate.year),
    [lunarDate.year]
  );

  const dayScoreResult = useMemo(() => {
    if (!fengShuiData) return null;
    return DayScore.calculate(fengShuiData);
  }, [fengShuiData]);

  const dayHolidays = useMemo(
    () => HolidayRepository.getByDate(selectedDate),
    [selectedDate]
  );

  const weekday = WEEKDAY_NAMES[selectedDate.getDay()];
  const isHoangDao = fengShuiData?.t12g === 1;
  const scoreValue = dayScoreResult?.score ?? fengShuiData?.score ?? (isHoangDao ? 82 : 58);

  const dayCanChi = fengShuiData?.dgz || "—";
  const monthCanChi = fengShuiData?.mgz || "—";
  const yearCanChi = fengShuiData?.ygz || yearInfo.canChi.full;

  const hyThanDir = useMemo(() => {
    const found = fengShuiData?.dir?.find((d) =>
      d.n.toLowerCase().includes("hỷ")
    );
    return found?.d || "Đông Bắc";
  }, [fengShuiData]);

  const taiThanDir = useMemo(() => {
    const found = fengShuiData?.dir?.find((d) =>
      d.n.toLowerCase().includes("tài")
    );
    return found?.d || "Đông Nam";
  }, [fengShuiData]);

  const thirdBoxInfo = useMemo(() => {
    const hacThan = fengShuiData?.dir?.find((d) =>
      d.n.toLowerCase().includes("hạc")
    );
    if (hacThan?.d) {
      return { label: "Hạc Thần", value: hacThan.d };
    }
    if (fengShuiData?.age && fengShuiData.age.length > 0) {
      return {
        label: "Tuổi xung",
        value: fengShuiData.age.slice(0, 2).join(", "),
      };
    }
    return { label: "Nạp Âm", value: (fengShuiData?.nh || "Bình hòa").split(" ").slice(-2).join(" ") };
  }, [fengShuiData]);

  const goodStarsText = useMemo(() => {
    if (fengShuiData?.gs && fengShuiData.gs.length > 0) {
      return fengShuiData.gs.slice(0, 2).join(" • ");
    }
    return isHoangDao ? "Thiên Đức • Ngọc Đường" : "Cẩn trọng việc lớn";
  }, [fengShuiData, isHoangDao]);

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

  const plaqueGradient = `linear-gradient(135deg, ${theme.primaryAccent} 0%, ${
    theme.darkAccent || theme.primaryHover
  } 100%)`;

  const HeadingTag = isMainHeading ? "h1" : "h2";

  return (
    <div className="bg-white/95 rounded-[2rem] shadow-2xl border-2 border-white overflow-hidden relative h-full flex flex-col justify-between">
      {/* Hanging Gold Cord at Top */}
      <div className="flex justify-center pt-2.5 pb-1 bg-slate-900/5">
        <div className="w-14 h-3 rounded-full gold-emboss shadow-md flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
        </div>
      </div>

      {/* Upper Seasonal Plaque (Khánh Lịch Treo Tường) */}
      <div
        className="px-5 pt-4 pb-16 text-white relative overflow-hidden transition-all duration-500"
        style={{ background: plaqueGradient }}
      >
        <div
          className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 blur-xl"
          style={{ background: "#FBBF24" }}
        />
        <div
          className="absolute right-4 top-3 text-4xl opacity-80 select-none pointer-events-none"
          aria-hidden="true"
        >
          {theme.motif || "🌸"}
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-black/25 text-amber-200 border border-amber-300/30">
              {theme.seasonBadge || "BỐN MÙA AN LÀNH"}
              {fengShuiData?.tk ? ` • ${fengShuiData.tk.toUpperCase()}` : ""}
            </span>
            <HeadingTag className="serif-display italic font-black text-2xl sm:text-3xl mt-1 leading-tight">
              Tháng {selectedDate.getMonth() + 1}, {selectedDate.getFullYear()}
            </HeadingTag>
            <p className="text-xs text-white/85 font-medium mt-0.5">
              {theme.name} • Năm {yearCanChi}
            </p>
          </div>
          <div className="text-right mt-4">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg ${
                isHoangDao
                  ? "gold-emboss text-slate-950"
                  : "bg-black/35 text-amber-100 border border-white/25"
              }`}
            >
              {isHoangDao ? "★ HOÀNG ĐẠO" : "• HẮC ĐẠO"} ({scoreValue}đ)
            </span>
          </div>
        </div>
      </div>

      {/* Tear-Off Paper Sheet (Tờ Lịch Bloc Đang Mở) */}
      <div
        className={`tear-sheet-container mx-4 sm:mx-5 -mt-12 bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 paper-stack border border-amber-200/70 relative z-20 flex-1 flex flex-col justify-between ${
          isTearing ? "tear-anim" : ""
        }`}
      >
        {/* Perforation Line (Đường răng cưa xé lịch) */}
        <div className="border-b-2 border-dashed border-slate-200 pb-2.5 mb-2 flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
          <span>DƯƠNG LỊCH</span>
          <span
            className="text-sm font-black tracking-wide"
            style={{ color: theme.primaryAccent }}
          >
            {weekday.toUpperCase()}
          </span>
          <span>ÂM LỊCH</span>
        </div>

        {/* Big Center Numbers (Tall 06 & 28 without colliding vertical borders) */}
        <div className="hero-three-cols py-4 sm:py-6 my-auto">
          {/* Left: Can Chi 3 Trụ */}
          <div className="text-left space-y-1.5 pr-2 py-2 border-r border-slate-200/80">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              CAN CHI
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">
              {dayCanChi}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Tháng {monthCanChi}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Năm {yearCanChi}
            </div>
          </div>

          {/* Center: Huge Solar Day */}
          <div className="text-center px-3 py-2">
            <div
              className="font-black leading-none tracking-tight select-none tall-solar-num"
              style={{ color: theme.primaryAccent }}
            >
              {String(selectedDate.getDate()).padStart(2, "0")}
            </div>
          </div>

          {/* Right: Lunar Day */}
          <div className="text-right pl-2 py-2 border-l border-slate-200/80">
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              NGÀY ÂM
            </div>
            <div className="font-black text-amber-600 leading-none my-2.5 tall-lunar-num">
              {String(lunarDate.day).padStart(2, "0")}
            </div>
            <div className="text-[11px] sm:text-xs font-extrabold text-slate-700 uppercase">
              {getLunarMonthName(lunarDate.month, fengShuiData?.lp)}
            </div>
          </div>
        </div>

        {/* Optional Holiday Banner on this date */}
        {dayHolidays.length > 0 && (
          <div className="mb-2 space-y-1">
            {dayHolidays.slice(0, 2).map((h) => (
              <div
                key={h.id}
                className="px-2.5 py-1.5 rounded-xl bg-red-50/90 border border-red-200/70 flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="font-extrabold text-red-700 truncate">
                  🎉 {h.name}
                </span>
                {h.vacationBadge && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    {h.vacationBadge}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ngũ Hành + Trực + Sao Tốt (1 hàng ngang gọn gàng cho cả Mobile & Web) */}
        <div className="grid grid-cols-3 gap-1 py-2 border-t border-slate-100 text-center items-center">
          <span
            title={fengShuiData?.nh || "Ngũ Hành"}
            className="px-1.5 py-1 rounded-md bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200/60 whitespace-nowrap truncate"
          >
            💧 {fengShuiData?.nh || "Bình Hòa"}
          </span>
          <span
            title={`Trực ${fengShuiData?.t12 || ""} • Sao ${fengShuiData?.s28 || ""}`}
            className="px-1.5 py-1 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200/60 whitespace-nowrap truncate"
          >
            Trực {fengShuiData?.t12 || "Kiến"} • Sao {fengShuiData?.s28 || "Giác"}
          </span>
          <span
            title={goodStarsText}
            className="px-1.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/60 whitespace-nowrap truncate"
          >
            {goodStarsText}
          </span>
        </div>

        {/* Folk Quote / Ca Dao Theo Mùa + 3 Stacked Direction Boxes */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="serif-display italic text-xs sm:text-[13px] text-slate-700 leading-relaxed line-clamp-2">
            {dynamicQuote ? `“${dynamicQuote}”` : theme.folkQuote}
          </p>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1.5 rounded-lg bg-slate-50/90 border border-slate-200/70">
              <div className="text-[9px] text-slate-400 font-bold uppercase">
                Hỷ Thần
              </div>
              <div className="text-[11px] font-extrabold text-slate-800 whitespace-nowrap truncate">
                ↗ {hyThanDir}
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50/90 border border-slate-200/70">
              <div className="text-[9px] text-slate-400 font-bold uppercase">
                Tài Thần
              </div>
              <div className="text-[11px] font-extrabold text-amber-700 whitespace-nowrap truncate">
                ↘ {taiThanDir}
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50/90 border border-slate-200/70">
              <div className="text-[9px] text-slate-400 font-bold uppercase">
                {thirdBoxInfo.label}
              </div>
              <div className="text-[11px] font-extrabold text-emerald-700 whitespace-nowrap truncate">
                {thirdBoxInfo.value}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tear Action Footer inside Bloc */}
      <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between text-xs font-bold text-slate-500 mt-1 gap-2">
        {onSelectDate ? (
          <button
            type="button"
            onClick={() => onSelectDate(prevDate)}
            className="hover:text-slate-900 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
          >
            ← Xé tờ trước
          </button>
        ) : (
          <Link
            href={`/day/${format(prevDate, "yyyy-MM-dd")}`}
            prefetch={false}
            className="hover:text-slate-900 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 transition-colors shrink-0"
          >
            ← Xé tờ trước
          </Link>
        )}

        {showDetailLink ? (
          <Link
            href={`/day/${dateKey}`}
            prefetch={false}
            className="text-[11px] font-extrabold hover:underline truncate text-center"
            style={{ color: theme.primaryAccent }}
          >
            Xem chi tiết ngày →
          </Link>
        ) : (
          <span className="text-[11px] text-slate-400 truncate text-center">
            Bấm lịch tháng để lật →
          </span>
        )}

        {onSelectDate ? (
          <button
            type="button"
            onClick={() => onSelectDate(nextDate)}
            className="hover:text-slate-900 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
          >
            Tờ tiếp theo →
          </button>
        ) : (
          <Link
            href={`/day/${format(nextDate, "yyyy-MM-dd")}`}
            prefetch={false}
            className="hover:text-slate-900 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 transition-colors shrink-0"
          >
            Tờ tiếp theo →
          </Link>
        )}
      </div>
    </div>
  );
}
