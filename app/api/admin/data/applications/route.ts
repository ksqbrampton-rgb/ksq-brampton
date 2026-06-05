import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim().toLowerCase();

  const applications = await db.application.findMany({
    where: {
      ...(status && status !== "ALL" ? { status: status as never } : {}),
    },
    include: {
      guest: true,
      appointment: true,
      officer: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Apply search filter in memory (simpler than complex Prisma where for encrypted fields)
  const filtered = search
    ? applications.filter((app: { guest: { firstName: string; lastName: string; email: string }; applicationRef: string }) =>
        app.guest.firstName.toLowerCase().includes(search) ||
        app.guest.lastName.toLowerCase().includes(search) ||
        app.guest.email.toLowerCase().includes(search) ||
        app.applicationRef.toLowerCase().includes(search)
      )
    : applications;

  return NextResponse.json({ applications: filtered });
}
