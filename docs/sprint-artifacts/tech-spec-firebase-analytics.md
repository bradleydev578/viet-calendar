# Tech-Spec: Firebase Analytics Integration

**Created:** 2026-01-10
**Status:** Ready for Development
**PRD Reference:** [docs/prd-firebase-analytics.md](../prd-firebase-analytics.md)

## Overview

### Problem Statement

Lịch Việt Vạn Sự An Lành là ứng dụng offline-first với hàng ngàn downloads, nhưng không có visibility vào cách users thực sự tương tác với các tính năng. Cần tracking user behavior để trả lời câu hỏi: "Users có thực sự sử dụng Day Detail hay chỉ lướt qua Today Widget?"

### Solution

Integrate Firebase Analytics SDK với **offline-resilient architecture**:
- Analytics service layer wraps tất cả Firebase calls
- Try-catch wrapper đảm bảo app không crash khi Firebase fail
- Firebase tự động queue events khi offline và sync khi có network
- App hoạt động 100% bình thường dù có hay không có network

### Scope

**In Scope (MVP - Phase 1):**
- Firebase SDK setup (iOS + Android)
- Analytics service layer với offline-safe wrappers
- 12 core events tracking
- 3 user properties
- Screen view tracking cho 5 screens

**Out of Scope:**
- Server-side analytics
- A/B testing
- Push notifications
- Crashlytics (separate integration)

## Context for Development

### Codebase Patterns

**Zustand Store Pattern:**
```typescript
// Pattern từ useFengShuiStore.ts - analytics service nên follow tương tự
interface Store {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  actions: () => void;
}
```

**App Initialization Pattern (App.tsx):**
```typescript
// Analytics init sẽ đặt ở đây, cùng level với loadFengShuiData
useEffect(() => {
  loadFengShuiData().catch(error => { ... });
  // Analytics init sẽ thêm vào đây
}, []);
```

**Screen Component Pattern:**
```typescript
// Screens sử dụng useEffect for side effects
export function ScreenName() {
  useEffect(() => {
    // Screen tracking sẽ thêm vào đây
  }, []);
  return <View>...</View>;
}
```

### Files to Reference

| File | Purpose | Key Patterns |
|------|---------|--------------|
| [App.tsx](../../mobile/src/app/App.tsx) | App root, initialization | useEffect for async init |
| [useFengShuiStore.ts](../../mobile/src/stores/useFengShuiStore.ts) | Store pattern | Zustand store structure |
| [CalendarScreen/index.tsx](../../mobile/src/screens/CalendarScreen/index.tsx) | Main screen | Navigation, date handling |
| [DayDetailScreen/index.tsx](../../mobile/src/screens/DayDetailScreen/index.tsx) | Detail screen | Route params, data display |
| [navigation/types.ts](../../mobile/src/app/navigation/types.ts) | Navigation types | Screen param types |

### Technical Decisions

**1. Offline-Resilient Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      App Components                          │
│  (CalendarScreen, DayDetailScreen, CompassScreen, etc.)     │
└─────────────────────────┬───────────────────────────────────┘
                          │ trackEvent(), trackScreenView()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Analytics Service                          │
│  src/services/analytics.ts                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  try {                                               │   │
│  │    await analytics().logEvent(...)                   │   │
│  │  } catch (error) {                                   │   │
│  │    // SILENT FAIL - log to console only in __DEV__   │   │
│  │    if (__DEV__) console.warn('[Analytics]', error);  │   │
│  │  }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ (may fail silently)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Firebase Analytics SDK                     │
│  - Auto queues events when offline (~500 events)            │
│  - Auto syncs when network available                        │
│  - Events older than 72h may be dropped                     │
└─────────────────────────────────────────────────────────────┘
```

**2. No Blocking Operations**

- Tất cả analytics calls là async và fire-and-forget
- Không await analytics trong render path
- Không show error UI khi analytics fail
- App startup không bị block bởi Firebase init

**3. Graceful Degradation**

```typescript
// ✅ GOOD - Non-blocking, fail-safe
const trackScreenView = (screenName: string) => {
  // Fire and forget - không await
  safeLogEvent('screen_view', { screen_name: screenName });
};

// ❌ BAD - Blocking, can crash app
const trackScreenView = async (screenName: string) => {
  await analytics().logScreenView({ screen_name: screenName }); // Can throw!
};
```

## Implementation Plan

### Tasks

#### Task 1: Firebase Project Setup & SDK Installation

**Files to create/modify:**
- `mobile/package.json` - Add dependencies
- `mobile/ios/Podfile` - iOS configuration
- `mobile/android/build.gradle` - Android configuration
- `mobile/android/app/build.gradle` - App-level config
- `mobile/ios/GoogleService-Info.plist` - Firebase config (NEW)
- `mobile/android/app/google-services.json` - Firebase config (NEW)

**Steps:**
1. Create Firebase project in Firebase Console
2. Register iOS app (bundle ID from Xcode)
3. Register Android app (package name from AndroidManifest.xml)
4. Download config files
5. Install packages:
```bash
cd mobile
npm install @react-native-firebase/app @react-native-firebase/analytics
cd ios && pod install
```

6. Configure iOS (`ios/Podfile`):
```ruby
# Add at top
$RNFirebaseAsStaticFramework = true

# In target block
pod 'FirebaseAnalytics'
```

7. Configure Android (`android/build.gradle`):
```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
  }
}
```

8. Configure Android app (`android/app/build.gradle`):
```gradle
apply plugin: 'com.google.gms.google-services'
```

---

#### Task 2: Create Analytics Service Layer (Offline-Safe)

**Files to create:**
- `mobile/src/services/analytics.ts` (NEW)
- `mobile/src/services/index.ts` (NEW - barrel export)

**Implementation:**

```typescript
// src/services/analytics.ts
import analytics from '@react-native-firebase/analytics';

/**
 * Analytics Service - Offline-Safe Wrapper
 *
 * CRITICAL: All methods MUST be non-blocking and fail-safe.
 * App functionality MUST NOT depend on analytics success.
 */

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
  params?: Record<string, any>
): void => {
  if (!analyticsEnabled) return;

  // Fire and forget - no await
  analytics()
    .logEvent(eventName, params)
    .catch((error) => {
      if (__DEV__) {
        console.warn(`[Analytics] Failed to log ${eventName}:`, error);
      }
      // Silent fail in production - app continues normally
    });
};

/**
 * Initialize analytics on app start
 * Non-blocking, fail-safe
 */
export const initAnalytics = (): void => {
  try {
    // Enable analytics collection
    analytics().setAnalyticsCollectionEnabled(true);

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
    .catch(() => {});
};

// ============ Screen View Tracking ============

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

export const trackAppOpen = (): void => {
  safeLogEvent('app_open', {
    timestamp: new Date().toISOString(),
  });
};

export const trackViewToday = (): void => {
  safeLogEvent('view_today', {
    timestamp: new Date().toISOString(),
  });
};

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

export const trackViewMonthCalendar = (params: {
  year: number;
  month: number;
}): void => {
  safeLogEvent('view_month_calendar', {
    year: params.year,
    month: params.month,
  });
};

export const trackViewCompass = (): void => {
  safeLogEvent('view_compass', {
    timestamp: new Date().toISOString(),
  });
};

export const trackViewAuspiciousHours = (date: string): void => {
  safeLogEvent('view_auspicious_hours', {
    date,
  });
};

export const trackNavigateMonth = (params: {
  direction: 'prev' | 'next';
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}): void => {
  safeLogEvent('navigate_month', params);
};

export const trackSelectDate = (params: {
  date: string;
  source: 'calendar_tap' | 'today_button';
}): void => {
  safeLogEvent('select_date', params);
};

// ============ User Properties ============

export const setUserProperty = (
  name: string,
  value: string | null
): void => {
  analytics()
    .setUserProperty(name, value)
    .catch((error) => {
      if (__DEV__) {
        console.warn(`[Analytics] Failed to set user property ${name}:`, error);
      }
    });
};

export const setUserProperties = (properties: {
  userType?: 'free' | 'premium';
  daysSinceInstall?: number;
  appVersion?: string;
}): void => {
  if (properties.userType) {
    setUserProperty('user_type', properties.userType);
  }
  if (properties.daysSinceInstall !== undefined) {
    setUserProperty('days_since_install', String(properties.daysSinceInstall));
  }
  if (properties.appVersion) {
    setUserProperty('app_version', properties.appVersion);
  }
};

// ============ Debug Helpers ============

/**
 * Enable DebugView in Firebase Console (dev only)
 * Run: adb shell setprop debug.firebase.analytics.app <package_name>
 */
export const enableDebugMode = (): void => {
  if (__DEV__) {
    console.log('[Analytics] Debug mode: Use Firebase DebugView');
    console.log('iOS: Add -FIRDebugEnabled to scheme arguments');
    console.log('Android: adb shell setprop debug.firebase.analytics.app com.lichviet');
  }
};
```

**Barrel export:**
```typescript
// src/services/index.ts
export * from './analytics';
```

---

#### Task 3: Initialize Analytics in App.tsx

**File to modify:** `mobile/src/app/App.tsx`

**Changes:**
```typescript
// Add import
import { initAnalytics, trackAppOpen, setUserProperties } from '../services/analytics';
import { version } from '../../package.json';

function App(): React.JSX.Element {
  const loadFengShuiData = useFengShuiStore(state => state.loadData);
  const loadSettings = useSettingsStore(state => state.loadSettings);

  useEffect(() => {
    // Initialize analytics (non-blocking)
    initAnalytics();

    // Track app open
    trackAppOpen();

    // Set user properties
    setUserProperties({
      userType: 'free',
      appVersion: version,
    });

    // Existing data loading...
    loadFengShuiData().catch(error => {
      console.error('Failed to load feng shui data:', error);
    });

    setTimeout(() => {
      loadSettings().catch(error => {
        console.error('Failed to load settings:', error);
      });
    }, 100);
  }, [loadFengShuiData, loadSettings]);

  // ... rest unchanged
}
```

---

#### Task 4: Add Screen View Tracking to All Screens

**Files to modify:**
1. `mobile/src/screens/CalendarScreen/index.tsx`
2. `mobile/src/screens/DayDetailScreen/index.tsx`
3. `mobile/src/screens/DayDetailScreen/DayDetailModalScreen.tsx`
4. `mobile/src/screens/CompassScreen/index.tsx`
5. `mobile/src/screens/HolidayListScreen/index.tsx`
6. `mobile/src/screens/SettingsScreen/index.tsx`
7. `mobile/src/components/TodayWidget/index.tsx`

**Pattern for each screen:**

```typescript
// CalendarScreen/index.tsx
import {
  trackScreenView,
  trackViewMonthCalendar,
  trackNavigateMonth,
  trackSelectDate
} from '../../services/analytics';

export function CalendarScreen() {
  // ... existing code ...

  // Track screen view on mount
  useEffect(() => {
    trackScreenView('CalendarScreen');
    trackViewMonthCalendar({
      year: currentMonth.getFullYear(),
      month: currentMonth.getMonth() + 1,
    });
  }, []);

  // Track month navigation
  const handlePrevMonth = useCallback(() => {
    const prevMonth = subMonths(currentMonth, 1);

    // Track before state change
    trackNavigateMonth({
      direction: 'prev',
      fromMonth: currentMonth.getMonth() + 1,
      fromYear: currentMonth.getFullYear(),
      toMonth: prevMonth.getMonth() + 1,
      toYear: prevMonth.getFullYear(),
    });

    setCurrentMonth(prevMonth);
  }, [currentMonth]);

  // Track date selection
  const handleSelectDate = useCallback((date: Date) => {
    trackSelectDate({
      date: date.toISOString(),
      source: 'calendar_tap',
    });

    setSelectedDate(date);
    navigation.navigate('DayDetailModal', {
      date: date.toISOString(),
    });
  }, [navigation]);

  // ... rest unchanged
}
```

```typescript
// DayDetailScreen/index.tsx & DayDetailModalScreen.tsx
import { trackScreenView, trackViewDayDetail } from '../../services/analytics';
import { DayScore } from '../../core/fengshui/DayScore';

export function DayDetailScreen({ route }: DayDetailScreenProps) {
  // ... existing code ...

  // Track screen view with day detail params
  useEffect(() => {
    trackScreenView('DayDetailScreen');

    if (dayData && score) {
      trackViewDayDetail({
        date: format(date, 'yyyy-MM-dd'),
        lunarDate: `${dayData.ld}/${dayData.lm}`,
        dayScore: score.score,
        source: 'calendar_tap', // or determine from navigation
      });
    }
  }, [date, dayData, score]);

  // ... rest unchanged
}
```

```typescript
// CompassScreen/index.tsx
import { trackScreenView, trackViewCompass } from '../../services/analytics';

export function CompassScreen() {
  useEffect(() => {
    trackScreenView('CompassScreen');
    trackViewCompass();
  }, []);

  // ... rest unchanged
}
```

```typescript
// TodayWidget/index.tsx
import { trackViewToday } from '../../services/analytics';

export function TodayWidget({ onPress, onHolidayPress }: TodayWidgetProps) {
  // Track widget view on mount
  useEffect(() => {
    trackViewToday();
  }, []);

  // ... rest unchanged
}
```

---

#### Task 5: Update Privacy Policy

**File to modify:** `PRIVACY_POLICY.md`

**Add section (Vietnamese):**
```markdown
### Thu thập dữ liệu phân tích (Analytics)

Ứng dụng sử dụng **Firebase Analytics** (Google) để thu thập dữ liệu sử dụng ẩn danh nhằm cải thiện trải nghiệm người dùng.

**Dữ liệu được thu thập:**
- Thông tin thiết bị (hệ điều hành, phiên bản, kích thước màn hình)
- Phiên bản ứng dụng
- Các màn hình được xem và tính năng được sử dụng
- Thời gian sử dụng ứng dụng

**Dữ liệu KHÔNG thu thập:**
- Tên, email, số điện thoại hoặc thông tin cá nhân
- Vị trí địa lý
- Nội dung bạn xem (ngày cụ thể, thông tin phong thủy)

**Mục đích:**
- Hiểu cách người dùng sử dụng ứng dụng
- Cải thiện tính năng dựa trên hành vi sử dụng
- Tối ưu hiệu suất ứng dụng

**Quyền của bạn:**
- Dữ liệu được thu thập ẩn danh, không liên kết với danh tính cá nhân
```

---

#### Task 6: Testing & Verification

**Steps:**
1. **DebugView Testing (iOS):**
   - Edit scheme → Arguments → Add `-FIRDebugEnabled`
   - Run app, check Firebase Console → DebugView

2. **DebugView Testing (Android):**
   ```bash
   adb shell setprop debug.firebase.analytics.app com.lichviet
   ```

3. **Offline Testing:**
   - Enable airplane mode
   - Navigate through app (all screens)
   - Verify app works normally
   - Disable airplane mode
   - Wait 24h, check Firebase Console for events

4. **Performance Testing:**
   - Measure app startup time before/after
   - Verify < 100ms increase

---

### Acceptance Criteria

- [ ] **AC1:** Firebase SDK initializes without blocking app startup
  - Given: App launches
  - When: Firebase fails to initialize (network error)
  - Then: App continues to function normally, no error shown to user

- [ ] **AC2:** Events fire correctly when online
  - Given: Device has network connection
  - When: User navigates to CalendarScreen
  - Then: `screen_view` event appears in Firebase DebugView within 5 seconds

- [ ] **AC3:** Events queue when offline
  - Given: Device is in airplane mode
  - When: User navigates through app
  - Then: App functions normally with no errors

- [ ] **AC4:** Queued events sync when online
  - Given: Events were logged while offline
  - When: Device regains network connection
  - Then: Events appear in Firebase Console within 24 hours

- [ ] **AC5:** App startup time not significantly impacted
  - Given: App with analytics integrated
  - When: Cold start app
  - Then: Startup time increases by < 100ms compared to baseline

- [ ] **AC6:** All 5 main screens track screen_view
  - Given: User navigates to each screen
  - When: Screen mounts
  - Then: Corresponding screen_view event logged

- [ ] **AC7:** Day detail tracks with correct parameters
  - Given: User taps on a date
  - When: DayDetailScreen shows
  - Then: view_day_detail event has date, lunar_date, day_score, source params

## Additional Context

### Dependencies

**New packages to install:**
```json
{
  "@react-native-firebase/app": "^21.x",
  "@react-native-firebase/analytics": "^21.x"
}
```

**Peer dependencies (already installed):**
- react-native >= 0.73.0
- react >= 18.0.0

### Testing Strategy

1. **Unit Tests:** Mock `@react-native-firebase/analytics` module
2. **Integration Tests:** Use Firebase DebugView for real-time verification
3. **Regression Tests:** Verify app functions with analytics disabled

**Mock example:**
```typescript
// __mocks__/@react-native-firebase/analytics.ts
export default () => ({
  logEvent: jest.fn().mockResolvedValue(undefined),
  logScreenView: jest.fn().mockResolvedValue(undefined),
  setUserProperty: jest.fn().mockResolvedValue(undefined),
  setAnalyticsCollectionEnabled: jest.fn().mockResolvedValue(undefined),
});
```

### Notes

**React Native Version:**
- PRD specifies RN 0.77+, current app uses 0.73.4
- @react-native-firebase v21.x supports RN 0.73+
- Upgrade to 0.77 not required for analytics, but recommended for future

**Event Naming:**
- Firebase has reserved event names (don't use: `app_exception`, `app_update`, etc.)
- Custom events should use snake_case
- Event names max 40 characters
- Parameter names max 40 characters

**Data Limits:**
- Max 500 events queued offline
- Events older than 72h may be dropped
- Max 25 user properties per user

**Console Setup:**
- Mark `view_day_detail` as conversion event
- Mark `first_open` as conversion event
- Create Activation funnel: first_open → view_today → view_day_detail
- Create Daily Engagement funnel: app_open → view_today → view_day_detail
