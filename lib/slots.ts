/**
 * Slot generation logic — DB-driven.
 *
 * Reads AvailabilityTemplate (weekly schedule) + DateException (closures /
 * special hours) + Appointment (booked) + SlotBlock (ad-hoc blocks) and
 * produces the available slots for a date.
 *
 * Template open/close times are interpreted as America/Toronto wall-clock and
 * converted to UTC instants (DST-aware) using the built-in Intl API — no
 * third-party timezone dependency.
 */

import { db } from "@/lib/db";
import type { DayOfWeek } from "@prisma/client";

const TZ = "America/Toronto";

// Canonical center slot length / buffer. Real values come from the template;
// these remain as fallbacks when no template row exists.
export const SLOT_DURATION_MINUTES = 30;
export const BUFFER_MINUTES = 0;

// JS getDay() index (0 = Sunday) -> Prisma DayOfWeek enum
const DOW: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

// ─── Timezone helpers (Intl-based, DST-aware, no dependency) ──────────────

/**
 * Offset in ms such that: localWallTime = utcInstant + offset.
 * Toronto returns -4h (EDT) or -5h (EST) depending on the instant.
 */
function tzOffsetMs(instant: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(instant)) {
    if (p.type !== "literal") map[p.type] = parseInt(p.value, 10);
  }
  let hour = map.hour;
  if (hour === 24) hour = 0; // some engines emit "24" for midnight
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, map.second);
  return asUtc - instant.getTime();
}

/**
 * Convert a Toronto wall-clock time to the corresponding UTC instant.
 * Business hours never land on a DST boundary, but a second refinement pass
 * keeps it exact even if they did.
 */
function torontoWallToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const offset1 = tzOffsetMs(new Date(guess));
  let utc = guess - offset1;
  const offset2 = tzOffsetMs(new Date(utc));
  if (offset2 !== offset1) utc = guess - offset2;
  return new Date(utc);
}

/** Toronto calendar Y/M/D for a UTC instant. */
function torontoYmd(instant: Date): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const p of dtf.formatToParts(instant)) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return { year: Number(map.year), month: Number(map.month), day: Number(map.day) };
}

/** UTC instants bounding a Toronto calendar day (DST-safe; 23/25h days OK). */
function torontoDayBounds(year: number, month: number, day: number): { start: Date; end: Date } {
  const start = torontoWallToUtc(year, month, day, 0, 0);
  const nxt = new Date(Date.UTC(year, month - 1, day));
  nxt.setUTCDate(nxt.getUTCDate() + 1);
  const end = torontoWallToUtc(
    nxt.getUTCFullYear(),
    nxt.getUTCMonth() + 1,
    nxt.getUTCDate(),
    0,
    0
  );
  return { start, end };
}

// ─── Day configuration (template + exception merge) ──────────────────────

interface DayConfig {
  openTime: string; // "09:00"
  closeTime: string; // "17:00"
  slotDuration: number;
  bufferTime: number;
  maxPerDay: number;
}

/**
 * Resolve the effective open/close + capacity for a Toronto calendar day.
 * Returns null when the day is closed (by exception or template).
 */
async function getDayConfig(year: number, month: number, day: number): Promise<DayConfig | null> {
  // DateException is stored as @db.Date — match on UTC midnight of the day.
  const exceptionDate = new Date(Date.UTC(year, month - 1, day));

  const jsDow = new Date(year, month - 1, day).getDay();

  const [exception, template] = await Promise.all([
    db.dateException.findUnique({ where: { date: exceptionDate } }),
    db.availabilityTemplate.findUnique({ where: { dayOfWeek: DOW[jsDow] } }),
  ]);

  // Full closure overrides everything.
  if (exception?.isClosed) return null;

  const baseOpen = template?.isOpen ? template.openTime : null;
  const baseClose = template?.isOpen ? template.closeTime : null;

  // Exception special-hours override the template when present.
  const openTime = exception?.openTime ?? baseOpen;
  const closeTime = exception?.closeTime ?? baseClose;

  if (!openTime || !closeTime) return null;

  return {
    openTime,
    closeTime,
    slotDuration: template?.slotDuration ?? SLOT_DURATION_MINUTES,
    bufferTime: template?.bufferTime ?? BUFFER_MINUTES,
    maxPerDay: template?.maxPerDay ?? 20,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * Available slot start times (ISO UTC strings) for a date.
 * `date` carries the Toronto calendar day in its local Y/M/D
 * (built as `new Date(year, month - 1, day)` by callers).
 */
export async function getAvailableSlots(date: Date): Promise<string[]> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const config = await getDayConfig(year, month, day);
  if (!config) return [];

  const [openH, openM] = config.openTime.split(":").map(Number);
  const [closeH, closeM] = config.closeTime.split(":").map(Number);

  const openUtc = torontoWallToUtc(year, month, day, openH, openM).getTime();
  const closeUtc = torontoWallToUtc(year, month, day, closeH, closeM).getTime();
  const step = (config.slotDuration + config.bufferTime) * 60 * 1000;
  if (step <= 0) return [];

  const now = Date.now();
  const grid: string[] = [];
  for (let t = openUtc; t < closeUtc; t += step) {
    if (t > now) grid.push(new Date(t).toISOString()); // future slots only
  }
  if (grid.length === 0) return [];

  const { start, end } = torontoDayBounds(year, month, day);

  const [booked, blocked] = await Promise.all([
    db.appointment.findMany({
      where: { slotStart: { gte: start, lt: end }, status: { not: "CANCELLED" } },
      select: { slotStart: true },
    }),
    db.slotBlock.findMany({
      where: { slotStart: { gte: start, lt: end } },
      select: { slotStart: true },
    }),
  ]);

  // Daily cap: once the day's booked count hits maxPerDay, offer nothing more.
  if (booked.length >= config.maxPerDay) return [];

  const bookedSet = new Set(booked.map((b) => b.slotStart.toISOString()));
  const blockedSet = new Set(blocked.map((b) => b.slotStart.toISOString()));

  return grid.filter((iso) => !bookedSet.has(iso) && !blockedSet.has(iso));
}

export interface SlotValidation {
  ok: boolean;
  slotDuration: number;
  maxPerDay: number;
  dayStart: Date;
  dayEnd: Date;
}

/**
 * Server-side validation for a submitted slot. Confirms the slot is one the
 * picker would currently offer (template + exception + block + future + cap),
 * and returns the day's capacity + bounds for the booking transaction's
 * best-effort daily-cap check.
 *
 * Booked-subtraction inside getAvailableSlots is harmless here: at validation
 * time the slot isn't booked yet, and concurrent same-slot booking is handled
 * by the advisory lock + taken-check in the booking route.
 */
export async function validateBookableSlot(slotIso: string): Promise<SlotValidation> {
  const instant = new Date(slotIso);
  if (isNaN(instant.getTime())) {
    return { ok: false, slotDuration: SLOT_DURATION_MINUTES, maxPerDay: 20, dayStart: new Date(0), dayEnd: new Date(0) };
  }

  const { year, month, day } = torontoYmd(instant);
  const { start: dayStart, end: dayEnd } = torontoDayBounds(year, month, day);
  const config = await getDayConfig(year, month, day);

  const slotDuration = config?.slotDuration ?? SLOT_DURATION_MINUTES;
  const maxPerDay = config?.maxPerDay ?? 20;

  if (!config) return { ok: false, slotDuration, maxPerDay, dayStart, dayEnd };

  const available = await getAvailableSlots(new Date(year, month - 1, day));
  return { ok: available.includes(slotIso), slotDuration, maxPerDay, dayStart, dayEnd };
}

/**
 * Format a slot ISO string for display, e.g. "9:00 AM" (Toronto time).
 */
export function formatSlotTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

/**
 * Lightweight client-side guard for the calendar grid: disables past dates and
 * Sundays. The authoritative availability (admin closures, special hours, full
 * days, blocks) is enforced server-side by /api/slots — a closed or fully
 * booked date simply returns no slots when opened.
 */
export function isDateBookable(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(date);
  check.setHours(0, 0, 0, 0);
  if (check < today) return false;
  return date.getDay() !== 0; // Sunday closed
}
