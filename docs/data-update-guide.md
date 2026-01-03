# Hướng dẫn cập nhật dữ liệu Lịch và Holidays

Tài liệu này hướng dẫn cách cập nhật dữ liệu feng shui và holidays cho mobile app.

## 1. Cập nhật dữ liệu Feng Shui (Lịch vạn niên)

### Bước 1: Chạy scraper cho năm mới

```bash
cd scraper
source venv/bin/activate
python scripts/scrape_year.py <YEAR>
# Ví dụ: python scripts/scrape_year.py 2027
```

Kết quả sẽ được lưu tại: `scraper/data/export/fengshui_<YEAR>.json`

### Bước 2: Copy file vào mobile app

```bash
cp scraper/data/export/fengshui_<YEAR>.json mobile/src/assets/data/
```

### Bước 3: Cập nhật FengShuiRepository

Mở file `mobile/src/data/repositories/FengShuiRepository.ts` và thêm import cho năm mới:

```typescript
// Import the data files
const fengShuiData2025 = require('../../assets/data/fengshui_2025.json');
const fengShuiData2026 = require('../../assets/data/fengshui_2026.json');
const fengShuiData2027 = require('../../assets/data/fengshui_2027.json'); // Thêm dòng này

// Trong hàm loadData(), thêm vào dataSets:
const dataSets: FengShuiDataSet[] = [fengShuiData2025, fengShuiData2026, fengShuiData2027];
```

### Bước 4: Kiểm tra TypeScript

```bash
cd mobile
npx tsc --noEmit
```

---

## 2. Cập nhật dữ liệu Holidays

### Cấu trúc dữ liệu Holiday

Holidays được chia thành 3 categories (lưu ngầm, không hiển thị riêng trên UI):

| Category | Mô tả | Ví dụ |
|----------|-------|-------|
| `PUBLIC_HOLIDAYS` | Ngày lễ chính thức có nghỉ | Tết, Giỗ Tổ, 30/4-1/5, Quốc khánh |
| `SECTOR_ANNIVERSARIES` | Ngày kỷ niệm ngành | Ngày Thầy thuốc, Nhà giáo, Báo chí |
| `CULTURAL_ETHNIC_FESTIVALS` | Lễ hội văn hóa dân tộc | Chùa Hương, Hội Lim, Lễ Kate |

### Các file cần cập nhật

1. **Constants**: `mobile/src/data/constants/holidays.ts`
2. **Types**: `mobile/src/data/types/HolidayData.ts`
3. **Service**: `mobile/src/data/services/HolidayService.ts`

### Thêm Holiday mới (Lunar - Âm lịch)

Mở `mobile/src/data/constants/holidays.ts`, thêm vào `LUNAR_HOLIDAYS`:

```typescript
{
  id: 'ten-holiday-slug',
  name: 'Tên Holiday Tiếng Việt',
  type: 'lunar',
  category: 'CULTURAL_ETHNIC_FESTIVALS', // hoặc PUBLIC_HOLIDAYS
  lunarDate: { day: 15, month: 7 }, // Ngày âm lịch
  description: 'Mô tả ngắn',
  isImportant: true, // true = hiển thị nổi bật
  totalDays: 1, // Chỉ dùng cho PUBLIC_HOLIDAYS
  location: 'Hà Nội', // Chỉ dùng cho CULTURAL_ETHNIC_FESTIVALS
},
```

### Thêm Holiday mới (Solar - Dương lịch)

Thêm vào `SOLAR_HOLIDAYS`:

```typescript
{
  id: 'ngay-xyz',
  name: 'Ngày XYZ Việt Nam',
  type: 'solar',
  category: 'SECTOR_ANNIVERSARIES',
  solarDate: { day: 15, month: 3 }, // Ngày dương lịch
  description: 'Mô tả ngắn',
  isImportant: false,
},
```

### Thêm Lễ hội có ngày thay đổi theo năm

Thêm vào `YEARLY_FESTIVALS`:

```typescript
{
  id: 'le-hoi-xyz',
  name: 'Lễ hội XYZ',
  category: 'CULTURAL_ETHNIC_FESTIVALS',
  location: 'Tỉnh ABC',
  description: 'Mô tả lễ hội',
  isImportant: true,
  dates: {
    2025: { startDate: '2025-03-01', endDate: '2025-03-03' },
    2026: { startDate: '2026-03-15', endDate: '2026-03-17' },
    2027: { startDate: '2027-03-05', endDate: '2027-03-07' },
  },
},
```

---

## 3. Nguồn dữ liệu Holiday

Dữ liệu holiday có thể lấy từ file scraper: `scraper/data/holiday/holiday.json`

Cấu trúc file:
```json
{
  "database_info": { ... },
  "data": [
    {
      "category": "PUBLIC_HOLIDAYS",
      "items": [
        {
          "id": "PH_NEW_YEAR",
          "name": "Tết Dương lịch 2026",
          "start_time": "2026-01-01T00:00:00",
          "end_time": "2026-01-01T23:59:59",
          "total_days": 1,
          "description": "..."
        }
      ]
    },
    {
      "category": "SECTOR_ANNIVERSARIES",
      "items": [ ... ]
    },
    {
      "category": "CULTURAL_ETHNIC_FESTIVALS",
      "items": [ ... ]
    }
  ]
}
```

---

## 4. Checklist cập nhật hàng năm

- [ ] Chạy scraper cho năm mới (feng shui data)
- [ ] Copy file JSON vào `mobile/src/assets/data/`
- [ ] Cập nhật `FengShuiRepository.ts` import năm mới
- [ ] Cập nhật `YEARLY_FESTIVALS` với ngày cụ thể của năm mới
- [ ] Kiểm tra TypeScript: `npx tsc --noEmit`
- [ ] Test trên simulator/emulator

---

## 5. Lưu ý quan trọng

1. **Giỗ Tổ Hùng Vương** là ngày **10/3 Âm lịch**, nên được định nghĩa trong `LUNAR_HOLIDAYS` với `lunarDate: { day: 10, month: 3 }`

2. **Tết Nguyên Đán** cũng là lunar, bắt đầu từ **mùng 1 tháng Giêng**

3. **Lễ hội Chùa Hương** kéo dài nhiều tháng (từ mùng 6 tháng Giêng đến hết tháng 3 âm lịch), nên cần dùng `YEARLY_FESTIVALS` với `startDate` và `endDate` cụ thể

4. Khi thêm holiday mới, đảm bảo:
   - `id` là slug unique (không trùng)
   - `category` đúng loại
   - `isImportant: true` cho các ngày lễ lớn (sẽ hiển thị màu đỏ)
