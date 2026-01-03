import type { HoangDaoHour } from './types';
import { DIA_CHI, GIO_DIA_CHI } from './constants';
import { CanChiCalculator } from './CanChi';

/**
 * HoangDaoCalculator - Tính giờ hoàng đạo trong ngày
 *
 * Giờ hoàng đạo là các giờ tốt để làm việc quan trọng
 * Dựa vào Chi của ngày để xác định các giờ hoàng đạo
 */
export class HoangDaoCalculator {
  /**
   * Bảng tra giờ hoàng đạo theo Chi ngày
   * Key: Chi ngày, Value: Mảng các Chi giờ hoàng đạo
   */
  private static readonly HOANG_DAO_TABLE: Record<string, string[]> = {
    'Tý': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
    'Sửu': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
    'Dần': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
    'Mão': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
    'Thìn': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
    'Tỵ': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
    'Ngọ': ['Tý', 'Sửu', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
    'Mùi': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
    'Thân': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
    'Dậu': ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
    'Tuất': ['Dần', 'Mão', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
    'Hợi': ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  };

  /**
   * Lấy danh sách tất cả các giờ trong ngày với thông tin hoàng đạo
   */
  static getAllHours(date: Date): HoangDaoHour[] {
    const dayCanChi = CanChiCalculator.getDayCanChi(date);
    const hoangDaoChis = this.HOANG_DAO_TABLE[dayCanChi.chi] || [];

    return GIO_DIA_CHI.map((gio, index) => ({
      chi: gio.chi,
      timeRange: gio.timeRange,
      hourIndex: index,
      isHoangDao: hoangDaoChis.includes(gio.chi),
    }));
  }

  /**
   * Lấy danh sách các giờ hoàng đạo trong ngày
   */
  static getHoangDaoHours(date: Date): HoangDaoHour[] {
    return this.getAllHours(date).filter(hour => hour.isHoangDao);
  }

  /**
   * Lấy danh sách các giờ hắc đạo trong ngày
   */
  static getHacDaoHours(date: Date): HoangDaoHour[] {
    return this.getAllHours(date).filter(hour => !hour.isHoangDao);
  }

  /**
   * Kiểm tra giờ hiện tại có phải giờ hoàng đạo không
   */
  static isCurrentHourHoangDao(date: Date): boolean {
    const hour = date.getHours();
    const hourIndex = this.getHourIndex(hour);
    const allHours = this.getAllHours(date);

    return allHours[hourIndex].isHoangDao;
  }

  /**
   * Lấy giờ hoàng đạo tiếp theo
   */
  static getNextHoangDaoHour(date: Date): HoangDaoHour | undefined {
    const currentHour = date.getHours();
    const currentHourIndex = this.getHourIndex(currentHour);
    const hoangDaoHours = this.getHoangDaoHours(date);

    // Tìm giờ hoàng đạo tiếp theo trong ngày
    const nextHour = hoangDaoHours.find(h => h.hourIndex > currentHourIndex);

    if (nextHour) {
      return nextHour;
    }

    // Nếu không còn giờ hoàng đạo hôm nay, lấy giờ đầu tiên của ngày mai
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowHoangDao = this.getHoangDaoHours(tomorrow);

    return tomorrowHoangDao[0];
  }

  /**
   * Chuyển đổi giờ (0-23) sang chỉ số giờ địa chi (0-11)
   */
  private static getHourIndex(hour: number): number {
    if (hour === 23 || hour === 0) return 0;
    return Math.floor((hour + 1) / 2);
  }

  /**
   * Format danh sách giờ hoàng đạo dạng text
   */
  static formatHoangDaoHours(date: Date): string {
    const hoangDaoHours = this.getHoangDaoHours(date);
    return hoangDaoHours.map(h => `${h.chi} (${h.timeRange})`).join(', ');
  }

  /**
   * Format ngắn gọn (chỉ tên Chi)
   */
  static formatHoangDaoHoursShort(date: Date): string {
    const hoangDaoHours = this.getHoangDaoHours(date);
    return hoangDaoHours.map(h => h.chi).join(', ');
  }
}
