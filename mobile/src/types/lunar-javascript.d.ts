declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    static fromYmd(year: number, month: number, day: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): Lunar;
  }

  export class Lunar {
    static fromDate(date: Date): Lunar;
    static fromYmd(year: number, month: number, day: number): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    isLeap(): boolean;
    getLeapMonth(): number;
    getMonthDayCount(): number;
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
