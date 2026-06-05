import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  let body: { action: "checkin" | "biometrics" | "noshow" | "cancel"; changedById?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const appt = await db.appointment.findUnique({
      where: { id: params.id },
      include: { application: true },
    });
    if (!appt) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const now = new Date();

    switch (body.action) {
      case "checkin":
        await db.appointment.update({ where: { id: params.id }, data: { status: "ARRIVED", arrivedAt: now } });
        await db.application.update({ where: { id: appt.applicationId }, data: { status: "ARRIVED" } });
        break;
      case "biometrics":
        await db.appointment.update({ where: { id: params.id }, data: { status: "COMPLETED", completedAt: now } });
        await db.application.update({ where: { id: appt.applicationId }, data: { status: "BIOMETRICS_CAPTURED", biometricsDoneAt: now } });
        break;
      case "noshow":
        await db.appointment.update({ where: { id: params.id }, data: { status: "NO_SHOW", noShowMarkedAt: now } });
        await db.application.update({ where: { id: appt.applicationId }, data: { status: "NO_SHOW" } });
        await db.guest.update({ where: { id: appt.application.guestId }, data: { noShowCount: { increment: 1 } } });
        break;
      case "cancel":
        await db.appointment.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
        await db.application.update({ where: { id: appt.applicationId }, data: { status: "CANCELLED" } });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/appointments/patch]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
