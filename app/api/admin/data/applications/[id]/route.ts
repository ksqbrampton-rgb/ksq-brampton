import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import { encrypt, withDecryptedGuest, withDecryptedNin } from "@/lib/encryption";

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
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const existing = await db.application.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    if (body.paymentStatus)    updateData.paymentStatus    = body.paymentStatus;
    if (body.paymentMethod)    updateData.paymentMethod    = body.paymentMethod;
    if (body.paymentReference) updateData.paymentReference = body.paymentReference;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.ninNumber) {
      updateData.ninNumber  = encrypt(body.ninNumber.trim()); // store encrypted
      updateData.ninIssuedAt = new Date();
    }

    if (body.status) {
      updateData.status = body.status;
      if (body.status === "ARRIVED")             updateData.biometricsDoneAt = null;
      if (body.status === "BIOMETRICS_CAPTURED") updateData.biometricsDoneAt = new Date();
    }

    const updated = await db.application.update({
      where: { id: params.id },
      data: updateData,
      include: { guest: true, appointment: true },
    });

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
    return NextResponse.json({ application: out });
  } catch (err) {
    console.error("[admin/applications/patch]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
