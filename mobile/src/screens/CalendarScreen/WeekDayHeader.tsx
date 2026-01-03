import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

// Tuần bắt đầu từ Thứ 2 (Monday), kết thúc Chủ nhật (Sunday)
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const WEEKDAY_FULL_NAMES = [
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
  'Chủ Nhật',
];

export function WeekDayHeader() {
  return (
    <View
      style={styles.weekDayHeader}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel="Các ngày trong tuần: Thứ Hai đến Chủ Nhật"
    >
      {WEEKDAYS.map((day, index) => (
        <View
          key={day}
          style={styles.weekDayCell}
          accessible={true}
          accessibilityLabel={WEEKDAY_FULL_NAMES[index]}
        >
          <Text
            style={[
              styles.weekDayText,
              index === 5 && styles.weekDaySaturday, // T7 is at index 5
              index === 6 && styles.weekDaySunday,   // CN is at index 6
            ]}
          >
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
}
