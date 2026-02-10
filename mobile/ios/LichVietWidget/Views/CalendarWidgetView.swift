import SwiftUI
import WidgetKit

struct CalendarWidgetView: View {
    let entry: CalendarEntry

    var body: some View {
        if let data = entry.widgetData {
            let theme = getMonthTheme(month: data.currentMonth)

            ZStack {
                // Background with blur circles like the app
                theme.background.ignoresSafeArea()

                // Blur circle 1 (top right)
                Circle()
                    .fill(theme.blurCircle1)
                    .frame(width: 120, height: 120)
                    .blur(radius: 25)
                    .offset(x: 100, y: -40)

                // Blur circle 2 (bottom left)
                Circle()
                    .fill(theme.blurCircle2)
                    .frame(width: 100, height: 100)
                    .blur(radius: 20)
                    .offset(x: -80, y: 50)

                // Content
                VStack(spacing: 4) {
                    // Header
                    HStack {
                        Text(data.monthName)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(theme.primaryAccent)

                        Spacer()

                        Text(data.lunarMonthName)
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "6B7280")) // Medium gray
                    }
                    .padding(.horizontal, 8)

                    // Weekday headers
                    WeekdayHeaderView(accentColor: theme.primaryAccent)
                        .padding(.horizontal, 4)

                    // Calendar grid (5 rows)
                    CalendarGridView(days: data.days, theme: theme)
                        .padding(.horizontal, 4)
                }
                .padding(.vertical, 8)
            }
            .containerBackground(for: .widget) {
                theme.background
            }
        } else {
            VStack {
                Text("Mở app để cập nhật")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .containerBackground(Color(hex: "F9FAFB"), for: .widget)
        }
    }
}
