import { ImageResponse } from "next/og";
import { parseDateString } from "@/lib/date-utils";
import { LunarCalculator, WEEKDAY_NAMES } from "@/lib/lunar";
import { FengShuiServerRepository } from "@/lib/fengshui/FengShuiServerRepository";
import { getMonthTheme } from "@/lib/theme";

export const alt = "Lịch Việt - Vạn Sự An Lành";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const dateObj = parseDateString(date) || new Date();
  const lunarDate = LunarCalculator.toLunar(dateObj);
  const yearInfo = LunarCalculator.getYearInfo(lunarDate.year);
  const fengShuiData = FengShuiServerRepository.getByDate(dateObj);
  const theme = getMonthTheme(dateObj.getMonth() + 1);

  const weekday = WEEKDAY_NAMES[dateObj.getDay()];
  const dayCanChi = fengShuiData?.dgz || LunarCalculator.getDayCanChi(dateObj).full;
  const monthCanChi =
    fengShuiData?.mgz || LunarCalculator.getMonthCanChi(dateObj).full;
  const isHoangDao = fengShuiData ? fengShuiData.t12g === 1 : true;
  const statusText = fengShuiData
    ? `${isHoangDao ? "★ NGÀY HOÀNG ĐẠO" : "NGÀY HẮC ĐẠO"} • TRỰC ${(
        fengShuiData.t12 || ""
      ).toUpperCase()}`
    : "LỊCH ÂM DƯƠNG VIỆT NAM";
  const goodHours =
    fengShuiData?.hd && fengShuiData.hd.length > 0
      ? `Giờ Hoàng Đạo: ${fengShuiData.hd.join(" • ")}`
      : `Năm ${yearInfo.canChi.full}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          backgroundColor: theme.background,
          color: "#1e293b",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: theme.primaryAccent,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              LV
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a" }}
              >
                Lịch Việt - Vạn Sự An Lành
              </span>
              <span style={{ fontSize: "16px", color: "#64748b" }}>
                lichviet.online
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: isHoangDao ? "#fef3c7" : "#f1f5f9",
              color: isHoangDao ? "#b45309" : "#475569",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {statusText}
          </div>
        </div>

        {/* Center Main Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            borderRadius: "32px",
            padding: "44px 56px",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
          }}
        >
          {/* Left: Solar Date */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "30px",
                fontWeight: 700,
                color: theme.primaryAccent,
                textTransform: "uppercase",
              }}
            >
              {weekday}
            </span>
            <span
              style={{
                fontSize: "136px",
                fontWeight: 900,
                lineHeight: 1.05,
                color: "#0f172a",
              }}
            >
              {dateObj.getDate()}
            </span>
            <span
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "#475569",
                marginTop: "6px",
              }}
            >
              Tháng {dateObj.getMonth() + 1}, {dateObj.getFullYear()}
            </span>
          </div>

          {/* Right: Lunar Date & Can Chi */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Âm Lịch
            </span>
            <span
              style={{
                fontSize: "88px",
                fontWeight: 900,
                lineHeight: 1.1,
                color: theme.accentGold,
              }}
            >
              {lunarDate.day}/{lunarDate.month}
            </span>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1e293b",
                marginTop: "12px",
              }}
            >
              Ngày {dayCanChi} • Tháng {monthCanChi}
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#64748b",
                marginTop: "4px",
              }}
            >
              Năm {yearInfo.canChi.full}
            </span>
          </div>
        </div>

        {/* Bottom Footer: Lucky Hours */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "22px",
            fontWeight: 700,
            color: "#334155",
          }}
        >
          <span>{goodHours}</span>
          <span style={{ color: theme.primaryAccent }}>{theme.name}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
