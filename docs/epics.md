---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - 'docs/prd.md'
  - 'docs/architecture.md'
  - 'docs/ux-design-specification.md'
workflowType: 'epics-stories'
lastStep: 4
project_name: 'lich-viet-van-su-an-lanh'
user_name: 'Bằng Ca'
date: '2024-12-17'
status: 'complete'
workflowComplete: true
totalEpics: 7
totalStories: 59
frCoverage: '57/57 (100%)'
nfrCoverage: '27/27 (100%)'
---

# lich-viet-van-su-an-lanh - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for lich-viet-van-su-an-lanh, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Calendar View & Navigation (FR1-FR10):**

- FR1: User can view a monthly calendar grid displaying all days of the current month
- FR2: User can see both solar (Gregorian) date and lunar date displayed simultaneously in each day cell
- FR3: User can distinguish weekends visually through color-coded text (Saturday green, Sunday red)
- FR4: User can identify today's date through a highlighted visual indicator (green pill background)
- FR5: User can see previous/next month dates displayed in muted style at the start/end of the calendar grid
- FR6: User can navigate to previous month using left arrow button or right swipe gesture
- FR7: User can navigate to next month using right arrow button or left swipe gesture
- FR8: User can see the current month and year displayed in a header widget
- FR9: User can see week day headers (T2, T3, T4, T5, T6, T7, CN) above the calendar grid
- FR10: User can see special day badges (e.g., "RẰM" for full moon) on relevant dates

**Today Preview Widget (FR11-FR19):**

- FR11: User can view today's information in a persistent bottom widget regardless of which month is being browsed
- FR12: User can see today's weekday name displayed prominently
- FR13: User can see today's full date with year and Can Chi (干支)
- FR14: User can see today's lunar date in a visually distinct badge
- FR15: User can see today's Giờ Hoàng Đạo (auspicious hours) with icon
- FR16: User can see today's Tiết Khí (solar term) with icon
- FR17: User can see today's Ngũ Hành (five elements) with icon
- FR18: User can see a daily inspirational quote
- FR19: User can see upcoming Vietnamese holidays with countdown ("X ngày nữa")

**Day Detail View (FR20-FR35):**

- FR20: User can tap any day cell to navigate to that day's detail screen
- FR21: User can return to calendar view via back navigation
- FR22: User can see if the viewed day is today through a visual indicator
- FR23: User can see the hero date display with month name and large day number
- FR24: User can see the lunar date with Can Chi in a distinct card
- FR25: User can see the weekday name and day type badge (e.g., "Ngày Hoàng Đạo")
- FR26: User can see the day's Giờ Hoàng Đạo, Tiết Khí, and Ngũ Hành in quick-info format
- FR27: User can see the day's luck score (Chỉ Số May Mắn) as a percentage with visual progress bar
- FR28: User can see a contextual message describing the day's energy
- FR29: User can see recommended activities ("Nên Làm") for the day in a card
- FR30: User can see activities to avoid ("Không Nên") for the day in a card
- FR31: User can see auspicious hours (Giờ Tốt) in a horizontal scrollable list with time ranges
- FR32: User can identify the current auspicious hour through visual highlighting
- FR33: User can see auspicious directions (Hướng Xuất Hành) for Hỷ Thần and Tài Thần
- FR34: User can see upcoming holidays/events with countdown from the day detail view
- FR35: User can see a daily quote at the bottom of the detail view

**App Navigation (FR36-FR39):**

- FR36: User can access Calendar screen via bottom navigation
- FR37: User can access Holiday List screen via bottom navigation
- FR38: User can access Settings screen via bottom navigation
- FR39: User can see which screen is currently active in bottom navigation

**Data & Content (FR40-FR49):**

- FR40: System provides accurate lunar date calculations for any date
- FR41: System provides Can Chi (干支) for each day
- FR42: System provides day quality score calculation for each day
- FR43: System provides list of recommended/avoid activities for each day
- FR44: System provides auspicious hours calculation for each day
- FR45: System provides auspicious directions for each day
- FR46: System provides Vietnamese holiday data with dates and names
- FR47: System provides daily inspirational quotes
- FR48: System provides Tiết Khí (24 solar terms) for each day
- FR49: System provides Ngũ Hành (five elements) for each day

**Compass / La Bàn (FR50-FR57):**

- FR50: User can access Compass screen via bottom tab navigation (replaces "Hôm Nay" tab)
- FR51: User can switch between Standard Compass and Feng Shui Compass layouts via segmented control
- FR52: User can see real-time compass orientation based on device magnetometer (Standard mode)
- FR53: User can see cardinal directions (N/S/E/W) with Vietnamese labels (Bắc/Nam/Đông/Tây)
- FR54: User can see current heading in degrees and direction name (e.g., "45° - Đông Bắc")
- FR55: User can see Feng Shui compass with 8 directions colored by Ngũ Hành (Five Elements)
- FR56: User can see today's auspicious/inauspicious directions highlighted on Feng Shui compass
- FR57: User can see today's feng shui direction info panel with Đại Cát, Cát, Hung directions

### NonFunctional Requirements

**Performance (NFR1-NFR9):**

- NFR1: Month transition animations maintain 60 FPS on devices from 2018 onwards
- NFR2: Gesture swipe response time < 16ms from touch to visual feedback
- NFR3: Calendar grid renders within 100ms of screen display
- NFR4: Day Detail screen loads within 150ms from tap
- NFR5: Cold start to usable calendar screen < 2 seconds
- NFR6: Warm start (from background) < 500ms
- NFR7: App memory usage < 150MB during normal operation
- NFR8: No memory leaks during 30 minutes of continuous month navigation
- NFR9: Zero UI-related crashes in production

**Reliability (NFR10-NFR15):**

- NFR10: 100% of core functionality works without network connectivity
- NFR11: App launches and operates normally in airplane mode
- NFR12: All bundled data (2024-2026) accessible without download
- NFR13: Lunar date calculations accurate to 100% (validated against lunar-javascript)
- NFR14: Can Chi (干支) calculations accurate for any date in supported range
- NFR15: Holiday dates correct per official Vietnamese calendar

**Usability (NFR16-NFR21):**

- NFR16: Dual dates (solar/lunar) readable at arm's length on 4.7" screens
- NFR17: Weekend color coding distinguishable by color-blind users (sufficient contrast)
- NFR18: Today indicator visible without scanning entire calendar
- NFR19: Identical visual design on iOS and Android (< 5% visual deviation)
- NFR20: Same gesture behavior on both platforms
- NFR21: Consistent typography rendering across devices

**Compatibility (NFR22-NFR27):**

- NFR22: iOS 13.0+ support (covers 95%+ of active iOS devices)
- NFR23: Android API 24+ support (Android 7.0+, covers 95%+ of active Android devices)
- NFR24: iPhone SE (4.7") to iPad Pro (12.9") screen sizes supported
- NFR25: Android phones and tablets with various aspect ratios supported
- NFR26: Full Vietnamese language support throughout UI
- NFR27: Vietnamese diacritics render correctly on all supported devices

### Additional Requirements

**From Architecture Document:**

- **Starter Template**: React Native CLI 0.77 with TypeScript (`npx @react-native-community/cli@latest init LichViet --template react-native-template-typescript`)
- **UI Library**: react-native-paper 5.14.5 (Material Design 3)
- **Animation Library**: react-native-reanimated 3.18.1 (worklet-based 60 FPS animations)
- **Gesture Library**: react-native-gesture-handler 2.29.1 (native gesture system)
- **State Management**: Zustand (existing in project)
- **Navigation**: React Navigation 6 (existing in project)
- **Data Storage**: MMKV for key-value storage
- **Feng Shui Data**: Bundled JSON (~20-50KB/year gzipped) for 2024-2026
- **Lunar Calculations**: lunar-javascript for real-time calculations
- **Atomic Design Pattern**: atoms → molecules → organisms → screens
- **TypeScript Strict Mode**: No `any` types, interfaces over types
- **Co-located Tests**: Tests alongside source files (*.test.tsx)
- **Barrel Exports**: index.ts for all directories
- **Memoization Required**: DayCell must use React.memo (60+ instances)
- **Worklet Animations**: All animations must use Reanimated worklets

**From UX Design Document:**

- **Color System**: Primary green (#2E7D32), caution red (#D32F2F), today blue (#1976D2)
- **Weekend Colors**: Saturday green text, Sunday red text
- **Day Score Colors**: 80-100% strong green, 60-79% light green, 40-59% amber, 20-39% orange, 0-19% red
- **Typography**: System fonts (SF Pro iOS, Roboto Android) for Vietnamese diacritics
- **Spacing**: 8px base unit, consistent throughout
- **Touch Targets**: Minimum 44x44pt (iOS) / 48x48dp (Android)
- **Calendar Cells**: Minimum 42x42pt
- **Accessibility**: WCAG AA compliance, VoiceOver/TalkBack support
- **Reduced Motion**: Respect system preference for animations
- **Elevation**: Card (2dp shadow), Widget (4dp shadow), Modal (8dp shadow)
- **Border Radius**: sm (4px), md (8px), lg (16px), full (9999px for circles)
- **Today Widget**: Persistent bottom component, ~120px height
- **Month Navigation**: 250ms slide animation with ease-out
- **Day Detail**: 300ms slide up animation, 90% screen height
- **Pull-to-Dismiss**: Day detail modal dismissible by pull down gesture

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 3 | Monthly calendar grid display |
| FR2 | Epic 3 | Dual solar/lunar date display |
| FR3 | Epic 3 | Weekend color coding |
| FR4 | Epic 3 | Today highlight indicator |
| FR5 | Epic 3 | Previous/next month dates muted |
| FR6 | Epic 3 | Previous month navigation |
| FR7 | Epic 3 | Next month navigation |
| FR8 | Epic 3 | Month/year header display |
| FR9 | Epic 3 | Weekday headers |
| FR10 | Epic 3 | Special day badges (RẰM) |
| FR11 | Epic 4 | Persistent today widget |
| FR12 | Epic 4 | Today weekday display |
| FR13 | Epic 4 | Today full date with Can Chi |
| FR14 | Epic 4 | Today lunar date badge |
| FR15 | Epic 4 | Today Hoàng Đạo hours |
| FR16 | Epic 4 | Today Tiết Khí |
| FR17 | Epic 4 | Today Ngũ Hành |
| FR18 | Epic 4 | Daily inspirational quote |
| FR19 | Epic 4 | Upcoming holidays countdown |
| FR20 | Epic 5 | Day cell tap navigation |
| FR21 | Epic 5 | Back navigation to calendar |
| FR22 | Epic 5 | Today indicator on detail |
| FR23 | Epic 5 | Hero date display |
| FR24 | Epic 5 | Lunar date with Can Chi card |
| FR25 | Epic 5 | Weekday and day type badge |
| FR26 | Epic 5 | Quick-info format display |
| FR27 | Epic 5 | Day luck score with progress bar |
| FR28 | Epic 5 | Day energy message |
| FR29 | Epic 5 | Recommended activities card |
| FR30 | Epic 5 | Activities to avoid card |
| FR31 | Epic 5 | Auspicious hours list |
| FR32 | Epic 5 | Current hour highlighting |
| FR33 | Epic 5 | Auspicious directions display |
| FR34 | Epic 5 | Holidays countdown on detail |
| FR35 | Epic 5 | Daily quote on detail |
| FR36 | Epic 1 | Calendar screen navigation |
| FR37 | Epic 1 | Holiday List screen navigation |
| FR38 | Epic 1 | Settings screen navigation |
| FR39 | Epic 1 | Active screen indicator |
| FR40 | Epic 2 | Lunar date calculations |
| FR41 | Epic 2 | Can Chi calculations |
| FR42 | Epic 2 | Day quality score calculation |
| FR43 | Epic 2 | Recommended/avoid activities |
| FR44 | Epic 2 | Auspicious hours calculation |
| FR45 | Epic 2 | Auspicious directions |
| FR46 | Epic 2 | Vietnamese holiday data |
| FR47 | Epic 2 | Daily inspirational quotes |
| FR48 | Epic 2 | Tiết Khí (solar terms) |
| FR49 | Epic 2 | Ngũ Hành (five elements) |
| FR50 | Epic 7 | Compass screen tab navigation |
| FR51 | Epic 7 | Compass mode toggle switch |
| FR52 | Epic 7 | Real-time compass orientation |
| FR53 | Epic 7 | Cardinal directions with Vietnamese labels |
| FR54 | Epic 7 | Digital heading readout |
| FR55 | Epic 7 | Feng Shui compass with Ngũ Hành colors |
| FR56 | Epic 7 | Today's auspicious direction highlights |
| FR57 | Epic 7 | Feng Shui direction info panel |

## Epic List

### Epic 1: Project Foundation & Core Setup
Establish a working React Native app with theme system and navigation structure that enables all future development. Users get a functional app shell with proper navigation, theming, and the ability to run on iOS/Android devices.

**FRs covered:** FR36, FR37, FR38, FR39
**NFRs addressed:** NFR5, NFR6, NFR19-NFR27

---

### Epic 2: Lunar Calendar Core Engine
Implement the core lunar calculation engine and feng shui data layer that powers all calendar features. Users can access accurate lunar date conversions, Can Chi, Tiết Khí, Ngũ Hành, and day scores for any date - all working offline.

**FRs covered:** FR40, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49
**NFRs addressed:** NFR10-NFR15

---

### Epic 3: Calendar Screen & Month Navigation
Deliver the primary calendar interface with dual solar/lunar date display and smooth month navigation. Users can view a beautiful monthly calendar showing both solar and lunar dates, swipe between months, and quickly identify today and weekends.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10
**NFRs addressed:** NFR1, NFR2, NFR3, NFR16-NFR18

---

### Epic 4: Today Preview Widget
Create the persistent bottom widget that shows today's feng shui information regardless of which month is being viewed. Users can instantly see today's Hoàng Đạo hours, Tiết Khí, Ngũ Hành, day score, and upcoming holidays without any taps.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19
**NFRs addressed:** NFR3, NFR16

---

### Epic 5: Day Detail Screen
Build the comprehensive day detail screen showing all feng shui information for any selected date. Users can tap any date to see full feng shui details including day score, auspicious hours with time ranges, recommended/avoid activities, and auspicious directions.

**FRs covered:** FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35
**NFRs addressed:** NFR4, NFR8

---

### Epic 6: Accessibility & Polish
Ensure WCAG AA compliance, screen reader support, and production-ready polish across all screens. All users, including those using VoiceOver/TalkBack or with reduced motion preferences, can fully use the app.

**FRs covered:** (Cross-cutting - enhances all FRs)
**NFRs addressed:** NFR7, NFR8, NFR9, NFR16-NFR21

---

### Epic 7: Compass Screen (La Bàn)
Replace the "Hôm Nay" tab with a comprehensive Compass screen featuring both standard compass and feng shui compass modes. Users can use real-time compass orientation and view daily auspicious directions with Ngũ Hành color coding.

**FRs covered:** FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR57
**NFRs addressed:** NFR1, NFR2, NFR10, NFR19, NFR20

---

## Epic 1: Project Foundation & Core Setup

**Goal:** Establish a working React Native 0.77 app with theme system, navigation structure, and core dependencies that enables all future development.

**User Outcome:** A functional app shell with proper bottom tab navigation, Material Design 3 theming, and runs on both iOS and Android devices.

### Story 1.1: Initialize React Native Project with TypeScript

As a developer,
I want to initialize a new React Native 0.77 project with TypeScript template,
So that I have a properly configured foundation for building the calendar app.

**Acceptance Criteria:**

**Given** the mobile/ directory is empty or doesn't exist
**When** running the React Native CLI init command with TypeScript template
**Then** a new React Native 0.77 project is created with TypeScript configuration
**And** the project compiles without errors using `npx tsc --noEmit`
**And** the app runs successfully on iOS simulator
**And** the app runs successfully on Android emulator
**And** the project structure follows the architecture specification (src/ with subdirectories)

---

### Story 1.2: Install Core Dependencies

As a developer,
I want to install and configure the core dependencies (react-native-paper, react-native-reanimated, react-native-gesture-handler),
So that I have the foundational libraries needed for UI, animations, and gestures.

**Acceptance Criteria:**

**Given** the React Native project is initialized
**When** installing react-native-paper 5.14.5, react-native-reanimated 3.18.1, and react-native-gesture-handler 2.29.1
**Then** all packages are installed without dependency conflicts
**And** babel.config.js is configured with reanimated plugin
**And** iOS pods are installed successfully
**And** Android gradle sync completes successfully
**And** the app launches without native module errors on both platforms

---

### Story 1.3: Configure Design System Theme

As a user,
I want the app to have a consistent visual design with proper colors and typography,
So that the interface feels polished and trustworthy.

**Acceptance Criteria:**

**Given** react-native-paper is installed
**When** configuring the theme system
**Then** theme/colors.ts defines primary (#2E7D32), caution (#D32F2F), today (#1976D2), and all semantic colors
**And** theme/typography.ts defines the type scale (h1-h3, body, caption, solarDate, lunarDate)
**And** theme/spacing.ts defines the 8px-based spacing system (xs, sm, md, lg, xl)
**And** theme/paperTheme.ts creates a customized MD3 light theme
**And** App.tsx wraps the app with PaperProvider using the custom theme
**And** Vietnamese diacritics render correctly in all text components

---

### Story 1.4: Implement Bottom Tab Navigation

As a user,
I want to navigate between Calendar, Holiday List, and Settings screens using a bottom tab bar,
So that I can easily access different sections of the app.

**Acceptance Criteria:**

**Given** React Navigation 6 is installed
**When** implementing the bottom tab navigation
**Then** three tabs are displayed: Calendar (calendar icon), Ngày lễ (star icon), Cài đặt (cog icon)
**And** tapping each tab navigates to the corresponding screen placeholder
**And** the active tab is highlighted with the primary green color (#2E7D32)
**And** the tab bar respects safe areas on notched devices (FR36, FR37, FR38, FR39)
**And** cold start to visible tab bar completes in < 2 seconds (NFR5)

---

### Story 1.5: Create Placeholder Screens

As a user,
I want to see placeholder screens for Calendar, Holiday List, and Settings,
So that navigation works and the app structure is complete.

**Acceptance Criteria:**

**Given** bottom tab navigation is implemented
**When** navigating to each tab
**Then** CalendarScreen displays "Lịch" heading with placeholder content
**And** HolidayListScreen displays "Ngày lễ" heading with placeholder content
**And** SettingsScreen displays "Cài đặt" heading with placeholder content
**And** each screen uses the theme colors and typography
**And** screens render identically on iOS and Android (NFR19)

---

## Epic 2: Lunar Calendar Core Engine

**Goal:** Implement the core lunar calculation engine and feng shui data layer that powers all calendar features, working 100% offline.

**User Outcome:** Users can access accurate lunar date conversions, Can Chi, Tiết Khí, Ngũ Hành, day scores, activities, and directions for any date from 2024-2026.

### Story 2.1: Integrate lunar-javascript Library

As a developer,
I want to integrate the lunar-javascript library with TypeScript definitions,
So that I can perform accurate lunar calendar calculations.

**Acceptance Criteria:**

**Given** the core/lunar/ directory exists
**When** integrating lunar-javascript
**Then** lunar-javascript is installed and working
**And** types/lunar-javascript.d.ts provides TypeScript definitions
**And** core/lunar/LunarCalculator.ts wraps the library with typed methods
**And** getLunarDate(solarDate) returns accurate lunar date object
**And** calculations work 100% offline without network (NFR10, NFR11)
**And** unit tests in LunarCalculator.test.ts verify accuracy (FR40)

---

### Story 2.2: Implement Can Chi Calculations

As a user,
I want to see the Can Chi (干支) for any date,
So that I understand the traditional Chinese zodiac cycle for that day.

**Acceptance Criteria:**

**Given** lunar-javascript is integrated
**When** requesting Can Chi for a date
**Then** getCanChi(date) returns the correct Thiên Can (heavenly stem) and Địa Chi (earthly branch)
**And** results are in Vietnamese with proper diacritics (e.g., "Giáp Tý", "Ất Sửu")
**And** calculations are accurate for any date in the supported range (FR41, NFR14)
**And** unit tests verify Can Chi accuracy against known dates

---

### Story 2.3: Implement Tiết Khí and Ngũ Hành Calculations

As a user,
I want to see the Tiết Khí (solar term) and Ngũ Hành (five elements) for any date,
So that I understand the seasonal and elemental energy of that day.

**Acceptance Criteria:**

**Given** lunar-javascript is integrated
**When** requesting Tiết Khí and Ngũ Hành for a date
**Then** getTietKhi(date) returns the correct solar term in Vietnamese (e.g., "Đông Chí", "Sương Giáng")
**And** getNguHanh(date) returns the correct element in Vietnamese (e.g., "Kim", "Mộc", "Thủy")
**And** all 24 solar terms are supported (FR48)
**And** all 5 elements cycle correctly (FR49)
**And** unit tests verify accuracy

---

### Story 2.4: Bundle Feng Shui Data Files

As a user,
I want feng shui data (activities, directions, scores) to be available offline,
So that I can use the app without internet connection.

**Acceptance Criteria:**

**Given** the scraper has generated feng shui JSON data
**When** bundling data for the mobile app
**Then** data/bundled/ contains gzipped JSON files for 2024, 2025, 2026
**And** each file is < 50KB gzipped
**And** data includes daily activities (nên làm, không nên), directions, and base scores
**And** dataLoader.ts can decompress and parse the bundled data
**And** data is accessible immediately on app launch without download (NFR12)

---

### Story 2.5: Implement Day Score Calculation

As a user,
I want to see a luck score (0-100%) for any day,
So that I can quickly understand how auspicious that day is.

**Acceptance Criteria:**

**Given** feng shui data is bundled
**When** calculating the day score
**Then** core/fengshui/DayScore.ts computes a score from 0-100 based on feng shui factors
**And** the score considers: Can Chi compatibility, Tiết Khí, good vs bad activities ratio
**And** getDayScore(date) returns a number between 0 and 100
**And** scores are pre-computed at data load time, not on render (FR42)
**And** unit tests verify score calculation logic

---

### Story 2.6: Implement Activities Data Access

As a user,
I want to see recommended activities ("Nên Làm") and activities to avoid ("Không Nên") for any day,
So that I can plan my activities accordingly.

**Acceptance Criteria:**

**Given** feng shui data is bundled
**When** requesting activities for a date
**Then** getGoodActivities(date) returns array of recommended activities in Vietnamese
**And** getBadActivities(date) returns array of activities to avoid in Vietnamese
**And** activities include proper Vietnamese diacritics (e.g., "Cưới hỏi", "Xuất hành")
**And** activities data is loaded from bundled JSON (FR43)

---

### Story 2.7: Implement Auspicious Hours Calculation

As a user,
I want to see the auspicious hours (Giờ Hoàng Đạo) for any day,
So that I can plan important activities at favorable times.

**Acceptance Criteria:**

**Given** lunar-javascript is integrated
**When** requesting auspicious hours for a date
**Then** getHoangDaoHours(date) returns array of 6 auspicious hour periods
**And** each period includes: name (Tý, Sửu, etc.), start time, end time
**And** hours are in Vietnamese with proper names (FR44)
**And** time ranges use 24-hour format (e.g., "23:00-01:00")

---

### Story 2.8: Implement Auspicious Directions

As a user,
I want to see auspicious directions (Hỷ Thần, Tài Thần) for any day,
So that I know which directions are favorable for travel or activities.

**Acceptance Criteria:**

**Given** feng shui data is bundled
**When** requesting directions for a date
**Then** getDirections(date) returns object with Hỷ Thần and Tài Thần directions
**And** directions are in Vietnamese (e.g., "Đông Nam", "Tây Bắc")
**And** data is sourced from bundled feng shui files (FR45)

---

### Story 2.9: Implement Vietnamese Holiday Data

As a user,
I want to see Vietnamese holidays with names and dates,
So that I can be aware of upcoming celebrations.

**Acceptance Criteria:**

**Given** holiday data is defined
**When** requesting holidays
**Then** core/holidays/holidayData.ts contains Vietnamese holidays for 2024-2026
**And** holidays include three internal categories (stored but not displayed as separate UI sections):
  - PUBLIC_HOLIDAYS: Ngày lễ chính thức có nghỉ (Tết, Giỗ Tổ, 30/4-1/5, Quốc khánh)
  - SECTOR_ANNIVERSARIES: Ngày kỷ niệm ngành (Ngày Thầy thuốc, Ngày Nhà giáo, etc.)
  - CULTURAL_ETHNIC_FESTIVALS: Lễ hội văn hóa dân tộc (Chùa Hương, Hội Lim, Lễ Kate, etc.)
**And** holidays include both solar and lunar dates
**And** PUBLIC_HOLIDAYS include total_days field for duration
**And** CULTURAL_ETHNIC_FESTIVALS include location field
**And** getHolidays(year) returns array of holidays with name, date, type, and category
**And** getUpcomingHolidays(fromDate, count) returns next N holidays with countdown
**And** holiday dates are correct per official Vietnamese calendar (FR46, NFR15)

---

### Story 2.10: Implement Daily Quotes

As a user,
I want to see a daily inspirational quote,
So that I receive motivation and wisdom each day.

**Acceptance Criteria:**

**Given** quotes data is prepared
**When** requesting a quote for a date
**Then** getDailyQuote(date) returns a Vietnamese inspirational quote
**And** quotes rotate based on day of year (deterministic, not random)
**And** at least 365 unique quotes are available
**And** quotes are in Vietnamese with proper diacritics (FR47)

---

## Epic 3: Calendar Screen & Month Navigation

**Goal:** Deliver the primary calendar interface with dual solar/lunar date display, color-coded weekends, and smooth 60 FPS month navigation via swipe gestures.

**User Outcome:** Users see a beautiful monthly calendar showing both solar and lunar dates, can swipe between months fluidly, and quickly identify today and weekends through color coding.

### Story 3.1: Create Month Header with Navigation

As a user,
I want to see the current month and year with navigation arrows,
So that I know which month I'm viewing and can navigate using buttons.

**Acceptance Criteria:**

**Given** the CalendarScreen is displayed
**When** the month header renders
**Then** the header displays "Tháng X, YYYY" in Vietnamese (e.g., "Tháng 12, 2024")
**And** left arrow button is displayed for previous month navigation
**And** right arrow button is displayed for next month navigation
**And** tapping left arrow shows the previous month (FR6)
**And** tapping right arrow shows the next month (FR7)
**And** the header updates to reflect the new month (FR8)

---

### Story 3.2: Create Weekday Header Row

As a user,
I want to see Vietnamese weekday labels above the calendar grid,
So that I can identify which column represents which day.

**Acceptance Criteria:**

**Given** the CalendarScreen is displayed
**When** the weekday header renders
**Then** seven day labels are displayed: T2, T3, T4, T5, T6, T7, CN
**And** labels use neutral gray color for weekdays
**And** T7 (Saturday) uses green color (#2E7D32)
**And** CN (Sunday) uses red color (#D32F2F)
**And** labels are centered above their respective columns (FR9)

---

### Story 3.3: Implement DayCell Component with Dual Dates

As a user,
I want each calendar cell to show both solar and lunar dates,
So that I can see both calendar systems simultaneously.

**Acceptance Criteria:**

**Given** DayCell component is created
**When** rendering a day cell
**Then** solar date is displayed prominently (18px, semibold, centered)
**And** lunar date is displayed below solar date (10px, muted color)
**And** DayCell uses React.memo for performance optimization
**And** minimum touch target is 42x42pt
**And** dual dates are readable on 4.7" screens (FR1, FR2, NFR16)

---

### Story 3.4: Implement Weekend Color Coding

As a user,
I want Saturday and Sunday dates to be color-coded,
So that I can quickly identify weekends at a glance.

**Acceptance Criteria:**

**Given** DayCell component exists
**When** rendering weekend days
**Then** Saturday dates use green text color (#2E7D32)
**And** Sunday dates use red text color (#D32F2F)
**And** both solar and lunar dates follow the color coding
**And** colors have sufficient contrast for color-blind users (FR3, NFR17)

---

### Story 3.5: Implement Today Highlight

As a user,
I want today's date to be visually highlighted,
So that I can quickly find the current day.

**Acceptance Criteria:**

**Given** DayCell component exists
**When** rendering today's date
**Then** today has a circular blue (#1976D2) background indicator
**And** today's highlight is visible without scanning the entire grid
**And** today indicator respects weekend color coding (today on Sunday = red text with blue circle)
**And** highlight is visible on first render (FR4, NFR18)

---

### Story 3.6: Display Adjacent Month Dates

As a user,
I want to see dates from previous/next months in gray at grid edges,
So that I understand the calendar context.

**Acceptance Criteria:**

**Given** CalendarGrid renders a 6-row x 7-column grid
**When** the month starts mid-week or ends before grid fills
**Then** previous month dates fill the beginning of the first row
**And** next month dates fill the end of the last row
**And** adjacent month dates use muted gray color (#BDBDBD)
**And** adjacent month dates are tappable (navigate to that day) (FR5)

---

### Story 3.7: Implement CalendarGrid Component

As a user,
I want to see a complete monthly calendar grid,
So that I can view all days of the month in a familiar layout.

**Acceptance Criteria:**

**Given** DayCell component is complete
**When** rendering CalendarGrid
**Then** grid displays 6 rows x 7 columns of DayCell components
**And** grid correctly calculates first day position based on weekday
**And** grid renders within 100ms of screen display (NFR3)
**And** grid uses lunar-javascript to populate lunar dates
**And** each cell is tappable with visual feedback (FR1)

---

### Story 3.8: Implement Swipe Gesture Navigation

As a user,
I want to swipe left/right to change months,
So that I can navigate the calendar naturally.

**Acceptance Criteria:**

**Given** react-native-gesture-handler is configured
**When** swiping on the calendar grid
**Then** swipe left navigates to next month (FR7)
**And** swipe right navigates to previous month (FR6)
**And** gesture response time is < 16ms (NFR2)
**And** swipe threshold is 50px horizontal movement
**And** swipe does not conflict with vertical scrolling

---

### Story 3.9: Implement Month Transition Animation

As a user,
I want smooth animated transitions when changing months,
So that navigation feels fluid and polished.

**Acceptance Criteria:**

**Given** react-native-reanimated is configured
**When** transitioning between months
**Then** old month slides out and new month slides in horizontally
**And** animation duration is 250ms with ease-out easing
**And** animation runs at 60 FPS without dropped frames (NFR1)
**And** animation uses worklet for native thread execution
**And** month header updates after animation starts

---

### Story 3.10: Implement Special Day Badges

As a user,
I want to see badges on special days like full moon (Rằm),
So that I can identify significant lunar dates quickly.

**Acceptance Criteria:**

**Given** DayCell component exists
**When** rendering a full moon day (15th lunar day)
**Then** "RẰM" badge is displayed on the cell
**And** badge uses primary green color
**And** badge does not obstruct date readability
**And** badge appears on all full moon days (FR10)

---

## Epic 4: Today Preview Widget

**Goal:** Create the persistent bottom widget that shows today's feng shui information regardless of which month is being browsed - the app's key differentiator.

**User Outcome:** Users instantly see today's Hoàng Đạo hours, Tiết Khí, Ngũ Hành, daily quote, and upcoming holidays without any taps. This information persists while browsing other months.

### Story 4.1: Create TodayWidget Container

As a user,
I want a persistent widget at the bottom of the calendar screen showing today's info,
So that I always have quick access to current day information.

**Acceptance Criteria:**

**Given** CalendarScreen is displayed
**When** rendering the TodayWidget
**Then** widget is positioned at the bottom of the screen
**And** widget has elevation shadow (4dp) for visual separation
**And** widget height is approximately 120px
**And** widget remains visible when browsing other months (FR11)
**And** widget respects bottom safe area on notched devices

---

### Story 4.2: Display Today's Date and Weekday

As a user,
I want to see today's weekday name and full date in the widget,
So that I know the current day at a glance.

**Acceptance Criteria:**

**Given** TodayWidget is rendered
**When** displaying today's date info
**Then** weekday is displayed prominently (e.g., "Thứ Ba")
**And** full date with year is shown (e.g., "24 Tháng 10, 2023")
**And** Can Chi is displayed (e.g., "• Quý Mão")
**And** text uses Vietnamese with proper diacritics (FR12, FR13)

---

### Story 4.3: Display Lunar Date Badge

As a user,
I want to see today's lunar date in a distinct badge,
So that I can quickly see the lunar calendar date.

**Acceptance Criteria:**

**Given** TodayWidget is rendered
**When** displaying lunar date
**Then** lunar date is shown in a rounded badge (e.g., "ÂM LỊCH 10/09")
**And** badge uses primary green background with white text
**And** badge has border-radius for rounded corners (FR14)

---

### Story 4.4: Display Quick Info Icons Row

As a user,
I want to see Hoàng Đạo hours, Tiết Khí, and Ngũ Hành with icons,
So that I can scan key feng shui information quickly.

**Acceptance Criteria:**

**Given** TodayWidget is rendered
**When** displaying quick info row
**Then** sun icon with "GIỜ HOÀNG ĐẠO" label and hours (e.g., "Tý, Dần, Mão") is shown (FR15)
**And** star icon with "TIẾT KHÍ" label and term (e.g., "Sương Giáng") is shown (FR16)
**And** drop icon with "NGŨ HÀNH" label and element (e.g., "Hải T.Kim") is shown (FR17)
**And** icons use appropriate colors from theme
**And** text is readable at arm's length (NFR16)

---

### Story 4.5: Display Daily Quote

As a user,
I want to see a daily inspirational quote in the widget,
So that I receive wisdom and motivation each day.

**Acceptance Criteria:**

**Given** TodayWidget is rendered
**When** displaying daily quote
**Then** quote is shown in a light green card
**And** quote text is italic
**And** quote is in Vietnamese with proper diacritics
**And** quote changes daily (deterministic based on date) (FR18)

---

### Story 4.6: Display Upcoming Holidays

As a user,
I want to see upcoming Vietnamese holidays with countdown,
So that I'm aware of approaching celebrations.

**Acceptance Criteria:**

**Given** TodayWidget is rendered
**When** displaying upcoming holidays
**Then** "SẮP TỚI" section header is shown
**And** 1-2 upcoming holidays are displayed as cards
**And** each card shows: date badge (colored), holiday name, countdown ("X ngày nữa")
**And** countdown updates correctly (FR19)

---

### Story 4.7: Widget Tap Navigation

As a user,
I want to tap the TodayWidget to open today's detail view,
So that I can see full information with one tap.

**Acceptance Criteria:**

**Given** TodayWidget is displayed
**When** tapping the widget
**Then** DayDetailScreen opens for today's date
**And** transition is smooth (300ms slide up)
**And** widget provides visual feedback on tap

---

## Epic 5: Day Detail Screen

**Goal:** Build the comprehensive day detail screen showing all feng shui information for any selected date with smooth modal transitions.

**User Outcome:** Users tap any date to see full feng shui details including day score with progress bar, auspicious hours with time ranges, recommended/avoid activities, auspicious directions, and daily quote.

### Story 5.1: Implement Day Detail Navigation

As a user,
I want to tap any date cell to open its detail screen,
So that I can see complete feng shui information for that day.

**Acceptance Criteria:**

**Given** CalendarGrid is displayed
**When** tapping a date cell
**Then** DayDetailScreen opens as a modal (slides up from bottom)
**And** animation duration is 300ms with ease-out
**And** modal covers 90% of screen height
**And** top corners have 16px border radius
**And** screen loads within 150ms (FR20, NFR4)

---

### Story 5.2: Implement Back Navigation

As a user,
I want to return to the calendar from the detail screen,
So that I can continue browsing dates.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** tapping back button or pulling down
**Then** modal dismisses with slide down animation (250ms)
**And** calendar screen is visible and interactive again
**And** pull-to-dismiss threshold is 100px vertical (FR21)

---

### Story 5.3: Display Hero Date Section

As a user,
I want to see the selected date prominently displayed,
So that I know which day I'm viewing.

**Acceptance Criteria:**

**Given** DayDetailScreen is open for a date
**When** the hero section renders
**Then** month name is shown in green text (e.g., "THÁNG NĂM")
**And** day number is displayed large (45+ size, bold, dark blue)
**And** "HÔM NAY" indicator with green dot appears if viewing today (FR22, FR23)
**And** lunar date card shows on the right with "ÂM LỊCH" label, date, and Can Chi (FR24)

---

### Story 5.4: Display Day Type Badge

As a user,
I want to see the weekday name and day type (e.g., Hoàng Đạo),
So that I understand the significance of the day.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** displaying day type
**Then** weekday name is shown (e.g., "Chủ Nhật" in red for Sunday)
**And** if auspicious day, "Ngày Hoàng Đạo" badge with star icon is displayed
**And** badge uses appropriate color based on day quality (FR25)

---

### Story 5.5: Display Quick Info Section

As a user,
I want to see Hoàng Đạo hours, Tiết Khí, and Ngũ Hành in the detail view,
So that I have this information readily available.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** quick info section renders
**Then** three horizontally-aligned info items are shown
**And** sun icon + "GIỜ H.ĐẠO" + hours list
**And** star icon + "TIẾT KHÍ" + solar term
**And** drop icon + "NGŨ HÀNH" + element (FR26)

---

### Story 5.6: Display Day Score Section

As a user,
I want to see a luck score with visual progress bar,
So that I can quickly understand the day's overall auspiciousness.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** day score section renders
**Then** "CHỈ SỐ MAY MẮN" header is shown
**And** percentage is displayed large (e.g., "75%") in appropriate color
**And** horizontal progress bar shows 6 segments filled based on score
**And** contextual message describes the day's energy (e.g., "Năng lượng tích cực đang lên cao")
**And** colors follow score mapping: 80-100% green, 60-79% light green, 40-59% amber, etc. (FR27, FR28)

---

### Story 5.7: Display Activities Cards

As a user,
I want to see recommended and avoided activities in side-by-side cards,
So that I know what to do and what to avoid.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** activities section renders
**Then** two cards are displayed side-by-side
**And** left card has light green background with checkmark icon + "NÊN LÀM" header
**And** left card lists recommended activities as bullet points (FR29)
**And** right card has light pink background with X icon + "KHÔNG NÊN" header
**And** right card lists activities to avoid as bullet points (FR30)

---

### Story 5.8: Display Auspicious Hours Timeline

As a user,
I want to see auspicious hours with time ranges in a scrollable list,
So that I can plan activities at favorable times.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** auspicious hours section renders
**Then** "Giờ Tốt" header with "Hoàng Đạo" badge is shown
**And** horizontal scrollable list of 6 time slots is displayed
**And** each slot shows: hour name (e.g., "Tý") and time range (e.g., "23-01")
**And** current hour (if auspicious) is highlighted with green pill background (FR31, FR32)

---

### Story 5.9: Display Directions Section

As a user,
I want to see auspicious directions for Hỷ Thần and Tài Thần,
So that I know favorable directions for the day.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** directions section renders
**Then** "Hướng Xuất Hành" header is shown
**And** compass icon is displayed on the left
**And** two columns show: "HỶ THẦN" → direction, "TÀI THẦN" → direction
**And** directions are in Vietnamese (e.g., "Đông Nam", "Bắc") in green text (FR33)

---

### Story 5.10: Display Upcoming Events on Detail

As a user,
I want to see upcoming holidays from the viewed date,
So that I'm aware of approaching celebrations.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** events section renders
**Then** "SẮP TỚI" header is shown
**And** upcoming holidays from the viewed date are listed
**And** each event shows: date badge, name, countdown (FR34)

---

### Story 5.11: Display Daily Quote on Detail

As a user,
I want to see a daily quote at the bottom of the detail view,
So that I receive wisdom for the day.

**Acceptance Criteria:**

**Given** DayDetailScreen is open
**When** quote section renders
**Then** quote is displayed in light gray italic text at the bottom
**And** quote is appropriate for the viewed date (FR35)

---

## Epic 6: Accessibility & Polish

**Goal:** Ensure WCAG AA compliance, VoiceOver/TalkBack screen reader support, reduced motion preferences, and production-ready performance across all screens.

**User Outcome:** All users can fully use the app with proper accessibility labels, keyboard navigation, and consistent experience regardless of assistive technology usage.

### Story 6.1: Add Accessibility Labels to Calendar

As a user using screen reader,
I want calendar cells to announce complete information,
So that I can navigate the calendar without seeing the screen.

**Acceptance Criteria:**

**Given** VoiceOver or TalkBack is enabled
**When** focusing on a calendar cell
**Then** cell announces: weekday, solar date, lunar date, special indicators
**And** format: "Thứ Tư, ngày 18 tháng 12, âm lịch 18 tháng 11, ngày tốt"
**And** weekend days include color indication in announcement
**And** all cells have accessibilityRole="button"

---

### Story 6.2: Add Accessibility Labels to TodayWidget

As a user using screen reader,
I want the Today Widget to announce its content,
So that I can access feng shui information without seeing the screen.

**Acceptance Criteria:**

**Given** VoiceOver or TalkBack is enabled
**When** focusing on TodayWidget
**Then** widget announces: date, day score, key hours, and activities summary
**And** widget has accessibilityRole="summary"
**And** individual sections are focusable for detailed navigation

---

### Story 6.3: Add Accessibility Labels to Day Detail

As a user using screen reader,
I want the Day Detail screen to have proper heading hierarchy,
So that I can navigate between sections efficiently.

**Acceptance Criteria:**

**Given** VoiceOver or TalkBack is enabled
**When** opening Day Detail screen
**Then** each card title is an accessibility heading
**And** activities are announced with context (good vs avoid)
**And** hours timeline announces current hour status
**And** focus moves to screen header when opened

---

### Story 6.4: Implement Reduced Motion Support

As a user with motion sensitivity,
I want animations to be reduced or disabled based on my system preference,
So that I can use the app comfortably.

**Acceptance Criteria:**

**Given** system "Reduce Motion" preference is enabled
**When** navigating the app
**Then** month transitions happen instantly (0ms duration)
**And** day detail modal appears instantly
**And** all spring/bounce animations are disabled
**And** app remains fully functional without animations

---

### Story 6.5: Verify Color Contrast Compliance

As a user with visual impairment,
I want all text to have sufficient color contrast,
So that I can read the content clearly.

**Acceptance Criteria:**

**Given** the app uses the defined color system
**When** auditing color contrast
**Then** all text passes WCAG AA (4.5:1 for normal text, 3:1 for large)
**And** green (#2E7D32) on white achieves 5.87:1
**And** red (#D32F2F) on white achieves 5.91:1
**And** interactive elements are distinguishable not just by color (NFR17)

---

### Story 6.6: Verify Touch Target Sizes

As a user with motor impairment,
I want all interactive elements to be easily tappable,
So that I don't accidentally tap the wrong target.

**Acceptance Criteria:**

**Given** the app has interactive elements
**When** measuring touch targets
**Then** all buttons have minimum 44x44pt (iOS) / 48x48dp (Android) touch area
**And** calendar cells are at least 42x42pt
**And** navigation arrows have adequate spacing
**And** no adjacent targets are too close together

---

### Story 6.7: Performance Optimization Audit

As a user,
I want the app to perform smoothly without memory leaks,
So that I have a reliable experience over extended use.

**Acceptance Criteria:**

**Given** the app has all features implemented
**When** performing performance audit
**Then** 30 minutes of month navigation shows no memory leaks (NFR8)
**And** memory usage stays under 150MB (NFR7)
**And** no UI-related crashes are reproducible (NFR9)
**And** calendar renders in < 100ms consistently (NFR3)

---

### Story 6.8: Cross-Platform Visual Parity

As a user,
I want the app to look identical on iOS and Android,
So that my experience is consistent regardless of device.

**Acceptance Criteria:**

**Given** the app runs on both platforms
**When** comparing iOS and Android screenshots
**Then** visual deviation is < 5% (NFR19)
**And** gesture behavior is identical (NFR20)
**And** typography renders consistently (NFR21)
**And** Vietnamese diacritics display correctly on both (NFR27)

---

## Epic 7: Compass Screen (La Bàn)

**Goal:** Replace the "Hôm Nay" tab with a comprehensive Compass screen featuring both standard compass and feng shui compass modes, providing real-time orientation and daily auspicious direction guidance.

**User Outcome:** Users can use the app as a digital compass while also seeing feng shui direction recommendations for the day. The feng shui compass displays 8 directions with Ngũ Hành colors and highlights today's auspicious directions with visual indicators.

**FRs covered:** FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR57
**NFRs addressed:** NFR1, NFR2, NFR10, NFR19, NFR20

**Reference:** See `docs/ux-compass-design.md` for complete UX specifications.

---

### Story 7.1: Update Tab Navigation for Compass

As a user,
I want to access the Compass screen via the bottom tab bar,
So that I can quickly navigate to compass functionality.

**Acceptance Criteria:**

**Given** the TabNavigator is configured
**When** updating navigation for Compass
**Then** "Hôm Nay" tab is replaced with "La Bàn" tab
**And** tab icon uses `compass` from MaterialCommunityIcons
**And** tab position is 2nd (between Lịch and Ngày lễ)
**And** active color is `colors.primary[600]` (#059669)
**And** tab label displays "La Bàn" in Vietnamese (FR50)

---

### Story 7.2: Create Compass Screen Container

As a user,
I want a dedicated screen for the compass with proper layout,
So that the compass is displayed prominently.

**Acceptance Criteria:**

**Given** CompassScreen component is created
**When** the screen renders
**Then** background uses consistent theme (`#F8FAFC` slate-50)
**And** decorative blur circles are displayed (emerald + gold tints)
**And** screen respects safe areas on notched devices
**And** screen layout accommodates both compass and info panel

---

### Story 7.3: Implement Layout Toggle Switch

As a user,
I want to switch between Standard Compass and Feng Shui Compass modes,
So that I can choose the view that suits my needs.

**Acceptance Criteria:**

**Given** CompassScreen is displayed
**When** rendering the toggle control
**Then** segmented control shows "La Bàn Thường" and "Phong Thủy" options
**And** active segment has emerald background with white text
**And** inactive segment has neutral background with gray text
**And** switching modes animates smoothly (200ms ease-out)
**And** selected mode state persists during session (FR51)

---

### Story 7.4: Install and Configure Magnetometer Sensor

As a developer,
I want to integrate magnetometer sensor access,
So that the compass can show real-time device orientation.

**Acceptance Criteria:**

**Given** react-native-sensors library is available
**When** configuring magnetometer access
**Then** magnetometer readings are accessible on iOS
**And** magnetometer readings are accessible on Android
**And** sensor updates at minimum 30Hz for smooth compass
**And** proper permissions are requested on Android
**And** graceful handling when sensor is unavailable

---

### Story 7.5: Implement Standard Compass Visual

As a user,
I want to see a beautiful digital compass,
So that I can determine my real-world orientation.

**Acceptance Criteria:**

**Given** Standard Compass mode is selected
**When** rendering the compass
**Then** compass ring displays with emerald gradient border
**And** degree markers are shown at 30° intervals
**And** cardinal directions show in correct colors (N=red, S=emerald, E=blue, W=amber)
**And** Vietnamese labels display (Bắc, Nam, Đông, Tây)
**And** compass needle points North with red indicator (FR52, FR53)

---

### Story 7.6: Implement Compass Rotation Animation

As a user,
I want the compass to rotate smoothly based on device orientation,
So that I can see accurate real-time direction.

**Acceptance Criteria:**

**Given** magnetometer is available and Standard Compass is displayed
**When** device orientation changes
**Then** compass rotates smoothly using spring animation
**And** animation uses damping: 15, stiffness: 100
**And** rotation maintains 60 FPS (NFR1)
**And** gesture response < 16ms (NFR2)
**And** haptic feedback triggers when crossing N/S/E/W (every 90°)

---

### Story 7.7: Display Digital Heading Readout

As a user,
I want to see my current heading in degrees and direction name,
So that I have precise orientation information.

**Acceptance Criteria:**

**Given** Standard Compass is displayed
**When** device orientation is detected
**Then** heading displays in degrees (0-359°)
**And** direction name shows in Vietnamese (e.g., "Đông Bắc", "Tây Nam")
**And** display format: "Hướng: 45° - Đông Bắc"
**And** readout updates in real-time with 100ms smoothing (FR54)

---

### Story 7.8: Implement Feng Shui Compass Visual

As a user,
I want to see a traditional feng shui compass with 8 directions,
So that I can view directions colored by Ngũ Hành (Five Elements).

**Acceptance Criteria:**

**Given** Feng Shui Compass mode is selected
**When** rendering the compass
**Then** compass displays concentric rings (outer 24 Sơn, middle 8 Hướng, inner indicators)
**And** 8 directions are colored by Ngũ Hành (Thủy=blue, Hỏa=red, Mộc=green, Kim=silver, Thổ=brown)
**And** Yin-Yang symbol displays in center
**And** Vietnamese direction names are visible (FR55)

---

### Story 7.9: Highlight Today's Auspicious Directions

As a user,
I want to see which directions are auspicious or inauspicious today,
So that I can make informed decisions about travel and activities.

**Acceptance Criteria:**

**Given** Feng Shui Compass is displayed
**When** applying today's feng shui data
**Then** Đại Cát (very lucky) directions show gold pulsing glow
**And** Cát (lucky) directions show emerald border
**And** Hung (unlucky) directions show orange border
**And** Đại Hung (very unlucky) directions show red background tint
**And** indicators are calculated from existing feng shui data (FR45, FR56)

---

### Story 7.10: Display Today's Feng Shui Info Panel

As a user,
I want to see today's feng shui direction summary below the compass,
So that I can quickly understand which directions to favor.

**Acceptance Criteria:**

**Given** Feng Shui Compass is displayed
**When** info panel renders
**Then** panel shows today's date (solar and lunar)
**And** panel lists Hướng Đại Cát with gold text
**And** panel lists Hướng Cát with emerald text
**And** panel lists Hướng Hung with orange text
**And** panel shows suggestion text in Vietnamese
**And** panel has white background with shadow (FR57)

---

### Story 7.11: Handle No Magnetometer State

As a user on a device without magnetometer,
I want to see helpful guidance,
So that I can still use the feng shui features.

**Acceptance Criteria:**

**Given** device has no magnetometer sensor
**When** Standard Compass mode is selected
**Then** empty state displays compass icon and message
**And** message explains device limitation in Vietnamese
**And** button offers to switch to Feng Shui mode
**And** Feng Shui mode works fully without magnetometer (NFR10)

---

### Story 7.12: Add Accessibility Labels to Compass

As a user using screen reader,
I want the compass to announce orientation information,
So that I can understand direction without seeing the screen.

**Acceptance Criteria:**

**Given** VoiceOver or TalkBack is enabled
**When** focusing on compass elements
**Then** compass announces "La bàn, hướng hiện tại: X độ, [Hướng]"
**And** toggle announces current mode selection
**And** direction segments announce "[Hướng], [Ngũ Hành], [Status hôm nay]"
**And** info panel announces full content
