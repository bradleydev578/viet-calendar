/**
 * DirectionCalculator.ts
 * Calculates auspicious and inauspicious directions for feng shui compass
 * Based on daily feng shui data (Hỷ thần, Tài thần, Hắc thần directions)
 */

import type { Direction, DayFengShuiData } from '../../data/types/FengShuiData';

/**
 * Direction luck rating
 */
export type DirectionLuck = 'dai_cat' | 'cat' | 'binh_thuong' | 'hung' | 'dai_hung';

/**
 * Direction info with luck rating
 */
export interface DirectionInfo {
  name: string;           // Vietnamese name (e.g., "Bắc", "Đông Bắc")
  degrees: number;        // Center degree (0 = North)
  luck: DirectionLuck;    // Luck rating for today
  reason?: string;        // Why this rating (e.g., "Hỷ thần", "Hắc thần")
}

/**
 * Direction names mapping
 */
const DIRECTION_MAPPING: Record<string, { name: string; degrees: number }> = {
  'Bắc': { name: 'Bắc', degrees: 0 },
  'Đông Bắc': { name: 'Đông Bắc', degrees: 45 },
  'Đông': { name: 'Đông', degrees: 90 },
  'Đông Nam': { name: 'Đông Nam', degrees: 135 },
  'Nam': { name: 'Nam', degrees: 180 },
  'Tây Nam': { name: 'Tây Nam', degrees: 225 },
  'Tây': { name: 'Tây', degrees: 270 },
  'Tây Bắc': { name: 'Tây Bắc', degrees: 315 },
};

/**
 * All 8 cardinal and intercardinal directions
 */
const ALL_DIRECTIONS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];

/**
 * Direction deity types and their luck meanings
 * Hỷ thần (Joy God) - Very auspicious
 * Tài thần (Wealth God) - Very auspicious
 * Hắc thần (Black God) - Inauspicious
 */
const DEITY_LUCK: Record<string, DirectionLuck> = {
  'Hỷ thần': 'dai_cat',
  'Tài thần': 'dai_cat',
  'Hắc thần': 'dai_hung',
  'Ngọc đường': 'cat',
  'Thiên đức': 'cat',
  'Phúc đức': 'cat',
};

/**
 * DirectionCalculator class for computing daily auspicious directions
 */
export class DirectionCalculator {
  /**
   * Get all 8 directions with their luck ratings for a day
   * @param data - Feng shui data for the day
   * @returns Array of DirectionInfo for all 8 directions
   */
  static getDirectionsForDay(data: DayFengShuiData | null): DirectionInfo[] {
    // Start with all directions as neutral
    const directionMap = new Map<string, DirectionInfo>();

    ALL_DIRECTIONS.forEach(dirName => {
      const mapping = DIRECTION_MAPPING[dirName];
      if (mapping) {
        directionMap.set(dirName, {
          name: dirName,
          degrees: mapping.degrees,
          luck: 'binh_thuong',
        });
      }
    });

    // If no data, return neutral directions
    if (!data || !data.dir) {
      return Array.from(directionMap.values());
    }

    // Apply deity directions from feng shui data
    data.dir.forEach((dir: Direction) => {
      const directionName = dir.d;
      const deityName = dir.n;

      if (directionMap.has(directionName) && DEITY_LUCK[deityName]) {
        const existing = directionMap.get(directionName)!;
        const newLuck = DEITY_LUCK[deityName];

        // If existing is more extreme, keep it; otherwise update
        if (this.compareLuck(newLuck, existing.luck) > 0) {
          existing.luck = newLuck;
          existing.reason = deityName;
        } else if (existing.reason) {
          // Append reason if multiple deities
          existing.reason += `, ${deityName}`;
        } else {
          existing.reason = deityName;
        }
      }
    });

    return Array.from(directionMap.values());
  }

  /**
   * Compare luck ratings (higher = more extreme, positive or negative)
   */
  private static compareLuck(a: DirectionLuck, b: DirectionLuck): number {
    const order: Record<DirectionLuck, number> = {
      'dai_cat': 4,
      'cat': 3,
      'binh_thuong': 2,
      'hung': 1,
      'dai_hung': 0,
    };

    // For positive luck, higher is better
    // For negative luck, lower is worse
    // We want to keep the most extreme value
    const aVal = order[a];
    const bVal = order[b];

    // If both positive (>2) or both negative (<2), keep the more extreme
    if ((aVal > 2 && bVal > 2) || (aVal < 2 && bVal < 2)) {
      return Math.abs(aVal - 2) - Math.abs(bVal - 2);
    }

    // If one positive and one negative, negative takes priority (warning)
    if (aVal < 2 && bVal >= 2) return 1;
    if (bVal < 2 && aVal >= 2) return -1;

    return 0;
  }

  /**
   * Get directions grouped by luck category
   * @param data - Feng shui data for the day
   * @returns Object with directions grouped by luck
   */
  static getGroupedDirections(data: DayFengShuiData | null): {
    daiCat: DirectionInfo[];
    cat: DirectionInfo[];
    binhThuong: DirectionInfo[];
    hung: DirectionInfo[];
    daiHung: DirectionInfo[];
  } {
    const directions = this.getDirectionsForDay(data);

    return {
      daiCat: directions.filter(d => d.luck === 'dai_cat'),
      cat: directions.filter(d => d.luck === 'cat'),
      binhThuong: directions.filter(d => d.luck === 'binh_thuong'),
      hung: directions.filter(d => d.luck === 'hung'),
      daiHung: directions.filter(d => d.luck === 'dai_hung'),
    };
  }

  /**
   * Get luck color for direction
   * @param luck - DirectionLuck rating
   * @returns Hex color string
   */
  static getLuckColor(luck: DirectionLuck): string {
    switch (luck) {
      case 'dai_cat':
        return '#DAA520'; // Gold
      case 'cat':
        return '#059669'; // Emerald
      case 'binh_thuong':
        return '#9CA3AF'; // Gray
      case 'hung':
        return '#F97316'; // Orange
      case 'dai_hung':
        return '#DC2626'; // Red
      default:
        return '#9CA3AF';
    }
  }

  /**
   * Get luck label in Vietnamese
   * @param luck - DirectionLuck rating
   * @returns Vietnamese label
   */
  static getLuckLabel(luck: DirectionLuck): string {
    switch (luck) {
      case 'dai_cat':
        return 'Đại Cát';
      case 'cat':
        return 'Cát';
      case 'binh_thuong':
        return 'Bình thường';
      case 'hung':
        return 'Hung';
      case 'dai_hung':
        return 'Đại Hung';
      default:
        return 'Không rõ';
    }
  }

  /**
   * Get direction from heading degrees
   * @param degrees - Heading in degrees (0-360)
   * @returns Direction name in Vietnamese
   */
  static getDirectionFromDegrees(degrees: number): string {
    const normalized = ((degrees % 360) + 360) % 360;
    if (normalized >= 337.5 || normalized < 22.5) return 'Bắc';
    if (normalized >= 22.5 && normalized < 67.5) return 'Đông Bắc';
    if (normalized >= 67.5 && normalized < 112.5) return 'Đông';
    if (normalized >= 112.5 && normalized < 157.5) return 'Đông Nam';
    if (normalized >= 157.5 && normalized < 202.5) return 'Nam';
    if (normalized >= 202.5 && normalized < 247.5) return 'Tây Nam';
    if (normalized >= 247.5 && normalized < 292.5) return 'Tây';
    return 'Tây Bắc';
  }
}
