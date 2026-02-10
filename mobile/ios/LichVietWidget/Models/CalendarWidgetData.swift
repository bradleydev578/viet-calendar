import Foundation

struct CalendarWidgetData: Codable {
    let currentMonth: Int
    let currentYear: Int
    let lunarMonth: Int
    let lunarYear: Int
    let monthName: String
    let lunarMonthName: String
    let days: [CalendarDay]
}
