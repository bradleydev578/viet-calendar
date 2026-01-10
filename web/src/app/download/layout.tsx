import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tải Ứng Dụng Lịch Việt | iOS & Android',
  description: 'Tải ứng dụng Lịch Việt - Vạn Sự An Lành miễn phí trên App Store và Google Play. Xem lịch âm dương, phong thủy, giờ hoàng đạo ngay trên điện thoại.',
  keywords: ['tải lịch việt', 'app lịch âm', 'ứng dụng phong thủy', 'lịch việt ios', 'lịch việt android'],
  alternates: {
    canonical: 'https://lichviet.online/download',
  },
  openGraph: {
    title: 'Tải Ứng Dụng Lịch Việt',
    description: 'Tải miễn phí trên App Store và Google Play',
    type: 'website',
    locale: 'vi_VN',
    url: 'https://lichviet.online/download',
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
