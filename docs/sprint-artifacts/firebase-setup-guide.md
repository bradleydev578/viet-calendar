# Hướng Dẫn Setup Firebase Analytics

**Dự án:** Lịch Việt Vạn Sự An Lành
**Thời gian ước tính:** 15-20 phút

---

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** hoặc **"Add project"**
3. Nhập tên project: `lich-viet-van-su-an-lanh` (hoặc tên bạn muốn)
4. **Google Analytics:** Chọn **Enable** (bắt buộc cho Analytics)
5. Chọn hoặc tạo Google Analytics account
6. Click **"Create project"** và đợi hoàn tất

---

## Bước 2: Đăng Ký iOS App

### 2.1 Lấy Bundle ID

```bash
# Mở Xcode project để xem Bundle ID
cd mobile/ios
open LichViet.xcworkspace
```

Hoặc xem trong file:

```bash
grep -r "PRODUCT_BUNDLE_IDENTIFIER" mobile/ios/LichViet.xcodeproj/project.pbxproj | head -1
```

Bundle ID thường có dạng: `com.bangca.lichviet` hoặc `com.lichviet.app`

### 2.2 Đăng Ký trong Firebase

1. Trong Firebase Console, click **"Add app"** → **iOS** (biểu tượng Apple)
2. Nhập **Bundle ID** (lấy từ bước 2.1)
3. App nickname: `Lịch Việt iOS` (optional)
4. App Store ID: Để trống (thêm sau khi publish)
5. Click **"Register app"**

### 2.3 Download Config File

1. Download file **`GoogleService-Info.plist`**
2. **QUAN TRỌNG:** Copy file vào đúng vị trí:

```bash
# Copy file vào iOS project
cp ~/Downloads/GoogleService-Info.plist mobile/ios/LichViet/
```

3. Mở Xcode, kéo file vào project:

   - Right-click folder `LichViet` trong Xcode
   - Chọn **"Add Files to LichViet..."**
   - Chọn `GoogleService-Info.plist`
   - ✅ Check **"Copy items if needed"**
   - ✅ Check **"Add to targets: LichViet"**
   - Click **"Add"**
4. **Verify:** File phải xuất hiện trong Xcode project navigator

---

## Bước 3: Đăng Ký Android App

### 3.1 Lấy Package Name

```bash
# Xem package name trong AndroidManifest.xml
grep "package=" mobile/android/app/src/main/AndroidManifest.xml
```

Hoặc xem trong `build.gradle`:

```bash
grep "applicationId" mobile/android/app/build.gradle
```

Package name thường có dạng: `com.lichviet` hoặc `com.bangca.lichviet`

### 3.2 Đăng Ký trong Firebase

1. Trong Firebase Console, click **"Add app"** → **Android** (biểu tượng Android)
2. Nhập **Android package name** (lấy từ bước 3.1)
3. App nickname: `Lịch Việt Android` (optional)
4. Debug signing certificate SHA-1: Để trống (không cần cho Analytics)
5. Click **"Register app"**

### 3.3 Download Config File

1. Download file **`google-services.json`**
2. Copy file vào đúng vị trí:

```bash
# Copy file vào Android app folder
cp ~/Downloads/google-services.json mobile/android/app/
```

3. **Verify:** File phải ở `mobile/android/app/google-services.json`

---

## Bước 4: Install Firebase Packages

```bash
cd mobile

# Install Firebase packages
npm install @react-native-firebase/app @react-native-firebase/analytics

# Install iOS pods
cd ios && pod install && cd ..
```

---

## Bước 5: Configure Native Files

### 5.1 iOS - Podfile

Mở `mobile/ios/Podfile` và thêm ở đầu file (trước `target`):

```ruby
# Firebase static framework (required for Analytics)
$RNFirebaseAsStaticFramework = true
```

Sau đó chạy:

```bash
cd mobile/ios && pod install && cd ..
```

### 5.2 Android - Project build.gradle

Mở `mobile/android/build.gradle` và thêm vào `buildscript.dependencies`:

```gradle
buildscript {
    // ... existing code ...
    dependencies {
        // ... existing dependencies ...
        classpath 'com.google.gms:google-services:4.4.0'  // ← Thêm dòng này
    }
}
```

### 5.3 Android - App build.gradle

Mở `mobile/android/app/build.gradle` và thêm ở cuối file:

```gradle
// Thêm ở cuối file, sau tất cả các block khác
apply plugin: 'com.google.gms.google-services'
```

---

## Bước 6: Verify Setup

### 6.1 Build iOS

```bash
cd mobile
npm run ios
```

✅ App build thành công = iOS setup OK

### 6.2 Build Android

```bash
cd mobile
npm run android
```

✅ App build thành công = Android setup OK

### 6.3 Check Firebase Console

1. Mở Firebase Console → Project → Analytics
2. Đợi vài phút sau khi build app
3. Nên thấy **"first_open"** event tự động

---

## Troubleshooting

### iOS Build Failed

**Error: `GoogleService-Info.plist not found`**

```bash
# Verify file exists
ls -la mobile/ios/LichViet/GoogleService-Info.plist

# Nếu không có, copy lại
cp ~/Downloads/GoogleService-Info.plist mobile/ios/LichViet/
```

**Error: Pod install failed**

```bash
cd mobile/ios
rm -rf Pods Podfile.lock
pod install --repo-update
```

### Android Build Failed

**Error: `google-services.json not found`**

```bash
# Verify file exists
ls -la mobile/android/app/google-services.json

# Nếu không có, copy lại
cp ~/Downloads/google-services.json mobile/android/app/
```

**Error: `Could not find com.google.gms:google-services`**

```bash
# Clean và rebuild
cd mobile/android
./gradlew clean
cd ..
npm run android
```

### Firebase Console không hiện data

- Đợi 24-48h cho data đầu tiên xuất hiện
- Dùng **DebugView** để test real-time (xem bước tiếp theo)

---

## Bước 7: Enable DebugView (Optional - Để Test)

### iOS DebugView

1. Mở Xcode
2. Product → Scheme → Edit Scheme
3. Run → Arguments → Arguments Passed On Launch
4. Thêm: `-FIRDebugEnabled`
5. Run app

### Android DebugView

```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app com.lichviet

# Disable khi xong test
adb shell setprop debug.firebase.analytics.app .none.
```

Sau đó mở Firebase Console → DebugView để xem events real-time.

---

## Checklist Hoàn Thành

- [ ] Firebase project created
- [ ] iOS app registered
- [ ] `GoogleService-Info.plist` added to Xcode project
- [ ] Android app registered
- [ ] `google-services.json` added to `android/app/`
- [ ] Firebase packages installed (`npm install`)
- [ ] iOS pods installed (`pod install`)
- [ ] `Podfile` updated with `$RNFirebaseAsStaticFramework`
- [ ] `android/build.gradle` updated with google-services classpath
- [ ] `android/app/build.gradle` updated with google-services plugin
- [ ] iOS build successful
- [ ] Android build successful
- [ ] 

---

## Sau Khi Hoàn Thành

Khi tất cả checklist đã ✅, quay lại và gõ **"g"** hoặc **"go"** để tôi tiếp tục implement:

- Analytics service layer
- Screen tracking
- Event tracking
- Privacy Policy update

---

## Tài Liệu Tham Khảo

- [React Native Firebase - Getting Started](https://rnfirebase.io/)
- [React Native Firebase - Analytics](https://rnfirebase.io/analytics/usage)
- [Firebase Console](https://console.firebase.google.com/)
