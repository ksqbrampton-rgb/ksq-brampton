import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import { withDecryptedGuest, withDecryptedNin } from "@/lib/encryption";

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
