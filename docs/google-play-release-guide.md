# 
    ướng Dẫn Triển Khai App Lên Google Play Store — Lịch Việt

**Ngày tạo:** 2026-02-28
**Phiên bản:** v1.0
**Trạng thái:** Checklist cho lần submit đầu tiên

---

## Mục Lục

1. [Trước Khi Bắt Đầu — Prerequisites](#1-trước-khi-bắt-đầu--prerequisites)
2. [Tạo App Trên Google Play Console](#2-tạo-app-trên-google-play-console)
3. [Store Listing — Metadata](#3-store-listing--metadata)
4. [Screenshots &amp; Graphics](#4-screenshots--graphics)
5. [Privacy Policy](#5-privacy-policy)
6. [App Access](#6-app-access)
7. [Ads](#7-ads)
8. [Content Rating](#8-content-rating)
9. [Target Audience](#9-target-audience)
10. [Data Safety](#10-data-safety)
11. [Government Apps](#11-government-apps)
12. [Financial Features](#12-financial-features)
13. [Health](#13-health)
14. [Signing & Build](#14-signing--build)
15. [Testing Tracks — Upload AAB](#15-testing-tracks--upload-aab)
16. [Production Release](#16-production-release)
17. [Chạy App Trên Thiết Bị Android Ảo & Thật](#17-chạy-app-trên-thiết-bị-android-ảo--thật)
18. [Checklist Tổng Hợp](#18-checklist-tổng-hợp)

---

## 1. Trước Khi Bắt Đầu — Prerequisites

### 1.1 Google Play Developer Account

| Yêu cầu                                      | Trạng thái         | Ghi chú                                                 |
| ---------------------------------------------- | -------------------- | -------------------------------------------------------- |
| Google Play Developer Account ($25, một lần) | ❌ Cần đăng ký   | https://play.google.com/console/signup                   |
| Google Account 2FA bật                        | ❌ Cần kiểm tra    | Bắt buộc                                               |
| Identity verification                          | ❌ Cần hoàn thành | Google yêu cầu xác minh danh tính (ID + ảnh selfie) |

> **Lưu ý:** Tài khoản cá nhân (Individual) mới cần đợi xác minh danh tính — có thể mất 2–5 ngày.

### 1.2 Cấu Hình Android Project

**Thông tin hiện tại trong project:**

| Config         | Giá trị                   | File                         |
| -------------- | --------------------------- | ---------------------------- |
| Application ID | `vn.bradley.vietcalendar` | `android/app/build.gradle` |
| App Label      | `LichVietTemp`            | `res/values/strings.xml`   |
| Version Name   | `1.0`                     | `android/app/build.gradle` |
| Version Code   | `1`                       | `android/app/build.gradle` |
| Min SDK        | 21 (Android 5.0)            | `android/build.gradle`     |
| Target SDK     | 35 (Android 15)             | `android/build.gradle`     |
| Compile SDK    | 35 (Android 15)             | `android/build.gradle`     |
| Build Tools    | 35.0.0                      | `android/build.gradle`     |
| NDK Version    | 25.1.8937393                | `android/build.gradle`     |
| Kotlin Version | 1.8.0                       | `android/build.gradle`     |
| React Native   | 0.73.11                     | `package.json`             |
| Hermes Engine  | Enabled                     | `gradle.properties`        |

> ⚠️ **Cần sửa:** App label hiện là `LichVietTemp` — cần đổi thành `Lịch Việt` trong `strings.xml` trước khi release.

> ⚠️ **Target SDK 35 (Android 15):** Google Play yêu cầu app mới phải target API 35 trở lên (từ 2025). Project đã được cập nhật lên SDK 35. Lưu ý Android 15 có một số behavior changes: edge-to-edge enforcement, tighter background restrictions — cần test kỹ trên emulator API 35.

### 1.3 Signing Key — TẠO UPLOAD KEY

> ⚠️ **QUAN TRỌNG:** Google Play yêu cầu ký app bằng key riêng. Key này **KHÔNG ĐƯỢC MẤT** — nếu mất sẽ không thể update app.

**Bước 1: Tạo keystore**

```bash
cd mobile/android/app

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore lich-viet-upload-key.keystore \
  -alias lich-viet-upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Khi hỏi, nhập:

- **Keystore password:** *(chọn mật khẩu mạnh, ghi lại an toàn)*
- **Key password:** *(có thể giống keystore password)*
- **First and Last Name:** Bradley
- **Organization:** Bradley
- **Country Code:** VN

**Bước 2: Backup ngay lập tức**

1. Copy `lich-viet-upload-key.keystore` vào nơi an toàn (Google Drive, iCloud, v.v.)
2. Lưu passwords vào password manager
3. KHÔNG BAO GIỜ commit keystore lên git

> ✅ `.gitignore` hiện tại đã có `*.keystore` + `!debug.keystore` — keystore release sẽ tự động bị ignore.

**Bước 3: Thêm signing config vào `gradle.properties`**

Thêm vào cuối file `mobile/android/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=lich-viet-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=lich-viet-upload
MYAPP_UPLOAD_STORE_PASSWORD=your_keystore_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

> ⚠️ **KHÔNG commit** `gradle.properties` với passwords thật lên git. Cân nhắc dùng environment variables thay thế (xem bước 4).

**Bước 4 (tuỳ chọn): Dùng environment variables (an toàn hơn)**

```bash
# Thêm vào ~/.zshrc
export LICHVIET_UPLOAD_STORE_PASSWORD=your_keystore_password
export LICHVIET_UPLOAD_KEY_PASSWORD=your_key_password
```

Trong `gradle.properties`, để trống password:

```properties
MYAPP_UPLOAD_STORE_FILE=lich-viet-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=lich-viet-upload
MYAPP_UPLOAD_STORE_PASSWORD=
MYAPP_UPLOAD_KEY_PASSWORD=
```

**Bước 5: Cập nhật `android/app/build.gradle`**

Thay thế `signingConfigs` và `buildTypes` hiện tại:

```gradle
android {
    // ... existing config ...

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword System.getenv("LICHVIET_UPLOAD_STORE_PASSWORD") ?: MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword System.getenv("LICHVIET_UPLOAD_KEY_PASSWORD") ?: MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}
```

> ⚠️ **Hiện tại** release build đang dùng `signingConfigs.debug` — BẮT BUỘC phải đổi trước khi upload Play Store.

**Bước 6: Cập nhật ProGuard rules**

Thêm vào `mobile/android/app/proguard-rules.pro`:

```proguard
# React Native
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class io.invertase.firebase.** { *; }

# React Native SVG
-keep public class com.horcrux.svg.** { *; }

# React Native Sensors
-keep class com.sensors.** { *; }

# Keep Vietnamese text encoding
-keep class java.nio.charset.** { *; }
```

---

## 2. Tạo App Trên Google Play Console

Truy cập **Play Console → All apps → Create app**:

| Field                      | Giá trị                           | Ghi chú                             |
| -------------------------- | ----------------------------------- | ------------------------------------ |
| **App name**         | `Lịch Việt - Vạn Sự An Lành` | 30 ký tự tối đa                  |
| **Default language** | Vietnamese (vi)                     | Có thể thêm English sau           |
| **App or game**      | App                                 | —                                   |
| **Free or paid**     | Free                                | Không đổi được sau khi publish |

**Declarations:**

| Khai báo                  | Trả lời |
| -------------------------- | --------- |
| Developer Program Policies | ✅ Accept |
| US export laws             | ✅ Accept |

---

## 3. Store Listing — Metadata

Truy cập **Play Console → Grow → Store presence → Main store listing**:

### 3.1 App Details

**Vietnamese (vi) — Default:**

| Field                       | Giới hạn    | Giá trị (VI)                                                                                          |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| **App name**          | 30 ký tự    | `Lịch Việt - Vạn Sự An Lành`                                                                     |
| **Short description** | 80 ký tự    | `Lịch âm, phong thủy, giờ hoàng đạo, việc nên làm mỗi ngày. Tra cứu nhanh, chính xác.` |
| **Full description**  | 4,000 ký tự | *(xem bên dưới)*                                                                                   |

**English (en-US):**

| Field                       | Giới hạn    | Giá trị (EN)                                                                                     |
| --------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| **App name**          | 30 ký tự    | `Lịch Việt - Lunar Calendar`                                                                   |
| **Short description** | 80 ký tự    | `Vietnamese lunar calendar with feng shui, auspicious hours, and daily guidance. Offline-first.` |
| **Full description**  | 4,000 ký tự | *(xem bên dưới)*                                                                              |

**Full Description (Vietnamese):**

```
Lịch Việt - Vạn Sự An Lành

Ứng dụng lịch Việt toàn diện với lịch âm dương, phong thủy, giờ hoàng đạo và hướng dẫn việc nên/không nên làm mỗi ngày. Tra cứu nhanh, chính xác, hoạt động offline.

TÍNH NĂNG CHÍNH

📅 Lịch Âm Dương
- Chuyển đổi ngày dương lịch ↔ âm lịch chính xác
- Hiển thị Can Chi (Thiên Can, Địa Chi) cho năm, tháng, ngày, giờ
- Nhị thập bát tú (28 sao)
- 12 Trực (Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thâu, Khai, Bế)
- 24 Tiết khí

🧭 Phong Thủy Hàng Ngày
- Hướng xuất hành tốt
- Giờ hoàng đạo / hắc đạo
- Việc nên làm và không nên làm (38 hoạt động)
- Đánh giá chất lượng ngày (0-100%)

🔍 Tra Cứu Nhanh
- Xem lịch theo ngày, tuần, tháng
- Tìm ngày tốt cho các sự kiện quan trọng
- Lịch ngày lễ, ngày kỷ niệm Việt Nam

⭐ ĐẶC ĐIỂM NỔI BẬT
- Hoạt động offline — không cần mạng
- Dữ liệu phong thủy chuẩn xác từ nhiều nguồn
- Giao diện đẹp, dễ sử dụng
- Tính toán thiên văn chính xác bằng lunar-javascript
- Hỗ trợ tiếng Việt đầy đủ
- Không cần tài khoản, không quảng cáo

DỮ LIỆU ĐÁNG TIN CẬY
- Kết hợp tính toán thời gian thực + dữ liệu phong thủy đã kiểm chứng
- Cross-validation từ nhiều nguồn (lichngaytot.com, xemngay.com)
- Đối chiếu với thư viện lunar-javascript cho độ chính xác cao

Lịch Việt — Vạn Sự An Lành, mỗi ngày đều tốt lành!
```

**Full Description (English):**

```
Lịch Việt - Vietnamese Lunar Calendar

A comprehensive Vietnamese calendar app featuring lunar-solar date conversion, feng shui guidance, auspicious hours, and daily activity recommendations. Fast, accurate, and works offline.

KEY FEATURES

📅 Lunar-Solar Calendar
- Accurate solar ↔ lunar date conversion
- Can Chi (Heavenly Stems & Earthly Branches) for year, month, day, hour
- 28 Mansions/Stars (Nhị thập bát tú)
- 12 Day Officers (12 Trực)
- 24 Solar Terms (Tiết khí)

🧭 Daily Feng Shui
- Auspicious travel directions
- Lucky hours (Giờ hoàng đạo)
- Activities to do and avoid (38 categories)
- Day quality score (0-100%)

🔍 Quick Lookup
- View by day, week, month
- Find auspicious dates for important events
- Vietnamese holidays and anniversaries

⭐ HIGHLIGHTS
- Works offline — no internet needed
- Accurate feng shui data from verified sources
- Beautiful, easy-to-use interface
- Precise astronomical calculations via lunar-javascript
- Full Vietnamese language support
- No account required, no ads

TRUSTED DATA
- Combines real-time calculations + verified feng shui data
- Cross-validated from multiple sources
- Verified against lunar-javascript library for accuracy

Lịch Việt — Peace and prosperity, every day!
```

### 3.2 Localization

Truy cập **Store listing → Manage translations → Add language → English (en-US)**

> **Lưu ý:** Google Play KHÔNG có trường "Keywords" riêng — Google tự trích xuất từ title và description. Đảm bảo description chứa đủ từ khoá tự nhiên.

---

## 4. Screenshots & Graphics

### 4.1 Yêu cầu bắt buộc

| Asset                        | Kích thước                          | Bắt buộc    | Số lượng | Format               |
| ---------------------------- | -------------------------------------- | ------------- | ----------- | -------------------- |
| **App icon**           | 512 × 512 px                          | ✅            | 1           | PNG 32-bit, alpha OK |
| **Feature graphic**    | 1024 × 500 px                         | ✅            | 1           | PNG hoặc JPEG       |
| **Phone screenshots**  | 16:9 hoặc 9:16, min 320px, max 3840px | ✅            | 2–8        | PNG hoặc JPEG       |
| **Tablet screenshots** | 16:9 hoặc 9:16, min 320px, max 3840px | Khuyến nghị | 0–8        | PNG hoặc JPEG       |

### 4.2 App Icon (512 × 512)

- Dùng cùng icon với app nhưng render ở 512px
- Google sẽ tự bo tròn theo Adaptive Icon spec
- **KHÔNG** thêm viền bo tròn — Google tự xử lý
- Nền nên đặc (không trong suốt) để đẹp trên mọi device

### 4.3 Feature Graphic (1024 × 500)

- Hiện ở **đầu store page** trên Google Play
- Gợi ý: logo Lịch Việt + tagline "Vạn Sự An Lành" + hình lịch âm trên nền truyền thống
- Không chứa text quá nhỏ (khó đọc trên mobile)

### 4.4 Phone Screenshots

**Kích thước khuyến nghị:** 1080 × 1920 px (portrait, 9:16)

| # | Nội dung                                                         | Caption                         |
| - | ----------------------------------------------------------------- | ------------------------------- |
| 1 | **Home Screen** — lịch tháng + thông tin ngày hôm nay | "Lịch âm dương chính xác" |
| 2 | **Day Detail** — chi tiết phong thủy ngày               | "Phong thủy hàng ngày"       |
| 3 | **Auspicious Hours** — giờ hoàng đạo                   | "Giờ hoàng đạo, hắc đạo" |
| 4 | **Activities** — việc nên/không nên làm               | "Việc nên & không nên làm" |
| 5 | **Holiday List** — danh sách ngày lễ                    | "Ngày lễ Việt Nam"           |
| 6 | **Settings** — giao diện cài đặt                       | "Tuỳ chỉnh theo ý bạn"      |

**Cách chụp:**

```bash
# Chạy app trên emulator hoặc device thật
cd mobile && npx react-native run-android --mode=release

# Chụp screenshot từ emulator/device
adb exec-out screencap -p > screenshot1.png

# Hoặc dùng Android Studio → Device mirroring → Screenshot button
```

---

## 5. Privacy Policy

Truy cập **Play Console → Policy and programs → App content → Privacy policy**:

| Field                        | Giá trị                        |
| ---------------------------- | -------------------------------- |
| **Privacy Policy URL** | *(URL trang privacy policy)* |

> URL **phải truy cập được** (public) trước khi submit. Cần tạo trang Privacy Policy trước.

**Nội dung tối thiểu cần có trong Privacy Policy:**

- App name: Lịch Việt
- Dữ liệu thu thập: Firebase Analytics (app interactions, diagnostics)
- Mục đích: cải thiện trải nghiệm người dùng
- Không thu thập thông tin cá nhân (tên, email, vị trí)
- Không chia sẻ dữ liệu với bên thứ ba
- Liên hệ: email support

---

## 6. App Access

Truy cập **Play Console → Policy and programs → App content → App access**:

Chọn: **All functionality in my app is available without any access restrictions**

> Lịch Việt không yêu cầu login, tài khoản, hay quyền truy cập đặc biệt.

### 6.1 Testing Instructions (nếu Google yêu cầu)

```
Lịch Việt is a Vietnamese lunar calendar app. No login is required.

HOW TO TEST:
1. Launch app → Home screen shows calendar with today's lunar/solar date
2. Tap any date to see detailed feng shui information
3. View Can Chi (Heavenly Stems & Earthly Branches) for the day
4. Check auspicious hours (giờ hoàng đạo)
5. View recommended activities (việc nên làm) and activities to avoid

NAVIGATION:
- Calendar tab: Monthly calendar view with lunar dates
- Day Detail: Tap any date for full feng shui details
- Holiday List: Vietnamese holidays and commemorations
- Settings: App preferences and configurations

NOTES:
- App works fully offline (all calculations done on-device)
- Lunar calculations use lunar-javascript library
- Feng shui data is pre-bundled with the app
- Language: Vietnamese (primary), some astronomical terms in Chinese/Vietnamese
- No ads, no in-app purchases, no user accounts
- App uses Firebase Analytics for usage statistics only
```

---

## 7. Ads

Truy cập **Play Console → Policy and programs → App content → Ads**:

| Câu hỏi                  | Trả lời    |
| -------------------------- | ------------ |
| Does your app contain ads? | **No** |

> Lịch Việt hiện KHÔNG chứa quảng cáo.

---

## 8. Content Rating

Truy cập **Play Console → Policy and programs → App content → Content rating**:

Google dùng bảng hỏi **IARC** (International Age Rating Coalition). Trả lời như sau:

### 8.1 Category

| Field         | Giá trị                    |
| ------------- | ---------------------------- |
| Email address | *(email liên hệ)*        |
| Category      | **All Other App Types** |

### 8.2 Questionnaire

#### Downloaded App

| Câu hỏi                                                                              | Trả lời    |
| --------------------------------------------------------------------------------------- | ------------ |
| Does the app include a feature that allows the user to download apps from a source outside Google Play? | **No** |

#### User Content Sharing

| Câu hỏi                                                                              | Trả lời    |
| --------------------------------------------------------------------------------------- | ------------ |
| Does this app allow users to interact or exchange content with other users?             | **No** |

#### Online Content

| Câu hỏi                                                                              | Trả lời    |
| --------------------------------------------------------------------------------------- | ------------ |
| Does this app stream or contain online content?                                        | **No** |

#### Promotion or Sale of Age-Restricted Products or Activities

| Câu hỏi                                                                              | Trả lời    |
| --------------------------------------------------------------------------------------- | ------------ |
| Does the app promote or sell age-restricted products or activities (alcohol, tobacco, cannabis, gambling, etc.)? | **No** |

#### Miscellaneous

| Câu hỏi                                                                              | Trả lời    | Ghi chú              |
| --------------------------------------------------------------------------------------- | ------------ | --------------------- |
| Does this app share the user's current and precise physical location with other users? | **No** | Không chia sẻ vị trí |
| Does this app allow the purchase of digital goods?                                     | **No** | Không có IAP        |
| Does this app include cash convertible rewards, NFTs, or crypto?                       | **No** | —                    |
| Is this app a web browser or a search engine?                                          | **No** | —                    |

### 8.3 Summary

**Kết quả dự kiến:** PEGI 3 / ESRB Everyone / USK 0 / IARC 3+

---

## 9. Target Audience

Truy cập **Play Console → Policy and programs → App content → Target audience**:

| Nhóm tuổi           | Chọn?       | Ghi chú                             |
| --------------------- | ------------ | ------------------------------------ |
| 5 and under           | ☐           | ⚠️ KHÔNG chọn — yêu cầu COPPA |
| 6-8                   | ☐           | ⚠️ KHÔNG chọn — yêu cầu COPPA |
| 9-12                  | ☐           | ⚠️ KHÔNG chọn — yêu cầu COPPA |
| **13-15**       | **✅** | —                                   |
| **16-17**       | **✅** | —                                   |
| **18 and over** | **✅** | —                                   |

> ⚠️ **KHÔNG** chọn nhóm tuổi dưới 13 trừ khi muốn tuân thủ COPPA và Families Policy.

---

## 10. Data Safety

Truy cập **Play Console → Policy and programs → App content → Data safety**:

> **Phân tích codebase:** Lịch Việt là app 100% offline. Dữ liệu phong thủy bundled sẵn trong app (JSON files). Không có backend server, không có API calls. Chỉ dùng **Firebase Analytics** (`@react-native-firebase/analytics`) để track anonymous usage events.

### 10.1 Data collection and security

| Câu hỏi                                                           | Trả lời                                                  | Ghi chú                            |
| ------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------- |
| Does your app collect or share any of the required user data types? | **Yes**                                              | Firebase Analytics (anonymous)      |
| ↳ Is all user data encrypted in transit?                           | **Yes**                                              | Firebase SDK dùng HTTPS             |
| Which methods of account creation?                                  | **My app does not allow users to create an account** | Không có hệ thống tài khoản   |
| Do you provide a way for users to request data deletion?            | **No**                                               | Chỉ có anonymous analytics data    |

### 10.2 Data types

Chọn data types mà app thu thập/chia sẻ:

| Category                           | Data type                  | Chọn?       | Ghi chú                          |
| ---------------------------------- | -------------------------- | ------------ | --------------------------------- |
| Location                           | Approximate/Precise        | ☐           | Compass dùng magnetometer, KHÔNG dùng GPS |
| Personal info                      | —                         | ☐           | Không thu thập                   |
| Financial info                     | —                         | ☐           | Không có IAP                     |
| Health and fitness                 | —                         | ☐           | —                                |
| Messages                           | —                         | ☐           | —                                |
| Photos and videos                  | —                         | ☐           | —                                |
| **App activity**             | **App interactions** | **✅** | Firebase Analytics events (xem chi tiết bên dưới) |
| App info and performance           | Crash logs                 | ☐           | **KHÔNG** dùng Crashlytics      |
| App info and performance           | Diagnostics                | ☐           | **KHÔNG** dùng Performance Monitoring |
| Device or other IDs                | —                         | ☐           | Không thu thập device IDs        |

> **Firebase Analytics events được track:**
> - `screen_view` — màn hình nào được xem (Calendar, DayDetail, Compass, Settings, Holidays)
> - `view_day_detail` — xem chi tiết ngày (date, lunar_date, day_score)
> - `navigate_month` — chuyển tháng (direction, from/to)
> - `select_date`, `holiday_tap`, `widget_tap` — tương tác người dùng
> - User properties: `user_type='free'`, `app_version='1.0.0'`
>
> **KHÔNG thu thập:** tên, email, số điện thoại, vị trí GPS, device ID, IDFA/GAID

### 10.3 Data usage and handling

**App interactions (Firebase Analytics):**

| Câu hỏi                                     | Trả lời                             |
| --------------------------------------------- | ------------------------------------- |
| Is this data collected, shared, or both?      | **Collected**                   |
| Is this data processed ephemerally?           | **No**                          |
| Is this data required or can the user choose? | **Data collection is required** |
| Why is this data collected?                   | **Analytics**                   |

> **Lưu ý kỹ thuật:**
> - Firebase Analytics events được queue offline (~500 events) và sync khi có mạng
> - Codebase có sẵn hàm `disableAnalytics()` nhưng chưa expose trong Settings UI
> - Không dùng AdMob → không cần khai báo Advertising ID
> - `IS_ANALYTICS_ENABLED = false` trong GoogleService-Info.plist (iOS) — cần kiểm tra lại config này trước khi release

---

## 11. Government Apps

Truy cập **Play Console → Policy and programs → App content → Government apps**:

| Câu hỏi                                                          | Trả lời    |
| ------------------------------------------------------------------ | ------------ |
| Is this app a government app or commissioned by a government entity? | **No** |

---

## 12. Financial Features

Truy cập **Play Console → Policy and programs → App content → Financial features**:

| Câu hỏi                                                    | Trả lời    |
| ------------------------------------------------------------- | ------------ |
| Does your app provide financial products and services?       | **No** |

> Lịch Việt không có tính năng tài chính, thanh toán, hay mua bán.

---

## 13. Health

Truy cập **Play Console → Policy and programs → App content → Health**:

| Câu hỏi                                                         | Trả lời    |
| ------------------------------------------------------------------ | ------------ |
| Does your app contain health or medical-related functionality?    | **No** |

> Lịch Việt là ứng dụng lịch âm/phong thủy, không phải ứng dụng sức khỏe.

---

---

> **MANAGE HOW YOUR APP IS ORGANIZED AND PRESENTED**

## 13b. App Category & Contact Details

Truy cập **Play Console → Grow → Store presence → Store settings**:

| Field             | Giá trị                                              |
| ----------------- | ------------------------------------------------------ |
| **Category** | Tools hoặc Lifestyle                            |
| **Tags**     | Calendar, Lifestyle                                  |
| **Email**   | *(email liên hệ — bắt buộc, hiện trên Store)* |
| **Phone**   | *(số điện thoại +84..., tuỳ chọn)*             |
| **Website** | *(URL website nếu có)*                             |

> **Store Listing** đã được hướng dẫn chi tiết ở [Mục 3](#3-store-listing--metadata) và [Mục 4](#4-screenshots--graphics).

## 13c. Pricing & Distribution

| Field               | Giá trị | Ghi chú                                                   |
| ------------------- | --------- | ---------------------------------------------------------- |
| **Price**     | Free      | ⚠️ Không đổi được từ Free → Paid sau khi publish |
| **Countries** | All       | 175+ countries                                             |

---

## 14. Signing & Build

### 14.1 Prerequisites

Đảm bảo đã cài đặt:

```
- Node.js >= 18
- Java Development Kit (JDK) 17 (bắt buộc cho React Native 0.73)
- Android Studio (bản mới nhất)
- Android SDK 35 (Build Tools 35.0.0)
- Android SDK Platform-Tools
- Android NDK 25.1.8937393
```

**Kiểm tra environment:**

```bash
# Check Java version (phải là 17)
java -version

# Check Node version (phải >= 18)
node -v

# Check Android SDK
echo $ANDROID_HOME
# Kết quả: /Users/<you>/Library/Android/sdk

# Verify SDK tools
$ANDROID_HOME/platform-tools/adb version
```

### 14.2 Environment Variables

Thêm vào `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

Sau đó: `source ~/.zshrc`

### 14.3 App Signing by Google Play (khuyến nghị)

Google Play App Signing cho phép Google quản lý signing key, bạn chỉ cần upload key.

**Setup khi upload lần đầu:**

1. Play Console tự động bật App Signing khi tạo app mới
2. Bạn upload AAB → Google ký lại bằng app signing key của Google
3. Upload key của bạn (`lich-viet-upload-key.keystore`) chỉ dùng để xác thực upload

> **Lợi ích:** Nếu mất upload key, có thể xin reset qua Google support. Nếu không dùng App Signing, mất key = mất app.

### 14.4 Build AAB (Android App Bundle)

```bash
cd mobile

# Cài dependencies (nếu chưa)
npm install

# Clean build cũ
cd android && ./gradlew clean && cd ..

# Build release AAB — BẮT BUỘC cho Play Store
cd android && ./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

> ⚠️ Google Play yêu cầu **AAB** (không phải APK) từ tháng 8/2021. AAB nhỏ hơn APK 15-20%.

### 14.5 Build release APK (cho test trực tiếp, KHÔNG dùng cho Play Store)

```bash
cd mobile/android

./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

### 14.6 Kiểm tra AAB trước khi upload

```bash
# Cài lên device để test (convert AAB → APK set)
# Cần bundletool: https://github.com/google/bundletool
java -jar bundletool.jar build-apks \
  --bundle=app/build/outputs/bundle/release/app-release.aab \
  --output=lichviet.apks \
  --ks=app/lich-viet-upload-key.keystore \
  --ks-key-alias=lich-viet-upload

java -jar bundletool.jar install-apks --apks=lichviet.apks
```

### 14.7 Lưu ý quan trọng

- **versionCode** phải **tăng** mỗi lần upload: 1, 2, 3, ...
  - Sửa trong `android/app/build.gradle`: `versionCode 1` → `versionCode 2`
- **versionName** là display version (1.0.0), có thể giữ nguyên cho bugfix builds
- AAB max size: **150 MB** (nếu > 150MB, dùng Play Asset Delivery)
- Upload xong đợi **vài phút** để Google xử lý

---

## 15. Testing Tracks — Upload AAB

Google Play có 3 testing tracks trước production:

### 15.1 Internal Testing (khuyến nghị bắt đầu từ đây)

| Config                 | Giá trị                  |
| ---------------------- | -------------------------- |
| **Testers**      | Thêm email (tối đa 100) |
| **Release name** | `1.0.0 (1) - Internal`   |

**Lợi ích:**

- Review nhanh (vài phút, không qua Google review)
- Có thể test trên device thật qua link invite

**Cách setup:**

1. Play Console → Testing → Internal testing → Create new release
2. Upload AAB
3. Add testers (email list)
4. Roll out release
5. Gửi opt-in link cho testers

### 15.2 Closed Testing (Alpha) — BẮT BUỘC cho tài khoản cá nhân (2026)

> ⚠️ **YÊU CẦU MỚI (từ 11/2023):** Tài khoản cá nhân (Individual) **BẮT BUỘC** phải hoàn thành Closed Testing với **≥ 12 testers opt-in liên tục 14 ngày** trước khi được publish Production. Tài khoản Organization được miễn.

**Bước 1: Chọn Countries / Regions**

1. Play Console → Testing → Closed testing → Closed testing - Alpha
2. Chuyển sang tab **"Countries / regions"**
3. Nhấn **"Add countries / regions"**
4. Chọn **tất cả countries** (tránh lỗi "App not available in your country")
5. Nhấn **Save**

> ⚠️ **Lỗi thường gặp:** Nếu không chọn country nào → lỗi: _"No countries or regions have been selected for this track."_

**Bước 2: Thêm Testers (≥ 12 người)**

1. Chuyển sang tab **"Testers"**
2. Chọn **"Email lists"** (hoặc Google Groups)
3. Tạo hoặc chọn email list → thêm ≥ 12 email Google
4. **QUAN TRỌNG:** Tick checkbox ☑ bên cạnh tên email list để kích hoạt
5. Nhấn **Save changes**

> ⚠️ Nếu checkbox bên cạnh email list **chưa tick**, track sẽ hiện **"Inactive"** dù release đã approve.

**Bước 3: Tạo Release**

1. Tab **"Releases"** → **"Create new release"**
2. Upload file **.aab**
3. Điền **Release name** và **Release notes** (VI + EN)
4. **"Review release"** → kiểm tra không còn Error
5. **"Start rollout to Closed testing"**

**Bước 4: Chờ Google Review**

- Google review bản Closed Testing trong **3–7 ngày**
- Khi approve → trạng thái chuyển thành **"Available to selected testers"**

**Bước 5: Chia sẻ Link Test cho Testers**

1. Tab **"Testers"** → phần **"How testers join your test"**
2. Copy link (**"Join on Android"** hoặc **"Join on the web"**)
3. Gửi link cho **tất cả** testers
4. Mỗi tester phải: Mở link → **"Accept invitation"** → Cài app → Mở app ít nhất 1 lần

> ⚠️ Tester không nhấn "Accept invitation" trên link → **KHÔNG** được tính vào 12 người.

**Bước 6: Đợi 14 ngày liên tục**

| Yêu cầu                | Chi tiết                                 |
| ------------------------ | ----------------------------------------- |
| Số testers tối thiểu  | **12 người opt-in**               |
| Thời gian liên tục    | **14 ngày không gián đoạn**    |
| Tạm dừng (Pause track) | ❌ KHÔNG — sẽ reset timer              |
| Upload bản mới         | ✅ Được — không ảnh hưởng timer   |
| Tester rời khỏi        | ⚠️ Nếu < 12 opt-in → timer tạm dừng |

**Bước 7: Apply for Production Access**

1. Sau 14 ngày, nút **"Apply for production access"** xuất hiện
2. Trả lời các câu hỏi về quá trình testing
3. Submit → chờ Google phê duyệt

### 15.3 Open Testing (Beta)

- Bất kỳ ai cũng join được (qua link)
- Hiện trên Store listing (có nhãn "Beta")
- Dùng khi gần production-ready, muốn feedback rộng

### 15.4 Pre-launch Report

Google tự chạy app trên **Firebase Test Lab** (nhiều device thật) khi upload lên bất kỳ track nào. Kiểm tra:

- Crash rate
- ANR (Application Not Responding)
- Security vulnerabilities
- Accessibility issues

Xem kết quả tại: **Play Console → Release → Pre-launch report**

---

## 16. Production Release

### 16.1 Trước khi submit production

Đảm bảo đã hoàn thành tất cả mục trong **Policy and programs → App content**:

| Mục               | Status                 |
| ------------------ | ---------------------- |
| Privacy policy     | ✅                     |
| Ads                | ✅ (No)                |
| App access         | ✅ (không cần login) |
| Content rating     | ✅                     |
| Target audience    | ✅                     |
| News app           | ✅ (No)                |
| Data safety        | ✅                     |
| Government apps    | ✅ (No)                |
| Financial features | ✅ (No)                |
| Health apps        | ✅ (No)                |

### 16.2 Tạo Production Release

1. Play Console → Production → Create new release
2. Upload AAB (hoặc promote từ testing track)
3. Điền release notes:

**Release Notes (Vietnamese):**

```
Phiên bản đầu tiên của Lịch Việt!

• Lịch âm dương chính xác với Can Chi đầy đủ
• Phong thủy hàng ngày — việc nên và không nên làm
• Giờ hoàng đạo, hắc đạo
• Nhị thập bát tú (28 sao) và 12 Trực
• Danh sách ngày lễ Việt Nam
• Hoạt động offline — không cần kết nối mạng
```

**Release Notes (English):**

```
First release of Lịch Việt!

• Accurate lunar-solar calendar with full Can Chi
• Daily feng shui — recommended and avoidable activities
• Auspicious and inauspicious hours
• 28 Mansions and 12 Day Officers
• Vietnamese holidays list
• Works offline — no internet required
```

### 16.3 Staged Rollout (khuyến nghị)

| Config                       | Giá trị                     | Ghi chú                             |
| ---------------------------- | ----------------------------- | ------------------------------------ |
| **Rollout percentage** | 20% → 50% → 100%            | Tăng dần nếu không có vấn đề |
| **Monitor**            | Crash rate, ANR rate, reviews | Dashboard → Release → Overview     |

> Staged rollout cho phép release cho 20% users trước. Nếu crash rate cao, có thể halt hoặc rollback.

### 16.4 Review Timeline

| Loại                  | Thời gian                      |
| ---------------------- | ------------------------------- |
| App mới (lần đầu)  | 3–7 ngày (có thể lâu hơn) |
| Update app             | 1–3 ngày                      |
| Rejection → re-submit | Thêm 1–3 ngày                |

> ⚠️ **App mới** từ tài khoản developer mới thường bị review kỹ hơn.

---

## 17. Chạy App Trên Thiết Bị Android Ảo & Thật

### 17.1 Thiết Bị Ảo (Android Emulator)

#### Bước 1: Cài Android Studio

Download từ [developer.android.com/studio](https://developer.android.com/studio)

#### Bước 2: Tạo AVD (Android Virtual Device)

**Qua Android Studio:**

1. Mở Android Studio
2. Vào **Tools → Device Manager** (hoặc click icon điện thoại trên toolbar)
3. Click **Create Device**
4. Chọn device definition:
   - Khuyến nghị: **Pixel 7** hoặc **Pixel 8**
   - Cho tablet: **Pixel Tablet**
5. Chọn system image:
   - Khuyến nghị: **API 35 (Android 15)** với **Google Play** (để test Play Store — khớp với targetSdkVersion)
   - Download image nếu chưa có
6. Cấu hình AVD:
   - RAM: tối thiểu 2048 MB, khuyến nghị 4096 MB
   - Internal Storage: tối thiểu 2048 MB
   - Bật **Hardware - GLES 2.0** cho graphics
7. Click **Finish**

**Qua command line (Apple Silicon Mac):**

```bash
# Liệt kê system images có sẵn
sdkmanager --list | grep "system-images"

# Download system image (API 34, Google Play, arm64 cho Apple Silicon)
sdkmanager "system-images;android-35;google_apis_playstore;arm64-v8a"

# Tạo AVD
avdmanager create avd \
  --name "Pixel_7_API_35" \
  --package "system-images;android-35;google_apis_playstore;arm64-v8a" \
  --device "pixel_7"

# Liệt kê AVDs đã tạo
emulator -list-avds
```

#### Bước 3: Khởi chạy Emulator

```bash
# Chạy emulator
emulator -avd Pixel_7_API_35

# Hoặc chạy từ Android Studio Device Manager (bấm nút Play)
```

#### Bước 4: Chạy App trên Emulator

```bash
cd mobile

# Terminal 1: Khởi động Metro bundler
npm start

# Terminal 2: Chạy app trên emulator
npm run android

# Hoặc chỉ định device cụ thể
npx react-native run-android --deviceId emulator-5554
```

### 17.2 Thiết Bị Thật (Physical Device)

#### Bước 1: Bật Developer Options trên điện thoại

1. Vào **Settings → About Phone** (Cài đặt → Giới thiệu điện thoại)
2. Nhấn **Build Number** (Số bản dựng) **7 lần** cho đến khi thấy "You are now a developer!"
3. Quay lại **Settings → System → Developer Options** (Tuỳ chọn nhà phát triển)
4. Bật **USB Debugging** (Gỡ lỗi USB)
5. (Tuỳ chọn) Bật **Install via USB** (Cài đặt qua USB)

#### Bước 2: Kết nối USB

```bash
# Cắm điện thoại bằng cáp USB
# Chấp nhận popup "Allow USB debugging?" trên điện thoại

# Kiểm tra device đã kết nối
adb devices

# Kết quả mong đợi:
# List of devices attached
# XXXXXXXX    device
```

#### Bước 3: Chạy App trên thiết bị thật

```bash
cd mobile

# Terminal 1: Metro bundler
npm start

# Terminal 2: Chạy app
npm run android

# Nếu có nhiều device, chỉ định cụ thể
npx react-native run-android --deviceId YOUR_DEVICE_ID
```

#### Bước 4: Debugging không dây (Wireless — tuỳ chọn)

```bash
# Đầu tiên kết nối USB và đảm bảo adb nhận device
adb devices

# Bật chế độ TCP/IP trên port 5555
adb tcpip 5555

# Tìm IP điện thoại: Settings → Wi-Fi → nhấn mạng → xem IP address
# Kết nối không dây
adb connect 192.168.1.XXX:5555

# Rút cáp USB — giờ có thể chạy wireless!
npm run android
```

#### Bước 5: Test Release Build trên thiết bị thật

```bash
cd mobile/android

# Cài bản release lên device
./gradlew installRelease

# Hoặc cài APK thủ công
adb install app/build/outputs/apk/release/app-release.apk
```

### 17.3 Troubleshooting

#### Emulator không khởi chạy được

```bash
# Kill processes cũ
adb kill-server
adb start-server

# Cold boot (từ Android Studio: Device Manager → ⋮ → Cold Boot Now)
emulator -avd Pixel_7_API_35 -no-snapshot-load
```

#### Lỗi "No connected devices"

```bash
# Kiểm tra lại
adb devices

# Nếu trống:
# 1. Cáp USB phải là loại truyền data (không phải charge-only)
# 2. USB Debugging đã bật chưa?
# 3. Đã chấp nhận "Allow USB debugging" trên điện thoại chưa?
# 4. Thử cổng USB khác

# Restart ADB
adb kill-server && adb start-server
```

#### App cài nhưng crash ngay

```bash
# Xem crash logs
adb logcat *:E | grep -i "vietcalendar"

# Hoặc dùng React Native log
npx react-native log-android
```

#### Physical device: "Unable to load script"

```bash
# Device phải cùng mạng Wi-Fi với máy tính

# Cách 1: Reverse port (khuyến nghị)
adb reverse tcp:8081 tcp:8081

# Cách 2: Lắc điện thoại → Dev Menu → Dev Settings → Debug server host & port
# Nhập: YOUR_COMPUTER_IP:8081
```

#### Build lỗi hết bộ nhớ

Sửa trong `mobile/android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

#### Metro bundler bị cache lỗi

```bash
# Reset Metro cache
rm -rf /tmp/metro-* && cd mobile && npm start -- --reset-cache
```

---

## 18. Checklist Tổng Hợp

### ✅ Trước khi bắt đầu

- [X] Google Play Developer Account đã đăng ký ($25)
- [X] Identity verification đã hoàn thành
- [X] Upload keystore đã tạo (`lich-viet-upload-key.keystore`)
- [X] Keystore đã backup ít nhất 2 nơi an toàn
- [X] `gradle.properties` đã thêm signing config (KHÔNG commit passwords)
- [X] `android/app/build.gradle` đã cập nhật signing release
- [X] ProGuard rules đã thêm cho React Native + Firebase + thư viện
- [X] App label đã đổi từ `LichVietTemp` → `Lịch Việt` trong `strings.xml`
- [X] `versionName` đã đổi từ `1.0` → `1.0.0`
- [X] Target SDK đã nâng lên 35 (Android 15) — bắt buộc cho app mới trên Play Store

### ✅ Google Play Console — App Content (theo thứ tự trên Play Console)

- [ ] **5. Privacy Policy** — URL public đã điền
- [ ] **6. App Access** — All functionality available without restrictions
- [X] **7. Ads** — No
- [X] **8. Content Rating** — IARC questionnaire đã trả lời (All Other App Types, tất cả No)
- [ ] **9. Target Audience** — 13+
- [ ] **10. Data Safety** — form đã điền (Firebase Analytics)
- [ ] **11. Government Apps** — No
- [ ] **12. Financial Features** — No
- [ ] **13. Health** — No

### ✅ Google Play Console — App Organization

- [ ] **App Category** — Tools / Lifestyle
- [ ] **Contact Details** — Email, Phone, Website
- [ ] **Store Listing** — App name, descriptions, screenshots (xem mục 3 & 4)
- [ ] App icon 512 × 512 đã upload
- [ ] Feature graphic 1024 × 500 đã upload
- [ ] Phone screenshots (≥ 4 tấm, 1080 × 1920)

### ✅ Pricing & Distribution

- [ ] Price: Free
- [ ] Countries: All

### ✅ Build & Upload

- [ ] `npm install` thành công
- [ ] `./gradlew clean && ./gradlew bundleRelease` thành công
- [ ] AAB đã signed với upload key
- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `npm test` — all pass
- [ ] Test trên device thật (không chỉ emulator)

### ✅ Closed Testing (bắt buộc cho tài khoản cá nhân)

- [ ] Countries / regions đã chọn (khuyến nghị: tất cả)
- [ ] Email list đã tạo với ≥ 12 email
- [ ] Checkbox email list đã tick ☑ (track phải Active, không Inactive)
- [ ] Release đã tạo + upload AAB
- [ ] Google review approve (3–7 ngày)
- [ ] Link test đã gửi cho 12+ testers
- [ ] Testers đã nhấn "Accept invitation" + cài app
- [ ] 14 ngày liên tục đã qua (không Pause track)
- [ ] "Apply for production access" đã submit

### ✅ Production Release

- [ ] Promote từ testing track hoặc upload AAB mới
- [ ] Release notes (VI + EN) đã điền
- [ ] Staged rollout: 20%
- [ ] Submit for review

---

## Phụ Lục A: Quick Reference — Build Commands

```bash
# === DEVELOPMENT ===
cd mobile
npm start                                    # Start Metro bundler
npm run android                              # Run debug trên emulator/device

# === RELEASE BUILD ===
cd mobile/android
./gradlew clean                              # Clean build cache
./gradlew bundleRelease                      # Build AAB cho Play Store
./gradlew assembleRelease                    # Build APK cho cài trực tiếp

# === DEVICE MANAGEMENT ===
adb devices                                  # Liệt kê devices đã kết nối
adb install path/to/app-release.apk         # Cài APK lên device
adb reverse tcp:8081 tcp:8081               # Forward Metro port cho device
adb logcat *:E                              # Xem error logs

# === EMULATOR ===
emulator -list-avds                          # Liệt kê emulators
emulator -avd Pixel_7_API_35                # Khởi chạy emulator
```

## Phụ Lục B: File Locations

| File             | Path                                                         | Mục đích                   |
| ---------------- | ------------------------------------------------------------ | ----------------------------- |
| Release AAB      | `android/app/build/outputs/bundle/release/app-release.aab` | Upload lên Play Store        |
| Release APK      | `android/app/build/outputs/apk/release/app-release.apk`    | Cài trực tiếp lên device  |
| Debug APK        | `android/app/build/outputs/apk/debug/app-debug.apk`        | Development testing           |
| Release Keystore | `android/app/lich-viet-upload-key.keystore`                | **KHÔNG ĐƯỢC MẤT** |
| Debug Keystore   | `android/app/debug.keystore`                               | Development only              |
| Signing Config   | `android/gradle.properties`                                | Passwords cho signing         |
| ProGuard Rules   | `android/app/proguard-rules.pro`                           | Code shrinking rules          |

## Phụ Lục C: Troubleshooting Tổng Hợp

### Build fails: "Keystore was tampered with, or password was incorrect"

- Kiểm tra `gradle.properties` path và password chính xác
- Password không có special characters gây conflict

### Upload fails: "Version code X has already been used"

- Tăng `versionCode` trong `android/app/build.gradle`

### "Your app has been rejected" — lý do thường gặp

1. **Missing privacy policy** — đảm bảo URL hoạt động
2. **Broken functionality** — test kỹ trên device thật
3. **Misleading description** — description phải khớp với app thật
4. **Metadata violation** — không dùng từ "best", "top", "#1" trong description

### Closed Testing track hiện "Inactive"

- Vào tab **Testers** → tick checkbox ☑ bên cạnh email list → Save
- Nếu đã tick mà vẫn Inactive → kiểm tra đã tạo release và rollout chưa

### Tạo release báo lỗi "No countries or regions have been selected"

- Vào tab **Countries / regions** → Add countries / regions → chọn tất cả → Save

### Link test báo "App not available" hoặc 404

- Release chưa được Google approve — đợi 3–7 ngày
- Countries / regions chưa chọn → thêm tất cả countries
- Tester chưa nằm trong email list → thêm email vào list

### Tester đã accept nhưng không tính vào 12 người

- Email tester phải là **Google Account** (Gmail hoặc email đăng ký Google)
- Tester phải mở app ít nhất 1 lần trên device
- Google dùng AI kiểm tra — fake account / cùng IP có thể bị loại
