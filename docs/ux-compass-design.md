# UX Design Specification: Tab La Bàn (Compass)

**Author:** Sally (UX Designer)
**Date:** 2026-01-02
**Version:** 1.0
**Status:** Draft

---

## 1. Overview

### User Story

Imagine a user named **Minh**, a 35-year-old businessman who believes in feng shui. Every morning before leaving home, he wants to quickly check which direction is auspicious today. He opens the app, taps the Compass tab, and within seconds sees a beautiful compass pointing North, with feng shui overlays showing him today's lucky directions highlighted in gold...

### Feature Summary

The Compass tab replaces the existing "Hôm Nay" (Today) tab, providing:
1. **Standard Compass** - Real-time compass using device magnetometer
2. **Feng Shui Compass** - Traditional Luo Pan inspired compass with auspicious/inauspicious direction indicators

---

## 2. Navigation & Tab Configuration

### Tab Position & Icon

| Property | Value |
|----------|-------|
| **Tab Name** | "La Bàn" |
| **Position** | 2nd tab (replaces "Hôm Nay") |
| **Icon** | `compass` (MaterialCommunityIcons) |
| **Active Color** | `colors.primary[600]` (#059669 - Emerald) |
| **Inactive Color** | `colors.neutral[500]` (#9E9E9E) |

### Updated Tab Order

```
[ Lịch ] [ La Bàn ] [ Ngày lễ ] [ Cài đặt ]
```

---

## 3. Layout Toggle Switch

At the top of the screen, a segmented control allows switching between compass modes:

```
┌─────────────────────────────────────┐
│  [ La Bàn Thường ]  [ Phong Thủy ]  │
└─────────────────────────────────────┘
```

### Toggle Design Specifications

| Property | Value |
|----------|-------|
| **Container Background** | `colors.neutral[100]` (#F5F5F5) |
| **Active Segment Background** | `colors.primary[600]` (#059669) |
| **Active Text Color** | White `#FFFFFF` |
| **Inactive Text Color** | `colors.neutral[600]` (#757575) |
| **Border Radius** | 20px |
| **Height** | 40px |
| **Font Size** | 14px |
| **Font Weight** | 600 (semibold) |
| **Padding Horizontal** | 16px per segment |
| **Animation Duration** | 200ms ease-out |

---

## 4. Layout 1: La Bàn Thường (Standard Compass)

### Purpose
Provide a functional digital compass for real-world navigation, styled to match the app's aesthetic.

### Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| **Background** | Light neutral | `colors.background.light` (#FAFAFA) |
| **Compass Ring Outer** | Emerald gradient | `#059669` → `#047857` |
| **Compass Ring Inner** | White | `#FFFFFF` |
| **Degree Markers** | Neutral 400 | `#BDBDBD` |
| **Degree Text** | Neutral 700 | `#616161` |
| **Center Circle** | Gradient emerald | `#059669` → `#064E3B` |

### Cardinal Directions Colors

| Direction | Vietnamese | Color | Hex |
|-----------|------------|-------|-----|
| North (N) | Bắc | Deep Red | `#DC2626` |
| South (S) | Nam | Emerald | `#059669` |
| East (E) | Đông | Sky Blue | `#0284C7` |
| West (W) | Tây | Amber | `#D97706` |

### Compass Needle

| Element | Color | Hex |
|---------|-------|-----|
| **North Pointer** | Red | `#DC2626` |
| **South Pointer** | White with shadow | `#FFFFFF` |
| **Needle Shadow** | Black 20% opacity | `rgba(0,0,0,0.2)` |

### Visual Layout

```
              360° / 0°
                  N
                 Bắc
           ┌───────────────┐
       W   │       △       │   E
      Tây  │       │       │  Đông
     270°  │       ●       │  90°
           │       │       │
           └───────────────┘
                  S
                 Nam
                180°
```

### Digital Readout Section

Below the compass, display current heading:

```
┌─────────────────────────────────────┐
│        Hướng: 45° - Đông Bắc        │
└─────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Background** | White with 8dp shadow |
| **Border Radius** | 12px |
| **Font Size (Degrees)** | 24px bold |
| **Font Size (Direction)** | 16px regular |
| **Text Color** | `colors.neutral[800]` (#424242) |
| **Padding** | 16px |
| **Margin Top** | 24px |

### Features

1. **Real-time rotation** - Compass rotates based on device magnetometer
2. **Smooth animation** - Spring physics with damping: 15, stiffness: 100
3. **Haptic feedback** - Light vibration when passing N/S/E/W (every 90°)
4. **Lock button** (optional) - Freeze compass direction for reference

---

## 5. Layout 2: La Bàn Phong Thủy (Feng Shui Compass)

### Purpose
Display traditional Vietnamese feng shui compass (inspired by Chinese Luo Pan 羅盤) with today's auspicious direction indicators.

### Ngũ Hành (Five Elements) Color System

| Direction | Vietnamese | Ngũ Hành | Element | Primary Color | Hex |
|-----------|------------|----------|---------|---------------|-----|
| North | Bắc | Thủy | Water | Deep Blue | `#1E3A5F` |
| South | Nam | Hỏa | Fire | Red | `#DC2626` |
| East | Đông | Mộc | Wood | Emerald | `#059669` |
| West | Tây | Kim | Metal | Silver/Slate | `#94A3B8` |
| Northeast | Đông Bắc | Thổ | Earth | Brown | `#78350F` |
| Northwest | Tây Bắc | Kim | Metal | Gray | `#6B7280` |
| Southeast | Đông Nam | Mộc | Wood | Green | `#15803D` |
| Southwest | Tây Nam | Thổ | Earth | Ochre | `#92400E` |

### Concentric Rings Design

```
┌──────────────────────────────────────────┐
│            OUTER RING                     │
│   24 Hướng (24 Mountains/Sơn)            │
│   Background: colors.neutral[800]         │
│   Text: White, 10px                       │
├──────────────────────────────────────────┤
│            MIDDLE RING                    │
│   8 Hướng chính (8 Directions)           │
│   Background: Gradient per Ngũ Hành       │
│   Text: White, 12px bold                  │
├──────────────────────────────────────────┤
│            INNER RING                     │
│   Today's Auspicious Indicators           │
│   - Đại Cát: Gold glow                   │
│   - Hung: Red border                      │
├──────────────────────────────────────────┤
│            CENTER                         │
│   Yin-Yang Symbol (Thái Cực)             │
│   Black: #1E1E1E / White: #F5F5F5        │
└──────────────────────────────────────────┘
```

### Ring Specifications

| Ring | Inner Radius | Outer Radius | Background |
|------|--------------|--------------|------------|
| Outer (24 Sơn) | 130px | 150px | `colors.neutral[800]` |
| Middle (8 Hướng) | 80px | 130px | Per-direction gradient |
| Inner (Indicators) | 50px | 80px | White with indicators |
| Center (Yin-Yang) | 0px | 50px | Yin-Yang symbol |

### Feng Shui Status Indicators

| Status | Vietnamese | Meaning | Visual Treatment |
|--------|------------|---------|------------------|
| **Đại Cát** | Very Lucky | Best direction | Gold glow `#FFD700` + pulsing animation |
| **Cát** | Lucky | Good direction | Emerald border `#059669` (2px) |
| **Bình** | Neutral | Normal | No special styling |
| **Hung** | Unlucky | Bad direction | Orange border `#F97316` (2px) |
| **Đại Hung** | Very Unlucky | Worst direction | Red background tint `rgba(220,38,38,0.15)` |

### Gold Glow Animation (Đại Cát)

```
Animation: pulse
Duration: 2000ms
Easing: ease-in-out
Iterations: infinite

Keyframes:
  0%: box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7)
  50%: box-shadow: 0 0 20px 10px rgba(255, 215, 0, 0.3)
  100%: box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7)
```

---

## 6. Today's Feng Shui Info Panel

Below the Feng Shui compass, display an info card:

### Layout

```
┌─────────────────────────────────────┐
│ 📅 Hôm nay: 2 Tháng 1, 2026         │
│    Âm lịch: 13 tháng Chạp           │
├─────────────────────────────────────┤
│ ✨ Hướng Đại Cát: Đông Nam          │
│ 🌟 Hướng Cát: Bắc, Đông            │
│ ⚠️  Hướng Hung: Tây Nam             │
├─────────────────────────────────────┤
│ 💡 Gợi ý: Khi xuất hành, nên đi     │
│    về hướng Đông Nam để gặp may mắn │
└─────────────────────────────────────┘
```

### Card Styling

| Property | Value |
|----------|-------|
| **Background** | White `#FFFFFF` |
| **Border Radius** | 16px |
| **Shadow** | `0 4px 12px rgba(0,0,0,0.08)` |
| **Padding** | 16px |
| **Margin** | 16px horizontal, 24px top |

### Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| **Date Header** | 14px | 600 | `colors.neutral[600]` |
| **Lunar Date** | 12px | 400 | `colors.neutral[500]` |
| **Direction Labels** | 14px | 500 | `colors.neutral[700]` |
| **Direction Values** | 14px | 600 | Per-status color |
| **Suggestion Text** | 13px | 400 | `colors.neutral[600]` |

### Status Colors in Text

| Status | Text Color |
|--------|------------|
| Đại Cát | `#FFD700` (Gold) |
| Cát | `#059669` (Emerald) |
| Bình | `#9E9E9E` (Gray) |
| Hung | `#F97316` (Orange) |
| Đại Hung | `#DC2626` (Red) |

---

## 7. Screen Background

The Compass screen uses a **consistent theme** (not monthly rotating):

| Property | Value |
|----------|-------|
| **Background** | `#F8FAFC` (slate-50) |
| **Blur Circle 1** | `rgba(5, 150, 105, 0.08)` (subtle emerald) |
| **Blur Circle 2** | `rgba(234, 179, 8, 0.06)` (subtle gold) |

This creates a calm, mystical atmosphere appropriate for feng shui context.

---

## 8. Empty State (No Magnetometer)

When device doesn't have magnetometer sensor:

### Standard Compass Tab

```
┌─────────────────────────────────────┐
│                                     │
│              🧭                     │
│                                     │
│   Thiết bị không hỗ trợ la bàn     │
│                                     │
│   Vui lòng chuyển sang chế độ      │
│   "Phong Thủy" để xem hướng        │
│   tốt trong ngày                    │
│                                     │
│   [ Chuyển sang Phong Thủy ]       │
│                                     │
└─────────────────────────────────────┘
```

### Feng Shui Tab Behavior

Feng Shui compass works WITHOUT magnetometer - it displays static direction information based on today's feng shui data. Users can still see auspicious directions without real compass functionality.

---

## 9. Animations & Interactions

### Standard Compass

| Animation | Library | Config |
|-----------|---------|--------|
| Needle rotation | react-native-reanimated | `withSpring({ damping: 15, stiffness: 100 })` |
| Degree counter | react-native-reanimated | `withTiming({ duration: 100 })` |

### Feng Shui Compass

| Animation | Description | Duration |
|-----------|-------------|----------|
| Ring fade-in | Sequential ring appearance | 300ms per ring |
| Đại Cát glow | Pulsing gold glow | 2000ms infinite |
| Segment tap | Scale + highlight | 150ms |

### Segment Tap Interaction

When user taps a direction segment on Feng Shui compass:

1. Segment scales to 1.05x (150ms)
2. Bottom sheet slides up with direction details
3. Shows: Direction name, Ngũ Hành, Today's status, Suggestion

---

## 10. Accessibility

### VoiceOver / TalkBack Labels

| Element | Accessibility Label |
|---------|---------------------|
| Compass | "La bàn, hướng hiện tại: [X] độ, [Hướng]" |
| Toggle | "Chuyển đổi chế độ la bàn. Đang chọn: [Mode]" |
| Direction segment | "[Hướng], [Ngũ Hành], [Status]" |
| Info panel | "Thông tin phong thủy hôm nay" |

### Reduced Motion

When system "Reduce Motion" is enabled:
- Compass needle updates instantly (no spring)
- Đại Cát glow is static (no pulse)
- Ring fade-in is instant

---

## 11. Color Constants Summary

Add to `colors.ts`:

```typescript
compass: {
  // Cardinal directions
  north: '#DC2626',      // Red
  south: '#059669',      // Emerald
  east: '#0284C7',       // Sky Blue
  west: '#D97706',       // Amber

  // Ngũ Hành (Five Elements)
  thuy: '#1E3A5F',       // Water - Deep Blue
  hoa: '#DC2626',        // Fire - Red
  moc: '#059669',        // Wood - Emerald
  kim: '#94A3B8',        // Metal - Silver
  tho: '#78350F',        // Earth - Brown

  // Feng Shui status
  daiCat: '#FFD700',     // Very Lucky - Gold
  cat: '#059669',        // Lucky - Emerald
  binh: '#9E9E9E',       // Neutral - Gray
  hung: '#F97316',       // Unlucky - Orange
  daiHung: '#DC2626',    // Very Unlucky - Red

  // Compass elements
  ringOuter: '#27272A',  // Dark outer ring
  ringInner: '#FFFFFF',  // White inner
  needle: '#DC2626',     // Red needle (North)
  needleShadow: '#FFFFFF', // White (South)
  center: '#059669',     // Emerald center
}
```

---

## 12. Dependencies

### Required Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| react-native-sensors | Magnetometer access | ^7.3.6 |
| react-native-reanimated | Animations | Existing |
| react-native-svg | Compass rendering | ^15.0.0 |

### Data Requirements

- Today's auspicious directions from existing feng shui data (FR45)
- Calculate Đại Cát/Cát/Hung status based on Can Chi and daily factors

---

## 13. Screen Flow

```
TabNavigator
    │
    ├── Lịch (Calendar)
    │
    ├── La Bàn (Compass) ← NEW (replaces "Hôm Nay")
    │       │
    │       ├── Standard Compass (default)
    │       │       └── Real-time magnetometer
    │       │
    │       └── Feng Shui Compass
    │               ├── 8-Direction wheel
    │               └── Today's Info Panel
    │
    ├── Ngày lễ (Holidays)
    │
    └── Cài đặt (Settings)
```

---

## 14. Design Assets Required

1. **Yin-Yang SVG** - For compass center
2. **Direction segment gradients** - 8 gradient definitions
3. **Compass needle SVG** - Red/white dual pointer
4. **Element icons** (optional) - 金木水火土 symbols

---

*Document prepared by Sally, UX Designer*
*For Lịch Việt Vạn Sự An Lành project*
