import { Solar, Lunar, LunarMonth, LunarYear } from 'lunar-javascript';
import type { LunarDate, YearInfo, CanChiResult } from './types';
import { CON_GIAP, THIEN_CAN, DIA_CHI, CAN_NGU_HANH } from './constants';

/**
 * LunarCalculator - Wrapper cho lunar-javascript library
 * Cung cấp các phương thức chuyển đổi giữa lịch dương và âm
 */
export class LunarCalculator {
  /**
   * Chuyển đổi ngày dương sang âm lịch
   */
  static toLunar(solarDate: Date): LunarDate {
    const solar = Solar.fromDate(solarDate);
    const lunar = solar.getLunar();

    // Check if current month is a leap month
    // In lunar-javascript, negative month indicates leap month
    const month = lunar.getMonth();
    const isLeapMonth = month < 0;

    return {
      day: lunar.getDay(),
      month: Math.abs(month),
      year: lunar.getYear(),
      isLeapMonth,
    };
  }

  /**
   * Chuyển đổi ngày âm sang dương lịch
   */
  static toSolar(lunarDate: LunarDate): Date {
    const maxDays = this.getDaysInLunarMonth(
      lunarDate.year,
      lunarDate.month,
      lunarDate.isLeapMonth
    );
    const safeDay = Math.min(Math.max(1, lunarDate.day), maxDays);
    const lunar = Lunar.fromYmd(
      lunarDate.year,
      lunarDate.isLeapMonth ? -lunarDate.month : lunarDate.month,
      safeDay
    );
    const solar = lunar.getSolar();

    return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
  }

  /**
   * Lấy thông tin năm (Can Chi, con giáp)
   */
  static getYearInfo(year: number): YearInfo {
    const lunar = Lunar.fromYmd(year, 1, 1);
    const canIndex = (year - 4) % 10;
    const chiIndex = (year - 4) % 12;

    const can = THIEN_CAN[canIndex >= 0 ? canIndex : canIndex + 10];
    const chi = DIA_CHI[chiIndex >= 0 ? chiIndex : chiIndex + 12];
    const conGiap = CON_GIAP[chiIndex >= 0 ? chiIndex : chiIndex + 12];

    return {
      year,
      canChi: {
        can,
        chi,
        full: `${can} ${chi}`,
        nguHanh: CAN_NGU_HANH[can] || '',
      },
      animal: conGiap.animal,
      animalEmoji: conGiap.emoji,
    };
  }

  /**
   * Lấy số ngày trong tháng âm lịch
   */
  static getDaysInLunarMonth(year: number, month: number, isLeapMonth: boolean = false): number {
    // fromYm returns null for a leap month that doesn't exist in that year
    const lunarMonth = LunarMonth.fromYm(year, isLeapMonth ? -month : month);
    return lunarMonth ? lunarMonth.getDayCount() : 30;
  }

  /**
   * Kiểm tra năm có tháng nhuận không
   */
  static getLeapMonth(year: number): number {
    // 0 = năm không có tháng nhuận
    return LunarYear.fromYear(year).getLeapMonth();
  }

  /**
   * Format ngày âm lịch dạng text
   */
  static formatLunarDate(lunarDate: LunarDate): string {
    const { day, month, year, isLeapMonth } = lunarDate;
    const monthStr = isLeapMonth ? `Nhuận ${month}` : `${month}`;
    return `${day}/${monthStr}/${year}`;
  }

  /**
   * Format ngày âm lịch ngắn gọn (chỉ ngày/tháng)
   */
  static formatLunarDateShort(lunarDate: LunarDate): string {
    const { day, month, isLeapMonth } = lunarDate;
    if (day === 1) {
      return isLeapMonth ? `${month}N` : `${month}`;
    }
    return `${day}`;
  }
}
