import { Metadata } from "next";
import { DayDetailContent } from "@/components/day-detail/DayDetailContent";

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
  };
}

export default async function DayDetailPage({ params }: PageProps) {
  const { date } = await params;
  return <DayDetailContent dateString={date} />;
}
