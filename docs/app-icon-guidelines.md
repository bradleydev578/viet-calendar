# App Icon & Visual Assets Guidelines

## Lịch Việt Vạn Sự An Lành - Hướng dẫn thiết kế Icon

---

## 1. Yêu cầu kỹ thuật iOS App Icon

### Kích thước bắt buộc

| Kích thước | Dùng cho | Scale |
|------------|----------|-------|
| 1024x1024 | App Store (bắt buộc) | - |
| 180x180 | iPhone @3x | 60pt |
| 120x120 | iPhone @2x | 60pt |
| 167x167 | iPad Pro @2x | 83.5pt |
| 152x152 | iPad @2x | 76pt |
| 76x76 | iPad @1x | 76pt |

### Quy định Apple

- **Định dạng**: PNG (không trong suốt)
- **Hình dạng**: Vuông 1024x1024 px cho App Store
- **Alpha channel**: Không có (nền không trong suốt)
- **Bo góc**: KHÔNG tự bo góc (iOS tự động xử lý)
- **Color space**: sRGB hoặc Display P3

### Lưu ý quan trọng

- Thiết kế đơn giản, dễ nhận diện ở kích thước nhỏ
- Tránh dùng nhiều chữ (khó đọc khi thu nhỏ)
- Không dùng ảnh chụp hoặc screenshot
- Không copy icon của app khác

---

## 2. Ý tưởng thiết kế Icon

### Option 1: Lịch + Âm Dương (Khuyên dùng)

```
┌─────────────┐
│  ████████   │  ← Header màu xanh lá/đỏ
│             │
│     ☯       │  ← Biểu tượng âm dương
│             │
└─────────────┘
```

- Hình cuốn lịch với thanh header
- Bên trong có biểu tượng ☯ (âm dương)
- Đơn giản, dễ nhận diện
- Phù hợp với tên "Lịch Việt"

### Option 2: La Bàn Phong Thủy

```
      ○
    ╱   ╲
   ○  ●  ○
    ╲   ╱
      ○
```

- Hình tròn la bàn với các vòng đồng tâm
- Màu đỏ + vàng gold truyền thống
- Kim chỉ nam màu đỏ
- Phù hợp với tính năng la bàn phong thủy

### Option 3: Trăng + Chữ Việt

```
    🌙
   Cát
```

- Hình trăng lưỡi liềm (đại diện âm lịch)
- Kết hợp chữ "Cát" hoặc "Lịch"
- Màu vàng gold trên nền xanh/đỏ
- Mang tính Việt Nam

### Option 4: Chữ Hán truyền thống

| Chữ | Âm | Ý nghĩa |
|-----|-----|---------|
| 福 | Phúc | May mắn, phúc lộc |
| 吉 | Cát | Tốt lành |
| 曆 | Lịch | Lịch |
| 禄 | Lộc | Tài lộc |

- Viết trên nền tròn đỏ/vàng
- Phong cách truyền thống
- Dễ nhận diện với người dùng Việt Nam

---

## 3. Bảng màu đề xuất

### Màu chính

| Tên | Hex | RGB | Ý nghĩa |
|-----|-----|-----|---------|
| Đỏ truyền thống | `#DC2626` | 220, 38, 38 | May mắn, thịnh vượng |
| Vàng gold | `#DAA520` | 218, 165, 32 | Phú quý, sang trọng |
| Xanh lá (Primary) | `#069669` | 6, 150, 105 | Màu chủ đạo app, bình an |

### Màu phụ

| Tên | Hex | Sử dụng |
|-----|-----|---------|
| Xanh đậm | `#047857` | Gradient, shadow |
| Xanh nhạt | `#10B981` | Highlight |
| Trắng | `#FFFFFF` | Nền, text |
| Đen | `#1F2937` | Text, outline |

### Gradient đề xuất

```css
/* Gradient xanh lá */
background: linear-gradient(135deg, #10B981 0%, #047857 100%);

/* Gradient đỏ vàng (truyền thống) */
background: linear-gradient(135deg, #DC2626 0%, #DAA520 100%);

/* Gradient vàng gold */
background: linear-gradient(135deg, #F59E0B 0%, #DAA520 100%);
```

---

## 4. Phong cách thiết kế

### Khuyên dùng

- **Flat design**: Đơn giản, hiện đại, dễ scale
- **Gradient nhẹ**: Tạo depth mà không quá phức tạp
- **Geometric shapes**: Hình học cơ bản (tròn, vuông)
- **Bold colors**: Màu sắc rõ ràng, tương phản cao

### Tránh

- Quá nhiều chi tiết (khó nhìn khi thu nhỏ 29x29)
- Text dài (chỉ 1-2 ký tự nếu cần)
- Gradient phức tạp
- Drop shadow quá đậm
- Ảnh chụp thực

---

## 5. Hướng dẫn tạo Icon trên Canva

### Bước 1: Tạo canvas

1. Vào [canva.com](https://canva.com)
2. Chọn **Custom size**
3. Nhập **1024 x 1024 px**

### Bước 2: Thiết kế

1. Thêm background màu `#069669` (xanh lá)
2. Thêm shape/elements theo ý tưởng đã chọn
3. Thêm text nếu cần (chữ Hán hoặc "Cát")
4. Điều chỉnh màu sắc theo bảng màu

### Bước 3: Export

1. Click **Share** > **Download**
2. Chọn **PNG**
3. Bỏ chọn **Transparent background** (nền không trong suốt)
4. Download file

### Bước 4: Generate các sizes

Sử dụng tool online:
- [appicon.co](https://appicon.co)
- [makeappicon.com](https://makeappicon.com)
- [easyappicon.com](https://easyappicon.com)

Upload file 1024x1024, tool sẽ tự động tạo tất cả sizes cần thiết.

---

## 6. LaunchScreen Assets

### Chữ "Cát" thư pháp

- **Kích thước**: 200x100 px
- **Font**: Dancing Script SemiBold
- **Màu chữ**: `#069669`
- **Nền**: Transparent
- **Format**: PNG với 3 scales (@1x, @2x, @3x)

### Cách tạo trên Canva

1. Custom size: 200x100 px
2. Thêm text "Cát"
3. Font: Dancing Script
4. Size: ~72px
5. Color: `#069669`
6. Download PNG với transparent background

---

## 7. Checklist trước khi submit App Store

- [ ] Icon 1024x1024 không có alpha channel
- [ ] Icon không có bo góc (iOS tự bo)
- [ ] Tất cả sizes đã generate (180, 120, 167, 152, 76)
- [ ] Icon đã thêm vào Images.xcassets
- [ ] Test icon hiển thị đẹp ở size nhỏ (29x29)
- [ ] Icon không vi phạm trademark/copyright

---

## 8. Resources

### Font thư pháp

- [Dancing Script - Google Fonts](https://fonts.google.com/specimen/Dancing+Script)
- [Great Vibes - Google Fonts](https://fonts.google.com/specimen/Great+Vibes)
- [Charm - Google Fonts](https://fonts.google.com/specimen/Charm)

### Icon generators

- [appicon.co](https://appicon.co) - Miễn phí
- [makeappicon.com](https://makeappicon.com)
- [easyappicon.com](https://easyappicon.com)

### Design tools

- [Canva](https://canva.com) - Miễn phí, dễ dùng
- [Figma](https://figma.com) - Miễn phí, chuyên nghiệp
- [Photopea](https://photopea.com) - Photoshop online miễn phí

---

*Tài liệu này được tạo cho project Lịch Việt Vạn Sự An Lành*
*Cập nhật: 2026-01-03*
