/**
 * Day Detail Page - Server Component
 *
 * This page pre-fetches feng shui data on the server for SEO and performance.
 * Data is passed to the client component for hydration.
 */

import { Metadata } from "next";
import { DayDetailContentClient } from "@/components/day-detail/DayDetailContentClient";
import { FengShuiServerRepository } from "@/lib/fengshui/FengShuiServerRepository";

interface PageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    title: `${formattedDate} - Lịch Việt Vạn Sự An Lành`,
    description: `Xem thông tin phong thủy, giờ hoàng đạo, việc nên làm cho ngày ${formattedDate}`,
    alternates: {
      canonical: `https://lichviet.online/day/${date}`,
    },
    openGraph: {
      title: `${formattedDate} - Lịch Việt`,
      description: `Xem thông tin phong thủy, giờ hoàng đạo cho ngày ${formattedDate}`,
      type: "article",
      locale: "vi_VN",
      url: `https://lichviet.online/day/${date}`,
    },
  };
}

export default async function DayDetailPage({ params }: PageProps) {
  const { date } = await params;

  // Pre-fetch feng shui data on server
  const dateObj = new Date(date);
  const fengShuiData = FengShuiServerRepository.getByDate(dateObj);

  // Also fetch month data for calendar
  const monthData = FengShuiServerRepository.getByMonth(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1
  );

  return (
    <DayDetailContentClient
      dateString={date}
      initialFengShuiData={fengShuiData}
      initialMonthData={monthData}
    />
  );
}
