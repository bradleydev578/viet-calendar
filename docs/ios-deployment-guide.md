# Hướng Dẫn Chạy App Trên Thiết Bị Thật & Publish Lên App Store

> Cập nhật: Tháng 1/2026

## Mục Lục

1. [Yêu Cầu Cơ Bản](#1-yêu-cầu-cơ-bản)
2. [Chạy App Trên Thiết Bị Thật (Development)](#2-chạy-app-trên-thiết-bị-thật-development)
3. [Chuẩn Bị Publish Lên App Store](#3-chuẩn-bị-publish-lên-app-store)
4. [Tạo Build Production](#4-tạo-build-production)
5. [Submit Lên App Store Connect](#5-submit-lên-app-store-connect)
6. [Privacy Manifest (Bắt Buộc)](#6-privacy-manifest-bắt-buộc)
7. [Checklist Trước Khi Submit](#7-checklist-trước-khi-submit)

---

## 1. Yêu Cầu Cơ Bản

### Phần Cứng & Phần Mềm

| Yêu cầu | Chi tiết |
|---------|----------|
| **Mac** | macOS 13 (Ventura) trở lên |
| **Xcode** | Xcode 16.x trở lên (bắt buộc từ April 2025) |
| **iOS SDK** | iOS 18 SDK (đi kèm Xcode 16) |
| **Apple ID** | Cần có Apple ID để đăng ký developer |
| **iPhone/iPad** | Thiết bị thật để test (iOS 15+) |

### Tài Khoản Apple Developer

| Loại | Chi phí | Mục đích |
|------|---------|----------|
| **Free Account** | $0 | Test trên thiết bị thật (7 ngày), không publish được |
| **Apple Developer Program** | $99/năm | Publish lên App Store, TestFlight, tối đa 100 thiết bị test |
| **Enterprise Program** | $299/năm | Phân phối nội bộ công ty |

> **Lưu ý**: Tổ chức phi lợi nhuận, giáo dục, chính phủ có thể được miễn phí.

**Đăng ký tại**: https://developer.apple.com/programs/enroll/

---

## 2. Chạy App Trên Thiết Bị Thật (Development)

### Bước 1: Cấu hình Xcode

1. Mở project trong Xcode:
   ```bash
   cd mobile/ios
   open LichViet.xcworkspace
   ```

2. Tìm **Signing & Capabilities** trong Xcode:

   **Bước 2.1**: Trong **Project Navigator** (thanh bên trái), click vào tên project **LichViet** (icon màu xanh dương, ở trên cùng)

   **Bước 2.2**: Ở panel giữa, bạn sẽ thấy 2 cột:
   - Cột trái: **PROJECT** và **TARGETS**
   - Chọn **LichViet** trong phần **TARGETS** (không phải PROJECT)

   **Bước 2.3**: Ở thanh tab phía trên (General, Signing & Capabilities, Resource Tags...), click vào **Signing & Capabilities**

   ```
   ┌─────────────────────────────────────────────────────────────┐
   │  Project Navigator    │  General | Signing & Capabilities | ...
   │  ─────────────────    │  ─────────────────────────────────────
   │  📁 LichViet          │
   │    📁 LichViet        │  TARGETS > LichViet
   │    📁 Pods            │
   │                       │  ☑️ Automatically manage signing
   │                       │  Team: [Chọn Apple ID của bạn]
   │                       │  Bundle Identifier: com.yourname.lichviet
   └─────────────────────────────────────────────────────────────┘
   ```

3. Cấu hình signing:
   - Tick **Automatically manage signing**
   - Chọn **Team** (Apple ID của bạn) từ dropdown
   - Đổi **Bundle Identifier**: `com.yourname.lichviet` (phải unique trên toàn App Store)

### Bước 2: Kết nối thiết bị

1. Kết nối iPhone/iPad qua cáp USB-C hoặc Lightning
2. Trên iPhone: **Settings → General → Device Management** → Trust developer
3. Trong Xcode: Chọn thiết bị từ dropdown (không phải Simulator)

### Bước 3: Build & Run

```bash
# Cách 1: Từ terminal
cd mobile
npm run ios -- --device

# Cách 2: Từ Xcode
# Nhấn Cmd + R hoặc nút Play
```

### Xử lý lỗi thường gặp

**Lỗi "Untrusted Developer":**
- Vào Settings → General → VPN & Device Management → Trust app

**Lỗi "Could not launch app":**
```bash
# Reset Xcode cache
rm -rf ~/Library/Developer/Xcode/DerivedData
cd ios && pod install
```

**Lỗi Signing:**
- Đảm bảo đã chọn đúng Team trong Xcode
- Bundle ID phải unique trên toàn App Store

---

## 3. Chuẩn Bị Publish Lên App Store

### 3.1. Đăng ký Apple Developer Program

1. Truy cập https://developer.apple.com/programs/
2. Click "Enroll" → Đăng nhập Apple ID
3. Thanh toán $99/năm
4. Chờ xác nhận (thường 24-48 giờ)

### 3.2. Tạo App ID & Certificates

**Trong Apple Developer Portal** (https://developer.apple.com/account):

1. **Certificates, Identifiers & Profiles**
2. **Identifiers** → Tạo App ID mới:
   - Platform: iOS
   - Bundle ID: `com.yourcompany.lichviet`
   - Capabilities: Chọn các tính năng cần (Push Notifications nếu có)

3. **Certificates** → Tạo Distribution Certificate:
   - iOS Distribution (App Store and Ad Hoc)
   - Upload CSR từ Keychain Access

4. **Profiles** → Tạo Provisioning Profile:
   - App Store Distribution
   - Chọn App ID và Certificate vừa tạo

### 3.3. Tạo App trên App Store Connect

1. Truy cập https://appstoreconnect.apple.com
2. **My Apps** → **+** → **New App**
3. Điền thông tin:
   - Platform: iOS
   - Name: `Lịch Việt Vạn Sự An Lành`
   - Primary Language: Vietnamese
   - Bundle ID: Chọn từ dropdown
   - SKU: `lichviet2026` (unique identifier)

---

## 4. Tạo Build Production

### 4.1. Cấu hình Release Build

**Trong Xcode:**

1. Chọn scheme **Release** (Product → Scheme → Edit Scheme → Run → Build Configuration → Release)

2. Cập nhật version trong `ios/LichViet/Info.plist`:
   ```xml
   <key>CFBundleShortVersionString</key>
   <string>1.0.0</string>
   <key>CFBundleVersion</key>
   <string>1</string>
   ```

### 4.2. Tạo Archive

1. Trong Xcode:
   - Chọn **Any iOS Device (arm64)** từ device dropdown
   - **Product → Archive**
   - Chờ build hoàn tất

2. Khi Archive thành công:
   - Organizer window sẽ mở
   - Chọn archive vừa tạo
   - Click **Distribute App**

### 4.3. Upload lên App Store Connect

1. Chọn **App Store Connect**
2. Click **Distribute**
3. Chọn các options:
   - ✅ Upload your app's symbols
   - ✅ Manage Version and Build Number
4. Click **Upload**

---

## 5. Submit Lên App Store Connect

### 5.1. Chuẩn bị Assets

| Asset | Kích thước | Số lượng |
|-------|------------|----------|
| **App Icon** | 1024x1024 px | 1 |
| **Screenshots iPhone 6.7"** | 1290x2796 px | 3-10 |
| **Screenshots iPhone 6.5"** | 1242x2688 px | 3-10 |
| **Screenshots iPhone 5.5"** | 1242x2208 px | 3-10 (optional) |
| **Screenshots iPad 12.9"** | 2048x2732 px | 3-10 (nếu có iPad) |

### 5.2. Điền thông tin App

**Trong App Store Connect → App Information:**

```
Tên App: Lịch Việt Vạn Sự An Lành
Subtitle: Lịch âm, phong thủy, ngày tốt xấu
Category: Lifestyle / Utilities
Content Rights: Không chứa nội dung bên thứ 3
Age Rating: 4+
```

**App Privacy:**
- Data Collection: Chọn "No" nếu không thu thập dữ liệu người dùng
- Nếu có thu thập: Khai báo chi tiết loại dữ liệu

### 5.3. Mô tả App (Vietnamese)

```
Lịch Việt Vạn Sự An Lành - Ứng dụng lịch vạn niên Việt Nam với đầy đủ tính năng phong thủy và xem ngày tốt xấu.

TÍNH NĂNG CHÍNH:
• Lịch âm dương đầy đủ với ngày tốt xấu
• Xem 28 Sao, 12 Trực, Hoàng đạo giờ
• La bàn phong thủy với hướng tốt trong ngày
• Danh sách ngày lễ, ngày kỷ niệm Việt Nam
• Điểm đánh giá chất lượng ngày (0-100)
• Hoạt động offline, không cần internet

MIỄN PHÍ - KHÔNG QUẢNG CÁO
```

### 5.4. Submit for Review

1. Chọn build đã upload
2. Điền **App Review Information**:
   - Contact info
   - Demo account (nếu cần login)
   - Notes for reviewer
3. Click **Submit for Review**

---

## 6. Privacy Manifest (Bắt Buộc)

> **Quan trọng**: Từ 2024, Apple bắt buộc khai báo Privacy Manifest cho tất cả app.

### 6.1. Tạo file PrivacyInfo.xcprivacy

Trong Xcode: **File → New → File → App Privacy** → Đặt tên `PrivacyInfo.xcprivacy`

### 6.2. Nội dung cho React Native App

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array/>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <!-- File Timestamp - React Native sử dụng -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>C617.1</string>
            </array>
        </dict>
        <!-- System Boot Time - React Native sử dụng -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>35F9.1</string>
            </array>
        </dict>
        <!-- Disk Space - React Native sử dụng -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>E174.1</string>
            </array>
        </dict>
        <!-- User Defaults - Lưu settings -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

### 6.3. Thêm vào Xcode Project

1. Kéo file `PrivacyInfo.xcprivacy` vào thư mục `ios/LichViet/`
2. Đảm bảo file được thêm vào target

---

## 7. Checklist Trước Khi Submit

### Technical

- [ ] Build thành công với Xcode 16+ và iOS 18 SDK
- [ ] Không có crash, placeholder content
- [ ] Privacy Manifest đã được thêm
- [ ] App Icon 1024x1024 đã có
- [ ] Version number và build number đã cập nhật
- [ ] Bundle ID unique và khớp với App Store Connect

### App Store Connect

- [ ] Screenshots đủ kích thước yêu cầu
- [ ] Mô tả app đầy đủ (Vietnamese + English nếu cần)
- [ ] Category đã chọn
- [ ] Age Rating đã điền
- [ ] App Privacy đã khai báo
- [ ] Contact information đầy đủ

### Legal (EU - Digital Services Act)

- [ ] Trader status đã khai báo (nếu phân phối ở EU)

---

## Timeline Ước Tính

| Bước | Thời gian |
|------|-----------|
| Đăng ký Apple Developer | 24-48 giờ |
| Tạo certificates & profiles | 1-2 giờ |
| Chuẩn bị screenshots & assets | 2-4 giờ |
| Build & Upload | 1-2 giờ |
| App Review | 24-48 giờ (90% apps) |
| **Tổng cộng** | **3-7 ngày** |

---

## Yêu Cầu Mới Từ Apple (2026)

> Nguồn: [Apple Developer - Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)

**Từ tháng 4/2026:**
- iOS/iPadOS apps phải build với iOS 26 SDK
- Xcode 26 trở lên
- visionOS, tvOS, watchOS cũng có yêu cầu tương tự

---

## Tài Liệu Tham Khảo

- [React Native - Publishing to App Store](https://reactnative.dev/docs/publishing-to-app-store)
- [Apple Developer - App Store Submitting](https://developer.apple.com/app-store/submitting/)
- [Apple Developer - Privacy Manifest](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
- [Apple Developer - Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)
- [React Native Privacy Manifest Discussion](https://github.com/react-native-community/discussions-and-proposals/discussions/776)

---

## Hỗ Trợ

Nếu gặp vấn đề trong quá trình submit:
1. Kiểm tra email từ Apple về rejection reasons
2. Xem [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
3. Contact Apple Developer Support

---

*Tài liệu được tạo cho project Lịch Việt Vạn Sự An Lành - Cập nhật 01/2026*
