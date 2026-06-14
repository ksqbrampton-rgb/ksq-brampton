import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { generateBookingRef, validateBookingForm, type BookingPayload } from "@/lib/booking";
import { formatSlotTime, validateBookableSlot } from "@/lib/slots";
import { sendBookingConfirmed } from "@/lib/email";
import { bookingLimiter, checkRateLimit, getClientIp } from "@/lib/ratelimit";
import { encrypt, encryptNullable, emailHash } from "@/lib/encryption";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function formatDateDisplay(date: Date): string {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Thrown inside the transaction, mapped to a friendly response after rollback
class BookingError extends Error {
  constructor(public code: "SLOT_TAKEN" | "DUPLICATE" | "DAY_FULL") {
    super(code);
  }
}

const MAX_REF_ATTEMPTS = 5;

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

  // Validate the slot against the live DB-driven schedule — the same source the
  // picker uses (template + exceptions + blocks + future + cap). Also returns
  // the day's capacity + bounds for the in-transaction cap check below.
  const slot = await validateBookableSlot(body.slotStart);
  if (!slot.ok) {
    return NextResponse.json({ error: "The selected time slot is not available." }, { status: 409 });
  }

  const guestName = `${body.firstName} ${body.lastName}`.trim();
  const slotEnd = new Date(slotDate.getTime() + slot.slotDuration * 60 * 1000);

  // Persist Guest + Application + Appointment atomically.
  // Retry only if the random applicationRef collides on its unique constraint.
  let persisted: { guestId: string; applicationId: string; applicationRef: string } | null = null;

  for (let attempt = 0; attempt < MAX_REF_ATTEMPTS; attempt++) {
    const applicationRef = generateBookingRef();
    try {
      persisted = await db.$transaction(async (tx) => {
        // 1. Serialize concurrent bookings for this exact slot. Transaction-scoped
        //    advisory lock — auto-released on commit/rollback, pooler-safe.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${body.slotStart!}))`;

        // 2. Slot already taken? (anything not cancelled occupies it)
        const taken = await tx.appointment.findFirst({
          where: { slotStart: slotDate, status: { not: "CANCELLED" } },
          select: { id: true },
        });
        if (taken) throw new BookingError("SLOT_TAKEN");

        // 2b. Best-effort daily cap. The visible cap lives in /api/slots; this
        //     catches a day that filled between page load and submit.
        const dayCount = await tx.appointment.count({
          where: { slotStart: { gte: slot.dayStart, lt: slot.dayEnd }, status: { not: "CANCELLED" } },
        });
        if (dayCount >= slot.maxPerDay) throw new BookingError("DAY_FULL");

        // 3. Upsert the guest by email blind index (create first time, refresh
        //    name/phone on return). email/phone are stored encrypted.
        const normEmail = body.email!.trim().toLowerCase();
        const guest = await tx.guest.upsert({
          where: { emailHash: emailHash(normEmail) },
          update: { firstName: body.firstName!, lastName: body.lastName!, phone: encryptNullable(body.phone) },
          create: {
            email: encrypt(normEmail),
            emailHash: emailHash(normEmail),
            firstName: body.firstName!,
            lastName: body.lastName!,
            phone: encryptNullable(body.phone),
          },
        });

        // 4. Block if this guest already has an active application
        const active = await tx.application.findFirst({
          where: { guestId: guest.id, status: { notIn: ["CANCELLED", "NIN_ISSUED", "NO_SHOW"] } },
          select: { id: true },
        });
        if (active) throw new BookingError("DUPLICATE");

        // 5. Create the application + appointment
        const application = await tx.application.create({
          data: {
            applicationRef,
            guestId: guest.id,
            notes: body.notes?.trim() || null,
          },
          select: { id: true, applicationRef: true },
        });

        await tx.appointment.create({
          data: {
            applicationId: application.id,
            slotStart: slotDate,
            slotEnd,
          },
        });

        return { guestId: guest.id, applicationId: application.id, applicationRef: application.applicationRef };
      });
      break; // committed successfully
    } catch (err) {
      // Retry on applicationRef unique collision (rare, random suffix)
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        (err.meta?.target as string[] | undefined)?.includes("applicationRef") &&
        attempt < MAX_REF_ATTEMPTS - 1
      ) {
        continue;
      }

      if (err instanceof BookingError) {
        if (err.code === "SLOT_TAKEN") {
          return NextResponse.json(
            { error: "That time slot is no longer available. Please choose another." },
            { status: 409 }
          );
        }
        if (err.code === "DAY_FULL") {
          return NextResponse.json(
            { error: "All appointments for that day are now full. Please choose another date." },
            { status: 409 }
          );
        }
        // DUPLICATE — generic message, no email enumeration
        return NextResponse.json(
          { error: "An appointment already exists for this email. Please contact us if you need to make a change." },
          { status: 409 }
        );
      }

      console.error("[book] Transaction failed:", err);
      return NextResponse.json(
        { error: "Something went wrong creating your booking. Please try again." },
        { status: 500 }
      );
    }
  }

  if (!persisted) {
    console.error("[book] Could not generate a unique booking reference after retries");
    return NextResponse.json(
      { error: "Something went wrong creating your booking. Please try again." },
      { status: 500 }
    );
  }

  const appointmentDate = formatDateDisplay(slotDate);
  const appointmentTime = formatSlotTime(body.slotStart);

  // Send confirmation AFTER commit — only a persisted booking gets an email.
  // guestId/applicationId link the EmailLog row to the real guest.
  sendBookingConfirmed({
    to: body.email!,
    guestName,
    applicationRef: persisted.applicationRef,
    appointmentDate,
    appointmentTime,
    slotIso: body.slotStart,
    guestId: persisted.guestId,
    applicationId: persisted.applicationId,
  }).then(() => {
    console.log("[book] Confirmation email sent to:", body.email);
  }).catch((err) => {
    console.error("[book] FAILED to send confirmation email:", err?.message ?? err);
  });

  return NextResponse.json({
    success: true,
    applicationRef: persisted.applicationRef,
    slotStart: body.slotStart,
    guestName,
  });
}
