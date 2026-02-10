//
//  LichVietWidget.swift
//  LichVietWidget
//
//  Created by Bradley Nguyen on 7/2/26.
//

import WidgetKit
import SwiftUI

@main
struct LichVietWidgetBundle: WidgetBundle {
    var body: some Widget {
        CalendarWidget()
    }
}

struct CalendarWidget: Widget {
    let kind: String = "CalendarWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CalendarProvider()) { entry in
            CalendarWidgetView(entry: entry)
        }
        .configurationDisplayName("Lịch Việt")
        .description("Xem lịch âm dương nhanh")
        .supportedFamilies([.systemMedium])
    }
}
