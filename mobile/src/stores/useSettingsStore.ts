/**
 * Settings Zustand Store
 * Manages app settings with AsyncStorage persistence
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings } from '../data/types/SettingsData';
import { DEFAULT_SETTINGS } from '../data/types/SettingsData';

const SETTINGS_STORAGE_KEY = '@lich_viet_settings';

interface SettingsStore {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  toggleLunarDates: () => Promise<void>;
  toggleHolidays: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  /**
   * Load settings from AsyncStorage
   */
  loadSettings: async () => {
    try {
      set({ isLoading: true, error: null });

      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

      if (stored) {
        const settings: AppSettings = JSON.parse(stored);
        set({ settings, isLoading: false });
      } else {
        // First time - save defaults
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
        set({ settings: DEFAULT_SETTINGS, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({
        error: 'Không thể tải cài đặt',
        isLoading: false,
        settings: DEFAULT_SETTINGS,
      });
    }
  },

  /**
   * Update settings and persist to storage
   */
  updateSettings: async (partialSettings: Partial<AppSettings>) => {
    try {
      const currentSettings = get().settings;
      const newSettings: AppSettings = {
        ...currentSettings,
        ...partialSettings,
      };

      // Save to storage
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));

      // Update state
      set({ settings: newSettings, error: null });
    } catch (error) {
      console.error('Failed to update settings:', error);
      set({ error: 'Không thể lưu cài đặt' });
    }
  },

  /**
   * Reset to default settings
   */
  resetSettings: async () => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      set({ settings: DEFAULT_SETTINGS, error: null });
    } catch (error) {
      console.error('Failed to reset settings:', error);
      set({ error: 'Không thể đặt lại cài đặt' });
    }
  },

  /**
   * Toggle show lunar dates
   */
  toggleLunarDates: async () => {
    const currentSettings = get().settings;
    await get().updateSettings({
      showLunarDates: !currentSettings.showLunarDates,
    });
  },

  /**
   * Toggle show holidays
   */
  toggleHolidays: async () => {
    const currentSettings = get().settings;
    await get().updateSettings({
      showHolidays: !currentSettings.showHolidays,
    });
  },
}));
