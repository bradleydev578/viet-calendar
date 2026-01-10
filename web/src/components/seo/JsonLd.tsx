// JSON-LD Structured Data Components for SEO

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lịch Việt - Vạn Sự An Lành',
    alternateName: 'Lich Viet',
    url: 'https://lichviet.online',
    description: 'Ứng dụng lịch Việt Nam với âm lịch, phong thủy, giờ hoàng đạo, và thông tin ngày tốt xấu.',
    inLanguage: 'vi-VN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://lichviet.online/day/{search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
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
      'https://apps.apple.com/app/lich-viet',
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
    operatingSystem: 'iOS, Android',
    applicationCategory: 'UtilitiesApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
    description: 'Ứng dụng lịch âm dương Việt Nam với thông tin phong thủy, giờ hoàng đạo, và hướng dẫn việc nên làm mỗi ngày.',
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
  lunarDate: string;
  dayQuality: string;
  goodActivities: string[];
  badActivities: string[];
}

export function DayPageJsonLd({ date, lunarDate, dayQuality, goodActivities, badActivities }: DayPageJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Ngày ${date} - ${lunarDate} - ${dayQuality}`,
    description: `Thông tin phong thủy ngày ${date}. Việc nên làm: ${goodActivities.slice(0, 3).join(', ')}. Việc không nên: ${badActivities.slice(0, 3).join(', ')}.`,
    datePublished: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Lịch Việt - Vạn Sự An Lành',
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
