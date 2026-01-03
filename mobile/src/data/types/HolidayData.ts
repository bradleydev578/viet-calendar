/**
 * Holiday data types
 */

export type HolidayType = 'lunar' | 'solar' | 'solar_term';
export type HolidayCategory =
  | 'PUBLIC_HOLIDAYS'
  | 'SECTOR_ANNIVERSARIES'
  | 'CULTURAL_ETHNIC_FESTIVALS'
  | 'REVOLUTIONARY_ANNIVERSARIES'
  | 'HISTORICAL_FIGURES';

export interface Holiday {
  id: string;
  name: string;                    // "Tết Nguyên Đán"
  type: HolidayType;
  category?: HolidayCategory;      // Internal category (not displayed in UI)
  date: string;                    // "2025-01-29" (solar date ISO format)
  endDate?: string;                // For multi-day events (festivals)
  lunarDate?: {                    // For lunar holidays
    day: number;
    month: number;
    isLeap?: boolean;
  };
  description?: string;            // Short description
  isImportant: boolean;            // Highlight important holidays
  totalDays?: number;              // For PUBLIC_HOLIDAYS - duration
  location?: string;               // For CULTURAL_ETHNIC_FESTIVALS
}

export interface HolidaysByMonth {
  [month: number]: Holiday[];      // Grouped by month (1-12)
}
