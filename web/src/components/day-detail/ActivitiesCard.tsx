"use client";

import { useMemo } from "react";

interface ActivitiesCardProps {
  title: string;
  activities: string[];
  type: "good" | "bad";
}

export function ActivitiesCard({ title, activities, type }: ActivitiesCardProps) {
  const isGood = type === "good";

  // Split activities by period (.) to show each sentence on new line
  const splitActivities = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    return activities.flatMap((activity) => {
      const sentences = activity
        .split(/\.(?=\s+[A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ])/i)
        .map((s) => s.trim())
        .filter((s) => s.length > 1);

      return sentences.map((s, i) => {
        if (i < sentences.length - 1 && !s.endsWith(".")) {
          return s + ".";
        }
        return s;
      });
    });
  }, [activities]);

  return (
    <div
      className={`rounded-3xl p-5 border shadow-lg backdrop-blur-xl ${
        isGood
          ? "bg-emerald-50/90 border-emerald-200/70"
          : "bg-rose-50/90 border-rose-200/70"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-black/5">
        <span
          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            isGood ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {isGood ? (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </span>
        <h3
          className={`text-sm font-extrabold uppercase tracking-wide ${
            isGood ? "text-emerald-900" : "text-rose-900"
          }`}
        >
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {splitActivities.length > 0 ? (
          splitActivities.map((activity, index) => (
            <div
              key={index}
              className={`text-xs sm:text-sm leading-relaxed flex items-start gap-2 ${
                isGood ? "text-emerald-800" : "text-rose-800"
              }`}
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-60" />
              <span>{activity}</span>
            </div>
          ))
        ) : (
          <p className="text-xs sm:text-sm text-slate-500 italic">
            Không có dữ liệu chi tiết
          </p>
        )}
      </div>
    </div>
  );
}
