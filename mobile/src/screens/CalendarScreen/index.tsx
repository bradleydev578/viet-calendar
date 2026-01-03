import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addMonths, subMonths, startOfMonth, startOfDay } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

import { styles } from './styles';
import { MonthHeader } from './MonthHeader';
import { WeekDayHeader } from './WeekDayHeader';
import { CalendarGrid } from './CalendarGrid';
import { TodayWidget } from '../../components/TodayWidget';
import { useReducedMotion } from '../../hooks';
import { useHolidays } from '../../hooks/useHolidays';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { getThemeForDate } from '../../theme/monthThemes';
import type { RootStackParamList } from '../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SWIPE_THRESHOLD = 50;
const ANIMATION_DURATION = 250;
const REDUCED_ANIMATION_DURATION = 0; // Instant when reduce motion is enabled

export function CalendarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { width: screenWidth } = useWindowDimensions();
  const reduceMotionEnabled = useReducedMotion();
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Get settings
  const settings = useSettingsStore((state) => state.settings);

  // Get holidays for current year
  const currentYear = currentMonth.getFullYear();
  const { holidays } = useHolidays(currentYear);

  // Convert holidays to Date array for CalendarGrid
  const holidayDates = useMemo(() => {
    return holidays
      .filter((h) => h.type !== 'solar_term') // Exclude solar terms
      .map((h) => startOfDay(new Date(h.date)));
  }, [holidays]);

  // Get dynamic theme based on current month
  const monthTheme = useMemo(() => getThemeForDate(currentMonth), [currentMonth]);

  // Get animation duration based on reduce motion setting
  const animationDuration = reduceMotionEnabled ? REDUCED_ANIMATION_DURATION : ANIMATION_DURATION;

  // Animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    setSelectedDate(today);
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);

    // Navigate to DayDetail modal
    navigation.navigate('DayDetailModal', {
      date: date.toISOString(),
    });
  }, [navigation]);

  const handleTodayWidgetPress = useCallback(() => {
    // Navigate to today's detail modal
    const today = new Date();
    navigation.navigate('DayDetailModal', {
      date: today.toISOString(),
    });
  }, [navigation]);

  const handleHolidayPress = useCallback((dateString: string) => {
    // Navigate to the holiday's date detail modal
    navigation.navigate('DayDetailModal', {
      date: new Date(dateString).toISOString(),
    });
  }, [navigation]);

  // Animated month change with slide effect
  // Respects reduce motion preference for accessibility
  const animateToNextMonth = useCallback(() => {
    'worklet';
    if (animationDuration === 0) {
      // Skip animation when reduce motion is enabled
      runOnJS(handleNextMonth)();
      translateX.value = 0;
    } else {
      translateX.value = withTiming(-screenWidth, {
        duration: animationDuration / 2,
        easing: Easing.out(Easing.ease),
      }, () => {
        runOnJS(handleNextMonth)();
        translateX.value = screenWidth;
        translateX.value = withTiming(0, {
          duration: animationDuration / 2,
          easing: Easing.out(Easing.ease),
        });
      });
    }
  }, [screenWidth, handleNextMonth, translateX, animationDuration]);

  const animateToPrevMonth = useCallback(() => {
    'worklet';
    if (animationDuration === 0) {
      // Skip animation when reduce motion is enabled
      runOnJS(handlePrevMonth)();
      translateX.value = 0;
    } else {
      translateX.value = withTiming(screenWidth, {
        duration: animationDuration / 2,
        easing: Easing.out(Easing.ease),
      }, () => {
        runOnJS(handlePrevMonth)();
        translateX.value = -screenWidth;
        translateX.value = withTiming(0, {
          duration: animationDuration / 2,
          easing: Easing.out(Easing.ease),
        });
      });
    }
  }, [screenWidth, handlePrevMonth, translateX, animationDuration]);

  // Swipe gesture (respects reduce motion preference)
  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      // Follow finger while swiping (only if animations enabled)
      if (!reduceMotionEnabled) {
        translateX.value = event.translationX * 0.3;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left -> next month
        animateToNextMonth();
      } else if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right -> prev month
        animateToPrevMonth();
      } else {
        // Return to original position
        if (reduceMotionEnabled) {
          translateX.value = 0;
        } else {
          translateX.value = withTiming(0, {
            duration: 150,
            easing: Easing.out(Easing.ease),
          });
        }
      }
    });

  // Animated style for calendar grid
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: monthTheme.background }]} edges={['top']}>
      {/* Decorative blur circles - dynamic based on month */}
      <View style={[styles.blurCircle1, { backgroundColor: monthTheme.blurCircle1 }]} />
      <View style={[styles.blurCircle2, { backgroundColor: monthTheme.blurCircle2 }]} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.calendarContainer}>
          <MonthHeader
            currentDate={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <WeekDayHeader />
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.gridScroll, animatedStyle]}>
              <CalendarGrid
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                holidays={holidayDates}
                showLunarDates={settings.showLunarDates}
                showHolidayMarkers={settings.showHolidays}
              />
            </Animated.View>
          </GestureDetector>
        </View>
        <TodayWidget onPress={handleTodayWidgetPress} onHolidayPress={handleHolidayPress} />
      </ScrollView>
    </SafeAreaView>
  );
}
