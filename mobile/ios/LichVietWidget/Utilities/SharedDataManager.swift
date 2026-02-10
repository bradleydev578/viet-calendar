import Foundation

class SharedDataManager {
    static let shared = SharedDataManager()

    private let appGroupId = "group.vn.bradley.vietcalendar.shared"
    private let calendarDataKey = "calendarData"

    private init() {}

    func loadCalendarData() -> CalendarWidgetData? {
        guard let userDefaults = UserDefaults(suiteName: appGroupId) else {
            return nil
        }

        guard let jsonString = userDefaults.string(forKey: calendarDataKey),
              let jsonData = jsonString.data(using: .utf8) else {
            return nil
        }

        do {
            let decoder = JSONDecoder()
            return try decoder.decode(CalendarWidgetData.self, from: jsonData)
        } catch {
            print("[Widget] Failed to decode calendar data: \(error)")
            return nil
        }
    }
}
