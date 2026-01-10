/**
 * API Route: /api/fengshui/month
 * Returns feng shui data for an entire month
 *
 * Query params:
 * - year: YYYY format (required)
 * - month: 1-12 (required)
 *
 * Response: DayFengShuiData[] | { error: string }
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
  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month');

  // Validate year parameter
  if (!yearParam) {
    return NextResponse.json(
      { error: 'Missing required parameter: year (format: YYYY)' },
      { status: 400 }
    );
  }

  // Validate month parameter
  if (!monthParam) {
    return NextResponse.json(
      { error: 'Missing required parameter: month (1-12)' },
      { status: 400 }
    );
  }

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);

  // Validate year range
  if (isNaN(year) || year < 2025 || year > 2027) {
    return NextResponse.json(
      { error: 'Year must be between 2025 and 2027' },
      { status: 400 }
    );
  }

  // Validate month range
  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: 'Month must be between 1 and 12' },
      { status: 400 }
    );
  }

  // Get all days in the month
  const results: DayFengShuiData[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const data = dataMap.get(dateKey);
    if (data) {
      results.push(data);
    }
  }

  if (results.length === 0) {
    return NextResponse.json(
      { error: `No data available for ${year}-${month}` },
      { status: 404 }
    );
  }

  return NextResponse.json(results, {
    headers: CACHE_HEADERS,
  });
}
