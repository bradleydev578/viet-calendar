/**
 * Timezone-safe date utilities for Lịch Việt
 */

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parse a YYYY-MM-DD string into a local Date at 12:00:00 (noon)
 * to avoid UTC midnight off-by-one day issues across server/client timezones.
 * Returns null if the format or calendar date is invalid.
 */
export function parseDateString(dateStr: string): Date | null {
  const match = DATE_REGEX.exec(dateStr);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Format a Date object into YYYY-MM-DD using its local year/month/day components.
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get current date in Vietnam timezone (Asia/Ho_Chi_Minh, UTC+7)
 * constructed at 12:00:00 local time for consistent server rendering.
 */
export function getVietnamToday(): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value || now.getFullYear());
  const month = Number(parts.find((p) => p.type === "month")?.value || now.getMonth() + 1);
  const day = Number(parts.find((p) => p.type === "day")?.value || now.getDate());

  return new Date(year, month - 1, day, 12, 0, 0, 0);
}
