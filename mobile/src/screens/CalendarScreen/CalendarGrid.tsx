import React from 'react';
import { View } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
} from 'date-fns';

import { styles } from './styles';
import { DayCell } from './DayCell';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  holidays?: Date[];
  showLunarDates?: boolean;
  showHolidayMarkers?: boolean;
}

export function CalendarGrid({
  currentMonth,
  selectedDate,
  onSelectDate,
  holidays = [],
  showLunarDates = true,
  showHolidayMarkers = true,
}: CalendarGridProps) {
  // Tạo grid calendar cho tháng
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start from Monday (Thứ 2)
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    day = addDays(day, 1);
  }

  // Check if a date is a holiday
  const isHoliday = (date: Date): boolean => {
    return holidays.some(holiday => isSameDay(holiday, date));
  };

  return (
    <View style={styles.calendarGrid}>
      {weeks.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((date, dayIndex) => (
            <DayCell
              key={`day-${weekIndex}-${dayIndex}`}
              date={date}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onPress={onSelectDate}
              isHoliday={isHoliday(date)}
              showLunarDates={showLunarDates}
              showHolidayMarkers={showHolidayMarkers}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
