import Foundation

struct CalendarDay: Codable, Identifiable {
    let solar: Int
    let lunar: Int
    let lunarMonth: Int
    let dayOfWeek: Int
    let isCurrentMonth: Bool
    let isToday: Bool

    var id: String {
        "\(solar)-\(lunarMonth)-\(isCurrentMonth)"
    }
}
