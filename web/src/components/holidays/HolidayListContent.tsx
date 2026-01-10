"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  HolidayRepository,
  CATEGORY_NAMES,
  CATEGORY_COLORS,
  type ProcessedHoliday,
} from "@/lib/holidays";
import { HolidayCard } from "./HolidayCard";
import { CategoryFilter } from "./CategoryFilter";

export function HolidayListContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all holidays
  const allHolidays = useMemo(() => HolidayRepository.getAllHolidays(), []);
  const categories = useMemo(() => HolidayRepository.getCategories(), []);

  // Filter holidays
  const filteredHolidays = useMemo(() => {
    let result = allHolidays;

    // Filter by category
    if (selectedCategory) {
      result = result.filter((h) => h.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [allHolidays, selectedCategory, searchQuery]);

  // Group by upcoming/past
  const { upcomingHolidays, pastHolidays } = useMemo(() => {
    const upcoming = filteredHolidays.filter((h) => !h.isPast);
    const past = filteredHolidays.filter((h) => h.isPast);
    return { upcomingHolidays: upcoming, pastHolidays: past };
  }, [filteredHolidays]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <svg
              className="w-6 h-6 text-neutral-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              📅 Ngày Lễ Việt Nam
            </h1>
            <p className="text-sm text-neutral-600">
              {allHolidays.length} ngày lễ và sự kiện
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm ngày lễ..."
            className="w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded-full"
            >
              <svg
                className="w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Category filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-600">
            {filteredHolidays.length} kết quả
            {selectedCategory && (
              <span className="ml-1">
                trong{" "}
                <span className="font-medium">
                  {CATEGORY_NAMES[selectedCategory]}
                </span>
              </span>
            )}
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Upcoming holidays */}
        {upcomingHolidays.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-neutral-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Sắp tới ({upcomingHolidays.length})
            </h2>
            <div className="space-y-3">
              {upcomingHolidays.map((holiday) => (
                <HolidayCard key={holiday.id} holiday={holiday} />
              ))}
            </div>
          </section>
        )}

        {/* Past holidays */}
        {pastHolidays.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-neutral-500 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-neutral-400 rounded-full" />
              Đã qua ({pastHolidays.length})
            </h2>
            <div className="space-y-3 opacity-60">
              {pastHolidays.map((holiday) => (
                <HolidayCard key={holiday.id} holiday={holiday} isPast />
              ))}
            </div>
          </section>
        )}

        {/* No results */}
        {filteredHolidays.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-neutral-600">
              Không tìm thấy ngày lễ nào phù hợp
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Xem tất cả
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-neutral-500">
          <p>© 2025 Lịch Việt Vạn Sự An Lành</p>
        </footer>
      </div>
    </main>
  );
}
