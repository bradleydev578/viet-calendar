/**
 * TodayWidget
 * Persistent bottom widget showing today's feng shui information
 * Story 4.1-4.7 - Glass panel design
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../../theme';
import { LunarCalculator, CanChiCalculator, TietKhiCalculator, HoangDaoCalculator } from '../../core/lunar';
import { QuoteService } from '../../core/quotes';
import { HolidayService } from '../../data/services/HolidayService';
import { useFengShuiStore } from '../../stores/useFengShuiStore';
import type { Holiday } from '../../data/types/HolidayData';

interface TodayWidgetProps {
  onPress: () => void;
  onHolidayPress?: (date: string) => void;
}

interface UpcomingHoliday extends Holiday {
  daysUntil: number;
}

export function TodayWidget({ onPress, onHolidayPress }: TodayWidgetProps) {
  const insets = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);
  const { data: fengShuiData } = useFengShuiStore();

  // Calculate all today's information
  const todayInfo = useMemo(() => {
    const lunarDate = LunarCalculator.toLunar(today);
    const canChi = CanChiCalculator.getDayCanChi(today);
    const tietKhi = TietKhiCalculator.getCurrentTietKhi(today);
    const hoangDaoHours = HoangDaoCalculator.getHoangDaoHours(today);
    const yearInfo = LunarCalculator.getYearInfo(lunarDate.year);
    const quote = QuoteService.getTodayQuote();

    // Get ngũ hành from feng shui data
    const dayData = fengShuiData?.get(format(today, 'yyyy-MM-dd'));
    const nguHanh = dayData?.nh || 'Kim';

    return {
      lunarDate,
      canChi,
      tietKhi,
      hoangDaoHours,
      nguHanh,
      yearInfo,
      quote,
    };
  }, [today, fengShuiData]);

  // Get upcoming holidays
  const upcomingHolidays = useMemo((): UpcomingHoliday[] => {
    if (!fengShuiData) return [];
    return HolidayService.getUpcomingHolidays(today, 5, fengShuiData);
  }, [today, fengShuiData]);

  // Format weekday
  const weekday = format(today, 'EEEE', { locale: vi });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  // Format date
  const dateStr = format(today, "d 'Tháng' M, yyyy", { locale: vi });

  // Format lunar date
  const lunarStr = `${String(todayInfo.lunarDate.day).padStart(2, '0')}/${String(todayInfo.lunarDate.month).padStart(2, '0')}`;

  // Format hoang dao hours (first 3, with ... if more)
  const hoangDaoStr = todayInfo.hoangDaoHours
    .slice(0, 3)
    .map((h) => h.chi)
    .join(', ') + (todayInfo.hoangDaoHours.length > 3 ? '...' : '');

  // Accessibility label for the entire widget
  const accessibilityLabel = useMemo(() => {
    const lunarFullStr = `Âm lịch ${todayInfo.lunarDate.day} tháng ${todayInfo.lunarDate.month}`;
    const canChiStr = `${todayInfo.canChi.can} ${todayInfo.canChi.chi}`;
    return `Hôm nay ${capitalizedWeekday}, ${dateStr}, ${lunarFullStr}, ngày ${canChiStr}. Giờ Hoàng Đạo: ${hoangDaoStr}. Tiết Khí: ${todayInfo.tietKhi.name}. Ngũ Hành: ${todayInfo.nguHanh}`;
  }, [capitalizedWeekday, dateStr, todayInfo, hoangDaoStr]);

  return (
    <TouchableOpacity
      style={[styles.container, { paddingBottom: insets.bottom + 8 }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Nhấn đúp để xem chi tiết ngày hôm nay"
    >
      {/* Glass Panel */}
      <View style={styles.glassPanel}>
        {/* Header Row: Weekday + Lunar Badge */}
        <View style={styles.headerRow}>
          {/* Left: Weekday and Date */}
          <View style={styles.dateSection}>
            <Text style={styles.weekdayText}>{capitalizedWeekday}</Text>
            <View style={styles.dateInfoRow}>
              <Text style={styles.dateText}>{dateStr}</Text>
              <View style={styles.dot} />
              <Text style={styles.canChiText}>{todayInfo.yearInfo.canChi.full}</Text>
            </View>
          </View>

          {/* Right: Lunar Date Badge */}
          <View style={styles.lunarBadge}>
            <Text style={styles.lunarLabel}>Âm Lịch</Text>
            <Text style={styles.lunarDate}>{lunarStr}</Text>
          </View>
        </View>

        {/* Quick Info Cards - Single Row, scroll if needed */}
        <View style={styles.infoCardsRow}>
          <View style={styles.infoCard}>
            <Icon name="white-balance-sunny" size={16} color="#F59E0B" />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>Giờ H.Đạo</Text>
              <Text style={styles.infoCardValue} numberOfLines={1}>{hoangDaoStr}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="star-four-points" size={16} color="#8B5CF6" />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>Tiết khí</Text>
              <Text style={styles.infoCardValue} numberOfLines={1}>{todayInfo.tietKhi.name}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Icon name="water" size={16} color="#3B82F6" />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardLabel}>Ngũ hành</Text>
              <Text style={styles.infoCardValue} numberOfLines={1}>{todayInfo.nguHanh}</Text>
            </View>
          </View>
        </View>

        {/* Daily Quote */}
        <View style={styles.quoteContainer}>
          <View style={styles.quoteIconContainer}>
            <Icon name="format-quote-open" size={32} color={colors.primary[200]} />
          </View>
          <Text style={styles.quoteText} numberOfLines={2}>
            {todayInfo.quote}
          </Text>
        </View>

        {/* Upcoming Holidays */}
        {upcomingHolidays.length > 0 && (
          <View style={styles.holidaysSection}>
            <Text style={styles.holidaysTitle}>Sắp tới</Text>
            <View style={styles.holidaysRow}>
              {upcomingHolidays.map((holiday) => (
                <TouchableOpacity
                  key={holiday.id}
                  style={styles.holidayCard}
                  onPress={(e) => {
                    e.stopPropagation();
                    onHolidayPress?.(holiday.date);
                  }}
                  activeOpacity={0.7}
                  accessibilityLabel={`${holiday.name}, ${HolidayService.formatDaysUntil(holiday.daysUntil)}`}
                  accessibilityHint="Nhấn để xem chi tiết ngày này"
                >
                  <View
                    style={[
                      styles.holidayDateBadge,
                      {
                        backgroundColor: HolidayService.getHolidayColor(
                          holiday.type,
                          holiday.isImportant
                        ) + '20', // Add transparency
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.holidayDateText,
                        {
                          color: HolidayService.getHolidayColor(
                            holiday.type,
                            holiday.isImportant
                          ),
                        },
                      ]}
                    >
                      {format(new Date(holiday.date), 'd/M')}
                    </Text>
                  </View>
                  <View style={styles.holidayInfo}>
                    <Text style={styles.holidayName}>
                      {holiday.name}
                    </Text>
                    <Text style={styles.holidayCountdown}>
                      {HolidayService.formatDaysUntil(holiday.daysUntil)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },

  // Glass Panel Effect
  glassPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },

  // Header Row
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateSection: {
    flex: 1,
  },
  weekdayText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral[900],
    letterSpacing: -0.5,
  },
  dateInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[500],
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral[300],
  },
  canChiText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },

  // Lunar Badge
  lunarBadge: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  lunarLabel: {
    fontSize: 10,
    color: colors.primary[600],
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lunarDate: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
    marginTop: 2,
  },

  // Info Cards - flexbox row that fits in container
  infoCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.neutral[0],
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  infoCardContent: {
    flex: 1,
    flexDirection: 'column',
  },
  infoCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral[400],
    textTransform: 'uppercase',
  },
  infoCardValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  // Quote
  quoteContainer: {
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  quoteIconContainer: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    opacity: 0.3,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    color: colors.neutral[800],
    lineHeight: 22,
  },

  // Holidays
  holidaysSection: {
    marginTop: 16,
  },
  holidaysTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral[900],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  holidaysRow: {
    flexDirection: 'column',
    gap: 8,
  },
  holidayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    padding: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  holidayDateBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holidayDateText: {
    fontSize: 11,
    fontWeight: '700',
  },
  holidayInfo: {
    flex: 1,
  },
  holidayName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  holidayCountdown: {
    fontSize: 10,
    color: colors.neutral[500],
    marginTop: 2,
  },
});

export default TodayWidget;
