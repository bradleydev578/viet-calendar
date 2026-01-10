"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getMonthTheme } from "@/lib/theme";
import { TopHeader, Footer } from "@/components/layout";

export default function TermsOfServicePage() {
  const today = new Date();
  const theme = useMemo(() => getMonthTheme(today.getMonth() + 1), []);

  return (
    <div
      className="relative flex flex-col min-h-screen w-full overflow-hidden font-[Manrope] antialiased"
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
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="text-sm font-medium">Quay lại</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight mb-2">
                Điều Khoản Sử Dụng
              </h1>
              <p className="text-slate-500 text-sm">
                Terms of Service • Cập nhật: 10/01/2026
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
                    <h3 className="font-bold text-slate-800 mb-2">1. Chấp nhận điều khoản</h3>
                    <p className="leading-relaxed">
                      Bằng việc tải xuống, cài đặt hoặc sử dụng ứng dụng <strong>Lịch Việt - Vạn Sự An Lành</strong> ("Ứng dụng"), 
                      bạn đồng ý tuân thủ các Điều khoản sử dụng này.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">2. Mô tả dịch vụ</h3>
                    <p className="leading-relaxed mb-2">Ứng dụng là công cụ tiện ích miễn phí cung cấp:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Lịch âm dương Việt Nam</li>
                      <li>Thông tin phong thủy theo ngày (ngày tốt/xấu, giờ hoàng đạo)</li>
                      <li>La bàn phong thủy</li>
                      <li>Danh sách ngày lễ và sự kiện</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">3. Tính chất thông tin</h3>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-3">
                      <p className="text-amber-800 font-semibold mb-2">⚠️ QUAN TRỌNG:</p>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        Tất cả thông tin về phong thủy, ngày tốt/xấu, giờ hoàng đạo, 28 Sao, 12 Trực và các dữ liệu liên quan 
                        trong Ứng dụng được <strong>tổng hợp từ nhiều nguồn</strong> tài liệu phong thủy truyền thống Việt Nam và 
                        <strong> CHỈ MANG TÍNH CHẤT THAM KHẢO</strong>.
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Thông tin phong thủy dựa trên quan niệm văn hóa truyền thống, không phải khoa học thực nghiệm</li>
                      <li>Chúng tôi không đảm bảo tính chính xác tuyệt đối của các thông tin này</li>
                      <li>Người dùng nên cân nhắc và tự chịu trách nhiệm khi đưa ra quyết định dựa trên thông tin từ Ứng dụng</li>
                      <li>Ứng dụng không thay thế cho tư vấn chuyên nghiệp trong các lĩnh vực y tế, pháp lý, tài chính</li>
                    </ul>
                    <p className="leading-relaxed mt-3 mb-2"><strong>Nguồn dữ liệu:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Dữ liệu lịch âm: Tính toán theo thuật toán thiên văn</li>
                      <li>Dữ liệu phong thủy: Tổng hợp từ các nguồn công khai trên internet</li>
                      <li>Ngày lễ: Theo quy định của Nhà nước Việt Nam và truyền thống văn hóa</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">4. Giới hạn trách nhiệm</h3>
                    <p className="leading-relaxed">
                      Ứng dụng được cung cấp miễn phí với mục đích tiện ích cho cộng đồng. 
                      Chúng tôi không chịu trách nhiệm về các quyết định được đưa ra dựa trên thông tin trong Ứng dụng.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">5. Liên hệ</h3>
                    <p className="leading-relaxed">
                      Nếu bạn có câu hỏi hoặc góp ý:{" "}
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
                    <h3 className="font-bold text-slate-800 mb-2">1. Acceptance of Terms</h3>
                    <p className="leading-relaxed">
                      By downloading, installing, or using the <strong>Lịch Việt - Vạn Sự An Lành</strong> application ("App"), 
                      you agree to these Terms of Service.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">2. Service Description</h3>
                    <p className="leading-relaxed mb-2">The App is a free utility tool providing:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Vietnamese lunar-solar calendar</li>
                      <li>Daily feng shui information (auspicious/inauspicious days, lucky hours)</li>
                      <li>Feng shui compass</li>
                      <li>List of holidays and events</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">3. Nature of Information</h3>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-3">
                      <p className="text-amber-800 font-semibold mb-2">⚠️ IMPORTANT:</p>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        All information regarding feng shui, auspicious/inauspicious days, lucky hours, 28 Stars, 12 Day Officers, 
                        and related data in the App is <strong>compiled from various sources</strong> of traditional Vietnamese 
                        feng shui literature and is <strong>FOR REFERENCE PURPOSES ONLY</strong>.
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Feng shui information is based on traditional cultural beliefs, not empirical science</li>
                      <li>We do not guarantee the absolute accuracy of this information</li>
                      <li>Users should consider carefully and assume responsibility for decisions made based on information from the App</li>
                      <li>The App does not replace professional advice in medical, legal, or financial matters</li>
                    </ul>
                    <p className="leading-relaxed mt-3 mb-2"><strong>Data Sources:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                      <li>Lunar calendar data: Calculated using astronomical algorithms</li>
                      <li>Feng shui data: Compiled from publicly available internet sources</li>
                      <li>Holidays: According to Vietnamese government regulations and cultural traditions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">4. Limitation of Liability</h3>
                    <p className="leading-relaxed">
                      The App is provided free of charge as a community utility. 
                      We are not responsible for decisions made based on information in the App.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">5. Contact</h3>
                    <p className="leading-relaxed">
                      If you have questions or feedback:{" "}
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
