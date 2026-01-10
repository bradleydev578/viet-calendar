"use client";

import type { Direction } from "@/lib/fengshui";
import type { MonthTheme } from "@/lib/theme";

interface DirectionsSectionProps {
  directions: Direction[];
  theme?: MonthTheme;
}

export function DirectionsSection({ directions, theme }: DirectionsSectionProps) {
  // Render star rating
  const renderStars = (rating: number = 3) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400" : "text-neutral-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-neutral-800 mb-3">
        🧭 Phương Hướng Tốt
      </h2>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="space-y-3">
          {directions.map((dir, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
            >
              <div>
                <p className="font-medium text-neutral-800">{dir.n}</p>
                <p className="text-sm text-neutral-500">{dir.d}</p>
              </div>
              {renderStars(dir.r)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
