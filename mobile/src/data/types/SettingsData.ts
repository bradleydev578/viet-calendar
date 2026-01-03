/**
 * Settings data types
 */

export interface AppSettings {
  // Display preferences
  showLunarDates: boolean;           // Show lunar dates on calendar
  showHolidays: boolean;             // Show holiday dots on calendar

  // Language (currently only Vietnamese)
  language: 'vi';

  // Notifications (future feature)
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    time: string;                    // "08:00"
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  showLunarDates: true,
  showHolidays: false,
  language: 'vi',
  notifications: {
    enabled: false,
    dailyReminder: false,
    time: '08:00',
  },
};
