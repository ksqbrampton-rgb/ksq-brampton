import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const endOfToday   = new Date(now); endOfToday.setHours(23, 59, 59, 999);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todayAppointments,
    thisMonthApplications,
    ninIssued,
    pendingPayments,
    todayQueue,
    recentActivity,
  ] = await Promise.all([
    // Today's appointment count
    db.appointment.count({
      where: {
        slotStart: { gte: startOfToday, lte: endOfToday },
        status: { not: "CANCELLED" },
      },
    }),
    // This month's applications
    db.application.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    // Total NIN issued
    db.application.count({ where: { status: "NIN_ISSUED" } }),
    // Pending payments
    db.application.count({ where: { paymentStatus: "PENDING" } }),
    // Today's full queue
    db.appointment.findMany({
      where: {
        slotStart: { gte: startOfToday, lte: endOfToday },
        status: { not: "CANCELLED" },
      },
      include: {
        application: {
          include: {
            guest: true,
            officer: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { slotStart: "asc" },
    }),
    // Recent status changes
    db.statusHistory.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        application: { select: { applicationRef: true } },
        changedBy: { select: { firstName: true, lastName: true } },
      },
    }),
  ]);

  return NextResponse.json({
    stats: { todayAppointments, thisMonthApplications, ninIssued, pendingPayments },
    todayQueue,
    recentActivity,
  });
}
