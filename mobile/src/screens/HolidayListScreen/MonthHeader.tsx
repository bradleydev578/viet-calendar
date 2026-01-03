/**
 * MonthHeader.tsx
 * Section header for month grouping
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface MonthHeaderProps {
  month: number; // 1-12
  year: number;
}

const MONTH_NAMES = [
  'Tháng Một',
  'Tháng Hai',
  'Tháng Ba',
  'Tháng Tư',
  'Tháng Năm',
  'Tháng Sáu',
  'Tháng Bảy',
  'Tháng Tám',
  'Tháng Chín',
  'Tháng Mười',
  'Tháng Mười Một',
  'Tháng Mười Hai',
];

export function MonthHeader({ month, year }: MonthHeaderProps) {
  const monthName = MONTH_NAMES[month - 1] || `Tháng ${month}`;

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        📆 {monthName} - {year}
      </Text>
    </View>
  );
}
