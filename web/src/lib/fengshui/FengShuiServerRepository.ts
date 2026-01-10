/**
 * FengShuiServerRepository.ts
 * Server-side only data access layer for feng shui data
 *
 * IMPORTANT: This file should ONLY be imported in:
 * - Server Components (no "use client" directive)
 * - API Routes
 * - Server Actions
 *
 * For client-side data fetching, use the API routes instead.
 */

import 'server-only';
import type { DayFengShuiData, FengShuiDataSet } from './types';
import { format } from 'date-fns';

// Server-side only imports
import fengShuiData2025 from '@/data/fengshui_2025.json';
import fengShuiData2026 from '@/data/fengshui_2026.json';
import fengShuiData2027 from '@/data/fengshui_2027.json';

// Type assertion for imported JSON
const dataSet2025 = fengShuiData2025 as unknown as FengShuiDataSet;
const dataSet2026 = fengShuiData2026 as unknown as FengShuiDataSet;
const dataSet2027 = fengShuiData2027 as unknown as FengShuiDataSet;

// Create a Map for O(1) lookup - initialized once on server startup
const dataMap = new Map<string, DayFengShuiData>();

[dataSet2025, dataSet2026, dataSet2027].forEach((dataSet) => {
  dataSet.days.forEach((day) => {
    dataMap.set(day.d, day);
  });
});

/**
 * Server-side repository for accessing feng shui data
 * Use this in Server Components for SSR/SSG
 */
export class FengShuiServerRepository {
  /**
   * Get feng shui data for a specific date
   * @param date - Date object
   * @returns DayFengShuiData or null if not found
   */
  static getByDate(date: Date): DayFengShuiData | null {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dataMap.get(dateKey) || null;
  }

  /**
   * Get feng shui data by date string
   * @param dateStr - Date string in YYYY-MM-DD format
   * @returns DayFengShuiData or null if not found
   */
  static getByDateString(dateStr: string): DayFengShuiData | null {
    return dataMap.get(dateStr) || null;
  }

  /**
   * Get feng shui data for a date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Array of DayFengShuiData
   */
  static getByDateRange(startDate: Date, endDate: Date): DayFengShuiData[] {
    const results: DayFengShuiData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const data = this.getByDate(currentDate);
      if (data) {
        results.push(data);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return results;
  }

  /**
   * Get feng shui data for an entire month
   * @param year - Year
   * @param month - Month (1-12)
   * @returns Array of DayFengShuiData
   */
  static getByMonth(year: number, month: number): DayFengShuiData[] {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return this.getByDateRange(startDate, endDate);
  }

  /**
   * Check if data is available for a date
   * @param date - Date to check
   * @returns boolean
   */
  static hasData(date: Date): boolean {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dataMap.has(dateKey);
  }

  /**
   * Get total number of days in the dataset
   * @returns number
   */
  static getTotalDays(): number {
    return dataMap.size;
  }

  /**
   * Get available years in the dataset
   * @returns number[]
   */
  static getAvailableYears(): number[] {
    return [2025, 2026, 2027];
  }
}
