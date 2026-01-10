/**
 * Client-side quote fetching utilities
 * Uses API routes instead of direct JSON imports
 *
 * IMPORTANT: Use this in client components instead of QuoteRepository
 */

interface Quote {
  id: number;
  text: string;
}

/**
 * Fetch the quote of the day
 * @param date - Optional date, defaults to today
 * @returns Promise<Quote | null>
 */
export async function fetchQuoteOfTheDay(date?: Date): Promise<Quote | null> {
  try {
    let url = '/api/quote';

    if (date) {
      const dateStr = formatDate(date);
      url += `?date=${dateStr}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

/**
 * Format date to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
