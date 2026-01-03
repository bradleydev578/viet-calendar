# How to Run the App

## Prerequisites
- ✅ Xcode installed
- ✅ Node.js installed
- ✅ Watchman installed (`brew install watchman`)
- ✅ Dependencies installed (`npm install`)
- ✅ Pods installed (`cd ios && pod install`)

## Option 1: Using the Helper Script (Recommended)

### Terminal 1 - Start Metro:
```bash
cd /Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile
./run-ios.sh
```

### Terminal 2 - Build and Run:
```bash
cd /Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile
npm run ios
```

## Option 2: Manual Steps

### Terminal 1:
```bash
cd /Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile
ulimit -n 10240
npm start
```

### Terminal 2:
```bash
cd /Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile
npm run ios
```

## Option 3: Using Xcode (Most Reliable)

1. Open the workspace:
```bash
cd /Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile
open ios/LichVietTemp.xcworkspace
```

2. In Xcode:
   - Select a simulator (iPhone 15 or similar)
   - Press `Cmd + R` to build and run

3. Metro bundler will start automatically

## Troubleshooting

### "EMFILE: too many open files" Error

If you see this error, you need to increase the system file limit:

1. **Temporary fix (current terminal session):**
```bash
ulimit -n 10240
```

2. **Permanent fix (add to ~/.zshrc):**
```bash
echo 'ulimit -n 10240' >> ~/.zshrc
source ~/.zshrc
```

3. **System-level fix (requires sudo):**
```bash
sudo launchctl limit maxfiles 65536 200000
```

### Metro Won't Start

```bash
# Kill any running Metro processes
killall node

# Clean caches
rm -rf $TMPDIR/metro-* $TMPDIR/haste-* node_modules/.cache

# Reset watchman
watchman shutdown-server
watchman watch-del-all

# Start fresh
npm start -- --reset-cache
```

### Build Fails in Xcode

```bash
# Clean build folder
cd ios
rm -rf build Pods Podfile.lock
pod install
```

Then try building again in Xcode.

## What to Expect

When the app launches successfully, you should see:

✅ **Bottom Tab Navigation** with 4 tabs:
   - 📅 Lịch (Calendar)
   - ☀️ Hôm nay (Today)
   - 🎉 Ngày lễ (Holidays)
   - ⚙️ Cài đặt (Settings)

✅ **Calendar Screen** showing:
   - Current month and year
   - Solar dates (large numbers)
   - Lunar dates below (small numbers)
   - Vietnamese lunar year info (e.g., "Ất Tỵ 🐍")

✅ **Interactive Features**:
   - Tap ← → to navigate months
   - Tap month/year to jump to today
   - Tap any day to see details (placeholder for now)

## Phase 1 Complete! ✨

This is **Phase 1** of the mobile app implementation:
- ✅ Navigation structure
- ✅ Lunar calendar engine
- ✅ Calendar screen with lunar dates
- ✅ Common components and hooks

Next phases will add:
- Phase 2: Day detail screen with feng shui info
- Phase 3: Hour-by-hour analysis
- Phase 4: Holidays and settings
