/**
 * Mock data uses a fixed "now" (2026-10-27 20:36, the reference screenshot time)
 * and stores times as minutes before it. Everything is computed in UTC, so
 * server and client renders always match.
 */
const NOW = Date.UTC(2026, 9, 27, 20, 36);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const at = (minutesAgo: number) => new Date(NOW - minutesAgo * 60_000);
const pad = (n: number) => String(n).padStart(2, "0");
const dayIndex = (d: Date) => Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86_400_000);

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** Calendar days between the time and "now" (0 = today). */
export function daysAgo(minutesAgo: number): number {
  return dayIndex(at(0)) - dayIndex(at(minutesAgo));
}

/** "20:40" */
export function formatClock(minutesAgo: number): string {
  const d = at(minutesAgo);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** "6:31 PM" (My Chats list). */
export function formatClock12(minutesAgo: number): string {
  const d = at(minutesAgo);
  const h = d.getUTCHours();
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(d.getUTCMinutes())} ${h >= 12 ? "PM" : "AM"}`;
}

/** Chat-list time: "20:02" today, "Yesterday", then "26 Oct". */
export function formatListTime(minutesAgo: number): string {
  const days = daysAgo(minutesAgo);
  if (days === 0) return formatClock(minutesAgo);
  if (days === 1) return "Yesterday";
  const d = at(minutesAgo);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** Day divider in a conversation: "Oct 14th 2026". */
export function formatDayHeading(minutesAgo: number): string {
  const d = at(minutesAgo);
  return `${MONTHS[d.getUTCMonth()]} ${ordinal(d.getUTCDate())} ${d.getUTCFullYear()}`;
}

/** System event timestamp: "2026-10-13 22:21". */
export function formatTimestamp(minutesAgo: number): string {
  const d = at(minutesAgo);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${formatClock(minutesAgo)}`;
}
