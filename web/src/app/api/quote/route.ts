/**
 * API Route: /api/quote
 * Returns the quote of the day based on date
 *
 * Query params:
 * - date: YYYY-MM-DD format (optional, defaults to today)
 *
 * Response: { id: number, text: string } | { error: string }
 */

import { NextRequest, NextResponse } from 'next/server';

// Server-side only import - this will NOT be bundled to client
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

// Cache headers for CDN caching (1 hour, stale-while-revalidate for 24 hours)
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

/**
 * Get quote for a specific day (deterministic based on date)
 */
function getQuoteOfTheDay(date: Date): Quote {
  // Create a deterministic index based on date
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % data.quotes.length;
  return data.quotes[index];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');

  let date: Date;

  if (dateParam) {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return NextResponse.json(
        { error: 'Invalid date format. Expected: YYYY-MM-DD' },
        { status: 400 }
      );
    }
    date = new Date(dateParam);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date' },
        { status: 400 }
      );
    }
  } else {
    // Default to today
    date = new Date();
  }

  const quote = getQuoteOfTheDay(date);

  return NextResponse.json(quote, {
    headers: CACHE_HEADERS,
  });
}
