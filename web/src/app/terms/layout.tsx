import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điều Khoản Sử Dụng | Lịch Việt - Vạn Sự An Lành',
  description: 'Điều khoản sử dụng ứng dụng Lịch Việt - Vạn Sự An Lành. Thông tin về tính chất tham khảo của dữ liệu phong thủy và giới hạn trách nhiệm.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Điều Khoản Sử Dụng | Lịch Việt',
    description: 'Điều khoản sử dụng ứng dụng Lịch Việt',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
