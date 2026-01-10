"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MonthTheme } from "@/lib/theme";

interface TopHeaderProps {
  theme: MonthTheme;
}

export function TopHeader({ theme }: TopHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "calendar_month", label: "Lịch" },
    { href: "/holidays", icon: "celebration", label: "Sự Kiện" },
  ];

  return (
    <header className="h-16 px-4 lg:px-8 flex items-center justify-center shrink-0 bg-transparent z-30">
      <div className="w-full max-w-6xl flex items-center justify-between">
        {/* Logo - aligned with calendar left edge */}
        <div className="flex items-center gap-3 lg:flex-[1.6] lg:max-w-[700px]">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div
              className="size-10 rounded-xl flex items-center justify-center shadow-md shrink-0"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryAccent}, ${theme.primaryAccent}cc)`,
              }}
            >
              <span className="material-symbols-outlined text-white font-light" style={{ fontSize: 28, fontVariationSettings: "'wght' 300" }}>
                dark_mode
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight hidden sm:block">
              Lịch Việt
            </h1>
          </Link>
          
          {/* Navigation - next to logo */}
          <nav className="flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              // Check if active: exact match for "/" or startsWith for other routes
              const isActive = item.href === "/" 
                ? pathname === "/" || pathname.startsWith("/day/")
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
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
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span className="text-sm hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side spacer to match detail panel */}
        <div className="hidden lg:flex lg:flex-1 lg:min-w-[340px] lg:max-w-[400px]" />
      </div>
    </header>
  );
}
