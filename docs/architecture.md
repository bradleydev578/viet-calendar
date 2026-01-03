---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - 'docs/prd.md'
  - 'docs/ux-design-specification.md'
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2024-12-17'
workflowComplete: true
project_name: 'lich-viet-van-su-an-lanh'
user_name: 'Bằng Ca'
date: '2024-12-16'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

49 functional requirements organized into 5 categories:

| Category | Count | Key Features |
|----------|-------|--------------|
| Calendar View & Navigation | 10 FRs | Monthly grid, lunar/solar display, swipe gestures, date picker |
| Today Preview Widget | 9 FRs | Quick daily info, day score, key activities, navigation |
| Day Detail View | 16 FRs | Complete feng shui data, hourly Hoàng Đạo, activities list |
| App Navigation | 4 FRs | Tab-based navigation, deep linking, gesture support |
| Data & Content | 10 FRs | Offline data, 28 Stars, 12 Trực, Can Chi system |

**Non-Functional Requirements:**

27 NFRs driving architectural decisions across 4 categories:

| Category | Key Requirements |
|----------|------------------|
| **Performance** (NFR1-9) | 60 FPS animations, <16ms gesture response, <100ms screen render, <2s cold start, <50MB bundle |
| **Reliability** (NFR10-15) | 100% offline operation, graceful error handling, data consistency |
| **Usability** (NFR16-21) | WCAG AA accessibility, cross-platform UI parity, Vietnamese locale |
| **Compatibility** (NFR22-27) | iOS 13+, Android API 24+, multiple screen sizes |

**Scale & Complexity:**

- Primary domain: Mobile App (React Native Cross-Platform)
- Complexity level: Medium
- Architecture type: Presentation Layer Enhancement (Brownfield)
- Estimated UI components: ~15 (7 custom + 8 themed from React Native Paper)

### Technical Constraints & Dependencies

**Existing Stack (from CLAUDE.md):**
- React Native 0.73+ with TypeScript
- Zustand for state management (already implemented)
- lunar-javascript for offline lunar calculations
- React Navigation 6 for navigation
- TanStack Query for data fetching/caching
- MMKV for fast key-value storage

**New Dependencies Required:**
- react-native-gesture-handler (swipe gestures, smooth interactions)
- react-native-reanimated (60 FPS animations, spring physics)
- react-native-paper (Material Design 3 components with theming)

**Data Strategy:**
- Offline-first with bundled JSON (~20-50KB/year gzipped)
- 2-3 years of feng shui data pre-bundled
- lunar-javascript for real-time calculations (no network needed)

### Cross-Cutting Concerns Identified

| Concern | Impact | Architectural Implication |
|---------|--------|---------------------------|
| **Performance** | All screens | Memoization, virtualization, gesture optimization |
| **Accessibility** | All UI components | VoiceOver/TalkBack support, semantic markup |
| **Design System** | All components | Consistent theming via React Native Paper |
| **Platform Parity** | iOS/Android | Platform-specific adaptations where needed |
| **Offline-First** | Data layer | Pre-bundled data, no network dependency |
| **Gesture Handling** | Calendar, navigation | Native gesture system integration |
| **Vietnamese Locale** | All text content | UTF-8, proper diacritics, text sizing |

## Starter Template Evaluation

### Primary Technology Domain

**Mobile App (React Native Cross-Platform)** - This is a brownfield presentation layer enhancement to an existing project structure with pre-defined architecture.

### Technical Preferences (From Project Context)

| Category | Decision |
|----------|----------|
| **Framework** | React Native 0.73+ |
| **Language** | TypeScript |
| **State Management** | Zustand |
| **Navigation** | React Navigation 6 |
| **Data Fetching** | TanStack Query |
| **Storage** | MMKV |
| **Calculations** | lunar-javascript |

### Starter Options Considered

| Option | Pros | Cons | Fit |
|--------|------|------|-----|
| **Expo SDK 52** | New Architecture by default, managed workflow, EAS Build | Less native control, potential lock-in | Medium |
| **React Native CLI (0.77)** | Full native access, Swift default for iOS, maximum flexibility | More setup required | High |
| **Custom Template** | Exact match to existing structure | Must be created | High |

### Selected Approach: React Native Community CLI

**Rationale for Selection:**

1. **Brownfield Project**: Existing directory structure and architecture defined in CLAUDE.md
2. **Native Module Requirements**: react-native-gesture-handler, react-native-reanimated require native configuration
3. **Full Control**: No Expo abstractions between app and native code
4. **React Native 0.77 Features**: Swift default for iOS, New Architecture enabled, CSS improvements
5. **Library Compatibility**: Direct native module access for lunar-javascript validation

**Initialization Command:**

```bash
npx @react-native-community/cli@latest init LichViet --template react-native-template-typescript
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.x with strict mode
- React Native 0.77 (latest stable)
- New Architecture enabled by default
- React 18 with concurrent features

**Project Structure:**
```
mobile/
├── src/
│   ├── app/navigation/      # React Navigation setup
│   ├── screens/             # Screen components
│   ├── components/          # Reusable components
│   ├── core/                # Business logic (lunar, fengshui)
│   ├── stores/              # Zustand stores
│   ├── hooks/               # Custom hooks
│   ├── theme/               # Design system
│   └── utils/               # Helper functions
├── ios/                     # iOS native code (Swift)
├── android/                 # Android native code (Kotlin)
└── __tests__/               # Jest tests
```

**Build Tooling:**
- Metro bundler with fast refresh
- Hermes JavaScript engine (default)
- Gradle 8.x for Android builds
- Xcode 15+ with Swift 5.9+

**Testing Framework:**
- Jest pre-configured
- React Native Testing Library compatible
- Detox-ready for E2E testing

**Development Experience:**
- Hot reloading via Metro
- Flipper debugging support
- React DevTools integration
- TypeScript IntelliSense

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- UI Component Library: react-native-paper 5.14.5
- Animation Library: react-native-reanimated 3.18.1
- Gesture Library: react-native-gesture-handler 2.29.1

**Important Decisions (Shape Architecture):**
- Component architecture patterns
- Performance optimization strategy
- Data caching strategy

**Deferred Decisions (Post-MVP):**
- Push notifications
- Widget extensions (iOS/Android)
- Analytics integration

### Frontend Architecture

| Decision | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| **UI Library** | React Native Paper | 5.14.5 | Material Design 3 support, 40+ components, excellent theming |
| **Animations** | React Native Reanimated | 3.18.1 | 60-120 FPS native UI thread animations, New Architecture compatible |
| **Gestures** | React Native Gesture Handler | 2.29.1 | Native gesture system, integrates with Reanimated |
| **State Management** | Zustand | (existing) | Already in project context |
| **Navigation** | React Navigation 6 | (existing) | Already in project context |

**Component Architecture Pattern:**
- Atomic Design: atoms → molecules → organisms → screens
- Custom components extend React Native Paper base
- Memoization for DayCell (60+ instances per month)

**Performance Optimization:**
- Worklet-based animations (Reanimated)
- Native gesture handling
- Virtualized lists for holidays/activities
- Pre-computed day scores at data import

### Data Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary Storage** | MMKV | Fast key-value storage for settings, cached calculations |
| **Feng Shui Data** | Bundled JSON | ~20-50KB/year gzipped, loaded at app start |
| **Calculations** | lunar-javascript | Real-time, no network needed |
| **Caching Strategy** | Compute-once at import | Day scores pre-calculated, not on render |

**Data Flow:**
```
App Start → Load bundled JSON → Pre-compute day scores → Store in memory
User Request → lunar-javascript (real-time) + cached feng shui data → Render
```

### Authentication & Security

**Decision: No Authentication Required**

Rationale: This is a pure offline calendar app with no user accounts, cloud sync, or personal data storage. Security considerations:
- No network requests for core functionality
- No sensitive user data collected
- No backend API to secure

### API & Communication

**Decision: No External APIs**

Rationale: Offline-first architecture with all data bundled:
- lunar-javascript runs locally
- Feng shui data pre-bundled
- No server communication required

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **iOS Build** | Xcode + Fastlane | Standard iOS deployment |
| **Android Build** | Gradle + Fastlane | Standard Android deployment |
| **CI/CD** | GitHub Actions | Free for open source, good RN support |
| **Distribution** | App Store + Google Play | Consumer mobile app distribution |

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization (React Native CLI)
2. Install core dependencies (Paper, Reanimated, Gesture Handler)
3. Configure theme system
4. Build custom components
5. Integrate lunar-javascript
6. Load feng shui data
7. Build screens

**Cross-Component Dependencies:**
- Reanimated ↔ Gesture Handler (tightly coupled for smooth interactions)
- React Native Paper ↔ Theme (all components use theme provider)
- DayCell ↔ Day scores (pre-computed data)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 12 areas where AI agents could make different choices

### Naming Patterns

**Code Naming Conventions:**

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `DayCell.tsx`, `CalendarGrid.tsx` |
| Hooks | camelCase with `use` prefix | `useLunarDate.ts`, `useDayScore.ts` |
| Utils/Helpers | camelCase | `formatDate.ts`, `calculateScore.ts` |
| Types/Interfaces | PascalCase with suffix | `DayData`, `LunarDateInfo` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_DAYS_IN_VIEW`, `DEFAULT_SCORE` |
| Stores (Zustand) | camelCase with `Store` suffix | `calendarStore.ts`, `settingsStore.ts` |

**File Naming Conventions:**

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase.tsx | `DayCell.tsx` |
| Screens | PascalCase + Screen.tsx | `CalendarScreen.tsx` |
| Hooks | use + camelCase.ts | `useLunarDate.ts` |
| Stores | camelCase + Store.ts | `calendarStore.ts` |
| Utils | camelCase.ts | `dateHelpers.ts` |
| Types | camelCase.types.ts | `calendar.types.ts` |
| Tests | *.test.tsx or *.test.ts | `DayCell.test.tsx` |

### Structure Patterns

**Component Organization (Atomic Design):**

```
components/
├── common/           # Atoms - basic UI elements
│   ├── Badge.tsx
│   ├── Chip.tsx
│   └── index.ts
├── calendar/         # Feature-specific molecules/organisms
│   ├── DayCell.tsx
│   ├── CalendarGrid.tsx
│   └── index.ts
└── index.ts          # Re-exports all components
```

**Test Location:** Co-located with source files
```
components/calendar/
├── DayCell.tsx
├── DayCell.test.tsx    # Test alongside component
└── index.ts
```

**Import Path Pattern:**
```typescript
// ✅ Good - use barrel exports
import { DayCell, CalendarGrid } from '@/components/calendar';
import { useLunarDate } from '@/hooks';

// ❌ Bad - deep imports
import DayCell from '../components/calendar/DayCell';
```

### Format Patterns

**Data Formats:**

| Data Type | Format | Example |
|-----------|--------|---------|
| Dates (storage) | ISO 8601 string | `"2025-01-01"` |
| Dates (display) | Vietnamese locale | `"01/01/2025"` |
| Lunar dates | Object structure | `{ day: 1, month: 12, year: 2024, leap: false }` |
| Can Chi | Vietnamese diacritics | `"Giáp Tý"` (not "Giap Ty") |
| Day scores | 0-100 integer | `85` |

**TypeScript Strictness:**
```typescript
// ✅ Required - explicit types for public APIs
export function calculateDayScore(date: Date): number { ... }

// ✅ Required - interfaces over types for objects
interface DayData {
  solarDate: string;
  lunarDate: LunarDate;
  score: number;
}

// ❌ Forbidden - any type
function processData(data: any) { ... }
```

### Communication Patterns

**State Management (Zustand):**
```typescript
// ✅ Pattern - slice-based store organization
interface CalendarState {
  selectedDate: Date;
  viewMode: 'month' | 'week';
  // Actions grouped at end
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: 'month' | 'week') => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: new Date(),
  viewMode: 'month',
  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
```

**Component Props Pattern:**
```typescript
// ✅ Pattern - destructured props with defaults
interface DayCellProps {
  date: Date;
  isSelected?: boolean;
  onPress: (date: Date) => void;
}

export const DayCell = memo(({
  date,
  isSelected = false,
  onPress
}: DayCellProps) => { ... });
```

### Process Patterns

**Error Handling:**
```typescript
// ✅ Pattern - Error boundaries for screens
<ErrorBoundary fallback={<ErrorScreen />}>
  <CalendarScreen />
</ErrorBoundary>

// ✅ Pattern - Try-catch for async operations
try {
  const data = await loadFengShuiData(year);
} catch (error) {
  console.error('[FengShui] Load failed:', error);
  // Return safe fallback
  return DEFAULT_DATA;
}
```

**Loading States:**
```typescript
// ✅ Pattern - consistent loading state naming
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

// ✅ Pattern - skeleton loading for calendar
{isLoading ? <CalendarSkeleton /> : <CalendarGrid data={data} />}
```

**Animation Pattern (Reanimated):**
```typescript
// ✅ Pattern - worklet functions for 60 FPS
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return {
    transform: [{ scale: withSpring(scale.value) }],
  };
});

// ❌ Bad - JS thread animation
const animatedStyle = { transform: [{ scale }] }; // Not a worklet
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. Use TypeScript strict mode - no `any` types
2. Follow file naming conventions exactly
3. Co-locate tests with source files
4. Use barrel exports (index.ts) for all directories
5. Use Reanimated worklets for all animations
6. Memoize components with 60+ instances (DayCell)
7. Store dates as ISO strings, display with Vietnamese locale

**Pattern Verification:**
- TypeScript compiler catches type violations
- ESLint enforces naming conventions
- PR review checks pattern compliance

### Pattern Examples

**Good Example - DayCell Component:**
```typescript
// components/calendar/DayCell.tsx
import { memo } from 'react';
import { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { DayCellProps } from './DayCell.types';

export const DayCell = memo(({ date, score, onPress }: DayCellProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: withSpring(1) };
  });

  return (
    <Pressable onPress={() => onPress(date)} accessibilityRole="button">
      <Animated.View style={animatedStyle}>
        {/* ... */}
      </Animated.View>
    </Pressable>
  );
});
```

**Anti-Patterns to Avoid:**
```typescript
// ❌ Bad - unnamed export
export default function DayCell() { ... }

// ❌ Bad - any type
const processData = (data: any) => { ... }

// ❌ Bad - JS thread animation
Animated.timing(value, { toValue: 1 }).start();

// ❌ Bad - non-memoized repeated component
{dates.map(d => <DayCell date={d} />)}  // 42+ renders
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
lich-viet-van-su-an-lanh/
├── docs/                              # Documentation
│   ├── prd.md
│   ├── architecture.md
│   ├── ux-design-specification.md
│   └── project-plan.md
├── scraper/                           # Python data scraper (existing)
│   ├── src/
│   │   ├── scrapers/
│   │   ├── parsers/
│   │   ├── models/
│   │   ├── validators/
│   │   └── storage/
│   ├── scripts/
│   ├── data/
│   │   ├── raw/
│   │   ├── processed/
│   │   └── export/
│   ├── requirements.txt
│   └── README.md
└── mobile/                            # React Native app
    ├── package.json
    ├── tsconfig.json
    ├── babel.config.js
    ├── metro.config.js
    ├── app.json
    ├── .env.example
    ├── .gitignore
    ├── index.js                       # Entry point
    ├── ios/                           # iOS native (Swift)
    │   ├── Podfile
    │   ├── LichViet/
    │   └── LichViet.xcworkspace/
    ├── android/                       # Android native (Kotlin)
    │   ├── build.gradle
    │   ├── app/
    │   └── gradle/
    └── src/
        ├── App.tsx                    # Root component
        ├── app/
        │   └── navigation/
        │       ├── AppNavigator.tsx   # Main navigation container
        │       ├── TabNavigator.tsx   # Bottom tab navigation
        │       └── index.ts
        ├── screens/
        │   ├── CalendarScreen/
        │   │   ├── CalendarScreen.tsx
        │   │   ├── CalendarScreen.test.tsx
        │   │   └── index.ts
        │   ├── DayDetailScreen/
        │   │   ├── DayDetailScreen.tsx
        │   │   ├── DayDetailScreen.test.tsx
        │   │   └── index.ts
        │   ├── HolidayListScreen/
        │   │   ├── HolidayListScreen.tsx
        │   │   ├── HolidayListScreen.test.tsx
        │   │   └── index.ts
        │   ├── SettingsScreen/
        │   │   ├── SettingsScreen.tsx
        │   │   ├── SettingsScreen.test.tsx
        │   │   └── index.ts
        │   └── index.ts
        ├── components/
        │   ├── common/                # Atoms - reusable UI elements
        │   │   ├── Badge.tsx
        │   │   ├── Chip.tsx
        │   │   ├── DayScoreIndicator.tsx
        │   │   ├── DayScoreIndicator.test.tsx
        │   │   └── index.ts
        │   ├── calendar/              # Calendar-specific components
        │   │   ├── CalendarGrid.tsx
        │   │   ├── CalendarGrid.test.tsx
        │   │   ├── DayCell.tsx
        │   │   ├── DayCell.test.tsx
        │   │   ├── MonthHeader.tsx
        │   │   ├── WeekdayHeader.tsx
        │   │   └── index.ts
        │   ├── today/                 # Today widget components
        │   │   ├── TodayWidget.tsx
        │   │   ├── TodayWidget.test.tsx
        │   │   ├── QuickInfoCard.tsx
        │   │   └── index.ts
        │   ├── daydetail/             # Day detail components
        │   │   ├── HoangDaoTimeline.tsx
        │   │   ├── HoangDaoTimeline.test.tsx
        │   │   ├── ActivityList.tsx
        │   │   ├── CanChiCard.tsx
        │   │   ├── StarInfoCard.tsx
        │   │   └── index.ts
        │   ├── navigation/            # Navigation components
        │   │   ├── NavigationHeader.tsx
        │   │   ├── TabBar.tsx
        │   │   └── index.ts
        │   └── index.ts               # Barrel export
        ├── core/                      # Business logic
        │   ├── lunar/
        │   │   ├── LunarCalculator.ts
        │   │   ├── LunarCalculator.test.ts
        │   │   ├── lunar.types.ts
        │   │   └── index.ts
        │   ├── fengshui/
        │   │   ├── rules/
        │   │   │   ├── dayScoreRules.ts
        │   │   │   ├── activityRules.ts
        │   │   │   └── index.ts
        │   │   ├── DayScore.ts
        │   │   ├── DayScore.test.ts
        │   │   ├── fengshui.types.ts
        │   │   └── index.ts
        │   └── holidays/
        │       ├── holidayData.ts
        │       ├── holiday.types.ts
        │       └── index.ts
        ├── data/
        │   ├── database/
        │   │   └── models/
        │   ├── storage/
        │   │   ├── mmkvStorage.ts
        │   │   └── index.ts
        │   ├── repositories/
        │   │   ├── fengShuiRepository.ts
        │   │   ├── settingsRepository.ts
        │   │   └── index.ts
        │   └── bundled/               # Pre-bundled feng shui data
        │       ├── fengshui_2024.json.gz
        │       ├── fengshui_2025.json.gz
        │       ├── fengshui_2026.json.gz
        │       └── index.ts
        ├── stores/                    # Zustand stores
        │   ├── calendarStore.ts
        │   ├── calendarStore.test.ts
        │   ├── settingsStore.ts
        │   └── index.ts
        ├── hooks/                     # Custom React hooks
        │   ├── useLunarDate.ts
        │   ├── useLunarDate.test.ts
        │   ├── useDayScore.ts
        │   ├── useFengShuiData.ts
        │   ├── useCalendarNavigation.ts
        │   └── index.ts
        ├── theme/                     # Design system
        │   ├── colors.ts
        │   ├── typography.ts
        │   ├── spacing.ts
        │   ├── paperTheme.ts          # React Native Paper theme
        │   └── index.ts
        ├── utils/                     # Helper functions
        │   ├── dateHelpers.ts
        │   ├── dateHelpers.test.ts
        │   ├── formatters.ts
        │   ├── dataLoader.ts
        │   └── index.ts
        ├── types/                     # Shared TypeScript types
        │   ├── calendar.types.ts
        │   ├── navigation.types.ts
        │   ├── lunar-javascript.d.ts  # Type declarations
        │   └── index.ts
        └── assets/
            ├── icons/
            │   └── zodiac/            # 12 zodiac animal icons
            ├── images/
            └── fonts/
```

### Architectural Boundaries

**Component Boundaries:**

| Boundary | Components | Communication |
|----------|------------|---------------|
| **Screens** | CalendarScreen, DayDetailScreen, etc. | Via React Navigation props |
| **Feature Components** | CalendarGrid, TodayWidget, etc. | Via props + Zustand stores |
| **Core Logic** | LunarCalculator, DayScore | Pure functions, no UI dependencies |
| **Data Layer** | Repositories, Storage | Async APIs, returns typed data |

**Data Boundaries:**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   UI Layer      │ →  │   Store Layer    │ →  │   Data Layer    │
│   (Screens/     │    │   (Zustand)      │    │   (Repos/MMKV)  │
│   Components)   │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        ↓                                              ↓
┌─────────────────┐                          ┌─────────────────┐
│   Core Logic    │                          │   Bundled Data  │
│   (lunar-js,    │                          │   (JSON.gz)     │
│   fengshui)     │                          │                 │
└─────────────────┘                          └─────────────────┘
```

### Requirements to Structure Mapping

**Calendar View & Navigation (FR1-FR10):**
- `screens/CalendarScreen/` - Main calendar screen
- `components/calendar/CalendarGrid.tsx` - Monthly grid
- `components/calendar/DayCell.tsx` - Individual day cells
- `hooks/useCalendarNavigation.ts` - Swipe gestures

**Today Preview Widget (FR11-FR19):**
- `components/today/TodayWidget.tsx` - Main widget
- `components/common/DayScoreIndicator.tsx` - Score display
- `hooks/useDayScore.ts` - Score calculations

**Day Detail View (FR20-FR35):**
- `screens/DayDetailScreen/` - Detail screen
- `components/daydetail/HoangDaoTimeline.tsx` - Hourly display
- `components/daydetail/ActivityList.tsx` - Activities
- `components/daydetail/CanChiCard.tsx` - Can Chi info

**App Navigation (FR36-FR39):**
- `app/navigation/AppNavigator.tsx` - Stack navigator
- `app/navigation/TabNavigator.tsx` - Bottom tabs
- `components/navigation/` - Tab bar, headers

**Data & Content (FR40-FR49):**
- `core/lunar/LunarCalculator.ts` - lunar-javascript wrapper
- `core/fengshui/` - Day scoring, activity rules
- `data/bundled/` - Pre-bundled JSON data
- `data/repositories/` - Data access layer

### Cross-Cutting Concerns Mapping

| Concern | Location | Files |
|---------|----------|-------|
| **Theming** | `theme/` | `paperTheme.ts`, `colors.ts` |
| **State** | `stores/` | `calendarStore.ts`, `settingsStore.ts` |
| **Types** | `types/` | `*.types.ts` files |
| **Utils** | `utils/` | `dateHelpers.ts`, `formatters.ts` |
| **Accessibility** | Components | `accessibilityRole`, `accessibilityLabel` props |

### Data Flow

```
App Start:
1. Load bundled JSON from data/bundled/
2. Decompress gzipped data
3. Pre-compute day scores for current year
4. Store in memory (Zustand)
5. Persist settings to MMKV

User Navigation:
1. User selects date → CalendarStore.setSelectedDate()
2. Screen reads from store → useCalendarStore()
3. Core logic computes → LunarCalculator.getLunarDate()
4. Repository fetches → fengShuiRepository.getDayData()
5. Component renders with data
```

### File Organization Patterns

**Configuration Files:**
- Root: `package.json`, `tsconfig.json`, `babel.config.js`
- iOS: `ios/Podfile`, `ios/LichViet/Info.plist`
- Android: `android/build.gradle`, `android/app/build.gradle`

**Source Organization:**
- Feature-based directories under `components/`
- Co-located tests with `.test.tsx` suffix
- Barrel exports via `index.ts` in each directory

**Test Organization:**
- Unit tests: Co-located with source (`*.test.ts`)
- E2E tests: `__tests__/e2e/` (future Detox)

**Asset Organization:**
- Icons: `assets/icons/zodiac/` - 12 zodiac SVGs
- Fonts: `assets/fonts/` - Vietnamese-compatible fonts
- Images: `assets/images/` - App icons, splash

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are compatible and work together:
- React Native 0.77 (New Architecture) + Reanimated 3.18.1 + Gesture Handler 2.29.1
- React Native Paper 5.14.5 with MD3 theming
- Zustand state management with TypeScript strict mode
- No version conflicts or incompatibilities detected

**Pattern Consistency:**
Implementation patterns fully support architectural decisions:
- Worklet-based animations align with 60 FPS performance requirements
- Atomic design component structure supports React Native Paper theming
- Co-located tests align with feature-based directory structure
- Barrel exports enable clean import paths

**Structure Alignment:**
Project structure enables all architectural decisions:
- `components/` organized by feature (calendar, today, daydetail)
- `core/` separates business logic from UI
- `data/` provides clear data access boundaries
- `theme/` centralizes design system configuration

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
All 49 FRs mapped to architectural components:

| FR Category | Count | Components | Status |
|-------------|-------|------------|--------|
| Calendar View & Navigation | 10 | CalendarScreen, CalendarGrid, DayCell | ✅ |
| Today Preview Widget | 9 | TodayWidget, DayScoreIndicator | ✅ |
| Day Detail View | 16 | DayDetailScreen, HoangDaoTimeline | ✅ |
| App Navigation | 4 | AppNavigator, TabNavigator | ✅ |
| Data & Content | 10 | LunarCalculator, fengShuiRepository | ✅ |

**Non-Functional Requirements Coverage:**
All 27 NFRs addressed architecturally:

| NFR Category | Architectural Support |
|--------------|----------------------|
| Performance | Reanimated worklets, memoization, pre-computed scores |
| Reliability | Offline-first bundled data, error boundaries |
| Usability | WCAG AA accessibility, Vietnamese locale |
| Compatibility | iOS 13+, Android API 24+, cross-platform RN |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical library versions specified (Paper 5.14.5, Reanimated 3.18.1, Gesture Handler 2.29.1)
- Rationales documented for all technology choices
- Deferred decisions clearly identified (push notifications, widgets, analytics)

**Structure Completeness:**
- Complete directory tree with 60+ files defined
- All screens, components, hooks, stores specified
- Clear boundaries between layers (UI, Store, Data, Core)

**Pattern Completeness:**
- 12 conflict points identified and addressed
- Naming conventions for all element types
- Code examples for every major pattern
- Anti-patterns documented to avoid

### Gap Analysis Results

**Critical Gaps:** None identified
**Important Gaps:** None - architecture covers full MVP scope
**Nice-to-Have Gaps:**
- CI/CD workflow file (`.github/workflows/ci.yml`) - can be added during implementation
- ESLint/Prettier configuration - can use standard RN config

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (49 FRs, 27 NFRs)
- [x] Scale and complexity assessed (Medium complexity, brownfield)
- [x] Technical constraints identified (existing stack from CLAUDE.md)
- [x] Cross-cutting concerns mapped (7 concerns identified)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established (7 element types)
- [x] Structure patterns defined (Atomic Design)
- [x] Communication patterns specified (Zustand, props)
- [x] Process patterns documented (error handling, loading, animation)

**✅ Project Structure**
- [x] Complete directory structure defined (60+ files)
- [x] Component boundaries established (4 layers)
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
1. Clear technology stack with verified compatible versions
2. Comprehensive implementation patterns preventing AI agent conflicts
3. Complete project structure with explicit file organization
4. Full requirements traceability (FRs → components)
5. Offline-first architecture eliminates backend complexity

**Areas for Future Enhancement:**
1. Push notifications (post-MVP)
2. iOS/Android widget extensions (post-MVP)
3. Analytics integration (post-MVP)
4. Additional years of feng shui data (expandable)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npx @react-native-community/cli@latest init LichViet --template react-native-template-typescript
```

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2024-12-17
**Document Location:** docs/architecture.md

### Final Architecture Deliverables

**Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**Implementation Ready Foundation**
- 15+ architectural decisions made
- 12 implementation patterns defined
- 60+ files specified in project structure
- 76 requirements (49 FRs + 27 NFRs) fully supported

**AI Agent Implementation Guide**
- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing lich-viet-van-su-an-lanh. Follow all decisions, patterns, and structures exactly as documented.

**Development Sequence:**
1. Initialize project using documented starter template
2. Set up development environment per architecture
3. Implement core architectural foundations (theme, navigation, stores)
4. Build features following established patterns
5. Maintain consistency with documented rules

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
