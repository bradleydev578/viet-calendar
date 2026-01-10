/**
 * HolidayListScreen
 * Displays Vietnamese holidays and solar terms
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { SectionList, View, Text, ActivityIndicator } from 'react-native';
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
  const sectionListRef = useRef<SectionList<Holiday, SectionData>>(null);
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const year = today.getFullYear();
  const { holidaysByMonth, isLoading } = useHolidays(year);

  // Convert holidaysByMonth to SectionList format
  const sections = useMemo(() => {
    const sectionArray: SectionData[] = [];

    // Sort months (1-12)
    const months = Object.keys(holidaysByMonth)
      .map(Number)
      .sort((a, b) => a - b);

    months.forEach((month) => {
      const holidays = holidaysByMonth[month];
      if (holidays && holidays.length > 0) {
        sectionArray.push({
          month,
          data: holidays,
        });
      }
    });

    return sectionArray;
  }, [holidaysByMonth]);

  // Track screen view on mount
  useEffect(() => {
    trackScreenView('HolidayListScreen');
    trackViewHolidays({ year });
  }, [year]);

  // Scroll to current month on initial load
  useEffect(() => {
    if (!isLoading && sections.length > 0 && sectionListRef.current) {
      // Find section index for current month
      const sectionIndex = sections.findIndex((s) => s.month === currentMonth);
      if (sectionIndex >= 0) {
        // Small delay to ensure list is rendered
        setTimeout(() => {
          sectionListRef.current?.scrollToLocation({
            sectionIndex,
            itemIndex: 0,
            viewPosition: 0,
            animated: false,
          });
        }, 100);
      }
    }
  }, [isLoading, sections, currentMonth]);

  const handleHolidayPress = (holiday: Holiday) => {
    // Track holiday tap
    trackHolidayTap({
      holidayName: holiday.name,
      holidayDate: holiday.date,
    });
    // Navigate to DayDetailModal screen for this date
    navigation.navigate('DayDetailModal', {
      date: new Date(holiday.date).toISOString(),
    });
  };

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
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HolidayItem holiday={item} onPress={handleHolidayPress} />}
        renderSectionHeader={({ section }) => <MonthHeader month={section.month} year={year} />}
        stickySectionHeadersEnabled
        onScrollToIndexFailed={() => {
          // Handle scroll failure silently - can happen if list not fully rendered
        }}
      />
    </SafeAreaView>
  );
}
