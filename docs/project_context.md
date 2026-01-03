---
project_name: 'lich-viet-van-su-an-lanh'
user_name: 'Bằng Ca'
date: '2024-12-17'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'critical_rules']
---

# Project Context for AI Agents

_Critical rules and patterns for implementing code in this project. Read docs/architecture.md for full architectural decisions._

---

## Technology Stack & Versions

### Mobile (React Native)
| Package | Version | Notes |
|---------|---------|-------|
| react-native | 0.77 | New Architecture enabled |
| react-native-paper | 5.14.5 | MD3 theming |
| react-native-reanimated | 3.18.1 | Worklets required |
| react-native-gesture-handler | 2.29.1 | Native gestures |
| zustand | latest | State management |
| lunar-javascript | latest | Offline calculations |

### Scraper (Python)
| Package | Version |
|---------|---------|
| python | 3.11+ |
| beautifulsoup4 | latest |
| pydantic | latest |

---

## Critical Implementation Rules

### TypeScript Rules

- **STRICT MODE REQUIRED** - No `any` types. Ever.
- **Interfaces over types** for object shapes
- **Explicit return types** for public functions
- **Named exports only** - Never use `export default`

```typescript
// ✅ Correct
export const DayCell = memo(({ date }: DayCellProps) => { ... });
export function calculateScore(date: Date): number { ... }

// ❌ Wrong
export default function DayCell() { ... }
const processData = (data: any) => { ... }
```

### React Native Rules

**Animation - ALWAYS use Reanimated worklets:**
```typescript
// ✅ Correct - runs on UI thread (60 FPS)
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return { transform: [{ scale: withSpring(scale.value) }] };
});

// ❌ Wrong - runs on JS thread (janky)
const animatedStyle = { transform: [{ scale }] };
```

**Memoization - REQUIRED for repeated components:**
```typescript
// ✅ DayCell rendered 42+ times per month - MUST memo
export const DayCell = memo(({ date, score, onPress }: DayCellProps) => { ... });
```

**Accessibility - REQUIRED on all interactive elements:**
```typescript
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`${date.toLocaleDateString()}, score ${score}`}
  onPress={onPress}
>
```

### Vietnamese Text Rules

- **UTF-8 REQUIRED** - All files, all content
- **Preserve diacritics** - "Giáp Tý" not "Giap Ty"
- **ISO dates for storage** - "2025-01-01"
- **Vietnamese locale for display** - "01/01/2025"

```typescript
// ✅ Correct storage
const canChi = "Giáp Tý";
const dateStr = "2025-01-01";

// ❌ Wrong
const canChi = "Giap Ty"; // Lost diacritics
```

### Data Rules

- **Offline-first** - All core features work without network
- **Pre-compute scores** at data import, not on render
- **Bundled JSON** for feng shui data (~20-50KB/year gzipped)
- **lunar-javascript** for real-time calculations

### File Organization

**Naming:**
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `DayCell.tsx` |
| Screens | PascalCase + Screen | `CalendarScreen.tsx` |
| Hooks | use + camelCase | `useLunarDate.ts` |
| Stores | camelCase + Store | `calendarStore.ts` |
| Tests | *.test.tsx | `DayCell.test.tsx` |

**Imports - Use barrel exports:**
```typescript
// ✅ Correct
import { DayCell, CalendarGrid } from '@/components/calendar';

// ❌ Wrong
import DayCell from '../components/calendar/DayCell';
```

**Tests - Co-locate with source:**
```
components/calendar/
├── DayCell.tsx
├── DayCell.test.tsx  ← Test here, not in __tests__
└── index.ts
```

### Testing Rules

- **Co-located tests** - Same directory as source
- **React Native Testing Library** for components
- **Jest** for unit tests
- **Test accessibility** - verify accessibilityRole, accessibilityLabel

### Anti-Patterns to AVOID

```typescript
// ❌ NEVER use any
function processData(data: any) { ... }

// ❌ NEVER use Animated.timing (use Reanimated)
Animated.timing(value, { toValue: 1 }).start();

// ❌ NEVER skip memo for repeated components
{dates.map(d => <DayCell date={d} />)}  // 42+ unmemoized renders

// ❌ NEVER use export default
export default function Component() { ... }

// ❌ NEVER strip Vietnamese diacritics
const canChi = "Giap Ty";  // Should be "Giáp Tý"

// ❌ NEVER make network calls for core calendar features
await fetch('/api/lunar-data');  // App is offline-first
```

---

## Reference Documents

- **Full Architecture:** `docs/architecture.md`
- **PRD:** `docs/prd.md`
- **UX Design:** `docs/ux-design-specification.md`
- **Project Guide:** `CLAUDE.md`
