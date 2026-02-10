# Feature Specification: Lịch Việt Calendar Widget

**Document Version:** 1.0
**Created:** 2026-02-07
**Author:** Bằng Ca
**Status:** Draft
**Related Research:** [Technical Research Report](../analysis/research/technical-calendar-widget-ios-android-research-2026-02-06.md)

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [User Stories](#user-stories)
3. [UI/UX Specifications](#uiux-specifications)
4. [User Flows](#user-flows)
5. [Acceptance Criteria](#acceptance-criteria)
6. [Technical Requirements](#technical-requirements)
7. [Implementation Phases](#implementation-phases)
8. [Out of Scope](#out-of-scope)

---

## Feature Overview

### Summary

**Feature Name:** Monthly Calendar Widget
**Platform:** iOS & Android (iOS-first approach)
**Widget Size:** Medium (iOS) / 4x3 cells (Android)

### Value Proposition

Users can view the current month's calendar with both solar and lunar dates directly from their home screen without opening the app, enabling quick reference for traditional Vietnamese calendar dates.

### Target Users

- Vietnamese users who regularly reference the lunar calendar
- Users planning traditional events, ceremonies, or activities
- Anyone needing quick access to lunar-solar date conversion

### Success Metrics

| Metric | Target |
|--------|--------|
| Widget installation rate | > 30% of active users |
| Daily widget views | > 5x per user per day |
| App opens from widget | > 20% of widget taps |

---

## User Stories

### Primary User Stories (P0 - Must Have)

| ID | User Story | Acceptance |
|----|------------|------------|
| **US-01** | As a user, I want to see the current month's calendar on my home screen so I can quickly check dates without opening the app | Widget displays full month grid |
| **US-02** | As a user, I want to see both solar and lunar dates for each day so I can plan activities according to the Vietnamese lunar calendar | Each day cell shows solar (top) and lunar (bottom) dates |
| **US-03** | As a user, I want today's date to be highlighted so I can easily identify the current day | Today has distinct visual indicator |

### Secondary User Stories (P1 - Should Have)

| ID | User Story | Acceptance |
|----|------------|------------|
| **US-04** | As a user, I want to see the month name in both solar and lunar formats so I understand which lunar month I'm viewing | Header shows both month names |
| **US-05** | As a user, I want weekends (Saturday/Sunday) visually distinguished so I can quickly identify weekend days | Weekend dates have different colors |
| **US-06** | As a user, I want to tap the widget to open the app so I can see more details | Widget tap opens app to current month |

### Nice to Have (P2 - Could Have)

| ID | User Story | Acceptance |
|----|------------|------------|
| **US-07** | As a user, I want the widget to update automatically at midnight so the calendar is always current | Widget refreshes daily |
| **US-08** | As a user, I want days from previous/next month to be visually muted so I can focus on the current month | Non-current month days are faded |

---

## UI/UX Specifications

### Widget Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Tháng 2, 2026                              Tháng Giêng Ất Tỵ│  ← Header
├──────────────────────────────────────────────────────────────┤
│  T2     T3     T4     T5     T6     T7     CN                │  ← Weekday Row
├──────────────────────────────────────────────────────────────┤
│  26     27     28     29     30     31      1                │  ← Week 1
│  28     29     30      1      2      3      4                │    (gray = lunar)
├──────────────────────────────────────────────────────────────┤
│   2      3      4      5      6    ┌──┐     8                │  ← Week 2
│   5      6      7      8      9    │7 │    11                │    Today = 7
│                                    │10│                       │
│                                    └──┘                       │
├──────────────────────────────────────────────────────────────┤
│   9     10     11     12     13     14     15                │  ← Week 3
│  12     13     14     15     16     17     18                │
├──────────────────────────────────────────────────────────────┤
│  16     17     18     19     20     21     22                │  ← Week 4
│  19     20     21     22     23     24     25                │
├──────────────────────────────────────────────────────────────┤
│  23     24     25     26     27     28      1                │  ← Week 5
│  26     27     28     29     30      1      2                │    (faded = next month)
├──────────────────────────────────────────────────────────────┤
│   2      3      4      5      6      7      8                │  ← Week 6
│   3      4      5      6      7      8      9                │
└──────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Header Section

| Element | Position | Content |
|---------|----------|---------|
| Solar Month | Left | "Tháng {month}, {year}" (e.g., "Tháng 2, 2026") |
| Lunar Month | Right | "{lunar_month} {can_chi_year}" (e.g., "Tháng Giêng Ất Tỵ") |

#### 2. Weekday Row

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|----------|---|---|---|---|---|---|---|
| Label | T2 | T3 | T4 | T5 | T6 | T7 | CN |
| Meaning | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday |

**Note:** Week starts on Monday (T2), ends on Sunday (CN) - Vietnamese standard.

#### 3. Day Cell

```
┌─────────┐
│   15    │  ← Solar date (primary, larger)
│   18    │  ← Lunar date (secondary, smaller)
└─────────┘
```

### Visual Design Specifications

#### Typography

| Element | Font Size | Font Weight | Color |
|---------|-----------|-------------|-------|
| Header - Solar Month | 14sp/pt | Semibold | Primary text |
| Header - Lunar Month | 12sp/pt | Regular | Secondary text |
| Weekday Labels | 9sp/pt | Medium | Secondary text |
| Solar Date (normal) | 11sp/pt | Regular | Primary text |
| Solar Date (today) | 11sp/pt | Bold | Red (#E53935) |
| Lunar Date | 7sp/pt | Regular | Gray (#757575) |

#### Color Scheme

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | System default | System default |
| Primary text | #212121 | #FFFFFF |
| Secondary text | #757575 | #B0B0B0 |
| Sunday text | #E53935 (Red) | #EF5350 |
| Saturday text | #1E88E5 (Blue) | #42A5F5 |
| Today background | #E53935 @ 20% | #EF5350 @ 25% |
| Non-current month | 30% opacity | 30% opacity |

#### Spacing

| Element | Value |
|---------|-------|
| Widget padding | 8dp/pt |
| Header bottom margin | 4dp/pt |
| Weekday row bottom margin | 2dp/pt |
| Cell horizontal spacing | 0dp/pt (flexible) |
| Cell vertical spacing | 2dp/pt |
| Cell internal padding | 1dp/pt |

### Widget Dimensions

| Platform | Size Name | Dimensions | Grid |
|----------|-----------|------------|------|
| **iOS** | systemMedium | ~372 x 175 pt | Full width |
| **iOS** | systemLarge | ~372 x 389 pt | Full width (optional) |
| **Android** | 4x3 cells | ~250 x 180 dp | 4 columns, 3 rows |
| **Android** | 4x4 cells | ~250 x 250 dp | 4 columns, 4 rows (optional) |

### Responsive Behavior

| Screen Size | Adaptation |
|-------------|------------|
| Small (iPhone SE) | Reduce font sizes by 1pt |
| Medium (iPhone 14) | Default specifications |
| Large (iPhone 14 Pro Max) | Default specifications |
| Tablet (iPad) | May use systemLarge size |

---

## User Flows

### Flow 1: Widget Installation

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │  Long-press   │    │ Widget picker │    │ Search/scroll │        │
│  │  home screen  │───▶│    opens      │───▶│ "Lịch Việt"   │        │
│  └───────────────┘    └───────────────┘    └───────────────┘        │
│                                                    │                  │
│                                                    ▼                  │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │ Widget placed │    │ Select size   │    │ Preview with  │        │
│  │ on home screen│◀───│   (Medium)    │◀───│ sample data   │        │
│  └───────────────┘    └───────────────┘    └───────────────┘        │
│         │                                                             │
│         ▼                                                             │
│  ┌───────────────┐                                                   │
│  │ Display current│                                                  │
│  │ month calendar │                                                  │
│  └───────────────┘                                                   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 2: Automatic Data Synchronization

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │  User opens   │    │ App prepares  │    │ Data saved to │        │
│  │  Lịch Việt app│───▶│ calendar data │───▶│ shared storage│        │
│  └───────────────┘    └───────────────┘    └───────────────┘        │
│                                                    │                  │
│                                                    ▼                  │
│                                            ┌───────────────┐         │
│                                            │ Widget refresh │         │
│                                            │   triggered    │         │
│                                            └───────────────┘         │
│                                                    │                  │
│                                                    ▼                  │
│                                            ┌───────────────┐         │
│                                            │ Widget displays│         │
│                                            │  updated data  │         │
│                                            └───────────────┘         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 3: Midnight Auto-Refresh

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │  Clock hits   │    │ System triggers│    │ Widget reads  │        │
│  │   midnight    │───▶│ widget refresh │───▶│ stored data   │        │
│  └───────────────┘    └───────────────┘    └───────────────┘        │
│                                                    │                  │
│                                                    ▼                  │
│                                            ┌───────────────┐         │
│                                            │ Today indicator│         │
│                                            │ moves to new   │         │
│                                            │ date           │         │
│                                            └───────────────┘         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 4: Widget Tap Interaction

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │ User taps on  │    │  Deep link    │    │  App opens to │        │
│  │ widget area   │───▶│   triggered   │───▶│  month view   │        │
│  └───────────────┘    └───────────────┘    └───────────────┘        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow 5: No Data Available

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │ Widget added  │    │ Check shared  │    │ No data found │        │
│  │ to home screen│───▶│   storage     │───▶│               │        │
│  └───────────────┘    └───────────────┘    └───────────────┘        │
│                                                    │                  │
│                                                    ▼                  │
│                                            ┌───────────────┐         │
│                                            │ Display message│         │
│                                            │"Mở app để cập  │         │
│                                            │    nhật"       │         │
│                                            └───────────────┘         │
│                                                    │                  │
│                                                    ▼                  │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │ Widget shows  │    │ App syncs     │    │ User taps     │        │
│  │ calendar data │◀───│   data        │◀───│ widget/opens  │        │
│  └───────────────┘    └───────────────┘    │     app       │        │
│                                            └───────────────┘         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Acceptance Criteria

### AC-01: Widget Display

- [ ] Widget displays a 6-week calendar grid (42 cells total)
- [ ] Each cell shows solar date (top, larger) and lunar date (bottom, smaller)
- [ ] Header shows solar month name on the left
- [ ] Header shows lunar month name with Can Chi year on the right
- [ ] Weekday headers display in order: T2, T3, T4, T5, T6, T7, CN

### AC-02: Today Highlighting

- [ ] Current date cell has red/pink background highlight (20% opacity)
- [ ] Current date solar number displays in bold red
- [ ] Today indicator automatically updates at midnight
- [ ] Only one day is highlighted as "today" at any time

### AC-03: Weekend Color Coding

- [ ] Sunday (CN) dates display in red color
- [ ] Saturday (T7) dates display in blue color
- [ ] Monday-Friday dates display in primary/default color
- [ ] Color coding applies to solar date only (lunar stays gray)

### AC-04: Month Boundary Handling

- [ ] Previous month's trailing days display with 30% opacity
- [ ] Next month's leading days display with 30% opacity
- [ ] Current month's days display at full opacity
- [ ] Lunar dates for all visible days are correct

### AC-05: Data Synchronization

- [ ] Widget updates automatically when app opens
- [ ] Widget refreshes at midnight (±5 minutes tolerance)
- [ ] Widget shows fallback message if no data: "Mở app để cập nhật"
- [ ] Data persists across app restarts

### AC-06: Widget Installation & Discovery

- [ ] Widget appears in iOS/Android widget picker under app name
- [ ] Widget preview shows realistic sample calendar data
- [ ] Widget display name: "Lịch Việt"
- [ ] Widget description: "Xem lịch âm dương trong tháng"
- [ ] Medium size is available and recommended

### AC-07: Widget Interaction

- [ ] Tapping anywhere on widget opens the main app
- [ ] App opens to the current month view
- [ ] Deep link works even if app was killed

### AC-08: Visual Quality

- [ ] Text is readable at all supported font sizes
- [ ] Widget adapts to system light/dark mode
- [ ] No text truncation or overlap
- [ ] Proper alignment and spacing maintained

---

## Technical Requirements

### Platform Requirements

| Requirement | iOS | Android |
|-------------|-----|---------|
| Minimum OS | iOS 14.0+ | Android 8.0 (API 26)+ |
| UI Framework | SwiftUI | Jetpack Glance 1.1+ |
| Language | Swift 5.5+ | Kotlin 1.9+ |

### Data Storage

| Platform | Technology | Key |
|----------|------------|-----|
| iOS | App Groups + UserDefaults | `group.com.lichviet.shared` / `calendarData` |
| Android | SharedPreferences | `lichviet` / `calendarData` |

### Data Format

```json
{
    "currentMonth": 2,
    "currentYear": 2026,
    "lunarMonth": 1,
    "lunarYear": 2026,
    "monthName": "Tháng 2, 2026",
    "lunarMonthName": "Tháng Giêng Ất Tỵ",
    "days": [
        {
            "solar": 1,
            "lunar": 4,
            "lunarMonth": 1,
            "dayOfWeek": 6,
            "isCurrentMonth": true,
            "isToday": false
        }
    ]
}
```

### Data Fields

| Field | Type | Description |
|-------|------|-------------|
| `solar` | number | Solar calendar day (1-31) |
| `lunar` | number | Lunar calendar day (1-30) |
| `lunarMonth` | number | Lunar month (1-12) |
| `dayOfWeek` | number | 0=Sunday, 1=Monday, ..., 6=Saturday |
| `isCurrentMonth` | boolean | Belongs to displayed month |
| `isToday` | boolean | Is current date |

### Refresh Strategy

| Trigger | iOS | Android |
|---------|-----|---------|
| App foreground | `WidgetCenter.reloadTimelines()` | `GlanceAppWidgetManager.update()` |
| Midnight | Timeline policy `.after(midnight)` | `updatePeriodMillis: 86400000` |
| Manual | Via native bridge | Via native bridge |

### Performance Requirements

| Metric | Target |
|--------|--------|
| Widget load time | < 100ms |
| Data sync time | < 50ms |
| Memory usage | < 30MB |
| Battery impact | Negligible |

---

## Implementation Phases

### Phase 1: iOS Widget (Priority)

**Scope:**
- Widget Extension target setup
- App Groups configuration
- Data models (CalendarDay, CalendarWidgetData)
- SharedDataManager
- TimelineProvider (CalendarProvider)
- Widget views (CalendarWidgetView, DayCellView)
- Main Widget struct

**Deliverables:**
- [ ] Functional iOS widget displaying calendar
- [ ] Today highlighting
- [ ] Weekend color coding
- [ ] Month boundary handling

### Phase 2: iOS Native Bridge

**Scope:**
- LichVietWidgetBridge.swift
- Objective-C bridging header
- WidgetBridge.ts (TypeScript)
- WidgetDataPreparer.ts
- useWidgetSync hook

**Deliverables:**
- [ ] React Native to Swift data bridge
- [ ] Auto-sync on app open
- [ ] Midnight refresh scheduling

### Phase 3: Android Widget

**Scope:**
- Glance dependencies
- Data models (Kotlin)
- CalendarWidgetContent composable
- CalendarWidget (GlanceAppWidget)
- CalendarWidgetReceiver
- Widget info XML
- AndroidManifest configuration

**Deliverables:**
- [ ] Functional Android widget displaying calendar
- [ ] Visual parity with iOS widget

### Phase 4: Android Native Bridge

**Scope:**
- LichVietWidgetModule.kt
- LichVietWidgetPackage.kt
- Package registration in MainApplication
- Cross-platform testing

**Deliverables:**
- [ ] React Native to Kotlin data bridge
- [ ] Unified TypeScript interface for both platforms

---

## Out of Scope (v1.0)

The following features are explicitly excluded from version 1.0:

| Feature | Reason | Future Version |
|---------|--------|----------------|
| Interactive date selection | Complexity, platform limitations | v2.0 |
| Multiple widget sizes | Focus on medium size first | v1.5 |
| Widget configuration (theme) | Simplify initial release | v2.0 |
| First day of week setting | Use Vietnamese default (Monday) | v2.0 |
| Feng shui indicators | Widget space constraints | v2.0 |
| Holiday markers | Requires additional data | v1.5 |
| Lock screen widget (iOS 16+) | Lower priority | v2.0 |
| Watch complications | Different platform | v3.0 |

---

## Appendix

### A. Lunar Month Names (Vietnamese)

| Month | Vietnamese Name |
|-------|-----------------|
| 1 | Tháng Giêng |
| 2 | Tháng Hai |
| 3 | Tháng Ba |
| 4 | Tháng Tư |
| 5 | Tháng Năm |
| 6 | Tháng Sáu |
| 7 | Tháng Bảy |
| 8 | Tháng Tám |
| 9 | Tháng Chín |
| 10 | Tháng Mười |
| 11 | Tháng Một |
| 12 | Tháng Chạp |

### B. Can Chi Years Reference

| Year | Can Chi |
|------|---------|
| 2024 | Giáp Thìn |
| 2025 | Ất Tỵ |
| 2026 | Bính Ngọ |
| 2027 | Đinh Mùi |
| 2028 | Mậu Thân |

### C. Related Documents

- [Technical Research Report](../analysis/research/technical-calendar-widget-ios-android-research-2026-02-06.md)
- [Main Technical Documentation](../lich-viet-technical-doc-v2.md)
- [Project Plan](../project-plan.md)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-07 | Bằng Ca | Initial feature specification |
