# Kế Hoạch Nâng Cấp Website `lichviet.online` (Web Enhancement Plan)

Tài liệu tham chiếu: [website_enhancement_audit.md](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/docs/website_enhancement_audit.md)

---

## 🎯 Mục Tiêu Tổng Quan

Khắc phục triệt để các lỗi giao diện/hiệu năng/SEO đang xảy ra trên bản Production `https://www.lichviet.online/` và nâng cấp các tính năng trải nghiệm người dùng theo 5 Phase rõ ràng:

```mermaid
flowchart LR
    P1["Phase 1: Hotfix UI & Core Bugs\n(Icon Label, Dark Mode, Prefetch, Timezone, SSR)"] --> P2["Phase 2: Technical SEO & Metadata\n(Title, OG Image, Sitemap, 404)"]
    P2 --> P3["Phase 3: Schema Markup & Internal Links\n(JSON-LD, Month Links, Details Accordion)"]
    P3 --> P4["Phase 4: Accessibility & Core Web Vitals\n(ARIA, dvh, Contrast, Dead Code Cleanup)"]
    P4 --> P5["Phase 5: Product Features mới\n(Đổi ngày Âm-Dương, Tìm ngày tốt, Dynamic OG)"]
```

---

## 🚀 PHASE 1: Hotfix Giao Diện & Lỗi Logic Nghiêm Trọng (Ưu tiên P0 - Làm ngay)

### 1.1. Sửa lỗi hiển thị chữ Label của toàn bộ Icon (`ark_mo`, `calendar_month`, `chevron_left`...)
- **Files**:
  - [web/src/components/common/MaterialIcon.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/common/MaterialIcon.tsx)
  - [web/src/app/layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/layout.tsx)
  - [web/src/app/globals.css](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/globals.tsx)
- **Công việc**:
  - [x] Thay thế hoàn toàn font icon Google Fonts Material Symbols (~3.4 MB) bằng component vector SVG nội tuyến [MaterialIcon.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/common/MaterialIcon.tsx) cho toàn bộ 28 icon trên khắp ứng dụng (`TopHeader`, `CalendarHeader`, `HomeClient`, `DayDetailPanelClient`, `InfoSections`, `holidays`, `download`, `privacy`, `terms`) và xóa `MaterialSymbolsLoader.tsx`.
  - [x] Bổ sung quy tắc CSS phòng vệ cố định kích thước cho `.material-symbols-outlined` trong `@layer components` của [globals.css](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/globals.css) (`display: inline-block; width: 1em; height: 1em; overflow: hidden; white-space: nowrap; direction: ltr;`) để ngăn chặn vĩnh viễn hiện tượng tràn chữ (`ark_mo`, `chevron_left`).

### 1.2. Sửa lỗi nền đen Dark Mode lệch tông ở thẻ "Nên làm" / "Kiêng kỵ"
- **Files**:
  - [web/tailwind.config.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/tailwind.config.ts)
  - [web/src/components/home/DayDetailPanelClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/DayDetailPanelClient.tsx)
  - [web/src/components/home/CalendarGridClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/CalendarGridClient.tsx)
- **Công việc**:
  - [x] Thêm `darkMode: "class"` vào [tailwind.config.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/tailwind.config.ts) để các class `dark:*` không tự kích hoạt lệch tông khi hệ điều hành bật Dark Mode.
  - [x] Đồng bộ màu chữ và nền sáng của thẻ *"Nên làm"* và *"Kiêng kỵ"* giữa Desktop (`DayDetailPanelClient.tsx`) và Mobile (`HomeClient.tsx`).

### 1.3. Chặn bão 42+ request Prefetch & Sửa hành vi click chọn ngày trên Trang chủ
- **Files**:
  - [web/src/components/home/CalendarGridClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/CalendarGridClient.tsx)
- **Công việc**:
  - [x] Thêm `prefetch={false}` vào `<Link href="/day/YYYY-MM-DD">` trong `CalendarDayCellClient` để ngăn Next.js bắn 42+ request prefetch đồng loạt khi mở trang.
  - [x] Khi ở Trang chủ (có truyền `onSelectDate`), ngăn điều hướng chuyển trang khi click đơn vào ô ngày (`e.preventDefault(); onSelect(date)`) để cập nhật mượt mà cột `DayDetailPanelClient` bên phải (vẫn giữ thẻ `<a href="/day/...">` để hỗ trợ SEO crawl và mở tab mới bằng Chuột giữa / Cmd+Click).

### 1.4. Sửa lỗi đóng băng ngày tĩnh trên Trang chủ & Khôi phục SSR cho Bảng chi tiết ngày
- **Files**:
  - [web/src/app/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/page.tsx)
  - [web/src/components/home/HomeClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/HomeClient.tsx)
- **Công việc**:
  - [x] Thêm `export const revalidate = 3600;` vào [page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/page.tsx) và tạo helper lấy ngày hiện tại theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh`, UTC+7).
  - [x] Trong [HomeClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/HomeClient.tsx), khởi tạo `useState<DayFengShuiData | null>(initialFengShuiData)` và `useState(false)` cho `isLoading` để HTML từ server hiển thị ngay chi tiết ngày hôm nay (không bị nháy khung xương `animate-pulse`).

### 1.5. Sửa lỗi lệch 1 ngày theo múi giờ UTC trên `/day/[date]` & xử lý 404
- **Files**:
  - [web/src/app/day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx)
  - [web/src/components/day-detail/DayDetailContentClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/day-detail/DayDetailContentClient.tsx)
- **Công việc**:
  - [x] Tạo hàm `parseLocalDate(dateStr: string): Date | null` kiểm tra định dạng `^\d{4}-\d{2}-\d{2}$` và khởi tạo `new Date(year, month - 1, day)` thay vì `new Date(dateString)` (tránh lệch sang ngày hôm trước trên máy chủ UTC-5/UTC-8 của Googlebot).
  - [x] Gọi `notFound()` trong [day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx) nếu `date` không hợp lệ hoặc ngoài khoảng năm dữ liệu.

---

## 🔍 PHASE 2: Nâng Cấp Technical SEO & Metadata (`technical-seo-audit`)

### 2.1. Sửa lỗi lặp `| Lịch Việt | Lịch Việt` trong `<title>` và mất `og:image`
- **Files**:
  - [web/src/app/layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/layout.tsx)
  - [web/src/app/holidays/layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/holidays/layout.tsx)
  - [web/src/app/download/layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/download/layout.tsx)
  - [web/src/app/privacy/layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/privacy/layout.tsx)
  - [web/src/app/terms/layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/terms/layout.tsx)
  - [web/src/app/not-found.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/not-found.tsx)
  - [web/src/app/day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx)
- **Công việc**:
  - [x] Loại bỏ hậu tố `| Lịch Việt` bị lặp trong `title` của tất cả các layout/page con (để `title.template: "%s | Lịch Việt"` ở root layout tự động gắn 1 lần duy nhất).
  - [x] Bổ sung `images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Lịch Việt - Vạn Sự An Lành" }]` và `siteName: "Lịch Việt - Vạn Sự An Lành"` vào `openGraph` của tất cả các trang con.
  - [x] Sửa `authors.url` trong [layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/layout.tsx#L50) từ `https://lichviet.vn` thành `https://lichviet.online`.
  - [x] Giàu hóa `<title>` và `<meta name="description">` của `/day/[date]` với Ngày Âm lịch, Can Chi và trạng thái Hoàng Đạo/Hắc Đạo (ví dụ: `"Ngày 6/11/2026 (28/9 Âm lịch - Ngày Giáp Thân, Hoàng Đạo)"`).

### 2.2. Chuẩn hóa `sitemap.xml` khớp với dữ liệu thực tế
- **Files**:
  - [web/src/app/sitemap.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/sitemap.ts)
- **Công việc**:
  - [x] Sử dụng `FengShuiServerRepository.getAvailableYears()` (`[2025, 2026, 2027]`) để sinh danh sách URL `/day/YYYY-MM-DD`, loại bỏ 366 URL rỗng của năm 2028 khỏi `sitemap.xml`.

---

## 🧩 PHASE 3: Chuẩn Hóa Schema Markup & Liên Kết Nội Bộ (`schema-markup` & `internal-link-audit`)

### 3.1. Sửa lỗi & Gắn JSON-LD Structured Data vào các trang đích
- **Files**:
  - [web/src/components/seo/JsonLd.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/seo/JsonLd.tsx)
  - [web/src/app/day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx)
  - [web/src/app/download/layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/download/layout.tsx)
- **Công việc**:
  - [x] Xóa `SearchAction` không hợp lệ (`/day/{search_term_string}`) khỏi `WebsiteJsonLd` và thêm `@id: "https://lichviet.online/#website"`.
  - [x] Xóa `aggregateRating` giả định khỏi `SoftwareApplicationJsonLd`, cập nhật `operatingSystem: "iOS"` khớp với nội dung hiển thị trên trang `/download` và render trong `download/layout.tsx`.
  - [x] Cập nhật `DayPageJsonLd` (thêm `url`, `mainEntityOfPage`, `image`, cố định `datePublished`) và render cùng `BreadcrumbJsonLd` trong [day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx).

### 3.2. Giảm Crawl Depth từ >300 clicks xuống ≤ 3 clicks & Mở khóa nội dung Accordion cho SEO
- **Files**:
  - [web/src/components/layout/Footer.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/Footer.tsx)
  - [web/src/components/home/InfoSections.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/InfoSections.tsx)
- **Công việc**:
  - [x] Thêm thanh liên kết nhanh **Lịch 12 Tháng** (`Tháng 1` → `Tháng 12` trỏ tới `/day/{year}-{month}-01` với `prefetch={false}`) trong [Footer.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/Footer.tsx) để Googlebot và người dùng có thể truy cập bất kỳ tháng nào trong năm chỉ với 1 click.
  - [x] Chuyển [InfoSections.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/InfoSections.tsx) từ conditional rendering `{expandedId === item.id && ...}` sang thẻ `<details className="group">` & `<summary>` chuẩn HTML5 để nội dung *28 Sao, 12 Trực, Giờ Hoàng Đạo* luôn nằm trong SSR DOM cho Google index và hỗ trợ `Ctrl+F`.

---

## ♿ PHASE 4: Accessibility (A11y), Responsive & Dọn Dẹp Codebase (`a11y-debugging` & `modern-web-guidance`)

### 4.1. Chuẩn hóa Heading (`<h1>`), `aria-label`, `aria-hidden` và Độ tương phản
- **Files**:
  - [web/src/components/layout/TopHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/TopHeader.tsx)
  - [web/src/components/calendar/CalendarHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/calendar/CalendarHeader.tsx)
  - [web/src/components/day-detail/DayHeaderCard.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/day-detail/DayHeaderCard.tsx)
  - [web/src/app/holidays/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/holidays/page.tsx)
  - [web/src/components/layout/Footer.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/Footer.tsx)
- **Công việc**:
  - [x] Thêm `aria-hidden="true"` cho tất cả icon `<span className="material-symbols-outlined">`.
  - [x] Thêm `aria-label` tiếng Việt cho các nút chuyển tháng Trước/Sau, nút cuộn ngang Giờ Hoàng Đạo / Danh mục sự kiện, và bọc ô tìm kiếm sự kiện trong thẻ `<search>`.
  - [x] Đổi `<h1 className="hidden sm:block">Lịch Việt</h1>` trong `TopHeader.tsx` thành `<span>`, đặt `<h1>` chính xác cho tiêu đề trang Ngày (`DayHeaderCard.tsx`) và Lịch tháng.
  - [x] Thay `h-screen` bằng `min-h-dvh lg:h-dvh` và nâng độ tương phản chữ ở `Footer.tsx` từ `text-slate-400` lên `text-slate-600`.

### 4.2. Dọn dẹp các Legacy Component chứa import `FengShuiRepository` (1MB JSON)
- **Files**:
  - `web/src/components/calendar/DayCell.tsx`, `CalendarGrid.tsx`, `CalendarGridNew.tsx`, `DayDetailPanel.tsx`, `MonthHeader.tsx`
  - `web/src/components/common/TodayWidget.tsx`
  - `web/src/components/day-detail/DayDetailContent.tsx`
  - `web/src/lib/fengshui/FengShuiRepository.ts`, `web/src/lib/quotes/QuoteRepository.ts`
- **Công việc**:
  - [x] Xóa các component cũ không còn sử dụng và gỡ khỏi các file barrel `index.ts` để đảm bảo không bao giờ vô tình bundle 1MB JSON vào client.

---

## 💡 PHASE 5: Tính Năng Mở Rộng Giá Trị Cao (Product Enhancements)

- [x] **5.1. Bộ chọn nhanh Tháng/Năm & Đổi Ngày Dương ↔ Ngày Âm**: Thêm Popover khi bấm vào tiêu đề `Tháng X, YYYY` trên `CalendarHeader` cho phép nhảy nhanh tới bất kỳ ngày Dương hoặc ngày Âm nào.
- [x] **5.2. Bộ lọc "Tìm Ngày Tốt Theo Công Việc"**: Cho phép lọc các ngày Hoàng Đạo / điểm cao trong tháng phù hợp với *Cưới hỏi, Khai trương, Động thổ, Xuất hành, Nhập trạch*.
- [x] **5.3. Dynamic OpenGraph Image (`/day/[date]/opengraph-image.tsx`)**: Tự động sinh ảnh preview chứa Ngày Dương, Ngày Âm, Can Chi và Giờ Hoàng Đạo khi chia sẻ link ngày lên Zalo / Facebook.

---

## ✅ Kết Quả Kiểm Thử & Xác Minh (Verification Results — Đã hoàn tất 100%)

1. **Kiểm tra Build & Type-check**:
   - [x] Chạy `cd web && npx tsc --noEmit && npm run build` đạt **0 lỗi TypeScript**, biên dịch thành công 11/11 route tĩnh & động (bao gồm `/day/[date]/opengraph-image`).
2. **Kiểm tra HTML/XML xuất ra (`.next/server/app/`)**:
   - [x] Xác nhận `<title>` trên mọi trang không còn lặp `| Lịch Việt | Lịch Việt`.
   - [x] Xác nhận `property="og:image"` xuất hiện trên tất cả các trang (`index.html`, `holidays.html`, `download.html`, `privacy.html`, `terms.html`, `_not-found.html`, `/day/[date]`).
   - [x] Xác nhận `h1_count: 1` duy nhất trên mọi trang và `index.html` được render SSR đầy đủ (không còn bị `BAILOUT_TO_CLIENT_SIDE_RENDERING`).
   - [x] Xác nhận `sitemap.xml` xuất chính xác **1.100 URL** hợp lệ (`2025-01-01` → `2027-12-31`), **0 URL** năm 2028.
3. **Kiểm tra Giao diện & Network**:
   - [x] Xác nhận `raw_icon_spans: 0` — toàn bộ icon hiển thị bằng inline SVG (`MaterialIcon`), không còn hiện chữ `ark_mo`, `chevron_left`, `check_circle`, `cancel`, `format_quote`.
   - [x] Xác nhận thẻ *"Nên làm"* / *"Kiêng kỵ"* giữ đúng nền sáng đồng nhất khi bật OS Dark Mode (`darkMode: "class"`).
   - [x] Xác nhận mở trang chủ không còn bắn 42+ request prefetch `/day/...` trên tab Network (`prefetch={false}`).
