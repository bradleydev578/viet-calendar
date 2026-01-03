import { useState, useCallback, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  getMonth,
  getYear,
} from 'date-fns';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  dayOfWeek: number;
}

export interface UseCalendarMonthResult {
  // Current month state
  currentMonth: Date;
  monthNumber: number;
  yearNumber: number;

  // Navigation
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  goToMonth: (date: Date) => void;

  // Selection
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectDate: (date: Date) => void;

  // Calendar grid
  weeks: CalendarDay[][];
  daysInMonth: CalendarDay[];
}

/**
 * Hook quản lý trạng thái tháng trong calendar
 */
export function useCalendarMonth(initialDate?: Date): UseCalendarMonthResult {
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(initialDate || new Date())
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const today = new Date();

  // Navigation functions
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(startOfMonth(now));
    setSelectedDate(now);
  }, []);

  const goToMonth = useCallback((date: Date) => {
    setCurrentMonth(startOfMonth(date));
  }, []);

  // Select date
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    // If selected date is in different month, navigate to that month
    if (!isSameMonth(date, currentMonth)) {
      setCurrentMonth(startOfMonth(date));
    }
  }, [currentMonth]);

  // Generate calendar grid
  const { weeks, daysInMonth } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const weeks: CalendarDay[][] = [];
    const daysInMonth: CalendarDay[] = [];
    let currentWeek: CalendarDay[] = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      const calendarDay: CalendarDay = {
        date: day,
        isCurrentMonth: isSameMonth(day, currentMonth),
        isToday: isSameDay(day, today),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
        dayOfWeek: day.getDay(),
      };

      currentWeek.push(calendarDay);

      if (calendarDay.isCurrentMonth) {
        daysInMonth.push(calendarDay);
      }

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      day = addDays(day, 1);
    }

    return { weeks, daysInMonth };
  }, [currentMonth, selectedDate, today]);

  return {
    currentMonth,
    monthNumber: getMonth(currentMonth) + 1, // 1-12
    yearNumber: getYear(currentMonth),
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    goToMonth,
    selectedDate,
    setSelectedDate,
    selectDate,
    weeks,
    daysInMonth,
  };
}
