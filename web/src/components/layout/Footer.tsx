"use client";

import Link from "next/link";

const MONTH_LINKS = Array.from({ length: 12 }, (_, idx) => {
  const monthNum = idx + 1;
  const padded = String(monthNum).padStart(2, "0");
  return {
    label: `Tháng ${monthNum}`,
    href: `/day/2026-${padded}-01`,
  };
});

export function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 mt-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-sm text-center space-y-3.5">
        {/* 12-Month Hub Links for Fast Navigation & Shallow Crawl Depth */}
        <nav
          aria-label="Lịch âm dương 12 tháng năm 2026"
          className="flex items-center justify-center gap-x-2.5 gap-y-1.5 text-xs flex-wrap max-w-4xl mx-auto"
        >
          <span className="font-extrabold text-slate-700">
            12 Sắc Màu Bốn Mùa 2026:
          </span>
          {MONTH_LINKS.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              prefetch={false}
              className="px-2 py-0.5 rounded-lg bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
            >
              {m.label}
            </Link>
          ))}
        </nav>

        {/* Main Footer Links */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap pt-1 border-t border-slate-100">
          <Link
            href="/"
            className="text-slate-700 hover:text-slate-950 font-bold hover:underline transition-colors"
          >
            Lịch Treo Tường V2
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            •
          </span>
          <Link
            href="/doi-ngay-am-duong"
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors font-semibold"
          >
            Đổi ngày Âm Dương
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            •
          </span>
          <Link
            href="/xem-ngay-tot"
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors font-semibold"
          >
            Xem ngày tốt
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            •
          </span>
          <Link
            href="/holidays"
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors font-semibold"
          >
            Sự kiện & Ngày lễ
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            •
          </span>
          <Link
            href="/download"
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors"
          >
            Tải ứng dụng
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            •
          </span>
          <Link
            href="/privacy"
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors"
          >
            Chính sách bảo mật
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            •
          </span>
          <Link
            href="/terms"
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors"
          >
            Điều khoản sử dụng
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            •
          </span>
          <a
            href="mailto:bradley.dev578@gmail.com"
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
        <p className="text-xs text-slate-400">
          © 2026 Lịch Việt — Vạn Sự An Lành • Chuẩn Ngọc Hạp Thông Thư & Hiệp Kỷ Biện Phương Thư
        </p>
      </div>
    </footer>
  );
}
