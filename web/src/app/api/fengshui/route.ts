import { NextRequest, NextResponse } from "next/server";
import { FengShuiServerRepository } from "@/lib/fengshui/FengShuiServerRepository";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Missing required parameter: date (format: YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const data = FengShuiServerRepository.getByDateString(date);

  if (!data) {
    return NextResponse.json(
      { error: `Invalid or out-of-range date: ${date}` },
      { status: 404 }
    );
  }

  return NextResponse.json(data, {
    headers: CACHE_HEADERS,
  });
}
