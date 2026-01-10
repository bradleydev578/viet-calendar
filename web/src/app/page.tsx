/**
 * Home Page - Server Component
 *
 * This is a Server Component that pre-fetches initial data on the server
 * and passes it to the client component for hydration.
 *
 * Benefits:
 * - No JSON data bundled in client JS
 * - Faster initial load
 * - Better SEO (data in HTML)
 * - Smaller bundle size (~95% reduction)
 */

import { HomeClient } from "@/components/home";
import { FengShuiServerRepository } from "@/lib/fengshui/FengShuiServerRepository";
import { QuoteServerRepository } from "@/lib/quotes/QuoteServerRepository";

export default async function Home() {
  // Get today's date (server-side)
  const today = new Date();
  const todayStr = today.toISOString();

  // Fetch initial data on server
  const initialFengShuiData = FengShuiServerRepository.getByDate(today);

  // Fetch month data for initial calendar display
  const initialMonthData = FengShuiServerRepository.getByMonth(
    today.getFullYear(),
    today.getMonth() + 1
  );

  // Get quote of the day
  const quote = QuoteServerRepository.getQuoteOfTheDay(today);
  const initialQuote = quote.text;

  return (
    <HomeClient
      initialFengShuiData={initialFengShuiData}
      initialMonthData={initialMonthData}
      initialQuote={initialQuote}
      initialDate={todayStr}
    />
  );
}
