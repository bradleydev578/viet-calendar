// JSON-LD Structured Data Components for SEO

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://lichviet.online/#website',
    name: 'Lịch Việt - Vạn Sự An Lành',
    alternateName: 'Lich Viet',
    url: 'https://lichviet.online',
    description:
      'Ứng dụng lịch Việt Nam với âm lịch, phong thủy, giờ hoàng đạo, và thông tin ngày tốt xấu.',
    inLanguage: 'vi-VN',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://lichviet.online/#organization',
    name: 'Lịch Việt - Vạn Sự An Lành',
    url: 'https://lichviet.online',
    logo: 'https://lichviet.online/icon-512.png',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'bradley.dev578@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['Vietnamese', 'English'],
    },
    sameAs: [
      'https://apps.apple.com/vn/app/l%E1%BB%8Bch-vi%E1%BB%87t-v%E1%BA%A1n-s%E1%BB%B1-an-l%C3%A0nh/id6758169645',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Lịch Việt - Vạn Sự An Lành',
    operatingSystem: 'iOS',
    applicationCategory: 'UtilitiesApplication',
    url: 'https://lichviet.online/download',
    downloadUrl:
      'https://apps.apple.com/vn/app/l%E1%BB%8Bch-vi%E1%BB%87t-v%E1%BA%A1n-s%E1%BB%B1-an-l%C3%A0nh/id6758169645',
    installUrl:
      'https://apps.apple.com/vn/app/l%E1%BB%8Bch-vi%E1%BB%87t-v%E1%BA%A1n-s%E1%BB%B1-an-l%C3%A0nh/id6758169645',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    description:
      'Ứng dụng lịch âm dương Việt Nam với thông tin phong thủy, giờ hoàng đạo, và hướng dẫn việc nên làm mỗi ngày.',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface DayPageJsonLdProps {
  date: string;
  solarFormatted: string;
  lunarDate: string;
  dayQuality: string;
  goodActivities: string[];
  badActivities: string[];
}

export function DayPageJsonLd({
  date,
  solarFormatted,
  lunarDate,
  dayQuality,
  goodActivities,
  badActivities,
}: DayPageJsonLdProps) {
  const pageUrl = `https://lichviet.online/day/${date}`;
  const goodSummary =
    goodActivities.length > 0
      ? `Việc nên làm: ${goodActivities.slice(0, 3).join(', ')}. `
      : '';
  const badSummary =
    badActivities.length > 0
      ? `Việc kiêng kỵ: ${badActivities.slice(0, 3).join(', ')}.`
      : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: `${solarFormatted} (${lunarDate}) - ${dayQuality}`,
    description: `Xem âm lịch, can chi, giờ hoàng đạo ngày ${solarFormatted} (${lunarDate}). ${goodSummary}${badSummary}`.trim(),
    image: ['https://lichviet.online/og-image.webp'],
    inLanguage: 'vi-VN',
    datePublished: '2025-01-01T00:00:00.000Z',
    dateModified: '2026-01-01T00:00:00.000Z',
    author: {
      '@type': 'Organization',
      name: 'Lịch Việt - Vạn Sự An Lành',
      url: 'https://lichviet.online',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lịch Việt - Vạn Sự An Lành',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lichviet.online/icon-512.png',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface EventJsonLdProps {
  name: string;
  startDate: string;
  description?: string;
}

export function EventJsonLd({ name, startDate, description }: EventJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    description: description || `${name} - Sự kiện quan trọng tại Việt Nam`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Country',
      name: 'Vietnam',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
