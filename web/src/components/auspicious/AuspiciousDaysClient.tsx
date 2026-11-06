"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { TopHeader, Footer } from "@/components/layout";
import { MaterialIcon } from "@/components/common";
import { getMonthTheme } from "@/lib/theme";
import { WEEKDAY_NAMES, CON_GIAP } from "@/lib/lunar";
import { UniversalDayCalculator } from "@/lib/fengshui/UniversalDayCalculator";
import type { DayFengShuiData } from "@/lib/fengshui/types";
import { parseDateString, formatDateString } from "@/lib/date-utils";

interface AuspiciousDaysClientProps {
  initialDateStr: string;
}

type PurposeFilter =
  | "hoangdao"
  | "cuoihoi"
  | "khaitruong"
  | "xaydung"
  | "xuathanh"
  | "nhaptrach";

const PURPOSE_OPTIONS: Array<{
  id: PurposeFilter;
  label: string;
  desc: string;
}> = [
  {
    id: "hoangdao",
    label: "★ Ngày Hoàng Đạo",
    desc: "Tất cả ngày Hoàng Đạo cát lành trong tháng",
  },
  {
    id: "cuoihoi",
    label: "Cưới hỏi • Ăn hỏi",
    desc: "Ngày tốt thành hôn, đính hôn, nạp tài",
  },
  {
    id: "khaitruong",
    label: "Khai trương • Ký kết",
    desc: "Ngày tốt mở cửa hàng, giao dịch, cầu tài lộc",
  },
  {
    id: "xaydung",
    label: "Động thổ • Xây dựng",
    desc: "Ngày tốt khởi công, xây cất, sửa chữa nhà",
  },
  {
    id: "xuathanh",
    label: "Xuất hành • Đi xa",
    desc: "Ngày tốt khởi hành, công tác, du lịch bình an",
  },
  {
    id: "nhaptrach",
    label: "Nhập trạch • Chuyển nhà",
    desc: "Ngày tốt dọn về nhà mới, an vị bát hương",
  },
];

const ALL_YEARS = Array.from({ length: 201 }, (_, i) => 1900 + i);

const DAI_KY_STARS = new Set([
  "Tam Nương",
  "Nguyệt Kỵ",
  "Dương Công Kỵ",
  "Thụ tử",
  "Sát chủ",
  "Nguyệt phá",
]);

function matchesPurpose(purpose: PurposeFilter, data: DayFengShuiData): boolean {
  const isHoangDao = data.t12g === 1;
  if (purpose === "hoangdao") return isHoangDao;

  // Các việc trọng đại bắt buộc là ngày Hoàng Đạo, không phạm Đại Kỵ (Tam Nương, Nguyệt Kỵ, Dương Công, Sát Chủ, Thụ Tử, Nguyệt Phá) và không phạm Trực Phá/Nguy/Bế
  if (!isHoangDao) return false;
  if (["Phá", "Nguy", "Bế"].includes(data.t12)) return false;
  if ((data.bs || []).some((s) => DAI_KY_STARS.has(s))) return false;

  const gaText = (data.ga || []).join(" ");
  const baText = (data.ba || []).join(" ");

  switch (purpose) {
    case "cuoihoi":
      return (
        data.t12 !== "Trừ" &&
        /cưới|hôn|gả|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/cưới|hôn|gả/i.test(baText)
      );
    case "khaitruong":
      return (
        /khai trương|kinh doanh|giao dịch|tài|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/khai trương/i.test(baText)
      );
    case "xaydung":
      return (
        !["Kiến", "Mãn", "Thu"].includes(data.t12) &&
        /xây|cất|khởi tạo|khởi công|trổ cửa|sửa chữa|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/xây cất|khởi tạo|động thổ/i.test(baText)
      );
    case "xuathanh":
      return (
        !["Trừ", "Định", "Chấp", "Thu"].includes(data.t12) &&
        /xuất hành|đi|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/xuất hành/i.test(baText)
      );
    case "nhaptrach":
      return (
        data.t12 !== "Chấp" &&
        /nhập trạch|xây|nhà|dựng phòng|khởi tạo|trăm việc đều tốt|mọi việc đều tốt/i.test(gaText) &&
        !/xây cất|dựng nhà|dọn nhà|nhập trạch/i.test(baText)
      );
    default:
      return isHoangDao;
  }
}

export function AuspiciousDaysClient({ initialDateStr }: AuspiciousDaysClientProps) {
  const initialDate = useMemo(
    () => parseDateString(initialDateStr) || new Date(),
    [initialDateStr]
  );

  const [month, setMonth] = useState(() => initialDate.getMonth() + 1);
  const [year, setYear] = useState(() => initialDate.getFullYear());
  const [purpose, setPurpose] = useState<PurposeFilter>("hoangdao");
  const [userChi, setUserChi] = useState<string>("all");
  const [hideConflictingAge, setHideConflictingAge] = useState(true);

  // Restore saved user zodiac from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lichviet_user_chi");
      if (saved) setUserChi(saved);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSelectChi = (chi: string) => {
    setUserChi(chi);
    try {
      localStorage.setItem("lichviet_user_chi", chi);
    } catch {
      // Ignore storage errors
    }
  };

  const theme = useMemo(() => getMonthTheme(month), [month]);

  // Compute all days in the selected month & year (works for ANY year 1900 - 2100)
  const matchingDays = useMemo(() => {
    const start = startOfMonth(new Date(year, month - 1, 1, 12, 0, 0));
    const end = endOfMonth(start);
    const days = eachDayOfInterval({ start, end });

    return days
      .map((date) => {
        const data = UniversalDayCalculator.calculate(date);
        const isAgeConflict =
          userChi !== "all" &&
          (data.age || []).some((a) => a.toLowerCase().includes(userChi.toLowerCase()));
        return {
          date,
          weekday: WEEKDAY_NAMES[date.getDay()],
          data,
          isAgeConflict,
        };
      })
      .filter((item) => {
        if (!matchesPurpose(purpose, item.data)) return false;
        if (userChi !== "all" && hideConflictingAge && item.isAgeConflict) {
          return false;
        }
        return true;
      });
  }, [year, month, purpose, userChi, hideConflictingAge]);

  const activePurposeObj =
    PURPOSE_OPTIONS.find((p) => p.id === purpose) || PURPOSE_OPTIONS[0];

  return (
    <div
      className="relative flex flex-col min-h-dvh w-full overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.background }}
    >
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

      <TopHeader theme={theme} monthNumber={month} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 relative z-10">
        <div className="w-full space-y-5">
          {/* Unified Header + Filter Panel */}
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 border-2 border-white shadow-xl space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1"
                  style={{
                    backgroundColor: `${theme.primaryAccent}15`,
                    color: theme.primaryAccent,
                  }}
                >
                  <MaterialIcon name="event_available" className="text-[14px]" />
                  <span>Tra cứu ngày lành tháng tốt (1900 – 2100)</span>
                </div>
                <h1 className="serif-display text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  Xem Ngày Tốt Theo Công Việc & Tuổi
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Chọn tháng năm, mục đích công việc và tuổi của bạn để lọc ngày Hoàng Đạo cát tường chuẩn Ngọc Hạp Thông Thư.
                </p>
              </div>
              <span className="text-3xl select-none shrink-0 hidden sm:inline" aria-hidden="true">
                {theme.motif || "🌸"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Month & Year */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  1. Chọn Tháng / Năm
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Chọn tháng"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Chọn năm"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm outline-none"
                  >
                    {ALL_YEARS.map((y) => (
                      <option key={y} value={y}>
                        Năm {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* User Zodiac Sign (Tuổi gia chủ) */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    2. Tuổi của bạn (Lọc tránh ngày xung tuổi)
                  </label>
                  {userChi !== "all" && (
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hideConflictingAge}
                        onChange={(e) => setHideConflictingAge(e.target.checked)}
                        className="rounded"
                      />
                      <span>Ẩn ngày xung tuổi {userChi}</span>
                    </label>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectChi("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      userChi === "all"
                        ? "text-white border-transparent shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    style={
                      userChi === "all" ? { backgroundColor: theme.primaryAccent } : {}
                    }
                  >
                    Tất cả tuổi
                  </button>
                  {CON_GIAP.map((cg) => {
                    const isSelected = userChi === cg.name;
                    return (
                      <button
                        key={cg.name}
                        type="button"
                        onClick={() => handleSelectChi(cg.name)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                          isSelected
                            ? "text-white border-transparent shadow-sm"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                        style={
                          isSelected ? { backgroundColor: theme.primaryAccent } : {}
                        }
                      >
                        <span>{cg.emoji}</span>
                        <span>{cg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Purpose Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                3. Mục đích công việc
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {PURPOSE_OPTIONS.map((opt) => {
                  const active = purpose === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPurpose(opt.id)}
                      className={`p-2.5 rounded-2xl text-xs font-bold border text-center transition-all ${
                        active
                          ? "text-white border-transparent shadow-md"
                          : "bg-white/85 border-slate-200 text-slate-700 hover:bg-white"
                      }`}
                      style={active ? { backgroundColor: theme.primaryAccent } : {}}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">
                Tìm thấy{" "}
                <span style={{ color: theme.primaryAccent }}>
                  {matchingDays.length} ngày tốt
                </span>{" "}
                trong Tháng {month}/{year}
              </h2>
              <p className="text-xs text-slate-500">{activePurposeObj.desc}</p>
            </div>
            <Link
              href="/doi-ngay-am-duong"
              className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
              style={{ color: theme.primaryAccent }}
            >
              <MaterialIcon name="swap_horiz" className="text-base" />
              <span>Công cụ Đổi Ngày Âm ↔ Dương</span>
            </Link>
          </div>

          {/* Matching Days List */}
          {matchingDays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingDays.map(({ date, weekday, data, isAgeConflict }) => (
                <Link
                  key={data.d}
                  href={`/day/${formatDateString(date)}`}
                  prefetch={false}
                  className="glass-panel-light rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all border border-white/80 flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-md shrink-0"
                        style={{ backgroundColor: theme.primaryAccent }}
                      >
                        <span className="text-[10px] font-bold uppercase opacity-85">
                          T.{date.getMonth() + 1}
                        </span>
                        <span className="text-xl font-black leading-none">
                          {date.getDate()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-extrabold text-slate-800">
                            {weekday}, {format(date, "dd/MM/yyyy")}
                          </span>
                          <span
                            className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${theme.accentGold}20`,
                              color: theme.accentGold,
                            }}
                          >
                            ★ Hoàng Đạo
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          Âm lịch:{" "}
                          <strong style={{ color: theme.accentGold }}>
                            {data.ld}/{data.lm}/{data.ly}
                          </strong>{" "}
                          • Ngày <strong>{data.dgz}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Trực <strong>{data.t12}</strong> • Sao{" "}
                          <strong>{data.s28}</strong> • Hành{" "}
                          <strong>{data.nh}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
                        {data.score ?? 80} điểm
                      </span>
                    </div>
                  </div>

                  {/* Age conflict status if user selected their zodiac */}
                  {userChi !== "all" && (
                    <div
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                        isAgeConflict
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50/80 text-emerald-700 border border-emerald-200/70"
                      }`}
                    >
                      <MaterialIcon
                        name={isAgeConflict ? "cancel" : "check_circle"}
                        className="text-sm"
                      />
                      <span>
                        {isAgeConflict
                          ? `Kỵ tuổi ${userChi} (Tuổi xung: ${data.age?.join(", ")})`
                          : `Hợp tuổi ${userChi} (Không xung khắc)`}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-600 truncate">
                      <strong>Giờ tốt:</strong> {data.hd.join(", ")}
                    </span>
                    <span
                      className="font-bold shrink-0 group-hover:translate-x-0.5 transition-transform"
                      style={{ color: theme.primaryAccent }}
                    >
                      Chi tiết →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-panel-light rounded-3xl p-8 text-center space-y-2">
              <p className="text-base font-bold text-slate-700">
                Không có ngày nào khớp chính xác bộ lọc trong Tháng {month}/{year}.
              </p>
              <p className="text-xs text-slate-500">
                Hãy thử chuyển sang mục &ldquo;★ Ngày Hoàng Đạo&rdquo; hoặc chọn tháng kế tiếp.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
