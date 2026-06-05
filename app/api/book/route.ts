import { NextResponse } from "next/server";
import { generateBookingRef, validateBookingForm, type BookingPayload } from "@/lib/booking";
import { isDateBookable, formatSlotTime } from "@/lib/slots";
import { sendBookingConfirmed } from "@/lib/email";
import { bookingLimiter, checkRateLimit, getClientIp } from "@/lib/ratelimit";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function formatDateDisplay(date: Date): string {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export async function POST(request: Request) {
  // Rate limiting
  const ip = getClientIp(request);
  const rl = await checkRateLimit(bookingLimiter, `booking:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later." },
      {
        status: 429,
        headers: rl.reset ? { "Retry-After": String(Math.ceil((rl.reset.getTime() - Date.now()) / 1000)) } : {},
      }
    );
  }

  let body: Partial<BookingPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const errors = validateBookingForm(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  if (!body.slotStart) {
    return NextResponse.json({ error: "No time slot selected." }, { status: 400 });
  }

  const slotDate = new Date(body.slotStart);
  if (isNaN(slotDate.getTime())) {
    return NextResponse.json({ error: "Invalid slot time." }, { status: 400 });
  }

  if (!isDateBookable(slotDate)) {
    return NextResponse.json({ error: "The selected date is not available." }, { status: 409 });
  }

  // TODO Phase 3 DB: replace with real DB transaction + SELECT FOR UPDATE double-booking lock
  const applicationRef = generateBookingRef();
  const guestName = `${body.firstName} ${body.lastName}`.trim();
  const appointmentDate = formatDateDisplay(slotDate);
  const appointmentTime = formatSlotTime(body.slotStart);

  // Send confirmation email — fire and forget but log errors
  sendBookingConfirmed({
    to: body.email!,
    guestName,
    applicationRef,
    appointmentDate,
    appointmentTime,
    slotIso: body.slotStart,
  }).then(() => {
    console.log("[book] Confirmation email sent to:", body.email);
  }).catch(err => {
    console.error("[book] FAILED to send confirmation email:", err?.message ?? err);
  });

  return NextResponse.json({
    success: true,
    applicationRef,
    slotStart: body.slotStart,
    guestName,
  });
}
