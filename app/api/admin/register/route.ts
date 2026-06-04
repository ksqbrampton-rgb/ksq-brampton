import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  let body: { firstName?: string; lastName?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { firstName, lastName, email, password } = body;

  if (!firstName?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 422 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 422 });
  }

  try {
    // Check if a SUPER_ADMIN already exists — only allow one initial registration
    const existingAdmin = await db.staffUser.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin account already exists. Please contact your administrator." },
        { status: 409 }
      );
    }

    // Check email not already taken
    const existing = await db.staffUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create SUPER_ADMIN account
    const staff = await db.staffUser.create({
      data: {
        email: email.trim().toLowerCase(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName?.trim() ?? "",
        role: "SUPER_ADMIN",
        isActive: true,
        inviteAcceptedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      name: `${staff.firstName} ${staff.lastName}`.trim(),
    });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
