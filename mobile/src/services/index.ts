/**
 * Services barrel export
 */

export {
  // Initialization
  initAnalytics,
  disableAnalytics,
  enableAnalytics,
  // Screen tracking
  trackScreenView,
  // Core events
  trackAppOpen,
  trackViewToday,
  trackViewDayDetail,
  trackViewMonthCalendar,
  trackViewCompass,
  trackViewHolidays,
  trackViewSettings,
  trackViewAuspiciousHours,
  trackNavigateMonth,
  trackSelectDate,
  trackWidgetTap,
  trackHolidayTap,
  // User properties
  setUserProperty,
  setUserProperties,
  // Debug
  logDebugInstructions,
} from './analytics';
