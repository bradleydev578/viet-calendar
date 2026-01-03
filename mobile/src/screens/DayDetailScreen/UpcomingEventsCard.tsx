/**
 * UpcomingEventsCard
 * Shows upcoming holidays from the viewed date
 * Story 5.10
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';

import { colors } from '../../theme';
import { HolidayService } from '../../data/services/HolidayService';
import { useFengShuiStore } from '../../stores/useFengShuiStore';
import type { Holiday } from '../../data/types/HolidayData';

interface UpcomingEventsCardProps {
  date: Date;
}

interface UpcomingHoliday extends Holiday {
  daysUntil: number;
}

export function UpcomingEventsCard({ date }: UpcomingEventsCardProps) {
  const { data: fengShuiData } = useFengShuiStore();

  const upcomingHolidays = useMemo((): UpcomingHoliday[] => {
    if (!fengShuiData) return [];
    return HolidayService.getUpcomingHolidays(date, 3, fengShuiData);
  }, [date, fengShuiData]);

  if (upcomingHolidays.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>SẮP TỚI</Text>
      {upcomingHolidays.map((holiday, index) => (
        <View
          key={holiday.id}
          style={[
            styles.eventRow,
            index === upcomingHolidays.length - 1 && styles.eventRowLast,
          ]}
        >
          <View
            style={[
              styles.dateBadge,
              {
                backgroundColor: HolidayService.getHolidayColor(
                  holiday.type,
                  holiday.isImportant
                ),
              },
            ]}
          >
            <Text style={styles.dateText}>
              {format(new Date(holiday.date), 'd/M')}
            </Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{holiday.name}</Text>
            <Text style={styles.countdown}>
              {HolidayService.formatDaysUntil(holiday.daysUntil)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral[0],
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[500],
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  eventRowLast: {
    borderBottomWidth: 0,
  },
  dateBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral[0],
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  countdown: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: 2,
  },
});
