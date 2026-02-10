/**
 * useWidgetSync.ts
 *
 * React hook for automatic widget data synchronization
 * Syncs calendar data on:
 * - App mount
 * - App becomes active (foreground)
 * - Midnight (day change)
 */

import { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { WidgetBridge } from './WidgetBridge';
import { prepareWidgetData } from './WidgetDataPreparer';

/**
 * Hook that manages automatic widget data synchronization
 *
 * @returns Object containing syncWidget function for manual sync
 *
 * @example
 * ```tsx
 * function App() {
 *   const { syncWidget } = useWidgetSync();
 *
 *   // Widget syncs automatically, but can also sync manually:
 *   const handleRefresh = () => syncWidget();
 *
 *   return <YourApp />;
 * }
 * ```
 */
export function useWidgetSync() {
  // Track timer ID using ref to properly clear on unmount/reschedule
  const midnightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Sync widget with current calendar data
   */
  const syncWidget = useCallback(() => {
    if (!WidgetBridge.isAvailable()) {
      return;
    }

    try {
      const data = prepareWidgetData(new Date());
      WidgetBridge.setCalendarData(data);

      if (__DEV__) {
        console.log('[Widget] Synced calendar data for', data.monthName);
      }
    } catch (error) {
      console.error('[Widget] Failed to sync:', error);
    }
  }, []);

  /**
   * Schedule next midnight sync
   */
  const scheduleMidnightSync = useCallback(() => {
    // Clear any existing timer
    if (midnightTimerRef.current !== null) {
      clearTimeout(midnightTimerRef.current);
    }

    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1 // 00:00:01 - just after midnight
    );
    const msUntilMidnight = midnight.getTime() - now.getTime();

    midnightTimerRef.current = setTimeout(() => {
      syncWidget();
      // Schedule next midnight sync
      scheduleMidnightSync();
    }, msUntilMidnight);
  }, [syncWidget]);

  useEffect(() => {
    // Sync on mount
    syncWidget();

    // Sync when app becomes active
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        syncWidget();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Schedule midnight sync
    scheduleMidnightSync();

    // Cleanup
    return () => {
      subscription.remove();
      if (midnightTimerRef.current !== null) {
        clearTimeout(midnightTimerRef.current);
        midnightTimerRef.current = null;
      }
    };
  }, [syncWidget, scheduleMidnightSync]);

  return { syncWidget };
}
