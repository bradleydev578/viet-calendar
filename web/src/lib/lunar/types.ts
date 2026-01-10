// Lunar date representation
export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

// Can Chi result
export interface CanChiResult {
  can: string;
  chi: string;
  full: string;
  nguHanh: string;
}

// Full Can Chi info for a day
export interface DayCanChiInfo {
  day: CanChiResult;
  month: CanChiResult;
  year: CanChiResult;
}

// Hour Can Chi info
export interface HourCanChiResult extends CanChiResult {
  hourIndex: number;
  timeRange: string;
}

// Year info
export interface YearInfo {
  year: number;
  canChi: CanChiResult;
  animal: string;
  animalEmoji: string;
}

// Tiết khí (Solar term)
export interface TietKhiInfo {
  name: string;
  index: number;
  startDate: Date;
}

// Hoàng đạo hour
export interface HoangDaoHour {
  chi: string;
  timeRange: string;
  hourIndex: number;
  isHoangDao: boolean;
}

// Full day lunar info
export interface DayLunarInfo {
  solarDate: Date;
  lunarDate: LunarDate;
  canChi: DayCanChiInfo;
  tietKhi?: TietKhiInfo;
  hoangDaoHours: HoangDaoHour[];
}
