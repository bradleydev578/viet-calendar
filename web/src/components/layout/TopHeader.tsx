"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MonthTheme } from "@/lib/theme";
import { MaterialIcon } from "@/components/common";

interface TopHeaderProps {
  theme: MonthTheme;
}

export function TopHeader({ theme }: TopHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "calendar_month", label: "Lịch" },
    { href: "/doi-ngay-am-duong", icon: "swap_horiz", label: "Đổi Ngày" },
    { href: "/xem-ngay-tot", icon: "event_available", label: "Ngày Tốt" },
    { href: "/holidays", icon: "celebration", label: "Sự Kiện" },
  ];

  return (
    <header className="h-16 px-4 lg:px-8 flex items-center justify-center shrink-0 bg-transparent z-30">
      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* Logo + Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <Link
            href="/"
            aria-label="Lịch Việt - Trang chủ"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0"
          >
            <div
              className="size-9 sm:size-10 rounded-xl flex items-center justify-center shadow-md shrink-0"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryAccent}, ${theme.primaryAccent}cc)`,
              }}
            >
              <MaterialIcon
                name="dark_mode"
                className="text-white"
                style={{ fontSize: 22 }}
              />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight hidden md:block">
              Lịch Việt
            </span>
          </Link>

          {/* Navigation - next to logo */}
          <nav aria-label="Điều hướng chính" className="flex items-center gap-1 sm:ml-2 overflow-x-auto no-scrollbar">
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
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all shrink-0 ${
                    isActive
                      ? "text-white font-semibold shadow-md"
                      : "text-slate-600 hover:bg-white/60"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.primaryAccent,
                        }
                      : {}
                  }
                >
                  <MaterialIcon name={item.icon} className="text-[18px] sm:text-[20px]" />
                  <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
