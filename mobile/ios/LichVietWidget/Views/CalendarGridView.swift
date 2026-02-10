import SwiftUI

struct CalendarGridView: View {
    let days: [CalendarDay]
    let theme: MonthTheme

    // 5 rows x 7 columns = 35 days
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 0), count: 7)

    var body: some View {
        // Only show first 35 days (5 weeks)
        let displayDays = Array(days.prefix(35))

        LazyVGrid(columns: columns, spacing: 2) {
            ForEach(displayDays) { day in
                DayCellView(day: day, theme: theme)
            }
        }
    }
}
