# Hướng Dẫn Triển Khai Web Lịch Việt lên Vercel

## 📋 Yêu Cầu Trước Khi Triển Khai

- [x] Tài khoản [Vercel](https://vercel.com) (miễn phí)
- [x] Tài khoản [GitHub](https://github.com)
- [x] Domain `lichviet.online` đã được mua và sẵn sàng

---

## 🚀 Cách 1: Triển Khai Qua Vercel Dashboard (Khuyến nghị)

### Bước 1: Push Code lên GitHub

```bash
# Trong thư mục gốc của project
cd /path/to/lich-viet-van-su-an-lanh

# Khởi tạo git nếu chưa có
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit - Lich Viet Web"

# Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/lich-viet-web.git

# Push lên GitHub
git push -u origin main
```

### Bước 2: Kết Nối Vercel với GitHub

1. Truy cập [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Chọn repository `lich-viet-web` (hoặc tên bạn đặt)
4. Vercel sẽ tự động detect Next.js project

### Bước 3: Cấu Hình Project

Trong màn hình **Configure Project**:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (tự động detect) |
| **Root Directory** | `web` |
| **Build Command** | `npm run build` (mặc định) |
| **Output Directory** | `.next` (mặc định) |
| **Install Command** | `npm install` (mặc định) |

> ⚠️ **Quan trọng**: Vì project có cấu trúc monorepo, cần set **Root Directory** = `web`

### Bước 4: Deploy

1. Click **"Deploy"**
2. Đợi 1-2 phút để build hoàn tất
3. Vercel sẽ cấp domain tạm: `lich-viet-xxx.vercel.app`

---

## 🌐 Cấu Hình Domain Tùy Chỉnh

### Bước 1: Thêm Domain trong Vercel

1. Vào **Project Settings** → **Domains**
2. Nhập `lichviet.online`
3. Click **Add**

### Bước 2: Cấu Hình DNS

Vercel sẽ hiển thị các DNS records cần thêm. Vào nhà cung cấp domain của bạn và thêm:

**Option A: Dùng Vercel DNS (Khuyến nghị)**

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

**Option B: Dùng CNAME**

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | `cname.vercel-dns.com` |
| CNAME | www | `cname.vercel-dns.com` |

> 💡 DNS có thể mất 5 phút - 48 giờ để propagate

### Bước 3: Bật HTTPS

Vercel tự động cấp SSL certificate miễn phí. Sau khi DNS propagate, HTTPS sẽ tự động hoạt động.

---

## 🔧 Cách 2: Triển Khai Qua Vercel CLI

### Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

```bash
# Di chuyển vào thư mục web
cd web

# Deploy lần đầu (sẽ tạo project mới)
vercel

# Deploy production
vercel --prod
```

### Cấu hình khi được hỏi:

```
? Set up and deploy? Yes
? Which scope? Your Account
? Link to existing project? No
? What's your project's name? lich-viet-web
? In which directory is your code located? ./
? Want to override settings? No
```

---

## ⚙️ Environment Variables (Nếu cần)

Nếu sau này cần thêm biến môi trường:

1. Vào **Project Settings** → **Environment Variables**
2. Thêm các biến cần thiết:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://lichviet.online` | Production |

---

## 📊 Cấu Hình Vercel Analytics (Tùy chọn)

### Bật Web Analytics

1. Vào **Project** → **Analytics**
2. Click **Enable**
3. Vercel sẽ tự động inject analytics script

### Bật Speed Insights

1. Vào **Project** → **Speed Insights**
2. Click **Enable**

---

## 🔄 Auto Deploy

Sau khi setup, mỗi lần push code lên GitHub:

- **Push to `main`** → Auto deploy to Production
- **Push to other branches** → Auto deploy Preview

---

## 🛠️ Troubleshooting

### Lỗi: "Root Directory not found"

```
Giải pháp: Đảm bảo Root Directory = "web" trong Project Settings
```

### Lỗi: Build failed - Module not found

```bash
# Chạy local để kiểm tra
cd web
npm install
npm run build
```

### Lỗi: Domain không hoạt động

1. Kiểm tra DNS đã propagate: [dnschecker.org](https://dnschecker.org)
2. Đảm bảo DNS records đúng
3. Đợi tối đa 48 giờ

### Lỗi: 404 trên các routes

Đảm bảo `next.config.ts` không có cấu hình sai:

```typescript
// next.config.ts
const nextConfig = {
  // Không cần cấu hình đặc biệt cho Vercel
};

export default nextConfig;
```

---

## 📁 Cấu Trúc Files Quan Trọng

```
web/
├── public/
│   ├── favicon.ico          # Browser tab icon
│   ├── icon-192.png         # PWA icon
│   ├── icon-512.png         # PWA icon large
│   ├── apple-touch-icon.png # iOS icon
│   ├── og-image.webp        # Social share image
│   ├── manifest.json        # PWA manifest
│   └── robots.txt           # SEO crawlers
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout với SEO metadata
│       ├── page.tsx         # Homepage
│       ├── sitemap.ts       # Dynamic sitemap
│       └── ...
├── package.json
└── next.config.ts
```

---

## ✅ Checklist Sau Khi Deploy

- [ ] Website load được tại `https://lichviet.online`
- [ ] HTTPS hoạt động (có 🔒 trên browser)
- [ ] Favicon hiển thị đúng
- [ ] Test share link trên Facebook/Twitter (kiểm tra OG image)
- [ ] Kiểm tra `/sitemap.xml` accessible
- [ ] Kiểm tra `/robots.txt` accessible
- [ ] Submit sitemap lên [Google Search Console](https://search.google.com/search-console)
- [ ] Test trên mobile

---

## 🔗 Links Hữu Ích

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Google Search Console](https://search.google.com/search-console)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, liên hệ: **bradley.dev578@gmail.com**
