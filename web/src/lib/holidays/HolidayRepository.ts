/**
 * HolidayRepository.ts
 * Data access layer for Vietnamese holidays
 * Uses holiday constants from mobile app
 */

import type { ProcessedHoliday } from './types';
import {
  LUNAR_HOLIDAYS,
  SOLAR_HOLIDAYS,
  YEARLY_FESTIVALS,
  type HolidayTemplate,
  type YearlyFestival,
} from './constants';
import { LunarCalculator } from '@/lib/lunar';
import {
  differenceInDays,
  startOfDay,
  isBefore,
  addDays,
  format,
} from 'date-fns';

/**
 * Repository for accessing holiday data
 */
export class HolidayRepository {
  private static cachedHolidays: Map<number, ProcessedHoliday[]> = new Map();

  /**
   * Convert lunar date to solar date for a specific year
   */
  private static lunarToSolar(
    year: number,
    lunarDay: number,
    lunarMonth: number
  ): Date {
    return LunarCalculator.toSolar({
      year,
      month: lunarMonth,
      day: lunarDay,
      isLeapMonth: false,
    });
  }

  /**
   * Process a holiday template into a ProcessedHoliday for a specific year
   */
  private static processHolidayTemplate(
    template: HolidayTemplate,
    year: number,
    today: Date
  ): ProcessedHoliday {
    let startDate: Date;
    let endDate: Date;

    if (template.type === 'lunar' && template.lunarDate) {
      startDate = this.lunarToSolar(
        year,
        template.lunarDate.day,
        template.lunarDate.month
      );
    } else if (template.solarDate) {
      startDate = new Date(year, template.solarDate.month - 1, template.solarDate.day);
    } else {
      startDate = new Date(year, 0, 1);
    }

    const totalDays = template.totalDays || 1;
    endDate = totalDays > 1 ? addDays(startDate, totalDays - 1) : startDate;

    const daysUntil = differenceInDays(startDate, today);

    return {
      id: `${template.id}-${year}`,
      name: template.name,
      category: template.category,
      startDate,
      endDate,
      totalDays,
      description: template.description,
      location: template.location,
      daysUntil,
      isPast: isBefore(endDate, today),
      isImportant: template.isImportant,
      type: template.type,
    };
  }

  /**
   * Process a yearly festival into ProcessedHoliday
   */
  private static processYearlyFestival(
    festival: YearlyFestival,
    year: number,
    today: Date
  ): ProcessedHoliday | null {
    const yearDates = festival.dates[year];
    if (!yearDates) return null;

    const startDate = new Date(yearDates.startDate);
    const endDate = new Date(yearDates.endDate);
    const totalDays = differenceInDays(endDate, startDate) + 1;
    const daysUntil = differenceInDays(startDate, today);

    return {
      id: `${festival.id}-${year}`,
      name: festival.name,
      category: festival.category,
      startDate,
      endDate,
      totalDays,
      description: festival.description,
      location: festival.location,
      daysUntil,
      isPast: isBefore(endDate, today),
      isImportant: festival.isImportant,
      type: 'lunar',
    };
  }

  /**
   * Get all holidays for a specific year
   */
  static getHolidaysForYear(year: number): ProcessedHoliday[] {
    // Check cache
    if (this.cachedHolidays.has(year)) {
      return this.cachedHolidays.get(year)!;
    }

    const today = startOfDay(new Date());
    const holidays: ProcessedHoliday[] = [];

    // Process lunar holidays
    LUNAR_HOLIDAYS.forEach((template) => {
      holidays.push(this.processHolidayTemplate(template, year, today));
    });

    // Process solar holidays
    SOLAR_HOLIDAYS.forEach((template) => {
      holidays.push(this.processHolidayTemplate(template, year, today));
    });

    // Process yearly festivals
    YEARLY_FESTIVALS.forEach((festival) => {
      const processed = this.processYearlyFestival(festival, year, today);
      if (processed) {
        holidays.push(processed);
      }
    });

    // Sort by start date
    holidays.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Cache the result
    this.cachedHolidays.set(year, holidays);

    return holidays;
  }

  /**
   * Get all holidays (current year + next year)
   */
  static getAllHolidays(): ProcessedHoliday[] {
    const currentYear = new Date().getFullYear();
    const holidays = [
      ...this.getHolidaysForYear(currentYear),
      ...this.getHolidaysForYear(currentYear + 1),
    ];

    // Update daysUntil for all holidays
    const today = startOfDay(new Date());
    holidays.forEach((h) => {
      h.daysUntil = differenceInDays(h.startDate, today);
      h.isPast = isBefore(h.endDate, today);
    });

    // Sort by start date
    return holidays.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  /**
   * Get upcoming holidays (not past)
   */
  static getUpcomingHolidays(limit: number = 10): ProcessedHoliday[] {
    return this.getAllHolidays()
      .filter((h) => !h.isPast)
      .slice(0, limit);
  }

  /**
   * Get upcoming holidays from a specific date
   */
  static getUpcomingFromDate(fromDate: Date, limit: number = 5): ProcessedHoliday[] {
    const targetDate = startOfDay(fromDate);
    const currentYear = fromDate.getFullYear();
    
    // Get holidays for current year and next year
    const holidays = [
      ...this.getHolidaysForYear(currentYear),
      ...this.getHolidaysForYear(currentYear + 1),
    ];

    // Update daysUntil relative to fromDate
    return holidays
      .map((h) => ({
        ...h,
        daysUntil: differenceInDays(h.startDate, targetDate),
      }))
      .filter((h) => h.daysUntil > 0) // Only future holidays from the target date
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, limit);
  }

  /**
   * Get holidays by category
   */
  static getByCategory(category: string): ProcessedHoliday[] {
    return this.getAllHolidays().filter((h) => h.category === category);
  }

  /**
   * Search holidays by name
   */
  static search(query: string): ProcessedHoliday[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllHolidays().filter(
      (h) =>
        h.name.toLowerCase().includes(lowerQuery) ||
        h.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get holidays for a specific date
   */
  static getByDate(date: Date): ProcessedHoliday[] {
    const targetDate = startOfDay(date);
    return this.getAllHolidays().filter((h) => {
      const start = startOfDay(h.startDate);
      const end = startOfDay(h.endDate);
      return targetDate >= start && targetDate <= end;
    });
  }

  /**
   * Get all unique categories
   */
  static getCategories(): string[] {
    const categories = new Set<string>();
    [...LUNAR_HOLIDAYS, ...SOLAR_HOLIDAYS].forEach((h) => {
      categories.add(h.category);
    });
    YEARLY_FESTIVALS.forEach((f) => {
      categories.add(f.category);
    });
    return Array.from(categories);
  }
}
