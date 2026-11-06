declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): Lunar;
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getSolar(): Solar;
    getXiu(): string;
    getZhiXing(): string;
    getDayTianShenType(): string;
    getJieQi(): string;
    getPrevJieQi(): { getName(): string } | null;
    getDayPositionXiDesc(): string;
    getDayPositionCaiDesc(): string;
  }

  export class LunarYear {
    static fromYear(lunarYear: number): LunarYear;
    getLeapMonth(): number;
  }

  export class LunarMonth {
    static fromYm(lunarYear: number, lunarMonth: number): LunarMonth | null;
    getDayCount(): number;
  }
}
