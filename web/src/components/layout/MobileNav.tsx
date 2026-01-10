"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  theme: {
    primaryAccent: string;
  };
}

export function MobileNav({ theme }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "calendar_month", label: "Lịch" },
    { href: "/holidays", icon: "celebration", label: "Sự Kiện" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 w-full nav-glass flex items-center justify-around py-3 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 p-2 w-20 group"
          >
            <div
              className={`w-10 h-8 rounded-full flex items-center justify-center transition-colors ${
                isActive ? "" : "bg-transparent"
              }`}
              style={
                isActive
                  ? { backgroundColor: `${theme.primaryAccent}20` }
                  : {}
              }
            >
              <span
                className={`material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform ${
                  isActive ? "filled" : ""
                }`}
                style={{ color: isActive ? theme.primaryAccent : "#9cbab2" }}
              >
                {item.icon}
              </span>
            </div>
            <span
              className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}
              style={{ color: isActive ? "white" : "#9cbab2" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      {/* Home indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
    </nav>
  );
}
