/**
 * Canadian holiday date computation for Ontario.
 *
 * Dates are computed by rule for any year (fixed dates, nth-weekday rules, and
 * Easter-based dates) so the picklist stays correct year to year. Pure date
 * math — no DB, no dependency.
 */

export type HolidayCategory = "Ontario statutory" | "Federal" | "Optional";

export interface ResolvedHoliday {
  key: string;
  name: string;
  category: HolidayCategory;
  date: string; // "YYYY-MM-DD"
}

// ── date rule helpers (all in UTC to avoid timezone drift) ──

/** The nth occurrence of a weekday in a month. weekday: 0=Sun … 6=Sat. */
function nthWeekday(year: number, month1: number, weekday: number, n: number): { month: number; day: number } {
  const firstDow = new Date(Date.UTC(year, month1 - 1, 1)).getUTCDay();
  const day = 1 + ((weekday - firstDow + 7) % 7) + (n - 1) * 7;
  return { month: month1, day };
}

/** Victoria Day — the Monday that precedes May 25. */
function victoriaDay(year: number): { month: number; day: number } {
  const dow = new Date(Date.UTC(year, 4, 25)).getUTCDay(); // May 25
  let back = (dow + 6) % 7; // days since the most recent Monday
  if (back === 0) back = 7; // if May 25 is itself Monday, take the prior Monday
  const d = new Date(Date.UTC(year, 4, 25 - back));
  return { month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Easter Sunday (Gregorian) — Meeus/Jones/Butcher algorithm. */
function easterSunday(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

/** Easter Sunday shifted by a number of days (handles month boundaries). */
function easterOffset(year: number, deltaDays: number): { month: number; day: number } {
  const e = easterSunday(year);
  const d = new Date(Date.UTC(year, e.month - 1, e.day + deltaDays));
  return { month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

// ── holiday definitions (calendar order) ──

interface HolidayDef {
  key: string;
  name: string;
  category: HolidayCategory;
  compute: (year: number) => { month: number; day: number };
}

const HOLIDAY_DEFS: HolidayDef[] = [
  { key: "new-years",        name: "New Year's Day",                            category: "Ontario statutory", compute: () => ({ month: 1, day: 1 }) },
  { key: "family-day",       name: "Family Day",                                category: "Ontario statutory", compute: (y) => nthWeekday(y, 2, 1, 3) },
  { key: "good-friday",      name: "Good Friday",                               category: "Ontario statutory", compute: (y) => easterOffset(y, -2) },
  { key: "easter-monday",    name: "Easter Monday",                             category: "Optional",          compute: (y) => easterOffset(y, 1) },
  { key: "victoria-day",     name: "Victoria Day",                              category: "Ontario statutory", compute: (y) => victoriaDay(y) },
  { key: "canada-day",       name: "Canada Day",                                category: "Ontario statutory", compute: () => ({ month: 7, day: 1 }) },
  { key: "civic-holiday",    name: "Civic Holiday",                             category: "Optional",          compute: (y) => nthWeekday(y, 8, 1, 1) },
  { key: "labour-day",       name: "Labour Day",                                category: "Ontario statutory", compute: (y) => nthWeekday(y, 9, 1, 1) },
  { key: "truth-recon",      name: "National Day for Truth and Reconciliation", category: "Federal",           compute: () => ({ month: 9, day: 30 }) },
  { key: "thanksgiving",     name: "Thanksgiving",                              category: "Ontario statutory", compute: (y) => nthWeekday(y, 10, 1, 2) },
  { key: "remembrance-day",  name: "Remembrance Day",                           category: "Federal",           compute: () => ({ month: 11, day: 11 }) },
  { key: "christmas",        name: "Christmas Day",                             category: "Ontario statutory", compute: () => ({ month: 12, day: 25 }) },
  { key: "boxing-day",       name: "Boxing Day",                                category: "Ontario statutory", compute: () => ({ month: 12, day: 26 }) },
];

function ymd(year: number, md: { month: number; day: number }): string {
  return `${year}-${String(md.month).padStart(2, "0")}-${String(md.day).padStart(2, "0")}`;
}

/** All holidays for a given year, resolved to concrete dates, in calendar order. */
export function getHolidaysForYear(year: number): ResolvedHoliday[] {
  return HOLIDAY_DEFS
    .map((h) => ({ key: h.key, name: h.name, category: h.category, date: ymd(year, h.compute(year)) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
