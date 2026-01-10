/**
 * API Route: /api/fengshui
 * Returns feng shui data for a single day
 *
 * Query params:
 * - date: YYYY-MM-DD format (required)
 *
 * Response: DayFengShuiData | { error: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import type { DayFengShuiData, FengShuiDataSet } from '@/lib/fengshui/types';

// Server-side only imports - these will NOT be bundled to client
import fengShuiData2025 from '@/data/fengshui_2025.json';
import fengShuiData2026 from '@/data/fengshui_2026.json';
import fengShuiData2027 from '@/data/fengshui_2027.json';

// Type assertion for imported JSON
const dataSet2025 = fengShuiData2025 as unknown as FengShuiDataSet;
const dataSet2026 = fengShuiData2026 as unknown as FengShuiDataSet;
const dataSet2027 = fengShuiData2027 as unknown as FengShuiDataSet;

// Create a Map for O(1) lookup - initialized once on server
const dataMap = new Map<string, DayFengShuiData>();

[dataSet2025, dataSet2026, dataSet2027].forEach((dataSet) => {
  dataSet.days.forEach((day) => {
    dataMap.set(day.d, day);
  });
});

// Cache headers for CDN caching (1 hour, stale-while-revalidate for 24 hours)
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');

  // Validate date parameter
  if (!date) {
    return NextResponse.json(
      { error: 'Missing required parameter: date (format: YYYY-MM-DD)' },
      { status: 400 }
    );
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Expected: YYYY-MM-DD' },
      { status: 400 }
    );
  }

  // Look up data
  const data = dataMap.get(date);

  if (!data) {
    return NextResponse.json(
      { error: `No data available for date: ${date}` },
      { status: 404 }
    );
  }

  return NextResponse.json(data, {
    headers: CACHE_HEADERS,
  });
}
