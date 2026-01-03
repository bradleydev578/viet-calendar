import { Solar } from 'lunar-javascript';
import type { TietKhiInfo } from './types';
import { TIET_KHI } from './constants';

/**
 * TietKhiCalculator - Xác định tiết khí từ ngày dương lịch
 *
 * Tiết khí là 24 điểm chia đều trên quỹ đạo Trái Đất quanh Mặt Trời
 * Mỗi tiết khí cách nhau khoảng 15-16 ngày
 */
export class TietKhiCalculator {
  /**
   * Lấy tiết khí của ngày
   * @returns TietKhiInfo nếu ngày này là ngày bắt đầu tiết khí, undefined nếu không
   */
  static getTietKhi(date: Date): TietKhiInfo | undefined {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    // lunar-javascript trả về tiết khí dạng Hán tự
    const jieQi = lunar.getJieQi();

    if (!jieQi) {
      return undefined;
    }

    const tietKhiName = this.mapJieQiToVietnamese(jieQi);
    const index = TIET_KHI.indexOf(tietKhiName as typeof TIET_KHI[number]);

    if (index === -1) {
      return undefined;
    }

    return {
      name: tietKhiName,
      index,
      startDate: date,
    };
  }

  /**
   * Lấy tiết khí hiện tại (tiết khí gần nhất trước ngày này)
   */
  static getCurrentTietKhi(date: Date): TietKhiInfo {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    // Lấy tiết khí hiện tại
    const prevJieQi = lunar.getPrevJieQi();
    const tietKhiName = this.mapJieQiToVietnamese(prevJieQi.getName());
    const index = TIET_KHI.indexOf(tietKhiName as typeof TIET_KHI[number]);

    // Lấy ngày bắt đầu tiết khí
    const jieQiSolar = prevJieQi.getSolar();
    const startDate = new Date(
      jieQiSolar.getYear(),
      jieQiSolar.getMonth() - 1,
      jieQiSolar.getDay()
    );

    return {
      name: tietKhiName,
      index: index >= 0 ? index : 0,
      startDate,
    };
  }

  /**
   * Lấy tiết khí tiếp theo
   */
  static getNextTietKhi(date: Date): TietKhiInfo {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();

    const nextJieQi = lunar.getNextJieQi();
    const tietKhiName = this.mapJieQiToVietnamese(nextJieQi.getName());
    const index = TIET_KHI.indexOf(tietKhiName as typeof TIET_KHI[number]);

    const jieQiSolar = nextJieQi.getSolar();
    const startDate = new Date(
      jieQiSolar.getYear(),
      jieQiSolar.getMonth() - 1,
      jieQiSolar.getDay()
    );

    return {
      name: tietKhiName,
      index: index >= 0 ? index : 0,
      startDate,
    };
  }

  /**
   * Kiểm tra xem ngày có phải là ngày bắt đầu tiết khí không
   */
  static isTietKhiDay(date: Date): boolean {
    return this.getTietKhi(date) !== undefined;
  }

  /**
   * Map Hán tự tiết khí sang tiếng Việt
   */
  private static mapJieQiToVietnamese(jieQi: string): string {
    const jieQiMap: Record<string, string> = {
      // Tiết
      '小寒': 'Tiểu Hàn',
      '大寒': 'Đại Hàn',
      '立春': 'Lập Xuân',
      '雨水': 'Vũ Thủy',
      '惊蛰': 'Kinh Trập',
      '春分': 'Xuân Phân',
      '清明': 'Thanh Minh',
      '谷雨': 'Cốc Vũ',
      '立夏': 'Lập Hạ',
      '小满': 'Tiểu Mãn',
      '芒种': 'Mang Chủng',
      '夏至': 'Hạ Chí',
      '小暑': 'Tiểu Thử',
      '大暑': 'Đại Thử',
      '立秋': 'Lập Thu',
      '处暑': 'Xử Thử',
      '白露': 'Bạch Lộ',
      '秋分': 'Thu Phân',
      '寒露': 'Hàn Lộ',
      '霜降': 'Sương Giáng',
      '立冬': 'Lập Đông',
      '小雪': 'Tiểu Tuyết',
      '大雪': 'Đại Tuyết',
      '冬至': 'Đông Chí',
    };

    return jieQiMap[jieQi] || jieQi;
  }
}
