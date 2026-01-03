import { useMemo } from 'react';
import {
  LunarCalculator,
  CanChiCalculator,
  TietKhiCalculator,
  HoangDaoCalculator,
  type LunarDate,
  type DayCanChiInfo,
  type TietKhiInfo,
  type HoangDaoHour,
  type YearInfo,
} from '../core/lunar';

export interface UseLunarDateResult {
  // Lunar date info
  lunarDate: LunarDate;
  lunarDateFormatted: string;
  lunarDateShort: string;

  // Can Chi info
  canChi: DayCanChiInfo;

  // Year info
  yearInfo: YearInfo;

  // Tiết khí
  tietKhi?: TietKhiInfo;
  currentTietKhi: TietKhiInfo;
  nextTietKhi: TietKhiInfo;
  isTietKhiDay: boolean;

  // Hoàng đạo
  hoangDaoHours: HoangDaoHour[];
  allHours: HoangDaoHour[];
  hoangDaoFormatted: string;
  isCurrentHourHoangDao: boolean;
}

/**
 * Hook lấy thông tin ngày âm lịch từ ngày dương lịch
 */
export function useLunarDate(solarDate: Date): UseLunarDateResult {
  return useMemo(() => {
    // Lunar date conversion
    const lunarDate = LunarCalculator.toLunar(solarDate);
    const lunarDateFormatted = LunarCalculator.formatLunarDate(lunarDate);
    const lunarDateShort = LunarCalculator.formatLunarDateShort(lunarDate);

    // Can Chi calculation
    const canChi = CanChiCalculator.getFullDayCanChi(solarDate);

    // Year info
    const yearInfo = LunarCalculator.getYearInfo(lunarDate.year);

    // Tiết khí
    const tietKhi = TietKhiCalculator.getTietKhi(solarDate);
    const currentTietKhi = TietKhiCalculator.getCurrentTietKhi(solarDate);
    const nextTietKhi = TietKhiCalculator.getNextTietKhi(solarDate);
    const isTietKhiDay = TietKhiCalculator.isTietKhiDay(solarDate);

    // Hoàng đạo hours
    const hoangDaoHours = HoangDaoCalculator.getHoangDaoHours(solarDate);
    const allHours = HoangDaoCalculator.getAllHours(solarDate);
    const hoangDaoFormatted = HoangDaoCalculator.formatHoangDaoHoursShort(solarDate);
    const isCurrentHourHoangDao = HoangDaoCalculator.isCurrentHourHoangDao(solarDate);

    return {
      lunarDate,
      lunarDateFormatted,
      lunarDateShort,
      canChi,
      yearInfo,
      tietKhi,
      currentTietKhi,
      nextTietKhi,
      isTietKhiDay,
      hoangDaoHours,
      allHours,
      hoangDaoFormatted,
      isCurrentHourHoangDao,
    };
  }, [solarDate.getTime()]);
}
