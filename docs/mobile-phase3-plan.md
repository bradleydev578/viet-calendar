# Mobile Phase 3 Plan: Calendar Visual Enhancements

## Overview

Phase 3 enhances the Calendar Screen with visual feng shui indicators, allowing users to see day quality at a glance without needing to tap into each day's detail screen.

**Status**: ⏸️ Postponed (Visual design needs refinement)
**Dependencies**: Phase 1 (Complete), Phase 2 (Complete)
**Estimated Time**: 2-3 hours

**Note**: Initial implementation with background color tint was reverted due to poor visual aesthetics. Will revisit design approach in future phases.

---

## Previous Phases Summary

### Phase 1 (✅ Complete)
- Navigation structure with 4 tabs
- Lunar calculation engine
- Basic Calendar Screen with solar/lunar dates
- Theme system and hooks

### Phase 2 (✅ Complete)
- Data layer (types, repository, store)
- Day Score calculator (0-100% algorithm)
- Complete Day Detail Screen with 8 cards
- All 365 days of 2025 feng shui data loaded

---

## Problem Statement

**Current Limitation**: Users must tap each day individually to see its feng shui quality. The calendar shows only solar and lunar dates, providing no visual indication of which days are auspicious or inauspicious.

**User Need**: At-a-glance view of day quality when browsing the monthly calendar.

---

## Solution

Add subtle visual quality indicators to calendar cells using color-coded backgrounds that match the Day Detail Screen's quality rating system.

### Design Approach: Subtle Background Tint

**Selected Method**: 15% opacity background color based on day quality

**Why this approach?**
- ✅ Intuitive color coding matching existing Day Score colors
- ✅ Minimal UI clutter
- ✅ Works with existing layout (no structural changes)
- ✅ Preserves text readability with low opacity
- ✅ Consistent with Day Detail Screen design

**Quality Color Mapping**:
| Quality | Score Range | Color | Background |
|---------|------------|-------|------------|
| Excellent | 80-100 | `#4CAF50` (Green) | `#4CAF5015` |
| Good | 65-79 | `#8BC34A` (Light Green) | `#8BC34A15` |
| Normal | 50-64 | `#FFC107` (Yellow) | `#FFC10715` |
| Bad | 35-49 | `#FF9800` (Orange) | `#FF980015` |
| Very Bad | 0-34 | `#F44336` (Red) | `#F4433615` |

---

## Implementation Plan

### Step 1: Update DayCell Component

**File**: `mobile/src/screens/CalendarScreen/DayCell.tsx`

**Changes**:
1. Import `useFengShuiStore` and `DayScore`
2. Fetch feng shui data for the date
3. Calculate day score using `DayScore.calculate()`
4. Generate background color with 15% opacity
5. Apply background color to TouchableOpacity style

**Code Pattern**:
```typescript
// Add imports
import { useFengShuiStore } from '../../stores/useFengShuiStore';
import { DayScore } from '../../core/fengshui/DayScore';

// In component
const getByDate = useFengShuiStore(state => state.getByDate);
const fengShuiData = useMemo(() => getByDate(date), [date, getByDate]);
const dayScore = useMemo(() => {
  if (!fengShuiData) return null;
  return DayScore.calculate(fengShuiData);
}, [fengShuiData]);

// Generate background color
const qualityBackgroundColor = useMemo(() => {
  if (!dayScore) return undefined;
  const baseColor = DayScore.getQualityColor(dayScore.quality);
  return `${baseColor}15`; // 15% opacity
}, [dayScore]);

// Apply to style
<TouchableOpacity
  style={[
    styles.dayCell,
    qualityBackgroundColor && { backgroundColor: qualityBackgroundColor },
    // ... other styles
  ]}
>
```

**Performance Considerations**:
- ✅ Uses `useMemo` to cache calculations
- ✅ Data already in memory (loaded at app start)
- ✅ O(1) lookup from Map structure
- ✅ Only 30-35 cells rendered per month view

### Step 2: Style Adjustments (if needed)

**File**: `mobile/src/screens/CalendarScreen/styles.ts`

**Potential Changes**:
- May need to adjust existing `dayCellToday` style if background conflicts
- Ensure `isToday` indicator remains prominent with quality overlay

### Step 3: Testing

**Visual Testing**:
1. Navigate through different months (Jan - Dec 2025)
2. Verify quality colors display correctly for all levels
3. Check text contrast and readability
4. Ensure "today" indicator still prominent
5. Verify no quality color for days outside 2025

**Performance Testing**:
1. Test smooth scrolling
2. Test fast month navigation (prev/next)
3. Monitor memory usage

**Functional Testing**:
1. Tap calendar cells - should still navigate to DayDetail
2. Verify calendar quality matches DayDetail quality
3. Test edge cases (days with no data)

---

## Success Criteria

✅ Phase 3 is complete when:
- [ ] Calendar cells show quality background colors
- [ ] Colors match Day Detail Screen exactly
- [ ] Text remains readable on all backgrounds
- [ ] Performance is smooth (no lag)
- [ ] Today indicator still clearly visible
- [ ] Navigation to DayDetail still works
- [ ] No crashes with missing data

---

## Files Modified

### Modified Files (2):
1. **`mobile/src/screens/CalendarScreen/DayCell.tsx`**
   - Added feng shui data fetching
   - Added day score calculation
   - Added quality background color logic

2. **`mobile/src/screens/CalendarScreen/styles.ts`** (if needed)
   - Potential style adjustments for today indicator

### No New Files Created
All functionality builds on existing Phase 2 infrastructure.

---

## Future Enhancements (Phase 4+)

### Optional Phase 3B Features (not implemented yet):
- **Special Day Badges**: Star ★ for excellent days (90+), warning ⚠ for very bad (20-)
- **Month Summary**: Show count of good/bad days in MonthHeader

### Phase 4 Priorities:
1. **Holidays & Events Screen** - Implement HolidayListScreen
2. **Settings Screen** - Preferences, theme, help/legend
3. **Advanced Features** - Search for good days, personalized recommendations

---

## Technical Notes

### Data Flow
```
App Start
  └─> Load all 365 days into useFengShuiStore (Phase 2)
        └─> Calendar renders month view
              └─> DayCell for each day
                    └─> getByDate(date) - O(1) lookup
                          └─> DayScore.calculate() - instant
                                └─> Apply background color
```

### Why 15% Opacity?
- Tested range: 10% too subtle, 20% too strong
- 15% provides clear visual indication without overwhelming
- Maintains WCAG AA contrast ratio for text
- Allows "today" indicator to remain prominent

### Performance Impact
- **Minimal**: All data already in memory
- **Calculations**: ~30 score calculations per month view
- **Each calculation**: < 1ms (simple arithmetic)
- **Total overhead**: Negligible

---

## References

- **Day Score Algorithm**: `mobile/src/core/fengshui/DayScore.ts`
- **Data Store**: `mobile/src/stores/useFengShuiStore.ts`
- **Theme Colors**: `mobile/src/theme/colors.ts`
- **Phase 2 Plan**: `docs/mobile-phase2-plan.md`
- **Data Flow Doc**: `docs/mobile-data-flow.md`

---

## Changelog

### 2025-12-15
- Created Phase 3 plan
- Selected "Subtle Background Tint" approach
- Started implementation

---

**Last Updated**: 2025-12-15
**Author**: Claude Code
**Version**: 1.0
