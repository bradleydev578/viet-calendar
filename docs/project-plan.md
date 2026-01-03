# Plan: Lịch Việt Vạn Sự An Lành - Phân Tích Công Việc

## Tổng Quan Dự Án

Ứng dụng Lịch Việt là một ứng dụng di động React Native cross-platform hiển thị lịch dương kết hợp âm lịch Việt Nam, bao gồm thông tin phong thủy, can chi, tiết khí, giờ hoàng đạo.

---

## PHASE 0: Project Setup ✅ COMPLETED

### 0.1 Folder Structure
- [x] Tạo cấu trúc thư mục `scraper/` (Python)
- [x] Tạo cấu trúc thư mục `mobile/` (React Native)
- [x] Setup `requirements.txt` cho scraper
- [x] Setup `package.json`, `tsconfig.json`, `babel.config.js` cho mobile
- [x] Tạo `.gitignore` files
- [x] Tạo `README.md` cho cả 2 projects
- [x] Tạo `Dockerfile` cho scraper

### 0.2 Mobile Base Files (Partial)
- [x] `mobile/src/theme/colors.ts` - Color palette
- [x] `mobile/src/theme/typography.ts` - Font styles
- [x] `mobile/src/theme/spacing.ts` - Spacing scale
- [x] `mobile/src/core/lunar/constants.ts` - Can Chi, Con giáp, Tiết khí
- [x] `mobile/src/app/App.tsx` - App entry point (skeleton)

---

## PHASE 3: Data & Scraper (2-3 tuần) ✅ COMPLETED

### 3.1 Scraper System Setup (Python)
- [x] Tạo `scraper/` directory với structure theo design doc
- [x] Setup Python environment với dependencies (requirements.txt)
- [x] `scraper/src/scrapers/base.py` - Base scraper class
- [x] `scraper/src/scrapers/lichngaytot.py` - Scraper chính + XemNgayScraper
- [x] XemNgayScraper - Scraper phụ với 28 Sao chi tiết (element, animal)

### 3.2 Parsers
- [x] `scraper/src/parsers/lichngaytot_parser.py`
  - Parse lunar info, Can Chi, 28 Sao, 12 Trực
  - Parse activities (việc nên làm / không nên)
  - Parse directions (Hỷ thần, Tài thần, Hắc thần)
  - Parse stars (Cát tinh, Hung tinh)
- [x] `scraper/src/parsers/xemngay_parser.py`
  - Parse 28 Sao với ngũ hành và con vật
  - Parse directions (Tài lộc, Nhân duyên, Bất lợi)

### 3.3 Data Models & Storage
- [x] `scraper/src/models/day_data.py` - Pydantic models
  - DayData, XemNgayData, Star28DetailedInfo
- [x] `scraper/src/models/activities.py` - Activity master list với aliases (38 activities, 12 categories)
- [x] `scraper/src/storage/sqlite_storage.py` - SQLite storage với CRUD
- [x] `scraper/src/storage/json_exporter.py`

### 3.4 Validation
- [x] `scraper/src/validators/lunar_validator.py` - Validate với lunar-javascript
- [x] `scraper/src/validators/cross_validator.py` - Cross-validate giữa sources
- [x] `scraper/src/validators/data_merger.py` - Merge data từ nhiều nguồn

### 3.5 Scripts & Automation
- [x] `scraper/scripts/scrape_year.py` - Scrape 1 năm (tested, working)
- [x] `scraper/scripts/validate_data.py` - Validate scraped data
- [x] `scraper/scripts/export_for_app.py` - Export for mobile app
- [x] Dockerfile cho scraper

---

## PHASE 1: Core + Lunar Engine (3-4 tuần)

### 1.1 Setup Project Base
- [ ] Khởi tạo React Native project (0.73+) với `npx react-native init`
- [ ] Cấu hình TypeScript (tsconfig đã có)
- [x] Setup cấu trúc thư mục theo design doc
- [ ] Cài đặt dependencies chính (`npm install`)

### 1.2 Theme & Design System
- [x] Tạo `src/theme/colors.ts` - Color palette (Primary Green, Secondary Blue, Gradients)
- [x] Tạo `src/theme/typography.ts` - Font styles (Inter font family)
- [x] Tạo `src/theme/spacing.ts` - Spacing scale
- [ ] Setup fonts (Inter-Regular, Inter-Medium, Inter-SemiBold, Inter-Bold)

### 1.3 Navigation Setup
- [ ] `src/app/navigation/RootNavigator.tsx`
- [ ] `src/app/navigation/TabNavigator.tsx`
- [ ] 4 tab screens: Calendar, DayDetail, HolidayList, Settings

### 1.4 Lunar Calendar Engine
- [ ] `src/core/lunar/LunarCalculator.ts` - Wrapper cho lunar-javascript
- [ ] `src/core/lunar/CanChi.ts` - Tính Can Chi năm/tháng/ngày/giờ
- [ ] `src/core/lunar/TietKhi.ts` - Xác định tiết khí
- [ ] `src/core/lunar/HoangDao.ts` - Tính giờ hoàng đạo
- [x] `src/core/lunar/constants.ts` - Constants (12 Chi, 10 Can, etc.)

### 1.5 Calendar Screen (Basic)
- [ ] `src/screens/CalendarScreen/index.tsx`
- [ ] `src/screens/CalendarScreen/CalendarGrid.tsx`
- [ ] `src/screens/CalendarScreen/DayCell.tsx` - Hiển thị ngày dương + âm
- [ ] `src/screens/CalendarScreen/DayDetail.tsx` - Preview info
- [ ] `src/components/calendar/MonthHeader.tsx`
- [ ] `src/components/calendar/WeekDayHeader.tsx`
- [ ] `src/components/calendar/LunarDateBadge.tsx`

### 1.6 Testing Core Calculations
- [ ] Unit tests cho LunarCalculator
- [ ] Unit tests cho CanChi
- [ ] Cross-validate với data từ lichngaytot.com

---

## PHASE 2: Feng Shui Features (3-4 tuần)

### 2.1 28 Sao & 12 Trực
- [ ] `src/core/lunar/Star28.ts` - 28 Sao (Nhị thập bát tú) với data đầy đủ
- [ ] `src/core/lunar/Truc12.ts` - 12 Trực với ý nghĩa

### 2.2 Day Score Algorithm
- [ ] `src/core/fengshui/DayScore.ts` - Tính điểm ngày tốt (0-100%)
  - Factors: hoangDao, star28, truc12, goodStars, badStars, specialDays
  - Labels: Ngày rất tốt, Ngày tốt, Bình thường, Không tốt, Xấu

### 2.3 Activities & Directions
- [ ] `src/core/fengshui/Activities.ts` - Việc nên làm / không nên làm
- [ ] `src/core/fengshui/Directions.ts` - 16 phương hướng với rating
- [ ] `src/core/fengshui/rules/NgocHapThongThu.ts`
- [ ] `src/core/fengshui/rules/BanhToBachKy.ts`

### 2.4 Day Detail Screen Components
- [ ] `src/screens/DayDetailScreen/index.tsx` - Main screen
- [ ] `src/screens/DayDetailScreen/DayHeaderCard.tsx` - Hero card với gradient
- [ ] `src/screens/DayDetailScreen/DayScoreCircle.tsx` - Circular progress
- [ ] `src/screens/DayDetailScreen/GoodHoursSection.tsx` - Giờ tốt
- [ ] `src/screens/DayDetailScreen/TianSection.tsx` - Phần Thiên (việc nên/không nên)
- [ ] `src/screens/DayDetailScreen/DiSection.tsx` - Phần Địa (phương hướng)
- [ ] `src/screens/DayDetailScreen/InfoGrid.tsx` - Tiết khí, Trực, Hành, Sao
- [ ] `src/screens/DayDetailScreen/EventsSection.tsx` - Sự kiện

### 2.5 Common Components
- [ ] `src/components/common/DayScoreCircle.tsx` - SVG progress circle
- [ ] `src/components/common/StarRating.tsx` - 5 star rating
- [ ] `src/components/common/Tag.tsx` - Event tags
- [ ] `src/components/common/ProgressCircle.tsx`
- [ ] `src/components/calendar/ZodiacHourCard.tsx` - Giờ với con giáp
- [ ] `src/components/calendar/DirectionRow.tsx` - Phương hướng với stars
- [ ] `src/components/calendar/HoangDaoChip.tsx`

### 2.6 Zodiac Icons
- [ ] Tạo/download 12 con giáp icons (`src/assets/icons/zodiac/`)

---

## PHASE 4: Supporting Features (2 tuần)

### 4.1 Holiday List Screen
- [ ] `src/screens/HolidayListScreen/index.tsx`
- [ ] `src/core/holidays/VietnamHolidays.ts` - Ngày lễ cố định + âm lịch
- [ ] `src/core/holidays/holidayData.ts` - Data ngày lễ
- [ ] Search & filter functionality
- [ ] `src/components/common/SearchBar.tsx`

### 4.2 Settings Screen
- [ ] `src/screens/SettingsScreen/index.tsx`
- [ ] Theme settings (Light/Dark mode)
- [ ] Notification preferences
- [ ] `src/data/repositories/SettingsRepository.ts`

### 4.3 Events & Notifications
- [ ] `src/stores/useEventStore.ts` - Event state management
- [ ] Event CRUD operations
- [ ] `src/hooks/useNotifications.ts` - Local notifications
- [ ] Notification scheduling với Notifee

### 4.4 Zustand Stores
- [ ] `src/stores/useCalendarStore.ts`
- [ ] `src/stores/useSettingsStore.ts`
- [ ] `src/stores/useFengshuiStore.ts`

### 4.5 Custom Hooks
- [ ] `src/hooks/useLunarDate.ts`
- [ ] `src/hooks/useDayDetail.ts` - Full day info với TanStack Query
- [ ] `src/hooks/useFengshui.ts`
- [ ] `src/hooks/useHolidays.ts`

---

## PHASE 5: Polish & Testing (1-2 tuần)

### 5.1 Performance Optimization
- [ ] Implement caching với MMKV
- [ ] Pre-compute lookup tables (1900-2100)
- [ ] React Query staleTime configuration
- [ ] Memoization cho expensive calculations

### 5.2 Offline First
- [ ] Bundle 2-3 năm data trong app
- [ ] On-demand download cho data mới
- [ ] Sync mechanism

### 5.3 Testing
- [ ] Unit tests cho core modules
- [ ] Integration tests
- [ ] E2E tests (nếu cần)

### 5.4 Final Polish
- [ ] Animations (Reanimated)
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states

---

## Progress Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 0: Setup | ✅ Completed | 100% |
| Phase 3: Scraper | ✅ Completed | 100% |
| Phase 1: Core + Lunar | 🔄 In Progress | 25% |
| Phase 2: Feng Shui | ⏳ Pending | 0% |
| Phase 4: Supporting | ⏳ Pending | 0% |
| Phase 5: Polish | ⏳ Pending | 0% |

### Phase 3 Scraper Results
- **Data scraped**: 365 days (2025-01-01 to 2025-12-31)
- **Success rate**: 100% (0 errors)
- **Output files**:
  - `scraper/data/export/fengshui_2025.json` (305 KB)
  - `scraper/data/export/fengshui_2025.pretty.json` (465 KB)
  - `scraper/data/mobile/fengshui_2025.json.gz` (20 KB)
- **Documentation**: `docs/scraper-setup-guide.md`

---

## Tech Stack Summary

### Mobile App (React Native)
| Category | Library |
|----------|---------|
| Framework | React Native 0.73+ |
| Navigation | React Navigation 6.x |
| Calendar UI | react-native-calendars |
| Animations | React Native Reanimated 3.x |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Local Storage | MMKV, WatermelonDB |
| Notifications | Notifee |
| Lunar Calculations | lunar-javascript |

### Scraper (Python)
| Category | Library |
|----------|---------|
| HTTP Client | requests, httpx |
| HTML Parser | BeautifulSoup4, lxml |
| Data Validation | Pydantic |
| Database | SQLAlchemy, SQLite |
| Scheduling | APScheduler |

---

*Document Version: 1.3*
*Last Updated: December 15, 2024*
*Related: lich-viet-technical-doc-v2.md, scraper-design-doc.md, scraper-setup-guide.md*
