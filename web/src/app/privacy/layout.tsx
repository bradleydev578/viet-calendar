import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật',
  description:
    'Chính sách bảo mật của ứng dụng Lịch Việt - Vạn Sự An Lành. Tìm hiểu cách chúng tôi bảo vệ quyền riêng tư và dữ liệu của bạn.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://lichviet.online/privacy',
  },
  openGraph: {
    title: 'Chính Sách Bảo Mật | Lịch Việt',
    description: 'Chính sách bảo mật ứng dụng Lịch Việt - Vạn Sự An Lành',
    type: 'website',
    locale: 'vi_VN',
    url: 'https://lichviet.online/privacy',
    siteName: 'Lịch Việt - Vạn Sự An Lành',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Chính Sách Bảo Mật - Lịch Việt',
      },
    ],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
