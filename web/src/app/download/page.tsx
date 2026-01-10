"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getMonthTheme } from "@/lib/theme";
import { TopHeader, Footer } from "@/components/layout";

export default function DownloadPage() {
  const today = new Date();
  const theme = useMemo(() => getMonthTheme(today.getMonth() + 1), []);

  return (
    <div
      className="relative flex flex-col min-h-screen w-full overflow-hidden font-[Manrope] antialiased"
      style={{ backgroundColor: theme.background }}
    >
      {/* Decorative blur circles */}
      <div
        className="glow-circle w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] top-[-100px] lg:top-[-150px] left-[-50px] lg:left-[-100px]"
        style={{ backgroundColor: theme.blurCircle1 }}
      />
      <div
        className="glow-circle w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bottom-[-50px] lg:bottom-[-100px] right-[-50px] lg:right-[-100px]"
        style={{ backgroundColor: theme.blurCircle2 }}
      />

      {/* Top Header */}
      <TopHeader theme={theme} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10 pb-8">
        <div className="px-4 lg:px-8 py-6 lg:py-12 flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            {/* Hero Section */}
            <div className="text-center mb-10">
              {/* App Icon */}
              <div
                className="inline-flex items-center justify-center size-24 lg:size-28 rounded-3xl shadow-2xl mb-6"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryAccent}, ${theme.primaryAccent}cc)`,
                  boxShadow: `0 20px 40px ${theme.primaryAccent}40`,
                }}
              >
                <span className="material-symbols-outlined text-white text-5xl lg:text-6xl">
                  balance
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight mb-3">
                Lịch Việt
              </h1>
              <p className="text-lg lg:text-xl text-slate-500 font-medium mb-2">
                Vạn Sự An Lành
              </p>
              <p className="text-slate-500 max-w-md mx-auto">
                Ứng dụng lịch âm Việt Nam với thông tin phong thủy, giờ hoàng đạo, 
                và hướng dẫn việc nên làm mỗi ngày.
              </p>
            </div>

            {/* Download Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* iOS App */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-14 rounded-xl bg-slate-900 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      Tải về trên
                    </p>
                    <h3 className="text-xl font-bold text-slate-800">App Store</h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 flex-1">
                  Dành cho iPhone và iPad. Yêu cầu iOS 15.0 trở lên.
                </p>

                <a
                  href="https://apps.apple.com/app/lich-viet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-98"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  <span className="material-symbols-outlined text-xl">download</span>
                  Tải App iOS
                </a>

                {/* Status badge */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-600 font-medium">Đã có trên App Store</span>
                </div>
              </div>

              {/* Android App - Coming Soon */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col opacity-75">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-14 rounded-xl bg-emerald-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 2.047a.5.5 0 0 0-.7.145l-1.46 2.22a6.46 6.46 0 0 0-6.726 0l-1.46-2.22a.5.5 0 0 0-.846.53l1.38 2.1A6.44 6.44 0 0 0 5.5 10h13a6.44 6.44 0 0 0-2.21-5.303l1.38-2.1a.5.5 0 0 0-.147-.55zM8.5 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM5 11.5v7A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5v-7H5zm-2.5 0v5a1.5 1.5 0 0 0 3 0v-5a1.5 1.5 0 0 0-3 0zm16 0v5a1.5 1.5 0 0 0 3 0v-5a1.5 1.5 0 0 0-3 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      Tải về trên
                    </p>
                    <h3 className="text-xl font-bold text-slate-800">Google Play</h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 flex-1">
                  Dành cho điện thoại và máy tính bảng Android.
                </p>

                <button
                  disabled
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-300 text-slate-500 font-bold cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">schedule</span>
                  Sắp ra mắt
                </button>

                {/* Status badge */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">Đang phát triển</span>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-800 text-center mb-6">
                Tính năng nổi bật
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "calendar_month", label: "Lịch Âm Dương" },
                  { icon: "auto_awesome", label: "Giờ Hoàng Đạo" },
                  { icon: "explore", label: "La Bàn Phong Thủy" },
                  { icon: "checklist", label: "Việc Nên Làm" },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-100"
                  >
                    <span
                      className="material-symbols-outlined text-3xl mb-2"
                      style={{ color: theme.primaryAccent }}
                    >
                      {feature.icon}
                    </span>
                    <p className="text-sm font-medium text-slate-700">{feature.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-12 text-center">
              <div className="inline-block bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-sm text-slate-500 mb-4 font-medium">
                  Quét mã QR để tải ứng dụng
                </p>
                <div className="size-40 bg-slate-100 rounded-xl mx-auto flex items-center justify-center">
                  {/* Placeholder for QR Code */}
                  <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400">
                      qr_code_2
                    </span>
                    <p className="text-xs text-slate-400 mt-2">QR Code</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  iOS App Store
                </p>
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
