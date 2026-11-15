declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    static fromYmd(year: number, month: number, day: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    /** 0 = Sunday ... 6 = Saturday */
    getWeek(): number;
    /** "YYYY-MM-DD" */
    toYmd(): string;
    getLunar(): Lunar;
  }

  export class LunarMonth {
    /** Negative month = leap month. Returns null if that month doesn't exist. */
    static fromYm(lunarYear: number, lunarMonth: number): LunarMonth | null;
    getDayCount(): number;
  }

  export class LunarYear {
    static fromYear(lunarYear: number): LunarYear;
    /** 0 if the year has no leap month */
    getLeapMonth(): number;
  }

  export class Lunar {
    static fromDate(date: Date): Lunar;
    static fromYmd(year: number, month: number, day: number): Lunar;
    getYear(): number;
    /** Negative = leap month */
    getMonth(): number;
    getDay(): number;
    getSolar(): Solar;
    getDayInGanZhi(): string;
    getMonthInGanZhi(): string;
    getYearInGanZhi(): string;
    getJieQi(): string | null;
    getPrevJieQi(): JieQi;
    getNextJieQi(): JieQi;
  }

  export interface JieQi {
    getName(): string;
    getSolar(): Solar;
  }
}
