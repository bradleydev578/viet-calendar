/**
 * Day Detail Page - Server Component
 *
 * This page pre-fetches feng shui data on the server for SEO and performance.
 * Data is passed to the client component for hydration.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DayDetailContentClient } from "@/components/day-detail/DayDetailContentClient";
import { FengShuiServerRepository } from "@/lib/fengshui/FengShuiServerRepository";
import { LunarCalculator, WEEKDAY_NAMES } from "@/lib/lunar";
import { parseDateString } from "@/lib/date-utils";
import { BreadcrumbJsonLd, DayPageJsonLd } from "@/components/seo";

interface PageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const dateObj = parseDateString(date);

  if (!dateObj) {
    return {
      title: "Không tìm thấy ngày",
      robots: { index: false, follow: false },
    };
  }

  const fengShuiData = FengShuiServerRepository.getByDate(dateObj);
  const lunarDate = LunarCalculator.toLunar(dateObj);
  const weekday = WEEKDAY_NAMES[dateObj.getDay()];
  const solarShort = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
  const lunarShort = `${lunarDate.day}/${lunarDate.month} Âm lịch`;
  const dayCanChi = fengShuiData?.dgz || LunarCalculator.getDayCanChi(dateObj).full;
  const dayQuality = fengShuiData
    ? fengShuiData.t12g === 1
      ? "Hoàng Đạo"
      : "Hắc Đạo"
    : "Lịch Âm Dương";

  const pageTitle = `${weekday}, ngày ${solarShort} (${lunarShort} - Ngày ${dayCanChi}, ${dayQuality})`;
  const pageDescription = fengShuiData
    ? `Xem lịch âm dương ngày ${solarShort} (${lunarShort}), ngày ${dayCanChi} (${dayQuality}). Giờ hoàng đạo: ${
        fengShuiData.hd?.join(", ") || "đang cập nhật"
      }. Việc nên làm và kiêng kỵ chi tiết.`
    : `Tra cứu lịch âm dương ngày ${solarShort} (${lunarShort}), ngày ${dayCanChi} chính xác trên Lịch Việt.`;

  return {
    title: pageTitle,
    description: pageDescription,
    robots: fengShuiData
      ? { index: true, follow: true }
      : { index: false, follow: true },
    alternates: {
      canonical: `https://lichviet.online/day/${date}`,
    },
    openGraph: {
      title: `${pageTitle} | Lịch Việt`,
      description: pageDescription,
      type: "article",
      locale: "vi_VN",
      url: `https://lichviet.online/day/${date}`,
      siteName: "Lịch Việt - Vạn Sự An Lành",
      images: [
        {
          url: `/day/${date}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Lịch Việt`,
      description: pageDescription,
      images: [`/day/${date}/opengraph-image`],
    },
  };
}

export default async function DayDetailPage({ params }: PageProps) {
  const { date } = await params;
  const dateObj = parseDateString(date);

  if (!dateObj) {
    notFound();
  }

  // Pre-fetch feng shui data on server
  const fengShuiData = FengShuiServerRepository.getByDate(dateObj);

  // Also fetch month data for calendar
  const monthData = FengShuiServerRepository.getByMonth(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1
  );

  const lunarDate = LunarCalculator.toLunar(dateObj);
  const weekday = WEEKDAY_NAMES[dateObj.getDay()];
  const solarFormatted = `${weekday}, ${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;
  const lunarFormatted = `${lunarDate.day}/${lunarDate.month}/${lunarDate.year} Âm lịch`;
  const dayQuality = fengShuiData
    ? fengShuiData.t12g === 1
      ? "Ngày Hoàng Đạo"
      : "Ngày Hắc Đạo"
    : "Lịch Âm Dương";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "https://lichviet.online" },
          {
            name: `Tháng ${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`,
            url: `https://lichviet.online/day/${date.slice(0, 7)}-01`,
          },
          {
            name: `Ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`,
            url: `https://lichviet.online/day/${date}`,
          },
        ]}
      />
      <DayPageJsonLd
        date={date}
        solarFormatted={solarFormatted}
        lunarDate={lunarFormatted}
        dayQuality={dayQuality}
        goodActivities={fengShuiData?.ga || []}
        badActivities={fengShuiData?.ba || []}
      />
      <DayDetailContentClient
        dateString={date}
        initialFengShuiData={fengShuiData}
        initialMonthData={monthData}
      />
    </>
  );
}
