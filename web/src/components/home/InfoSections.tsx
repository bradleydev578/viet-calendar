"use client";

import { useState } from "react";
import type { MonthTheme } from "@/lib/theme";

interface InfoSectionsProps {
  theme: MonthTheme;
}

interface InfoItem {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  iconColor: string;
  content: {
    heading: string;
    text: string;
    list?: string[];
  }[];
  source: string;
}

const INFO_DATA: InfoItem[] = [
  {
    id: "28sao",
    title: "28 Sao (Nhị Thập Bát Tú)",
    shortDesc: "28 chòm sao trong phong thủy",
    icon: "star",
    iconColor: "#FFD700",
    content: [
      {
        heading: "Nhị Thập Bát Tú là gì?",
        text: "Nhị Thập Bát Tú là 28 chòm sao nằm gần hoàng đạo và xích đạo thiên cầu, được người xưa sử dụng để đo đạc vị trí các thiên thể và chọn ngày tốt xấu.",
      },
      {
        heading: "Phân chia theo Tứ Tượng",
        text: "28 sao được chia thành 4 nhóm, mỗi nhóm 7 sao tương ứng với 4 phương và 4 linh thú:",
        list: [
          "Phương Đông - Thanh Long: Giác, Cang, Đê, Phòng, Tâm, Vĩ, Cơ",
          "Phương Bắc - Huyền Vũ: Đẩu, Ngưu, Nữ, Hư, Nguy, Thất, Bích",
          "Phương Tây - Bạch Hổ: Khuê, Lâu, Vị, Mão, Tất, Chuỷ, Sâm",
          "Phương Nam - Chu Tước: Tỉnh, Quỷ, Liễu, Tinh, Trương, Dực, Chẩn",
        ],
      },
      {
        heading: "Ý nghĩa trong xem ngày",
        text: "Mỗi sao mang ý nghĩa tốt hoặc xấu khác nhau:",
        list: [
          "Sao tốt (Cát): Giác, Phòng, Vĩ, Cơ, Đẩu, Thất, Khuê, Tất, Sâm, Tỉnh, Trương, Chẩn",
          "Sao xấu (Hung): Ngưu, Hư, Nguy, Chuỷ, Quỷ - nên tránh các việc quan trọng",
        ],
      },
    ],
    source: "Wikipedia, Lịch Sử Việt Nam",
  },
  {
    id: "12truc",
    title: "12 Trực (Kiến Trừ)",
    shortDesc: "12 vị trí của ngày",
    icon: "calendar_view_day",
    iconColor: "#FF9800",
    content: [
      {
        heading: "12 Trực là gì?",
        text: "12 Trực (Kiến Trừ Thập Nhị Trực) là phương pháp xem ngày cổ truyền, chia các ngày trong tháng âm lịch thành 12 loại, mỗi loại mang ý nghĩa tốt xấu khác nhau.",
      },
      {
        heading: "Các Trực Tốt",
        text: "8 trực được coi là tốt cho các công việc:",
        list: [
          "Kiến - Khởi đầu, xây dựng",
          "Trừ - Loại bỏ, dọn dẹp",
          "Mãn - Đầy đủ, viên mãn",
          "Bình - Bình an, ổn định",
          "Định - Quyết định, an cư",
          "Chấp - Nắm giữ, thu hoạch",
          "Thành - Thành công, hoàn tất",
          "Khai - Khai trương, mở mang",
        ],
      },
      {
        heading: "Các Trực Xấu",
        text: "4 trực nên tránh làm việc quan trọng:",
        list: [
          "Phá - Phá hoại, tan vỡ",
          "Nguy - Nguy hiểm, bất ổn",
          "Bế - Đóng lại, trì trệ",
          "Thu - Thu hẹp, hạn chế",
        ],
      },
    ],
    source: "Phong Thủy Thăng Long",
  },
  {
    id: "hoangdaogio",
    title: "Giờ Hoàng Đạo",
    shortDesc: "Các giờ tốt trong ngày",
    icon: "schedule",
    iconColor: "#9C27B0",
    content: [
      {
        heading: "Giờ Hoàng Đạo là gì?",
        text: "Giờ Hoàng Đạo là những khoảng thời gian tốt lành trong ngày theo phong thủy cổ truyền. Mỗi ngày có 6 giờ Hoàng Đạo (tốt) và 6 giờ Hắc Đạo (xấu).",
      },
      {
        heading: "12 Giờ trong ngày",
        text: "Một ngày đêm âm lịch được chia thành 12 giờ, mỗi giờ bằng 2 tiếng:",
        list: [
          "Tý (23:00-01:00) • Sửu (01:00-03:00) • Dần (03:00-05:00)",
          "Mão (05:00-07:00) • Thìn (07:00-09:00) • Tị (09:00-11:00)",
          "Ngọ (11:00-13:00) • Mùi (13:00-15:00) • Thân (15:00-17:00)",
          "Dậu (17:00-19:00) • Tuất (19:00-21:00) • Hợi (21:00-23:00)",
        ],
      },
      {
        heading: "Ứng dụng",
        text: "Người Việt thường chọn giờ Hoàng Đạo cho:",
        list: [
          "Cưới hỏi, đón dâu",
          "Khai trương, ký kết hợp đồng",
          "Khởi công xây dựng, động thổ",
          "Nhập trạch, xuất hành",
        ],
      },
    ],
    source: "Đổng Công Tuyển Nhật",
  },
];

export function InfoSections({ theme }: InfoSectionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">
        Thông tin hữu ích
      </h3>
      
      {INFO_DATA.map((item) => (
        <div
          key={item.id}
          className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 overflow-hidden transition-all"
        >
          {/* Header - clickable */}
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/40 transition-colors"
          >
            <div
              className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${item.iconColor}20` }}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ color: item.iconColor }}
              >
                {item.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.shortDesc}</p>
            </div>
            <span
              className={`material-symbols-outlined text-slate-400 transition-transform ${
                expandedId === item.id ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Expanded content */}
          {expandedId === item.id && (
            <div className="px-4 pb-4 pt-0 border-t border-slate-100">
              <div className="space-y-4 mt-4">
                {item.content.map((section, idx) => (
                  <div key={idx}>
                    <h5
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: theme.primaryAccent }}
                    >
                      {section.heading}
                    </h5>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {section.text}
                    </p>
                    {section.list && (
                      <ul className="mt-2 space-y-1">
                        {section.list.map((listItem, listIdx) => (
                          <li
                            key={listIdx}
                            className="text-sm text-slate-600 flex items-start gap-2"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: item.iconColor }}
                            />
                            {listItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Source */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400">
                  Nguồn: {item.source}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
