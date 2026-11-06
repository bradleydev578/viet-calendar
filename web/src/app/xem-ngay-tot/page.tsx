import type { Metadata } from "next";
import { AuspiciousDaysClient } from "@/components/auspicious/AuspiciousDaysClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getVietnamToday, formatDateString } from "@/lib/date-utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Xem Ngày Tốt Theo Tuổi & Công Việc - Chọn Ngày Hoàng Đạo (1900 - 2100)",
  description:
    "Tra cứu ngày tốt, ngày Hoàng Đạo theo tháng năm và tuổi gia chủ cho các việc đại sự: Cưới hỏi, Khai trương, Động thổ, Xây dựng, Nhập trạch, Xuất hành.",
  keywords: [
    "xem ngày tốt",
    "ngày hoàng đạo",
    "xem ngày tốt cưới hỏi",
    "xem ngày tốt khai trương",
    "xem ngày tốt động thổ",
    "xem ngày tốt hợp tuổi",
    "lịch vạn sự ngày tốt",
  ],
  openGraph: {
    title: "Xem Ngày Tốt Theo Tuổi & Công Việc | Lịch Việt",
    description:
      "Chọn ngày lành tháng tốt hợp tuổi cho Cưới hỏi, Khai trương, Động thổ, Nhập trạch, Xuất hành.",
    url: "https://lichviet.online/xem-ngay-tot",
    siteName: "Lịch Việt - Vạn Sự An Lành",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Xem Ngày Tốt - Lịch Việt Vạn Sự An Lành",
      },
    ],
  },
  alternates: {
    canonical: "https://lichviet.online/xem-ngay-tot",
  },
};

export default function AuspiciousDaysPage() {
  const today = getVietnamToday();
  const initialDateStr = formatDateString(today);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", url: "https://lichviet.online" },
          {
            name: "Xem Ngày Tốt",
            url: "https://lichviet.online/xem-ngay-tot",
          },
        ]}
      />
      <AuspiciousDaysClient initialDateStr={initialDateStr} />
    </>
  );
}
