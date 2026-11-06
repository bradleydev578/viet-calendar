import { Solar } from "lunar-javascript";
import { format } from "date-fns";
import type { DayFengShuiData, Direction } from "./types";
import { CAN_NGU_HANH, DIA_CHI, THIEN_CAN } from "@/lib/lunar/constants";
import {
  HOANG_DAO_DAY_CHIS_BY_LUNAR_MONTH,
  HOANG_DAO_HOURS_BY_DAY_CHI,
  HY_THAN_BY_CAN,
  TAI_THAN_BY_CAN,
  HAC_THAN_BY_DGZ,
  TRUC_12_INFO,
  getNgocHapStars,
} from "./ngocHapRules";
import { DayScore } from "./DayScore";

const GAN_MAP: Record<string, string> = {
  甲: "Giáp",
  乙: "Ất",
  丙: "Bính",
  丁: "Đinh",
  戊: "Mậu",
  己: "Kỷ",
  庚: "Canh",
  辛: "Tân",
  壬: "Nhâm",
  癸: "Quý",
};

const ZHI_MAP: Record<string, string> = {
  子: "Tý",
  丑: "Sửu",
  寅: "Dần",
  卯: "Mão",
  辰: "Thìn",
  巳: "Tỵ",
  午: "Ngọ",
  未: "Mùi",
  申: "Thân",
  酉: "Dậu",
  戌: "Tuất",
  亥: "Hợi",
};

const ZHI_XING_12_TRUC_MAP: Record<string, string> = {
  建: "Kiến",
  除: "Trừ",
  满: "Mãn",
  平: "Bình",
  定: "Định",
  执: "Chấp",
  破: "Phá",
  危: "Nguy",
  成: "Thành",
  收: "Thu",
  开: "Khai",
  闭: "Bế",
};

const JIE_QI_MAP: Record<string, string> = {
  小寒: "Tiểu hàn",
  大寒: "Đại hàn",
  立春: "Lập xuân",
  雨水: "Vũ thủy",
  惊蛰: "Kinh trập",
  春分: "Xuân phân",
  清明: "Thanh minh",
  谷雨: "Cốc vũ",
  立夏: "Lập hạ",
  小满: "Tiểu mãn",
  芒种: "Mang chủng",
  夏至: "Hạ chí",
  小暑: "Tiểu thử",
  大暑: "Đại thử",
  立秋: "Lập thu",
  处暑: "Xử thử",
  白露: "Bạch lộ",
  秋分: "Thu phân",
  寒露: "Hàn lộ",
  霜降: "Sương giáng",
  立冬: "Lập đông",
  小雪: "Tiểu tuyết",
  大雪: "Đại tuyết",
  冬至: "Đông chí",
};

export const XIU_28_SAO_MAP: Record<
  string,
  { name: string; s28g: 0 | 1; ga: string[]; ba: string[] }
> = {
  角: {
    name: "Giác",
    s28g: 1,
    ga: [
      "Tạo tác mọi việc đều đặng vinh xương, tấn lợi. Hôn nhân cưới gả sanh con quý. Công danh khoa cử đỗ đạt cao.",
    ],
    ba: [
      "Chôn cất hoạn nạn ba năm. Sửa chữa hay xây đắp mộ phần ắt có người chết.",
    ],
  },
  亢: {
    name: "Cang",
    s28g: 0,
    ga: ["Cắt may áo màn (sẽ có lộc ăn)."],
    ba: [
      "Chôn cất bị Trùng tang. Cưới gả, khởi dựng nhà cửa, tranh đấu kiện tụng đều bất lợi.",
    ],
  },
  氐: {
    name: "Đê",
    s28g: 0,
    ga: ["Sao Đê Đại Hung, không có việc nào hợp với ngày này."],
    ba: [
      "Đại kỵ khởi công xây dựng, chôn cất, cưới gả, xuất hành kỵ nhất là đường thủy.",
    ],
  },
  房: {
    name: "Phòng",
    s28g: 1,
    ga: [
      "Khởi công tạo tác mọi việc đều tốt, nhất là xây dựng nhà, chôn cất, cưới gả, xuất hành, đi thuyền, mưu sự, cắt áo.",
    ],
    ba: ["Sao Phòng là Đại Kiết Tinh, không kỵ việc gì cả."],
  },
  心: {
    name: "Tâm",
    s28g: 0,
    ga: ["Làm bất cứ việc gì cũng không hợp với sao Hung tú này."],
    ba: [
      "Khởi công tạo tác việc gì cũng không khỏi hại, nhất là xây cất, cưới gả, chôn cất, đóng giường, lót giường, tranh tụng.",
    ],
  },
  尾: {
    name: "Vĩ",
    s28g: 1,
    ga: [
      "Mọi việc đều tốt, tốt nhất là các vụ khởi tạo, chôn cất, cưới gả, xây cất, đào ao giếng, khai mương rạch, các vụ thủy lợi, khai trương, dọn cỏ phá đất.",
    ],
    ba: ["Đóng giường, lót giường, đi thuyền."],
  },
  箕: {
    name: "Cơ",
    s28g: 1,
    ga: [
      "Khởi tạo trăm việc đều tốt, tốt nhất là chôn cất, tu bổ mồ mả, trổ cửa, khai trương, xuất hành, các việc thủy lợi.",
    ],
    ba: ["Đóng giường, lót giường, đi thuyền."],
  },
  斗: {
    name: "Đẩu",
    s28g: 1,
    ga: [
      "Khởi tạo trăm việc đều tốt, tốt nhất là xây đắp hay sửa chữa phần mộ, trổ cửa, tháo nước, các việc thủy lợi, may áo, kinh doanh, giao dịch, mưu cầu công danh.",
    ],
    ba: ["Rất kỵ đi thuyền."],
  },
  牛: {
    name: "Ngưu",
    s28g: 0,
    ga: ["Đi thuyền, may áo."],
    ba: [
      "Khởi công tạo tác việc gì cũng hung hại, nhất là xây cất nhà, dựng trại, cưới gả, trổ cửa, làm thủy lợi, khai trương, xuất hành đường bộ.",
    ],
  },
  女: {
    name: "Nữ",
    s28g: 0,
    ga: ["Kết màn, may áo."],
    ba: [
      "Khởi công tạo tác trăm việc đều có hại, xấu nhất là trổ cửa, khơi đường tháo nước, chôn cất, đầu đơn kiện cáo.",
    ],
  },
  虚: {
    name: "Hư",
    s28g: 0,
    ga: ["Sao Hư có nghĩa là hư hoại, không có việc gì hợp với ngày có Sao Hư."],
    ba: [
      "Khởi công tạo tác trăm việc đều không may, nhất là xây cất nhà cửa, cưới gả, khai trương, trổ cửa, tháo nước, đào kênh rạch.",
    ],
  },
  危: {
    name: "Nguy",
    s28g: 0,
    ga: ["Chôn cất rất tốt, lót giường bình yên."],
    ba: ["Dựng nhà, trổ cửa, tháo nước, đào mương rạch, đi thuyền."],
  },
  室: {
    name: "Thất",
    s28g: 1,
    ga: [
      "Khởi công trăm việc đều tốt. Tốt nhất là xây cất nhà cửa, cưới gả, chôn cất, trổ cửa, tháo nước, các việc thủy lợi, đi thuyền.",
    ],
    ba: ["Sao Thất đại kiết không có việc gì phải kiêng cữ."],
  },
  壁: {
    name: "Bích",
    s28g: 1,
    ga: [
      "Khởi công tạo tác việc gì cũng tốt. Tốt nhất là xây cất nhà, cưới gả, chôn cất, trổ cửa, dựng cửa, tháo nước, các vụ thuỷ lợi, khai trương, xuất hành.",
    ],
    ba: ["Sao Bích toàn kiết, không có việc gì phải kiêng cữ."],
  },
  奎: {
    name: "Khuê",
    s28g: 0,
    ga: ["Tạo dựng nhà phòng, nhập học, ra đi cầu công danh, cắt áo."],
    ba: [
      "Chôn cất, khai trương, trổ cửa dựng cửa, khai thông đường nước, đào ao móc giếng, thưa kiện, đóng giường lót giường.",
    ],
  },
  娄: {
    name: "Lâu",
    s28g: 1,
    ga: [
      "Khởi công mọi việc đều tốt. Tốt nhất là dựng cột, cất lầu, làm dàn gác, cưới gả, trổ cửa, dựng cửa, tháo nước hay các việc liên quan đến thủy lợi, cắt áo.",
    ],
    ba: ["Đóng giường, lót giường, đi đường thủy."],
  },
  胃: {
    name: "Vị",
    s28g: 1,
    ga: [
      "Khởi công tạo tác việc gì cũng lợi. Tốt nhất là xây cất, cưới gả, chôn cất, dọn cỏ phá đất, gieo trồng, lấy giống.",
    ],
    ba: ["Đi thuyền."],
  },
  昴: {
    name: "Mão",
    s28g: 0,
    ga: ["Xây dựng, tạo tác."],
    ba: [
      "Chôn cất (đại kỵ), cưới gả, trổ cửa dựng cửa, khai ngòi phóng thủy, khai trương, xuất hành, đóng giường lót giường.",
    ],
  },
  毕: {
    name: "Tất",
    s28g: 1,
    ga: [
      "Khởi công tạo tác việc gì cũng tốt. Tốt nhất là chôn cất, cưới gả, trổ cửa dựng cửa, đào kênh, tháo nước, khai trương, xuất hành, nhập học.",
    ],
    ba: ["Đi thuyền."],
  },
  觜: {
    name: "Chủy",
    s28g: 0,
    ga: ["Không có sự việc gì hợp với Sao Chủy."],
    ba: [
      "Khởi công tạo tác việc gì cũng không tốt. Kỵ nhất là chôn cất, sửa đắp mồ mả, đóng thọ đường.",
    ],
  },
  参: {
    name: "Sâm",
    s28g: 0,
    ga: [
      "Khởi công tạo tác nhiều việc tốt như: xây cất nhà, dựng cửa trổ cửa, nhập học, đi thuyền, làm thủy lợi, tháo nước đào mương.",
    ],
    ba: ["Cưới gả, chôn cất, đóng giường lót giường, kết bạn."],
  },
  井: {
    name: "Tỉnh",
    s28g: 1,
    ga: [
      "Tạo tác nhiều việc tốt như xây cất, trổ cửa dựng cửa, mở thông đường nước, đào mương móc giếng, nhậm chức, nhập học, đi thuyền.",
    ],
    ba: ["Chôn cất, tu bổ phần mộ, đóng thọ đường."],
  },
  鬼: {
    name: "Quỷ",
    s28g: 0,
    ga: ["Chôn cất, cắt áo."],
    ba: [
      "Khởi tạo việc gì cũng xấu, nhất là xây cất nhà, cưới gả, trổ cửa dựng cửa, tháo nước, đào ao giếng, động đất, xây tường, dựng cột.",
    ],
  },
  柳: {
    name: "Liễu",
    s28g: 0,
    ga: ["Không có việc gì hợp với Sao Liễu."],
    ba: [
      "Khởi công tạo tác việc gì cũng hung hại. Nhất là chôn cất, xây đắp, trổ cửa dựng cửa, tháo nước, đào ao lũy, làm thủy lợi.",
    ],
  },
  星: {
    name: "Tinh",
    s28g: 0,
    ga: ["Xây dựng phòng mới, tạo tác việc nhỏ, xây bếp, kê gác, lót giường."],
    ba: ["Chôn cất, cưới gả, mở thông đường nước."],
  },
  张: {
    name: "Trương",
    s28g: 1,
    ga: [
      "Khởi công tạo tác trăm việc đều tốt, tốt nhất là xây cất nhà, che mái dựng hiên, trổ cửa dựng cửa, cưới gả, chôn cất, làm ruộng, nuôi tằm, cắt áo, làm thuỷ lợi.",
    ],
    ba: ["Sửa hoặc làm thuyền chèo, đẩy thuyền mới xuống nước."],
  },
  翼: {
    name: "Dực",
    s28g: 0,
    ga: ["Cắt áo sẽ được tiền tài."],
    ba: ["Chôn cất, cưới gả, xây cất nhà, trổ cửa gắn cửa, các việc thủy lợi."],
  },
  轸: {
    name: "Chẩn",
    s28g: 1,
    ga: [
      "Khởi công tạo tác mọi việc đều tốt lành, tốt nhất là xây cất lầu gác, chôn cất, cưới gả. Các việc khác cũng tốt như dựng phòng, cất trại, xuất hành.",
    ],
    ba: ["Đi thuyền."],
  },
};

function mapGanZhi(gz: string): { can: string; chi: string; full: string } {
  const can = GAN_MAP[gz.charAt(0)] || gz.charAt(0);
  const chi = ZHI_MAP[gz.charAt(1)] || gz.charAt(1);
  return { can, chi, full: `${can} ${chi}` };
}

/**
 * Tính Can Chi của Tháng Âm Lịch theo phép Ngũ Hổ Độn chuẩn Lịch Vạn Niên Việt Nam
 */
export function getLunarMonthGanZhi(yearCan: string, lunarMonth: number): string {
  const chi = DIA_CHI[(lunarMonth + 1) % 12];
  const yearCanIdx = THIEN_CAN.indexOf(yearCan as (typeof THIEN_CAN)[number]);
  const startCanIdx = yearCanIdx !== -1 ? ((yearCanIdx % 5) * 2 + 2) % 10 : 0;
  const can = THIEN_CAN[(startCanIdx + (lunarMonth - 1)) % 10];
  return `${can} ${chi}`;
}

/**
 * Tính toán tuổi xung khắc theo Can Chi của ngày (Lục Xung + Thiên Can khắc)
 */
export function getConflictingAges(dayCan: string, dayChi: string): string[] {
  const chiIndex = DIA_CHI.indexOf(dayChi as (typeof DIA_CHI)[number]);
  if (chiIndex === -1) return [];
  const clashChi = DIA_CHI[(chiIndex + 6) % 12];
  const canIdx = THIEN_CAN.indexOf(dayCan as (typeof THIEN_CAN)[number]);
  if (canIdx === -1) return [];

  const clashCan1 = THIEN_CAN[(canIdx + 4) % 10];
  const clashCan2 = THIEN_CAN[(canIdx + 6) % 10];
  const clashCan3 = THIEN_CAN[(canIdx + 2) % 10];
  return Array.from(
    new Set([
      `${clashCan1} ${clashChi}`,
      `${clashCan2} ${clashChi}`,
      `${clashCan3} ${clashChi}`,
    ])
  );
}

interface ExtendedLunar {
  getMonth(): number;
  getDay(): number;
  getYear(): number;
  getDayInGanZhi(): string;
  getMonthInGanZhi(): string;
  getYearInGanZhi(): string;
  getXiu(): string;
  getZhiXing(): string;
  getJieQi(): string;
  getPrevJieQi(): { getName(): string } | null;
}

/**
 * UniversalDayCalculator
 * Tính toán đầy đủ Âm lịch, Can Chi, Nhị Thập Bát Tú, Thập Nhị Trực,
 * 12 Thần Hoàng Đạo/Hắc Đạo, Cát Tinh/Hung Tinh Ngọc Hạp Thông Thư,
 * Giờ Hoàng Đạo, Hướng Xuất Hành và Việc Nên Làm / Kiêng Kỵ cho MỌI NGÀY (1900 - 2100).
 */
export class UniversalDayCalculator {
  static calculate(date: Date): DayFengShuiData {
    const solar = Solar.fromYmdHms(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      12,
      0,
      0
    );
    const lunar = solar.getLunar() as unknown as ExtendedLunar;

    const rawMonth = lunar.getMonth();
    const isLeap = rawMonth < 0 ? 1 : 0;
    const lunarMonth = Math.abs(rawMonth);
    const lunarDay = lunar.getDay();
    const lunarYear = lunar.getYear();

    const dayGZ = mapGanZhi(lunar.getDayInGanZhi());
    const yearGZ = mapGanZhi(lunar.getYearInGanZhi());
    const monthGZFull = getLunarMonthGanZhi(yearGZ.can, lunarMonth);

    const nguHanh = CAN_NGU_HANH[dayGZ.can] || "Thổ";

    const xiuRaw = lunar.getXiu();
    const xiuInfo = XIU_28_SAO_MAP[xiuRaw] || XIU_28_SAO_MAP["角"];

    const zhiXingRaw = lunar.getZhiXing();
    const trucName = ZHI_XING_12_TRUC_MAP[zhiXingRaw] || "Khai";
    const trucDetail = TRUC_12_INFO[trucName] || TRUC_12_INFO["Khai"];

    // Hoàng Đạo / Hắc Đạo chuẩn 12 Thần theo Tháng Âm Lịch & Địa Chi Ngày
    const hoangDaoChis = HOANG_DAO_DAY_CHIS_BY_LUNAR_MONTH[lunarMonth] || [];
    const isHoangDao: 0 | 1 = hoangDaoChis.includes(dayGZ.chi) ? 1 : 0;

    const currentJieQiRaw =
      lunar.getJieQi() || lunar.getPrevJieQi()?.getName() || "";
    const tietKhi = JIE_QI_MAP[currentJieQiRaw] || "Lập xuân";

    const hoangDaoHours = HOANG_DAO_HOURS_BY_DAY_CHI[dayGZ.chi] || [
      "Tý",
      "Sửu",
      "Mão",
      "Ngọ",
      "Thân",
      "Dậu",
    ];

    const directions: Direction[] = [
      { n: "Hỷ thần", d: HY_THAN_BY_CAN[dayGZ.can] || "Đông Bắc", r: 5 },
      { n: "Tài thần", d: TAI_THAN_BY_CAN[dayGZ.can] || "Đông Nam", r: 5 },
    ];
    const hacThanDir = HAC_THAN_BY_DGZ[dayGZ.full];
    if (hacThanDir) {
      directions.push({ n: "Hắc thần", d: hacThanDir, r: 1 });
    }

    const { gs, bs, daiKy } = getNgocHapStars(
      lunarMonth,
      lunarDay,
      dayGZ.can,
      dayGZ.chi,
      dayGZ.full
    );

    const ga = [...xiuInfo.ga, trucDetail.ga];
    const ba = [...daiKy, ...xiuInfo.ba, trucDetail.ba];

    const dayData: DayFengShuiData = {
      d: format(date, "yyyy-MM-dd"),
      ld: lunarDay,
      lm: lunarMonth,
      ly: lunarYear,
      lp: isLeap,
      dgz: dayGZ.full,
      mgz: monthGZFull,
      ygz: yearGZ.full,
      nh: nguHanh,
      s28: xiuInfo.name,
      s28g: xiuInfo.s28g,
      t12: trucName,
      t12g: isHoangDao,
      tk: tietKhi,
      hd: hoangDaoHours,
      dir: directions,
      ga,
      ba,
      gs,
      bs,
      age: getConflictingAges(dayGZ.can, dayGZ.chi),
      sc: null,
    };

    dayData.score = DayScore.calculate(dayData).score;
    return dayData;
  }
}
