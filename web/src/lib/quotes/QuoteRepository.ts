/**
 * QuoteRepository.ts
 * Data access layer for motivational quotes
 */

import quotesData from '@/data/motivational_quotes.json';

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

/**
 * Repository for accessing motivational quotes
 */
export class QuoteRepository {
  /**
   * Get a random quote
   */
  static getRandomQuote(): Quote {
    const index = Math.floor(Math.random() * data.quotes.length);
    return data.quotes[index];
  }

  /**
   * Get quote by ID
   */
  static getById(id: number): Quote | null {
    return data.quotes.find((q) => q.id === id) || null;
  }

  /**
   * Get quote for a specific day (deterministic based on date)
   */
  static getQuoteOfTheDay(date: Date = new Date()): Quote {
    // Create a deterministic index based on date
    const dayOfYear = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const index = dayOfYear % data.quotes.length;
    return data.quotes[index];
  }

  /**
   * Get total number of quotes
   */
  static getTotalQuotes(): number {
    return data.quotes.length;
  }

  /**
   * Get metadata
   */
  static getMetadata() {
    return data.metadata;
  }
}
