import { logEvent, setUserProperties } from "firebase/analytics";
import { getAnalyticsInstance } from "./config";

/**
 * Track page view
 */
export async function trackPageView(pageName: string, pageLocation?: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "page_view", {
    page_title: pageName,
    page_location: pageLocation || window.location.href,
    page_path: window.location.pathname,
  });
}

/**
 * Track when user views a specific date
 */
export async function trackDateView(date: string, lunarDate?: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "view_date", {
    solar_date: date,
    lunar_date: lunarDate,
  });
}

/**
 * Track when user navigates calendar
 */
export async function trackCalendarNavigation(
  action: "prev_month" | "next_month" | "today" | "select_date",
  month?: number,
  year?: number
) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "calendar_navigation", {
    action,
    month,
    year,
  });
}

/**
 * Track when user views holiday details
 */
export async function trackHolidayView(holidayName: string, holidayDate: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "view_holiday", {
    holiday_name: holidayName,
    holiday_date: holidayDate,
  });
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(
  featureName: string,
  details?: Record<string, string | number | boolean>
) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "feature_usage", {
    feature_name: featureName,
    ...details,
  });
}

/**
 * Track user engagement time
 */
export async function trackEngagement(engagementTime: number) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "user_engagement", {
    engagement_time_msec: engagementTime,
  });
}

/**
 * Set user properties for segmentation
 */
export async function setUserPreferences(preferences: {
  theme?: string;
  language?: string;
  notificationsEnabled?: boolean;
}) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  setUserProperties(analytics, {
    preferred_theme: preferences.theme,
    language: preferences.language,
    notifications_enabled: preferences.notificationsEnabled?.toString(),
  });
}

/**
 * Track app download click
 */
export async function trackAppDownloadClick(platform: "ios" | "android") {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "app_download_click", {
    platform,
  });
}

/**
 * Track share action
 */
export async function trackShare(contentType: string, itemId: string) {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;

  logEvent(analytics, "share", {
    content_type: contentType,
    item_id: itemId,
  });
}
