import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import { generateBookingRef } from "@/lib/booking";
import { formatSlotTime, validateBookableSlot } from "@/lib/slots";
import { sendBookingConfirmed } from "@/lib/email";
import { encrypt, encryptNullable, emailHash, withDecryptedGuest, withDecryptedNin } from "@/lib/encryption";

export async function GET(request: Request) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") ?? "Today"; // Today | Upcoming | Past

  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const endOfToday   = new Date(now); endOfToday.setHours(23, 59, 59, 999);

  let where: Record<string, unknown> = {};
  if (view === "Today") {
    where = { slotStart: { gte: startOfToday, lte: endOfToday } };
  } else if (view === "Upcoming") {
    where = { slotStart: { gt: endOfToday } };
  } else {
    where = { slotStart: { lt: startOfToday } };
  }

  const appointments = await db.appointment.findMany({
    where,
    include: {
      application: {
        include: {
          guest: true,
          officer: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { slotStart: view === "Past" ? "desc" : "asc" },
    take: 50,
  });

  const decrypted = appointments.map((a) => ({
    ...a,
    application: withDecryptedNin({ ...a.application, guest: withDecryptedGuest(a.application.guest) }),
  }));

  return NextResponse.json({ appointments: decrypted });
}

// ─── Manual booking (staff-created) ──────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function formatDateDisplay(date: Date): string {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_REF_ATTEMPTS = 5;

class ManualBookingError extends Error {
  constructor(public code: "SLOT_TAKEN" | "DUPLICATE" | "DAY_FULL") { super(code); }
}

export async function POST(request: Request) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  let body: {
    firstName?: string; lastName?: string; email?: string; phone?: string;
    notes?: string; slotStart?: string; officerId?: string | null;
    force?: boolean; sendEmail?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName  = body.lastName?.trim() ?? "";
  const email     = body.email?.trim().toLowerCase() ?? "";

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = "First name is required.";
  if (!lastName)  fieldErrors.lastName  = "Last name is required.";
  if (!email)         fieldErrors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ errors: fieldErrors }, { status: 422 });
  }

  if (!body.slotStart) {
    return NextResponse.json({ error: "No time slot selected." }, { status: 400 });
  }
  const slotDate = new Date(body.slotStart);
  if (isNaN(slotDate.getTime())) {
    return NextResponse.json({ error: "Invalid slot time." }, { status: 400 });
  }

  // Same DB-driven schedule the picker uses (template + exceptions + blocks +
  // future + daily cap), and the day bounds for the in-transaction cap check.
  const slot = await validateBookableSlot(body.slotStart);
  if (!slot.ok) {
    return NextResponse.json({ error: "The selected time slot is not available." }, { status: 409 });
  }

  const slotEnd = new Date(slotDate.getTime() + slot.slotDuration * 60 * 1000);
  const officerId = body.officerId || null;

  let persisted: { guestId: string; applicationId: string; applicationRef: string } | null = null;

  for (let attempt = 0; attempt < MAX_REF_ATTEMPTS; attempt++) {
    const applicationRef = generateBookingRef();
    try {
      persisted = await db.$transaction(async (tx) => {
        // 1. Serialize concurrent bookings for this exact slot.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${body.slotStart!}))`;

        // 2. Slot already taken?
        const taken = await tx.appointment.findFirst({
          where: { slotStart: slotDate, status: { not: "CANCELLED" } },
          select: { id: true },
        });
        if (taken) throw new ManualBookingError("SLOT_TAKEN");

        // 2b. Best-effort daily cap.
        const dayCount = await tx.appointment.count({
          where: { slotStart: { gte: slot.dayStart, lt: slot.dayEnd }, status: { not: "CANCELLED" } },
        });
        if (dayCount >= slot.maxPerDay) throw new ManualBookingError("DAY_FULL");

        // 3. Upsert the guest by email blind index.
        const guest = await tx.guest.upsert({
          where: { emailHash: emailHash(email) },
          update: { firstName, lastName, phone: encryptNullable(body.phone) },
          create: {
            email: encrypt(email),
            emailHash: emailHash(email),
            firstName,
            lastName,
            phone: encryptNullable(body.phone),
          },
        });

        // 4. Duplicate active application — staff may override with force.
        if (!body.force) {
          const active = await tx.application.findFirst({
            where: { guestId: guest.id, status: { notIn: ["CANCELLED", "NIN_ISSUED", "NO_SHOW"] } },
            select: { id: true },
          });
          if (active) throw new ManualBookingError("DUPLICATE");
        }

        // 5. Create application (+ optional officer assignment) and appointment.
        const application = await tx.application.create({
          data: {
            applicationRef,
            guestId: guest.id,
            officerId,
            notes: body.notes?.trim() || null,
          },
          select: { id: true, applicationRef: true },
        });

        await tx.appointment.create({
          data: { applicationId: application.id, slotStart: slotDate, slotEnd },
        });

        return { guestId: guest.id, applicationId: application.id, applicationRef: application.applicationRef };
      });
      break;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        (err.meta?.target as string[] | undefined)?.includes("applicationRef") &&
        attempt < MAX_REF_ATTEMPTS - 1
      ) {
        continue;
      }

      if (err instanceof ManualBookingError) {
        if (err.code === "SLOT_TAKEN") {
          return NextResponse.json({ error: "That time slot is no longer available. Please choose another." }, { status: 409 });
        }
        if (err.code === "DAY_FULL") {
          return NextResponse.json({ error: "All appointments for that day are now full. Please choose another date." }, { status: 409 });
        }
        // DUPLICATE — staff-facing, so name it and let the client offer an override.
        return NextResponse.json(
          { error: "This guest already has an active application.", code: "DUPLICATE" },
          { status: 409 }
        );
      }

      console.error("[admin/appointments/manual] Transaction failed:", err);
      return NextResponse.json({ error: "Something went wrong creating the booking. Please try again." }, { status: 500 });
    }
  }

  if (!persisted) {
    return NextResponse.json({ error: "Something went wrong creating the booking. Please try again." }, { status: 500 });
  }

  // Confirmation email (default on; staff can suppress with sendEmail:false).
  if (body.sendEmail !== false) {
    sendBookingConfirmed({
      to: email,
      guestName: `${firstName} ${lastName}`,
      applicationRef: persisted.applicationRef,
      appointmentDate: formatDateDisplay(slotDate),
      appointmentTime: formatSlotTime(body.slotStart),
      slotIso: body.slotStart,
      guestId: persisted.guestId,
      applicationId: persisted.applicationId,
    }).catch((err) => console.error("[admin/appointments/manual] confirmation email failed:", err));
  }

  return NextResponse.json({ applicationRef: persisted.applicationRef, applicationId: persisted.applicationId });
}
