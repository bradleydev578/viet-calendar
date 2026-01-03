/**
 * Vietnamese Inspirational Quotes
 * 1000 quotes from motivational_quotes.json for daily rotation
 * Quotes rotate deterministically based on day of year
 */

import quotesData from '../motivational_quotes.json';

interface Quote {
  id: number;
  text: string;
}

interface QuotesData {
  metadata: {
    title: string;
    max_length: number;
    language: string;
  };
  quotes: Quote[];
}

const data = quotesData as QuotesData;

// Export quotes as string array for backward compatibility
export const VIETNAMESE_QUOTES: string[] = data.quotes.map((q) => q.text);

/**
 * Get daily quote based on date
 * Deterministic - same date always returns same quote
 */
export function getDailyQuote(date: Date): string {
  const dayOfYear = getDayOfYear(date);
  // Add year to seed for different quotes each year
  const seed = date.getFullYear() * 1000 + dayOfYear;
  const index = seed % VIETNAMESE_QUOTES.length;
  return VIETNAMESE_QUOTES[index];
}

/**
 * Get day of year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get quote by index
 */
export function getQuoteByIndex(index: number): string {
  const safeIndex = Math.abs(index) % VIETNAMESE_QUOTES.length;
  return VIETNAMESE_QUOTES[safeIndex];
}

/**
 * Get total number of quotes
 */
export function getTotalQuotes(): number {
  return VIETNAMESE_QUOTES.length;
}

/**
 * Get a random quote (different each call)
 */
export function getRandomQuote(): string {
  const index = Math.floor(Math.random() * VIETNAMESE_QUOTES.length);
  return VIETNAMESE_QUOTES[index];
}
