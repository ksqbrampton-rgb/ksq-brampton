import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import type { DayOfWeek } from "@prisma/client";

export const dynamic = "force-dynamic";

const DAY_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

// createdById / updatedById are plain (non-relational) string columns — purely
// informational. Capturing the real actor is a trivial future enhancement.
const ACTOR = "admin";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** A @db.Date is stored at UTC midnight — read the calendar day back in UTC. */
function toYmd(d: Date): string {
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

/** "YYYY-MM-DD" -> UTC-midnight Date, matching how lib/slots.ts looks exceptions up. */
function ymdToUtcMidnight(ymd: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return isNaN(date.getTime()) ? null : date;
}

async function loadState() {
  const [templates, exceptions] = await Promise.all([
    db.availabilityTemplate.findMany(),
    db.dateException.findMany({ orderBy: { date: "asc" } }),
  ]);

  const byDay = new Map(templates.map((t) => [t.dayOfWeek, t]));
  const schedule = DAY_ORDER.map((day) => {
    const t = byDay.get(day);
    return {
      dayOfWeek: day,
      isOpen: t?.isOpen ?? false,
      openTime: t?.openTime ?? null,
      closeTime: t?.closeTime ?? null,
      slotDuration: t?.slotDuration ?? 30,
      bufferTime: t?.bufferTime ?? 0,
      maxPerDay: t?.maxPerDay ?? 20,
    };
  });

  return {
    schedule,
    exceptions: exceptions.map((e) => ({
      id: e.id,
      date: toYmd(e.date),
      isClosed: e.isClosed,
      openTime: e.openTime,
      closeTime: e.closeTime,
      reason: e.reason,
    })),
  };
}

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;
  try {
    return NextResponse.json(await loadState());
  } catch (err) {
    console.error("[availability] GET failed:", err);
    return NextResponse.json({ error: "Failed to load availability." }, { status: 500 });
  }
}

interface SchedulePayloadDay {
  dayOfWeek: string;
  isOpen: boolean;
  openTime?: string | null;
  closeTime?: string | null;
}

interface ExceptionPayload {
  date: string;
  isClosed: boolean;
  openTime?: string | null;
  closeTime?: string | null;
  reason?: string | null;
}

export async function POST(request: Request) {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;

  let body: { schedule?: SchedulePayloadDay[]; exceptions?: ExceptionPayload[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const schedule = Array.isArray(body.schedule) ? body.schedule : [];
  const exceptions = Array.isArray(body.exceptions) ? body.exceptions : [];

  // ── Validate weekly schedule ──
  for (const day of schedule) {
    if (!DAY_ORDER.includes(day.dayOfWeek as DayOfWeek)) {
      return NextResponse.json({ error: `Invalid day: ${day.dayOfWeek}` }, { status: 422 });
    }
    if (day.isOpen) {
      if (!day.openTime || !day.closeTime || !TIME_RE.test(day.openTime) || !TIME_RE.test(day.closeTime)) {
        return NextResponse.json({ error: `Invalid hours for ${day.dayOfWeek}.` }, { status: 422 });
      }
      if (day.openTime >= day.closeTime) {
        return NextResponse.json(
          { error: `Open time must be before close time for ${day.dayOfWeek}.` },
          { status: 422 }
        );
      }
    }
  }

  // ── Validate date exceptions ──
  const exceptionDates: Date[] = [];
  for (const ex of exceptions) {
    const d = ymdToUtcMidnight(ex.date);
    if (!d) return NextResponse.json({ error: `Invalid exception date: ${ex.date}` }, { status: 422 });
    if (!ex.isClosed) {
      if (
        !ex.openTime ||
        !ex.closeTime ||
        !TIME_RE.test(ex.openTime) ||
        !TIME_RE.test(ex.closeTime) ||
        ex.openTime >= ex.closeTime
      ) {
        return NextResponse.json({ error: `Invalid special hours for ${ex.date}.` }, { status: 422 });
      }
    }
    exceptionDates.push(d);
  }

  try {
    await db.$transaction(async (tx) => {
      // Upsert the weekly template rows (create when missing — the table starts empty)
      for (const day of schedule) {
        const dow = day.dayOfWeek as DayOfWeek;
        await tx.availabilityTemplate.upsert({
          where: { dayOfWeek: dow },
          update: {
            isOpen: day.isOpen,
            openTime: day.isOpen ? day.openTime! : null,
            closeTime: day.isOpen ? day.closeTime! : null,
            updatedById: ACTOR,
          },
          create: {
            dayOfWeek: dow,
            isOpen: day.isOpen,
            openTime: day.isOpen ? day.openTime! : null,
            closeTime: day.isOpen ? day.closeTime! : null,
            updatedById: ACTOR,
          },
        });
      }

      // Reconcile exceptions to match the payload (payload is source of truth)
      if (exceptionDates.length === 0) {
        await tx.dateException.deleteMany({});
      } else {
        await tx.dateException.deleteMany({ where: { date: { notIn: exceptionDates } } });
      }
      for (let i = 0; i < exceptions.length; i++) {
        const ex = exceptions[i];
        const d = exceptionDates[i];
        await tx.dateException.upsert({
          where: { date: d },
          update: {
            isClosed: ex.isClosed,
            openTime: ex.isClosed ? null : ex.openTime!,
            closeTime: ex.isClosed ? null : ex.closeTime!,
            reason: ex.reason ?? null,
          },
          create: {
            date: d,
            isClosed: ex.isClosed,
            openTime: ex.isClosed ? null : ex.openTime!,
            closeTime: ex.isClosed ? null : ex.closeTime!,
            reason: ex.reason ?? null,
            createdById: ACTOR,
          },
        });
      }
    });

    return NextResponse.json(await loadState());
  } catch (err) {
    console.error("[availability] POST failed:", err);
    return NextResponse.json({ error: "Failed to save availability." }, { status: 500 });
  }
}
