/**
 * useHolidays hook
 * Provides holiday data for the current year
 */

import { useMemo } from 'react';
import { useFengShuiStore } from '../stores/useFengShuiStore';
import { HolidayService } from '../data/services/HolidayService';
import type { Holiday, HolidaysByMonth } from '../data/types/HolidayData';

export function useHolidays(year: number = 2025) {
  const data = useFengShuiStore((state) => state.data);

  const holidays = useMemo(() => {
    if (!data) return [];
    return HolidayService.getHolidays(year, data);
  }, [year, data]);

  const holidaysByMonth = useMemo(() => {
    return HolidayService.groupByMonth(holidays);
  }, [holidays]);

  return {
    holidays,
    holidaysByMonth,
    isLoading: !data,
  };
}
