# Fix: Touch Coordinate Offset on Pixel Tablet (Android 15)

**Date**: 2026-03-01
**Devices affected**: Pixel Tablet 10" (API 35), and potentially other Android 15 tablets
**Devices NOT affected**: Pixel 9 phone (API 36), other phones

## Symptoms

- Click tab "La Ban" -> mo chi tiet ngay (element phia tren) thay vi chuyen tab
- Click tab "Ngay le", "Cai dat" -> khong phan hoi
- Click ngay tren lich -> hien thi sai ngay (lech 1 hang)
- Mot so ngay click khong duoc (touch roi vao vung trong)
- Tren dien thoai (Pixel 9) hoat dong binh thuong

## Root Cause

Android 15 (API 35) enforces **Edge-to-Edge rendering** (`EDGE_TO_EDGE_ENFORCED`) - apps must draw behind all system bars.

Pixel Tablet has a **captionBar** (72px / 36dp) at the top of the screen for desktop/freeform windowing mode. This system bar does NOT exist on phones.

The issue chain:
1. Edge-to-edge forces the React Native root view to fill the entire window, including behind the captionBar
2. `react-native-safe-area-context` correctly adds JS-side padding to push visual content below the captionBar
3. But Android's **native touch coordinate system** still uses raw window coordinates (y=0 starts at absolute top)
4. This creates a **mismatch**: elements appear shifted down by ~36dp, but touches register at raw (unshifted) positions
5. Result: every touch is offset by ~36dp upward from where the user taps

## Solution

Added `windowOptOutEdgeToEdgeEnforcement` to the app theme:

**File**: `mobile/android/app/src/main/res/values/styles.xml`

```xml
<style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    <item name="android:windowOptOutEdgeToEdgeEnforcement">true</item>
</style>
```

This tells Android 15 to NOT enforce edge-to-edge rendering, so the app behaves like pre-Android 15 where touch coordinates align with visual layout.

## Important Notes

- This is a **temporary workaround**. Google may remove this flag in future Android versions (already non-functional on Android 16/API 36 for some cases)
- The proper long-term fix is to upgrade to **React Native 0.77+** which has native edge-to-edge support, and use `react-native-edge-to-edge` package
- The fix requires a **full native rebuild** (not just JS hot reload) since it's an Android resource change
- This change does NOT affect phones (they don't have captionBar)

## Other Changes Made During Investigation

These changes were made during debugging and remain in the codebase:

1. **`mobile/index.js`**: `enableScreens(false)` for Android tablets - prevents `react-native-screens` native screen fragments from blocking touch dispatch
2. **`mobile/src/app/navigation/TabNavigator.tsx`**: Custom tab bar using `Pressable` instead of default - more reliable touch handling on tablets
3. **`mobile/src/screens/CalendarScreen/index.tsx`**: `GestureHandlerRootView` scoped to calendar grid only (not app root), `failOffsetY([-15, 15])` on Pan gesture
4. **`mobile/src/app/App.tsx`**: Removed `GestureHandlerRootView` from app root wrapper

## References

- [React Native Issue #50423 - Edge-to-Edge on Android 15](https://github.com/facebook/react-native/issues/50423)
- [RN Community Discussion #827 - Handling Android 15 edge-to-edge](https://github.com/react-native-community/discussions-and-proposals/discussions/827)
- [Android Docs - Display content edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge)
- [react-native-edge-to-edge](https://github.com/zoontek/react-native-edge-to-edge)
