/**
 * Monthly Theme System
 * Each month has a unique background color palette with blur circles
 * Themes are designed to reflect Vietnamese cultural seasons and celebrations
 */

export interface MonthTheme {
  name: string;
  background: string;
  blurCircle1: string;
  blurCircle2: string;
  primaryAccent: string;
  todayCellBg: string;
  todayCellShadow: string;
}

/**
 * 12 Monthly Themes inspired by Vietnamese seasons and celebrations
 */
export const MONTH_THEMES: Record<number, MonthTheme> = {
  // Tháng 1 - Tết Nguyên Đán (Red & Gold)
  1: {
    name: 'Tết Nguyên Đán',
    background: '#FEF2F2', // rose-50
    blurCircle1: 'rgba(220, 38, 38, 0.15)', // red
    blurCircle2: 'rgba(245, 158, 11, 0.12)', // gold/amber
    primaryAccent: '#DC2626', // red-600
    todayCellBg: '#DC2626',
    todayCellShadow: '#DC2626',
  },

  // Tháng 2 - Xuân về (Pink Cherry Blossom)
  2: {
    name: 'Xuân Về',
    background: '#FDF2F8', // pink-50
    blurCircle1: 'rgba(236, 72, 153, 0.15)', // pink
    blurCircle2: 'rgba(244, 114, 182, 0.1)', // pink lighter
    primaryAccent: '#DB2777', // pink-600
    todayCellBg: '#DB2777',
    todayCellShadow: '#DB2777',
  },

  // Tháng 3 - Mùa xuân (Fresh Green)
  3: {
    name: 'Mùa Xuân',
    background: '#F0FDF4', // emerald-50
    blurCircle1: 'rgba(34, 197, 94, 0.15)', // green
    blurCircle2: 'rgba(74, 222, 128, 0.1)', // green lighter
    primaryAccent: '#16A34A', // green-600
    todayCellBg: '#16A34A',
    todayCellShadow: '#16A34A',
  },

  // Tháng 4 - Hoa nở (Lavender Purple)
  4: {
    name: 'Hoa Nở',
    background: '#FAF5FF', // purple-50
    blurCircle1: 'rgba(168, 85, 247, 0.12)', // purple
    blurCircle2: 'rgba(192, 132, 252, 0.1)', // purple lighter
    primaryAccent: '#9333EA', // purple-600
    todayCellBg: '#9333EA',
    todayCellShadow: '#9333EA',
  },

  // Tháng 5 - Đoan Ngọ (Warm Orange)
  5: {
    name: 'Đoan Ngọ',
    background: '#FFF7ED', // orange-50
    blurCircle1: 'rgba(249, 115, 22, 0.15)', // orange
    blurCircle2: 'rgba(251, 146, 60, 0.1)', // orange lighter
    primaryAccent: '#EA580C', // orange-600
    todayCellBg: '#EA580C',
    todayCellShadow: '#EA580C',
  },

  // Tháng 6 - Hè sang (Sky Blue)
  6: {
    name: 'Hè Sang',
    background: '#F0F9FF', // sky-50
    blurCircle1: 'rgba(14, 165, 233, 0.15)', // sky
    blurCircle2: 'rgba(56, 189, 248, 0.1)', // sky lighter
    primaryAccent: '#0284C7', // sky-600
    todayCellBg: '#0284C7',
    todayCellShadow: '#0284C7',
  },

  // Tháng 7 - Vu Lan (Indigo/Violet - Buddhist)
  7: {
    name: 'Vu Lan',
    background: '#EEF2FF', // indigo-50
    blurCircle1: 'rgba(99, 102, 241, 0.15)', // indigo
    blurCircle2: 'rgba(129, 140, 248, 0.1)', // indigo lighter
    primaryAccent: '#4F46E5', // indigo-600
    todayCellBg: '#4F46E5',
    todayCellShadow: '#4F46E5',
  },

  // Tháng 8 - Trung Thu (Gold/Yellow Moon)
  8: {
    name: 'Trung Thu',
    background: '#FEFCE8', // yellow-50
    blurCircle1: 'rgba(234, 179, 8, 0.18)', // yellow/gold
    blurCircle2: 'rgba(250, 204, 21, 0.12)', // yellow lighter
    primaryAccent: '#CA8A04', // yellow-600
    todayCellBg: '#CA8A04',
    todayCellShadow: '#CA8A04',
  },

  // Tháng 9 - Thu sang (Amber/Orange Autumn)
  9: {
    name: 'Thu Sang',
    background: '#FFFBEB', // amber-50
    blurCircle1: 'rgba(245, 158, 11, 0.15)', // amber
    blurCircle2: 'rgba(251, 191, 36, 0.1)', // amber lighter
    primaryAccent: '#D97706', // amber-600
    todayCellBg: '#D97706',
    todayCellShadow: '#D97706',
  },

  // Tháng 10 - Cuối thu (Teal/Cyan)
  10: {
    name: 'Cuối Thu',
    background: '#F0FDFA', // teal-50
    blurCircle1: 'rgba(20, 184, 166, 0.15)', // teal
    blurCircle2: 'rgba(45, 212, 191, 0.1)', // teal lighter
    primaryAccent: '#0D9488', // teal-600
    todayCellBg: '#0D9488',
    todayCellShadow: '#0D9488',
  },

  // Tháng 11 - Đông về (Cool Slate/Gray Blue)
  11: {
    name: 'Đông Về',
    background: '#F8FAFC', // slate-50
    blurCircle1: 'rgba(100, 116, 139, 0.12)', // slate
    blurCircle2: 'rgba(148, 163, 184, 0.1)', // slate lighter
    primaryAccent: '#475569', // slate-600
    todayCellBg: '#475569',
    todayCellShadow: '#475569',
  },

  // Tháng 12 - Giáng sinh & Năm mới (Emerald Green - default)
  12: {
    name: 'Giáng Sinh',
    background: '#F0FDF4', // emerald-50
    blurCircle1: 'rgba(5, 150, 105, 0.2)', // emerald
    blurCircle2: 'rgba(245, 158, 11, 0.1)', // accent amber
    primaryAccent: '#059669', // emerald-600
    todayCellBg: '#059669',
    todayCellShadow: '#059669',
  },
};

/**
 * Get theme for a specific month
 * @param month - Month number (1-12)
 * @returns MonthTheme
 */
export function getMonthTheme(month: number): MonthTheme {
  // Ensure month is between 1-12
  const normalizedMonth = ((month - 1) % 12) + 1;
  return MONTH_THEMES[normalizedMonth] || MONTH_THEMES[12];
}

/**
 * Get theme for a specific date
 * @param date - Date object
 * @returns MonthTheme
 */
export function getThemeForDate(date: Date): MonthTheme {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  return getMonthTheme(month);
}

/**
 * Get year variation factor (slight hue shift per year)
 * Creates subtle variety between years
 * @param year - Year number
 * @returns number between 0-1 for hue adjustment
 */
export function getYearVariation(year: number): number {
  // Use year modulo to create cycling variation
  return (year % 5) * 0.02; // 0, 0.02, 0.04, 0.06, 0.08
}
