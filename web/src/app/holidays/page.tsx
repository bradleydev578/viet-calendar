"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getMonthTheme } from "@/lib/theme";
import { TopHeader, Footer } from "@/components/layout";
import {
  HolidayRepository,
  CATEGORY_NAMES,
  CATEGORY_COLORS,
  type ProcessedHoliday,
} from "@/lib/holidays";

// Metadata is handled in metadata.ts for this route

export default function HolidaysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const today = new Date();
  const theme = useMemo(() => getMonthTheme(today.getMonth() + 1), []);

  // Get all holidays
  const allHolidays = useMemo(() => HolidayRepository.getAllHolidays(), []);
  const categories = useMemo(() => HolidayRepository.getCategories(), []);

  // Filter holidays
  const filteredHolidays = useMemo(() => {
    let result = allHolidays;

    if (selectedCategory) {
      result = result.filter((h) => h.category === selectedCategory);
    }

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
    <div
      className="relative flex flex-col h-screen w-full overflow-hidden font-[Manrope] antialiased"
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
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Page Header */}
        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <span>Hôm nay</span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <span style={{ color: theme.primaryAccent }} className="font-medium">
                  {format(today, "dd/MM/yyyy", { locale: vi })}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
                Sự Kiện & Ngày Lễ
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Theo dõi các ngày lễ truyền thống và sự kiện quan trọng trong năm.
              </p>

              {/* Category Filter with scroll arrows */}
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                theme={theme}
              />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {/* Search bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sự kiện..."
                  className="w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none transition-all text-slate-800 placeholder-slate-400"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                  >
                    <span className="material-symbols-outlined text-slate-400 text-sm">
                      close
                    </span>
                  </button>
                )}
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {filteredHolidays.length} sự kiện
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
                    className="text-sm font-medium"
                    style={{ color: theme.primaryAccent }}
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              {/* Upcoming Events */}
              {upcomingHolidays.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.primaryAccent }}
                    />
                    <h2 className="text-lg font-bold text-slate-800">
                      Sắp tới ({upcomingHolidays.length})
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {upcomingHolidays.map((holiday) => (
                      <EventCard
                        key={holiday.id}
                        holiday={holiday}
                        theme={theme}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Past Events */}
              {pastHolidays.length > 0 && (
                <section className="opacity-60">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <h2 className="text-lg font-bold text-slate-500">
                      Đã qua ({pastHolidays.length})
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {pastHolidays.map((holiday) => (
                      <EventCard
                        key={holiday.id}
                        holiday={holiday}
                        theme={theme}
                        isPast
                      />
                    ))}
                  </div>
                </section>
              )}

            {/* No results */}
            {filteredHolidays.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                  search_off
                </span>
                <p className="text-slate-500">
                  Không tìm thấy sự kiện nào phù hợp
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="mt-4 px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: theme.primaryAccent }}
                >
                  Xem tất cả
                </button>
              </div>
            )}

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

// Category Filter Component with scroll arrows
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  theme: {
    primaryAccent: string;
  };
}

function CategoryFilter({ categories, selectedCategory, onSelectCategory, theme }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollEl.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative mt-4 flex items-center">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
          style={{ color: theme.primaryAccent }}
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
      )}
      
      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
          style={{ color: theme.primaryAccent }}
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      )}

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            selectedCategory === null
              ? "text-white shadow-md"
              : "bg-white/80 text-slate-600 hover:bg-white"
          }`}
          style={
            selectedCategory === null
              ? { backgroundColor: theme.primaryAccent }
              : {}
          }
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              onSelectCategory(selectedCategory === cat ? null : cat)
            }
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "text-white shadow-md"
                : "bg-white/80 text-slate-600 hover:bg-white"
            }`}
            style={
              selectedCategory === cat
                ? { backgroundColor: theme.primaryAccent }
                : {}
            }
          >
            {CATEGORY_NAMES[cat]}
          </button>
        ))}
      </div>
    </div>
  );
}

// Event Card Component
interface EventCardProps {
  holiday: ProcessedHoliday;
  theme: {
    primaryAccent: string;
    accentGold: string;
  };
  isPast?: boolean;
}

function EventCard({ holiday, theme, isPast = false }: EventCardProps) {
  const categoryColor = CATEGORY_COLORS[holiday.category] || "bg-slate-500";
  const categoryName = CATEGORY_NAMES[holiday.category] || holiday.category;

  const getCountdownText = () => {
    if (isPast) return "Đã qua";
    if (holiday.daysUntil === 0) return "Hôm nay";
    if (holiday.daysUntil === 1) return "Ngày mai";
    return `Còn ${holiday.daysUntil} ngày`;
  };

  const getIconByCategory = () => {
    switch (holiday.category) {
      case "PUBLIC_HOLIDAYS":
        return "flag";
      case "CULTURAL_ETHNIC_FESTIVALS":
        return "festival";
      case "REVOLUTIONARY_ANNIVERSARIES":
        return "military_tech";
      case "HISTORICAL_FIGURES":
        return "person";
      default:
        return "event";
    }
  };

  return (
    <Link href={`/day/${format(holiday.startDate, "yyyy-MM-dd")}`}>
      <article
        className={`group relative flex gap-4 items-start ${
          isPast ? "opacity-70" : ""
        }`}
      >
        {/* Timeline dot */}
        <div className="relative z-10 flex-shrink-0 mt-1">
          <div
            className="size-10 rounded-full flex items-center justify-center ring-4 ring-white"
            style={{
              backgroundColor: isPast
                ? "rgba(100, 116, 139, 0.2)"
                : `${theme.primaryAccent}20`,
              borderColor: isPast ? "#64748b" : theme.primaryAccent,
              borderWidth: 1,
              color: isPast ? "#64748b" : theme.primaryAccent,
            }}
          >
            <span className="material-symbols-outlined text-sm">
              {getIconByCategory()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div
            className={`bg-white/80 rounded-2xl p-4 border border-slate-100 transition-all duration-300 cursor-pointer ${
              holiday.isImportant && !isPast
                ? "shadow-md hover:shadow-lg"
                : "hover:shadow-md"
            }`}
          >
            {/* Header row: Date + Category + Countdown */}
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <time
                  dateTime={format(holiday.startDate, "yyyy-MM-dd")}
                  className="font-bold text-xs"
                  style={{ color: isPast ? "#64748b" : theme.primaryAccent }}
                >
                  {format(holiday.startDate, "dd/MM", { locale: vi })}
                </time>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${categoryColor} text-white px-1.5 py-0.5 rounded`}
                >
                  {categoryName}
                </span>
              </div>
              {!isPast && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                    holiday.daysUntil <= 7
                      ? "bg-orange-100 text-orange-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {getCountdownText()}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {holiday.name}
              {holiday.isImportant && !isPast && (
                <span className="ml-2 text-yellow-500">⭐</span>
              )}
            </h3>

            {/* Description */}
            {holiday.description && (
              <p className="text-sm text-slate-500 line-clamp-2">
                {holiday.description}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
