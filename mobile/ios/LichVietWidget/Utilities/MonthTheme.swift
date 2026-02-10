import SwiftUI

struct MonthTheme {
    let name: String
    let background: Color
    let blurCircle1: Color
    let blurCircle2: Color
    let primaryAccent: Color
    let todayCellBg: Color
}

// 12 Monthly Themes inspired by Vietnamese seasons and celebrations
let MONTH_THEMES: [Int: MonthTheme] = [
    // Tháng 1 - Tết Nguyên Đán (Red & Gold)
    1: MonthTheme(
        name: "Tết Nguyên Đán",
        background: Color(hex: "FEF2F2"),
        blurCircle1: Color(hex: "DC2626").opacity(0.15),
        blurCircle2: Color(hex: "F59E0B").opacity(0.12),
        primaryAccent: Color(hex: "DC2626"),
        todayCellBg: Color(hex: "DC2626")
    ),

    // Tháng 2 - Xuân về (Pink Cherry Blossom)
    2: MonthTheme(
        name: "Xuân Về",
        background: Color(hex: "FDF2F8"),
        blurCircle1: Color(hex: "EC4899").opacity(0.15),
        blurCircle2: Color(hex: "F472B6").opacity(0.1),
        primaryAccent: Color(hex: "DB2777"),
        todayCellBg: Color(hex: "DB2777")
    ),

    // Tháng 3 - Mùa xuân (Fresh Green)
    3: MonthTheme(
        name: "Mùa Xuân",
        background: Color(hex: "F0FDF4"),
        blurCircle1: Color(hex: "22C55E").opacity(0.15),
        blurCircle2: Color(hex: "4ADE80").opacity(0.1),
        primaryAccent: Color(hex: "16A34A"),
        todayCellBg: Color(hex: "16A34A")
    ),

    // Tháng 4 - Hoa nở (Lavender Purple)
    4: MonthTheme(
        name: "Hoa Nở",
        background: Color(hex: "FAF5FF"),
        blurCircle1: Color(hex: "A855F7").opacity(0.12),
        blurCircle2: Color(hex: "C084FC").opacity(0.1),
        primaryAccent: Color(hex: "9333EA"),
        todayCellBg: Color(hex: "9333EA")
    ),

    // Tháng 5 - Đoan Ngọ (Warm Orange)
    5: MonthTheme(
        name: "Đoan Ngọ",
        background: Color(hex: "FFF7ED"),
        blurCircle1: Color(hex: "F97316").opacity(0.15),
        blurCircle2: Color(hex: "FB923C").opacity(0.1),
        primaryAccent: Color(hex: "EA580C"),
        todayCellBg: Color(hex: "EA580C")
    ),

    // Tháng 6 - Hè sang (Sky Blue)
    6: MonthTheme(
        name: "Hè Sang",
        background: Color(hex: "F0F9FF"),
        blurCircle1: Color(hex: "0EA5E9").opacity(0.15),
        blurCircle2: Color(hex: "38BDF8").opacity(0.1),
        primaryAccent: Color(hex: "0284C7"),
        todayCellBg: Color(hex: "0284C7")
    ),

    // Tháng 7 - Vu Lan (Indigo/Violet)
    7: MonthTheme(
        name: "Vu Lan",
        background: Color(hex: "EEF2FF"),
        blurCircle1: Color(hex: "6366F1").opacity(0.15),
        blurCircle2: Color(hex: "818CF8").opacity(0.1),
        primaryAccent: Color(hex: "4F46E5"),
        todayCellBg: Color(hex: "4F46E5")
    ),

    // Tháng 8 - Trung Thu (Gold/Yellow Moon)
    8: MonthTheme(
        name: "Trung Thu",
        background: Color(hex: "FEFCE8"),
        blurCircle1: Color(hex: "EAB308").opacity(0.18),
        blurCircle2: Color(hex: "FACC15").opacity(0.12),
        primaryAccent: Color(hex: "CA8A04"),
        todayCellBg: Color(hex: "CA8A04")
    ),

    // Tháng 9 - Thu sang (Amber/Orange Autumn)
    9: MonthTheme(
        name: "Thu Sang",
        background: Color(hex: "FFFBEB"),
        blurCircle1: Color(hex: "F59E0B").opacity(0.15),
        blurCircle2: Color(hex: "FBBF24").opacity(0.1),
        primaryAccent: Color(hex: "D97706"),
        todayCellBg: Color(hex: "D97706")
    ),

    // Tháng 10 - Cuối thu (Teal/Cyan)
    10: MonthTheme(
        name: "Cuối Thu",
        background: Color(hex: "F0FDFA"),
        blurCircle1: Color(hex: "14B8A6").opacity(0.15),
        blurCircle2: Color(hex: "2DD4BF").opacity(0.1),
        primaryAccent: Color(hex: "0D9488"),
        todayCellBg: Color(hex: "0D9488")
    ),

    // Tháng 11 - Đông về (Cool Slate/Gray Blue)
    11: MonthTheme(
        name: "Đông Về",
        background: Color(hex: "F8FAFC"),
        blurCircle1: Color(hex: "64748B").opacity(0.12),
        blurCircle2: Color(hex: "94A3B8").opacity(0.1),
        primaryAccent: Color(hex: "475569"),
        todayCellBg: Color(hex: "475569")
    ),

    // Tháng 12 - Giáng sinh & Năm mới (Emerald Green)
    12: MonthTheme(
        name: "Giáng Sinh",
        background: Color(hex: "F0FDF4"),
        blurCircle1: Color(hex: "059669").opacity(0.2),
        blurCircle2: Color(hex: "F59E0B").opacity(0.1),
        primaryAccent: Color(hex: "059669"),
        todayCellBg: Color(hex: "059669")
    ),
]

func getMonthTheme(month: Int) -> MonthTheme {
    let normalizedMonth = ((month - 1) % 12) + 1
    return MONTH_THEMES[normalizedMonth] ?? MONTH_THEMES[12]!
}

// Color extension to support hex colors
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
