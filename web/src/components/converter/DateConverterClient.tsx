"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { TopHeader, Footer } from "@/components/layout";
import { MaterialIcon } from "@/components/common";
import { getMonthTheme } from "@/lib/theme";
import { LunarCalculator, WEEKDAY_NAMES, GIO_DIA_CHI, CON_GIAP } from "@/lib/lunar";
import { UniversalDayCalculator } from "@/lib/fengshui/UniversalDayCalculator";
import { parseDateString, formatDateString } from "@/lib/date-utils";

interface DateConverterClientProps {
  initialDateStr: string;
}

const ALL_YEARS = Array.from({ length: 201 }, (_, i) => 1900 + i);

export function DateConverterClient({ initialDateStr }: DateConverterClientProps) {
  const initialDate = useMemo(
    () => parseDateString(initialDateStr) || new Date(),
    [initialDateStr]
  );

  const [direction, setDirection] = useState<"solarToLunar" | "lunarToSolar">("solarToLunar");
  const [day, setDay] = useState(() => initialDate.getDate());
  const [month, setMonth] = useState(() => initialDate.getMonth() + 1);
  const [year, setYear] = useState(() => initialDate.getFullYear());
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  const leapMonthInYear = useMemo(() => {
    try {
      return LunarCalculator.getLeapMonth(year);
    } catch {
      return 0;
    }
  }, [year]);

  const maxDaysInCurrentSelection = useMemo(() => {
    try {
      if (direction === "solarToLunar") {
        return new Date(year, month, 0).getDate();
      } else {
        const useLeap = isLeapMonth && leapMonthInYear === month;
        return LunarCalculator.getDaysInLunarMonth(year, month, useLeap);
      }
    } catch {
      return 30;
    }
  }, [direction, year, month, isLeapMonth, leapMonthInYear]);

  // Compute converted result for ANY date 1900 - 2100
  const conversionResult = useMemo(() => {
    try {
      const safeYear = Math.max(1900, Math.min(2100, year));
      const safeDay = Math.max(1, Math.min(maxDaysInCurrentSelection, day));

      let solarDate: Date;
      if (direction === "solarToLunar") {
        solarDate = new Date(safeYear, month - 1, safeDay, 12, 0, 0);
      } else {
        const useLeap = isLeapMonth && leapMonthInYear === month;
        solarDate = LunarCalculator.toSolar({
          day: safeDay,
          month,
          year: safeYear,
          isLeapMonth: useLeap,
        });
      }

      const fengShui = UniversalDayCalculator.calculate(solarDate);
      const yearInfo = LunarCalculator.getYearInfo(fengShui.ly);
      const weekday = WEEKDAY_NAMES[solarDate.getDay()];

      const hoangDaoHours = GIO_DIA_CHI.filter((gio) =>
        fengShui.hd.includes(gio.chi)
      ).map((gio) => ({
        ...gio,
        emoji:
          CON_GIAP[GIO_DIA_CHI.findIndex((g) => g.chi === gio.chi)]?.emoji || "🐉",
      }));

      return {
        solarDate,
        weekday,
        fengShui,
        yearInfo,
        hoangDaoHours,
      };
    } catch {
      return null;
    }
  }, [direction, day, month, year, isLeapMonth, leapMonthInYear, maxDaysInCurrentSelection]);

  // Calculate all Mùng 1 & Rằm (15 ÂL) dates for the currently selected Lunar year
  const mung1RamList = useMemo(() => {
    const targetLunarYear = conversionResult?.fengShui.ly || year;
    const safeLunarYear = Math.max(1900, Math.min(2100, targetLunarYear));
    const leapM = LunarCalculator.getLeapMonth(safeLunarYear);
    const items: Array<{
      lunarMonthLabel: string;
      mung1Solar: Date;
      ramSolar: Date;
    }> = [];

    for (let m = 1; m <= 12; m++) {
      try {
        const mung1 = LunarCalculator.toSolar({
          day: 1,
          month: m,
          year: safeLunarYear,
          isLeapMonth: false,
        });
        const ram = LunarCalculator.toSolar({
          day: 15,
          month: m,
          year: safeLunarYear,
          isLeapMonth: false,
        });
        items.push({
          lunarMonthLabel: `Tháng ${m} ÂL`,
          mung1Solar: mung1,
          ramSolar: ram,
        });

        if (leapM === m) {
          const mung1Leap = LunarCalculator.toSolar({
            day: 1,
            month: m,
            year: safeLunarYear,
            isLeapMonth: true,
          });
          const ramLeap = LunarCalculator.toSolar({
            day: 15,
            month: m,
            year: safeLunarYear,
            isLeapMonth: true,
          });
          items.push({
            lunarMonthLabel: `Tháng ${m} Nhuận`,
            mung1Solar: mung1Leap,
            ramSolar: ramLeap,
          });
        }
      } catch {
        // Ignore out-of-range edge cases at year 2100 boundary
      }
    }
    return { lunarYear: safeLunarYear, items };
  }, [conversionResult?.fengShui.ly, year]);

  const theme = useMemo(
    () =>
      getMonthTheme(
        (conversionResult?.solarDate.getMonth() ?? initialDate.getMonth()) + 1
      ),
    [conversionResult?.solarDate, initialDate]
  );

  const handleSwitchDirection = (newDir: "solarToLunar" | "lunarToSolar") => {
    if (newDir === direction) return;
    if (conversionResult) {
      if (newDir === "lunarToSolar") {
        setDay(conversionResult.fengShui.ld);
        setMonth(conversionResult.fengShui.lm);
        setYear(conversionResult.fengShui.ly);
        setIsLeapMonth(conversionResult.fengShui.lp === 1);
      } else {
        setDay(conversionResult.solarDate.getDate());
        setMonth(conversionResult.solarDate.getMonth() + 1);
        setYear(conversionResult.solarDate.getFullYear());
        setIsLeapMonth(false);
      }
    }
    setDirection(newDir);
  };

  const applySolarPreset = (targetDate: Date) => {
    setDirection("solarToLunar");
    setDay(targetDate.getDate());
    setMonth(targetDate.getMonth() + 1);
    setYear(targetDate.getFullYear());
    setIsLeapMonth(false);
  };

  const findNextLunarDay = (targetLunarDay: 1 | 15) => {
    const start = new Date();
    for (let i = 0; i <= 35; i++) {
      const candidate = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + i,
        12,
        0,
        0
      );
      const l = LunarCalculator.toLunar(candidate);
      if (l.day === targetLunarDay) {
        applySolarPreset(candidate);
        return;
      }
    }
  };

  return (
    <div
      className="relative flex flex-col min-h-dvh w-full font-[Manrope] antialiased"
      style={{ backgroundColor: theme.background }}
    >
      {/* Decorative blur circles */}
      <div
        className="glow-circle w-[450px] h-[450px] top-[-120px] left-[-80px]"
        style={{ backgroundColor: theme.blurCircle1 }}
      />
      <div
        className="glow-circle w-[400px] h-[400px] bottom-[-80px] right-[-80px]"
        style={{ backgroundColor: theme.blurCircle2 }}
      />

      <TopHeader theme={theme} />

      <main className="flex-1 px-4 lg:px-8 py-4 lg:py-6 relative z-10">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/80 shadow-sm border border-slate-200/70" style={{ color: theme.primaryAccent }}>
              <MaterialIcon name="swap_horiz" className="text-[16px]" />
              <span>CÔNG CỤ VẠN NIÊN 1900 – 2100</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
              Đổi Ngày Âm Dương 2 Chiều
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Chuyển đổi chính xác bất kỳ ngày Dương lịch sang Âm lịch và ngược lại (từ năm 1900 đến 2100), tự động tính Can Chi, Tiết Khí, Giờ Hoàng Đạo và Việc Nên Làm.
            </p>
          </div>

          {/* Converter Controls + Instant Result Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Input Form */}
            <div className="lg:col-span-5 glass-panel-light rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              {/* Direction Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleSwitchDirection("solarToLunar")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    direction === "solarToLunar"
                      ? "text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  style={
                    direction === "solarToLunar"
                      ? { backgroundColor: theme.primaryAccent }
                      : {}
                  }
                >
                  <span>Dương → Âm</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchDirection("lunarToSolar")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    direction === "lunarToSolar"
                      ? "text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  style={
                    direction === "lunarToSolar"
                      ? { backgroundColor: theme.primaryAccent }
                      : {}
                  }
                >
                  <span>Âm → Dương</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Chọn nhanh mốc thời gian
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applySolarPreset(new Date())}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Hôm nay
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tmr = new Date();
                      tmr.setDate(tmr.getDate() + 1);
                      applySolarPreset(tmr);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Ngày mai
                  </button>
                  <button
                    type="button"
                    onClick={() => findNextLunarDay(1)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    Mùng 1 ÂL sắp tới
                  </button>
                  <button
                    type="button"
                    onClick={() => findNextLunarDay(15)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    Ngày Rằm sắp tới
                  </button>
                </div>
              </div>

              {/* Date Selectors */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="conv-day"
                      className="block text-xs font-bold text-slate-600 mb-1.5"
                    >
                      {direction === "solarToLunar" ? "Ngày Dương" : "Ngày Âm"}
                    </label>
                    <select
                      id="conv-day"
                      value={Math.min(day, maxDaysInCurrentSelection)}
                      onChange={(e) => setDay(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm outline-none focus:ring-2"
                    >
                      {Array.from(
                        { length: maxDaysInCurrentSelection },
                        (_, i) => i + 1
                      ).map((d) => (
                        <option key={d} value={d}>
                          {direction === "lunarToSolar" && d <= 10
                            ? `Mùng ${d}`
                            : `Ngày ${d}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="conv-month"
                      className="block text-xs font-bold text-slate-600 mb-1.5"
                    >
                      {direction === "solarToLunar" ? "Tháng Dương" : "Tháng Âm"}
                    </label>
                    <select
                      id="conv-month"
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm outline-none focus:ring-2"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          Tháng {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="conv-year"
                      className="block text-xs font-bold text-slate-600 mb-1.5"
                    >
                      Năm (1900-2100)
                    </label>
                    <select
                      id="conv-year"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm outline-none focus:ring-2"
                    >
                      {ALL_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Lunar Leap Month Option */}
                {direction === "lunarToSolar" && leapMonthInYear > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-2">
                    <div className="text-xs text-amber-900">
                      <span className="font-bold">Năm {year}</span> có{" "}
                      <span className="font-bold underline">
                        Tháng {leapMonthInYear} Nhuận
                      </span>
                    </div>
                    {month === leapMonthInYear && (
                      <label className="flex items-center gap-1.5 text-xs font-bold text-amber-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isLeapMonth}
                          onChange={(e) => setIsLeapMonth(e.target.checked)}
                          className="rounded"
                        />
                        <span>Tính tháng {month} Nhuận</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {conversionResult && (
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href={`/day/${formatDateString(conversionResult.solarDate)}`}
                    prefetch={false}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white text-center shadow-md transition-opacity hover:opacity-95 flex items-center justify-center gap-2"
                    style={{ backgroundColor: theme.primaryAccent }}
                  >
                    <MaterialIcon name="calendar_view_day" className="text-[18px]" />
                    <span>Xem chi tiết ngày {format(conversionResult.solarDate, "d/M/yyyy")}</span>
                  </Link>
                  <Link
                    href="/xem-ngay-tot"
                    className="py-3 px-4 rounded-xl text-sm font-bold text-center border bg-white/80 hover:bg-white transition-colors flex items-center justify-center gap-1.5"
                    style={{
                      borderColor: `${theme.primaryAccent}40`,
                      color: theme.primaryAccent,
                    }}
                  >
                    <MaterialIcon name="event_available" className="text-[18px]" />
                    <span>Tìm ngày tốt</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column: Instant Result Card */}
            <div className="lg:col-span-7 space-y-4">
              {conversionResult && (
                <>
                  {/* Dual Solar <-> Lunar Comparison Card */}
                  <div className="glass-panel-light rounded-3xl p-5 sm:p-6 shadow-xl">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            conversionResult.fengShui.t12g === 1
                              ? `${theme.accentGold}20`
                              : "rgba(100,116,139,0.15)",
                          color:
                            conversionResult.fengShui.t12g === 1
                              ? theme.accentGold
                              : "#475569",
                        }}
                      >
                        ★{" "}
                        {conversionResult.fengShui.t12g === 1
                          ? "NGÀY HOÀNG ĐẠO"
                          : "NGÀY HẮC ĐẠO"}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Tiết khí:{" "}
                        <strong className="text-slate-800">
                          {conversionResult.fengShui.tk}
                        </strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
                      {/* Solar Box */}
                      <div className="sm:col-span-5 p-4 rounded-2xl bg-white/85 border border-slate-200/80 text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Dương Lịch
                        </p>
                        <p
                          className="text-sm font-bold"
                          style={{ color: theme.primaryAccent }}
                        >
                          {conversionResult.weekday}
                        </p>
                        <p className="text-4xl font-black text-slate-800 my-1">
                          {conversionResult.solarDate.getDate()}
                        </p>
                        <p className="text-xs font-bold text-slate-600">
                          Tháng {conversionResult.solarDate.getMonth() + 1} năm{" "}
                          {conversionResult.solarDate.getFullYear()}
                        </p>
                      </div>

                      {/* Swap Icon */}
                      <div className="sm:col-span-1 flex justify-center">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
                          style={{
                            backgroundColor: `${theme.primaryAccent}15`,
                            color: theme.primaryAccent,
                          }}
                        >
                          <MaterialIcon name="swap_horiz" className="text-xl" />
                        </div>
                      </div>

                      {/* Lunar Box */}
                      <div
                        className="sm:col-span-5 p-4 rounded-2xl border text-center"
                        style={{
                          backgroundColor: `${theme.accentGold}10`,
                          borderColor: `${theme.accentGold}35`,
                        }}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700/80 mb-1">
                          Âm Lịch
                        </p>
                        <p className="text-sm font-bold text-amber-800">
                          {conversionResult.yearInfo.animalEmoji} Năm{" "}
                          {conversionResult.fengShui.ygz}
                        </p>
                        <p
                          className="text-4xl font-black my-1"
                          style={{ color: theme.accentGold }}
                        >
                          {conversionResult.fengShui.ld}
                        </p>
                        <p className="text-xs font-bold text-slate-700">
                          Tháng {conversionResult.fengShui.lm}
                          {conversionResult.fengShui.lp === 1 ? " (Nhuận)" : ""} năm{" "}
                          {conversionResult.fengShui.ly}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Feng Shui Attributes */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-200/70">
                      <div className="p-2.5 rounded-xl bg-white/70 border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Can Chi Ngày
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                          {conversionResult.fengShui.dgz}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Hành {conversionResult.fengShui.nh}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Can Chi Tháng
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                          {conversionResult.fengShui.mgz}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Năm {conversionResult.fengShui.ygz}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Thập Nhị Trực
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-800 mt-0.5">
                          Trực {conversionResult.fengShui.t12}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Sao {conversionResult.fengShui.s28} (
                          {conversionResult.fengShui.s28g === 1 ? "Tốt" : "Xấu"})
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Tuổi Xung Ngày
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-rose-700 mt-0.5">
                          {conversionResult.fengShui.age?.join(", ") || "Không có"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Điểm ngày: {conversionResult.fengShui.score ?? 80}/100
                        </p>
                      </div>
                    </div>

                    {/* Giờ Hoàng Đạo */}
                    <div className="mt-4 pt-4 border-t border-slate-200/70">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                        <MaterialIcon
                          name="schedule"
                          className="text-base"
                          style={{ color: theme.accentGold }}
                        />
                        <span>Giờ Hoàng Đạo trong ngày</span>
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {conversionResult.hoangDaoHours.map((h) => (
                          <div
                            key={h.chi}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800 text-white"
                          >
                            <span className="text-base">{h.emoji}</span>
                            <div>
                              <p className="text-xs font-bold">Giờ {h.chi}</p>
                              <p className="text-[10px] text-slate-300">
                                {h.timeRange}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nên Làm & Kiêng Kỵ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200/70">
                      <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200/70">
                        <div className="flex items-center gap-1.5 mb-1.5 text-emerald-800 font-bold text-xs">
                          <MaterialIcon name="check_circle" className="text-sm text-emerald-600" />
                          <span>Việc nên làm</span>
                        </div>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          {conversionResult.fengShui.ga?.join(" ") || "Cầu phúc, tế tự, xuất hành."}
                        </p>
                      </div>
                      <div className="bg-rose-50/70 rounded-2xl p-3.5 border border-rose-200/70">
                        <div className="flex items-center gap-1.5 mb-1.5 text-rose-800 font-bold text-xs">
                          <MaterialIcon name="cancel" className="text-sm text-rose-600" />
                          <span>Việc kiêng kỵ</span>
                        </div>
                        <p className="text-xs text-rose-700 leading-relaxed">
                          {conversionResult.fengShui.ba?.join(" ") || "Không kỵ việc lớn."}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Reference Table: All Mùng 1 & Rằm (15 ÂL) in Selected Year */}
          <section className="glass-panel-light rounded-3xl p-5 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">
                  Bảng Tra Nhanh Ngày Mùng 1 & Ngày Rằm Năm {mung1RamList.lunarYear}
                </h2>
                <p className="text-xs text-slate-500">
                  Bấm vào bất kỳ ngày nào để xem chi tiết phong thủy và giờ tốt cúng Rằm / Mùng 1
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {mung1RamList.items.map((row) => (
                <div
                  key={row.lunarMonthLabel}
                  className="p-3 rounded-2xl bg-white/80 border border-slate-200/70 flex flex-col gap-2"
                >
                  <p
                    className="text-xs font-extrabold uppercase tracking-wider"
                    style={{ color: theme.primaryAccent }}
                  >
                    {row.lunarMonthLabel}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Mùng 1 ÂL:</span>
                    <button
                      type="button"
                      onClick={() => applySolarPreset(row.mung1Solar)}
                      className="font-bold text-slate-800 hover:underline"
                    >
                      {format(row.mung1Solar, "dd/MM/yyyy")} (DL)
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Rằm (15 ÂL):</span>
                    <button
                      type="button"
                      onClick={() => applySolarPreset(row.ramSolar)}
                      className="font-bold text-amber-700 hover:underline"
                    >
                      {format(row.ramSolar, "dd/MM/yyyy")} (DL)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}
