# Hướng dẫn thiết lập iOS Calendar Widget

**Ngày tạo:** 2026-02-07
**Phiên bản:** 1.0

## Tổng quan

Tài liệu này hướng dẫn thiết lập Calendar Widget cho ứng dụng Lịch Việt trên Xcode.

### Yêu cầu
- Xcode 15.0+
- iOS 14.0+
- macOS Sonoma hoặc mới hơn

### Files đã được tạo sẵn

```
mobile/
├── ios/
│   ├── LichVietTemp/
│   │   ├── Bridge/
│   │   │   ├── LichVietWidgetBridge.swift
│   │   │   └── LichVietWidgetBridge.m
│   │   ├── LichVietTemp-Bridging-Header.h
│   │   └── LichVietTemp.entitlements
│   │
│   └── LichVietWidget/
│       ├── LichVietWidget.swift
│       ├── CalendarProvider.swift
│       ├── Info.plist
│       ├── LichVietWidget.entitlements
│       ├── Models/
│       │   ├── CalendarDay.swift
│       │   └── CalendarWidgetData.swift
│       ├── Views/
│       │   ├── CalendarWidgetView.swift
│       │   ├── WeekdayHeaderView.swift
│       │   ├── CalendarGridView.swift
│       │   └── DayCellView.swift
│       └── Utilities/
│           └── SharedDataManager.swift
│
└── src/core/widget/
    ├── index.ts
    ├── WidgetBridge.ts
    ├── WidgetDataPreparer.ts
    └── useWidgetSync.ts
```

---

## Bước 1: Mở Xcode Project

```bash
cd mobile/ios
open LichVietTemp.xcworkspace
```

> **Lưu ý:** Mở `.xcworkspace` (không phải `.xcodeproj`) vì project sử dụng CocoaPods.

---

## Bước 2: Tạo Widget Extension Target

1. Vào menu **File → New → Target...**

2. Trong popup:
   - Chọn tab **iOS**
   - Tìm và chọn **Widget Extension**
   - Click **Next**

3. Cấu hình Target:

   | Field | Value |
   |-------|-------|
   | Product Name | `LichVietWidget` |
   | Team | (Chọn Apple Developer team của bạn) |
   | Bundle Identifier | `vn.bradley.vietcalendar.CalendarWidget` |
   | Include Live Activity | ❌ **Uncheck** |
   | Include Configuration App Intent | ❌ **Uncheck** |

4. Click **Finish**

5. Khi popup hỏi **"Activate LichVietWidget scheme?"**:
   - Chọn **Cancel** (giữ scheme LichVietTemp)

---

## Bước 3: Xóa file mặc định, thêm file đã tạo

### 3a. Xóa file mặc định

Xcode tự động tạo một số file mẫu. Cần xóa chúng:

1. Trong **Project Navigator** (panel bên trái), mở rộng group **LichVietWidget**
2. Chọn tất cả file Xcode tạo (thường có):
   - `LichVietWidget.swift` (file mẫu)
   - `Assets.xcassets`
   - `LichVietWidgetBundle.swift` (nếu có)
3. **Right-click → Delete → Move to Trash**

### 3b. Thêm Widget files

1. **Right-click** vào group **LichVietWidget**
2. Chọn **Add Files to "LichVietTemp"...**
3. Navigate đến folder: `ios/LichVietWidget/`
4. **Select ALL** files và folders:
   ```
   ✅ LichVietWidget.swift
   ✅ CalendarProvider.swift
   ✅ Info.plist
   ✅ LichVietWidget.entitlements
   ✅ Models/ (cả folder)
   ✅ Views/ (cả folder)
   ✅ Utilities/ (cả folder)
   ```
5. Trong Options panel:
   - ❌ **Copy items if needed** = **Uncheck**
   - ✅ **Create groups** = Check
   - ✅ **Add to targets**: Chỉ check **LichVietWidget**
6. Click **Add**

---

## Bước 4: Thêm Bridge files vào Main App

1. **Right-click** vào group **LichVietTemp** (không phải LichVietWidget)
2. Chọn **Add Files to "LichVietTemp"...**
3. Navigate đến folder: `ios/LichVietTemp/`
4. Select:
   ```
   ✅ Bridge/ (cả folder)
   ✅ LichVietTemp-Bridging-Header.h
   ✅ LichVietTemp.entitlements
   ```
5. Trong Options panel:
   - ❌ **Copy items if needed** = **Uncheck**
   - ✅ **Create groups** = Check
   - ✅ **Add to targets**: Chỉ check **LichVietTemp**
6. Click **Add**

---

## Bước 5: Cấu hình Bridging Header

Bridging Header cho phép Swift code gọi React Native Objective-C modules.

1. Chọn **LichVietTemp** project (icon xanh ở trên cùng Project Navigator)
2. Chọn target **LichVietTemp** (trong TARGETS section)
3. Chọn tab **Build Settings**
4. Trong search box, gõ: `bridging`
5. Tìm setting **Objective-C Bridging Header**
6. **Double-click** vào ô value
7. Nhập path:
   ```
   $(SRCROOT)/LichVietTemp/LichVietTemp-Bridging-Header.h
   ```
8. Nhấn **Enter** để confirm

---

## Bước 6: Cấu hình App Groups

App Groups cho phép Main App và Widget Extension chia sẻ data qua UserDefaults.

### 6a. Cấu hình cho Main App

1. Chọn target **LichVietTemp**
2. Chọn tab **Signing & Capabilities**
3. Click nút **+ Capability** (góc trên trái của panel)
4. Tìm và double-click **App Groups**
5. App Groups section sẽ xuất hiện
6. Click nút **+** trong App Groups section
7. Nhập identifier:
   ```
   group.vn.bradley.vietcalendar.shared
   ```
8. Click **OK**

### 6b. Cấu hình cho Widget

1. Chọn target **LichVietWidget**
2. Chọn tab **Signing & Capabilities**
3. Click **+ Capability**
4. Chọn **App Groups**
5. Click **+**
6. Nhập cùng identifier:
   ```
   group.vn.bradley.vietcalendar.shared
   ```
7. Click **OK**

> **Quan trọng:** Cả 2 targets PHẢI có cùng App Group identifier!

---

## Bước 7: Link Entitlements Files

### 7a. Main App Entitlements

1. Chọn target **LichVietTemp**
2. Chọn tab **Build Settings**
3. Search: `Code Signing Entitlements`
4. Set value:
   ```
   LichVietTemp/LichVietTemp.entitlements
   ```

### 7b. Widget Entitlements

1. Chọn target **LichVietWidget**
2. Chọn tab **Build Settings**
3. Search: `Code Signing Entitlements`
4. Set value:
   ```
   LichVietWidget/LichVietWidget.entitlements
   ```

---

## Bước 8: Build và Run

### Build

1. Chọn scheme **LichVietTemp** (dropdown ở toolbar)
2. Chọn target device (Simulator hoặc Real Device)
3. **Product → Build** (hoặc ⌘B)
4. Đợi build hoàn thành (không có errors)

### Run

1. **Product → Run** (hoặc ⌘R)
2. App sẽ install và launch

---

## Bước 9: Test Widget

### Trên iOS Simulator

1. Sau khi app chạy, nhấn **Home** button:
   - Shortcut: **⌘ + Shift + H**

2. **Long-press** (giữ) vào vùng trống trên Home Screen
   - Các app icons sẽ rung

3. Click nút **+** (góc trên trái)

4. Trong Widget Gallery:
   - Search: `Lịch Việt`
   - Hoặc scroll tìm app

5. Chọn size **Medium** (recommended)

6. Click **Add Widget**

7. Click **Done** (góc trên phải)

8. Widget sẽ hiển thị calendar với:
   - Header: Tháng dương | Tháng âm + Can Chi
   - Weekdays: T2, T3, T4, T5, T6, T7, CN
   - Calendar grid với ngày dương (to) và ngày âm (nhỏ)
   - Today được highlight màu đỏ

### Trên Real Device

Làm tương tự như Simulator. Widget sẽ:
- Tự động sync data khi mở app
- Refresh vào lúc 00:00:01 mỗi ngày

---

## Troubleshooting

### ❌ Lỗi: "No such module 'WidgetKit'"

**Nguyên nhân:** Swift files chưa được add đúng target.

**Fix:**
1. Chọn file Swift trong Project Navigator
2. Trong **File Inspector** (panel phải)
3. Kiểm tra **Target Membership**
4. Đảm bảo check đúng target (LichVietWidget cho widget files)

---

### ❌ Lỗi: "App Groups not configured"

**Nguyên nhân:** App Groups chưa được setup đúng.

**Fix:**
1. Kiểm tra lại Bước 6
2. Đảm bảo CẢ 2 targets đều có App Groups
3. App Group identifier phải GIỐNG NHAU

---

### ❌ Widget không hiện trong Widget Gallery

**Nguyên nhân:** iOS chưa index widget extension.

**Fix:**
1. Clean build: **Product → Clean Build Folder** (⌘⇧K)
2. Build lại: **Product → Build** (⌘B)
3. Run app
4. Đợi 1-2 phút để iOS index
5. Thử lại add widget

---

### ❌ Widget hiển thị "Mở app để cập nhật"

**Nguyên nhân:** Chưa có data trong App Groups storage.

**Fix:**
1. Mở app Lịch Việt
2. App sẽ tự động sync data khi launch
3. Check Console log: `[Widget] Synced calendar data for Tháng X`
4. Quay lại Home Screen, widget sẽ update

---

### ❌ Build lỗi: "Signing & Capabilities error"

**Nguyên nhân:** Provisioning profile chưa support App Groups.

**Fix:**
1. Vào [Apple Developer Portal](https://developer.apple.com)
2. Certificates, Identifiers & Profiles
3. Tạo/update App Group identifier
4. Update Provisioning Profiles
5. Xcode: **Preferences → Accounts → Download Manual Profiles**

---

## Kiểm tra cấu trúc Project

Sau khi hoàn thành, Project Navigator nên trông như sau:

```
📁 LichVietTemp (project - icon xanh)
│
├── 📁 LichVietTemp (group)
│   ├── 📄 AppDelegate.h
│   ├── 📄 AppDelegate.mm
│   ├── 📄 main.m
│   ├── 📄 Info.plist
│   ├── 📄 LaunchScreen.storyboard
│   ├── 📄 LichVietTemp.entitlements         ← ✅ NEW
│   ├── 📄 LichVietTemp-Bridging-Header.h    ← ✅ NEW
│   └── 📁 Bridge/                            ← ✅ NEW
│       ├── 📄 LichVietWidgetBridge.swift
│       └── 📄 LichVietWidgetBridge.m
│
├── 📁 LichVietWidget (group)                 ← ✅ NEW TARGET
│   ├── 📄 LichVietWidget.swift
│   ├── 📄 CalendarProvider.swift
│   ├── 📄 Info.plist
│   ├── 📄 LichVietWidget.entitlements
│   ├── 📁 Models/
│   │   ├── 📄 CalendarDay.swift
│   │   └── 📄 CalendarWidgetData.swift
│   ├── 📁 Views/
│   │   ├── 📄 CalendarWidgetView.swift
│   │   ├── 📄 WeekdayHeaderView.swift
│   │   ├── 📄 CalendarGridView.swift
│   │   └── 📄 DayCellView.swift
│   └── 📁 Utilities/
│       └── 📄 SharedDataManager.swift
│
├── 📁 LichVietTempTests
│
└── 📁 Pods
```

---

## Configuration Summary

| Setting | Value |
|---------|-------|
| Main App Bundle ID | `vn.bradley.vietcalendar` |
| Widget Bundle ID | `vn.bradley.vietcalendar.CalendarWidget` |
| App Group ID | `group.vn.bradley.vietcalendar.shared` |
| Shared Key | `calendarData` |
| Widget Kind | `CalendarWidget` |
| Supported Widget Sizes | Medium only |
| Minimum iOS | 14.0 |

---

## Related Files

- [Feature Specification](../features/calendar-widget-feature-spec.md)
- [Tech Spec](../sprint-artifacts/tech-spec-calendar-widget.md)
- [Technical Research](../analysis/research/technical-calendar-widget-ios-android-research-2026-02-06.md)

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-07 | Initial guide |
