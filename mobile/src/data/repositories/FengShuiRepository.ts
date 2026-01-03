/**
 * FengShuiRepository.ts
 * Repository for loading and accessing feng shui data
 * Provides O(1) lookup by date using Map
 */

import { format } from 'date-fns';
import type { DayFengShuiData, FengShuiDataSet } from '../types/FengShuiData';

// Import the data files
const fengShuiData2025 = require('../../assets/data/fengshui_2025.json');
const fengShuiData2026 = require('../../assets/data/fengshui_2026.json');
const fengShuiData2027 = require('../../assets/data/fengshui_2027.json');

/**
 * Repository class for feng shui data access
 */
export class FengShuiRepository {
  private static dataMap: Map<string, DayFengShuiData> | null = null;
  private static isLoading = false;
  private static loadError: Error | null = null;

  /**
   * Load feng shui data from JSON file
   * Parses the data and stores in a Map for O(1) lookup
   * @returns Promise<Map<string, DayFengShuiData>>
   */
  static async loadData(): Promise<Map<string, DayFengShuiData>> {
    // Return cached data if already loaded
    if (this.dataMap) {
      return this.dataMap;
    }

    // Prevent concurrent loading
    if (this.isLoading) {
      // Wait for the ongoing load to complete
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading) {
            clearInterval(checkInterval);
            if (this.dataMap) {
              resolve(this.dataMap);
            } else if (this.loadError) {
              reject(this.loadError);
            }
          }
        }, 100);
      });
    }

    this.isLoading = true;
    this.loadError = null;

    try {
      // Load all available data sets
      const dataSets: FengShuiDataSet[] = [fengShuiData2025, fengShuiData2026, fengShuiData2027];

      // Create Map with date string as key
      const map = new Map<string, DayFengShuiData>();
      const loadedYears: number[] = [];

      for (const dataSet of dataSets) {
        if (!dataSet || !Array.isArray(dataSet.days)) {
          console.warn('Invalid feng shui data format for a dataset, skipping');
          continue;
        }

        for (const dayData of dataSet.days) {
          if (!dayData.d) {
            console.warn('Day data missing date field:', dayData);
            continue;
          }
          map.set(dayData.d, dayData);
        }
        loadedYears.push(dataSet.year);
      }

      this.dataMap = map;
      console.log(`Loaded ${map.size} days of feng shui data for years: ${loadedYears.join(', ')}`);

      return map;
    } catch (error) {
      this.loadError = error as Error;
      console.error('Failed to load feng shui data:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get feng shui data for a specific date
   * @param date - The date to lookup
   * @returns DayFengShuiData | null
   */
  static getByDate(date: Date): DayFengShuiData | null {
    if (!this.dataMap) {
      console.warn('Feng shui data not loaded. Call loadData() first.');
      return null;
    }

    // Format date as YYYY-MM-DD to match data keys
    const dateKey = format(date, 'yyyy-MM-dd');
    return this.dataMap.get(dateKey) || null;
  }

  /**
   * Get feng shui data for a range of dates
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Array of DayFengShuiData
   */
  static getByDateRange(startDate: Date, endDate: Date): DayFengShuiData[] {
    if (!this.dataMap) {
      console.warn('Feng shui data not loaded. Call loadData() first.');
      return [];
    }

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
   * Get feng shui data for a specific month
   * @param year - Year (e.g., 2025)
   * @param month - Month (1-12)
   * @returns Array of DayFengShuiData
   */
  static getByMonth(year: number, month: number): DayFengShuiData[] {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
    return this.getByDateRange(startDate, endDate);
  }

  /**
   * Check if data is loaded
   * @returns boolean
   */
  static isDataLoaded(): boolean {
    return this.dataMap !== null;
  }

  /**
   * Get total number of days loaded
   * @returns number
   */
  static getDataSize(): number {
    return this.dataMap?.size || 0;
  }

  /**
   * Clear cached data (for testing/debugging)
   */
  static clearCache(): void {
    this.dataMap = null;
    this.loadError = null;
  }
}
