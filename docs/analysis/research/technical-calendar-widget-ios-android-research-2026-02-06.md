---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Calendar Widget for iOS and Android (React Native)'
research_goals: 'Technical constraints, Implementation guide, Compare approaches'
user_name: 'Bằng Ca'
date: '2026-02-06'
web_research_enabled: true
source_verification: true
---

# Technical Research Report: Calendar Widget for iOS and Android

**Date:** 2026-02-06
**Author:** Bằng Ca
**Research Type:** Technical Research
**Project:** Lịch Việt Vạn Sự An Lành

---

## Executive Summary

This research document provides comprehensive technical analysis for implementing calendar widgets on iOS and Android platforms for the Lịch Việt (Vietnamese Lunar Calendar) React Native application. The widgets will display a monthly calendar view with both solar and lunar dates, following an iOS-first approach.

---

## Table of Contents

1. [Technical Research Scope Confirmation](#technical-research-scope-confirmation)
2. [Technology Stack Analysis](#technology-stack-analysis)
3. [Integration Patterns](#integration-patterns)
4. [Architectural Patterns](#architectural-patterns)
5. [Implementation Research](#implementation-research)
6. [Recommendations](#recommendations)

---

## Technical Research Scope Confirmation

**Research Topic:** Calendar Widget for iOS and Android (React Native)

**Research Goals:**
1. Understand technical constraints and possibilities
2. Provide implementation guide for immediate development
3. Compare different approaches to select best solution

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-02-06

---

## Technology Stack Analysis

### iOS: WidgetKit + SwiftUI

**Framework:** WidgetKit (iOS 14+, iPadOS 14+)
**UI Framework:** SwiftUI (required - UIKit not supported in widgets)
**Language:** Swift

#### Key Characteristics

| Aspect | Details |
|--------|---------|
| **Minimum iOS** | iOS 14.0+ |
| **UI Framework** | SwiftUI only (UIKit not allowed) |
| **Architecture** | Timeline-based with TimelineProvider |
| **Refresh** | System-controlled, not real-time |
| **Interactivity** | Limited (deep links, iOS 17+ interactive) |

#### Widget Size Options for Calendar

| Size | Dimensions (iPhone 12 Pro Max) | Suitability |
|------|-------------------------------|-------------|
| **Small** | ~170x170pt | ❌ Too small for monthly calendar |
| **Medium** | ~372x175pt | ✅ **Recommended** - Full width, compact height |
| **Large** | ~372x389pt | ✅ Good for detailed calendar with extra info |

**Recommendation:** Medium size (`.systemMedium`) for monthly calendar widget - full screen width, sufficient height for 6-row calendar grid.

#### iOS 26 / WWDC 2025 Updates

- New glass presentation system for widgets
- Accented rendering with themed glass effects
- Cross-platform consistency improvements
- Enhanced contextual relevance

_Sources:_
- [WWDC 2025 - WidgetKit in iOS 26](https://dev.to/arshtechpro/wwdc-2025-widgetkit-in-ios-26-a-complete-guide-to-modern-widget-development-1cjp)
- [iOS Widget Guide 2025](https://swift-pal.com/ios-widget-guide-everything-beginners-need-to-know-about-widgetkit-in-2025-fb2778025331)
- [Apple WidgetFamily Documentation](https://developer.apple.com/documentation/widgetkit/widgetfamily)

---

### Android: Jetpack Glance

**Framework:** Jetpack Glance 1.1.1 (2024+)
**UI Framework:** Glance Composables (Compose-based)
**Language:** Kotlin

#### Key Characteristics

| Aspect | Details |
|--------|---------|
| **Minimum Android** | API 26 (Android 8.0) |
| **UI Framework** | Glance Composables (similar to Compose) |
| **Architecture** | GlanceAppWidget with state management |
| **Refresh** | WorkManager or manual updates |
| **State Management** | GlanceStateDefinition with DataStore |

#### Glance vs Traditional App Widgets

| Aspect | Jetpack Glance | Traditional RemoteViews |
|--------|----------------|-------------------------|
| **Syntax** | Declarative (Compose-like) | XML layouts |
| **Learning Curve** | Low (if know Compose) | Medium |
| **Maintenance** | Modern, maintained | Legacy |
| **Flexibility** | High | Limited |
| **Recommended** | ✅ **Yes (2025+)** | Legacy only |

#### Glance 1.1.0 Features (Google I/O 2024)

- Scaffold, TopBar high-level components
- "Canonical layouts" - Lists and Grids
- New modifiers for unified appearance
- Better system settings coordination

#### Calendar Widget Libraries

- **MonthCalendar Widget Library** - Ready-to-use Glance component
  ```gradle
  implementation("com.github.shreyas-android:month-calendar-app-widget:1.0.0")
  ```
- **KalendarGlance** - Minimal calendar widget example

_Sources:_
- [Jetpack Glance Official](https://developer.android.com/develop/ui/compose/glance)
- [Google I/O 2024 - Glance Updates](https://io.google/2024/explore/4a516fcc-a325-45dd-a820-29cbddde3412/)
- [Creating Calendar Widget with Glance](https://medium.com/@binayshaw7777/creating-a-simple-calendar-widget-using-jetpack-compose-glance-db2ad133459e)

---

### React Native Integration

**Challenge:** Widgets must be written in native code (Swift/Kotlin), not JavaScript.

#### Available Approaches

| Approach | Description | Complexity | Recommended |
|----------|-------------|------------|-------------|
| **Native Modules** | Write widget in native, bridge data from RN | Medium | ✅ **Yes** |
| **react-native-widget-bridge** | Library for iOS widget data sharing | Low | ✅ iOS only |
| **Expo Config Plugin** | Expo-specific Android Glance integration | Low | Expo only |
| **Full Native** | Separate native widget project | High | Complex apps |

#### Key Libraries

1. **react-native-widget-bridge** (iOS)
   - Bridge between JS thread and native widget
   - Designed for iOS 14+ widgets
   - [GitHub Repository](https://github.com/mobiletechvn/react-native-widget-bridge)

2. **expo-android-glance-widget** (Android/Expo)
   - Config plugin for Glance widgets in Expo
   - Generates boilerplate code
   - [GitHub Repository](https://github.com/akshayjadhav4/expo-android-glance-widget)

_Sources:_
- [Building Home Screen Widgets in React Native 2025](https://medium.com/@faheem.tfora/building-dynamic-home-screen-widgets-in-react-native-android-ios-complete-2025-dc060feacddc)
- [iOS Widget with React Native Expo](https://gist.github.com/nandorojo/4d464e8bc9864a13caade86bbdf5ce0d)

---

### Data Sharing Technologies

#### iOS: App Groups + UserDefaults

| Component | Purpose |
|-----------|---------|
| **App Groups** | Shared container between app and widget |
| **UserDefaults(suiteName:)** | Read/write shared preferences |
| **@AppStorage** | SwiftUI property wrapper for shared defaults |

**Setup Requirements:**
1. Enable App Groups capability in Xcode
2. Add same App Group ID to both app and widget targets
3. Use `UserDefaults(suiteName: "group.com.yourapp")` for shared access

#### Android: DataStore / SharedPreferences

| Component | Purpose |
|-----------|---------|
| **GlanceStateDefinition** | Glance's built-in state management |
| **Preferences DataStore** | Modern async storage (recommended) |
| **SharedPreferences** | Legacy sync storage (React Native default) |
| **WorkManager** | Background data sync and widget updates |

**Data Flow:**
1. React Native writes to SharedPreferences
2. WorkManager (optional) syncs data periodically
3. Glance widget reads from DataStore/SharedPreferences
4. AppWidgetManager triggers UI refresh

_Sources:_
- [Sharing UserDefaults with Widgets](https://swiftlogic.io/posts/accessing-userdefaults-in-widgets/)
- [App Groups Setup Guide](https://medium.com/@B4k3R/setting-up-your-appgroup-to-share-data-between-app-extensions-in-ios-43c7c642c4c7)
- [Glance Widget State and Preference](https://medium.com/@avengers14.blogger/jetpack-glance-part5-widget-state-and-preference-6c920d2f8174)

---

### Widget Constraints Summary

| Constraint | iOS (WidgetKit) | Android (Glance) |
|------------|-----------------|------------------|
| **UI Framework** | SwiftUI only | Glance Composables |
| **Refresh Control** | System-controlled | App-controlled |
| **Update Frequency** | Timeline-based (limited) | Manual/WorkManager |
| **Memory Limit** | ~30MB | Varies by device |
| **Network Access** | Limited (background) | Via WorkManager |
| **Interactivity** | Deep links, iOS 17+ buttons | Click handlers |
| **Data Sharing** | App Groups + UserDefaults | SharedPreferences/DataStore |

---

### Technology Stack Recommendation

For Lịch Việt Calendar Widget:

| Platform | Recommended Stack |
|----------|-------------------|
| **iOS** | WidgetKit + SwiftUI + App Groups |
| **Android** | Jetpack Glance 1.1+ + DataStore |
| **Data Bridge** | Native Modules (custom) or react-native-widget-bridge |
| **Widget Size** | Medium (iOS), 4x2 or 4x3 cells (Android) |

**Confidence Level:** High - Based on official documentation and verified 2024-2025 sources.

---

## Integration Patterns Analysis

### iOS Widget Communication Flow

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Native App   │────▶│  App Groups      │────▶│  iOS Widget     │
│  (JavaScript)       │     │  (UserDefaults)  │     │  (SwiftUI)      │
└─────────────────────┘     └──────────────────┘     └─────────────────┘
         │                                                    │
         │ NativeModule                                       │
         ▼                                                    ▼
┌─────────────────────┐                              ┌─────────────────┐
│ WidgetCenter        │◀─────────────────────────────│ TimelineProvider│
│ .reloadTimelines()  │                              │ getTimeline()   │
└─────────────────────┘                              └─────────────────┘
```

#### Key Components

| Component | Role | Code Example |
|-----------|------|--------------|
| **App Groups** | Shared data container | `UserDefaults(suiteName: "group.com.lichviet")` |
| **WidgetCenter** | Trigger widget refresh | `WidgetCenter.shared.reloadTimelines(ofKind: "CalendarWidget")` |
| **TimelineProvider** | Provide widget data | `func getTimeline(in:completion:)` |
| **@AppStorage** | SwiftUI binding to shared defaults | `@AppStorage("key", store: sharedDefaults)` |

#### Timeline Provider Protocol

iOS widgets require implementing **TimelineProvider** with 3 methods:

```swift
struct CalendarProvider: TimelineProvider {
    // 1. Placeholder - shown while loading
    func placeholder(in context: Context) -> CalendarEntry {
        CalendarEntry(date: Date(), lunarDays: [])
    }

    // 2. Snapshot - for widget gallery preview
    func getSnapshot(in context: Context, completion: @escaping (CalendarEntry) -> ()) {
        let entry = CalendarEntry(date: Date(), lunarDays: sampleData)
        completion(entry)
    }

    // 3. Timeline - actual widget data
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        // Read from App Groups UserDefaults
        let sharedDefaults = UserDefaults(suiteName: "group.com.lichviet")
        let lunarData = sharedDefaults?.data(forKey: "calendarData")

        // Create entry for current month
        let entry = CalendarEntry(date: Date(), lunarDays: decodeLunarData(lunarData))

        // Refresh at midnight or when month changes
        let nextUpdate = Calendar.current.startOfDay(for: Date().addingTimeInterval(86400))
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}
```

#### Widget Refresh Strategies

| Strategy | Use Case | Code |
|----------|----------|------|
| **Time-based** | Update at midnight | `.after(nextMidnight)` |
| **App-triggered** | User changes settings | `WidgetCenter.shared.reloadTimelines(ofKind:)` |
| **Never** | Static content | `.never` + manual reload |

⚠️ **Limitation**: iOS limits widget refreshes to ~40-70 times per day (~15-60 min intervals)

_Sources:_
- [Keeping a Widget Up to Date - Apple](https://developer.apple.com/documentation/widgetkit/keeping-a-widget-up-to-date)
- [WidgetCenter Documentation](https://developer.apple.com/documentation/widgetkit/widgetcenter)
- [How to Refresh a Widget - Swift Senpai](https://swiftsenpai.com/development/refreshing-widget/)

---

### Android Widget Communication Flow

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  React Native App   │────▶│ SharedPreferences│────▶│  Glance Widget  │
│  (JavaScript)       │     │ or DataStore     │     │  (Kotlin)       │
└─────────────────────┘     └──────────────────┘     └─────────────────┘
         │                                                    │
         │ NativeModule                                       │
         ▼                                                    ▼
┌─────────────────────┐                              ┌─────────────────┐
│GlanceAppWidgetManager│◀────────────────────────────│ GlanceAppWidget │
│ .update(context, id)│                              │ provideGlance() │
└─────────────────────┘                              └─────────────────┘
```

#### Key Components

| Component | Role | Code Example |
|-----------|------|--------------|
| **SharedPreferences** | Data storage (RN compatible) | `context.getSharedPreferences("lichviet", MODE_PRIVATE)` |
| **GlanceAppWidgetManager** | Widget management | `GlanceAppWidgetManager(context).getGlanceIds()` |
| **updateAppWidgetState** | Update widget state | `updateAppWidgetState(context, glanceId) { prefs -> ... }` |
| **WorkManager** | Background updates | Scheduled sync + widget refresh |

#### Glance Widget Update Pattern

```kotlin
class CalendarWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // Read from SharedPreferences or DataStore
        val prefs = context.getSharedPreferences("lichviet", Context.MODE_PRIVATE)
        val calendarJson = prefs.getString("calendarData", null)

        provideContent {
            CalendarWidgetContent(
                calendarData = parseCalendarJson(calendarJson)
            )
        }
    }
}

// Trigger update from anywhere in app
suspend fun updateCalendarWidget(context: Context) {
    val manager = GlanceAppWidgetManager(context)
    val glanceIds = manager.getGlanceIds(CalendarWidget::class.java)
    glanceIds.forEach { id ->
        CalendarWidget().update(context, id)
    }
}
```

#### Update Triggers

| Trigger | Implementation | Use Case |
|---------|----------------|----------|
| **Manual** | `widget.update(context, id)` | After app data changes |
| **WorkManager** | Scheduled CoroutineWorker | Daily refresh |
| **Broadcast** | `ACTION_APPWIDGET_UPDATE` | System events |

_Sources:_
- [Manage and Update GlanceAppWidget - Android](https://developer.android.com/develop/ui/compose/glance/glance-app-widget)
- [Real-Time Updates for Glance Widgets](https://medium.com/@Xiryl/unlock-the-secret-real-time-updates-for-glance-widgets-on-android-6907d0e06fa9)
- [Demystifying Jetpack Glance](https://medium.com/androiddevelopers/demystifying-jetpack-glance-for-app-widgets-8fbc7041955c)

---

### React Native to Native Bridge

#### iOS Bridge Implementation

```swift
// LichVietWidgetBridge.swift
import WidgetKit

@objc(LichVietWidgetBridge)
class LichVietWidgetBridge: NSObject {

    @objc
    func setCalendarData(_ jsonString: String) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.lichviet")
        sharedDefaults?.set(jsonString, forKey: "calendarData")
        sharedDefaults?.synchronize()

        // Trigger widget refresh
        WidgetCenter.shared.reloadTimelines(ofKind: "CalendarWidget")
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}

// LichVietWidgetBridge.m (Objective-C bridging)
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LichVietWidgetBridge, NSObject)
RCT_EXTERN_METHOD(setCalendarData:(NSString *)jsonString)
@end
```

#### Android Bridge Implementation

```kotlin
// LichVietWidgetModule.kt
class LichVietWidgetModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "LichVietWidgetBridge"

    @ReactMethod
    fun setCalendarData(jsonString: String) {
        val context = reactApplicationContext
        val prefs = context.getSharedPreferences("lichviet", Context.MODE_PRIVATE)
        prefs.edit().putString("calendarData", jsonString).apply()

        // Trigger widget refresh
        CoroutineScope(Dispatchers.IO).launch {
            val manager = GlanceAppWidgetManager(context)
            val ids = manager.getGlanceIds(CalendarWidget::class.java)
            ids.forEach { id ->
                CalendarWidget().update(context, id)
            }
        }
    }
}
```

#### JavaScript Usage

```typescript
// WidgetBridge.ts
import { NativeModules } from 'react-native';

const { LichVietWidgetBridge } = NativeModules;

export interface CalendarWidgetData {
    currentMonth: number;
    currentYear: number;
    days: Array<{
        solar: number;
        lunar: number;
        lunarMonth: number;
        isToday: boolean;
    }>;
}

export const updateCalendarWidget = (data: CalendarWidgetData) => {
    const jsonString = JSON.stringify(data);
    LichVietWidgetBridge.setCalendarData(jsonString);
};
```

_Sources:_
- [React Native Native Bridging Guide](https://medium.com/@nayan.vekariya014/creating-a-react-native-bridge-for-android-ios-step-by-step-guide-c3dc780f3bf3)
- [react-native-widget-bridge](https://github.com/mobiletechvn/react-native-widget-bridge)
- [Native Bridging for iOS and Android](https://medium.com/simform-engineering/bridging-for-ios-and-android-in-react-native-64b8ce60a8c2)

---

### Calendar Grid Layout Patterns

#### iOS - SwiftUI LazyVGrid

```swift
struct CalendarGridView: View {
    let columns = Array(repeating: GridItem(.flexible()), count: 7)
    let days: [CalendarDay]

    var body: some View {
        VStack(spacing: 4) {
            // Weekday headers
            HStack {
                ForEach(["CN", "T2", "T3", "T4", "T5", "T6", "T7"], id: \.self) { day in
                    Text(day)
                        .font(.caption2)
                        .frame(maxWidth: .infinity)
                }
            }

            // Calendar grid
            LazyVGrid(columns: columns, spacing: 2) {
                ForEach(days) { day in
                    DayCellView(day: day)
                }
            }
        }
    }
}

struct DayCellView: View {
    let day: CalendarDay

    var body: some View {
        VStack(spacing: 0) {
            Text("\(day.solar)")
                .font(.system(size: 12, weight: day.isToday ? .bold : .regular))
            Text("\(day.lunar)")
                .font(.system(size: 8))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(day.isToday ? Color.red.opacity(0.3) : Color.clear)
        .cornerRadius(4)
    }
}
```

#### Android - Glance Row/Column

```kotlin
@Composable
fun CalendarGridWidget(days: List<CalendarDay>) {
    Column(modifier = GlanceModifier.fillMaxSize().padding(8.dp)) {
        // Weekday headers
        Row(modifier = GlanceModifier.fillMaxWidth()) {
            listOf("CN", "T2", "T3", "T4", "T5", "T6", "T7").forEach { day ->
                Text(
                    text = day,
                    modifier = GlanceModifier.defaultWeight(),
                    style = TextStyle(fontSize = 10.sp, textAlign = TextAlign.Center)
                )
            }
        }

        // Calendar grid - 6 rows of 7 days
        days.chunked(7).forEach { week ->
            Row(modifier = GlanceModifier.fillMaxWidth()) {
                week.forEach { day ->
                    DayCell(day = day, modifier = GlanceModifier.defaultWeight())
                }
            }
        }
    }
}

@Composable
fun DayCell(day: CalendarDay, modifier: GlanceModifier) {
    Column(
        modifier = modifier.padding(2.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "${day.solar}",
            style = TextStyle(
                fontSize = 12.sp,
                fontWeight = if (day.isToday) FontWeight.Bold else FontWeight.Normal
            )
        )
        Text(
            text = "${day.lunar}",
            style = TextStyle(fontSize = 8.sp, color = ColorProvider(Color.Gray))
        )
    }
}
```

_Sources:_
- [SwiftUI Calendar with LazyVGrid](https://gist.github.com/mecid/f8859ea4bdbd02cf5d440d58e936faec)
- [Build UI with Glance](https://developer.android.com/develop/ui/compose/glance/build-ui)
- [Custom Calendar in SwiftUI](https://medium.com/@ant.lucchini/how-to-build-a-custom-calendar-in-swiftui-34656aa33f3d)

---

### Data Format for Widget

Recommended JSON structure for sharing calendar data between React Native and widgets:

```json
{
    "currentMonth": 2,
    "currentYear": 2026,
    "monthName": "Tháng 2",
    "lunarMonthName": "Tháng Giêng",
    "days": [
        {
            "solar": 1,
            "lunar": 4,
            "lunarMonth": 1,
            "dayOfWeek": 0,
            "isCurrentMonth": true,
            "isToday": false,
            "canChi": "Giáp Tý"
        }
    ],
    "firstDayOffset": 0,
    "totalDays": 28
}
```

| Field | Type | Description |
|-------|------|-------------|
| `solar` | number | Solar calendar day (1-31) |
| `lunar` | number | Lunar calendar day (1-30) |
| `lunarMonth` | number | Lunar month (1-12, có nhuận) |
| `isCurrentMonth` | boolean | Belongs to displayed month |
| `isToday` | boolean | Is today's date |
| `canChi` | string | Can Chi của ngày (optional) |

---

## Architectural Patterns and Design

### iOS Widget Extension Architecture

#### Project Structure

```
mobile/
├── ios/
│   ├── LichViet/                      # Main App Target
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   └── LichViet.entitlements      # App Groups entitlement
│   │
│   ├── LichVietWidget/                # Widget Extension Target
│   │   ├── LichVietWidget.swift       # Main widget file (@main)
│   │   ├── CalendarProvider.swift     # TimelineProvider
│   │   ├── CalendarEntry.swift        # TimelineEntry model
│   │   ├── Views/
│   │   │   ├── CalendarWidgetView.swift
│   │   │   ├── CalendarGridView.swift
│   │   │   └── DayCellView.swift
│   │   ├── Models/
│   │   │   ├── CalendarDay.swift
│   │   │   └── LunarDate.swift
│   │   ├── Utilities/
│   │   │   └── SharedDataManager.swift
│   │   ├── Assets.xcassets
│   │   ├── Info.plist
│   │   └── LichVietWidget.entitlements
│   │
│   ├── Shared/                        # Shared code between app & widget
│   │   ├── LunarCalculator.swift      # Lunar date calculations
│   │   └── Constants.swift
│   │
│   └── LichViet.xcodeproj
```

#### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **@main Widget** | `LichVietWidget.swift` | Entry point, widget configuration |
| **TimelineProvider** | `CalendarProvider.swift` | Data fetching, timeline generation |
| **TimelineEntry** | `CalendarEntry.swift` | Widget view model |
| **Widget View** | `CalendarWidgetView.swift` | SwiftUI root view |
| **Shared Data** | `SharedDataManager.swift` | App Groups access |

#### Widget Extension Setup (Xcode)

1. **Add Widget Target**: File → New → Target → Widget Extension
2. **Enable App Groups**:
   - Main App Target → Signing & Capabilities → + App Groups
   - Widget Target → Signing & Capabilities → + App Groups
   - Both use: `group.com.lichviet.shared`

3. **Entitlements File**:
```xml
<!-- LichVietWidget.entitlements -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.lichviet.shared</string>
    </array>
</dict>
</plist>
```

_Sources:_
- [Creating a Widget Extension - Apple](https://developer.apple.com/documentation/widgetkit/creating-a-widget-extension)
- [Sharing Data with a Widget](https://useyourloaf.com/blog/sharing-data-with-a-widget/)
- [Building Your First Widget](https://www.theswift.dev/posts/building-your-first-widget-step-2)

---

### Android Glance Widget Architecture

#### Project Structure

```
mobile/
├── android/
│   └── app/
│       ├── src/main/
│       │   ├── java/com/lichviet/
│       │   │   ├── MainActivity.kt
│       │   │   ├── MainApplication.kt
│       │   │   │
│       │   │   ├── widget/                    # Widget module
│       │   │   │   ├── CalendarWidget.kt      # GlanceAppWidget
│       │   │   │   ├── CalendarWidgetReceiver.kt
│       │   │   │   ├── CalendarWidgetContent.kt
│       │   │   │   ├── components/
│       │   │   │   │   ├── CalendarGrid.kt
│       │   │   │   │   └── DayCell.kt
│       │   │   │   ├── state/
│       │   │   │   │   └── CalendarStateDefinition.kt
│       │   │   │   └── worker/
│       │   │   │       └── CalendarUpdateWorker.kt
│       │   │   │
│       │   │   └── bridge/                    # React Native Bridge
│       │   │       ├── LichVietWidgetModule.kt
│       │   │       └── LichVietWidgetPackage.kt
│       │   │
│       │   ├── res/
│       │   │   └── xml/
│       │   │       └── calendar_widget_info.xml
│       │   │
│       │   └── AndroidManifest.xml
│       │
│       └── build.gradle
```

#### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **GlanceAppWidget** | `CalendarWidget.kt` | Widget entry point |
| **Receiver** | `CalendarWidgetReceiver.kt` | Broadcast receiver |
| **Content** | `CalendarWidgetContent.kt` | Composable UI |
| **State** | `CalendarStateDefinition.kt` | DataStore state |
| **Worker** | `CalendarUpdateWorker.kt` | Background updates |
| **RN Bridge** | `LichVietWidgetModule.kt` | Native module |

#### AndroidManifest Configuration

```xml
<!-- AndroidManifest.xml -->
<manifest>
    <application>
        <!-- Widget Receiver -->
        <receiver
            android:name=".widget.CalendarWidgetReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/calendar_widget_info" />
        </receiver>
    </application>
</manifest>
```

#### Widget Info XML

```xml
<!-- res/xml/calendar_widget_info.xml -->
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="180dp"
    android:targetCellWidth="4"
    android:targetCellHeight="3"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:initialLayout="@layout/glance_default_loading_layout"
    android:previewImage="@drawable/widget_preview"
    android:description="@string/widget_description"
    android:updatePeriodMillis="86400000" />
```

#### Gradle Dependencies

```kotlin
// build.gradle (app)
dependencies {
    // Glance
    implementation("androidx.glance:glance-appwidget:1.1.1")
    implementation("androidx.glance:glance-material3:1.1.1")

    // WorkManager (for background updates)
    implementation("androidx.work:work-runtime-ktx:2.9.0")

    // DataStore
    implementation("androidx.datastore:datastore-preferences:1.0.0")
}
```

_Sources:_
- [Create App Widget with Glance - Android](https://developer.android.com/develop/ui/compose/glance/create-app-widget)
- [Modern Android Widgets Using Glance](https://syedovaiss.medium.com/modern-android-widgets-using-glance-a-jetpack-compose-approach-clean-architecture-2fb72d6e319c)
- [Widgets with Glance: Beyond String States](https://proandroiddev.com/widgets-with-glance-beyond-string-states-2dcc4db2f76c)

---

### React Native Bridge Architecture

#### Project Structure

```
mobile/
├── src/
│   ├── core/
│   │   └── widget/
│   │       ├── WidgetBridge.ts           # JS interface
│   │       ├── WidgetDataPreparer.ts     # Prepare data for widget
│   │       └── useWidgetSync.ts          # Hook for auto-sync
│   │
│   └── ...
│
├── ios/
│   ├── LichViet/
│   │   ├── Bridge/
│   │   │   ├── LichVietWidgetBridge.swift
│   │   │   └── LichVietWidgetBridge.m
│   │   └── ...
│   └── ...
│
└── android/
    └── app/src/main/java/com/lichviet/
        └── bridge/
            ├── LichVietWidgetModule.kt
            └── LichVietWidgetPackage.kt
```

#### Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     React Native App                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  lunar-javascript  →  WidgetDataPreparer  →  WidgetBridge │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────────────┘
                            │ JSON String
                            ▼
        ┌───────────────────┴───────────────────┐
        │           Native Modules               │
        ├───────────────────┬───────────────────┤
        │       iOS         │      Android       │
        │ (Swift Bridge)    │  (Kotlin Bridge)   │
        └─────────┬─────────┴─────────┬─────────┘
                  │                   │
                  ▼                   ▼
        ┌─────────────────┐ ┌─────────────────┐
        │   App Groups    │ │ SharedPreferences│
        │  (UserDefaults) │ │   (DataStore)   │
        └────────┬────────┘ └────────┬────────┘
                 │                   │
                 ▼                   ▼
        ┌─────────────────┐ ┌─────────────────┐
        │  iOS Widget     │ │ Android Widget  │
        │  (SwiftUI)      │ │  (Glance)       │
        └─────────────────┘ └─────────────────┘
```

#### Shared Data Calculations

```typescript
// src/core/widget/WidgetDataPreparer.ts
import { Solar, Lunar } from 'lunar-javascript';

export interface WidgetCalendarData {
    currentMonth: number;
    currentYear: number;
    lunarMonth: number;
    lunarYear: number;
    days: CalendarDayData[];
}

export function prepareWidgetData(date: Date): WidgetCalendarData {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    // Generate 42 days (6 weeks) for calendar grid
    const days = generateMonthDays(solar.getYear(), solar.getMonth());

    return {
        currentMonth: solar.getMonth(),
        currentYear: solar.getYear(),
        lunarMonth: lunar.getMonth(),
        lunarYear: lunar.getYear(),
        days: days.map(d => ({
            solar: d.getDay(),
            lunar: d.getLunar().getDay(),
            lunarMonth: d.getLunar().getMonth(),
            isCurrentMonth: d.getMonth() === solar.getMonth(),
            isToday: d.toYmd() === Solar.fromDate(new Date()).toYmd(),
            dayOfWeek: d.getWeek(),
        })),
    };
}
```

_Sources:_
- [Create Module Library - React Native](https://reactnative.dev/docs/the-new-architecture/create-module-library)
- [Building Native Modules for React Native](https://blog.theodo.com/2020/04/react-native-bridge-module/)
- [Native Bridging for iOS and Android](https://medium.com/simform-engineering/bridging-for-ios-and-android-in-react-native-64b8ce60a8c2)

---

### Design Patterns

#### 1. Timeline-based Updates (iOS)

```swift
// CalendarProvider.swift
struct CalendarProvider: TimelineProvider {
    typealias Entry = CalendarEntry

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let currentDate = Date()
        var entries: [CalendarEntry] = []

        // Create entry for current month
        let entry = createEntry(for: currentDate)
        entries.append(entry)

        // Schedule refresh at midnight
        let midnight = Calendar.current.startOfDay(for: currentDate.addingTimeInterval(86400))
        let timeline = Timeline(entries: entries, policy: .after(midnight))
        completion(timeline)
    }

    private func createEntry(for date: Date) -> CalendarEntry {
        let data = SharedDataManager.shared.getCalendarData()
        return CalendarEntry(date: date, calendarData: data)
    }
}
```

#### 2. State-driven Updates (Android)

```kotlin
// CalendarWidget.kt
class CalendarWidget : GlanceAppWidget() {
    override val stateDefinition = CalendarStateDefinition()

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val state = currentState<CalendarState>()
            CalendarWidgetContent(state = state)
        }
    }
}

// CalendarStateDefinition.kt
class CalendarStateDefinition : GlanceStateDefinition<CalendarState> {
    override suspend fun getDataStore(
        context: Context,
        fileKey: String
    ): DataStore<CalendarState> {
        return CalendarDataStore.getInstance(context)
    }
}
```

#### 3. Auto-sync Pattern (React Native)

```typescript
// useWidgetSync.ts
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { WidgetBridge } from './WidgetBridge';
import { prepareWidgetData } from './WidgetDataPreparer';

export function useWidgetSync() {
    useEffect(() => {
        // Sync on app launch
        syncWidget();

        // Sync when app returns to foreground
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                syncWidget();
            }
        });

        // Sync at midnight
        const midnightTimer = scheduleMidnightSync();

        return () => {
            subscription.remove();
            clearTimeout(midnightTimer);
        };
    }, []);
}

async function syncWidget() {
    const data = prepareWidgetData(new Date());
    await WidgetBridge.setCalendarData(data);
}
```

---

### Architecture Decision Records (ADRs)

#### ADR-001: Separate Native Widget Code

**Decision**: Write widget UI natively (SwiftUI/Glance) instead of trying to render React Native views.

**Rationale**:
- Widgets don't support React Native rendering
- Native UI provides better performance and system integration
- Matches platform design guidelines

**Consequences**:
- Need to maintain separate codebases for iOS/Android widgets
- Widget UI cannot share components with main app
- Lunar calculations duplicated (or bridged)

---

#### ADR-002: Data Sharing via Shared Storage

**Decision**: Use App Groups (iOS) and SharedPreferences (Android) for widget data sharing.

**Rationale**:
- Simple, well-documented approach
- No complex IPC required
- Works with system's widget refresh mechanisms

**Consequences**:
- Data must be serialized to JSON
- Cannot share complex objects directly
- Need to handle data synchronization manually

---

#### ADR-003: Pre-computed Calendar Data

**Decision**: Pre-compute all calendar data in React Native and pass to widgets as JSON.

**Rationale**:
- `lunar-javascript` already available in React Native
- Avoid duplicating lunar calculation logic in Swift/Kotlin
- Simpler widget code (display only)

**Consequences**:
- Widget depends on app for data updates
- Need to sync on date changes
- Larger data payload to store

---

## Implementation Guide

### iOS Widget - Step-by-Step

#### Step 1: Add Widget Extension Target

```
Xcode Menu: File → New → Target → Widget Extension
```

| Setting | Value |
|---------|-------|
| Product Name | `LichVietWidget` |
| Include Configuration Intent | ❌ Unchecked (static widget) |
| Include Live Activity | ❌ Unchecked |

#### Step 2: Configure App Groups

**Main App Target:**
1. Select main app target in Xcode
2. Go to **Signing & Capabilities**
3. Click **+ Capability** → **App Groups**
4. Add: `group.com.lichviet.shared`

**Widget Target:**
1. Select widget target
2. Go to **Signing & Capabilities**
3. Click **+ Capability** → **App Groups**
4. Add same group: `group.com.lichviet.shared`

#### Step 3: Create Data Models

```swift
// LichVietWidget/Models/CalendarDay.swift
import Foundation

struct CalendarDay: Identifiable, Codable {
    var id: String { "\(solar)-\(lunarMonth)" }
    let solar: Int           // 1-31
    let lunar: Int           // 1-30
    let lunarMonth: Int      // 1-12
    let dayOfWeek: Int       // 0-6 (CN-T7)
    let isCurrentMonth: Bool
    let isToday: Bool
}

struct CalendarWidgetData: Codable {
    let currentMonth: Int
    let currentYear: Int
    let lunarMonth: Int
    let lunarYear: Int
    let monthName: String
    let lunarMonthName: String
    let days: [CalendarDay]
}
```

#### Step 4: Create Shared Data Manager

```swift
// LichVietWidget/Utilities/SharedDataManager.swift
import Foundation

class SharedDataManager {
    static let shared = SharedDataManager()

    private let appGroupId = "group.com.lichviet.shared"
    private let calendarDataKey = "calendarData"

    private var sharedDefaults: UserDefaults? {
        UserDefaults(suiteName: appGroupId)
    }

    func getCalendarData() -> CalendarWidgetData? {
        guard let jsonString = sharedDefaults?.string(forKey: calendarDataKey),
              let data = jsonString.data(using: .utf8) else {
            return nil
        }

        return try? JSONDecoder().decode(CalendarWidgetData.self, from: data)
    }

    // Sample data for widget preview
    static var sampleData: CalendarWidgetData {
        CalendarWidgetData(
            currentMonth: 2,
            currentYear: 2026,
            lunarMonth: 1,
            lunarYear: 2026,
            monthName: "Tháng 2",
            lunarMonthName: "Tháng Giêng",
            days: generateSampleDays()
        )
    }
}
```

#### Step 5: Create Timeline Entry

```swift
// LichVietWidget/CalendarEntry.swift
import WidgetKit

struct CalendarEntry: TimelineEntry {
    let date: Date
    let calendarData: CalendarWidgetData
}
```

#### Step 6: Create Timeline Provider

```swift
// LichVietWidget/CalendarProvider.swift
import WidgetKit

struct CalendarProvider: TimelineProvider {
    typealias Entry = CalendarEntry

    func placeholder(in context: Context) -> CalendarEntry {
        CalendarEntry(date: Date(), calendarData: SharedDataManager.sampleData)
    }

    func getSnapshot(in context: Context, completion: @escaping (CalendarEntry) -> ()) {
        let data = SharedDataManager.shared.getCalendarData() ?? SharedDataManager.sampleData
        let entry = CalendarEntry(date: Date(), calendarData: data)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CalendarEntry>) -> ()) {
        let currentDate = Date()
        let data = SharedDataManager.shared.getCalendarData() ?? SharedDataManager.sampleData
        let entry = CalendarEntry(date: currentDate, calendarData: data)

        // Refresh at midnight
        let calendar = Calendar.current
        let tomorrow = calendar.date(byAdding: .day, value: 1, to: currentDate)!
        let midnight = calendar.startOfDay(for: tomorrow)

        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }
}
```

#### Step 7: Create Widget Views

```swift
// LichVietWidget/Views/CalendarWidgetView.swift
import SwiftUI
import WidgetKit

struct CalendarWidgetView: View {
    let entry: CalendarEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        VStack(spacing: 4) {
            // Header
            HStack {
                Text(entry.calendarData.monthName)
                    .font(.system(size: 14, weight: .semibold))
                Spacer()
                Text(entry.calendarData.lunarMonthName)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 8)

            // Weekday headers
            WeekdayHeaderView()

            // Calendar grid
            CalendarGridView(days: entry.calendarData.days)
        }
        .padding(8)
    }
}

struct WeekdayHeaderView: View {
    let weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(weekdays, id: \.self) { day in
                Text(day)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
            }
        }
    }
}

struct CalendarGridView: View {
    let days: [CalendarDay]
    let columns = Array(repeating: GridItem(.flexible(), spacing: 0), count: 7)

    var body: some View {
        LazyVGrid(columns: columns, spacing: 2) {
            ForEach(days) { day in
                DayCellView(day: day)
            }
        }
    }
}

struct DayCellView: View {
    let day: CalendarDay

    var body: some View {
        VStack(spacing: 0) {
            Text("\(day.solar)")
                .font(.system(size: 11, weight: day.isToday ? .bold : .regular))
                .foregroundColor(dayColor)

            Text("\(day.lunar)")
                .font(.system(size: 7))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, minHeight: 22)
        .background(day.isToday ? Color.red.opacity(0.2) : Color.clear)
        .cornerRadius(4)
        .opacity(day.isCurrentMonth ? 1.0 : 0.3)
    }

    var dayColor: Color {
        if day.isToday { return .red }
        if day.dayOfWeek == 0 { return .red }  // Chủ nhật
        if day.dayOfWeek == 6 { return .blue } // Thứ 7
        return .primary
    }
}
```

#### Step 8: Create Main Widget

```swift
// LichVietWidget/LichVietWidget.swift
import WidgetKit
import SwiftUI

@main
struct LichVietWidget: Widget {
    let kind: String = "CalendarWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CalendarProvider()) { entry in
            CalendarWidgetView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Lịch Việt")
        .description("Xem lịch âm dương trong tháng")
        .supportedFamilies([.systemMedium, .systemLarge])
    }
}

#Preview(as: .systemMedium) {
    LichVietWidget()
} timeline: {
    CalendarEntry(date: .now, calendarData: SharedDataManager.sampleData)
}
```

_Sources:_
- [Building Widgets Using WidgetKit - Apple](https://developer.apple.com/documentation/widgetkit/building_widgets_using_widgetkit_and_swiftui)
- [Adding a Widget to a SwiftUI app](https://www.createwithswift.com/adding-a-widget-to-a-swiftui-app/)
- [WidgetKit for iOS - Getting Started](https://useyourloaf.com/blog/widgetkit-for-ios-getting-started/)

---

### Android Glance Widget - Step-by-Step

#### Step 1: Add Dependencies

```kotlin
// android/app/build.gradle
dependencies {
    // Jetpack Glance
    implementation("androidx.glance:glance-appwidget:1.1.1")
    implementation("androidx.glance:glance-material3:1.1.1")

    // WorkManager
    implementation("androidx.work:work-runtime-ktx:2.9.0")

    // Kotlin Serialization (for JSON parsing)
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
}
```

#### Step 2: Create Data Models

```kotlin
// widget/models/CalendarModels.kt
package com.lichviet.widget.models

import kotlinx.serialization.Serializable

@Serializable
data class CalendarDay(
    val solar: Int,
    val lunar: Int,
    val lunarMonth: Int,
    val dayOfWeek: Int,
    val isCurrentMonth: Boolean,
    val isToday: Boolean
)

@Serializable
data class CalendarWidgetData(
    val currentMonth: Int,
    val currentYear: Int,
    val lunarMonth: Int,
    val lunarYear: Int,
    val monthName: String,
    val lunarMonthName: String,
    val days: List<CalendarDay>
)
```

#### Step 3: Create Widget Content

```kotlin
// widget/CalendarWidgetContent.kt
package com.lichviet.widget

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.appwidget.*
import androidx.glance.layout.*
import androidx.glance.text.*
import com.lichviet.widget.models.CalendarDay
import com.lichviet.widget.models.CalendarWidgetData

@Composable
fun CalendarWidgetContent(data: CalendarWidgetData?) {
    if (data == null) {
        Box(
            modifier = GlanceModifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text("Mở app để cập nhật")
        }
        return
    }

    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .padding(8.dp)
            .background(GlanceTheme.colors.surface)
    ) {
        // Header
        Row(
            modifier = GlanceModifier.fillMaxWidth(),
            horizontalAlignment = Alignment.Horizontal.Start
        ) {
            Text(
                text = data.monthName,
                style = TextStyle(
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
            )
            Spacer(GlanceModifier.defaultWeight())
            Text(
                text = data.lunarMonthName,
                style = TextStyle(fontSize = 12.sp)
            )
        }

        Spacer(GlanceModifier.height(4.dp))

        // Weekday headers
        WeekdayHeader()

        Spacer(GlanceModifier.height(2.dp))

        // Calendar grid
        CalendarGrid(days = data.days)
    }
}

@Composable
fun WeekdayHeader() {
    val weekdays = listOf("CN", "T2", "T3", "T4", "T5", "T6", "T7")
    Row(modifier = GlanceModifier.fillMaxWidth()) {
        weekdays.forEach { day ->
            Text(
                text = day,
                modifier = GlanceModifier.defaultWeight(),
                style = TextStyle(
                    fontSize = 9.sp,
                    textAlign = TextAlign.Center
                )
            )
        }
    }
}

@Composable
fun CalendarGrid(days: List<CalendarDay>) {
    Column(modifier = GlanceModifier.fillMaxWidth()) {
        days.chunked(7).forEach { week ->
            Row(modifier = GlanceModifier.fillMaxWidth()) {
                week.forEach { day ->
                    DayCell(
                        day = day,
                        modifier = GlanceModifier.defaultWeight()
                    )
                }
                // Fill remaining cells if week is incomplete
                repeat(7 - week.size) {
                    Spacer(GlanceModifier.defaultWeight())
                }
            }
        }
    }
}

@Composable
fun DayCell(day: CalendarDay, modifier: GlanceModifier) {
    val textColor = when {
        day.isToday -> ColorProvider(Color.Red)
        day.dayOfWeek == 0 -> ColorProvider(Color.Red)
        day.dayOfWeek == 6 -> ColorProvider(Color.Blue)
        else -> GlanceTheme.colors.onSurface
    }

    val alpha = if (day.isCurrentMonth) 1f else 0.3f

    Column(
        modifier = modifier.padding(1.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "${day.solar}",
            style = TextStyle(
                fontSize = 11.sp,
                fontWeight = if (day.isToday) FontWeight.Bold else FontWeight.Normal,
                color = textColor
            )
        )
        Text(
            text = "${day.lunar}",
            style = TextStyle(
                fontSize = 7.sp,
                color = GlanceTheme.colors.secondary
            )
        )
    }
}
```

#### Step 4: Create GlanceAppWidget

```kotlin
// widget/CalendarWidget.kt
package com.lichviet.widget

import android.content.Context
import androidx.glance.*
import androidx.glance.appwidget.*
import kotlinx.serialization.json.Json
import com.lichviet.widget.models.CalendarWidgetData

class CalendarWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val prefs = context.getSharedPreferences("lichviet", Context.MODE_PRIVATE)
        val jsonString = prefs.getString("calendarData", null)

        val data = jsonString?.let {
            try {
                Json.decodeFromString<CalendarWidgetData>(it)
            } catch (e: Exception) {
                null
            }
        }

        provideContent {
            GlanceTheme {
                CalendarWidgetContent(data = data)
            }
        }
    }
}
```

#### Step 5: Create Widget Receiver

```kotlin
// widget/CalendarWidgetReceiver.kt
package com.lichviet.widget

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

class CalendarWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = CalendarWidget()
}
```

#### Step 6: Create Widget Info XML

```xml
<!-- res/xml/calendar_widget_info.xml -->
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="180dp"
    android:targetCellWidth="4"
    android:targetCellHeight="3"
    android:minResizeWidth="180dp"
    android:minResizeHeight="110dp"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:initialLayout="@layout/glance_default_loading_layout"
    android:previewLayout="@layout/widget_preview"
    android:description="@string/widget_description"
    android:updatePeriodMillis="86400000" />
```

#### Step 7: Update AndroidManifest

```xml
<!-- AndroidManifest.xml -->
<manifest>
    <application>
        <!-- Existing content -->

        <!-- Widget Receiver -->
        <receiver
            android:name=".widget.CalendarWidgetReceiver"
            android:exported="true"
            android:label="@string/widget_name">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/calendar_widget_info" />
        </receiver>
    </application>
</manifest>
```

_Sources:_
- [Create App Widget with Glance - Android](https://developer.android.com/develop/ui/compose/glance/create-app-widget)
- [Glance Codelab](https://developer.android.com/codelabs/glance)
- [Kodeco Glance Tutorial](https://www.kodeco.com/books/jetpack-compose-by-tutorials/v2.0/chapters/16-creating-widgets-using-jetpack-glance)

---

### React Native Bridge - Complete Implementation

#### iOS Native Module

```swift
// ios/LichViet/Bridge/LichVietWidgetBridge.swift
import Foundation
import WidgetKit

@objc(LichVietWidgetBridge)
class LichVietWidgetBridge: NSObject {

    private let appGroupId = "group.com.lichviet.shared"
    private let calendarDataKey = "calendarData"

    @objc
    func setCalendarData(_ jsonString: String) {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
            print("LichVietWidgetBridge: Failed to access App Groups")
            return
        }

        sharedDefaults.set(jsonString, forKey: calendarDataKey)
        sharedDefaults.synchronize()

        // Reload widget timeline
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "CalendarWidget")
        }
    }

    @objc
    func clearCalendarData() {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else { return }
        sharedDefaults.removeObject(forKey: calendarDataKey)
        sharedDefaults.synchronize()
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}

// ios/LichViet/Bridge/LichVietWidgetBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LichVietWidgetBridge, NSObject)
RCT_EXTERN_METHOD(setCalendarData:(NSString *)jsonString)
RCT_EXTERN_METHOD(clearCalendarData)
@end
```

#### Android Native Module

```kotlin
// android/app/.../bridge/LichVietWidgetModule.kt
package com.lichviet.bridge

import android.content.Context
import com.facebook.react.bridge.*
import com.lichviet.widget.CalendarWidget
import androidx.glance.appwidget.GlanceAppWidgetManager
import kotlinx.coroutines.*

class LichVietWidgetModule(reactContext: ReactApplicationContext)
    : ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    override fun getName() = "LichVietWidgetBridge"

    @ReactMethod
    fun setCalendarData(jsonString: String) {
        val context = reactApplicationContext

        // Save to SharedPreferences
        context.getSharedPreferences("lichviet", Context.MODE_PRIVATE)
            .edit()
            .putString("calendarData", jsonString)
            .apply()

        // Update all widget instances
        scope.launch {
            try {
                val manager = GlanceAppWidgetManager(context)
                val glanceIds = manager.getGlanceIds(CalendarWidget::class.java)
                glanceIds.forEach { id ->
                    CalendarWidget().update(context, id)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    @ReactMethod
    fun clearCalendarData() {
        reactApplicationContext
            .getSharedPreferences("lichviet", Context.MODE_PRIVATE)
            .edit()
            .remove("calendarData")
            .apply()
    }
}

// android/app/.../bridge/LichVietWidgetPackage.kt
package com.lichviet.bridge

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class LichVietWidgetPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(LichVietWidgetModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
```

#### Register Package in MainApplication

```kotlin
// MainApplication.kt
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        add(LichVietWidgetPackage())
    }
```

#### TypeScript Bridge Interface

```typescript
// src/core/widget/WidgetBridge.ts
import { NativeModules, Platform } from 'react-native';

const { LichVietWidgetBridge } = NativeModules;

export interface CalendarDayData {
    solar: number;
    lunar: number;
    lunarMonth: number;
    dayOfWeek: number;
    isCurrentMonth: boolean;
    isToday: boolean;
}

export interface CalendarWidgetData {
    currentMonth: number;
    currentYear: number;
    lunarMonth: number;
    lunarYear: number;
    monthName: string;
    lunarMonthName: string;
    days: CalendarDayData[];
}

export const WidgetBridge = {
    setCalendarData: (data: CalendarWidgetData): void => {
        if (LichVietWidgetBridge) {
            const jsonString = JSON.stringify(data);
            LichVietWidgetBridge.setCalendarData(jsonString);
        }
    },

    clearCalendarData: (): void => {
        if (LichVietWidgetBridge) {
            LichVietWidgetBridge.clearCalendarData();
        }
    },

    isAvailable: (): boolean => {
        return !!LichVietWidgetBridge;
    }
};
```

#### Data Preparer using lunar-javascript

```typescript
// src/core/widget/WidgetDataPreparer.ts
import { Solar } from 'lunar-javascript';
import { CalendarWidgetData, CalendarDayData } from './WidgetBridge';

const LUNAR_MONTH_NAMES = [
    '', 'Tháng Giêng', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư',
    'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy', 'Tháng Tám',
    'Tháng Chín', 'Tháng Mười', 'Tháng Một', 'Tháng Chạp'
];

export function prepareWidgetData(date: Date = new Date()): CalendarWidgetData {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    const year = solar.getYear();
    const month = solar.getMonth();

    // Get first day of month
    const firstDay = Solar.fromYmd(year, month, 1);
    const firstDayOfWeek = firstDay.getWeek(); // 0=Sunday

    // Get days in month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Get days in previous month
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

    // Today for comparison
    const today = Solar.fromDate(new Date());
    const todayYmd = today.toYmd();

    const days: CalendarDayData[] = [];

    // Add previous month's days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const s = Solar.fromYmd(prevYear, prevMonth, day);
        const l = s.getLunar();
        days.push({
            solar: day,
            lunar: l.getDay(),
            lunarMonth: l.getMonth(),
            dayOfWeek: s.getWeek(),
            isCurrentMonth: false,
            isToday: s.toYmd() === todayYmd
        });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const s = Solar.fromYmd(year, month, day);
        const l = s.getLunar();
        days.push({
            solar: day,
            lunar: l.getDay(),
            lunarMonth: l.getMonth(),
            dayOfWeek: s.getWeek(),
            isCurrentMonth: true,
            isToday: s.toYmd() === todayYmd
        });
    }

    // Add next month's days to complete 42 cells (6 weeks)
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const remaining = 42 - days.length;

    for (let day = 1; day <= remaining; day++) {
        const s = Solar.fromYmd(nextYear, nextMonth, day);
        const l = s.getLunar();
        days.push({
            solar: day,
            lunar: l.getDay(),
            lunarMonth: l.getMonth(),
            dayOfWeek: s.getWeek(),
            isCurrentMonth: false,
            isToday: s.toYmd() === todayYmd
        });
    }

    return {
        currentMonth: month,
        currentYear: year,
        lunarMonth: lunar.getMonth(),
        lunarYear: lunar.getYear(),
        monthName: `Tháng ${month}`,
        lunarMonthName: LUNAR_MONTH_NAMES[lunar.getMonth()] || `Tháng ${lunar.getMonth()}`,
        days
    };
}
```

#### Auto-sync Hook

```typescript
// src/core/widget/useWidgetSync.ts
import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { WidgetBridge } from './WidgetBridge';
import { prepareWidgetData } from './WidgetDataPreparer';

export function useWidgetSync() {
    const syncWidget = useCallback(() => {
        if (!WidgetBridge.isAvailable()) return;

        const data = prepareWidgetData(new Date());
        WidgetBridge.setCalendarData(data);
    }, []);

    useEffect(() => {
        // Sync on mount
        syncWidget();

        // Sync when app becomes active
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                syncWidget();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Schedule midnight sync
        const scheduleMidnightSync = () => {
            const now = new Date();
            const midnight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0, 0, 1
            );
            const msUntilMidnight = midnight.getTime() - now.getTime();

            return setTimeout(() => {
                syncWidget();
                scheduleMidnightSync(); // Schedule next
            }, msUntilMidnight);
        };

        const midnightTimer = scheduleMidnightSync();

        return () => {
            subscription.remove();
            clearTimeout(midnightTimer);
        };
    }, [syncWidget]);

    return { syncWidget };
}
```

_Sources:_
- [React Native Ultimate Widget Guide](https://dev.to/rushitjivani/react-native-ultimate-guide-to-create-a-home-screen-widget-for-ios-and-android-1h9g)
- [Building Dynamic Home Screen Widgets 2025](https://medium.com/@faheem.tfora/building-dynamic-home-screen-widgets-in-react-native-android-ios-complete-2025-dc060feacddc)
- [Widget Implementation Guide](https://medium.com/@kuldeep1212000/widget-implementation-guide-e501d07615d6)

---

## Common Issues & Troubleshooting

### iOS Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Widget không hiển thị** | Bundle ID không đúng | Widget bundle ID phải là `{app-bundle-id}.{widget-name}` |
| **Data không load** | App Groups chưa setup đúng | Cùng App Group ID cho cả app và widget |
| **Widget không refresh** | reloadTimelines không gọi | Gọi `WidgetCenter.shared.reloadTimelines(ofKind:)` sau khi save data |
| **Data mất sau TestFlight** | Entitlements không match | Kiểm tra provisioning profile có App Groups |
| **Widget gallery không có preview** | getSnapshot trả về data rỗng | Return sample data trong getSnapshot |

### Android Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Widget crash** | Compose import conflict | Import từ `androidx.glance.*` không phải `androidx.compose.*` |
| **UI không update** | update() không gọi | Gọi `widget.update(context, glanceId)` sau save data |
| **Widget không xuất hiện** | Manifest thiếu receiver | Khai báo receiver với intent-filter `APPWIDGET_UPDATE` |
| **Preview không hiển thị** | `@Preview` không work với Glance | Build và test trực tiếp trên device |
| **SharedPreferences không sync** | Different context | Dùng `applicationContext` thay vì `reactApplicationContext` |

### React Native Bridge Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Module not found** | Package chưa register | Thêm package vào `getPackages()` trong MainApplication |
| **iOS build fail** | Bridging header missing | Tạo bridging header cho Swift modules |
| **JSON parse error** | Data format không match | Kiểm tra JSON structure giữa JS và native |
| **Widget không update khi app đóng** | Chỉ sync khi app active | Implement midnight timer với Background Fetch |

---

## Implementation Checklist

### Phase 1: iOS Widget (Priority)

- [ ] Add Widget Extension target trong Xcode
- [ ] Configure App Groups cho main app và widget
- [ ] Create data models (CalendarDay, CalendarWidgetData)
- [ ] Implement SharedDataManager
- [ ] Create CalendarEntry (TimelineEntry)
- [ ] Implement CalendarProvider (TimelineProvider)
- [ ] Build widget views (CalendarWidgetView, DayCellView)
- [ ] Create main Widget struct
- [ ] Test widget preview và placement

### Phase 2: React Native Bridge (iOS)

- [ ] Create LichVietWidgetBridge.swift
- [ ] Create LichVietWidgetBridge.m (Obj-C bridge)
- [ ] Implement WidgetBridge.ts
- [ ] Create WidgetDataPreparer.ts
- [ ] Implement useWidgetSync hook
- [ ] Test data sync between app and widget

### Phase 3: Android Widget

- [ ] Add Glance dependencies
- [ ] Create data models
- [ ] Implement CalendarWidgetContent composable
- [ ] Create CalendarWidget (GlanceAppWidget)
- [ ] Create CalendarWidgetReceiver
- [ ] Add widget_info.xml
- [ ] Update AndroidManifest.xml
- [ ] Test widget

### Phase 4: Android Bridge

- [ ] Create LichVietWidgetModule.kt
- [ ] Create LichVietWidgetPackage.kt
- [ ] Register package in MainApplication
- [ ] Test cross-platform sync

---

## Recommendations

### Technology Stack Final

| Component | Recommendation | Confidence |
|-----------|----------------|------------|
| **iOS Widget** | WidgetKit + SwiftUI | ✅ High |
| **iOS Size** | `.systemMedium` | ✅ High |
| **iOS Data** | App Groups + UserDefaults | ✅ High |
| **Android Widget** | Jetpack Glance 1.1+ | ✅ High |
| **Android Size** | 4x3 cells | ✅ High |
| **Android Data** | SharedPreferences | ✅ High |
| **RN Bridge** | Custom Native Module | ✅ High |
| **Lunar Calculation** | Pre-compute in RN | ✅ High |

### Implementation Priority

1. **iOS-first**: WidgetKit là mature framework, documentation tốt
2. **Reuse lunar-javascript**: Đã có trong app, không cần duplicate logic
3. **Auto-sync on app open**: Đảm bảo widget luôn up-to-date
4. **Midnight refresh**: Calendar widget cần update hàng ngày

### Estimated Effort

| Task | Effort |
|------|--------|
| iOS Widget Extension | Medium |
| iOS Native Bridge | Low |
| Android Glance Widget | Medium |
| Android Native Bridge | Low |
| TypeScript Integration | Low |
| Testing & Polish | Medium |

---

## Research Sources Summary

### Official Documentation
- [Apple WidgetKit Documentation](https://developer.apple.com/documentation/widgetkit)
- [Android Jetpack Glance](https://developer.android.com/develop/ui/compose/glance)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-intro)

### Tutorials & Guides
- [Swift Senpai - Getting Started WidgetKit](https://swiftsenpai.com/development/getting-started-widgetkit/)
- [Glance Codelab](https://developer.android.com/codelabs/glance)
- [React Native Widget Guide](https://dev.to/rushitjivani/react-native-ultimate-guide-to-create-a-home-screen-widget-for-ios-and-android-1h9g)

### Example Projects
- [WidgetExamples on GitHub](https://github.com/pawello2222/WidgetExamples)
- [react-native-widget-extension](https://github.com/bndkt/react-native-widget-extension)
- [MonthCalendar Glance Library](https://github.com/shreyas-android/month-calendar-app-widget)

