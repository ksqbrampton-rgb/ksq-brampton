/**
 * Slot generation logic.
 * Phase 2: generates slots from hardcoded schedule (no DB).
 * Phase 3: swap generateAvailableSlots to query AvailabilityTemplate + DateException + Appointment tables.
 */

export const SLOT_DURATION_MINUTES = 30;
export const BUFFER_MINUTES = 0;

// Default weekly schedule (Mon–Fri 9:00–17:00, Sat 10:00–15:00, Sun closed)
const DEFAULT_SCHEDULE: Record<number, { open: string; close: string } | null> = {
  0: null,                           // Sunday — closed
  1: { open: "09:00", close: "17:00" }, // Monday
  2: { open: "09:00", close: "17:00" }, // Tuesday
  3: { open: "09:00", close: "17:00" }, // Wednesday
  4: { open: "09:00", close: "17:00" }, // Thursday
  5: { open: "09:00", close: "17:00" }, // Friday
  6: { open: "10:00", close: "15:00" }, // Saturday
};

function parseTime(timeStr: string, baseDate: Date): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Generate all time slot strings for a given date.
 * Returns ISO strings of slot start times.
 * Phase 3: replace with DB-driven generation.
 */
export function generateSlotsForDate(date: Date): string[] {
  const dayOfWeek = date.getDay();
  const schedule = DEFAULT_SCHEDULE[dayOfWeek];
  if (!schedule) return [];

  const open = parseTime(schedule.open, date);
  const close = parseTime(schedule.close, date);
  const slots: string[] = [];
  const now = new Date();

  let cursor = new Date(open);
  while (cursor < close) {
    // Skip slots in the past (for today)
    if (cursor > now) {
      slots.push(cursor.toISOString());
    }
    cursor = new Date(cursor.getTime() + (SLOT_DURATION_MINUTES + BUFFER_MINUTES) * 60 * 1000);
  }

  return slots;
}

/**
 * Format a slot ISO string to a display string e.g. "9:00 AM"
 */
export function formatSlotTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Toronto",
  });
}

/**
 * Check whether a given date is bookable (not Sunday, not in the past).
 * Phase 3: also check DateException table.
 */
export function isDateBookable(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(date);
  check.setHours(0, 0, 0, 0);
  if (check < today) return false;
  const dayOfWeek = date.getDay();
  return DEFAULT_SCHEDULE[dayOfWeek] !== null;
}
