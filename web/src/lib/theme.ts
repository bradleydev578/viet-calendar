/**
 * Monthly theme system based on Vietnamese cultural calendar (12 Sắc Màu Bốn Mùa)
 * Supports both light and dark modes with seasonal colors, motifs, and folk quotes
 */

export interface MonthTheme {
  name: string;           // Vietnamese theme name
  background: string;     // Screen background color (light mode)
  backgroundDark: string; // Screen background color (dark mode)
  blurCircle1: string;    // Primary decorative blur circle
  blurCircle2: string;    // Secondary decorative blur circle
  primaryAccent: string;  // Primary accent color
  primaryHover: string;   // Primary hover color
  darkAccent: string;     // Deep gradient end color for 3D Wall Calendar plaque
  seasonBadge: string;    // Season + Solar term badge (e.g. "MÙA XUÂN • TIẾT TIỂU HÀN")
  motif: string;          // Cultural emoji motif for the month
  folkQuote: string;      // Traditional Vietnamese ca dao / seasonal quote
  themeDesc: string;      // Palette description (e.g. "Đỏ Son Đào Phai")
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
    darkAccent: '#991B1B',
    seasonBadge: 'MÙA XUÂN • TIẾT TIỂU HÀN',
    motif: '🌸',
    folkQuote: '“Thịt mỡ dưa hành câu đối đỏ — Cây nêu tràng pháo bánh chưng xanh.”',
    themeDesc: 'Đỏ Son Đào Phai',
    todayCellBg: '#DC2626',
    todayCellShadow: '0 8px 20px -4px rgba(220, 38, 38, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 30, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  2: {
    name: 'Xuân Về Lễ Hội',
    background: '#FDF2F8', // pink-50
    backgroundDark: '#1a0f14',
    blurCircle1: 'rgba(219, 39, 119, 0.30)',
    blurCircle2: 'rgba(236, 72, 153, 0.25)',
    primaryAccent: '#DB2777',
    primaryHover: '#BE185D',
    darkAccent: '#9D174D',
    seasonBadge: 'MÙA XUÂN • TIẾT LẬP XUÂN',
    motif: '🌺',
    folkQuote: '“Tháng Giêng là tháng ăn chơi — Tháng Hai cờ bạc, tháng Ba rượu chè.”',
    themeDesc: 'Hồng Đào Mùa Lễ Hội',
    todayCellBg: '#DB2777',
    todayCellShadow: '0 8px 20px -4px rgba(219, 39, 119, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 30, 35, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  3: {
    name: 'Lộc Biếc Mùa Xuân',
    background: '#F0FDF4', // emerald-50
    backgroundDark: '#0f1a14',
    blurCircle1: 'rgba(22, 163, 74, 0.30)',
    blurCircle2: 'rgba(34, 197, 94, 0.25)',
    primaryAccent: '#16A34A',
    primaryHover: '#15803D',
    darkAccent: '#166534',
    seasonBadge: 'MÙA XUÂN • TIẾT KINH TRẬP',
    motif: '🌿',
    folkQuote: '“Mùa xuân là Tết trồng cây — Làm cho đất nước càng ngày càng xuân.”',
    themeDesc: 'Xanh Lộc Non Đâm Chồi',
    todayCellBg: '#16A34A',
    todayCellShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(30, 40, 35, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  4: {
    name: 'Giao Mùa Hoa Nở',
    background: '#FAF5FF', // purple-50
    backgroundDark: '#140f1a',
    blurCircle1: 'rgba(147, 51, 234, 0.30)',
    blurCircle2: 'rgba(168, 85, 247, 0.25)',
    primaryAccent: '#9333EA',
    primaryHover: '#7E22CE',
    darkAccent: '#6B21A8',
    seasonBadge: 'GIAO MÙA • TIẾT THANH MINH',
    motif: '🪻',
    folkQuote: '“Thanh Minh trong tiết tháng Ba — Lễ là tảo mộ, hội là đạp thanh.”',
    themeDesc: 'Tím Bằng Lăng & Hoa Loa Kèn',
    todayCellBg: '#9333EA',
    todayCellShadow: '0 8px 20px -4px rgba(147, 51, 234, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(35, 30, 40, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  5: {
    name: 'Nắng Hạ Đoan Ngọ',
    background: '#FFF7ED', // orange-50
    backgroundDark: '#1a140f',
    blurCircle1: 'rgba(234, 88, 12, 0.30)',
    blurCircle2: 'rgba(249, 115, 22, 0.25)',
    primaryAccent: '#EA580C',
    primaryHover: '#C2410C',
    darkAccent: '#9A3412',
    seasonBadge: 'MÙA HẠ • TIẾT LẬP HẠ',
    motif: '🔥',
    folkQuote: '“Tháng Năm giỗ mẹ cùng cha — Đêm nằm nghĩ lại câu ca thuở nào.”',
    themeDesc: 'Cam Đỏ Hoa Phượng Vĩ',
    todayCellBg: '#EA580C',
    todayCellShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 35, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  6: {
    name: 'Hè Sang Gió Biển',
    background: '#F0F9FF', // sky-50
    backgroundDark: '#0f141a',
    blurCircle1: 'rgba(2, 132, 199, 0.35)',
    blurCircle2: 'rgba(56, 189, 248, 0.30)',
    primaryAccent: '#0284C7',
    primaryHover: '#0369A1',
    darkAccent: '#075985',
    seasonBadge: 'MÙA HẠ • TIẾT HẠ CHÍ',
    motif: '🪷',
    folkQuote: '“Trong đầm gì đẹp bằng sen — Lá xanh bông trắng lại chen nhị vàng.”',
    themeDesc: 'Xanh Biển Khơi & Hồ Sen',
    todayCellBg: '#0284C7',
    todayCellShadow: '0 8px 20px -4px rgba(2, 132, 199, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.60)',
    surfaceDark: 'rgba(30, 35, 40, 0.7)',
    accentGold: '#B8860B',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  7: {
    name: 'Mưa Ngâu Vu Lan',
    background: '#EEF2FF', // indigo-50
    backgroundDark: '#0f0f1a',
    blurCircle1: 'rgba(79, 70, 229, 0.30)',
    blurCircle2: 'rgba(99, 102, 241, 0.25)',
    primaryAccent: '#4F46E5',
    primaryHover: '#4338CA',
    darkAccent: '#3730A3',
    seasonBadge: 'MÙA HẠ THU • TIẾT TIỂU THỬ',
    motif: '🏮',
    folkQuote: '“Công cha như núi Thái Sơn — Nghĩa mẹ như nước trong nguồn chảy ra.”',
    themeDesc: 'Chàm Tím Mưa Ngâu & Hiếu Đạo',
    todayCellBg: '#4F46E5',
    todayCellShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(30, 30, 40, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  8: {
    name: 'Trăng Rằm Trung Thu',
    background: '#FEFCE8', // yellow-50
    backgroundDark: '#1a180f',
    blurCircle1: 'rgba(202, 138, 4, 0.35)',
    blurCircle2: 'rgba(250, 204, 21, 0.30)',
    primaryAccent: '#CA8A04',
    primaryHover: '#A16207',
    darkAccent: '#854D0E',
    seasonBadge: 'MÙA THU • TIẾT LẬP THU',
    motif: '🌕',
    folkQuote: '“Trăng rằm tháng Tám sáng trong — Rước đèn phá cỗ ấm lòng đoàn viên.”',
    themeDesc: 'Vàng Ánh Kim Trăng Rằm',
    todayCellBg: '#CA8A04',
    todayCellShadow: '0 8px 20px -4px rgba(202, 138, 4, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 38, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  9: {
    name: 'Thu Sang Lá Phong',
    background: '#FFFBEB', // amber-50
    backgroundDark: '#1a160f',
    blurCircle1: 'rgba(217, 119, 6, 0.30)',
    blurCircle2: 'rgba(245, 158, 11, 0.25)',
    primaryAccent: '#D97706',
    primaryHover: '#B45309',
    darkAccent: '#92400E',
    seasonBadge: 'MÙA THU • TIẾT THU PHÂN',
    motif: '🍁',
    folkQuote: '“Cốm Vòng, gạo tám Mễ Trì — Tương Bần, húng Láng còn gì ngon hơn.”',
    themeDesc: 'Vàng Hổ Phách Thu Hà Nội',
    todayCellBg: '#D97706',
    todayCellShadow: '0 8px 20px -4px rgba(217, 119, 6, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(40, 36, 30, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  10: {
    name: 'Cuối Thu Sương Sớm',
    background: '#F0FDFA', // teal-50
    backgroundDark: '#0f1a18',
    blurCircle1: 'rgba(13, 148, 136, 0.30)',
    blurCircle2: 'rgba(20, 184, 166, 0.25)',
    primaryAccent: '#0D9488',
    primaryHover: '#0F766E',
    darkAccent: '#115E59',
    seasonBadge: 'MÙA THU • TIẾT HÀN LỘ',
    motif: '🌾',
    folkQuote: '“Tháng Mười có chiếu có chăn — Có cơm gạo mới ấm ngăn cửa nhà.”',
    themeDesc: 'Xanh Ngọc Lam Sương Thu',
    todayCellBg: '#0D9488',
    todayCellShadow: '0 8px 20px -4px rgba(13, 148, 136, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(30, 40, 38, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  11: {
    name: 'Lập Đông Gió Bấc',
    background: '#F8FAFC', // slate-50
    backgroundDark: '#111816',
    blurCircle1: 'rgba(71, 85, 105, 0.25)',
    blurCircle2: 'rgba(100, 116, 139, 0.20)',
    primaryAccent: '#475569',
    primaryHover: '#334155',
    darkAccent: '#1E293B',
    seasonBadge: 'MÙA ĐÔNG • TIẾT LẬP ĐÔNG',
    motif: '❄️',
    folkQuote: '“Muốn sang thì bắc cầu kiều — Muốn con hay chữ thì yêu lấy thầy.”',
    themeDesc: 'Xanh Đá Phiến Gió Mùa Đông',
    todayCellBg: '#475569',
    todayCellShadow: '0 8px 20px -4px rgba(71, 85, 105, 0.4)',
    surfaceLight: 'rgba(255, 255, 255, 0.65)',
    surfaceDark: 'rgba(35, 40, 38, 0.7)',
    accentGold: '#DAA520',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  12: {
    name: 'Giáng Sinh & Chạp Về',
    background: '#F0FDF4', // emerald-50
    backgroundDark: '#111816',
    blurCircle1: 'rgba(6, 150, 105, 0.30)',
    blurCircle2: 'rgba(218, 165, 32, 0.20)',
    primaryAccent: '#059669',
    primaryHover: '#047857',
    darkAccent: '#064E3B',
    seasonBadge: 'MÙA ĐÔNG • TIẾT ĐÔNG CHÍ',
    motif: '🎄',
    folkQuote: '“Tháng Chạp là tháng trồng khoai — Tháng Giêng trồng đậu, tháng Hai trồng cà.”',
    themeDesc: 'Xanh Ngọc Lục Bảo Thông Noel',
    todayCellBg: '#059669',
    todayCellShadow: '0 8px 20px -4px rgba(5, 150, 105, 0.4)',
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
