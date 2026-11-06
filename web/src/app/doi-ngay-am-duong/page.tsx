import type { Metadata } from "next";
import { DateConverterClient } from "@/components/converter/DateConverterClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getVietnamToday, formatDateString } from "@/lib/date-utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Đổi Ngày Âm Dương - Chuyển Đổi Lịch Dương Sang Âm Chính Xác (1900 - 2100)",
  description:
    "Công cụ đổi ngày Âm Dương 2 chiều trực tuyến chính xác từ năm 1900 đến 2100. Tra cứu nhanh ngày Dương lịch sang Âm lịch, tháng nhuận, Can Chi, Tiết Khí, Giờ Hoàng Đạo và bảng ngày Rằm, Mùng 1.",
  keywords: [
    "đổi ngày âm dương",
    "đổi lịch âm dương",
    "chuyển ngày dương sang âm",
    "đổi ngày âm sang dương",
    "tra cứu lịch vạn niên 1900 2100",
    "xem ngày rằm mùng 1",
    "lịch âm dương việt nam",
  ],
  openGraph: {
    title: "Đổi Ngày Âm Dương 2 Chiều Chính Xác (1900 - 2100) | Lịch Việt",
    description:
      "Chuyển đổi bất kỳ ngày Dương lịch sang Âm lịch và ngược lại (1900 - 2100), tự động tính Can Chi, Tiết Khí, Giờ Hoàng Đạo và Việc Nên Làm.",
    url: "https://lichviet.online/doi-ngay-am-duong",
    siteName: "Lịch Việt - Vạn Sự An Lành",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Đổi Ngày Âm Dương - Lịch Việt Vạn Sự An Lành",
      },
    ],
  },
  alternates: {
    canonical: "https://lichviet.online/doi-ngay-am-duong",
  },
};

export default function DateConverterPage() {
  const today = getVietnamToday();
  const initialDateStr = formatDateString(today);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "https://lichviet.online" },
          {
            name: "Đổi Ngày Âm Dương",
            url: "https://lichviet.online/doi-ngay-am-duong",
          },
        ]}
      />
      <DateConverterClient initialDateStr={initialDateStr} />
    </>
  );
}
