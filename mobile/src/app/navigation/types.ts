import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Tab Navigator param list
export type TabParamList = {
  CalendarTab: undefined;
  CompassTab: undefined;
  HolidaysTab: undefined;
  SettingsTab: undefined;
};

// Stack Navigator param lists for each tab
export type CalendarStackParamList = {
  Calendar: undefined;
  DayDetail: { date: string };
};

export type CompassStackParamList = {
  Compass: undefined;
};

export type HolidaysStackParamList = {
  Holidays: undefined;
  HolidayDetail: { holidayId: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
  About: undefined;
  Notifications: undefined;
};

// Root Navigator param list
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  DayDetailModal: { date: string };
};

// Screen props types
export type CalendarScreenProps = NativeStackScreenProps<CalendarStackParamList, 'Calendar'>;
export type DayDetailScreenProps = NativeStackScreenProps<CalendarStackParamList, 'DayDetail'>;
export type DayDetailModalScreenProps = NativeStackScreenProps<RootStackParamList, 'DayDetailModal'>;
export type HolidaysScreenProps = NativeStackScreenProps<HolidaysStackParamList, 'Holidays'>;
export type SettingsScreenProps = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

// Composite screen props for tab screens
export type CalendarTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'CalendarTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

// Navigation hook helper type
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
