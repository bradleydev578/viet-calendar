# Mobile Phase 4 Plan: Holidays & Settings Screens

## Overview

Phase 4 implements two remaining placeholder screens: **Holiday List Screen** (Ngày lễ) and **Settings Screen** (Cài đặt), completing the core functionality of the mobile app.

**Status**: ⏳ Planned (Ready to implement)
**Dependencies**: Phase 1 (Complete), Phase 2 (Complete), Phase 3 (Postponed)
**Estimated Time**: 4-6 hours

---

## Previous Phases Summary

### Phase 1 (✅ Complete)
- Navigation with 4 tabs (Calendar, Day Detail, Holidays, Settings)
- Lunar calculation engine
- Basic Calendar Screen
- Theme system

### Phase 2 (✅ Complete)
- Data layer with 365 days of 2025 feng shui data
- Day Score calculator (0-100% algorithm)
- Complete Day Detail Screen with 8 cards
- Navigation integration

### Phase 3 (⏸️ Postponed)
- Visual quality indicators on calendar (postponed due to design)

---

## Phase 4 Goals

Build two functional screens to complete the app's core features:

1. **Holiday List Screen** - Display Vietnamese holidays and solar terms (Tiết khí)
2. **Settings Screen** - User preferences and app information

---

## Part A: Holiday List Screen

### Problem Statement
Users need to view traditional Vietnamese holidays, lunar events, and solar terms (Tiết khí) in a dedicated screen.

### Data Sources

#### Available in Feng Shui Data
From `fengshui_2025.json`:
- **Tiết khí (Solar Terms)**: 24 solar terms throughout the year
  - Field: `tk` (e.g., "Xuân phân", "Hạ chí", "Thu phân", "Đông chí")
  - Example: `{"d": "2025-03-20", "tk": "Xuân phân", ...}`

#### Vietnamese Holidays (Hardcoded List)
Major holidays to display:
- **Tết Nguyên Đán** (Lunar New Year) - 1/1 âm lịch
- **Tết Nguyên Tiêu** (Lantern Festival) - 15/1 âm lịch
- **Tết Hàn Thực** (Cold Food Festival) - 3/3 âm lịch
- **Tết Đoan Ngọ** (Dragon Boat Festival) - 5/5 âm lịch
- **Vu Lan** (Ullambana) - 15/7 âm lịch
- **Tết Trung Thu** (Mid-Autumn Festival) - 15/8 âm lịch
- **Tết Trùng Cửu** (Double Ninth) - 9/9 âm lịch
- **Tết Hạ Nguyên** - 15/10 âm lịch

Solar calendar holidays:
- **Tết Dương lịch** - 01/01
- **Giỗ Tổ Hùng Vương** - 10/03
- **Giải phóng miền Nam** - 30/04
- **Quốc tế Lao động** - 01/05
- **Quốc khánh** - 02/09

### Implementation Plan

#### Step 1: Create Holiday Data Model

**File**: `mobile/src/data/types/HolidayData.ts`

```typescript
export type HolidayType = 'lunar' | 'solar' | 'solar_term';

export interface Holiday {
  id: string;
  name: string;                    // "Tết Nguyên Đán"
  type: HolidayType;
  date: string;                    // "2025-01-29" (solar date)
  lunarDate?: {                    // For lunar holidays
    day: number;
    month: number;
    isLeap?: boolean;
  };
  description?: string;            // Short description
  isImportant: boolean;            // Highlight important holidays
}
```

#### Step 2: Create Holiday Service

**File**: `mobile/src/data/services/HolidayService.ts`

**Methods**:
```typescript
class HolidayService {
  // Get all holidays for a year
  static getHolidays(year: number): Holiday[]

  // Get solar terms from feng shui data
  static getSolarTerms(year: number): Holiday[]

  // Convert lunar holidays to solar dates for the year
  static convertLunarHolidays(year: number): Holiday[]

  // Get holidays for a specific month
  static getHolidaysByMonth(year: number, month: number): Holiday[]

  // Sort holidays by date
  static sortByDate(holidays: Holiday[]): Holiday[]
}
```

**Integration**:
- Use `useFengShuiStore` to get solar terms from data
- Use `LunarCalculator` to convert lunar dates to solar dates
- Combine and sort all holidays by date

#### Step 3: Create Holiday List UI

**File**: `mobile/src/screens/HolidayListScreen/index.tsx`

**Layout**:
```
┌─────────────────────────────────┐
│ Header: Ngày lễ 2025            │
├─────────────────────────────────┤
│ 📆 Tháng 1 - 2025               │
│                                  │
│ 01/01 - Tết Dương lịch          │
│ 29/01 - Tết Nguyên Đán ⭐       │
│                                  │
│ 📆 Tháng 2 - 2025               │
│                                  │
│ 04/02 - Lập xuân (Tiết khí)     │
│ 12/02 - Tết Nguyên Tiêu         │
│                                  │
│ 📆 Tháng 3 - 2025               │
│ ...                              │
└─────────────────────────────────┘
```

**Features**:
1. **Grouped by Month**: SectionList with month headers
2. **Holiday Types**:
   - 🎊 Vietnamese holidays (lunar)
   - 🗓️ National holidays (solar)
   - 🌸 Solar terms (tiết khí)
3. **Important Markers**: ⭐ for major holidays
4. **Tap Action**: Navigate to DayDetail for that date
5. **Search Bar** (Optional): Search holidays by name

**Components**:
- `HolidayListScreen/index.tsx` - Main screen
- `HolidayListScreen/HolidayItem.tsx` - Individual holiday row
- `HolidayListScreen/MonthHeader.tsx` - Section header
- `HolidayListScreen/styles.ts` - Styles

#### Step 4: Navigation Integration

Update navigation to pass date when tapping holiday:
```typescript
const handleHolidayPress = (holiday: Holiday) => {
  navigation.navigate('DayDetail', {
    date: holiday.date,
  });
};
```

---

## Part B: Settings Screen

### Features to Implement

#### 1. App Information
- App name and version
- Developer credits
- Link to GitHub repository (if applicable)

#### 2. Display Preferences
- **Ngôn ngữ** (Language): Tiếng Việt (default, only option for now)
- **Hiển thị âm lịch**: Toggle show/hide lunar dates on calendar
- **Hiển thị ngày lễ**: Toggle show/hide holiday dots on calendar

#### 3. About & Help
- **Hướng dẫn sử dụng**: Guide to using the app
- **Giải thích ký hiệu**: Legend for feng shui terms
  - 28 Sao (28 Constellations)
  - 12 Trực (12 Day Officers)
  - Hoàng đạo hours
  - Day quality ratings
- **Phản hồi**: Email or link for feedback

#### 4. Legal
- **Điều khoản sử dụng**: Terms of service
- **Chính sách bảo mật**: Privacy policy
- **Nguồn dữ liệu**: Data source attribution

### Implementation Plan

#### Step 1: Settings Data Model

**File**: `mobile/src/data/types/SettingsData.ts`

```typescript
export interface AppSettings {
  language: 'vi';                    // Currently only Vietnamese
  showLunarDates: boolean;           // Show lunar dates on calendar
  showHolidays: boolean;             // Show holiday dots on calendar
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;          // Future feature
    time: string;                    // "08:00"
  };
}
```

#### Step 2: Settings Store

**File**: `mobile/src/stores/useSettingsStore.ts`

```typescript
interface SettingsStore {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}
```

**Persistence**: Use `@react-native-async-storage/async-storage` to save settings

#### Step 3: Settings UI

**File**: `mobile/src/screens/SettingsScreen/index.tsx`

**Layout**:
```
┌─────────────────────────────────┐
│ Header: Cài đặt                 │
├─────────────────────────────────┤
│ Hiển thị                        │
│ ├─ Hiển thị âm lịch      [✓]   │
│ └─ Hiển thị ngày lễ      [✓]   │
├─────────────────────────────────┤
│ Thông tin ứng dụng              │
│ ├─ Phiên bản: 1.0.0            │
│ └─ Hướng dẫn sử dụng      >    │
├─────────────────────────────────┤
│ Giải thích ký hiệu              │
│ ├─ 28 Sao là gì?         >    │
│ ├─ 12 Trực là gì?        >    │
│ ├─ Hoàng đạo giờ         >    │
│ └─ Đánh giá chất lượng    >    │
├─────────────────────────────────┤
│ Khác                            │
│ ├─ Nguồn dữ liệu         >    │
│ └─ Góp ý                  >    │
└─────────────────────────────────┘
```

**Components**:
- `SettingsScreen/index.tsx` - Main screen with sections
- `SettingsScreen/SettingToggle.tsx` - Toggle switch row
- `SettingsScreen/SettingLink.tsx` - Navigable row
- `SettingsScreen/InfoModal.tsx` - Modal for explanations
- `SettingsScreen/styles.ts` - Styles

#### Step 4: Info Screens

**File**: `mobile/src/screens/SettingsScreen/InfoScreens/`
- `GuideScreen.tsx` - User guide
- `LegendScreen.tsx` - Feng shui terms legend
- `DataSourceScreen.tsx` - Data attribution
- `FeedbackScreen.tsx` - Feedback form

---

## Dependencies

### New Dependencies Needed

```bash
npm install @react-native-async-storage/async-storage
```

For persistent settings storage.

### Existing Dependencies (Already Installed)
- ✅ `react-navigation` - Navigation
- ✅ `date-fns` - Date formatting
- ✅ `react-native-vector-icons` - Icons

---

## Files to Create/Modify

### Part A: Holiday List Screen (8 files)

**New Files**:
1. `mobile/src/data/types/HolidayData.ts` - Holiday type definitions
2. `mobile/src/data/services/HolidayService.ts` - Holiday data service
3. `mobile/src/screens/HolidayListScreen/index.tsx` - Main screen (replace placeholder)
4. `mobile/src/screens/HolidayListScreen/HolidayItem.tsx` - Holiday row component
5. `mobile/src/screens/HolidayListScreen/MonthHeader.tsx` - Month section header
6. `mobile/src/screens/HolidayListScreen/styles.ts` - Styles
7. `mobile/src/data/constants/holidays.ts` - Hardcoded holiday list
8. `mobile/src/hooks/useHolidays.ts` - Custom hook for holiday data

### Part B: Settings Screen (10 files)

**New Files**:
1. `mobile/src/data/types/SettingsData.ts` - Settings type definitions
2. `mobile/src/stores/useSettingsStore.ts` - Settings Zustand store
3. `mobile/src/screens/SettingsScreen/index.tsx` - Main screen (replace placeholder)
4. `mobile/src/screens/SettingsScreen/SettingToggle.tsx` - Toggle component
5. `mobile/src/screens/SettingsScreen/SettingLink.tsx` - Link row component
6. `mobile/src/screens/SettingsScreen/InfoModal.tsx` - Modal component
7. `mobile/src/screens/SettingsScreen/styles.ts` - Styles
8. `mobile/src/screens/SettingsScreen/InfoScreens/GuideScreen.tsx`
9. `mobile/src/screens/SettingsScreen/InfoScreens/LegendScreen.tsx`
10. `mobile/src/screens/SettingsScreen/InfoScreens/DataSourceScreen.tsx`

**Modified Files**:
- `mobile/src/app/App.tsx` - Load settings on app start
- `mobile/src/screens/CalendarScreen/DayCell.tsx` - Respect showLunarDates setting
- `mobile/package.json` - Add async-storage dependency

---

## Testing Strategy

### Holiday List Screen
1. **Data Accuracy**: Verify all holidays display correct dates
2. **Solar Terms**: Check all 24 solar terms present
3. **Lunar Conversion**: Verify lunar holidays converted correctly
4. **Navigation**: Tap holiday → navigate to DayDetail
5. **Performance**: Smooth scrolling through full year

### Settings Screen
1. **Toggle Functionality**: Settings toggle on/off correctly
2. **Persistence**: Settings saved and restored on app restart
3. **Calendar Integration**: Settings affect calendar display
4. **Info Modals**: All info screens render correctly
5. **Navigation**: All links navigate properly

---

## Success Criteria

✅ Phase 4 is complete when:

### Holiday List Screen:
- [ ] All Vietnamese holidays displayed with correct dates
- [ ] All 24 solar terms shown
- [ ] Holidays grouped by month
- [ ] Tap holiday navigates to DayDetail
- [ ] No crashes with missing data

### Settings Screen:
- [ ] Toggle settings work (show/hide lunar, holidays)
- [ ] Settings persist across app restarts
- [ ] App version displayed correctly
- [ ] All info screens accessible
- [ ] Settings affect calendar display

---

## Implementation Order

**Recommended sequence**:

1. **Week 1**: Holiday List Screen (3-4 hours)
   - Create holiday data model and service
   - Implement UI with SectionList
   - Integrate with navigation
   - Test with full year data

2. **Week 2**: Settings Screen (2-3 hours)
   - Create settings store with async-storage
   - Implement toggle and link components
   - Create info screens
   - Integrate settings with calendar

**Total**: 5-7 hours (1-2 coding sessions)

---

## Future Enhancements (Phase 5+)

### Phase 5 Possibilities:
1. **Search & Filter**
   - Search good days for specific activities
   - Filter by day quality
   - Date range picker

2. **Personalization**
   - Birth date input for personalized feng shui
   - Zodiac-based recommendations
   - Favorites/bookmarks

3. **Notifications**
   - Daily feng shui tips
   - Important holiday reminders
   - Good day alerts

4. **Sharing**
   - Share day information
   - Export calendar
   - Screenshot feature

5. **Multi-year Support**
   - Add 2026, 2027 data
   - Year selector
   - Data updates

---

## Technical Notes

### Holiday Date Conversion
```typescript
// Example: Convert Tết (1/1 lunar) to solar date
const lunar = { year: 2025, month: 1, day: 1, isLeap: false };
const solar = LunarCalculator.toSolar(lunar);
// Result: 2025-01-29
```

### Settings Storage
```typescript
// Save settings
await AsyncStorage.setItem('app_settings', JSON.stringify(settings));

// Load settings
const stored = await AsyncStorage.getItem('app_settings');
const settings = stored ? JSON.parse(stored) : defaultSettings;
```

### Integration Points
- **Calendar**: Read `showLunarDates` and `showHolidays` from settings store
- **DayCell**: Conditionally render lunar date based on setting
- **HolidayDot**: Conditionally render based on setting

---

## References

- **Phase 1 Plan**: `docs/mobile-phase1-plan.md`
- **Phase 2 Plan**: `docs/mobile-phase2-plan.md`
- **Data Flow Doc**: `docs/mobile-data-flow.md`
- **Lunar Calculator**: `mobile/src/core/lunar/LunarCalculator.ts`
- **Feng Shui Store**: `mobile/src/stores/useFengShuiStore.ts`

---

## Changelog

### 2025-12-15
- Created Phase 4 plan
- Defined Holiday List Screen features
- Defined Settings Screen features
- Estimated implementation time

---

**Last Updated**: 2025-12-15
**Author**: Claude Code
**Version**: 1.0
