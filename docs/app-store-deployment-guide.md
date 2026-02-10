# Hướng Dẫn Triển Khai App Lịch Việt Lên Apple App Store

## Mục Lục

1. [Yêu Cầu Trước Khi Bắt Đầu](#1-yêu-cầu-trước-khi-bắt-đầu)
2. [Cấu Hình Xcode Project](#2-cấu-hình-xcode-project)
3. [Tạo App Trên App Store Connect](#3-tạo-app-trên-app-store-connect)
4. [Build và Archive App](#4-build-và-archive-app)
5. [Upload Lên App Store](#5-upload-lên-app-store)
6. [Điền Thông Tin App Store](#6-điền-thông-tin-app-store)
7. [Submit Để Review](#7-submit-để-review)
8. [Checklist Trước Khi Submit](#8-checklist-trước-khi-submit)
9. [Xử Lý Rejection (Nếu Có)](#9-xử-lý-rejection-nếu-có)

---

## 1. Yêu Cầu Trước Khi Bắt Đầu

### 1.1 Tài Khoản & Thiết Bị

- [ ] **Apple Developer Account** ($99/năm) - Đã có ✅
- [ ] **Mac** với Xcode phiên bản mới nhất
- [ ] **Apple ID** đã được thêm vào Xcode

### 1.2 Tài Liệu Cần Chuẩn Bị

| Tài Liệu | Yêu Cầu | Trạng Thái |
|----------|---------|------------|
| App Icon | 1024x1024px, PNG, không trong suốt | ✅ Đã có |
| Screenshots iPhone 6.5" | 1284x2778px hoặc 1242x2688px | ✅ 7 ảnh |
| App Description | Tối đa 4000 ký tự | Xem bên dưới |
| Keywords | Tối đa 100 ký tự | Xem bên dưới |
| Privacy Policy URL | Bắt buộc | Cần tạo |
| Support URL | Bắt buộc | Cần tạo |

---

## 2. Cấu Hình Xcode Project

### 2.1 Mở Project

```bash
cd /Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile
open ios/LichVietTemp.xcworkspace
```

### 2.2 Cấu Hình General

Trong Xcode, chọn **LichVietTemp** target → **General**:

| Field | Giá Trị Đề Xuất |
|-------|-----------------|
| Display Name | `Lịch Việt` |
| Bundle Identifier | `com.bangca.lichviet` (thay đổi theo ý bạn) |
| Version | `1.0.0` |
| Build | `1` |
| Deployment Target | `iOS 13.0` hoặc cao hơn |

### 2.3 Cấu Hình Signing

1. Chọn **Signing & Capabilities** tab
2. Tick ✅ **Automatically manage signing**
3. Chọn **Team**: Apple Developer Account của bạn
4. Xcode sẽ tự động tạo Provisioning Profile

### 2.4 Cập Nhật Info.plist

Thêm các key sau vào `ios/LichVietTemp/Info.plist`:

```xml
<!-- Mô tả quyền sử dụng Compass -->
<key>NSMotionUsageDescription</key>
<string>Ứng dụng cần truy cập cảm biến chuyển động để hiển thị la bàn phong thủy.</string>

<!-- Mô tả quyền Location (nếu dùng) -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Ứng dụng cần vị trí để hiển thị hướng la bàn chính xác.</string>

<!-- Encryption Compliance (QUAN TRỌNG) -->
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

### 2.5 Đổi Tên App (Nếu Muốn)

Để đổi từ "LichVietTemp" sang "Lịch Việt":

1. Trong Xcode: **Product** → **Scheme** → **Manage Schemes**
2. Rename scheme
3. Hoặc chỉ cần đổi **Display Name** trong General (khuyên dùng)

---

## 3. Tạo App Trên App Store Connect

### 3.1 Truy Cập App Store Connect

1. Vào [https://appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Đăng nhập bằng Apple ID Developer

### 3.2 Tạo App Mới

1. Click **My Apps** → **+** → **New App**
2. Điền thông tin:

| Field | Giá Trị |
|-------|---------|
| Platform | iOS |
| Name | `Lịch Việt - Vạn Sự An Lành` |
| Primary Language | Vietnamese |
| Bundle ID | Chọn Bundle ID đã tạo trong Xcode |
| SKU | `lichviet2024` (bất kỳ, unique) |
| User Access | Full Access |

3. Click **Create**

---

## 4. Build và Archive App

### 4.1 Chuẩn Bị Build

```bash
cd /Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile

# Clean install dependencies
rm -rf node_modules && npm install

# Install iOS pods
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

### 4.2 Build Archive trong Xcode

1. Chọn device: **Any iOS Device (arm64)** (KHÔNG chọn Simulator)
2. Menu: **Product** → **Scheme** → **Edit Scheme**
3. Chọn **Archive** → Build Configuration: **Release**
4. Close
5. Menu: **Product** → **Archive**
6. Đợi build hoàn tất (5-15 phút)

### 4.3 Xử Lý Lỗi Build Thường Gặp

**Lỗi Signing:**
```
Xcode → Preferences → Accounts → Download Manual Profiles
```

**Lỗi Pod:**
```bash
cd ios
pod deintegrate
pod install
```

**Lỗi Node Modules:**
```bash
rm -rf node_modules
rm -rf /tmp/metro-*
npm install
```

---

## 5. Upload Lên App Store

### 5.1 Sử Dụng Xcode Organizer

1. Sau khi Archive xong, **Organizer** tự động mở
2. Chọn archive vừa tạo
3. Click **Distribute App**
4. Chọn **App Store Connect** → **Upload**
5. Các options:
   - ✅ Upload your app's symbols
   - ✅ Manage Version and Build Number
6. Click **Upload**
7. Đợi upload + processing (10-30 phút)

### 5.2 Kiểm Tra Trạng Thái

1. Vào App Store Connect → My Apps → Lịch Việt
2. Chọn tab **TestFlight** hoặc **App Store**
3. Kiểm tra build đã xuất hiện chưa

---

## 6. Điền Thông Tin App Store

### 6.1 App Information

Vào App Store Connect → App → **App Information**:

| Field | Giá Trị |
|-------|---------|
| Name | Lịch Việt - Vạn Sự An Lành |
| Subtitle | Lịch âm, phong thủy, giờ hoàng đạo |
| Category | Lifestyle (Primary), Utilities (Secondary) |
| Content Rights | Does not contain third-party content |

### 6.2 Pricing and Availability

- **Price**: Free
- **Availability**: Vietnam (hoặc All Countries)

### 6.3 App Privacy

Vào **App Privacy** và khai báo:

**Data Types Collected:**
- ✅ Analytics (nếu dùng Firebase Analytics)
  - Data linked to user: No
  - Data used to track: No

**Privacy Policy URL**: (Xem phần 6.5)

### 6.4 Version Information

Xem file chi tiết bên dưới: [app-store-metadata.md](#file-app-store-metadatamd)

### 6.5 Tạo Privacy Policy

Tạo trang Privacy Policy đơn giản trên GitHub Pages hoặc website:

```
https://your-github-username.github.io/lich-viet/privacy-policy
```

Hoặc sử dụng các dịch vụ miễn phí:
- [FreePrivacyPolicy.com](https://www.freeprivacypolicy.com)
- [TermsFeed](https://www.termsfeed.com)

---

## 7. Submit Để Review

### 7.1 Hoàn Tất Thông Tin

1. Vào **App Store** tab → Version mới
2. Điền đầy đủ:
   - ✅ Screenshots (7 ảnh đã có)
   - ✅ Description
   - ✅ Keywords
   - ✅ Support URL
   - ✅ Marketing URL (optional)
3. Chọn **Build** → Add build đã upload
4. Điền **App Review Information**:
   - Contact: Tên + Email + Phone
   - Notes: Ghi chú cho reviewer (nếu cần)

### 7.2 Submit

1. Click **Add for Review**
2. Chọn:
   - Content Rights: ✅ This app does not contain...
   - Advertising Identifier: ❌ No (nếu không dùng IDFA)
   - Encryption: ❌ No (chỉ dùng HTTPS tiêu chuẩn)
3. Click **Submit to App Review**

### 7.3 Thời Gian Review

- **Thông thường**: 24-48 giờ
- **Có thể lâu hơn**: 1-2 tuần (dịp lễ, app đầu tiên)

---

## 8. Checklist Trước Khi Submit

### Technical

- [ ] App không crash khi mở
- [ ] Tất cả tính năng hoạt động offline
- [ ] La bàn hoạt động trên thiết bị thật
- [ ] Không có console.log trong Production
- [ ] Bundle Identifier đúng và unique

### Content

- [ ] Tên app không vi phạm trademark
- [ ] Screenshots phản ánh đúng app
- [ ] Description không có lỗi chính tả
- [ ] Privacy Policy URL hoạt động
- [ ] Support URL hoạt động

### Compliance

- [ ] Info.plist có đủ usage descriptions
- [ ] ITSAppUsesNonExemptEncryption = NO
- [ ] Khai báo đúng data collection trong App Privacy
- [ ] Không thu thập dữ liệu người dùng không cần thiết

---

## 9. Xử Lý Rejection (Nếu Có)

### Lý Do Rejection Phổ Biến

| Lý Do | Cách Xử Lý |
|-------|-----------|
| **Guideline 2.1 - Crash** | Test kỹ trên thiết bị thật, fix crash |
| **Guideline 2.3 - Metadata** | Sửa screenshots/description cho chính xác |
| **Guideline 4.2 - Minimum Functionality** | Thêm tính năng, làm app hữu ích hơn |
| **Guideline 5.1.1 - Privacy** | Thêm Privacy Policy, khai báo data đúng |
| **Guideline 5.1.2 - Data Use** | Giải thích rõ lý do cần quyền truy cập |

### Cách Phản Hồi

1. Đọc kỹ lý do rejection trong Resolution Center
2. Sửa lỗi theo yêu cầu
3. Reply trong Resolution Center giải thích đã sửa gì
4. Upload build mới (nếu cần)
5. Submit lại

---

## Phụ Lục

### A. Các Lệnh Hữu Ích

```bash
# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reset iOS Simulator
xcrun simctl erase all

# Check provisioning profiles
ls ~/Library/MobileDevice/Provisioning\ Profiles/

# Open Xcode organizer
open -a Xcode
# Then: Window → Organizer
```

### B. Tài Liệu Tham Khảo

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

---

**Ngày tạo**: 23/01/2026
**Cập nhật lần cuối**: 23/01/2026
**Tác giả**: Bằng Ca
