import SwiftUI

struct DayCellView: View {
    let day: CalendarDay
    let theme: MonthTheme

    var body: some View {
        VStack(spacing: 0) {
            // Solar day (main)
            Text("\(day.solar)")
                .font(.system(size: 12, weight: day.isToday ? .bold : .regular))
                .foregroundColor(solarColor)

            // Lunar day (secondary)
            Text("\(day.lunar)")
                .font(.system(size: 7))
                .foregroundColor(lunarColor)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(day.isToday ? theme.todayCellBg.opacity(0.15) : Color.clear)
        .cornerRadius(4)
    }

    private var solarColor: Color {
        if day.isToday {
            return theme.todayCellBg
        }
        if !day.isCurrentMonth {
            return Color(hex: "9CA3AF") // Gray for non-current month
        }
        // Sunday (dayOfWeek = 0)
        if day.dayOfWeek == 0 {
            return theme.primaryAccent
        }
        return Color(hex: "1F2937") // Dark gray for normal days
    }

    private var lunarColor: Color {
        if day.isToday {
            return theme.todayCellBg.opacity(0.8)
        }
        if !day.isCurrentMonth {
            return Color(hex: "D1D5DB") // Light gray for non-current month
        }
        return Color(hex: "6B7280") // Medium gray for lunar dates
    }
}
