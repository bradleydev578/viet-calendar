/**
 * ngocHapRules.ts
 * Bảng tra cứu Cát Tinh, Hung Tinh, Ngày Hoàng Đạo/Hắc Đạo, Giờ Hoàng Đạo,
 * Hướng Hắc Thần và Ngày Đại Kỵ chuẩn Ngọc Hạp Thông Thư & Lịch Vạn Niên Việt Nam.
 */

export const HOANG_DAO_DAY_CHIS_BY_LUNAR_MONTH: Record<number, string[]> = {
  1: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  2: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  3: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  4: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
  5: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  6: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
  7: ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  8: ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  9: ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  10: ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
  11: ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  12: ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
};

export const HOANG_DAO_HOURS_BY_DAY_CHI: Record<string, string[]> = {
  "Dần": ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  "Thân": ["Tý", "Sửu", "Thìn", "Tỵ", "Mùi", "Tuất"],
  "Mão": ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  "Dậu": ["Tý", "Dần", "Mão", "Ngọ", "Mùi", "Dậu"],
  "Thìn": ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  "Tuất": ["Dần", "Thìn", "Tỵ", "Thân", "Dậu", "Hợi"],
  "Tỵ": ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
  "Hợi": ["Sửu", "Thìn", "Ngọ", "Mùi", "Tuất", "Hợi"],
  "Tý": ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  "Ngọ": ["Tý", "Sửu", "Mão", "Ngọ", "Thân", "Dậu"],
  "Sửu": ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
  "Mùi": ["Dần", "Mão", "Tỵ", "Thân", "Tuất", "Hợi"],
};

export const HY_THAN_BY_CAN: Record<string, string> = {
  "Giáp": "Đông Bắc",
  "Kỷ": "Đông Bắc",
  "Ất": "Tây Bắc",
  "Canh": "Tây Bắc",
  "Bính": "Tây Nam",
  "Tân": "Tây Nam",
  "Đinh": "Nam",
  "Nhâm": "Nam",
  "Mậu": "Đông Nam",
  "Quý": "Đông Nam",
};

export const TAI_THAN_BY_CAN: Record<string, string> = {
  "Giáp": "Đông Nam",
  "Ất": "Đông Nam",
  "Bính": "Đông",
  "Đinh": "Đông",
  "Mậu": "Bắc",
  "Kỷ": "Nam",
  "Canh": "Tây Nam",
  "Tân": "Tây Nam",
  "Nhâm": "Tây",
  "Quý": "Tây Bắc",
};

export const HAC_THAN_BY_DGZ: Record<string, string | null> = {
  "Kỷ Dậu": "Đông Bắc", "Canh Tuất": "Đông Bắc", "Tân Hợi": "Đông Bắc", "Nhâm Tý": "Đông Bắc", "Quý Sửu": "Đông Bắc", "Giáp Dần": "Đông Bắc",
  "Ất Mão": "Đông", "Bính Thìn": "Đông", "Đinh Tỵ": "Đông", "Mậu Ngọ": "Đông", "Kỷ Mùi": "Đông",
  "Canh Thân": "Đông Nam", "Tân Dậu": "Đông Nam", "Nhâm Tuất": "Đông Nam", "Quý Hợi": "Đông Nam", "Giáp Tý": "Đông Nam", "Ất Sửu": "Đông Nam",
  "Bính Dần": "Nam", "Đinh Mão": "Nam", "Mậu Thìn": "Nam", "Kỷ Tỵ": "Nam", "Canh Ngọ": "Nam",
  "Tân Mùi": "Tây Nam", "Nhâm Thân": "Tây Nam", "Quý Dậu": "Tây Nam", "Giáp Tuất": "Tây Nam", "Ất Hợi": "Tây Nam", "Bính Tý": "Tây Nam",
  "Đinh Sửu": "Tây", "Mậu Dần": "Tây", "Kỷ Mão": "Tây", "Canh Thìn": "Tây", "Tân Tỵ": "Tây",
  "Nhâm Ngọ": "Tây Bắc", "Quý Mùi": "Tây Bắc", "Giáp Thân": "Tây Bắc", "Ất Dậu": "Tây Bắc", "Bính Tuất": "Tây Bắc", "Đinh Hợi": "Tây Bắc",
  "Mậu Tý": "Bắc", "Kỷ Sửu": "Bắc", "Canh Dần": "Bắc", "Tân Mão": "Bắc", "Nhâm Thìn": "Bắc",
};

export const TRUC_12_INFO: Record<string, { isGood: 0 | 1; ga: string; ba: string }> = {
  "Kiến": {
    isGood: 1,
    ga: "Trực Kiến: Tốt cho xuất hành, nhậm chức, cầu tài lộc, giao dịch, khai trương.",
    ba: "Trực Kiến: Kỵ động thổ, đào giếng, mở kho, an táng.",
  },
  "Trừ": {
    isGood: 1,
    ga: "Trực Trừ: Tốt cho cúng tế, cầu an, giải hạn, chữa bệnh, dọn dẹp, giao dịch.",
    ba: "Trực Trừ: Kỵ cưới hỏi, xuất hành đi xa, ký kết hợp đồng lớn.",
  },
  "Mãn": {
    isGood: 1,
    ga: "Trực Mãn: Tốt cho cúng tế, cầu tài, khai trương, xuất hành, sửa kho, may mặc.",
    ba: "Trực Mãn: Kỵ động thổ, kiện tụng, nhậm chức.",
  },
  "Bình": {
    isGood: 1,
    ga: "Trực Bình: Tốt cho sửa chữa nhà cửa, cầu phúc, giao dịch, nhập trạch, cưới hỏi.",
    ba: "Trực Bình: Kỵ đào kênh mương, khai mương phóng thủy.",
  },
  "Định": {
    isGood: 1,
    ga: "Trực Định: Tốt cho cưới hỏi, đính hôn, ký kết hợp đồng, khai trương, cầu danh.",
    ba: "Trực Định: Kỵ thưa kiện, tranh chấp, xuất hành đi xa.",
  },
  "Chấp": {
    isGood: 1,
    ga: "Trực Chấp: Tốt cho khởi công xây dựng, sửa chữa nhà, trồng trọt, lập khế ước.",
    ba: "Trực Chấp: Kỵ xuất hành đi xa, dọn nhà, mở kho xuất tiền.",
  },
  "Phá": {
    isGood: 0,
    ga: "Trực Phá: Phù hợp phá dỡ công trình cũ, chữa bệnh, giải quyết việc tồn đọng.",
    ba: "Trực Phá: Đại kỵ khai trương, cưới hỏi, ký hợp đồng, động thổ, nhập trạch.",
  },
  "Nguy": {
    isGood: 0,
    ga: "Trực Nguy: Phù hợp cúng tế, cầu an, tu tâm dưỡng tính, kê giường.",
    ba: "Trực Nguy: Kỵ xuất hành đường thủy, leo cao, khởi công xây dựng, cưới hỏi.",
  },
  "Thành": {
    isGood: 1,
    ga: "Trực Thành: Đại cát cho khai trương, ký hợp đồng, cưới hỏi, nhập trạch, nhập học, cầu tài.",
    ba: "Trực Thành: Kỵ kiện tụng, tranh chấp.",
  },
  "Thu": {
    isGood: 1,
    ga: "Trực Thu: Tốt cho thu hoạch, nạp tài, cất giữ tài sản, mua sắm, tu bổ kho tàng.",
    ba: "Trực Thu: Kỵ khởi công lớn, an táng, xuất hành xa.",
  },
  "Khai": {
    isGood: 1,
    ga: "Trực Khai: Đại cát cho khai trương, động thổ, cưới hỏi, nhập trạch, xuất hành, nhậm chức.",
    ba: "Trực Khai: Kỵ an táng, động đất hướng xấu.",
  },
  "Bế": {
    isGood: 0,
    ga: "Trực Bế: Phù hợp đắp đê, tu bổ tường rào, lấp hang lỗ.",
    ba: "Trực Bế: Đại kỵ khai trương, xuất hành, cưới hỏi, động thổ, nhập trạch.",
  },
};

export const DUONG_CONG_KY_NHAT: Record<number, number[]> = {
  1: [13],
  2: [11],
  3: [9],
  4: [7],
  5: [5],
  6: [3],
  7: [8, 29],
  8: [27],
  9: [25],
  10: [23],
  11: [21],
  12: [19],
};

export const GS_BY_LM_CHI: Record<number, Record<string, string[]>> = {
  "1": {
    "Thân": [
      "Minh tinh",
      "Giải thần",
      "Nguyệt giải",
      "Phổ hộ (Hội hộ)",
      "Dịch Mã"
    ],
    "Mùi": [
      "Kính Tâm",
      "Ngọc đường",
      "Thiên thành"
    ],
    "Tuất": [
      "Hoàng Ân",
      "Thiên Quan",
      "Thiên hỷ",
      "Tam Hợp",
      "Tư Mệnh"
    ],
    "Hợi": [
      "Ngũ phú",
      "Mẫu Thương",
      "Thánh tâm",
      "U Vi tinh",
      "Lục Hợp"
    ],
    "Dậu": [
      "Phúc Sinh",
      "Âm Đức",
      "Cát Khánh"
    ],
    "Tỵ": [
      "Hoạt điệu",
      "Địa tài",
      "Kim đường"
    ],
    "Tý": [
      "Mẫu Thương",
      "Đại Hồng Sa",
      "Thanh Long",
      "Sinh khí",
      "Ích Hậu"
    ],
    "Sửu": [
      "Đại Hồng Sa",
      "Minh đường",
      "Tuế hợp",
      "Tục Thế"
    ],
    "Ngọ": [
      "Tam Hợp",
      "Nguyệt Tài",
      "Dân nhật, thời đức",
      "Thiên Mã (Lộc mã)"
    ],
    "Dần": [
      "Phúc hậu",
      "Yếu yên (thiên quý)",
      "Mãn đức tinh",
      "Quan nhật"
    ],
    "Thìn": [
      "Thiên phú",
      "Lộc khố",
      "Thiên tài",
      "Kim Quỹ"
    ]
  },
  "2": {
    "Tuất": [
      "Minh tinh",
      "Hoạt điệu",
      "Lục Hợp"
    ],
    "Sửu": [
      "Kính Tâm",
      "Hoàng Ân",
      "Đại Hồng Sa",
      "Sinh khí"
    ],
    "Thân": [
      "Giải thần",
      "Nguyệt giải",
      "Yếu yên (thiên quý)",
      "Thiên Mã (Lộc mã)"
    ],
    "Dần": [
      "Phổ hộ (Hội hộ)",
      "Ngũ phú",
      "Thanh Long",
      "Phúc hậu",
      "Cát Khánh"
    ],
    "Tý": [
      "Thiên Quan",
      "Mẫu Thương",
      "Đại Hồng Sa",
      "Tuế hợp",
      "Tư Mệnh"
    ],
    "Mão": [
      "Phúc Sinh",
      "Minh đường",
      "Quan nhật"
    ],
    "Hợi": [
      "Mẫu Thương",
      "Thiên hỷ",
      "Tam Hợp"
    ],
    "Mùi": [
      "Tam Hợp",
      "Âm Đức",
      "Địa tài",
      "Kim đường",
      "Mãn đức tinh",
      "Tục Thế"
    ],
    "Tỵ": [
      "Thánh tâm",
      "Nguyệt Tài",
      "Dịch Mã",
      "Thiên phú",
      "Lộc khố"
    ],
    "Ngọ": [
      "Ích Hậu",
      "Dân nhật, thời đức",
      "Thiên tài",
      "Kim Quỹ"
    ],
    "Dậu": [
      "Ngọc đường",
      "Thiên thành"
    ],
    "Thìn": [
      "U Vi tinh"
    ]
  },
  "3": {
    "Tý": [
      "Minh tinh",
      "Mẫu Thương",
      "Đại Hồng Sa",
      "Thiên hỷ",
      "Tam Hợp",
      "Thánh tâm"
    ],
    "Thân": [
      "Kính Tâm",
      "Tam Hợp",
      "Thiên tài",
      "Kim Quỹ"
    ],
    "Tuất": [
      "Giải thần",
      "Phúc Sinh",
      "Thiên Mã (Lộc mã)"
    ],
    "Dậu": [
      "Nguyệt giải",
      "Phổ hộ (Hội hộ)",
      "Địa tài",
      "Kim đường",
      "Lục Hợp"
    ],
    "Dần": [
      "Hoàng Ân",
      "Thiên Quan",
      "Sinh khí",
      "Dịch Mã",
      "Phúc hậu",
      "Tục Thế",
      "Tư Mệnh"
    ],
    "Tỵ": [
      "Ngũ phú",
      "Nguyệt Tài",
      "Âm Đức",
      "Minh đường"
    ],
    "Mùi": [
      "Hoạt điệu"
    ],
    "Sửu": [
      "Đại Hồng Sa",
      "Ích Hậu",
      "U Vi tinh"
    ],
    "Thìn": [
      "Thanh Long",
      "Mãn đức tinh",
      "Quan nhật"
    ],
    "Mão": [
      "Yếu yên (thiên quý)"
    ],
    "Ngọ": [
      "Thiên phú",
      "Lộc khố",
      "Dân nhật, thời đức"
    ],
    "Hợi": [
      "Ngọc đường",
      "Tuế hợp",
      "Thiên thành",
      "Cát Khánh"
    ]
  },
  "4": {
    "Dần": [
      "Minh tinh",
      "Kính Tâm",
      "Mẫu Thương"
    ],
    "Tuất": [
      "Giải thần",
      "Thiên tài",
      "Tuế hợp",
      "Kim Quỹ"
    ],
    "Dậu": [
      "Nguyệt giải",
      "Tam Hợp",
      "Yếu yên (thiên quý)",
      "Dân nhật, thời đức",
      "Mãn đức tinh"
    ],
    "Mão": [
      "Phổ hộ (Hội hộ)",
      "Mẫu Thương",
      "Sinh khí",
      "Âm Đức"
    ],
    "Tỵ": [
      "Hoàng Ân",
      "Đại Hồng Sa",
      "Phúc hậu",
      "Quan nhật"
    ],
    "Thìn": [
      "Thiên Quan",
      "Phúc Sinh",
      "Cát Khánh",
      "Tư Mệnh"
    ],
    "Thân": [
      "Ngũ phú",
      "Lục Hợp",
      "Tục Thế"
    ],
    "Tý": [
      "Hoạt điệu",
      "Thiên Mã (Lộc mã)"
    ],
    "Sửu": [
      "Thiên hỷ",
      "Tam Hợp",
      "Ngọc đường",
      "Thiên thành"
    ],
    "Ngọ": [
      "Thánh tâm",
      "Thanh Long",
      "U Vi tinh"
    ],
    "Mùi": [
      "Nguyệt Tài",
      "Ích Hậu",
      "Minh đường",
      "Thiên phú",
      "Lộc khố"
    ],
    "Hợi": [
      "Dịch Mã",
      "Địa tài",
      "Kim đường"
    ]
  },
  "5": {
    "Thìn": [
      "Minh tinh",
      "Đại Hồng Sa",
      "Sinh khí",
      "Yếu yên (thiên quý)"
    ],
    "Dậu": [
      "Kính Tâm",
      "Hoàng Ân",
      "Hoạt điệu",
      "Nguyệt Tài",
      "Minh đường",
      "Dân nhật, thời đức",
      "Tuế hợp"
    ],
    "Tý": [
      "Giải thần",
      "Thiên tài",
      "Kim Quỹ"
    ],
    "Tuất": [
      "Nguyệt giải",
      "Phổ hộ (Hội hộ)",
      "Tam Hợp"
    ],
    "Ngọ": [
      "Thiên Quan",
      "Mãn đức tinh",
      "Quan nhật",
      "Tư Mệnh"
    ],
    "Hợi": [
      "Ngũ phú",
      "Phúc Sinh"
    ],
    "Dần": [
      "Mẫu Thương",
      "Thiên hỷ",
      "Tam Hợp",
      "Ích Hậu",
      "Thiên Mã (Lộc mã)"
    ],
    "Mão": [
      "Mẫu Thương",
      "Ngọc đường",
      "U Vi tinh",
      "Tục Thế",
      "Thiên thành"
    ],
    "Tỵ": [
      "Đại Hồng Sa",
      "Phúc hậu"
    ],
    "Sửu": [
      "Thánh tâm",
      "Âm Đức",
      "Địa tài",
      "Kim đường",
      "Cát Khánh"
    ],
    "Thân": [
      "Thanh Long",
      "Dịch Mã",
      "Thiên phú",
      "Lộc khố"
    ],
    "Mùi": [
      "Lục Hợp"
    ]
  },
  "6": {
    "Ngọ": [
      "Minh tinh",
      "Lục Hợp",
      "Cát Khánh"
    ],
    "Mão": [
      "Kính Tâm",
      "Hoàng Ân",
      "Mẫu Thương",
      "Thiên hỷ",
      "Tam Hợp",
      "Địa tài",
      "Kim đường"
    ],
    "Tý": [
      "Giải thần"
    ],
    "Tuất": [
      "Nguyệt giải",
      "Thanh Long",
      "Yếu yên (thiên quý)"
    ],
    "Thìn": [
      "Phổ hộ (Hội hộ)",
      "Đại Hồng Sa",
      "Thiên Mã (Lộc mã)"
    ],
    "Thân": [
      "Thiên Quan",
      "Ích Hậu",
      "U Vi tinh",
      "Tuế hợp",
      "Tư Mệnh"
    ],
    "Dần": [
      "Ngũ phú",
      "Hoạt điệu",
      "Mẫu Thương",
      "Thiên tài",
      "Kim Quỹ"
    ],
    "Tỵ": [
      "Phúc Sinh",
      "Đại Hồng Sa",
      "Sinh khí",
      "Dịch Mã",
      "Phúc hậu",
      "Ngọc đường",
      "Thiên thành"
    ],
    "Hợi": [
      "Tam Hợp",
      "Nguyệt Tài",
      "Âm Đức",
      "Minh đường",
      "Mãn đức tinh"
    ],
    "Mùi": [
      "Thánh tâm",
      "Quan nhật"
    ],
    "Dậu": [
      "Thiên phú",
      "Lộc khố",
      "Dân nhật, thời đức",
      "Tục Thế"
    ]
  },
  "7": {
    "Thân": [
      "Minh tinh",
      "Phúc hậu",
      "Mãn đức tinh",
      "Quan nhật"
    ],
    "Tuất": [
      "Kính Tâm",
      "Thiên Quan",
      "Thiên phú",
      "Lộc khố",
      "Tư Mệnh"
    ],
    "Dần": [
      "Giải thần",
      "Thánh tâm",
      "Dịch Mã"
    ],
    "Hợi": [
      "Nguyệt giải",
      "Phổ hộ (Hội hộ)",
      "Hoạt điệu"
    ],
    "Tý": [
      "Hoàng Ân",
      "Phúc Sinh",
      "Tam Hợp",
      "Thanh Long",
      "Dân nhật, thời đức"
    ],
    "Tỵ": [
      "Ngũ phú",
      "Yếu yên (thiên quý)",
      "Địa tài",
      "Kim đường",
      "U Vi tinh",
      "Lục Hợp"
    ],
    "Sửu": [
      "Mẫu Thương",
      "Minh đường"
    ],
    "Thìn": [
      "Mẫu Thương",
      "Thiên hỷ",
      "Tam Hợp",
      "Thiên tài",
      "Tục Thế",
      "Kim Quỹ"
    ],
    "Ngọ": [
      "Đại Hồng Sa",
      "Sinh khí",
      "Nguyệt Tài",
      "Thiên Mã (Lộc mã)"
    ],
    "Mùi": [
      "Đại Hồng Sa",
      "Ngọc đường",
      "Tuế hợp",
      "Thiên thành"
    ],
    "Dậu": [
      "Âm Đức"
    ],
    "Mão": [
      "Ích Hậu",
      "Cát Khánh"
    ]
  },
  "8": {
    "Tuất": [
      "Minh tinh",
      "U Vi tinh",
      "Tục Thế"
    ],
    "Thìn": [
      "Kính Tâm",
      "Hoạt điệu",
      "Mẫu Thương",
      "Lục Hợp"
    ],
    "Dần": [
      "Giải thần",
      "Thanh Long"
    ],
    "Hợi": [
      "Nguyệt giải",
      "Dịch Mã",
      "Yếu yên (thiên quý)",
      "Thiên phú",
      "Lộc khố"
    ],
    "Tỵ": [
      "Phổ hộ (Hội hộ)",
      "Thiên hỷ",
      "Tam Hợp",
      "Nguyệt Tài"
    ],
    "Ngọ": [
      "Hoàng Ân",
      "Phúc Sinh",
      "Đại Hồng Sa",
      "Thiên tài",
      "Tuế hợp",
      "Kim Quỹ"
    ],
    "Tý": [
      "Thiên Quan",
      "Dân nhật, thời đức",
      "Tư Mệnh"
    ],
    "Thân": [
      "Ngũ phú",
      "Thánh tâm",
      "Phúc hậu",
      "Thiên Mã (Lộc mã)",
      "Cát Khánh"
    ],
    "Sửu": [
      "Mẫu Thương",
      "Tam Hợp",
      "Mãn đức tinh"
    ],
    "Mùi": [
      "Đại Hồng Sa",
      "Sinh khí",
      "Âm Đức",
      "Địa tài",
      "Kim đường"
    ],
    "Dậu": [
      "Ích Hậu",
      "Ngọc đường",
      "Thiên thành",
      "Quan nhật"
    ],
    "Mão": [
      "Minh đường"
    ]
  },
  "9": {
    "Tý": [
      "Minh tinh",
      "Phổ hộ (Hội hộ)",
      "Thiên phú",
      "Lộc khố",
      "Dân nhật, thời đức"
    ],
    "Hợi": [
      "Kính Tâm",
      "Hoàng Ân",
      "Ngũ phú",
      "Ngọc đường",
      "Thiên thành"
    ],
    "Thìn": [
      "Giải thần",
      "Mẫu Thương",
      "Thanh Long",
      "Ích Hậu"
    ],
    "Ngọ": [
      "Nguyệt giải",
      "Đại Hồng Sa",
      "Thiên hỷ",
      "Tam Hợp",
      "Yếu yên (thiên quý)"
    ],
    "Dần": [
      "Thiên Quan",
      "Tam Hợp",
      "Tư Mệnh"
    ],
    "Sửu": [
      "Phúc Sinh",
      "Hoạt điệu",
      "Mẫu Thương"
    ],
    "Mùi": [
      "Đại Hồng Sa",
      "U Vi tinh"
    ],
    "Mão": [
      "Thánh tâm",
      "Lục Hợp"
    ],
    "Thân": [
      "Sinh khí",
      "Dịch Mã",
      "Phúc hậu",
      "Thiên tài",
      "Kim Quỹ"
    ],
    "Tỵ": [
      "Nguyệt Tài",
      "Âm Đức",
      "Minh đường",
      "Tuế hợp",
      "Tục Thế",
      "Cát Khánh"
    ],
    "Dậu": [
      "Địa tài",
      "Kim đường"
    ],
    "Tuất": [
      "Thiên Mã (Lộc mã)",
      "Mãn đức tinh",
      "Quan nhật"
    ]
  },
  "10": {
    "Dần": [
      "Minh tinh",
      "Ngũ phú",
      "Lục Hợp"
    ],
    "Tỵ": [
      "Kính Tâm",
      "Dịch Mã"
    ],
    "Thìn": [
      "Giải thần",
      "Hoàng Ân",
      "Thiên Quan",
      "Tuế hợp",
      "Tư Mệnh"
    ],
    "Ngọ": [
      "Nguyệt giải",
      "Phổ hộ (Hội hộ)",
      "Hoạt điệu",
      "Thanh Long"
    ],
    "Mùi": [
      "Phúc Sinh",
      "Thiên hỷ",
      "Tam Hợp",
      "Nguyệt Tài",
      "Minh đường"
    ],
    "Thân": [
      "Mẫu Thương",
      "Đại Hồng Sa"
    ],
    "Dậu": [
      "Mẫu Thương",
      "Thánh tâm",
      "Sinh khí"
    ],
    "Mão": [
      "Tam Hợp",
      "Âm Đức",
      "Dân nhật, thời đức",
      "Mãn đức tinh"
    ],
    "Tuất": [
      "Ích Hậu",
      "Thiên tài",
      "Cát Khánh",
      "Kim Quỹ"
    ],
    "Hợi": [
      "Phúc hậu",
      "Địa tài",
      "Kim đường",
      "Tục Thế",
      "Quan nhật"
    ],
    "Tý": [
      "Yếu yên (thiên quý)",
      "Thiên Mã (Lộc mã)",
      "U Vi tinh"
    ],
    "Sửu": [
      "Thiên phú",
      "Lộc khố",
      "Ngọc đường",
      "Thiên thành"
    ]
  },
  "11": {
    "Thìn": [
      "Minh tinh",
      "Tam Hợp",
      "Thánh tâm"
    ],
    "Tý": [
      "Kính Tâm",
      "Mãn đức tinh",
      "Thiên tài",
      "Quan nhật",
      "Kim Quỹ"
    ],
    "Ngọ": [
      "Giải thần",
      "Thiên Quan",
      "Tục Thế",
      "Tư Mệnh"
    ],
    "Mùi": [
      "Nguyệt giải",
      "Yếu yên (thiên quý)",
      "Cát Khánh"
    ],
    "Sửu": [
      "Phổ hộ (Hội hộ)",
      "Âm Đức",
      "Địa tài",
      "Kim đường",
      "Lục Hợp"
    ],
    "Thân": [
      "Hoàng Ân",
      "Mẫu Thương",
      "Đại Hồng Sa",
      "Thiên hỷ",
      "Tam Hợp",
      "Thanh Long"
    ],
    "Tỵ": [
      "Ngũ phú",
      "Ích Hậu"
    ],
    "Dần": [
      "Phúc Sinh",
      "Dịch Mã",
      "Thiên phú",
      "Lộc khố",
      "Thiên Mã (Lộc mã)"
    ],
    "Mão": [
      "Hoạt điệu",
      "Dân nhật, thời đức",
      "Ngọc đường",
      "Tuế hợp",
      "Thiên thành"
    ],
    "Dậu": [
      "Mẫu Thương",
      "Nguyệt Tài",
      "Minh đường",
      "U Vi tinh"
    ],
    "Tuất": [
      "Đại Hồng Sa",
      "Sinh khí"
    ],
    "Hợi": [
      "Phúc hậu"
    ]
  },
  "12": {
    "Ngọ": [
      "Minh tinh",
      "Kính Tâm",
      "Giải thần"
    ],
    "Mùi": [
      "Nguyệt giải",
      "Phổ hộ (Hội hộ)",
      "Hoàng Ân"
    ],
    "Thân": [
      "Thiên Quan",
      "Ngũ phú",
      "Phúc Sinh",
      "Hoạt điệu",
      "Mẫu Thương",
      "Đại Hồng Sa",
      "Tư Mệnh"
    ],
    "Dậu": [
      "Mẫu Thương",
      "Thiên hỷ",
      "Tam Hợp"
    ],
    "Tuất": [
      "Đại Hồng Sa",
      "Thánh tâm",
      "Thanh Long"
    ],
    "Tỵ": [
      "Tam Hợp",
      "Mãn đức tinh",
      "Ngọc đường"
    ],
    "Hợi": [
      "Sinh khí",
      "Nguyệt Tài",
      "Âm Đức",
      "Ích Hậu",
      "Dịch Mã",
      "Phúc hậu",
      "Minh đường"
    ],
    "Sửu": [
      "Yếu yên (thiên quý)",
      "Quan nhật"
    ],
    "Mão": [
      "Thiên phú",
      "Địa tài",
      "Lộc khố",
      "Dân nhật, thời đức",
      "Kim đường"
    ],
    "Thìn": [
      "Thiên Mã (Lộc mã)"
    ],
    "Dần": [
      "Thiên tài",
      "U Vi tinh",
      "Tuế hợp",
      "Kim Quỹ"
    ],
    "Tý": [
      "Lục Hợp",
      "Tục Thế",
      "Thiên thành",
      "Cát Khánh"
    ]
  }
};

export const GS_BY_LM_CAN: Record<number, Record<string, string[]>> = {
  "1": {
    "Bính": [
      "Nguyệt Đức",
      "Nguyệt Ân"
    ],
    "Giáp": [
      "Thiên Quý"
    ],
    "Ất": [
      "Thiên Quý"
    ],
    "Nhâm": [
      "Nguyệt Không"
    ],
    "Tân": [
      "Nguyệt đức hợp"
    ],
    "Kỷ": [
      "Thiên Phúc"
    ]
  },
  "2": {
    "Giáp": [
      "Nguyệt Đức",
      "Thiên Quý"
    ],
    "Đinh": [
      "Nguyệt Ân"
    ],
    "Ất": [
      "Thiên Quý"
    ],
    "Canh": [
      "Nguyệt Không"
    ],
    "Kỷ": [
      "Nguyệt đức hợp"
    ],
    "Mậu": [
      "Thiên Phúc"
    ]
  },
  "3": {
    "Nhâm": [
      "Nguyệt Đức"
    ],
    "Canh": [
      "Nguyệt Ân"
    ],
    "Giáp": [
      "Thiên Quý"
    ],
    "Ất": [
      "Thiên Quý"
    ],
    "Bính": [
      "Nguyệt Không"
    ],
    "Đinh": [
      "Nguyệt đức hợp"
    ]
  },
  "4": {
    "Canh": [
      "Nguyệt Đức"
    ],
    "Kỷ": [
      "Nguyệt Ân"
    ],
    "Đinh": [
      "Thiên Quý"
    ],
    "Bính": [
      "Thiên Quý"
    ],
    "Giáp": [
      "Nguyệt Không"
    ],
    "Ất": [
      "Nguyệt đức hợp"
    ],
    "Quý": [
      "Thiên Phúc"
    ],
    "Tân": [
      "Thiên Phúc"
    ]
  },
  "5": {
    "Bính": [
      "Nguyệt Đức",
      "Thiên Quý"
    ],
    "Mậu": [
      "Nguyệt Ân"
    ],
    "Đinh": [
      "Thiên Quý"
    ],
    "Nhâm": [
      "Nguyệt Không",
      "Thiên Phúc"
    ],
    "Tân": [
      "Nguyệt đức hợp"
    ],
    "Canh": [
      "Thiên Phúc"
    ]
  },
  "6": {
    "Giáp": [
      "Nguyệt Đức"
    ],
    "Tân": [
      "Nguyệt Ân"
    ],
    "Bính": [
      "Thiên Quý"
    ],
    "Đinh": [
      "Thiên Quý"
    ],
    "Canh": [
      "Nguyệt Không"
    ],
    "Kỷ": [
      "Nguyệt đức hợp"
    ]
  },
  "7": {
    "Nhâm": [
      "Nguyệt Đức",
      "Nguyệt Ân"
    ],
    "Canh": [
      "Thiên Quý"
    ],
    "Tân": [
      "Thiên Quý"
    ],
    "Bính": [
      "Nguyệt Không"
    ],
    "Đinh": [
      "Nguyệt đức hợp"
    ],
    "Ất": [
      "Thiên Phúc"
    ]
  },
  "8": {
    "Canh": [
      "Nguyệt Đức",
      "Thiên Quý"
    ],
    "Quý": [
      "Nguyệt Ân"
    ],
    "Tân": [
      "Thiên Quý"
    ],
    "Giáp": [
      "Nguyệt Không",
      "Thiên Phúc"
    ],
    "Ất": [
      "Nguyệt đức hợp"
    ]
  },
  "9": {
    "Bính": [
      "Nguyệt Đức"
    ],
    "Canh": [
      "Nguyệt Ân",
      "Thiên Quý"
    ],
    "Tân": [
      "Thiên Quý",
      "Nguyệt đức hợp"
    ],
    "Nhâm": [
      "Nguyệt Không"
    ]
  },
  "10": {
    "Giáp": [
      "Nguyệt Đức"
    ],
    "Ất": [
      "Nguyệt Ân"
    ],
    "Quý": [
      "Thiên Quý"
    ],
    "Nhâm": [
      "Thiên Quý"
    ],
    "Canh": [
      "Nguyệt Không"
    ],
    "Kỷ": [
      "Nguyệt đức hợp"
    ],
    "Đinh": [
      "Thiên Phúc"
    ]
  },
  "11": {
    "Nhâm": [
      "Nguyệt Đức",
      "Thiên Quý"
    ],
    "Giáp": [
      "Nguyệt Ân"
    ],
    "Quý": [
      "Thiên Quý"
    ],
    "Bính": [
      "Nguyệt Không",
      "Thiên Phúc"
    ],
    "Đinh": [
      "Nguyệt đức hợp"
    ]
  },
  "12": {
    "Canh": [
      "Nguyệt Đức"
    ],
    "Tân": [
      "Nguyệt Ân"
    ],
    "Nhâm": [
      "Thiên Quý"
    ],
    "Quý": [
      "Thiên Quý"
    ],
    "Giáp": [
      "Nguyệt Không"
    ],
    "Ất": [
      "Nguyệt đức hợp"
    ]
  }
};

export const BS_BY_LM_CHI: Record<number, Record<string, string[]>> = {
  "1": {
    "Sửu": [
      "Hoang vu",
      "Tứ thời cô quả",
      "Hỏa tai",
      "Địa Tặc",
      "Nguyệt Hư"
    ],
    "Tỵ": [
      "Hoang vu",
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Thần cách",
      "Thiên Cương",
      "Nguyệt Hình",
      "Ngũ hư",
      "Tiểu Hồng Sa",
      "Tiểu Hao",
      "Băng tiêu ngoạ hãm",
      "Sát chủ"
    ],
    "Dậu": [
      "Hoang vu",
      "Huyền Vũ",
      "Nhân Cách",
      "Thiên Lại",
      "Ly sàng"
    ],
    "Thân": [
      "Nguyệt phá",
      "Thiên Lao"
    ],
    "Dần": [
      "Lục Bất thành",
      "Lôi công",
      "Thổ phủ",
      "Vãng vong",
      "Thiên Hình"
    ],
    "Hợi": [
      "Thổ cẩm",
      "Câu Trận",
      "Địa phá",
      "Kiếp sát",
      "Hà khôi",
      "Cẩu Giảo"
    ],
    "Tý": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Lỗ ban sát",
      "Phi Ma sát"
    ],
    "Tuất": [
      "Thụ tử",
      "Cô thần",
      "Quỷ khốc",
      "Nguyệt Yếm đại họa"
    ],
    "Ngọ": [
      "Ngũ Quỹ",
      "Hoàng Sa",
      "Bạch hổ",
      "Đại Hao",
      "Tội chỉ"
    ],
    "Thìn": [
      "Thiên tặc",
      "Phủ đầu dát",
      "Tam tang",
      "Không phòng",
      "Thổ ôn",
      "Quả tú",
      "Cửu không"
    ],
    "Mão": [
      "Chu tước hắc đạo"
    ],
    "Mùi": [
      "Thiên ôn"
    ]
  },
  "2": {
    "Tỵ": [
      "Hoang vu",
      "Vãng vong",
      "Chu tước hắc đạo",
      "Không phòng",
      "Thổ ôn",
      "Quả tú"
    ],
    "Dậu": [
      "Hoang vu",
      "Nguyệt phá",
      "Ngũ hư",
      "Thiên tặc",
      "Nguyệt Yếm đại họa",
      "Tiểu Hồng Sa",
      "Phi Ma sát",
      "Ly sàng"
    ],
    "Sửu": [
      "Hoang vu",
      "Câu Trận",
      "Tứ thời cô quả",
      "Cửu không"
    ],
    "Thìn": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Thụ tử",
      "Phủ đầu dát",
      "Tam tang",
      "Thiên Hình"
    ],
    "Tuất": [
      "Nguyệt phá",
      "Quỷ khốc",
      "Thiên ôn",
      "Nguyệt Hư",
      "Thiên Lao"
    ],
    "Ngọ": [
      "Lục Bất thành",
      "Thiên Lại",
      "Tiểu Hao",
      "Hà khôi",
      "Cẩu Giảo"
    ],
    "Mão": [
      "Thần cách",
      "Thiên Ngục",
      "Thiên Hỏa",
      "Thổ phủ"
    ],
    "Hợi": [
      "Huyền Vũ",
      "Lôi công",
      "Thổ cẩm",
      "Cô thần"
    ],
    "Tý": [
      "Lỗ ban sát",
      "Thiên Cương",
      "Địa phá",
      "Nguyệt Hình",
      "Địa Tặc",
      "Băng tiêu ngoạ hãm",
      "Sát chủ",
      "Tội chỉ"
    ],
    "Dần": [
      "Ngũ Quỹ",
      "Hoàng Sa"
    ],
    "Mùi": [
      "Nhân Cách",
      "Hỏa tai",
      "Đại Hao"
    ],
    "Thân": [
      "Kiếp sát",
      "Bạch hổ"
    ]
  },
  "3": {
    "Dậu": [
      "Hoang vu",
      "Ly sàng"
    ],
    "Sửu": [
      "Hoang vu",
      "Thần cách",
      "Huyền Vũ",
      "Địa phá",
      "Ngũ hư",
      "Tứ thời cô quả",
      "Tiểu Hồng Sa",
      "Băng tiêu ngoạ hãm",
      "Hà khôi",
      "Cẩu Giảo"
    ],
    "Tỵ": [
      "Hoang vu",
      "Lôi công",
      "Nhân Cách",
      "Kiếp sát"
    ],
    "Mão": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Câu Trận",
      "Thiên Lại"
    ],
    "Tuất": [
      "Nguyệt phá",
      "Lục Bất thành",
      "Quỷ khốc",
      "Bạch hổ",
      "Cửu không"
    ],
    "Hợi": [
      "Thổ cẩm",
      "Thụ tử",
      "Địa Tặc"
    ],
    "Ngọ": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Thổ ôn",
      "Phi Ma sát",
      "Quả tú",
      "Thiên Hình"
    ],
    "Tý": [
      "Cô thần",
      "Lỗ ban sát",
      "Hoàng Sa",
      "Không phòng",
      "Thiên Lao"
    ],
    "Mùi": [
      "Thiên Cương",
      "Chu tước hắc đạo",
      "Tiểu Hao",
      "Nguyệt Hư",
      "Sát chủ",
      "Tội chỉ"
    ],
    "Thìn": [
      "Ngũ Quỹ",
      "Nguyệt Hình",
      "Phủ đầu dát",
      "Thổ phủ",
      "Tam tang",
      "Thiên ôn"
    ],
    "Dần": [
      "Thiên tặc",
      "Hỏa tai"
    ],
    "Thân": [
      "Nguyệt Yếm đại họa",
      "Vãng vong",
      "Đại Hao"
    ]
  },
  "4": {
    "Thìn": [
      "Hoang vu",
      "Tứ thời cô quả",
      "Nguyệt Hư"
    ],
    "Thân": [
      "Hoang vu",
      "Lôi công",
      "Nguyệt Hình",
      "Ngũ hư",
      "Hỏa tai",
      "Tiểu Hao",
      "Hà khôi",
      "Cẩu Giảo",
      "Thiên Hình"
    ],
    "Tý": [
      "Hoang vu",
      "Thiên Lại",
      "Bạch hổ"
    ],
    "Dần": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Thổ cẩm",
      "Thiên Cương",
      "Địa phá",
      "Kiếp sát",
      "Thiên ôn",
      "Băng tiêu ngoạ hãm",
      "Ly sàng",
      "Thiên Lao"
    ],
    "Hợi": [
      "Nguyệt phá",
      "Thần cách",
      "Vãng vong"
    ],
    "Tỵ": [
      "Lục Bất thành",
      "Thụ tử",
      "Câu Trận",
      "Tiểu Hồng Sa",
      "Thổ phủ"
    ],
    "Mão": [
      "Huyền Vũ",
      "Lỗ ban sát",
      "Nhân Cách",
      "Phi Ma sát",
      "Sát chủ"
    ],
    "Dậu": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Ngũ Quỹ",
      "Chu tước hắc đạo",
      "Đại Hao"
    ],
    "Sửu": [
      "Cô thần",
      "Tội chỉ"
    ],
    "Tuất": [
      "Quỷ khốc",
      "Không phòng",
      "Địa Tặc"
    ],
    "Mùi": [
      "Thiên tặc",
      "Nguyệt Yếm đại họa",
      "Phủ đầu dát",
      "Tam tang",
      "Thổ ôn",
      "Quả tú",
      "Cửu không"
    ],
    "Ngọ": [
      "Hoàng Sa",
      "Ly sàng"
    ]
  },
  "5": {
    "Thân": [
      "Hoang vu",
      "Thổ ôn",
      "Quả tú",
      "Sát chủ",
      "Tội chỉ"
    ],
    "Tý": [
      "Hoang vu",
      "Nguyệt phá",
      "Thiên Ngục",
      "Thiên Hỏa",
      "Thụ tử",
      "Ngũ hư",
      "Thiên tặc",
      "Phi Ma sát"
    ],
    "Thìn": [
      "Hoang vu",
      "Tứ thời cô quả",
      "Thiên Lao"
    ],
    "Sửu": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Nguyệt phá",
      "Nhân Cách",
      "Nguyệt Hư"
    ],
    "Dậu": [
      "Lục Bất thành",
      "Thần cách",
      "Thiên Cương",
      "Thiên Lại",
      "Tiểu Hồng Sa",
      "Địa Tặc",
      "Tiểu Hao"
    ],
    "Tỵ": [
      "Huyền Vũ"
    ],
    "Dần": [
      "Lôi công",
      "Thổ cẩm",
      "Cô thần",
      "Hoàng Sa",
      "Bạch hổ",
      "Ly sàng"
    ],
    "Mùi": [
      "Câu Trận",
      "Phủ đầu dát",
      "Tam tang"
    ],
    "Mão": [
      "Lỗ ban sát",
      "Địa phá",
      "Ngũ Quỹ",
      "Hỏa tai",
      "Vãng vong",
      "Băng tiêu ngoạ hãm",
      "Hà khôi",
      "Cẩu Giảo",
      "Cửu không"
    ],
    "Ngọ": [
      "Nguyệt Hình",
      "Nguyệt Yếm đại họa",
      "Thổ phủ",
      "Thiên ôn",
      "Ly sàng"
    ],
    "Tuất": [
      "Quỷ khốc",
      "Đại Hao",
      "Thiên Hình"
    ],
    "Hợi": [
      "Chu tước hắc đạo",
      "Không phòng",
      "Kiếp sát"
    ]
  },
  "6": {
    "Thìn": [
      "Hoang vu",
      "Thiên Cương",
      "Địa phá",
      "Ngũ hư",
      "Tứ thời cô quả",
      "Bạch hổ"
    ],
    "Thân": [
      "Hoang vu",
      "Ngũ Quỹ",
      "Kiếp sát",
      "Địa Tặc"
    ],
    "Tý": [
      "Hoang vu",
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Hoàng Sa",
      "Thiên ôn",
      "Cửu không",
      "Thiên Hình"
    ],
    "Sửu": [
      "Nguyệt phá",
      "Lục Bất thành",
      "Nguyệt Hình",
      "Tiểu Hồng Sa",
      "Chu tước hắc đạo"
    ],
    "Mùi": [
      "Thần cách",
      "Huyền Vũ",
      "Phủ đầu dát",
      "Thổ phủ",
      "Tam tang",
      "Không phòng"
    ],
    "Hợi": [
      "Lôi công",
      "Nhân Cách",
      "Đại Hao"
    ],
    "Dần": [
      "Thổ cẩm",
      "Tội chỉ",
      "Ly sàng"
    ],
    "Mão": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Cô thần",
      "Lỗ ban sát"
    ],
    "Ngọ": [
      "Thụ tử",
      "Thiên Lại",
      "Vãng vong",
      "Ly sàng",
      "Thiên Lao"
    ],
    "Dậu": [
      "Câu Trận",
      "Hỏa tai",
      "Thổ ôn",
      "Phi Ma sát",
      "Quả tú"
    ],
    "Tuất": [
      "Quỷ khốc",
      "Tiểu Hao",
      "Nguyệt Hư",
      "Băng tiêu ngoạ hãm",
      "Hà khôi",
      "Sát chủ",
      "Cẩu Giảo"
    ],
    "Tỵ": [
      "Thiên tặc",
      "Nguyệt Yếm đại họa"
    ]
  },
  "7": {
    "Mão": [
      "Hoang vu",
      "Thiên Lại",
      "Chu tước hắc đạo"
    ],
    "Mùi": [
      "Hoang vu",
      "Tứ thời cô quả",
      "Địa Tặc",
      "Nguyệt Hư"
    ],
    "Hợi": [
      "Hoang vu",
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Câu Trận",
      "Thiên Cương",
      "Ngũ hư",
      "Tiểu Hao",
      "Băng tiêu ngoạ hãm"
    ],
    "Dần": [
      "Nguyệt phá",
      "Nguyệt Hình",
      "Không phòng",
      "Thiên Hình"
    ],
    "Thân": [
      "Lục Bất thành",
      "Thổ phủ",
      "Thiên Lao"
    ],
    "Tỵ": [
      "Thần cách",
      "Lôi công",
      "Thổ cẩm",
      "Địa phá",
      "Tiểu Hồng Sa",
      "Kiếp sát",
      "Hà khôi",
      "Cẩu Giảo"
    ],
    "Dậu": [
      "Huyền Vũ",
      "Nhân Cách",
      "Phủ đầu dát",
      "Vãng vong",
      "Thiên ôn",
      "Cửu không",
      "Tội chỉ"
    ],
    "Ngọ": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Lỗ ban sát",
      "Hoàng Sa",
      "Phi Ma sát",
      "Bạch hổ"
    ],
    "Sửu": [
      "Thụ tử",
      "Ngũ Quỹ",
      "Sát chủ"
    ],
    "Thìn": [
      "Cô thần",
      "Nguyệt Yếm đại họa",
      "Hỏa tai"
    ],
    "Tuất": [
      "Quỷ khốc",
      "Thiên tặc",
      "Tam tang",
      "Thổ ôn",
      "Quả tú",
      "Ly sàng"
    ],
    "Tý": [
      "Đại Hao"
    ]
  },
  "8": {
    "Mùi": [
      "Hoang vu",
      "Thụ tử",
      "Tứ thời cô quả",
      "Nhân Cách"
    ],
    "Hợi": [
      "Hoang vu",
      "Huyền Vũ",
      "Thổ ôn",
      "Quả tú",
      "Sát chủ"
    ],
    "Mão": [
      "Hoang vu",
      "Nguyệt phá",
      "Thần cách",
      "Ngũ hư",
      "Thiên tặc",
      "Nguyệt Yếm đại họa",
      "Không phòng",
      "Phi Ma sát",
      "Tội chỉ"
    ],
    "Tuất": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Quỷ khốc",
      "Hỏa tai",
      "Tam tang",
      "Ly sàng",
      "Thiên Lao"
    ],
    "Thìn": [
      "Nguyệt phá",
      "Nguyệt Hư",
      "Thiên Hình"
    ],
    "Tý": [
      "Lục Bất thành",
      "Thiên Lại",
      "Vãng vong",
      "Tiểu Hao",
      "Hà khôi",
      "Cẩu Giảo"
    ],
    "Thân": [
      "Lôi công",
      "Thiên ôn",
      "Bạch hổ"
    ],
    "Tỵ": [
      "Thổ cẩm",
      "Cô thần",
      "Ngũ Quỹ",
      "Chu tước hắc đạo"
    ],
    "Dậu": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Nguyệt Hình",
      "Phủ đầu dát",
      "Tiểu Hồng Sa",
      "Thổ phủ"
    ],
    "Sửu": [
      "Câu Trận",
      "Đại Hao"
    ],
    "Ngọ": [
      "Lỗ ban sát",
      "Thiên Cương",
      "Địa phá",
      "Địa Tặc",
      "Băng tiêu ngoạ hãm",
      "Cửu không"
    ],
    "Dần": [
      "Hoàng Sa",
      "Kiếp sát"
    ]
  },
  "9": {
    "Hợi": [
      "Hoang vu",
      "Kiếp sát"
    ],
    "Mão": [
      "Hoang vu",
      "Câu Trận"
    ],
    "Mùi": [
      "Hoang vu",
      "Địa phá",
      "Nguyệt Hình",
      "Ngũ hư",
      "Tứ thời cô quả",
      "Chu tước hắc đạo",
      "Băng tiêu ngoạ hãm",
      "Hà khôi",
      "Cẩu Giảo"
    ],
    "Dậu": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Thiên Lại",
      "Phủ đầu dát"
    ],
    "Thìn": [
      "Nguyệt phá",
      "Lục Bất thành",
      "Vãng vong"
    ],
    "Sửu": [
      "Thần cách",
      "Huyền Vũ",
      "Thiên Cương",
      "Tiểu Hồng Sa",
      "Tiểu Hao",
      "Nguyệt Hư"
    ],
    "Dần": [
      "Lôi công",
      "Thụ tử",
      "Nguyệt Yếm đại họa",
      "Đại Hao",
      "Cửu không"
    ],
    "Tỵ": [
      "Thổ cẩm",
      "Nhân Cách",
      "Hỏa tai",
      "Địa Tặc",
      "Thiên ôn"
    ],
    "Tý": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Ngũ Quỹ",
      "Hoàng Sa",
      "Thổ ôn",
      "Phi Ma sát",
      "Quả tú",
      "Thiên Lao"
    ],
    "Ngọ": [
      "Cô thần",
      "Lỗ ban sát",
      "Không phòng",
      "Sát chủ",
      "Thiên Hình"
    ],
    "Tuất": [
      "Quỷ khốc",
      "Thổ phủ",
      "Tam tang",
      "Bạch hổ",
      "Tội chỉ",
      "Ly sàng"
    ],
    "Thân": [
      "Thiên tặc"
    ]
  },
  "10": {
    "Ngọ": [
      "Hoang vu",
      "Thiên Lại",
      "Hoàng Sa"
    ],
    "Tuất": [
      "Hoang vu",
      "Tứ thời cô quả",
      "Quỷ khốc",
      "Nguyệt Hư"
    ],
    "Dần": [
      "Hoang vu",
      "Ngũ hư",
      "Tiểu Hao",
      "Hà khôi",
      "Cẩu Giảo",
      "Thiên Lao"
    ],
    "Thân": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Thổ cẩm",
      "Thụ tử",
      "Thiên Cương",
      "Địa phá",
      "Không phòng",
      "Kiếp sát",
      "Băng tiêu ngoạ hãm",
      "Thiên Hình"
    ],
    "Tỵ": [
      "Nguyệt phá",
      "Câu Trận",
      "Tiểu Hồng Sa",
      "Ly sàng"
    ],
    "Hợi": [
      "Lục Bất thành",
      "Thần cách",
      "Lôi công",
      "Ngũ Quỹ",
      "Nguyệt Hình",
      "Hỏa tai",
      "Thổ phủ",
      "Thiên ôn",
      "Cửu không"
    ],
    "Mão": [
      "Huyền Vũ",
      "Thiên Ngục",
      "Thiên Hỏa",
      "Nhân Cách",
      "Đại Hao"
    ],
    "Mùi": [
      "Cô thần",
      "Vãng vong"
    ],
    "Dậu": [
      "Lỗ ban sát",
      "Chu tước hắc đạo",
      "Phi Ma sát",
      "Sát chủ"
    ],
    "Sửu": [
      "Thiên tặc",
      "Nguyệt Yếm đại họa",
      "Tam tang",
      "Thổ ôn",
      "Quả tú"
    ],
    "Tý": [
      "Phủ đầu dát",
      "Bạch hổ"
    ],
    "Thìn": [
      "Địa Tặc",
      "Tội chỉ"
    ]
  },
  "11": {
    "Dần": [
      "Hoang vu",
      "Hoàng Sa",
      "Thổ ôn",
      "Quả tú",
      "Bạch hổ",
      "Sát chủ"
    ],
    "Ngọ": [
      "Hoang vu",
      "Nguyệt phá",
      "Thiên Ngục",
      "Thiên Hỏa",
      "Ngũ hư",
      "Thiên tặc",
      "Hỏa tai",
      "Phi Ma sát"
    ],
    "Tuất": [
      "Hoang vu",
      "Tứ thời cô quả",
      "Quỷ khốc",
      "Vãng vong",
      "Thiên Hình"
    ],
    "Mùi": [
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Nguyệt phá",
      "Câu Trận",
      "Ngũ Quỹ",
      "Nguyệt Hư"
    ],
    "Mão": [
      "Lục Bất thành",
      "Thụ tử",
      "Thiên Cương",
      "Nguyệt Hình",
      "Thiên Lại",
      "Địa Tặc",
      "Tiểu Hao"
    ],
    "Dậu": [
      "Thần cách",
      "Lỗ ban sát",
      "Địa phá",
      "Tiểu Hồng Sa",
      "Không phòng",
      "Băng tiêu ngoạ hãm",
      "Hà khôi",
      "Cẩu Giảo"
    ],
    "Tỵ": [
      "Huyền Vũ",
      "Lôi công",
      "Kiếp sát",
      "Ly sàng"
    ],
    "Thân": [
      "Thổ cẩm",
      "Cô thần",
      "Cửu không"
    ],
    "Tý": [
      "Nguyệt Yếm đại họa",
      "Phủ đầu dát",
      "Thổ phủ"
    ],
    "Sửu": [
      "Nhân Cách",
      "Tam tang",
      "Thiên ôn"
    ],
    "Hợi": [
      "Chu tước hắc đạo",
      "Tội chỉ"
    ],
    "Thìn": [
      "Đại Hao",
      "Thiên Lao"
    ]
  },
  "12": {
    "Ngọ": [
      "Hoang vu",
      "Nguyệt Hỏa",
      "Độc Hỏa",
      "Thiên Lao"
    ],
    "Tuất": [
      "Hoang vu",
      "Thiên Cương",
      "Địa phá",
      "Ngũ Quỹ",
      "Nguyệt Hình",
      "Ngũ hư",
      "Tứ thời cô quả",
      "Quỷ khốc"
    ],
    "Dần": [
      "Hoang vu",
      "Kiếp sát",
      "Địa Tặc"
    ],
    "Mùi": [
      "Nguyệt phá",
      "Lục Bất thành",
      "Thần cách",
      "Huyền Vũ"
    ],
    "Thân": [
      "Lôi công",
      "Thổ cẩm"
    ],
    "Dậu": [
      "Thiên Ngục",
      "Thiên Hỏa",
      "Thụ tử",
      "Câu Trận",
      "Cô thần",
      "Lỗ ban sát"
    ],
    "Hợi": [
      "Thiên tặc",
      "Nguyệt Yếm đại họa",
      "Nhân Cách"
    ],
    "Tý": [
      "Thiên Lại",
      "Hỏa tai",
      "Hoàng Sa",
      "Phủ đầu dát",
      "Thiên Hình"
    ],
    "Sửu": [
      "Tiểu Hồng Sa",
      "Thổ phủ",
      "Vãng vong",
      "Chu tước hắc đạo",
      "Tam tang",
      "Không phòng"
    ],
    "Mão": [
      "Thổ ôn",
      "Thiên ôn",
      "Phi Ma sát",
      "Quả tú"
    ],
    "Thìn": [
      "Tiểu Hao",
      "Nguyệt Hư",
      "Băng tiêu ngoạ hãm",
      "Hà khôi",
      "Bạch hổ",
      "Sát chủ",
      "Cẩu Giảo"
    ],
    "Tỵ": [
      "Đại Hao",
      "Cửu không",
      "Tội chỉ",
      "Ly sàng"
    ]
  }
};

export const BS_BY_LM_CAN: Record<number, Record<string, string[]>> = {
  "1": {
    "Giáp": [
      "Trùng Tang"
    ],
    "Canh": [
      "Trùng phục"
    ]
  },
  "2": {
    "Ất": [
      "Trùng Tang"
    ],
    "Tân": [
      "Trùng phục"
    ]
  },
  "3": {
    "Kỷ": [
      "Trùng Tang",
      "Trùng phục"
    ]
  },
  "4": {
    "Bính": [
      "Trùng Tang"
    ],
    "Nhâm": [
      "Trùng phục"
    ]
  },
  "5": {
    "Đinh": [
      "Trùng Tang"
    ],
    "Quý": [
      "Trùng phục"
    ]
  },
  "6": {
    "Kỷ": [
      "Trùng Tang"
    ],
    "Mậu": [
      "Trùng phục"
    ]
  },
  "7": {
    "Canh": [
      "Trùng Tang"
    ],
    "Giáp": [
      "Trùng phục"
    ]
  },
  "8": {
    "Tân": [
      "Trùng Tang"
    ],
    "Ất": [
      "Trùng phục"
    ]
  },
  "9": {
    "Kỷ": [
      "Trùng Tang",
      "Trùng phục"
    ]
  },
  "10": {
    "Nhâm": [
      "Trùng Tang",
      "Trùng phục"
    ]
  },
  "11": {
    "Quý": [
      "Trùng Tang",
      "Trùng phục"
    ]
  },
  "12": {
    "Kỷ": [
      "Trùng Tang",
      "Trùng phục"
    ]
  }
};

export function getNgocHapStars(
  lunarMonth: number,
  lunarDay: number,
  dayCan: string,
  dayChi: string,
  dayGZ: string
): { gs: string[]; bs: string[]; daiKy: string[] } {
  const m = ((lunarMonth - 1) % 12) + 1;
  const gsSet = new Set<string>([
    ...(GS_BY_LM_CHI[m]?.[dayChi] || []),
    ...(GS_BY_LM_CAN[m]?.[dayCan] || []),
  ]);

  // Thiên đức & Thiên đức hợp
  const thienDucMap: Record<number, { can?: string; chi?: string }> = {
    1: { can: "Đinh" }, 2: { chi: "Thân" }, 3: { can: "Nhâm" }, 4: { can: "Tân" },
    5: { chi: "Hợi" }, 6: { can: "Giáp" }, 7: { can: "Quý" }, 8: { chi: "Dần" },
    9: { can: "Bính" }, 10: { can: "Ất" }, 11: { chi: "Tỵ" }, 12: { can: "Canh" },
  };
  const thienDucHopMap: Record<number, { can?: string; chi?: string }> = {
    1: { can: "Nhâm" }, 2: { chi: "Tỵ" }, 3: { can: "Đinh" }, 4: { can: "Bính" },
    5: { chi: "Dần" }, 6: { can: "Kỷ" }, 7: { can: "Mậu" }, 8: { chi: "Hợi" },
    9: { can: "Tân" }, 10: { can: "Canh" }, 11: { chi: "Thân" }, 12: { can: "Ất" },
  };
  if (thienDucMap[m]?.can === dayCan || thienDucMap[m]?.chi === dayChi) gsSet.add("Thiên đức");
  if (thienDucHopMap[m]?.can === dayCan || thienDucHopMap[m]?.chi === dayChi) gsSet.add("Thiên đức hợp");

  // Thiên Xá
  if (
    ([1, 2, 3].includes(m) && dayGZ === "Mậu Dần") ||
    ([4, 5, 6].includes(m) && dayGZ === "Giáp Ngọ") ||
    ([7, 8, 9].includes(m) && dayGZ === "Mậu Thân") ||
    ([10, 11, 12].includes(m) && dayGZ === "Giáp Tý")
  ) {
    gsSet.add("Thiên Xá");
  }

  // Thiên Ân
  const thienAnSet = new Set([
    "Giáp Tý", "Ất Sửu", "Bính Dần", "Đinh Mão", "Mậu Thìn",
    "Kỷ Mão", "Canh Thìn", "Tân Tỵ", "Nhâm Ngọ", "Quý Mùi",
    "Kỷ Dậu", "Canh Tuất", "Tân Hợi", "Nhâm Tý", "Quý Sửu",
  ]);
  if (thienAnSet.has(dayGZ)) gsSet.add("Thiên Ân");

  // Thiên Thụy & Ngũ Hợp
  if (["Mậu Dần", "Kỷ Mão", "Canh Dần", "Tân Tỵ", "Nhâm Tý"].includes(dayGZ)) gsSet.add("Thiên Thụy");
  if (["Giáp Dần", "Ất Mão", "Mậu Ngọ", "Kỷ Mùi", "Tân Dậu", "Quý Hợi"].includes(dayGZ)) gsSet.add("Ngũ Hợp");

  // Tam Tinh: Trực Tinh, Sát cống, Đại cát (Nhân chuyên) & Bất Tương theo lm % 3
  const mod3 = m % 3;
  const trucTinhByMod3: Record<number, string[]> = {
    1: ["Giáp Thìn", "Quý Sửu", "Nhâm Tuất", "Đinh Sửu", "Bính Tuất", "Ất Mùi", "Mậu Thìn"],
    2: ["Bính Tý", "Ất Dậu", "Giáp Ngọ", "Quý Mão", "Nhâm Tý", "Tân Dậu", "Đinh Mão"],
    0: ["Ất Hợi", "Giáp Thân", "Quý Tỵ", "Nhâm Dần", "Canh Thân", "Bính Dần", "Tân Hợi"],
  };
  const satCongByMod3: Record<number, string[]> = {
    1: ["Quý Mão", "Nhâm Tý", "Đinh Mão", "Bính Tý", "Ất Dậu", "Giáp Ngọ", "Tân Dậu"],
    2: ["Ất Hợi", "Giáp Thân", "Quý Tỵ", "Nhâm Dần", "Tân Hợi", "Canh Thân", "Bính Dần"],
    0: ["Giáp Tuất", "Quý Mùi", "Nhâm Thìn", "Tân Sửu", "Canh Tuất", "Kỷ Mùi", "Ất Sửu"],
  };
  const batTuongByMod3: Record<number, string[]> = {
    1: ["Bính Thìn", "Canh Thìn", "Đinh Mùi", "Tân Mùi", "Mậu Tuất", "Kỷ Sửu"],
    2: ["Bính Ngọ", "Canh Ngọ", "Ất Mão", "Kỷ Mão", "Mậu Tý", "Đinh Dậu"],
    0: ["Giáp Dần", "Mậu Dần", "Ất Tỵ", "Kỷ Tỵ", "Bính Thân", "Đinh Hợi", "Quý Hợi"],
  };
  if (trucTinhByMod3[mod3]?.includes(dayGZ)) gsSet.add("Trực Tinh");
  if (satCongByMod3[mod3]?.includes(dayGZ)) gsSet.add("Sát cống");
  if (batTuongByMod3[mod3]?.includes(dayGZ)) gsSet.add("Bất Tương");

  // BS
  const bsSet = new Set<string>([
    ...(BS_BY_LM_CHI[m]?.[dayChi] || []),
    ...(BS_BY_LM_CAN[m]?.[dayCan] || []),
  ]);

  // Tứ thời đại mộ, Thiên địa chuyển sát, Âm thác, Dương thác
  if (
    ([1, 2, 3].includes(m) && dayGZ === "Ất Mùi") ||
    ([4, 5, 6].includes(m) && dayGZ === "Bính Tuất") ||
    ([7, 8, 9].includes(m) && dayGZ === "Tân Sửu") ||
    ([10, 11, 12].includes(m) && dayGZ === "Nhâm Thìn")
  ) {
    bsSet.add("Tứ thời đại mộ");
  }
  if (
    ([1, 2, 3].includes(m) && ["Ất Mão", "Tân Mão"].includes(dayGZ)) ||
    ([4, 5, 6].includes(m) && ["Bính Ngọ", "Mậu Ngọ"].includes(dayGZ)) ||
    ([7, 8, 9].includes(m) && ["Tân Dậu", "Quý Dậu"].includes(dayGZ)) ||
    ([10, 11, 12].includes(m) && ["Nhâm Tý", "Bính Tý"].includes(dayGZ))
  ) {
    bsSet.add("Thiên địa chuyển sát");
  }
  const amThacMap: Record<number, string> = {
    1: "Canh Tuất", 2: "Tân Dậu", 3: "Canh Thân", 4: "Đinh Mùi", 5: "Bính Ngọ", 6: "Đinh Tỵ",
    7: "Giáp Thìn", 8: "Ất Mão", 9: "Giáp Dần", 10: "Quý Sửu", 11: "Nhâm Tý", 12: "Quý Hợi",
  };
  const duongThacMap: Record<number, string> = {
    1: "Giáp Dần", 2: "Ất Mão", 3: "Giáp Thìn", 4: "Đinh Tỵ", 5: "Bính Ngọ", 6: "Đinh Mùi",
    7: "Canh Thân", 8: "Tân Dậu", 9: "Canh Tuất", 10: "Quý Hợi", 11: "Nhâm Tý", 12: "Quý Sửu",
  };
  if (amThacMap[m] === dayGZ) bsSet.add("Âm thác");
  if (duongThacMap[m] === dayGZ) bsSet.add("Dương thác");

  // Ngày Đại Kỵ
  const daiKy: string[] = [];
  if ([3, 7, 13, 18, 22, 27].includes(lunarDay)) {
    bsSet.add("Tam Nương");
    daiKy.push("Ngày Tam Nương (mùng 3, 7, 13, 18, 22, 27 Âm lịch): Kỵ tiến hành đại sự như cưới hỏi, khai trương, xuất hành xa, động thổ, nhập trạch.");
  }
  if ([5, 14, 23].includes(lunarDay)) {
    bsSet.add("Nguyệt Kỵ");
    daiKy.push("Ngày Nguyệt Kỵ (mùng 5, 14, 23 Âm lịch): Kỵ khởi sự lớn, cưới hỏi, khai trương, xuất hành xa.");
  }
  if (DUONG_CONG_KY_NHAT[m]?.includes(lunarDay)) {
    bsSet.add("Dương Công Kỵ");
    daiKy.push("Ngày Dương Công Kỵ Nhật: Đại kỵ khởi công xây dựng, động thổ, cưới hỏi, khai trương, ký kết lớn.");
  }
  if (bsSet.has("Thụ tử")) {
    daiKy.push("Phạm sao Thụ Tử (Đại hung): Tránh khởi tạo việc lớn, cưới hỏi, động thổ, khai trương.");
  }
  if (bsSet.has("Sát chủ")) {
    daiKy.push("Phạm sao Sát Chủ (Đại hung): Kỵ xây dựng, động thổ, cưới hỏi, nhậm chức, an táng.");
  }
  if (bsSet.has("Nguyệt phá")) {
    daiKy.push("Phạm sao Nguyệt Phá (Đại hung): Kỵ xây cất nhà cửa, khai trương, cưới hỏi, ký hợp đồng.");
  }

  return {
    gs: Array.from(gsSet),
    bs: Array.from(bsSet),
    daiKy,
  };
}
