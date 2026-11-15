/**
 * HolidayService
 * Handles holiday data processing and solar term extraction
 */

import { format } from 'date-fns';
import { LunarCalculator } from '../../core/lunar';
import type { Holiday, HolidaysByMonth, HolidayCategory } from '../types/HolidayData';
import type { HolidayTemplate } from '../constants/holidays';
import { LUNAR_HOLIDAYS, SOLAR_HOLIDAYS, YEARLY_FESTIVALS } from '../constants/holidays';
import type { DayFengShuiData } from '../types/FengShuiData';

export class HolidayService {
  /**
   * Get all holidays for a specific year
   */
  static getHolidays(year: number, fengShuiData: Map<string, DayFengShuiData>): Holiday[] {
    const holidays: Holiday[] = [];

    // Convert lunar holidays to solar dates
    const lunarHolidays = this.convertLunarHolidays(year);
    holidays.push(...lunarHolidays);

    // Add solar holidays
    const solarHolidays = this.convertSolarHolidays(year);
    holidays.push(...solarHolidays);

    // Add yearly festivals
    const yearlyFestivals = this.getYearlyFestivals(year);
    holidays.push(...yearlyFestivals);

    // TODO: Temporarily disabled solar terms - uncomment when ready
    // Extract solar terms from feng shui data
    // const solarTerms = this.getSolarTerms(year, fengShuiData);
    // holidays.push(...solarTerms);

    // Sort by date
    return this.sortByDate(holidays);
  }

  /**
   * Convert lunar holidays to solar dates for the given year
   */
  static convertLunarHolidays(year: number): Holiday[] {
    const holidays: Holiday[] = [];

    for (const template of LUNAR_HOLIDAYS) {
      if (!template.lunarDate) {
        throw new Error(`Lunar date missing for holiday: ${template.id}`);
      }

      // Month 12 of lunar year (year - 1) falls in Jan/Feb of solar `year`,
      // so check both lunar years and keep only dates inside solar `year`.
      for (const lunarYear of [year - 1, year]) {
        const solarDate = this.lunarHolidayToSolar(template, lunarYear);
        if (solarDate.getFullYear() !== year) continue;

        holidays.push(this.buildHoliday(template, year, solarDate));
      }
    }

    return holidays;
  }

  /**
   * Resolve the solar date of a lunar holiday template in a given lunar year.
   * `isLunarYearEnd` (Giao thừa) = day before Tết of the next lunar year,
   * since month 12 can have 29 or 30 days.
   */
  private static lunarHolidayToSolar(template: HolidayTemplate, lunarYear: number): Date {
    if (template.isLunarYearEnd) {
      const nextTet = LunarCalculator.toSolar({
        year: lunarYear + 1,
        month: 1,
        day: 1,
        isLeapMonth: false,
      });
      return new Date(nextTet.getFullYear(), nextTet.getMonth(), nextTet.getDate() - 1);
    }

    return LunarCalculator.toSolar({
      year: lunarYear,
      month: template.lunarDate!.month,
      day: template.lunarDate!.day,
      isLeapMonth: false,
    });
  }

  /**
   * Build a Holiday from a template, applying the per-year official schedule
   * (vacation badge, description, total days) when one exists.
   */
  private static buildHoliday(template: HolidayTemplate, year: number, date: Date): Holiday {
    const schedule = template.yearlySchedules?.[year];

    return {
      id: `${template.id}-${year}`,
      name: template.name,
      type: template.type,
      category: template.category,
      date: format(date, 'yyyy-MM-dd'),
      lunarDate: template.lunarDate,
      description: schedule?.description ?? template.description,
      isImportant: template.isImportant,
      totalDays: schedule?.totalDays ?? template.totalDays,
      location: template.location,
      vacationBadge: schedule?.vacationBadge ?? template.vacationBadge,
    };
  }

  /**
   * Convert solar holidays to Holiday format
   */
  static convertSolarHolidays(year: number): Holiday[] {
    return SOLAR_HOLIDAYS.map((template) => {
      if (!template.solarDate) {
        throw new Error(`Solar date missing for holiday: ${template.id}`);
      }

      const date = new Date(year, template.solarDate.month - 1, template.solarDate.day);

      return this.buildHoliday(template, year, date);
    });
  }

  /**
   * Get yearly festivals for a specific year
   */
  static getYearlyFestivals(year: number): Holiday[] {
    const festivals: Holiday[] = [];

    for (const festival of YEARLY_FESTIVALS) {
      const yearDates = festival.dates[year];
      if (yearDates) {
        festivals.push({
          id: `${festival.id}-${year}`,
          name: festival.name,
          type: 'solar', // Festivals have fixed solar dates for each year
          category: festival.category,
          date: yearDates.startDate,
          endDate: yearDates.endDate,
          description: yearDates.description ?? festival.description,
          isImportant: festival.isImportant,
          location: festival.location,
          vacationBadge: yearDates.vacationBadge ?? festival.vacationBadge,
        });
      }
    }

    return festivals;
  }

  /**
   * Extract solar terms (Tiết khí) from feng shui data
   */
  static getSolarTerms(year: number, fengShuiData: Map<string, DayFengShuiData>): Holiday[] {
    const solarTerms: Holiday[] = [];
    const yearPrefix = `${year}-`;

    // Iterate through all days in the year
    fengShuiData.forEach((dayData) => {
      // Only include solar terms for the requested year
      if (dayData.tk && dayData.d.startsWith(yearPrefix)) {
        // This day has a solar term
        solarTerms.push({
          id: `solar-term-${dayData.d}`,
          name: dayData.tk,
          type: 'solar_term',
          date: dayData.d,
          description: 'Tiết khí',
          isImportant: false,
        });
      }
    });

    return solarTerms;
  }

  /**
   * Get holidays by category
   */
  static getHolidaysByCategory(
    year: number,
    category: HolidayCategory,
    fengShuiData: Map<string, DayFengShuiData>
  ): Holiday[] {
    const allHolidays = this.getHolidays(year, fengShuiData);
    return allHolidays.filter((holiday) => holiday.category === category);
  }

  /**
   * Get holidays for a specific month
   */
  static getHolidaysByMonth(
    year: number,
    month: number,
    fengShuiData: Map<string, DayFengShuiData>
  ): Holiday[] {
    const allHolidays = this.getHolidays(year, fengShuiData);

    return allHolidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getMonth() + 1 === month;
    });
  }

  /**
   * Group holidays by month
   */
  static groupByMonth(holidays: Holiday[]): HolidaysByMonth {
    const grouped: HolidaysByMonth = {};

    holidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      const month = date.getMonth() + 1; // 1-12

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push(holiday);
    });

    return grouped;
  }

  /**
   * Sort holidays by date (ascending)
   */
  static sortByDate(holidays: Holiday[]): Holiday[] {
    return [...holidays].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }

  /**
   * Get icon name for holiday type/category
   */
  static getHolidayIcon(type: Holiday['type'], category?: HolidayCategory): string {
    // Check category first for more specific icons
    if (category) {
      switch (category) {
        case 'PUBLIC_HOLIDAYS':
          return 'flag';
        case 'SECTOR_ANNIVERSARIES':
          return 'account-group';
        case 'CULTURAL_ETHNIC_FESTIVALS':
          return 'party-popper';
        case 'REVOLUTIONARY_ANNIVERSARIES':
          return 'star-circle';
        case 'HISTORICAL_FIGURES':
          return 'account-star';
      }
    }

    // Fallback to type-based icons
    switch (type) {
      case 'lunar':
        return 'moon-waning-crescent';
      case 'solar':
        return 'calendar';
      case 'solar_term':
        return 'flower';
      default:
        return 'calendar-star';
    }
  }

  /**
   * Get color for holiday type/category
   */
  static getHolidayColor(type: Holiday['type'], isImportant: boolean, category?: HolidayCategory): string {
    if (isImportant) {
      return '#F44336'; // Red for important holidays
    }

    // Check category for specific colors
    if (category) {
      switch (category) {
        case 'PUBLIC_HOLIDAYS':
          return '#D32F2F'; // Red
        case 'SECTOR_ANNIVERSARIES':
          return '#1976D2'; // Blue
        case 'CULTURAL_ETHNIC_FESTIVALS':
          return '#7B1FA2'; // Purple
        case 'REVOLUTIONARY_ANNIVERSARIES':
          return '#C62828'; // Dark Red - for revolutionary events
        case 'HISTORICAL_FIGURES':
          return '#5D4037'; // Brown - for historical figures
      }
    }

    // Fallback to type-based colors
    switch (type) {
      case 'lunar':
        return '#FF9800'; // Orange
      case 'solar':
        return '#2196F3'; // Blue
      case 'solar_term':
        return '#4CAF50'; // Green
      default:
        return '#757575'; // Gray
    }
  }

  /**
   * Get upcoming holidays from a specific date
   * @param fromDate - Starting date
   * @param count - Number of holidays to return
   * @param fengShuiData - Feng shui data map
   * @returns Array of upcoming holidays with countdown
   */
  static getUpcomingHolidays(
    fromDate: Date,
    count: number,
    fengShuiData: Map<string, DayFengShuiData>
  ): Array<Holiday & { daysUntil: number }> {
    const year = fromDate.getFullYear();

    // Get holidays from current and next year
    const currentYearHolidays = this.getHolidays(year, fengShuiData);
    const nextYearHolidays = this.getHolidays(year + 1, fengShuiData);
    const allHolidays = [...currentYearHolidays, ...nextYearHolidays];

    // Filter to only get important holidays (not solar terms) and future dates
    const fromDateStr = format(fromDate, 'yyyy-MM-dd');

    const upcomingHolidays = allHolidays
      .filter((holiday) => {
        // Exclude solar terms for the widget (they show in calendar)
        if (holiday.type === 'solar_term') {
          return false;
        }
        // Only future holidays
        return holiday.date >= fromDateStr;
      })
      .map((holiday) => {
        const holidayDate = new Date(holiday.date);
        const diffTime = holidayDate.getTime() - fromDate.getTime();
        const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          ...holiday,
          daysUntil,
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, count);

    return upcomingHolidays;
  }

  /**
   * Format days until as Vietnamese text
   */
  static formatDaysUntil(days: number): string {
    if (days === 0) {
      return 'Hôm nay';
    } else if (days === 1) {
      return 'Ngày mai';
    } else {
      return `${days} ngày nữa`;
    }
  }

  /**
   * Format holiday duration
   */
  static formatDuration(holiday: Holiday): string | null {
    if (holiday.totalDays && holiday.totalDays > 1) {
      return `${holiday.totalDays} ngày nghỉ`;
    }
    if (holiday.endDate && holiday.endDate !== holiday.date) {
      const start = new Date(holiday.date);
      const end = new Date(holiday.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return `${days} ngày`;
    }
    return null;
  }
}
