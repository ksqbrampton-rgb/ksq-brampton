import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import { encrypt, decryptNullable, withDecryptedGuest, withDecryptedNin } from "@/lib/encryption";
import { sendNinIssued } from "@/lib/email";

function maskNin(nin: string): string {
  const trimmed = nin.trim();
  if (trimmed.length <= 4) return trimmed;
  return "*".repeat(trimmed.length - 4) + trimmed.slice(-4);
}

function formatIssuedDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  const application = await db.application.findUnique({
    where: { id: params.id },
    include: {
      guest: true,
      appointment: true,
      officer: { select: { id: true, firstName: true, lastName: true } },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { changedBy: { select: { firstName: true, lastName: true } } },
      },
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const out = withDecryptedNin({ ...application, guest: withDecryptedGuest(application.guest) });
  return NextResponse.json({ application: out });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  let body: {
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    paymentReference?: string;
    ninNumber?: string;
    notes?: string;
    changedById?: string;
    note?: string;
    officerId?: string | null;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const existing = await db.application.findUnique({
      where: { id: params.id },
      include: { appointment: true },
    });
    if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const now = new Date();
    const existingAppt = existing.appointment as { slotStart: Date } | null;

    const updateData: Record<string, unknown> = {};
    if (body.paymentStatus)    updateData.paymentStatus    = body.paymentStatus;
    if (body.paymentMethod)    updateData.paymentMethod    = body.paymentMethod;
    if (body.paymentReference) updateData.paymentReference = body.paymentReference;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.officerId !== undefined) updateData.officerId = body.officerId || null;
    if (body.ninNumber) {
      updateData.ninNumber  = encrypt(body.ninNumber.trim()); // store encrypted
      updateData.ninIssuedAt = new Date();
    }

    // Detect a backward (reversal) status move so we can require a reason and
    // unwind the side effects of the state being left.
    const ORDER: Record<string, number> = {
      APPOINTMENT_SCHEDULED: 0, ARRIVED: 1, BIOMETRICS_CAPTURED: 2, NIN_PROCESSING: 3, NIN_ISSUED: 4,
    };
    let isReversal = false;
    if (body.status && body.status !== existing.status) {
      const toActive = body.status in ORDER;
      if (existing.status in ORDER && toActive && ORDER[body.status] < ORDER[existing.status]) isReversal = true;
      if ((existing.status === "NO_SHOW" || existing.status === "CANCELLED") && toActive) isReversal = true;
    }

    if (isReversal && (!body.note || !body.note.trim())) {
      return NextResponse.json(
        { error: "A reason is required to move an application back a step." },
        { status: 422 }
      );
    }

    if (body.status) {
      updateData.status = body.status;
      if (body.status === "ARRIVED")             updateData.biometricsDoneAt = null;
      if (body.status === "BIOMETRICS_CAPTURED") updateData.biometricsDoneAt = new Date();
    }

    if (isReversal) {
      if (existing.status === "NO_SHOW") {
        // Clamp at zero — never push the no-show count negative.
        await db.guest.updateMany({
          where: { id: existing.guestId, noShowCount: { gt: 0 } },
          data: { noShowCount: { decrement: 1 } },
        });
      }
      if (existing.status === "NIN_ISSUED") {
        updateData.ninNumber = null;    // clear so re-issuance starts clean and re-emails
        updateData.ninIssuedAt = null;
      }
      if ((ORDER[body.status as string] ?? 0) < ORDER.BIOMETRICS_CAPTURED) {
        updateData.biometricsDoneAt = null;
      }
      const stamp = new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto" });
      const line = `[${stamp}] Reverted ${existing.status} → ${body.status}: ${body.note!.trim()}`;
      updateData.notes = existing.notes ? `${existing.notes}\n${line}` : line;
    }

    // Forward no-show from the detail-page status control. Mirror the queue path:
    // guard on slot start, increment the count, and sync the appointment so both
    // entry points behave identically.
    if (body.status === "NO_SHOW" && existing.status !== "NO_SHOW") {
      if (existingAppt && existingAppt.slotStart > now) {
        return NextResponse.json(
          { error: "This appointment hasn't started yet — it can't be marked as a no-show." },
          { status: 422 }
        );
      }
      await db.guest.update({
        where: { id: existing.guestId },
        data: { noShowCount: { increment: 1 } },
      });
      await db.appointment.update({
        where: { applicationId: params.id },
        data: { status: "NO_SHOW" as never, noShowMarkedAt: now },
      }).catch(() => {});
    }

    // Forward cancel: keep the appointment in sync.
    if (body.status === "CANCELLED" && existing.status !== "CANCELLED") {
      await db.appointment.update({
        where: { applicationId: params.id },
        data: { status: "CANCELLED" as never },
      }).catch(() => {});
    }

    const updated = await db.application.update({
      where: { id: params.id },
      data: updateData,
      include: { guest: true, appointment: true },
    });

    // Keep the appointment in sync when the application is reverted.
    if (isReversal) {
      const apptStatusFor: Record<string, string> = {
        APPOINTMENT_SCHEDULED: "SCHEDULED", ARRIVED: "ARRIVED",
        BIOMETRICS_CAPTURED: "COMPLETED", NIN_PROCESSING: "COMPLETED", NIN_ISSUED: "COMPLETED",
      };
      const newApptStatus = apptStatusFor[body.status as string];
      if (newApptStatus) {
        await db.appointment.update({
          where: { applicationId: params.id },
          data: { status: newApptStatus as never, ...(existing.status === "NO_SHOW" ? { noShowMarkedAt: null } : {}) },
        }).catch(() => {});
      }
    }

    // Record status change in history
    if (body.status && body.changedById) {
      await db.statusHistory.create({
        data: {
          applicationId: params.id,
          fromStatus: existing.status,
          toStatus: body.status as never,
          changedById: body.changedById,
          note: body.note,
        },
      }).catch(() => {}); // Non-critical — don't fail the request
    }

    const out = withDecryptedNin({ ...updated, guest: withDecryptedGuest(updated.guest) });

    // On first NIN issuance, email the guest (masked NIN + collection details).
    // Fire-and-forget — a mail failure must not fail the issuance write.
    if (body.ninNumber && existing.ninIssuedAt == null) {
      const to = decryptNullable(updated.guest.email);
      if (to) {
        sendNinIssued({
          to,
          guestName: `${updated.guest.firstName} ${updated.guest.lastName}`,
          applicationRef: updated.applicationRef,
          maskedNin: maskNin(body.ninNumber),
          issuedDate: formatIssuedDate(updated.ninIssuedAt ?? new Date()),
          guestId: updated.guest.id,
          applicationId: updated.id,
        }).catch((err) => console.error("[admin/applications] NIN issued email failed:", err));
      }
    }

    return NextResponse.json({ application: out });
  } catch (err) {
    console.error("[admin/applications/patch]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
