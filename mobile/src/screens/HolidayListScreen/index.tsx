/**
 * HolidayListScreen
 * Displays Vietnamese holidays and solar terms
 */

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useHolidays } from '../../hooks/useHolidays';
import { trackScreenView, trackViewHolidays, trackHolidayTap } from '../../services/analytics';
import { HolidayItem } from './HolidayItem';
import { MonthHeader } from './MonthHeader';
import { styles } from './styles';
import type { Holiday } from '../../data/types/HolidayData';

interface SectionData {
  month: number;
  data: Holiday[];
}

export function HolidayListScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const today = new Date();
  const year = today.getFullYear();
  const { holidaysByMonth, isLoading } = useHolidays(year);

  // Convert holidaysByMonth to sections
  const sections = useMemo(() => {
    const sectionArray: SectionData[] = [];
    const months = Object.keys(holidaysByMonth)
      .map(Number)
      .sort((a, b) => a - b);

    months.forEach((month) => {
      const holidays = holidaysByMonth[month];
      if (holidays && holidays.length > 0) {
        sectionArray.push({ month, data: holidays });
      }
    });

    return sectionArray;
  }, [holidaysByMonth]);

  // Find target month to scroll to (nearest upcoming holiday)
  const targetMonth = useMemo(() => {
    if (sections.length === 0) return null;
    const todayStr = today.toISOString().split('T')[0];

    // Find the nearest upcoming holiday across ALL sections (not just first match)
    let best: { date: string; month: number } | null = null;

    for (const section of sections) {
      for (const holiday of section.data) {
        if (holiday.date >= todayStr) {
          if (!best || holiday.date < best.date) {
            best = { date: holiday.date, month: section.month };
          }
        }
      }
    }

    return best ? best.month : sections[sections.length - 1].month;
  }, [sections]);

  // Track screen view
  useEffect(() => {
    trackScreenView('HolidayListScreen');
    trackViewHolidays({ year });
  }, [year]);

  // Scroll to target month after render
  useEffect(() => {
    if (sections.length === 0 || !targetMonth) return;

    // Count elements before target month section
    let elementsBefore = 0;
    for (const section of sections) {
      if (section.month === targetMonth) break;
      elementsBefore += 1 + section.data.length; // 1 header + N items
    }

    if (elementsBefore === 0) return; // Target is first section, no scroll needed

    // Estimate offset: ~90px average per element (headers ~48px, items ~100px)
    const estimatedOffset = elementsBefore * 90;


    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: estimatedOffset, animated: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [sections, targetMonth]);

  const handleHolidayPress = useCallback((holiday: Holiday) => {
    trackHolidayTap({
      holidayName: holiday.name,
      holidayDate: holiday.date,
    });
    navigation.navigate('DayDetailModal', {
      date: new Date(holiday.date).toISOString(),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Đang tải ngày lễ...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (sections.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="calendar-remove" size={64} color="#9E9E9E" />
          <Text style={styles.emptyText}>Không có dữ liệu ngày lễ cho năm {year}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView ref={scrollRef}>
        {sections.map((section) => (
          <View key={section.month}>
            <MonthHeader month={section.month} year={year} />
            {section.data.map((item) => (
              <HolidayItem key={item.id} holiday={item} onPress={handleHolidayPress} />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
