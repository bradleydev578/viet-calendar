"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getMonthTheme } from "@/lib/theme";
import { TopHeader, Footer } from "@/components/layout";
import { MaterialIcon } from "@/components/common";

export default function PrivacyPolicyPage() {
  const today = new Date();
  const theme = useMemo(() => getMonthTheme(today.getMonth() + 1), []);

  return (
    <div
      className="relative flex flex-col min-h-dvh w-full overflow-hidden font-[Manrope] antialiased"
      style={{ backgroundColor: theme.background }}
    >
      {/* Decorative blur circles */}
      <div
        className="glow-circle w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] top-[-20%] left-[10%]"
        style={{ backgroundColor: `${theme.primaryAccent}15` }}
      />
      <div
        className="glow-circle w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] bottom-[-10%] right-[20%]"
        style={{ backgroundColor: `${theme.accentGold}15` }}
      />

      {/* Top Header */}
      <TopHeader theme={theme} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10 pb-8">
        <div className="px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
              <MaterialIcon name="arrow_back" className="text-sm" />
              <span className="text-sm font-medium">Quay lại</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight mb-2">
                Chính Sách Bảo Mật
              </h1>
              <p className="text-slate-500 text-sm">
                Privacy Policy • Cập nhật: 10/01/2026
              </p>
            </div>

            {/* Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100">
              {/* Vietnamese Section */}
              <section className="mb-10">
                <h2
                  className="text-xl font-bold mb-6 pb-2 border-b-2"
                  style={{ borderColor: theme.primaryAccent, color: theme.primaryAccent }}
                >
                  🇻🇳 Tiếng Việt
                </h2>

                <div className="space-y-6 text-slate-700">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">1. Giới thiệu</h3>
                    <p className="leading-relaxed">
                      Chào mừng bạn đến với ứng dụng <strong>Lịch Việt - Vạn Sự An Lành</strong>. 
                      Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này 
                      giải thích cách ứng dụng xử lý thông tin khi bạn sử dụng.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">2. Thu thập thông tin</h3>
                    <p className="leading-relaxed mb-3">
                      <strong>Ứng dụng KHÔNG thu thập thông tin cá nhân định danh</strong>, bao gồm:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Không thu thập tên, email, số điện thoại</li>
                      <li>Không thu thập vị trí địa lý chính xác</li>
                      <li>Không yêu cầu đăng nhập hoặc tạo tài khoản</li>
                    </ul>
                    <p className="leading-relaxed mt-3 mb-2">
                      <strong>Dữ liệu phân tích ẩn danh:</strong> Chúng tôi sử dụng Firebase Analytics 
                      để thu thập dữ liệu sử dụng ẩn danh nhằm cải thiện ứng dụng:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Màn hình được xem (ví dụ: Lịch, Chi tiết ngày, La bàn)</li>
                      <li>Hành động trong ứng dụng (ví dụ: chuyển tháng, chọn ngày)</li>
                      <li>Thông tin thiết bị chung (loại thiết bị, phiên bản hệ điều hành)</li>
                      <li>Báo cáo lỗi ứng dụng</li>
                    </ul>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-700">
                        <strong>Lưu ý:</strong> Tất cả dữ liệu đều ẩn danh và không thể liên kết với cá nhân bạn. 
                        Bạn có thể tắt phân tích trong Cài đặt ứng dụng.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">3. Dữ liệu được lưu trữ</h3>
                    <p className="leading-relaxed">
                      Ứng dụng chỉ lưu trữ <strong>cục bộ trên thiết bị của bạn</strong>:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600 mt-2">
                      <li>Cài đặt ứng dụng (giao diện, ngôn ngữ)</li>
                      <li>Dữ liệu lịch âm và phong thủy (được tải sẵn cùng ứng dụng)</li>
                    </ul>
                    <p className="mt-2 text-slate-600">
                      Tất cả dữ liệu này được lưu trữ <strong>hoàn toàn trên thiết bị</strong> và 
                      không được gửi đến bất kỳ máy chủ nào.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">4. Quyền truy cập thiết bị</h3>
                    <p className="leading-relaxed">
                      Ứng dụng có thể yêu cầu quyền truy cập <strong>La bàn/Cảm biến từ trường</strong> để 
                      hiển thị hướng phong thủy (tùy chọn). Bạn có thể từ chối quyền này và ứng dụng 
                      vẫn hoạt động bình thường.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">5. Chia sẻ thông tin</h3>
                    <p className="leading-relaxed">
                      Dữ liệu phân tích ẩn danh được xử lý bởi <strong>Google Firebase Analytics</strong> theo{" "}
                      <a 
                        href="https://policies.google.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: theme.primaryAccent }}
                      >
                        Chính sách bảo mật của Google
                      </a>. 
                      Chúng tôi <strong>KHÔNG chia sẻ</strong> hoặc bán thông tin cá nhân của bạn cho 
                      bất kỳ bên thứ ba nào khác.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">6. Bảo mật</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Ứng dụng hoạt động chính với dữ liệu offline</li>
                      <li>Dữ liệu phân tích được mã hóa trong quá trình truyền tải</li>
                      <li>Không có thông tin cá nhân định danh nào được thu thập hoặc lưu trữ</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">7. Quyền của người dùng</h3>
                    <p className="leading-relaxed">
                      Bạn có toàn quyền kiểm soát dữ liệu của mình:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600 mt-2">
                      <li>Xóa ứng dụng sẽ xóa tất cả dữ liệu cục bộ</li>
                      <li>Không cần tài khoản để sử dụng ứng dụng</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">8. Liên hệ</h3>
                    <p className="leading-relaxed">
                      Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:{" "}
                      <a 
                        href="mailto:bradley.dev578@gmail.com"
                        className="underline"
                        style={{ color: theme.primaryAccent }}
                      >
                        bradley.dev578@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Divider */}
              <hr className="my-8 border-slate-200" />

              {/* English Section */}
              <section>
                <h2
                  className="text-xl font-bold mb-6 pb-2 border-b-2"
                  style={{ borderColor: theme.primaryAccent, color: theme.primaryAccent }}
                >
                  🇬🇧 English
                </h2>

                <div className="space-y-6 text-slate-700">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">1. Introduction</h3>
                    <p className="leading-relaxed">
                      Welcome to <strong>Lịch Việt - Vạn Sự An Lành</strong> (Vietnamese Lunar Calendar). 
                      We are committed to protecting your privacy. This Privacy Policy explains how the 
                      app handles information when you use it.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">2. Information Collection</h3>
                    <p className="leading-relaxed mb-3">
                      <strong>This app does NOT collect personally identifiable information</strong>, including:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>No collection of names, emails, phone numbers</li>
                      <li>No precise location tracking</li>
                      <li>No login or account creation required</li>
                    </ul>
                    <p className="leading-relaxed mt-3 mb-2">
                      <strong>Anonymous Analytics Data:</strong> We use Firebase Analytics to collect 
                      anonymous usage data to improve the app:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Screens viewed (e.g., Calendar, Day Detail, Compass)</li>
                      <li>In-app actions (e.g., month navigation, date selection)</li>
                      <li>General device information (device type, OS version)</li>
                      <li>App crash reports</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">3. Data Storage</h3>
                    <p className="leading-relaxed">
                      The app only stores data <strong>locally on your device</strong>. All data is stored 
                      entirely on your device and is not sent to any servers.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">4. Information Sharing</h3>
                    <p className="leading-relaxed">
                      Anonymous analytics data is processed by <strong>Google Firebase Analytics</strong> per{" "}
                      <a 
                        href="https://policies.google.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: theme.primaryAccent }}
                      >
                        Google's Privacy Policy
                      </a>. 
                      We <strong>DO NOT share</strong> or sell any personal information to any other third parties.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">5. Contact</h3>
                    <p className="leading-relaxed">
                      If you have questions about this Privacy Policy, please contact:{" "}
                      <a 
                        href="mailto:bradley.dev578@gmail.com"
                        className="underline"
                        style={{ color: theme.primaryAccent }}
                      >
                        bradley.dev578@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Version info */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500">
                  <strong>Lịch Việt - Vạn Sự An Lành</strong> • Version 1.0
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
