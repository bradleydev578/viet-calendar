/**
 * Client-side feng shui data fetching utilities
 * Uses API routes instead of direct JSON imports
 *
 * IMPORTANT: Use this in client components instead of FengShuiRepository
 */

import type { DayFengShuiData } from './types';

/**
 * Fetch feng shui data for a single date
 * @param date - Date object or string in YYYY-MM-DD format
 * @returns Promise<DayFengShuiData | null>
 */
export async function fetchFengShuiByDate(
  date: Date | string
): Promise<DayFengShuiData | null> {
  const dateStr = typeof date === 'string' ? date : formatDate(date);

  try {
    const response = await fetch(`/api/fengshui?date=${dateStr}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch feng shui data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching feng shui data:', error);
    return null;
  }
}

/**
 * Fetch feng shui data for an entire month
 * @param year - Year (2025-2027)
 * @param month - Month (1-12)
 * @returns Promise<DayFengShuiData[]>
 */
export async function fetchFengShuiByMonth(
  year: number,
  month: number
): Promise<DayFengShuiData[]> {
  try {
    const response = await fetch(
      `/api/fengshui/month?year=${year}&month=${month}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch month data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching month data:', error);
    return [];
  }
}

/**
 * Format date to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Create a client-side cache for feng shui data
 * Useful for reducing API calls during navigation
 */
export function createFengShuiCache() {
  const cache = new Map<string, DayFengShuiData>();

  return {
    get: (date: Date | string): DayFengShuiData | undefined => {
      const key = typeof date === 'string' ? date : formatDate(date);
      return cache.get(key);
    },

    set: (data: DayFengShuiData): void => {
      cache.set(data.d, data);
    },

    setMany: (dataArray: DayFengShuiData[]): void => {
      dataArray.forEach((data) => cache.set(data.d, data));
    },

    has: (date: Date | string): boolean => {
      const key = typeof date === 'string' ? date : formatDate(date);
      return cache.has(key);
    },

    clear: (): void => {
      cache.clear();
    },

    size: (): number => {
      return cache.size;
    },
  };
}
