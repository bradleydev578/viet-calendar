import { Solar } from 'lunar-javascript';
import type { CanChiResult, DayCanChiInfo, HourCanChiResult } from './types';
import { THIEN_CAN, DIA_CHI, CAN_NGU_HANH, GIO_DIA_CHI } from './constants';

/**
 * CanChiCalculator - Tính Can Chi cho ngày, tháng, năm, giờ
 */
export class CanChiCalculator {
  /**
   * Lấy Can Chi của ngày
   */
  static getDayCanChi(date: Date): CanChiResult {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    const ganZhi = lunar.getDayInGanZhi();
    const [can, chi] = this.parseGanZhi(ganZhi);

    return {
      can,
      chi,
      full: `${can} ${chi}`,
      nguHanh: CAN_NGU_HANH[can] || '',
    };
  }

  /**
   * Lấy Can Chi của tháng
   */
  static getMonthCanChi(date: Date): CanChiResult {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    const ganZhi = lunar.getMonthInGanZhi();
    const [can, chi] = this.parseGanZhi(ganZhi);

    return {
      can,
      chi,
      full: `${can} ${chi}`,
      nguHanh: CAN_NGU_HANH[can] || '',
    };
  }

  /**
   * Lấy Can Chi của năm
   */
  static getYearCanChi(year: number): CanChiResult {
    // Công thức tính Can Chi năm
    const canIndex = (year - 4) % 10;
    const chiIndex = (year - 4) % 12;

    const can = THIEN_CAN[canIndex >= 0 ? canIndex : canIndex + 10];
    const chi = DIA_CHI[chiIndex >= 0 ? chiIndex : chiIndex + 12];

    return {
      can,
      chi,
      full: `${can} ${chi}`,
      nguHanh: CAN_NGU_HANH[can] || '',
    };
  }

  /**
   * Lấy Can Chi của giờ
   * @param date - Ngày cần tính
   * @param hour - Giờ (0-23)
   */
  static getHourCanChi(date: Date, hour: number): HourCanChiResult {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    // Xác định chỉ số giờ (0-11)
    const hourIndex = this.getHourIndex(hour);
    const chi = DIA_CHI[hourIndex];
    const timeRange = GIO_DIA_CHI[hourIndex].timeRange;

    // Tính Can của giờ dựa vào Can của ngày
    const dayGanZhi = lunar.getDayInGanZhi();
    const [dayCan] = this.parseGanZhi(dayGanZhi);
    const dayCanIndex = THIEN_CAN.indexOf(dayCan as typeof THIEN_CAN[number]);

    // Công thức: Can giờ = (Can ngày * 2 + Chỉ số giờ) % 10
    const hourCanIndex = (dayCanIndex * 2 + hourIndex) % 10;
    const can = THIEN_CAN[hourCanIndex];

    return {
      can,
      chi,
      full: `${can} ${chi}`,
      nguHanh: CAN_NGU_HANH[can] || '',
      hourIndex,
      timeRange,
    };
  }

  /**
   * Lấy đầy đủ Can Chi của một ngày (ngày, tháng, năm)
   */
  static getFullDayCanChi(date: Date): DayCanChiInfo {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    return {
      day: this.getDayCanChi(date),
      month: this.getMonthCanChi(date),
      year: this.getYearCanChi(lunar.getYear()),
    };
  }

  /**
   * Chuyển đổi giờ (0-23) sang chỉ số giờ địa chi (0-11)
   */
  private static getHourIndex(hour: number): number {
    // Giờ Tý: 23:00 - 01:00 -> index 0
    // Giờ Sửu: 01:00 - 03:00 -> index 1
    // ...
    if (hour === 23 || hour === 0) return 0;
    return Math.floor((hour + 1) / 2);
  }

  /**
   * Parse Gan Zhi string từ lunar-javascript
   * lunar-javascript trả về dạng Hán tự, cần map sang tiếng Việt
   */
  private static parseGanZhi(ganZhi: string): [string, string] {
    // Map Hán tự sang tiếng Việt
    const ganMap: Record<string, string> = {
      '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
      '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
    };

    const zhiMap: Record<string, string> = {
      '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
      '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
    };

    const gan = ganZhi[0];
    const zhi = ganZhi[1];

    return [ganMap[gan] || gan, zhiMap[zhi] || zhi];
  }
}
