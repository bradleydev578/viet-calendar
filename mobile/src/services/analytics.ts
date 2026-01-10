/**
 * Analytics Service - Offline-Safe Wrapper for Firebase Analytics
 *
 * CRITICAL ARCHITECTURE:
 * - All methods are NON-BLOCKING and FAIL-SAFE
 * - App functionality MUST NOT depend on analytics success
 * - Firebase auto-queues events when offline (~500 events)
 * - Events sync automatically when network available
 *
 * @see docs/sprint-artifacts/tech-spec-firebase-analytics.md
 */

import analytics from '@react-native-firebase/analytics';

// Flag to disable analytics (for testing or user preference)
let analyticsEnabled = true;

/**
 * Safe wrapper for all analytics calls
 * - Never throws
 * - Never blocks
 * - Logs errors only in __DEV__
 */
const safeLogEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void => {
  if (!analyticsEnabled) return;

  // Fire and forget - no await, non-blocking
  analytics()
    .logEvent(eventName, params)
    .catch((error: Error) => {
      if (__DEV__) {
        console.warn(`[Analytics] Failed to log ${eventName}:`, error.message);
      }
      // Silent fail in production - app continues normally
    });
};

/**
 * Safe wrapper for setting user properties
 */
const safeSetUserProperty = (name: string, value: string | null): void => {
  if (!analyticsEnabled) return;

  analytics()
    .setUserProperty(name, value)
    .catch((error: Error) => {
      if (__DEV__) {
        console.warn(`[Analytics] Failed to set user property ${name}:`, error.message);
      }
    });
};

// ============ Initialization ============

/**
 * Initialize analytics on app start
 * Non-blocking, fail-safe
 */
export const initAnalytics = (): void => {
  try {
    // Enable analytics collection (async but we don't await)
    analytics()
      .setAnalyticsCollectionEnabled(true)
      .catch((error: Error) => {
        if (__DEV__) {
          console.warn('[Analytics] Failed to enable collection:', error.message);
        }
      });

    if (__DEV__) {
      console.log('[Analytics] Initialized');
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[Analytics] Init failed:', error);
    }
    // Silent fail - app continues
  }
};

/**
 * Disable analytics (for testing or user opt-out)
 */
export const disableAnalytics = (): void => {
  analyticsEnabled = false;
  analytics()
    .setAnalyticsCollectionEnabled(false)
    .catch(() => {
      // Silent fail
    });
};

/**
 * Enable analytics (re-enable after disable)
 */
export const enableAnalytics = (): void => {
  analyticsEnabled = true;
  analytics()
    .setAnalyticsCollectionEnabled(true)
    .catch(() => {
      // Silent fail
    });
};

// ============ Screen View Tracking ============

/**
 * Track screen view
 * Call this in useEffect on screen mount
 */
export const trackScreenView = (
  screenName: string,
  screenClass?: string
): void => {
  safeLogEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenClass || screenName,
  });
};

// ============ Core Events ============

/**
 * Track app open
 * Call this once on app initialization
 */
export const trackAppOpen = (): void => {
  safeLogEvent('app_open', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track Today Widget view
 * Call when TodayWidget mounts
 */
export const trackViewToday = (): void => {
  safeLogEvent('view_today', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track Day Detail view
 * Call when DayDetailScreen/DayDetailModalScreen mounts
 */
export const trackViewDayDetail = (params: {
  date: string;
  lunarDate?: string;
  dayScore?: number;
  source: 'calendar_tap' | 'widget_tap' | 'holiday_tap' | 'deep_link';
}): void => {
  safeLogEvent('view_day_detail', {
    date: params.date,
    lunar_date: params.lunarDate,
    day_score: params.dayScore,
    source: params.source,
  });
};

/**
 * Track Month Calendar view
 * Call when CalendarScreen mounts or month changes
 */
export const trackViewMonthCalendar = (params: {
  year: number;
  month: number;
}): void => {
  safeLogEvent('view_month_calendar', {
    year: params.year,
    month: params.month,
  });
};

/**
 * Track Compass view
 * Call when CompassScreen mounts
 */
export const trackViewCompass = (): void => {
  safeLogEvent('view_compass', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track Holidays view
 * Call when HolidayListScreen mounts
 */
export const trackViewHolidays = (params: { year: number }): void => {
  safeLogEvent('view_holidays', {
    year: params.year,
  });
};

/**
 * Track Settings view
 * Call when SettingsScreen mounts
 */
export const trackViewSettings = (): void => {
  safeLogEvent('view_settings', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track Auspicious Hours view (Giờ Hoàng Đạo)
 * Call when user scrolls to hours section in DayDetail
 */
export const trackViewAuspiciousHours = (date: string): void => {
  safeLogEvent('view_auspicious_hours', {
    date,
  });
};

/**
 * Track month navigation
 * Call when user swipes or taps prev/next month
 */
export const trackNavigateMonth = (params: {
  direction: 'prev' | 'next';
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}): void => {
  safeLogEvent('navigate_month', {
    direction: params.direction,
    from_month: params.fromMonth,
    from_year: params.fromYear,
    to_month: params.toMonth,
    to_year: params.toYear,
  });
};

/**
 * Track date selection
 * Call when user taps on a date in calendar
 */
export const trackSelectDate = (params: {
  date: string;
  source: 'calendar_tap' | 'today_button';
}): void => {
  safeLogEvent('select_date', {
    date: params.date,
    source: params.source,
  });
};

/**
 * Track widget tap
 * Call when user taps on TodayWidget
 */
export const trackWidgetTap = (): void => {
  safeLogEvent('widget_tap', {
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track holiday tap
 * Call when user taps on a holiday item
 */
export const trackHolidayTap = (params: {
  holidayName: string;
  holidayDate: string;
}): void => {
  safeLogEvent('holiday_tap', {
    holiday_name: params.holidayName,
    holiday_date: params.holidayDate,
  });
};

// ============ User Properties ============

/**
 * Set single user property
 */
export const setUserProperty = (
  name: string,
  value: string | null
): void => {
  safeSetUserProperty(name, value);
};

/**
 * Set multiple user properties
 * Call on app init and when properties change
 */
export const setUserProperties = (properties: {
  userType?: 'free' | 'premium';
  appVersion?: string;
}): void => {
  if (properties.userType) {
    safeSetUserProperty('user_type', properties.userType);
  }
  if (properties.appVersion) {
    safeSetUserProperty('app_version', properties.appVersion);
  }
};

// ============ Debug Helpers ============

/**
 * Log debug instructions for Firebase DebugView
 * Only logs in __DEV__ mode
 */
export const logDebugInstructions = (): void => {
  if (__DEV__) {
    console.log('========================================');
    console.log('[Analytics] Debug Mode Instructions:');
    console.log('iOS: Add -FIRDebugEnabled to Xcode scheme arguments');
    console.log('Android: adb shell setprop debug.firebase.analytics.app <package_name>');
    console.log('Then check Firebase Console → DebugView');
    console.log('========================================');
  }
};
