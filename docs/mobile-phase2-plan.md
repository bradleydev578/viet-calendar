# Mobile Phase 2 Plan: Day Detail Screen & Feng Shui Integration

**Version**: 1.0
**Date**: December 15, 2024
**Status**: Ready to implement

---

## Overview

Phase 2 tập trung vào việc tích hợp dữ liệu phong thủy từ scraper và xây dựng màn hình **Day Detail Screen** để hiển thị đầy đủ thông tin phong thủy cho mỗi ngày.

---

## Current Status

### ✅ Phase 1 Completed (70%)
- ✅ Navigation structure (RootNavigator, TabNavigator - 4 tabs)
- ✅ Lunar calculation engine (LunarCalculator, CanChi, TietKhi, HoangDao)
- ✅ Calendar Screen với grid hiển thị ngày âm dương
- ✅ Custom hooks (useLunarDate, useCalendarMonth)
- ✅ Theme system (colors, typography, spacing)
- ✅ All dependencies installed

### ⚠️ Known Issues
1. **Tab icons hiển thị "?"** - Cần add MaterialCommunityIcons.ttf vào Xcode project
2. **Week starts Monday** - Đã fix (T2-CN), cần verify

### 📊 Available Data
- **Scraper output**: `scraper/data/mobile/fengshui_2025.json` (365 days, 305KB)
- **Fields**: Lunar date, Can Chi, 28 Sao, 12 Trực, Tiết khí, Hoàng đạo hours, Activities, Directions, Stars

---

## Phase 2 Goals

### Main Objective
Xây dựng **Day Detail Screen** với đầy đủ thông tin phong thủy:
- Day Score (điểm số ngày 0-100%)
- 28 Sao + level
- 12 Trực + ý nghĩa
- Hoàng đạo hours (giờ tốt)
- Good/Bad activities
- Directions (Hỷ, Tài, Hắc thần)
- Good/Bad stars

### User Flow
```
User taps day in Calendar
    ↓
Navigate to DayDetail screen (with date param)
    ↓
Load feng shui data for that date from store
    ↓
Calculate day score (0-100%)
    ↓
Display all feng shui information in cards
```

---

## Implementation Steps

### Step 1: Data Integration Layer (2-3 hours)

#### 1.1 Create Data Types
**File**: `mobile/src/data/types/FengShuiData.ts`

```typescript
export interface DayFengShuiData {
  d: string;           // Solar date "2025-01-01"
  ld: number;          // Lunar day
  lm: number;          // Lunar month
  ly: number;          // Lunar year
  lp: number;          // Leap month flag (0 or 1)
  dgz: string;         // Day Can Chi "Giáp Tý"
  mgz: string;         // Month Can Chi
  ygz: string;         // Year Can Chi
  nh: string;          // Ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ)
  s28: string;         // 28 Sao name
  s28g: number;        // Star good (1) or bad (0)
  t12: string;         // 12 Trực name
  t12g: number;        // Trực good (1) or bad (0)
  tk?: string;         // Tiết khí (optional)
  hd: string[];        // Hoàng đạo hours ["Tý", "Sửu", ...]
  dir: Direction[];    // Directions
  ga: string[];        // Good activities
  ba: string[];        // Bad activities
  gs: string[];        // Good stars (Cát tinh)
  bs: string[];        // Bad stars (Hung tinh)
  sc?: string;         // Special comment
}

export interface Direction {
  name: string;        // "Hỷ thần", "Tài thần", "Hắc thần"
  direction: string;   // "Đông Bắc", "Nam", "Tây", etc.
}
```

#### 1.2 Create Data Repository
**File**: `mobile/src/data/repositories/FengShuiRepository.ts`

**Responsibilities**:
- Load `fengshui_2025.json` from assets
- Parse JSON thành Map<string, DayFengShuiData>
- Provide methods: `getByDate()`, `getByMonth()`

**Implementation**:
```typescript
class FengShuiRepository {
  private static dataMap: Map<string, DayFengShuiData> | null = null;

  // Load data from bundled JSON
  static async loadData(): Promise<void> {
    const data = require('../../assets/data/fengshui_2025.json');
    this.dataMap = new Map();

    data.forEach((item: DayFengShuiData) => {
      this.dataMap!.set(item.d, item);
    });
  }

  // Get data for specific date
  static getByDate(date: Date): DayFengShuiData | null {
    const key = format(date, 'yyyy-MM-dd');
    return this.dataMap?.get(key) || null;
  }

  // Get all days in a month
  static getByMonth(year: number, month: number): DayFengShuiData[] {
    // Filter by year and month
  }
}
```

#### 1.3 Create Zustand Store
**File**: `mobile/src/stores/useFengShuiStore.ts`

```typescript
interface FengShuiStore {
  data: Map<string, DayFengShuiData> | null;
  isLoading: boolean;
  error: string | null;

  loadData: () => Promise<void>;
  getByDate: (date: Date) => DayFengShuiData | null;
}

export const useFengShuiStore = create<FengShuiStore>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      await FengShuiRepository.loadData();
      set({ data: FengShuiRepository.dataMap, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getByDate: (date) => {
    return FengShuiRepository.getByDate(date);
  },
}));
```

#### 1.4 Bundle Data File
**Steps**:
1. Create folder: `mobile/src/assets/data/`
2. Copy `scraper/data/mobile/fengshui_2025.json` → `mobile/src/assets/data/`
3. Verify metro bundler includes `.json` files (should work by default)

---

### Step 2: Day Score Calculator (1-2 hours)

#### 2.1 Score Algorithm
**File**: `mobile/src/core/fengshui/DayScore.ts`

**Formula**:
```
Base Score: 50

Positive Modifiers:
+ 28 Sao good (s28g=1): +20
+ 12 Trực good (t12g=1): +15
+ Good stars count (gs.length): +2 per star
+ Good activities count (ga.length): +1 per activity
+ Hoàng đạo hours count (hd.length): +1 per hour

Negative Modifiers:
- 28 Sao bad (s28g=0): -15
- 12 Trực bad (t12g=0): -10
- Bad stars count (bs.length): -2 per star
- Bad activities count (ba.length): -1 per activity

Final: clamp(score, 0, 100)
```

**Rating Ranges**:
| Score | Rating | Color | Vietnamese |
|-------|--------|-------|------------|
| 80-100 | Excellent | Green (#4CAF50) | Rất tốt |
| 65-79 | Good | Light Green (#8BC34A) | Tốt |
| 50-64 | Normal | Yellow (#FFC107) | Bình thường |
| 35-49 | Bad | Orange (#FF9800) | Xấu |
| 0-34 | Very Bad | Red (#F44336) | Rất xấu |

**Implementation**:
```typescript
export class DayScore {
  static calculate(data: DayFengShuiData): number {
    let score = 50;

    // 28 Sao
    score += data.s28g === 1 ? 20 : -15;

    // 12 Trực
    score += data.t12g === 1 ? 15 : -10;

    // Stars
    score += data.gs.length * 2;
    score -= data.bs.length * 2;

    // Activities
    score += data.ga.length * 1;
    score -= data.ba.length * 1;

    // Hoàng đạo hours
    score += data.hd.length * 1;

    return Math.max(0, Math.min(100, score));
  }

  static getRating(score: number): ScoreRating {
    if (score >= 80) return { level: 'excellent', text: 'Rất tốt', color: '#4CAF50' };
    if (score >= 65) return { level: 'good', text: 'Tốt', color: '#8BC34A' };
    if (score >= 50) return { level: 'normal', text: 'Bình thường', color: '#FFC107' };
    if (score >= 35) return { level: 'bad', text: 'Xấu', color: '#FF9800' };
    return { level: 'very-bad', text: 'Rất xấu', color: '#F44336' };
  }
}
```

---

### Step 3: Day Detail Screen UI (4-6 hours)

#### 3.1 Main Screen
**File**: `mobile/src/screens/DayDetailScreen/index.tsx`

**Structure**:
```typescript
export function DayDetailScreen({ route }: DayDetailScreenProps) {
  const { date: dateString } = route.params || {};
  const date = dateString ? new Date(dateString) : new Date();

  const fengShuiData = useFengShuiStore(state => state.getByDate(date));
  const lunarInfo = useLunarDate(date);

  const score = useMemo(() =>
    fengShuiData ? DayScore.calculate(fengShuiData) : 50
  , [fengShuiData]);

  const rating = useMemo(() => DayScore.getRating(score), [score]);

  if (!fengShuiData) {
    return <NoDataView date={date} />;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <DayDetailHeader date={date} lunarInfo={lunarInfo} canChi={fengShuiData.dgz} />
        <DayScoreCard score={score} rating={rating} />
        <BasicInfoCard data={fengShuiData} />
        <HoangDaoCard hours={fengShuiData.hd} />
        <ActivitiesCard good={fengShuiData.ga} bad={fengShuiData.ba} />
        <DirectionsCard directions={fengShuiData.dir} />
        <StarsCard good={fengShuiData.gs} bad={fengShuiData.bs} />
      </ScrollView>
    </SafeAreaView>
  );
}
```

#### 3.2 Component Files

**Header Component**
**File**: `mobile/src/screens/DayDetailScreen/DayDetailHeader.tsx`
- Gradient background (blue)
- Solar date: "Thứ 2, 15/12/2025"
- Lunar date: "25/11/Ất Tỵ 🐍"
- Can Chi ngày: "Mậu Tý"

**Day Score Card**
**File**: `mobile/src/screens/DayDetailScreen/DayScoreCard.tsx`
- Circular progress bar (0-100%)
- Score number (large, center)
- Rating text ("Rất tốt", "Tốt", etc.)
- Color-coded based on score range
- Stars indicator (5 stars, filled based on score)

**Basic Info Card**
**File**: `mobile/src/screens/DayDetailScreen/BasicInfoCard.tsx`
- 28 Sao: name + good/bad indicator
- 12 Trực: name + good/bad indicator
- Tiết khí: name (if exists)
- Ngũ hành: element name

**Hoàng Đạo Card**
**File**: `mobile/src/screens/DayDetailScreen/HoangDaoCard.tsx`
- Expandable/collapsible list
- Each hour: Chi name + time range
- Example: "Tý (23:00 - 01:00)"
- Highlight current hour if it's hoàng đạo

**Activities Card**
**File**: `mobile/src/screens/DayDetailScreen/ActivitiesCard.tsx`
- Two sections or tabs: Good vs Bad
- List of activities with checkmarks/x marks
- Color coded (green for good, red for bad)

**Directions Card**
**File**: `mobile/src/screens/DayDetailScreen/DirectionsCard.tsx`
- Display 3 directions: Hỷ, Tài, Hắc
- Each with direction name (Đông Bắc, Nam, etc.)
- Color indicator (green for Hỷ/Tài, red for Hắc)
- Optional: compass icon

**Stars Card**
**File**: `mobile/src/screens/DayDetailScreen/StarsCard.tsx`
- Good stars (Cát tinh): list with star icons
- Bad stars (Hung tinh): list with warning icons

#### 3.3 Shared Components

**Score Circle**
**File**: `mobile/src/components/fengshui/ScoreCircle.tsx`
- Reusable circular progress indicator
- Props: score (0-100), color, size

**Info Row**
**File**: `mobile/src/components/fengshui/InfoRow.tsx`
- Label + Value row layout
- Props: label, value, icon (optional)

**Activity Tag**
**File**: `mobile/src/components/fengshui/ActivityTag.tsx`
- Chip/tag component for activities
- Props: text, isGood (boolean)

**Direction Badge**
**File**: `mobile/src/components/fengshui/DirectionBadge.tsx`
- Badge showing direction with color
- Props: name, direction, type (Hỷ/Tài/Hắc)

#### 3.4 Styles
**File**: `mobile/src/screens/DayDetailScreen/styles.ts`

```typescript
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.neutral[0],
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // ... more styles
});
```

---

### Step 4: Navigation Integration (1 hour)

#### 4.1 Update Calendar Navigation
**File**: `mobile/src/screens/CalendarScreen/index.tsx`

```typescript
const handleSelectDate = useCallback((date: Date) => {
  setSelectedDate(date);

  // Navigate to DayDetail
  navigation.navigate('DayDetail', {
    date: date.toISOString(),
  });
}, [navigation]);
```

#### 4.2 Add Back Button to DayDetail
Add header with back button in DayDetailScreen

---

### Step 5: App Initialization (30 min)

#### 5.1 Load Data on App Start
**File**: `mobile/src/app/App.tsx`

```typescript
function App(): React.JSX.Element {
  const loadFengShuiData = useFengShuiStore(state => state.loadData);

  useEffect(() => {
    // Load feng shui data when app starts
    loadFengShuiData();
  }, [loadFengShuiData]);

  // ... rest of App
}
```

---

## Files Summary

### New Files (17)

**Data Layer (3)**:
1. `mobile/src/data/types/FengShuiData.ts`
2. `mobile/src/data/repositories/FengShuiRepository.ts`
3. `mobile/src/stores/useFengShuiStore.ts`

**Core (1)**:
4. `mobile/src/core/fengshui/DayScore.ts`

**Day Detail Screen (9)**:
5. `mobile/src/screens/DayDetailScreen/index.tsx` (replace placeholder)
6. `mobile/src/screens/DayDetailScreen/styles.ts`
7. `mobile/src/screens/DayDetailScreen/DayDetailHeader.tsx`
8. `mobile/src/screens/DayDetailScreen/DayScoreCard.tsx`
9. `mobile/src/screens/DayDetailScreen/BasicInfoCard.tsx`
10. `mobile/src/screens/DayDetailScreen/HoangDaoCard.tsx`
11. `mobile/src/screens/DayDetailScreen/ActivitiesCard.tsx`
12. `mobile/src/screens/DayDetailScreen/DirectionsCard.tsx`
13. `mobile/src/screens/DayDetailScreen/StarsCard.tsx`

**Shared Components (4)**:
14. `mobile/src/components/fengshui/ScoreCircle.tsx`
15. `mobile/src/components/fengshui/InfoRow.tsx`
16. `mobile/src/components/fengshui/ActivityTag.tsx`
17. `mobile/src/components/fengshui/DirectionBadge.tsx`

### Modified Files (2)
1. `mobile/src/app/App.tsx`
2. `mobile/src/screens/CalendarScreen/index.tsx`

### Assets (1)
- Copy: `scraper/data/mobile/fengshui_2025.json` → `mobile/src/assets/data/fengshui_2025.json`

---

## Testing Plan

### Unit Tests
- [ ] DayScore calculation với sample data
- [ ] FengShuiRepository load & lookup

### Integration Tests
- [ ] Load 365 days successfully
- [ ] Navigate từ Calendar → Day Detail
- [ ] Display đúng thông tin cho từng ngày

### Manual Tests
- [ ] Tap vào ngày bất kỳ → xem detail
- [ ] Score calculation chính xác (verify 5-10 ngày)
- [ ] UI hiển thị đẹp, không crash
- [ ] Handle missing data gracefully
- [ ] Performance: smooth scrolling

---

## Success Criteria

✅ Phase 2 hoàn thành khi:
- [ ] 365 ngày data loaded vào app
- [ ] Day Detail Screen hiển thị đầy đủ:
  - [ ] Day score (0-100%)
  - [ ] 28 Sao + level
  - [ ] 12 Trực + good/bad
  - [ ] Hoàng đạo hours
  - [ ] Good/Bad activities
  - [ ] Directions (Hỷ, Tài, Hắc)
  - [ ] Good/Bad stars
- [ ] Navigation Calendar → Day Detail hoạt động
- [ ] UI đẹp, consistent với theme
- [ ] Không crash với missing/invalid data
- [ ] Performance tốt (< 1s load time)

---

## Timeline

| Step | Task | Hours | Status |
|------|------|-------|--------|
| 1 | Data Integration Layer | 2-3 | ⏳ Pending |
| 2 | Day Score Calculator | 1-2 | ⏳ Pending |
| 3 | Day Detail Screen UI | 4-6 | ⏳ Pending |
| 4 | Navigation Integration | 1 | ⏳ Pending |
| 5 | App Initialization | 0.5 | ⏳ Pending |
| | Testing & Polish | 2-3 | ⏳ Pending |
| **Total** | | **10-15 hours** | |

**Estimated**: 2-3 coding sessions

---

## Dependencies

### Already Installed ✅
- `zustand` (4.5.0) - State management
- `date-fns` (3.3.1) - Date formatting
- `react-native-vector-icons` (10.0.3) - Icons
- `react-native-linear-gradient` (2.8.3) - Gradient backgrounds

### No Additional Packages Needed

---

## Next Phases Preview

### Phase 3: Hour-by-Hour Analysis
- Hourly Can Chi calculation
- Hourly good/bad ratings
- Time-based recommendations

### Phase 4: Settings & Holidays
- Holiday list screen
- Settings screen
- User preferences
- Notifications (optional)

---

## Notes

- Data chỉ có cho năm 2025 (365 ngày)
- Cần handle gracefully khi user chọn ngày ngoài 2025
- Consider caching strategy cho performance
- UI/UX nên theo chuẩn Vietnamese feng shui apps
- Icons: use MaterialCommunityIcons (đã có)
- Colors: use theme colors (đã định nghĩa)

---

**End of Phase 2 Plan**
