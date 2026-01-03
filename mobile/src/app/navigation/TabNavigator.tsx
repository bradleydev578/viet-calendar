import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../../theme';
import type {
  TabParamList,
  CalendarStackParamList,
  CompassStackParamList,
  HolidaysStackParamList,
  SettingsStackParamList,
} from './types';

// Screen imports
import { CalendarScreen } from '../../screens/CalendarScreen';
import { DayDetailScreen } from '../../screens/DayDetailScreen';
import { CompassScreen } from '../../screens/CompassScreen';
import { HolidayListScreen } from '../../screens/HolidayListScreen';
import { SettingsScreen } from '../../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();
const CompassStack = createNativeStackNavigator<CompassStackParamList>();
const HolidaysStack = createNativeStackNavigator<HolidaysStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

// Calendar Stack Navigator
function CalendarStackNavigator() {
  return (
    <CalendarStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
      <CalendarStack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </CalendarStack.Navigator>
  );
}

// Compass Stack Navigator
function CompassStackNavigator() {
  return (
    <CompassStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CompassStack.Screen name="Compass" component={CompassScreen} />
    </CompassStack.Navigator>
  );
}

// Holidays Stack Navigator
function HolidaysStackNavigator() {
  return (
    <HolidaysStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HolidaysStack.Screen name="Holidays" component={HolidayListScreen} />
    </HolidaysStack.Navigator>
  );
}

// Settings Stack Navigator
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

// Tab Navigator
export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarStyle: {
          backgroundColor: colors.neutral[0],
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStackNavigator}
        options={{
          tabBarLabel: 'Lịch',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-month" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CompassTab"
        component={CompassStackNavigator}
        options={{
          tabBarLabel: 'La Bàn',
          tabBarIcon: ({ color, size }) => (
            <Icon name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HolidaysTab"
        component={HolidaysStackNavigator}
        options={{
          tabBarLabel: 'Ngày lễ',
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-star" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
