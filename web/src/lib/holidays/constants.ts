/**
 * Vietnamese holidays and celebrations
 * Includes Public Holidays, Sector Anniversaries, and Cultural/Ethnic Festivals
 * Lunar dates will be converted to solar dates based on the year
 */

export type HolidayCategory =
  | 'PUBLIC_HOLIDAYS'
  | 'SECTOR_ANNIVERSARIES'
  | 'CULTURAL_ETHNIC_FESTIVALS'
  | 'REVOLUTIONARY_ANNIVERSARIES'
  | 'HISTORICAL_FIGURES';

export interface HolidayYearlySchedule {
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  description?: string;
  vacationBadge?: string;
}

export interface HolidayTemplate {
  id: string;
  name: string;
  type: 'lunar' | 'solar';
  category: HolidayCategory;
  lunarDate?: { day: number; month: number };
  solarDate?: { day: number; month: number };
  description?: string;
  isImportant: boolean;
  totalDays?: number;
  location?: string;
  vacationBadge?: string;
  isLunarYearEnd?: boolean;
  yearlySchedules?: {
    [year: number]: HolidayYearlySchedule;
  };
}

/**
 * Vietnamese Traditional Holidays (Lunar Calendar)
 */
export const LUNAR_HOLIDAYS: HolidayTemplate[] = [
  {
    id: 'tet-nguyen-dan',
    name: 'Tết Nguyên Đán',
    type: 'lunar',
    category: 'PUBLIC_HOLIDAYS',
    lunarDate: { day: 1, month: 1 },
    description: 'Tết Âm lịch - Năm mới truyền thống của dân tộc Việt Nam',
    isImportant: true,
    totalDays: 5,
    vacationBadge: 'Nghỉ lễ chính thức',
    yearlySchedules: {
      2025: {
        totalDays: 9,
        vacationBadge: 'Nghỉ 9 ngày (25/01 – 02/02)',
        description:
          'Mùng 1 Tết Ất Tỵ (29/01/2025) • Lịch nghỉ Tết chính thức 9 ngày liên tục từ 25/01/2025 đến hết 02/02/2025 (26 tháng Chạp đến mùng 5 Tết)',
      },
      2026: {
        totalDays: 9,
        vacationBadge: 'Nghỉ 9 ngày (14/02 – 22/02)',
        description:
          'Mùng 1 Tết Bính Ngọ (17/02/2026) • Lịch nghỉ Tết chính thức 9 ngày liên tục từ thứ Bảy 14/02/2026 đến hết Chủ Nhật 22/02/2026 (27 tháng Chạp Ất Tỵ đến mùng 6 Tết Bính Ngọ)',
      },
      2027: {
        totalDays: 7,
        vacationBadge: 'Nghỉ 7 ngày (04/02 – 10/02)',
        description:
          'Mùng 1 Tết Đinh Mùi (06/02/2027) • Lịch nghỉ Tết chính thức 7 ngày liên tục từ thứ Năm 04/02/2027 đến hết thứ Tư 10/02/2027 (28 tháng Chạp Bính Ngọ đến mùng 5 Tết Đinh Mùi)',
      },
    },
  },
  {
    id: 'ngay-via-than-tai',
    name: 'Ngày Vía Thần Tài',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 10, month: 1 },
    description: 'Mùng 10 tháng Giêng — Ngày cúng Thần Tài cầu tài lộc, may mắn, kinh doanh hanh thông đầu năm',
    isImportant: true,
  },
  {
    id: 'tet-nguyen-tieu',
    name: 'Tết Nguyên Tiêu (Rằm tháng Giêng)',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 15, month: 1 },
    description: 'Lễ Thượng Nguyên — Rằm tháng Giêng cầu bình an, phúc lộc đầu năm',
    isImportant: true,
  },
  {
    id: 'tet-han-thuc',
    name: 'Tết Hàn Thực',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 3, month: 3 },
    description: 'Ngày 3/3 Âm lịch — Dâng bánh trôi, bánh chay tưởng nhớ cội nguồn',
    isImportant: false,
  },
  {
    id: 'gio-to-hung-vuong',
    name: 'Giỗ Tổ Hùng Vương',
    type: 'lunar',
    category: 'PUBLIC_HOLIDAYS',
    lunarDate: { day: 10, month: 3 },
    description: 'Ngày Giỗ Tổ Hùng Vương (10/3 Âm lịch) — Nghỉ lễ chính thức hưởng nguyên lương',
    isImportant: true,
    totalDays: 1,
    vacationBadge: 'Nghỉ lễ chính thức',
    yearlySchedules: {
      2026: {
        totalDays: 3,
        vacationBadge: 'Nghỉ 3 ngày (25/04 – 27/04)',
        description:
          'Ngày Giỗ Tổ Hùng Vương (10/3 Âm lịch) • Năm 2026 rơi vào Chủ Nhật (26/04) nên được nghỉ 3 ngày liên tục từ 25/04/2026 đến hết thứ Hai 27/04/2026',
      },
      2027: {
        totalDays: 3,
        vacationBadge: 'Nghỉ 3 ngày (16/04 – 18/04)',
        description:
          'Ngày Giỗ Tổ Hùng Vương (10/3 Âm lịch) • Năm 2027 rơi vào thứ Sáu (16/04) nên được nghỉ 3 ngày liên tục từ 16/04/2027 đến hết Chủ Nhật 18/04/2027',
      },
    },
  },
  {
    id: 'le-phat-dan',
    name: 'Đại lễ Phật Đản',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 15, month: 4 },
    description: 'Rằm tháng Tư — Kỷ niệm ngày Đức Phật Thích Ca Mâu Ni đản sinh',
    isImportant: true,
  },
  {
    id: 'tet-doan-ngo',
    name: 'Tết Đoan Ngọ',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 5, month: 5 },
    description: 'Mùng 5 tháng 5 Âm lịch — Tết diệt sâu bọ, cầu sức khỏe bình an',
    isImportant: true,
  },
  {
    id: 'vu-lan',
    name: 'Lễ Vu Lan Báo Hiếu',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 15, month: 7 },
    description: 'Rằm tháng Bảy — Đại lễ báo hiếu cha mẹ, tổ tiên',
    isImportant: true,
  },
  {
    id: 'tet-trung-thu',
    name: 'Tết Trung Thu',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 15, month: 8 },
    description: 'Rằm tháng Tám — Tết Đoàn viên, trông trăng và phá cỗ thiếu nhi',
    isImportant: true,
  },
  {
    id: 'tet-trung-cuu',
    name: 'Tết Trùng Cửu',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 9, month: 9 },
    description: 'Ngày 9/9 Âm lịch — Lễ Trùng dương cầu trường thọ',
    isImportant: false,
  },
  {
    id: 'tet-ha-nguyen',
    name: 'Tết Hạ Nguyên',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 15, month: 10 },
    description: 'Rằm tháng Mười — Lễ mừng lúa mới, tạ ơn thần nông',
    isImportant: false,
  },
  {
    id: 'ong-cong-ong-tao',
    name: 'Ông Công Ông Táo',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 23, month: 12 },
    description: '23 tháng Chạp — Lễ cúng tiễn Ông Công Ông Táo chầu trời',
    isImportant: true,
  },
  {
    id: 'dem-giao-thua',
    name: 'Lễ Tất Niên & Đêm Giao Thừa',
    type: 'lunar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    lunarDate: { day: 30, month: 12 },
    isLunarYearEnd: true,
    description: 'Ngày cuối năm Âm lịch (29 hoặc 30 Tết) — Lễ cúng Tất niên và đón Giao thừa',
    isImportant: true,
  },
];

/**
 * Vietnamese National/Solar Holidays
 */
export const SOLAR_HOLIDAYS: HolidayTemplate[] = [
  // PUBLIC HOLIDAYS
  {
    id: 'tet-duong-lich',
    name: 'Tết Dương lịch',
    type: 'solar',
    category: 'PUBLIC_HOLIDAYS',
    solarDate: { day: 1, month: 1 },
    description: 'Năm mới Dương lịch — Nghỉ lễ chính thức hưởng nguyên lương',
    isImportant: true,
    totalDays: 1,
    vacationBadge: 'Nghỉ lễ chính thức',
    yearlySchedules: {
      2026: {
        totalDays: 4,
        vacationBadge: 'Nghỉ 4 ngày (01/01 – 04/01)',
        description:
          'Tết Dương lịch 2026 • Nghỉ 4 ngày liên tục từ thứ Năm 01/01/2026 đến hết Chủ Nhật 04/01/2026 (hoán đổi ngày làm việc thứ Sáu 02/01)',
      },
      2027: {
        totalDays: 3,
        vacationBadge: 'Nghỉ 3 ngày (01/01 – 03/01)',
        description:
          'Tết Dương lịch 2027 • Nghỉ 3 ngày liên tục từ thứ Sáu 01/01/2027 đến hết Chủ Nhật 03/01/2027',
      },
    },
  },
  {
    id: 'giai-phong-mien-nam',
    name: 'Ngày Giải phóng miền Nam 30/4',
    type: 'solar',
    category: 'PUBLIC_HOLIDAYS',
    solarDate: { day: 30, month: 4 },
    description: 'Ngày Giải phóng miền Nam, thống nhất đất nước (30/04/1975)',
    isImportant: true,
    totalDays: 1,
    vacationBadge: 'Nghỉ lễ chính thức',
    yearlySchedules: {
      2026: {
        totalDays: 4,
        vacationBadge: 'Nghỉ 4 ngày (30/04 – 03/05)',
        description:
          'Kỳ nghỉ lễ 30/4 & 1/5 năm 2026 • Nghỉ 4 ngày liên tục từ thứ Năm 30/04/2026 đến hết Chủ Nhật 03/05/2026',
      },
      2027: {
        totalDays: 4,
        vacationBadge: 'Nghỉ 4 ngày (30/04 – 03/05)',
        description:
          'Kỳ nghỉ lễ 30/4 & 1/5 năm 2027 • Nghỉ 4 ngày liên tục từ thứ Sáu 30/04/2027 đến hết thứ Hai 03/05/2027 (nghỉ bù ngày 1/5 trùng thứ Bảy)',
      },
    },
  },
  {
    id: 'quoc-te-lao-dong',
    name: 'Ngày Quốc tế Lao động 1/5',
    type: 'solar',
    category: 'PUBLIC_HOLIDAYS',
    solarDate: { day: 1, month: 5 },
    description: 'Ngày Quốc tế Lao động (01/05) — Nghỉ lễ chính thức hưởng nguyên lương',
    isImportant: true,
    totalDays: 1,
    vacationBadge: 'Nghỉ lễ chính thức',
    yearlySchedules: {
      2026: {
        vacationBadge: 'Nghỉ chung kỳ lễ 30/4 - 1/5 (4 ngày)',
        description:
          'Ngày Quốc tế Lao động 1/5 • Nằm trong kỳ nghỉ lễ 4 ngày liên tục từ 30/04/2026 đến 03/05/2026',
      },
      2027: {
        vacationBadge: 'Nghỉ bù thứ Hai 03/05 (4 ngày)',
        description:
          'Ngày Quốc tế Lao động 1/5 • Năm 2027 trùng thứ Bảy nên được nghỉ bù vào thứ Hai 03/05/2027 (tổng cộng 4 ngày từ 30/04 đến 03/05/2027)',
      },
    },
  },
  {
    id: 'quoc-khanh',
    name: 'Lễ Quốc khánh 2/9',
    type: 'solar',
    category: 'PUBLIC_HOLIDAYS',
    solarDate: { day: 2, month: 9 },
    description: 'Ngày Quốc khánh nước CHXHCN Việt Nam (02/09/1945)',
    isImportant: true,
    totalDays: 2,
    vacationBadge: 'Nghỉ lễ chính thức',
    yearlySchedules: {
      2026: {
        totalDays: 5,
        vacationBadge: 'Nghỉ 5 ngày (29/08 – 02/09)',
        description:
          'Kỳ nghỉ Lễ Quốc khánh 2026 • Nghỉ 5 ngày liên tục từ thứ Bảy 29/08/2026 đến hết thứ Tư 02/09/2026',
      },
      2027: {
        totalDays: 4,
        vacationBadge: 'Nghỉ 4 ngày (02/09 – 05/09)',
        description:
          'Kỳ nghỉ Lễ Quốc khánh 2027 • Nghỉ 4 ngày liên tục từ thứ Năm 02/09/2027 đến hết Chủ Nhật 05/09/2027 (gồm 2 ngày lễ Quốc khánh và 2 ngày cuối tuần)',
      },
    },
  },
  {
    id: 'ngay-van-hoa-viet-nam',
    name: 'Ngày Văn hóa Việt Nam',
    type: 'solar',
    category: 'PUBLIC_HOLIDAYS',
    solarDate: { day: 24, month: 11 },
    description:
      'Ngày lễ chính thức được nghỉ làm việc, hưởng nguyên lương (theo Nghị quyết 80-NQ/TW & Nghị quyết 28/2026/QH16) — Kỷ niệm Hội nghị Văn hóa toàn quốc lần thứ nhất (24/11/1946)',
    isImportant: true,
    totalDays: 1,
    vacationBadge: 'Nghỉ 1 ngày hưởng nguyên lương',
    yearlySchedules: {
      2026: {
        totalDays: 1,
        vacationBadge: 'Nghỉ 1 ngày (Thứ Ba 24/11)',
        description:
          'Ngày Văn hóa Việt Nam (24/11/2026) • Ngày lễ chính thức mới theo Nghị quyết 80-NQ/TW & Nghị quyết 28/2026/QH16 — Người lao động được nghỉ 1 ngày (thứ Ba 24/11/2026) và hưởng nguyên lương',
      },
      2027: {
        totalDays: 1,
        vacationBadge: 'Nghỉ 1 ngày (Thứ Tư 24/11)',
        description:
          'Ngày Văn hóa Việt Nam (24/11/2027) • Ngày lễ chính thức theo Nghị quyết 80-NQ/TW & Nghị quyết 28/2026/QH16 — Người lao động được nghỉ 1 ngày (thứ Tư 24/11/2027) và hưởng nguyên lương',
      },
    },
  },

  // SECTOR ANNIVERSARIES
  {
    id: 'ngay-hoc-sinh-sinh-vien',
    name: 'Ngày Học sinh, Sinh viên',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 9, month: 1 },
    description: 'Ngày truyền thống học sinh sinh viên Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-thay-thuoc',
    name: 'Ngày Thầy thuốc Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 27, month: 2 },
    description: 'Ngày truyền thống ngành Y tế',
    isImportant: false,
  },
  {
    id: 'ngay-bien-phong',
    name: 'Ngày Biên phòng toàn dân',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 3, month: 3 },
    description: 'Ngày truyền thống Bộ đội Biên phòng',
    isImportant: false,
  },
  {
    id: 'ngay-doan-tncs',
    name: 'Ngày thành lập Đoàn TNCS Hồ Chí Minh',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 26, month: 3 },
    description: 'Ngày thành lập Đoàn Thanh niên',
    isImportant: false,
  },
  {
    id: 'ngay-dan-quan-tu-ve',
    name: 'Ngày truyền thống Dân quân tự vệ',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 28, month: 3 },
    description: 'Ngày truyền thống Dân quân tự vệ Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-sach-vn',
    name: 'Ngày Sách Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 21, month: 4 },
    description: 'Ngày Sách Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-thong-ke',
    name: 'Ngày Thống kê Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 6, month: 5 },
    description: 'Ngày truyền thống ngành Thống kê',
    isImportant: false,
  },
  {
    id: 'ngay-doi-tntp',
    name: 'Ngày thành lập Đội TNTP Hồ Chí Minh',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 15, month: 5 },
    description: 'Ngày thành lập Đội Thiếu niên Tiền phong',
    isImportant: false,
  },
  {
    id: 'ngay-truong-son',
    name: 'Ngày truyền thống Bộ đội Trường Sơn',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 19, month: 5 },
    description: 'Ngày truyền thống Bộ đội Trường Sơn',
    isImportant: false,
  },
  {
    id: 'ngay-bao-chi',
    name: 'Ngày Báo chí Cách mạng Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 21, month: 6 },
    description: 'Ngày truyền thống ngành Báo chí',
    isImportant: false,
  },
  {
    id: 'ngay-gia-dinh',
    name: 'Ngày Gia đình Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 28, month: 6 },
    description: 'Ngày Gia đình Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-bhyt',
    name: 'Ngày Bảo hiểm Y tế Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 1, month: 7 },
    description: 'Ngày Bảo hiểm Y tế Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-kiem-sat',
    name: 'Ngày thành lập ngành Kiểm sát',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 26, month: 7 },
    description: 'Ngày truyền thống Viện Kiểm sát nhân dân',
    isImportant: false,
  },
  {
    id: 'ngay-thuong-binh-liet-si',
    name: 'Ngày Thương binh - Liệt sĩ',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 27, month: 7 },
    description: 'Ngày Thương binh - Liệt sĩ',
    isImportant: true,
  },
  {
    id: 'ngay-cong-doan',
    name: 'Ngày thành lập Công đoàn Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 28, month: 7 },
    description: 'Ngày thành lập Công đoàn Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-cong-an',
    name: 'Ngày truyền thống Công an nhân dân',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 19, month: 8 },
    description: 'Ngày truyền thống lực lượng Công an',
    isImportant: false,
  },
  {
    id: 'ngay-mttq',
    name: 'Ngày thành lập Mặt trận Tổ quốc Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 10, month: 9 },
    description: 'Ngày thành lập Mặt trận Tổ quốc Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-thue-hai-quan',
    name: 'Ngày truyền thống ngành Thuế & Hải quan',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 10, month: 9 },
    description: 'Ngày truyền thống ngành Thuế và Hải quan',
    isImportant: false,
  },
  {
    id: 'ngay-toa-an',
    name: 'Ngày truyền thống Tòa án nhân dân',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 13, month: 9 },
    description: 'Ngày truyền thống ngành Tòa án',
    isImportant: false,
  },
  {
    id: 'ngay-chuyen-doi-so',
    name: 'Ngày Chuyển đổi số Quốc gia',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 10, month: 10 },
    description: 'Ngày Chuyển đổi số Quốc gia Việt Nam (theo Quyết định 505/QĐ-TTg)',
    isImportant: false,
  },
  {
    id: 'ngay-luat-su-in',
    name: 'Ngày truyền thống Luật sư & Ngành In',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 10, month: 10 },
    description: 'Ngày truyền thống Luật sư và ngành In',
    isImportant: false,
  },
  {
    id: 'ngay-doanh-nhan',
    name: 'Ngày Doanh nhân Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 13, month: 10 },
    description: 'Ngày Doanh nhân Việt Nam (13/10)',
    isImportant: false,
  },
  {
    id: 'ngay-nong-dan',
    name: 'Ngày Hội Nông dân Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 14, month: 10 },
    description: 'Ngày truyền thống Hội Nông dân Việt Nam',
    isImportant: false,
  },
  {
    id: 'ngay-phu-nu',
    name: 'Ngày Phụ nữ Việt Nam 20/10',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 20, month: 10 },
    description: 'Ngày thành lập Hội Liên hiệp Phụ nữ Việt Nam (20/10/1930)',
    isImportant: true,
  },
  {
    id: 'ngay-phap-luat',
    name: 'Ngày Pháp luật Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 9, month: 11 },
    description: 'Ngày Pháp luật nước CHXHCN Việt Nam (09/11)',
    isImportant: false,
  },
  {
    id: 'ngay-dai-doan-ket',
    name: 'Ngày hội Đại đoàn kết toàn dân tộc',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 18, month: 11 },
    description: 'Ngày truyền thống Mặt trận Tổ quốc Việt Nam (18/11/1930) & Ngày hội Đại đoàn kết toàn dân tộc',
    isImportant: true,
  },
  {
    id: 'ngay-nha-giao',
    name: 'Ngày Nhà giáo Việt Nam 20/11',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 20, month: 11 },
    description: 'Ngày tôn vinh các thầy cô giáo và ngành Giáo dục Việt Nam (20/11)',
    isImportant: true,
  },
  {
    id: 'ngay-di-san',
    name: 'Ngày Di sản Văn hóa Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 23, month: 11 },
    description: 'Ngày Di sản Văn hóa Việt Nam (23/11)',
    isImportant: false,
  },
  {
    id: 'ngay-quan-doi',
    name: 'Ngày thành lập Quân đội nhân dân Việt Nam',
    type: 'solar',
    category: 'SECTOR_ANNIVERSARIES',
    solarDate: { day: 22, month: 12 },
    description: 'Ngày thành lập Quân đội nhân dân Việt Nam (22/12/1944) & Ngày hội Quốc phòng toàn dân',
    isImportant: true,
  },

  // CULTURAL / INTERNATIONAL CELEBRATIONS IN VIETNAM
  {
    id: 'quoc-te-phu-nu',
    name: 'Ngày Quốc tế Phụ nữ 8/3',
    type: 'solar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    solarDate: { day: 8, month: 3 },
    description: 'Ngày Quốc tế Phụ nữ (08/03)',
    isImportant: true,
  },
  {
    id: 'quoc-te-thieu-nhi',
    name: 'Ngày Quốc tế Thiếu nhi 1/6',
    type: 'solar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    solarDate: { day: 1, month: 6 },
    description: 'Ngày Quốc tế Thiếu nhi (01/06)',
    isImportant: false,
  },
  {
    id: 'le-giang-sinh',
    name: 'Lễ Giáng Sinh (Noel)',
    type: 'solar',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    solarDate: { day: 25, month: 12 },
    description: 'Lễ Giáng Sinh — Mùa lễ hội an lành cuối năm (24–25/12)',
    isImportant: true,
  },

  // REVOLUTIONARY_ANNIVERSARIES
  {
    id: 'ngay-dong-khoi',
    name: 'Ngày Bến Tre Đồng khởi',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 17, month: 1 },
    description: 'Phong trào Đồng khởi tại Bến Tre (1960)',
    isImportant: false,
  },
  {
    id: 'ngay-hiep-dinh-paris',
    name: 'Ngày ký Hiệp định Paris',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 27, month: 1 },
    description: 'Ký kết Hiệp định Paris (1973)',
    isImportant: false,
  },
  {
    id: 'ngay-mau-than',
    name: 'Ngày Tổng tiến công Tết Mậu Thân',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 30, month: 1 },
    description: 'Tổng tiến công và nổi dậy Xuân Mậu Thân 1968',
    isImportant: false,
  },
  {
    id: 'ngay-thanh-lap-dang',
    name: 'Ngày thành lập Đảng Cộng sản Việt Nam',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 3, month: 2 },
    description: 'Thành lập Đảng Cộng sản Việt Nam (1930)',
    isImportant: true,
  },
  {
    id: 'ngay-giai-phong-da-nang',
    name: 'Ngày Giải phóng Đà Nẵng',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 29, month: 3 },
    description: 'Giải phóng thành phố Đà Nẵng (1975)',
    isImportant: false,
  },
  {
    id: 'ngay-dien-bien-phu',
    name: 'Ngày Chiến thắng Điện Biên Phủ',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 7, month: 5 },
    description: 'Chiến thắng Điện Biên Phủ (1954)',
    isImportant: true,
  },
  {
    id: 'ngay-chinh-phu-cach-mang',
    name: 'Ngày thành lập Chính phủ Cách mạng lâm thời',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 6, month: 6 },
    description: 'Thành lập Chính phủ Cách mạng lâm thời (1969)',
    isImportant: false,
  },
  {
    id: 'ngay-hiep-dinh-geneve',
    name: 'Ngày ký Hiệp định Genève',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 20, month: 7 },
    description: 'Ký kết Hiệp định Genève (1954)',
    isImportant: false,
  },
  {
    id: 'ngay-cach-mang-thang-8',
    name: 'Ngày Cách mạng tháng Tám thành công',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 19, month: 8 },
    description: 'Cách mạng tháng Tám (1945)',
    isImportant: true,
  },
  {
    id: 'ngay-nam-bo-khang-chien',
    name: 'Ngày Nam Bộ Kháng chiến',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 23, month: 9 },
    description: 'Nam Bộ kháng chiến (1945)',
    isImportant: false,
  },
  {
    id: 'ngay-giai-phong-thu-do',
    name: 'Ngày Giải phóng Thủ đô',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 10, month: 10 },
    description: 'Quân đội tiếp quản Thủ đô (1954)',
    isImportant: true,
  },
  {
    id: 'ngay-duong-hcm-tren-bien',
    name: 'Ngày truyền thống Đường Hồ Chí Minh trên biển',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 23, month: 10 },
    description: 'Thành lập Đoàn 759 (1961)',
    isImportant: false,
  },
  {
    id: 'ngay-nam-ky-khoi-nghia',
    name: 'Ngày Nam Kỳ Khởi nghĩa',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 23, month: 11 },
    description: 'Khởi nghĩa Nam Kỳ (1940)',
    isImportant: false,
  },
  {
    id: 'ngay-toan-quoc-khang-chien',
    name: 'Ngày Toàn quốc Kháng chiến',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 19, month: 12 },
    description: 'Lời kêu gọi toàn quốc kháng chiến (1946)',
    isImportant: true,
  },
  {
    id: 'ngay-mat-tran-giai-phong',
    name: 'Ngày thành lập Mặt trận Giải phóng miền Nam',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 20, month: 12 },
    description: 'Thành lập Mặt trận Giải phóng (1960)',
    isImportant: false,
  },
  {
    id: 'ngay-dien-bien-phu-tren-khong',
    name: 'Ngày Chiến thắng Điện Biên Phủ trên không',
    type: 'solar',
    category: 'REVOLUTIONARY_ANNIVERSARIES',
    solarDate: { day: 30, month: 12 },
    description: '12 ngày đêm Hà Nội (1972)',
    isImportant: true,
  },

  // HISTORICAL_FIGURES
  {
    id: 'ngay-mat-vo-thi-sau',
    name: 'Ngày mất Anh hùng Võ Thị Sáu',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 23, month: 1 },
    description: 'Nữ anh hùng Võ Thị Sáu hy sinh (1952)',
    isImportant: false,
  },
  {
    id: 'ngay-mat-kim-dong',
    name: 'Ngày mất Anh hùng Kim Đồng',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 15, month: 2 },
    description: 'Kim Đồng hy sinh (1943)',
    isImportant: false,
  },
  {
    id: 'ngay-mat-phan-chu-trinh',
    name: 'Ngày mất Phan Chu Trinh',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 24, month: 3 },
    description: 'Nhà yêu nước Phan Chu Trinh (1926)',
    isImportant: false,
  },
  {
    id: 'ngay-sinh-bac-ho',
    name: 'Ngày sinh Chủ tịch Hồ Chí Minh',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 19, month: 5 },
    description: 'Sinh nhật Bác Hồ (1890)',
    isImportant: true,
  },
  {
    id: 'ngay-sinh-vo-nguyen-giap',
    name: 'Ngày sinh Đại tướng Võ Nguyên Giáp',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 25, month: 8 },
    description: 'Sinh nhật Đại tướng (1911)',
    isImportant: false,
  },
  {
    id: 'ngay-mat-vo-nguyen-giap',
    name: 'Ngày mất Đại tướng Võ Nguyên Giáp',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 4, month: 10 },
    description: 'Đại tướng qua đời (2013)',
    isImportant: false,
  },
  {
    id: 'ngay-mat-nguyen-trung-truc',
    name: 'Ngày mất Anh hùng Nguyễn Trung Trực',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 27, month: 10 },
    description: 'Anh hùng Nguyễn Trung Trực hy sinh (1868)',
    isImportant: false,
  },
  {
    id: 'ngay-mat-phan-boi-chau',
    name: 'Ngày mất Phan Bội Châu',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 29, month: 10 },
    description: 'Chí sĩ yêu nước Phan Bội Châu (1940)',
    isImportant: false,
  },
  {
    id: 'ngay-sinh-phan-boi-chau',
    name: 'Ngày sinh Phan Bội Châu',
    type: 'solar',
    category: 'HISTORICAL_FIGURES',
    solarDate: { day: 26, month: 12 },
    description: 'Sinh nhật Phan Bội Châu (1867)',
    isImportant: false,
  },
];

/**
 * Cultural, Ethnic Festivals and Yearly Official Vacation Schedules
 */
export interface YearlyFestival {
  id: string;
  name: string;
  category: HolidayCategory;
  location?: string;
  description?: string;
  isImportant: boolean;
  vacationBadge?: string;
  dates: {
    [year: number]: {
      startDate: string;
      endDate: string;
      description?: string;
      vacationBadge?: string;
    };
  };
}

export const YEARLY_FESTIVALS: YearlyFestival[] = [
  {
    id: 'lich-nghi-tet-am-lich',
    name: 'Kỳ nghỉ Tết Nguyên Đán chính thức',
    category: 'PUBLIC_HOLIDAYS',
    description: 'Lịch nghỉ Tết Âm lịch chính thức theo thông báo của Bộ Nội vụ & Chính phủ',
    isImportant: true,
    dates: {
      2025: {
        startDate: '2025-01-25',
        endDate: '2025-02-02',
        vacationBadge: 'Nghỉ 9 ngày liên tục (25/01 – 02/02)',
        description:
          'Lịch nghỉ Tết Nguyên Đán Ất Tỵ 2025: Nghỉ 9 ngày liên tục từ thứ Bảy 25/01/2025 (26 tháng Chạp) đến hết Chủ Nhật 02/02/2025 (mùng 5 tháng Giêng)',
      },
      2026: {
        startDate: '2026-02-14',
        endDate: '2026-02-22',
        vacationBadge: 'Nghỉ 9 ngày liên tục (14/02 – 22/02)',
        description:
          'Lịch nghỉ Tết Nguyên Đán Bính Ngọ 2026: Nghỉ 9 ngày liên tục từ thứ Bảy 14/02/2026 (27 tháng Chạp Ất Tỵ) đến hết Chủ Nhật 22/02/2026 (mùng 6 tháng Giêng Bính Ngọ)',
      },
      2027: {
        startDate: '2027-02-04',
        endDate: '2027-02-10',
        vacationBadge: 'Nghỉ 7 ngày liên tục (04/02 – 10/02)',
        description:
          'Lịch nghỉ Tết Nguyên Đán Đinh Mùi 2027 (Thông báo 11483/TB-BNV): Nghỉ 7 ngày liên tục từ thứ Năm 04/02/2027 (28 tháng Chạp Bính Ngọ) đến hết thứ Tư 10/02/2027 (mùng 5 tháng Giêng Đinh Mùi)',
      },
    },
  },
  {
    id: 'le-hoi-chua-huong',
    name: 'Lễ hội Chùa Hương',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    location: 'Hà Nội',
    description: 'Lễ hội tâm linh dài nhất miền Bắc',
    isImportant: true,
    dates: {
      2025: { startDate: '2025-02-04', endDate: '2025-04-28' },
      2026: { startDate: '2026-02-22', endDate: '2026-05-16' },
      2027: { startDate: '2027-02-11', endDate: '2027-05-05' },
    },
  },
  {
    id: 'hoi-lim',
    name: 'Hội Lim',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    location: 'Bắc Ninh',
    description: 'Lễ hội Quan họ truyền thống (13 tháng Giêng)',
    isImportant: true,
    dates: {
      2025: { startDate: '2025-02-11', endDate: '2025-02-12' },
      2026: { startDate: '2026-03-01', endDate: '2026-03-02' },
      2027: { startDate: '2027-02-18', endDate: '2027-02-19' },
    },
  },
  {
    id: 'le-hoi-dua-voi',
    name: 'Lễ hội Đua Voi Tây Nguyên',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    location: 'Đắk Lắk',
    description: 'Lễ hội truyền thống của đồng bào dân tộc tại Buôn Đôn',
    isImportant: false,
    dates: {
      2025: { startDate: '2025-03-01', endDate: '2025-03-03' },
      2026: { startDate: '2026-03-15', endDate: '2026-03-17' },
      2027: { startDate: '2027-03-05', endDate: '2027-03-07' },
    },
  },
  {
    id: 'le-hoi-kate',
    name: 'Lễ hội Kate',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    location: 'Ninh Thuận',
    description: 'Lễ hội lớn nhất của người Chăm Bàlamôn',
    isImportant: true,
    dates: {
      2025: { startDate: '2025-10-01', endDate: '2025-10-03' },
      2026: { startDate: '2026-10-10', endDate: '2026-10-12' },
      2027: { startDate: '2027-09-29', endDate: '2027-10-01' },
    },
  },
  {
    id: 'le-hoi-ok-om-bok',
    name: 'Lễ hội Ok Om Bok',
    category: 'CULTURAL_ETHNIC_FESTIVALS',
    location: 'Sóc Trăng/Trà Vinh',
    description: 'Lễ cúng trăng và đua ghe Ngo của người Khmer (Rằm tháng 10 Âm lịch)',
    isImportant: true,
    dates: {
      2025: { startDate: '2025-11-04', endDate: '2025-11-04' },
      2026: { startDate: '2026-11-23', endDate: '2026-11-23' },
      2027: { startDate: '2027-11-13', endDate: '2027-11-13' },
    },
  },
];
