# Lịch Việt - Mobile App

Ứng dụng lịch Việt Nam với âm lịch, phong thủy, can chi.

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# iOS
npm run pod-install
npm run ios

# Android
npm run android
```

## Cấu trúc

```
src/
├── app/                    # App entry, navigation
├── screens/                # Màn hình chính
│   ├── CalendarScreen/
│   ├── DayDetailScreen/
│   ├── HolidayListScreen/
│   └── SettingsScreen/
├── components/             # Shared components
│   ├── common/
│   └── calendar/
├── core/                   # Business logic
│   ├── lunar/             # Lunar calculations
│   ├── fengshui/          # Feng shui engine
│   └── holidays/          # Vietnam holidays
├── data/                   # Data layer
│   ├── database/          # WatermelonDB
│   ├── storage/           # MMKV storage
│   └── repositories/
├── stores/                 # Zustand stores
├── hooks/                  # Custom hooks
├── theme/                  # Design system
├── assets/                 # Icons, images, fonts
└── utils/                  # Utilities
```

## Tech Stack

- React Native 0.73+
- TypeScript
- React Navigation 6.x
- Zustand (State Management)
- TanStack Query (Data Fetching)
- WatermelonDB (Offline Database)
- lunar-javascript (Lunar Calculations)
