"use client";

import { CATEGORY_NAMES, CATEGORY_COLORS } from "@/lib/holidays";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-4 overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max">
        {/* All button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-neutral-800 text-white"
              : "bg-white/80 text-neutral-600 hover:bg-white"
          }`}
        >
          Tất cả
        </button>

        {/* Category buttons */}
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const colorClass = CATEGORY_COLORS[category] || "bg-neutral-500";
          const name = CATEGORY_NAMES[category] || category;

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(isSelected ? null : category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                isSelected
                  ? `${colorClass} text-white`
                  : "bg-white/80 text-neutral-600 hover:bg-white"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSelected ? "bg-white" : colorClass
                }`}
              />
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
