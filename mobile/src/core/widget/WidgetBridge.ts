/**
 * WidgetBridge.ts
 *
 * React Native bridge interface for iOS Calendar Widget
 * Provides methods to send calendar data to native widget extension
 */

import { NativeModules, Platform } from 'react-native';

const { LichVietWidgetBridge } = NativeModules;

/**
 * Data structure for a single calendar day
 */
export interface CalendarDayData {
  /** Solar calendar day (1-31) */
  solar: number;
  /** Lunar calendar day (1-30) */
  lunar: number;
  /** Lunar month (1-12) */
  lunarMonth: number;
  /** Day of week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat */
  dayOfWeek: number;
  /** Whether this day belongs to the currently displayed month */
  isCurrentMonth: boolean;
  /** Whether this day is today */
  isToday: boolean;
}

/**
 * Complete widget data structure sent to native widget
 */
export interface CalendarWidgetData {
  /** Current solar month (1-12) */
  currentMonth: number;
  /** Current solar year (e.g., 2026) */
  currentYear: number;
  /** Current lunar month (1-12) */
  lunarMonth: number;
  /** Current lunar year */
  lunarYear: number;
  /** Formatted solar month name (e.g., "Tháng 2, 2026") */
  monthName: string;
  /** Formatted lunar month name with Can Chi (e.g., "Tháng Giêng Bính Ngọ") */
  lunarMonthName: string;
  /** Array of 35 days (5 weeks × 7 days) */
  days: CalendarDayData[];
}

/**
 * Widget Bridge API
 * Provides methods to communicate with native iOS widget
 */
export const WidgetBridge = {
  /**
   * Send calendar data to native widget
   * @param data Calendar widget data to display
   */
  setCalendarData: (data: CalendarWidgetData): void => {
    if (Platform.OS === 'ios' && LichVietWidgetBridge) {
      const jsonString = JSON.stringify(data);
      LichVietWidgetBridge.setCalendarData(jsonString);
    }
  },

  /**
   * Clear calendar data from widget
   * Widget will show placeholder state
   */
  clearCalendarData: (): void => {
    if (Platform.OS === 'ios' && LichVietWidgetBridge) {
      LichVietWidgetBridge.clearCalendarData();
    }
  },

  /**
   * Check if widget bridge is available
   * @returns true if running on iOS with native module loaded
   */
  isAvailable: (): boolean => {
    return Platform.OS === 'ios' && !!LichVietWidgetBridge;
  },
};
