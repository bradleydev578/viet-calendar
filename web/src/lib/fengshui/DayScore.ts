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
    const star28 = data.s28g === 1 ? 20 : -15;

    // 12 Trực (12 Day Officers)
    const truc12 = data.t12g === 1 ? 15 : -10;

    // Good stars (each adds 2 points)
    const goodStars = (data.gs?.length || 0) * 2;

    // Bad stars (each subtracts 2 points)
    const badStars = (data.bs?.length || 0) * -2;

    // Good activities (each adds 1 point)
    const goodActivities = (data.ga?.length || 0) * 1;

    // Bad activities (each subtracts 1 point)
    const badActivities = (data.ba?.length || 0) * -1;

    // Hoàng đạo hours (each adds 1 point)
    const hoangDaoHours = (data.hd?.length || 0) * 1;

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

    // Clamp between 0 and 100
    const score = Math.max(0, Math.min(100, totalScore));

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
