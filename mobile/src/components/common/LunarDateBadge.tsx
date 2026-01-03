import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../../theme';
import { LunarCalculator, type LunarDate } from '../../core/lunar';

interface LunarDateBadgeProps {
  date: Date;
  size?: 'small' | 'medium' | 'large';
  showYear?: boolean;
}

export function LunarDateBadge({
  date,
  size = 'medium',
  showYear = false,
}: LunarDateBadgeProps) {
  const lunarDate = LunarCalculator.toLunar(date);
  const yearInfo = LunarCalculator.getYearInfo(lunarDate.year);

  const sizeStyles = SIZE_STYLES[size];

  return (
    <View style={[styles.container, sizeStyles.container]}>
      <Text style={[styles.dayText, sizeStyles.dayText]}>
        {lunarDate.day}
      </Text>
      <Text style={[styles.monthText, sizeStyles.monthText]}>
        {formatLunarMonth(lunarDate)}
      </Text>
      {showYear && (
        <Text style={[styles.yearText, sizeStyles.yearText]}>
          {yearInfo.canChi.full} {yearInfo.animalEmoji}
        </Text>
      )}
    </View>
  );
}

function formatLunarMonth(lunarDate: LunarDate): string {
  const monthName = `Tháng ${lunarDate.month}`;
  return lunarDate.isLeapMonth ? `${monthName} (Nhuận)` : monthName;
}

const SIZE_STYLES = {
  small: StyleSheet.create({
    container: {
      padding: 6,
      borderRadius: 6,
    },
    dayText: {
      fontSize: 16,
    },
    monthText: {
      fontSize: 10,
    },
    yearText: {
      fontSize: 9,
    },
  }),
  medium: StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 8,
    },
    dayText: {
      fontSize: 24,
    },
    monthText: {
      fontSize: 12,
    },
    yearText: {
      fontSize: 11,
    },
  }),
  large: StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 12,
    },
    dayText: {
      fontSize: 36,
    },
    monthText: {
      fontSize: 16,
    },
    yearText: {
      fontSize: 14,
    },
  }),
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  dayText: {
    fontWeight: '700',
    color: colors.primary[700],
  },
  monthText: {
    color: colors.primary[600],
    marginTop: 2,
  },
  yearText: {
    color: colors.primary[500],
    marginTop: 4,
  },
});
