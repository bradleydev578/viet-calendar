/**
 * useFengShuiStore.ts
 * Zustand store for feng shui data state management
 */

import { create } from 'zustand';
import type { DayFengShuiData } from '../data/types/FengShuiData';
import { FengShuiRepository } from '../data/repositories/FengShuiRepository';

interface FengShuiStore {
  // State
  data: Map<string, DayFengShuiData> | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  getByDate: (date: Date) => DayFengShuiData | null;
  getByMonth: (year: number, month: number) => DayFengShuiData[];
  clearError: () => void;
}

/**
 * Zustand store for feng shui data
 * Provides centralized state management for feng shui information
 */
export const useFengShuiStore = create<FengShuiStore>((set, get) => ({
  // Initial state
  data: null,
  isLoading: false,
  error: null,

  /**
   * Load feng shui data from repository
   */
  loadData: async () => {
    // Don't reload if already loaded
    if (get().data) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await FengShuiRepository.loadData();
      set({ data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load feng shui data';
      set({ error: errorMessage, isLoading: false });
      console.error('Error loading feng shui data:', error);
    }
  },

  /**
   * Get feng shui data for a specific date
   * @param date - The date to lookup
   * @returns DayFengShuiData | null
   */
  getByDate: (date: Date) => {
    // Check if data is loaded in the store first to avoid warning
    if (!get().data) {
      return null;
    }
    return FengShuiRepository.getByDate(date);
  },

  /**
   * Get feng shui data for a specific month
   * @param year - Year (e.g., 2025)
   * @param month - Month (1-12)
   * @returns Array of DayFengShuiData
   */
  getByMonth: (year: number, month: number) => {
    // Check if data is loaded in the store first to avoid warning
    if (!get().data) {
      return [];
    }
    return FengShuiRepository.getByMonth(year, month);
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },
}));
