#!/bin/bash

# Helper script to run iOS app with proper configuration

echo "🔧 Setting up environment..."

# Increase file descriptor limit
ulimit -n 10240

# Clean Metro cache
echo "🧹 Cleaning Metro cache..."
rm -rf $TMPDIR/metro-* $TMPDIR/haste-* node_modules/.cache 2>/dev/null

# Reset watchman
echo "👀 Resetting watchman..."
watchman shutdown-server 2>/dev/null
watchman watch-del-all 2>/dev/null

echo ""
echo "✅ Environment ready!"
echo ""
echo "📱 Starting Metro bundler..."
echo ""

# Start Metro with reset cache
npx react-native start --reset-cache
