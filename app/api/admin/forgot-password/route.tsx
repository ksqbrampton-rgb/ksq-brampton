import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { SITE } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Always return success to prevent email enumeration
  const SUCCESS = NextResponse.json({ success: true });

  if (!body.email?.trim()) return SUCCESS;

  try {
    const staff = await db.staffUser.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });

    if (!staff || !staff.isActive) return SUCCESS;

    // Generate a signed JWT reset token (1-hour expiry)
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "dev-secret");
    const token = await new SignJWT({ sub: staff.id, email: staff.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .setIssuedAt()
      .sign(secret);

    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;

    // Send reset email
    const { default: Template } = await import("@/emails/password-reset");
    const html = await render(
      <Template name={staff.firstName} resetUrl={resetUrl} />
    );

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `info@${SITE.domain}`,
      to: staff.email,
      subject: "Reset Your Knowledge Square Staff Portal Password",
      html,
    });
  } catch (err) {
    console.error("[forgot-password]", err);
  }

  return SUCCESS;
}
