/**
 * WidgetDataPreparer.ts
 *
 * Prepares calendar data for the iOS widget
 * Uses lunar-javascript library to calculate lunar dates
 */

import { Solar } from 'lunar-javascript';
import { CalendarWidgetData, CalendarDayData } from './WidgetBridge';

/**
 * Vietnamese lunar month names
 */
const LUNAR_MONTH_NAMES = [
  '', // Index 0 unused
  'Tháng Giêng',
  'Tháng Hai',
  'Tháng Ba',
  'Tháng Tư',
  'Tháng Năm',
  'Tháng Sáu',
  'Tháng Bảy',
  'Tháng Tám',
  'Tháng Chín',
  'Tháng Mười',
  'Tháng Một',
  'Tháng Chạp',
];

/**
 * Heavenly Stems (Thiên Can)
 */
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

/**
 * Earthly Branches (Địa Chi)
 */
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/**
 * Get Can Chi year name for a given lunar year
 * @param year Lunar year
 * @returns Can Chi string (e.g., "Bính Ngọ")
 */
function getCanChiYear(year: number): string {
  const canIndex = (year - 4) % 10;
  const chiIndex = (year - 4) % 12;
  const can = CAN[canIndex >= 0 ? canIndex : canIndex + 10];
  const chi = CHI[chiIndex >= 0 ? chiIndex : chiIndex + 12];
  return `${can} ${chi}`;
}

/**
 * Prepare complete widget data for a given date
 * Generates 42 days (6 weeks) starting from Monday
 *
 * @param date Reference date (default: current date)
 * @returns CalendarWidgetData ready for widget
 */
export function prepareWidgetData(date: Date = new Date()): CalendarWidgetData {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  const year = solar.getYear();
  const month = solar.getMonth();

  // Get first day of month and its weekday
  const firstDay = Solar.fromYmd(year, month, 1);
  const firstDayOfWeek = firstDay.getWeek(); // 0=Sunday

  // Calculate offset for Monday start (T2)
  // If first day is Sunday (0), we need 6 days from previous month
  // If first day is Monday (1), we need 0 days from previous month
  // Formula: (firstDayOfWeek + 6) % 7
  const daysFromPrevMonth = (firstDayOfWeek + 6) % 7;

  // Get days in current month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Today for comparison
  const today = Solar.fromDate(new Date());
  const todayYmd = today.toYmd();

  const days: CalendarDayData[] = [];

  // Previous month days
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const s = Solar.fromYmd(prevYear, prevMonth, day);
    const l = s.getLunar();
    days.push({
      solar: day,
      lunar: l.getDay(),
      lunarMonth: Math.abs(l.getMonth()),
      dayOfWeek: s.getWeek(),
      isCurrentMonth: false,
      isToday: s.toYmd() === todayYmd,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const s = Solar.fromYmd(year, month, day);
    const l = s.getLunar();
    days.push({
      solar: day,
      lunar: l.getDay(),
      lunarMonth: Math.abs(l.getMonth()),
      dayOfWeek: s.getWeek(),
      isCurrentMonth: true,
      isToday: s.toYmd() === todayYmd,
    });
  }

  // Next month days to complete 35 cells (5 weeks)
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const remaining = 35 - days.length;

  for (let day = 1; day <= remaining; day++) {
    const s = Solar.fromYmd(nextYear, nextMonth, day);
    const l = s.getLunar();
    days.push({
      solar: day,
      lunar: l.getDay(),
      lunarMonth: Math.abs(l.getMonth()),
      dayOfWeek: s.getWeek(),
      isCurrentMonth: false,
      isToday: s.toYmd() === todayYmd,
    });
  }

  // Get Can Chi for the lunar year
  const canChiYear = getCanChiYear(lunar.getYear());
  const lunarMonthIndex = Math.abs(lunar.getMonth());

  return {
    currentMonth: month,
    currentYear: year,
    lunarMonth: lunarMonthIndex,
    lunarYear: lunar.getYear(),
    monthName: `Tháng ${month}, ${year}`,
    lunarMonthName: `${LUNAR_MONTH_NAMES[lunarMonthIndex]} ${canChiYear}`,
    days,
  };
}
