"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 text-center space-y-3">
      <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
        <Link
          href="/download"
          className="text-slate-400 hover:text-slate-600 underline transition-colors"
        >
          Tải ứng dụng
        </Link>
        <span className="text-slate-300">•</span>
        <Link
          href="/privacy"
          className="text-slate-400 hover:text-slate-600 underline transition-colors"
        >
          Chính sách bảo mật
        </Link>
        <span className="text-slate-300">•</span>
        <Link
          href="/terms"
          className="text-slate-400 hover:text-slate-600 underline transition-colors"
        >
          Điều khoản sử dụng
        </Link>
        <span className="text-slate-300">•</span>
        <a
          href="mailto:bradley.dev578@gmail.com"
          className="text-slate-400 hover:text-slate-600 underline transition-colors"
        >
          Liên hệ hỗ trợ
        </a>
      </div>
      <p className="text-sm text-slate-400">
        © 2026 Lịch Việt - Vạn Sự An Lành
      </p>
    </footer>
  );
}
