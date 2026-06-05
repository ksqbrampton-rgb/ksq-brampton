import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import { SITE } from "@/lib/constants";

export async function GET(request: Request) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") ?? "This Month";

  const now = new Date();
  let since: Date;
  switch (range) {
    case "This Week":  since = new Date(now); since.setDate(now.getDate() - 7); break;
    case "This Quarter": since = new Date(now); since.setMonth(now.getMonth() - 3); break;
    case "This Year":  since = new Date(now.getFullYear(), 0, 1); break;
    default: since = new Date(now.getFullYear(), now.getMonth(), 1); // This Month
  }

  // 1. Applications by status (enrollment funnel)
  const allApps = await db.application.findMany({
    where: { createdAt: { gte: since } },
    select: { status: true, paymentStatus: true, createdAt: true, officerId: true },
  });

  const statusCounts: Record<string, number> = {};
  allApps.forEach((a: { status: string }) => { statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1; });

  const funnelData = [
    { status: "Scheduled",   count: statusCounts["APPOINTMENT_SCHEDULED"] ?? 0 },
    { status: "Arrived",     count: statusCounts["ARRIVED"] ?? 0 },
    { status: "Biometrics",  count: statusCounts["BIOMETRICS_CAPTURED"] ?? 0 },
    { status: "Processing",  count: statusCounts["NIN_PROCESSING"] ?? 0 },
    { status: "Issued",      count: statusCounts["NIN_ISSUED"] ?? 0 },
  ];

  // 2. Weekly bookings — last 6 weeks
  const sixWeeksAgo = new Date(now);
  sixWeeksAgo.setDate(now.getDate() - 42);

  const recentAppts = await db.appointment.findMany({
    where: { createdAt: { gte: sixWeeksAgo } },
    select: { createdAt: true },
  });

  const weeklyMap: Record<string, number> = {};
  recentAppts.forEach((a: { createdAt: Date }) => {
    const d = new Date(a.createdAt);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
    weeklyMap[key] = (weeklyMap[key] ?? 0) + 1;
  });

  const weeklyData = Object.entries(weeklyMap)
    .map(([week, bookings]) => ({ week, bookings }))
    .slice(-6);

  // 3. Show rate
  const apptStats = await db.appointment.groupBy({
    by: ["status"],
    _count: { status: true },
    where: { createdAt: { gte: since } },
  });

  const apptMap: Record<string, number> = {};
  apptStats.forEach((s: { status: string; _count: { status: number } }) => { apptMap[s.status] = s._count.status; });

  const showData = [
    { name: "Attended",  value: apptMap["COMPLETED"] ?? 0,   color: "#1a4a2e" },
    { name: "No-Show",   value: apptMap["NO_SHOW"] ?? 0,     color: "#ef4444" },
    { name: "Cancelled", value: apptMap["CANCELLED"] ?? 0,   color: "#9ca3af" },
  ];

  // 4. Revenue
  const verified = allApps.filter((a: { paymentStatus: string }) => a.paymentStatus === "VERIFIED").length;
  const pending  = allApps.filter((a: { paymentStatus: string }) => a.paymentStatus === "PENDING").length;
  const fee = SITE.fees.newEnrollment;

  // YTD
  const ytdApps = await db.application.count({
    where: { paymentStatus: "VERIFIED", createdAt: { gte: new Date(now.getFullYear(), 0, 1) } },
  });

  const revenue = {
    thisMonth: verified * fee,
    thisYear:  ytdApps  * fee,
    pending:   pending  * fee,
  };

  // 5. Officer performance
  const officers = await db.staffUser.findMany({
    where: { isActive: true },
    select: { id: true, firstName: true, lastName: true },
  });

  const officerStats = await Promise.all(
    officers.map(async (o: { id: string; firstName: string; lastName: string }) => {
      const processed = await db.application.count({
        where: { officerId: o.id, createdAt: { gte: since } },
      });
      const noShows = await db.application.count({
        where: { officerId: o.id, status: "NO_SHOW", createdAt: { gte: since } },
      });
      return {
        name: `${o.firstName} ${o.lastName}`,
        processed,
        noShowRate: processed > 0 ? `${Math.round((noShows / processed) * 100)}%` : "0%",
        avgDays: 2.1, // TODO: calculate from status history timestamps
      };
    })
  );

  // 6. Status breakdown for bar chart
  const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  return NextResponse.json({
    funnelData,
    weeklyData,
    showData,
    revenue,
    officerStats,
    statusBreakdown,
    totalApplications: allApps.length,
  });
}
