# Plan: Mobile App Phase 1 - Core + Lunar Engine

## Overview

Triển khai Phase 1 của mobile app React Native: Navigation, Lunar Engine, và Calendar Screen cơ bản.

**Phase 3 (Scraper)**: ✅ COMPLETED - Data 2025 đã scrape xong (365 ngày, 305KB)

---

## Current Mobile Project Status

### ✅ Đã hoàn thành
| Component | Files | Status |
|-----------|-------|--------|
| Theme System | `colors.ts`, `typography.ts`, `spacing.ts` | 100% |
| Lunar Constants | `constants.ts` (Can, Chi, Giáp, Tiết Khí) | 100% |
| Project Config | `package.json`, `tsconfig.json`, `babel.config.js` | 100% |
| Directory Structure | All folders created | 100% |
| Dependencies | All installed (RN 0.73, Zustand, TanStack Query, etc.) | 100% |

### ⏳ Cần triển khai (Phase 1)
| Component | Priority | Complexity |
|-----------|----------|------------|
| Navigation Setup | High | Low |
| Lunar Calculator | High | Medium |
| Can Chi Calculator | High | Medium |
| Calendar Screen | High | Medium |
| Day Cell Component | High | Low |

---

## Phase 1 Implementation Plan

### Task 1: Navigation Setup
**Files to create:**

```
mobile/src/app/navigation/
├── RootNavigator.tsx      # Main navigator với Tab + Stack
├── TabNavigator.tsx       # Bottom tab với 4 tabs
├── types.ts               # Navigation type definitions
└── index.ts               # Exports
```

**Implementation:**
- Bottom Tab Navigator với 4 tabs: Calendar, DayDetail, Holidays, Settings
- Stack Navigator cho mỗi tab để hỗ trợ nested navigation
- Type-safe navigation với TypeScript

### Task 2: Lunar Calculator Engine
**Files to create:**

```
mobile/src/core/lunar/
├── LunarCalculator.ts     # Wrapper cho lunar-javascript
├── CanChi.ts              # Tính Can Chi ngày/tháng/năm/giờ
├── TietKhi.ts             # Xác định tiết khí từ ngày dương
├── HoangDao.ts            # Tính giờ hoàng đạo
└── index.ts               # Update exports
```

**LunarCalculator API:**
```typescript
class LunarCalculator {
  static toLunar(solarDate: Date): LunarDate
  static toSolar(lunarDate: LunarDate): Date
  static getYearInfo(year: number): YearInfo
}
```

**CanChi API:**
```typescript
class CanChiCalculator {
  static getDayCanChi(date: Date): CanChiResult
  static getMonthCanChi(date: Date): CanChiResult
  static getYearCanChi(year: number): CanChiResult
  static getHourCanChi(date: Date, hour: number): CanChiResult
}
```

### Task 3: Calendar Screen (Basic)
**Files to create:**

```
mobile/src/screens/CalendarScreen/
├── index.tsx              # Main screen
├── CalendarGrid.tsx       # Grid hiển thị tháng
├── DayCell.tsx            # Cell cho mỗi ngày
├── MonthHeader.tsx        # Header với tháng/năm + navigation
├── WeekDayHeader.tsx      # Hàng thứ trong tuần
└── styles.ts              # Shared styles
```

**CalendarScreen Features:**
- Hiển thị lưới tháng với ngày dương + âm
- Swipe để chuyển tháng
- Tap ngày để xem chi tiết
- Highlight ngày hiện tại
- Mark ngày lễ/sự kiện

### Task 4: Common Components
**Files to create:**

```
mobile/src/components/
├── common/
│   ├── LunarDateBadge.tsx   # Badge hiển thị ngày âm
│   └── index.ts
└── calendar/
    └── index.ts
```

### Task 5: Custom Hooks
**Files to create:**

```
mobile/src/hooks/
├── useLunarDate.ts        # Hook lấy lunar date từ solar date
├── useCalendarMonth.ts    # Hook quản lý tháng trong calendar
└── index.ts
```

### Task 6: Update App.tsx
**File to modify:** `mobile/src/app/App.tsx`

- Uncomment và enable RootNavigator
- Setup NavigationContainer với theme

---

## Files Summary

| Action | Path | Description |
|--------|------|-------------|
| Create | `src/app/navigation/RootNavigator.tsx` | Main navigator |
| Create | `src/app/navigation/TabNavigator.tsx` | Bottom tabs |
| Create | `src/app/navigation/types.ts` | Type definitions |
| Create | `src/core/lunar/LunarCalculator.ts` | Lunar wrapper |
| Create | `src/core/lunar/CanChi.ts` | Can Chi calculator |
| Create | `src/core/lunar/TietKhi.ts` | Tiết khí logic |
| Create | `src/core/lunar/HoangDao.ts` | Giờ hoàng đạo |
| Create | `src/screens/CalendarScreen/index.tsx` | Main screen |
| Create | `src/screens/CalendarScreen/CalendarGrid.tsx` | Month grid |
| Create | `src/screens/CalendarScreen/DayCell.tsx` | Day cell |
| Create | `src/screens/CalendarScreen/MonthHeader.tsx` | Header |
| Create | `src/screens/CalendarScreen/WeekDayHeader.tsx` | Weekday row |
| Create | `src/components/common/LunarDateBadge.tsx` | Lunar badge |
| Create | `src/hooks/useLunarDate.ts` | Lunar hook |
| Create | `src/hooks/useCalendarMonth.ts` | Calendar hook |
| Modify | `src/app/App.tsx` | Enable navigation |
| Modify | `src/core/lunar/index.ts` | Update exports |

---

## Dependencies Already Installed

Đã có sẵn trong `package.json`:
- `lunar-javascript`: 1.6.12 - Core lunar calculations
- `@react-navigation/*`: 6.x - Navigation
- `react-native-calendars`: UI calendar (optional, có thể custom)
- `date-fns`: 3.3.1 - Date utilities
- `zustand`: 4.5.0 - State management
- `react-native-reanimated`: 3.6.2 - Animations

---

## Testing Strategy

1. **Unit Tests** cho Lunar Engine:
   - Test LunarCalculator với known dates
   - Test CanChi calculations
   - Cross-validate với scraped data

2. **Component Tests**:
   - DayCell renders correctly
   - Calendar navigation works

---

## Next Phases Preview

**Phase 2**: Feng Shui Features (28 Sao, 12 Trực, Day Score, DayDetail Screen)
**Phase 4**: Supporting Features (Holidays, Settings, Events)
**Phase 5**: Polish (Performance, Offline, Animations)

---

*Document Version: 1.0*
*Created: December 15, 2024*
*Related: project-plan.md, lich-viet-technical-doc-v2.md*
