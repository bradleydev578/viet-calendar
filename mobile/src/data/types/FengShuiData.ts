/**
 * FengShuiData.ts
 * Type definitions for feng shui data from scraper
 * Mirrors the structure of fengshui_2025.json
 */

/**
 * Direction information (Hỷ thần, Tài thần, Hắc thần)
 */
export interface Direction {
  n: string;        // "Hỷ thần", "Tài thần", "Hắc thần" (name)
  d: string;        // "Đông Bắc", "Tây Nam", etc. (direction)
  r?: number;       // Rating (optional)
}

/**
 * Complete feng shui data for a single day
 * Source: scraper/data/mobile/fengshui_2025.json
 */
export interface DayFengShuiData {
  // Date information
  d: string;           // Solar date in ISO format "2025-01-01"

  // Lunar date
  ld: number;          // Lunar day (1-30)
  lm: number;          // Lunar month (1-12)
  ly: number;          // Lunar year
  lp: number;          // Leap month flag (0 or 1)

  // Can Chi (Heavenly Stems & Earthly Branches)
  dgz: string;         // Day Can Chi (e.g., "Canh Ngọ")
  mgz: string;         // Month Can Chi (e.g., "Đinh Sửu")
  ygz: string;         // Year Can Chi (e.g., "Ất Tỵ")

  // Ngũ hành (Five Elements)
  nh: string;          // "Kim", "Mộc", "Thủy", "Hỏa", "Thổ"

  // 28 Sao (28 Constellations)
  s28: string;         // Star name (e.g., "Sâm", "Tất", "Chủy")
  s28g: number;        // Star quality: 1 = good, 0 = bad

  // 12 Trực (12 Day Officers)
  t12: string;         // Officer name (e.g., "Khai", "Đóng", "Trừ")
  t12g: number;        // Officer quality: 1 = good, 0 = bad

  // Tiết khí (Solar Terms) - optional
  tk?: string;         // e.g., "Lập xuân", "Đông chí"

  // Hoàng đạo (Auspicious hours)
  hd: string[];        // Array of auspicious Chi times (e.g., ["Tý", "Sửu", "Dần"])

  // Directions
  dir: Direction[];    // Good/bad directions for the day

  // Activities
  ga: string[];        // Good activities (e.g., ["Cưới hỏi", "Khai trương"])
  ba: string[];        // Bad activities (e.g., ["Động thổ", "An táng"])

  // Stars
  gs: string[];        // Good stars (e.g., ["Thiên đức", "Nguyệt đức"])
  bs: string[];        // Bad stars (e.g., ["Thổ phủ", "Nguyệt kỵ"])

  // Special comment - optional
  sc?: string;         // Additional notes or comments
}

/**
 * Data structure for the entire JSON file
 */
export interface FengShuiDataSet {
  year: number;
  days: DayFengShuiData[];
}

/**
 * Day quality rating based on score
 */
export enum DayQuality {
  EXCELLENT = 'excellent',   // 80-100: Rất tốt
  GOOD = 'good',             // 65-79: Tốt
  NORMAL = 'normal',         // 50-64: Bình thường
  BAD = 'bad',               // 35-49: Xấu
  VERY_BAD = 'very_bad',     // 0-34: Rất xấu
}

/**
 * Day score calculation result
 */
export interface DayScore {
  score: number;          // 0-100
  quality: DayQuality;    // Quality rating
  breakdown: {
    base: number;
    star28: number;
    truc12: number;
    goodStars: number;
    badStars: number;
    goodActivities: number;
    badActivities: number;
    hoangDaoHours: number;
  };
}
