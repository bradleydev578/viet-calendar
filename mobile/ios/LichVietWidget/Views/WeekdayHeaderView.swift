import SwiftUI

struct WeekdayHeaderView: View {
    let accentColor: Color

    // Monday-first weekday headers in Vietnamese
    private let weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(0..<7, id: \.self) { index in
                Text(weekdays[index])
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(index == 6 ? accentColor : Color(hex: "4B5563")) // Dark gray for weekdays
                    .frame(maxWidth: .infinity)
            }
        }
    }
}
