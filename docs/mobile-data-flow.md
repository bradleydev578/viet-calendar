# Mobile App - Data Flow Documentation

**Tài liệu kỹ thuật: Luồng lấy và quản lý dữ liệu phong thủy**

Version: 1.0
Date: 2025-12-15
Author: Claude Code

---

## Tổng quan

Mobile app sử dụng kiến trúc 4 tầng để quản lý dữ liệu phong thủy:

```
┌─────────────────────────────────────────────┐
│           UI Components (Screens)           │
│  DayDetailScreen, CalendarScreen, etc.      │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│         State Management (Zustand)          │
│            useFengShuiStore                 │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│        Data Access (Repository)             │
│         FengShuiRepository                  │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          Data Source (JSON File)            │
│   assets/data/fengshui_2025.json            │
└─────────────────────────────────────────────┘
```

---

## 1. Data Source Layer

### 1.1 File cấu trúc

**Location**: `mobile/src/assets/data/fengshui_2025.json`

**Size**: 305 KB
**Records**: 365 ngày (01/01/2025 - 31/12/2025)

**Format**:
```json
{
  "version": "1.0",
  "year": 2025,
  "generated_at": "2025-12-15T10:27:49.385266",
  "total_days": 365,
  "days": [
    {
      "d": "2025-01-01",
      "ld": 2,
      "lm": 12,
      "ly": 2024,
      "lp": 0,
      "dgz": "Canh Ngọ",
      "mgz": "Đinh Sửu",
      "ygz": "Giáp Thìn",
      "nh": "Kim",
      "s28": "Sâm",
      "s28g": 0,
      "t12": "Khai",
      "t12g": 1,
      "tk": "Đông chí",
      "hd": ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
      "dir": [
        {"n": "Hỷ thần", "d": "Tây Bắc", "r": 5},
        {"n": "Tài thần", "d": "Tây Nam", "r": 5},
        {"n": "Hắc thần", "d": "Nam", "r": 1}
      ],
      "ga": ["Cưới hỏi", "Khai trương"],
      "ba": ["Động thổ", "An táng"],
      "gs": ["Thiên đức", "Nguyệt Đức"],
      "bs": ["Hoang vu", "Nguyệt Hỏa"],
      "sc": null
    }
  ]
}
```

### 1.2 Data Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `d` | string | Solar date (ISO) | "2025-01-01" |
| `ld` | number | Lunar day | 2 |
| `lm` | number | Lunar month | 12 |
| `ly` | number | Lunar year | 2024 |
| `lp` | number | Leap month flag (0/1) | 0 |
| `dgz` | string | Day Can Chi | "Canh Ngọ" |
| `mgz` | string | Month Can Chi | "Đinh Sửu" |
| `ygz` | string | Year Can Chi | "Giáp Thìn" |
| `nh` | string | Ngũ hành (Five Elements) | "Kim" |
| `s28` | string | 28 Sao name | "Sâm" |
| `s28g` | number | Star quality (0=bad, 1=good) | 0 |
| `t12` | string | 12 Trực name | "Khai" |
| `t12g` | number | Trực quality (0=bad, 1=good) | 1 |
| `tk` | string? | Tiết khí (Solar term) | "Đông chí" |
| `hd` | string[] | Hoàng đạo hours | ["Tý", "Sửu"] |
| `dir` | Direction[] | Feng shui directions | [...] |
| `ga` | string[] | Good activities | [...] |
| `ba` | string[] | Bad activities | [...] |
| `gs` | string[] | Good stars | [...] |
| `bs` | string[] | Bad stars | [...] |
| `sc` | string? | Special comment | null |

### 1.3 Direction Object

```typescript
interface Direction {
  n: string;   // Name: "Hỷ thần", "Tài thần", "Hắc thần"
  d: string;   // Direction: "Đông Bắc", "Tây Nam", etc.
  r?: number;  // Rating (optional): 1-5
}
```

---

## 2. Repository Layer

### 2.1 File

**Location**: `mobile/src/data/repositories/FengShuiRepository.ts`

### 2.2 Responsibilities

- Load JSON data from assets
- Parse and validate data structure
- Store in memory as Map for O(1) lookup
- Provide query methods

### 2.3 Implementation

```typescript
export class FengShuiRepository {
  private static dataMap: Map<string, DayFengShuiData> | null = null;
  private static isLoading = false;
  private static loadError: Error | null = null;

  /**
   * Load data from JSON file into Map
   * Runs once per app lifecycle
   */
  static async loadData(): Promise<Map<string, DayFengShuiData>> {
    // Return cached if already loaded
    if (this.dataMap) {
      return this.dataMap;
    }

    // Prevent concurrent loading
    if (this.isLoading) {
      // Wait for ongoing load...
    }

    this.isLoading = true;

    try {
      // Load from assets
      const dataSet = require('../../assets/data/fengshui_2025.json');

      // Create Map with date string as key
      const map = new Map<string, DayFengShuiData>();
      for (const dayData of dataSet.days) {
        map.set(dayData.d, dayData); // Key: "2025-01-01"
      }

      this.dataMap = map;
      console.log(`Loaded ${map.size} days`);
      return map;
    } catch (error) {
      this.loadError = error as Error;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get data for specific date
   * O(1) lookup using Map
   */
  static getByDate(date: Date): DayFengShuiData | null {
    if (!this.dataMap) {
      console.warn('Data not loaded');
      return null;
    }

    const dateKey = format(date, 'yyyy-MM-dd'); // "2025-01-01"
    return this.dataMap.get(dateKey) || null;
  }

  /**
   * Get data for date range
   */
  static getByDateRange(startDate: Date, endDate: Date): DayFengShuiData[] {
    const results: DayFengShuiData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const data = this.getByDate(currentDate);
      if (data) results.push(data);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return results;
  }

  /**
   * Get data for entire month
   */
  static getByMonth(year: number, month: number): DayFengShuiData[] {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return this.getByDateRange(startDate, endDate);
  }
}
```

### 2.4 Performance

- **Load time**: ~50-100ms (one-time)
- **Lookup time**: O(1) - instant
- **Memory usage**: ~500KB (Map overhead + data)

---

## 3. State Management Layer

### 3.1 File

**Location**: `mobile/src/stores/useFengShuiStore.ts`

### 3.2 Technology

**Zustand** - Lightweight state management
- No boilerplate
- React hooks API
- Minimal re-renders

### 3.3 Implementation

```typescript
interface FengShuiStore {
  // State
  data: Map<string, DayFengShuiData> | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  getByDate: (date: Date) => DayFengShuiData | null;
  getByMonth: (year: number, month: number) => DayFengShuiData[];
  clearError: () => void;
}

export const useFengShuiStore = create<FengShuiStore>((set, get) => ({
  // Initial state
  data: null,
  isLoading: false,
  error: null,

  // Load data from repository
  loadData: async () => {
    if (get().data) return; // Already loaded

    set({ isLoading: true, error: null });

    try {
      const data = await FengShuiRepository.loadData();
      set({ data, isLoading: false });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  },

  // Proxy to repository methods
  getByDate: (date: Date) => {
    return FengShuiRepository.getByDate(date);
  },

  getByMonth: (year: number, month: number) => {
    return FengShuiRepository.getByMonth(year, month);
  },

  clearError: () => set({ error: null }),
}));
```

### 3.4 Store Design

**Why Zustand over Redux?**
- ✅ Simpler API (no actions/reducers)
- ✅ Less boilerplate (1 file vs 3+)
- ✅ Better performance (selective subscription)
- ✅ Smaller bundle size (~1KB vs ~10KB)

**Why store just wraps Repository?**
- Store manages **state** (loading, error)
- Repository manages **data** (cache, lookup)
- Clean separation of concerns

---

## 4. UI Component Layer

### 4.1 App Initialization

**File**: `mobile/src/app/App.tsx`

```typescript
function App(): React.JSX.Element {
  const loadFengShuiData = useFengShuiStore(state => state.loadData);

  useEffect(() => {
    // Load data on app start
    loadFengShuiData().catch(error => {
      console.error('Failed to load feng shui data:', error);
    });
  }, [loadFengShuiData]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
```

**Timing**: Data loads asynchronously during app startup
- Does NOT block initial render
- Screens show loading state until data ready

### 4.2 Using Data in Screens

**Example**: `DayDetailScreen`

```typescript
export function DayDetailScreen({ route }: Props) {
  // Get date from navigation params
  const dateString = route.params?.date;
  const date = dateString ? new Date(dateString) : new Date();

  // Get data from store
  const getByDate = useFengShuiStore(state => state.getByDate);
  const isLoading = useFengShuiStore(state => state.isLoading);
  const fengShuiData = getByDate(date);

  // Calculate derived data
  const score = useMemo(() => {
    if (!fengShuiData) return null;
    return DayScore.calculate(fengShuiData);
  }, [fengShuiData]);

  // Handle states
  if (isLoading) {
    return <LoadingView />;
  }

  if (!fengShuiData) {
    return <EmptyView message="Không có dữ liệu" />;
  }

  return (
    <ScrollView>
      <DayDetailHeader data={fengShuiData} />
      <DayScoreCard score={score} />
      {/* ... other cards */}
    </ScrollView>
  );
}
```

### 4.3 Component Props

Components receive **processed data**, not raw JSON:

```typescript
// ✅ Good - Type-safe props
interface DayDetailHeaderProps {
  date: Date;
  data: DayFengShuiData;  // Structured object
}

// ❌ Bad - Passing raw data
interface BadProps {
  rawData: any;  // No type safety
}
```

---

## 5. Data Flow Sequence

### 5.1 App Startup Flow

```
┌─────────────────┐
│   App starts    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useEffect()    │
│  calls          │
│  loadData()     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store sets      │
│ isLoading=true  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Repository      │
│ require() JSON  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Parse & create  │
│ Map<string,Data>│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store updates:  │
│ - data = map    │
│ - isLoading=false│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Components      │
│ re-render with  │
│ data available  │
└─────────────────┘
```

**Timing**:
- App render: 0ms (immediate)
- Data load: 50-100ms (async)
- Total: ~100ms to full functionality

### 5.2 Data Lookup Flow

```
User taps day in Calendar
         │
         ▼
CalendarScreen calls:
navigation.navigate('DayDetail', {
  date: '2025-01-15'
})
         │
         ▼
DayDetailScreen receives route.params
         │
         ▼
const fengShuiData = getByDate(date)
         │
         ▼
Store → Repository.getByDate()
         │
         ▼
format(date) → "2025-01-15"
         │
         ▼
Map.get("2025-01-15") → DayFengShuiData
         │
         ▼
Return to component
         │
         ▼
Component renders data
```

**Performance**: <1ms (Map lookup is O(1))

---

## 6. Type Safety

### 6.1 Type Definitions

**File**: `mobile/src/data/types/FengShuiData.ts`

```typescript
export interface DayFengShuiData {
  d: string;
  ld: number;
  lm: number;
  ly: number;
  lp: number;
  dgz: string;
  mgz: string;
  ygz: string;
  nh: string;
  s28: string;
  s28g: number;
  t12: string;
  t12g: number;
  tk?: string;
  hd: string[];
  dir: Direction[];
  ga: string[];
  ba: string[];
  gs: string[];
  bs: string[];
  sc?: string;
}

export interface Direction {
  n: string;
  d: string;
  r?: number;
}

export interface FengShuiDataSet {
  year: number;
  days: DayFengShuiData[];
}

export enum DayQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  NORMAL = 'normal',
  BAD = 'bad',
  VERY_BAD = 'very_bad',
}

export interface DayScore {
  score: number;
  quality: DayQuality;
  breakdown: {
    base: number;
    star28: number;
    truc12: number;
    goodStars: number;
    badStars: number;
    goodActivities: number;
    badActivities: number;
    hoangDaoHours: number;
  };
}
```

### 6.2 Benefits

- ✅ Compile-time error checking
- ✅ IDE autocomplete
- ✅ Refactoring safety
- ✅ Self-documenting code

---

## 7. Error Handling

### 7.1 Load Errors

```typescript
// In Store
loadData: async () => {
  try {
    const data = await FengShuiRepository.loadData();
    set({ data, isLoading: false });
  } catch (error) {
    set({
      error: 'Failed to load data',
      isLoading: false
    });
    console.error('Load error:', error);
  }
}
```

### 7.2 Missing Data

```typescript
// In Component
const fengShuiData = getByDate(date);

if (!fengShuiData) {
  return (
    <EmptyView>
      <Text>Không có dữ liệu phong thủy cho ngày này</Text>
    </EmptyView>
  );
}
```

### 7.3 Future Dates

Currently no data validation for future dates beyond 2025.

**TODO**: Add year range check:
```typescript
if (date.getFullYear() > 2025) {
  return <EmptyView message="Chỉ có dữ liệu đến năm 2025" />;
}
```

---

## 8. Optimization Strategies

### 8.1 Current Optimizations

1. **Single Load**: Data loaded once, cached forever
2. **Map Structure**: O(1) lookup by date string
3. **Lazy Calculation**: Score calculated on-demand with useMemo
4. **Selective Subscription**: Components only re-render on state change

### 8.2 Performance Metrics

| Operation | Time | Method |
|-----------|------|--------|
| Initial load | 50-100ms | One-time |
| Date lookup | <1ms | O(1) Map.get() |
| Score calc | <1ms | Cached with useMemo |
| Screen render | ~16ms | Normal React render |

### 8.3 Memory Usage

```
JSON file size:       305 KB
Parsed Map size:      ~500 KB
Total app memory:     ~50 MB (typical RN app)
Data overhead:        ~1% of total memory
```

**Conclusion**: Negligible memory impact

---

## 9. Future Improvements

### 9.1 Multi-Year Support

**Problem**: Only 2025 data available

**Solution**:
```typescript
// Load multiple years
const data2025 = require('../../assets/data/fengshui_2025.json');
const data2026 = require('../../assets/data/fengshui_2026.json');

// Merge into single Map
for (const yearData of [data2025, data2026]) {
  for (const day of yearData.days) {
    map.set(day.d, day);
  }
}
```

### 9.2 Remote Data Updates

**Problem**: Need app update for new data

**Solution**: Fetch from API
```typescript
// Check for updates
const localVersion = '2025';
const remoteVersion = await fetchLatestVersion();

if (remoteVersion > localVersion) {
  const newData = await fetchData(remoteVersion);
  await saveToAsyncStorage(newData);
}
```

### 9.3 Data Compression

**Problem**: 305KB per year adds up

**Solution**: Use gzip or protobuf
```typescript
// Before
const data = require('./data.json'); // 305 KB

// After
const compressed = require('./data.json.gz'); // ~60 KB
const data = decompress(compressed);
```

**Savings**: ~80% size reduction

### 9.4 Incremental Loading

**Problem**: Load all 365 days at once

**Solution**: Load by month
```typescript
// Load current month immediately
const currentMonth = await loadMonth(2025, 12);

// Load other months in background
setTimeout(() => loadAllMonths(), 1000);
```

---

## 10. Testing

### 10.1 Unit Tests

**Test Repository**:
```typescript
describe('FengShuiRepository', () => {
  it('should load data successfully', async () => {
    const data = await FengShuiRepository.loadData();
    expect(data.size).toBe(365);
  });

  it('should get data by date', () => {
    const data = FengShuiRepository.getByDate(new Date('2025-01-01'));
    expect(data).toBeDefined();
    expect(data?.d).toBe('2025-01-01');
  });

  it('should return null for invalid date', () => {
    const data = FengShuiRepository.getByDate(new Date('2026-01-01'));
    expect(data).toBeNull();
  });
});
```

**Test Store**:
```typescript
describe('useFengShuiStore', () => {
  it('should load data and update state', async () => {
    const { result } = renderHook(() => useFengShuiStore());

    await act(async () => {
      await result.current.loadData();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

### 10.2 Integration Tests

**Test full flow**:
```typescript
it('should display day details', async () => {
  const { getByText } = render(
    <NavigationContainer>
      <DayDetailScreen route={{ params: { date: '2025-01-01' } }} />
    </NavigationContainer>
  );

  await waitFor(() => {
    expect(getByText(/Thứ Tư/)).toBeDefined();
    expect(getByText(/Rất tốt|Tốt|Bình thường/)).toBeDefined();
  });
});
```

---

## 11. Troubleshooting

### 11.1 Common Issues

**Issue**: "Data not loaded" warning

**Cause**: Component rendered before data loaded

**Solution**: Check `isLoading` state
```typescript
if (isLoading) return <LoadingView />;
```

---

**Issue**: Wrong date shown

**Cause**: Date timezone mismatch

**Solution**: Use date-fns with consistent format
```typescript
const dateKey = format(date, 'yyyy-MM-dd'); // Always use this
```

---

**Issue**: Data not updating

**Cause**: Map is immutable reference

**Solution**: Create new Map
```typescript
// ❌ Bad - mutates existing
dataMap.set(key, value);

// ✅ Good - creates new
set({ data: new Map(dataMap).set(key, value) });
```

---

## 12. API Reference

### FengShuiRepository

```typescript
class FengShuiRepository {
  static async loadData(): Promise<Map<string, DayFengShuiData>>
  static getByDate(date: Date): DayFengShuiData | null
  static getByDateRange(start: Date, end: Date): DayFengShuiData[]
  static getByMonth(year: number, month: number): DayFengShuiData[]
  static isDataLoaded(): boolean
  static getDataSize(): number
  static clearCache(): void
}
```

### useFengShuiStore

```typescript
interface FengShuiStore {
  data: Map<string, DayFengShuiData> | null
  isLoading: boolean
  error: string | null

  loadData(): Promise<void>
  getByDate(date: Date): DayFengShuiData | null
  getByMonth(year: number, month: number): DayFengShuiData[]
  clearError(): void
}
```

---

## Appendix: File Structure

```
mobile/src/
├── app/
│   └── App.tsx                    # App initialization, loads data
├── data/
│   ├── types/
│   │   └── FengShuiData.ts       # TypeScript interfaces
│   └── repositories/
│       └── FengShuiRepository.ts # Data access layer
├── stores/
│   └── useFengShuiStore.ts       # Zustand state management
├── screens/
│   └── DayDetailScreen/
│       └── index.tsx              # Uses feng shui data
├── core/
│   └── fengshui/
│       └── DayScore.ts            # Score calculation
└── assets/
    └── data/
        └── fengshui_2025.json    # Source data (305 KB)
```

---

**End of Documentation**
