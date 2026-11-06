"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MonthTheme } from "@/lib/theme";
import { MaterialIcon } from "@/components/common";

interface TopHeaderV1Props {
  theme: MonthTheme;
}

export function TopHeaderV1({ theme }: TopHeaderV1Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/v1", icon: "calendar_month", label: "Lịch (V1)" },
    { href: "/doi-ngay-am-duong", icon: "swap_horiz", label: "Đổi Ngày" },
    { href: "/xem-ngay-tot", icon: "event_available", label: "Ngày Tốt" },
    { href: "/holidays", icon: "celebration", label: "Sự Kiện" },
  ];

  return (
    <header className="h-16 px-4 lg:px-8 flex items-center justify-center shrink-0 bg-transparent z-30">
      <div className="w-full max-w-6xl flex items-center justify-between gap-2">
        {/* Logo + Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Link
            href="/v1"
            aria-label="Lịch Việt - Giao diện V1"
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
              Lịch Việt <span className="text-xs font-semibold text-slate-500">(V1)</span>
            </span>
          </Link>

          {/* Navigation - next to logo */}
          <nav aria-label="Điều hướng V1" className="flex items-center gap-1 sm:ml-2 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
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

        {/* Switch back to V2 */}
        <Link
          href="/"
          className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity shrink-0"
          style={{ backgroundColor: theme.primaryAccent }}
        >
          ✨ Giao diện mới (V2)
        </Link>
      </div>
    </header>
  );
}
