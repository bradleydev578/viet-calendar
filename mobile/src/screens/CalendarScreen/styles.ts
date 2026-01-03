import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 32) / 7); // 7 days, 16px padding each side
const DAY_CELL_HEIGHT = 56; // Fixed height for day cells

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.calendar,
  },
  // Blur circle decorations
  blurCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(5, 150, 105, 0.2)', // primary with opacity
  },
  blurCircle2: {
    position: 'absolute',
    top: 160,
    left: -80,
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // accent with opacity
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  calendarContainer: {
    // Remove flex: 1 to allow natural height
  },
  gridScroll: {
    // Remove flex: 1 to allow natural height
  },
  // Weekday header with glass effect
  weekDayHeader: {
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  weekDayCell: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral[400],
  },
  weekDaySunday: {
    color: '#EF4444', // Red-500 for Sunday
  },
  weekDaySaturday: {
    color: colors.primary[600], // Primary green for Saturday
  },
  calendarGrid: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  // Day cell base style
  dayCell: {
    width: CELL_SIZE,
    height: DAY_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  // Today cell - gradient effect with shadow glow
  dayCellToday: {
    backgroundColor: colors.primary[600],
    borderRadius: 20,
    transform: [{ scale: 1.05 }],
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 20,
    height: 72,
  },
  dayCellSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dayCellOtherMonth: {
    opacity: 0.3,
    transform: [{ scale: 0.9 }],
  },
  // Rằm (full moon) cell - amber background
  dayCellRam: {
    backgroundColor: colors.accent[50],
    borderWidth: 1,
    borderColor: colors.accent[100],
  },
  // Holiday cell - red background
  dayCellHoliday: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-50
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  // First day of lunar month - indigo background
  dayCellLunarFirst: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)', // indigo-50
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  // Solar day text
  solarDay: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.neutral[900],
  },
  solarDayToday: {
    color: colors.neutral[0],
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  solarDaySunday: {
    color: '#EF4444', // Red-500
    fontWeight: '700',
  },
  solarDaySaturday: {
    color: colors.primary[600],
  },
  // Lunar day text
  lunarDay: {
    fontSize: 10,
    color: colors.neutral[500],
    marginTop: 2,
  },
  lunarDayToday: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  lunarDayFirst: {
    color: '#6366F1', // indigo-500
    fontWeight: '700',
  },
  // Holiday dot indicator
  holidayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EF4444',
    position: 'absolute',
    bottom: 2,
  },
  // RẰM Badge - amber/gold dot with glow
  ramBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent[400],
    shadowColor: colors.accent[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  ramBadgeText: {
    display: 'none', // Hide text, show only dot
  },
  // Rằm text badge (show "Rằm" text below date)
  ramTextBadge: {
    position: 'absolute',
    bottom: 2,
  },
  ramText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.accent[600],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Weekend lunar day colors
  lunarDaySunday: {
    color: '#EF4444',
  },
  lunarDaySaturday: {
    color: colors.primary[600],
  },
  // Lunar holiday styles (red text for important lunar dates)
  solarDayLunarHoliday: {
    color: '#DC2626', // red-600
    fontWeight: '700',
  },
  lunarDayLunarHoliday: {
    color: '#EF4444', // red-500
  },
  // Today glow effect at bottom
  todayGlow: {
    position: 'absolute',
    bottom: -4,
    width: 32,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
});

export const CELL_SIZE_EXPORT = CELL_SIZE;
