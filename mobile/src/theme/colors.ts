export const colors = {
  // Primary - Emerald Green (màu chủ đạo màn hình chính - theo design)
  primary: {
    50: '#ECFDF5',   // emerald-50
    100: '#D1FAE5',  // emerald-100 (primary-soft)
    200: '#A7F3D0',  // emerald-200
    300: '#6EE7B7',  // emerald-300
    400: '#34D399',  // emerald-400
    500: '#10B981',  // emerald-500
    600: '#059669',  // emerald-600 (primary)
    700: '#047857',  // emerald-700
    800: '#065F46',  // emerald-800
    900: '#064E3B',  // emerald-900
  },

  // Secondary - Blue (màn hình chi tiết ngày)
  secondary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Accent - Amber (cho Rằm badge và highlight)
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',  // amber-400
    500: '#F59E0B',  // amber-500 (accent)
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Background colors theo design
  background: {
    light: '#FAFAFA',
    dark: '#18181B',
    calendar: '#F0FDF4',  // Light green tint for calendar
    calendarDark: '#064E3B',
  },

  // Surface colors
  surface: {
    light: '#FFFFFF',
    dark: '#27272A',
  },

  // Gradient cho Day Detail Header
  gradient: {
    dayDetail: {
      start: '#4FC3F7',
      end: '#2196F3',
    },
    greenCard: {
      start: '#66BB6A',
      end: '#388E3C',
    },
    todayCell: {
      start: '#059669',  // primary
      end: '#047857',    // emerald-700
    },
  },

  // Neutral
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  // Day Score colors
  dayScore: {
    excellent: '#4CAF50', // 80-100%
    good: '#8BC34A', // 65-79%
    normal: '#FFC107', // 50-64%
    bad: '#FF9800', // 35-49%
    veryBad: '#F44336', // 0-34%
  },

  // Star rating
  star: {
    filled: '#FFD700',
    empty: '#E0E0E0',
  },

  // Event tags
  tags: {
    holiday: '#F44336',
    memorial: '#FF9800',
    birthday: '#E91E63',
    work: '#2196F3',
    personal: '#9C27B0',
  },
};
