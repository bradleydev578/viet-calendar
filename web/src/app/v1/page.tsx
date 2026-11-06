import type { Metadata } from "next";
import { HomeClientV1 } from "@/components/v1/HomeClientV1";
import { FengShuiServerRepository } from "@/lib/fengshui/FengShuiServerRepository";
import { QuoteServerRepository } from "@/lib/quotes/QuoteServerRepository";
import { getVietnamToday, formatDateString } from "@/lib/date-utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Giao Diện V1 (Cổ Điển) - Lịch Việt Vạn Sự An Lành",
  description:
    "Phiên bản giao diện V1 của Lịch Việt Vạn Sự An Lành - Tra cứu âm lịch, phong thủy, giờ hoàng đạo và ngày tốt xấu.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://lichviet.online",
  },
};

export default async function HomeV1Page() {
  const today = getVietnamToday();
  const todayStr = formatDateString(today);

  const initialFengShuiData = FengShuiServerRepository.getByDate(today);
  const initialMonthData = FengShuiServerRepository.getByMonth(
    today.getFullYear(),
    today.getMonth() + 1
  );
  const quote = QuoteServerRepository.getQuoteOfTheDay(today);
  const initialQuote = quote.text;

  return (
    <HomeClientV1
      initialFengShuiData={initialFengShuiData}
      initialMonthData={initialMonthData}
      initialQuote={initialQuote}
      initialDate={todayStr}
    />
  );
}
