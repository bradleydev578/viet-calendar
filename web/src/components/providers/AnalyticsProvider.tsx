"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getAnalyticsInstance, trackPageView } from "@/lib/firebase";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize analytics on mount
  useEffect(() => {
    getAnalyticsInstance();
  }, []);

  // Track page views on route change
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Get page title based on pathname
    let pageTitle = "Lịch Việt";
    if (pathname === "/") {
      pageTitle = "Trang chủ - Lịch Việt";
    } else if (pathname.startsWith("/day/")) {
      const date = pathname.split("/day/")[1];
      pageTitle = `Ngày ${date} - Lịch Việt`;
    } else if (pathname === "/holidays") {
      pageTitle = "Sự kiện - Lịch Việt";
    } else if (pathname === "/download") {
      pageTitle = "Tải ứng dụng - Lịch Việt";
    }

    trackPageView(pageTitle, url);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
