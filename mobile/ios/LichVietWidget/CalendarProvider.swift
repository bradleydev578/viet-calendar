import WidgetKit
import SwiftUI

struct CalendarEntry: TimelineEntry {
    let date: Date
    let widgetData: CalendarWidgetData?
}

struct CalendarProvider: TimelineProvider {
    func placeholder(in context: Context) -> CalendarEntry {
        CalendarEntry(date: Date(), widgetData: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (CalendarEntry) -> Void) {
        let data = SharedDataManager.shared.loadCalendarData()
        let entry = CalendarEntry(date: Date(), widgetData: data)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CalendarEntry>) -> Void) {
        let data = SharedDataManager.shared.loadCalendarData()
        let currentDate = Date()
        let entry = CalendarEntry(date: currentDate, widgetData: data)

        // Refresh at midnight
        let calendar = Calendar.current
        let tomorrow = calendar.startOfDay(for: calendar.date(byAdding: .day, value: 1, to: currentDate)!)
        let refreshDate = calendar.date(byAdding: .second, value: 1, to: tomorrow)!

        let timeline = Timeline(entries: [entry], policy: .after(refreshDate))
        completion(timeline)
    }
}
