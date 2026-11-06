"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getMonthTheme } from "@/lib/theme";
import { TopHeader, Footer } from "@/components/layout";
import { MaterialIcon } from "@/components/common";
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
  const { upcomingHolidays, pastHolidays, upcomingPublicHolidays } = useMemo(() => {
    const upcoming = filteredHolidays.filter((h) => !h.isPast);
    const past = filteredHolidays.filter((h) => h.isPast);
    const publicUpcoming = allHolidays
      .filter((h) => !h.isPast && h.category === "PUBLIC_HOLIDAYS")
      .slice(0, 6);
    return {
      upcomingHolidays: upcoming,
      pastHolidays: past,
      upcomingPublicHolidays: publicUpcoming,
    };
  }, [filteredHolidays, allHolidays]);

  return (
    <div
      className="relative flex flex-col min-h-dvh w-full overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.background }}
    >
      {/* Decorative blur circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-28 -left-28 w-[480px] h-[480px] rounded-full blur-[110px] opacity-40"
          style={{ backgroundColor: theme.blurCircle1 }}
        />
        <div
          className="absolute top-1/3 -right-28 w-[420px] h-[420px] rounded-full blur-[110px] opacity-35"
          style={{ backgroundColor: theme.blurCircle2 }}
        />
      </div>

      {/* Top Header */}
      <TopHeader theme={theme} monthNumber={today.getMonth() + 1} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 relative z-10">
        {/* Page Header */}
        <div className="w-full bg-white/85 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/80 shadow-sm mb-6">
          <div className="w-full">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1.5">
                <span>Hôm nay</span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <span style={{ color: theme.primaryAccent }} className="font-extrabold">
                  {format(today, "dd/MM/yyyy", { locale: vi })}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <span>{theme.motif} {theme.name}</span>
              </div>
              <h1 className="serif-display text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Sự Kiện & Ngày Lễ Việt Nam (2026 – 2027)
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Theo dõi các ngày lễ truyền thống, lịch nghỉ Tết Nguyên Đán, Quốc Khánh và Ngày Văn hóa Việt Nam (24/11).
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
        <div className="pb-4">
          <div className="w-full flex flex-col gap-6">
              {/* Search bar */}
              <search className="relative">
                <input
                  type="search"
                  aria-label="Tìm kiếm sự kiện và ngày lễ"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sự kiện..."
                  className="w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-slate-100 outline-none transition-all text-slate-800 placeholder-slate-400"
                />
                <MaterialIcon
                  name="search"
                  className="text-xl absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Xóa từ khóa tìm kiếm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                  >
                    <MaterialIcon name="close" className="text-slate-400 text-sm" />
                  </button>
                )}
              </search>

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

              {/* Official Public Holidays & Tết Vacation Highlight */}
              {!searchQuery &&
                (!selectedCategory || selectedCategory === "PUBLIC_HOLIDAYS") &&
                upcomingPublicHolidays.length > 0 && (
                  <section className="bg-white/90 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-red-100 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                          <MaterialIcon name="event_available" className="text-base" />
                        </span>
                        <div>
                          <h2 className="text-sm lg:text-base font-extrabold text-slate-800">
                            Lịch Nghỉ Lễ & Tết Chính Thức Sắp Tới
                          </h2>
                          <p className="text-xs text-slate-500">
                            Các ngày lễ, Tết người lao động được nghỉ làm việc và hưởng nguyên lương
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {upcomingPublicHolidays.map((item) => (
                        <Link
                          key={`highlight-${item.id}`}
                          href={`/day/${format(item.startDate, "yyyy-MM-dd")}`}
                          prefetch={false}
                          className="flex items-start gap-3 p-3 rounded-xl bg-red-50/40 hover:bg-red-50/80 border border-red-100/80 transition-all"
                        >
                          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <span className="text-xs font-extrabold leading-none">
                              {format(item.startDate, "dd/MM")}
                            </span>
                            <span className="text-[10px] opacity-85 mt-0.5">
                              {format(item.startDate, "yyyy")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs lg:text-sm font-bold text-slate-800 truncate">
                                {item.name}
                              </p>
                              <span className="text-[10px] font-bold text-red-600 bg-white px-2 py-0.5 rounded-full border border-red-100 shrink-0">
                                {item.daysUntil <= 0
                                  ? "Đang diễn ra"
                                  : `Còn ${item.daysUntil} ngày`}
                              </span>
                            </div>
                            {item.vacationBadge && (
                              <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                                ✓ {item.vacationBadge}
                              </p>
                            )}
                            {item.lunarDateStr && (
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                Âm lịch: {item.lunarDateStr}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

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
                <MaterialIcon
                  name="search_off"
                  className="text-6xl text-slate-300 mb-4"
                />
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
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
          type="button"
          aria-label="Cuộn danh mục sang trái"
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
          style={{ color: theme.primaryAccent }}
        >
          <MaterialIcon name="chevron_left" className="text-[20px]" />
        </button>
      )}
      
      {/* Right arrow */}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Cuộn danh mục sang phải"
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
          style={{ color: theme.primaryAccent }}
        >
          <MaterialIcon name="chevron_right" className="text-[20px]" />
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
    <Link href={`/day/${format(holiday.startDate, "yyyy-MM-dd")}`} prefetch={false}>
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
            <MaterialIcon name={getIconByCategory()} className="text-sm" />
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
              <div className="flex items-center gap-2 flex-wrap">
                <time
                  dateTime={format(holiday.startDate, "yyyy-MM-dd")}
                  className="font-bold text-xs"
                  style={{ color: isPast ? "#64748b" : theme.primaryAccent }}
                >
                  {format(holiday.startDate, "dd/MM/yyyy", { locale: vi })}
                  {holiday.totalDays > 1 &&
                    format(holiday.endDate, "yyyy-MM-dd") !==
                      format(holiday.startDate, "yyyy-MM-dd") &&
                    ` – ${format(holiday.endDate, "dd/MM/yyyy", { locale: vi })}`}
                </time>
                {holiday.lunarDateStr && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {holiday.lunarDateStr}
                    </span>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${categoryColor} text-white px-1.5 py-0.5 rounded`}
                >
                  {categoryName}
                </span>
                {holiday.vacationBadge && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {holiday.vacationBadge}
                  </span>
                )}
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
