# Nhật Ký Cập Nhật & Nâng Cấp Hệ Thống (`lichviet.online`) — Tháng 11/2026

Tài liệu này tổng hợp chi tiết các đợt nâng cấp giao diện, SEO, tính năng mới, kiểm chứng dữ liệu phong thủy và cập nhật lịch nghỉ lễ/Tết chính thức đã thực hiện trên hệ thống **Lịch Việt - Vạn Sự An Lành**.

- **Pull Request Đợt 1 (Phase 1 – Phase 5)**: [PR #7](https://github.com/bradleydev578/viet-calendar/pull/7)
- **Pull Request Đợt 2 (Phase 6 – Phase 8)**: [PR #8](https://github.com/bradleydev578/viet-calendar/pull/8)

---

## Đợt 1: Khắc Phục Lỗi UI, Tối Ưu Hiệu Năng, Technical SEO & Accessibility (Phase 1 – Phase 5)

### 1. Giao diện & Hiệu năng (UI & Core Web Vitals)
- **Thay thế hoàn toàn Font Icon bằng Inline SVG ([MaterialIcon.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/common/MaterialIcon.tsx))**:
  - Loại bỏ request tải font Google Material Symbols (~3.4 MB), sửa triệt để lỗi hiển thị tên chữ (`ark_mo`, `chevron_left`, `check_circle`, `cancel`, `format_quote`) khi mạng chậm hoặc font chưa tải xong.
- **Đồng bộ giao diện Sáng & Chặn lệch màu OS Dark Mode ([tailwind.config.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/tailwind.config.ts))**:
  - Cấu hình `darkMode: "class"` và chuẩn hóa màu nền thẻ *"Nên làm"* / *"Kiêng kỵ"* trên cả Desktop & Mobile.
- **Chặn bão 42+ request Prefetch & Tối ưu SSR ([CalendarGridClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/CalendarGridClient.tsx), [HomeClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/HomeClient.tsx))**:
  - Thêm `prefetch={false}` cho các ô ngày trên lịch, khôi phục Server-Side Rendering (SSR) cho bảng chi tiết ngày hôm nay và chuẩn hóa múi giờ `Asia/Ho_Chi_Minh` (`UTC+7`).
- **Dọn dẹp Legacy Code**:
  - Xóa các component cũ không còn sử dụng (`DayCell.tsx`, `CalendarGrid.tsx`, `CalendarGridNew.tsx`, `DayDetailPanel.tsx`, `MonthHeader.tsx`, `TodayWidget.tsx`, `DayDetailContent.tsx`) để ngăn bundle nhầm dữ liệu JSON tĩnh vào client.

### 2. Technical SEO, Schema Markup & Liên kết nội bộ
- **Chuẩn hóa Metadata & OpenGraph**:
  - Loại bỏ hậu tố lặp `| Lịch Việt | Lịch Việt` trên `<title>`, bổ sung `og:image` cho mọi trang và tạo route sinh ảnh động [opengraph-image.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/opengraph-image.tsx) cho từng ngày `/day/YYYY-MM-DD`.
- **Chuẩn hóa `sitemap.xml` ([sitemap.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/sitemap.ts))**:
  - Chỉ xuất các URL có dữ liệu thực tế cùng các trang công cụ chính (`/`, `/doi-ngay-am-duong`, `/xem-ngay-tot`, `/holidays`, `/download`, `/day/YYYY-MM-DD`).
- **Giảm Crawl Depth & Mở khóa nội dung SEO ([Footer.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/Footer.tsx), [InfoSections.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/InfoSections.tsx))**:
  - Thêm dải liên kết nhanh 12 tháng trong năm ở Footer và chuyển Accordion kiến thức phong thủy sang `<details>` / `<summary>` chuẩn HTML5.

---

## Đợt 2: Công Cụ Đổi Ngày Vạn Niên (1900–2100) & Xem Ngày Tốt (Phase 6)

### 1. Kiến trúc điều hướng & Tinh gọn CTA
- **Thanh Menu Chính ([TopHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/TopHeader.tsx))**:
  - Mở rộng từ 2 mục lên 4 mục cốt lõi:
    1. **Lịch (`/`)**
    2. **Đổi Ngày (`/doi-ngay-am-duong`)**
    3. **Ngày Tốt (`/xem-ngay-tot`)**
    4. **Sự Kiện (`/holidays`)**
- **Tinh gọn vùng Lịch ([CalendarHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/calendar/CalendarHeader.tsx), [HomeClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/HomeClient.tsx))**:
  - Ẩn 2 nút CTA phụ *"Đổi ngày Âm ↔ Dương"* ở cạnh tiêu đề tháng và cạnh nút *"Hôm nay"* để tránh trùng lặp với thanh menu chính phía trên.

### 2. Trang Đổi Ngày Âm Dương (`/doi-ngay-am-duong`) & Xem Ngày Tốt (`/xem-ngay-tot`)
- **[DateConverterClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/converter/DateConverterClient.tsx)**:
  - Đổi lịch 2 chiều **Dương lịch ↔ Âm lịch** cho mọi ngày từ **1900 – 2100**.
  - Tự động phát hiện **Tháng Nhuận Âm lịch** và giới hạn số ngày thực tế của từng tháng (29 hoặc 30 ngày).
  - Hiển thị tức thì kết quả phong thủy đầy đủ (Can Chi ngày/tháng/năm, Ngũ hành Nạp âm, Tiết khí, Trực, 28 Sao, Điểm tốt xấu, 6 Giờ Hoàng Đạo, Hướng xuất hành, Việc nên làm/kiêng kỵ) kèm bảng tra nhanh **Mùng 1 & Ngày Rằm** cả năm.
- **[AuspiciousDaysClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/auspicious/AuspiciousDaysClient.tsx)**:
  - Tìm ngày Hoàng Đạo / ngày tốt theo mục đích (*Cưới hỏi, Khai trương, Động thổ, Xuất hành, Nhập trạch*) cho bất kỳ tháng/năm nào (`1900–2100`).
  - Hỗ trợ lọc tránh ngày **Lục Xung / Lục Hại** theo **Năm sinh gia chủ** (lưu tự động vào `localStorage`).

---

## Đợt 3: Kiểm Chứng & Chuẩn Hóa Dữ Liệu Phong Thủy Ngọc Hạp Thông Thư (Phase 7)

Đã thực hiện kiểm toán toàn diện 1,095 ngày trong `fengshui_2025.json`, `fengshui_2026.json`, `fengshui_2027.json` (trên cả `web/`, `mobile/`, `scraper/`) và xây dựng bộ quy tắc [ngocHapRules.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/fengshui/ngocHapRules.ts) + [UniversalDayCalculator.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/fengshui/UniversalDayCalculator.ts):

| Hạng mục kiểm chứng | Vấn đề phát hiện trước khi sửa | Giải pháp & Kết quả sau khi chuẩn hóa |
| :--- | :--- | :--- |
| **1. Can Chi Tháng (`mgz`)** | Lệch 1 tháng trên **320/1,095 ngày** do tính theo Tiết khí thay vì Tháng Âm lịch Việt Nam. | Chuẩn hóa 100% theo phép **Ngũ Hổ Độn** chuẩn Lịch Vạn Niên Việt Nam (Tháng Giêng là tháng Dần). |
| **2. Sao Tốt (`gs`) & Sao Xấu (`bs`)** | Trống `[]` trên **100% (1,095/1,095 ngày)** ở cả 3 năm 2025–2027. | Tích hợp đầy đủ bảng **56 Cát Tinh** & **60 Hung Tinh** chuẩn Ngọc Hạp Thông Thư theo Tháng Âm lịch + Can/Chi, cùng **Tam Nương**, **Nguyệt Kỵ**, **Dương Công Kỵ Nhật**. |
| **3. Hoàng Đạo / Hắc Đạo (`t12g`)** | Lệch trên **355/1,095 ngày** do gán theo 12 Trực thay vì 12 Thần Hoàng Đạo. | Chuẩn hóa theo bảng **12 Thần Hoàng Đạo / Hắc Đạo** (`Thanh Long`, `Minh Đường`, `Kim Quỹ`, `Thiên Đức`, `Ngọc Đường`, `Tư Mệnh`). |
| **4. Giờ Hoàng Đạo (`hd`)** | Bị thiếu giờ trên 4 ngày trong JSON tĩnh. | Chuẩn hóa đủ **6 Giờ Hoàng Đạo / ngày** theo Địa Chi ngày trên toàn bộ 1,095 ngày. |
| **5. Việc Nên Làm / Kiêng Kỵ (`ga` / `ba`)** | Lỗi regex trong `lichngaytot_parser.py` để sót chữ `"Nên..."`, `"Cần..."`, `"Hợp..."` (694 ngày) và cắt cụt mảnh `"động"` từ `"v.v."` (104 ngày); 6 ngày bị trống `ga`/`ba`. | Sửa triệt để 6 lỗi regex trong [lichngaytot_parser.py](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/scraper/src/parsers/lichngaytot_parser.py) và làm sạch toàn bộ 1,095 ngày (0 lỗi). |
| **6. Hướng Hắc Thần (`dir.bg`)** | 127 ngày lưu nhầm chữ `"Hắc Thần"` làm tên hướng thay vì phương vị thực tế. | Bổ sung bảng tra **60 Hoa Giáp Hắc Thần** chuẩn (`Đông Bắc`, `Chính Đông`, `Đông Nam`, `Chính Nam`, `Tây Nam`, `Chính Tây`, `Tây Bắc`, `Chính Bắc`, `Tại Thiên`). |
| **7. Tiết Khí (`st`)** | Dính câu văn mô tả dài (`"Lập đông (Bắt đầu mùa đông)..."`). | Tách gọn tên chuẩn 24 Tiết khí (`Lập xuân`, `Vũ thủy`, `Kinh trập`, ..., `Đại hàn`). |
| **8. Chấm điểm & Lọc ngày Đại Kỵ** | Ngày phạm `Tam Nương`, `Nguyệt Kỵ`, `Dương Công Kỵ`, `Sát chủ`, `Thụ tử` vẫn có thể lọt vào bộ lọc ngày tốt nếu trùng ngày Hoàng Đạo. | Cập nhật [DayScore.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/fengshui/DayScore.ts), [AuspiciousDaysClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/auspicious/AuspiciousDaysClient.tsx), và [CalendarGridClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/CalendarGridClient.tsx) để trừ điểm nặng và loại bỏ khỏi danh sách gợi ý ngày tốt. |

---

## Đợt 4: Cập Nhật Ngày Lễ Mới (24/11) & Lịch Nghỉ Tết / Nghỉ Lễ Chính Thức 2026 – 2027 (Phase 8)

Đã cập nhật tại [constants.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/holidays/constants.ts), [HolidayRepository.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/holidays/HolidayRepository.ts), [holidays/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/holidays/page.tsx) và đồng bộ sang [mobile/src/data/constants/holidays.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/mobile/src/data/constants/holidays.ts):

1. **Bổ sung Ngày Văn hóa Việt Nam (`24/11` Dương lịch)**:
   - Xếp vào nhóm **Ngày Lễ Chính Thức (`PUBLIC_HOLIDAYS`)** — người lao động được nghỉ 1 ngày và hưởng nguyên lương theo Nghị quyết 80-NQ/TW của Bộ Chính trị & Nghị quyết 28/2026/QH16 của Quốc hội.
2. **Lịch nghỉ Tết Nguyên Đán & Các kỳ nghỉ lễ chính thức 2026 – 2027**:
   - **Tết Nguyên Đán 2026 (Bính Ngọ)**: Nghỉ **9 ngày liên tục** từ `14/02/2026 – 22/02/2026` (27 tháng Chạp Ất Tỵ đến mùng 6 tháng Giêng Bính Ngọ; Mùng 1 Tết: `17/02/2026`).
   - **Tết Nguyên Đán 2027 (Đinh Mùi)**: Nghỉ **7 ngày liên tục** từ `04/02/2027 – 10/02/2027` (28 tháng Chạp Bính Ngọ đến mùng 5 tháng Giêng Đinh Mùi; Mùng 1 Tết: `06/02/2027`).
   - **Tết Dương lịch**: Năm 2026 nghỉ 4 ngày (`01/01 – 04/01/2026`); năm 2027 nghỉ 3 ngày (`01/01 – 03/01/2027`).
   - **Giỗ Tổ Hùng Vương (`10/3 Âm lịch`)**: Năm 2026 nghỉ 3 ngày (`25/04 – 27/04/2026`); năm 2027 nghỉ 3 ngày (`16/04 – 18/04/2027`).
   - **Lễ 30/4 & Quốc tế Lao động 1/5**: Năm 2026 và 2027 đều nghỉ 4 ngày liên tục (`30/04 – 03/05`).
   - **Lễ Quốc khánh 2/9**: Năm 2026 nghỉ 5 ngày (`29/08 – 02/09/2026`); năm 2027 nghỉ 4 ngày (`02/09 – 05/09/2027`).
3. **Bổ sung các ngày lễ & sự kiện văn hóa quan trọng trong năm**:
   - **Ngày hội Đại đoàn kết toàn dân tộc (`18/11` Dương lịch)**
   - **Lễ Giáng Sinh / Noel (`25/12` Dương lịch)**
   - **Ông Công Ông Táo (`23/12` Âm lịch)** & **Lễ Tất Niên / Đêm Giao Thừa (`29` hoặc `30` tháng Chạp Âm lịch)**
   - **Ngày Vía Thần Tài (`10/1` Âm lịch)** & **Đại lễ Phật Đản (`15/4` Âm lịch)**
   - **Ngày Quốc tế Phụ nữ (`8/3`)**, **Ngày Quốc tế Thiếu nhi (`1/6`)**, **Ngày Chuyển đổi số Quốc gia (`10/10`)**
4. **Sửa lỗi quy đổi ngày lễ Âm lịch tháng Chạp**:
   - Cập nhật [`HolidayRepository.getHolidaysForYear`](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/holidays/HolidayRepository.ts#L149-L195) và [`LunarCalculator.toSolar`](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/lunar/LunarCalculator.ts#L33-L48) để các ngày lễ tháng Chạp năm Âm lịch trước (`23/12 Ông Công Ông Táo`, `29/30 Tết Đêm Giao Thừa` kể cả năm tháng Chạp thiếu 29 ngày) hiển thị chính xác vào tháng 1–2 Dương lịch của năm hiện tại.
