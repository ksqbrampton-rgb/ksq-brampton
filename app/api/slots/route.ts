import { NextResponse } from "next/server";
import { generateSlotsForDate, isDateBookable } from "@/lib/slots";

/**
 * GET /api/slots?date=YYYY-MM-DD
 *
 * Phase 2: returns generated slots with no DB check.
 * Phase 3: subtract already-booked slots from DB query.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");

  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return NextResponse.json(
      { error: "Missing or invalid date parameter. Expected YYYY-MM-DD." },
      { status: 400 }
    );
  }

  // Parse as local Toronto date (avoid UTC shift issues)
  const [year, month, day] = dateParam.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (!isDateBookable(date)) {
    return NextResponse.json({ slots: [] });
  }

  const slots = generateSlotsForDate(date);
  return NextResponse.json({ slots });
}
