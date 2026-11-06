/**
 * DayScore.ts
 * Algorithm for calculating day quality score (0-100)
 * Based on feng shui factors: 28 Sao, 12 Trực, stars, activities, hoàng đạo hours
 */

import type { DayFengShuiData, DayScoreResult, DayQuality } from './types';

/**
 * Day score calculation algorithm
 */
export class DayScore {
  /**
   * Calculate comprehensive score for a day
   * @param data - Feng shui data for the day
   * @returns DayScoreResult with score (0-100) and breakdown
   */
  static calculate(data: DayFengShuiData): DayScoreResult {
    // Base score
    const base = 50;

    // 28 Sao (28 Constellations)
    const star28 = data.s28g === 1 ? 16 : -12;

    // Ngày Hoàng Đạo / Hắc Đạo (12 Thần Hoàng Đạo) + 12 Trực
    const badTruc = ['Phá', 'Nguy', 'Bế'].includes(data.t12);
    const veryGoodTruc = ['Khai', 'Thành', 'Mãn', 'Định'].includes(data.t12);
    const truc12 =
      (data.t12g === 1 ? 18 : -14) +
      (badTruc ? -12 : veryGoodTruc ? 6 : 2);

    // Good stars (each adds 2 points, capped at +16)
    const goodStars = Math.min(16, (data.gs?.length || 0) * 2);

    // Bad stars + Đại Kỵ penalties (Tam Nương, Nguyệt Kỵ, Dương Công Kỵ, Thụ tử, Sát chủ, Nguyệt phá)
    const bsList = data.bs || [];
    const daiKyStars = ['Tam Nương', 'Nguyệt Kỵ', 'Dương Công Kỵ', 'Thụ tử', 'Sát chủ', 'Nguyệt phá'];
    const daiKyCount = bsList.filter((s) => daiKyStars.includes(s)).length;
    const badStars = Math.max(-32, bsList.length * -2 + daiKyCount * -10);

    // Good activities (each adds 1 point)
    const goodActivities = Math.min(4, (data.ga?.length || 0) * 1);

    // Bad activities (each subtracts 1 point)
    const badActivities = Math.max(-4, (data.ba?.length || 0) * -1);

    // Hoàng đạo hours (6 hours = +6)
    const hoangDaoHours = Math.min(6, (data.hd?.length || 0) * 1);

    // Calculate total score
    const totalScore =
      base +
      star28 +
      truc12 +
      goodStars +
      badStars +
      goodActivities +
      badActivities +
      hoangDaoHours;

    // Clamp between 15 and 98 (and cap at 62 if any Đại Kỵ is present)
    const rawClamped = Math.max(15, Math.min(98, totalScore));
    const score = daiKyCount > 0 ? Math.min(62, rawClamped) : rawClamped;

    // Determine quality rating
    const quality = this.getQuality(score);

    return {
      score,
      quality,
      breakdown: {
        base,
        star28,
        truc12,
        goodStars,
        badStars,
        goodActivities,
        badActivities,
        hoangDaoHours,
      },
    };
  }

  /**
   * Get quality rating based on score
   * @param score - Score value (0-100)
   * @returns DayQuality enum
   */
  static getQuality(score: number): DayQuality {
    if (score >= 80) {
      return 'excellent';
    } else if (score >= 65) {
      return 'good';
    } else if (score >= 50) {
      return 'normal';
    } else if (score >= 35) {
      return 'bad';
    } else {
      return 'very_bad';
    }
  }

  /**
   * Get Vietnamese label for quality
   * @param quality - DayQuality enum
   * @returns Vietnamese label
   */
  static getQualityLabel(quality: DayQuality): string {
    switch (quality) {
      case 'excellent':
        return 'Rất tốt';
      case 'good':
        return 'Tốt';
      case 'normal':
        return 'Bình thường';
      case 'bad':
        return 'Xấu';
      case 'very_bad':
        return 'Rất xấu';
      default:
        return 'Không rõ';
    }
  }

  /**
   * Get color for quality rating
   * @param quality - DayQuality enum
   * @returns Color hex code
   */
  static getQualityColor(quality: DayQuality): string {
    switch (quality) {
      case 'excellent':
        return '#10b981'; // Green
      case 'good':
        return '#84cc16'; // Light green
      case 'normal':
        return '#eab308'; // Yellow
      case 'bad':
        return '#f97316'; // Orange
      case 'very_bad':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  }

  /**
   * Get Tailwind color class for quality rating
   * @param quality - DayQuality enum
   * @returns Tailwind color class
   */
  static getQualityColorClass(quality: DayQuality): string {
    switch (quality) {
      case 'excellent':
        return 'text-emerald-500';
      case 'good':
        return 'text-lime-500';
      case 'normal':
        return 'text-yellow-500';
      case 'bad':
        return 'text-orange-500';
      case 'very_bad':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  /**
   * Get background color class for quality rating
   * @param quality - DayQuality enum
   * @returns Tailwind background color class
   */
  static getQualityBgClass(quality: DayQuality): string {
    switch (quality) {
      case 'excellent':
        return 'bg-emerald-500';
      case 'good':
        return 'bg-lime-500';
      case 'normal':
        return 'bg-yellow-500';
      case 'bad':
        return 'bg-orange-500';
      case 'very_bad':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  /**
   * Get star rating (1-5 stars) based on quality
   * @param quality - DayQuality enum
   * @returns Number of stars (1-5)
   */
  static getStarRating(quality: DayQuality): number {
    switch (quality) {
      case 'excellent':
        return 5;
      case 'good':
        return 4;
      case 'normal':
        return 3;
      case 'bad':
        return 2;
      case 'very_bad':
        return 1;
      default:
        return 3;
    }
  }
}
