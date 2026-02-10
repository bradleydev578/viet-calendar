# Tech-Spec: Calendar Widget for iOS & Android

**Created:** 2026-02-07
**Status:** Completed (Code Created - Xcode Setup Required)
**Author:** Bằng Ca
**Related Documents:**
- [Feature Specification](../features/calendar-widget-feature-spec.md)
- [Technical Research](../analysis/research/technical-calendar-widget-ios-android-research-2026-02-06.md)

---

## Overview

### Problem Statement

Users need quick access to the Vietnamese lunar calendar without opening the app. Currently, users must:
1. Unlock phone
2. Find and open Lịch Việt app
3. Navigate to desired date

This friction reduces the practical utility of the calendar for daily reference.

### Solution

Implement a home screen widget that displays the current month's calendar with both solar and lunar dates. The widget provides at-a-glance information and taps to open the full app.

**Key Features:**
- Monthly calendar grid (6 weeks × 7 days)
- Solar date (primary) + Lunar date (secondary) per cell
- Today highlighting with red indicator
- Weekend color coding (Saturday=blue, Sunday=red)
- Auto-refresh at midnight
- Tap to open app

### Scope

**In Scope:**
- iOS Widget Extension (WidgetKit + SwiftUI)
- React Native to iOS native bridge
- Widget data preparation from `lunar-javascript`
- Auto-sync mechanism (app open + midnight)
- Medium size widget (~372×175pt)

**Out of Scope (v1):**
- Android widget (Phase 2)
- Interactive date selection
- Multiple widget sizes
- Widget configuration/theming
- Feng shui indicators on widget

---

## Context for Development

### Codebase Patterns

#### Lunar Calculation Pattern
```typescript
// Existing pattern in mobile/src/core/lunar/LunarCalculator.ts
import { Solar, Lunar } from 'lunar-javascript';

// Convert solar to lunar
const solar = Solar.fromDate(date);
const lunar = solar.getLunar();
const lunarDay = lunar.getDay();
const lunarMonth = lunar.getMonth();
```

#### DayCell Display Pattern
```typescript
// Existing pattern in mobile/src/screens/CalendarScreen/DayCell.tsx
const lunarDate = LunarCalculator.toLunar(date);
const isFirstDayOfLunarMonth = lunarDate.day === 1;
const lunarDayText = isFirstDayOfLunarMonth
  ? `${lunarDate.day}/${lunarDate.month}`
  : String(lunarDate.day);
```

#### State Management Pattern
```typescript
// Project uses Zustand for global state
import { create } from 'zustand';
```

### Files to Reference

| File | Purpose |
|------|---------|
| `mobile/src/core/lunar/LunarCalculator.ts` | Lunar calculation methods |
| `mobile/src/core/lunar/types.ts` | `LunarDate` interface |
| `mobile/src/screens/CalendarScreen/DayCell.tsx` | Solar/lunar display logic |
| `mobile/ios/LichVietTemp/AppDelegate.mm` | iOS app entry point |
| `mobile/ios/LichVietTemp/Info.plist` | Bundle configuration |

### Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Widget Framework | WidgetKit + SwiftUI | Only option for iOS 14+ widgets |
| Data Sharing | App Groups + UserDefaults | Standard iOS pattern for app-extension communication |
| Bridge Approach | Custom Native Module | Full control, no external dependencies |
| Data Computation | Pre-compute in React Native | Reuse existing `lunar-javascript` integration |
| Week Start | Monday (T2) | Vietnamese calendar convention |

### Configuration Values

```
Bundle ID:        vn.bradley.vietcalendar
App Group ID:     vn.bradley.vietcalendar.shared
Widget Bundle ID: vn.bradley.vietcalendar.CalendarWidget
Widget Kind:      CalendarWidget
Shared Key:       calendarData
```

---

## Implementation Plan

### Phase 1: iOS Widget Extension

#### Task 1.1: Create Widget Extension Target
- [ ] In Xcode: File → New → Target → Widget Extension
- [ ] Product Name: `LichVietWidget`
- [ ] Uncheck "Include Configuration Intent"
- [ ] Uncheck "Include Live Activity"

**Files Created:**
```
mobile/ios/LichVietWidget/
├── LichVietWidget.swift          # @main Widget entry
├── LichVietWidgetBundle.swift    # Widget bundle (delete if created)
├── Assets.xcassets/
├── Info.plist
└── LichVietWidget.entitlements
```

#### Task 1.2: Configure App Groups
- [ ] Main app target → Signing & Capabilities → + App Groups
- [ ] Add: `group.vn.bradley.vietcalendar.shared`
- [ ] Widget target → Signing & Capabilities → + App Groups
- [ ] Add same group: `group.vn.bradley.vietcalendar.shared`

**Entitlements File:**
```xml
<!-- LichVietWidget.entitlements -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.vn.bradley.vietcalendar.shared</string>
    </array>
</dict>
</plist>
```

#### Task 1.3: Create Data Models
- [ ] Create `LichVietWidget/Models/CalendarDay.swift`
- [ ] Create `LichVietWidget/Models/CalendarWidgetData.swift`

```swift
// CalendarDay.swift
struct CalendarDay: Identifiable, Codable {
    var id: String { "\(solar)-\(lunarMonth)-\(isCurrentMonth)" }
    let solar: Int           // 1-31
    let lunar: Int           // 1-30
    let lunarMonth: Int      // 1-12
    let dayOfWeek: Int       // 0=Sun, 1=Mon, ..., 6=Sat
    let isCurrentMonth: Bool
    let isToday: Bool
}

// CalendarWidgetData.swift
struct CalendarWidgetData: Codable {
    let currentMonth: Int
    let currentYear: Int
    let lunarMonth: Int
    let lunarYear: Int
    let monthName: String        // "Tháng 2, 2026"
    let lunarMonthName: String   // "Tháng Giêng Ất Tỵ"
    let days: [CalendarDay]      // 42 days (6 weeks)
}
```

#### Task 1.4: Create Shared Data Manager
- [ ] Create `LichVietWidget/Utilities/SharedDataManager.swift`

```swift
// SharedDataManager.swift
import Foundation

class SharedDataManager {
    static let shared = SharedDataManager()

    private let appGroupId = "group.vn.bradley.vietcalendar.shared"
    private let calendarDataKey = "calendarData"

    private var sharedDefaults: UserDefaults? {
        UserDefaults(suiteName: appGroupId)
    }

    func getCalendarData() -> CalendarWidgetData? {
        guard let jsonString = sharedDefaults?.string(forKey: calendarDataKey),
              let data = jsonString.data(using: .utf8) else {
            return nil
        }
        return try? JSONDecoder().decode(CalendarWidgetData.self, from: data)
    }

    static var sampleData: CalendarWidgetData {
        // Return sample data for widget preview
    }
}
```

#### Task 1.5: Create Timeline Provider
- [ ] Create `LichVietWidget/CalendarProvider.swift`

```swift
// CalendarProvider.swift
import WidgetKit

struct CalendarEntry: TimelineEntry {
    let date: Date
    let calendarData: CalendarWidgetData
}

struct CalendarProvider: TimelineProvider {
    func placeholder(in context: Context) -> CalendarEntry {
        CalendarEntry(date: Date(), calendarData: SharedDataManager.sampleData)
    }

    func getSnapshot(in context: Context, completion: @escaping (CalendarEntry) -> ()) {
        let data = SharedDataManager.shared.getCalendarData() ?? SharedDataManager.sampleData
        completion(CalendarEntry(date: Date(), calendarData: data))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CalendarEntry>) -> ()) {
        let currentDate = Date()
        let data = SharedDataManager.shared.getCalendarData() ?? SharedDataManager.sampleData
        let entry = CalendarEntry(date: currentDate, calendarData: data)

        // Refresh at midnight
        let calendar = Calendar.current
        let tomorrow = calendar.date(byAdding: .day, value: 1, to: currentDate)!
        let midnight = calendar.startOfDay(for: tomorrow)

        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }
}
```

#### Task 1.6: Create Widget Views
- [ ] Create `LichVietWidget/Views/CalendarWidgetView.swift`
- [ ] Create `LichVietWidget/Views/WeekdayHeaderView.swift`
- [ ] Create `LichVietWidget/Views/CalendarGridView.swift`
- [ ] Create `LichVietWidget/Views/DayCellView.swift`

**CalendarWidgetView.swift:**
```swift
import SwiftUI
import WidgetKit

struct CalendarWidgetView: View {
    let entry: CalendarEntry

    var body: some View {
        VStack(spacing: 4) {
            // Header
            HStack {
                Text(entry.calendarData.monthName)
                    .font(.system(size: 14, weight: .semibold))
                Spacer()
                Text(entry.calendarData.lunarMonthName)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 8)

            // Weekday headers: T2, T3, T4, T5, T6, T7, CN
            WeekdayHeaderView()

            // Calendar grid
            CalendarGridView(days: entry.calendarData.days)
        }
        .padding(8)
    }
}
```

**DayCellView.swift:**
```swift
struct DayCellView: View {
    let day: CalendarDay

    var body: some View {
        VStack(spacing: 0) {
            Text("\(day.solar)")
                .font(.system(size: 11, weight: day.isToday ? .bold : .regular))
                .foregroundColor(solarColor)

            Text("\(day.lunar)")
                .font(.system(size: 7))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, minHeight: 20)
        .background(day.isToday ? Color.red.opacity(0.2) : Color.clear)
        .cornerRadius(4)
        .opacity(day.isCurrentMonth ? 1.0 : 0.3)
    }

    private var solarColor: Color {
        if day.isToday { return .red }
        // dayOfWeek: 0=Sun, 6=Sat
        if day.dayOfWeek == 0 { return .red }   // Sunday
        if day.dayOfWeek == 6 { return .blue }  // Saturday
        return .primary
    }
}
```

#### Task 1.7: Create Main Widget
- [ ] Update `LichVietWidget/LichVietWidget.swift`

```swift
import WidgetKit
import SwiftUI

@main
struct LichVietWidget: Widget {
    let kind: String = "CalendarWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CalendarProvider()) { entry in
            CalendarWidgetView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Lịch Việt")
        .description("Xem lịch âm dương trong tháng")
        .supportedFamilies([.systemMedium])
    }
}

#Preview(as: .systemMedium) {
    LichVietWidget()
} timeline: {
    CalendarEntry(date: .now, calendarData: SharedDataManager.sampleData)
}
```

---

### Phase 2: React Native Bridge (iOS)

#### Task 2.1: Create Swift Bridge Module
- [ ] Create `ios/LichVietTemp/Bridge/LichVietWidgetBridge.swift`

```swift
import Foundation
import WidgetKit

@objc(LichVietWidgetBridge)
class LichVietWidgetBridge: NSObject {

    private let appGroupId = "group.vn.bradley.vietcalendar.shared"
    private let calendarDataKey = "calendarData"

    @objc
    func setCalendarData(_ jsonString: String) {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
            print("LichVietWidgetBridge: Failed to access App Groups")
            return
        }

        sharedDefaults.set(jsonString, forKey: calendarDataKey)
        sharedDefaults.synchronize()

        // Reload widget timeline
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "CalendarWidget")
        }
    }

    @objc
    func clearCalendarData() {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else { return }
        sharedDefaults.removeObject(forKey: calendarDataKey)
        sharedDefaults.synchronize()
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
```

#### Task 2.2: Create Objective-C Bridge
- [ ] Create `ios/LichVietTemp/Bridge/LichVietWidgetBridge.m`

```objc
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LichVietWidgetBridge, NSObject)
RCT_EXTERN_METHOD(setCalendarData:(NSString *)jsonString)
RCT_EXTERN_METHOD(clearCalendarData)
@end
```

#### Task 2.3: Create Bridging Header
- [ ] Create `ios/LichVietTemp/LichVietTemp-Bridging-Header.h`

```objc
//
//  LichVietTemp-Bridging-Header.h
//

#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
```

- [ ] Update Build Settings: `Objective-C Bridging Header` → `$(SRCROOT)/LichVietTemp/LichVietTemp-Bridging-Header.h`

---

### Phase 3: TypeScript Integration

#### Task 3.1: Create Widget Bridge Interface
- [ ] Create `src/core/widget/WidgetBridge.ts`

```typescript
import { NativeModules, Platform } from 'react-native';

const { LichVietWidgetBridge } = NativeModules;

export interface CalendarDayData {
    solar: number;
    lunar: number;
    lunarMonth: number;
    dayOfWeek: number;      // 0=Sun, 1=Mon, ..., 6=Sat
    isCurrentMonth: boolean;
    isToday: boolean;
}

export interface CalendarWidgetData {
    currentMonth: number;
    currentYear: number;
    lunarMonth: number;
    lunarYear: number;
    monthName: string;
    lunarMonthName: string;
    days: CalendarDayData[];
}

export const WidgetBridge = {
    setCalendarData: (data: CalendarWidgetData): void => {
        if (Platform.OS === 'ios' && LichVietWidgetBridge) {
            const jsonString = JSON.stringify(data);
            LichVietWidgetBridge.setCalendarData(jsonString);
        }
    },

    clearCalendarData: (): void => {
        if (Platform.OS === 'ios' && LichVietWidgetBridge) {
            LichVietWidgetBridge.clearCalendarData();
        }
    },

    isAvailable: (): boolean => {
        return Platform.OS === 'ios' && !!LichVietWidgetBridge;
    }
};
```

#### Task 3.2: Create Widget Data Preparer
- [ ] Create `src/core/widget/WidgetDataPreparer.ts`

```typescript
import { Solar } from 'lunar-javascript';
import { CalendarWidgetData, CalendarDayData } from './WidgetBridge';

const LUNAR_MONTH_NAMES = [
    '', 'Tháng Giêng', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư',
    'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám',
    'Tháng Chín', 'Tháng Mười', 'Tháng Một', 'Tháng Chạp'
];

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

function getCanChiYear(year: number): string {
    const canIndex = (year - 4) % 10;
    const chiIndex = (year - 4) % 12;
    return `${CAN[canIndex >= 0 ? canIndex : canIndex + 10]} ${CHI[chiIndex >= 0 ? chiIndex : chiIndex + 12]}`;
}

export function prepareWidgetData(date: Date = new Date()): CalendarWidgetData {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    const year = solar.getYear();
    const month = solar.getMonth();

    // Get first day of month and its weekday
    const firstDay = Solar.fromYmd(year, month, 1);
    const firstDayOfWeek = firstDay.getWeek(); // 0=Sunday

    // Calculate offset for Monday start (T2)
    // If first day is Sunday (0), we need 6 days from previous month
    // If first day is Monday (1), we need 0 days
    // Formula: (firstDayOfWeek + 6) % 7
    const daysFromPrevMonth = (firstDayOfWeek + 6) % 7;

    // Get days in current month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Today for comparison
    const today = Solar.fromDate(new Date());
    const todayYmd = today.toYmd();

    const days: CalendarDayData[] = [];

    // Previous month days
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const s = Solar.fromYmd(prevYear, prevMonth, day);
        const l = s.getLunar();
        days.push({
            solar: day,
            lunar: l.getDay(),
            lunarMonth: Math.abs(l.getMonth()),
            dayOfWeek: s.getWeek(),
            isCurrentMonth: false,
            isToday: s.toYmd() === todayYmd
        });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const s = Solar.fromYmd(year, month, day);
        const l = s.getLunar();
        days.push({
            solar: day,
            lunar: l.getDay(),
            lunarMonth: Math.abs(l.getMonth()),
            dayOfWeek: s.getWeek(),
            isCurrentMonth: true,
            isToday: s.toYmd() === todayYmd
        });
    }

    // Next month days to complete 42 cells
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const remaining = 42 - days.length;

    for (let day = 1; day <= remaining; day++) {
        const s = Solar.fromYmd(nextYear, nextMonth, day);
        const l = s.getLunar();
        days.push({
            solar: day,
            lunar: l.getDay(),
            lunarMonth: Math.abs(l.getMonth()),
            dayOfWeek: s.getWeek(),
            isCurrentMonth: false,
            isToday: s.toYmd() === todayYmd
        });
    }

    const canChiYear = getCanChiYear(lunar.getYear());

    return {
        currentMonth: month,
        currentYear: year,
        lunarMonth: Math.abs(lunar.getMonth()),
        lunarYear: lunar.getYear(),
        monthName: `Tháng ${month}, ${year}`,
        lunarMonthName: `${LUNAR_MONTH_NAMES[Math.abs(lunar.getMonth())]} ${canChiYear}`,
        days
    };
}
```

#### Task 3.3: Create Auto-sync Hook
- [ ] Create `src/core/widget/useWidgetSync.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { WidgetBridge } from './WidgetBridge';
import { prepareWidgetData } from './WidgetDataPreparer';

export function useWidgetSync() {
    const syncWidget = useCallback(() => {
        if (!WidgetBridge.isAvailable()) return;

        const data = prepareWidgetData(new Date());
        WidgetBridge.setCalendarData(data);
        console.log('[Widget] Synced calendar data');
    }, []);

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
        const scheduleMidnightSync = (): NodeJS.Timeout => {
            const now = new Date();
            const midnight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0, 0, 1 // 00:00:01
            );
            const msUntilMidnight = midnight.getTime() - now.getTime();

            return setTimeout(() => {
                syncWidget();
                scheduleMidnightSync(); // Schedule next
            }, msUntilMidnight);
        };

        const midnightTimer = scheduleMidnightSync();

        return () => {
            subscription.remove();
            clearTimeout(midnightTimer);
        };
    }, [syncWidget]);

    return { syncWidget };
}
```

#### Task 3.4: Create Index Export
- [ ] Create `src/core/widget/index.ts`

```typescript
export { WidgetBridge, type CalendarWidgetData, type CalendarDayData } from './WidgetBridge';
export { prepareWidgetData } from './WidgetDataPreparer';
export { useWidgetSync } from './useWidgetSync';
```

#### Task 3.5: Integrate Hook in App
- [ ] Update `App.tsx` or root component

```typescript
import { useWidgetSync } from './core/widget';

function App() {
    // Initialize widget sync
    useWidgetSync();

    // ... rest of app
}
```

---

### Acceptance Criteria

#### Widget Display
- [ ] Widget displays 6-week calendar grid (42 cells)
- [ ] Each cell shows solar date (top) + lunar date (bottom)
- [ ] Header shows: "Tháng X, YYYY" (left) | "Tháng Âm Can Chi" (right)
- [ ] Weekday headers: T2, T3, T4, T5, T6, T7, CN

#### Today Highlighting
- [ ] Current date has red background (20% opacity)
- [ ] Current date solar text is bold red
- [ ] Only one day highlighted as today

#### Weekend Colors
- [ ] Sunday (dayOfWeek=0) solar text is red
- [ ] Saturday (dayOfWeek=6) solar text is blue
- [ ] Monday-Friday solar text is primary color

#### Month Boundaries
- [ ] Previous/next month days have 30% opacity
- [ ] Current month days have 100% opacity

#### Data Sync
- [ ] Widget updates when app opens
- [ ] Widget refreshes at midnight
- [ ] Shows correct lunar dates for all visible days

#### Widget Installation
- [ ] Widget appears in iOS widget picker
- [ ] Widget preview shows sample calendar
- [ ] Display name: "Lịch Việt"
- [ ] Description: "Xem lịch âm dương trong tháng"

---

## Additional Context

### Dependencies

**iOS (Widget Extension):**
- WidgetKit (built-in iOS 14+)
- SwiftUI (built-in)
- No external dependencies

**React Native:**
- `lunar-javascript` (existing) - for lunar calculations
- No new dependencies required

### Testing Strategy

| Test Type | Scope | Method |
|-----------|-------|--------|
| Unit Tests | `WidgetDataPreparer.ts` | Jest - verify lunar calculations |
| Manual iOS | Widget display | Xcode Simulator + device |
| Manual Sync | Data bridge | Console logs + widget refresh |
| Edge Cases | Month boundaries, leap months | Test specific dates |

**Test Dates:**
- `2026-02-28` - End of February (short month)
- `2026-01-01` - New Year
- Lunar New Year date - Holiday display
- `2025-07-xx` - Month with leap month

### Notes

1. **Widget Extension Signing:** Widget must use same team/signing as main app
2. **App Groups Provisioning:** Ensure provisioning profiles include App Groups capability
3. **Swift Version:** Use Swift 5.5+ for async/await if needed
4. **Bridging Header:** Required for Swift modules in Objective-C++ React Native project
5. **Widget Refresh Limits:** iOS limits widget refreshes to ~40-70/day

### File Structure Summary

```
mobile/
├── ios/
│   ├── LichVietTemp/
│   │   ├── Bridge/
│   │   │   ├── LichVietWidgetBridge.swift      # NEW
│   │   │   └── LichVietWidgetBridge.m          # NEW
│   │   ├── LichVietTemp-Bridging-Header.h      # NEW
│   │   └── LichVietTemp.entitlements           # MODIFY (add App Groups)
│   │
│   ├── LichVietWidget/                          # NEW TARGET
│   │   ├── LichVietWidget.swift
│   │   ├── CalendarProvider.swift
│   │   ├── Models/
│   │   │   ├── CalendarDay.swift
│   │   │   └── CalendarWidgetData.swift
│   │   ├── Views/
│   │   │   ├── CalendarWidgetView.swift
│   │   │   ├── WeekdayHeaderView.swift
│   │   │   ├── CalendarGridView.swift
│   │   │   └── DayCellView.swift
│   │   ├── Utilities/
│   │   │   └── SharedDataManager.swift
│   │   ├── Assets.xcassets/
│   │   ├── Info.plist
│   │   └── LichVietWidget.entitlements
│   │
│   └── LichVietTemp.xcodeproj                   # MODIFY (add widget target)
│
└── src/
    └── core/
        └── widget/                               # NEW
            ├── index.ts
            ├── WidgetBridge.ts
            ├── WidgetDataPreparer.ts
            └── useWidgetSync.ts
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-07 | Initial tech-spec for iOS widget |
