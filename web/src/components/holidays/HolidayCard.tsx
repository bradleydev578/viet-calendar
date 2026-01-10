"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import {
  type ProcessedHoliday,
  CATEGORY_NAMES,
  CATEGORY_COLORS,
} from "@/lib/holidays";

interface HolidayCardProps {
  holiday: ProcessedHoliday;
  isPast?: boolean;
}

export function HolidayCard({ holiday, isPast = false }: HolidayCardProps) {
  const startDateStr = format(holiday.startDate, "dd/MM/yyyy", { locale: vi });
  const endDateStr =
    holiday.totalDays > 1
      ? format(holiday.endDate, "dd/MM/yyyy", { locale: vi })
      : null;

  // Get countdown text
  const getCountdownText = () => {
    if (isPast) return "Đã qua";
    if (holiday.daysUntil === 0) return "Hôm nay";
    if (holiday.daysUntil === 1) return "Ngày mai";
    return `Còn ${holiday.daysUntil} ngày`;
  };

  const categoryColor = CATEGORY_COLORS[holiday.category] || "bg-neutral-500";
  const categoryName = CATEGORY_NAMES[holiday.category] || holiday.category;

  return (
    <Link href={`/day/${format(holiday.startDate, "yyyy-MM-dd")}`}>
      <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer ${holiday.isImportant ? 'ring-2 ring-primary-300' : ''}`}>
        <div className="flex items-start gap-4">
          {/* Date badge */}
          <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${holiday.isImportant ? 'bg-primary-500 text-white' : 'bg-primary-100'}`}>
            <span className={`text-xl font-bold ${holiday.isImportant ? 'text-white' : 'text-primary-700'}`}>
              {holiday.startDate.getDate()}
            </span>
            <span className={`text-xs ${holiday.isImportant ? 'text-primary-100' : 'text-primary-600'}`}>
              Th{holiday.startDate.getMonth() + 1}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`text-xs text-white px-2 py-0.5 rounded-full ${categoryColor}`}
              >
                {categoryName}
              </span>
              {holiday.type === 'lunar' && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Âm lịch
                </span>
              )}
              {!isPast && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    holiday.daysUntil <= 7
                      ? "bg-orange-100 text-orange-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {getCountdownText()}
                </span>
              )}
              {holiday.isImportant && (
                <span className="text-xs">⭐</span>
              )}
            </div>

            <h3 className="font-bold text-neutral-800 truncate">
              {holiday.name}
            </h3>

            <p className="text-sm text-neutral-500 mt-1">
              {startDateStr}
              {endDateStr && ` - ${endDateStr}`}
              {holiday.totalDays > 1 && (
                <span className="ml-2 text-xs bg-neutral-100 px-2 py-0.5 rounded-full">
                  {holiday.totalDays} ngày
                </span>
              )}
            </p>

            {holiday.description && (
              <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                {holiday.description}
              </p>
            )}

            {holiday.location && (
              <p className="text-xs text-neutral-400 mt-1">
                📍 {holiday.location}
              </p>
            )}
          </div>

          {/* Arrow */}
          <svg
            className="w-5 h-5 text-neutral-300 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
