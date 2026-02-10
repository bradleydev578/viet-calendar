//
//  LichVietWidgetBridge.swift
//  LichVietTemp
//
//  React Native Native Module for Widget Data Sharing
//  This bridge allows the React Native app to send calendar data to the iOS widget
//

import Foundation
import WidgetKit

@objc(LichVietWidgetBridge)
class LichVietWidgetBridge: NSObject {

    private let appGroupId = "group.vn.bradley.vietcalendar.shared"
    private let calendarDataKey = "calendarData"

    /// Set calendar data from React Native
    /// This data will be read by the widget extension
    @objc
    func setCalendarData(_ jsonString: String) {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
            print("LichVietWidgetBridge: Failed to access App Groups - check entitlements")
            return
        }

        // Save JSON string to shared UserDefaults
        sharedDefaults.set(jsonString, forKey: calendarDataKey)
        sharedDefaults.synchronize()

        print("LichVietWidgetBridge: Calendar data saved to App Groups")

        // Reload widget timeline to show updated data
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "CalendarWidget")
            print("LichVietWidgetBridge: Widget timeline reload triggered")
        }
    }

    /// Clear calendar data from shared storage
    @objc
    func clearCalendarData() {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
            return
        }

        sharedDefaults.removeObject(forKey: calendarDataKey)
        sharedDefaults.synchronize()

        print("LichVietWidgetBridge: Calendar data cleared")

        // Reload widget to show placeholder
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "CalendarWidget")
        }
    }

    /// Required by React Native - indicates this module doesn't need main queue setup
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
