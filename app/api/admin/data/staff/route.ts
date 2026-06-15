import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Active staff, used to populate officer pickers (application assignment and
// manual booking). Returns only what the dropdowns need — no credentials.
export async function GET() {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  const staff = await db.staffUser.findMany({
    where: { isActive: true },
    select: { id: true, firstName: true, lastName: true, role: true },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  return NextResponse.json({
    staff: staff.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      role: s.role,
    })),
  });
}
