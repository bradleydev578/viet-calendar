/**
 * Tests for WidgetDataPreparer
 *
 * Verifies:
 * - Correct data structure (35 days, 5 weeks)
 * - Lunar date calculations
 * - Today highlighting
 * - Month boundary handling
 * - Monday-first week ordering
 */

import { prepareWidgetData } from '../../../src/core/widget/WidgetDataPreparer';
import type { CalendarWidgetData } from '../../../src/core/widget/WidgetBridge';

describe('prepareWidgetData', () => {
  describe('data structure', () => {
    it('should return 35 days (5 weeks × 7 days)', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15)); // Feb 15, 2026
      expect(data.days).toHaveLength(35);
    });

    it('should have required fields in CalendarWidgetData', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));

      expect(data).toHaveProperty('currentMonth');
      expect(data).toHaveProperty('currentYear');
      expect(data).toHaveProperty('lunarMonth');
      expect(data).toHaveProperty('lunarYear');
      expect(data).toHaveProperty('monthName');
      expect(data).toHaveProperty('lunarMonthName');
      expect(data).toHaveProperty('days');
    });

    it('should have required fields in each CalendarDayData', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));
      const day = data.days[0];

      expect(day).toHaveProperty('solar');
      expect(day).toHaveProperty('lunar');
      expect(day).toHaveProperty('lunarMonth');
      expect(day).toHaveProperty('dayOfWeek');
      expect(day).toHaveProperty('isCurrentMonth');
      expect(day).toHaveProperty('isToday');
    });
  });

  describe('month name formatting', () => {
    it('should format solar month name correctly', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15)); // Feb 2026
      expect(data.monthName).toBe('Tháng 2, 2026');
    });

    it('should include lunar month and Can Chi year', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));
      // Feb 2026 is in lunar year Bính Ngọ
      expect(data.lunarMonthName).toContain('Tháng');
      expect(data.lunarMonthName).toMatch(/Bính Ngọ|Ất Tỵ/); // Could be either depending on exact date
    });
  });

  describe('week ordering (Monday-first)', () => {
    it('should start week on Monday (T2)', () => {
      // Feb 2026: Feb 1 is Sunday
      const data = prepareWidgetData(new Date(2026, 1, 1));

      // First row should have days from previous month (Mon-Sat) then Feb 1 (Sunday)
      // The first day in array should be a Monday (dayOfWeek = 1)
      // Since Feb 1 is Sunday, first Monday would be Jan 26
      const firstDay = data.days[0];

      // Verify first visible day's dayOfWeek
      // If starting Monday, the first 6 days should be prev month, 7th is Feb 1 (Sunday)
      expect(data.days[6].solar).toBe(1); // Feb 1 should be at index 6 (7th position = Sunday)
      expect(data.days[6].isCurrentMonth).toBe(true);
    });
  });

  describe('today highlighting', () => {
    it('should mark exactly one day as today', () => {
      const data = prepareWidgetData(new Date());
      const todayCount = data.days.filter(d => d.isToday).length;
      expect(todayCount).toBe(1);
    });

    it('should mark the correct day as today', () => {
      const testDate = new Date(2026, 1, 15); // Feb 15, 2026

      // Mock Date.now to return Feb 15, 2026
      const originalDate = global.Date;
      const mockDate = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(2026, 1, 15);
          } else {
            // @ts-ignore
            super(...args);
          }
        }
      };
      // @ts-ignore
      global.Date = mockDate;

      try {
        const data = prepareWidgetData(testDate);
        const today = data.days.find(d => d.isToday);

        expect(today).toBeDefined();
        expect(today?.solar).toBe(15);
        expect(today?.isCurrentMonth).toBe(true);
      } finally {
        global.Date = originalDate;
      }
    });
  });

  describe('month boundaries', () => {
    it('should include days from previous month', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15)); // Feb 2026

      // Feb 1, 2026 is Sunday, so we need Mon-Sat from January (6 days)
      const prevMonthDays = data.days.filter(
        d => !d.isCurrentMonth && d.solar > 20
      );
      expect(prevMonthDays.length).toBeGreaterThan(0);
    });

    it('should include days from next month', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15)); // Feb 2026

      // Feb 2026 has 28 days, so we need some days from March
      const nextMonthDays = data.days.filter(
        d => !d.isCurrentMonth && d.solar < 15
      );
      expect(nextMonthDays.length).toBeGreaterThan(0);
    });

    it('should mark previous/next month days as not current month', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));

      // All days with solar > 20 at start should be prev month
      const firstFew = data.days.slice(0, 6);
      const hasNonCurrentMonth = firstFew.some(d => !d.isCurrentMonth);
      expect(hasNonCurrentMonth).toBe(true);
    });
  });

  describe('lunar date calculations', () => {
    it('should have valid lunar day values (1-30)', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));

      data.days.forEach(day => {
        expect(day.lunar).toBeGreaterThanOrEqual(1);
        expect(day.lunar).toBeLessThanOrEqual(30);
      });
    });

    it('should have valid lunar month values (1-12)', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));

      data.days.forEach(day => {
        expect(day.lunarMonth).toBeGreaterThanOrEqual(1);
        expect(day.lunarMonth).toBeLessThanOrEqual(12);
      });
    });
  });

  describe('dayOfWeek values', () => {
    it('should have valid dayOfWeek values (0-6)', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));

      data.days.forEach(day => {
        expect(day.dayOfWeek).toBeGreaterThanOrEqual(0);
        expect(day.dayOfWeek).toBeLessThanOrEqual(6);
      });
    });

    it('should have 5 of each weekday in 35 days', () => {
      const data = prepareWidgetData(new Date(2026, 1, 15));

      const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
      data.days.forEach(day => {
        weekdayCounts[day.dayOfWeek]++;
      });

      // Each weekday should appear exactly 5 times in 5 weeks
      weekdayCounts.forEach(count => {
        expect(count).toBe(5);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle January correctly (prev year for prev month)', () => {
      const data = prepareWidgetData(new Date(2026, 0, 15)); // Jan 15, 2026

      expect(data.currentMonth).toBe(1);
      expect(data.currentYear).toBe(2026);

      // Should have some December 2025 days
      const prevMonthDays = data.days.filter(d => !d.isCurrentMonth && d.solar > 20);
      expect(prevMonthDays.length).toBeGreaterThan(0);
    });

    it('should handle December correctly (next year for next month)', () => {
      const data = prepareWidgetData(new Date(2026, 11, 15)); // Dec 15, 2026

      expect(data.currentMonth).toBe(12);
      expect(data.currentYear).toBe(2026);

      // Should have some January 2027 days
      const nextMonthDays = data.days.filter(d => !d.isCurrentMonth && d.solar < 10);
      expect(nextMonthDays.length).toBeGreaterThan(0);
    });

    it('should handle February in leap year', () => {
      // 2024 is a leap year
      const data = prepareWidgetData(new Date(2024, 1, 15)); // Feb 15, 2024

      expect(data.currentMonth).toBe(2);

      // Find Feb 29 in current month days
      const feb29 = data.days.find(d => d.solar === 29 && d.isCurrentMonth);
      expect(feb29).toBeDefined();
    });

    it('should handle February in non-leap year', () => {
      // 2026 is not a leap year
      const data = prepareWidgetData(new Date(2026, 1, 15)); // Feb 15, 2026

      expect(data.currentMonth).toBe(2);

      // Feb 29 should not exist in current month
      const feb29 = data.days.find(d => d.solar === 29 && d.isCurrentMonth);
      expect(feb29).toBeUndefined();
    });
  });
});
