---
stepsCompleted: [1, 2, 3, 4, 7, 8, 9, 10, 11]
inputDocuments:
  - 'docs/lich-viet-technical-doc-v2.md'
  - 'docs/scraper-design-doc.md'
  - 'docs/project-plan.md'
  - 'docs/mobile-phase1-plan.md'
  - 'docs/mobile-phase2-plan.md'
  - 'docs/mobile-phase3-plan.md'
  - 'docs/mobile-phase4-plan.md'
  - 'docs/mobile-data-flow.md'
  - 'docs/scraper-setup-guide.md'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 9
workflowType: 'prd'
lastStep: 11
project_name: 'lich-viet-van-su-an-lanh'
user_name: 'Bằng Ca '
date: '2024-12-16'
---

# Product Requirements Document - lich-viet-van-su-an-lanh

**Author:** Bằng Ca
**Date:** 2024-12-16

## Executive Summary

**Lịch Việt Vạn Sự An Lành** is an existing offline-first React Native mobile app that combines Vietnamese lunar calendar with feng shui insights. This PRD defines a comprehensive **UI/UX redesign** for the Calendar and Day Detail screens to transform the app from a functional tool into a delightful daily companion.

### The Vision

Users currently have access to rich lunar calendar data and feng shui information, but the interface doesn't make this information **quick to consume** or **intuitive to navigate**. This redesign addresses four critical user needs:

1. **Glanceable Information** - Users should see today's essential feng shui info (Hoàng Đạo hours, Tiết Khí, Ngũ Hành) without tapping into details
2. **Natural Navigation** - Month browsing should feel fluid with swipe gestures + arrow buttons, matching modern calendar app expectations
3. **Visual Clarity** - Dual solar/lunar dates with color-coded weekends and special days help users quickly understand both calendar systems
4. **Daily Habit Formation** - An always-visible "today preview" widget encourages users to check the app daily for auspicious planning

### What Makes This Special

This redesign creates a **unique blend of traditional Vietnamese culture with modern mobile UX patterns**:

- **Dual-calendar mastery**: Most Vietnamese calendar apps force users to toggle between solar and lunar views. We show both simultaneously in each date cell, respecting that users think in both systems.

- **Contextual feng shui preview**: While competitors require 3-4 taps to see today's auspicious hours, we surface them immediately in the always-visible bottom widget - reducing friction for daily planning.

- **Smart visual hierarchy**: Color coding (green Saturdays, red Sundays, today's green pill) combined with lunar date positioning creates instant visual scanning - users can plan their week at a glance.

- **Gesture-first design**: Supporting both swipe and arrow navigation respects different user preferences while maintaining the speed and fluidity users expect from modern apps.

The key insight: **Users don't just want data - they want actionable guidance presented beautifully.** By keeping today's feng shui info always visible while browsing future dates, we enable the core user behavior: "Is next week good for my important event?" without losing sight of "What should I do today?"

## Project Classification

**Technical Type:** mobile_app (UI/UX enhancement to existing React Native app)
**Domain:** general (calendar/productivity with Vietnamese cultural elements)
**Complexity:** medium
**Project Context:** Brownfield - extending existing system with redesigned user interface

**Existing Architecture:**
- React Native 0.73+ cross-platform (iOS/Android)
- Zustand state management
- lunar-javascript calculation engine
- Python scraper → JSON → offline-first mobile data pipeline
- Existing screens: Calendar, Day Detail, Settings, Holiday List

**New Features Integration:**
The redesigned Calendar and Day Detail screens will leverage the existing data architecture and calculation engine. No backend or data model changes required - this is purely a **presentation layer enhancement** that makes existing data more accessible and delightful to consume.

**Technical Signals Detected:**
- Mobile app (iOS, Android, React Native)
- Offline-first architecture (already implemented)
- State management (Zustand already in use)
- Gesture handling (new requirement for swipe navigation)
- Visual design system (requires color palette, typography, spacing refinement)

## Success Criteria

### User Success

Success is achieved when users experience a **measurably better interaction** with the Vietnamese lunar calendar app:

1. **Glanceability Success**: User opens the app and immediately understands today's feng shui guidance in **< 3 seconds** without scrolling or tapping. The always-visible "today preview" widget provides instant value.

2. **Navigation Success**: User can browse multiple months to find an auspicious date for an important event using **natural swipe gestures** without thinking about how to navigate. Both swipe and arrow buttons work fluidly.

3. **Comprehension Success**: User instantly understands **both solar and lunar dates at a glance** without switching views or getting confused. The dual-date display in each calendar cell eliminates the mental friction of toggling between calendar systems.

4. **Daily Engagement Success**: User returns to the app daily because the today preview (Hoàng Đạo hours, Tiết Khí, Ngũ Hành, upcoming events) provides **immediate actionable value** before they even tap anything.

5. **Discovery Success**: User finds the "perfect day" for their wedding/business opening/important decision within **2-3 minutes** of exploration using the color-coded visual hierarchy and swipe navigation.

**The "Aha!" Moment**: When a user realizes they can see both calendar systems, weekend highlighting, and today's feng shui info all in one glance - without any taps or mode switches - they'll say **"finally, a Vietnamese calendar that just works."**

### Technical Success

The redesign is technically successful when:

1. **Performance Excellence**:
   - 60 FPS smooth animations during month transitions
   - Gesture swipe response time < 16ms (imperceptible lag)
   - Calendar render time < 100ms for instant visual feedback

2. **Cross-Platform Consistency**:
   - Identical visual design and interaction on both iOS and Android
   - No platform-specific UI glitches or layout issues
   - Gesture handling works naturally on both platforms

3. **Reliability**:
   - Zero crashes related to UI rendering or gesture handling
   - No memory leaks during month navigation
   - Lunar calculations remain accurate (validated against existing engine)

4. **Design System Integrity**:
   - Color palette, typography, spacing used consistently across both screens
   - Reusable components (day cells, cards, badges) follow single source of truth
   - Animations feel cohesive and intentional, not arbitrary

### Measurable Outcomes

**Quantitative Success Indicators**:
- Users can identify today's auspicious hours within 3 seconds of app open (measured via user testing)
- Month navigation feels "instant" with < 100ms render time
- Zero UI-related crash reports post-launch
- Both screens render identically on iOS and Android (visual regression testing)

**Qualitative Success Indicators**:
- Users describe the interface as "clean", "easy to understand", "fast"
- No user confusion about solar vs lunar dates (validated through user testing)
- Gesture navigation feels "natural" without instruction needed

## Product Scope

### MVP - Minimum Viable Product

This PRD defines a **complete redesign** of two core screens with no phased rollout. Everything described below launches together as a cohesive experience.

**Calendar Screen (Complete Redesign)**:

1. **Calendar Grid**:
   - Dual date display: Solar date (large) + Lunar date (small) in each cell
   - Color coding: Green text (Saturday), Red text (Sunday), Green pill background (Today)
   - Previous/next month dates shown in light gray
   - Special day badges: "RẰM" (full moon), etc.
   - Week header: T2, T3, T4, T5, T6, T7, CN

2. **Month Navigation**:
   - Top navigator widget: "T10/23" with left/right arrow buttons
   - Swipe gestures: Left (next month), Right (previous month)
   - Smooth animated transitions between months

3. **Today Preview Widget (Always Visible Bottom Section)**:
   - Displays TODAY's information regardless of which month is being viewed
   - Header: "Thứ Ba" (today's weekday)
   - Date summary: "24 Tháng 10, 2023 • Quý Mão"
   - Lunar date badge: "ÂM LỊCH 10/09" (green rounded badge)
   - Three quick-info icons:
     - Sun icon: "GIỜ HOÀNG ĐẠO - Tý, Dần, Mão"
     - Star icon: "TIẾT KHÍ - Sương Giáng"
     - Drop icon: "NGŨ HÀNH - Hải T.Kim"
   - Daily quote in light green card (italic text)
   - Upcoming events section ("SẮP TỚI"):
     - Event cards with date badge + name + countdown
     - Example: Pink "20/10" - "Ngày Phụ nữ VN" (4 ngày nữa)

4. **Interactions**:
   - Tap any date cell → Navigate to Day Detail Screen for that date
   - Today preview widget is informational only (not tappable)

**Day Detail Screen (Complete Redesign)**:

1. **Header Section**:
   - Back button (top left)
   - "HÔM NAY" indicator (top center with green dot)
   - Calendar icon button (top right)

2. **Hero Date Display**:
   - "THÁNG NĂM" label (green text)
   - Large day number ("45" - bold, dark blue)
   - Lunar date card (white card on right):
     - "ÂM LỊCH" label
     - Lunar date "10/4" (green)
     - Can Chi "Giáp Tý"

3. **Day Type Badge**:
   - "Chủ Nhật" (weekday - red text)
   - Orange star icon + "Ngày Hoàng Đạo" badge

4. **Quick Info Icons** (Three horizontally):
   - Sun: "GIỜ H.ĐẠO - Tý, Dần, Mão"
   - Star: "TIẾT KHÍ - Sương Giáng"
   - Drop: "NGŨ HÀNH - Hải T.Kim"

5. **Day Score Section**:
   - "CHỈ SỐ MAY MẮN" header
   - Percentage "75%" (large green text)
   - Horizontal progress bar (6 segments, gradient green to gray)
   - Quote: "Năng lượng tích cực đang lên cao"

6. **Activities Cards** (Side-by-side):
   - Left card (light green background):
     - Checkmark icon + "NÊN LÀM" header
     - Bullet list: Cưới hỏi, Động thổ, Khai trương
   - Right card (light pink background):
     - X icon + "KHÔNG NÊN" header
     - Bullet list: Kiện tụng, Xuất hành xa

7. **Good Hours Section**:
   - "Giờ Tốt" header + "Hoàng Đạo" badge (green)
   - Horizontal carousel of time slots:
     - First slot (highlighted green pill): "Tý 23-01" with dot
     - Other slots (light gray): "Sửu 01-03", "Mão 05-07", "Ngọ 11-13"

8. **Directions Section**:
   - "Hướng Xuất Hành" header
   - Compass icon (left)
   - Two columns:
     - "HỶ THẦN" - "Đông Nam" (green)
     - "TÀI THẦN" - "Bắc" (green)

9. **Events Section** ("SẮP TỚI"):
   - Event cards: Date badge + name + countdown
   - Example: Pink "20/10" - "P.Nữ VN" (4 ngày nữa)

10. **Bottom Quote**:
    - Italic text in light gray: "Người lạc quan nhìn thấy cơ hội trong mọi khó khăn."

11. **Bottom Navigation Bar**:
    - Calendar icon (active green)
    - Wand icon ("Ngày lễ")
    - Settings icon ("Cài đặt")

**Technical Implementation Requirements**:
- 60 FPS animations for all transitions
- Gesture swipe responsiveness < 16ms
- Identical rendering on iOS and Android
- Leverages existing Zustand stores and lunar-javascript engine
- No backend changes - purely presentation layer
- Design system: Standardized colors, typography, spacing, component library

**Out of Scope (Explicitly NOT in this MVP)**:
- Future enhancements, growth features, or vision items
- Changes to Settings or Holiday List screens (existing screens remain unchanged)
- Backend or data model changes
- New data scraping or calculation logic
- Home screen widgets
- Social sharing features
- Customizable themes

## User Journeys

### Journey 1: Chị Lan - The Daily Planner

Chị Lan là một bà nội trợ 45 tuổi ở Sài Gòn. Mỗi sáng, trước khi gia đình thức dậy, chị pha ly cà phê và mở app lịch để xem hôm nay có gì đặc biệt. Chồng chị hay hỏi "Hôm nay giờ nào tốt để ký hợp đồng?" và các con thì thắc mắc "Mẹ ơi, tuần sau có ngày lễ nào không?"

Chị mở **Lịch Việt Vạn Sự An Lành** và ngay lập tức thấy phần "Thứ Ba" ở dưới cùng màn hình - không cần tap gì cả. Giờ Hoàng Đạo hôm nay là "Tý, Dần, Mão" hiện rõ ràng. Chị biết ngay chồng nên ký hợp đồng lúc 5-7 giờ sáng (giờ Mão). Tiết Khí là "Sương Giáng" - chị nhớ phải nhắc mẹ chồng mặc ấm.

Chị vuốt qua trái để xem tháng sau, tìm ngày tốt cho việc cúng giỗ. Mỗi ô ngày đều hiện **cả ngày dương và ngày âm** - không cần chuyển qua chuyển lại như app cũ. Thấy ngày 15 âm (Rằm) đánh dấu rõ ràng, chị tap vào để xem chi tiết.

Màn hình Day Detail mở ra với chỉ số may mắn 75% - "Năng lượng tích cực đang lên cao". Phần "Nên Làm" hiện Cúng giỗ ✓. Chị chụp màn hình gửi cho chồng: "Anh ơi, ngày này làm giỗ ông nội được nè!"

**Khoảnh khắc "Aha!"**: Chị nhận ra mình có thể xem lịch tháng sau trong khi **vẫn thấy thông tin hôm nay** ở phần dưới. Không còn lo quên giờ tốt hôm nay khi đang tìm ngày cho sự kiện tương lai.

---

### Journey 2: Anh Minh - The Event Planner

Anh Minh là chủ một cửa hàng điện thoại ở Đà Nẵng, 32 tuổi. Tháng tới anh muốn khai trương chi nhánh mới. Bố anh dặn: "Con phải chọn ngày Hoàng Đạo, giờ tốt, hướng xuất hành hợp với Tài Thần!"

Anh mở app và bắt đầu vuốt qua các tháng. Tốc độ chuyển tháng mượt mà - không bị lag như app cũ. Anh dừng ở tháng 11, scan nhanh bằng mắt: **Chủ Nhật đỏ, Thứ Bảy xanh** dễ nhận biết. Anh cần ngày trong tuần để khai trương (khách đông hơn).

Tap vào ngày 15/11, màn hình chi tiết hiện ra. Chỉ số may mắn **85%** - màu xanh sáng. Phần "Nên Làm" có **Khai trương** ✓. Anh cuộn xuống xem Giờ Tốt: "Tý 23-01" được highlight xanh. Hướng Xuất Hành: Tài Thần → **Đông Nam** - đúng hướng cửa hàng mới!

Anh so sánh với ngày 16/11 - chỉ số chỉ 60%, không có "Khai trương" trong Nên Làm. Quyết định chọn ngày 15.

**Khoảnh khắc "Aha!"**: Anh nhận ra mình có thể so sánh nhiều ngày nhanh chóng bằng cách tap → back → tap ngày khác. Không cần ghi chép ra giấy như trước. Tất cả thông tin cần thiết (giờ tốt, hướng, việc nên làm) đều ở một màn hình.

---

### Journey 3: Em Hương - The Curious Explorer

Em Hương là sinh viên 20 tuổi ở Hà Nội, mới bắt đầu quan tâm đến văn hóa truyền thống sau khi nghe bà ngoại kể chuyện. Em download app vì tò mò muốn hiểu "Tiết Khí", "Ngũ Hành", "Hoàng Đạo" là gì.

Lần đầu mở app, em thấy lưới lịch quen thuộc nhưng có điểm khác: mỗi ô có **hai số** - số lớn (dương lịch) và số nhỏ (âm lịch). "À, hóa ra hôm nay là mùng 10 âm!" - em chưa bao giờ biết cách đọc âm lịch.

Phần dưới màn hình hiện "GIỜ HOÀNG ĐẠO - Tý, Dần, Mão" với icon mặt trời. Em tap vào ngày hôm nay để tìm hiểu thêm. Màn hình chi tiết giải thích: Giờ Tốt Hoàng Đạo được highlight với khung giờ cụ thể (23-01, 03-05, 05-07).

Em thấy phần "TIẾT KHÍ - Sương Giáng" và google để hiểu thêm. Dần dần, qua vài tuần sử dụng, em bắt đầu hiểu pattern: 24 tiết khí trong năm, mỗi tiết ~15 ngày. Em screenshot gửi cho bà: "Bà ơi, con biết xem tiết khí rồi nè!"

**Khoảnh khắc "Aha!"**: Em nhận ra app không chỉ là công cụ xem ngày mà còn là cách **học văn hóa truyền thống** qua giao diện hiện đại, dễ hiểu. Các thuật ngữ có icon trực quan, không đáng sợ như sách vở.

---

### Journey Requirements Summary

**Capabilities Revealed by Journeys:**

| Journey | User Need | Required Capability |
|---------|-----------|---------------------|
| Chị Lan | Quick daily reference | Today Preview Widget (always visible) |
| Chị Lan | Family coordination | Screenshot-friendly UI |
| Chị Lan | Browse future while seeing today | Persistent today widget during navigation |
| Anh Minh | Compare multiple dates | Fast month navigation, smooth transitions |
| Anh Minh | Business decisions | Day Score, Directions, Activity recommendations |
| Anh Minh | Quick date comparison | Tap → detail → back flow |
| Em Hương | Learn traditional culture | Visual hierarchy, clear iconography |
| Em Hương | Understand dual calendars | Dual date display in each cell |
| Em Hương | Explore at own pace | Non-intimidating UI, familiar patterns |

**Core UI Components from Journeys:**

1. **Calendar Grid**: Dual date display, color-coded weekends, month swipe navigation
2. **Today Preview Widget**: Always visible, shows Giờ Hoàng Đạo, Tiết Khí, Ngũ Hành
3. **Day Detail Screen**: Day Score, Nên Làm/Không Nên, Giờ Tốt carousel, Hướng Xuất Hành
4. **Navigation**: Swipe gestures + arrow buttons, smooth 60 FPS transitions

## Mobile App Specific Requirements

### Project-Type Overview

**Lịch Việt Vạn Sự An Lành** is a cross-platform React Native mobile application (iOS & Android) implementing a UI/UX redesign. This is a brownfield enhancement to an existing offline-first architecture.

**Key Technical Decisions (Already Made):**
- Cross-platform: React Native 0.73+ (single codebase for iOS & Android)
- State Management: Zustand (already implemented)
- Offline-first: Data bundled with app, lunar-javascript for calculations
- No backend changes: Purely presentation layer enhancement

### Platform Requirements

**iOS:**
- Minimum iOS version: 13.0+ (to support modern SwiftUI-style animations)
- Support for both iPhone and iPad layouts
- Gesture handling via React Native Gesture Handler
- App Store compliance: Privacy policy, data collection disclosure

**Android:**
- Minimum Android SDK: API 24 (Android 7.0+)
- Material Design 3 compatibility
- Support for various screen sizes (phones and tablets)
- Play Store compliance: Privacy policy, target API level requirements

**Cross-Platform Consistency:**
- Identical visual design on both platforms
- Same gesture behavior (swipe left/right for month navigation)
- Consistent typography and color rendering
- Platform-appropriate haptic feedback (where available)

### Device Permissions

**Required Permissions:**
- None for core functionality (calendar viewing is permission-free)

**Optional Permissions (Future consideration):**
- Calendar access: If adding event sync feature (not in scope)
- Notifications: If adding daily reminder feature (not in scope)

**Current MVP: Zero permission requests** - enhances user trust and simplifies onboarding.

### Offline Mode

**Fully Offline-First Architecture:**
- All lunar calculations performed locally via `lunar-javascript`
- Feng shui data (2-3 years) bundled with app at build time
- No network requests required for core functionality
- Vietnamese holidays pre-bundled

**Data Bundling Strategy:**
- Gzipped JSON files (~20-50KB per year)
- Bundled years: 2024, 2025, 2026 (current ± 1 year)
- Lazy loading for additional years if needed

**Offline Guarantees:**
- 100% functionality available without internet
- No loading spinners or connectivity errors
- Instant app launch with immediate data display

### Store Compliance

**App Store (iOS):**
- No in-app purchases (free app)
- No third-party SDKs requiring disclosure
- Privacy Nutrition Label: No data collected
- Age rating: 4+ (no objectionable content)

**Play Store (Android):**
- Target SDK API 34+ (Android 14)
- Data safety section: No user data collected
- Content rating: Everyone
- Vietnamese locale support

### Technical Architecture Considerations

**Performance Requirements (from Success Criteria):**
- 60 FPS animations during month transitions
- < 16ms gesture response time
- < 100ms calendar render time
- Zero memory leaks during navigation

**Component Architecture:**
- Reusable `DayCell` component (60+ instances per month view)
- `React.memo` for DayCell to prevent unnecessary re-renders
- Virtualized list for horizontal month swiping
- Pre-computed day scores on data load (not on render)

**Gesture Handling:**
- `react-native-gesture-handler` for swipe detection
- Pan gesture with velocity tracking for natural feel
- Simultaneous tap detection (day selection + swipe navigation)

**Design System Integration:**
- Standardized color palette (greens, reds, grays)
- Typography scale (Vietnamese text support)
- Spacing system (consistent padding/margins)
- Component library for reusable UI elements

### Implementation Considerations

**What's In Scope:**
- Calendar Screen complete redesign
- Day Detail Screen complete redesign
- Bottom Navigation Bar (shared component)
- Design system tokens (colors, typography, spacing)

**What Leverages Existing:**
- Zustand stores (current date, settings)
- lunar-javascript calculations
- Pre-bundled feng shui data
- Navigation stack (React Navigation)

**What's Out of Scope:**
- Settings screen changes
- Holiday List screen changes
- Push notifications
- Widget support
- Backend/API changes

## Project Scoping & Development Approach

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP
This redesign focuses on delivering the **key user experience** (glanceable feng shui info, natural navigation, dual calendar display) with the existing robust backend. The goal is to transform how users interact with data they already have access to.

**Scope Classification:** Simple/Focused MVP
- 2 screens (Calendar Screen, Day Detail Screen)
- Presentation layer only (no backend changes)
- Single-phase launch (no phased rollout)
- Leverages existing data pipeline and calculation engine

**Resource Requirements:**
- 1 React Native developer (full-time)
- Design system tokens (colors, typography, spacing) defined upfront

### MVP Feature Set

**Core User Journeys Supported:**
All 3 user journeys (Daily Planner, Event Planner, Curious Explorer) are fully supported by the MVP. No journey is deferred.

**Must-Have Capabilities:**
1. Dual date display (solar + lunar) in calendar grid
2. Color-coded weekends (green Saturday, red Sunday)
3. Today highlight (green pill background)
4. Month swipe navigation + arrow buttons
5. Always-visible Today Preview Widget
6. Day Detail with Day Score, Activities, Good Hours, Directions
7. 60 FPS smooth animations
8. Bottom Navigation Bar

**Explicit Exclusions (Out of Scope):**
- Settings screen changes
- Holiday List screen changes
- Push notifications
- Home screen widgets
- Social sharing
- Customizable themes
- Backend/API changes

### Development Approach

**Single-Phase Launch:**
This MVP launches as a complete, cohesive experience. There is no phased rollout - all redesigned elements ship together to ensure consistent UX.

**No Post-MVP Planning:**
Per stakeholder decision, future enhancements and growth features are not documented in this PRD. The focus is exclusively on the current UI/UX redesign.

### Risk Assessment

**Technical Risks:**

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 60 FPS animation target | Medium | Use `react-native-reanimated` for native driver animations; profile early |
| Gesture conflicts (swipe vs tap) | Low | Use `react-native-gesture-handler` with proper gesture exclusivity |
| Cross-platform visual differences | Low | Test on both iOS and Android throughout development |

**Resource Risks:**

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Scope creep | Medium | Strict adherence to documented MVP scope; defer feature requests |
| Design system inconsistency | Low | Define tokens upfront; use theme provider |

## Functional Requirements

### Calendar View & Navigation

- FR1: User can view a monthly calendar grid displaying all days of the current month
- FR2: User can see both solar (Gregorian) date and lunar date displayed simultaneously in each day cell
- FR3: User can distinguish weekends visually through color-coded text (Saturday green, Sunday red)
- FR4: User can identify today's date through a highlighted visual indicator (green pill background)
- FR5: User can see previous/next month dates displayed in muted style at the start/end of the calendar grid
- FR6: User can navigate to previous month using left arrow button or right swipe gesture
- FR7: User can navigate to next month using right arrow button or left swipe gesture
- FR8: User can see the current month and year displayed in a header widget
- FR9: User can see week day headers (T2, T3, T4, T5, T6, T7, CN) above the calendar grid
- FR10: User can see special day badges (e.g., "RẰM" for full moon) on relevant dates

### Today Preview Widget

- FR11: User can view today's information in a persistent bottom widget regardless of which month is being browsed
- FR12: User can see today's weekday name displayed prominently
- FR13: User can see today's full date with year and Can Chi (干支)
- FR14: User can see today's lunar date in a visually distinct badge
- FR15: User can see today's Giờ Hoàng Đạo (auspicious hours) with icon
- FR16: User can see today's Tiết Khí (solar term) with icon
- FR17: User can see today's Ngũ Hành (five elements) with icon
- FR18: User can see a daily inspirational quote
- FR19: User can see upcoming Vietnamese holidays with countdown ("X ngày nữa")

### Day Detail View

- FR20: User can tap any day cell to navigate to that day's detail screen
- FR21: User can return to calendar view via back navigation
- FR22: User can see if the viewed day is today through a visual indicator
- FR23: User can see the hero date display with month name and large day number
- FR24: User can see the lunar date with Can Chi in a distinct card
- FR25: User can see the weekday name and day type badge (e.g., "Ngày Hoàng Đạo")
- FR26: User can see the day's Giờ Hoàng Đạo, Tiết Khí, and Ngũ Hành in quick-info format
- FR27: User can see the day's luck score (Chỉ Số May Mắn) as a percentage with visual progress bar
- FR28: User can see a contextual message describing the day's energy
- FR29: User can see recommended activities ("Nên Làm") for the day in a card
- FR30: User can see activities to avoid ("Không Nên") for the day in a card
- FR31: User can see auspicious hours (Giờ Tốt) in a horizontal scrollable list with time ranges
- FR32: User can identify the current auspicious hour through visual highlighting
- FR33: User can see auspicious directions (Hướng Xuất Hành) for Hỷ Thần and Tài Thần
- FR34: User can see upcoming holidays/events with countdown from the day detail view
- FR35: User can see a daily quote at the bottom of the detail view

### App Navigation

- FR36: User can access Calendar screen via bottom navigation
- FR37: User can access Holiday List screen via bottom navigation
- FR38: User can access Settings screen via bottom navigation
- FR39: User can see which screen is currently active in bottom navigation

### Data & Content

- FR40: System provides accurate lunar date calculations for any date
- FR41: System provides Can Chi (干支) for each day
- FR42: System provides day quality score calculation for each day
- FR43: System provides list of recommended/avoid activities for each day
- FR44: System provides auspicious hours calculation for each day
- FR45: System provides auspicious directions for each day
- FR46: System provides Vietnamese holiday data with dates and names
- FR47: System provides daily inspirational quotes
- FR48: System provides Tiết Khí (24 solar terms) for each day
- FR49: System provides Ngũ Hành (five elements) for each day

## Non-Functional Requirements

### Performance

**Animation & Responsiveness:**
- NFR1: Month transition animations maintain 60 FPS on devices from 2018 onwards
- NFR2: Gesture swipe response time < 16ms from touch to visual feedback
- NFR3: Calendar grid renders within 100ms of screen display
- NFR4: Day Detail screen loads within 150ms from tap

**App Launch:**
- NFR5: Cold start to usable calendar screen < 2 seconds
- NFR6: Warm start (from background) < 500ms

**Memory & Stability:**
- NFR7: App memory usage < 150MB during normal operation
- NFR8: No memory leaks during 30 minutes of continuous month navigation
- NFR9: Zero UI-related crashes in production

### Reliability

**Offline Operation:**
- NFR10: 100% of core functionality works without network connectivity
- NFR11: App launches and operates normally in airplane mode
- NFR12: All bundled data (2024-2026) accessible without download

**Data Accuracy:**
- NFR13: Lunar date calculations accurate to 100% (validated against lunar-javascript)
- NFR14: Can Chi (干支) calculations accurate for any date in supported range
- NFR15: Holiday dates correct per official Vietnamese calendar

### Usability

**Visual Clarity:**
- NFR16: Dual dates (solar/lunar) readable at arm's length on 4.7" screens
- NFR17: Weekend color coding distinguishable by color-blind users (sufficient contrast)
- NFR18: Today indicator visible without scanning entire calendar

**Cross-Platform Consistency:**
- NFR19: Identical visual design on iOS and Android (< 5% visual deviation)
- NFR20: Same gesture behavior on both platforms
- NFR21: Consistent typography rendering across devices

### Compatibility

**Platform Support:**
- NFR22: iOS 13.0+ support (covers 95%+ of active iOS devices)
- NFR23: Android API 24+ support (Android 7.0+, covers 95%+ of active Android devices)
- NFR24: iPhone SE (4.7") to iPad Pro (12.9") screen sizes supported
- NFR25: Android phones and tablets with various aspect ratios supported

**Locale:**
- NFR26: Full Vietnamese language support throughout UI
- NFR27: Vietnamese diacritics render correctly on all supported devices
