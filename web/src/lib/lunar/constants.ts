// 10 Thiên Can
export const THIEN_CAN = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
] as const;

// 12 Địa Chi
export const DIA_CHI = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
] as const;

// 12 Con giáp
export const CON_GIAP = [
  { name: 'Tý', animal: 'Chuột', emoji: '🐀' },
  { name: 'Sửu', animal: 'Trâu', emoji: '🐂' },
  { name: 'Dần', animal: 'Hổ', emoji: '🐅' },
  { name: 'Mão', animal: 'Mèo', emoji: '🐇' },
  { name: 'Thìn', animal: 'Rồng', emoji: '🐉' },
  { name: 'Tỵ', animal: 'Rắn', emoji: '🐍' },
  { name: 'Ngọ', animal: 'Ngựa', emoji: '🐎' },
  { name: 'Mùi', animal: 'Dê', emoji: '🐐' },
  { name: 'Thân', animal: 'Khỉ', emoji: '🐒' },
  { name: 'Dậu', animal: 'Gà', emoji: '🐓' },
  { name: 'Tuất', animal: 'Chó', emoji: '🐕' },
  { name: 'Hợi', animal: 'Lợn', emoji: '🐖' },
] as const;

// 12 Giờ trong ngày
export const GIO_DIA_CHI = [
  { chi: 'Tý', timeRange: '23:00 - 01:00', start: 23, end: 1 },
  { chi: 'Sửu', timeRange: '01:00 - 03:00', start: 1, end: 3 },
  { chi: 'Dần', timeRange: '03:00 - 05:00', start: 3, end: 5 },
  { chi: 'Mão', timeRange: '05:00 - 07:00', start: 5, end: 7 },
  { chi: 'Thìn', timeRange: '07:00 - 09:00', start: 7, end: 9 },
  { chi: 'Tỵ', timeRange: '09:00 - 11:00', start: 9, end: 11 },
  { chi: 'Ngọ', timeRange: '11:00 - 13:00', start: 11, end: 13 },
  { chi: 'Mùi', timeRange: '13:00 - 15:00', start: 13, end: 15 },
  { chi: 'Thân', timeRange: '15:00 - 17:00', start: 15, end: 17 },
  { chi: 'Dậu', timeRange: '17:00 - 19:00', start: 17, end: 19 },
  { chi: 'Tuất', timeRange: '19:00 - 21:00', start: 19, end: 21 },
  { chi: 'Hợi', timeRange: '21:00 - 23:00', start: 21, end: 23 },
] as const;

// Ngũ hành
export const NGU_HANH = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'] as const;

// Ngũ hành của Can
export const CAN_NGU_HANH: Record<string, string> = {
  Giáp: 'Mộc',
  Ất: 'Mộc',
  Bính: 'Hỏa',
  Đinh: 'Hỏa',
  Mậu: 'Thổ',
  Kỷ: 'Thổ',
  Canh: 'Kim',
  Tân: 'Kim',
  Nhâm: 'Thủy',
  Quý: 'Thủy',
};

// 24 Tiết khí
export const TIET_KHI = [
  'Tiểu Hàn',
  'Đại Hàn',
  'Lập Xuân',
  'Vũ Thủy',
  'Kinh Trập',
  'Xuân Phân',
  'Thanh Minh',
  'Cốc Vũ',
  'Lập Hạ',
  'Tiểu Mãn',
  'Mang Chủng',
  'Hạ Chí',
  'Tiểu Thử',
  'Đại Thử',
  'Lập Thu',
  'Xử Thử',
  'Bạch Lộ',
  'Thu Phân',
  'Hàn Lộ',
  'Sương Giáng',
  'Lập Đông',
  'Tiểu Tuyết',
  'Đại Tuyết',
  'Đông Chí',
] as const;

// Vietnamese weekday names
export const WEEKDAY_NAMES = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
] as const;

export const WEEKDAY_NAMES_SHORT = [
  'CN',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
] as const;

// Vietnamese month names
export const MONTH_NAMES = [
  'Tháng Một',
  'Tháng Hai',
  'Tháng Ba',
  'Tháng Tư',
  'Tháng Năm',
  'Tháng Sáu',
  'Tháng Bảy',
  'Tháng Tám',
  'Tháng Chín',
  'Tháng Mười',
  'Tháng Mười Một',
  'Tháng Mười Hai',
] as const;
