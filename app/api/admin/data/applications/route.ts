import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import { withDecryptedGuest, withDecryptedNin } from "@/lib/encryption";

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

  // Decrypt guest fields + NIN before returning. Search then runs on plaintext,
  // so partial matching on name/email is preserved.
  const decrypted = applications.map((app) =>
    withDecryptedNin({ ...app, guest: withDecryptedGuest(app.guest) })
  );

  const filtered = search
    ? decrypted.filter((app) =>
        app.guest.firstName.toLowerCase().includes(search) ||
        app.guest.lastName.toLowerCase().includes(search) ||
        app.guest.email.toLowerCase().includes(search) ||
        app.applicationRef.toLowerCase().includes(search)
      )
    : decrypted;

  return NextResponse.json({ applications: filtered });
}
