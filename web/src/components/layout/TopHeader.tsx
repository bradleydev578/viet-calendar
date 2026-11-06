"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MonthTheme } from "@/lib/theme";
import { MaterialIcon } from "@/components/common";

interface TopHeaderProps {
  theme: MonthTheme;
  monthNumber?: number;
}

export function TopHeader({ theme }: TopHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "calendar_month", label: "Lịch Tháng" },
    { href: "/doi-ngay-am-duong", icon: "swap_horiz", label: "Đổi Ngày" },
    { href: "/xem-ngay-tot", icon: "event_available", label: "Xem Ngày Tốt" },
    { href: "/holidays", icon: "celebration", label: "Ngày Lễ" },
  ];

  const gradientBg = `linear-gradient(135deg, ${theme.primaryAccent}, ${
    theme.darkAccent || theme.primaryHover
  })`;

  return (
    <header className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2 shrink-0 z-30">
      <div className="bg-white/85 backdrop-blur-xl rounded-2xl px-3.5 sm:px-5 py-2.5 border border-white/80 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand Identity */}
        <Link
          href="/"
          aria-label="Lịch Việt Vạn Sự - Trang chủ"
          className="flex items-center gap-2.5 sm:gap-3 hover:opacity-95 transition-opacity shrink-0"
        >
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-all duration-500 shrink-0"
            style={{ background: gradientBg }}
          >
            <span className="serif-display text-lg sm:text-xl">V</span>
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight block leading-tight">
              Lịch Việt Vạn Sự
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:block">
              Lịch Treo Tường • Bốn Mùa An Lành
            </span>
          </div>
        </Link>

        {/* Main Navigation Pills */}
        <nav
          aria-label="Điều hướng chính"
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/day/")
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
                style={
                  isActive
                    ? {
                        background: gradientBg,
                      }
                    : {}
                }
              >
                <MaterialIcon name={item.icon} className="text-[16px] sm:text-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
