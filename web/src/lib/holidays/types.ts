// Holiday category
export type HolidayCategory =
  | 'PUBLIC_HOLIDAYS'
  | 'SECTOR_ANNIVERSARIES'
  | 'CULTURAL_ETHNIC_FESTIVALS'
  | 'REVOLUTIONARY_ANNIVERSARIES'
  | 'HISTORICAL_FIGURES';

// Processed holiday for display
export interface ProcessedHoliday {
  id: string;
  name: string;
  category: HolidayCategory;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  description?: string;
  location?: string;
  daysUntil: number;
  isPast: boolean;
  isImportant: boolean;
  type: 'lunar' | 'solar';
}

// Holiday category names in Vietnamese
export const CATEGORY_NAMES: Record<string, string> = {
  PUBLIC_HOLIDAYS: 'Ngày Lễ Chính Thức',
  REVOLUTIONARY_ANNIVERSARIES: 'Ngày Kỷ Niệm Cách Mạng',
  HISTORICAL_FIGURES: 'Nhân Vật Lịch Sử',
  SECTOR_ANNIVERSARIES: 'Ngày Kỷ Niệm Ngành',
  CULTURAL_ETHNIC_FESTIVALS: 'Lễ Hội Văn Hóa',
};

// Category colors (Tailwind classes)
export const CATEGORY_COLORS: Record<string, string> = {
  PUBLIC_HOLIDAYS: 'bg-red-500',
  REVOLUTIONARY_ANNIVERSARIES: 'bg-orange-500',
  HISTORICAL_FIGURES: 'bg-purple-500',
  SECTOR_ANNIVERSARIES: 'bg-blue-500',
  CULTURAL_ETHNIC_FESTIVALS: 'bg-green-500',
};

// Get holiday color based on category, type, and importance
export function getHolidayColor(
  category?: HolidayCategory,
  type?: 'lunar' | 'solar',
  isImportant?: boolean
): string {
  // Important holidays get red
  if (isImportant) {
    return '#F44336';
  }

  // Category-based colors
  if (category) {
    switch (category) {
      case 'PUBLIC_HOLIDAYS':
        return '#D32F2F'; // Red
      case 'SECTOR_ANNIVERSARIES':
        return '#1976D2'; // Blue
      case 'CULTURAL_ETHNIC_FESTIVALS':
        return '#7B1FA2'; // Purple
      case 'REVOLUTIONARY_ANNIVERSARIES':
        return '#C62828'; // Dark Red
      case 'HISTORICAL_FIGURES':
        return '#5D4037'; // Brown
    }
  }

  // Type-based fallback
  switch (type) {
    case 'lunar':
      return '#FF9800'; // Orange
    case 'solar':
      return '#2196F3'; // Blue
    default:
      return '#757575'; // Gray
  }
}
