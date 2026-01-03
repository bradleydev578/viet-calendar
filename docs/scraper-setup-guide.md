# Scraper Setup Guide

Hướng dẫn cài đặt và chạy scraper thu thập dữ liệu phong thủy cho ứng dụng Lịch Việt.

## Quick Start

```bash
# 1. Di chuyển vào thư mục scraper
cd scraper

# 2. Tạo và kích hoạt virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# .\venv\Scripts\activate  # Windows

# 3. Cài đặt dependencies
pip install -r requirements.txt

# 4. Test scrape một ngày
python scripts/scrape_year.py 2025 --single-day 2025-01-15

# 5. Scrape cả năm 2025
python scripts/scrape_year.py 2025

# 6. Export cho mobile app
python scripts/export_for_app.py 2025 --gzip
```

## Nguồn dữ liệu

Scraper hỗ trợ thu thập từ các nguồn sau:

| Nguồn | URL | Dữ liệu | Ưu tiên |
|-------|-----|---------|---------|
| **lichngaytot.com** | https://lichngaytot.com | Ngày tốt/xấu, Can Chi, 28 Sao, 12 Trực, Giờ Hoàng Đạo, Sao tốt/xấu | Primary |
| **xemngay.com** | https://xemngay.com | 28 Sao (ngũ hành, con vật), Phương hướng | Secondary |

## Yêu cầu hệ thống

- Python 3.11 hoặc cao hơn
- pip (Python package manager)
- Git (optional)

## Cài đặt

### macOS

```bash
# 1. Kiểm tra phiên bản Python
python3 --version  # Cần >= 3.11

# 2. Cài đặt Python nếu chưa có (dùng Homebrew)
brew install python@3.11

# 3. Di chuyển vào thư mục scraper
cd scraper

# 4. Tạo virtual environment
python3 -m venv venv

# 5. Kích hoạt virtual environment
source venv/bin/activate

# 6. Cài đặt dependencies
pip install -r requirements.txt
```

### Windows

```powershell
# 1. Kiểm tra phiên bản Python
python --version  # Cần >= 3.11

# 2. Tải và cài đặt Python từ https://www.python.org/downloads/
# Đảm bảo chọn "Add Python to PATH" khi cài đặt

# 3. Di chuyển vào thư mục scraper
cd scraper

# 4. Tạo virtual environment
python -m venv venv

# 5. Kích hoạt virtual environment
.\venv\Scripts\activate

# 6. Cài đặt dependencies
pip install -r requirements.txt
```

### Linux (Ubuntu/Debian)

```bash
# 1. Cập nhật package list
sudo apt update

# 2. Cài đặt Python 3.11+
sudo apt install python3.11 python3.11-venv python3-pip

# 3. Di chuyển vào thư mục scraper
cd scraper

# 4. Tạo virtual environment
python3.11 -m venv venv

# 5. Kích hoạt virtual environment
source venv/bin/activate

# 6. Cài đặt dependencies
pip install -r requirements.txt
```

## Sử dụng Scraper

### Scrape từ lichngaytot.com (Nguồn chính)

Script `scrape_year.py` sử dụng `LichNgayTotScraper` để thu thập dữ liệu từ lichngaytot.com.

#### Scrape một ngày (test)

```bash
# Kích hoạt virtual environment (nếu chưa)
source venv/bin/activate  # macOS/Linux
# hoặc: .\venv\Scripts\activate  # Windows

# Scrape một ngày cụ thể để test
python scripts/scrape_year.py 2025 --single-day 2025-01-15
```

Output sẽ hiển thị:
```
==================================================
Date: 2025-01-15
Lunar: 16/12/2024
Can Chi Day: Giáp Tý
Star 28: Đẩu
Truc 12: Kiến
Good activities: 15
Bad activities: 8
==================================================
```

#### Scrape cả năm

```bash
# Scrape toàn bộ năm 2025 từ lichngaytot.com
python scripts/scrape_year.py 2025

# Scrape với output directory tùy chỉnh
python scripts/scrape_year.py 2025 --output data/export

# Scrape một khoảng tháng (ví dụ: tháng 6-12)
python scripts/scrape_year.py 2025 --start-month 6 --end-month 12

# Điều chỉnh delay giữa các request (tránh bị block)
python scripts/scrape_year.py 2025 --delay-min 1.5 --delay-max 3.0
```

#### Tham số scrape_year.py

| Tham số | Mô tả | Mặc định |
|---------|-------|----------|
| `year` | Năm cần scrape (bắt buộc) | - |
| `--output`, `-o` | Thư mục output | `data/export` |
| `--start-month` | Tháng bắt đầu (1-12) | 1 |
| `--end-month` | Tháng kết thúc (1-12) | 12 |
| `--single-day` | Scrape một ngày (format: YYYY-MM-DD) | - |
| `--delay-min` | Delay tối thiểu giữa requests (giây) | 1.0 |
| `--delay-max` | Delay tối đa giữa requests (giây) | 2.0 |

#### URL Format của lichngaytot.com

Scraper sẽ fetch từ URL có format:
```
https://lichngaytot.com/xem-ngay-tot-xau-DD-MM-YYYY
```

Ví dụ: `https://lichngaytot.com/xem-ngay-tot-xau-15-01-2025`

#### Dữ liệu thu thập từ lichngaytot.com

| Field | Mô tả |
|-------|-------|
| `solar_date` | Ngày dương lịch |
| `lunar_date` | Ngày âm lịch (ngày, tháng, năm, nhuận) |
| `can_chi` | Can Chi ngày/tháng/năm + Ngũ hành |
| `tiet_khi` | Tiết khí (nếu có) |
| `star28` | Sao 28 (tên, tốt/xấu) |
| `truc12` | 12 Trực (tên, tốt/xấu) |
| `hoang_dao_hours` | Giờ hoàng đạo trong ngày |
| `good_activities` | Danh sách việc nên làm |
| `bad_activities` | Danh sách việc không nên |
| `good_stars` | Sao tốt trong ngày |
| `bad_stars` | Sao xấu trong ngày |
| `directions` | Phương hướng tốt/xấu |

### Sử dụng Scraper trong Python Code

```python
from datetime import date
from src.scrapers.lichngaytot import LichNgayTotScraper

# Khởi tạo scraper
scraper = LichNgayTotScraper(delay_range=(1.0, 2.0))

try:
    # Scrape một ngày
    day_data = scraper.scrape_day(date(2025, 1, 15))

    if day_data:
        print(f"Ngày: {day_data.solar_date}")
        print(f"Âm lịch: {day_data.lunar_date.day}/{day_data.lunar_date.month}")
        print(f"Can Chi: {day_data.can_chi.day.full}")
        print(f"28 Sao: {day_data.star28.name}")
        print(f"Việc tốt: {len(day_data.good_activities)}")
finally:
    scraper.close()
```

### Scrape từ xemngay.com (Nguồn phụ - Optional)

xemngay.com cung cấp thêm thông tin chi tiết về 28 Sao (ngũ hành, con vật). Sử dụng `XemNgayScraper`:

```python
from datetime import date
from src.scrapers.lichngaytot import XemNgayScraper

scraper = XemNgayScraper(delay_range=(1.0, 2.0))

try:
    xemngay_data = scraper.scrape_day(date(2025, 1, 15))

    if xemngay_data and xemngay_data.star28:
        print(f"28 Sao: {xemngay_data.star28.name}")
        print(f"Ngũ hành: {xemngay_data.star28.element}")  # Kim, Mộc, Thủy...
        print(f"Con vật: {xemngay_data.star28.animal}")    # Giao long, Hổ...
finally:
    scraper.close()
```

### Merge dữ liệu từ nhiều nguồn

Sử dụng `DataMerger` để kết hợp dữ liệu:

```python
from src.validators.data_merger import DataMerger

merger = DataMerger()

# Merge lichngaytot + xemngay
merged_data = merger.merge(
    lichngaytot_data=lichngaytot_day,
    xemngay_data=xemngay_day,      # Optional
    calculated_data=None           # Optional: từ lunar-javascript
)
```

## Export dữ liệu cho Mobile App

Sau khi scrape xong, export dữ liệu sang định dạng phù hợp cho mobile app:

```bash
# Export cơ bản
python scripts/export_for_app.py 2025

# Export với nén gzip (khuyến nghị cho mobile)
python scripts/export_for_app.py 2025 --gzip

# Export nhiều năm
python scripts/export_for_app.py 2024 2025 2026

# Export với output directory tùy chỉnh
python scripts/export_for_app.py 2025 --output ../mobile/assets/data --gzip
```

### Tham số export_for_app.py

| Tham số | Mô tả | Mặc định |
|---------|-------|----------|
| `years` | Năm cần export (có thể nhiều) | - |
| `--source-path` | Thư mục chứa dữ liệu nguồn | `data/export` |
| `--output`, `-o` | Thư mục output | `data/mobile` |
| `--gzip` | Tạo file nén .gz | false |

## Cấu trúc thư mục Output

```
scraper/data/
├── export/                          # Dữ liệu gốc từ scraper
│   ├── fengshui_2025.json          # Format compact (~305 KB)
│   ├── fengshui_2025.pretty.json   # Format đọc được (~465 KB)
│   └── day_YYYY-MM-DD.json         # File từng ngày (test)
│
└── mobile/                          # Dữ liệu cho mobile app
    ├── fengshui_2025.json          # Copy từ export
    └── fengshui_2025.json.gz       # Nén gzip (~20 KB)
```

## Cấu trúc dữ liệu JSON

Mỗi ngày trong file JSON chứa:

```json
{
  "solar_date": "2025-01-15",
  "lunar_date": {
    "day": 16,
    "month": 12,
    "year": 2024,
    "is_leap_month": false
  },
  "can_chi": {
    "day": {"can": "Giáp", "chi": "Tý"},
    "month": {"can": "Đinh", "chi": "Sửu"},
    "year": {"can": "Giáp", "chi": "Thìn"},
    "ngu_hanh": "Hải Trung Kim"
  },
  "star28": {
    "name": "Đẩu",
    "is_good": true,
    "meaning": "..."
  },
  "truc12": {
    "name": "Kiến",
    "is_good": true
  },
  "good_activities": ["Cưới hỏi", "Khai trương", ...],
  "bad_activities": ["Động thổ", "An táng", ...],
  "hoang_dao_hours": [...],
  "directions": [...],
  "good_stars": [...],
  "bad_stars": [...]
}
```

## Xử lý lỗi thường gặp

### 1. ModuleNotFoundError

```bash
# Đảm bảo đã kích hoạt virtual environment
source venv/bin/activate  # macOS/Linux
.\venv\Scripts\activate   # Windows

# Cài lại dependencies
pip install -r requirements.txt
```

### 2. Connection Error / Timeout

```bash
# Tăng delay giữa các request
python scripts/scrape_year.py 2025 --delay-min 2.0 --delay-max 4.0
```

### 3. SSL Certificate Error (macOS)

```bash
# Cài đặt certificates
/Applications/Python\ 3.11/Install\ Certificates.command
```

### 4. Permission Denied (Linux)

```bash
# Cấp quyền thực thi
chmod +x scripts/*.py
```

## Log files

Scraper tạo log file `scrape.log` trong thư mục hiện tại:

```bash
# Xem log real-time
tail -f scrape.log

# Tìm lỗi trong log
grep ERROR scrape.log
```

## Chạy trong Background

### macOS/Linux

```bash
# Chạy scraper trong background
nohup python scripts/scrape_year.py 2025 > scrape_output.log 2>&1 &

# Kiểm tra tiến trình
ps aux | grep scrape_year

# Xem output
tail -f scrape_output.log
```

### Windows (PowerShell)

```powershell
# Chạy scraper trong background
Start-Job -ScriptBlock { python scripts/scrape_year.py 2025 }

# Kiểm tra tiến trình
Get-Job

# Xem output
Receive-Job -Id <job_id>
```

## Thời gian ước tính

| Tác vụ | Thời gian |
|--------|-----------|
| Scrape 1 ngày | ~2 giây |
| Scrape 1 tháng (~30 ngày) | ~1.5 phút |
| Scrape 1 năm (365 ngày) | ~12-15 phút |

*Thời gian phụ thuộc vào delay setting và tốc độ mạng.*

## Lưu ý quan trọng

1. **Rate Limiting**: Không giảm delay quá thấp để tránh bị block IP
2. **Backup Data**: Backup file JSON trước khi chạy scrape lại
3. **Network**: Đảm bảo kết nối internet ổn định trong suốt quá trình scrape
4. **Disk Space**: Cần khoảng 1-2 MB cho mỗi năm dữ liệu

## Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra log file `scrape.log`
2. Đảm bảo đã cài đặt đúng dependencies
3. Thử chạy với `--single-day` để test trước
