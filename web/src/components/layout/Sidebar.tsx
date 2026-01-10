"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { QuoteRepository } from "@/lib/quotes";
import { useMemo } from "react";

interface SidebarProps {
  theme: {
    primaryAccent: string;
    name: string;
  };
}

export function Sidebar({ theme }: SidebarProps) {
  const pathname = usePathname();
  const quote = useMemo(() => QuoteRepository.getQuoteOfTheDay(), []);

  const navItems = [
    { href: "/", icon: "calendar_month", label: "Trang chủ" },
    { href: "/holidays", icon: "celebration", label: "Sự Kiện" },
  ];

  return (
    <aside className="w-20 lg:w-64 h-full flex flex-col border-r border-white/5 bg-[#111816]/90 backdrop-blur-md transition-all duration-300">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
        <div
          className="size-10 rounded-xl flex items-center justify-center shadow-lg shrink-0"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryAccent}, ${theme.primaryAccent}cc)`,
            boxShadow: `0 4px 14px ${theme.primaryAccent}33`,
          }}
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: 24 }}>
            balance
          </span>
        </div>
        <h1 className="text-xl font-bold text-white hidden lg:block tracking-tight">
          Lịch Việt
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "text-white border"
                  : "text-[#9cbab2] hover:bg-white/5 hover:text-white"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: `${theme.primaryAccent}20`,
                      borderColor: `${theme.primaryAccent}30`,
                      color: theme.primaryAccent,
                    }
                  : {}
              }
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-medium hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quote */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-[#283D3A] to-[#1a2e2b] p-4 rounded-xl border border-white/5 hidden lg:block">
          <p className="text-xs text-[#9cbab2] mb-1">Câu nói hay</p>
          <p className="text-sm text-white italic font-medium line-clamp-3">
            &ldquo;{quote.text}&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
