// Feng Shui data for a single day
export interface DayFengShuiData {
  d: string;      // Solar date (ISO format: YYYY-MM-DD)
  ld: number;     // Lunar day
  lm: number;     // Lunar month
  ly: number;     // Lunar year
  lp: number;     // Leap month flag (0 or 1)
  dgz: string;    // Day Can Chi (e.g., "Canh Ngọ")
  mgz: string;    // Month Can Chi (e.g., "Đinh Sửu")
  ygz: string;    // Year Can Chi (e.g., "Giáp Thìn")
  nh: string;     // Ngũ Hành (Five Elements)
  s28: string;    // 28 Sao (28 Constellations) name
  s28g: number;   // 28 Sao quality (0=bad, 1=good)
  t12: string;    // 12 Trực (12 Day Officers) name
  t12g: number;   // 12 Trực quality (0=bad, 1=good)
  tk?: string | null;    // Tiết Khí (Solar term) - optional
  hd: string[];   // Hoàng Đạo hours (auspicious hours)
  dir: Direction[];  // Feng shui directions
  ga: string[];   // Good activities (việc nên làm)
  ba: string[];   // Bad activities (việc không nên)
  gs: string[];   // Good stars (sao tốt)
  bs: string[];   // Bad stars (sao xấu)
  sc?: string | null;    // Special comment - optional
}

// Direction with rating
export interface Direction {
  n: string;   // Name: "Hỷ thần", "Tài thần", etc.
  d: string;   // Direction: "Đông Bắc", "Tây Nam", etc.
  r?: number;  // Rating (optional): 1-5
}

// Feng Shui data set (full year)
export interface FengShuiDataSet {
  version: string;
  year: number;
  generated_at: string;
  total_days: number;
  days: DayFengShuiData[];
}

// Day quality enum
export type DayQuality = 'excellent' | 'good' | 'normal' | 'bad' | 'very_bad';

// Day score result
export interface DayScoreResult {
  score: number;
  quality: DayQuality;
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
