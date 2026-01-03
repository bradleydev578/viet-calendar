import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, isSameMonth } from 'date-fns';
import { vi } from 'date-fns/locale';

import { LunarCalculator } from '../../core/lunar';
import { colors } from '../../theme';

interface MonthHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function MonthHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: MonthHeaderProps) {
  const today = new Date();
  const isCurrentMonth = isSameMonth(currentDate, today);

  // Format month/year for compact selector
  const monthShort = `T${currentDate.getMonth() + 1}`;
  const yearShort = String(currentDate.getFullYear()).slice(-2);
  const monthYearShort = `${monthShort}/${yearShort}`;

  // Lấy thông tin năm âm lịch
  const lunarDate = LunarCalculator.toLunar(today);
  const yearInfo = LunarCalculator.getYearInfo(lunarDate.year);

  // Format today's date for left side
  const todayDay = format(today, 'd');
  const todayMonth = format(today, "'Tháng' M", { locale: vi });

  return (
    <View style={headerStyles.container} accessibilityRole="header">
      <View style={headerStyles.content}>
        {/* Left side: Today info */}
        <TouchableOpacity
          onPress={onToday}
          style={headerStyles.todaySection}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Hôm nay ${todayDay} ${todayMonth}, Năm ${yearInfo.canChi.full}`}
          accessibilityHint="Nhấn đúp để quay về hôm nay"
        >
          <Text style={headerStyles.todayLabel}>Hôm nay</Text>
          <View style={headerStyles.todayDateRow}>
            <Text style={headerStyles.todayDay}>{todayDay}</Text>
            <Text style={headerStyles.todayMonth}>{todayMonth}</Text>
          </View>
        </TouchableOpacity>

        {/* Right side: Month selector */}
        <View style={headerStyles.monthSelector}>
          <TouchableOpacity
            onPress={onPrevMonth}
            style={headerStyles.navButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tháng trước"
            accessibilityHint="Nhấn đúp để xem tháng trước"
          >
            <Icon name="chevron-left" size={20} color={colors.neutral[600]} />
          </TouchableOpacity>

          <Text style={headerStyles.monthYearText}>{monthYearShort}</Text>

          <TouchableOpacity
            onPress={onNextMonth}
            style={headerStyles.navButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tháng sau"
            accessibilityHint="Nhấn đúp để xem tháng sau"
          >
            <Icon name="chevron-right" size={20} color={colors.neutral[600]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  todaySection: {
    flex: 1,
  },
  todayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todayDateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  todayDay: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.neutral[900],
    letterSpacing: -0.5,
  },
  todayMonth: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.neutral[500],
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  monthYearText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral[900],
    width: 56,
    textAlign: 'center',
  },
});
