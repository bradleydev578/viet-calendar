---
stepsCompleted: [1, 2, 3, 4, 7, 8, 9, 10, 11]
inputDocuments:
  - 'docs/prd.md'
  - 'docs/project_context.md'
  - 'docs/architecture.md'
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 3
workflowType: 'prd'
lastStep: 11
workflowStatus: 'complete'
completedAt: '2025-01-10'
project_name: 'Firebase Analytics Integration - Lịch Việt Vạn Sự An Lành'
user_name: 'Bằng Ca'
date: '2025-01-10'
---

# Product Requirements Document - Firebase Analytics Integration

**Author:** Bằng Ca
**Date:** 2025-01-10

## Executive Summary

**Firebase Analytics Integration** cho Lịch Việt Vạn Sự An Lành - một lớp instrumentation toàn diện để đo lường hành vi người dùng, engagement depth, và chuẩn bị cho các quyết định monetization trong tương lai.

### The Vision

App hiện tại hoạt động hoàn toàn offline với UI/UX được redesign, nhưng **không có visibility** vào cách users thực sự tương tác với các tính năng. Analytics integration này sẽ trả lời những câu hỏi quan trọng:

1. **Engagement Depth** - Users có thực sự đọc Day Detail hay chỉ lướt qua Today Widget?
2. **Feature Adoption** - Compass, Search Good Day, Auspicious Hours được dùng như thế nào?
3. **Retention Patterns** - Điều gì khiến users quay lại hàng ngày?
4. **Monetization Readiness** - Data để inform ads vs subscription decision

### What Makes This Special

Đây không phải analytics "track everything" thông thường. Chúng ta thiết kế với mục tiêu cụ thể:

- **Depth over Breadth**: Đo lường chiều sâu engagement cho MỖI màn hình - không chỉ "user visited" mà là "user engaged meaningfully"
- **Actionable Definitions**: Engaged user = xem Day Detail ≥3 lần/tuần, Churned = không mở app 14 ngày
- **Funnel-First Design**: Track complete user journeys, không chỉ isolated events
- **Monetization-Ready**: Events structure sẵn sàng cho ads/subscription tracking khi cần

### Key Insight Question

> "Users có thực sự sử dụng Day Detail screen hay chỉ lướt qua Today Widget?"

Câu hỏi này áp dụng cho MỌI screen trong app - và analytics này được thiết kế để trả lời chính xác câu hỏi đó.

## Project Classification

**Technical Type:** mobile_app (SDK integration to existing React Native app)
**Domain:** general (calendar/lifestyle)
**Complexity:** low-medium
**Project Context:** Brownfield - adding analytics layer to existing system

**Existing Architecture:**
- React Native 0.77 with New Architecture
- Offline-first with bundled JSON data
- Zustand state management
- No current analytics or network tracking

**New Integration:**
- Firebase Analytics SDK for React Native
- Event tracking layer across all screens
- User properties for segmentation
- Conversion events for key actions

## Success Criteria

### User Success

Analytics integration này phục vụ **product owner** (bạn) chứ không phải end-users trực tiếp. User success được định nghĩa qua khả năng analytics trả lời các câu hỏi về user behavior:

**Success khi bạn có thể trả lời:**
- "Bao nhiêu % users thực sự xem Day Detail vs chỉ lướt Today Widget?"
- "Feature nào được dùng nhiều nhất? Ít nhất?"
- "Users spend bao lâu ở mỗi screen?"
- "User journey phổ biến nhất là gì?"

**Engagement Definitions (Actionable):**
- **Engaged User:** Xem Day Detail ≥3 lần/tuần
- **Churned User:** Không mở app trong 14 ngày
- **Power User:** Sử dụng ≥3 features khác nhau/tuần

### Technical Success

Analytics integration hoàn thành khi:

1. **Data Collection Works:**
   - Events xuất hiện trong Firebase Console trong vòng 24h sau user action
   - Tất cả defined events được track đúng với parameters
   - User properties được set và update chính xác

2. **Reporting Functional:**
   - Custom dashboard có thể tạo trong Firebase Console
   - Funnels hoạt động đúng (Activation, Daily Engagement, Feature Discovery)
   - Retention cohorts hiển thị chính xác

3. **No Performance Impact:**
   - App startup time không tăng >100ms
   - No crashes liên quan đến analytics
   - Offline events được queue và sync khi có network

### Measurable Outcomes

**Baseline Phase (First 2 weeks):**
- Collect enough data to establish baseline metrics
- No specific targets - goal is to LEARN

**After Baseline Established:**
- Weekly review của Feature Adoption Rate
- Weekly review của Session Depth metrics
- Monthly review của Retention patterns

**Data Quality Targets:**
- ≥95% events logged successfully (no missing data)
- ≤1% error rate in event parameters
- 100% screens instrumented with view events

## Product Scope

### MVP - Phase 1: Core Analytics

**Firebase SDK Setup:**
- Install @react-native-firebase/app
- Install @react-native-firebase/analytics
- Configure for iOS and Android
- Verify events in DebugView

**Core Events (~18 events):**

| Event | Purpose |
|-------|---------|
| `app_open` | DAU tracking |
| `screen_view` | Screen popularity |
| `view_today` | Today Widget engagement |
| `view_day_detail` | Primary engagement metric |
| `view_month_calendar` | Calendar usage |
| `view_compass` | Compass feature adoption |
| `view_auspicious_hours` | Feature adoption |
| `navigate_month` | Navigation patterns |
| `select_date` | User intent signals |
| `first_open` | New user tracking |
| `session_start` | Session tracking (auto) |
| `session_end` | Session duration (auto) |

**User Properties:**
- `user_type`: free (future: premium)
- `days_since_install`: Cohort analysis
- `app_version`: Version tracking

**Conversion Events (mark in Console):**
- `view_day_detail` - Primary engagement
- `first_open` - Acquisition

**Key Funnels:**
1. Activation: `first_open` → `view_today` → `view_day_detail`
2. Daily Engagement: `app_open` → `view_today` → `view_day_detail`

### Phase 2: Feature & Content Analytics (Post-MVP)

**Additional Events:**
- `view_activity_detail` - Content interest
- `expand_section` - UI engagement depth
- `share_day_info` - Viral potential
- `search_good_day` - Search feature usage
- `view_search_results` - Search effectiveness
- `rotate_compass` - Compass engagement depth

**Additional User Properties:**
- `total_day_details_viewed` - Engagement level
- `preferred_feature` - Most used feature
- `notification_enabled` - Push permission status

**Additional Funnels:**
- Feature Discovery: `view_today` → secondary features

### Phase 3: Monetization Analytics (Future)

**Events (when needed):**
- `ad_impression`, `ad_click` - If ads implemented
- `premium_prompt_view`, `premium_prompt_click` - If subscription
- `purchase_start`, `purchase_complete` - Revenue tracking

### Explicit Exclusions

**NOT in any phase:**
- Server-side analytics (app is offline-first)
- A/B testing infrastructure
- User PII collection
- Cross-device tracking
- Third-party analytics SDKs (only Firebase)

## User Journeys

### Journey 1: Bằng Ca - The Data-Driven Product Owner

Bằng Ca là founder của Lịch Việt Vạn Sự An Lành, một ứng dụng lịch Việt với hàng ngàn downloads. App đã hoàn thành UI/UX redesign với nhiều features: Today Widget, Day Detail, Compass, Auspicious Hours. Nhưng có một câu hỏi luôn ám ảnh: "Users có thực sự dùng những features này, hay họ chỉ mở app rồi đóng?"

Một buổi sáng thứ Hai, Bằng Ca mở Firebase Console cùng với ly cà phê. Dashboard hiện lên với những con số rõ ràng: **2,847 DAU** tuần trước. Anh click vào Events và thấy ngay insight đầu tiên - `view_today` có 2,500 events nhưng `view_day_detail` chỉ có 800. "Hmm, chỉ 32% users đi sâu hơn Today Widget..."

Anh mở Funnel "Daily Engagement" và thấy drop-off rõ ràng: 100% users thấy Today → 32% vào Day Detail → 15% xem Auspicious Hours. "Vậy là phần lớn users chỉ cần thông tin quick glance. Có lẽ Today Widget cần thêm content thay vì push users vào Day Detail."

Cuối tuần, anh review Retention report: D1 = 45%, D7 = 28%, D30 = 12%. "D7 khá tốt cho calendar app. Nhưng D30 cần improve." Anh tạo note: "Cần push notification để remind users quay lại."

**Khoảnh khắc "Aha!"**: Khi anh nhận ra rằng Compass feature chỉ có 5% adoption rate. "Có lẽ Compass không phải là killer feature mình nghĩ. Nên focus vào cải thiện Today Widget thay vì đầu tư thêm vào Compass."

---

### Journey 2: Bằng Ca - Weekly Product Review

Mỗi Chủ Nhật tối, Bằng Ca dành 30 phút review tuần qua. Anh mở Firebase Console và bắt đầu với câu hỏi: "Tuần này có gì khác?"

**Step 1: Check DAU trend**
Anh so sánh DAU tuần này vs tuần trước. Thấy spike vào thứ 5 - "À, đó là ngày Rằm, users check nhiều hơn."

**Step 2: Feature Adoption**
Click vào Events breakdown:
- `view_today`: 18,000 events (+5%)
- `view_day_detail`: 5,400 events (+12%)
- `view_compass`: 900 events (-3%)
- `view_auspicious_hours`: 2,100 events (+8%)

"Day Detail tăng 12%! Có lẽ UI improvement đang work."

**Step 3: User Properties Analysis**
Filter by `days_since_install` để xem new vs returning users behavior. New users (<7 days) có engagement rate thấp hơn 20% so với returning users.

**Step 4: Document Insights**
Anh ghi lại 3 key insights vào notes để plan tuần tới:
1. Rằm days = peak usage → có thể push notification vào những ngày này
2. Day Detail engagement đang improve
3. New user onboarding cần work

---

### Journey 3: Developer - Implementing Analytics

Developer nhận task "Integrate Firebase Analytics" với PRD specs. Anh bắt đầu:

**Day 1: SDK Setup**
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
cd ios && pod install
```
Configure `GoogleService-Info.plist` cho iOS và `google-services.json` cho Android. Run app và check DebugView - thấy `first_open` event → SDK works!

**Day 2: Core Events Implementation**
Tạo `src/services/analytics.ts` với helper functions:
```typescript
export const trackScreenView = (screenName: string) => {
  analytics().logScreenView({ screen_name: screenName });
};
```
Add `trackScreenView` vào mỗi screen's `useEffect`. Run app, navigate between screens, check DebugView - all events firing correctly.

**Day 3: Custom Events**
Implement `view_day_detail` với parameters:
```typescript
analytics().logEvent('view_day_detail', {
  date: '2025-01-10',
  lunar_date: '11/12',
  day_score: 85,
  source: 'calendar_tap'
});
```

**Day 4: Testing & Verification**
- Test offline mode: events queue properly
- Test on both iOS and Android simulators
- Verify events in Firebase Console (wait 24h for non-debug data)
- Check no performance regression (app startup still <2s)

**Khoảnh khắc "Done!"**: Khi tất cả events xuất hiện trong Firebase Console với correct parameters, và app performance không bị ảnh hưởng.

---

### Journey 4: Bằng Ca - Investigating a Problem

Một ngày, Bằng Ca nhận feedback từ user: "App chậm quá!" Anh cần investigate.

**Step 1: Check for Anomalies**
Mở Firebase Console, filter events by last 7 days. Thấy `session_end` duration trung bình tăng từ 45s lên 120s. "Hmm, users ở lại lâu hơn - nhưng đó là good hay bad?"

**Step 2: Cross-reference with Crashes**
Check Firebase Crashlytics (nếu có): No new crashes. Vậy không phải crash issue.

**Step 3: Analyze User Flow**
Xem funnel: Users đang stuck ở `view_month_calendar` lâu hơn bình thường. "Có lẽ swipe navigation đang lag?"

**Step 4: Hypothesis & Action**
Anh tạo task cho developer: "Investigate Calendar swipe performance" và add event mới `calendar_swipe_duration` để track trong tương lai.

**Kết quả**: Data giúp narrow down problem từ "app chậm" thành "Calendar swipe cần optimize" - actionable insight!

---

### Journey Requirements Summary

**Capabilities Revealed by Journeys:**

| Journey | User Need | Required Capability |
|---------|-----------|---------------------|
| Product Owner - Daily Check | Quick DAU overview | Dashboard with key metrics visible |
| Product Owner - Weekly Review | Trend analysis | Week-over-week comparison |
| Product Owner - Weekly Review | Feature adoption | Events breakdown by screen/action |
| Product Owner - Investigation | Problem diagnosis | Filter/segment by time, user properties |
| Developer - Implementation | Easy SDK integration | Clear event naming, helper functions |
| Developer - Implementation | Debug capability | DebugView real-time events |
| Developer - Implementation | Offline support | Event queuing when no network |

**Core Analytics Components from Journeys:**

1. **Event Tracking Layer**: Helper functions for consistent event logging
2. **Screen View Tracking**: Automatic on every screen mount
3. **Custom Event Parameters**: date, source, scores for rich analysis
4. **User Properties**: Segmentation by install date, app version
5. **Offline Queue**: Events stored and synced when online
6. **Debug Mode**: Real-time event verification during development

## Mobile App Specific Requirements

### Project-Type Overview

**Lịch Việt Vạn Sự An Lành** là React Native cross-platform app (iOS + Android) đang thêm Firebase Analytics layer. App hiện tại hoạt động 100% offline với bundled data.

### Platform Requirements

**Supported Platforms:**

| Platform | Min Version | Target |
|----------|-------------|--------|
| iOS | 13.0+ | Latest stable |
| Android | API 24 (7.0+) | API 34 |

**React Native Firebase Requirements:**
- @react-native-firebase/app: ^18.x or ^21.x
- @react-native-firebase/analytics: matching version
- iOS: CocoaPods integration required
- Android: google-services plugin required

### Device Permissions

**Current Permissions (No change):**
- Compass/Magnetometer: Optional, for feng shui directions

**New Permissions for Analytics:**
- **Internet Access**: Required for sending analytics data
  - iOS: Automatic (no explicit permission needed)
  - Android: `INTERNET` permission (auto-granted, no user prompt)
- **No additional user-facing permissions required**

### Offline Mode

**Firebase Analytics Offline Behavior:**
- Events are queued locally when device is offline
- Automatic sync when network becomes available
- Default queue limit: ~500 events
- Events older than ~72 hours may be dropped

**Implementation Approach:**
- Use Firebase default offline behavior (no customization needed)
- App continues to function normally regardless of network state
- Analytics is "fire and forget" - no user-facing impact

**Critical Requirement:**
- Analytics layer MUST NOT block app functionality
- Analytics failures should fail silently (no error dialogs)
- App startup time impact < 100ms

### Store Compliance

**App Store (iOS) Requirements:**

1. **App Privacy Details (Nutrition Label):**
   - Data Linked to You: None
   - Data Not Linked to You:
     - Usage Data (App interactions, feature usage)
     - Diagnostics (Crash data, performance data)
   - Purpose: Analytics

2. **App Tracking Transparency (ATT):**
   - NOT required if using Firebase Analytics only
   - Firebase Analytics does not use IDFA by default
   - No ATT prompt needed for this implementation

**Play Store (Android) Requirements:**

1. **Data Safety Section:**
   - Data collected: App activity, App info and performance
   - Data NOT collected: Location, Personal info, Financial info
   - Data is NOT shared with third parties
   - Data is NOT processed ephemerally

2. **Privacy Policy Link:**
   - Required in Play Console listing
   - Must be accessible from within the app

### Privacy Policy Update Required

**Current Policy States:**
> "Ứng dụng KHÔNG thu thập bất kỳ thông tin cá nhân nào"
> "Không theo dõi hoạt động người dùng"

**Required Updates for PRIVACY_POLICY.md:**

Add new section for Analytics (Vietnamese):

```markdown
### Thu thập dữ liệu phân tích (Analytics)

Ứng dụng sử dụng **Firebase Analytics** (Google) để thu thập dữ liệu sử dụng ẩn danh nhằm cải thiện trải nghiệm người dùng.

**Dữ liệu được thu thập:**
- Thông tin thiết bị (hệ điều hành, phiên bản, kích thước màn hình)
- Phiên bản ứng dụng
- Các màn hình được xem và tính năng được sử dụng
- Thời gian sử dụng ứng dụng

**Dữ liệu KHÔNG thu thập:**
- Tên, email, số điện thoại hoặc thông tin cá nhân
- Vị trí địa lý
- Nội dung bạn xem (ngày cụ thể, thông tin phong thủy)

**Mục đích:**
- Hiểu cách người dùng sử dụng ứng dụng
- Cải thiện tính năng dựa trên hành vi sử dụng
- Tối ưu hiệu suất ứng dụng

**Quyền của bạn:**
- Dữ liệu được thu thập ẩn danh, không liên kết với danh tính cá nhân
```

Add new section for Analytics (English):

```markdown
### Analytics Data Collection

This app uses **Firebase Analytics** (Google) to collect anonymous usage data to improve user experience.

**Data Collected:**
- Device information (OS, version, screen size)
- App version
- Screens viewed and features used
- App usage duration

**Data NOT Collected:**
- Name, email, phone number or personal information
- Geographic location
- Content you view (specific dates, feng shui information)

**Purpose:**
- Understand how users interact with the app
- Improve features based on usage patterns
- Optimize app performance

**Your Rights:**
- Data collected is anonymous and not linked to personal identity
```

### Implementation Considerations

**SDK Integration Checklist:**
1. [ ] Create Firebase project in Firebase Console
2. [ ] Download `GoogleService-Info.plist` (iOS)
3. [ ] Download `google-services.json` (Android)
4. [ ] Install @react-native-firebase/app
5. [ ] Install @react-native-firebase/analytics
6. [ ] Configure iOS (Podfile, AppDelegate)
7. [ ] Configure Android (build.gradle, MainApplication)
8. [ ] Verify with DebugView before release

**Testing Requirements:**
- Test on both iOS and Android devices/simulators
- Verify events appear in Firebase DebugView
- Test offline → online event sync
- Verify no performance regression
- Test app store builds (not just debug builds)

**Release Checklist:**
- [ ] Update Privacy Policy in app
- [ ] Update Privacy Policy on website (if any)
- [ ] Update App Store privacy nutrition label
- [ ] Update Play Store data safety section
- [ ] Remove DebugView logging from release builds

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP
- Solve the core problem: "No visibility into user behavior"
- Minimal features to answer key questions about engagement depth
- Focus on data collection infrastructure, not complex analytics

**Resource:** Solo developer (Bằng Ca)
**Timeline:** Flexible, no fixed deadline

### MVP Feature Set (Phase 1)

**Core Deliverables:**
1. Firebase SDK integration (iOS + Android)
2. ~12 core events implemented:
   - `app_open`, `first_open`
   - `screen_view` (all screens)
   - `view_today`, `view_day_detail`, `view_month_calendar`
   - `view_compass`, `view_auspicious_hours`
   - `navigate_month`, `select_date`
3. 3 User Properties: `user_type`, `days_since_install`, `app_version`
4. 2 Conversion Events marked in Console
5. 2 Key Funnels configured

**User Journeys Supported:**
- Product Owner can view DAU and feature adoption in Firebase Console
- Product Owner can analyze engagement depth (Today vs Day Detail)
- Developer can verify events via DebugView

**Definition of Done for MVP:**
- [ ] All core events firing correctly (verified in DebugView)
- [ ] Events appearing in Firebase Console (24h after implementation)
- [ ] No performance regression (app startup < 2s)
- [ ] Privacy Policy updated
- [ ] Store listings updated (privacy labels)

### Post-MVP Features

**Phase 2 - Enhanced Analytics (When needed):**
- Content interaction events (`view_activity_detail`, `expand_section`)
- Sharing events (`share_day_info`)
- Search events (`search_good_day`, `view_search_results`)
- Additional user properties for deeper segmentation
- Feature Discovery funnel

**Phase 3 - Monetization Analytics (When monetizing):**
- Ad events (`ad_impression`, `ad_click`)
- Premium/subscription events
- Purchase funnel tracking
- Revenue attribution

### Risk Mitigation

**Technical Risk: SDK Integration Complexity**
- Mitigation: Follow official React Native Firebase documentation
- Fallback: Start with fewer events, add incrementally

**Technical Risk: Performance Impact**
- Mitigation: Test startup time before/after integration
- Fallback: Reduce event frequency if needed

**Market Risk: None for analytics layer**
- Analytics is internal tooling, not user-facing feature

### Implementation Priority

**Week 1: Foundation**
1. Create Firebase project
2. Install SDK packages
3. Configure iOS and Android
4. Verify `first_open` in DebugView

**Week 2: Core Events**
1. Implement analytics service layer
2. Add screen_view to all screens
3. Add custom events for key actions
4. Test offline event queuing

**Week 3: Polish & Release**
1. Set up user properties
2. Configure funnels in Firebase Console
3. Update Privacy Policy
4. Update store listings
5. Release to production

## Functional Requirements

### Analytics SDK Integration

- FR1: System can initialize Firebase Analytics SDK on app startup without blocking UI
- FR2: System can log analytics events when device is offline and sync when online
- FR3: Developer can verify events in real-time using Firebase DebugView during development
- FR4: System can automatically track `first_open` event on first app launch
- FR5: System can automatically track `app_open` event on each app launch

### Screen View Tracking

- FR6: System can log `screen_view` event when user navigates to any screen
- FR7: System can log `view_today` event when user views Today Widget screen
- FR8: System can log `view_day_detail` event when user views Day Detail screen
- FR9: System can log `view_month_calendar` event when user views Calendar screen
- FR10: System can log `view_compass` event when user views Compass screen
- FR11: System can log `view_auspicious_hours` event when user views Auspicious Hours screen

### User Interaction Tracking

- FR12: System can log `navigate_month` event when user navigates to different month
- FR13: System can log `select_date` event when user selects a specific date
- FR14: System can include relevant parameters with each event (date, source, scores)

### User Properties

- FR15: System can set `user_type` property for user segmentation
- FR16: System can set `days_since_install` property for cohort analysis
- FR17: System can set `app_version` property for version tracking
- FR18: System can update user properties when relevant values change

### Analytics Service Layer

- FR19: Developer can call analytics functions from any component using a centralized service
- FR20: System can gracefully handle analytics failures without impacting app functionality
- FR21: System can disable analytics tracking in development builds (optional)

### Firebase Console Configuration

- FR22: Product Owner can view events in Firebase Console within 24 hours of user action
- FR23: Product Owner can mark `view_day_detail` as conversion event in Console
- FR24: Product Owner can mark `first_open` as conversion event in Console
- FR25: Product Owner can create Activation funnel: `first_open` → `view_today` → `view_day_detail`
- FR26: Product Owner can create Daily Engagement funnel: `app_open` → `view_today` → `view_day_detail`
- FR27: Product Owner can filter and segment events by user properties

### Privacy & Compliance

- FR28: System can collect anonymous usage data without collecting PII
- FR29: App can display updated Privacy Policy explaining analytics data collection
- FR30: App Store listing can accurately reflect data collection practices
- FR31: Play Store listing can accurately reflect data collection in Data Safety section

## Non-Functional Requirements

### Performance

**NFR1: App Startup Impact**
- Analytics SDK initialization MUST NOT increase app startup time by more than 100ms
- Baseline: Current app startup < 2 seconds
- Target: App startup remains < 2 seconds after analytics integration

**NFR2: Event Logging Latency**
- Event logging calls MUST complete in < 10ms (non-blocking)
- Analytics operations MUST NOT block UI thread
- Events fire asynchronously ("fire and forget")

**NFR3: Memory Footprint**
- Analytics SDK MUST NOT increase app memory usage by more than 5MB
- Offline event queue size limited to default Firebase limits (~500 events)

**NFR4: Battery Impact**
- Analytics network operations SHOULD batch events to minimize battery drain
- No continuous background activity - sync only when app is active or events queued

### Reliability

**NFR5: Data Delivery Rate**
- ≥95% of logged events MUST reach Firebase servers
- Events logged offline MUST be delivered when connectivity restored
- Maximum acceptable data loss: 5% (due to extreme edge cases)

**NFR6: Offline Resilience**
- Analytics MUST queue events when device is offline
- Queued events MUST survive app restart
- Events older than 72 hours MAY be dropped (Firebase default behavior)

**NFR7: Graceful Degradation**
- Analytics failures MUST NOT cause app crashes
- Analytics failures MUST NOT show error dialogs to users
- App MUST function normally if Firebase is unreachable

**NFR8: Event Accuracy**
- ≤1% error rate in event parameters
- All timestamps MUST be accurate within 1 second
- Event names and parameters MUST match defined schema

### Integration

**NFR9: SDK Compatibility**
- MUST use official @react-native-firebase packages
- MUST support React Native 0.77+ with New Architecture
- MUST maintain compatibility with current app dependencies

**NFR10: Platform Parity**
- All analytics events MUST work identically on iOS and Android
- Event names and parameters MUST be consistent across platforms
- User properties MUST sync correctly on both platforms

**NFR11: Development Tooling**
- Developers MUST be able to verify events in Firebase DebugView
- Debug builds SHOULD enable verbose logging for troubleshooting
- Release builds MUST disable debug logging

### Privacy & Compliance

**NFR12: Data Anonymization**
- No Personally Identifiable Information (PII) MUST be collected
- Device identifiers MUST be anonymized (Firebase default)
- User content (specific dates viewed, feng shui details) MUST NOT be logged

**NFR13: Consent & Transparency**
- Privacy Policy MUST be updated before release
- Users MUST be able to access Privacy Policy within the app
- Store listings MUST accurately reflect data collection practices

**NFR14: Regulatory Compliance**
- iOS: App Privacy nutrition label MUST be accurate
- iOS: ATT prompt NOT required (no IDFA usage)
- Android: Data Safety section MUST be complete and accurate

