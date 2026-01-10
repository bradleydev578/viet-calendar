import { MetadataRoute } from 'next';

// Generate dates for the next 2 years
function generateDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1); // Start of current year
  const endDate = new Date(today.getFullYear() + 2, 11, 31); // End of year + 2

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

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/holidays`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic day pages - generate for current year and next year
  const dates = generateDates();
  const dayPages: MetadataRoute.Sitemap = dates.map((date) => ({
    url: `${baseUrl}/day/${date}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...dayPages];
}
