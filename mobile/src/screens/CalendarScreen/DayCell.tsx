import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { vi } from 'date-fns/locale';

import { styles } from './styles';
import { LunarCalculator } from '../../core/lunar';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  selectedDate?: Date;
  onPress: (date: Date) => void;
  isHoliday?: boolean;
  showLunarDates?: boolean;
  showHolidayMarkers?: boolean;
}

export const DayCell = memo(function DayCell({
  date,
  currentMonth,
  selectedDate,
  onPress,
  isHoliday = false,
  showLunarDates = true,
  showHolidayMarkers = true,
}: DayCellProps) {
  const today = new Date();
  const isToday = isSameDay(date, today);
  const isSelected = selectedDate && isSameDay(date, selectedDate);
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const dayOfWeek = date.getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;

  // Lấy ngày âm lịch
  const lunarDate = LunarCalculator.toLunar(date);
  const isFirstDayOfLunarMonth = lunarDate.day === 1;
  const isFullMoon = lunarDate.day === 15; // Ngày Rằm (15 âm lịch)

  // Format lunar date - show month/day for first day, just day otherwise
  const lunarDayText = isFirstDayOfLunarMonth
    ? `${lunarDate.day}/${lunarDate.month}`
    : String(lunarDate.day);

  // Ngày lễ âm lịch quan trọng (hiển thị màu đỏ trong calendar)
  const isLunarHoliday = (
    (lunarDate.month === 1 && lunarDate.day >= 1 && lunarDate.day <= 3) || // Tết Nguyên Đán
    (lunarDate.month === 1 && lunarDate.day === 15) || // Tết Nguyên Tiêu
    (lunarDate.month === 3 && lunarDate.day === 3) || // Tết Hàn Thực
    (lunarDate.month === 4 && lunarDate.day === 15) || // Phật Đản
    (lunarDate.month === 5 && lunarDate.day === 5) || // Tết Đoan Ngọ
    (lunarDate.month === 7 && lunarDate.day === 15) || // Vu Lan
    (lunarDate.month === 8 && lunarDate.day === 15) || // Trung Thu
    (lunarDate.month === 9 && lunarDate.day === 9) || // Tết Trùng Cửu
    (lunarDate.month === 10 && lunarDate.day === 15) || // Tết Hạ Nguyên
    (lunarDate.month === 12 && lunarDate.day >= 23) // Ông Táo + cuối năm
  );

  // Accessibility label
  const accessibilityLabel = useMemo(() => {
    const weekday = format(date, 'EEEE', { locale: vi });
    const solarStr = format(date, 'd MMMM yyyy', { locale: vi });
    const lunarStr = `âm lịch ${lunarDate.day} tháng ${lunarDate.month}`;

    let label = `${weekday}, ${solarStr}, ${lunarStr}`;

    if (isToday) {
      label = `Hôm nay, ${label}`;
    }
    if (isSelected) {
      label += ', đã chọn';
    }
    if (isHoliday) {
      label += ', ngày lễ';
    }
    if (isFullMoon) {
      label += ', ngày Rằm';
    }

    return label;
  }, [date, lunarDate, isToday, isSelected, isHoliday, isFullMoon]);

  const handlePress = () => {
    onPress(date);
  };

  // Determine cell background style based on day type
  const getCellStyle = (): StyleProp<ViewStyle> => {
    if (!isCurrentMonth) {
      return [styles.dayCell, styles.dayCellOtherMonth];
    }

    if (isToday) {
      return [styles.dayCell, styles.dayCellToday];
    } else if (isFullMoon && showLunarDates) {
      // Only show Rằm style if lunar dates are enabled
      return [styles.dayCell, styles.dayCellRam];
    } else if (showHolidayMarkers && (isHoliday || isLunarHoliday)) {
      // Only show holiday style if holiday markers are enabled
      return [styles.dayCell, styles.dayCellHoliday];
    } else if (isFirstDayOfLunarMonth && showLunarDates) {
      // Only show lunar first day style if lunar dates are enabled
      return [styles.dayCell, styles.dayCellLunarFirst];
    } else if (isSelected) {
      return [styles.dayCell, styles.dayCellSelected];
    }

    return styles.dayCell;
  };

  return (
    <TouchableOpacity
      style={getCellStyle()}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Nhấn đúp để xem chi tiết ngày"
      accessibilityState={{
        selected: isSelected,
      }}
    >
      <Text
        style={[
          styles.solarDay,
          isToday && styles.solarDayToday,
          !isToday && showHolidayMarkers && (isHoliday || isLunarHoliday) && styles.solarDayLunarHoliday,
          !isToday && !(showHolidayMarkers && (isHoliday || isLunarHoliday)) && isSunday && styles.solarDaySunday,
          !isToday && !(showHolidayMarkers && (isHoliday || isLunarHoliday)) && isSaturday && styles.solarDaySaturday,
        ]}
      >
        {format(date, 'd')}
      </Text>
      {/* Show lunar date only if showLunarDates is enabled */}
      {showLunarDates && (
        <>
          {/* Show "Rằm" text for full moon days instead of lunar day number */}
          {isFullMoon && isCurrentMonth && !isToday ? (
            <Text style={styles.ramText}>Rằm</Text>
          ) : (
            <Text
              style={[
                styles.lunarDay,
                isToday && styles.lunarDayToday,
                isFirstDayOfLunarMonth && !isToday && !(showHolidayMarkers && isLunarHoliday) && styles.lunarDayFirst,
                !isToday && showHolidayMarkers && (isHoliday || isLunarHoliday) && styles.lunarDayLunarHoliday,
                !isToday && !(showHolidayMarkers && (isHoliday || isLunarHoliday)) && !isFirstDayOfLunarMonth && isSunday && styles.lunarDaySunday,
                !isToday && !(showHolidayMarkers && (isHoliday || isLunarHoliday)) && !isFirstDayOfLunarMonth && isSaturday && styles.lunarDaySaturday,
              ]}
            >
              {lunarDayText}
            </Text>
          )}
          {/* Amber glow dot for Rằm */}
          {isFullMoon && isCurrentMonth && !isToday && (
            <View style={styles.ramBadge} />
          )}
        </>
      )}
      {/* Red dot for holidays (non-Rằm) - only if showHolidayMarkers is enabled */}
      {showHolidayMarkers && isHoliday && !isFullMoon && <View style={styles.holidayDot} />}
      {/* Indigo dot for first day of lunar month - only if showLunarDates is enabled */}
      {showLunarDates && isFirstDayOfLunarMonth && !isToday && !isFullMoon && !isHoliday && (
        <View style={[styles.holidayDot, { backgroundColor: '#6366F1' }]} />
      )}
      {/* Today glow effect */}
      {isToday && <View style={styles.todayGlow} />}
    </TouchableOpacity>
  );
});
