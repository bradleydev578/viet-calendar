/**
 * DayDetailModalScreen - Modal presentation of Day Detail
 * Redesigned with large date display, quick info cards, score bars, and more
 */

import React, { useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';

import { useFengShuiStore } from '../../stores/useFengShuiStore';
import { DayScore } from '../../core/fengshui/DayScore';
import { HoangDaoCalculator } from '../../core/lunar';
import { HolidayService } from '../../data/services/HolidayService';
import { QuoteService } from '../../core/quotes';
import { useReducedMotion } from '../../hooks';
import { colors } from '../../theme';
import { getThemeForDate } from '../../theme/monthThemes';
import type { DayDetailModalScreenProps } from '../../app/navigation/types';
import type { Holiday } from '../../data/types/HolidayData';
import { trackScreenView, trackViewDayDetail } from '../../services/analytics';

const DISMISS_THRESHOLD = 100;

interface UpcomingHoliday extends Holiday {
  daysUntil: number;
}

/**
 * Format time range from "03:00 - 05:00" to "03 - 05"
 */
const formatShortTimeRange = (timeRange: string): string => {
  return timeRange.replace(/:00/g, '');
};

/**
 * Split activity text by period (.) into separate lines
 * Each sentence becomes a bullet point
 */
const splitActivityBySentence = (activities: string[]): string[] => {
  const result: string[] = [];
  for (const activity of activities) {
    // Split by period followed by space or end of string
    const sentences = activity.split(/\.\s*/).filter(s => s.trim().length > 0);
    for (const sentence of sentences) {
      // Add period back if it was removed and sentence doesn't end with punctuation
      const trimmed = sentence.trim();
      if (trimmed && !trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?')) {
        result.push(trimmed + '.');
      } else {
        result.push(trimmed);
      }
    }
  }
  return result;
};

export function DayDetailModalScreen({ route, navigation }: DayDetailModalScreenProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotionEnabled = useReducedMotion();
  const translateY = useSharedValue(0);

  // Get date from route params
  const dateString = route.params?.date;
  const date = dateString ? new Date(dateString) : new Date();
  const isToday = isSameDay(date, new Date());

  // Get dynamic theme based on the viewed date (same as CalendarScreen)
  const monthTheme = useMemo(() => getThemeForDate(date), [date]);

  // Get feng shui data for this date
  const { getByDate, isLoading, data: fengShuiData } = useFengShuiStore();
  const dayData = getByDate(date);

  // Calculate day score
  const score = useMemo(() => {
    if (!dayData) return null;
    return DayScore.calculate(dayData);
  }, [dayData]);

  // Get all hours with hoang dao info
  const allHours = useMemo(() => {
    return HoangDaoCalculator.getAllHours(date);
  }, [date]);

  // Get upcoming holidays
  const upcomingHolidays = useMemo((): UpcomingHoliday[] => {
    if (!fengShuiData) return [];
    return HolidayService.getUpcomingHolidays(date, 5, fengShuiData);
  }, [date, fengShuiData]);

  // Get daily quote for this date
  const quote = useMemo(() => QuoteService.getQuoteForDate(date), [date]);

  // Track screen view
  useEffect(() => {
    trackScreenView('DayDetailModalScreen');
    trackViewDayDetail({
      date: dateString || new Date().toISOString().split('T')[0],
      lunarDate: dayData ? `${dayData.ld}/${dayData.lm}` : undefined,
      dayScore: score?.score,
      source: 'calendar_tap',
    });
  }, [dateString, dayData, score]);

  // Format weekday
  const weekday = format(date, 'EEEE', { locale: vi });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const dayOfWeek = date.getDay();
  const isSunday = dayOfWeek === 0;

  // Format month name
  const monthName = format(date, 'MMMM', { locale: vi });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Accessibility labels
  const screenAccessibilityLabel = useMemo(() => {
    const solarStr = format(date, 'd MMMM yyyy', { locale: vi });
    let label = isToday ? `Hôm nay, ${capitalizedWeekday}, ${solarStr}` : `${capitalizedWeekday}, ${solarStr}`;
    if (dayData) {
      label += `, âm lịch ${dayData.ld} tháng ${dayData.lm}`;
    }
    return label;
  }, [date, isToday, capitalizedWeekday, dayData]);

  // Handle close
  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle holiday press - navigate to that date
  const handleHolidayPress = useCallback((holidayDate: string) => {
    navigation.replace('DayDetailModal', {
      date: new Date(holidayDate).toISOString(),
    });
  }, [navigation]);

  // Pan gesture for pull-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0 && !reduceMotionEnabled) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        runOnJS(handleClose)();
      } else {
        if (reduceMotionEnabled) {
          translateY.value = 0;
        } else {
          translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 300,
          });
        }
      }
    });

  // Animated style for the modal content
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Loading state
  if (isLoading) {
    return (
      <View style={[detailStyles.container, { backgroundColor: monthTheme.background }]}>
        {/* Dynamic blur circles based on month theme */}
        <View style={[detailStyles.blurCircle1, { backgroundColor: monthTheme.blurCircle1 }]} />
        <View style={[detailStyles.blurCircle2, { backgroundColor: monthTheme.blurCircle2 }]} />
        <View style={[detailStyles.header, { marginTop: 8 }]}>
          <TouchableOpacity style={detailStyles.backButton} onPress={handleClose}>
            <Icon name="arrow-left" size={24} color={colors.neutral[700]} />
          </TouchableOpacity>
          <View />
          <View style={detailStyles.calendarButton} />
        </View>
        <View style={detailStyles.emptyState}>
          <Text style={detailStyles.emptyText}>Đang tải dữ liệu...</Text>
        </View>
      </View>
    );
  }

  // No data available
  if (!dayData || !score) {
    return (
      <View style={[detailStyles.container, { backgroundColor: monthTheme.background }]}>
        {/* Dynamic blur circles based on month theme */}
        <View style={[detailStyles.blurCircle1, { backgroundColor: monthTheme.blurCircle1 }]} />
        <View style={[detailStyles.blurCircle2, { backgroundColor: monthTheme.blurCircle2 }]} />
        <View style={[detailStyles.header, { marginTop: 8 }]}>
          <TouchableOpacity style={detailStyles.backButton} onPress={handleClose}>
            <Icon name="arrow-left" size={24} color={colors.neutral[700]} />
          </TouchableOpacity>
          {isToday && (
            <View style={[detailStyles.todayBadge, { borderColor: monthTheme.primaryAccent + '30' }]}>
              <Text style={detailStyles.todayBadgeText}>Hôm nay</Text>
              <View style={[detailStyles.todayDot, { backgroundColor: monthTheme.primaryAccent }]} />
            </View>
          )}
          <View style={detailStyles.calendarButton} />
        </View>
        <View style={detailStyles.emptyState}>
          <Text style={detailStyles.emptyText}>
            Không có dữ liệu phong thủy cho ngày này
          </Text>
        </View>
      </View>
    );
  }

  // Calculate score percentage for progress bars
  const scorePercent = score.score;
  const filledBars = Math.round(scorePercent / 100 * 6);

  // Get hoang dao hours string (first 3, with ... if more)
  const hoangDaoHoursList = allHours.filter(h => h.isHoangDao);
  const hoangDaoStr = hoangDaoHoursList.slice(0, 3).map(h => h.chi).join(', ') + (hoangDaoHoursList.length > 3 ? '...' : '');

  // Check if it's a hoang dao day
  const isHoangDaoDay = score.score >= 60;

  // Get quality label
  const qualityLabel = DayScore.getQualityLabel(score.quality);

  // Get directions from dir array
  const hyThan = dayData.dir?.find(d => d.n === 'Hỷ thần')?.d || 'Đông Nam';
  const taiThan = dayData.dir?.find(d => d.n === 'Tài thần')?.d || 'Bắc';

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ flex: 1, backgroundColor: monthTheme.background }, animatedStyle]}>
        {/* Dynamic blur circle decorations based on month theme */}
        <View style={[detailStyles.blurCircle1, { backgroundColor: monthTheme.blurCircle1 }]} />
        <View style={[detailStyles.blurCircle2, { backgroundColor: monthTheme.blurCircle2 }]} />

        <SafeAreaView style={detailStyles.container} edges={['bottom']}>
          {/* Header with back button - positioned right below status bar */}
          <View style={[detailStyles.header, { marginTop: 8 }]}>
            <TouchableOpacity
              style={detailStyles.backButton}
              onPress={handleClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              accessibilityHint="Đóng chi tiết ngày"
            >
              <Icon name="arrow-left" size={24} color={colors.neutral[700]} />
            </TouchableOpacity>
            {isToday && (
              <View
                style={[detailStyles.todayBadge, { borderColor: monthTheme.primaryAccent + '30' }]}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel="Hôm nay"
              >
                <Text style={detailStyles.todayBadgeText}>Hôm nay</Text>
                <View style={[detailStyles.todayDot, { backgroundColor: monthTheme.primaryAccent }]} />
              </View>
            )}
            <View style={detailStyles.calendarButton} />
          </View>

          <ScrollView
            style={detailStyles.scrollView}
            contentContainerStyle={detailStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            accessible={true}
            accessibilityLabel={screenAccessibilityLabel}
            accessibilityRole="scrollbar"
          >
            {/* Hero Date Section */}
            <View style={detailStyles.heroSection}>
              <View style={detailStyles.heroLeft}>
                <Text style={[detailStyles.monthLabel, { color: monthTheme.primaryAccent }]}>
                  {capitalizedMonth}
                </Text>
                <Text style={detailStyles.dayNumber}>{format(date, 'd')}</Text>
                <Text style={detailStyles.yearLabel}>{format(date, 'yyyy')}</Text>
              </View>

              {/* Lunar Badge */}
              <View style={detailStyles.lunarBadge}>
                <Text style={detailStyles.lunarLabel}>Âm Lịch</Text>
                <Text style={[detailStyles.lunarDateLarge, { color: monthTheme.primaryAccent }]}>
                  {dayData.ld}
                  <Text style={[detailStyles.lunarDateSmall, { color: monthTheme.primaryAccent + '99' }]}>
                    /{dayData.lm}
                  </Text>
                </Text>
                <View style={[detailStyles.lunarDivider, { backgroundColor: monthTheme.primaryAccent + '30' }]} />
                <Text style={detailStyles.canChiSmall}>{dayData.dgz}</Text>
              </View>
            </View>

            {/* Weekday and Day Type */}
            <View style={detailStyles.weekdayRow}>
              <Text style={[detailStyles.weekdayText, isSunday && detailStyles.weekdaySunday]}>
                {capitalizedWeekday}
              </Text>
              <View style={detailStyles.dotSeparator} />
              {isHoangDaoDay && (
                <View style={detailStyles.hoangDaoBadge}>
                  <Icon name="star-four-points" size={14} color="#F59E0B" />
                  <Text style={detailStyles.hoangDaoBadgeText}>Ngày Hoàng Đạo</Text>
                </View>
              )}
            </View>

            {/* Quick Info Cards */}
            <View style={detailStyles.quickInfoGrid} accessibilityRole="list">
              <View
                style={detailStyles.quickInfoCard}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Giờ Hoàng Đạo: ${hoangDaoStr}`}
              >
                <View style={[detailStyles.quickInfoIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Icon name="white-balance-sunny" size={18} color="#F59E0B" />
                </View>
                <Text style={detailStyles.quickInfoLabel}>Giờ H.Đạo</Text>
                <Text style={detailStyles.quickInfoValue}>{hoangDaoStr}</Text>
              </View>

              <View
                style={detailStyles.quickInfoCard}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Tiết Khí: ${dayData.tk || 'Chưa rõ'}`}
              >
                <View style={[detailStyles.quickInfoIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                  <Icon name="star-four-points" size={18} color="#8B5CF6" />
                </View>
                <Text style={detailStyles.quickInfoLabel}>Tiết Khí</Text>
                <Text style={detailStyles.quickInfoValue}>{dayData.tk || 'Chưa rõ'}</Text>
              </View>

              <View
                style={detailStyles.quickInfoCard}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Ngũ Hành: ${dayData.nh || 'Kim'}`}
              >
                <View style={[detailStyles.quickInfoIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Icon name="water" size={18} color="#3B82F6" />
                </View>
                <Text style={detailStyles.quickInfoLabel}>Ngũ Hành</Text>
                <Text style={detailStyles.quickInfoValue}>{dayData.nh || 'Kim'}</Text>
              </View>
            </View>

            {/* Day Score Section */}
            <View
              style={detailStyles.scoreSection}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Chỉ số may mắn: ${score.score} phần trăm, ${qualityLabel}`}
            >
              <View style={detailStyles.scoreHeader}>
                <Text style={detailStyles.scoreTitle}>Chỉ số may mắn</Text>
                <Text style={[detailStyles.scoreValue, { color: monthTheme.primaryAccent }]}>
                  {score.score}
                  <Text style={detailStyles.scorePercent}>%</Text>
                </Text>
              </View>
              <View style={detailStyles.scoreBars} accessibilityElementsHidden={true}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <View
                    key={i}
                    style={[
                      detailStyles.scoreBar,
                      i <= filledBars
                        ? i <= 2
                          ? [detailStyles.scoreBarGlow, { backgroundColor: monthTheme.primaryAccent, shadowColor: monthTheme.primaryAccent }]
                          : i <= 4
                          ? { backgroundColor: monthTheme.primaryAccent + '99' }
                          : { backgroundColor: monthTheme.primaryAccent + '50' }
                        : detailStyles.scoreBarEmpty,
                    ]}
                  />
                ))}
              </View>
              <Text style={detailStyles.scoreQuote}>{qualityLabel}</Text>
            </View>

            {/* Activities Cards */}
            <View style={detailStyles.activitiesRow} accessibilityRole="list">
              {/* Good Activities */}
              <View
                style={[detailStyles.activityCard, detailStyles.activityCardGood]}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Việc nên làm: ${(dayData.ga || []).join(', ')}`}
              >
                <View style={detailStyles.activityHeader}>
                  <View style={detailStyles.activityIconGood}>
                    <Icon name="check-circle" size={18} color="#059669" />
                  </View>
                  <Text style={detailStyles.activityTitleGood}>Nên Làm</Text>
                </View>
                <View style={detailStyles.activityList}>
                  {splitActivityBySentence(dayData.ga || []).map((sentence, idx) => (
                    <View key={idx} style={detailStyles.activityItem}>
                      <View style={[detailStyles.activityDot, detailStyles.activityDotGood]} />
                      <Text style={detailStyles.activityText}>{sentence}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Bad Activities */}
              <View
                style={[detailStyles.activityCard, detailStyles.activityCardBad]}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Việc không nên làm: ${(dayData.ba || []).join(', ')}`}
              >
                <View style={detailStyles.activityHeader}>
                  <View style={detailStyles.activityIconBad}>
                    <Icon name="close-circle" size={18} color="#DC2626" />
                  </View>
                  <Text style={detailStyles.activityTitleBad}>Không Nên</Text>
                </View>
                <View style={detailStyles.activityList}>
                  {splitActivityBySentence(dayData.ba || []).map((sentence, idx) => (
                    <View key={idx} style={detailStyles.activityItem}>
                      <View style={[detailStyles.activityDot, detailStyles.activityDotBad]} />
                      <Text style={detailStyles.activityText}>{sentence}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Giờ Tốt Section - Horizontal Scroll */}
            <View style={detailStyles.hoursSection}>
              <View style={detailStyles.hoursSectionHeader}>
                <Text style={detailStyles.hoursSectionTitle}>Giờ Tốt</Text>
                <View style={[
                  detailStyles.hoangDaoTag,
                  {
                    backgroundColor: monthTheme.primaryAccent + '10',
                    borderColor: monthTheme.primaryAccent + '30',
                  },
                ]}>
                  <Text style={[detailStyles.hoangDaoTagText, { color: monthTheme.primaryAccent }]}>
                    Hoàng Đạo
                  </Text>
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={detailStyles.hoursScroll}
              >
                {allHours.map((hour, idx) => (
                  <View
                    key={idx}
                    style={[
                      detailStyles.hourCard,
                      hour.isHoangDao && [
                        detailStyles.hourCardActive,
                        {
                          backgroundColor: monthTheme.primaryAccent,
                          borderColor: monthTheme.primaryAccent,
                          shadowColor: monthTheme.primaryAccent,
                        },
                      ],
                    ]}
                  >
                    <Text style={[detailStyles.hourChi, hour.isHoangDao && detailStyles.hourChiActive]}>
                      {hour.chi}
                    </Text>
                    <Text style={[detailStyles.hourTime, hour.isHoangDao && detailStyles.hourTimeActive]}>
                      {formatShortTimeRange(hour.timeRange)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Compass Directions Card */}
            <View
              style={detailStyles.compassCard}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`Hướng xuất hành: Hỷ Thần hướng ${hyThan}, Tài Thần hướng ${taiThan}`}
            >
              <View style={detailStyles.compassBackground} />
              <View style={[detailStyles.compassIcon, { borderColor: monthTheme.primaryAccent + '30' }]}>
                <View style={[detailStyles.compassLine1, { backgroundColor: monthTheme.primaryAccent + '30' }]} />
                <View style={[detailStyles.compassLine2, { backgroundColor: monthTheme.primaryAccent + '30' }]} />
                <Icon name="compass" size={28} color={monthTheme.primaryAccent} />
              </View>
              <View style={detailStyles.compassContent}>
                <Text style={detailStyles.compassTitle}>Hướng Xuất Hành</Text>
                <View style={detailStyles.compassGrid}>
                  <View style={detailStyles.compassItem}>
                    <Text style={detailStyles.compassLabel}>Hỷ Thần</Text>
                    <Text style={[detailStyles.compassValue, { color: monthTheme.primaryAccent }]}>{hyThan}</Text>
                  </View>
                  <View style={detailStyles.compassItem}>
                    <Text style={detailStyles.compassLabel}>Tài Thần</Text>
                    <Text style={[detailStyles.compassValue, { color: monthTheme.primaryAccent }]}>
                      {taiThan}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Upcoming Holidays */}
            {upcomingHolidays.length > 0 && (
              <View style={detailStyles.holidaysSection}>
                <View style={detailStyles.holidaysTitleRow}>
                  <Icon name="calendar-clock" size={20} color={monthTheme.primaryAccent} />
                  <Text style={detailStyles.holidaysTitle}>Sắp Tới</Text>
                </View>
                <View style={detailStyles.holidaysGrid}>
                  {upcomingHolidays.map((holiday) => (
                    <TouchableOpacity
                      key={holiday.id}
                      style={detailStyles.holidayCard}
                      onPress={() => handleHolidayPress(holiday.date)}
                      activeOpacity={0.7}
                      accessibilityLabel={`${holiday.name}, ${HolidayService.formatDaysUntil(holiday.daysUntil)}`}
                      accessibilityHint="Nhấn để xem chi tiết ngày này"
                    >
                      <View
                        style={[
                          detailStyles.holidayDateBadge,
                          {
                            backgroundColor:
                              HolidayService.getHolidayColor(holiday.type, holiday.isImportant) + '20',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            detailStyles.holidayDateDay,
                            {
                              color: HolidayService.getHolidayColor(holiday.type, holiday.isImportant),
                            },
                          ]}
                        >
                          {format(new Date(holiday.date), 'd')}
                        </Text>
                        <Text
                          style={[
                            detailStyles.holidayDateMonth,
                            {
                              color: HolidayService.getHolidayColor(holiday.type, holiday.isImportant),
                            },
                          ]}
                        >
                          {format(new Date(holiday.date), 'M')}
                        </Text>
                      </View>
                      <View style={detailStyles.holidayInfo}>
                        <Text style={detailStyles.holidayName}>
                          {holiday.name}
                        </Text>
                        <Text style={detailStyles.holidayCountdown}>
                          {HolidayService.formatDaysUntil(holiday.daysUntil)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Daily Quote */}
            <View style={detailStyles.quoteSection}>
              <Text style={detailStyles.quoteText}>"{quote}"</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </GestureDetector>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Blur circles
  blurCircle1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  blurCircle2: {
    position: 'absolute',
    bottom: '10%',
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    zIndex: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.neutral[50],
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral[100],
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[600],
  },

  // Hero Section
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  heroLeft: {
    position: 'relative',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary[600],
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: -8,
    marginLeft: 8,
  },
  dayNumber: {
    fontSize: 120,
    fontWeight: '700',
    color: colors.neutral[900],
    lineHeight: 120,
    letterSpacing: -4,
  },
  yearLabel: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.neutral[200],
    position: 'absolute',
    right: -60,
    top: 48,
    transform: [{ rotate: '90deg' }],
    opacity: 0.4,
  },

  // Lunar Badge
  lunarBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[100],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    minWidth: 100,
    marginTop: 32,
  },
  lunarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lunarDateLarge: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary[600],
    marginTop: 4,
  },
  lunarDateSmall: {
    fontSize: 16,
    color: colors.primary[400],
  },
  lunarDivider: {
    width: '80%',
    height: 2,
    backgroundColor: colors.primary[100],
    marginTop: 8,
  },
  canChiSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[500],
    marginTop: 8,
  },

  // Weekday Row
  weekdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  weekdayText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  weekdaySunday: {
    color: '#EF4444',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral[300],
  },
  hoangDaoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  hoangDaoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },

  // Quick Info Cards
  quickInfoGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 32,
  },
  quickInfoCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.neutral[0],
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickInfoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  quickInfoValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral[900],
    textAlign: 'center',
    marginTop: 4,
  },

  // Score Section
  scoreSection: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral[900],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary[600],
  },
  scorePercent: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.neutral[500],
  },
  scoreBars: {
    flexDirection: 'row',
    gap: 4,
    height: 12,
  },
  scoreBar: {
    flex: 1,
    borderRadius: 4,
  },
  scoreBarGlow: {
    backgroundColor: colors.primary[600],
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreBarMedium: {
    backgroundColor: colors.primary[400],
  },
  scoreBarLight: {
    backgroundColor: colors.primary[200],
  },
  scoreBarEmpty: {
    backgroundColor: colors.neutral[200],
  },
  scoreQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.neutral[500],
    textAlign: 'right',
    marginTop: 8,
  },

  // Activities Row
  activitiesRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 32,
  },
  activityCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityCardGood: {
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.1)',
  },
  activityCardBad: {
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.1)',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  activityIconGood: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIconBad: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activityTitleGood: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityTitleBad: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  activityDotGood: {
    backgroundColor: '#059669',
  },
  activityDotBad: {
    backgroundColor: '#F87171',
  },
  activityText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral[700],
    flex: 1,
  },

  // Hours Section
  hoursSection: {
    marginTop: 40,
    marginBottom: 24,
  },
  hoursSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  hoursSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  hoangDaoTag: {
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  hoangDaoTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary[600],
  },
  hoursScroll: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  hourCard: {
    width: 80,
    height: 96,
    borderRadius: 16,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  hourCardActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  hourChi: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[500],
  },
  hourChiActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  hourTime: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
    marginTop: 4,
  },
  hourTimeActive: {
    color: colors.neutral[0],
  },
  hourActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral[0],
    marginTop: 8,
  },

  // Compass Card
  compassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    gap: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[0],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  compassBackground: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  compassIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.neutral[0],
    borderWidth: 2,
    borderColor: 'rgba(5, 150, 105, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compassLine1: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: colors.primary[100],
    transform: [{ rotate: '45deg' }],
  },
  compassLine2: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: colors.primary[100],
    transform: [{ rotate: '45deg' }],
  },
  compassContent: {
    flex: 1,
  },
  compassTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: 12,
  },
  compassGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  compassItem: {},
  compassLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  compassValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary[600],
    marginTop: 2,
  },

  // Holidays Section
  holidaysSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  holidaysTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  holidaysTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[900],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  holidaysGrid: {
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
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holidayDateDay: {
    fontSize: 14,
    fontWeight: '700',
  },
  holidayDateMonth: {
    fontSize: 10,
    fontWeight: '600',
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

  // Quote Section
  quoteSection: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 22,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutral[600],
    textAlign: 'center',
  },
});
