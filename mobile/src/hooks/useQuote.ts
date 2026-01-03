import { useMemo } from 'react';
import quotesData from '../data/motivational_quotes.json';

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
 * Get a random quote from the collection
 * Uses date-based seeding for consistent quote per day
 */
export function useQuote(date?: Date): Quote {
  const quote = useMemo(() => {
    const targetDate = date || new Date();
    // Create a seed based on date (year * 1000 + dayOfYear)
    const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
    const diff = targetDate.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const seed = targetDate.getFullYear() * 1000 + dayOfYear;

    // Use modulo to get index, ensuring same quote for same day
    const index = seed % data.quotes.length;
    return data.quotes[index];
  }, [date]);

  return quote;
}

/**
 * Get a truly random quote (different each render)
 */
export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * data.quotes.length);
  return data.quotes[index];
}

/**
 * Get quote by specific ID
 */
export function getQuoteById(id: number): Quote | undefined {
  return data.quotes.find(q => q.id === id);
}

/**
 * Get total number of quotes
 */
export function getTotalQuotes(): number {
  return data.quotes.length;
}
