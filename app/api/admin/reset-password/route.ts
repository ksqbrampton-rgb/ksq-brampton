import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { token, password } = body;

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required." }, { status: 422 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 422 });
  }

  try {
    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "dev-secret");
    const { payload } = await jwtVerify(token, secret);

    const staffId = payload.sub as string;
    if (!staffId) {
      return NextResponse.json({ error: "Invalid reset link." }, { status: 400 });
    }

    // Find staff member
    const staff = await db.staffUser.findUnique({ where: { id: staffId } });
    if (!staff || !staff.isActive) {
      return NextResponse.json({ error: "Account not found or inactive." }, { status: 404 });
    }

    // Hash new password and update. Stamp inviteAcceptedAt on first set so an
    // invited (pending) account becomes active; harmless on normal resets.
    const passwordHash = await bcrypt.hash(password, 12);
    await db.staffUser.update({
      where: { id: staffId },
      data: { passwordHash, inviteAcceptedAt: staff.inviteAcceptedAt ?? new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("expired") || message.includes("JWTExpired")) {
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 });
  }
}
