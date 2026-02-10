//
//  LichVietWidgetBridge.m
//  LichVietTemp
//
//  Objective-C Bridge for React Native Native Module
//  Exposes Swift methods to JavaScript
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LichVietWidgetBridge, NSObject)

RCT_EXTERN_METHOD(setCalendarData:(NSString *)jsonString)
RCT_EXTERN_METHOD(clearCalendarData)

@end
