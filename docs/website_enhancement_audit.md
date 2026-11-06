# Báo Cáo Phân Tích & Đề Xuất Nâng Cấp `lichviet.online`

Báo cáo này tổng hợp kết quả phân tích trực tiếp từ giao diện thực tế trên trình duyệt, file build (`.next/server/app/`) và mã nguồn nhánh `web/` của **Lịch Việt Vạn Sự An Lành (`https://www.lichviet.online/`)** thông qua các bộ skill chuyên dụng:
- **Semrush Skills**: **`technical-seo-audit`**, **`schema-markup`**, **`internal-link-audit`**
- **Web & Chrome DevTools Skills**: **`modern-web-guidance`**, **`debug-optimize-lcp`**, **`a11y-debugging`**

---

## 📸 Phân Tích Trực Tiếp Từ Ảnh Chụp Màn Hình Thực Tế (`lichviet.online`)

![Ảnh chụp màn hình lỗi hiển thị label icon, lỗi nền tối thẻ Nên làm/Kiêng kỵ và bão request prefetch trên lichviet.online](/Users/bangca/.gemini/antigravity/brain/9a320318-14f6-40b5-b10b-623ebf8af1ea/.user_uploaded/media_1793935447887_4541ac9d.jpg)

Quan sát trực tiếp trên ảnh chụp màn hình của bạn ghi nhận **3 lỗi hiển thị & hiệu năng nghiêm trọng đang xảy ra ngay trên bản Production**:

1. **Lỗi hiển thị chữ label của toàn bộ Icon (`ark_mo`, `calendar_month`, `celebration`, `chevron_left`, `chevron_right`, `today`, `schedule`, `check_circle`, `cancel`, `format_quote`)**:
   - **Vị trí mã nguồn**: [MaterialSymbolsLoader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/common/MaterialSymbolsLoader.tsx#L18-L24).
   - **Nguyên nhân gốc rễ (Root Cause)**:
     Trong [MaterialSymbolsLoader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/common/MaterialSymbolsLoader.tsx#L22), URL gọi Google Fonts CSS2 API đang viết:
     ```ts
     link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
     ```
     Theo chuẩn của **Google Fonts API v2**, tên các trục biến thiên (axis tags) **bắt buộc phải xếp theo thứ tự bảng chữ cái ASCII** (chữ hoa đứng trước chữ thường: `FILL,wght@0..1,100..700` chứ không được viết `wght,FILL@100..700,0..1`). Vì viết ngược `wght,FILL`, Google Fonts trả về lỗi **HTTP 400 Bad Request**, khiến stylesheet định nghĩa `.material-symbols-outlined` không bao giờ được tải về! Hệ quả là toàn bộ các thẻ `<span className="material-symbols-outlined">` hiển thị nguyên chuỗi tên tiếng Anh bằng font chữ có chân (serif) mặc định của trình duyệt, làm tràn vỡ nút Logo (`ark_mo`), nút cuộn giờ Hoàng Đạo (`chevron_right` đè lên thẻ giờ Thìn) và toàn bộ các nhãn trên trang.
   - **Giải pháp khắc phục triệt để**:
     - **Phương án A (Khuyến nghị tốt nhất theo `modern-web-guidance: icons`)**: Thay thế toàn bộ ~15 icon đang dùng bằng **Inline SVG component** (hoặc `lucide-react`). Không cần tải font >200KB từ bên thứ 3, hiển thị tức thì ngay từ SSR HTML đầu tiên, **không bao giờ bị lỗi hiện chữ label** và triệt tiêu hoàn toàn CLS.
     - **Phương án B**: Sửa lại URL đúng chuẩn `family=Material+Symbols+Outlined:FILL,wght@0..1,100..700&display=swap` đặt trực tiếp trong `<head>` của [layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/layout.tsx), đồng thời thêm CSS phòng thủ trong [globals.css](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/globals.css) (`overflow: hidden; width: 1em; height: 1em; display: inline-block;`) để không bao giờ tràn chữ ngay cả khi mạng chậm.

2. **Lỗi 2 thẻ "Nên làm" và "Kiêng kỵ" bị chuyển sang nền đen (`#1a2e2b` và `#2a1d1d`) lệch tông với toàn trang**:
   - Như thấy rõ ở góc dưới bên phải ảnh chụp màn hình, khi máy Mac/trình duyệt của bạn bật Dark Mode, 2 hộp *"Nên làm"* và *"Kiêng kỵ"* bị biến thành màu đen thẫm do class `dark:bg-[#1a2e2b]` và `dark:bg-[#2a1d1d]` trong [DayDetailPanelClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/DayDetailPanelClient.tsx#L180-L225), trong khi [tailwind.config.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/tailwind.config.ts) chưa cấu hình `darkMode: "class"`.

3. **Bão 42+ request prefetch (`2026-11-01`, `2026-11-02`, ... `2026-12-01`) trong tab Network (cột bên phải ảnh chụp màn hình)**:
   - Trong [CalendarGridClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/CalendarGridClient.tsx#L157), cả 42 ô ngày trong bảng lịch đều bọc `<Link href="/day/YYYY-MM-DD">` mà không đặt `prefetch={false}`. Ngay khi trang chủ vừa mở, Next.js tự động bắn hàng chục request prefetch cho tất cả các ngày trong lưới lịch, gây nghẽn băng thông đầu trang.

---

## 📊 Bảng Phạm Vi & Nguồn Bằng Chứng (Evidence Coverage)

| Phân loại bằng chứng | Nguồn kiểm tra | Phạm vi | Ngày/Snapshot | Giới hạn |
| :--- | :--- | :--- | :--- | :--- |
| **Visual & DevTools Screenshot** | Ảnh chụp màn hình thực tế `lichviet.online` trên Chrome macOS | Trang chủ `/` (View + Network panel) | 2026-11-06 | Xác nhận trực quan lỗi hiển thị icon label, lỗi Dark Mode và bão prefetch. |
| **Semrush MCP** | `semrush_mcp` (`projects`, `domain_overview`, `organic_research`, `keyword_research`, `competitors_research`, `backlinks_research`) | Tài khoản Semrush đã kết nối | 2026-11-06 | Tài khoản hiện hết API units (`no_api_units`). |
| **Built HTML & Sitemap Inspection** | `web/.next/server/app/*.html`, `sitemap.xml.body` | Toàn bộ các route tĩnh & động (`/`, `/holidays`, `/download`, `/privacy`, `/terms`, `/day/[date]`) | Build snapshot `2026-01-21` | Kiểm tra trực tiếp HTML xuất ra từ Next.js App Router. |
| **Source Code Audit** | `web/src/**` | Toàn bộ Components, Layouts, API Routes, Repositories | Hiện tại | Kết hợp quy chuẩn từ `technical-seo-audit`, `schema-markup`, `internal-link-audit`, `modern-web-guidance`. |

---

## 🚨 1. Tổng Hợp Các Lỗi Nghiêm Trọng (Critical Bugs) Cần Sửa Ngay

> [!CAUTION]
> 6 lỗi dưới đây đang trực tiếp gây lỗi giao diện (hiển thị chữ tên icon, lệch màu nền tối), gây nghẽn mạng (42+ prefetch requests), đóng băng dữ liệu SSR ở ngày build và làm lệch ngày trên Googlebot.

### 1.1. Lỗi hiển thị chữ Label của Icon trên toàn trang (HTTP 400 từ Google Fonts)
- **Vị trí**: [MaterialSymbolsLoader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/common/MaterialSymbolsLoader.tsx#L22), [TopHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/TopHeader.tsx#L31-L66), [CalendarHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/calendar/CalendarHeader.tsx#L33-L59), [HomeClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/HomeClient.tsx#L211-L635), [DayDetailPanelClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/DayDetailPanelClient.tsx#L183-L363).
- **Hiện tượng**: Hiển thị chữ `ark_mo`, `calendar_month`, `celebration`, `chevron_left`, `chevron_right`, `today`, `schedule`, `check_circle`, `cancel`, `format_quote` thay vì icon.
- **Cách khắc phục**: Thay bằng bộ SVG Icon component nhẹ, sắc nét (hoặc sửa trục font thành `FILL,wght@0..1,100..700` trong `<head>`).

### 1.2. Trang chủ (`index.html`) bị đóng băng tĩnh ở ngày Build (`2026-01-21`)
- **Vị trí**: [page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/page.tsx#L18-L43) và `.next/server/app/index.html`.
- **Bằng chứng thực tế**: Trong file build `.next/server/app/index.html`, dữ liệu SSR bị đóng cứng tại thời điểm chạy `next build`: `initialDate: "2026-01-21T06:25:13.655Z"`.
- **Cách khắc phục**: Thêm `export const revalidate = 3600;` vào [page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/page.tsx) và tính ngày hiện tại theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh`).

### 1.3. Lỗi lệch 1 ngày theo múi giờ (`new Date("YYYY-MM-DD")`) trên trang `/day/[date]`
- **Vị trí**: [day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx#L18-L46) và [DayDetailContentClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/day-detail/DayDetailContentClient.tsx#L33).
- **Nguyên nhân**: `new Date("2026-11-06")` parse theo UTC (`00:00Z`), khiến Googlebot (ở múi giờ Mỹ UTC-5/UTC-8) hiểu thành ngày `2026-11-05`.
- **Cách khắc phục**: Parse chuỗi `YYYY-MM-DD` thành số nguyên `new Date(year, month - 1, day)`.

### 1.4. Mất tác dụng SSR của bảng Chi tiết ngày trên Trang chủ do `isLoading = true`
- **Vị trí**: [HomeClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/HomeClient.tsx#L51-L52).
- **Nguyên nhân**: Khởi tạo `useState<DayFengShuiData | null>(null)` và `isLoading = useState(true)` làm HTML ban đầu chỉ render khung xương xám `animate-pulse`.
- **Cách khắc phục**: Khởi tạo `useState(initialFengShuiData)` và `useState(false)`.

### 1.5. Lỗi xung đột Dark Mode ở thẻ "Nên làm" / "Kiêng kỵ"
- **Vị trí**: [tailwind.config.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/tailwind.config.ts#L3-L9) và [DayDetailPanelClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/DayDetailPanelClient.tsx#L180-L225).
- **Cách khắc phục**: Thêm `darkMode: "class"` vào [tailwind.config.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/tailwind.config.ts) và đồng bộ màu nền sáng cho các thẻ trong `DayDetailPanelClient.tsx`.

### 1.6. Bão 42+ request Prefetch & Chuyển trang ngoài ý muốn khi click ô ngày trên Trang chủ
- **Vị trí**: [CalendarGridClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/CalendarGridClient.tsx#L157-L162).
- **Cách khắc phục**: Thêm `prefetch={false}` vào `<Link>` trong `CalendarDayCellClient`, và nếu truyền `onSelect` (như ở trang chủ), dùng nút chọn ngày tại chỗ (hoặc `e.preventDefault()`) để cập nhật ngay cột `DayDetailPanelClient` bên phải mà không tải lại cả trang; người dùng muốn xem trang riêng chỉ cần bấm vào thẻ chi tiết ngày bên phải.

---

## 🔍 2. Kiểm Toán Kỹ Thuật SEO (`technical-seo-audit`)

| Ưu tiên | Hạng mục | URL / Pattern bị ảnh hưởng | Bằng chứng thu thập được | Đánh giá & Nguyên nhân | Hành động khắc phục | Độ tin cậy |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **P1** | **Sitemap & 404/Soft-404** | `/day/2028-01-01` → `/day/2028-12-31` (366 URLs) | [sitemap.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/sitemap.ts#L8) sinh URL đến `today.getFullYear() + 2`, nhưng [FengShuiServerRepository.ts](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/lib/fengshui/FengShuiServerRepository.ts#L116) chỉ có data `2025, 2026, 2027`. | **Confirmed defect**: 1/3 số URL trong `sitemap.xml` dẫn tới trang rỗng dữ liệu phong thủy (`Ngày —`, `Tháng —`). Ngoài ra `/day/abc` không trả về HTTP 404. | Chỉ sinh sitemap cho các năm có trong `FengShuiServerRepository.getAvailableYears()`, và gọi `notFound()` trong [day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx) nếu ngày sai định dạng hoặc ngoài vùng dữ liệu. | Cao |
| **P1** | **Title Tags bị lặp thương hiệu** | `/holidays`, `/download`, `/privacy`, `/terms`, `/day/[date]`, `404` | HTML build thực tế:<br>`<title>Ngày Lễ & Sự Kiện Việt Nam 2026 \| Lịch Việt \| Lịch Việt</title>`<br>`<title>Tải Ứng Dụng Lịch Việt \| iOS & Android \| Lịch Việt</title>` | **Confirmed defect**: [layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/layout.tsx#L31) đã có `template: "%s \| Lịch Việt"`, nhưng các trang con lại tự nối thêm `\| Lịch Việt`. | Bỏ hậu tố `\| Lịch Việt` thừa ở tất cả layout/page con; bổ sung Ngày Âm + Can Chi vào `<title>` và `description` của `/day/[date]`. | Cao |
| **P1** | **Mất `og:image` trên toàn bộ trang con** | `/holidays`, `/download`, `/privacy`, `/terms`, `/day/[date]` | Kiểm tra `.next/server/app/*.html`: chỉ `index.html` và `_not-found.html` có `property="og:image"`. | **Confirmed defect**: Trong Next.js, khai báo `openGraph` ở trang con sẽ ghi đè nông (shallow replace) toàn bộ object `openGraph` của root layout, làm mất mảng `images: ["/og-image.webp"]`. | Thêm `images: ["/og-image.webp"]` và `siteName` vào `openGraph` của các trang con. | Cao |
| **P2** | **Heading Hierarchy (`<h1>`)** | `/`, `/day/[date]` | Trên mobile (`< 640px`), `<h1 className="hidden sm:block">Lịch Việt</h1>` trong [TopHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/TopHeader.tsx#L35) bị ẩn (`display: none`); còn [DayHeaderCard.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/day-detail/DayHeaderCard.tsx#L47) dùng thẻ `<p>` cho ngày. | **Platform/A11y defect**: Trang chủ trên mobile không có `<h1>` hiển thị; trang `/day/[date]` dùng `<h1>` là chữ "Lịch Việt" trên header thay vì tiêu đề của Ngày đang xem. | Đổi logo trên `TopHeader` thành `<span>`, và đặt `<h1>` đúng cho nội dung chính của từng trang. | Cao |
| **P3** | **Metadata Author URL sai tên miền** | Toàn site | [layout.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/layout.tsx#L50): `authors: [{ name: "Lịch Việt Team", url: "https://lichviet.vn" }]` | **Confirmed defect**: Trỏ nhầm sang domain khác (`lichviet.vn`). | Đổi thành `https://lichviet.online`. | Cao |

---

## 🧩 3. Kiểm Toán Schema Markup & JSON-LD (`schema-markup`)

| Ưu tiên | Schema Type | Vị trí | Vấn đề phát hiện | Hậu quả & Cách sửa theo chuẩn Google / Schema.org |
| :---: | :--- | :--- | :--- | :--- |
| **P1** | `WebSite` (`SearchAction`) | [JsonLd.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/seo/JsonLd.tsx#L12-L19) | Khai báo `urlTemplate: "https://lichviet.online/day/{search_term_string}"` trong khi route `/day/[date]` chỉ nhận `YYYY-MM-DD`. | Xóa `potentialAction` không hợp lệ khỏi `WebsiteJsonLd` và thêm `@id: "https://lichviet.online/#website"`. |
| **P1** | `SoftwareApplication` | [JsonLd.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/seo/JsonLd.tsx#L56-L75) | 1. Đã viết hàm nhưng **chưa render** trên [download/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/download/page.tsx).<br>2. Hardcode `aggregateRating: { ratingValue: '4.8', ratingCount: '1000' }` không hiển thị trên trang.<br>3. Ghi `operatingSystem: 'iOS, Android'` trong khi bản Android trên trang ghi *"Sắp ra mắt"*. | Bỏ `aggregateRating` giả định (tránh vi phạm chính sách Rich Results của Google), sửa `operatingSystem: "iOS 15.0+"` khớp với nội dung hiển thị trên `/download`, và render vào `download/layout.tsx`. |
| **P1** | `Article` & `BreadcrumbList` (`DayPageJsonLd`) | [JsonLd.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/seo/JsonLd.tsx#L89-L144) | 1. Đã viết trong `JsonLd.tsx` nhưng **chưa được gắn vào** [day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx).<br>2. Dùng `datePublished: new Date().toISOString()` thay đổi liên tục mỗi lần request.<br>3. Thiếu `mainEntityOfPage` / `url` và `image`. | Gắn `DayPageJsonLd` + `BreadcrumbJsonLd` vào [day/[date]/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/day/[date]/page.tsx), thêm `url: "https://lichviet.online/day/${date}"` và `image: "https://lichviet.online/og-image.webp"`. |

---

## 🕸️ 4. Kiểm Toán Liên Kết Nội Bộ & Accessibility (`internal-link-audit` & `a11y-debugging`)

| Ưu tiên | Hạng mục | Vị trí | Vấn đề phát hiện | Hành động khuyến nghị |
| :---: | :--- | :--- | :--- | :--- |
| **P1** | **Crawl Depth >30–300 clicks cho các tháng khác** | [CalendarHeader.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/calendar/CalendarHeader.tsx#L28-L60) & [Footer.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/layout/Footer.tsx) | Nút chuyển tháng chỉ dùng `<button onClick>` thuần JS, không có liên kết `<a href>` sang các tháng khác trong năm. | Thêm danh sách liên kết nhanh 12 tháng trong năm (`Tháng 1` .. `Tháng 12`) dưới chân trang hoặc dưới lịch để giảm Crawl Depth xuống ≤ 3 clicks. |
| **P2** | **Nội dung Accordion bị ẩn khỏi DOM** | [InfoSections.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/InfoSections.tsx#L179) | Dùng `{expandedId === item.id && (...)}` khiến nội dung *28 Sao, 12 Trực, Giờ Hoàng Đạo* không có trong HTML khi tải trang. | Chuyển sang phần tử `<details>` & `<summary>` chuẩn HTML5 để hỗ trợ SEO và `Ctrl+F`. |
| **P2** | **Thiếu `aria-label` & `aria-hidden` cho icon/button** | Toàn site | Các nút chỉ có icon (`chevron_left`, `chevron_right`, `close`) thiếu `aria-label`; các icon trang trí thiếu `aria-hidden="true"`. | Bổ sung đầy đủ `aria-label` tiếng Việt cho các nút điều hướng và `aria-hidden="true"` cho toàn bộ icon. |
| **P3** | **Khóa chiều cao `h-screen overflow-hidden` trên mobile** | [HomeClient.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/components/home/HomeClient.tsx#L151), [holidays/page.tsx](file:///Users/bangca/bangca/personal/lich-viet-van-su-an-lanh/web/src/app/holidays/page.tsx#L58) | Cản trở thanh địa chỉ động trên trình duyệt di động (iOS Safari / Chrome Android). | Đổi sang `min-h-dvh` hoặc `lg:h-dvh`. |
