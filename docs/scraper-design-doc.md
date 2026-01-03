# Tài Liệu Thiết Kế: Hệ Thống Scrape Data Lịch Vạn Niên

## Mục Lục

1. [Tổng Quan](#1-tổng-quan)
2. [Phân Tích Nguồn Data](#2-phân-tích-nguồn-data)
3. [Kiến Trúc Hệ Thống](#3-kiến-trúc-hệ-thống)
4. [Data Schema](#4-data-schema)
5. [Implementation Chi Tiết](#5-implementation-chi-tiết)
6. [Data Validation & Normalization](#6-data-validation--normalization)
7. [Scheduling & Deployment](#7-scheduling--deployment)
8. [Tích Hợp Với App](#8-tích-hợp-với-app)

---

## 1. Tổng Quan

### 1.1 Mục Tiêu

Xây dựng hệ thống scrape data từ các website lịch vạn niên Việt Nam để:

1. **Thu thập data phong thủy** không thể tính toán bằng thuật toán:
   - Việc nên làm / Không nên làm trong ngày
   - Phương hướng tốt xấu với rating
   - Sao tốt / Sao xấu (theo Ngọc Hạp Thông Thư)
   - Các kiêng kỵ đặc biệt (Bành Tổ Bách Kỵ, Thai thần, etc.)

2. **Cross-validate** với data tính toán từ `lunar-javascript`:
   - Ngày âm lịch
   - 28 Sao (Nhị thập bát tú)
   - 12 Trực
   - Can Chi ngày/tháng/năm

3. **Học thuật toán** bằng cách phân tích pattern từ data scrape:
   - Reverse-engineer rules cho việc nên/không nên
   - Hiểu cách tính phương hướng tốt xấu

### 1.2 Phạm Vi Scrape

| Data Type | Nguồn | Phương pháp | Tần suất |
|-----------|-------|-------------|----------|
| Việc nên/không nên | lichngaytot.com | Scrape | 1 lần/năm |
| Phương hướng | xemngay.com | Scrape | 1 lần/năm |
| Sao tốt/xấu | lichngaytot.com | Scrape | 1 lần/năm |
| Cross-validation | Cả 2 sources | Compare | Khi scrape |
| Âm lịch, Can Chi | lunar-javascript | Calculate | Real-time |

### 1.3 Quy Trình Tổng Quan

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCRAPER PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │ Scrape  │───►│ Parse   │───►│Normalize│───►│Validate │     │
│  │ HTML    │    │ Data    │    │ Data    │    │ Data    │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│       │                                             │          │
│       │                                             ▼          │
│       │         ┌─────────────────────────────────────┐       │
│       │         │         lunar-javascript            │       │
│       │         │   (Calculate for validation)        │       │
│       │         └─────────────────────────────────────┘       │
│       │                                             │          │
│       ▼                                             ▼          │
│  ┌─────────┐                                  ┌─────────┐     │
│  │ Raw     │                                  │Validated│     │
│  │ Storage │                                  │ Data    │     │
│  └─────────┘                                  └─────────┘     │
│                                                     │          │
│                                                     ▼          │
│                                               ┌─────────┐     │
│                                               │ Export  │     │
│                                               │ JSON/DB │     │
│                                               └─────────┘     │
│                                                     │          │
│                                                     ▼          │
│                                               ┌─────────┐     │
│                                               │ Mobile  │     │
│                                               │   App   │     │
│                                               └─────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Phân Tích Nguồn Data

### 2.1 Nguồn Chính: lichngaytot.com

#### 2.1.1 Thông Tin Website

| Thuộc tính | Giá trị |
|------------|---------|
| URL Pattern | `https://lichngaytot.com/xem-ngay-tot-xau-{DD}-{MM}-{YYYY}.html` |
| Rendering | Static HTML (SSR) |
| Anti-bot | Không phát hiện |
| Rate Limit | Không rõ, khuyến nghị 1-2s/request |
| Data Quality | ⭐⭐⭐⭐⭐ Rất đầy đủ |

#### 2.1.2 URL Examples

```
# Ngày 20/5/2024
https://lichngaytot.com/xem-ngay-tot-xau-20-05-2024.html

# Ngày 1/1/2025
https://lichngaytot.com/xem-ngay-tot-xau-01-01-2025.html
```

#### 2.1.3 Data Available

| Data Field | CSS Selector / Location | Example Value |
|------------|------------------------|---------------|
| Ngày âm lịch | `.lunar-date` hoặc text parsing | 12/4 Âm lịch |
| Can chi ngày | `.canchi-day` | Canh Ngọ |
| Can chi tháng | `.canchi-month` | Mậu Thìn |
| Can chi năm | `.canchi-year` | Giáp Thìn |
| 28 Sao | Section "Nhị thập bát tú" | Sao Vĩ |
| 12 Trực | Section "Trực" | Thành |
| Tiết khí | Section "Tiết" | Tiểu Mãn |
| **Việc nên làm** | Table/List "Nên" | Array of activities |
| **Việc không nên** | Table/List "Kỵ" | Array of activities |
| Giờ hoàng đạo | Table 12 giờ | 6 giờ tốt |
| **Hướng xuất hành** | Section "Hướng" | Hỷ thần, Tài thần |
| Sao tốt | List "Cát tinh" | Thiên đức, Nguyệt đức |
| Sao xấu | List "Hung tinh" | Tam nương, Tứ tuyệt |

#### 2.1.4 HTML Structure Analysis

```html
<!-- Typical page structure -->
<div class="main-content">
  <!-- Header info -->
  <div class="day-info">
    <h1>Xem ngày tốt xấu ngày 20/05/2024</h1>
    <div class="lunar-info">
      <span class="lunar-date">12/4 Âm lịch</span>
      <span class="year-name">Năm Giáp Thìn</span>
    </div>
  </div>
  
  <!-- Can Chi section -->
  <div class="canchi-section">
    <table>
      <tr><td>Ngày:</td><td>Canh Ngọ</td></tr>
      <tr><td>Tháng:</td><td>Mậu Thìn</td></tr>
      <tr><td>Năm:</td><td>Giáp Thìn</td></tr>
    </table>
  </div>
  
  <!-- Activities section - KEY DATA -->
  <div class="activities-section">
    <div class="good-activities">
      <h3>Việc nên làm</h3>
      <ul>
        <li>Cầu an</li>
        <li>Cầu tự</li>
        <li>Giải hạn</li>
        <li>Cúng tế thần linh</li>
        <!-- ... more items -->
      </ul>
    </div>
    
    <div class="bad-activities">
      <h3>Việc không nên làm</h3>
      <ul>
        <li>Cầu cúng giải oan</li>
        <li>Ma chay</li>
        <li>Lễ ăn hỏi</li>
        <!-- ... more items -->
      </ul>
    </div>
  </div>
  
  <!-- Directions section - KEY DATA -->
  <div class="directions-section">
    <h3>Hướng xuất hành</h3>
    <table>
      <tr><td>Hỷ thần:</td><td>Đông Nam</td></tr>
      <tr><td>Tài thần:</td><td>Chính Nam</td></tr>
      <tr><td>Hắc thần:</td><td>Đông Bắc</td></tr>
    </table>
  </div>
  
  <!-- Stars section -->
  <div class="stars-section">
    <div class="good-stars">
      <h4>Cát tinh (Sao tốt)</h4>
      <span>Thiên đức, Nguyệt đức, Lục hợp, Ngũ phủ</span>
    </div>
    <div class="bad-stars">
      <h4>Hung tinh (Sao xấu)</h4>
      <span>Tam nương, Hoang vu, Tứ hao</span>
    </div>
  </div>
</div>
```

### 2.2 Nguồn Phụ: xemngay.com

#### 2.2.1 Thông Tin Website

| Thuộc tính | Giá trị |
|------------|---------|
| URL Pattern | `https://xemngay.com/?blog=xngay&d={DDMMYYYY}` |
| Rendering | ASP.NET, Static HTML |
| Anti-bot | Không |
| Rate Limit | Không rõ |
| Data Quality | ⭐⭐⭐⭐ Chi tiết 28 sao |

#### 2.2.2 URL Examples

```
# Ngày 20/5/2024
https://xemngay.com/?blog=xngay&d=20052024

# Ngày 1/1/2025
https://xemngay.com/?blog=xngay&d=01012025
```

#### 2.2.3 Unique Data Points

- **28 Sao chi tiết**: Bao gồm con vật và ngũ hành
- **Hướng xuất hành**: 3 hướng (Tài lộc, Hỷ thần, Bất lợi)
- **Giờ tốt**: Format khác với lichngaytot

### 2.3 So Sánh 2 Nguồn

| Feature | lichngaytot.com | xemngay.com |
|---------|-----------------|-------------|
| Việc nên làm | ✅ Đầy đủ (~20 loại) | ✅ (~16 loại) |
| Việc không nên | ✅ Đầy đủ | ✅ |
| Hướng xuất hành | ✅ Hỷ/Tài/Hắc thần | ✅ 3 hướng |
| 28 Sao chi tiết | ⚠️ Tên + ý nghĩa | ✅ Tên + Hành + Con vật |
| Bành tổ bách kỵ | ✅ | ❌ |
| Thai thần | ✅ | ❌ |
| HTML Structure | ✅ Clean, Bootstrap | ⚠️ ASP.NET, phức tạp hơn |

**Kết luận**: Scrape **lichngaytot.com** làm nguồn chính, **xemngay.com** để cross-validate và bổ sung thông tin 28 sao chi tiết.

---

## 3. Kiến Trúc Hệ Thống

### 3.1 Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    SCRAPER SYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│  Language: Python 3.11+                                     │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   HTTP Client   │  │   HTML Parser   │                  │
│  │    requests     │  │ BeautifulSoup4  │                  │
│  │    httpx        │  │     lxml        │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Validation    │  │    Storage      │                  │
│  │lunar-javascript │  │    SQLite       │                  │
│  │   (via Node)    │  │     JSON        │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Scheduling    │  │    Export       │                  │
│  │     cron        │  │  JSON bundle    │                  │
│  │   APScheduler   │  │  SQLite file    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Project Structure

```
scraper/
├── src/
│   ├── __init__.py
│   ├── config.py                 # Configuration
│   ├── main.py                   # Entry point
│   │
│   ├── scrapers/                 # Scraper modules
│   │   ├── __init__.py
│   │   ├── base.py              # Base scraper class
│   │   ├── lichngaytot.py       # lichngaytot.com scraper
│   │   └── xemngay.py           # xemngay.com scraper
│   │
│   ├── parsers/                  # HTML parsers
│   │   ├── __init__.py
│   │   ├── lichngaytot_parser.py
│   │   └── xemngay_parser.py
│   │
│   ├── models/                   # Data models
│   │   ├── __init__.py
│   │   ├── day_data.py
│   │   ├── activities.py
│   │   └── directions.py
│   │
│   ├── validators/               # Data validation
│   │   ├── __init__.py
│   │   ├── lunar_validator.py   # Validate với lunar-javascript
│   │   └── cross_validator.py   # Cross-validate giữa sources
│   │
│   ├── storage/                  # Data storage
│   │   ├── __init__.py
│   │   ├── sqlite_storage.py
│   │   └── json_exporter.py
│   │
│   └── utils/                    # Utilities
│       ├── __init__.py
│       ├── date_utils.py
│       ├── text_normalizer.py
│       └── rate_limiter.py
│
├── data/                         # Output data
│   ├── raw/                      # Raw scraped HTML
│   ├── processed/                # Processed JSON
│   ├── validated/                # Validated data
│   └── export/                   # Final export
│       ├── fengshui_2024.json
│       ├── fengshui_2025.json
│       └── fengshui.db
│
├── scripts/
│   ├── scrape_year.py           # Scrape 1 năm
│   ├── validate_data.py         # Validate existing data
│   └── export_for_app.py        # Export cho mobile app
│
├── tests/
│   ├── test_scrapers.py
│   ├── test_parsers.py
│   └── test_validators.py
│
├── requirements.txt
├── Dockerfile
└── README.md
```

### 3.3 Dependencies

```txt
# requirements.txt

# HTTP
requests==2.31.0
httpx==0.27.0

# HTML Parsing
beautifulsoup4==4.12.3
lxml==5.1.0

# Data Processing
pydantic==2.6.0

# Database
sqlalchemy==2.0.25

# Scheduling
apscheduler==3.10.4

# Utilities
python-dateutil==2.8.2
tenacity==8.2.3  # Retry logic

# Testing
pytest==8.0.0
pytest-asyncio==0.23.0

# Validation (Node.js bridge)
nodejs-bin==18.0.0  # Optional: for lunar-javascript
```

---

## 4. Data Schema

### 4.1 Core Data Models

```python
# src/models/day_data.py

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from enum import Enum

class ActivityCategory(str, Enum):
    SPIRITUAL = "spiritual"       # Cầu an, cúng tế
    CONSTRUCTION = "construction" # Động thổ, xây dựng
    BUSINESS = "business"         # Khai trương, ký kết
    TRAVEL = "travel"             # Xuất hành, di chuyển
    FAMILY = "family"             # Cưới hỏi, ăn hỏi
    HEALTH = "health"             # Khám bệnh, châm cứu
    FUNERAL = "funeral"           # Tang lễ, an táng
    AGRICULTURE = "agriculture"   # Trồng trọt, chăn nuôi
    OTHER = "other"

class Activity(BaseModel):
    """Một hoạt động nên/không nên làm"""
    id: str                           # unique id: "cau_an", "dong_tho"
    name: str                         # Tên tiếng Việt: "Cầu an"
    name_normalized: str              # Tên chuẩn hóa: "cau_an"
    category: ActivityCategory
    description: Optional[str] = None
    
class Direction(BaseModel):
    """Phương hướng với rating"""
    name: str                         # "Đông - Đông Bắc"
    name_short: str                   # "ENE"
    degrees_start: float              # 67.5
    degrees_end: float                # 82.5
    rating: int = Field(ge=1, le=5)   # 1-5 sao
    type: Optional[str] = None        # "tai_loc", "hy_than", "hac_than"

class Star(BaseModel):
    """Sao tốt/xấu trong ngày"""
    name: str                         # "Thiên đức"
    name_han: Optional[str] = None    # "天德"
    is_good: bool                     # True = cát tinh, False = hung tinh
    meaning: Optional[str] = None

class DayFengshuiData(BaseModel):
    """Data phong thủy cho một ngày"""
    # Identity
    solar_date: date
    lunar_day: int
    lunar_month: int
    lunar_year: int
    is_leap_month: bool = False
    
    # Can Chi (for validation)
    day_gan_zhi: str                  # "Canh Ngọ"
    month_gan_zhi: str                # "Mậu Thìn"
    year_gan_zhi: str                 # "Giáp Thìn"
    
    # 28 Sao & 12 Trực (for validation)
    star_28: str                      # "Vĩ"
    star_28_element: Optional[str]    # "Hỏa"
    star_28_animal: Optional[str]     # "Hổ"
    truc_12: str                      # "Thành"
    
    # Tiết khí
    tiet_khi: Optional[str] = None    # "Tiểu Mãn"
    
    # KEY DATA: Activities
    good_activities: List[Activity]
    bad_activities: List[Activity]
    
    # KEY DATA: Directions
    directions: List[Direction]
    xi_direction: Optional[str] = None      # Hỷ thần
    cai_direction: Optional[str] = None     # Tài thần
    hac_direction: Optional[str] = None     # Hắc thần
    
    # KEY DATA: Stars
    good_stars: List[Star]
    bad_stars: List[Star]
    
    # Special notes
    special_notes: List[str] = []     # Tam nương, Nguyệt kỵ, etc.
    
    # Metadata
    source: str                       # "lichngaytot.com"
    scraped_at: str                   # ISO timestamp
    validated: bool = False
    validation_errors: List[str] = []

class YearFengshuiData(BaseModel):
    """Data phong thủy cho cả năm"""
    year: int
    days: List[DayFengshuiData]
    
    # Statistics
    total_days: int
    validated_days: int
    validation_errors_count: int
    
    # Metadata
    sources: List[str]
    generated_at: str
```

### 4.2 Activity Master List

```python
# src/models/activities.py

"""
Master list của tất cả activities có thể xuất hiện
Dùng để normalize data từ các nguồn khác nhau
"""

ACTIVITIES_MASTER = {
    # SPIRITUAL
    "cau_an": {
        "name": "Cầu an",
        "aliases": ["cầu an", "cau an", "cầu bình an"],
        "category": "spiritual"
    },
    "cau_tu": {
        "name": "Cầu tự",
        "aliases": ["cầu tự", "cau tu", "cầu con"],
        "category": "spiritual"
    },
    "giai_han": {
        "name": "Giải hạn",
        "aliases": ["giải hạn", "giai han", "giải hạn sao"],
        "category": "spiritual"
    },
    "cung_te": {
        "name": "Cúng tế thần linh",
        "aliases": ["cúng tế", "cung te", "tế lễ", "cúng bái"],
        "category": "spiritual"
    },
    
    # CONSTRUCTION
    "dong_tho": {
        "name": "Động thổ",
        "aliases": ["động thổ", "dong tho", "khởi công", "đào móng"],
        "category": "construction"
    },
    "xay_nha": {
        "name": "Xây nhà",
        "aliases": ["xây nhà", "xay nha", "cất nhà", "xây dựng"],
        "category": "construction"
    },
    "lap_ao_ho": {
        "name": "Lắp ao hồ",
        "aliases": ["lắp ao", "lap ao", "đào ao", "đào hồ"],
        "category": "construction"
    },
    "sua_chua": {
        "name": "Sửa chữa nhà",
        "aliases": ["sửa chữa", "sua chua", "sửa nhà", "tu sửa"],
        "category": "construction"
    },
    
    # BUSINESS
    "khai_truong": {
        "name": "Khai trương",
        "aliases": ["khai trương", "khai truong", "khai nghiệp", "mở hàng"],
        "category": "business"
    },
    "ky_hop_dong": {
        "name": "Ký hợp đồng",
        "aliases": ["ký hợp đồng", "ky hop dong", "ký kết", "giao kèo"],
        "category": "business"
    },
    "giao_dich": {
        "name": "Giao dịch",
        "aliases": ["giao dịch", "giao dich", "mua bán", "buôn bán"],
        "category": "business"
    },
    "tuyen_dung": {
        "name": "Tuyển dụng nhân sự",
        "aliases": ["tuyển dụng", "tuyen dung", "nhận người", "thuê người"],
        "category": "business"
    },
    
    # TRAVEL
    "xuat_hanh": {
        "name": "Xuất hành",
        "aliases": ["xuất hành", "xuat hanh", "ra đi", "đi xa"],
        "category": "travel"
    },
    "di_chuyen": {
        "name": "Di chuyển",
        "aliases": ["di chuyển", "di chuyen", "đi lại"],
        "category": "travel"
    },
    
    # FAMILY
    "cuoi_hoi": {
        "name": "Cưới hỏi",
        "aliases": ["cưới hỏi", "cuoi hoi", "kết hôn", "thành hôn", "cưới gả"],
        "category": "family"
    },
    "an_hoi": {
        "name": "Ăn hỏi",
        "aliases": ["ăn hỏi", "an hoi", "lễ ăn hỏi", "đính hôn"],
        "category": "family"
    },
    "nhap_trach": {
        "name": "Nhập trạch",
        "aliases": ["nhập trạch", "nhap trach", "về nhà mới", "dọn nhà"],
        "category": "family"
    },
    
    # HEALTH
    "kham_benh": {
        "name": "Khám bệnh",
        "aliases": ["khám bệnh", "kham benh", "chữa bệnh", "trị bệnh"],
        "category": "health"
    },
    "cham_cuu": {
        "name": "Châm cứu",
        "aliases": ["châm cứu", "cham cuu"],
        "category": "health"
    },
    
    # FUNERAL
    "an_tang": {
        "name": "An táng",
        "aliases": ["an táng", "an tang", "chôn cất", "hạ huyệt"],
        "category": "funeral"
    },
    "cai_tang": {
        "name": "Cải táng",
        "aliases": ["cải táng", "cai tang", "bốc mộ"],
        "category": "funeral"
    },
    "ma_chay": {
        "name": "Ma chay",
        "aliases": ["ma chay", "tang lễ", "đám ma"],
        "category": "funeral"
    },
    
    # AGRICULTURE
    "trong_trot": {
        "name": "Trồng trọt",
        "aliases": ["trồng trọt", "trong trot", "gieo hạt", "cấy cày"],
        "category": "agriculture"
    },
    "chan_nuoi": {
        "name": "Chăn nuôi",
        "aliases": ["chăn nuôi", "chan nuoi", "nuôi gia súc"],
        "category": "agriculture"
    },
    
    # Add more as discovered during scraping...
}

def normalize_activity(raw_name: str) -> Optional[str]:
    """
    Normalize tên activity từ scraped text về activity_id
    Returns None nếu không tìm thấy match
    """
    raw_lower = raw_name.lower().strip()
    
    for activity_id, data in ACTIVITIES_MASTER.items():
        if raw_lower in [a.lower() for a in data["aliases"]]:
            return activity_id
    
    # Fuzzy match có thể thêm ở đây
    return None
```

### 4.3 SQLite Schema

```sql
-- schema.sql

-- Bảng chính: Data phong thủy theo ngày
CREATE TABLE fengshui_daily (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    solar_date TEXT NOT NULL UNIQUE,  -- 'YYYY-MM-DD'
    
    -- Lunar info (for validation)
    lunar_day INTEGER NOT NULL,
    lunar_month INTEGER NOT NULL,
    lunar_year INTEGER NOT NULL,
    is_leap_month INTEGER DEFAULT 0,
    
    -- Can Chi
    day_gan_zhi TEXT NOT NULL,
    month_gan_zhi TEXT NOT NULL,
    year_gan_zhi TEXT NOT NULL,
    
    -- 28 Sao & 12 Trực
    star_28 TEXT NOT NULL,
    star_28_element TEXT,
    star_28_animal TEXT,
    truc_12 TEXT NOT NULL,
    
    -- Tiết khí
    tiet_khi TEXT,
    
    -- Directions (JSON)
    xi_direction TEXT,      -- Hỷ thần
    cai_direction TEXT,     -- Tài thần
    hac_direction TEXT,     -- Hắc thần
    directions_json TEXT,   -- Full directions with ratings
    
    -- Special notes (JSON array)
    special_notes_json TEXT,
    
    -- Metadata
    source TEXT NOT NULL,
    scraped_at TEXT NOT NULL,
    validated INTEGER DEFAULT 0,
    validation_errors_json TEXT,
    
    -- Indexes
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fengshui_solar_date ON fengshui_daily(solar_date);
CREATE INDEX idx_fengshui_lunar ON fengshui_daily(lunar_year, lunar_month, lunar_day);

-- Bảng activities: Việc nên/không nên làm
CREATE TABLE activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fengshui_id INTEGER NOT NULL,
    activity_id TEXT NOT NULL,        -- normalized id: "cau_an"
    activity_name TEXT NOT NULL,      -- display name: "Cầu an"
    activity_type TEXT NOT NULL,      -- "good" or "bad"
    category TEXT,                    -- "spiritual", "business", etc.
    raw_text TEXT,                    -- original scraped text
    
    FOREIGN KEY (fengshui_id) REFERENCES fengshui_daily(id)
);

CREATE INDEX idx_activities_fengshui ON activities(fengshui_id);
CREATE INDEX idx_activities_type ON activities(activity_type);

-- Bảng stars: Sao tốt/xấu
CREATE TABLE stars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fengshui_id INTEGER NOT NULL,
    star_name TEXT NOT NULL,
    star_name_han TEXT,
    is_good INTEGER NOT NULL,         -- 1 = good, 0 = bad
    meaning TEXT,
    
    FOREIGN KEY (fengshui_id) REFERENCES fengshui_daily(id)
);

CREATE INDEX idx_stars_fengshui ON stars(fengshui_id);

-- Bảng master activities (reference)
CREATE TABLE activity_master (
    id TEXT PRIMARY KEY,              -- "cau_an"
    name TEXT NOT NULL,               -- "Cầu an"
    category TEXT NOT NULL,
    aliases_json TEXT                 -- JSON array of aliases
);

-- View: Full day data
CREATE VIEW v_day_full AS
SELECT 
    f.*,
    GROUP_CONCAT(CASE WHEN a.activity_type = 'good' THEN a.activity_name END) as good_activities,
    GROUP_CONCAT(CASE WHEN a.activity_type = 'bad' THEN a.activity_name END) as bad_activities,
    GROUP_CONCAT(CASE WHEN s.is_good = 1 THEN s.star_name END) as good_stars,
    GROUP_CONCAT(CASE WHEN s.is_good = 0 THEN s.star_name END) as bad_stars
FROM fengshui_daily f
LEFT JOIN activities a ON f.id = a.fengshui_id
LEFT JOIN stars s ON f.id = s.fengshui_id
GROUP BY f.id;
```

---

## 5. Implementation Chi Tiết

### 5.1 Base Scraper Class

```python
# src/scrapers/base.py

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from datetime import date
import time
import logging
import requests
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

class BaseScraper(ABC):
    """Base class cho tất cả scrapers"""
    
    def __init__(self, rate_limit: float = 1.5):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        })
        self.rate_limit = rate_limit
        self.last_request_time = 0
    
    @abstractmethod
    def get_url(self, target_date: date) -> str:
        """Build URL for specific date"""
        pass
    
    @abstractmethod
    def parse_response(self, html: str, target_date: date) -> Dict[str, Any]:
        """Parse HTML response into structured data"""
        pass
    
    @property
    @abstractmethod
    def source_name(self) -> str:
        """Name of the source website"""
        pass
    
    def _rate_limit_wait(self):
        """Ensure rate limiting between requests"""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.rate_limit:
            time.sleep(self.rate_limit - elapsed)
        self.last_request_time = time.time()
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def fetch_html(self, url: str) -> str:
        """Fetch HTML with retry logic"""
        self._rate_limit_wait()
        
        logger.info(f"Fetching: {url}")
        response = self.session.get(url, timeout=30)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        return response.text
    
    def scrape_date(self, target_date: date) -> Optional[Dict[str, Any]]:
        """Scrape data for a specific date"""
        try:
            url = self.get_url(target_date)
            html = self.fetch_html(url)
            data = self.parse_response(html, target_date)
            
            # Add metadata
            data['source'] = self.source_name
            data['scraped_at'] = datetime.now().isoformat()
            data['solar_date'] = target_date.isoformat()
            
            return data
            
        except Exception as e:
            logger.error(f"Error scraping {target_date}: {e}")
            return None
    
    def scrape_date_range(self, start_date: date, end_date: date) -> list:
        """Scrape multiple dates"""
        results = []
        current = start_date
        
        while current <= end_date:
            data = self.scrape_date(current)
            if data:
                results.append(data)
            current += timedelta(days=1)
        
        return results
    
    def scrape_year(self, year: int) -> list:
        """Scrape entire year"""
        start = date(year, 1, 1)
        end = date(year, 12, 31)
        return self.scrape_date_range(start, end)
```

### 5.2 LichNgayTot Scraper

```python
# src/scrapers/lichngaytot.py

from datetime import date
from typing import Dict, Any, List
from bs4 import BeautifulSoup
import re
import logging

from .base import BaseScraper
from ..models.activities import normalize_activity, ACTIVITIES_MASTER

logger = logging.getLogger(__name__)

class LichNgayTotScraper(BaseScraper):
    """Scraper for lichngaytot.com"""
    
    BASE_URL = "https://lichngaytot.com"
    
    @property
    def source_name(self) -> str:
        return "lichngaytot.com"
    
    def get_url(self, target_date: date) -> str:
        return f"{self.BASE_URL}/xem-ngay-tot-xau-{target_date.strftime('%d-%m-%Y')}.html"
    
    def parse_response(self, html: str, target_date: date) -> Dict[str, Any]:
        soup = BeautifulSoup(html, 'lxml')
        
        data = {
            'solar_date': target_date.isoformat(),
        }
        
        # Parse lunar date
        data.update(self._parse_lunar_info(soup))
        
        # Parse Can Chi
        data.update(self._parse_can_chi(soup))
        
        # Parse 28 Sao & 12 Trực
        data.update(self._parse_star_truc(soup))
        
        # Parse activities (KEY DATA)
        data['good_activities'] = self._parse_activities(soup, 'good')
        data['bad_activities'] = self._parse_activities(soup, 'bad')
        
        # Parse directions (KEY DATA)
        data.update(self._parse_directions(soup))
        
        # Parse stars
        data['good_stars'] = self._parse_stars(soup, 'good')
        data['bad_stars'] = self._parse_stars(soup, 'bad')
        
        # Parse special notes
        data['special_notes'] = self._parse_special_notes(soup)
        
        return data
    
    def _parse_lunar_info(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse thông tin âm lịch"""
        result = {}
        
        # Tìm section chứa thông tin âm lịch
        lunar_section = soup.find('div', class_='lunar-info') or \
                       soup.find(text=re.compile(r'Âm lịch', re.I))
        
        if lunar_section:
            # Extract lunar date: "12/4 Âm lịch" -> day=12, month=4
            match = re.search(r'(\d{1,2})/(\d{1,2})\s*Âm', str(lunar_section))
            if match:
                result['lunar_day'] = int(match.group(1))
                result['lunar_month'] = int(match.group(2))
        
        # Extract year name for lunar year
        year_match = re.search(r'[Nn]ăm\s+([^\s,]+\s+[^\s,]+)', soup.get_text())
        if year_match:
            result['year_name'] = year_match.group(1)
        
        return result
    
    def _parse_can_chi(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse Can Chi ngày/tháng/năm"""
        result = {}
        
        text = soup.get_text()
        
        # Ngày
        day_match = re.search(r'[Nn]gày[:\s]+([A-Za-zÀ-ỹ]+\s+[A-Za-zÀ-ỹ]+)', text)
        if day_match:
            result['day_gan_zhi'] = day_match.group(1).strip()
        
        # Tháng
        month_match = re.search(r'[Tt]háng[:\s]+([A-Za-zÀ-ỹ]+\s+[A-Za-zÀ-ỹ]+)', text)
        if month_match:
            result['month_gan_zhi'] = month_match.group(1).strip()
        
        # Năm
        year_match = re.search(r'[Nn]ăm[:\s]+([A-Za-zÀ-ỹ]+\s+[A-Za-zÀ-ỹ]+)', text)
        if year_match:
            result['year_gan_zhi'] = year_match.group(1).strip()
        
        return result
    
    def _parse_star_truc(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse 28 Sao và 12 Trực"""
        result = {}
        text = soup.get_text()
        
        # 28 Sao
        star_match = re.search(r'[Ss]ao\s+([A-Za-zÀ-ỹ]+)', text)
        if star_match:
            result['star_28'] = star_match.group(1).strip()
        
        # 12 Trực
        truc_match = re.search(r'[Tt]rực[:\s]+([A-Za-zÀ-ỹ]+)', text)
        if truc_match:
            result['truc_12'] = truc_match.group(1).strip()
        
        return result
    
    def _parse_activities(self, soup: BeautifulSoup, activity_type: str) -> List[Dict]:
        """Parse việc nên làm hoặc không nên làm"""
        activities = []
        
        # Tìm section tương ứng
        if activity_type == 'good':
            section = soup.find(text=re.compile(r'[Nn]ên\s+làm|[Vv]iệc\s+nên', re.I))
            patterns = ['nên', 'tốt cho', 'thuận lợi']
        else:
            section = soup.find(text=re.compile(r'[Kk]hông\s+nên|[Kk]ỵ|[Kk]iêng', re.I))
            patterns = ['không nên', 'kỵ', 'kiêng', 'tránh']
        
        if section:
            # Tìm parent container
            container = section.find_parent(['div', 'section', 'td'])
            if container:
                # Tìm tất cả list items
                items = container.find_all(['li', 'span', 'p'])
                
                for item in items:
                    text = item.get_text().strip()
                    if text and len(text) > 2:
                        # Normalize activity
                        activity_id = normalize_activity(text)
                        
                        activities.append({
                            'raw_text': text,
                            'activity_id': activity_id,
                            'activity_name': ACTIVITIES_MASTER.get(activity_id, {}).get('name', text) if activity_id else text,
                            'category': ACTIVITIES_MASTER.get(activity_id, {}).get('category', 'other') if activity_id else 'other',
                        })
        
        return activities
    
    def _parse_directions(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse hướng xuất hành"""
        result = {
            'directions': [],
            'xi_direction': None,
            'cai_direction': None,
            'hac_direction': None,
        }
        
        text = soup.get_text()
        
        # Hỷ thần
        xi_match = re.search(r'[Hh]ỷ\s+thần[:\s]+([A-Za-zÀ-ỹ\s]+?)(?=[,\.\n]|Tài|Hắc|$)', text)
        if xi_match:
            result['xi_direction'] = xi_match.group(1).strip()
        
        # Tài thần
        cai_match = re.search(r'[Tt]ài\s+thần[:\s]+([A-Za-zÀ-ỹ\s]+?)(?=[,\.\n]|Hỷ|Hắc|$)', text)
        if cai_match:
            result['cai_direction'] = cai_match.group(1).strip()
        
        # Hắc thần (hướng xấu)
        hac_match = re.search(r'[Hh]ắc\s+thần[:\s]+([A-Za-zÀ-ỹ\s]+?)(?=[,\.\n]|Hỷ|Tài|$)', text)
        if hac_match:
            result['hac_direction'] = hac_match.group(1).strip()
        
        return result
    
    def _parse_stars(self, soup: BeautifulSoup, star_type: str) -> List[Dict]:
        """Parse sao tốt/xấu"""
        stars = []
        
        if star_type == 'good':
            pattern = r'[Cc]át\s+tinh|[Ss]ao\s+tốt'
        else:
            pattern = r'[Hh]ung\s+tinh|[Ss]ao\s+xấu'
        
        section = soup.find(text=re.compile(pattern, re.I))
        if section:
            container = section.find_parent(['div', 'td', 'p'])
            if container:
                # Extract star names (usually comma-separated)
                text = container.get_text()
                # Remove the header
                text = re.sub(pattern, '', text, flags=re.I)
                
                # Split by common separators
                star_names = re.split(r'[,，、\n]', text)
                
                for name in star_names:
                    name = name.strip()
                    if name and len(name) > 1:
                        stars.append({
                            'name': name,
                            'is_good': star_type == 'good'
                        })
        
        return stars
    
    def _parse_special_notes(self, soup: BeautifulSoup) -> List[str]:
        """Parse các lưu ý đặc biệt (Tam nương, Nguyệt kỵ, etc.)"""
        notes = []
        text = soup.get_text()
        
        special_patterns = [
            (r'[Tt]am\s+nương', 'Ngày Tam nương'),
            (r'[Nn]guyệt\s+kỵ', 'Ngày Nguyệt kỵ'),
            (r'[Dd]ương\s+công\s+kỵ', 'Ngày Dương công kỵ'),
            (r'[Tt]ứ\s+ly', 'Ngày Tứ ly'),
            (r'[Tt]ứ\s+tuyệt', 'Ngày Tứ tuyệt'),
        ]
        
        for pattern, note in special_patterns:
            if re.search(pattern, text):
                notes.append(note)
        
        return notes
```

### 5.3 XemNgay Scraper

```python
# src/scrapers/xemngay.py

from datetime import date
from typing import Dict, Any
from bs4 import BeautifulSoup
import re

from .base import BaseScraper

class XemNgayScraper(BaseScraper):
    """Scraper for xemngay.com - used for cross-validation and 28-star details"""
    
    BASE_URL = "https://xemngay.com"
    
    @property
    def source_name(self) -> str:
        return "xemngay.com"
    
    def get_url(self, target_date: date) -> str:
        return f"{self.BASE_URL}/?blog=xngay&d={target_date.strftime('%d%m%Y')}"
    
    def parse_response(self, html: str, target_date: date) -> Dict[str, Any]:
        soup = BeautifulSoup(html, 'lxml')
        
        data = {
            'solar_date': target_date.isoformat(),
        }
        
        # Parse lunar info
        data.update(self._parse_lunar_info(soup))
        
        # Parse Can Chi
        data.update(self._parse_can_chi(soup))
        
        # Parse 28 Sao với chi tiết (con vật, ngũ hành)
        data.update(self._parse_star_28_detailed(soup))
        
        # Parse 12 Trực
        data.update(self._parse_truc_12(soup))
        
        # Parse directions
        data.update(self._parse_directions(soup))
        
        # Parse activities
        data['good_activities'] = self._parse_activities(soup, 'good')
        data['bad_activities'] = self._parse_activities(soup, 'bad')
        
        return data
    
    def _parse_star_28_detailed(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse 28 Sao với thông tin chi tiết từ xemngay.com"""
        result = {
            'star_28': None,
            'star_28_element': None,
            'star_28_animal': None,
        }
        
        text = soup.get_text()
        
        # Pattern: "Sao Giác (hành Thuỷ, con vật Giao long)"
        star_match = re.search(
            r'[Ss]ao\s+([A-Za-zÀ-ỹ]+)\s*\(?.*?hành\s+([A-Za-zÀ-ỹ]+).*?con\s+vật\s+([A-Za-zÀ-ỹ\s]+)\)?',
            text
        )
        
        if star_match:
            result['star_28'] = star_match.group(1).strip()
            result['star_28_element'] = star_match.group(2).strip()
            result['star_28_animal'] = star_match.group(3).strip()
        else:
            # Fallback: just get star name
            simple_match = re.search(r'[Ss]ao\s+([A-Za-zÀ-ỹ]+)', text)
            if simple_match:
                result['star_28'] = simple_match.group(1).strip()
        
        return result
    
    def _parse_lunar_info(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse lunar date info"""
        result = {}
        text = soup.get_text()
        
        match = re.search(r'[Nn]gày\s+âm\s+lịch[:\s]+(\d{1,2})/(\d{1,2})', text)
        if match:
            result['lunar_day'] = int(match.group(1))
            result['lunar_month'] = int(match.group(2))
        
        return result
    
    def _parse_can_chi(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse Can Chi"""
        result = {}
        text = soup.get_text()
        
        patterns = [
            (r'ngày[:\s]+([A-Za-zÀ-ỹ]+\s+[A-Za-zÀ-ỹ]+)', 'day_gan_zhi'),
            (r'tháng[:\s]+([A-Za-zÀ-ỹ]+\s+[A-Za-zÀ-ỹ]+)', 'month_gan_zhi'),
            (r'năm[:\s]+([A-Za-zÀ-ỹ]+\s+[A-Za-zÀ-ỹ]+)', 'year_gan_zhi'),
        ]
        
        for pattern, key in patterns:
            match = re.search(pattern, text, re.I)
            if match:
                result[key] = match.group(1).strip()
        
        return result
    
    def _parse_truc_12(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse 12 Trực"""
        text = soup.get_text()
        match = re.search(r'[Tt]rực[:\s]+([A-Za-zÀ-ỹ]+)', text)
        
        return {'truc_12': match.group(1).strip() if match else None}
    
    def _parse_directions(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse hướng xuất hành từ xemngay.com"""
        result = {
            'directions': [],
        }
        
        text = soup.get_text()
        
        # xemngay.com format: "Hướng tài lộc: Đông Nam"
        patterns = [
            (r'[Tt]ài\s+lộc[:\s]+([A-Za-zÀ-ỹ\s]+?)(?=[,\.\n]|Hướng|$)', 'tai_loc'),
            (r'[Hh]ỷ\s+thần[:\s]+([A-Za-zÀ-ỹ\s]+?)(?=[,\.\n]|Hướng|$)', 'hy_than'),
            (r'[Bb]ất\s+lợi[:\s]+([A-Za-zÀ-ỹ\s]+?)(?=[,\.\n]|Hướng|$)', 'bat_loi'),
        ]
        
        for pattern, dir_type in patterns:
            match = re.search(pattern, text)
            if match:
                result[f'{dir_type}_direction'] = match.group(1).strip()
        
        return result
    
    def _parse_activities(self, soup: BeautifulSoup, activity_type: str) -> list:
        """Parse activities - simplified for cross-validation"""
        activities = []
        text = soup.get_text()
        
        if activity_type == 'good':
            section_match = re.search(r'[Nn]ên[:\s]+(.+?)(?=[Kk]hông\s+nên|[Kk]ỵ|$)', text, re.S)
        else:
            section_match = re.search(r'[Kk]hông\s+nên|[Kk]ỵ[:\s]+(.+?)(?=$)', text, re.S)
        
        if section_match:
            items = section_match.group(1).split(',')
            for item in items:
                item = item.strip()
                if item and len(item) > 2:
                    activities.append({'raw_text': item})
        
        return activities
```

### 5.4 Data Validator

```python
# src/validators/lunar_validator.py

import subprocess
import json
from datetime import date
from typing import Dict, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class LunarValidator:
    """Validate scraped data against lunar-javascript calculations"""
    
    def __init__(self):
        # Check if Node.js is available
        self._check_node()
    
    def _check_node(self):
        """Verify Node.js and lunar-javascript are available"""
        try:
            result = subprocess.run(
                ['node', '-e', 'require("lunar-javascript")'],
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                logger.warning("lunar-javascript not installed. Run: npm install lunar-javascript")
        except FileNotFoundError:
            logger.warning("Node.js not found. Validation will be limited.")
    
    def calculate_lunar_data(self, solar_date: date) -> Dict[str, Any]:
        """Calculate lunar data using lunar-javascript"""
        
        js_code = f'''
        const {{ Solar, Lunar }} = require('lunar-javascript');
        const solar = Solar.fromYmd({solar_date.year}, {solar_date.month}, {solar_date.day});
        const lunar = solar.getLunar();
        
        const result = {{
            lunar_day: lunar.getDay(),
            lunar_month: lunar.getMonth(),
            lunar_year: lunar.getYear(),
            is_leap_month: lunar.getMonth() !== lunar.getMonthInChinese() ? 1 : 0,
            day_gan_zhi: lunar.getDayInGanZhi(),
            month_gan_zhi: lunar.getMonthInGanZhi(),
            year_gan_zhi: lunar.getYearInGanZhi(),
            star_28: lunar.getXiu(),
            truc_12: lunar.getZhi(),
            tiet_khi: lunar.getJieQi() || null,
            day_yi: lunar.getDayYi(),
            day_ji: lunar.getDayJi(),
        }};
        
        console.log(JSON.stringify(result));
        '''
        
        try:
            result = subprocess.run(
                ['node', '-e', js_code],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                return json.loads(result.stdout)
            else:
                logger.error(f"Node.js error: {result.stderr}")
                return {}
                
        except Exception as e:
            logger.error(f"Error running lunar-javascript: {e}")
            return {}
    
    def validate(self, scraped_data: Dict[str, Any]) -> Tuple[bool, list]:
        """
        Validate scraped data against calculated data
        Returns: (is_valid, list_of_errors)
        """
        solar_date = date.fromisoformat(scraped_data['solar_date'])
        calculated = self.calculate_lunar_data(solar_date)
        
        if not calculated:
            return True, ["Could not calculate lunar data for validation"]
        
        errors = []
        
        # Validate lunar date
        if scraped_data.get('lunar_day') != calculated.get('lunar_day'):
            errors.append(f"Lunar day mismatch: scraped={scraped_data.get('lunar_day')}, calculated={calculated.get('lunar_day')}")
        
        if scraped_data.get('lunar_month') != calculated.get('lunar_month'):
            errors.append(f"Lunar month mismatch: scraped={scraped_data.get('lunar_month')}, calculated={calculated.get('lunar_month')}")
        
        # Validate Can Chi (allowing for minor variations in format)
        if not self._compare_gan_zhi(scraped_data.get('day_gan_zhi'), calculated.get('day_gan_zhi')):
            errors.append(f"Day Can Chi mismatch: scraped={scraped_data.get('day_gan_zhi')}, calculated={calculated.get('day_gan_zhi')}")
        
        # Validate 28 Sao
        if not self._compare_star(scraped_data.get('star_28'), calculated.get('star_28')):
            errors.append(f"Star 28 mismatch: scraped={scraped_data.get('star_28')}, calculated={calculated.get('star_28')}")
        
        # Validate 12 Trực
        if not self._compare_truc(scraped_data.get('truc_12'), calculated.get('truc_12')):
            errors.append(f"Truc 12 mismatch: scraped={scraped_data.get('truc_12')}, calculated={calculated.get('truc_12')}")
        
        is_valid = len(errors) == 0
        return is_valid, errors
    
    def _compare_gan_zhi(self, scraped: str, calculated: str) -> bool:
        """Compare Can Chi with normalization"""
        if not scraped or not calculated:
            return True  # Skip if missing
        
        # Normalize: remove spaces, convert to lowercase
        s = scraped.lower().replace(' ', '')
        c = calculated.lower().replace(' ', '')
        
        return s == c
    
    def _compare_star(self, scraped: str, calculated: str) -> bool:
        """Compare 28 Sao names"""
        if not scraped or not calculated:
            return True
        
        return scraped.lower().strip() == calculated.lower().strip()
    
    def _compare_truc(self, scraped: str, calculated: str) -> bool:
        """Compare 12 Trực names"""
        if not scraped or not calculated:
            return True
        
        return scraped.lower().strip() == calculated.lower().strip()


class CrossValidator:
    """Cross-validate data between multiple sources"""
    
    def validate(self, data_source1: Dict, data_source2: Dict) -> Tuple[bool, list]:
        """Compare data from two sources"""
        errors = []
        
        # Compare lunar date
        if data_source1.get('lunar_day') != data_source2.get('lunar_day'):
            errors.append(f"Lunar day differs between sources")
        
        # Compare Can Chi
        if data_source1.get('day_gan_zhi') != data_source2.get('day_gan_zhi'):
            errors.append(f"Day Can Chi differs: {data_source1.get('day_gan_zhi')} vs {data_source2.get('day_gan_zhi')}")
        
        # Compare 28 Sao
        if data_source1.get('star_28') != data_source2.get('star_28'):
            errors.append(f"Star 28 differs: {data_source1.get('star_28')} vs {data_source2.get('star_28')}")
        
        is_valid = len(errors) == 0
        return is_valid, errors
```

---

## 6. Data Validation & Normalization

### 6.1 Text Normalizer

```python
# src/utils/text_normalizer.py

import re
import unicodedata

class TextNormalizer:
    """Normalize Vietnamese text for consistent comparison"""
    
    # Map các biến thể chính tả
    SPELLING_VARIANTS = {
        'thủy': 'thuỷ',
        'hỏa': 'hoả',
        'y': 'i',  # For some words
    }
    
    @staticmethod
    def normalize_vietnamese(text: str) -> str:
        """Chuẩn hóa text tiếng Việt"""
        if not text:
            return ""
        
        # Lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Normalize unicode
        text = unicodedata.normalize('NFC', text)
        
        return text.strip()
    
    @staticmethod
    def normalize_activity_name(name: str) -> str:
        """Chuẩn hóa tên activity"""
        name = TextNormalizer.normalize_vietnamese(name)
        
        # Remove common prefixes
        prefixes = ['việc ', 'nên ', 'không nên ', 'kỵ ', 'tốt cho ']
        for prefix in prefixes:
            if name.startswith(prefix):
                name = name[len(prefix):]
        
        return name
    
    @staticmethod
    def normalize_direction(direction: str) -> str:
        """Chuẩn hóa tên hướng"""
        direction = TextNormalizer.normalize_vietnamese(direction)
        
        # Map common variations
        direction_map = {
            'đông bắc': 'Đông Bắc',
            'đông nam': 'Đông Nam',
            'tây bắc': 'Tây Bắc',
            'tây nam': 'Tây Nam',
            'chính đông': 'Chính Đông',
            'chính tây': 'Chính Tây',
            'chính nam': 'Chính Nam',
            'chính bắc': 'Chính Bắc',
        }
        
        return direction_map.get(direction, direction.title())
    
    @staticmethod
    def to_slug(text: str) -> str:
        """Convert Vietnamese text to slug (for activity_id)"""
        text = TextNormalizer.normalize_vietnamese(text)
        
        # Remove Vietnamese diacritics
        text = unicodedata.normalize('NFD', text)
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        
        # Replace spaces with underscore
        text = re.sub(r'\s+', '_', text)
        
        # Remove special characters
        text = re.sub(r'[^a-z0-9_]', '', text)
        
        return text
```

### 6.2 Data Merger

```python
# src/validators/data_merger.py

from typing import Dict, Any, List
from datetime import date

class DataMerger:
    """Merge và deduplicate data từ nhiều nguồn"""
    
    def merge_day_data(
        self,
        primary: Dict[str, Any],      # lichngaytot.com
        secondary: Dict[str, Any],    # xemngay.com
        calculated: Dict[str, Any]    # lunar-javascript
    ) -> Dict[str, Any]:
        """
        Merge data từ 3 nguồn:
        - Lunar info: từ calculated (most reliable)
        - Activities: từ primary (most complete)
        - Star details: từ secondary (has element & animal)
        - Directions: merge từ cả 2 sources
        """
        
        merged = {
            'solar_date': primary['solar_date'],
            
            # Lunar info - từ calculated
            'lunar_day': calculated.get('lunar_day') or primary.get('lunar_day'),
            'lunar_month': calculated.get('lunar_month') or primary.get('lunar_month'),
            'lunar_year': calculated.get('lunar_year') or primary.get('lunar_year'),
            
            # Can Chi - từ calculated
            'day_gan_zhi': calculated.get('day_gan_zhi') or primary.get('day_gan_zhi'),
            'month_gan_zhi': calculated.get('month_gan_zhi') or primary.get('month_gan_zhi'),
            'year_gan_zhi': calculated.get('year_gan_zhi') or primary.get('year_gan_zhi'),
            
            # 28 Sao - base từ calculated, details từ secondary
            'star_28': calculated.get('star_28') or primary.get('star_28'),
            'star_28_element': secondary.get('star_28_element'),
            'star_28_animal': secondary.get('star_28_animal'),
            
            # 12 Trực - từ calculated
            'truc_12': calculated.get('truc_12') or primary.get('truc_12'),
            
            # Tiết khí
            'tiet_khi': calculated.get('tiet_khi') or primary.get('tiet_khi'),
            
            # Activities - từ primary (most complete)
            'good_activities': self._merge_activities(
                primary.get('good_activities', []),
                calculated.get('day_yi', [])
            ),
            'bad_activities': self._merge_activities(
                primary.get('bad_activities', []),
                calculated.get('day_ji', [])
            ),
            
            # Directions - merge từ cả 2
            'xi_direction': primary.get('xi_direction') or secondary.get('hy_than_direction'),
            'cai_direction': primary.get('cai_direction') or secondary.get('tai_loc_direction'),
            'hac_direction': primary.get('hac_direction') or secondary.get('bat_loi_direction'),
            
            # Stars - từ primary
            'good_stars': primary.get('good_stars', []),
            'bad_stars': primary.get('bad_stars', []),
            
            # Special notes
            'special_notes': primary.get('special_notes', []),
            
            # Metadata
            'sources': [primary.get('source'), secondary.get('source')],
            'merged_at': date.today().isoformat(),
        }
        
        return merged
    
    def _merge_activities(
        self,
        scraped: List[Dict],
        calculated: List[str]
    ) -> List[Dict]:
        """Merge activities từ scrape và calculated"""
        # Use scraped as base (has more context)
        activities = list(scraped)
        
        # Add any from calculated that are missing
        existing_names = {a.get('activity_name', '').lower() for a in activities}
        
        for calc_activity in calculated:
            if calc_activity.lower() not in existing_names:
                activities.append({
                    'raw_text': calc_activity,
                    'activity_name': calc_activity,
                    'source': 'calculated'
                })
        
        return activities
```

---

## 7. Scheduling & Deployment

### 7.1 Main Scraper Script

```python
# scripts/scrape_year.py

import argparse
import logging
from datetime import date
from pathlib import Path

from src.scrapers.lichngaytot import LichNgayTotScraper
from src.scrapers.xemngay import XemNgayScraper
from src.validators.lunar_validator import LunarValidator
from src.validators.data_merger import DataMerger
from src.storage.sqlite_storage import SQLiteStorage
from src.storage.json_exporter import JSONExporter

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def scrape_year(year: int, output_dir: Path):
    """Scrape và process data cho 1 năm"""
    
    # Initialize components
    primary_scraper = LichNgayTotScraper(rate_limit=1.5)
    secondary_scraper = XemNgayScraper(rate_limit=1.5)
    validator = LunarValidator()
    merger = DataMerger()
    storage = SQLiteStorage(output_dir / 'fengshui.db')
    
    # Stats
    total_days = 0
    success_days = 0
    validation_errors = 0
    
    # Scrape each day
    start_date = date(year, 1, 1)
    end_date = date(year, 12, 31)
    current = start_date
    
    while current <= end_date:
        total_days += 1
        logger.info(f"Processing {current}...")
        
        try:
            # Scrape from both sources
            primary_data = primary_scraper.scrape_date(current)
            secondary_data = secondary_scraper.scrape_date(current)
            
            if not primary_data:
                logger.warning(f"Failed to scrape primary for {current}")
                current += timedelta(days=1)
                continue
            
            # Calculate lunar data
            calculated_data = validator.calculate_lunar_data(current)
            
            # Validate
            is_valid, errors = validator.validate(primary_data)
            if not is_valid:
                validation_errors += 1
                logger.warning(f"Validation errors for {current}: {errors}")
            
            # Merge data
            merged_data = merger.merge_day_data(
                primary_data,
                secondary_data or {},
                calculated_data
            )
            merged_data['validated'] = is_valid
            merged_data['validation_errors'] = errors
            
            # Store
            storage.save_day(merged_data)
            success_days += 1
            
        except Exception as e:
            logger.error(f"Error processing {current}: {e}")
        
        current += timedelta(days=1)
    
    # Export to JSON
    logger.info("Exporting to JSON...")
    exporter = JSONExporter()
    exporter.export_year(storage, year, output_dir / f'fengshui_{year}.json')
    
    # Summary
    logger.info(f"""
    ========== SCRAPE COMPLETE ==========
    Year: {year}
    Total days: {total_days}
    Successful: {success_days}
    Validation errors: {validation_errors}
    Output: {output_dir}
    =====================================
    """)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Scrape feng shui data for a year')
    parser.add_argument('year', type=int, help='Year to scrape')
    parser.add_argument('--output', type=Path, default=Path('data/export'), help='Output directory')
    
    args = parser.parse_args()
    scrape_year(args.year, args.output)
```

### 7.2 Dockerfile

```dockerfile
# Dockerfile

FROM python:3.11-slim

# Install Node.js for lunar-javascript
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install lunar-javascript globally
RUN npm install -g lunar-javascript

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/

# Create data directories
RUN mkdir -p data/raw data/processed data/validated data/export

# Default command
CMD ["python", "scripts/scrape_year.py", "2025", "--output", "data/export"]
```

### 7.3 Cron Schedule

```bash
# crontab entry - chạy vào đầu mỗi năm
# Scrape năm tiếp theo vào ngày 1/12 hàng năm
0 0 1 12 * docker run --rm -v /data/fengshui:/app/data fengshui-scraper python scripts/scrape_year.py $(date -d "next year" +\%Y)
```

---

## 8. Tích Hợp Với App

### 8.1 Export Format

```json
// fengshui_2025.json - Format cho mobile app

{
  "version": "1.0",
  "year": 2025,
  "generated_at": "2024-12-01T00:00:00Z",
  "total_days": 365,
  "days": [
    {
      "d": "2025-01-01",
      "ld": 2,
      "lm": 12,
      "ly": 2024,
      "dgz": "Giáp Tý",
      "mgz": "Bính Tý",
      "ygz": "Giáp Thìn",
      "s28": "Giác",
      "s28e": "Mộc",
      "s28a": "Giao long",
      "t12": "Khai",
      "tk": "Tiểu Hàn",
      "ga": ["cau_an", "khai_truong", "xuat_hanh"],
      "ba": ["an_tang", "dong_tho"],
      "xd": "Đông Nam",
      "cd": "Chính Nam",
      "hd": "Tây Bắc",
      "gs": ["Thiên đức", "Nguyệt đức"],
      "bs": ["Hoang vu"],
      "sn": []
    },
    // ... 364 more days
  ],
  
  // Reference data
  "activities": {
    "cau_an": {"n": "Cầu an", "c": "spiritual"},
    "khai_truong": {"n": "Khai trương", "c": "business"},
    // ... all activities
  }
}
```

### 8.2 Import vào React Native App

```typescript
// src/data/importFengshuiData.ts

import { database } from './database';
import { FengshuiDaily } from './models/FengshuiDaily';
import fengshuiData2025 from '../assets/data/fengshui_2025.json';

interface CompactDayData {
  d: string;   // solar_date
  ld: number;  // lunar_day
  lm: number;  // lunar_month
  ly: number;  // lunar_year
  dgz: string; // day_gan_zhi
  mgz: string; // month_gan_zhi
  ygz: string; // year_gan_zhi
  s28: string; // star_28
  s28e: string; // star_28_element
  s28a: string; // star_28_animal
  t12: string; // truc_12
  tk: string;  // tiet_khi
  ga: string[]; // good_activities
  ba: string[]; // bad_activities
  xd: string;  // xi_direction
  cd: string;  // cai_direction
  hd: string;  // hac_direction
  gs: string[]; // good_stars
  bs: string[]; // bad_stars
  sn: string[]; // special_notes
}

export async function importFengshuiData(): Promise<void> {
  const data = fengshuiData2025;
  
  await database.write(async () => {
    const collection = database.get<FengshuiDaily>('fengshui_daily');
    
    const batch = data.days.map((day: CompactDayData) =>
      collection.prepareCreate(record => {
        record.solarDate = day.d;
        record.lunarDay = day.ld;
        record.lunarMonth = day.lm;
        record.lunarYear = day.ly;
        record.dayGanZhi = day.dgz;
        record.monthGanZhi = day.mgz;
        record.yearGanZhi = day.ygz;
        record.star28 = day.s28;
        record.star28Element = day.s28e;
        record.star28Animal = day.s28a;
        record.truc12 = day.t12;
        record.tietKhi = day.tk;
        record.goodActivities = JSON.stringify(day.ga);
        record.badActivities = JSON.stringify(day.ba);
        record.xiDirection = day.xd;
        record.caiDirection = day.cd;
        record.hacDirection = day.hd;
        record.goodStars = JSON.stringify(day.gs);
        record.badStars = JSON.stringify(day.bs);
        record.specialNotes = JSON.stringify(day.sn);
      })
    );
    
    await database.batch(...batch);
  });
}

// Check và import khi app start
export async function ensureFengshuiData(year: number): Promise<void> {
  const count = await database.get('fengshui_daily')
    .query(Q.where('solar_date', Q.like(`${year}-%`)))
    .fetchCount();
  
  if (count < 360) {
    console.log(`Importing fengshui data for ${year}...`);
    await importFengshuiData();
  }
}
```

### 8.3 File Size Estimate

| Component | Size |
|-----------|------|
| 1 năm JSON (minified) | ~150-200 KB |
| 1 năm JSON (gzipped) | ~30-50 KB |
| SQLite database (1 năm) | ~500 KB |
| SQLite database (10 năm) | ~4-5 MB |

**Recommendation**: Bundle 2-3 năm data trong app, còn lại download on-demand.

---

## Phụ Lục

### A. Checklist Trước Khi Scrape

- [ ] Kiểm tra robots.txt của website target
- [ ] Test URL pattern với vài ngày random
- [ ] Verify HTML structure không thay đổi
- [ ] Setup rate limiting phù hợp
- [ ] Prepare error handling và retry logic
- [ ] Setup logging đầy đủ
- [ ] Test validation với lunar-javascript

### B. Monitoring & Alerts

```python
# Gửi alert nếu validation error rate > 5%
if validation_errors / total_days > 0.05:
    send_alert(f"High validation error rate: {validation_errors}/{total_days}")
```

### C. Backup Strategy

- Raw HTML backup: 30 ngày
- Processed JSON: Giữ vĩnh viễn
- SQLite database: Daily backup

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Related: lich-viet-technical-doc-v2.md*
