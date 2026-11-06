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
import { WallCalendarBloc } from "@/components/home/WallCalendarBloc";

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

  const activeMonthNumber =
    (conversionResult?.solarDate.getMonth() ?? initialDate.getMonth()) + 1;

  return (
    <div
      className="relative flex flex-col min-h-dvh w-full overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.background }}
    >
      {/* Decorative blur circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-28 -left-28 w-[480px] h-[480px] rounded-full blur-[110px] opacity-40"
          style={{ backgroundColor: theme.blurCircle1 }}
        />
        <div
          className="absolute top-1/3 -right-28 w-[420px] h-[420px] rounded-full blur-[110px] opacity-35"
          style={{ backgroundColor: theme.blurCircle2 }}
        />
      </div>

      <TopHeader theme={theme} monthNumber={activeMonthNumber} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 relative z-10">
        <div className="w-full space-y-5">
          {/* Main 2-Column Split Row: Left (Converter Studio) + Right (3D Wall Calendar Bloc) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Column (6 cols): Unified Converter Card */}
            <div className="lg:col-span-6 bg-white/95 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 border-2 border-white shadow-xl flex flex-col justify-between gap-4">
              {/* Top Section: Header + Mode Switcher + Inputs */}
              <div className="space-y-4">
                {/* Compact Header inside Card */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                  <div>
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1"
                      style={{
                        backgroundColor: `${theme.primaryAccent}15`,
                        color: theme.primaryAccent,
                      }}
                    >
                      <MaterialIcon name="swap_horiz" className="text-[14px]" />
                      <span>Vạn Niên 1900 – 2100</span>
                    </div>
                    <h1 className="serif-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      Đổi Ngày Âm Dương 2 Chiều
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chuyển đổi chính xác Dương lịch ↔ Âm lịch, Can Chi & Tiết Khí
                    </p>
                  </div>
                  <span className="text-2xl select-none shrink-0" aria-hidden="true">
                    {theme.motif || "🌸"}
                  </span>
                </div>

                {/* Direction Switcher */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => handleSwitchDirection("solarToLunar")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                      direction === "solarToLunar"
                        ? "text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    style={
                      direction === "solarToLunar"
                        ? {
                            background: `linear-gradient(135deg, ${theme.primaryAccent}, ${
                              theme.darkAccent || theme.primaryHover
                            })`,
                          }
                        : {}
                    }
                  >
                    <span>☀️ Dương Lịch → Âm Lịch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchDirection("lunarToSolar")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                      direction === "lunarToSolar"
                        ? "text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    style={
                      direction === "lunarToSolar"
                        ? {
                            background: `linear-gradient(135deg, ${theme.primaryAccent}, ${
                              theme.darkAccent || theme.primaryHover
                            })`,
                          }
                        : {}
                    }
                  >
                    <span>🌙 Âm Lịch → Dương Lịch</span>
                  </button>
                </div>

                {/* Grouped Date Picker + Quick Presets Box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3.5">
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    <div>
                      <label
                        htmlFor="conv-day"
                        className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
                      >
                        {direction === "solarToLunar" ? "Ngày Dương" : "Ngày Âm"}
                      </label>
                      <select
                        id="conv-day"
                        value={Math.min(day, maxDaysInCurrentSelection)}
                        onChange={(e) => setDay(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs sm:text-sm font-extrabold text-slate-800 shadow-2xs outline-none focus:ring-2 cursor-pointer"
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
                        className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
                      >
                        {direction === "solarToLunar" ? "Tháng Dương" : "Tháng Âm"}
                      </label>
                      <select
                        id="conv-month"
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs sm:text-sm font-extrabold text-slate-800 shadow-2xs outline-none focus:ring-2 cursor-pointer"
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
                        className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1"
                      >
                        Năm (1900–2100)
                      </label>
                      <select
                        id="conv-year"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs sm:text-sm font-extrabold text-slate-800 shadow-2xs outline-none focus:ring-2 cursor-pointer"
                      >
                        {ALL_YEARS.map((y) => (
                          <option key={y} value={y}>
                            Năm {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Lunar Leap Month Option */}
                  {direction === "lunarToSolar" && leapMonthInYear > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-2">
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

                  {/* Quick Presets Bar inside the same box */}
                  <div className="pt-2.5 border-t border-slate-200/70 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">
                      Chọn nhanh:
                    </span>
                    <button
                      type="button"
                      onClick={() => applySolarPreset(new Date())}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Ngày mai
                    </button>
                    <button
                      type="button"
                      onClick={() => findNextLunarDay(1)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 border border-amber-200/80 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      Mùng 1 ÂL tới
                    </button>
                    <button
                      type="button"
                      onClick={() => findNextLunarDay(15)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 border border-amber-200/80 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      Ngày Rằm tới
                    </button>
                  </div>
                </div>

                {/* Instant Side-by-Side Comparison Card (Dương Lịch ⇄ Âm Lịch) */}
                {conversionResult && (
                  <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <span>Kết Quả Đối Chiếu Nhanh</span>
                      <span className="text-slate-600">
                        Tiết khí:{" "}
                        <strong style={{ color: theme.primaryAccent }}>
                          {conversionResult.fengShui.tk || "—"}
                        </strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-11 gap-2 items-center">
                      {/* Solar Box */}
                      <div className="col-span-5 p-3 rounded-xl bg-white border border-slate-200/80 text-center">
                        <div className="text-[10px] font-extrabold uppercase text-slate-400">
                          Dương Lịch
                        </div>
                        <div
                          className="text-xs font-extrabold mt-0.5"
                          style={{ color: theme.primaryAccent }}
                        >
                          {conversionResult.weekday}
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 my-0.5">
                          {format(conversionResult.solarDate, "dd/MM")}
                        </div>
                        <div className="text-[11px] font-bold text-slate-500">
                          Năm {conversionResult.solarDate.getFullYear()}
                        </div>
                      </div>

                      {/* Swap Arrow */}
                      <div className="col-span-1 flex justify-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-2xs"
                          style={{ backgroundColor: theme.primaryAccent }}
                        >
                          <MaterialIcon name="swap_horiz" className="text-sm" />
                        </div>
                      </div>

                      {/* Lunar Box */}
                      <div className="col-span-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
                        <div className="text-[10px] font-extrabold uppercase text-amber-700">
                          Âm Lịch
                        </div>
                        <div className="text-xs font-extrabold text-amber-900 mt-0.5">
                          Ngày {conversionResult.fengShui.dgz}
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-600 my-0.5">
                          {String(conversionResult.fengShui.ld).padStart(2, "0")}/
                          {String(conversionResult.fengShui.lm).padStart(2, "0")}
                        </div>
                        <div className="text-[11px] font-bold text-amber-800">
                          Năm {conversionResult.fengShui.ygz}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Buttons */}
              {conversionResult && (
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href={`/day/${formatDateString(conversionResult.solarDate)}`}
                    prefetch={false}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white text-center shadow-sm transition-opacity hover:opacity-95 flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryAccent}, ${
                        theme.darkAccent || theme.primaryHover
                      })`,
                    }}
                  >
                    <MaterialIcon name="calendar_view_day" className="text-[18px]" />
                    <span>
                      Xem chi tiết ngày {format(conversionResult.solarDate, "dd/MM/yyyy")}
                    </span>
                  </Link>
                  <Link
                    href="/xem-ngay-tot"
                    className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-center border bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
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

            {/* Right Column (6 cols): 3D Wall Calendar Bloc */}
            <div className="lg:col-span-6 flex flex-col">
              {conversionResult && (
                <WallCalendarBloc
                  selectedDate={conversionResult.solarDate}
                  theme={theme}
                  fengShuiData={conversionResult.fengShui}
                  onSelectDate={(newDate) => applySolarPreset(newDate)}
                  showDetailLink
                />
              )}
            </div>
          </div>

          {/* Giờ Hoàng Đạo & Việc Nên Làm của Ngày Đã Đổi */}
          {conversionResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-white/80 shadow-lg flex flex-col justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  🕒 6 Giờ Hoàng Đạo Ngày {format(conversionResult.solarDate, "dd/MM/yyyy")}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {conversionResult.hoangDaoHours.map((h) => (
                    <div
                      key={h.chi}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70"
                    >
                      <span className="text-lg">{h.emoji}</span>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">
                          Giờ {h.chi}
                        </p>
                        <p className="text-[10px] font-bold text-amber-800">
                          {h.timeRange}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-emerald-200/70 shadow-lg">
                  <div className="flex items-center gap-1.5 mb-2 text-emerald-800 font-extrabold text-xs uppercase">
                    <MaterialIcon name="check_circle" className="text-sm text-emerald-600" />
                    <span>Việc nên làm (Cát)</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {conversionResult.fengShui.ga?.join(" • ") || "Cầu phúc, tế tự, xuất hành."}
                  </p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 border border-rose-200/70 shadow-lg">
                  <div className="flex items-center gap-1.5 mb-2 text-rose-800 font-extrabold text-xs uppercase">
                    <MaterialIcon name="cancel" className="text-sm text-rose-600" />
                    <span>Việc kiêng kỵ (Hung)</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {conversionResult.fengShui.ba?.join(" • ") || "Không kỵ việc lớn."}
                  </p>
                </div>
              </div>
            </div>
          )}

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
      </main>

      <Footer />
    </div>
  );
}
