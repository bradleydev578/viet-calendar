// Mock react-native modules
jest.mock('react-native', () => ({
  NativeModules: {
    LichVietWidgetBridge: {
      setCalendarData: jest.fn(),
      clearCalendarData: jest.fn(),
    },
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  AppState: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    currentState: 'active',
  },
}));
