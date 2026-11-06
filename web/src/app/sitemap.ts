import { MetadataRoute } from 'next';
import { FengShuiServerRepository } from '@/lib/fengshui/FengShuiServerRepository';

// Generate dates strictly for years available in the Feng Shui dataset (2025-2027)
function generateDates(): string[] {
  const dates: string[] = [];
  const availableYears = FengShuiServerRepository.getAvailableYears();
  const minYear = Math.min(...availableYears);
  const maxYear = Math.max(...availableYears);

  const startDate = new Date(minYear, 0, 1, 12, 0, 0);
  const endDate = new Date(maxYear, 11, 31, 12, 0, 0);

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lichviet.online';
  const lastMod = new Date('2026-01-01T00:00:00.000Z');

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/doi-ngay-am-duong`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/xem-ngay-tot`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/holidays`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic day pages - strictly for years with verified data
  const dates = generateDates();
  const dayPages: MetadataRoute.Sitemap = dates.map((date) => ({
    url: `${baseUrl}/day/${date}`,
    lastModified: lastMod,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...dayPages];
}
