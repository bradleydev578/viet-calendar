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
  // But only split when there's actual text after the period (not just punctuation or empty)
  const splitActivities = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    return activities.flatMap((activity) => {
      // Split by period followed by space and a letter (start of new sentence)
      const sentences = activity
        .split(/\.(?=\s+[A-ZÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ])/i)
        .map((s) => s.trim())
        .filter((s) => s.length > 1); // Filter out single characters like "." or ")"
      
      // Add period back to sentences that don't end with one (except last)
      return sentences.map((s, i) => {
        if (i < sentences.length - 1 && !s.endsWith('.')) {
          return s + '.';
        }
        return s;
      });
    });
  }, [activities]);

  return (
    <div
      className={`rounded-2xl p-4 shadow-lg ${
        isGood ? "bg-emerald-50" : "bg-red-50"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isGood ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {isGood ? (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
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
          )}
        </span>
        <h3
          className={`font-bold ${
            isGood ? "text-emerald-800" : "text-red-800"
          }`}
        >
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {splitActivities.length > 0 ? (
          splitActivities.map((activity, index) => (
            <p
              key={index}
              className={`text-sm leading-relaxed ${
                isGood ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {activity}
            </p>
          ))
        ) : (
          <p className="text-sm text-neutral-500 italic">
            Không có dữ liệu
          </p>
        )}
      </div>
    </div>
  );
}
