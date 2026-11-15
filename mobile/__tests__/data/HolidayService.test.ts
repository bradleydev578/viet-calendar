import { HolidayService } from '../../src/data/services/HolidayService';

const byId = (year: number, id: string) =>
  HolidayService.getHolidays(year, new Map()).filter((h) => h.id === `${id}-${year}`);

describe('HolidayService', () => {
  it('applies the per-year Tết vacation schedule', () => {
    const [tet2027] = byId(2027, 'tet-nguyen-dan');
    expect(tet2027.date).toBe('2027-02-06');
    expect(tet2027.vacationBadge).toBe('Nghỉ 7 ngày (04/02 – 10/02)');
    expect(tet2027.totalDays).toBe(7);
    expect(tet2027.description).toContain('Tết Đinh Mùi');
  });

  it('falls back to the generic badge when no yearly schedule exists', () => {
    const [tet2030] = byId(2030, 'tet-nguyen-dan');
    expect(tet2030.vacationBadge).toBe('Nghỉ lễ chính thức');
  });

  it('places Giao thừa on the day before next Tết, inside the same solar year', () => {
    // Lunar year Bính Ngọ ends the day before Tết Đinh Mùi (06/02/2027)
    expect(byId(2027, 'dem-giao-thua').map((h) => h.date)).toEqual(['2027-02-05']);
    // Lunar year Ất Tỵ ends the day before Tết Bính Ngọ (17/02/2026)
    expect(byId(2026, 'dem-giao-thua').map((h) => h.date)).toEqual(['2026-02-16']);
  });

  it('keeps month-12 lunar holidays in the solar year they actually fall in', () => {
    const ongTao2027 = byId(2027, 'ong-cong-ong-tao');
    expect(ongTao2027).toHaveLength(1);
    expect(ongTao2027[0].date.startsWith('2027-')).toBe(true);

    for (const year of [2025, 2026, 2027]) {
      for (const h of HolidayService.getHolidays(year, new Map())) {
        expect(h.date.startsWith(`${year}-`)).toBe(true);
      }
    }
  });

  it('exposes vacation badges for official festival schedules', () => {
    const [nghiTet] = byId(2027, 'lich-nghi-tet-am-lich');
    expect(nghiTet.date).toBe('2027-02-04');
    expect(nghiTet.endDate).toBe('2027-02-10');
    expect(nghiTet.vacationBadge).toContain('04/02 – 10/02');
  });
});
