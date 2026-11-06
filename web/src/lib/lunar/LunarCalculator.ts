import { Solar, Lunar, LunarYear, LunarMonth } from 'lunar-javascript';
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

    return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay(), 12, 0, 0);
  }

  /**
   * Lấy thông tin năm (Can Chi, con giáp)
   */
  static getYearInfo(year: number): YearInfo {
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
   * Lấy Can Chi của ngày
   */
  static getDayCanChi(solarDate: Date): CanChiResult {
    const solar = Solar.fromDate(solarDate);
    const lunar = solar.getLunar();
    const ganZhi = lunar.getDayInGanZhi();
    
    // Parse Can Chi từ string
    const can = ganZhi.charAt(0);
    const chi = ganZhi.charAt(1);
    
    // Map to Vietnamese
    const canVi = this.mapCanToVietnamese(can);
    const chiVi = this.mapChiToVietnamese(chi);

    return {
      can: canVi,
      chi: chiVi,
      full: `${canVi} ${chiVi}`,
      nguHanh: CAN_NGU_HANH[canVi] || '',
    };
  }

  /**
   * Lấy Can Chi của tháng (theo phép Ngũ Hổ Độn chuẩn Lịch Vạn Niên Việt Nam)
   */
  static getMonthCanChi(solarDate: Date): CanChiResult {
    const solar = Solar.fromDate(solarDate);
    const lunar = solar.getLunar();
    const lunarMonth = Math.abs(lunar.getMonth());
    const yearGanZhi = lunar.getYearInGanZhi();
    const yearCanVi = this.mapCanToVietnamese(yearGanZhi.charAt(0));

    // Tháng Giêng (1) là tháng Dần (index 2 trong DIA_CHI)
    const chiVi = DIA_CHI[(lunarMonth + 1) % 12];
    const yearCanIdx = THIEN_CAN.indexOf(yearCanVi as (typeof THIEN_CAN)[number]);
    const startCanIdx = yearCanIdx !== -1 ? ((yearCanIdx % 5) * 2 + 2) % 10 : 0;
    const canVi = THIEN_CAN[(startCanIdx + (lunarMonth - 1)) % 10];

    return {
      can: canVi,
      chi: chiVi,
      full: `${canVi} ${chiVi}`,
      nguHanh: CAN_NGU_HANH[canVi] || '',
    };
  }

  /**
   * Map Chinese Can to Vietnamese
   */
  private static mapCanToVietnamese(can: string): string {
    const map: Record<string, string> = {
      '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
      '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
    };
    return map[can] || can;
  }

  /**
   * Map Chinese Chi to Vietnamese
   */
  private static mapChiToVietnamese(chi: string): string {
    const map: Record<string, string> = {
      '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
      '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
    };
    return map[chi] || chi;
  }

  /**
   * Lấy số ngày trong tháng âm lịch
   */
  static getDaysInLunarMonth(year: number, month: number, isLeapMonth: boolean = false): number {
    const lm = LunarMonth.fromYm(year, isLeapMonth ? -month : month);
    return lm ? lm.getDayCount() : 29;
  }

  /**
   * Kiểm tra năm có tháng nhuận không
   */
  static getLeapMonth(year: number): number {
    const ly = LunarYear.fromYear(year);
    return ly ? ly.getLeapMonth() : 0;
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
