# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lịch Việt Vạn Sự An Lành - A Vietnamese lunar calendar mobile app with feng shui, astrological insights, and traditional calendar features. Two-part system: Python scraper for data collection and React Native mobile app.

## Architecture

### Two-Part System

1. **Scraper (Python)**: Web scraper collecting feng shui data from Vietnamese calendar websites
   - Validates against `lunar-javascript` calculations
   - Exports JSON/SQLite for mobile app consumption

2. **Mobile (React Native)**: Cross-platform iOS/Android app
   - Offline-first with local data bundling
   - Real-time lunar calculations + pre-scraped feng shui data

### Key Architectural Decisions

**Data Strategy**: Hybrid approach combining real-time calculations and scraped data
- `lunar-javascript` for lunar calendar, Can Chi (天干地支), 28 Stars, 12 Truc (reliable, real-time)
- Scraped data for feng shui activities (việc nên/không nên làm), directions, interpretations (website-based rules)
- Cross-validation between sources for accuracy

**Offline-First**: App bundles 2-3 years of feng shui data (gzipped JSON ~20-50KB/year)

## Directory Structure

```
lich-viet-van-su-an-lanh/
├── docs/                           # Technical documentation
│   ├── lich-viet-technical-doc-v2.md    # Main technical spec
│   ├── scraper-design-doc.md            # Scraper system design
│   └── project-plan.md                  # Implementation plan
├── scraper/                        # Python data scraper
│   ├── src/
│   │   ├── scrapers/              # lichngaytot.com, xemngay.com
│   │   ├── parsers/               # HTML parsing logic
│   │   ├── models/                # Pydantic data models
│   │   ├── validators/            # lunar-javascript validation
│   │   └── storage/               # SQLite + JSON export
│   ├── scripts/                   # CLI scripts
│   │   ├── scrape_year.py         # Main scraper
│   │   ├── validate_data.py       # Data validation
│   │   └── export_for_app.py      # Mobile export
│   └── data/                      # Output directory
└── mobile/                         # React Native app
    └── src/
        ├── core/                  # Business logic
        │   ├── lunar/            # Lunar calculations
        │   └── fengshui/         # Day scoring, activities
        ├── screens/              # UI screens
        ├── components/           # Reusable components
        ├── stores/              # Zustand state management
        └── theme/               # Design system
```

## Common Commands

### Scraper (Python)

```bash
cd scraper

# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Scrape a full year (365 days)
python scripts/scrape_year.py 2025

# Validate scraped data
python scripts/validate_data.py data/export/fengshui_2025.json

# Export for mobile app (gzipped JSON)
python scripts/export_for_app.py 2025 --output data/mobile/

# Quick test scrape (single date)
python -c "from src.scrapers.lichngaytot import LichNgayTotScraper; import datetime; s=LichNgayTotScraper(); print(s.scrape_date(datetime.date(2025,1,1)))"
```

### Mobile (React Native)

```bash
cd mobile

# Setup
npm install

# iOS
npm run ios                    # Run on simulator
npm run ios:device            # Run on physical device
cd ios && pod install         # Update iOS dependencies

# Android
npm run android

# Development
npm start                      # Metro bundler
npm test                      # Run tests
npx tsc --noEmit              # Type check

# Common issues
watchman watch-del-all        # Clear watchman cache
rm -rf node_modules && npm install  # Fresh install
```

## Tech Stack

### Scraper
- **Python 3.11+**: Core language
- **BeautifulSoup4 + lxml**: HTML parsing
- **Pydantic**: Data validation
- **SQLAlchemy**: Database ORM
- **requests**: HTTP client
- **lunar-javascript** (via Node.js): Validation

### Mobile
- **React Native 0.73+**: Framework
- **TypeScript**: Type safety
- **lunar-javascript**: Lunar calculations
- **React Navigation 6**: Navigation
- **Zustand**: State management
- **TanStack Query**: Data fetching/caching
- **MMKV**: Fast key-value storage
- **WatermelonDB**: Offline database (planned)

## Key Files

- `docs/lich-viet-technical-doc-v2.md` - Complete technical specification with UI mockups, data models, algorithms
- `docs/scraper-design-doc.md` - Scraper system architecture, HTML parsing strategies, validation logic
- `docs/project-plan.md` - Implementation roadmap with phase breakdown
- `mobile/src/core/lunar/LunarCalculator.ts` - Wrapper around lunar-javascript library
- `mobile/src/core/fengshui/DayScore.ts` - Day quality scoring algorithm (0-100%)
- `mobile/src/theme/` - Design system (colors, typography, spacing)
- `scraper/src/models/activities.py` - Master list of 38 feng shui activities across 12 categories

## Development Notes

### Lunar Calendar Calculations

All lunar calculations use `lunar-javascript` library:
- Lunar date conversion (solar ↔ lunar)
- Can Chi (干支) - Heavenly Stems & Earthly Branches
- 28 Nhị thập bát tú (28 Mansions/Stars)
- 12 Trực (12 Day Officers)
- Tiết khí (24 Solar Terms)
- Hoàng đạo giờ (auspicious hours)

### Feng Shui Data Flow

1. **Scrape**: Python scripts fetch HTML from Vietnamese calendar sites
2. **Parse**: Extract activities, directions, stars using BeautifulSoup
3. **Validate**: Cross-check with lunar-javascript calculations
4. **Merge**: Combine data from multiple sources with conflict resolution
5. **Export**: Generate compact JSON (gzipped) for mobile app
6. **Import**: Mobile app loads into WatermelonDB on first launch

### Data Normalization

The scraper normalizes Vietnamese text variations:
- Activity names (e.g., "cầu an" vs "Cầu an" vs "cau an")
- Direction names (e.g., "Đông Bắc" vs "đông bắc")
- Can Chi (e.g., "Giáp Tý" vs "Giap Ty")

See `scraper/src/models/activities.py` for the master mapping (38 activities).

### Mobile App Patterns

**State Management**:
- Zustand for global app state (settings, current date)
- TanStack Query for server/file data (feng shui data, holidays)
- Local state for UI (modals, forms)

**Data Loading**:
- Bundle 2-3 years of feng shui data with app
- Lazy-load additional years on demand
- Cache lunar calculations in MMKV (expensive operations)

**Offline Strategy**:
- All lunar calculations work offline (no network needed)
- Pre-bundled feng shui data for recent years
- WatermelonDB for user events/reminders

## Troubleshooting

### Scraper Issues

**High validation error rate (>5%)**:
- Check if website HTML structure changed
- Verify lunar-javascript version compatibility
- Run `python scripts/validate_data.py` with `--verbose`

**Rate limiting / blocked requests**:
- Increase delay in `BaseScraper(rate_limit=2.0)`  # default 1.5s
- Check website robots.txt
- Use different User-Agent headers

### Mobile Issues

**Metro bundler cache issues**:
```bash
rm -rf /tmp/metro-* && npm start -- --reset-cache
```

**iOS build fails**:
```bash
cd ios && rm -rf Pods Podfile.lock && pod install
```

**TypeScript errors with lunar-javascript**:
- Type definitions in `mobile/src/types/lunar-javascript.d.ts`
- May need to augment if using new APIs

**Watchman file watching issues** (macOS):
```bash
watchman shutdown-server
sudo launchctl limit maxfiles 2048 unlimited
launchctl limit maxfiles 2048 unlimited
```

## Data Sources

- **lichngaytot.com**: Primary scraping source (comprehensive data)
- **xemngay.com**: Secondary source (cross-validation, 28 Star details)
- **lunar-javascript**: Calculation validation (npm package)

## Important Conventions

- **Vietnamese Text**: UTF-8 encoding required throughout
- **Date Format**: ISO 8601 (YYYY-MM-DD) for storage
- **Lunar Dates**: Stored as separate day/month/year fields (not as strings)
- **Can Chi**: Always stored in Vietnamese (e.g., "Giáp Tý" not "Jia Zi")
- **Activity IDs**: Slugified Vietnamese (e.g., "cau_an" for "Cầu an")

## Testing

### Scraper
```bash
cd scraper
pytest                           # Run all tests
pytest -v tests/test_parsers.py  # Test specific module
```

### Mobile
```bash
cd mobile
npm test                         # Jest unit tests
npm run test:watch              # Watch mode
```

## Performance Considerations

- **Scraper**: Rate limit to 1-2 requests/second to avoid IP bans
- **Mobile**: Pre-compute day scores on data import (not on render)
- **Mobile**: Use React.memo for DayCell components (60+ cells per month)
- **Mobile**: Virtualize long lists (holiday list, year view)
