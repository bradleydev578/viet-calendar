import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng',
  description:
    'Điều khoản sử dụng ứng dụng Lịch Việt - Vạn Sự An Lành. Thông tin về tính chất tham khảo của dữ liệu phong thủy và giới hạn trách nhiệm.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://lichviet.online/terms',
  },
  openGraph: {
    title: 'Điều Khoản Sử Dụng | Lịch Việt',
    description: 'Điều khoản sử dụng ứng dụng Lịch Việt - Vạn Sự An Lành',
    type: 'website',
    locale: 'vi_VN',
    url: 'https://lichviet.online/terms',
    siteName: 'Lịch Việt - Vạn Sự An Lành',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Điều Khoản Sử Dụng - Lịch Việt',
      },
    ],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
