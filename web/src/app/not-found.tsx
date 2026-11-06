import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang",
  description: "Trang bạn đang tìm kiếm không tồn tại. Quay lại trang chủ Lịch Việt để xem lịch âm dương và phong thủy.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#1a2e2b] to-[#0f1f1c] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4">
            <span className="text-5xl">🔍</span>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-bold text-white mb-2">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[#9cbab2] mb-4">
          Không tìm thấy trang
        </h2>

        {/* Description */}
        <p className="text-[#7a9a92] mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          khả dụng.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
          >
            <span>🏠</span>
            Về trang chủ
          </Link>

          <Link
            href="/holidays"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/10"
          >
            <span>🎉</span>
            Xem sự kiện
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-[#7a9a92] mb-4">Có thể bạn muốn xem:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/"
              className="text-sm text-[#9cbab2] hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              📅 Lịch hôm nay
            </Link>
            <Link
              href="/holidays"
              className="text-sm text-[#9cbab2] hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              🎊 Ngày lễ
            </Link>
            <Link
              href="/download"
              className="text-sm text-[#9cbab2] hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              📱 Tải ứng dụng
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-[#5a7a72]">
          Lịch Việt - Vạn Sự An Lành
        </p>
      </div>
    </div>
  );
}
