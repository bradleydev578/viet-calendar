import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ngày Lễ & Sự Kiện Việt Nam 2026 | Lịch Việt',
  description: 'Danh sách đầy đủ các ngày lễ, sự kiện quan trọng tại Việt Nam năm 2026. Bao gồm ngày lễ chính thức, lễ hội văn hóa, ngày kỷ niệm cách mạng và các sự kiện truyền thống.',
  keywords: ['ngày lễ việt nam', 'sự kiện 2026', 'lễ hội văn hóa', 'ngày nghỉ lễ', 'tết nguyên đán', 'lịch nghỉ lễ'],
  openGraph: {
    title: 'Ngày Lễ & Sự Kiện Việt Nam 2026',
    description: 'Tra cứu ngày lễ, sự kiện quan trọng tại Việt Nam',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function HolidaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
