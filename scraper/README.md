# Lich Viet Scraper

Hệ thống scrape data lịch vạn niên từ các website Việt Nam.

## Cài đặt

```bash
# Tạo virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# hoặc: venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Cài đặt lunar-javascript (cho validation)
npm install -g lunar-javascript
```

## Sử dụng

```bash
# Scrape data cho 1 năm
python scripts/scrape_year.py 2025

# Validate data
python scripts/validate_data.py

# Export cho mobile app
python scripts/export_for_app.py
```

## Cấu trúc

```
scraper/
├── src/
│   ├── scrapers/      # Scraper modules
│   ├── parsers/       # HTML parsers
│   ├── models/        # Data models (Pydantic)
│   ├── validators/    # Data validation
│   ├── storage/       # SQLite & JSON storage
│   └── utils/         # Utilities
├── scripts/           # CLI scripts
├── data/
│   ├── raw/          # Raw HTML backup
│   ├── processed/    # Processed JSON
│   ├── validated/    # Validated data
│   └── export/       # Final export for app
└── tests/
```

## Data Sources

| Source | URL | Data |
|--------|-----|------|
| lichngaytot.com | `xem-ngay-tot-xau-{DD}-{MM}-{YYYY}.html` | Activities, Directions, Stars |
| xemngay.com | `?blog=xngay&d={DDMMYYYY}` | 28 Sao details |
