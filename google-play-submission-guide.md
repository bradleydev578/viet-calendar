# Hướng Dẫn Triển Khai App Lên Google Play Store — PipForge

**Ngày tạo:** 2026-02-28
**Phiên bản:** v1.0
**Trạng thái:** Checklist cho lần submit đầu tiên

---

## Mục Lục

1. [Trước Khi Bắt Đầu — Prerequisites](#1-trước-khi-bắt-đầu--prerequisites)
2. [Tạo App Trên Google Play Console](#2-tạo-app-trên-google-play-console)
3. [Store Listing — Metadata](#3-store-listing--metadata)
4. [Screenshots &amp; Graphics](#4-screenshots--graphics)
5. [Content Rating](#5-content-rating)
6. [App Privacy &amp; Data Safety](#6-app-privacy--data-safety)
7. [Ads Declaration](#7-ads-declaration)
8. [Pricing &amp; Distribution](#8-pricing--distribution)
9. [App Access &amp; Contact Details](#9-app-access--contact-details)
10. [Signing &amp; Build](#10-signing--build)
11. [Testing Tracks — Upload AAB](#11-testing-tracks--upload-aab)
12. [In-App Purchase Setup](#12-in-app-purchase-setup)
13. [Production Release](#13-production-release)
14. [Checklist Tổng Hợp](#14-checklist-tổng-hợp)

---

## 1. Trước Khi Bắt Đầu — Prerequisites

### 1.1 Google Play Developer Account

| Yêu cầu                                      | Trạng thái         | Ghi chú                                                 |
| ---------------------------------------------- | -------------------- | -------------------------------------------------------- |
| Google Play Developer Account ($25, một lần) | ❌ Cần đăng ký   | https://play.google.com/console/signup                   |
| Google Account 2FA bật                        | ❌ Cần kiểm tra    | Bắt buộc                                               |
| Identity verification                          | ❌ Cần hoàn thành | Google yêu cầu xác minh danh tính (ID + ảnh selfie) |

> **Lưu ý:** Tài khoản cá nhân (Individual) mới cần đợi xác minh danh tính — có thể mất 2–5 ngày.

### 1.2 Merchant Account (bắt buộc cho IAP)

Truy cập **Play Console → Settings → Developer account → Payments profile**:

| Item                                      | Bắt buộc | Ghi chú                                       |
| ----------------------------------------- | ---------- | ---------------------------------------------- |
| **Google Payments Merchant Center** | ✅         | Liên kết tài khoản ngân hàng nhận tiền |
| **Tax Information**                 | ✅         | Khai báo thuế theo quốc gia                 |
| **Payment Method**                  | ✅         | Tài khoản ngân hàng (wire transfer)        |

> ⚠️ **Nếu chưa setup Merchant Account**, sẽ KHÔNG thể tạo IAP (in-app products).

### 1.3 Cấu Hình Android Project

**Thông tin hiện tại trong project:**

| Config                 | Giá trị                                  | File                             |
| ---------------------- | ------------------------------------------ | -------------------------------- |
| Application ID         | `vn.bradley.pipforge`                    | `android/app/build.gradle.kts` |
| App Label              | `PipForge`                               | `AndroidManifest.xml`          |
| Version Name           | `1.0.0`                                  | `pubspec.yaml`                 |
| Version Code           | `1`                                      | `pubspec.yaml`                 |
| Min SDK                | Flutter default (21)                       | `build.gradle.kts`             |
| Target SDK             | Flutter default (34+)                      | `build.gradle.kts`             |
| AdMob App ID (Android) | `ca-app-pub-2943533610533242~9166287696` | `AndroidManifest.xml`          |

### 1.4 Signing Key — TẠO UPLOAD KEY

> ⚠️ **QUAN TRỌNG:** Google Play yêu cầu ký app bằng key riêng. Key này **KHÔNG ĐƯỢC MẤT** — nếu mất sẽ không thể update app.

**Bước 1: Tạo keystore**

```bash
keytool -genkey -v \
  -keystore ~/pipforge-upload-key.jks \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias upload
```

Khi hỏi, nhập:

- **Keystore password:** *(chọn mật khẩu mạnh, ghi lại an toàn)*
- **Key password:** *(có thể giống keystore password)*
- **First and Last Name:** Bradley
- **Organization:** Bradley
- **Country Code:** VN

**Bước 2: Tạo file `android/key.properties`**

```properties
storePassword=<mật khẩu keystore>
keyPassword=<mật khẩu key>
keyAlias=upload
storeFile=<đường dẫn tuyệt đối>/pipforge-upload-key.jks
```

> ⚠️ **KHÔNG commit** file `key.properties` và `*.jks` lên git. Kiểm tra `.gitignore` đã có.

**Bước 3: Cập nhật `android/app/build.gradle.kts`**

Thêm trước block `android {}`:

```kotlin
val keystoreProperties = java.util.Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(java.io.FileInputStream(keystorePropertiesFile))
}
```

Trong block `android {}`, thêm `signingConfigs` và sửa `buildTypes`:

```kotlin
android {
    // ... existing config ...

    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["keyPassword"] as String
            storeFile = file(keystoreProperties["storeFile"] as String)
            storePassword = keystoreProperties["storePassword"] as String
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

---

## 2. Tạo App Trên Google Play Console

Truy cập **Play Console → All apps → Create app**:

| Field                      | Giá trị               | Ghi chú                             |
| -------------------------- | ----------------------- | ------------------------------------ |
| **App name**         | `PipForge`            | 30 ký tự tối đa                  |
| **Default language** | English (United States) | Có thể thêm ngôn ngữ sau        |
| **App or game**      | Game                    | —                                   |
| **Free or paid**     | Free                    | Không đổi được sau khi publish |

**Declarations:**

| Khai báo                  | Trả lời |
| -------------------------- | --------- |
| Developer Program Policies | ✅ Accept |
| US export laws             | ✅ Accept |

---

## 3. Store Listing — Metadata

Truy cập **Play Console → Grow → Store presence → Main store listing**:

### 3.1 App Details

**English (en-US):**

| Field                       | Giới hạn    | Giá trị (EN)                                                                        | Ghi chú                             |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| **App name**          | 30 ký tự    | `PipForge - Daily Logic Puzzle`                                                     | 29 ký tự. Đồng bộ style với VI |
| **Short description** | 80 ký tự    | `Daily domino logic puzzle. One puzzle, one solution, every day. Forge your logic!` | 79 ký tự                           |
| **Full description**  | 4,000 ký tự | *(xem bên dưới)*                                                                 | Google tự index keywords từ đây  |

**Vietnamese (vi):**

| Field                       | Giới hạn    | Giá trị (VI)                                                                                    | Ghi chú                        |
| --------------------------- | ------------- | ------------------------------------------------------------------------------------------------- | ------------------------------- |
| **App name**          | 30 ký tự    | `PipForge - Rèn logic mỗi ngày`                                                              | Đồng bộ với Apple App Store |
| **Short description** | 80 ký tự    | `Giải đố domino logic hằng ngày. Một câu đố, một lời giải, mỗi ngày. Rèn logic!` | 78 ký tự                      |
| **Full description**  | 4,000 ký tự | *(xem bên dưới)*                                                                             | —                              |

**Full Description (English):**

```
PipForge - Daily Domino Logic Puzzle

Forge your logic every day! PipForge delivers one unique domino puzzle daily - place domino tiles on a 5x5 grid so that pip sums match the targets for each row and column. Simple rules, deep logic, one puzzle a day.

HOW TO PLAY
- Drag and drop domino tiles from the tray onto the grid
- Each domino has two halves with 0-6 pips
- Match the target sum for every row and column
- Tap to rotate tiles, undo and reset anytime
- Every puzzle has exactly ONE solution

DAILY CHALLENGE
- One new puzzle every day at midnight UTC
- Same puzzle worldwide - compare with friends
- Build your streak: 3, 7, 14, 30 days and beyond

PRACTICE MODE
- 10 chapters with 90 levels of increasing difficulty
- Earn stars to unlock new chapters
- Master new mechanics: hidden targets, no-equal-adjacent rule

INSTANT FEEDBACK
- Green: row/column is correct
- Yellow: close - still achievable
- Gray: impossible - something's off
- Smart hints when you're stuck

COMPETE & SHARE
- Daily leaderboard - fastest time wins
- Share your result as an emoji grid
- Spoiler-free sharing: show your score without revealing the answer

FEATURES
- Beautiful dark theme with teal accents
- Colorblind-friendly feedback (color + shape + text)
- Works offline - puzzles generated on-device
- Bilingual: English & Vietnamese
- No account required

OPTIONAL IN-APP PURCHASE:
- PipForge Premium ($2.99, one-time) - permanently remove interstitial ads and unlock unlimited daily hints.
- Rewarded video ads remain available as an optional way to earn extra hints - even for Premium users.
```

**Full Description (Vietnamese):**

```
PipForge - Giải Đố Domino Logic Hằng Ngày

Rèn logic mỗi ngày! PipForge mang đến một câu đố domino độc đáo mỗi ngày - đặt các quân domino lên lưới 5x5 sao cho tổng pips mỗi hàng và cột khớp với mục tiêu. Luật đơn giản, logic sâu, mỗi ngày một ván.

CÁCH CHƠI
- Kéo thả quân domino từ khay lên lưới
- Mỗi quân có hai nửa với 0-6 chấm (pips)
- Khớp tổng mục tiêu cho mỗi hàng và cột
- Chạm để xoay quân, hoàn tác và đặt lại bất cứ lúc nào
- Mỗi câu đố chỉ có DUY NHẤT một lời giải

THỬ THÁCH HẰNG NGÀY
- Một câu đố mới mỗi ngày lúc 0h UTC
- Cùng câu đố toàn cầu - so sánh với bạn bè
- Xây dựng chuỗi streak: 3, 7, 14, 30 ngày trở lên

CHẾ ĐỘ LUYỆN TẬP
- 10 chương với 90 màn chơi độ khó tăng dần
- Kiếm sao để mở khoá chương mới
- Chinh phục cơ chế mới: mục tiêu ẩn, quy tắc không-trùng-kề

PHẢN HỒI TỨC THÌ
- Xanh: hàng/cột đúng
- Vàng: gần đúng - vẫn khả thi
- Xám: không thể - cần điều chỉnh
- Gợi ý thông minh khi bế tắc

THI ĐẤU & CHIA SẺ
- Bảng xếp hạng hằng ngày - nhanh nhất thắng
- Chia sẻ kết quả dạng emoji grid
- Chia sẻ không spoiler: khoe điểm mà không lộ đáp án

TÍNH NĂNG
- Giao diện tối đẹp mắt với điểm nhấn teal
- Thân thiện với người mù màu (màu + hình + chữ)
- Chơi offline - câu đố tạo ngay trên thiết bị
- Song ngữ: Tiếng Anh & Tiếng Việt
- Không cần tài khoản

MUA TRONG ỨNG DỤNG (TUỲ CHỌN):
- PipForge Premium (69.000đ, một lần) - xoá vĩnh viễn quảng cáo xen kẽ và mở khoá gợi ý không giới hạn.
- Quảng cáo thưởng vẫn khả dụng để nhận thêm gợi ý - kể cả cho người dùng Premium.
```

### 3.2 Localization

Truy cập **Store listing → Manage translations → Add language → Vietnamese (vi)**

Điền Short description (VI):

```
Giải đố domino logic hằng ngày. Một câu đố, một lời giải, mỗi ngày. Rèn logic!
```

*(78 ký tự)*

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
- Gợi ý nội dung: logo PipForge + tagline + hình game grid trên nền tối (#0A0E1A)
- Không chứa text quá nhỏ (khó đọc trên mobile)
- Lưu ý: nếu có video, feature graphic sẽ là thumbnail

### 4.4 Phone Screenshots

**Kích thước khuyến nghị:** 1080 × 1920 px (portrait, 9:16)

| # | Nội dung                                          | Caption                  |
| - | -------------------------------------------------- | ------------------------ |
| 1 | **Home Screen** — trạng thái chưa chơi  | "One puzzle. Every day." |
| 2 | **Game Screen** — đang chơi, có feedback | "Drag. Drop. Solve."     |
| 3 | **Practice Mode** — chapter select          | "90 levels to master"    |
| 4 | **Win Screen** — hoàn thành + share       | "Share your result"      |
| 5 | **Leaderboard** — bảng xếp hạng          | "Compete daily"          |
| 6 | **Streak/Stats** — profile + stats          | "Track your streak"      |

**Cách chụp:**

```bash
# Chạy app trên emulator hoặc device thật
cd app && flutter run --release

# Chụp screenshot từ emulator
adb exec-out screencap -p > screenshot1.png

# Hoặc dùng Android Studio → Device mirroring → Screenshot button
```

### 4.5 Tablet Screenshots (tuỳ chọn nhưng khuyến nghị)

**Kích thước khuyến nghị:** 1920 × 1200 px (landscape) hoặc 1200 × 1920 (portrait)

> Nếu app chỉ hỗ trợ portrait, chụp portrait trên tablet emulator.

### 4.6 Promo Video (tuỳ chọn)

| Spec          | Giá trị                                 |
| ------------- | ----------------------------------------- |
| URL           | YouTube video URL (public hoặc unlisted) |
| Thời lượng | 30 giây – 2 phút                       |
| Khuyến nghị | Bỏ qua cho v1.0, thêm sau               |

---

## 5. Content Rating

Truy cập **Play Console → Policy and programs → App content → Content rating**:

Google dùng bảng hỏi **IARC** (International Age Rating Coalition). Trả lời như sau:

### 5.1 Category

| Field         | Giá trị             |
| ------------- | --------------------- |
| Email address | *(email liên hệ)* |
| Category      | **Game**        |

### 5.2 Questionnaire

**Violence, Blood, or Gory Images:**

| Câu hỏi                                                                                             | Trả lời    |
| ----------------------------------------------------------------------------------------------------- | ------------ |
| Does the game contain inferences of, references to, or depictions of violence, blood, or gory images? | **No** |

**Fear:**

| Câu hỏi                                                                               | Trả lời    |
| --------------------------------------------------------------------------------------- | ------------ |
| Does the game contain pictures or sounds likely to be scary, horrifying, or disturbing? | **No** |

**Sexuality, Suggestiveness, or Dating Games:**

| Câu hỏi                                                                                                                                  | Trả lời    |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Does the game contain inferences of, references to, or depictions of sexuality, suggestiveness, dating games, revealing attire, or nudity? | **No** |

**Gambling Themes, Simulated Gambling, or Real Gambling:**

| Câu hỏi                                                                                 | Trả lời    |
| ----------------------------------------------------------------------------------------- | ------------ |
| Does the game contain gambling, simulations of casino gambling/bingo, or gambling themes? | **No** |

**Language:**

| Câu hỏi                                                 | Trả lời    |
| --------------------------------------------------------- | ------------ |
| Does the game contain any potentially offensive language? | **No** |

**Controlled Substance:**

| Câu hỏi                                                                    | Trả lời    |
| ---------------------------------------------------------------------------- | ------------ |
| Does the game contain any reference to or use of drugs, alcohol, or tobacco? | **No** |

**Crude Humor:**

| Câu hỏi                                                                                                             | Trả lời    |
| --------------------------------------------------------------------------------------------------------------------- | ------------ |
| Does the game contain any bodily functions such as belching, flatulence, or vomiting when used for humorous purposes? | **No** |

**Digital Purchases, Cash Convertible Rewards, or NFTs:**

| Câu hỏi                                                       | Trả lời          | Ghi chú              |
| --------------------------------------------------------------- | ------------------ | --------------------- |
| Does the game include the purchase or sale of digital goods...? | **Yes**      | IAP Premium $2.99     |
| ↳ Purchases of digital goods                                   | **✅ Check** | —                    |
| ↳ Cash Convertible Rewards                                     | ☐                 | —                    |
| ↳ Issuance of transferable digital assets (NFTs)               | ☐                 | —                    |
| Can these purchases include random items (loot boxes)?          | **No**       | Sản phẩm cố định |
| Does the game have a system for players to trade items?         | **No**       | Không có trade      |

**Miscellaneous:**

| Câu hỏi                                                            | Trả lời    | Ghi chú                  |
| -------------------------------------------------------------------- | ------------ | ------------------------- |
| Interact or exchange content with other users (voice, text, images)? | **No** | Không có chat/messaging |
| Share user's current and precise physical location?                  | **No** | Không thu thập location |
| Swastikas, Nazi symbols or propaganda?                               | **No** | —                        |
| Content eroding national identity of Republic of Korea?              | **No** | —                        |
| Advocate committing acts of terrorism?                               | **No** | —                        |
| Realistic descriptions of crimes?                                    | **No** | —                        |

### 5.3 Summary

**Kết quả dự kiến:** PEGI 3 / ESRB Everyone / USK 0 / IARC 3+

---

## 6. App Privacy & Data Safety

Truy cập **Play Console → Policy and programs → App content → Data safety**:

Wizard gồm 5 bước: ① Overview → ② Data collection and security → ③ Data types → ④ Data usage and handling → ⑤ Preview

### 6.1 ① Overview

Đọc hướng dẫn, bấm **Next**.

### 6.2 ② Data collection and security

| Câu hỏi                                                           | Trả lời                                                  | Ghi chú                                            |
| ------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Does your app collect or share any of the required user data types? | **Yes**                                              | Firebase Analytics + AdMob + crash logs             |
| ↳ Is all user data encrypted in transit?                           | **Yes**                                              | HTTPS                                               |
| Which methods of account creation?                                  | **My app does not allow users to create an account** | Không có hệ thống tài khoản                   |
| ↳ Can users login with accounts created outside of the app?        | **No**                                               | —                                                  |
| Do you provide a way for users to request data deletion?            | **No**                                               | App không lưu dữ liệu cá nhân gắn danh tính |

### 6.3 ③ Data types

Chọn data types mà app thu thập/chia sẻ:

| Category                           | Data type                     | Chọn?       | Ghi chú                        |
| ---------------------------------- | ----------------------------- | ------------ | ------------------------------- |
| Location                           | Approximate location          | ☐           | —                              |
| Location                           | Precise location              | ☐           | —                              |
| Personal info                      | —                            | ☐           | —                              |
| Financial info                     | —                            | ☐           | Google Play Billing tự xử lý |
| Health and fitness                 | —                            | ☐           | —                              |
| Messages                           | —                            | ☐           | —                              |
| Photos and videos                  | —                            | ☐           | —                              |
| Audio files                        | —                            | ☐           | —                              |
| Files and docs                     | —                            | ☐           | —                              |
| Calendar                           | —                            | ☐           | —                              |
| Contacts                           | —                            | ☐           | —                              |
| **App activity**             | **App interactions**    | **✅** | Firebase Analytics events       |
| **App activity**             | **Other actions**       | **✅** | Firebase custom events          |
| App activity                       | In-app search history         | ☐           | —                              |
| App activity                       | Installed apps                | ☐           | —                              |
| App activity                       | Other user-generated content  | ☐           | —                              |
| Web browsing                       | —                            | ☐           | —                              |
| **App info and performance** | **Crash logs**          | **✅** | Firebase Crashlytics            |
| **App info and performance** | **Diagnostics**         | **✅** | Firebase Performance            |
| App info and performance           | Other app performance data    | ☐           | —                              |
| **Device or other IDs**      | **Device or other IDs** | **✅** | AdMob Advertising ID            |

### 6.4 ④ Data usage and handling

Bấm **Start** cho từng data type đã chọn:

**Crash logs:**

| Câu hỏi                                     | Trả lời                             |
| --------------------------------------------- | ------------------------------------- |
| Is this data collected, shared, or both?      | **Collected**                   |
| Is this data processed ephemerally?           | **No**                          |
| Is this data required or can the user choose? | **Data collection is required** |
| Why is this data collected?                   | **Analytics**                   |

**Diagnostics:**

| Câu hỏi                                     | Trả lời                             |
| --------------------------------------------- | ------------------------------------- |
| Is this data collected, shared, or both?      | **Collected**                   |
| Is this data processed ephemerally?           | **No**                          |
| Is this data required or can the user choose? | **Data collection is required** |
| Why is this data collected?                   | **Analytics**                   |

**App interactions:**

| Câu hỏi                                     | Trả lời                             |
| --------------------------------------------- | ------------------------------------- |
| Is this data collected, shared, or both?      | **Collected**                   |
| Is this data processed ephemerally?           | **No**                          |
| Is this data required or can the user choose? | **Data collection is required** |
| Why is this data collected?                   | **Analytics**                   |

**Other actions:**

| Câu hỏi                                     | Trả lời                             |
| --------------------------------------------- | ------------------------------------- |
| Is this data collected, shared, or both?      | **Collected**                   |
| Is this data processed ephemerally?           | **No**                          |
| Is this data required or can the user choose? | **Data collection is required** |
| Why is this data collected?                   | **Analytics**                   |

**Device or other IDs:**

| Câu hỏi                                     | Trả lời                             |
| --------------------------------------------- | ------------------------------------- |
| Is this data collected, shared, or both?      | **Both**                        |
| Is this data processed ephemerally?           | **No**                          |
| Is this data required or can the user choose? | **Data collection is required** |
| Why is this data collected?                   | **Advertising**                 |
| Why is this data shared?                      | **Advertising**                 |

> **Giải thích:** AdMob SDK gửi Advertising ID đến ad networks → đây là "sharing" theo định nghĩa Google.

### 6.5 ⑤ Preview

Review toàn bộ thông tin → bấm **Submit**.

### 6.6 Privacy Policy URL

| Field                        | Giá trị                                               |
| ---------------------------- | ------------------------------------------------------- |
| **Privacy Policy URL** | `https://www.madebybang.com/en/work/pipforge/privacy` |

> URL **phải truy cập được** (public) trước khi submit.

---

## 7. Ads Declaration

Truy cập **Play Console → Policy and programs → App content → Ads**:

| Câu hỏi                  | Trả lời     |
| -------------------------- | ------------- |
| Does your app contain ads? | **Yes** |

> Khi chọn Yes, Google Play sẽ hiện nhãn "Contains ads" trên store listing.

### 7.1 Families Policy (nếu target trẻ em)

PipForge **KHÔNG** target trẻ em (không tham gia Designed for Families program), nên không cần tuân thủ thêm.

Nếu muốn tham gia Families program sau này, cần dùng Google certified ad SDKs và không hiện personalized ads cho trẻ.

---

## 8. Pricing & Distribution

### 8.1 Pricing

| Field               | Giá trị | Ghi chú                                                   |
| ------------------- | --------- | ---------------------------------------------------------- |
| **Price**     | Free      | ⚠️ Không đổi được từ Free → Paid sau khi publish |
| **Countries** | All       | 175+ countries                                             |

### 8.2 Countries / Regions

Chọn **All countries** trừ khi có lý do cụ thể để loại trừ.

### 8.3 Target Audience and Content

Truy cập **Play Console → Policy and programs → App content → Target audience**:

Wizard gồm 5 bước: ① Target age → ② App details → ③ Ads → ④ Store presence → ⑤ Summary

**① Target age — Chọn nhóm tuổi:**

| Nhóm tuổi           | Chọn?       | Ghi chú                             |
| --------------------- | ------------ | ------------------------------------ |
| 5 and under           | ☐           | ⚠️ KHÔNG chọn — yêu cầu COPPA |
| 6-8                   | ☐           | ⚠️ KHÔNG chọn — yêu cầu COPPA |
| 9-12                  | ☐           | ⚠️ KHÔNG chọn — yêu cầu COPPA |
| **13-15**       | **✅** | —                                   |
| **16-17**       | **✅** | —                                   |
| **18 and over** | **✅** | —                                   |

> ⚠️ **KHÔNG** chọn nhóm tuổi dưới 13 trừ khi muốn tuân thủ COPPA và Families Policy (phức tạp, yêu cầu ads certified cho trẻ em).

**② App details:** Trả lời theo thực tế app (không có nội dung nhạy cảm)

**③ Ads:** Xác nhận app có chứa quảng cáo

**④ Store presence:** Xác nhận store listing không appeal to children

**⑤ Summary:** Review và submit

---

## 9. App Access & Contact Details

Truy cập **Play Console → Policy and programs → App content → App access**:

### 9.1 App Access

Chọn: **All functionality in my app is available without any access restrictions**

> PipForge không yêu cầu login, tài khoản, hay quyền truy cập đặc biệt. Toàn bộ tính năng đều mở.

### 9.2 Contact Details (Store listing)

Truy cập **Play Console → Grow → Store presence → Store settings**:

| Field             | Giá trị (EN)                                         | Giá trị (VI)                                  |
| ----------------- | ------------------------------------------------------ | ----------------------------------------------- |
| **Email**   | *(email liên hệ — bắt buộc, hiện trên Store)* | *(cùng email)*                               |
| **Phone**   | *(số điện thoại +84..., tuỳ chọn)*             | *(cùng số)*                                 |
| **Website** | `https://www.madebybang.com/en/work/pipforge`        | `https://www.madebybang.com/vi/work/pipforge` |

### 9.3 Testing Instructions (nếu Google yêu cầu)

Nếu Google review team cần thêm thông tin, chuẩn bị sẵn:

```
PipForge is a daily domino logic puzzle game. No login is required.

HOW TO TEST:
1. Launch app → Home screen shows today's daily puzzle
2. Tap "PLAY NOW" to start the puzzle
3. Drag domino tiles from the bottom tray onto the 5×5 grid
4. Tap a tile to rotate it (horizontal ↔ vertical)
5. Match the target sum shown for each row and column
6. Green ✅ = correct, Yellow 🟨 = possible, Gray ⬜ = impossible

PRACTICE MODE:
- Tap "Practice" tab to access 10 chapters with 90 levels
- Earn 1-3 stars per level to unlock new chapters
- Chapters 7-8 introduce hidden targets
- Chapters 9-10 introduce no-equal-adjacent rule

HINT SYSTEM:
- Tap the 💡 hint button during gameplay
- First 3 hints are free per day
- After free hints: "Watch Ad" dialog appears with Premium upsell

IN-APP PURCHASE:
- "PipForge Premium" ($2.99, one-time, non-consumable)
- Benefits: removes interstitial ads + unlimited hints
- Purchase available from: (1) Hint dialog "Go Premium" button, (2) Profile → Settings → "Go Premium" row
- Restore Purchase: Profile → Settings → footer "Restore Purchase" link

LEADERBOARD:
- Requires internet connection
- After completing puzzle, score auto-submits
- View rankings in Rank tab

NOTES:
- App works offline (puzzles generated on-device)
- Same puzzle for all users worldwide each day
- Bilingual: English & Vietnamese (auto-detects device language)
- Ads: interstitial after puzzle/practice completion (frequency-capped), rewarded for extra hints
- The app uses Firebase Analytics and AdMob
```

---

## 10. Signing & Build

### 9.1 App Signing by Google Play (khuyến nghị)

Google Play App Signing cho phép Google quản lý signing key, bạn chỉ cần upload key.

**Setup khi upload lần đầu:**

1. Play Console tự động bật App Signing khi tạo app mới
2. Bạn upload AAB → Google ký lại bằng app signing key của Google
3. Upload key của bạn (`pipforge-upload-key.jks`) chỉ dùng để xác thực upload

> **Lợi ích:** Nếu mất upload key, có thể xin reset qua Google support. Nếu không dùng App Signing, mất key = mất app.

### 9.2 Build AAB (Android App Bundle)

```bash
cd app

# Clean trước
flutter clean

# Build release AAB
flutter build appbundle --release

# Output: build/app/outputs/bundle/release/app-release.aab
```

> ⚠️ Google Play yêu cầu **AAB** (không phải APK) từ tháng 8/2021. AAB nhỏ hơn APK 15-20%.

### 9.3 Kiểm tra AAB trước khi upload

```bash
# Kiểm tra signing
jarsigner -verify -verbose -certs build/app/outputs/bundle/release/app-release.aab

# Cài lên device để test (convert AAB → APK set)
# Cần bundletool: https://github.com/google/bundletool
java -jar bundletool.jar build-apks \
  --bundle=build/app/outputs/bundle/release/app-release.aab \
  --output=pipforge.apks \
  --ks=~/pipforge-upload-key.jks \
  --ks-key-alias=upload

java -jar bundletool.jar install-apks --apks=pipforge.apks
```

### 9.4 Lưu ý quan trọng

- **versionCode** (build number) phải **tăng** mỗi lần upload: 1, 2, 3, ...
  - Sửa trong `pubspec.yaml`: `version: 1.0.0+1` → `version: 1.0.0+2`
- **versionName** là display version (1.0.0), có thể giữ nguyên cho bugfix builds
- AAB max size: **150 MB** (nếu > 150MB, dùng Play Asset Delivery)
- Upload xong đợi **vài phút** để Google xử lý

---

## 11. Testing Tracks — Upload AAB

> ⚠️ **Bước này phải làm TRƯỚC khi tạo In-App Products** — Google Play yêu cầu upload ít nhất 1 AAB trước khi cho phép tạo IAP.

Google Play có 3 testing tracks trước production:

### 11.1 Internal Testing (khuyến nghị bắt đầu từ đây)

| Config                 | Giá trị                  |
| ---------------------- | -------------------------- |
| **Testers**      | Thêm email (tối đa 100) |
| **Release name** | `1.0.0 (1) - Internal`   |

**Lợi ích:**

- Review nhanh (vài phút, không qua Google review)
- Test IAP bằng sandbox (không mất tiền)
- Có thể test trên device thật qua link invite

**Cách setup:**

1. Play Console → Testing → Internal testing → Create new release
2. Upload AAB
3. Add testers (email list)
4. Roll out release
5. Gửi opt-in link cho testers

### 11.2 Closed Testing (Alpha) — BẮT BUỘC cho tài khoản cá nhân (2026)

> ⚠️ **YÊU CẦU MỚI (từ 11/2023):** Tài khoản cá nhân (Individual) **BẮT BUỘC** phải hoàn thành Closed Testing với **≥ 12 testers opt-in liên tục 14 ngày** trước khi được publish Production. Tài khoản Organization được miễn.

**Bước 1: Chọn Countries / Regions**

1. Play Console → Testing → Closed testing → Closed testing - Alpha
2. Chuyển sang tab **"Countries / regions"**
3. Nhấn **"Add countries / regions"**
4. Chọn **tất cả countries** (khuyến nghị — tránh lỗi "App not available in your country" cho testers)
5. Nhấn **Save**

> ⚠️ **Lỗi thường gặp:** Nếu không chọn country nào, khi tạo release sẽ báo lỗi: _"No countries or regions have been selected for this track."_

**Bước 2: Thêm Testers (≥ 12 người)**

1. Chuyển sang tab **"Testers"**
2. Chọn **"Email lists"** (hoặc Google Groups)
3. Tạo hoặc chọn email list → thêm ≥ 12 email Google
4. **QUAN TRỌNG:** Tick checkbox ☑ bên cạnh tên email list để kích hoạt
5. (Tuỳ chọn) Điền **Feedback URL or email address** để nhận phản hồi
6. Nhấn **Save changes**

> ⚠️ **Lỗi thường gặp:** Nếu checkbox bên cạnh email list **chưa tick**, track sẽ hiện trạng thái **"Inactive"** dù release đã approve.

**Bước 3: Tạo Release**

1. Chuyển sang tab **"Releases"** → nhấn **"Create new release"**
2. Upload file **.aab** (App Bundle)
3. Điền **Release name** (tự động hoặc tuỳ chỉnh)
4. Viết **Release notes** (EN + VI)
5. Nhấn **"Review release"** → kiểm tra không còn Error nào
6. Nhấn **"Start rollout to Closed testing"**

**Bước 4: Chờ Google Review**

- Google review bản Closed Testing trong **3–7 ngày**
- Xem trạng thái tại: Testing → Closed testing → tab Releases
- Khi approve → trạng thái chuyển thành **"Available to selected testers"**

**Bước 5: Chia sẻ Link Test cho Testers**

1. Vào tab **"Testers"** → kéo xuống phần **"How testers join your test"**
2. Copy link:
   - **"Join on Android"** — mở trực tiếp trên Google Play app
   - **"Join on the web"** — mở trên trình duyệt
3. Gửi link cho **tất cả** testers trong email list
4. Mỗi tester phải:
   - Mở link → nhấn **"Accept invitation"**
   - Cài app từ Play Store
   - Mở app ít nhất 1 lần

> ⚠️ **Quan trọng:** Nếu tester không nhấn "Accept invitation" trên link, họ **KHÔNG** được tính vào 12 người.

**Bước 6: Đợi 14 ngày liên tục**

| Yêu cầu | Chi tiết |
| --- | --- |
| Số testers tối thiểu | **12 người opt-in** |
| Thời gian liên tục | **14 ngày không gián đoạn** |
| Tạm dừng (Pause track) | ❌ KHÔNG — sẽ reset timer |
| Upload bản mới | ✅ Được — không ảnh hưởng timer |
| Tester rời khỏi | ⚠️ Nếu < 12 opt-in → timer tạm dừng |

- Theo dõi tiến trình tại **Dashboard** hoặc **Testing → Closed testing**
- Google dùng AI kiểm tra testers là người thật (đa dạng device, IP)

**Bước 7: Apply for Production Access**

1. Sau 14 ngày, nút **"Apply for production access"** sẽ xuất hiện
2. Trả lời các câu hỏi về quá trình testing
3. Submit → chờ Google phê duyệt

### 11.3 Open Testing (Beta)

- Bất kỳ ai cũng join được (qua link)
- Hiện trên Store listing (có nhãn "Beta")
- Dùng khi gần production-ready, muốn feedback rộng

### 11.4 Pre-launch Report

Google tự chạy app trên **Firebase Test Lab** (nhiều device thật) khi upload lên bất kỳ track nào. Kiểm tra:

- Crash rate
- ANR (Application Not Responding)
- Security vulnerabilities
- Accessibility issues

Xem kết quả tại: **Play Console → Release → Pre-launch report**

---

## 12. In-App Purchase Setup

> ⚠️ **Yêu cầu:** Phải upload ít nhất 1 AAB (bước 11) trước khi tạo in-app products.

### 12.1 Tạo In-App Product

Truy cập **Play Console → Monetize → Products → In-app products → Create product**:

**Bước 1 — Product details:**

| Field                 | Giá trị                                     | Ghi chú                                                |
| --------------------- | --------------------------------------------- | ------------------------------------------------------- |
| **Product ID**  | `remove_ads`                                | ⚠️ Không đổi được sau khi tạo. Match với code |
| **Name**        | `PipForge Premium`                          | Hiện cho user                                          |
| **Description** | EN:`No interstitial ads + unlimited hints.` | Hiện cho user                                          |
| **Description** | VI:`Không QC xen kẽ + gợi ý vô hạn.`  | Thêm translation                                       |

**Bước 2 — Availability and pricing:**

| Field                        | Giá trị          | Ghi chú                              |
| ---------------------------- | ------------------ | ------------------------------------- |
| **Purchase option ID** | `remove-ads-buy` | Nội bộ, user không thấy           |
| **Purchase type**      | `Buy`            | Mua một lần, không phải thuê bao |
| **Tags**               | *(để trống)*  | —                                    |

**Tax, compliance, and programs:**

| Field                                  | Giá trị                          | Ghi chú                           |
| -------------------------------------- | ---------------------------------- | ---------------------------------- |
| **Product tax category**         | `Digital app sales`              | Giữ mặc định                   |
| **Age rating**                   | *(để trống)*                  | App đã có content rating riêng |
| **Payment location restriction** | `No country / region restricted` | Giữ mặc định                   |

Sau đó click **Edit availability and access** để set giá $2.99 USD → Google tự convert giá cho tất cả các nước.

### 12.2 Multi-currency pricing

Sau khi set default price ($2.99):

- Google tự tính giá tương đương cho 175+ nước
- Việt Nam: khoảng 69.000 VND (tuỳ tỉ giá)
- Có thể chỉnh manual nếu muốn giá tròn

### 12.3 Licensing Testing

Truy cập **Play Console → Settings → License testing**:

| Config                       | Giá trị                         |
| ---------------------------- | --------------------------------- |
| **License test email** | *(email test account)*          |
| **License response**   | RESPOND_NORMALLY (cho production) |

> Thêm email test vào đây để test IAP trên device thật mà KHÔNG bị trừ tiền thật.

### 12.4 Lưu ý IAP

- Product ID `remove_ads` phải match chính xác với code trong `in_app_purchase` plugin
- Google Play Billing Library v5+ tự động xử lý pending purchases và acknowledgement

---

## 13. Production Release

### 13.1 Trước khi submit production

Đảm bảo đã hoàn thành tất cả mục trong **Policy and programs → App content**:

| Mục               | Status                 |
| ------------------ | ---------------------- |
| Privacy policy     | ✅                     |
| Ads                | ✅                     |
| App access         | ✅ (không cần login) |
| Content rating     | ✅                     |
| Target audience    | ✅                     |
| News app           | ✅ (No)                |
| Data safety        | ✅                     |
| Government apps    | ✅ (No)                |
| Financial features | ✅ (No)                |
| Health apps        | ✅ (No)                |

### 13.2 Tạo Production Release

1. Play Console → Production → Create new release
2. Upload AAB (hoặc promote từ testing track)
3. Điền release notes:

**Release Notes (English):**

```
Initial release of PipForge!

• Daily domino logic puzzle — one new puzzle every day
• Practice mode with 10 chapters and 90 levels
• Daily leaderboard and streak tracking
• Smart hint system
• Bilingual: English & Vietnamese
• Works offline
```

**Release Notes (Vietnamese):**

```
Phiên bản đầu tiên của PipForge!

• Giải đố domino logic hằng ngày — một câu đố mới mỗi ngày
• Chế độ luyện tập với 10 chương và 90 màn
• Bảng xếp hạng hằng ngày và theo dõi streak
• Hệ thống gợi ý thông minh
• Song ngữ: Tiếng Anh & Tiếng Việt
• Chơi offline
```

### 13.3 Staged Rollout (khuyến nghị)

| Config                       | Giá trị                     | Ghi chú                             |
| ---------------------------- | ----------------------------- | ------------------------------------ |
| **Rollout percentage** | 20% → 50% → 100%            | Tăng dần nếu không có vấn đề |
| **Monitor**            | Crash rate, ANR rate, reviews | Dashboard → Release → Overview     |

> Staged rollout cho phép release cho 20% users trước. Nếu crash rate cao, có thể halt hoặc rollback.

### 13.4 Review Timeline

| Loại                  | Thời gian                      |
| ---------------------- | ------------------------------- |
| App mới (lần đầu)  | 3–7 ngày (có thể lâu hơn) |
| Update app             | 1–3 ngày                      |
| Rejection → re-submit | Thêm 1–3 ngày                |

> ⚠️ **App mới** từ tài khoản developer mới thường bị review kỹ hơn. Google có thể yêu cầu bổ sung thông tin.

---

## 14. Checklist Tổng Hợp

### ✅ Trước khi bắt đầu

- [ ] Google Play Developer Account đã đăng ký ($25)
- [ ] Identity verification đã hoàn thành
- [ ] Merchant Account đã setup (cho IAP)
- [ ] Upload keystore đã tạo (`pipforge-upload-key.jks`)
- [ ] `key.properties` đã tạo (KHÔNG commit lên git)
- [ ] `build.gradle.kts` đã cấu hình signing release
- [ ] `.gitignore` có `key.properties`, `*.jks`

### ✅ Chuẩn bị online

- [ ] Privacy Policy page đã publish: `https://www.madebybang.com/en/work/pipforge/privacy`
- [ ] Terms of Service page đã publish
- [ ] Support/Contact page đã publish

### ✅ Google Play Console — Store Listing

- [ ] App name: `PipForge`
- [ ] Short description (EN + VI) đã điền
- [ ] Full description (EN + VI) đã điền
- [ ] App icon 512 × 512 đã upload
- [ ] Feature graphic 1024 × 500 đã upload
- [ ] Phone screenshots (≥ 4 tấm, 1080 × 1920)
- [ ] Tablet screenshots (khuyến nghị)

### ✅ Google Play Console — App Content

- [ ] Content rating questionnaire đã trả lời
- [ ] Data safety form đã điền
- [ ] Ads declaration: Yes
- [ ] Target audience: 13+
- [ ] Privacy policy URL đã điền
- [ ] App access: không cần login

### ✅ Google Play Console — Pricing

- [ ] Price: Free
- [ ] Countries: All

### ✅ Google Play Console — In-App Products

- [ ] Product `remove_ads` đã tạo (Non-consumable, $2.99)
- [ ] Name (EN/VI): `PipForge Premium`
- [ ] Description (EN/VI) đã điền
- [ ] Status: Active

### ✅ Build & Upload

- [ ] `flutter clean && flutter build appbundle --release` thành công
- [ ] AAB đã signed với upload key
- [ ] `flutter analyze` — 0 errors
- [ ] `flutter test` — all pass
- [ ] Test trên device thật (không chỉ emulator)
- [ ] Test IAP trên sandbox (license testing)

### ✅ Testing

- [ ] Internal testing release đã upload + test OK
- [ ] Pre-launch report không có critical issues
- [ ] IAP flow hoạt động trên device thật
- [ ] Deep links hoạt động (`madebybang.com/vi/pipforge`, `/en/pipforge`)
- [ ] AdMob hiện quảng cáo (test ads → real ads)

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
- [ ] Release notes (EN + VI) đã điền
- [ ] Staged rollout: 20%
- [ ] Submit for review

---

## Phụ Lục A: So Sánh Apple vs Google

| Aspect                 | Apple App Store               | Google Play                  |
| ---------------------- | ----------------------------- | ---------------------------- |
| Phí đăng ký        | $99/năm | $25 một lần      |                              |
| Build format           | IPA                           | AAB                          |
| Signing                | Distribution certificate      | Upload key + App Signing     |
| Review time (app mới) | 1–3 ngày                    | 3–7 ngày                   |
| Review time (update)   | 1–2 ngày                    | 1–3 ngày                   |
| Keywords field         | ✅ 100 bytes riêng           | ❌ Tự index từ description |
| Subtitle               | 30 chars                      | Short description (80 chars) |
| Staged rollout         | Phased release (7 ngày auto) | % rollout (manual control)   |
| IAP type name          | Non-Consumable                | One-time product             |
| Testing                | TestFlight                    | Internal/Closed/Open tracks  |
| Age rating system      | Apple questionnaire           | IARC                         |
| Data privacy           | App Privacy nutrition labels  | Data Safety form             |

## Phụ Lục B: Troubleshooting

### Build fails: "Keystore was tampered with, or password was incorrect"

- Kiểm tra `key.properties` path chính xác
- Password không có special characters gây conflict

### Upload fails: "Version code X has already been used"

- Tăng `versionCode` trong `pubspec.yaml`: `version: 1.0.0+2`

### "Your app has been rejected" — common reasons

1. **Missing privacy policy** — đảm bảo URL hoạt động
2. **Ads in children-targeted content** — đảm bảo target audience là 13+
3. **Broken functionality** — test kỹ trên device thật
4. **Misleading description** — description phải khớp với app thật

### IAP not showing up in app

- Cần upload ít nhất 1 AAB trước khi tạo IAP
- Product status phải là "Active"
- Test account phải nằm trong license testing list
- Đợi vài giờ sau khi tạo product (cache delay)

### Closed Testing track hiện "Inactive"

- Vào tab **Testers** → tick checkbox ☑ bên cạnh email list → Save
- Nếu đã tick mà vẫn Inactive → kiểm tra đã tạo release và rollout chưa

### Tạo release báo lỗi "No countries or regions have been selected"

- Vào tab **Countries / regions** → Add countries / regions → chọn tất cả → Save
- Quay lại tab Releases → tạo release lại

### Link test báo "App not available" hoặc 404

- Release chưa được Google approve — đợi 3–7 ngày
- Countries / regions chưa chọn → thêm tất cả countries
- Tester chưa nằm trong email list → thêm email vào list

### Tester đã accept nhưng không tính vào 12 người

- Email tester phải là **Google Account** (Gmail hoặc email đăng ký Google)
- Tester phải mở app ít nhất 1 lần trên device
- Google dùng AI kiểm tra — fake account / cùng IP có thể bị loại

### Deep links không hoạt động

- Kiểm tra Digital Asset Links file tại: `https://madebybang.com/.well-known/assetlinks.json`
- Content phải chứa đúng package name `vn.bradley.pipforge` và signing certificate SHA-256 fingerprint
