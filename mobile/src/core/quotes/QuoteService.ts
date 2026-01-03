/**
 * QuoteService
 * Service for managing daily inspirational quotes
 */

import { getDailyQuote, getQuoteByIndex, getTotalQuotes } from '../../data/constants/quotes';

export class QuoteService {
  /**
   * Get the quote for a specific date
   * Quote is deterministic - same date always returns same quote
   */
  static getQuoteForDate(date: Date): string {
    return getDailyQuote(date);
  }

  /**
   * Get today's quote
   */
  static getTodayQuote(): string {
    return getDailyQuote(new Date());
  }

  /**
   * Get quote by index (0-based)
   */
  static getQuote(index: number): string {
    return getQuoteByIndex(index);
  }

  /**
   * Get total number of available quotes
   */
  static getCount(): number {
    return getTotalQuotes();
  }
}
