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
    <footer className="py-6 text-center space-y-3">
      {/* 12-Month Hub Links for Fast Navigation & Shallow Crawl Depth */}
      <nav
        aria-label="Lịch âm dương 12 tháng năm 2026"
        className="flex items-center justify-center gap-x-3 gap-y-1.5 text-xs flex-wrap max-w-3xl mx-auto px-2"
      >
        <span className="font-bold text-slate-600">Lịch năm 2026:</span>
        {MONTH_LINKS.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            prefetch={false}
            className="text-slate-600 hover:text-slate-900 hover:underline transition-colors"
          >
            {m.label}
          </Link>
        ))}
      </nav>

      {/* Main Footer Links */}
      <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
        <Link
          href="/doi-ngay-am-duong"
          className="text-slate-600 hover:text-slate-900 underline transition-colors font-semibold"
        >
          Đổi ngày Âm Dương
        </Link>
        <span className="text-slate-400" aria-hidden="true">
          •
        </span>
        <Link
          href="/xem-ngay-tot"
          className="text-slate-600 hover:text-slate-900 underline transition-colors font-semibold"
        >
          Xem ngày tốt
        </Link>
        <span className="text-slate-400" aria-hidden="true">
          •
        </span>
        <Link
          href="/holidays"
          className="text-slate-600 hover:text-slate-900 underline transition-colors"
        >
          Sự kiện & Ngày lễ
        </Link>
        <span className="text-slate-400" aria-hidden="true">
          •
        </span>
        <Link
          href="/download"
          className="text-slate-600 hover:text-slate-900 underline transition-colors"
        >
          Tải ứng dụng
        </Link>
        <span className="text-slate-400" aria-hidden="true">
          •
        </span>
        <Link
          href="/privacy"
          className="text-slate-600 hover:text-slate-900 underline transition-colors"
        >
          Chính sách bảo mật
        </Link>
        <span className="text-slate-400" aria-hidden="true">
          •
        </span>
        <Link
          href="/terms"
          className="text-slate-600 hover:text-slate-900 underline transition-colors"
        >
          Điều khoản sử dụng
        </Link>
        <span className="text-slate-400" aria-hidden="true">
          •
        </span>
        <a
          href="mailto:bradley.dev578@gmail.com"
          className="text-slate-600 hover:text-slate-900 underline transition-colors"
        >
          Liên hệ hỗ trợ
        </a>
      </div>
      <p className="text-sm text-slate-500">
        © 2026 Lịch Việt - Vạn Sự An Lành
      </p>
    </footer>
  );
}
