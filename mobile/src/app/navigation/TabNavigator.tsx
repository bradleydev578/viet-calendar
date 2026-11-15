import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme';
import type { TabParamList } from './types';

// Screen imports
import { CalendarScreen } from '../../screens/CalendarScreen';
import { CompassScreen } from '../../screens/CompassScreen';
import { HolidayListScreen } from '../../screens/HolidayListScreen';
import { SettingsScreen } from '../../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, string> = {
  CalendarTab: 'calendar-month',
  CompassTab: 'compass',
  HolidaysTab: 'calendar-star',
  SettingsTab: 'cog',
};

const TAB_LABELS: Record<string, string> = {
  CalendarTab: 'Lịch',
  CompassTab: 'La Bàn',
  HolidaysTab: 'Ngày lễ',
  SettingsTab: 'Cài đặt',
};

// Custom tab bar using Pressable to ensure reliable touch handling on Android tablets.
// The default tab bar can have touch interception issues when react-native-gesture-handler
// or react-native-screens intercepts events on large-screen Android devices.
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 600;
  const tabletExtraPadding = Platform.OS === 'android' && isTablet ? 16 : 0;
  const bottomPadding = Math.max(insets.bottom, 8) + tabletExtraPadding;

  return (
    <View
      style={[
        tabBarStyles.container,
        { paddingBottom: bottomPadding },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = TAB_ICONS[route.name] || 'help-circle';
        const label = TAB_LABELS[route.name] || route.name;
        const tintColor = isFocused ? colors.primary[600] : colors.neutral[500];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={`${label} tab`}
            onPress={onPress}
            onLongPress={onLongPress}
            style={tabBarStyles.tab}
          >
            <Icon name={iconName} size={24} color={tintColor} />
            <Text style={[tabBarStyles.label, { color: tintColor }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const tabBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[0],
    borderTopColor: colors.neutral[200],
    borderTopWidth: 1,
    paddingTop: 8,
    // On Android, use elevation to ensure the tab bar is above screen content
    ...(Platform.OS === 'android' ? { elevation: 8 } : {}),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});

// Tab Navigator
export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="CalendarTab" component={CalendarScreen} />
      <Tab.Screen name="CompassTab" component={CompassScreen} />
      <Tab.Screen name="HolidaysTab" component={HolidayListScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
