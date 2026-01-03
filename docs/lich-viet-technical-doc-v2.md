# Tài Liệu Kỹ Thuật: Ứng Dụng Lịch Việt (v2.0)

## Mục Lục

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Công Nghệ & Kiến Trúc](#2-công-nghệ--kiến-trúc)
3. [Nguồn Dữ Liệu & Thuật Toán](#3-nguồn-dữ-liệu--thuật-toán)
4. [Thiết Kế UI/UX](#4-thiết-kế-uiux)
5. [Cấu Trúc Màn Hình](#5-cấu-trúc-màn-hình)
6. [Offline First Architecture](#6-offline-first-architecture)
7. [Lưu Ý Quan Trọng](#7-lưu-ý-quan-trọng)
8. [Kế Hoạch Triển Khai](#8-kế-hoạch-triển-khai)

---

## 1. Tổng Quan Dự Án

### 1.1 Mô Tả
Ứng dụng Lịch Việt là một ứng dụng di động cross-platform hiển thị lịch dương kết hợp với âm lịch Việt Nam, bao gồm các thông tin về can chi, tiết khí, giờ hoàng đạo, phong thủy và danh sách ngày lễ/sự kiện Việt Nam.

### 1.2 Các Màn Hình Chính

| Màn Hình | Mô Tả |
|----------|-------|
| Lịch Chính | Xem lịch theo tháng với thông tin âm lịch |
| **Chi Tiết Ngày (Updated)** | Thông tin phong thủy chi tiết về một ngày |
| Danh Sách Ngày Lễ | Tìm kiếm và xem các ngày lễ trong năm |
| Cài Đặt | Tùy chỉnh giao diện và thông báo |

### 1.3 Tính Năng Chính

**Core Features:**
- Hiển thị lịch dương và âm lịch song song
- Tính toán can chi (Năm, Tháng, Ngày, Giờ)
- Hiển thị giờ hoàng đạo theo ngày
- Danh sách ngày lễ Việt Nam (cố định + âm lịch)
- Nhắc nhở ngày lễ
- Tạo sự kiện cá nhân
- Hoạt động offline hoàn toàn

**Advanced Features (v2.0):**
- 🆕 Chỉ số ngày tốt (Day Score %)
- 🆕 Giờ tốt với Can Chi và con giáp
- 🆕 Phần Thiên: Việc nên làm / Không nên làm
- 🆕 Phần Địa: Phương hướng tốt với rating
- 🆕 28 Sao (Nhị thập bát tú) chi tiết
- 🆕 12 Trực với ý nghĩa
- 🆕 Ngũ hành của ngày
- 🆕 Tag phân loại sự kiện (Lễ, Kỷ niệm, etc.)

---

## 2. Công Nghệ & Kiến Trúc

### 2.1 Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     REACT NATIVE APP                        │
├─────────────────────────────────────────────────────────────┤
│  UI Layer                                                   │
│  ├── React Native 0.73+                                     │
│  ├── React Navigation 6.x (Navigation)                      │
│  ├── React Native Calendars (Calendar component)            │
│  ├── React Native Reanimated 3.x (Animations)               │
│  ├── React Native SVG (Icons, Charts)                       │
│  └── React Native Linear Gradient (Header cards)            │
├─────────────────────────────────────────────────────────────┤
│  State Management                                           │
│  ├── Zustand (Global state)                                 │
│  └── React Query / TanStack Query (Data fetching & cache)   │
├─────────────────────────────────────────────────────────────┤
│  Local Storage (Offline First)                              │
│  ├── MMKV (Fast key-value storage)                          │
│  ├── WatermelonDB (Complex queries, events)                 │
│  └── AsyncStorage (Settings, preferences)                   │
├─────────────────────────────────────────────────────────────┤
│  Lunar Calendar Engine                                      │
│  ├── lunar-javascript (Core calculations)                   │
│  ├── Custom Vietnamese adaptations                          │
│  └── Pre-computed lookup tables (1900-2100)                 │
├─────────────────────────────────────────────────────────────┤
│  Feng Shui Data Engine (NEW)                                │
│  ├── Scraped database (SQLite)                              │
│  ├── Activities rules engine                                │
│  └── Direction calculator                                   │
├─────────────────────────────────────────────────────────────┤
│  Notifications                                              │
│  └── Notifee (Local notifications)                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Dependencies Chính

```json
{
  "dependencies": {
    "react-native": "0.73.x",
    "@react-navigation/native": "^6.1.x",
    "@react-navigation/bottom-tabs": "^6.5.x",
    "react-native-calendars": "^1.1300.x",
    "react-native-reanimated": "^3.6.x",
    "react-native-gesture-handler": "^2.14.x",
    "react-native-svg": "^14.x",
    "react-native-linear-gradient": "^2.8.x",
    "zustand": "^4.4.x",
    "@tanstack/react-query": "^5.x",
    "react-native-mmkv": "^2.11.x",
    "@nozbe/watermelondb": "^0.27.x",
    "@notifee/react-native": "^7.x",
    "react-native-vector-icons": "^10.x",
    "date-fns": "^3.x",
    "lunar-javascript": "^1.6.x"
  }
}
```

### 2.3 Cấu Trúc Thư Mục (Updated)

```
src/
├── app/                          # App entry, navigation
│   ├── App.tsx
│   └── navigation/
│       ├── RootNavigator.tsx
│       └── TabNavigator.tsx
│
├── screens/                      # Màn hình chính
│   ├── CalendarScreen/
│   │   ├── index.tsx
│   │   ├── CalendarGrid.tsx
│   │   ├── DayCell.tsx
│   │   └── DayDetail.tsx
│   ├── DayDetailScreen/          # 🆕 UPDATED
│   │   ├── index.tsx
│   │   ├── DayHeaderCard.tsx     # Hero card với gradient
│   │   ├── DayScoreCircle.tsx    # Chỉ số ngày tốt
│   │   ├── GoodHoursSection.tsx  # Giờ tốt trong ngày
│   │   ├── TianSection.tsx       # Phần Thiên
│   │   ├── DiSection.tsx         # Phần Địa
│   │   ├── InfoGrid.tsx          # Tiết khí, Trực, Hành, Sao
│   │   └── EventsSection.tsx     # Sự kiện
│   ├── HolidayListScreen/
│   └── SettingsScreen/
│
├── components/                   # Shared components
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Tag.tsx               # 🆕 Event tags
│   │   ├── StarRating.tsx        # 🆕 Direction rating
│   │   ├── ProgressCircle.tsx    # 🆕 Day score
│   │   └── SearchBar.tsx
│   └── calendar/
│       ├── MonthHeader.tsx
│       ├── WeekDayHeader.tsx
│       ├── LunarDateBadge.tsx
│       ├── HoangDaoChip.tsx
│       ├── ZodiacHourCard.tsx    # 🆕 Giờ với con giáp
│       └── DirectionRow.tsx      # 🆕 Phương hướng
│
├── core/                         # Business logic
│   ├── lunar/
│   │   ├── LunarCalculator.ts
│   │   ├── CanChi.ts
│   │   ├── TietKhi.ts
│   │   ├── HoangDao.ts
│   │   ├── Star28.ts             # 🆕 28 Sao
│   │   ├── Truc12.ts             # 🆕 12 Trực
│   │   └── constants.ts
│   ├── fengshui/                 # 🆕 NEW MODULE
│   │   ├── DayScore.ts           # Tính điểm ngày
│   │   ├── Activities.ts         # Việc nên/không nên
│   │   ├── Directions.ts         # Phương hướng
│   │   └── rules/
│   │       ├── NgocHapThongThu.ts
│   │       └── BanhToBachKy.ts
│   └── holidays/
│       ├── VietnamHolidays.ts
│       └── holidayData.ts
│
├── data/                         # Data layer
│   ├── database/
│   │   ├── schema.ts
│   │   ├── fengshuiSchema.ts     # 🆕 Schema phong thủy
│   │   └── models/
│   ├── storage/
│   │   └── mmkvStorage.ts
│   └── repositories/
│       ├── EventRepository.ts
│       ├── FengshuiRepository.ts # 🆕
│       └── SettingsRepository.ts
│
├── stores/                       # Zustand stores
│   ├── useCalendarStore.ts
│   ├── useSettingsStore.ts
│   ├── useFengshuiStore.ts       # 🆕
│   └── useEventStore.ts
│
├── hooks/                        # Custom hooks
│   ├── useLunarDate.ts
│   ├── useDayDetail.ts           # 🆕 Full day info
│   ├── useFengshui.ts            # 🆕
│   ├── useHolidays.ts
│   └── useNotifications.ts
│
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
│
├── assets/
│   ├── icons/
│   │   └── zodiac/               # 🆕 12 con giáp icons
│   └── images/
│
└── utils/
    ├── dateUtils.ts
    └── formatters.ts
```

---

## 3. Nguồn Dữ Liệu & Thuật Toán

### 3.1 Tổng Quan Data Sources

| Loại Dữ Liệu | Nguồn | Phương pháp | Cập nhật |
|--------------|-------|-------------|----------|
| Âm lịch | lunar-javascript | Tính toán | Real-time |
| Can Chi | lunar-javascript | Tính toán | Real-time |
| 28 Sao | lunar-javascript + Scrape | Hybrid | Pre-computed |
| 12 Trực | lunar-javascript | Tính toán | Real-time |
| Tiết Khí | lunar-javascript | Tính toán | Real-time |
| Giờ Hoàng Đạo | Bảng tra cứu | Static | N/A |
| **Việc nên/không nên** | **Scrape** | Database | Yearly |
| **Phương hướng tốt** | **Scrape + Tính toán** | Hybrid | Daily |
| **Chỉ số ngày tốt** | **Algorithm** | Tính toán | Real-time |
| Ngày lễ | Hardcoded | Static | Khi có thay đổi |
| Sự kiện người dùng | WatermelonDB | User input | Real-time |

### 3.2 Sử Dụng lunar-javascript

```typescript
// src/core/lunar/LunarService.ts

import { Lunar, Solar } from 'lunar-javascript';

export class LunarService {
  /**
   * Lấy thông tin âm lịch đầy đủ từ ngày dương
   */
  static getFullLunarInfo(date: Date) {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    
    return {
      // Âm lịch cơ bản
      lunarDay: lunar.getDay(),
      lunarMonth: lunar.getMonth(),
      lunarYear: lunar.getYear(),
      isLeapMonth: lunar.getMonth() !== lunar.getMonthInChinese(),
      
      // Can Chi
      yearGanZhi: lunar.getYearInGanZhi(),      // Giáp Thìn
      monthGanZhi: lunar.getMonthInGanZhi(),    // Mậu Thìn
      dayGanZhi: lunar.getDayInGanZhi(),        // Canh Ngọ
      
      // Ngũ hành
      yearNaYin: lunar.getYearNaYin(),          // Nạp âm năm
      dayNaYin: lunar.getDayNaYin(),            // Nạp âm ngày
      
      // 28 Sao
      xiu: lunar.getXiu(),                       // Tên sao
      xiuLuck: lunar.getXiuLuck(),              // Tốt/Xấu
      xiuSong: lunar.getXiuSong(),              // Thơ về sao
      
      // 12 Trực
      zhi: lunar.getZhi(),                       // Tên trực
      
      // Tiết khí
      jieQi: lunar.getJieQi(),                   // Tiết khí hiện tại
      
      // Thần sát
      dayPositionXi: lunar.getDayPositionXi(),           // Hỷ thần
      dayPositionYangGui: lunar.getDayPositionYangGui(), // Dương quý
      dayPositionYinGui: lunar.getDayPositionYinGui(),   // Âm quý
      dayPositionFu: lunar.getDayPositionFu(),           // Phúc thần
      dayPositionCai: lunar.getDayPositionCai(),         // Tài thần
      
      // Việc nên làm / không nên (từ thư viện)
      dayYi: lunar.getDayYi(),                   // Array việc nên
      dayJi: lunar.getDayJi(),                   // Array việc kỵ
      
      // Giờ hoàng đạo
      timeGanZhi: lunar.getTimeGanZhi(),
    };
  }
  
  /**
   * Lấy thông tin 12 giờ trong ngày
   */
  static getDayHours(date: Date) {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const times = lunar.getTimes(); // Array 12 LunarTime objects
    
    return times.map((time, index) => ({
      zhi: time.getZhi(),                    // Tý, Sửu, Dần...
      ganZhi: time.getGanZhi(),              // Giáp Tý, Ất Sửu...
      timeRange: this.getTimeRange(index),   // 23h-1h, 1h-3h...
      isHuangDao: time.isHuangDao(),         // Giờ hoàng đạo?
      zodiacIcon: this.getZodiacIcon(index), // 🐀, 🐂...
      yi: time.getYi(),                      // Việc nên làm trong giờ
      ji: time.getJi(),                      // Việc kỵ trong giờ
    }));
  }
  
  private static getTimeRange(index: number): string {
    const ranges = [
      '23h-1h', '1h-3h', '3h-5h', '5h-7h', '7h-9h', '9h-11h',
      '11h-13h', '13h-15h', '15h-17h', '17h-19h', '19h-21h', '21h-23h'
    ];
    return ranges[index];
  }
  
  private static getZodiacIcon(index: number): string {
    const icons = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];
    return icons[index];
  }
}
```

### 3.3 Chỉ Số Ngày Tốt (Day Score Algorithm)

```typescript
// src/core/fengshui/DayScore.ts

interface DayScoreFactors {
  hoangDao: number;      // +20 nếu hoàng đạo, -10 nếu hắc đạo
  star28: number;        // -10 đến +15 tùy sao
  truc12: number;        // -10 đến +15 tùy trực
  goodStars: number;     // +2 mỗi sao tốt
  badStars: number;      // -2 mỗi sao xấu
  specialDays: number;   // Tam nương, Dương công kỵ, etc.
}

export class DayScoreCalculator {
  private static BASE_SCORE = 50;
  
  /**
   * Tính điểm ngày tốt (0-100%)
   */
  static calculate(date: Date): { score: number; factors: DayScoreFactors; label: string } {
    const lunarInfo = LunarService.getFullLunarInfo(date);
    
    const factors: DayScoreFactors = {
      hoangDao: this.getHoangDaoScore(lunarInfo),
      star28: this.getStar28Score(lunarInfo.xiu),
      truc12: this.getTruc12Score(lunarInfo.zhi),
      goodStars: this.getGoodStarsScore(lunarInfo),
      badStars: this.getBadStarsScore(lunarInfo),
      specialDays: this.getSpecialDaysScore(lunarInfo),
    };
    
    let score = this.BASE_SCORE;
    score += factors.hoangDao;
    score += factors.star28;
    score += factors.truc12;
    score += factors.goodStars;
    score += factors.badStars;
    score += factors.specialDays;
    
    // Clamp to 0-100
    score = Math.max(0, Math.min(100, score));
    
    return {
      score,
      factors,
      label: this.getScoreLabel(score),
    };
  }
  
  private static getHoangDaoScore(lunarInfo: any): number {
    // 6 ngày hoàng đạo, 6 ngày hắc đạo theo 12 Trực
    const hoangDaoZhi = ['Trừ', 'Mãn', 'Bình', 'Định', 'Thành', 'Khai'];
    return hoangDaoZhi.includes(lunarInfo.zhi) ? 20 : -10;
  }
  
  private static getStar28Score(xiu: string): number {
    // Điểm theo 28 sao (đã được classify sẵn)
    const STAR_SCORES: Record<string, number> = {
      // Sao tốt
      'Giác': 12, 'Phòng': 15, 'Vĩ': 10, 'Cơ': 8,
      'Đẩu': 12, 'Nữ': 5, 'Nguy': 8, 'Thất': 12,
      'Khuê': 10, 'Lâu': 8, 'Vị': 12, 'Tất': 15,
      'Sâm': 10, 'Tỉnh': 12, 'Trương': 15, 'Dực': 8,
      // Sao xấu
      'Cang': -8, 'Đê': -10, 'Tâm': -5, 'Ngưu': -8,
      'Hư': -10, 'Bích': -5, 'Mão': -8, 'Chủy': -5,
      'Quỷ': -12, 'Liễu': -8, 'Tinh': -5, 'Chẩn': -8,
    };
    return STAR_SCORES[xiu] || 0;
  }
  
  private static getTruc12Score(zhi: string): number {
    const TRUC_SCORES: Record<string, number> = {
      'Kiến': 5,
      'Trừ': 12,    // Hoàng đạo
      'Mãn': 15,    // Hoàng đạo
      'Bình': 10,   // Hoàng đạo
      'Định': 12,   // Hoàng đạo
      'Chấp': -5,
      'Phá': -15,
      'Nguy': -10,
      'Thành': 15,  // Hoàng đạo
      'Thu': -8,
      'Khai': 12,   // Hoàng đạo
      'Bế': -12,
    };
    return TRUC_SCORES[zhi] || 0;
  }
  
  private static getGoodStarsScore(lunarInfo: any): number {
    // Đếm số sao tốt trong ngày (Thiên đức, Nguyệt đức, etc.)
    // Mỗi sao tốt +2 điểm, tối đa +10
    const goodStarsCount = lunarInfo.dayYi?.length || 0;
    return Math.min(10, goodStarsCount * 2);
  }
  
  private static getBadStarsScore(lunarInfo: any): number {
    const badStarsCount = lunarInfo.dayJi?.length || 0;
    return Math.max(-10, -badStarsCount * 2);
  }
  
  private static getSpecialDaysScore(lunarInfo: any): number {
    let penalty = 0;
    
    // Tam nương (ngày 3, 7, 13, 18, 22, 27 âm lịch)
    const tamNuong = [3, 7, 13, 18, 22, 27];
    if (tamNuong.includes(lunarInfo.lunarDay)) {
      penalty -= 15;
    }
    
    // Nguyệt kỵ (ngày 5, 14, 23 âm lịch)
    const nguyetKy = [5, 14, 23];
    if (nguyetKy.includes(lunarInfo.lunarDay)) {
      penalty -= 10;
    }
    
    return penalty;
  }
  
  private static getScoreLabel(score: number): string {
    if (score >= 80) return 'Ngày rất tốt';
    if (score >= 65) return 'Ngày tốt';
    if (score >= 50) return 'Ngày bình thường';
    if (score >= 35) return 'Ngày không tốt';
    return 'Ngày xấu';
  }
}
```

### 3.4 Phương Hướng Tốt

```typescript
// src/core/fengshui/Directions.ts

interface Direction {
  name: string;
  nameVi: string;
  degrees: string;
  rating: number;      // 1-5 sao
  description?: string;
}

export const DIRECTIONS = [
  { name: 'N', nameVi: 'Chính Bắc', degrees: '352.5° - 7.5°' },
  { name: 'NNE', nameVi: 'Bắc - Đông Bắc', degrees: '22.5° - 37.5°' },
  { name: 'NE', nameVi: 'Đông Bắc', degrees: '37.5° - 52.5°' },
  { name: 'ENE', nameVi: 'Đông - Đông Bắc', degrees: '67.5° - 82.5°' },
  { name: 'E', nameVi: 'Chính Đông', degrees: '82.5° - 97.5°' },
  { name: 'ESE', nameVi: 'Đông - Đông Nam', degrees: '112.5° - 127.5°' },
  { name: 'SE', nameVi: 'Chính Đông Nam', degrees: '127.5° - 142.5°' },
  { name: 'SSE', nameVi: 'Nam - Đông Nam', degrees: '157.5° - 172.5°' },
  { name: 'S', nameVi: 'Chính Nam', degrees: '172.5° - 187.5°' },
  { name: 'SSW', nameVi: 'Nam - Tây Nam', degrees: '202.5° - 217.5°' },
  { name: 'SW', nameVi: 'Tây Nam', degrees: '217.5° - 232.5°' },
  { name: 'WSW', nameVi: 'Tây - Tây Nam', degrees: '247.5° - 262.5°' },
  { name: 'W', nameVi: 'Chính Tây', degrees: '262.5° - 277.5°' },
  { name: 'WNW', nameVi: 'Tây - Tây Bắc', degrees: '292.5° - 307.5°' },
  { name: 'NW', nameVi: 'Tây Bắc', degrees: '307.5° - 322.5°' },
  { name: 'NNW', nameVi: 'Bắc - Tây Bắc', degrees: '337.5° - 352.5°' },
];

export class DirectionCalculator {
  /**
   * Tính phương hướng tốt trong ngày dựa vào Hỷ thần, Tài thần, etc.
   */
  static getDayDirections(date: Date): Direction[] {
    const lunarInfo = LunarService.getFullLunarInfo(date);
    
    // Các hướng đặc biệt từ lunar-javascript
    const specialDirections = {
      xi: lunarInfo.dayPositionXi,           // Hỷ thần - Hướng may mắn
      yangGui: lunarInfo.dayPositionYangGui, // Dương quý nhân
      yinGui: lunarInfo.dayPositionYinGui,   // Âm quý nhân
      fu: lunarInfo.dayPositionFu,           // Phúc thần
      cai: lunarInfo.dayPositionCai,         // Tài thần - Hướng tài lộc
    };
    
    // Map và rating các hướng
    return DIRECTIONS.map(dir => {
      let rating = 3; // Default
      
      // Boost rating nếu trùng với hướng tốt
      if (this.matchDirection(dir.nameVi, specialDirections.xi)) rating = 5;
      else if (this.matchDirection(dir.nameVi, specialDirections.cai)) rating = 5;
      else if (this.matchDirection(dir.nameVi, specialDirections.fu)) rating = 4;
      else if (this.matchDirection(dir.nameVi, specialDirections.yangGui)) rating = 4;
      
      // Penalize nếu trùng với hướng xấu (từ scraped data)
      // ... logic từ database
      
      return {
        ...dir,
        rating,
      };
    });
  }
  
  private static matchDirection(dir1: string, dir2: string): boolean {
    // Normalize và so sánh hướng
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    return normalize(dir1).includes(normalize(dir2)) || 
           normalize(dir2).includes(normalize(dir1));
  }
}
```

### 3.5 28 Sao (Nhị Thập Bát Tú)

```typescript
// src/core/lunar/Star28.ts

export interface Star28 {
  index: number;
  name: string;
  nameHan: string;
  element: string;    // Ngũ hành
  animal: string;     // Con vật
  meaning: string;    // Ý nghĩa
  luck: 'good' | 'bad' | 'neutral';
  poem?: string;      // Thơ
}

export const STARS_28: Star28[] = [
  { index: 1, name: 'Giác', nameHan: '角', element: 'Mộc', animal: 'Giao long', luck: 'good', meaning: 'Tốt cho xây dựng, khai trương' },
  { index: 2, name: 'Cang', nameHan: '亢', element: 'Kim', animal: 'Rồng', luck: 'bad', meaning: 'Không tốt cho cưới hỏi' },
  { index: 3, name: 'Đê', nameHan: '氐', element: 'Thổ', animal: 'Lạc đà', luck: 'bad', meaning: 'Kỵ tang lễ, di chuyển' },
  { index: 4, name: 'Phòng', nameHan: '房', element: 'Nhật', animal: 'Thỏ', luck: 'good', meaning: 'Tốt cho cưới hỏi, xây nhà' },
  { index: 5, name: 'Tâm', nameHan: '心', element: 'Nguyệt', animal: 'Hồ ly', luck: 'bad', meaning: 'Kỵ mọi việc lớn' },
  { index: 6, name: 'Vĩ', nameHan: '尾', element: 'Hỏa', animal: 'Hổ', luck: 'good', meaning: 'Tốt cho cưới hỏi, khai trương' },
  { index: 7, name: 'Cơ', nameHan: '箕', element: 'Thủy', animal: 'Báo', luck: 'good', meaning: 'Tốt cho xây dựng, trồng trọt' },
  { index: 8, name: 'Đẩu', nameHan: '斗', element: 'Mộc', animal: 'Giải', luck: 'good', meaning: 'Tốt cho khai trương, giao dịch' },
  { index: 9, name: 'Ngưu', nameHan: '牛', element: 'Kim', animal: 'Ngưu', luck: 'bad', meaning: 'Kỵ cưới hỏi, động thổ' },
  { index: 10, name: 'Nữ', nameHan: '女', element: 'Thổ', animal: 'Bức', luck: 'neutral', meaning: 'Bình thường' },
  { index: 11, name: 'Hư', nameHan: '虛', element: 'Nhật', animal: 'Thử', luck: 'bad', meaning: 'Xấu, kỵ mọi việc' },
  { index: 12, name: 'Nguy', nameHan: '危', element: 'Nguyệt', animal: 'Yến', luck: 'neutral', meaning: 'Cần cẩn thận' },
  { index: 13, name: 'Thất', nameHan: '室', element: 'Hỏa', animal: 'Trư', luck: 'good', meaning: 'Tốt cho cưới hỏi, xây nhà' },
  { index: 14, name: 'Bích', nameHan: '壁', element: 'Thủy', animal: 'Du', luck: 'neutral', meaning: 'Tốt cho học hành' },
  { index: 15, name: 'Khuê', nameHan: '奎', element: 'Mộc', animal: 'Lang', luck: 'good', meaning: 'Tốt cho văn thư, học hành' },
  { index: 16, name: 'Lâu', nameHan: '婁', element: 'Kim', animal: 'Cẩu', luck: 'good', meaning: 'Tốt cho cưới hỏi' },
  { index: 17, name: 'Vị', nameHan: '胃', element: 'Thổ', animal: 'Trĩ', luck: 'good', meaning: 'Tốt cho khai trương, giao dịch' },
  { index: 18, name: 'Mão', nameHan: '昴', element: 'Nhật', animal: 'Kê', luck: 'bad', meaning: 'Kỵ tang lễ' },
  { index: 19, name: 'Tất', nameHan: '畢', element: 'Nguyệt', animal: 'Ô', luck: 'good', meaning: 'Tốt cho xây dựng, khai trương' },
  { index: 20, name: 'Chủy', nameHan: '觜', element: 'Hỏa', animal: 'Hầu', luck: 'bad', meaning: 'Kỵ mọi việc lớn' },
  { index: 21, name: 'Sâm', nameHan: '參', element: 'Thủy', animal: 'Viên', luck: 'good', meaning: 'Tốt cho giao dịch, xuất hành' },
  { index: 22, name: 'Tỉnh', nameHan: '井', element: 'Mộc', animal: 'Ngạn', luck: 'good', meaning: 'Tốt cho xây dựng' },
  { index: 23, name: 'Quỷ', nameHan: '鬼', element: 'Kim', animal: 'Dương', luck: 'bad', meaning: 'Xấu, kỵ mọi việc' },
  { index: 24, name: 'Liễu', nameHan: '柳', element: 'Thổ', animal: 'Chương', luck: 'bad', meaning: 'Kỵ tang lễ, cưới hỏi' },
  { index: 25, name: 'Tinh', nameHan: '星', element: 'Nhật', animal: 'Mã', luck: 'neutral', meaning: 'Bình thường' },
  { index: 26, name: 'Trương', nameHan: '張', element: 'Nguyệt', animal: 'Lộc', luck: 'good', meaning: 'Tốt cho cưới hỏi, khai trương' },
  { index: 27, name: 'Dực', nameHan: '翼', element: 'Hỏa', animal: 'Xà', luck: 'good', meaning: 'Tốt cho xuất hành' },
  { index: 28, name: 'Chẩn', nameHan: '軫', element: 'Thủy', animal: 'Dẫn', luck: 'bad', meaning: 'Kỵ cưới hỏi' },
];

export function getStar28(date: Date): Star28 {
  const lunarInfo = LunarService.getFullLunarInfo(date);
  const starName = lunarInfo.xiu;
  return STARS_28.find(s => s.name === starName) || STARS_28[0];
}
```

### 3.6 12 Trực

```typescript
// src/core/lunar/Truc12.ts

export interface Truc12 {
  index: number;
  name: string;
  nameHan: string;
  isHoangDao: boolean;
  meaning: string;
  goodFor: string[];
  badFor: string[];
}

export const TRUC_12: Truc12[] = [
  {
    index: 1,
    name: 'Kiến',
    nameHan: '建',
    isHoangDao: false,
    meaning: 'Ngày khởi đầu, thích hợp việc mới',
    goodFor: ['Xuất hành', 'Khai trương', 'Nhậm chức'],
    badFor: ['Động thổ', 'An táng'],
  },
  {
    index: 2,
    name: 'Trừ',
    nameHan: '除',
    isHoangDao: true,
    meaning: 'Ngày trừ bỏ, tốt cho việc dọn dẹp',
    goodFor: ['Trị bệnh', 'Dọn nhà', 'Tẩy uế'],
    badFor: ['Cưới hỏi', 'Khai trương'],
  },
  {
    index: 3,
    name: 'Mãn',
    nameHan: '滿',
    isHoangDao: true,
    meaning: 'Ngày đầy đủ, viên mãn',
    goodFor: ['Cưới hỏi', 'Khai trương', 'Nhập trạch'],
    badFor: ['Tang lễ', 'Kiện tụng'],
  },
  {
    index: 4,
    name: 'Bình',
    nameHan: '平',
    isHoangDao: true,
    meaning: 'Ngày bình ổn, thuận lợi',
    goodFor: ['Mọi việc thông thường'],
    badFor: ['Động thổ lớn'],
  },
  {
    index: 5,
    name: 'Định',
    nameHan: '定',
    isHoangDao: true,
    meaning: 'Ngày ổn định, yên bình',
    goodFor: ['Cưới hỏi', 'Ký hợp đồng', 'Thỏa thuận'],
    badFor: ['Kiện tụng', 'Xuất hành xa'],
  },
  {
    index: 6,
    name: 'Chấp',
    nameHan: '執',
    isHoangDao: false,
    meaning: 'Ngày nắm giữ',
    goodFor: ['Xây dựng', 'Lập kế hoạch'],
    badFor: ['Di chuyển', 'Nhập trạch'],
  },
  {
    index: 7,
    name: 'Phá',
    nameHan: '破',
    isHoangDao: false,
    meaning: 'Ngày phá hủy, không tốt',
    goodFor: ['Phá dỡ', 'Trị bệnh'],
    badFor: ['Mọi việc lớn', 'Cưới hỏi', 'Khai trương'],
  },
  {
    index: 8,
    name: 'Nguy',
    nameHan: '危',
    isHoangDao: false,
    meaning: 'Ngày nguy hiểm, cần cẩn thận',
    goodFor: ['Cầu an', 'Tế lễ'],
    badFor: ['Xuất hành', 'Leo cao', 'Động thổ'],
  },
  {
    index: 9,
    name: 'Thành',
    nameHan: '成',
    isHoangDao: true,
    meaning: 'Ngày thành công, viên mãn',
    goodFor: ['Cưới hỏi', 'Khai trương', 'Giao dịch', 'Nhập trạch'],
    badFor: ['Kiện tụng'],
  },
  {
    index: 10,
    name: 'Thu',
    nameHan: '收',
    isHoangDao: false,
    meaning: 'Ngày thu hoạch',
    goodFor: ['Thu hoạch', 'Đòi nợ'],
    badFor: ['Khai trương', 'Xuất hành'],
  },
  {
    index: 11,
    name: 'Khai',
    nameHan: '開',
    isHoangDao: true,
    meaning: 'Ngày mở đầu, khởi sự',
    goodFor: ['Khai trương', 'Động thổ', 'Cưới hỏi', 'Nhập học'],
    badFor: ['Tang lễ'],
  },
  {
    index: 12,
    name: 'Bế',
    nameHan: '閉',
    isHoangDao: false,
    meaning: 'Ngày đóng cửa, không thuận',
    goodFor: ['An táng', 'Sửa mộ'],
    badFor: ['Khai trương', 'Cưới hỏi', 'Xuất hành'],
  },
];
```

---

## 4. Thiết Kế UI/UX

### 4.1 Design System

#### 4.1.1 Color Palette (Updated)

```typescript
// src/theme/colors.ts

export const colors = {
  // Primary - Green (màu chủ đạo màn hình chính)
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  
  // Secondary - Blue (màn hình chi tiết ngày)
  secondary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Gradient cho Day Detail Header
  gradient: {
    dayDetail: {
      start: '#4FC3F7',   // Light blue
      end: '#2196F3',     // Blue
    },
    greenCard: {
      start: '#66BB6A',
      end: '#388E3C',
    },
  },
  
  // Neutral
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  
  // Day Score colors
  dayScore: {
    excellent: '#4CAF50',  // 80-100%
    good: '#8BC34A',       // 65-79%
    normal: '#FFC107',     // 50-64%
    bad: '#FF9800',        // 35-49%
    veryBad: '#F44336',    // 0-34%
  },
  
  // Star rating
  star: {
    filled: '#FFD700',
    empty: '#E0E0E0',
  },
  
  // Event tags
  tags: {
    holiday: '#F44336',
    memorial: '#FF9800', 
    birthday: '#E91E63',
    work: '#2196F3',
    personal: '#9C27B0',
  },
};
```

#### 4.1.2 Typography (Updated)

```typescript
// src/theme/typography.ts

export const typography = {
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  
  // Day Detail specific
  dayDetail: {
    dayNumber: {
      fontSize: 64,
      fontFamily: 'Inter-Bold',
      lineHeight: 1.1,
    },
    weekDay: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      letterSpacing: 2,
    },
    score: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#F44336', // Accent color
    },
  },
};
```

### 4.2 New Components

#### 4.2.1 DayScoreCircle Component

```tsx
// src/components/common/DayScoreCircle.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme';

interface DayScoreCircleProps {
  score: number;  // 0-100
  size?: number;
  strokeWidth?: number;
}

export const DayScoreCircle: React.FC<DayScoreCircleProps> = ({
  score,
  size = 80,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  
  const getColor = (score: number) => {
    if (score >= 80) return colors.dayScore.excellent;
    if (score >= 65) return colors.dayScore.good;
    if (score >= 50) return colors.dayScore.normal;
    if (score >= 35) return colors.dayScore.bad;
    return colors.dayScore.veryBad;
  };
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.neutral[200]}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
        />
      </Svg>
      
      <View style={styles.textContainer}>
        <Text style={[styles.score, { color: getColor(score) }]}>
          {score}%
        </Text>
        <Text style={styles.label}>Chỉ số ngày tốt</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  label: {
    fontSize: 8,
    color: colors.neutral[600],
    marginTop: 2,
  },
});
```

#### 4.2.2 ZodiacHourCard Component

```tsx
// src/components/calendar/ZodiacHourCard.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';

interface ZodiacHourCardProps {
  ganZhi: string;       // Giáp Tý
  timeRange: string;    // 23h-1h
  zodiacIcon: string;   // 🐀 hoặc image path
  isGoodHour: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

const ZODIAC_IMAGES: Record<string, any> = {
  'Tý': require('@/assets/icons/zodiac/rat.png'),
  'Sửu': require('@/assets/icons/zodiac/ox.png'),
  'Dần': require('@/assets/icons/zodiac/tiger.png'),
  'Mão': require('@/assets/icons/zodiac/rabbit.png'),
  'Thìn': require('@/assets/icons/zodiac/dragon.png'),
  'Tỵ': require('@/assets/icons/zodiac/snake.png'),
  'Ngọ': require('@/assets/icons/zodiac/horse.png'),
  'Mùi': require('@/assets/icons/zodiac/goat.png'),
  'Thân': require('@/assets/icons/zodiac/monkey.png'),
  'Dậu': require('@/assets/icons/zodiac/rooster.png'),
  'Tuất': require('@/assets/icons/zodiac/dog.png'),
  'Hợi': require('@/assets/icons/zodiac/pig.png'),
};

export const ZodiacHourCard: React.FC<ZodiacHourCardProps> = ({
  ganZhi,
  timeRange,
  zodiacIcon,
  isGoodHour,
  isSelected = false,
  onPress,
}) => {
  const zhi = ganZhi.slice(-1); // Lấy Chi từ Can Chi
  
  return (
    <Pressable
      style={[
        styles.card,
        isGoodHour && styles.goodHour,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
    >
      <View style={[
        styles.iconContainer,
        isGoodHour && styles.goodHourIcon,
      ]}>
        {ZODIAC_IMAGES[zhi] ? (
          <Image source={ZODIAC_IMAGES[zhi]} style={styles.zodiacImage} />
        ) : (
          <Text style={styles.zodiacEmoji}>{zodiacIcon}</Text>
        )}
      </View>
      
      <Text style={[styles.ganZhi, isGoodHour && styles.goodHourText]}>
        {ganZhi}
      </Text>
      <Text style={styles.timeRange}>{timeRange}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginRight: spacing[3],
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.xl,
    minWidth: 80,
  },
  goodHour: {
    backgroundColor: colors.secondary[50],
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  selected: {
    backgroundColor: colors.secondary[500],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  goodHourIcon: {
    backgroundColor: colors.secondary[100],
  },
  zodiacImage: {
    width: 32,
    height: 32,
  },
  zodiacEmoji: {
    fontSize: 28,
  },
  ganZhi: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.neutral[800],
  },
  goodHourText: {
    color: colors.secondary[700],
  },
  timeRange: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: 2,
  },
});
```

#### 4.2.3 DirectionRow Component

```tsx
// src/components/calendar/DirectionRow.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

interface DirectionRowProps {
  name: string;
  degrees: string;
  rating: number;  // 1-5
}

export const DirectionRow: React.FC<DirectionRowProps> = ({
  name,
  degrees,
  rating,
}) => {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text
        key={i}
        style={[
          styles.star,
          { color: i < rating ? colors.star.filled : colors.star.empty }
        ]}
      >
        ★
      </Text>
    ));
  };
  
  return (
    <View style={styles.row}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.degrees}>{degrees}</Text>
      </View>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: colors.neutral[800],
  },
  degrees: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginLeft: 2,
  },
});
```

#### 4.2.4 EventTag Component

```tsx
// src/components/common/EventTag.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';

type TagType = 'holiday' | 'memorial' | 'birthday' | 'work' | 'personal';

interface EventTagProps {
  type: TagType;
  label?: string;
}

const TAG_CONFIG: Record<TagType, { color: string; defaultLabel: string }> = {
  holiday: { color: colors.tags.holiday, defaultLabel: 'Lễ' },
  memorial: { color: colors.tags.memorial, defaultLabel: 'Kỷ niệm' },
  birthday: { color: colors.tags.birthday, defaultLabel: 'Sinh nhật' },
  work: { color: colors.tags.work, defaultLabel: 'Công việc' },
  personal: { color: colors.tags.personal, defaultLabel: 'Cá nhân' },
};

export const EventTag: React.FC<EventTagProps> = ({ type, label }) => {
  const config = TAG_CONFIG[type];
  
  return (
    <View style={[styles.tag, { backgroundColor: config.color }]}>
      <Text style={styles.label}>{label || config.defaultLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: colors.neutral[0],
  },
});
```

---

## 5. Cấu Trúc Màn Hình

### 5.1 Màn Hình Chi Tiết Ngày (Updated - DayDetailScreen)

```
┌────────────────────────────────────────┐
│  <    Tháng 5 - 2024              📅  │ ← Header
├────────────────────────────────────────┤
│  ┌────────────────────────────────┐   │
│  │ ░░░░ GRADIENT BLUE CARD ░░░░░ │   │
│  │                               │   │
│  │   THỨ HAI           ┌─────┐   │   │ ← Day Score Circle
│  │                     │ 77% │   │   │
│  │     20              │     │   │   │
│  │                     └─────┘   │   │
│  │  Tháng 4, 2024                │   │
│  │  Giờ Giáp Thìn      12 Tháng 4│   │
│  │                     Giáp Thìn │   │
│  │  ┌────┐ ┌────┐     Ngày Canh  │   │
│  │  │Mẫu │ │Trạng│     Ngọ      │   │
│  │  │hợp │ │sức │      ┌────┐   │   │
│  │  └────┘ └────┘      │ 2  │   │   │ ← Lucky number
│  │                     └────┘   │   │
│  │  🟢 Ngày Hoàng Đạo - Tốt...  │   │ ← Badge
│  └────────────────────────────────┘   │
│                                        │
│  GIỜ TỐT TRONG NGÀY              ℹ️   │ ← Section header
│  Giờ tốt được tính toán dựa trên...   │
│                                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │  🐀  │ │  🐂  │ │  🐅  │ │  🐇  │ │ ← Scrollable
│  │Giáp Tý│ │Ất Sửu│ │Bính  │ │      │ │
│  │23h-1h│ │1h-3h │ │Dần   │ │      │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ │
│                                        │
├────────────────────────────────────────┤
│  🔴 PHẦN THIÊN                         │ ← Section with accent
│                                        │
│  Việc nên làm và không nên làm dựa... │
│                                        │
│  ┌──────────────────────────────┐     │
│  │ VIỆC NÊN LÀM                 │     │
│  │ • Cầu an, Cầu tự, Giải hạn   │     │
│  │ • Hợp đồng hương, hợp lập    │     │
│  │ • Tuyển dụng nhân sự mới     │     │
│  │ • Khởi công, động thổ        │     │
│  └──────────────────────────────┘     │
│                                        │
│  ┌──────────────────────────────┐     │
│  │ KHÔNG NÊN LÀM                │     │
│  │ • Cầu cúng giải oan, ma chay │     │
│  │ • Dam ngộ, Lễ ăn hỏi        │     │
│  │ • Nhập trạch về nhà mới     │     │
│  └──────────────────────────────┘     │
│                                        │
├────────────────────────────────────────┤
│  🔴 PHẦN ĐỊA                           │
│                                        │
│  Phương hướng tốt trong ngày          │
│  Những hướng tốt để khởi công...      │
│                                        │
│  Đông - Đông Bắc                 ★☆☆☆☆│
│  67.5° - 82.5°                        │
│  ─────────────────────────────────────│
│  Chính Đông Nam                  ★★★☆☆│
│  127.5° - 142.5°                      │
│  ─────────────────────────────────────│
│  Chính Tây                       ★★★★☆│
│  262.5° - 277.5°                      │
│  ─────────────────────────────────────│
│  Tây - Tây Bắc                   ★★★☆☆│
│  277.5° - 292.5°                      │
│  ─────────────────────────────────────│
│  Chính Tây Bắc                   ★★★☆☆│
│  307.5° - 322.5°                      │
│                                        │
├────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐                │
│  │TIẾT KHÍ│ │ TRỰC   │                │ ← Info Grid
│  │   ≋   │ │   ◉    │                │
│  │Tiểu Mãn│ │ Thành  │                │
│  └────────┘ └────────┘                │
│  ┌────────┐ ┌────────┐                │
│  │ HÀNH   │ │  SAO   │                │
│  │   ●   │ │   ✦    │                │
│  │  Kim   │ │ Vĩ chủ │                │
│  └────────┘ └────────┘                │
│                                        │
├────────────────────────────────────────┤
│  Sự kiện                  [Xem tất cả]│
│                                        │
│  ┌────────────────────────────────┐   │
│  │ 🔬 Ngày Khoa học & Công nghệ  │ Lễ│ ← Event with tag
│  │    Cả ngày                     │   │
│  └────────────────────────────────┘   │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ 🎂 Sinh nhật Bác Hồ (19/5)    │Kỷ │
│  │    Sắp diễn ra                │niệm│
│  └────────────────────────────────┘   │
│                                        │
│  ┌────────────────────────────────┐   │
│  │       + Thêm sự kiện mới       │   │ ← FAB style button
│  └────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### 5.2 Implementation (DayDetailScreen)

```tsx
// src/screens/DayDetailScreen/index.tsx

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { Header } from './components/Header';
import { DayHeaderCard } from './components/DayHeaderCard';
import { GoodHoursSection } from './components/GoodHoursSection';
import { TianSection } from './components/TianSection';
import { DiSection } from './components/DiSection';
import { InfoGrid } from './components/InfoGrid';
import { EventsSection } from './components/EventsSection';
import { AddEventButton } from './components/AddEventButton';

import { useDayDetail } from '@/hooks/useDayDetail';
import { colors, spacing } from '@/theme';

interface DayDetailScreenProps {
  route: {
    params: {
      date: string; // ISO date string
    };
  };
}

export const DayDetailScreen: React.FC<DayDetailScreenProps> = ({ route }) => {
  const date = new Date(route.params.date);
  
  const {
    lunarInfo,
    dayScore,
    goodHours,
    activities,
    directions,
    events,
    isLoading,
  } = useDayDetail(date);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header date={date} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card with Gradient */}
        <DayHeaderCard
          date={date}
          lunarInfo={lunarInfo}
          dayScore={dayScore}
        />
        
        {/* Giờ tốt trong ngày */}
        <GoodHoursSection hours={goodHours} />
        
        {/* Phần Thiên - Việc nên/không nên làm */}
        <TianSection activities={activities} />
        
        {/* Phần Địa - Phương hướng */}
        <DiSection directions={directions} />
        
        {/* Info Grid - Tiết khí, Trực, Hành, Sao */}
        <InfoGrid lunarInfo={lunarInfo} />
        
        {/* Sự kiện */}
        <EventsSection events={events} date={date} />
        
        {/* Add Event Button */}
        <AddEventButton onPress={() => navigateToAddEvent(date)} />
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacer: {
    height: spacing[10],
  },
});
```

### 5.3 DayHeaderCard Component

```tsx
// src/screens/DayDetailScreen/components/DayHeaderCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { DayScoreCircle } from '@/components/common/DayScoreCircle';
import { colors, spacing, borderRadius } from '@/theme';

interface DayHeaderCardProps {
  date: Date;
  lunarInfo: LunarInfo;
  dayScore: DayScoreResult;
}

export const DayHeaderCard: React.FC<DayHeaderCardProps> = ({
  date,
  lunarInfo,
  dayScore,
}) => {
  const weekDay = format(date, 'EEEE', { locale: vi });
  const solarDay = date.getDate();
  const monthYear = format(date, 'MMMM, yyyy', { locale: vi });
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradient.dayDetail.start, colors.gradient.dayDetail.end]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Left side - Solar date */}
          <View style={styles.leftColumn}>
            <Text style={styles.weekDay}>{weekDay.toUpperCase()}</Text>
            <Text style={styles.dayNumber}>{solarDay}</Text>
            <Text style={styles.monthYear}>{monthYear}</Text>
            <Text style={styles.hourGanZhi}>Giờ {lunarInfo.yearGanZhi}</Text>
            
            <View style={styles.tagsRow}>
              <View style={styles.smallTag}>
                <Text style={styles.smallTagText}>Mẫu hợp</Text>
              </View>
              <View style={styles.smallTag}>
                <Text style={styles.smallTagText}>Trạng sức</Text>
              </View>
            </View>
          </View>
          
          {/* Right side - Lunar info & Score */}
          <View style={styles.rightColumn}>
            <DayScoreCircle score={dayScore.score} size={90} />
            
            <View style={styles.lunarInfo}>
              <Text style={styles.lunarDate}>
                {lunarInfo.lunarDay} Tháng {lunarInfo.lunarMonth}, {lunarInfo.yearGanZhi}
              </Text>
              <Text style={styles.lunarDetail}>
                Ngày <Text style={styles.highlight}>{lunarInfo.dayGanZhi}</Text>
              </Text>
              <Text style={styles.lunarDetail}>
                Tháng <Text style={styles.highlight}>{lunarInfo.monthGanZhi}</Text>
              </Text>
            </View>
            
            {/* Lucky number */}
            <View style={styles.luckyNumber}>
              <Text style={styles.luckyLabel}>Đông Bắc</Text>
              <Text style={styles.luckySubLabel}>Xuất hành</Text>
              <View style={styles.numberBadge}>
                <Text style={styles.number}>2</Text>
              </View>
              <Text style={styles.mayMan}>May mắn</Text>
            </View>
          </View>
        </View>
        
        {/* Bottom badge */}
        <View style={styles.bottomBadge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>
            Ngày Hoàng Đạo - Tốt cho việc khai trương, xuất hành
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing[4],
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.lg,
  },
  gradient: {
    padding: spacing[5],
  },
  content: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  weekDay: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.neutral[0],
    opacity: 0.9,
    letterSpacing: 2,
  },
  dayNumber: {
    fontSize: 72,
    fontFamily: 'Inter-Bold',
    color: colors.neutral[0],
    lineHeight: 80,
  },
  monthYear: {
    fontSize: 14,
    color: colors.neutral[0],
    opacity: 0.9,
  },
  hourGanZhi: {
    fontSize: 12,
    color: colors.neutral[0],
    opacity: 0.8,
    marginTop: spacing[1],
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: spacing[3],
    gap: spacing[2],
  },
  smallTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  smallTagText: {
    fontSize: 10,
    color: colors.neutral[0],
  },
  lunarInfo: {
    marginTop: spacing[3],
    alignItems: 'flex-end',
  },
  lunarDate: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.neutral[0],
  },
  lunarDetail: {
    fontSize: 12,
    color: colors.neutral[0],
    opacity: 0.9,
  },
  highlight: {
    fontFamily: 'Inter-SemiBold',
  },
  luckyNumber: {
    alignItems: 'center',
    marginTop: spacing[3],
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing[1],
  },
  number: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.secondary[600],
  },
  bottomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[4],
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[400],
    marginRight: spacing[2],
  },
  badgeText: {
    fontSize: 12,
    color: colors.neutral[0],
  },
});
```

---

## 6. Offline First Architecture

### 6.1 Database Schema (Updated)

```typescript
// src/data/database/schema.ts

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,  // Updated version
  tables: [
    // User events
    tableSchema({
      name: 'events',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'start_date', type: 'number' },
        { name: 'end_date', type: 'number', isOptional: true },
        { name: 'is_all_day', type: 'boolean' },
        { name: 'is_lunar', type: 'boolean' },
        { name: 'lunar_day', type: 'number', isOptional: true },
        { name: 'lunar_month', type: 'number', isOptional: true },
        { name: 'repeat_type', type: 'string', isOptional: true },
        { name: 'reminder_minutes', type: 'number', isOptional: true },
        { name: 'tag_type', type: 'string', isOptional: true },  // 🆕
        { name: 'color', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    
    // 🆕 Feng shui daily data (scraped)
    tableSchema({
      name: 'fengshui_daily',
      columns: [
        { name: 'solar_date', type: 'string', isIndexed: true },  // YYYY-MM-DD
        { name: 'good_activities', type: 'string' },    // JSON array
        { name: 'bad_activities', type: 'string' },     // JSON array
        { name: 'directions', type: 'string' },         // JSON array with ratings
        { name: 'good_stars', type: 'string' },         // JSON array
        { name: 'bad_stars', type: 'string' },          // JSON array
        { name: 'special_notes', type: 'string', isOptional: true },
        { name: 'source', type: 'string' },             // Source website
        { name: 'scraped_at', type: 'number' },
      ],
    }),
    
    // Custom holidays
    tableSchema({
      name: 'custom_holidays',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'solar_month', type: 'number', isOptional: true },
        { name: 'solar_day', type: 'number', isOptional: true },
        { name: 'lunar_month', type: 'number', isOptional: true },
        { name: 'lunar_day', type: 'number', isOptional: true },
        { name: 'is_enabled', type: 'boolean' },
        { name: 'reminder_enabled', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
```

### 6.2 Fengshui Repository

```typescript
// src/data/repositories/FengshuiRepository.ts

import { database } from '../database';
import { FengshuiDaily } from '../models/FengshuiDaily';

export class FengshuiRepository {
  private collection = database.get<FengshuiDaily>('fengshui_daily');
  
  /**
   * Lấy data phong thủy cho một ngày
   */
  async getByDate(date: Date): Promise<FengshuiDaily | null> {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const results = await this.collection
      .query(Q.where('solar_date', dateStr))
      .fetch();
    
    return results[0] || null;
  }
  
  /**
   * Lấy data cho một khoảng thời gian
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<FengshuiDaily[]> {
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');
    
    return this.collection
      .query(
        Q.and(
          Q.where('solar_date', Q.gte(startStr)),
          Q.where('solar_date', Q.lte(endStr))
        )
      )
      .fetch();
  }
  
  /**
   * Bulk insert từ scraped data
   */
  async bulkInsert(data: FengshuiDailyInput[]): Promise<void> {
    await database.write(async () => {
      const batch = data.map(item => 
        this.collection.prepareCreate(record => {
          record.solarDate = item.solarDate;
          record.goodActivities = JSON.stringify(item.goodActivities);
          record.badActivities = JSON.stringify(item.badActivities);
          record.directions = JSON.stringify(item.directions);
          record.goodStars = JSON.stringify(item.goodStars);
          record.badStars = JSON.stringify(item.badStars);
          record.specialNotes = item.specialNotes;
          record.source = item.source;
          record.scrapedAt = Date.now();
        })
      );
      
      await database.batch(...batch);
    });
  }
  
  /**
   * Kiểm tra data có cần update không
   */
  async needsUpdate(year: number): Promise<boolean> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    
    const count = await this.collection
      .query(
        Q.and(
          Q.where('solar_date', Q.gte(format(startOfYear, 'yyyy-MM-dd'))),
          Q.where('solar_date', Q.lte(format(endOfYear, 'yyyy-MM-dd')))
        )
      )
      .fetchCount();
    
    // Nếu có ít hơn 360 ngày, cần update
    return count < 360;
  }
}
```

---

## 7. Lưu Ý Quan Trọng

### 7.1 Data Consistency

Khi kết hợp data từ `lunar-javascript` và scraped data, cần đảm bảo consistency:

```typescript
// src/core/DataValidator.ts

export class DataValidator {
  /**
   * So sánh và validate data từ 2 nguồn
   */
  static validateDayData(
    calculatedData: CalculatedDayData,
    scrapedData: ScrapedDayData
  ): ValidationResult {
    const discrepancies: string[] = [];
    
    // Check lunar date
    if (calculatedData.lunarDay !== scrapedData.lunarDay ||
        calculatedData.lunarMonth !== scrapedData.lunarMonth) {
      discrepancies.push(`Lunar date mismatch: calc=${calculatedData.lunarDay}/${calculatedData.lunarMonth}, scraped=${scrapedData.lunarDay}/${scrapedData.lunarMonth}`);
    }
    
    // Check 28 star
    if (calculatedData.star28 !== scrapedData.star28) {
      discrepancies.push(`Star28 mismatch: calc=${calculatedData.star28}, scraped=${scrapedData.star28}`);
    }
    
    // Check 12 truc
    if (calculatedData.truc !== scrapedData.truc) {
      discrepancies.push(`Truc mismatch: calc=${calculatedData.truc}, scraped=${scrapedData.truc}`);
    }
    
    return {
      isValid: discrepancies.length === 0,
      discrepancies,
      // Prefer calculated data for core lunar info
      // Prefer scraped data for feng shui activities
      mergedData: this.mergeData(calculatedData, scrapedData),
    };
  }
  
  private static mergeData(
    calc: CalculatedDayData,
    scraped: ScrapedDayData
  ): MergedDayData {
    return {
      // From calculation (more reliable)
      lunarDate: calc.lunarDate,
      canChi: calc.canChi,
      star28: calc.star28,
      truc12: calc.truc,
      tietKhi: calc.tietKhi,
      hoangDaoHours: calc.hoangDaoHours,
      
      // From scraping (feng shui interpretations)
      goodActivities: scraped.goodActivities,
      badActivities: scraped.badActivities,
      directions: scraped.directions,
      goodStars: scraped.goodStars,
      badStars: scraped.badStars,
      
      // Calculated
      dayScore: this.calculateScore(calc, scraped),
    };
  }
}
```

### 7.2 Performance Optimization

```typescript
// src/hooks/useDayDetail.ts

import { useQuery } from '@tanstack/react-query';
import { LunarService } from '@/core/lunar/LunarService';
import { FengshuiRepository } from '@/data/repositories/FengshuiRepository';

export function useDayDetail(date: Date) {
  // Calculated data - instant, no async
  const calculatedData = useMemo(() => {
    return LunarService.getFullLunarInfo(date);
  }, [date]);
  
  // Scraped data - from database
  const { data: scrapedData, isLoading } = useQuery({
    queryKey: ['fengshui', format(date, 'yyyy-MM-dd')],
    queryFn: () => new FengshuiRepository().getByDate(date),
    staleTime: Infinity,  // Data doesn't change
  });
  
  // Merge and return
  return useMemo(() => {
    const goodHours = LunarService.getDayHours(date)
      .filter(h => h.isHuangDao);
    
    return {
      lunarInfo: calculatedData,
      dayScore: DayScoreCalculator.calculate(date),
      goodHours,
      activities: {
        good: scrapedData?.goodActivities || calculatedData.dayYi,
        bad: scrapedData?.badActivities || calculatedData.dayJi,
      },
      directions: DirectionCalculator.getDayDirections(date),
      isLoading,
    };
  }, [calculatedData, scrapedData, isLoading]);
}
```

---

## 8. Kế Hoạch Triển Khai (Updated)

### 8.1 Phase 1: Core + Lunar Engine (3-4 tuần)

| Tuần | Task | Output |
|------|------|--------|
| 1 | Setup project, integrate lunar-javascript | Base project |
| 2 | Calendar Screen, basic lunar display | Main calendar |
| 3 | Day Detail Screen (basic) | Solar/Lunar info |
| 4 | Testing core calculations | Verified accuracy |

### 8.2 Phase 2: Feng Shui Features (3-4 tuần)

| Tuần | Task | Output |
|------|------|--------|
| 5 | Day Score algorithm, Score Circle UI | Day scoring |
| 6 | Good Hours section, Zodiac cards | Hour display |
| 7 | Tian/Di sections, Activities UI | Feng shui data |
| 8 | Directions with ratings | Full day detail |

### 8.3 Phase 3: Data & Polish (2-3 tuần)

| Tuần | Task | Output |
|------|------|--------|
| 9 | Scraper integration, database | Feng shui DB |
| 10 | Holiday list, Settings, Notifications | Supporting screens |
| 11 | Testing, performance, polish | Production ready |

### 8.4 Estimated Total: 9-11 tuần

---

## Phụ Lục

### A. Data Sources

| Source | Data Type | Priority |
|--------|-----------|----------|
| lunar-javascript | Lunar, Can Chi, 28 sao, 12 trực | Primary |
| lichngaytot.com | Activities, Directions | Scraped |
| xemngay.com | Cross-validation | Backup |

### B. Key Dependencies

```json
{
  "lunar-javascript": "^1.6.x",
  "react-native-svg": "^14.x",
  "react-native-linear-gradient": "^2.8.x",
  "@tanstack/react-query": "^5.x",
  "@nozbe/watermelondb": "^0.27.x"
}
```

---

*Document Version: 2.0*
*Last Updated: December 2024*
*Changes: Added Day Detail Screen v2, Day Score algorithm, Feng Shui modules*
