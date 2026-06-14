import { NextResponse } from "next/server";
import { getAvailableSlots, isDateBookable } from "@/lib/slots";

// Availability is live data — never cache this response.
export const dynamic = "force-dynamic";

/**
 * GET /api/slots?date=YYYY-MM-DD
 *
 * Returns available slot start times (ISO UTC) for the date, generated from
 * AvailabilityTemplate + DateException + SlotBlock and with already-booked
 * slots and full days removed.
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

  // Parse as a Toronto calendar date (local Y/M/D, avoids UTC shift issues).
  const [year, month, day] = dateParam.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  // Quick client-equivalent guard (past / Sunday) before touching the DB.
  if (!isDateBookable(date)) {
    return NextResponse.json({ slots: [] });
  }

  const slots = await getAvailableSlots(date);
  return NextResponse.json({ slots });
}
