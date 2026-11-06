import { NextRequest, NextResponse } from "next/server";
import { FengShuiServerRepository } from "@/lib/fengshui/FengShuiServerRepository";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  if (!yearParam) {
    return NextResponse.json(
      { error: "Missing required parameter: year (format: YYYY)" },
      { status: 400 }
    );
  }

  if (!monthParam) {
    return NextResponse.json(
      { error: "Missing required parameter: month (1-12)" },
      { status: 400 }
    );
  }

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);

  if (isNaN(year) || year < 1900 || year > 2100) {
    return NextResponse.json(
      { error: "Year must be between 1900 and 2100" },
      { status: 400 }
    );
  }

  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "Month must be between 1 and 12" },
      { status: 400 }
    );
  }

  const results = FengShuiServerRepository.getByMonth(year, month);

  return NextResponse.json(results, {
    headers: CACHE_HEADERS,
  });
}
