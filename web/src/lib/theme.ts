/**
 * Monthly theme system based on Vietnamese cultural calendar
 * Supports both light and dark modes with seasonal colors
 */

export interface MonthTheme {
  name: string;           // Vietnamese theme name
  background: string;     // Screen background color (light mode)
  backgroundDark: string; // Screen background color (dark mode)
  blurCircle1: string;    // Primary decorative blur circle
  blurCircle2: string;    // Secondary decorative blur circle
  primaryAccent: string;  // Primary accent color
  primaryHover: string;   // Primary hover color
  todayCellBg: string;    // Today cell background
  todayCellShadow: string; // Today cell shadow
  surfaceLight: string;   // Glass panel background (light)
  surfaceDark: string;    // Glass panel background (dark)
  accentGold: string;     // Gold accent for lunar dates
  textPrimary: string;    // Primary text color
  textSecondary: string;  // Secondary text color
}

// 12 Monthly themes based on Vietnamese cultural significance
export const MONTH_THEMES: Record<number, MonthTheme> = {
  1: {
    name: 'Tết Nguyên Đán',
    background: '#FEF2F2', // rose-50
    backgroundDark: '#1a0f0f',
    blurCircle1: 'rgba(220, 38, 38, 0.35)',
    blurCircle2: 'rgba(234, 179, 8, 0.25)',
    primaryAccent: '#DC2626',
    primaryHover: '#B91C1C',
    todayCellBg: '#DC2626',
    todayCellShadow: '0 8px 20px -4px rgba(220, 38, 38, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 30, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  2: {
    name: 'Xuân Về',
    background: '#FDF2F8', // pink-50
    backgroundDark: '#1a0f14',
    blurCircle1: 'rgba(219, 39, 119, 0.30)',
    blurCircle2: 'rgba(236, 72, 153, 0.25)',
    primaryAccent: '#DB2777',
    primaryHover: '#BE185D',
    todayCellBg: '#DB2777',
    todayCellShadow: '0 8px 20px -4px rgba(219, 39, 119, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 30, 35, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  3: {
    name: 'Mùa Xuân',
    background: '#F0FDF4', // emerald-50
    backgroundDark: '#0f1a14',
    blurCircle1: 'rgba(22, 163, 74, 0.30)',
    blurCircle2: 'rgba(34, 197, 94, 0.25)',
    primaryAccent: '#16A34A',
    primaryHover: '#15803D',
    todayCellBg: '#16A34A',
    todayCellShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(30, 40, 35, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  4: {
    name: 'Hoa Nở',
    background: '#FAF5FF', // purple-50
    backgroundDark: '#140f1a',
    blurCircle1: 'rgba(147, 51, 234, 0.30)',
    blurCircle2: 'rgba(168, 85, 247, 0.25)',
    primaryAccent: '#9333EA',
    primaryHover: '#7E22CE',
    todayCellBg: '#9333EA',
    todayCellShadow: '0 8px 20px -4px rgba(147, 51, 234, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(35, 30, 40, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  5: {
    name: 'Đoan Ngọ',
    background: '#FFF7ED', // orange-50
    backgroundDark: '#1a140f',
    blurCircle1: 'rgba(234, 88, 12, 0.30)',
    blurCircle2: 'rgba(249, 115, 22, 0.25)',
    primaryAccent: '#EA580C',
    primaryHover: '#C2410C',
    todayCellBg: '#EA580C',
    todayCellShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 35, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  6: {
    name: 'Hè Sang',
    background: '#F0F9FF', // sky-50
    backgroundDark: '#0f141a',
    blurCircle1: 'rgba(14, 165, 233, 0.35)',
    blurCircle2: 'rgba(56, 189, 248, 0.30)',
    primaryAccent: '#0EA5E9',
    primaryHover: '#0284C7',
    todayCellBg: '#0EA5E9',
    todayCellShadow: '0 8px 20px -4px rgba(14, 165, 233, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.60)',
    surfaceDark: 'rgba(30, 35, 40, 0.7)',
    accentGold: '#B8860B',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  7: {
    name: 'Vu Lan',
    background: '#EEF2FF', // indigo-50
    backgroundDark: '#0f0f1a',
    blurCircle1: 'rgba(79, 70, 229, 0.30)',
    blurCircle2: 'rgba(99, 102, 241, 0.25)',
    primaryAccent: '#4F46E5',
    primaryHover: '#4338CA',
    todayCellBg: '#4F46E5',
    todayCellShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(30, 30, 40, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  8: {
    name: 'Trung Thu',
    background: '#FEFCE8', // yellow-50
    backgroundDark: '#1a180f',
    blurCircle1: 'rgba(234, 179, 8, 0.35)',
    blurCircle2: 'rgba(250, 204, 21, 0.30)',
    primaryAccent: '#EAB308',
    primaryHover: '#CA8A04',
    todayCellBg: '#EAB308',
    todayCellShadow: '0 8px 20px -4px rgba(234, 179, 8, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 38, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  9: {
    name: 'Thu Sang',
    background: '#FFFBEB', // amber-50
    backgroundDark: '#1a160f',
    blurCircle1: 'rgba(217, 119, 6, 0.30)',
    blurCircle2: 'rgba(245, 158, 11, 0.25)',
    primaryAccent: '#D97706',
    primaryHover: '#B45309',
    todayCellBg: '#D97706',
    todayCellShadow: '0 8px 20px -4px rgba(217, 119, 6, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 36, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  10: {
    name: 'Cuối Thu',
    background: '#F0FDFA', // teal-50
    backgroundDark: '#0f1a18',
    blurCircle1: 'rgba(13, 148, 136, 0.30)',
    blurCircle2: 'rgba(20, 184, 166, 0.25)',
    primaryAccent: '#0D9488',
    primaryHover: '#0F766E',
    todayCellBg: '#0D9488',
    todayCellShadow: '0 8px 20px -4px rgba(13, 148, 136, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(30, 40, 38, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  11: {
    name: 'Đông Về',
    background: '#F8FAFC', // slate-50
    backgroundDark: '#111816',
    blurCircle1: 'rgba(71, 85, 105, 0.25)',
    blurCircle2: 'rgba(100, 116, 139, 0.20)',
    primaryAccent: '#475569',
    primaryHover: '#334155',
    todayCellBg: '#475569',
    todayCellShadow: '0 8px 20px -4px rgba(71, 85, 105, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(35, 40, 38, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  12: {
    name: 'Giáng Sinh',
    background: '#F0FDF4', // emerald-50
    backgroundDark: '#111816',
    blurCircle1: 'rgba(6, 150, 105, 0.30)',
    blurCircle2: 'rgba(218, 165, 32, 0.20)',
    primaryAccent: '#069669',
    primaryHover: '#057a55',
    todayCellBg: '#069669',
    todayCellShadow: '0 8px 20px -4px rgba(6, 150, 105, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(25, 41, 38, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
};

/**
 * Get theme for a specific month
 * @param month - Month number (1-12)
 * @returns MonthTheme
 */
export function getMonthTheme(month: number): MonthTheme {
  return MONTH_THEMES[month] || MONTH_THEMES[12];
}

/**
 * Get CSS class for month theme background
 * @param month - Month number (1-12)
 * @returns CSS class name
 */
export function getMonthThemeClass(month: number): string {
  const classMap: Record<number, string> = {
    1: 'theme-january',
    2: 'theme-february',
    3: 'theme-march',
    4: 'theme-april',
    5: 'theme-may',
    6: 'theme-june',
    7: 'theme-july',
    8: 'theme-august',
    9: 'theme-september',
    10: 'theme-october',
    11: 'theme-november',
    12: 'theme-december',
  };
  return classMap[month] || 'theme-december';
}

/**
 * Day score colors
 */
export const DAY_SCORE_COLORS = {
  excellent: '#10b981', // emerald-500
  good: '#84cc16',      // lime-500
  normal: '#eab308',    // yellow-500
  bad: '#f97316',       // orange-500
  very_bad: '#ef4444',  // red-500
};

/**
 * Weekend colors
 */
export const WEEKEND_COLORS = {
  saturday: '#2E7D32',  // green
  sunday: '#D32F2F',    // red
};

/**
 * Dark mode base colors
 */
export const DARK_MODE_COLORS = {
  background: '#111816',
  surface: '#192926',
  card: 'rgba(40, 61, 58, 0.7)',
  border: 'rgba(255, 255, 255, 0.05)',
  textPrimary: '#ffffff',
  textSecondary: '#9cbab2',
};
