import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/adminAuth";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

const ROLES = ["OFFICER", "MANAGER", "SUPER_ADMIN"] as const;
const ROLE_LABELS: Record<string, string> = {
  OFFICER: "Enrollment Officer",
  MANAGER: "Manager",
  SUPER_ADMIN: "Super Admin",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET: active staff for officer dropdowns by default; ?all=1 returns the full
// roster (active + inactive) with the fields the Staff admin page needs.
export async function GET(request: Request) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  const all = new URL(request.url).searchParams.get("all") === "1";

  if (!all) {
    const staff = await db.staffUser.findMany({
      where: { isActive: true },
      select: { id: true, firstName: true, lastName: true, role: true },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });
    return NextResponse.json({
      staff: staff.map((s) => ({ id: s.id, name: `${s.firstName} ${s.lastName}`, role: s.role })),
    });
  }

  const staff = await db.staffUser.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  return NextResponse.json({
    staff: staff.map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`.trim(),
      email: s.email,
      role: s.role,
      isActive: s.isActive,
      pending: s.inviteAcceptedAt == null,
      lastLogin: s.lastLoginAt ? s.lastLoginAt.toISOString() : null,
      createdAt: s.createdAt.toISOString(),
    })),
  });
}

// POST: invite a staff member. Creates the StaffUser (active, pending — no usable
// password) and emails a "set your password" link that reuses the reset-password
// flow. Email failure does not fail the invite (the account still exists).
export async function POST(request: Request) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  let body: { firstName?: string; lastName?: string; email?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const role = body.role ?? "OFFICER";

  if (!firstName || !email) {
    return NextResponse.json({ error: "First name and email are required." }, { status: 422 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  }
  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return NextResponse.json({ error: "Invalid role." }, { status: 422 });
  }

  const existing = await db.staffUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "A staff account with this email already exists." }, { status: 409 });
  }

  // Unusable placeholder password — the account can't be logged into until the
  // invitee sets their own via the emailed link.
  const placeholder = await bcrypt.hash(randomBytes(24).toString("hex"), 12);

  const staff = await db.staffUser.create({
    data: {
      email,
      passwordHash: placeholder,
      firstName,
      lastName,
      role: role as "OFFICER" | "MANAGER" | "SUPER_ADMIN",
      isActive: true,
      inviteAcceptedAt: null,
    },
  });

  // Mint a 7-day set-password token, identical mechanism to forgot-password.
  let emailSent = false;
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "dev-secret");
    const token = await new SignJWT({ sub: staff.id, email: staff.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(secret);

    const inviteUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;

    const { default: StaffInviteEmail } = await import("@/emails/staff-invite");
    const html = await render(
      StaffInviteEmail({ name: firstName, role: ROLE_LABELS[role] ?? role, inviteUrl })
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `info@${SITE.domain}`,
      to: staff.email,
      subject: "You're Invited to the Knowledge Square Staff Portal",
      html,
    });
    emailSent = true;
  } catch (err) {
    console.error("[staff/invite] email failed:", err);
  }

  return NextResponse.json({
    staff: {
      id: staff.id,
      name: `${staff.firstName} ${staff.lastName}`.trim(),
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
      pending: true,
      lastLogin: null,
      createdAt: staff.createdAt.toISOString(),
    },
    emailSent,
  });
}

// PATCH: activate / deactivate a staff member.
export async function PATCH(request: Request) {
  const check = await requireAdminSession();
  if (!check.ok) return check.response;

  let body: { id?: string; isActive?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.id || typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "Staff id and isActive are required." }, { status: 422 });
  }

  await db.staffUser.update({ where: { id: body.id }, data: { isActive: body.isActive } });
  return NextResponse.json({ success: true });
}
